import { NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/data/repository";
import { leadStatusSchema } from "@/lib/validation/schemas";

/**
 * PATCH one enquiry's status — the NEW -> CONTACTED -> QUALIFIED -> CLOSED / SPAM path
 * that both portals' filter tabs are built around.
 *
 * Only `status` is writable. Everything else on a lead arrives from the public form and
 * is not something an operator should be able to rewrite through this route, so a wider
 * "update the whole object" endpoint was deliberately not built.
 *
 * As with moderation, this build has no authentication: the route does not check a session
 * and does not record who made the change. That is stated on the page rather than papered
 * over with a placeholder user.
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

  const parsed = leadStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "That is not a valid enquiry status." },
      { status: 422 },
    );
  }

  const lead = updateLeadStatus(id, parsed.data.status);
  if (!lead) {
    return NextResponse.json({ message: "No enquiry with that id." }, { status: 404 });
  }

  return NextResponse.json(
    { id: lead.id, status: lead.status, updatedAt: lead.updatedAt },
    { status: 200 },
  );
}
