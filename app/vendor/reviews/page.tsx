import Link from "next/link";
import type { Metadata } from "next";
import { MessageSquare, Star } from "lucide-react";
import { formatCount, formatPercent, formatRating, relativeDate } from "@/lib/utils";
import { DEMO_VENDOR_SLUG } from "@/lib/portals";
import { getCompanyProducts, getReviewsForProduct } from "@/lib/data/repository";
import type { Review } from "@/lib/data/types";
import { KpiCard, SectionHeading, EmptyState } from "@/components/ui/content";
import { StatusPill } from "@/components/ui/table";
import { ProductLogo } from "@/components/ui/avatar";
import { StarRating, VerificationBadge } from "@/components/domain/atoms";
import { VendorResponseForm } from "@/components/vendor/VendorResponseForm";

export const metadata: Metadata = { title: "Reviews" };

export default function VendorReviewsPage() {
  const products = getCompanyProducts(DEMO_VENDOR_SLUG);

  // Aggregate approved reviews across every listing this vendor owns.
  const reviews: Review[] = products
    .flatMap((product) => getReviewsForProduct(product.slug, { perPage: 50 }).items)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const unanswered = reviews.filter((review) => !review.vendorResponse);

  // "Your public replies, most recent first" — so this must be ordered by when the reply
  // was published, not by when the review was written. Sorting by `createdAt` (as the
  // aggregate above is) buries a reply that was just published behind ten older ones, and
  // the section is capped at ten: you would post a response and see nothing change.
  const answered = reviews
    .filter((review) => review.vendorResponse)
    .sort(
      (a, b) =>
        Date.parse(b.vendorResponse!.respondedAt) - Date.parse(a.vendorResponse!.respondedAt),
    );

  const avgRating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const responseRate = reviews.length > 0 ? answered.length / reviews.length : 0;
  const lowRatings = reviews.filter((review) => review.rating <= 3).length;

  const productName = (slug: string) =>
    products.find((product) => product.slug === slug)?.name ?? slug;
  const productLogo = (slug: string) =>
    products.find((product) => product.slug === slug)?.logoDomain ?? slug;

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Reputation"
        title="Reviews"
        description="Approved reviews across all of your listings, newest first."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Average rating"
          value={formatRating(avgRating)}
          hint={`${formatCount(reviews.length)} approved reviews`}
        />
        <KpiCard
          label="Response rate"
          value={formatPercent(responseRate)}
          hint={`${formatCount(answered.length)} of ${formatCount(reviews.length)} answered`}
        />
        <KpiCard
          label="Awaiting a response"
          value={formatCount(unanswered.length)}
          hint="Reviews with no vendor reply yet"
        />
        <KpiCard
          label="Ratings of 3 or below"
          value={formatCount(lowRatings)}
          hint="Prioritise these — they move the average most"
        />
      </div>

      {/* --------------------------------------------------------- unanswered */}
      <section aria-labelledby="unanswered-heading">
        <SectionHeading
          id="unanswered-heading"
          eyebrow="Action needed"
          title="Awaiting a response"
          description="A reply is shown publicly beneath the review. It never edits the review or the rating."
        />

        {unanswered.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={<MessageSquare className="size-12" />}
            title="Every review has a response"
            description="Nothing is outstanding. New reviews will appear here as they are approved."
          />
        ) : (
          <ul className="mt-4 space-y-3">
            {unanswered.slice(0, 8).map((review) => (
              <li
                key={review.id}
                className="rounded-card border border-border bg-card p-4 shadow-card"
              >
                <header className="flex flex-wrap items-center gap-2.5">
                  <ProductLogo
                    name={productName(review.productSlug)}
                    domain={productLogo(review.productSlug)}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-13 font-medium">{review.title}</p>
                    <p className="truncate text-2xs text-muted-foreground">
                      {productName(review.productSlug)} · {review.authorName}, {review.authorRole} ·{" "}
                      {relativeDate(review.createdAt)}
                    </p>
                  </div>
                  <StarRating rating={review.rating} size={12} />
                  <span className="text-13 font-medium tnum">{formatRating(review.rating)}</span>
                  <VerificationBadge verification={review.verification} />
                </header>

                <p className="mt-3 line-clamp-3 text-13 leading-relaxed text-muted-foreground">
                  {review.body}
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <p className="rounded-control border border-success-border bg-success-subtle px-2.5 py-1.5 text-2xs text-success">
                    <span className="font-medium">Pro:</span> {review.pros}
                  </p>
                  <p className="rounded-control border border-warning-border bg-warning-subtle px-2.5 py-1.5 text-2xs text-warning">
                    <span className="font-medium">Con:</span> {review.cons}
                  </p>
                </div>

                <VendorResponseForm reviewId={review.id} reviewTitle={review.title} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------------------------------------------------------- answered */}
      <section aria-labelledby="answered-heading">
        <SectionHeading
          id="answered-heading"
          eyebrow="History"
          title="Responded"
          description="Your public replies, most recent first."
        />

        {answered.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={<Star className="size-12" />}
            title="No responses yet"
            description="Replies you publish will be listed here."
          />
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card">
            {answered.slice(0, 10).map((review) => (
              <li key={review.id} className="p-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <ProductLogo
                    name={productName(review.productSlug)}
                    domain={productLogo(review.productSlug)}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-13 font-medium">{review.title}</p>
                    <p className="truncate text-2xs text-muted-foreground">
                      {productName(review.productSlug)} · {review.authorName} ·{" "}
                      {relativeDate(review.createdAt)}
                    </p>
                  </div>
                  <StarRating rating={review.rating} size={12} />
                  <StatusPill status="APPROVED" />
                </div>

                {review.vendorResponse && (
                  <div className="mt-3 rounded-control border-l-2 border-primary bg-primary-subtle px-3 py-2">
                    <p className="label-caps text-primary">
                      Your response · {relativeDate(review.vendorResponse.respondedAt)}
                    </p>
                    <p className="mt-1 text-13 leading-relaxed">{review.vendorResponse.body}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-2xs text-muted-foreground">
        Vendors cannot delete or edit a review. Disputes are handled through the{" "}
        <Link href="/admin" className="text-primary underline-offset-2 hover:underline">
          moderation queue
        </Link>
        , which can only reject a review for a policy breach.
      </p>
    </div>
  );
}
