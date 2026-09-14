import Link from "next/link";
import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { formatCount, relativeDate } from "@/lib/utils";
import { listLeads } from "@/lib/data/repository";
import { DEMO_OWNERS, type Lead, type LeadOwner, type LeadStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/ui/table";
import { EmptyState, SectionHeading } from "@/components/ui/content";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { LeadOwnerSelect } from "@/components/admin/LeadOwnerSelect";

export const metadata: Metadata = { title: "Lead routing" };

const STATUS_FILTERS: (LeadStatus | "ALL")[] = [
  "ALL",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
  "SPAM",
];

/**
 * Owner filter tokens. `UNASSIGNED` is the sentinel for `ownerId === null`; the three
 * real ids are the demo roster from `DEMO_OWNERS`. `ANY` is provided so an operator can
 * hide the unassigned backlog and see only routed work — same shape as `ALL` for status.
 */
type OwnerFilter = "ALL" | "UNASSIGNED" | "ANY" | LeadOwner;
const OWNER_FILTERS: { token: OwnerFilter; label: string }[] = [
  { token: "ALL", label: "All" },
  { token: "UNASSIGNED", label: "Unassigned" },
  ...DEMO_OWNERS.map((owner) => ({ token: owner.id as OwnerFilter, label: owner.name })),
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  GET_PRICING: "Pricing",
  REQUEST_DEMO: "Demo",
  EXPERT_RECOMMENDATION: "Recommendation",
  VISIT_WEBSITE: "Website visit",
  COMPARISON_EMAIL: "Comparison",
};

function ownerLabel(ownerId: LeadOwner | null): string {
  if (ownerId === null) return "Unassigned";
  return DEMO_OWNERS.find((o) => o.id === ownerId)?.name ?? ownerId;
}

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
    key: "owner",
    header: "Owner",
    width: "w-44",
    align: "right",
    render: (lead) => (
      <LeadOwnerSelect leadId={lead.id} contact={lead.name} ownerId={lead.ownerId} />
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

type PageProps = { searchParams: Promise<{ status?: string; owner?: string }> };

function resolveOwnerFilter(raw: string | undefined): OwnerFilter {
  if (!raw) return "ALL";
  const upper = raw.toUpperCase();
  if (upper === "ALL" || upper === "UNASSIGNED" || upper === "ANY") return upper;
  if (DEMO_OWNERS.some((o) => o.id === upper)) return upper as LeadOwner;
  return "ALL";
}

/**
 * Build the href for a filter pill so the active dimension is preserved while the other
 * is swapped. Empty target clears that dimension; non-empty sets it. Keeping this in
 * one place ensures the URL is always a coherent pair (`status=...&owner=...`) and never
 * drops the active filter when the operator changes the other one.
 */
function pillHref(target: { status?: LeadStatus | "ALL"; owner?: OwnerFilter }, current: {
  status: LeadStatus | "ALL";
  owner: OwnerFilter;
}): string {
  const nextStatus = target.status ?? current.status;
  const nextOwner = target.owner ?? current.owner;
  const params = new URLSearchParams();
  if (nextStatus !== "ALL") params.set("status", nextStatus);
  if (nextOwner !== "ALL") params.set("owner", nextOwner);
  const qs = params.toString();
  return qs ? `/admin/leads?${qs}` : "/admin/leads";
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawStatus = sp.status?.toUpperCase();
  const activeStatus: LeadStatus | "ALL" = STATUS_FILTERS.some((s) => s === rawStatus)
    ? (rawStatus as LeadStatus)
    : "ALL";
  const activeOwner = resolveOwnerFilter(sp.owner);

  const all = listLeads();
  const filtered = all.filter((lead) => {
    if (activeStatus !== "ALL" && lead.status !== activeStatus) return false;
    if (activeOwner === "UNASSIGNED" && lead.ownerId !== null) return false;
    if (activeOwner === "ANY" && lead.ownerId === null) return false;
    if (
      activeOwner !== "ALL" &&
      activeOwner !== "UNASSIGNED" &&
      activeOwner !== "ANY" &&
      lead.ownerId !== activeOwner
    ) {
      return false;
    }
    return true;
  });
  const rows = filtered;

  const countStatus = (status: LeadStatus | "ALL") =>
    status === "ALL"
      ? all.length
      : all.filter((l) => l.status === status).length;

  const countOwner = (owner: OwnerFilter) => {
    if (owner === "ALL") return all.length;
    if (owner === "UNASSIGNED") return all.filter((l) => l.ownerId === null).length;
    if (owner === "ANY") return all.filter((l) => l.ownerId !== null).length;
    return all.filter((l) => l.ownerId === owner).length;
  };

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
            const isActive = status === activeStatus;
            return (
              <li key={status}>
                <Link
                  href={pillHref({ status }, { status: activeStatus, owner: activeOwner })}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-13 font-medium transition-colors",
                    isActive
                      ? "border-primary-border bg-primary-subtle text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {status === "ALL" ? "All" : status.toLowerCase()}
                  <span className="text-2xs tnum">{formatCount(countStatus(status))}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Filter leads by owner">
        <ul className="flex flex-wrap gap-1.5">
          {OWNER_FILTERS.map(({ token, label }) => {
            const isActive = token === activeOwner;
            return (
              <li key={token}>
                <Link
                  href={pillHref({ owner: token }, { status: activeStatus, owner: activeOwner })}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-13 font-medium transition-colors",
                    isActive
                      ? "border-primary-border bg-primary-subtle text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {label}
                  <span className="text-2xs tnum">{formatCount(countOwner(token))}</span>
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
              title={activeStatus === "ALL" ? "No enquiries yet" : `No ${activeStatus.toLowerCase()} enquiries`}
              description="Enquiries submitted from any product page appear here immediately."
            />
          }
        />
      </div>

      <p className="text-2xs text-muted-foreground">
        Status and owner changes are live and persisted for the lifetime of this server process.
        The owner roster is a hardcoded{" "}
        <span className="font-medium text-foreground">illustrative demo</span> list (Alex
        Morgan, Jordan Nakamura, Riya Patel) — auth (P0.2) is the only honest way to replace
        it with a real user table, so the roster is labelled here rather than hidden. As
        with moderation, this surface is{" "}
        <span className="font-medium text-foreground">unauthenticated</span>: the route
        records no actor, because inventing one would make the record look more trustworthy
        than it is. The table reflects live submissions, so the contact form on any product
        page adds a row here. Showing all rows in {ownerLabel(null).toLowerCase()} state by
        default until a moderator assigns one.
      </p>
    </div>
  );
}