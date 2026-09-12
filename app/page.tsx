import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { formatCompact, formatCount, monthYear } from "@/lib/utils";
import { getHomePageData } from "@/lib/data/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductLogo } from "@/components/ui/avatar";
import { RatingLine } from "@/components/domain/atoms";
import { CategoryCard, CategoryChip } from "@/components/cards/CategoryCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { SectionHeading, SectionLink } from "@/components/ui/content";
import { DemoDataNotice } from "@/components/domain/atoms";

export const metadata: Metadata = {
  title: "Software Discovery — compare business software on evidence",
  description:
    "Compare business software on verified reviews, transparent scoring and structured feature data. Independent rankings across 18 categories — vendors cannot pay for placement.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const data = getHomePageData();
  const updated = monthYear(data.socialProof ? "2026-09-12" : "2026-09-12");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Software Discovery",
    url: "https://software-discovery.example",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://software-discovery.example/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main">
        {/* ================================================================ HERO */}
        <section className="relative overflow-hidden border-b border-border bg-subtle bg-gradient-hero">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <h1 className="text-display font-semibold text-balance">
                  Where you go for software
                </h1>
                <p className="mt-3 max-w-xl text-body leading-relaxed text-muted-foreground">
                  Compare {formatCount(data.socialProof.totalProducts)} products on verified
                  reviews, transparent scoring and structured feature data. Independent rankings —
                  no pay-to-play placement.
                </p>

                <div className="mt-6 max-w-xl">
                  <SearchAutocomplete
                    variant="hero"
                    placeholder="Search products, categories or comparisons…"
                  />
                </div>

                <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-2xs text-muted-foreground">
                  <li className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="size-3.5 text-success" aria-hidden="true" />
                    Business-email verified reviews
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Camera className="size-3.5 text-success" aria-hidden="true" />
                    Screenshot-proof option
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
                    Vendors cannot pay for rank
                  </li>
                </ul>
              </div>

              {/* -------------------------------------------- featured products */}
              <div className="relative lg:col-span-5">
                <div className="rounded-card border border-border bg-card p-4 shadow-card">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="label-caps text-muted-foreground">Highest rated this month</h2>
                    <Link
                      href="/categories"
                      className="-my-1 py-1 text-2xs font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                      Browse all
                    </Link>
                  </div>

                  <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {data.featured.map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={`/product/${product.slug}`}
                          className="flex items-center gap-2.5 rounded-[6px] px-2 py-1.5 transition-colors hover:bg-muted"
                        >
                          <ProductLogo
                            name={product.name}
                            domain={product.logoDomain}
                            size="sm"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-13 font-medium">
                              {product.name}
                            </span>
                            <RatingLine
                              rating={product.ratingAvg}
                              count={product.ratingCount}
                              size={11}
                              className="text-2xs"
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <DemoDataNotice className="mt-3 border-t border-border pt-3" />
                </div>

                {/* Floating score card. Stacks underneath on small screens; from lg
                    it overlaps the column gap so the hero reads as layered rather
                    than as two boxes side by side. */}
                <div className="mt-3 rounded-card border border-border bg-card p-3 shadow-overlay lg:absolute lg:-bottom-6 lg:-left-6 lg:mt-0 lg:w-[62%]">
                  <p className="label-caps text-muted-foreground">Composite score</p>
                  <ul className="mt-2 space-y-1.5">
                    {data.featured.slice(0, 3).map((product) => (
                      <li key={product.slug} className="flex items-center gap-2">
                        <span className="w-20 shrink-0 truncate text-2xs">{product.name}</span>
                        <span
                          className="h-1.5 min-w-0 flex-1 rounded-pill bg-muted"
                          aria-hidden="true"
                        >
                          <span
                            className="block h-1.5 rounded-pill bg-gradient-cta"
                            style={{ width: `${Math.round((product.ratingAvg / 5) * 100)}%` }}
                          />
                        </span>
                        <span className="tnum text-2xs font-medium">
                          {product.ratingAvg.toFixed(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ------------------------------------------- popular categories */}
            <div className="mt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="label-caps text-muted-foreground">Most popular categories</h2>
                <Link
                  href="/categories"
                  className="text-2xs font-medium text-primary transition-colors hover:text-primary-hover"
                >
                  Browse all {data.topCategories.length > 0 ? formatCount(data.pillars.length) : ""}{" "}
                  categories →
                </Link>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {data.topCategories.map((category) => (
                  <li key={category.slug}>
                    <CategoryChip category={category} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==================================================== CATEGORY BLOCKS */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <SectionHeading
            eyebrow="Ranked by composite score"
            title="Top ranked by category"
            description="Each block shows the leading products in a category, ordered by verified review volume, satisfaction and functional coverage."
            action={<SectionLink href="/categories">All categories</SectionLink>}
          />

          <div className="mt-6 space-y-10">
            {data.categoryBlocks.map(({ category, products }) => (
              <div key={category.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="rounded-[3px] transition-colors hover:text-primary"
                    >
                      Best {category.name} Software
                    </Link>
                  </h3>
                  <p className="text-2xs text-muted-foreground tnum">
                    {formatCount(category.productCount)} products · updated {updated}
                  </p>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.slug} product={product} showCategory={false} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================== LEADERBOARDS */}
        <section className="border-y border-border bg-subtle">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* ------------------------------------------ new and trending */}
              <div>
                <SectionHeading
                  eyebrow="Compare velocity"
                  title="New & trending this week"
                  description="Ranked by comparison views per review — a leading indicator of buyer interest, not a popularity contest."
                  as="h3"
                  action={<SectionLink href="/search?sort=popularity">See more</SectionLink>}
                />

                <ol className="mt-4 space-y-2">
                  {data.trending.map((product, index) => (
                    <li key={product.slug}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-3 rounded-card border border-border bg-card px-3 py-2.5 transition-colors hover:border-border-strong"
                      >
                        <span className="w-4 shrink-0 font-mono text-13 font-medium text-faint tnum">
                          {index + 1}
                        </span>
                        <ProductLogo name={product.name} domain={product.logoDomain} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-13 font-medium">
                            {product.name}
                          </span>
                          <span className="block truncate text-2xs text-muted-foreground">
                            {product.primaryCategoryName} · {formatCompact(product.comparisonViews)}{" "}
                            comparisons
                          </span>
                        </span>
                        <Badge variant="outline" size="sm" className="shrink-0">
                          <TrendingUp className="size-3" aria-hidden="true" />
                          {product.score}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              {/* --------------------------------------------- most compared */}
              <div>
                <SectionHeading
                  eyebrow="Head-to-head"
                  title="Most compared pairs"
                  description="The matchups buyers are actually running this month."
                  as="h3"
                  action={<SectionLink href="/compare">Comparison hub</SectionLink>}
                />

                <ol className="mt-4 space-y-2">
                  {data.mostCompared.map((comparison) => {
                    return (
                      <li key={comparison.slug}>
                        <Link
                          href={`/compare/${comparison.slug}`}
                          className="flex items-center gap-3 rounded-card border border-border bg-card px-3 py-2.5 transition-colors hover:border-border-strong"
                        >
                          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[6px] border border-border bg-subtle font-mono text-2xs font-medium text-muted-foreground">
                            VS
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-13 font-medium">
                              {comparison.title}
                            </span>
                            <span className="block truncate text-2xs text-muted-foreground">
                              {formatCompact(comparison.views)} compared this month
                            </span>
                          </span>
                          <ArrowRight className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
                        </Link>
                      </li>
                    );
                  })}
                </ol>

                {/* ------------------------------------------ social proof */}
                <dl className="mt-6 grid grid-cols-2 gap-4 rounded-card border border-border bg-card p-4 sm:grid-cols-4">
                  {[
                    { label: "Reviews", value: formatCompact(data.socialProof.reviewScale) },
                    { label: "Products", value: formatCount(data.socialProof.totalProducts) },
                    { label: "Categories", value: formatCount(data.socialProof.totalCategories) },
                    { label: "Vendors", value: formatCount(data.socialProof.totalCompanies) },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="label-caps text-faint">{stat.label}</dt>
                      <dd className="mt-0.5 text-xl font-semibold tracking-[-0.02em] tnum">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-2xs text-faint">
                  Directory totals. Review figures are scaled for demonstration purposes — see the
                  data disclosure below.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== CATEGORIES */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <SectionHeading
            eyebrow="Directory"
            title="Browse every category"
            description="Eighteen categories, each with subcategories, structured feature data and a published methodology."
            action={<SectionLink href="/categories">Open directory</SectionLink>}
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.pillars.map((pillar) => (
              <CategoryCard key={pillar.slug} category={pillar} />
            ))}
          </div>
        </section>

        {/* ========================================================== RESOURCES */}
        {data.resources.length > 0 && (
          <section className="border-t border-border bg-subtle">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
              <SectionHeading
                eyebrow="Buying guides"
                title="Research before you shortlist"
                description="Practical guides on requirements, pricing models and implementation sequencing."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {data.resources.map((resource) => (
                  <article
                    key={resource.slug}
                    className="flex flex-col rounded-card border border-border bg-card p-4 shadow-card"
                  >
                    <p className="label-caps text-muted-foreground">{resource.readMinutes} min read</p>
                    <h3 className="mt-1.5 text-sm font-semibold leading-snug">{resource.title}</h3>
                    <p className="mt-1.5 line-clamp-3 flex-1 text-13 leading-relaxed text-muted-foreground">
                      {resource.excerpt}
                    </p>
                    <p className="mt-3 text-2xs text-faint">{resource.author}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== SEO / METHOD (dark contrast band) */}
        <section className="bg-surface-inverse text-surface-inverse-foreground">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="flex items-start gap-3">
              <Sparkles
                className="mt-0.5 size-4 shrink-0 text-surface-inverse-accent"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-[-0.01em] text-surface-inverse-foreground">
                  How these rankings are produced
                </h2>
                <div className="mt-2 space-y-2 text-13 leading-relaxed text-surface-inverse-muted">
                  <p>
                    Every ranking on this page is derived from three inputs: the volume of verified
                    reviews a product has accumulated, its satisfaction scores across four
                    dimensions (ease of use, value for money, customer support and functionality),
                    and how completely it covers the feature taxonomy for its category.
                  </p>
                  <p>
                    Vendors cannot buy a position. Sponsored placements exist, are always labelled,
                    and are excluded from both the ranking and the composite score. Where a
                    reviewer received an incentive, that is disclosed on the review itself and the
                    review is weighted lower.
                  </p>
                  <p>
                    <Link
                      href="/methodology"
                      className="text-surface-inverse-accent underline-offset-4 hover:underline"
                    >
                      Read the full methodology →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ CTA */}
        <section className="bg-gradient-cta">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-12 sm:px-6">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 size-4 shrink-0 text-white" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-white">Are you a software vendor?</p>
                <p className="mt-0.5 text-13 text-white/80">
                  Claim your listing, respond to reviews and manage inbound leads.
                </p>
              </div>
            </div>
            <Button asChild className="bg-card text-foreground hover:bg-background">
              <Link href="/vendor">
                Open the vendor portal
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
