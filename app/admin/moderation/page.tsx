import Link from "next/link";
import type { Metadata } from "next";
import { Package, ShieldCheck } from "lucide-react";
import { formatCount, formatRating, relativeDate } from "@/lib/utils";
import {
  getModerationQueue,
  getPendingProducts,
  listModerationLog,
  listPendingListingEdits,
} from "@/lib/data/repository";
import { ListingEditDecider } from "@/components/admin/ListingEditDecider";
import { ModerationActions } from "@/components/admin/ModerationActions";
import type { Product, Review } from "@/lib/data/types";
import { DataTable, StatusPill, type Column } from "@/components/ui/table";
import { EmptyState, SectionHeading } from "@/components/ui/content";
import { ProductLogo } from "@/components/ui/avatar";
import { StarRating, VerificationBadge } from "@/components/domain/atoms";

export const metadata: Metadata = { title: "Moderation queue" };

const REVIEW_COLUMNS: Column<Review>[] = [
  {
    key: "review",
    header: "Review",
    render: (review) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{review.title}</p>
        <p className="mt-0.5 line-clamp-1 text-2xs text-muted-foreground">{review.body}</p>
      </div>
    ),
  },
  {
    key: "author",
    header: "Author",
    width: "w-44",
    render: (review) => (
      <div className="min-w-0">
        <p className="truncate">{review.authorName}</p>
        <p className="truncate text-2xs text-muted-foreground">
          {review.authorRole} · {review.authorIndustry}
        </p>
      </div>
    ),
  },
  {
    key: "product",
    header: "Product",
    width: "w-44",
    render: (review) => (
      <Link
        href={`/product/${review.productSlug}`}
        className="block truncate rounded-[3px] transition-colors hover:text-primary"
      >
        {review.productSlug}
      </Link>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    width: "w-24",
    align: "center",
    render: (review) => (
      <div className="flex items-center justify-center gap-1.5">
        <StarRating rating={review.rating} size={11} />
        <span className="text-2xs tnum">{formatRating(review.rating)}</span>
      </div>
    ),
  },
  {
    key: "verification",
    header: "Provenance",
    width: "w-32",
    render: (review) => <VerificationBadge verification={review.verification} />,
  },
  {
    key: "submitted",
    header: "Submitted",
    width: "w-28",
    align: "right",
    render: (review) => (
      <span className="whitespace-nowrap text-muted-foreground tnum">
        {relativeDate(review.createdAt)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "w-28",
    align: "right",
    render: (review) => <StatusPill status={review.status} />,
  },
  {
    key: "actions",
    header: "Decision",
    width: "w-56",
    align: "right",
    render: (review) => (
      <ModerationActions
        targetType="review"
        targetId={review.id}
        targetLabel={review.title}
      />
    ),
  },
];

const PRODUCT_COLUMNS: Column<Product>[] = [
  {
    key: "product",
    header: "Listing",
    render: (product) => (
      <div className="flex items-center gap-2.5">
        <ProductLogo name={product.name} domain={product.logoDomain} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium">{product.name}</p>
          <p className="truncate text-2xs text-muted-foreground">{product.companyName}</p>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    width: "w-44",
    render: (product) => (
      <span className="block truncate text-muted-foreground">{product.primaryCategoryName}</span>
    ),
  },
  {
    key: "website",
    header: "Domain",
    width: "w-40",
    render: (product) => (
      <span className="block truncate text-muted-foreground">{product.logoDomain}</span>
    ),
  },
  {
    key: "submitted",
    header: "Submitted",
    width: "w-28",
    align: "right",
    render: (product) => (
      <span className="whitespace-nowrap text-muted-foreground tnum">
        {relativeDate(product.createdAt)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "w-28",
    align: "right",
    render: (product) => <StatusPill status={product.status} />,
  },
  {
    key: "actions",
    header: "Decision",
    width: "w-56",
    align: "right",
    render: (product) => (
      <ModerationActions
        targetType="product"
        targetId={product.slug}
        targetLabel={product.name}
      />
    ),
  },
];

export default function AdminModerationPage() {
  const reviews = getModerationQueue(50);
  const products = getPendingProducts(50);
  const log = listModerationLog(12);
  const proposedEdits = listPendingListingEdits();

  const pending = reviews.filter((review) => review.status === "PENDING");
  const flagged = reviews.filter((review) => review.status === "FLAGGED");

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Queue"
        title="Review moderation"
        description={`${formatCount(pending.length)} pending · ${formatCount(flagged.length)} flagged. Oldest first, so nothing is starved.`}
      />

      <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
        <DataTable
          caption="Reviews awaiting a moderation decision"
          columns={REVIEW_COLUMNS}
          rows={reviews}
          getRowKey={(review) => review.id}
          rowClassName={(review) => (review.status === "FLAGGED" ? "bg-destructive-subtle" : undefined)}
          empty={
            <EmptyState
              icon={<ShieldCheck className="size-12" />}
              title="The queue is clear"
              description="No reviews are pending or flagged. New submissions will appear here."
            />
          }
        />
      </div>

      <section aria-labelledby="listings-heading">
        <SectionHeading
          id="listings-heading"
          eyebrow="Queue"
          title="Listing approvals"
          description="New and edited listings awaiting approval before they go live."
        />

        <div className="mt-4 overflow-hidden rounded-card border border-border bg-card shadow-card">
          <DataTable
            caption="Product listings awaiting approval"
            columns={PRODUCT_COLUMNS}
            rows={products}
            getRowKey={(product) => product.slug}
            empty={
              <EmptyState
                icon={<Package className="size-12" />}
                title="No listings waiting"
                description="Every submitted listing has been reviewed."
              />
            }
          />
        </div>
      </section>

      <section aria-labelledby="proposed-heading">
        <SectionHeading
          id="proposed-heading"
          eyebrow="Queue"
          title="Proposed listing changes"
          description="Vendor-submitted copy, awaiting a decision. Nothing here touches a rating, a review count or feature coverage — those feed the score and are not vendor-editable."
        />

        {proposedEdits.length === 0 ? (
          <p className="mt-4 text-13 text-muted-foreground">
            No pending proposals. Copy a vendor submits from the vendor portal appears here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card">
            {proposedEdits.map((edit) => (
              <li key={edit.id} className="space-y-2 px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-13 font-medium">{edit.productName}</span>
                  <span className="text-2xs text-faint">{relativeDate(edit.proposedAt)}</span>
                </div>
                <p className="text-13 text-foreground">{edit.fields.tagline}</p>
                <p className="text-2xs leading-relaxed text-muted-foreground">
                  {edit.fields.shortDescription}
                </p>
                <ListingEditDecider editId={edit.id} productName={edit.productName} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="audit-heading">
        <SectionHeading
          id="audit-heading"
          eyebrow="Audit"
          title="Decision log"
          description="Append-only. Entries are never edited or removed, so a reversal shows up as a new row rather than an overwrite."
        />

        {log.length === 0 ? (
          <p className="mt-4 text-13 text-muted-foreground">
            No decisions recorded yet. Approve, reject or flag something above and it will appear
            here with the status it moved from and to.
          </p>
        ) : (
          <ol className="mt-4 divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card">
            {log.map((entry) => (
              <li key={entry.id} className="px-4 py-2.5">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-13 font-medium">{entry.action.toLowerCase()}</span>
                  <span className="min-w-0 flex-1 truncate text-13 text-muted-foreground">
                    {entry.targetLabel}
                  </span>
                  <span className="text-2xs tnum text-muted-foreground">
                    {entry.fromStatus} → {entry.toStatus}
                  </span>
                  <span className="text-2xs text-faint">{relativeDate(entry.decidedAt)}</span>
                </div>
                {/* The reason is the entire point of an audit log — a row that records only
                    PENDING → REJECTED cannot answer the question a vendor will actually ask.
                    It was being captured and then never shown. */}
                {entry.note && (
                  <p className="mt-1 text-2xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Reason:</span> {entry.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}

        <p className="mt-3 text-2xs text-muted-foreground">
          Decisions are live and persisted for the lifetime of this server process, but{" "}
          <span className="font-medium text-foreground">there is no authentication</span>, so every
          entry is recorded against a single <span className="font-mono">unauthenticated</span>{" "}
          actor. The log records that honestly rather than inventing a moderator identity — a
          trustworthy-looking audit trail that records a fiction is worse than none. Wiring a
          session principal in is the only change needed once auth lands.
        </p>
      </section>
    </div>
  );
}
