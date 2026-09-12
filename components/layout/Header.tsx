"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandMark";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { CompareCountBadge } from "@/components/compare/ComparisonBucket";
import { MegaMenu, type PillarWithChildren } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import type { Category } from "@/lib/data/types";

/**
 * Site header. Sticky, 56px, hairline border, blurred backdrop — the surface stays
 * present without competing with content. Search occupies the widest slot because
 * search is the spine of the product, not a secondary utility.
 *
 * Two refinements on top of the base sticky bar:
 *  - scroll-aware elevation: flat at the top, gains a quiet shadow once the page
 *    has scrolled, so it reads as a surface holding content;
 *  - active indication: the primary nav links reflect the current route via
 *    usePathname, so users always know where they are.
 */
export function Header({
  pillars,
  categories,
}: {
  pillars: PillarWithChildren[];
  categories: Category[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    [
      "inline-flex h-9 items-center gap-1.5 rounded-control px-3 text-sm transition-colors",
      isActive(href)
        ? "bg-muted font-medium text-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    ].join(" ");

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md print:hidden",
        "transition-shadow duration-200",
        scrolled ? "shadow-sticky" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <MobileNav pillars={pillars} categories={categories} />

        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-[5px] py-1"
          aria-label="Software Discovery — home"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <BrandLogo wordmarkClassName="hidden sm:inline" />
        </Link>

        <MegaMenu pillars={pillars} />

        <div className="ml-auto hidden min-w-0 flex-1 max-w-[560px] px-2 lg:block">
          <SearchAutocomplete variant="header" />
        </div>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-0.5 lg:ml-0 lg:flex">
          <Link href="/compare" className={navLinkClass("/compare")} aria-current={isActive("/compare") ? "page" : undefined}>
            Compare
            <CompareCountBadge />
          </Link>
          <Link
            href="/methodology"
            className={navLinkClass("/methodology")}
            aria-current={isActive("/methodology") ? "page" : undefined}
          >
            Methodology
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/vendor">For vendors</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/search">Browse software</Link>
          </Button>
        </div>
      </div>

      {/* Search stays reachable on small screens rather than hiding behind a menu. */}
      <div className="border-t border-border px-4 py-2 sm:px-6 lg:hidden">
        <SearchAutocomplete variant="header" autoFocusShortcut={false} />
      </div>
    </header>
  );
}
