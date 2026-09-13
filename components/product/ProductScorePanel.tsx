import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { rankTier } from "@/lib/ranking";
import { cn } from "@/lib/utils";

/**
 * ProductScorePanel — the sticky rail that carries the composite score.
 *
 * WHY IT EXISTS
 * The product page previously left the entire right-hand column empty below the
 * hero: an `<div className="hidden lg:block" aria-hidden="true" />` placeholder
 * spanning roughly 800px of scroll on a wide viewport. On a comparison site that
 * dead column is the most valuable real estate on the page, and it was doing
 * nothing. This fills it with what a buyer evaluating a product wants pinned:
 * how it scores, where it sits, and how to get to the detail.
 *
 * WHY THE SATISFACTION BREAKDOWN IS *NOT* HERE
 * The first version of this panel repeated the four satisfaction bars. Because
 * the rail is sticky, that put the identical four numbers on screen twice at
 * once — the rail's copy and the full version in the Reviews section, which
 * sits at the same scroll position and carries respondent counts the rail
 * cannot. It read as a rendering fault. The breakdown stays in Reviews, where
 * it has context and sample sizes; the rail carries the score and the
 * navigation instead. De-duplication, not an omission.
 *
 * WHY NO "RANK #N OF M" CARD
 * It is tempting and it would look good. But no ranking exists anywhere else in
 * the product — the category page lists products without ranks — and the stated
 * policy that "sponsored products are excluded from rankings" is copy only, not
 * implemented in code. Publishing a rank here would mean inventing a ranking
 * system on 230 pages and quietly contradicting that policy. Not without a
 * decision from the user.
 *
 * WHY THE RING IS BRAND-BLUE AND NOT TIER-COLOURED
 * The tier chip is coloured by tier because that is an encoding — it has to
 * match the category quadrant grid. The ring is not an encoding; it is the
 * metric itself. Colouring the ring by tier would mean the same score appeared
 * in a different colour on every product, which breaks comparison across two
 * tabs. One hue for the metric, tier colour for the tier. Deliberate.
 *
 * COST
 * `ScoreRing` is a server component whose animation is driven by CSS custom
 * properties, so this whole panel adds zero JavaScript — which is what makes it
 * acceptable to render on 230 product pages.
 *
 * ACCESSIBILITY
 * The ring exposes `role="img"` with the value in its label, so the score is
 * readable by a screen reader, and the tier is written out as text rather than
 * being conveyed by colour alone.
 */
export interface ScorePanelProps {
  score: number;
  ratingAvg: number;
  ratingCount: number;
  /** Category context, when the product has one. */
  category?: { name: string; slug: string; productCount: number } | null;
  /** On-page anchors, so the rail doubles as navigation. */
  sections: { id: string; label: string }[];
  className?: string;
}

export function ProductScorePanel({
  score,
  ratingAvg,
  ratingCount,
  category,
  sections,
  className,
}: ScorePanelProps) {
  const tier = rankTier(score);

  return (
    <div className={cn("space-y-3", className)}>
      <section
        aria-labelledby="score-panel-heading"
        className="rounded-card border border-border bg-card p-4 shadow-card"
      >
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="score-panel-heading" className="label-caps text-muted-foreground">
            Composite score
          </h2>
          <span
            className={cn(
              "inline-flex items-center rounded-pill px-2 py-0.5 text-2xs font-medium",
              tier.tintClass,
              tier.ink,
            )}
            title={tier.blurb}
          >
            {tier.label}
          </span>
        </div>

        <div className="mt-3 flex flex-col items-center">
          <ScoreRing value={score} size={148} thickness={10} label="out of 100" />
        </div>

        <p className="mt-3 text-2xs leading-relaxed text-muted-foreground">{tier.blurb}</p>

        <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-13">
          <div>
            <dt className="text-2xs text-muted-foreground">Rating</dt>
            <dd className="mt-0.5 font-medium tnum">{ratingAvg.toFixed(1)} / 5</dd>
          </div>
          <div>
            <dt className="text-2xs text-muted-foreground">Reviews</dt>
            <dd className="mt-0.5 font-medium tnum">{ratingCount.toLocaleString("en-US")}</dd>
          </div>
        </dl>

        <Link
          href="/methodology"
          className="mt-3 inline-flex items-center gap-1 text-2xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          How the score is calculated
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </section>

      {category ? (
        <section
          aria-labelledby="score-panel-category"
          className="rounded-card border border-border bg-subtle p-4"
        >
          <h2 id="score-panel-category" className="label-caps text-muted-foreground">
            Category
          </h2>
          <p className="mt-2 text-13 font-medium text-foreground">{category.name}</p>
          <p className="mt-0.5 text-2xs text-muted-foreground tnum">
            {category.productCount} products listed
          </p>
          <Link
            href={`/categories/${category.slug}`}
            className="mt-2.5 inline-flex items-center gap-1 text-2xs font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Browse {category.name}
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </section>
      ) : null}

      <nav
        aria-label="On this page"
        className="rounded-card border border-border bg-card p-4 shadow-card"
      >
        <h2 className="label-caps text-muted-foreground">On this page</h2>
        <ul className="mt-2.5 space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="-mx-1.5 flex items-center justify-between gap-2 rounded-control px-1.5 py-1.5 text-13 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
