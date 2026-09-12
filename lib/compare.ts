/**
 * Comparison-table construction.
 *
 * The comparison table is the highest-value surface in the product, so the row model
 * is built explicitly rather than improvised in the component: sections, rows, a
 * typed value per column, and a `differs` flag the UI uses to let buyers hide the
 * rows where every product is identical.
 */

import { getFeatureGroups, getIntegrationsForProduct } from "@/lib/data/repository";
import { dataset } from "@/lib/data/seed";
import type { ComparisonRow, ComparisonSection, ComparisonValue, Product } from "@/lib/data/types";

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp10 = (n: number) => Math.max(0, Math.min(10, n));

/** Sample size behind a satisfaction score, scaled from review volume. */
function sampleFor(product: Product, weight: number): number {
  return Math.max(4, Math.round(product.ratingCount * weight));
}

function scoreRow(
  label: string,
  values: { score: number; sampleSize: number }[],
  threshold = 0.6,
): ComparisonRow {
  const scores = values.map((v) => v.score);
  const differs = Math.max(...scores) - Math.min(...scores) >= threshold;
  return {
    label,
    differs,
    values: values.map<ComparisonValue>((v) => ({
      kind: "score",
      score: round1(v.score),
      sampleSize: v.sampleSize,
    })),
  };
}

function booleanRow(label: string, values: boolean[]): ComparisonRow {
  return {
    label,
    differs: new Set(values).size > 1,
    values: values.map<ComparisonValue>((v) => ({ kind: "boolean", boolean: v })),
  };
}

function textRow(label: string, values: string[]): ComparisonRow {
  return {
    label,
    differs: new Set(values).size > 1,
    values: values.map<ComparisonValue>((v) => ({ kind: "text", text: v })),
  };
}

function priceRow(label: string, values: (number | null)[]): ComparisonRow {
  return {
    label,
    differs: new Set(values.map((v) => String(v))).size > 1,
    values: values.map<ComparisonValue>((v) => ({ kind: "price", price: v })),
  };
}

export function buildComparisonSections(products: Product[]): ComparisonSection[] {
  if (products.length === 0) return [];

  const sections: ComparisonSection[] = [];

  /* ---------------------------------------------------------------- RATINGS */
  sections.push({
    id: "ratings",
    title: "Ratings",
    rows: [
      scoreRow(
        "Overall Rating",
        products.map((p) => ({ score: p.ratingAvg * 2, sampleSize: p.ratingCount })),
        0.5,
      ),
      scoreRow(
        "Ease of Use",
        products.map((p) => ({ score: p.easeAvg * 2, sampleSize: sampleFor(p, 0.42) })),
      ),
      scoreRow(
        "Value for Money",
        products.map((p) => ({ score: p.valueAvg * 2, sampleSize: sampleFor(p, 0.38) })),
      ),
      scoreRow(
        "Customer Support",
        products.map((p) => ({ score: p.supportAvg * 2, sampleSize: sampleFor(p, 0.3) })),
      ),
      scoreRow(
        "Functionality",
        products.map((p) => ({ score: p.functionalityAvg * 2, sampleSize: sampleFor(p, 0.44) })),
      ),
      scoreRow(
        "Meets Requirements",
        products.map((p) => ({
          score: clamp10((p.score / 10) * 0.86 + 1.15),
          sampleSize: sampleFor(p, 0.5),
        })),
      ),
      scoreRow(
        "Product Direction",
        products.map((p) => ({
          score: clamp10((p.score / 10) * 0.8 + 1.5),
          sampleSize: sampleFor(p, 0.34),
        })),
      ),
    ],
  });

  /* ---------------------------------------------------------------- PRICING */
  sections.push({
    id: "pricing",
    title: "Pricing",
    rows: [
      priceRow("Starting Price", products.map((p) => p.startingPrice)),
      textRow("Pricing Model", products.map((p) => p.pricingNote)),
      textRow(
        "Entry Plan",
        products.map((p) => {
          const entry = p.pricingPlans[0];
          if (!entry) return "—";
          return entry.price === null ? `${entry.name} (quote)` : `${entry.name} — $${entry.price}`;
        }),
      ),
      booleanRow("Free Trial", products.map((p) => p.freeTrial)),
      booleanRow("Free Version", products.map((p) => p.freeVersion)),
      textRow(
        "Trial Length",
        products.map((p) => (p.freeTrialDays ? `${p.freeTrialDays} days` : "—")),
      ),
    ],
  });

  /* --------------------------------------------------------------- FEATURES */
  for (const group of getFeatureGroups()) {
    const rows: ComparisonRow[] = [];
    for (const feature of groupFeatures(group.slug)) {
      const values = products.map((p) => p.featureSlugs.includes(feature.slug));
      rows.push(booleanRow(feature.name, values));
    }
    if (rows.length === 0) continue;
    sections.push({ id: `features-${group.slug}`, title: group.name, rows });
  }

  /* ------------------------------------------------------------- CAPABILITY */
  sections.push({
    id: "capability",
    title: "Company & Deployment",
    rows: [
      textRow("Vendor", products.map((p) => p.companyName)),
      textRow(
        "Deployment",
        products.map((p) =>
          p.deployment
            .map((d) =>
              d === "cloud"
                ? "Cloud"
                : d === "on_premise"
                  ? "On-premise"
                  : d === "mobile"
                    ? "Mobile app"
                    : "Hybrid",
            )
            .join(", "),
        ),
      ),
      textRow(
        "Best Fit",
        products.map((p) =>
          p.companySizes
            .map((s) => (s === "small" ? "Small" : s === "mid" ? "Mid-market" : "Enterprise"))
            .join(", "),
        ),
      ),
      textRow(
        "Integrations Listed",
        products.map((p) => String(getIntegrationsForProduct(p.slug).length)),
      ),
      textRow("Languages Supported", products.map((p) => String(p.languages))),
      textRow("Solution Type", products.map((p) => p.solutionType)),
    ],
  });

  return sections;
}

/** Feature lookup kept local so the section builder stays a pure function. */
function groupFeatures(groupSlug: string) {
  return dataset.features.filter((f) => f.groupSlug === groupSlug);
}

/**
 * A short, high-signal summary of where the products genuinely diverge — used in the
 * AI summary block and as the default "show differences only" hint.
 */
export function summariseDifferences(sections: ComparisonSection[], products: Product[]): string[] {
  if (products.length < 2) return [];
  const bullets: string[] = [];

  const byScore = [...products].sort((a, b) => b.score - a.score);
  const leader = byScore[0]!;
  const runnerUp = byScore[1]!;
  bullets.push(
    `${leader.name} leads on our composite score at ${leader.score}/100, ahead of ${runnerUp.name} at ${runnerUp.score}/100.`,
  );

  const byRating = [...products].sort((a, b) => b.ratingAvg - a.ratingAvg);
  bullets.push(
    `${byRating[0]!.name} holds the highest verified rating at ${byRating[0]!.ratingAvg.toFixed(1)} out of 5 across ${byRating[0]!.ratingCount.toLocaleString("en-US")} reviews.`,
  );

  const priced = products.filter((p) => p.startingPrice !== null && p.startingPrice > 0);
  if (priced.length > 1) {
    const cheapest = [...priced].sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0))[0]!;
    const dearest = [...priced].sort((a, b) => (b.startingPrice ?? 0) - (a.startingPrice ?? 0))[0]!;
    bullets.push(
      `Entry pricing ranges from $${cheapest.startingPrice} (${cheapest.name}) to $${dearest.startingPrice} (${dearest.name}) on a comparable basis.`,
    );
  } else {
    const quoteOnly = products.filter((p) => p.startingPrice === null).length;
    if (quoteOnly > 0) {
      bullets.push(
        `${quoteOnly} of ${products.length} products in this comparison are quote-only, so list pricing is not comparable.`,
      );
    }
  }

  const ease = [...products].sort((a, b) => b.easeAvg - a.easeAvg);
  if (ease.length > 1 && ease[0]!.easeAvg - ease[ease.length - 1]!.easeAvg >= 0.2) {
    bullets.push(
      `${ease[0]!.name} scores highest for ease of use (${ease[0]!.easeAvg.toFixed(1)}/5) while ${ease[ease.length - 1]!.name} scores lowest (${ease[ease.length - 1]!.easeAvg.toFixed(1)}/5).`,
    );
  }

  const coverage = [...products].sort((a, b) => b.featureSlugs.length - a.featureSlugs.length);
  if (coverage.length > 1 && coverage[0]!.featureSlugs.length !== coverage[coverage.length - 1]!.featureSlugs.length) {
    bullets.push(
      `Functional coverage is broadest for ${coverage[0]!.name} (${coverage[0]!.featureSlugs.length} of ${dataset.features.length} tracked capabilities) and narrowest for ${coverage[coverage.length - 1]!.name} (${coverage[coverage.length - 1]!.featureSlugs.length}).`,
    );
  }

  const freeTrial = products.filter((p) => p.freeTrial);
  bullets.push(
    freeTrial.length === products.length
      ? `Every product compared here offers a free trial, so all can be evaluated before purchase.`
      : freeTrial.length === 0
        ? `None of these products offer a self-serve trial — expect a guided proof of concept instead.`
        : `${freeTrial.map((p) => p.name).join(", ")} offer a free trial; the remainder require a scoped evaluation.`,
  );

  return bullets;
}
