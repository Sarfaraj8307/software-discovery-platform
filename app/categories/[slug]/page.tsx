import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, SearchX } from "lucide-react";
import { formatCount, monthYear } from "@/lib/utils";
import { getCategoryPageData } from "@/lib/data/queries";
import {
  countVerifiedReviewsInCategory,
  listPillarCategories,
} from "@/lib/data/repository";
import type { SearchParams } from "@/lib/data/queries";
import { ProductCard } from "@/components/cards/ProductCard";
import { CategoryChip } from "@/components/cards/CategoryCard";
import { FilterDrawer, FilterRail } from "@/components/filters/FilterRail";
import { ResultToolbar } from "@/components/filters/ResultToolbar";
import { Breadcrumbs, Pagination } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionHeading } from "@/components/ui/content";
import { TrustBar } from "@/components/layout/TrustBar";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export function generateStaticParams() {
  return listPillarCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getCategoryPageData(slug, {});
  if (!data) return { title: "Category not found" };

  // The H1 has room for "Best X Software — September 2026", but the <title> tag does not:
  // the root layout appends " | Software Discovery" and search engines truncate around 60
  // characters. Keep the year — it is the freshness signal — and drop the month.
  const year = data.category.seoTitle.match(/(\d{4})\s*$/)?.[1] ?? "2026";
  const compactTitle = `${data.category.seoTitle.replace(/\s+—\s+\w+\s+\d{4}\s*$/, "")} (${year})`;

  return {
    title: compactTitle,
    description: data.category.seoDescription,
    alternates: { canonical: `/categories/${data.category.slug}` },
    openGraph: {
      siteName: "Software Discovery",
      locale: "en_US",
      title: data.category.seoTitle,
      description: data.category.seoDescription,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: data.category.seoTitle,
      description: data.category.seoDescription,
    },
  };
}

/** Segment presets — the tab row above the results. */
const SEGMENTS = [
  { label: "Overview", href: "", match: (p: SearchParams) => !p.sort && !p.pricing },
  { label: "Trending", href: "?sort=popularity", match: (p: SearchParams) => p.sort === "popularity" },
  { label: "Highest rated", href: "?sort=satisfaction", match: (p: SearchParams) => p.sort === "satisfaction" },
  { label: "Most reviewed", href: "?sort=reviews", match: (p: SearchParams) => p.sort === "reviews" },
  { label: "Free options", href: "?pricing=free", match: (p: SearchParams) => p.pricing === "free" },
] as const;

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const data = getCategoryPageData(slug, sp);
  if (!data) notFound();

  const { category, parent, children, products, facets, query, activeFilterCount, adjacent } = data;
  const basePath = `/categories/${category.slug}`;
  const updated = monthYear("2026-09-12");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    ...(parent ? [{ label: parent.name, href: `/categories/${parent.slug}` }] : []),
    { label: category.name },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.label,
          ...(item.href ? { item: `https://software-discovery.example${item.href}` } : {}),
        })),
      },
      {
        "@type": "ItemList",
        name: category.seoTitle,
        numberOfItems: products.total,
        itemListElement: products.items.slice(0, 10).map((product, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: product.name,
          url: `https://software-discovery.example/product/${product.slug}`,
        })),
      },
      ...(category.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: category.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />

        {/* ============================================================== header */}
        <header className="mt-4">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-balance">
            Best {category.name} Software — {updated}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-13 text-muted-foreground">
            <span className="tnum">{formatCount(category.productCount)} listings</span>
            <span className="text-faint" aria-hidden="true">
              ·
            </span>
            <span className="tnum">
              {formatCount(products.total)} matching your filters
            </span>
            <span className="text-faint" aria-hidden="true">
              ·
            </span>
            <Link
              href="/methodology"
              className="font-medium text-primary underline-offset-2 transition-colors hover:underline"
            >
              How we score
            </Link>
          </div>

          <p className="mt-3 max-w-3xl text-body leading-relaxed text-muted-foreground">
            {category.description}
          </p>

          <TrustBar
            className="mt-4"
            reviewCount={countVerifiedReviewsInCategory(category.slug)}
            productCount={category.productCount}
            updatedLabel={updated}
          />
        </header>

        {/* ============================================================ segments */}
        <nav aria-label="Result views" className="mt-6 border-b border-border">
          <ul className="scroll-rail -mb-px flex gap-1 overflow-x-auto">
            {SEGMENTS.map((segment) => {
              const isActive = segment.match(sp);
              return (
                <li key={segment.label}>
                  <Link
                    href={`${basePath}${segment.href}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative inline-flex whitespace-nowrap px-3 py-2 text-13 font-medium transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {segment.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full ${
                        isActive ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ============================================================= subcats */}
        {children.length > 0 && (
          <div className="mt-5">
            <p className="label-caps text-muted-foreground">Subcategories</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {children.map((child) => (
                <li key={child.slug}>
                  <CategoryChip category={child} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ============================================================== results */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scroll-rail pr-1">
              <FilterRail
                facets={facets}
                basePath={basePath}
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
              basePath={basePath}
              params={sp}
              activeCount={activeFilterCount}
              filterButton={
                <FilterDrawer
                  facets={facets}
                  basePath={basePath}
                  params={sp}
                  activeCount={activeFilterCount}
                />
              }
            />

            {products.items.length === 0 ? (
              <EmptyState
                className="mt-6"
                icon={<SearchX className="size-12" />}
                title="No products match these filters"
                description="Your filter combination is narrower than the catalogue. Remove a filter, or start from an adjacent category."
                primaryAction={
                  <Button asChild>
                    <Link href={basePath}>Clear all filters</Link>
                  </Button>
                }
                secondaryAction={
                  <Button asChild variant="outline">
                    <Link href="/categories">Browse all categories</Link>
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
                  basePath={basePath}
                  searchParams={sp}
                  page={products.page}
                  totalPages={products.totalPages}
                />
              </>
            )}
          </div>
        </div>

        {/* ============================================================ SEO BLOCK */}
        <section className="mt-14 border-t border-border pt-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <SectionHeading
                eyebrow="Buying insights"
                title={`How to choose ${category.name.toLowerCase()} software`}
                as="h2"
              />
              <div className="prose-editorial mt-4">
                {category.editorial.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {category.faqs.length > 0 && (
              <div>
                <h2 className="text-base font-semibold tracking-[-0.01em]">
                  Frequently asked questions
                </h2>
                <div className="mt-3 divide-y divide-border rounded-card border border-border bg-card">
                  {category.faqs.map((faq) => (
                    <details key={faq.question} className="group px-4 py-3">
                      <summary className="flex cursor-pointer items-center justify-between gap-3 text-13 font-medium [&::-webkit-details-marker]:hidden">
                        <span>{faq.question}</span>
                        <ChevronRight
                          className="size-3.5 shrink-0 text-faint transition-transform duration-150 group-open:rotate-90"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="mt-2 text-13 leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
                <p className="mt-2 text-2xs text-muted-foreground">Last updated {updated}</p>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ ADJACENT */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Keep looking"
            title="Adjacent categories"
            description="Buyers evaluating this category frequently also compare these."
            as="h2"
          />
          <ul className="mt-4 flex flex-wrap gap-2">
            {adjacent.map((item) => (
              <li key={item.slug}>
                <CategoryChip category={item} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
