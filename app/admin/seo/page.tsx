import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, Check, ExternalLink, Minus } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { getAdminMetrics, getDataset } from "@/lib/data/repository";
import { KpiCard, SectionHeading } from "@/components/ui/content";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

export const metadata: Metadata = { title: "SEO status" };

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://software-directory.example";

/**
 * HOW THE CONSISTENCY CHECK WORKS, AND WHY IT WAS REWRITTEN
 *
 * This page previously declared its inventory by hand — each row carrying an
 * `indexable` boolean and an `inSitemap` boolean — and then checked them against
 * each other:
 *
 *     const inconsistencies = routes.filter((r) => r.indexable !== r.inSitemap);
 *
 * Every row was written with those two flags already equal, so the expression
 * was comparing a literal to another literal in the same object literal. It
 * could not fail. It reported a clean bill of health while /graph was indexable,
 * absent from sitemap.xml, and absent from robots.txt — a real inconsistency the
 * check was structurally blind to. A guard that cannot fail is worse than no
 * guard, because it buys confidence it has not earned.
 *
 * It now reads the actual generators. `sitemap()` and `robots()` are the same
 * functions Next calls to emit /sitemap.xml and /robots.txt, so the comparison is
 * against the artifacts themselves rather than against a second copy of the
 * author's intent. Four things are checked:
 *
 *   1. membership  — a row marked indexable must appear in the sitemap, and a row
 *                    marked excluded must not
 *   2. robots      — every prefix robots.txt disallows must have a row here, and
 *                    that row must be marked excluded
 *   3. reverse     — every row marked excluded must also be disallowed in
 *                    robots.txt, so the agreement holds in both directions
 *   4. coverage    — every path the sitemap emits must be claimed by some row, so
 *                    a new route cannot be added without being accounted for
 *
 * Adding a route to sitemap.ts or robots.ts without a row here now turns this
 * page red. That is the whole point.
 */

interface RouteEntry {
  pattern: string;
  count: number;
  /** Concrete paths from this group, looked up in the real sitemap. */
  samples: string[];
  /** Prefixes this row is responsible for when checking sitemap coverage. */
  covers: string[];
  indexable: boolean;
  note: string;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export default function AdminSeoPage() {
  const dataset = getDataset();
  const metrics = getAdminMetrics();

  const pillars = dataset.categories.filter((c) => c.depth === 0).length;
  const subcategories = dataset.categories.filter((c) => c.depth > 0).length;

  /* ------------------------------------------------------------ ground truth */

  /** Every pathname the sitemap generator actually emits. */
  const sitemapPaths = new Set(sitemap().map((entry) => new URL(entry.url).pathname));

  /** Every prefix robots.txt actually disallows. */
  const robotsConfig = robots();
  const ruleList = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];
  const disallowed = ruleList.flatMap((rule) => toArray(rule.disallow));

  /* -------------------------------------------------------------- inventory */

  const firstCategory = dataset.categories[0]?.slug;
  const firstProduct = dataset.products[0]?.slug;
  const firstComparison = dataset.comparisons[0]?.slug;

  const routes: RouteEntry[] = [
    {
      pattern: "/",
      count: 1,
      samples: ["/"],
      covers: ["/"],
      indexable: true,
      note: "Homepage",
    },
    {
      pattern: "/categories",
      count: 1,
      samples: ["/categories"],
      covers: ["/categories"],
      indexable: true,
      note: "Category hub",
    },
    {
      pattern: "/categories/[slug]",
      count: dataset.categories.length,
      samples: firstCategory ? [`/categories/${firstCategory}`] : [],
      covers: ["/categories/"],
      indexable: true,
      note: `${pillars} pillars, ${subcategories} subcategories`,
    },
    {
      pattern: "/product/[slug]",
      count: dataset.products.length,
      samples: firstProduct ? [`/product/${firstProduct}`] : [],
      covers: ["/product/"],
      indexable: true,
      note: "Long-tail entry point; featured + trending prerendered",
    },
    {
      pattern: "/compare/[slugs]",
      count: dataset.comparisons.length,
      samples: firstComparison ? [`/compare/${firstComparison}`] : [],
      covers: ["/compare/"],
      indexable: true,
      note: "Canonicalised; non-canonical slugs redirect permanently",
    },
    {
      pattern: "/compare",
      count: 1,
      samples: ["/compare"],
      covers: ["/compare"],
      indexable: true,
      note: "Comparison hub",
    },
    {
      pattern: "/methodology, /about, /privacy, /terms",
      count: 4,
      samples: ["/methodology", "/about", "/privacy", "/terms"],
      covers: ["/methodology", "/about", "/privacy", "/terms"],
      indexable: true,
      note: "Static and compliance pages",
    },
    {
      pattern: "/search",
      count: 1,
      samples: ["/search"],
      covers: ["/search"],
      indexable: false,
      note: "noindex, follow — thin and near-infinite in combination",
    },
    {
      pattern: "/graph",
      count: 1,
      samples: ["/graph"],
      covers: ["/graph"],
      indexable: false,
      note: "Knowledge graph of this project's own source — no value in an index",
    },
    {
      pattern: "/vendor/*",
      count: 4,
      samples: ["/vendor"],
      covers: ["/vendor"],
      indexable: false,
      note: "Unauthenticated portal; noindex and disallowed in robots.txt",
    },
    {
      pattern: "/admin/*",
      count: 4,
      samples: ["/admin"],
      covers: ["/admin"],
      indexable: false,
      note: "Internal tool; noindex and disallowed in robots.txt",
    },
    {
      pattern: "/api/*",
      count: 2,
      samples: ["/api/search"],
      covers: ["/api/"],
      indexable: false,
      note: "JSON endpoints",
    },
  ];

  /* ----------------------------------------------------------------- checks */

  const mismatches: string[] = [];

  // 1. A row's indexable flag must match its real sitemap membership.
  for (const route of routes) {
    const present = route.samples.filter((path) => sitemapPaths.has(path));
    const expected = route.indexable ? route.samples.length : 0;
    if (present.length !== expected) {
      mismatches.push(
        `${route.pattern} is marked ${route.indexable ? "indexable" : "excluded"}, but ` +
          `${present.length} of ${route.samples.length} sampled path(s) appear in sitemap.xml`,
      );
    }
  }

  // 2. robots.txt and this table must agree about what is excluded.
  for (const prefix of disallowed) {
    const owner = routes.find((route) => route.covers.includes(prefix));
    if (!owner) {
      mismatches.push(
        `${prefix} is disallowed in robots.txt but has no row in this inventory`,
      );
    } else if (owner.indexable) {
      mismatches.push(
        `${prefix} is disallowed in robots.txt but its row is marked indexable`,
      );
    }
  }

  // 2b. ...and the agreement has to hold in the other direction too. A row this
  //     table excludes from the index should also be kept out by robots.txt —
  //     that is the policy robots.ts documents. Checking only one direction
  //     would miss a row that quietly stopped being disallowed.
  for (const route of routes) {
    if (route.indexable) continue;
    if (!route.covers.some((cover) => disallowed.includes(cover))) {
      mismatches.push(
        `${route.pattern} is marked excluded from the index but is not disallowed in robots.txt`,
      );
    }
  }

  // 3. Nothing may reach the sitemap without being accounted for here.
  const isClaimed = (path: string) =>
    routes.some((route) =>
      route.covers.some((cover) =>
        cover === "/" ? path === "/" : path === cover || path.startsWith(cover),
      ),
    );

  for (const path of sitemapPaths) {
    if (!isClaimed(path)) {
      mismatches.push(`${path} is in sitemap.xml but no row in this inventory claims it`);
    }
  }

  /* ------------------------------------------------------------------ totals */

  const indexableTotal = routes
    .filter((route) => route.indexable)
    .reduce((sum, route) => sum + route.count, 0);

  const excludedTotal = routes
    .filter((route) => !route.indexable)
    .reduce((sum, route) => sum + route.count, 0);

  const sitemapTotal = sitemapPaths.size;

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Indexation"
        title="Programmatic SEO status"
        description="Every route pattern in the build, whether it is indexable, and whether it is advertised in the sitemap — checked against the generators themselves."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Indexable pages"
          value={formatCount(indexableTotal)}
          hint="Should equal the sitemap entry count"
        />
        <KpiCard
          label="In sitemap"
          value={formatCount(sitemapTotal)}
          hint={`${SITE}/sitemap.xml`}
        />
        <KpiCard
          label="Excluded from index"
          value={formatCount(excludedTotal)}
          hint="Search, graph, portals and API endpoints"
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
          mismatches.length === 0
            ? "rounded-card border border-success-border bg-success-subtle p-4"
            : "rounded-card border border-destructive-border bg-destructive-subtle p-4"
        }
      >
        <p
          className={
            mismatches.length === 0
              ? "flex items-center gap-2 text-13 font-medium text-success"
              : "flex items-center gap-2 text-13 font-medium text-destructive"
          }
        >
          {mismatches.length === 0 ? (
            <>
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
              sitemap.xml, robots.txt and this inventory agree.
            </>
          ) : (
            <>
              <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
              {mismatches.length} disagreement{mismatches.length === 1 ? "" : "s"} between the
              generated artifacts and this inventory.
            </>
          )}
        </p>
        <p className="mt-1.5 text-13 text-muted-foreground">
          Indexable pages: {formatCount(indexableTotal)} · sitemap entries:{" "}
          {formatCount(sitemapTotal)}
          {indexableTotal === sitemapTotal
            ? " — these match."
            : " — these should match. A noindex page in the sitemap wastes crawl budget."}
        </p>
        {mismatches.length > 0 && (
          <ul className="mt-2.5 space-y-1.5">
            {mismatches.map((mismatch) => (
              <li key={mismatch} className="flex gap-2 text-13 text-destructive">
                <span aria-hidden="true">·</span>
                <span>{mismatch}</span>
              </li>
            ))}
          </ul>
        )}
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
            {routes.map((route) => {
              const present = route.samples.filter((path) => sitemapPaths.has(path)).length;
              const agrees = route.indexable ? present === route.samples.length : present === 0;

              return (
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
                    {present > 0 ? (
                      <Check className="mx-auto size-3.5 text-success" aria-label="in sitemap" />
                    ) : (
                      <Minus className="mx-auto size-3.5 text-faint" aria-label="not in sitemap" />
                    )}
                    {!agrees && (
                      <span className="sr-only">
                        — does not match the indexable flag on this row
                      </span>
                    )}
                  </TD>
                  <TD className="text-muted-foreground">{route.note}</TD>
                </TR>
              );
            })}
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
            {
              href: "/sitemap.xml",
              label: "sitemap.xml",
              note: `${formatCount(sitemapTotal)} entries`,
            },
            {
              href: "/robots.txt",
              label: "robots.txt",
              note: `Disallows ${disallowed.join(", ")}`,
            },
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
