"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/lib/data/types";
import { cn, formatCount } from "@/lib/utils";
import { CategoryIcon } from "@/components/domain/icon";

/** A pillar category with its subcategories attached at render time. */
export type PillarWithChildren = Category & { children: Category[] };

/**
 * Categories mega-menu.
 *
 * Opens on hover for pointer users and on click/Enter for keyboard users, closes on
 * Escape and on focus leaving the panel. Hover-only menus are unusable by keyboard,
 * which is why both paths exist.
 */
export function MegaMenu({ pillars }: { pillars: PillarWithChildren[] }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<number | undefined>(undefined);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelClose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:block"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-control px-3 text-sm font-medium transition-colors",
          open ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        Categories
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(1000px,calc(100vw-3rem))] rounded-card border border-border bg-popover p-5 shadow-overlay"
          onMouseEnter={cancelClose}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 xl:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.slug} className="min-w-0">
                <Link
                  href={`/categories/${pillar.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[5px] px-1.5 py-1 text-13 font-semibold transition-colors hover:bg-muted"
                >
                  <CategoryIcon name={pillar.icon} className="size-4 text-primary" />
                  <span className="truncate">{pillar.name}</span>
                  <span className="ml-auto shrink-0 text-2xs font-normal text-faint tnum">
                    {formatCount(pillar.productCount)}
                  </span>
                </Link>
                <ul className="mt-1 space-y-0.5 pl-1.5">
                  {pillar.children?.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/categories/${sub.slug}`}
                        onClick={() => setOpen(false)}
                        className="block truncate rounded-[5px] px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
            <Link
              href="/categories"
              onClick={() => setOpen(false)}
              className="text-13 font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Browse all categories →
            </Link>
            <p className="text-2xs text-faint">
              {formatCount(pillars.reduce((sum, p) => sum + p.productCount, 0))} products indexed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
