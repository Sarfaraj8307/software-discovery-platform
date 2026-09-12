import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/domain/icon";
import type { Category } from "@/lib/data/types";

/**
 * Category identity plate.
 *
 * Assigns one of eight hues deterministically, keyed on the **parent pillar**
 * rather than the category itself — so all subcategories in a pillar read as a
 * family instead of producing a rainbow.
 *
 * Deliberately NOT generated illustration. An abstract geometric mark per
 * category sounds good and usually reads as arbitrary noise; a tinted plate
 * behind the existing semantic icon delivers the colour identity without
 * inventing iconography nobody can decipher.
 */

/* These must stay literal strings. Tailwind scans source text, so a template
   literal like `bg-cat-${n}` would never be generated and every plate would
   silently render with no background. */
const HUES = [
  { plate: "bg-cat-1", ink: "text-cat-1-fg" },
  { plate: "bg-cat-2", ink: "text-cat-2-fg" },
  { plate: "bg-cat-3", ink: "text-cat-3-fg" },
  { plate: "bg-cat-4", ink: "text-cat-4-fg" },
  { plate: "bg-cat-5", ink: "text-cat-5-fg" },
  { plate: "bg-cat-6", ink: "text-cat-6-fg" },
  { plate: "bg-cat-7", ink: "text-cat-7-fg" },
  { plate: "bg-cat-8", ink: "text-cat-8-fg" },
] as const;

/* FNV-1a. lib/data/seed.ts has the same algorithm but keeps it module-private
   and belongs to the data layer; presentation should not reach into it. */
function hueIndex(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % HUES.length;
}

export function CategoryArt({
  category,
  className,
}: {
  category: Pick<Category, "slug" | "parentSlug" | "icon">;
  className?: string;
}) {
  const hue = HUES[hueIndex(category.parentSlug ?? category.slug)];

  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-[7px]",
        hue.plate,
        hue.ink,
        className,
      )}
      aria-hidden="true"
    >
      <CategoryIcon name={category.icon} className="size-4" />
    </span>
  );
}

/** Smaller variant for the homepage "Most popular categories" chip strip. */
export function CategoryArtSm({
  category,
}: {
  category: Pick<Category, "slug" | "parentSlug" | "icon">;
}) {
  const hue = HUES[hueIndex(category.parentSlug ?? category.slug)];

  return (
    <CategoryIcon name={category.icon} className={cn("size-3.5", hue.ink)} />
  );
}
