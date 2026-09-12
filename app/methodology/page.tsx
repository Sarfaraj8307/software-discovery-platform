import type { Metadata } from "next";
import Link from "next/link";
import { monthYear } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/navigation";
import { DemoDataNotice } from "@/components/domain/atoms";
import { SectionHeading } from "@/components/ui/content";

export const metadata: Metadata = {
  title: "How we rank software",
  description:
    "The published methodology behind every score in the directory: how the composite score is calculated, how reviews are verified, and how sponsored placements are labelled.",
  alternates: { canonical: "/methodology" },
};

/** The weights below mirror the formula in the catalogue generator exactly. */
const WEIGHTS = [
  {
    label: "Verified rating",
    weight: "68",
    detail:
      "The product's average rating out of five, rescaled to a 0–68 band. This is the dominant term because reader sentiment is the strongest available signal.",
  },
  {
    label: "Review volume",
    weight: "17",
    detail:
      "Confidence in that average. Scored as log₁₀(reviews + 1) ÷ 4, capped at 1 — so the term saturates at roughly 10,000 reviews and a product with 40 reviews cannot outrank an established one on a handful of five-star ratings.",
  },
  {
    label: "Feature coverage",
    weight: "15",
    detail:
      "The share of the tracked capability set the product actually ships, verified against vendor documentation rather than marketing copy.",
  },
];

const LABELS = [
  {
    name: "Validated",
    tone: "success" as const,
    detail:
      "We independently confirmed the reviewer holds an account with the vendor. This is the strongest signal we publish.",
  },
  {
    name: "Current user",
    tone: "primary" as const,
    detail:
      "The reviewer self-identified as a user but we could not confirm it against the vendor's records.",
  },
  {
    name: "Incentivized",
    tone: "neutral" as const,
    detail:
      "The reviewer received something of value for writing. Always displayed, never hidden — see the disclosure section below.",
  },
  {
    name: "Guest",
    tone: "neutral" as const,
    detail:
      "An unverified submission. Included in the aggregate but excluded from any ranking that claims verified-only sourcing.",
  },
];

export default function MethodologyPage() {
  const updated = monthYear("2026-09-12");

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Methodology" }]} />

      <header className="mt-4">
        <p className="label-caps text-muted-foreground">Methodology</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
          How we rank software
        </h1>
        <p className="mt-3 text-body leading-relaxed text-muted-foreground">
          Every ranking in this directory is produced by one published formula. No vendor can buy a
          position in it, and no editorial judgement is applied after the fact. This page states the
          formula, the review standards, and the commercial relationships that could otherwise be
          mistaken for influence.
        </p>
        <p className="mt-2 text-2xs text-muted-foreground">Last reviewed {updated}.</p>
        <DemoDataNotice className="mt-4" />
      </header>

      <section className="mt-10" aria-labelledby="score-heading">
        <SectionHeading
          id="score-heading"
          eyebrow="The composite score"
          title="One formula, three weighted inputs"
          description="Scores run from 58 to 99. The floor and ceiling are deliberate: no product is presented as flawless, and none is presented as unusable."
        />

        <div className="mt-5 overflow-hidden rounded-card border border-border">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Composite score weights and rationale</caption>
            <thead className="bg-subtle">
              <tr>
                <th scope="col" className="px-4 py-2.5 label-caps text-muted-foreground">
                  Input
                </th>
                <th scope="col" className="px-4 py-2.5 label-caps text-muted-foreground">
                  Weight
                </th>
                <th scope="col" className="px-4 py-2.5 label-caps text-muted-foreground">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {WEIGHTS.map((row) => (
                <tr key={row.label} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-3 text-13 font-medium">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-13 font-semibold text-primary tnum">
                    {row.weight}
                  </td>
                  <td className="px-4 py-3 text-13 leading-relaxed text-muted-foreground">
                    {row.detail}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-subtle">
                <th scope="row" className="px-4 py-2.5 text-13 font-medium">
                  Total
                </th>
                <td className="px-4 py-2.5 text-13 font-semibold tnum">100</td>
                <td className="px-4 py-2.5 text-13 text-muted-foreground">
                  Normalised to a 0–100 scale before clamping.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-4 rounded-card border border-border bg-subtle p-4 text-13 leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">In full:</span> score = clamp( (rating ÷ 5) ×
          68 + min(1, log₁₀(reviews + 1) ÷ 4) × 17 + (tracked capabilities shipped ÷ capabilities
          tracked) × 15, 58, 99 ), rounded to the nearest integer.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="leader-heading">
        <SectionHeading
          id="leader-heading"
          eyebrow="Leader designation"
          title="What “category leader” means"
          description="A product is marked a leader when its composite score reaches 87 or above. It is a threshold, not a quota — in a thin category there may be no leader at all, and we do not lower the bar to fill the slot."
        />
      </section>

      <section className="mt-10" aria-labelledby="reviews-heading">
        <SectionHeading
          id="reviews-heading"
          eyebrow="Reviews"
          title="How reviews are verified"
          description="Every review carries a provenance label. The label is part of the record, not a decoration — it is shown wherever the review appears."
        />

        <ul className="mt-5 space-y-3">
          {LABELS.map((label) => (
            <li
              key={label.name}
              className="rounded-card border border-border bg-card p-4 shadow-card"
            >
              <p className="text-13 font-semibold">{label.name}</p>
              <p className="mt-1 text-13 leading-relaxed text-muted-foreground">{label.detail}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-card border border-border bg-subtle p-4">
          <h3 className="text-13 font-semibold">Rating distribution</h3>
          <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
            Each product page shows the full 1★–5★ histogram alongside the average. The histogram is
            derived from the stated review count and then the average is recomputed from the
            resulting bars, so the number we display can never contradict the distribution beneath
            it. An average with no visible distribution is an average you should not trust.
          </p>
        </div>

        <div className="mt-4 rounded-card border border-border bg-subtle p-4">
          <h3 className="text-13 font-semibold">Secondary scores</h3>
          <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
            Ease of use, value for money, support quality and functionality are reported separately
            and are deliberately <em>not</em> folded into the composite score. A product can lead a
            category while scoring poorly on value, and we would rather show you that tension than
            average it away.
          </p>
        </div>

        <div className="mt-4 rounded-card border border-border bg-subtle p-4">
          <h3 className="text-13 font-semibold">Moderation</h3>
          <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
            Submissions enter a queue as pending. A moderator then approves, rejects, or flags them
            for further review. Rejected reviews never contribute to any average, and a vendor
            cannot have a review removed by asking — only by demonstrating that it violates the
            review policy.
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="commercial-heading">
        <SectionHeading
          id="commercial-heading"
          eyebrow="Commercial relationships"
          title="How we make money, and what it does not buy"
        />

        <div className="mt-5 space-y-4">
          <div className="rounded-card border border-warning-border bg-warning-subtle p-4">
            <h3 className="text-13 font-semibold text-warning">Sponsored placements</h3>
            <p className="mt-1.5 text-13 leading-relaxed text-warning">
              Vendors can pay for a clearly labelled sponsored position. Sponsored placements are
              marked on the card, in the listing, and in the structured data. They never alter a
              composite score, and they never displace the top organic result — a sponsored slot is
              always visually distinguishable from a ranking.
            </p>
          </div>

          <div className="rounded-card border border-border bg-subtle p-4">
            <h3 className="text-13 font-semibold">Incentivized reviews</h3>
            <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
              Where a reviewer received a discount, credit, or other consideration, the review is
              labelled incentivized. This is a requirement of the FTC endorsement guides (16 CFR
              Part 255), and we treat it as non-negotiable: the label is rendered wherever the
              review is, including in the aggregate views.
            </p>
          </div>

          <div className="rounded-card border border-border bg-subtle p-4">
            <h3 className="text-13 font-semibold">What is not for sale</h3>
            <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
              Composite scores, leader designations, category ordering, review text, and the
              histogram. Vendors may correct factual errors in their own listing — pricing, feature
              availability, company details — but corrections are applied uniformly and are visible
              in the listing history.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="cadence-heading">
        <SectionHeading
          id="cadence-heading"
          eyebrow="Maintenance"
          title="How often this changes"
        />
        <ul className="mt-5 space-y-2 text-13 leading-relaxed text-muted-foreground">
          <li className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">Ratings and scores</span> recompute as
              reviews are approved, not on a fixed schedule.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">Pricing</span> is re-checked monthly
              against vendor pricing pages. Entry prices shown are the lowest published paid tier on
              a comparable basis and exclude promotional or annual-commit discounts unless stated.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">Feature coverage</span> is re-verified
              quarterly against vendor documentation.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">This page</span> is versioned. Any change
              to the formula is published here before it takes effect in the rankings.
            </span>
          </li>
        </ul>
      </section>

      <footer className="mt-12 border-t border-border pt-6">
        <p className="text-13 text-muted-foreground">
          Questions about a specific ranking?{" "}
          <Link href="/about" className="text-primary underline-offset-2 hover:underline">
            Get in touch
          </Link>{" "}
          or review our{" "}
          <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
