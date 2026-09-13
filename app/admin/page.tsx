import Link from "next/link";
import { ArrowRight, Clock, Flag, Inbox, Package, ShieldCheck } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";
import {
  getAdminMetrics,
  getModerationQueue,
  getPendingProducts,
  getReviewBreakdowns,
} from "@/lib/data/repository";
import { KpiCard, ProgressBar, SectionHeading, EmptyState } from "@/components/ui/content";
import { StatusPill } from "@/components/ui/table";
import { EmptyArt } from "@/components/brand/StateArt";

/** Queues older than this are surfaced as breaching the review SLA. */
const SLA_DAYS = 7;

/**
 * Bar colours are literal Tailwind class strings, not templated — Tailwind v4 scans
 * source text, so a constructed class name never makes it into the stylesheet and every
 * bar renders unfilled. See lib/viz.ts for the same constraint.
 */
const STATUS_BAR: Record<string, string> = {
  APPROVED: "bg-success",
  PENDING: "bg-warning",
  FLAGGED: "bg-destructive",
  REJECTED: "bg-muted-foreground",
};

const VERIFICATION_BAR: Record<string, string> = {
  VALIDATED: "bg-success",
  CURRENT_USER: "bg-primary",
  INCENTIVIZED: "bg-warning",
  GUEST: "bg-muted-foreground",
};

function BreakdownList({
  rows,
  total,
  bars,
  className,
}: {
  rows: { key: string; label: string; count: number }[];
  total: number;
  bars: Record<string, string>;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-3 rounded-card border border-border bg-card p-5 shadow-card", className)}>
      {rows.map((row) => (
        <li key={row.key}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-13 font-medium">{row.label}</span>
            <span className="text-13 text-muted-foreground tnum">
              {formatCount(row.count)}
              <span className="ml-1.5 text-2xs">
                ({total > 0 ? Math.round((row.count / total) * 100) : 0}%)
              </span>
            </span>
          </div>
          <ProgressBar
            className="mt-1.5"
            value={row.count}
            max={total}
            barClassName={bars[row.key]}
            label={`${row.label}: ${row.count} of ${total} reviews`}
          />
        </li>
      ))}
    </ul>
  );
}

function daysWaiting(iso: string): number {
  return Math.floor((Date.parse("2026-09-12T00:00:00.000Z") - Date.parse(iso)) / 86_400_000);
}

export default function AdminOverviewPage() {
  const metrics = getAdminMetrics();
  const reviewQueue = getModerationQueue(50);
  const productQueue = getPendingProducts(50);
  const mix = getReviewBreakdowns();

  const breaching = reviewQueue.filter((review) => daysWaiting(review.createdAt) > SLA_DAYS);
  const oldest = reviewQueue[0];

  const queues = [
    {
      href: "/admin/moderation",
      label: "Review moderation",
      description: "Pending and flagged reviews awaiting a decision.",
      count: metrics.pendingReviews,
      icon: ShieldCheck,
    },
    {
      href: "/admin/moderation",
      label: "Listing approvals",
      description: "New and edited product listings awaiting approval.",
      count: metrics.pendingProducts,
      icon: Package,
    },
    {
      href: "/admin/moderation",
      label: "Vendor claims",
      description: "Unverified vendors requesting control of a listing.",
      count: metrics.pendingClaims,
      icon: Flag,
    },
    {
      href: "/admin/leads",
      label: "Lead routing",
      description: "Enquiries that have not yet been attributed to a vendor.",
      count: metrics.newLeads,
      icon: Inbox,
    },
  ];

  return (
    <div className="space-y-10">
      {/* --------------------------------------------------------------- KPI */}
      <section aria-labelledby="admin-kpi-heading">
        <SectionHeading
          id="admin-kpi-heading"
          eyebrow="Platform"
          title="Moderation overview"
          description="Everything awaiting a human decision, plus catalogue totals."
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Pending reviews"
            value={formatCount(metrics.pendingReviews)}
            hint={`${formatCount(breaching.length)} past the ${SLA_DAYS}-day SLA`}
          />
          <KpiCard
            label="Flagged reviews"
            value={formatCount(metrics.flaggedReviews)}
            hint="Escalated by the community or by a vendor"
          />
          <KpiCard
            label="Pending listings"
            value={formatCount(metrics.pendingProducts)}
            hint={`${formatCount(metrics.pendingClaims)} vendor claims open`}
          />
          <KpiCard
            label="Catalogue"
            value={formatCount(metrics.totalProducts)}
            hint={`${formatCount(metrics.totalReviews)} reviews on record`}
          />
        </div>
      </section>

      {/* --------------------------------------------------------- review mix */}
      <section aria-labelledby="mix-heading">
        <SectionHeading
          id="mix-heading"
          eyebrow="Composition"
          title="What the catalogue is made of"
          description={`Every count below is taken from the ${formatCount(mix.total)} reviews on record. Incentivized and guest submissions stay visible here rather than being folded into a single "verified" figure.`}
        />

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div>
            <h3 className="label-caps text-muted-foreground">By moderation status</h3>
            <BreakdownList
              className="mt-3"
              rows={mix.status}
              total={mix.total}
              bars={STATUS_BAR}
            />
          </div>
          <div>
            <h3 className="label-caps text-muted-foreground">By verification</h3>
            <BreakdownList
              className="mt-3"
              rows={mix.verification}
              total={mix.total}
              bars={VERIFICATION_BAR}
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- SLA note */}
      {oldest && (
        <section
          aria-labelledby="sla-heading"
          className="rounded-card border border-warning-border bg-warning-subtle p-4"
        >
          <h2 id="sla-heading" className="flex items-center gap-2 text-13 font-semibold text-warning">
            <Clock className="size-3.5" aria-hidden="true" />
            Oldest item in the queue
          </h2>
          <p className="mt-1.5 text-13 leading-relaxed text-warning">
            “{oldest.title}” has been waiting {daysWaiting(oldest.createdAt)} days
            {breaching.length > 0 && ` · ${breaching.length} items are past the ${SLA_DAYS}-day SLA`}.
          </p>
        </section>
      )}

      {/* ----------------------------------------------------------- queues */}
      <section aria-labelledby="queues-heading">
        <SectionHeading
          id="queues-heading"
          eyebrow="Work queues"
          title="What needs attention"
        />

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {queues.map((queue) => {
            const Icon = queue.icon;
            return (
              <li key={queue.label}>
                <Link
                  href={queue.href}
                  className="card-lift flex h-full items-start gap-3 rounded-card border border-border bg-card p-4 shadow-card hover:bg-muted"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[7px] border border-border bg-subtle text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="text-13 font-semibold">{queue.label}</span>
                      <span className="text-13 font-semibold text-primary tnum">{queue.count}</span>
                    </span>
                    <span className="mt-0.5 block text-2xs leading-relaxed text-muted-foreground">
                      {queue.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* -------------------------------------------------- next in the queue */}
      <section aria-labelledby="next-heading">
        <SectionHeading
          id="next-heading"
          eyebrow="Up next"
          title="Next reviews to decide"
          description="Oldest first, so nothing is starved."
          action={
            <Link
              href="/admin/moderation"
              className="group inline-flex items-center gap-1 text-13 font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Open the queue
              <ArrowRight className="size-3.5 nudge group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />

        {reviewQueue.length === 0 ? (
          <EmptyState
            className="mt-4"
            illustration={<EmptyArt className="mb-1 size-28" />}
            title="The review queue is empty"
            description="Nothing is waiting for a decision. New submissions will appear here."
          />
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card">
            {reviewQueue.slice(0, 5).map((review) => (
              <li key={review.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-13 font-medium">{review.title}</p>
                  <p className="mt-0.5 truncate text-2xs text-muted-foreground">
                    {review.authorName} · {review.productSlug} · waiting{" "}
                    {daysWaiting(review.createdAt)} days
                  </p>
                </div>
                <StatusPill status={review.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------------------------------------------------------- listings */}
      {productQueue.length > 0 && (
        <section aria-labelledby="pending-listings-heading">
          <SectionHeading
            id="pending-listings-heading"
            eyebrow="Listings"
            title="Awaiting approval"
          />
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card">
            {productQueue.slice(0, 5).map((product) => (
              <li key={product.slug} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-13 font-medium">{product.name}</p>
                  <p className="mt-0.5 truncate text-2xs text-muted-foreground">
                    {product.companyName} · {product.primaryCategoryName}
                  </p>
                </div>
                <StatusPill status={product.status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-2xs text-muted-foreground">
        Queue actions (approve, reject, flag) are not wired up in this build — they require the
        authenticated moderation API and an audit log. Enquiries are live: submissions through the
        public forms appear under{" "}
        <Link href="/admin/leads" className="text-primary underline-offset-2 hover:underline">
          lead routing
        </Link>{" "}
        immediately.
      </p>
    </div>
  );
}
