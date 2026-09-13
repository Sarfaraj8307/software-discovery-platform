/**
 * Ranking tiers — the vocabulary shared by the product score panel and the
 * category quadrant grid.
 *
 * WHY A SHARED MODULE
 * The product page labels a product "Leader", and the category page plots every
 * product into one of four quadrants. If those two surfaces derived their
 * thresholds independently they would eventually drift, and a product would be
 * a Leader on its own page while sitting in the High Performer quadrant on its
 * category page. One function, one set of thresholds, no drift.
 *
 * THE THRESHOLDS ARE NOT INVENTED
 * `lib/data/seed.ts` already computes `product.leader = score >= 87`. The
 * Leader threshold here is that same number, deliberately — so the "Leader"
 * badge in the product hero and the tier label in the score panel are
 * guaranteed to agree rather than agreeing by coincidence.
 *
 * The remaining cut points are placed against the score range the generator
 * actually produces. `base.score` is clamped to [58, 99], so a naive 25/50/75
 * split would put almost every product in the top two tiers and leave "Niche"
 * permanently empty. These bands divide the real 58–99 range into four
 * populated groups:
 *
 *   Leader         87–99   (18 of 99 points — the genuinely top-scoring set)
 *   High Performer 78–86
 *   Contender      68–77
 *   Niche          58–67
 *
 * `rankTier()` is total: every score from 0 to 100 maps to exactly one tier,
 * including out-of-range input, because a caller passing an unexpected value
 * should get a sensible label rather than `undefined` in the UI.
 */

import { vizAt } from "@/lib/viz";

export type RankTierKey = "leader" | "high-performer" | "contender" | "niche";

export interface RankTier {
  key: RankTierKey;
  /** Display label. Sentence case, matching the rest of the UI. */
  label: string;
  /** One-line explanation, used as a tooltip or caption. */
  blurb: string;
  /** Graphical accent — a data-viz series solid, >= 3:1 on white. */
  accent: string;
  /** Tailwind text class for the label. Literal, never templated. */
  ink: string;
  /** Tailwind background class for a tinted chip. Literal. */
  tintClass: string;
}

/** Matches `product.leader` in lib/data/seed.ts. Do not change independently. */
export const LEADER_THRESHOLD = 87;
export const HIGH_PERFORMER_THRESHOLD = 78;
export const CONTENDER_THRESHOLD = 68;

const TIERS: Record<RankTierKey, RankTier> = {
  leader: {
    key: "leader",
    label: "Leader",
    blurb: "Top-scoring products in the catalogue on reviews, satisfaction and coverage.",
    accent: vizAt(0).solid,
    ink: vizAt(0).ink,
    tintClass: vizAt(0).tintClass,
  },
  "high-performer": {
    key: "high-performer",
    label: "High Performer",
    blurb: "Strong satisfaction and coverage, typically with a smaller review base than a Leader.",
    accent: vizAt(3).solid,
    ink: vizAt(3).ink,
    tintClass: vizAt(3).tintClass,
  },
  contender: {
    key: "contender",
    label: "Contender",
    blurb: "Competitive on the fundamentals, with narrower coverage or fewer reviews.",
    accent: vizAt(4).solid,
    ink: vizAt(4).ink,
    tintClass: vizAt(4).tintClass,
  },
  niche: {
    key: "niche",
    label: "Niche",
    blurb: "A focused fit rather than a broad one — worth shortlisting for a specific workflow.",
    accent: vizAt(9).solid,
    ink: vizAt(9).ink,
    tintClass: vizAt(9).tintClass,
  },
};

/** Ordered best-to-worst, for legends and quadrant axes. */
export const RANK_TIER_ORDER: readonly RankTier[] = [
  TIERS.leader,
  TIERS["high-performer"],
  TIERS.contender,
  TIERS.niche,
];

/** Total: any number maps to exactly one tier. */
export function rankTier(score: number): RankTier {
  if (!Number.isFinite(score)) return TIERS.niche;
  if (score >= LEADER_THRESHOLD) return TIERS.leader;
  if (score >= HIGH_PERFORMER_THRESHOLD) return TIERS["high-performer"];
  if (score >= CONTENDER_THRESHOLD) return TIERS.contender;
  return TIERS.niche;
}
