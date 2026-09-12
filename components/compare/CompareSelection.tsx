"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { ProductLogo } from "@/components/ui/avatar";
import { canonicalCompareSlug } from "@/lib/utils";

/**
 * Editable list of the products in the current comparison.
 *
 * A shared comparison link lands a reader on a fixed set of products with no way to
 * change it — the URL *is* the state, and there is no client store to mutate. So
 * removing a product navigates to the recomputed canonical URL rather than editing
 * local state. That keeps one source of truth and makes every intermediate
 * combination shareable and back-button-correct.
 */
export function CompareSelection({
  products,
  limit = 4,
}: {
  products: { slug: string; name: string; logoDomain: string }[];
  limit?: number;
}) {
  const router = useRouter();
  const slugs = products.map((p) => p.slug);

  const remove = (slug: string) => {
    const next = slugs.filter((s) => s !== slug);
    // Below two products there is nothing to compare, so fall back to the hub.
    router.push(next.length >= 2 ? `/compare/${canonicalCompareSlug(next)}` : "/compare");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {products.map((product) => (
        <span
          key={product.slug}
          className="inline-flex max-w-64 items-center gap-2 rounded-control border border-border bg-card py-1 pl-1.5 pr-1"
        >
          <ProductLogo name={product.name} domain={product.logoDomain} size="xs" />
          <span className="truncate text-xs font-medium">{product.name}</span>
          <button
            type="button"
            onClick={() => remove(product.slug)}
            aria-label={`Remove ${product.name} from this comparison`}
            className="inline-flex size-5 shrink-0 items-center justify-center rounded-[4px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </span>
      ))}

      {products.length < limit && (
        <Link
          href="/compare"
          className="inline-flex items-center gap-1 rounded-control border border-dashed border-border-strong px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary-border hover:bg-primary-subtle hover:text-primary"
        >
          <Plus className="size-3" aria-hidden="true" />
          Add product
        </Link>
      )}
    </div>
  );
}
