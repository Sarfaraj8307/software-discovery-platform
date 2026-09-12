import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { formatCount, formatPercentValue, formatRating, relativeDate } from "@/lib/utils";
import { DEMO_VENDOR_SLUG } from "@/lib/portals";
import { getCompany, getCompanyProducts, getVendorMetrics, listLeads } from "@/lib/data/repository";
import { KpiCard, ProgressBar, SectionHeading } from "@/components/ui/content";
import { StatusPill } from "@/components/ui/table";
import { ProductLogo } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/content";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/domain/atoms";

export default function VendorOverviewPage() {
  const company = getCompany(DEMO_VENDOR_SLUG)!;
  const metrics = getVendorMetrics(DEMO_VENDOR_SLUG);
  const products = getCompanyProducts(DEMO_VENDOR_SLUG);

  const productSlugs = new Set(products.map((p) => p.slug));
  const recentLeads = listLeads()
    .filter((lead) => lead.productSlug && productSlugs.has(lead.productSlug))
    .slice(0, 6);

  const peakViews = Math.max(1, ...metrics.viewsTrend.map((point) => point.value));
  const totalSourceLeads = Math.max(1, metrics.leadsBySource.reduce((s, r) => s + r.count, 0));

  return (
    <div className="space-y-10">
      {/* --------------------------------------------------------------- KPI */}
      <section aria-labelledby="kpi-heading">
        <SectionHeading
          id="kpi-heading"
          eyebrow="Last 30 days"
          title="Performance overview"
          description="Views, comparison appearances and enquiries across all of your listings."
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Profile views (7d)"
            value={formatCount(metrics.profileViews7d)}
            delta={metrics.profileViewDelta}
            hint={`${formatCount(metrics.profileViews30d)} in the last 30 days`}
          />
          <KpiCard
            label="Enquiries (30d)"
            value={formatCount(metrics.leads30d)}
            delta={metrics.leadDelta}
            hint={`${formatCount(metrics.leads7d)} in the last 7 days`}
          />
          <KpiCard
            label="Comparison appearances"
            value={formatCount(metrics.comparisonHits)}
            hint="Times your products appeared in a comparison table"
          />
          <KpiCard
            label="Average rating"
            value={formatRating(metrics.avgRating)}
            hint={`${metrics.reviewVelocity} new reviews per listing per month`}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------- trend */}
      <section aria-labelledby="trend-heading">
        <SectionHeading
          id="trend-heading"
          eyebrow="Traffic"
          title="Profile views by week"
          description="Eight-week trend across every listing you own."
        />

        <div className="mt-4 rounded-card border border-border bg-card p-5 shadow-card">
          {/* A plain bar chart. Values are labelled, so it stays readable without colour
              and needs no charting dependency for eight points. */}
          <ul className="flex h-40 items-end gap-2">
            {metrics.viewsTrend.map((point) => (
              <li key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <span className="text-2xs text-muted-foreground tnum">
                  {formatCount(point.value)}
                </span>
                <div
                  className="w-full rounded-t-[4px] bg-primary/85"
                  style={{ height: `${Math.max(4, (point.value / peakViews) * 110)}px` }}
                  role="img"
                  aria-label={`${point.label}: ${formatCount(point.value)} profile views`}
                />
                <span className="text-2xs text-faint">{point.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-13 text-success">
            <TrendingUp className="size-3.5" aria-hidden="true" />
            Up {formatPercentValue(metrics.profileViewDelta)} versus the previous 30 days
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- lead sources */}
      <section aria-labelledby="sources-heading">
        <SectionHeading
          id="sources-heading"
          eyebrow="Attribution"
          title="Where your enquiries come from"
          description="Every enquiry records the surface it was submitted from."
        />

        {metrics.leadsBySource.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={<ArrowRight className="size-12" />}
            title="No attributed enquiries yet"
            description="Once a reader submits an enquiry from one of your listings, the originating surface will appear here."
          />
        ) : (
          <ul className="mt-4 space-y-3 rounded-card border border-border bg-card p-5 shadow-card">
            {metrics.leadsBySource.map((source) => (
              <li key={source.source}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-13 font-medium">{source.label}</span>
                  <span className="text-13 text-muted-foreground tnum">
                    {formatCount(source.count)}
                    <span className="ml-1.5 text-2xs">
                      ({Math.round((source.count / totalSourceLeads) * 100)}%)
                    </span>
                  </span>
                </div>
                <ProgressBar
                  className="mt-1.5"
                  value={source.count}
                  max={totalSourceLeads}
                  label={`${source.label}: ${source.count} enquiries`}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ------------------------------------------------------ recent leads */}
      <section aria-labelledby="recent-leads-heading">
        <SectionHeading
          id="recent-leads-heading"
          eyebrow="Inbox"
          title="Recent enquiries"
          action={
            <Link
              href="/vendor/leads"
              className="inline-flex items-center gap-1 text-13 font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Open the inbox
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        />

        {recentLeads.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={<ArrowRight className="size-12" />}
            title="No enquiries yet"
            description="Enquiries submitted from your product pages will land here."
            primaryAction={
              <Button asChild>
                <Link href="/vendor/products">Review your listings</Link>
              </Button>
            }
          />
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-13 font-medium">
                    {lead.name}
                    {lead.company && (
                      <span className="font-normal text-muted-foreground"> · {lead.company}</span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-2xs text-muted-foreground">
                    {lead.productName} · {lead.sourceLocation} · {relativeDate(lead.createdAt)}
                  </p>
                </div>
                <StatusPill status={lead.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ----------------------------------------------------------- listings */}
      <section aria-labelledby="listings-heading">
        <SectionHeading
          id="listings-heading"
          eyebrow="Listings"
          title="Your products"
          description={`${products.length} live ${products.length === 1 ? "listing" : "listings"} in the directory.`}
          action={
            <Link
              href="/vendor/products"
              className="inline-flex items-center gap-1 text-13 font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Manage
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        />

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {products.slice(0, 4).map((product) => (
            <li
              key={product.slug}
              className="flex items-center gap-3 rounded-card border border-border bg-card p-4 shadow-card"
            >
              <ProductLogo name={product.name} domain={product.logoDomain} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-13 font-medium">
                  <Link
                    href={`/product/${product.slug}`}
                    className="rounded-[3px] transition-colors hover:text-primary"
                  >
                    {product.name}
                  </Link>
                </p>
                <p className="mt-0.5 truncate text-2xs text-muted-foreground">
                  {product.primaryCategoryName} · {formatCount(product.ratingCount)} reviews
                </p>
              </div>
              <ScoreBadge score={product.score} />
            </li>
          ))}
        </ul>

        <p className="mt-3 text-2xs text-muted-foreground">
          Signed in as {company.name}. Composite scores and rankings cannot be edited from this
          portal — see the{" "}
          <Link href="/methodology" className="text-primary underline-offset-2 hover:underline">
            methodology
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
