import { NextResponse } from "next/server";
import { updateLeadOwner, updateLeadStatus } from "@/lib/data/repository";
import { leadUpdateSchema } from "@/lib/validation/schemas";

/**
 * PATCH one enquiry — supports updating `status`, `ownerId`, or both in one call. The
 * NEW -> CONTACTED -> QUALIFIED -> CLOSED / SPAM status path and the demo-owner
 * assignment roster share a route so a single round-trip can both move a lead forward
 * and route it to a person, which is how an operator actually works a queue.
 *
 * Only `status` and `ownerId` are writable. Everything else on a lead arrives from the
 * public form and is not something an operator should be able to rewrite through this
 * route, so a wider "update the whole object" endpoint was deliberately not built. A
 * PATCH that supplies neither field is a 422 — a green button that does nothing is worse
 * than no button.
 *
 * As with moderation, this build has no authentication: the route does not check a
 * session and does not record who made the change. That is stated on the page rather
 * than papered over with a placeholder user.
 */

export const runtime = "nodejs";

export async function PATCH(
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

  const parsed = leadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "That is not a valid enquiry update." },
      { status: 422 },
    );
  }

  // Apply each supplied field. A missing field on the lead (404) aborts before any
  // partial write is returned, so a half-applied update never reaches the response.
  let lead = null;
  if (parsed.data.status !== undefined) {
    lead = updateLeadStatus(id, parsed.data.status);
    if (!lead) {
      return NextResponse.json({ message: "No enquiry with that id." }, { status: 404 });
    }
  }
  if (parsed.data.ownerId !== undefined) {
    lead = updateLeadOwner(id, parsed.data.ownerId);
    if (!lead) {
      return NextResponse.json({ message: "No enquiry with that id." }, { status: 404 });
    }
  }

  // The refine() guarantees one of the two was supplied, so lead cannot still be null
  // here. The assertion is for the type checker.
  if (!lead) {
    return NextResponse.json(
      { message: "No enquiry fields were updated." },
      { status: 422 },
    );
  }

  return NextResponse.json(
    {
      id: lead.id,
      status: lead.status,
      ownerId: lead.ownerId,
      updatedAt: lead.updatedAt,
    },
    { status: 200 },
  );
}