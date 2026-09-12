"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { cn, formatCount, formatRating } from "@/lib/utils";
import type { SearchHitProduct, SearchResults } from "@/lib/data/types";
import { ProductLogo } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { COMPARE_LIMIT, compareHref, useCompare } from "./CompareProvider";

/**
 * The comparison hub's primary control: choose two to four products and go.
 *
 * Selection lives in the shared comparison bucket rather than in this component, so
 * anything added here is the same selection the reader sees in the sticky bar and
 * on the category pages. The picker is a view onto that state, not a second copy
 * of it.
 */
const EMPTY_HITS: SearchHitProduct[] = [];

export function ComparePicker() {
  const { items, has, toggle, remove, clear } = useCompare();

  const [query, setQuery] = React.useState("");
  const [fetchedHits, setFetchedHits] = React.useState<SearchHitProduct[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const full = items.length >= COMPARE_LIMIT;

  /* A query shorter than 2 characters has nothing to fetch. Deriving that here
     rather than setState-ing it inside the effect avoids a cascading render. */
  const trimmedQuery = query.trim();
  const tooShort = trimmedQuery.length < 2;
  const hits = tooShort ? EMPTY_HITS : fetchedHits;
  const loading = !tooShort && isFetching;
  /* `!full` matters: a full bucket disables the input, and a disabled combobox
     that still reports aria-expanded="true" over a listbox of disabled options
     is a state no assistive tech can resolve. Reachable when a second tab fills
     the bucket while this panel is open. Deriving it keeps the panel shut. */
  const panelOpen = open && !tooShort && hits.length > 0 && !full;
  const productLabel = items.length === 1 ? "product" : "products";

  /* ------------------------------------------------------------ fetching */
  React.useEffect(() => {
    if (trimmedQuery.length < 2) return; // render already derives the empty state

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      // Set inside the debounce callback, not the effect body: the request may
      // never happen, and a synchronous setState here would cascade a render.
      setIsFetching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search request failed");

        const data = (await response.json()) as SearchResults;
        setFetchedHits(data.products.slice(0, 8));
        setOpen(true);
      } catch (error) {
        // An aborted request is the normal result of typing; only real failures reset.
        if ((error as Error).name !== "AbortError") setFetchedHits(EMPTY_HITS);
      } finally {
        if (!controller.signal.aborted) setIsFetching(false);
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  /* ------------------------------------------------------- click outside */
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const add = (hit: SearchHitProduct) => {
    toggle({
      slug: hit.slug,
      name: hit.name,
      logoDomain: hit.logoDomain,
      categoryName: hit.categoryName,
    });
    setQuery(""); // also clears the derived `hits`
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-card">
      <h2 className="text-base font-semibold tracking-[-0.01em]">Build your own comparison</h2>
      <p className="mt-1 text-13 text-muted-foreground">
        Pick up to {COMPARE_LIMIT} products. You can also add them from any category or product
        page.
      </p>

      {/* ------------------------------------------------------- search box */}
      <div ref={containerRef} className="relative mt-4">
        <label htmlFor="compare-picker-input" className="sr-only">
          Search for a product to compare
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="compare-picker-input"
            type="text"
            role="combobox"
            aria-expanded={panelOpen}
            aria-controls="compare-picker-listbox"
            aria-autocomplete="list"
            autoComplete="off"
            disabled={full}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => hits.length > 0 && setOpen(true)}
            placeholder={full ? "Comparison is full — remove a product to add another" : "Search products…"}
            className={cn(
              "h-11 w-full rounded-control border border-border bg-background pl-9 pr-9 text-sm",
              "placeholder:text-muted-foreground",
              "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
            )}
          />
          {loading && (
            <Loader2
              className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>

        {panelOpen && (
          <ul
            id="compare-picker-listbox"
            role="listbox"
            aria-label="Search results"
            className="absolute z-30 mt-1.5 max-h-80 w-full overflow-y-auto rounded-card border border-border-strong bg-card p-1 shadow-overlay"
          >
            {hits.map((hit) => {
              const already = has(hit.slug);
              return (
                <li key={hit.slug} role="option" aria-selected={already}>
                  <button
                    type="button"
                    disabled={!already && full}
                    onClick={() => add(hit)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-control px-2.5 py-2 text-left transition-colors",
                      "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    <ProductLogo name={hit.name} domain={hit.logoDomain} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-13 font-medium">{hit.name}</span>
                      <span className="block truncate text-2xs text-muted-foreground">
                        {hit.categoryName} · {formatRating(hit.ratingAvg)} ({formatCount(hit.ratingCount)})
                      </span>
                    </span>
                    {already && <span className="shrink-0 text-2xs font-medium text-primary">Added</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ------------------------------------------------------ selection */}
      {items.length === 0 ? (
        <p className="mt-4 rounded-control border border-dashed border-border-strong bg-subtle px-3 py-6 text-center text-13 text-muted-foreground">
          No products selected yet. Search above to begin.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex items-center gap-3 rounded-control border border-border bg-subtle px-2.5 py-2"
            >
              <ProductLogo name={item.name} domain={item.logoDomain} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-13 font-medium">{item.name}</span>
                <span className="block truncate text-2xs text-muted-foreground">
                  {item.categoryName}
                </span>
              </span>
              <button
                type="button"
                onClick={() => remove(item.slug)}
                aria-label={`Remove ${item.name}`}
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-[5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------------------------------------------------- actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button disabled={items.length < 2} asChild={items.length >= 2} aria-disabled={items.length < 2}>
          {items.length >= 2 ? (
            <Link href={compareHref(items)}>
              Compare {items.length} {productLabel}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2">
              Compare {items.length} {productLabel}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          )}
        </Button>

        {items.length > 0 && (
          <Button variant="ghost" onClick={clear}>
            Clear all
          </Button>
        )}

        {items.length === 1 && (
          <span className="text-13 text-muted-foreground">Add one more to compare</span>
        )}
      </div>
    </div>
  );
}
