import { NextResponse } from "next/server";
import { proposeListingEdit } from "@/lib/data/repository";
import { listingEditSchema } from "@/lib/validation/schemas";
import { DEMO_VENDOR_SLUG } from "@/lib/portals";

/**
 * A vendor proposes new listing copy.
 *
 * This QUEUES the change; it does not apply it. The vendor portal tells vendors that edits
 * are reviewed before they go live, so applying here would make that sentence false — and
 * would also let a vendor change a live listing with no record of what it used to say.
 *
 * Scope is enforced server-side: a vendor may only propose edits to its own products.
 */

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = listingEditSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "That listing copy is not valid.";
    return NextResponse.json({ message: first }, { status: 422 });
  }

  const result = proposeListingEdit(
    slug,
    {
      tagline: parsed.data.tagline,
      shortDescription: parsed.data.shortDescription,
    },
    DEMO_VENDOR_SLUG,
  );

  if (result === "WRONG_VENDOR") {
    return NextResponse.json(
      { message: "That listing is not one of yours." },
      { status: 403 },
    );
  }
  if (result === "NOT_FOUND") {
    return NextResponse.json({ message: "No listing with that slug." }, { status: 404 });
  }

  return NextResponse.json(
    { id: result.id, status: result.status, proposedAt: result.proposedAt },
    { status: 201 },
  );
}
