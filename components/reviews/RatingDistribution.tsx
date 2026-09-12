import { cn, formatCompact, formatPercent } from "@/lib/utils";

/**
 * 5→1 star histogram.
 *
 * Each bar carries its own accessible label rather than relying on a chart library's
 * default output, because "64%" alone is meaningless to a screen reader without the
 * star value attached.
 */
export function RatingDistribution({
  distribution,
  total,
  variant = "full",
  className,
}: {
  /** Index 0 = 5 stars. */
  distribution: [number, number, number, number, number];
  total: number;
  variant?: "full" | "compact";
  className?: string;
}) {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className={cn("space-y-1.5", className)}>
      {stars.map((star, i) => {
        const count = distribution[i] ?? 0;
        const share = total > 0 ? count / total : 0;
        return (
          <div key={star} className="flex items-center gap-2.5">
            <span className="w-8 shrink-0 text-2xs text-muted-foreground tnum">
              {star} star
            </span>
            <div
              role="img"
              aria-label={`${star} star: ${count.toLocaleString("en-US")} reviews, ${formatPercent(share)}`}
              className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-pill bg-muted"
            >
              <div
                className="h-full rounded-pill bg-primary"
                style={{ width: `${Math.max(share * 100, count > 0 ? 1.5 : 0)}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-2xs text-muted-foreground tnum">
              {formatPercent(share)}
            </span>
            {variant === "full" && (
              <span className="hidden w-12 shrink-0 text-right text-2xs text-faint tnum sm:block">
                {formatCompact(count)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** The four secondary satisfaction dimensions, shown as labelled tracks. */
export function SecondaryScores({
  scores,
  className,
}: {
  scores: { label: string; value: number; sampleSize: number }[];
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {scores.map((score) => (
        <div key={score.label}>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-13 text-muted-foreground">{score.label}</dt>
            <dd className="font-mono text-13 font-medium tnum">{score.value.toFixed(1)}</dd>
          </div>
          <div
            role="img"
            aria-label={`${score.label}: ${score.value.toFixed(1)} out of 5, from ${score.sampleSize.toLocaleString("en-US")} respondents`}
            className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-muted"
          >
            <div
              className="h-full rounded-pill bg-primary"
              style={{ width: `${(score.value / 5) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-2xs text-faint tnum">
            {score.sampleSize.toLocaleString("en-US")} respondents
          </p>
        </div>
      ))}
    </dl>
  );
}
