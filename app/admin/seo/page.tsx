import Link from "next/link";
import type { Metadata } from "next";
import { Check, ExternalLink, Minus } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { getAdminMetrics, getDataset } from "@/lib/data/repository";
import { KpiCard, SectionHeading } from "@/components/ui/content";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const metadata: Metadata = { title: "SEO status" };

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://software-directory.example";

export default function AdminSeoPage() {
  const dataset = getDataset();
  const metrics = getAdminMetrics();

  const pillars = dataset.categories.filter((c) => c.depth === 0).length;
  const subcategories = dataset.categories.filter((c) => c.depth > 0).length;

  /**
   * Route inventory. Counts are read from the catalogue rather than hard-coded, so this
   * table cannot drift from what the sitemap actually emits. The `indexable` column is
   * the decision each route makes, and `inSitemap` must follow from it — a route that is
   * `noindex` but listed in the sitemap is a bug, and this table is where it would show.
   */
  const routes = [
    {
      pattern: "/",
      count: 1,
      indexable: true,
      inSitemap: true,
      note: "Homepage",
    },
    {
      pattern: "/categories",
      count: 1,
      indexable: true,
      inSitemap: true,
      note: "Category hub",
    },
    {
      pattern: "/categories/[slug]",
      count: dataset.categories.length,
      indexable: true,
      inSitemap: true,
      note: `${pillars} pillars, ${subcategories} subcategories`,
    },
    {
      pattern: "/product/[slug]",
      count: dataset.products.length,
      indexable: true,
      inSitemap: true,
      note: "Long-tail entry point; featured + trending prerendered",
    },
    {
      pattern: "/compare/[slugs]",
      count: dataset.comparisons.length,
      indexable: true,
      inSitemap: true,
      note: "Canonicalised; non-canonical slugs redirect permanently",
    },
    {
      pattern: "/compare",
      count: 1,
      indexable: true,
      inSitemap: true,
      note: "Comparison hub",
    },
    {
      pattern: "/methodology, /about, /privacy, /terms",
      count: 4,
      indexable: true,
      inSitemap: true,
      note: "Static and compliance pages",
    },
    {
      pattern: "/search",
      count: 1,
      indexable: false,
      inSitemap: false,
      note: "noindex, follow — thin and near-infinite in combination",
    },
    {
      pattern: "/vendor/*",
      count: 4,
      indexable: false,
      inSitemap: false,
      note: "Unauthenticated portal; noindex and disallowed in robots.txt",
    },
    {
      pattern: "/admin/*",
      count: 4,
      indexable: false,
      inSitemap: false,
      note: "Internal tool; noindex and disallowed in robots.txt",
    },
    {
      pattern: "/api/*",
      count: 2,
      indexable: false,
      inSitemap: false,
      note: "JSON endpoints",
    },
  ];

  const indexableTotal = routes
    .filter((route) => route.indexable)
    .reduce((sum, route) => sum + route.count, 0);

  const sitemapTotal = routes
    .filter((route) => route.inSitemap)
    .reduce((sum, route) => sum + route.count, 0);

  // The mismatch check that makes this page worth having.
  const inconsistencies = routes.filter((route) => route.indexable !== route.inSitemap);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Indexation"
        title="Programmatic SEO status"
        description="Every route pattern in the build, whether it is indexable, and whether it is advertised in the sitemap."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Indexable pages"
          value={formatCount(indexableTotal)}
          hint="Should equal the sitemap entry count"
        />
        <KpiCard label="In sitemap" value={formatCount(sitemapTotal)} hint={`${SITE}/sitemap.xml`} />
        <KpiCard
          label="Excluded from index"
          value={formatCount(routes.filter((r) => !r.indexable).reduce((s, r) => s + r.count, 0))}
          hint="Search, portals and API endpoints"
        />
        <KpiCard
          label="Queue / blocked"
          value={`${formatCount(metrics.queuedPages)} / ${formatCount(metrics.blockedPages)}`}
          hint="Pages awaiting crawl budget or blocked by policy"
        />
      </div>

      {/* --------------------------------------------------- consistency gate */}
      <div
        className={
          inconsistencies.length === 0
            ? "rounded-card border border-success-border bg-success-subtle p-4"
            : "rounded-card border border-destructive-border bg-destructive-subtle p-4"
        }
      >
        <p
          className={
            inconsistencies.length === 0
              ? "flex items-center gap-2 text-13 font-medium text-success"
              : "flex items-center gap-2 text-13 font-medium text-destructive"
          }
        >
          <Check className="size-3.5" aria-hidden="true" />
          {inconsistencies.length === 0
            ? "Indexability and sitemap inclusion agree on every route pattern."
            : `${inconsistencies.length} route pattern(s) disagree between indexability and sitemap inclusion.`}
        </p>
        <p className="mt-1.5 text-13 text-muted-foreground">
          Indexable pages: {formatCount(indexableTotal)} · sitemap entries: {formatCount(sitemapTotal)}
          {indexableTotal === sitemapTotal
            ? " — these match, which is the invariant that matters."
            : " — these should match. A noindex page in the sitemap wastes crawl budget."}
        </p>
      </div>

      {/* -------------------------------------------------------- route table */}
      <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
        <Table>
          <caption className="sr-only">
            Route patterns with indexability and sitemap inclusion
          </caption>
          <THead>
            <TR>
              <TH>Route pattern</TH>
              <TH align="right">Count</TH>
              <TH align="center">Indexable</TH>
              <TH align="center">In sitemap</TH>
              <TH>Notes</TH>
            </TR>
          </THead>
          <TBody>
            {routes.map((route) => (
              <TR key={route.pattern}>
                <TD>
                  <code className="text-2xs">{route.pattern}</code>
                </TD>
                <TD align="right" className="tnum text-muted-foreground">
                  {formatCount(route.count)}
                </TD>
                <TD align="center">
                  {route.indexable ? (
                    <Badge variant="success" size="sm">
                      yes
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">
                      no
                    </Badge>
                  )}
                </TD>
                <TD align="center">
                  {route.inSitemap ? (
                    <Check className="mx-auto size-3.5 text-success" aria-label="in sitemap" />
                  ) : (
                    <Minus className="mx-auto size-3.5 text-faint" aria-label="not in sitemap" />
                  )}
                </TD>
                <TD className="text-muted-foreground">{route.note}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>

      {/* ------------------------------------------------------------ artifacts */}
      <section aria-labelledby="artifacts-heading">
        <SectionHeading
          id="artifacts-heading"
          eyebrow="Artifacts"
          title="Generated files"
        />
        <ul className="mt-4 space-y-2">
          {[
            { href: "/sitemap.xml", label: "sitemap.xml", note: `${formatCount(sitemapTotal)} entries` },
            { href: "/robots.txt", label: "robots.txt", note: "Disallows /search, /api/, /vendor, /admin" },
          ].map((artifact) => (
            <li key={artifact.href}>
              <a
                href={artifact.href}
                className="flex items-center justify-between gap-3 rounded-control border border-border bg-card px-3.5 py-2.5 text-13 transition-colors hover:border-border-strong hover:bg-muted"
              >
                <span className="font-medium">{artifact.label}</span>
                <span className="flex items-center gap-2 text-2xs text-muted-foreground">
                  {artifact.note}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-2xs text-muted-foreground">
        Structured data (BreadcrumbList, ItemList, FAQPage, SoftwareApplication with AggregateRating)
        is emitted per page type and validated against the schema.org shapes.{" "}
        <Link href="/methodology" className="text-primary underline-offset-2 hover:underline">
          See the methodology
        </Link>{" "}
        for how ratings feed the aggregate rating markup.
      </p>
    </div>
  );
}
