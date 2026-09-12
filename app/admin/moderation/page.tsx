import Link from "next/link";
import type { Metadata } from "next";
import { Package, ShieldCheck } from "lucide-react";
import { formatCount, formatRating, relativeDate } from "@/lib/utils";
import { getModerationQueue, getPendingProducts } from "@/lib/data/repository";
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
];

export default function AdminModerationPage() {
  const reviews = getModerationQueue(50);
  const products = getPendingProducts(50);

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

      <p className="text-2xs text-muted-foreground">
        Decisions are not wired up in this build. A production moderation tool needs the authenticated
        API plus an append-only audit log recording who decided what, and when — a queue without an
        audit trail is not defensible when a vendor disputes a rejection.
      </p>
    </div>
  );
}
