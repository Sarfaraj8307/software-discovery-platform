import { NextResponse } from "next/server";
import { decideListingEdit, listListingEdits } from "@/lib/data/repository";
import { listingEditDecisionSchema } from "@/lib/validation/schemas";

/**
 * Apply or discard a proposed listing change.
 *
 * Kept separate from /api/moderation because it is a different kind of thing: that route
 * decides the fate of a *record*, this one decides whether a proposed *edit* lands. Merging
 * them would have meant overloading `action` with values that mean different things for
 * different target types.
 *
 * Only PENDING proposals can be decided, and deciding twice returns 409 — otherwise a
 * double-click would silently apply a discarded edit.
 */

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = listingEditDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "That is not a valid decision." },
      { status: 422 },
    );
  }

  const { id, decision } = parsed.data;

  // A second decision on the same id means it is no longer pending — say so explicitly
  // rather than returning 404, which would suggest the id never existed.
  const decided = decideListingEdit(id, decision === "APPLY");
  if (decided === null) {
    const known = listListingEdits(500).some((e) => e.id === id);
    return NextResponse.json(
      {
        message: known
          ? "That proposal has already been decided."
          : "No proposal with that id.",
      },
      { status: known ? 409 : 404 },
    );
  }

  return NextResponse.json(
    { id: decided.id, status: decided.status, decidedAt: decided.decidedAt },
    { status: 200 },
  );
}
