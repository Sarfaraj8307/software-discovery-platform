import * as React from "react";
import { cn, initials, monogramTone } from "@/lib/utils";
import { CATEGORY_HUES, categoryHueIndex } from "@/lib/brand";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "size-7 text-2xs",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
} as const;

/**
 * Reviewer avatar. No photography is shipped, so this renders deterministic initials
 * on a desaturated tint derived from the name — visually varied without introducing a
 * second accent colour into the system.
 */
export function Avatar({ name, size = "md", className, ...props }: AvatarProps) {
  const tone = monogramTone(name);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: tone.bg, color: tone.fg }}
      aria-hidden="true"
      {...props}
    >
      {initials(name)}
    </span>
  );
}

/**
 * Product logo. Rendered as a monogram plate rather than a remote image: no binary
 * assets are bundled, there is no third-party image request on first paint, and the
 * layout never shifts. Replacing this with real vendor logos is a one-component change.
 */
export function ProductLogo({
  name,
  domain,
  size = "md",
  className,
}: {
  name: string;
  domain: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const tone = monogramTone(domain || name);
  const dims = {
    xs: "size-6 text-2xs rounded-[5px]",
    sm: "size-8 text-xs rounded-[6px]",
    md: "size-10 text-sm rounded-[8px]",
    lg: "size-12 text-base rounded-[10px]",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center border border-border/70 font-semibold",
        dims,
        className,
      )}
      style={{ backgroundColor: tone.bg, color: tone.fg }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/**
 * Product brand tile for listing cards.
 *
 * No real vendor logos are bundled (and scraping them is a licensing problem),
 * so this renders a deterministic, category-tinted plate carrying the product
 * monogram — an *intentional* brand tile, not a fake screenshot. The hue is
 * the product's pillar, shared with the category plates (`CategoryArt`), so a
 * whole listing reads as one coherent colour system instead of a rainbow.
 *
 * It is an honest stand-in for imagery: when real logos arrive, this is the
 * one component to swap for `next/image`, and no call site changes. The plate
 * is decorative (`aria-hidden`) — the product-name link is the accessible name.
 */
export function ProductThumb({
  name,
  categorySlug,
  size = "md",
  className,
}: {
  name: string;
  categorySlug?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const hue = CATEGORY_HUES[categoryHueIndex(categorySlug || name)];
  const dims = {
    xs: "size-8 text-2xs rounded-[6px]",
    sm: "size-10 text-xs rounded-[7px]",
    md: "size-12 text-base rounded-[9px]",
    lg: "size-14 text-lg rounded-[11px]",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center border font-semibold",
        dims,
        hue.plate,
        hue.ink,
        className,
      )}
      style={{ borderColor: "color-mix(in srgb, currentColor 16%, transparent)" }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
