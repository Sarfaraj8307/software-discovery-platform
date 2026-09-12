"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CornerDownLeft, Loader2, Search } from "lucide-react";
import { cn, formatCompact } from "@/lib/utils";
import type { SearchResults } from "@/lib/data/types";
import { CategoryIcon } from "@/components/domain/icon";
import { ProductLogo } from "@/components/ui/avatar";
import { StarRating } from "@/components/domain/atoms";

/**
 * Global search with grouped results.
 *
 * Search is the spine of this product — every page has it, and category navigation is
 * secondary. Keyboard-first: ⌘K/Ctrl+K focuses from anywhere, ↑↓ move, Enter opens,
 * Esc closes. Implemented as a proper ARIA combobox rather than a styled div so screen
 * readers announce the result count and the active option.
 */

interface FlatOption {
  id: string;
  href: string;
  label: string;
}

const EMPTY: SearchResults = {
  query: "",
  products: [],
  categories: [],
  comparisons: [],
  total: 0,
  suggestions: [],
};

export function SearchAutocomplete({
  variant = "header",
  className,
  placeholder,
  autoFocusShortcut = true,
  initialQuery = "",
}: {
  variant?: "header" | "hero";
  className?: string;
  placeholder?: string;
  autoFocusShortcut?: boolean;
  /** Seed the field, e.g. with the active `?q=` on the results page. */
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const [fetched, setFetched] = React.useState<SearchResults>(EMPTY);
  const [open, setOpen] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  /* A query shorter than 2 characters has nothing to fetch. Deriving that here
     rather than setState-ing it inside the effect avoids a cascading render. */
  const trimmedQuery = query.trim();
  const tooShort = trimmedQuery.length < 2;
  const results = tooShort ? EMPTY : fetched;
  const loading = !tooShort && isFetching;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = React.useId();

  const isHero = variant === "hero";

  /* ------------------------------------------------------------- shortcuts */
  React.useEffect(() => {
    if (!autoFocusShortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [autoFocusShortcut]);

  /* -------------------------------------------------- debounced fetching */
  React.useEffect(() => {
    if (trimmedQuery.length < 2) return; // render already derives the empty state

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      // Set inside the debounce callback, not the effect body: the request may
      // never happen, and a synchronous setState here would cascade a render.
      setIsFetching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search request failed");
        const data = (await response.json()) as SearchResults;
        setFetched(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setFetched(EMPTY);
      } finally {
        if (!controller.signal.aborted) setIsFetching(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  /* -------------------------------------------------------- outside click */
  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  /* ----------------------------------------------- flatten for keyboard nav */
  const flat = React.useMemo<FlatOption[]>(() => {
    const options: FlatOption[] = [];
    for (const p of results.products) {
      options.push({ id: `p-${p.slug}`, href: `/product/${p.slug}`, label: p.name });
    }
    for (const c of results.categories) {
      options.push({ id: `c-${c.slug}`, href: `/categories/${c.slug}`, label: c.name });
    }
    for (const c of results.comparisons) {
      options.push({ id: `x-${c.slug}`, href: `/compare/${c.slug}`, label: c.title });
    }
    return options;
  }, [results]);

  const showPanel = open && query.trim().length >= 2;
  const hasResults = results.total > 0;

  const go = (href: string) => {
    setOpen(false);
    setActiveIndex(-1);
    router.push(href);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (activeIndex >= 0 && flat[activeIndex]) {
      go(flat[activeIndex].href);
      return;
    }
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!showPanel || flat.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? flat.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const option = flat[activeIndex];
      if (option) go(option.href);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form onSubmit={onSubmit} role="search">
        <div className="relative">
          <Search
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint",
              isHero ? "left-4 size-5" : "left-3 size-4",
            )}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? flat[activeIndex]?.id : undefined}
            aria-label="Search products, categories and comparisons"
            autoComplete="off"
            value={query}
            placeholder={
              placeholder ??
              (isHero
                ? "Search products, categories or comparisons…"
                : "Search software…")
            }
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className={cn(
              "w-full rounded-control border border-input bg-card text-foreground transition-colors placeholder:text-faint focus:border-primary",
              isHero
                ? "h-14 pl-12 pr-24 text-base shadow-sticky"
                : "h-9 pl-9 pr-14 text-sm",
            )}
          />

          {isHero ? (
            <button
              type="submit"
              className="absolute right-2 top-1/2 inline-flex h-10 -translate-y-1/2 items-center gap-1.5 rounded-control bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Search
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-[4px] border border-border bg-subtle px-1.5 py-0.5 font-mono text-2xs text-muted-foreground lg:inline-flex">
              ⌘K
            </kbd>
          )}

          {loading && (
            <Loader2
              className={cn(
                "absolute top-1/2 size-3.5 -translate-y-1/2 animate-spin text-faint",
                isHero ? "right-32" : "right-10",
              )}
              aria-hidden="true"
            />
          )}
        </div>
      </form>

      {/* --------------------------------------------------------- results */}
      {showPanel && (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[70vh] overflow-y-auto overscroll-contain rounded-card border border-border bg-popover p-1.5 shadow-overlay">
          {!hasResults && !loading && (
            <div className="p-3">
              <p className="text-13 font-medium">No exact match for “{query.trim()}”</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Browse a category instead:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {results.suggestions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/categories/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    <CategoryIcon name="LayoutGrid" className="size-3 text-muted-foreground" />
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {hasResults && (
            <ul id={listboxId} role="listbox" aria-label="Search results">
              {results.products.length > 0 && (
                <li role="presentation">
                  <GroupLabel>Products</GroupLabel>
                  <ul role="presentation">
                    {results.products.map((p, i) => {
                      const option = flat[i];
                      if (!option) return null;
                      return (
                        <ResultRow
                          key={p.slug}
                          id={option.id}
                          href={option.href}
                          active={activeIndex === i}
                          onHover={() => setActiveIndex(i)}
                          onSelect={() => go(option.href)}
                          leading={<ProductLogo name={p.name} domain={p.logoDomain} size="sm" />}
                          title={p.name}
                          subtitle={p.tagline}
                          trailing={
                            <span className="inline-flex shrink-0 items-center gap-1">
                              <StarRating rating={p.ratingAvg} size={11} />
                              <span className="text-2xs text-muted-foreground tnum">
                                {p.ratingAvg.toFixed(1)}
                              </span>
                            </span>
                          }
                          meta={`${p.categoryName} · ${formatCompact(p.ratingCount)} reviews`}
                        />
                      );
                    })}
                  </ul>
                </li>
              )}

              {results.categories.length > 0 && (
                <li role="presentation">
                  <GroupLabel>Categories</GroupLabel>
                  <ul role="presentation">
                    {results.categories.map((c, i) => {
                      const index = results.products.length + i;
                      const option = flat[index];
                      if (!option) return null;
                      return (
                        <ResultRow
                          key={c.slug}
                          id={option.id}
                          href={option.href}
                          active={activeIndex === index}
                          onHover={() => setActiveIndex(index)}
                          onSelect={() => go(option.href)}
                          leading={
                            <span className="inline-flex size-8 items-center justify-center rounded-[6px] border border-border bg-subtle text-muted-foreground">
                              <CategoryIcon name={c.icon} className="size-4" />
                            </span>
                          }
                          title={c.name}
                          meta={`${formatCompact(c.productCount)} products`}
                        />
                      );
                    })}
                  </ul>
                </li>
              )}

              {results.comparisons.length > 0 && (
                <li role="presentation">
                  <GroupLabel>Comparisons</GroupLabel>
                  <ul role="presentation">
                    {results.comparisons.map((c, i) => {
                      const index = results.products.length + results.categories.length + i;
                      const option = flat[index];
                      if (!option) return null;
                      return (
                        <ResultRow
                          key={c.slug}
                          id={option.id}
                          href={option.href}
                          active={activeIndex === index}
                          onHover={() => setActiveIndex(index)}
                          onSelect={() => go(option.href)}
                          leading={
                            <span className="inline-flex size-8 items-center justify-center rounded-[6px] border border-border bg-subtle font-mono text-2xs font-medium text-muted-foreground">
                              VS
                            </span>
                          }
                          title={c.title}
                          meta={`${formatCompact(c.views)} compared this month`}
                        />
                      );
                    })}
                  </ul>
                </li>
              )}

              <li role="presentation" className="border-t border-border p-1 pt-1.5">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                  className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-2 text-13 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <CornerDownLeft className="size-3.5" aria-hidden="true" />
                  See all results for “{query.trim()}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-2.5 pb-1 pt-2 label-caps text-muted-foreground">{children}</p>;
}

function ResultRow({
  id,
  href,
  title,
  subtitle,
  meta,
  leading,
  trailing,
  active,
  onHover,
  onSelect,
}: {
  id: string;
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  leading: React.ReactNode;
  trailing?: React.ReactNode;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <li role="option" id={id} aria-selected={active}>
      <Link
        href={href}
        onMouseEnter={onHover}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onSelect}
        className={cn(
          "flex items-center gap-2.5 rounded-[5px] px-2 py-1.5 transition-colors",
          active && "bg-muted",
        )}
      >
        {leading}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-13 font-medium">{title}</span>
          {subtitle && (
            <span className="block truncate text-2xs text-muted-foreground">{subtitle}</span>
          )}
          {meta && <span className="block truncate text-2xs text-faint">{meta}</span>}
        </span>
        {trailing}
      </Link>
    </li>
  );
}
