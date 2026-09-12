import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { DEMO_VENDOR_SLUG, VENDOR_NAV } from "@/lib/portals";
import { getCompany, getVendorMetrics } from "@/lib/data/repository";
import { ProductLogo } from "@/components/ui/avatar";
import { PortalNav, type PortalNavItem } from "@/components/layout/PortalNav";
import { DemoDataNotice, VerifiedPublisherBadge } from "@/components/domain/atoms";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: { default: "Vendor portal", template: "%s · Vendor portal" },
  // A portal with no authentication must never be indexed.
  robots: { index: false, follow: false },
};

/**
 * The whole vendor area reads mutable state — the lead store backs the inbox, the KPI
 * counts and the nav badges. Prerendering it would freeze those numbers at build time,
 * so a newly submitted enquiry would never appear. Force the segment dynamic.
 */
export const dynamic = "force-dynamic";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const company = getCompany(DEMO_VENDOR_SLUG);
  if (!company) notFound();

  const metrics = getVendorMetrics(DEMO_VENDOR_SLUG);

  const navItems: PortalNavItem[] = VENDOR_NAV.map((item) => ({
    ...item,
    count: item.label === "Leads" ? metrics.leads30d : undefined,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="rounded-card border border-border bg-card shadow-card">
        {/* ------------------------------------------------------ identity */}
        <div className="flex flex-wrap items-center gap-4 border-b border-border p-5">
          <ProductLogo name={company.name} domain={company.logoDomain} size="lg" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-[-0.02em]">{company.name}</h1>
              {company.verifiedPublisher && <VerifiedPublisherBadge />}
              <Badge variant="neutral" size="md">
                Vendor portal
              </Badge>
            </div>
            <p className="mt-1 text-13 text-muted-foreground">
              {company.productCount} {company.productCount === 1 ? "listing" : "listings"} ·{" "}
              {company.hqCity}, {company.hqCountry} · {company.employeeCount} employees
            </p>
          </div>

          <Link
            href={`/search?q=${encodeURIComponent(company.name)}`}
            className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-1.5 text-13 font-medium transition-colors hover:bg-muted"
          >
            View public listings
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* ---------------------------------------------------------- body */}
        <div className="grid gap-6 p-5 lg:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="lg:border-r lg:border-border lg:pr-5">
            <PortalNav items={navItems} ariaLabel="Vendor portal" />
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
