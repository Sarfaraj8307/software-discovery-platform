import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { voteHelpful } from "@/lib/data/repository";

/**
 * Toggle the current viewer's "Helpful" vote on a review.
 *
 * There is no auth, so the route identifies voters via a single HttpOnly cookie
 * `helpful_voter` (one UUID per browser, one year, sameSite=lax). The cookie is
 * created on the first successful POST and reused on every subsequent call. The
 * eventual session/identity system (P0.2) replaces this cookie with the session
 * principal — the toggle semantics and the storage shape do not change.
 *
 * The seeded `review.helpfulCount` is the editorial baseline and stays untouched.
 * The display count is `baseline + votes.size` (the new effective state). The
 * response carries the post-toggle count so the client renders one fewer round
 * trip than the optimistic update it would otherwise need.
 *
 * 404 if the review does not exist. 405 / 400 if the request is malformed (POST
 * only, no body).
 */

export const runtime = "nodejs";

const COOKIE_NAME = "helpful_voter";
const COOKIE_MAX_AGE_S = 60 * 60 * 24 * 365; // one year

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Read or mint the voter id. Cookies in Next.js route handlers are async in
  // the current SDK; the `await` is required.
  const jar = await cookies();
  let voterId = jar.get(COOKIE_NAME)?.value;
  const isNewVoter = !voterId;
  if (!voterId) voterId = randomUUID();

  const result = voteHelpful(id, voterId);
  if (!result) {
    return NextResponse.json({ message: "No review with that id." }, { status: 404 });
  }

  const res = NextResponse.json(
    {
      reviewId: id,
      helpfulCount: result.helpfulCount,
      hasVoted: result.hasVoted,
    },
    { status: 200 },
  );

  // Persist the freshly-minted id so the next call from this browser is recognised.
  if (isNewVoter) {
    res.cookies.set(COOKIE_NAME, voterId, {
      httpOnly: true,
      sameSite: "lax",
      // `secure: true` would break plain http://localhost during local dev; tie it to
      // the request scheme so production https gets the flag and localhost does not.
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE_S,
    });
  }
  return res;
}