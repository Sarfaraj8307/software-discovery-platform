import * as React from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { cn, buildQuery } from "@/lib/utils";

/* ==========================================================================
   BREADCRUMB
   Semantic nav > ol. JSON-LD BreadcrumbList is emitted separately per route.
   ========================================================================= */

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="truncate rounded-[4px] transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn("truncate", last && "font-medium text-foreground")}
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <ChevronRight className="size-3 shrink-0 text-faint" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ==========================================================================
   PAGINATION
   Server-rendered links only. State lives in the URL, so pages are shareable,
   crawlable and survive a refresh — and no client hook is needed.
   ========================================================================= */

function pageRange(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("gap");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("gap");
  pages.push(total);
  return pages;
}

export function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
  className,
}: {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  page: number;
  totalPages: number;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) =>
    `${basePath}${buildQuery(searchParams, { page: target === 1 ? null : target })}`;

  const items = pageRange(page, totalPages);

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-between gap-4", className)}>
      <p className="text-13 text-muted-foreground tnum">
        Page <span className="font-medium text-foreground">{page}</span> of {totalPages}
      </p>

      <ul className="flex items-center gap-1">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor(page - 1)}
              rel="prev"
              aria-label="Previous page"
              className="inline-flex size-9 items-center justify-center rounded-control border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex size-9 items-center justify-center rounded-control border border-border text-faint opacity-50"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </span>
          )}
        </li>

        {items.map((item, i) =>
          item === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true">
              <span className="inline-flex size-9 items-center justify-center text-faint">
                <MoreHorizontal className="size-4" />
              </span>
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-control border text-13 tnum transition-colors",
                  item === page
                    ? "border-primary bg-primary font-medium text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link
              href={hrefFor(page + 1)}
              rel="next"
              aria-label="Next page"
              className="inline-flex size-9 items-center justify-center rounded-control border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex size-9 items-center justify-center rounded-control border border-border text-faint opacity-50"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
