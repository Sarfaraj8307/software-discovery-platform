import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ADMIN_NAV } from "@/lib/portals";
import { getAdminMetrics } from "@/lib/data/repository";
import { PortalNav, type PortalNavItem } from "@/components/layout/PortalNav";
import { Badge } from "@/components/ui/badge";
import { DemoDataNotice } from "@/components/domain/atoms";

export const metadata: Metadata = {
  title: { default: "Moderation", template: "%s · Moderation" },
  // An internal tool must never be indexed.
  robots: { index: false, follow: false },
};

/** Reads the mutable lead store for its queue counts, so it must not be prerendered. */
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const metrics = getAdminMetrics();

  const navItems: PortalNavItem[] = ADMIN_NAV.map((item) => ({
    ...item,
    count:
      item.label === "Moderation"
        ? metrics.pendingReviews + metrics.pendingProducts
        : item.label === "Leads"
          ? metrics.newLeads
          : undefined,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="rounded-card border border-border bg-card shadow-card">
        {/* ------------------------------------------------------ identity */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-5">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-border bg-subtle text-muted-foreground">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-[-0.02em]">Moderation</h1>
              <Badge variant="warning" size="md" caps>
                Internal
              </Badge>
            </div>
            <p className="mt-0.5 text-13 text-muted-foreground">
              Review queue, listing approvals and indexation status.
            </p>
          </div>

          <dl className="flex flex-wrap gap-4">
            <div>
              <dt className="label-caps text-muted-foreground">Pending reviews</dt>
              <dd className="text-base font-semibold tnum">{metrics.pendingReviews}</dd>
            </div>
            <div>
              <dt className="label-caps text-muted-foreground">Pending listings</dt>
              <dd className="text-base font-semibold tnum">{metrics.pendingProducts}</dd>
            </div>
            <div>
              <dt className="label-caps text-muted-foreground">New leads</dt>
              <dd className="text-base font-semibold tnum">{metrics.newLeads}</dd>
            </div>
          </dl>
        </div>

        {/* ---------------------------------------------------------- body */}
        <div className="grid gap-6 p-5 lg:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="lg:border-r lg:border-border lg:pr-5">
            <PortalNav items={navItems} ariaLabel="Moderation" />
          </aside>

          {/* The skip link in the root layout targets #main, so the portal needs its own
              landmark — without it, keyboard users land on a link that goes nowhere. */}
          <main id="main" className="min-w-0">
            {children}
          </main>
        </div>
      </div>

      <DemoDataNotice className="mt-4" variant="banner" />
    </div>
  );
}
