import { NextResponse } from "next/server";
import { respondToReview } from "@/lib/data/repository";
import { vendorResponseSchema } from "@/lib/validation/schemas";
import { DEMO_VENDOR_SLUG } from "@/lib/portals";

/**
 * Publish a vendor's reply to a review.
 *
 * Scope is enforced server-side: a vendor may only reply to reviews on its own products,
 * even though there is no session to derive that from yet — the portal is pinned to
 * DEMO_VENDOR_SLUG (see lib/portals.ts). Returns 403 rather than 404 for a review belonging
 * to another vendor, so a caller cannot use the status code to probe which review ids exist.
 *
 * The review itself is never modified — only `vendorResponse` is written. Vendors cannot
 * edit or delete a review; disputes go to moderation. That boundary is deliberate and is
 * stated on the vendor reviews page.
 */

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = vendorResponseSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "That reply is not valid.";
    return NextResponse.json({ message: first }, { status: 422 });
  }

  const result = respondToReview(id, parsed.data.body, DEMO_VENDOR_SLUG);

  if (!result.ok) {
    if (result.reason === "WRONG_VENDOR") {
      return NextResponse.json(
        { message: "That review is not on one of your products." },
        { status: 403 },
      );
    }
    return NextResponse.json({ message: "No review with that id." }, { status: 404 });
  }

  return NextResponse.json(
    {
      id: result.review.id,
      respondedAt: result.review.vendorResponse?.respondedAt ?? null,
    },
    { status: 201 },
  );
}
