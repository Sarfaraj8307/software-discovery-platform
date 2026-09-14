import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  Globe,
  Minus,
  Sparkles,
  Users,
} from "lucide-react";
import { cn, formatCompact, formatCount, formatPrice, formatRating, monthYear } from "@/lib/utils";
import { getProductPageData } from "@/lib/data/queries";
import {
  getCategoryProducts,
  getFeaturedProducts,
  getTrendingProducts,
  listCategories,
} from "@/lib/data/repository";
import type { SearchParams } from "@/lib/data/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductThumb } from "@/components/ui/avatar";
import {
  Chip,
  DemoDataNotice,
  MetaDot,
  NoteLine,
  RatingLine,
  StarRating,
  VerifiedPublisherBadge,
} from "@/components/domain/atoms";
import { Breadcrumbs } from "@/components/ui/navigation";
import { EmptyState } from "@/components/ui/content";
import { StickySidebar } from "@/components/layout/TrustBar";
import { ProductTabs, type TabItem } from "@/components/product/ProductTabs";
import { RatingDistribution, SecondaryScores } from "@/components/reviews/RatingDistribution";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { PricingTable } from "@/components/product/PricingTable";
import { IntegrationGrid } from "@/components/product/IntegrationGrid";
import { MediaGallery } from "@/components/product/MediaGallery";
import { LeadForm } from "@/components/forms/LeadForm";
import { ProductCard } from "@/components/cards/ProductCard";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { ProductScorePanel } from "@/components/product/ProductScorePanel";
import { rankTier } from "@/lib/ranking";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export function generateStaticParams() {
  // Prerender the product profiles most likely to be entered from organic search:
  // the featured and trending sets, plus the top-ranked product in every category.
  // The rest of the catalogue renders on demand and is cached, which keeps the
  // build fast without leaving the highest-traffic pages to a cold render.
  const slugs = new Set<string>();

  for (const product of getFeaturedProducts(24)) slugs.add(product.slug);
  for (const product of getTrendingProducts(24)) slugs.add(product.slug);

  for (const category of listCategories()) {
    for (const product of getCategoryProducts(category.slug).slice(0, 3)) {
      slugs.add(product.slug);
    }
  }

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getProductPageData(slug, {});
  if (!data) return { title: "Product not found" };

  const { product } = data;
  return {
    title: `${product.name} Reviews & Pricing`,
    description: `${product.name} — ${product.tagline} Rated ${formatRating(product.ratingAvg)}/5 from ${formatCount(product.ratingCount)} ratings. Compare pricing, features and alternatives.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} — reviews, pricing and alternatives`,
      description: product.tagline,
      type: "website",
    },
  };
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const data = getProductPageData(slug, sp);
  if (!data) notFound();

  const {
    product,
    company,
    category,
    featureGroups,
    availableFeatureCount,
    totalFeatureCount,
    integrations,
    alternatives,
    comparisons,
    reviews,
    reviewSummary,
    reviewQuery,
  } = data;

  const basePath = `/product/${product.slug}`;
  const updated = monthYear("2026-09-12");

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews", count: reviewSummary.total },
    { id: "pricing", label: "Pricing" },
    { id: "integrations", label: "Integrations", count: integrations.length },
    { id: "alternatives", label: "Alternatives" },
    { id: "qa", label: "Q&A" },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
    { label: product.name },
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
        "@type": "SoftwareApplication",
        name: product.name,
        applicationCategory: product.primaryCategoryName,
        operatingSystem: "Web",
        description: product.tagline,
        url: product.website,
        offers: {
          "@type": "Offer",
          price: product.startingPrice ?? 0,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.ratingAvg,
          // schema.org separates the two: `ratingCount` is the sample behind the average,
          // `reviewCount` is the reviews actually published on this page. Emitting
          // `reviewCount: ratingCount` claimed 1,891 reviews next to 6 rendered cards,
          // which is a mismatch under Google's review-snippet policy.
          ratingCount: product.ratingCount,
          reviewCount: reviewSummary.total,
          bestRating: 5,
          worstRating: 1,
        },
      },
      ...(product.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: product.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  const secondaryScores = [
    { label: "Ease of use", value: product.easeAvg, sampleSize: Math.round(product.ratingCount * 0.42) },
    { label: "Value for money", value: product.valueAvg, sampleSize: Math.round(product.ratingCount * 0.38) },
    { label: "Customer support", value: product.supportAvg, sampleSize: Math.round(product.ratingCount * 0.3) },
    { label: "Functionality", value: product.functionalityAvg, sampleSize: Math.round(product.ratingCount * 0.44) },
  ];

  // Tier comes from the shared `rankTier()` helper rather than a local
  // threshold, so the chip here and the quadrant on the category page cannot
  // drift apart. `leader` is anchored to the same 87 the data layer uses.
  const tier = rankTier(product.score);

  // Anchors for the sticky rail's on-page navigation. Kept in one list so the
  // rail and the section headings below cannot fall out of sync.
  const onPageSections = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews" },
    { id: "pricing", label: "Pricing" },
    { id: "integrations", label: "Integrations" },
    { id: "alternatives", label: "Alternatives" },
    { id: "qa", label: "Q&A" },
  ];

  // Category context for the rail. The count comes from the same repository
  // accessor the category page uses, so the two can never disagree about how
  // many products a category holds.
  const categoryContext = category
    ? {
        name: category.name,
        slug: category.slug,
        productCount: getCategoryProducts(category.slug).length,
      }
    : null;

  const reviewFilters = [
    { label: `All (${reviewSummary.total})`, href: basePath, active: !reviewQuery.rating && !reviewQuery.verifiedOnly && !reviewQuery.currentUserOnly },
    ...[5, 4, 3, 2, 1].map((star) => ({
      label: `${star} star`,
      href: `${basePath}?reviewRating=${star}#reviews`,
      active: reviewQuery.rating === star,
    })),
    {
      label: "Verified only",
      href: `${basePath}?verified=1#reviews`,
      active: Boolean(reviewQuery.verifiedOnly),
    },
    {
      label: "Current user only",
      href: `${basePath}?currentUser=1#reviews`,
      active: Boolean(reviewQuery.currentUserOnly),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main">
        {/* ============================================================== HERO */}
        <section className="border-b border-border bg-subtle bg-gradient-hero">
          <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6">
            <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-start gap-4">
                <ProductThumb
                  name={product.name}
                  categorySlug={product.primaryCategorySlug}
                  size="lg"
                  className="mt-0.5"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h1 className="text-2xl font-semibold tracking-[-0.02em]">{product.name}</h1>
                    {product.sponsored ? (
                      <Badge
                        variant="warning"
                        size="sm"
                        caps
                        className="cursor-help"
                        title="This vendor pays for placement. Sponsored products are excluded from rankings and from the composite score."
                      >
                        Sponsored
                      </Badge>
                    ) : product.leader ? (
                      <Badge variant="outline" size="sm" caps>
                        Leader
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-13 text-muted-foreground">
                    {company ? (
                      <Link
                        href={`/categories/${product.primaryCategorySlug}`}
                        // -my-1 py-1 enlarges the hit area to ~28px without moving the text.
                        className="-my-1 py-1 font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {company.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">{product.companyName}</span>
                    )}
                    <VerifiedPublisherBadge />
                    <MetaDot />
                    <span>{product.solutionType}</span>
                    {category && (
                      <>
                        <MetaDot />
                        <Link
                          href={`/categories/${category.slug}`}
                          className="transition-colors hover:text-primary"
                        >
                          {category.name}
                        </Link>
                      </>
                    )}
                  </div>

                  {/* --------------------------------------------- rating row */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <RatingLine rating={product.ratingAvg} count={product.ratingCount} size={15} />

                    <span className="text-13 text-muted-foreground tnum">
                      From <span className="font-medium text-foreground">{formatPrice(product.startingPrice)}</span>
                      {product.startingPrice ? ` ${product.pricingNote}` : ""}
                    </span>
                  </div>

                  {/* ------------------------------------------- score cluster
                      The composite score is the platform's own metric, so it gets
                      a graphic rather than a number in a box. `ScoreRing` is a
                      server component whose arc is driven by CSS custom
                      properties, so this costs no JavaScript on any of the 230
                      product pages. The tier chip beside it carries the label, so
                      the meaning is not left to the ring alone. */}
                  <div className="mt-3 flex items-center gap-3">
                    <ScoreRing
                      value={product.score}
                      size={52}
                      thickness={5}
                      className="shrink-0"
                      valueClassName="text-base"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-pill px-2 py-0.5 text-2xs font-medium",
                            tier.tintClass,
                            tier.ink,
                          )}
                          title={tier.blurb}
                        >
                          {tier.label}
                        </span>
                        <span className="text-2xs text-muted-foreground">composite score</span>
                      </div>
                      <p className="mt-1 text-2xs leading-snug text-muted-foreground">
                        Weighted on review volume, satisfaction and feature coverage.
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 max-w-2xl text-body leading-relaxed text-muted-foreground">
                    {product.tagline}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {product.freeTrial && (
                      <Chip tone="primary">
                        {product.freeTrialDays ? `${product.freeTrialDays}-day free trial` : "Free trial"}
                      </Chip>
                    )}
                    {product.freeVersion && <Chip tone="success">Free version</Chip>}
                    <Chip>{integrations.length} integrations</Chip>
                    <Chip>{product.languages} languages</Chip>
                    <Chip>{availableFeatureCount} of {totalFeatureCount} tracked features</Chip>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button asChild>
                      <a href="#contact">
                        Contact vendor
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={product.website} target="_blank" rel="noopener noreferrer nofollow">
                        <Globe className="size-3.5" aria-hidden="true" />
                        Visit website
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <DemoDataNotice className="mt-4" />
            </div>

            {/* ------------------------------------------------------ lead rail */}
            <StickySidebar className="hidden lg:block">
              <div className="rounded-card border border-border bg-card p-4 shadow-card" id="contact">
                <h2 className="text-base font-semibold tracking-[-0.01em]">
                  Contact {product.name}
                </h2>
                <p className="mt-1 text-13 text-muted-foreground">
                  Get pricing, a demo or a scoped quote directly from the vendor.
                </p>
                <LeadForm
                  className="mt-4"
                  type="GET_PRICING"
                  productSlug={product.slug}
                  productName={product.name}
                  categorySlug={product.primaryCategorySlug}
                  sourceLocation="product#rail"
                />
              </div>

              <dl className="mt-3 rounded-card border border-border bg-subtle p-4">
                <h2 className="label-caps text-muted-foreground">Quick facts</h2>
                <div className="mt-2.5 space-y-2 text-13">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Starting price</dt>
                    <dd className="font-medium tnum">{formatPrice(product.startingPrice)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Pricing model</dt>
                    <dd className="text-right font-medium">{product.pricingNote}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Deployment</dt>
                    <dd className="text-right font-medium">
                      {product.deployment
                        .map((d) =>
                          d === "cloud"
                            ? "Cloud"
                            : d === "on_premise"
                              ? "On-premise"
                              : d === "mobile"
                                ? "Mobile"
                                : "Hybrid",
                        )
                        .join(", ")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Best fit</dt>
                    <dd className="text-right font-medium">
                      {product.companySizes
                        .map((s) =>
                          s === "small" ? "Small" : s === "mid" ? "Mid-market" : "Enterprise",
                        )
                        .join(", ")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Last updated</dt>
                    <dd className="font-medium">{updated}</dd>
                  </div>
                </div>
              </dl>
            </StickySidebar>
          </div>
        </div>
        </section>

        {/* ============================================================== TABS */}
        {/*
          The tab bar bleeds to the container edges with its own negative margin, so it
          must sit inside the same padded container as the content below it. Placed
          outside, its -mx-6 pushed it 24px past each edge of the viewport.
        */}
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
          <ProductTabs tabs={tabs} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-14 pt-8">
              {/* ==================================================== OVERVIEW */}
              <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-32">
                <h2 id="overview-heading" className="text-xl font-semibold tracking-[-0.02em]">
                  Overview
                </h2>

                <div className="prose-editorial mt-4">
                  {product.description.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* ----------------------------------------- features checklist */}
                <div className="mt-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold tracking-[-0.01em]">
                      Feature coverage
                    </h3>
                    <p className="text-2xs text-muted-foreground tnum">
                      {availableFeatureCount} of {totalFeatureCount} tracked capabilities
                    </p>
                  </div>
                  <NoteLine className="mt-1.5">
                    Coverage is measured against the category feature taxonomy, not against vendor
                    marketing claims.
                  </NoteLine>

                  <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    {featureGroups.map(({ group, features }) => {
                      const available = features.filter((f) => f.available);
                      if (available.length === 0) return null;
                      return (
                        <div key={group.slug}>
                          <h4 className="label-caps text-muted-foreground">{group.name}</h4>
                          <ul className="mt-2 space-y-1">
                            {features.map((feature) => (
                              <li
                                key={feature.slug}
                                className={`flex items-start gap-2 text-13 ${
                                  feature.available ? "text-foreground" : "text-faint"
                                }`}
                              >
                                {feature.available ? (
                                  <Check
                                    className="mt-0.5 size-3.5 shrink-0 text-success"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Minus
                                    className="mt-0.5 size-3.5 shrink-0 text-faint"
                                    aria-hidden="true"
                                  />
                                )}
                                <span>{feature.name}</span>
                                <span className="sr-only">
                                  {feature.available ? "included" : "not included"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ---------------------------------------------------- media */}
                <div className="mt-8">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">Screenshots</h3>
                  <div className="mt-3">
                    <MediaGallery screenshots={product.screenshots} productName={product.name} />
                  </div>
                </div>
              </section>

              {/* ===================================================== REVIEWS */}
              <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-32">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 id="reviews-heading" className="text-xl font-semibold tracking-[-0.02em]">
                    Reviews
                  </h2>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/reviews/new?product=${product.slug}`}>Write a review</Link>
                  </Button>
                </div>

                <DemoDataNotice variant="banner" className="mt-3" />

                {/* ------------------------------------ distribution + secondary */}
                <div className="mt-4 grid gap-6 rounded-card border border-border bg-card p-4 sm:grid-cols-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-3xl font-semibold tracking-[-0.02em] tnum">
                        {formatRating(product.ratingAvg)}
                      </span>
                      <span className="text-13 text-muted-foreground">out of 5</span>
                    </div>
                    <StarRating
                      rating={product.ratingAvg}
                      size={16}
                      className="mt-1"
                      label={`Rated ${formatRating(product.ratingAvg)} out of 5`}
                    />
                    <p className="mt-1.5 text-13 text-muted-foreground tnum">
                      {formatCount(product.ratingCount)} ratings
                    </p>

                    <RatingDistribution
                      className="mt-4"
                      distribution={product.ratingDistribution}
                      total={product.ratingCount}
                    />
                  </div>

                  <div>
                    <h3 className="label-caps text-muted-foreground">Satisfaction breakdown</h3>
                    <SecondaryScores className="mt-3" scores={secondaryScores} />
                  </div>
                </div>

                {/* ------------------------------------------------ pros / cons */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-card border border-success-border bg-success-subtle p-4">
                    <h3 className="label-caps text-success">Reviewers praise</h3>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {product.pros.map((pill) => (
                        <li key={pill.label}>
                          <span className="inline-flex items-center gap-1 rounded-pill border border-success-border bg-card px-2.5 py-1 text-2xs font-medium text-foreground">
                            {pill.label}
                            <span className="text-faint tnum">{formatCompact(pill.count)}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-card border border-border bg-subtle p-4">
                    <h3 className="label-caps text-muted-foreground">Reviewers criticise</h3>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {product.cons.map((pill) => (
                        <li key={pill.label}>
                          <span className="inline-flex items-center gap-1 rounded-pill border border-border bg-card px-2.5 py-1 text-2xs font-medium text-muted-foreground">
                            {pill.label}
                            <span className="text-faint tnum">{formatCompact(pill.count)}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ------------------------------------------------ AI summary */}
                <div className="mt-4 rounded-card border border-border bg-card p-4">
                  <h3 className="inline-flex items-center gap-1.5 text-13 font-semibold">
                    <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                    Summary of what reviewers say
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {product.aiSummary.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-13 leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-faint" aria-hidden="true" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2.5 text-2xs text-faint">
                    Generated from the reviews on this page. In this demonstration build the reviews
                    are synthetic, so treat this summary as illustrative only.
                  </p>
                </div>

                {/* ------------------------------------------------- filter bar */}
                <div className="mt-5 border-b border-border">
                  <ul className="scroll-rail -mb-px flex gap-1 overflow-x-auto">
                    {reviewFilters.map((filter) => (
                      <li key={filter.label}>
                        <Link
                          href={filter.href}
                          aria-current={filter.active ? "true" : undefined}
                          className={`relative inline-flex whitespace-nowrap px-3 py-2 text-13 font-medium transition-colors ${
                            filter.active
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {filter.label}
                          <span
                            aria-hidden="true"
                            className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full ${
                              filter.active ? "bg-primary" : "bg-transparent"
                            }`}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ------------------------------------------------ review list */}
                {reviews.items.length === 0 ? (
                  <EmptyState
                    className="mt-5"
                    icon={<Users className="size-12" />}
                    title="No reviews match this filter"
                    description="There are no reviews matching the current selection. Reset the filter to see all reviews for this product."
                    primaryAction={
                      <Button asChild>
                        <Link href={basePath}>Show all reviews</Link>
                      </Button>
                    }
                  />
                ) : (
                  <>
                    <div className="mt-5 space-y-3">
                      {reviews.items.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>

                    {reviews.totalPages > 1 && (
                      <nav
                        aria-label="Review pages"
                        className="mt-5 flex items-center justify-between gap-4"
                      >
                        <p className="text-13 text-muted-foreground tnum">
                          Page {reviews.page} of {reviews.totalPages}
                        </p>
                        <div className="flex gap-2">
                          {reviews.page > 1 && (
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={`${basePath}?reviewPage=${reviews.page - 1}#reviews`}
                                rel="prev"
                              >
                                Previous
                              </Link>
                            </Button>
                          )}
                          {reviews.page < reviews.totalPages && (
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={`${basePath}?reviewPage=${reviews.page + 1}#reviews`}
                                rel="next"
                              >
                                Next
                              </Link>
                            </Button>
                          )}
                        </div>
                      </nav>
                    )}
                  </>
                )}

                <div className="mt-6 rounded-card border border-border bg-subtle p-4">
                  <h3 className="text-13 font-semibold">How we handle reviews</h3>
                  <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
                    We never edit or suppress a review. Incentivized reviews are labelled and
                    weighted lower in the composite score. Reviews submitted without identity
                    verification are marked as Guest and do not count toward the score at all.
                  </p>
                  <Link
                    href="/methodology"
                    className="mt-2 inline-flex items-center gap-1 text-13 font-medium text-primary transition-colors hover:text-primary-hover"
                  >
                    Read the full review policy
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </section>

              {/* ===================================================== PRICING */}
              <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-32">
                <h2 id="pricing-heading" className="text-xl font-semibold tracking-[-0.02em]">
                  Pricing
                </h2>
                <p className="mt-1.5 max-w-2xl text-13 text-muted-foreground">
                  Editions published by {product.companyName}. Prices are indicative list pricing —
                  most deployments are negotiated on seat count and contract length.
                </p>

                <PricingTable
                  className="mt-5"
                  plans={product.pricingPlans}
                  productName={product.name}
                />
              </section>

              {/* ================================================ INTEGRATIONS */}
              <section id="integrations" aria-labelledby="integrations-heading" className="scroll-mt-32">
                <h2 id="integrations-heading" className="text-xl font-semibold tracking-[-0.02em]">
                  Integrations
                </h2>
                <p className="mt-1.5 max-w-2xl text-13 text-muted-foreground">
                  {product.name} connects to {integrations.length} tools tracked in this directory.
                </p>
                <div className="mt-5">
                  <IntegrationGrid integrations={integrations} />
                </div>
              </section>

              {/* ================================================= ALTERNATIVES */}
              <section id="alternatives" aria-labelledby="alternatives-heading" className="scroll-mt-32">
                <h2 id="alternatives-heading" className="text-xl font-semibold tracking-[-0.02em]">
                  Alternatives to {product.name}
                </h2>
                <p className="mt-1.5 max-w-2xl text-13 text-muted-foreground">
                  Other products in {product.primaryCategoryName}, ranked by composite score.
                </p>

                {comparisons.length > 0 && (
                  <div className="mt-4">
                    <h3 className="label-caps text-muted-foreground">Most compared</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {comparisons.map((comparison) => (
                        <li key={comparison.slug}>
                          <Link
                            href={`/compare/${comparison.slug}`}
                            className="inline-flex items-center gap-2 rounded-control border border-border bg-card px-3 py-1.5 text-13 transition-colors hover:border-border-strong hover:bg-muted"
                          >
                            {comparison.title}
                            <ArrowUpRight className="size-3 text-faint" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  {alternatives.slice(0, 4).map((alternative) => (
                    <ProductCard key={alternative.slug} product={alternative} showCategory={false} />
                  ))}
                </div>
              </section>

              {/* =========================================================== Q&A */}
              <section id="qa" aria-labelledby="qa-heading" className="scroll-mt-32">
                <h2 id="qa-heading" className="text-xl font-semibold tracking-[-0.02em]">
                  Questions & answers
                </h2>

                <div className="mt-4 divide-y divide-border rounded-card border border-border bg-card">
                  {product.faqs.map((faq) => (
                    <details key={faq.question} className="group px-4 py-3.5">
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

                {company && (
                  <div className="mt-6 rounded-card border border-border bg-subtle p-4">
                    <h3 className="inline-flex items-center gap-1.5 text-13 font-semibold">
                      <Building2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      About {company.name}
                    </h3>
                    <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
                      {company.description}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-13 sm:grid-cols-4">
                      <div>
                        <dt className="label-caps text-faint">Founded</dt>
                        <dd className="mt-0.5 font-medium tnum">{company.foundedYear}</dd>
                      </div>
                      <div>
                        <dt className="label-caps text-faint">HQ</dt>
                        <dd className="mt-0.5 font-medium">
                          {company.hqCity}, {company.hqCountry}
                        </dd>
                      </div>
                      <div>
                        <dt className="label-caps text-faint">Employees</dt>
                        <dd className="mt-0.5 font-medium tnum">{company.employeeCount}</dd>
                      </div>
                      <div>
                        <dt className="label-caps text-faint">Listed products</dt>
                        <dd className="mt-0.5 font-medium tnum">{company.productCount}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </section>
            </div>

            {/* ================================================ sticky rail
                This column used to be an empty placeholder spanning the whole
                scroll — roughly 800px of dead space on a wide viewport. It now
                carries the composite score, the satisfaction breakdown and
                on-page navigation, all of it server-rendered. */}
            <StickySidebar className="hidden lg:block" ariaLabel="Composite score and on-page navigation">
              <ProductScorePanel
                score={product.score}
                ratingAvg={product.ratingAvg}
                ratingCount={product.ratingCount}
                category={categoryContext}
                sections={onPageSections}
              />
            </StickySidebar>
          </div>
        </div>

        {/* ==================================================== mobile lead form */}
        <section className="mt-14 border-t border-border bg-subtle lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6" id="contact-mobile">
            <h2 className="text-base font-semibold tracking-[-0.01em]">
              Contact {product.name}
            </h2>
            <p className="mt-1 text-13 text-muted-foreground">
              Get pricing, a demo or a scoped quote.
            </p>
            <LeadForm
              className="mt-4"
              type="GET_PRICING"
              productSlug={product.slug}
              productName={product.name}
              categorySlug={product.primaryCategorySlug}
              sourceLocation="product#hero"
            />
          </div>
        </section>
      </main>
    </>
  );
}
