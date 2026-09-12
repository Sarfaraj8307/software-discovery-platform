import Link from "next/link";
import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { formatCount, relativeDate } from "@/lib/utils";
import { listLeads } from "@/lib/data/repository";
import type { Lead, LeadStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { DataTable, StatusPill, type Column } from "@/components/ui/table";
import { EmptyState, SectionHeading } from "@/components/ui/content";

export const metadata: Metadata = { title: "Lead routing" };

const STATUS_FILTERS: (LeadStatus | "ALL")[] = [
  "ALL",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "SPAM",
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  GET_PRICING: "Pricing",
  REQUEST_DEMO: "Demo",
  EXPERT_RECOMMENDATION: "Recommendation",
  VISIT_WEBSITE: "Website visit",
  COMPARISON_EMAIL: "Comparison",
};

const COLUMNS: Column<Lead>[] = [
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
    width: "w-40",
    render: (lead) => (
      <span className="block truncate text-muted-foreground">{lead.company ?? "—"}</span>
    ),
  },
  {
    key: "product",
    header: "Product",
    width: "w-48",
    render: (lead) =>
      lead.productSlug ? (
        <Link
          href={`/product/${lead.productSlug}`}
          className="block truncate rounded-[3px] transition-colors hover:text-primary"
        >
          {lead.productName}
        </Link>
      ) : (
        <span className="text-muted-foreground">Unattributed</span>
      ),
  },
  {
    key: "type",
    header: "Intent",
    width: "w-32",
    render: (lead) => (
      <span className="text-muted-foreground">{LEAD_TYPE_LABELS[lead.type] ?? lead.type}</span>
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
    width: "w-28",
    align: "right",
    render: (lead) => <StatusPill status={lead.status} />,
  },
];

type PageProps = { searchParams: Promise<{ status?: string }> };

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.status?.toUpperCase();
  const active: LeadStatus | "ALL" = STATUS_FILTERS.some((s) => s === raw)
    ? (raw as LeadStatus)
    : "ALL";

  const all = listLeads();
  const rows = active === "ALL" ? all : all.filter((lead) => lead.status === active);

  const countFor = (status: LeadStatus | "ALL") =>
    status === "ALL" ? all.length : all.filter((l) => l.status === status).length;

  // A lead with no product is a routing failure, not a lead — surface the count so it
  // is visible rather than silently buried in the table.
  const unattributed = all.filter((lead) => !lead.productSlug).length;

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Pipeline"
        title="Lead routing"
        description={`${formatCount(all.length)} enquiries received across the directory.`}
      />

      {unattributed > 0 && (
        <p className="rounded-card border border-warning-border bg-warning-subtle p-3.5 text-13 text-warning">
          <span className="font-medium">{unattributed}</span>{" "}
          {unattributed === 1 ? "enquiry has" : "enquiries have"} no product attached and cannot be
          routed to a vendor. These usually come from a generic contact form.
        </p>
      )}

      <nav aria-label="Filter leads by status">
        <ul className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((status) => {
            const isActive = status === active;
            return (
              <li key={status}>
                <Link
                  href={status === "ALL" ? "/admin/leads" : `/admin/leads?status=${status}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-13 font-medium transition-colors",
                    isActive
                      ? "border-primary-border bg-primary-subtle text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {status === "ALL" ? "All" : status.toLowerCase()}
                  <span className="text-2xs tnum">{formatCount(countFor(status))}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
        <DataTable
          caption="All enquiries received across the directory"
          columns={COLUMNS}
          rows={rows}
          getRowKey={(lead) => lead.id}
          empty={
            <EmptyState
              icon={<Inbox className="size-12" />}
              title={active === "ALL" ? "No enquiries yet" : `No ${active.toLowerCase()} enquiries`}
              description="Enquiries submitted from any product page appear here immediately."
            />
          }
        />
      </div>

      <p className="text-2xs text-muted-foreground">
        Status transitions, assignment and vendor hand-off are not implemented in this build. The
        table reflects live submissions, so submitting the contact form on any product page will add
        a row here.
      </p>
    </div>
  );
}
