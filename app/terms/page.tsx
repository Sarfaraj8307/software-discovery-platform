import type { Metadata } from "next";
import Link from "next/link";
import { monthYear } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/navigation";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms that govern use of this software directory, including acceptable use, review policy and the limits of our liability.",
  alternates: { canonical: "/terms" },
  openGraph: {
    siteName: "Software Discovery",
    locale: "en_US",
    title: "Terms of use",
    description:
      "The terms that govern use of this software directory, including acceptable use, review policy and the limits of our liability.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of use",
    description:
      "The terms that govern use of this software directory, including acceptable use, review policy and the limits of our liability.",
  },
};

export default function TermsPage() {
  const updated = monthYear("2026-09-12");

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />

      <header className="mt-4">
        <p className="label-caps text-muted-foreground">Legal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Terms of use</h1>
        <p className="mt-2 text-2xs text-muted-foreground">Last updated {updated}.</p>
      </header>

      <div className="mt-8 space-y-8 text-13 leading-relaxed">
        <section aria-labelledby="use">
          <h2 id="use" className="text-base font-semibold tracking-[-0.01em]">
            Using this directory
          </h2>
          <p className="mt-3 text-muted-foreground">
            You may browse, search and compare freely, and quote short excerpts with attribution and
            a link. You may not scrape the catalogue at scale, republish rankings or review text as
            your own, or use automated tools in a way that degrades the service for others.
          </p>
        </section>

        <section aria-labelledby="accuracy">
          <h2 id="accuracy" className="text-base font-semibold tracking-[-0.01em]">
            Accuracy and no warranty
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pricing, capabilities and company details change frequently and are provided for
            orientation only. Always confirm pricing and contractual terms with the vendor before
            purchasing. The directory is provided “as is”, without warranty of any kind, and we are
            not liable for decisions made on the basis of a ranking or a review.
          </p>
          <p className="mt-3 text-muted-foreground">
            Composite scores are editorial opinions derived from the{" "}
            <Link href="/methodology" className="text-primary underline-offset-2 hover:underline">
              published methodology
            </Link>
            . They are not statements of fact about product quality, and they are not a
            recommendation for any particular organisation.
          </p>
        </section>

        <section aria-labelledby="reviews">
          <h2 id="reviews" className="text-base font-semibold tracking-[-0.01em]">
            Review policy
          </h2>
          <p className="mt-3 text-muted-foreground">
            Reviews must be written by someone with direct experience of the product. We remove
            reviews that contain personal attacks, confidential information, promotional content, or
            material the author was paid to write without disclosure. Vendors may respond to a review
            but may not edit or suppress it.
          </p>
          <p className="mt-3 text-muted-foreground">
            Where a reviewer received consideration of any kind, the review is labelled incentivized
            as required by the FTC endorsement guides (16 CFR Part 255).
          </p>
        </section>

        <section aria-labelledby="trademarks">
          <h2 id="trademarks" className="text-base font-semibold tracking-[-0.01em]">
            Trademarks
          </h2>
          <p className="mt-3 text-muted-foreground">
            Product and company names are the trademarks of their respective owners. They are used
            here descriptively, to identify the products being reviewed and compared, and their use
            does not imply any affiliation with or endorsement by the trademark holder.
          </p>
        </section>

        <section aria-labelledby="sponsored">
          <h2 id="sponsored" className="text-base font-semibold tracking-[-0.01em]">
            Sponsored content
          </h2>
          <p className="mt-3 text-muted-foreground">
            Sponsored placements are labelled wherever they appear. Sponsorship does not affect
            composite scores, leader designations, review text, or the ordering of organic results.
          </p>
        </section>

        <section aria-labelledby="demo-terms">
          <h2 id="demo-terms" className="text-base font-semibold tracking-[-0.01em]">
            About this deployment
          </h2>
          <p className="mt-3 text-muted-foreground">
            This instance runs on a synthetic demonstration dataset. Ratings, review text, review
            counts and prices are generated for demonstration and do not reflect real user feedback.
            Enquiries submitted through this deployment are not forwarded to vendors.
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-border pt-6">
        <p className="text-13 text-muted-foreground">
          See also our{" "}
          <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
            privacy policy
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="text-primary underline-offset-2 hover:underline">
            ranking methodology
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
