import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/domain/icon";
import { CATEGORY_HUES, categoryHueIndex } from "@/lib/brand";
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

export function CategoryArt({
  category,
  className,
}: {
  category: Pick<Category, "slug" | "parentSlug" | "icon">;
  className?: string;
}) {
  const hue = CATEGORY_HUES[categoryHueIndex(category.parentSlug ?? category.slug)];

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
  const hue = CATEGORY_HUES[categoryHueIndex(category.parentSlug ?? category.slug)];

  return (
    <CategoryIcon name={category.icon} className={cn("size-3.5", hue.ink)} />
  );
}
