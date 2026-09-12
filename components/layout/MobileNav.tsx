"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { formatCount } from "@/lib/utils";
import type { Category } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/overlay";
import { CategoryIcon } from "@/components/domain/icon";
import type { PillarWithChildren } from "./MegaMenu";

/**
 * Mobile navigation. A single sheet rather than a multi-level accordion: on a phone,
 * two levels of category depth is already the limit before the menu stops being
 * scannable, so subcategories are presented flat under each pillar.
 */
export function MobileNav({
  pillars,
  categories,
}: {
  pillars: PillarWithChildren[];
  categories: Category[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent title="Browse" description="Categories and tools" side="left" className="w-[88vw]">
        <nav aria-label="Mobile navigation" className="p-4">
          <SheetClose asChild>
            <Link
              href="/search"
              className="flex items-center justify-between rounded-control border border-border bg-card px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Search all software
            </Link>
          </SheetClose>

          <ul className="mt-4 space-y-0.5">
            {pillars.map((pillar) => (
              <li key={pillar.slug}>
                <SheetClose asChild>
                  <Link
                    href={`/categories/${pillar.slug}`}
                    className="flex items-center gap-2.5 rounded-control px-2.5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <CategoryIcon name={pillar.icon} className="size-4 text-primary" />
                    <span className="truncate">{pillar.name}</span>
                    <span className="ml-auto text-2xs text-faint tnum">
                      {formatCount(pillar.productCount)}
                    </span>
                  </Link>
                </SheetClose>

                {pillar.children.length > 0 && (
                  <ul className="mb-1 ml-6 border-l border-border pl-3">
                    {pillar.children.map((sub) => (
                      <li key={sub.slug}>
                        <SheetClose asChild>
                          <Link
                            href={`/categories/${sub.slug}`}
                            className="block rounded-[5px] px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {sub.name}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-border pt-4">
            <SheetClose asChild>
              <Link
                href="/categories"
                className="block rounded-control px-2.5 py-2 text-13 font-medium text-primary transition-colors hover:bg-muted"
              >
                Browse all {formatCount(categories.length)} categories →
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/compare"
                className="block rounded-control px-2.5 py-2 text-13 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Comparison hub
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/methodology"
                className="block rounded-control px-2.5 py-2 text-13 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                How we score
              </Link>
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
