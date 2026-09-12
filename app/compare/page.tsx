import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { formatCount, monthYear } from "@/lib/utils";
import { getCompareHubData } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/ui/navigation";
import { SectionHeading } from "@/components/ui/content";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { CategoryCard } from "@/components/cards/CategoryCard";

export const metadata: Metadata = {
  title: "Compare software side by side",
  description:
    "Build a side-by-side comparison of any two to four software products, or start from one of the most-viewed comparisons in the directory.",
  alternates: { canonical: "/compare" },
};

export default function CompareHubPage() {
  const { trending, all, categories } = getCompareHubData();
  const updated = monthYear("2026-09-12");

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />

      <header className="mt-4">
        <p className="label-caps text-muted-foreground">Comparison engine</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
          Compare software side by side
        </h1>
        <p className="mt-2 max-w-3xl text-body leading-relaxed text-muted-foreground">
          Every row is drawn from the same structured feature and pricing data that powers our
          category rankings, so a difference you see here is a difference we can point to. Rows
          where the products agree are muted; rows where they genuinely diverge are not.
        </p>
      </header>

      {/* ------------------------------------------------- picker + trending */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ComparePicker />

        <section aria-labelledby="trending-heading" className="min-w-0">
          <div className="rounded-card border border-border bg-subtle p-5">
            <h2
              id="trending-heading"
              className="flex items-center gap-2 text-base font-semibold tracking-[-0.01em]"
            >
              <Scale className="size-4 text-primary" aria-hidden="true" />
              Most-viewed comparisons
            </h2>
            <p className="mt-1 text-13 text-muted-foreground">
              Ranked by reader interest over the last 30 days.
            </p>

            <ol className="mt-4 space-y-1.5">
              {trending.map((comparison, index) => (
                <li key={comparison.slug}>
                  <Link
                    href={`/compare/${comparison.slug}`}
                    className="flex items-baseline gap-3 rounded-control px-2 py-2 transition-colors hover:bg-card"
                  >
                    <span className="w-4 shrink-0 text-2xs font-semibold text-muted-foreground tnum">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-13 font-medium leading-snug">
                        {comparison.title}
                      </span>
                      <span className="mt-0.5 block text-2xs text-muted-foreground tnum">
                        {formatCount(comparison.views)} views
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      {/* ----------------------------------------------------- all comparisons */}
      <section className="mt-12" aria-labelledby="all-comparisons-heading">
        <SectionHeading
          id="all-comparisons-heading"
          eyebrow="Browse"
          title="Popular head-to-head comparisons"
          description="Curated pairings from every category, updated monthly."
        />
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((comparison) => (
            <li key={comparison.slug}>
              <Link
                href={`/compare/${comparison.slug}`}
                className="flex h-full items-center justify-between gap-3 rounded-card border border-border bg-card px-3.5 py-3 transition-colors hover:border-border-strong hover:bg-muted"
              >
                <span className="min-w-0 text-13 font-medium leading-snug">{comparison.title}</span>
                <ArrowRight
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------- by category */}
      <section className="mt-12" aria-labelledby="compare-categories-heading">
        <SectionHeading
          id="compare-categories-heading"
          eyebrow="By category"
          title="Compare within a category"
          description="The most useful comparisons put near-identical products head to head."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <p className="mt-10 border-t border-border pt-4 text-2xs text-muted-foreground">
        Comparison data last reviewed {updated}. Ratings and pricing are synthetic — see the
        methodology page for how scores are calculated.
      </p>
    </main>
  );
}
