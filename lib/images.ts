/**
 * Shared `next/image` `sizes` strings, keyed by where an image appears.
 *
 * A `sizes` value tells the optimizer the rendered width an image will occupy at
 * each breakpoint, so it can serve the smallest sufficient file. These pair with
 * the `deviceSizes` / `imageSizes` arrays in next.config.ts. When real imagery is
 * introduced, pass the relevant entry as the `sizes` prop on <ResponsiveImage>.
 *
 * Convention: mobile-first. The last clause (no min-width) is the mobile width.
 */
export const IMAGE_SIZES = {
  /** Full-bleed hero / banner — spans the viewport. */
  banner: "100vw",
  /** Product grid thumbnail: 1 col mobile → 2 → 3 → 4 cols on desktop. */
  productThumb:
    "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  /** Product detail hero image — half the content column on desktop. */
  productHero: "(min-width: 1024px) 50vw, 100vw",
  /** Category tile. */
  categoryTile: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  /** Small avatar / logo (vendor mark, reviewer). */
  avatar: "48px",
} as const;

export type ImageSizeKey = keyof typeof IMAGE_SIZES;
