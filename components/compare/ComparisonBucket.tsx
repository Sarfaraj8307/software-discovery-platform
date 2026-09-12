"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Scale, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductLogo } from "@/components/ui/avatar";
import { COMPARE_LIMIT, compareHref, useCompare } from "./CompareProvider";

/**
 * Persistent comparison bucket.
 *
 * Sticky at the bottom of the viewport so a comparison is never more than one click
 * away — the core "comparison-first" principle. Hidden on compare routes themselves,
 * where it would be redundant.
 */
export function ComparisonBucket() {
  const { items, remove, clear } = useCompare();
  const pathname = usePathname();

  if (items.length === 0) return null;
  if (pathname?.startsWith("/compare")) return null;

  const ready = items.length >= 2;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 print:hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6">
        <div
          role="region"
          aria-label="Comparison selection"
          aria-live="polite"
          className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-card border border-border-strong bg-card p-3 shadow-overlay"
        >
          <span className="inline-flex items-center gap-1.5 text-13 font-medium">
            <Scale className="size-4 text-primary" aria-hidden="true" />
            Compare
            <span className="tnum text-muted-foreground">
              {items.length}/{COMPARE_LIMIT}
            </span>
          </span>

          <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {items.map((item) => (
              <li key={item.slug}>
                <span className="inline-flex max-w-56 items-center gap-2 rounded-control border border-border bg-subtle py-1 pl-1.5 pr-1">
                  <ProductLogo name={item.name} domain={item.logoDomain} size="xs" />
                  <span className="truncate text-xs font-medium">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    aria-label={`Remove ${item.name} from comparison`}
                    className="inline-flex size-5 shrink-0 items-center justify-center rounded-[4px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}

            {items.length === 1 && (
              <li className="text-xs text-muted-foreground">
                Add one more product to compare
              </li>
            )}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clear}>
              Clear
            </Button>
            <Button
              size="sm"
              disabled={!ready}
              asChild={ready}
              aria-disabled={!ready}
              title={ready ? undefined : "Select at least two products"}
            >
              {ready ? (
                <Link href={compareHref(items)}>
                  Compare {items.length}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Compare {items.length}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compact count used in the header. */
export function CompareCountBadge({ className }: { className?: string }) {
  const { items } = useCompare();
  if (items.length === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex min-w-4 items-center justify-center rounded-pill bg-primary px-1 text-2xs font-semibold text-primary-foreground tnum",
        className,
      )}
    >
      {items.length}
    </span>
  );
}
