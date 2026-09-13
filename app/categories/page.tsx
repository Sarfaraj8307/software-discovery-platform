import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { getCategoriesHubData, getSocialProof } from "@/lib/data/queries";
import { CategoryCard, CategoryRow } from "@/components/cards/CategoryCard";
import { CategoryIcon } from "@/components/domain/icon";
import { Breadcrumbs } from "@/components/ui/navigation";
import { TrustBar } from "@/components/layout/TrustBar";
import { SectionHeading } from "@/components/ui/content";
import { monthYear } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All software categories",
  description:
    "Browse every software category and subcategory in the directory, with product counts and independent rankings.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const { pillars, subcategories } = getCategoriesHubData();
  const proof = getSocialProof();
  const updated = monthYear("2026-09-12");

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <header className="mt-4">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">
          All software categories
        </h1>
        <p className="mt-2 max-w-3xl text-body leading-relaxed text-muted-foreground">
          {formatCount(pillars.length)} categories and {formatCount(subcategories.length)}{" "}
          subcategories, covering {formatCount(proof.totalProducts)} products. Every category page
          carries a published methodology, structured feature data and verified review counts.
        </p>
        <TrustBar
          className="mt-4"
          reviewCount={proof.verifiedReviews}
          productCount={proof.totalProducts}
          updatedLabel={updated}
        />
      </header>

      <section className="mt-10">
        <SectionHeading
          eyebrow="Top level"
          title="Categories"
          description="Start here if you have not yet narrowed your requirements."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <CategoryCard key={pillar.slug} category={pillar} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Subcategories"
          title="Narrow by subcategory"
          description="Use a subcategory page once you know the specific capability you are buying."
        />

        <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.slug} className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[6px] border border-border bg-subtle text-muted-foreground">
                  <CategoryIcon name={pillar.icon} className="size-3.5" />
                </span>
                <h3 className="min-w-0 text-13 font-semibold">
                  <Link
                    href={`/categories/${pillar.slug}`}
                    className="rounded-[3px] transition-colors hover:text-primary"
                  >
                    {pillar.name}
                  </Link>
                </h3>
                <span className="ml-auto shrink-0 text-2xs text-faint tnum">
                  {formatCount(pillar.productCount)}
                </span>
              </div>

              <ul className="mt-1.5 border-l border-border pl-1">
                {pillar.children.map((sub) => (
                  <li key={sub.slug}>
                    <CategoryRow category={sub} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-card border border-border bg-subtle p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.01em]">
              Not sure which category fits?
            </h2>
            <p className="mt-1 max-w-xl text-13 text-muted-foreground">
              Search across every product, or tell us what you are trying to do and we will route
              your request to vendors that match.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/search"
              className="inline-flex h-9 items-center gap-1.5 rounded-control bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Search all software
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex h-9 items-center rounded-control border border-border-strong bg-card px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Comparison hub
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
