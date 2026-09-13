import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { getSocialProof } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/ui/navigation";
import { SectionHeading } from "@/components/ui/content";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/ui/content";

export const metadata: Metadata = {
  title: "About the directory",
  description:
    "Who builds this directory, how listings are sourced and maintained, and how vendors can get their product included.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const proof = getSocialProof();

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <header className="mt-4">
        <p className="label-caps text-muted-foreground">About</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
          A software directory that shows its work
        </h1>
        <p className="mt-3 text-body leading-relaxed text-muted-foreground">
          Most software directories are ranked lists with an opaque ordering. This one publishes the
          formula, labels every commercial relationship, and shows the distribution behind every
          average. If a ranking cannot be explained, it does not belong here.
        </p>
      </header>

      <section className="mt-8" aria-labelledby="scale-heading">
        <h2 id="scale-heading" className="sr-only">
          Directory at a glance
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <KpiCard label="Products" value={formatCount(proof.totalProducts)} />
          <KpiCard label="Reviews" value={formatCount(proof.totalReviews)} />
          <KpiCard label="Categories" value={formatCount(proof.totalCategories)} />
        </div>
      </section>

      <section className="mt-10" aria-labelledby="sourcing-heading">
        <SectionHeading
          id="sourcing-heading"
          eyebrow="Listings"
          title="How products get listed"
        />
        <div className="mt-5 space-y-4 text-13 leading-relaxed text-muted-foreground">
          <p>
            Listings are compiled editorially. We research the vendors that buyers actually evaluate
            in a category, then record their pricing, deployment models, supported company sizes,
            tracked capabilities and integrations from primary sources — the vendor’s own pricing
            page and documentation, not a press release or a third-party summary.
          </p>
          <p>
            <span className="font-medium text-foreground">Listing is free.</span> Vendors do not pay
            to be included, and inclusion is not conditioned on any commercial relationship. Vendors
            can claim their listing to correct factual errors; corrections are applied uniformly and
            never touch the composite score, the review text, or the ordering of a category.
          </p>
          <p>
            A listing is not an endorsement. A high score means a product performed well against the
            published criteria — it does not mean it is the right choice for your team, which is why
            every category page carries segment filters and every product page states who the
            product is not for.
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="vendors-heading">
        <SectionHeading
          id="vendors-heading"
          eyebrow="For vendors"
          title="Get listed or claim your profile"
        />
        <div className="mt-5 space-y-4 text-13 leading-relaxed text-muted-foreground">
          <p>
            If your product belongs in a category we cover and is not listed, tell us. If it is
            listed and something is wrong — pricing has changed, a capability shipped, the company
            details are stale — claim the profile and correct it.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/vendor">
              Open the vendor portal
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/methodology">Read the ranking methodology</Link>
          </Button>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="corrections-heading">
        <SectionHeading
          id="corrections-heading"
          eyebrow="Corrections"
          title="Found something wrong?"
        />
        <p className="mt-5 text-13 leading-relaxed text-muted-foreground">
          Factual corrections take priority over everything else on the roadmap. Use the contact form
          on any product page and select the relevant intent — corrections are triaged ahead of
          feature requests and are applied to the listing directly.
        </p>
      </section>

      <footer className="mt-12 border-t border-border pt-6">
        <p className="text-13 text-muted-foreground">
          See also our{" "}
          <Link href="/terms" className="text-primary underline-offset-2 hover:underline">
            terms of use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
