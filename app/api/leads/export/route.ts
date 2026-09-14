import { NextResponse } from "next/server";
import { listLeads } from "@/lib/data/repository";
import { DEMO_VENDOR_SLUG } from "@/lib/portals";
import type { Lead } from "@/lib/data/types";

/**
 * Lead export — a server-only CSV download of the vendor's captured enquiries.
 *
 * ~4 KB of server code, zero client JS. Scoping follows the same contract the rest of
 * the vendor surface already uses: there is no auth yet, so the vendor is `DEMO_VENDOR_SLUG`.
 * A caller that names a different vendor gets 403 — exactly the cross-vendor refusal the
 * other vendor endpoints return, so the status code cannot be used to probe which slugs exist.
 *
 * NOTE: this exports the demo vendor's leads. In this single-vendor build every product
 * belongs to `DEMO_VENDOR_SLUG`, so `listLeads()` is already the right set. Real per-vendor
 * scoping (filter leads by the products a vendor actually owns) lands with P0.2.
 */

export const runtime = "nodejs";

// Order matters only for human readers; the header row is emitted from this list.
const COLUMNS: (keyof Lead)[] = [
  "id",
  "type",
  "status",
  "name",
  "email",
  "company",
  "phone",
  "productSlug",
  "productName",
  "categorySlug",
  "intent",
  "sourceLocation",
  "message",
  "createdAt",
  "updatedAt",
];

/** RFC 4180: wrap in quotes, double internal quotes. Handles commas, newlines, quotes. */
function cell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  return '"' + String(value).replace(/"/g, '""') + '"';
}

function toCsv(leads: Lead[]): string {
  const head = COLUMNS.map((c) => cell(c)).join(",");
  const rows = leads.map((lead) => COLUMNS.map((c) => cell(lead[c])).join(","));
  return [head, ...rows].join("\r\n");
}

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("companySlug");
  if (requested && requested !== DEMO_VENDOR_SLUG) {
    return NextResponse.json(
      { message: "Not permitted for this vendor." },
      { status: 403 },
    );
  }

  const csv = toCsv(listLeads());

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${DEMO_VENDOR_SLUG}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
