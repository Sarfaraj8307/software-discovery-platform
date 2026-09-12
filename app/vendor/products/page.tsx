import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, Package } from "lucide-react";
import { formatCount, formatRating, relativeDate } from "@/lib/utils";
import { DEMO_VENDOR_SLUG } from "@/lib/portals";
import { getCompanyProducts } from "@/lib/data/repository";
import type { Product } from "@/lib/data/types";
import { DataTable, StatusPill, type Column } from "@/components/ui/table";
import { EmptyState, ProgressBar, SectionHeading } from "@/components/ui/content";
import { ProductLogo } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/domain/atoms";

export const metadata: Metadata = { title: "Listings" };

/**
 * Listing completeness.
 *
 * Vendors cannot edit their score, so the useful thing this page can show them is what
 * is *missing* from a listing — the fields a buyer looks for and that a vendor actually
 * controls. It is computed from the record rather than stored, so it can never drift
 * from reality.
 */
function completeness(product: Product): { filled: number; total: number; missing: string[] } {
  const checks: [string, boolean][] = [
    ["Description", product.description.trim().length > 200],
    ["Tagline", product.tagline.trim().length > 0],
    ["Pricing plans", product.pricingPlans.length > 0],
    ["Screenshots", product.screenshots.length > 0],
    ["Tracked features", product.featureSlugs.length > 0],
    ["Integrations", product.integrationSlugs.length > 0],
    ["Pros and cons", product.pros.length > 0 && product.cons.length > 0],
    ["FAQs", product.faqs.length > 0],
    ["Website", product.website.trim().length > 0],
  ];

  const missing = checks.filter(([, ok]) => !ok).map(([label]) => label);
  return { filled: checks.length - missing.length, total: checks.length, missing };
}

export default function VendorProductsPage() {
  const products = getCompanyProducts(DEMO_VENDOR_SLUG);

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Listing",
      render: (product) => (
        <div className="flex items-center gap-2.5">
          <ProductLogo name={product.name} domain={product.logoDomain} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium">
              <Link
                href={`/product/${product.slug}`}
                className="rounded-[3px] transition-colors hover:text-primary"
              >
                {product.name}
              </Link>
            </p>
            <p className="truncate text-2xs text-muted-foreground">
              {product.primaryCategoryName}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      render: (product) => <StatusPill status={product.status} />,
    },
    {
      key: "score",
      header: "Score",
      width: "w-24",
      align: "center",
      render: (product) => <ScoreBadge score={product.score} />,
    },
    {
      key: "rating",
      header: "Rating",
      width: "w-28",
      align: "right",
      render: (product) => (
        <span className="tnum">
          {formatRating(product.ratingAvg)}
          <span className="ml-1 text-2xs text-muted-foreground">
            ({formatCount(product.ratingCount)})
          </span>
        </span>
      ),
    },
    {
      key: "views",
      header: "Views",
      width: "w-20",
      align: "right",
      render: (product) => (
        <span className="text-muted-foreground tnum">{formatCount(product.profileViews)}</span>
      ),
    },
    {
      key: "completeness",
      header: "Completeness",
      width: "w-40",
      render: (product) => {
        const { filled, total, missing } = completeness(product);
        const pct = Math.round((filled / total) * 100);
        return (
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xs text-muted-foreground tnum">{pct}%</span>
            </div>
            <ProgressBar
              className="mt-1"
              value={filled}
              max={total}
              label={`${product.name} listing is ${pct}% complete`}
              barClassName={pct === 100 ? "bg-success" : undefined}
            />
            {missing.length > 0 && (
              <p className="mt-1 truncate text-2xs text-warning" title={missing.join(", ")}>
                Missing: {missing.slice(0, 2).join(", ")}
                {missing.length > 2 && ` +${missing.length - 2}`}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "updated",
      header: "Updated",
      width: "w-28",
      align: "right",
      render: (product) => (
        <span className="whitespace-nowrap text-muted-foreground tnum">
          {relativeDate(product.updatedAt)}
        </span>
      ),
    },
    {
      key: "open",
      header: "",
      width: "w-12",
      align: "right",
      render: (product) => (
        <Link
          href={`/product/${product.slug}`}
          aria-label={`Open the public listing for ${product.name}`}
          className="inline-flex size-7 items-center justify-center rounded-[5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </Link>
      ),
    },
  ];

  const pending = products.filter((p) => p.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Listings"
        title="Your products"
        description={
          pending > 0
            ? `${products.length} listings · ${pending} awaiting moderation review.`
            : `${products.length} listings, all approved.`
        }
      />

      {products.length > 0 && (
        <p className="rounded-card border border-border bg-subtle p-3.5 text-13 text-muted-foreground">
          Listing edits are reviewed before they go live. Moderation never changes a composite score
          or a ranking — it only checks that the listing is accurate and complete.
        </p>
      )}

      <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
        <DataTable
          caption="This vendor's product listings with moderation status and completeness"
          columns={columns}
          rows={products}
          getRowKey={(product) => product.slug}
          empty={
            <EmptyState
              icon={<Package className="size-12" />}
              title="No listings yet"
              description="Once a product is approved it will appear here with its moderation status and listing completeness."
            />
          }
        />
      </div>

      <p className="text-2xs text-muted-foreground">
        Completeness reflects the fields buyers look for. Editing is not available in this
        demonstration build — it requires the authenticated vendor API.
      </p>
    </div>
  );
}
