import Link from "next/link";
import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { formatCount, relativeDate } from "@/lib/utils";
import { DEMO_VENDOR_SLUG } from "@/lib/portals";
import { getCompanyProducts, listLeads } from "@/lib/data/repository";
import type { LeadStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/ui/table";
import { EmptyState, SectionHeading } from "@/components/ui/content";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import type { Lead } from "@/lib/data/types";

export const metadata: Metadata = { title: "Enquiries" };

const STATUS_FILTERS: { value: LeadStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CLOSED", label: "Closed" },
  { value: "SPAM", label: "Spam" },
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  GET_PRICING: "Pricing",
  REQUEST_DEMO: "Demo",
  EXPERT_RECOMMENDATION: "Recommendation",
  VISIT_WEBSITE: "Website visit",
  COMPARISON_EMAIL: "Comparison",
};

type PageProps = { searchParams: Promise<{ status?: string }> };

export default async function VendorLeadsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.status?.toUpperCase();
  const active: LeadStatus | "ALL" = STATUS_FILTERS.some((f) => f.value === raw)
    ? (raw as LeadStatus)
    : "ALL";

  const products = getCompanyProducts(DEMO_VENDOR_SLUG);
  const productSlugs = new Set(products.map((p) => p.slug));

  // Scope to this vendor before filtering, so the counts on the chips describe the
  // vendor's own inbox rather than the whole platform.
  const scoped = listLeads().filter((lead) => lead.productSlug && productSlugs.has(lead.productSlug));
  const rows = active === "ALL" ? scoped : scoped.filter((lead) => lead.status === active);

  const countFor = (status: LeadStatus | "ALL") =>
    status === "ALL" ? scoped.length : scoped.filter((l) => l.status === status).length;

  const columns: Column<Lead>[] = [
    {
      key: "contact",
      header: "Contact",
      render: (lead) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{lead.name}</p>
          <p className="truncate text-2xs text-muted-foreground">{lead.email}</p>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      width: "w-36",
      render: (lead) => (
        <span className="block truncate text-muted-foreground">{lead.company ?? "—"}</span>
      ),
    },
    {
      key: "product",
      header: "Product",
      width: "w-48",
      render: (lead) => (
        <span className="block truncate">
          {lead.productSlug ? (
            <Link
              href={`/product/${lead.productSlug}`}
              className="rounded-[3px] transition-colors hover:text-primary"
            >
              {lead.productName}
            </Link>
          ) : (
            "—"
          )}
        </span>
      ),
    },
    {
      key: "type",
      header: "Intent",
      width: "w-32",
      render: (lead) => (
        <span className="text-muted-foreground">
          {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      width: "w-40",
      render: (lead) => (
        <code className="rounded-[4px] bg-muted px-1.5 py-0.5 text-2xs text-muted-foreground">
          {lead.sourceLocation}
        </code>
      ),
    },
    {
      key: "received",
      header: "Received",
      width: "w-28",
      align: "right",
      render: (lead) => (
        <span className="whitespace-nowrap text-muted-foreground tnum">
          {relativeDate(lead.createdAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-40",
      align: "right",
      render: (lead) => (
        <LeadStatusSelect leadId={lead.id} contact={lead.name} status={lead.status} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Inbox"
        title="Enquiries"
        description="Every enquiry submitted from one of your listings, newest first."
      />

      {/* --------------------------------------------------------- filters */}
      <nav aria-label="Filter enquiries by status">
        <ul className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((filter) => {
            const isActive = filter.value === active;
            const count = countFor(filter.value);
            return (
              <li key={filter.value}>
                <Link
                  href={
                    filter.value === "ALL" ? "/vendor/leads" : `/vendor/leads?status=${filter.value}`
                  }
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-13 font-medium transition-colors",
                    isActive
                      ? "border-primary-border bg-primary-subtle text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {filter.label}
                  <span className="text-2xs tnum">{formatCount(count)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ----------------------------------------------------------- table */}
      <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
        <DataTable
          caption="Enquiries submitted from this vendor's listings"
          columns={columns}
          rows={rows}
          getRowKey={(lead) => lead.id}
          empty={
            <EmptyState
              icon={<Inbox className="size-12" />}
              title={active === "ALL" ? "No enquiries yet" : `No ${active.toLowerCase()} enquiries`}
              description={
                active === "ALL"
                  ? "Enquiries submitted from your product pages will appear here."
                  : "Try a different status filter to see the rest of your inbox."
              }
            />
          }
        />
      </div>

      <p className="text-2xs text-muted-foreground">
        Enquiries are stored in memory for this demonstration build. Status changes, assignment and
        export are not implemented — they require the authenticated vendor API, which is outside the
        scope of the current build.
      </p>
    </div>
  );
}
