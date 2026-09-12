import { NextResponse } from "next/server";
import { searchAll } from "@/lib/search";
import { searchQuerySchema } from "@/lib/validation/schemas";

/**
 * Search endpoint.
 *
 * Deliberately thin: it validates the query, delegates to `searchAll`, and returns the
 * grouped payload the autocomplete already knows how to render. Keeping the HTTP edge
 * this shallow means replacing the search backend is a change to `lib/search` alone —
 * this file does not need to know whether the engine is local or Meilisearch.
 */

export const runtime = "nodejs";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = searchQuerySchema.safeParse({ q: searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return NextResponse.json(
      { message: "That search query is not valid." },
      { status: 400 },
    );
  }

  const query = parsed.data.q;

  // An empty query is a legitimate request: it returns the popular-category
  // suggestions the autocomplete shows before the reader has typed anything.
  const results = searchAll(query);

  return NextResponse.json(results, {
    // Search results are derived from a static catalogue, so they are safe to cache
    // briefly at the edge. Short max-age keeps a freshly seeded catalogue from going
    // stale for long.
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
