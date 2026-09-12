/**
 * Deterministic category-hue assignment, shared by the category identity
 * plates (`CategoryArt`) and the product brand tiles (`ProductThumb`).
 *
 * Keyed on the parent pillar rather than the leaf category, so an entire
 * pillar reads as one colour family instead of producing a rainbow across a
 * listing. This is the "category hues are data-visualisation identity, not a
 * second accent" rule made concrete: every hue lives in the token layer
 * (`--color-cat-*`), is AA-measured, and never carries interactive state.
 *
 * CRITICAL: the hue classes are literal strings. Tailwind scans source text,
 * so a template like `bg-cat-${n}` would never be emitted and every tile would
 * render with no background. Keep this array static.
 */

export const CATEGORY_HUES = [
  { plate: "bg-cat-1", ink: "text-cat-1-fg" },
  { plate: "bg-cat-2", ink: "text-cat-2-fg" },
  { plate: "bg-cat-3", ink: "text-cat-3-fg" },
  { plate: "bg-cat-4", ink: "text-cat-4-fg" },
  { plate: "bg-cat-5", ink: "text-cat-5-fg" },
  { plate: "bg-cat-6", ink: "text-cat-6-fg" },
  { plate: "bg-cat-7", ink: "text-cat-7-fg" },
  { plate: "bg-cat-8", ink: "text-cat-8-fg" },
] as const;

export type CategoryHue = (typeof CATEGORY_HUES)[number];

/**
 * FNV-1a hash → index into CATEGORY_HUES. Deterministic and stable across
 * renders and across server/client, so a product never flickers to a new hue
 * on hydration. The data layer (`lib/data/seed.ts`) keeps its own copy by
 * design; this one belongs to presentation.
 */
export function categoryHueIndex(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % CATEGORY_HUES.length;
}
