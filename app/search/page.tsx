import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { getSearchPageData } from "@/lib/data/queries";
import type { SearchParams } from "@/lib/data/queries";
import { searchAll } from "@/lib/search";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, Pagination } from "@/components/ui/navigation";
import { EmptyState, SectionHeading } from "@/components/ui/content";
import { Chip } from "@/components/domain/atoms";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { FilterDrawer, FilterRail } from "@/components/filters/FilterRail";
import { ResultToolbar } from "@/components/filters/ResultToolbar";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";

type PageProps = { searchParams: Promise<SearchParams> };

const BASE_PATH = "/search";

function readQuery(params: SearchParams): string {
  const raw = params.q;
  return (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = readQuery(sp);

  return {
    title: q ? `Search results for “${q}”` : "Search software",
    description: q
      ? `Software matching “${q}” — filtered by rating, pricing, features and deployment model.`
      : "Search the directory by product, vendor, category or capability.",
    // Search result pages are thin and near-infinite in combination. They should be
    // crawlable but never indexed, so link equity flows through to the product and
    // category pages rather than accumulating on query URLs.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const data = getSearchPageData(sp);
  const { q, products, facets, query, activeFilterCount, adjacent } = data;

  // The same engine that backs the header autocomplete, used here to surface
  // non-product matches (categories and comparisons) above the product results.
  const grouped = q ? searchAll(q, { productLimit: 0, categoryLimit: 4, comparisonLimit: 4 }) : null;
  const extraCategories = grouped?.categories ?? [];
  const extraComparisons = grouped?.comparisons ?? [];
  const hasNonProductMatches = extraCategories.length > 0 || extraComparisons.length > 0;

  const heading = q ? `Search results for “${q}”` : "Search software";

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <header className="mt-4">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">{heading}</h1>
        <p className="mt-2 max-w-3xl text-body leading-relaxed text-muted-foreground">
          {q
            ? `${formatCount(products.total)} ${
                products.total === 1 ? "product matches" : "products match"
              } your search across names, vendors, categories, features and descriptions.`
            : "Search by product name, vendor, category or the capability you need — for example “SOC 2” or “usage-based pricing”."}
        </p>

        {/* Refine in place, without losing the active filters. */}
        <div className="mt-5 max-w-2xl">
          <SearchAutocomplete
            variant="hero"
            initialQuery={q}
            autoFocusShortcut={false}
            placeholder="Search products, vendors and categories…"
          />
        </div>
      </header>

      {/* --------------------------------------------- non-product matches */}
      {hasNonProductMatches && (
        <section className="mt-8 rounded-card border border-border bg-subtle p-4" aria-labelledby="also-heading">
          <h2 id="also-heading" className="label-caps text-muted-foreground">
            Also matching “{q}”
          </h2>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {extraCategories.length > 0 && (
              <div className="min-w-0">
                <p className="text-2xs font-medium text-muted-foreground">Categories</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {extraCategories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary-border hover:text-primary"
                      >
                        {category.name}
                        <span className="text-2xs text-faint tnum">{category.productCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {extraComparisons.length > 0 && (
              <div className="min-w-0">
                <p className="text-2xs font-medium text-muted-foreground">Comparisons</p>
                <ul className="mt-1.5 space-y-1">
                  {extraComparisons.map((comparison) => (
                    <li key={comparison.slug}>
                      <Link
                        href={`/compare/${comparison.slug}`}
                        className="flex items-center justify-between gap-3 rounded-control px-2 py-1 text-xs transition-colors hover:bg-card"
                      >
                        <span className="min-w-0 truncate">{comparison.title}</span>
                        <ArrowRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ results */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scroll-rail pr-1">
            <FilterRail
              facets={facets}
              basePath={BASE_PATH}
              params={sp}
              activeCount={activeFilterCount}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <ResultToolbar
            total={products.total}
            sort={query.sort ?? "score"}
            facets={facets}
            basePath={BASE_PATH}
            params={sp}
            activeCount={activeFilterCount}
            filterButton={
              <FilterDrawer
                facets={facets}
                basePath={BASE_PATH}
                params={sp}
                activeCount={activeFilterCount}
              />
            }
          />

          {products.items.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<SearchX className="size-12" />}
              title={q ? `No products match “${q}”` : "No products match these filters"}
              description={
                q
                  ? "Check the spelling, try a broader term, or browse a category instead. Our index covers product names, vendors, features and descriptions."
                  : "Your filter combination is narrower than the catalogue."
              }
              primaryAction={
                q || activeFilterCount > 0 ? (
                  <Button asChild>
                    <Link href={BASE_PATH}>Start a new search</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/categories">Browse all categories</Link>
                  </Button>
                )
              }
              secondaryAction={
                <Button asChild variant="outline">
                  <Link href="/compare">Compare products</Link>
                </Button>
              }
            />
          ) : (
            <>
              <div className="mt-4 space-y-3">
                {products.items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>

              <Pagination
                className="mt-6"
                basePath={BASE_PATH}
                searchParams={sp}
                page={products.page}
                totalPages={products.totalPages}
              />
            </>
          )}
        </div>
      </div>

      {/* --------------------------------------------------- related browse */}
      <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-browse-heading">
        <SectionHeading
          id="related-browse-heading"
          eyebrow="Not quite it?"
          title="Browse by category instead"
          description="Category pages carry the full ranking methodology, segment filters and editorial guidance."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {adjacent.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
        <p className="mt-6">
          <Chip tone="neutral">
            Tip: press ⌘K anywhere to search without leaving the page
          </Chip>
        </p>
      </section>
    </main>
  );
}
