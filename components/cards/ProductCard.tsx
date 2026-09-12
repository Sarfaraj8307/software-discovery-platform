"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Scale } from "lucide-react";
import { cn, formatCompact, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form-controls";
import { Badge } from "@/components/ui/badge";
import { ProductLogo } from "@/components/ui/avatar";
import { Chip, RatingLine, ScoreBadge, VerifiedPublisherBadge } from "@/components/domain/atoms";
import { useCompare } from "@/components/compare/CompareProvider";
import { useToast } from "@/components/ui/feedback";

/**
 * The workhorse of the product. Designed for scanning, not for decoration:
 * identity → evidence → capability → action, in that order, on every card.
 *
 * Pricing is deliberately absent. Putting a number on the card would make the listing
 * read as a price comparison rather than an independent ranking, and most vendors in
 * the catalogue do not publish comparable list pricing.
 */
export function ProductCard({
  product,
  className,
  showCategory = true,
}: {
  product: Product;
  className?: string;
  showCategory?: boolean;
}) {
  const compare = useCompare();
  const { toast } = useToast();
  const checked = compare.has(product.slug);
  const productHref = `/product/${product.slug}`;

  const onToggleCompare = (next: boolean) => {
    const result = compare.toggle({
      slug: product.slug,
      name: product.name,
      logoDomain: product.logoDomain,
      categoryName: product.primaryCategoryName,
    });
    if (!result.ok && result.reason === "limit") {
      toast({
        title: `You can compare up to ${4} products`,
        description: "Remove one from the comparison bar to add another.",
        tone: "error",
      });
    } else if (next) {
      toast({
        title: `${product.name} added to comparison`,
        description: `${compare.items.length + 1} of 4 selected.`,
        tone: "success",
      });
    }
  };

  return (
    <article
      className={cn(
        "group relative flex gap-3 rounded-card border border-border bg-card p-4 shadow-card transition-[box-shadow,border-color] duration-150 ease-out hover:border-border-strong hover:shadow-sticky",
        checked && "border-primary-border bg-primary-subtle/40",
        className,
      )}
    >
      <ProductLogo name={product.name} domain={product.logoDomain} size="md" className="mt-0.5" />

      <div className="min-w-0 flex-1">
        {/* ---------------------------------------------------- identity row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-base font-semibold leading-tight tracking-[-0.01em]">
                <Link
                  href={productHref}
                  className="rounded-[3px] transition-colors hover:text-primary"
                >
                  {/* Stretched link: the whole card is clickable, but only the title is
                      a link element, so screen readers announce one target not five. */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {product.name}
                </Link>
              </h3>

              {product.sponsored && (
                <Badge
                  variant="warning"
                  size="sm"
                  caps
                  className="relative z-10 cursor-help"
                  title="This vendor pays for placement. Sponsored products are excluded from the ranking."
                >
                  Sponsored
                </Badge>
              )}
              {product.leader && !product.sponsored && (
                <Badge variant="outline" size="sm" caps className="relative z-10">
                  Leader
                </Badge>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-13 text-muted-foreground">{product.companyName}</span>
              {product.companyName && <VerifiedPublisherBadge />}
            </div>
          </div>

          {/* ------------------------------------------- compare affordance */}
          <label
            className="relative z-10 flex shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-control px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Add to comparison"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => onToggleCompare(v === true)}
              aria-label={`Add ${product.name} to comparison`}
            />
            <span className="hidden sm:inline">Compare</span>
            <Scale className="size-3.5 sm:hidden" aria-hidden="true" />
          </label>
        </div>

        {/* ----------------------------------------------------- evidence row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <RatingLine rating={product.ratingAvg} count={product.ratingCount} />
          <span className="hidden text-faint sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-2xs text-muted-foreground">Score</span>
            <ScoreBadge score={product.score} size="sm" />
          </span>
          <span className="hidden text-faint sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="text-13 text-muted-foreground tnum">
            {formatPrice(product.startingPrice)}
            {product.startingPrice ? (
              <span className="text-2xs"> {product.pricingNote}</span>
            ) : null}
          </span>
        </div>

        {/* -------------------------------------------------------- tagline */}
        <p className="mt-2 line-clamp-2 text-13 leading-relaxed text-muted-foreground">
          {product.tagline}
        </p>

        {/* ---------------------------------------------------------- chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {showCategory && (
            <Link href={`/categories/${product.primaryCategorySlug}`} className="relative z-10">
              <Chip className="transition-colors hover:border-border-strong hover:text-foreground">
                {product.primaryCategoryName}
              </Chip>
            </Link>
          )}
          {product.freeTrial && <Chip tone="primary">Free trial</Chip>}
          {product.freeVersion && <Chip tone="success">Free version</Chip>}
          <Chip>{product.integrationSlugs.length} integrations</Chip>
          {product.deployment.includes("on_premise") && <Chip>On-premise</Chip>}
        </div>

        {/* -------------------------------------------------------- actions */}
        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
          <Button asChild size="sm">
            <Link href={`${productHref}#contact`}>
              Contact vendor
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={productHref}>View profile</Link>
          </Button>
          <span className="ml-auto hidden text-2xs text-muted-foreground tnum md:inline">
            {formatCompact(product.profileViews)} profile views
          </span>
        </div>
      </div>
    </article>
  );
}

/** Skeleton with fixed dimensions so list loading never shifts layout. */
export function ProductCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-card border border-border bg-card p-4">
      <div className="size-10 shrink-0 animate-pulse rounded-[8px] bg-muted" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 w-32 animate-pulse rounded-control bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded-control bg-muted" />
        </div>
      </div>
    </div>
  );
}
