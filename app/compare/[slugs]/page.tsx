import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatCount, formatPrice, formatRating, monthYear } from "@/lib/utils";
import { getComparePageData } from "@/lib/data/queries";
import { getComparisonsForProduct, listComparisons } from "@/lib/data/repository";
import { Button } from "@/components/ui/button";
import { ProductLogo } from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/ui/navigation";
import { SectionHeading } from "@/components/ui/content";
import { Chip, DemoDataNotice, StarRating } from "@/components/domain/atoms";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { CompareSelection } from "@/components/compare/CompareSelection";
import { ProductCard } from "@/components/cards/ProductCard";
import { MetricBar } from "@/components/viz/MetricBar";

type PageProps = { params: Promise<{ slugs: string }> };

const SITE = "https://software-directory.example";

/**
 * Prerender the curated comparisons. Pairwise comparisons are the highest-intent
 * entry point in the directory and their slugs are stable, so they belong in the
 * static build. Any combination a reader assembles themselves still resolves on
 * demand.
 */
export function generateStaticParams() {
  return listComparisons()
    .slice(0, 80)
    .map((comparison) => ({ slugs: comparison.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slugs } = await params;
  const data = getComparePageData(slugs);
  if (!data) return { title: "Comparison not found" };

  const names = data.products.map((p) => p.name);
  const heading = names.join(" vs ");

  // The root layout appends " | Software Discovery" (21 chars), so the page segment has
  // to stay short or the title is truncated in search results. Drop the descriptive
  // suffix entirely once the product names alone are long.
  const title = `${heading} Comparison`.length <= 44 ? `${heading} Comparison` : heading;

  return {
    title,
    description:
      data.summary[0] ??
      `Compare ${names.join(", ")} on ratings, pricing, features and integrations.`,
    alternates: { canonical: `/compare/${data.canonicalSlug}` },
    openGraph: { title: `${heading} — comparison`, type: "article" },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { slugs } = await params;
  const data = getComparePageData(slugs);
  if (!data) notFound();

  /*
   * Canonicalise the slug. "b-vs-a" and "a-vs-b" are the same comparison, and only
   * one URL should be indexed.
   *
   * `permanentRedirect` emits a 308 rather than a 301. Both are permanent and
   * search engines treat them as equivalent for ranking; 308 additionally
   * guarantees the request method is preserved. Using it keeps the canonical rule
   * in one place (the page) instead of duplicating slug parsing into middleware.
   */
  if (data.canonicalSlug !== slugs) {
    permanentRedirect(`/compare/${data.canonicalSlug}`);
  }

  const { products, sections, summary } = data;
  const names = products.map((p) => p.name);
  const heading = names.join(" vs ");

  const totalRows = sections.reduce((sum, section) => sum + section.rows.length, 0);
  const differingRows = sections.reduce(
    (sum, section) => sum + section.rows.filter((row) => row.differs).length,
    0,
  );

  const updated = monthYear("2026-09-12");

  // Related comparisons: any other pairing that involves one of these products.
  const related = [
    ...new Map(
      products
        .flatMap((product) => getComparisonsForProduct(product.slug, 4))
        .filter((comparison) => comparison.slug !== data.canonicalSlug)
        .map((comparison) => [comparison.slug, comparison]),
    ).values(),
  ].slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE}/compare` },
          { "@type": "ListItem", position: 3, name: heading },
        ],
      },
      {
        "@type": "ItemList",
        name: heading,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: `${SITE}/product/${product.slug}`,
        })),
      },
    ],
  };

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <script
        type="application/ld+json"
        // Structured data is generated from our own catalogue, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Compare", href: "/compare" }, { label: heading }]}
      />

      <header className="mt-4">
        <p className="label-caps text-muted-foreground">Side-by-side comparison</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">{heading}</h1>

        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-13 text-muted-foreground">
          <span className="tnum">
            <span className="font-medium text-foreground">{differingRows}</span> of {totalRows} rows
            differ
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatCount(products.length)} products</span>
          <span aria-hidden="true">·</span>
          <span>Updated {updated}</span>
        </p>

        <div className="mt-4">
          <CompareSelection
            products={products.map((p) => ({
              slug: p.slug,
              name: p.name,
              logoDomain: p.logoDomain,
            }))}
          />
        </div>

        <DemoDataNotice className="mt-4" />
      </header>

      {/* ------------------------------------------------- at-a-glance strip */}
      <section aria-label="Products in this comparison" className="mt-8">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li
              key={product.slug}
              className="flex min-w-0 flex-col rounded-card border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-start gap-3">
                <ProductLogo name={product.name} domain={product.logoDomain} size="md" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold leading-snug tracking-[-0.01em]">
                    <Link
                      href={`/product/${product.slug}`}
                      className="rounded-[3px] transition-colors hover:text-primary"
                    >
                      {product.name}
                    </Link>
                  </h2>
                  <p className="mt-0.5 truncate text-2xs text-muted-foreground">
                    {product.companyName}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={product.ratingAvg} size={13} />
                <span className="text-xs font-medium tnum">
                  {formatRating(product.ratingAvg)}
                </span>
                <span className="text-2xs text-muted-foreground tnum">
                  ({formatCount(product.ratingCount)})
                </span>
              </div>

              {/*
                The composite score as a bar rather than a badge. All four cards
                sit on the same 0-100 scale, so the bar lengths are directly
                comparable across the row — which is the entire job of a
                comparison page, and the one thing four identical badges cannot
                do. The number is still printed, so nothing depends on judging
                the bar by eye.
              */}
              <div className="mt-3 border-t border-border pt-3">
                <span className="label-caps text-muted-foreground">Our score</span>
                <MetricBar className="mt-1.5" value={product.score} max={100} />
              </div>

              <dl className="mt-2.5 flex items-baseline justify-between gap-2">
                <dt className="label-caps text-muted-foreground">From</dt>
                <dd className="text-13 font-medium tnum">
                  {formatPrice(product.startingPrice)}
                  {product.startingPrice !== null && (
                    <span className="text-2xs font-normal text-muted-foreground">/mo</span>
                  )}
                </dd>
              </dl>

              {product.leader && (
                <p className="mt-3">
                  <Chip tone="primary">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Category leader
                  </Chip>
                </p>
              )}

              <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                <Link href={`/product/${product.slug}`}>
                  Read full review
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ what differs */}
      {summary.length > 0 && (
        <section className="mt-10" aria-labelledby="differences-heading">
          <SectionHeading
            id="differences-heading"
            eyebrow="Summary"
            title="What actually differs"
            description="Generated from the same structured data that powers the table below."
          />
          <ul className="mt-4 space-y-2 rounded-card border border-border bg-subtle p-4">
            {summary.map((line, index) => (
              <li key={index} className="flex gap-2.5 text-13 leading-relaxed">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary"
                  aria-hidden="true"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ------------------------------------------------------------- table */}
      <section className="mt-10" aria-labelledby="table-heading">
        <h2 id="table-heading" className="sr-only">
          Full comparison table
        </h2>
        <ComparisonTable products={products} sections={sections} />
      </section>

      {/* ------------------------------------------------------- go deeper */}
      <section className="mt-12" aria-labelledby="deep-dive-heading">
        <SectionHeading
          id="deep-dive-heading"
          eyebrow="Go deeper"
          title="Read the individual reviews"
          description="Each profile carries the full review set, pricing breakdown and integration list."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-heading">
          <SectionHeading
            id="related-heading"
            eyebrow="Related"
            title="Other comparisons to consider"
            action={
              <Link
                href="/compare"
                className="inline-flex items-center gap-1 text-13 font-medium text-primary transition-colors hover:text-primary-hover"
              >
                All comparisons
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((comparison) => (
              <li key={comparison.slug}>
                <Link
                  href={`/compare/${comparison.slug}`}
                  className="flex items-center justify-between gap-3 rounded-control border border-border bg-card px-3 py-2.5 text-13 font-medium transition-colors hover:border-border-strong hover:bg-muted"
                >
                  <span className="min-w-0 truncate">{comparison.title}</span>
                  <span className="shrink-0 text-2xs font-normal text-muted-foreground tnum">
                    {formatCount(comparison.views)} views
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ------------------------------------------------------------- CTA */}
      <section className="mt-12 rounded-card border border-border bg-subtle p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-[-0.01em]">Still deciding?</h2>
            <p className="mt-1 max-w-xl text-13 text-muted-foreground">
              Tell us your requirements and we will route your request to vendors that match — or
              browse the category to see how these two rank against the rest of the market.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/categories/${products[0]!.primaryCategorySlug}`}>
                See the full category
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">Search all software</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
