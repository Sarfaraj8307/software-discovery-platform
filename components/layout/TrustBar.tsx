import * as React from "react";
import { BadgeCheck, Camera, Gift, ShieldCheck } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";

/**
 * Trust bar.
 *
 * Sits directly under the breadcrumb on listing pages. Its job is to establish that the
 * ranking is independent before the reader invests attention in the cards below.
 */
export function TrustBar({
  reviewCount,
  productCount,
  updatedLabel,
  className,
}: {
  reviewCount: number;
  productCount: number;
  updatedLabel: string;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-2xs text-muted-foreground",
        className,
      )}
    >
      <li className="inline-flex items-center gap-1.5">
        <BadgeCheck className="size-3.5 text-success" aria-hidden="true" />
        {formatCount(reviewCount)} verified reviews
      </li>
      <li className="inline-flex items-center gap-1.5">
        <Camera className="size-3.5 text-success" aria-hidden="true" />
        Screenshot-proof verification available
      </li>
      <li className="inline-flex items-center gap-1.5">
        <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
        {formatCount(productCount)} products indexed
      </li>
      <li className="inline-flex items-center gap-1.5">
        <Gift className="size-3.5 text-warning" aria-hidden="true" />
        Incentivized reviews always labelled
      </li>
      <li className="text-faint">Updated {updatedLabel}</li>
    </ul>
  );
}

/**
 * Right-rail sticky container. Top offset clears the sticky header plus the product tab
 * bar so the rail never slides underneath them.
 *
 * `ariaLabel` is a prop rather than a constant because the product page uses two
 * of these with different jobs: the hero rail is the contact panel, and the rail
 * below the tabs is the score panel. Two `<aside>` landmarks with the same
 * accessible name are indistinguishable in a screen reader's landmark list, so
 * the label has to describe which one you are in.
 */
export function StickySidebar({
  children,
  className,
  topOffset = "top-28",
  ariaLabel = "Contact and quick facts",
}: {
  children: React.ReactNode;
  className?: string;
  topOffset?: string;
  ariaLabel?: string;
}) {
  return (
    <aside
      aria-label={ariaLabel}
      className={cn("lg:sticky lg:self-start", topOffset, className)}
    >
      {children}
    </aside>
  );
}
