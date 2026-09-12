import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";
import type { Category } from "@/lib/data/types";
import { CategoryIcon } from "@/components/domain/icon";

/** Compact pill used for the "Most Popular Categories" strip on the homepage. */
export function CategoryChip({ category, className }: { category: Category; className?: string }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1.5 text-13 font-medium transition-colors duration-150 hover:border-border-strong hover:bg-muted",
        className,
      )}
    >
      <CategoryIcon name={category.icon} className="size-3.5 text-muted-foreground" />
      {category.name}
      <span className="text-2xs text-muted-foreground tnum">{formatCount(category.productCount)}</span>
    </Link>
  );
}

/** Directory tile — used on the categories hub and in adjacent-category empty states. */
export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group flex items-start gap-3 rounded-card border border-border bg-card p-4 shadow-card card-lift",
        className,
      )}
    >
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[7px] border border-border bg-subtle text-muted-foreground transition-colors group-hover:border-primary-border group-hover:bg-primary-subtle group-hover:text-primary">
        <CategoryIcon name={category.icon} className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold leading-tight">{category.name}</span>
          <span className="shrink-0 text-2xs text-muted-foreground tnum">
            {formatCount(category.productCount)}
          </span>
        </span>
        <span className="mt-1 line-clamp-2 block text-13 leading-relaxed text-muted-foreground">
          {category.description}
        </span>
      </span>
    </Link>
  );
}

/** Row-style link for the categories hub subcategory lists. */
export function CategoryRow({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex items-center justify-between gap-3 rounded-[6px] px-2 py-1.5 text-13 transition-colors hover:bg-muted"
    >
      <span className="truncate">{category.name}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-2xs text-muted-foreground tnum">{formatCount(category.productCount)}</span>
        <ArrowRight className="size-3 text-faint" aria-hidden="true" />
      </span>
    </Link>
  );
}
