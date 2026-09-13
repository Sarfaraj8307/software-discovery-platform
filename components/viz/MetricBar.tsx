import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MetricBar — a single labelled horizontal bar.
 *
 * WHY THIS IS NOT CALLED ScoreBar
 * `components/domain/atoms.tsx` already exports a `ScoreBar`. That one is a
 * fixed-width micro-visualisation for a table cell: 64px, always blue, value
 * first. This one is a full-width labelled bar for a panel or a comparison
 * column. Two components with the same name in two files is a trap — the wrong
 * import compiles and then behaves differently — so this one is named for what
 * it is and lives in its own file rather than being exported from `ScoreRing`,
 * a module named after a different shape.
 *
 * WHY THE VALUE IS ALWAYS PRINTED
 * A bar alone forces the reader to estimate, which is exactly what a comparison
 * surface must not do. `showValue` defaults to true for that reason; turning it
 * off is only appropriate when the number is already rendered adjacent.
 *
 * ACCESSIBILITY — the bar is decorative when the number is visible
 * The first version of this component put `role="img"` with a descriptive label
 * on the bar *and* printed the value as text. A screen reader then announced
 * the same number twice. So the accessible role follows the value:
 *   showValue  -> the bar is aria-hidden; the printed number is the content.
 *   !showValue -> the bar is the only carrier and takes role="img" + a label.
 *
 * MOTION
 * The fill grows via the `bar-grow` keyframe, which the global reduced-motion
 * block collapses to 0.01ms — so a reduced-motion user sees the bar already at
 * its final width. The information never depends on the animation.
 */
export interface MetricBarProps {
  value: number;
  /** Scale maximum. Defaults to 100 because most metrics here are 0–100. */
  max?: number;
  /** Left-hand label. Omit for a bare bar. */
  label?: string;
  /** Fill colour. Defaults to the primary accent. */
  color?: string;
  /** Print the value at the end of the bar. */
  showValue?: boolean;
  /** Appended to the printed value, e.g. "%" or "/5". */
  valueSuffix?: string;
  /** Decimal places for the printed value. */
  precision?: number;
  className?: string;
}

export function MetricBar({
  value,
  max = 100,
  label,
  color = "var(--color-viz-1)",
  showValue = true,
  valueSuffix = "",
  precision = 0,
  className,
}: MetricBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const printed = `${value.toFixed(precision)}${valueSuffix}`;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label ? (
        <span className="w-28 shrink-0 truncate text-13 text-muted-foreground">{label}</span>
      ) : null}

      <span
        className="relative h-2 flex-1 overflow-hidden rounded-pill bg-muted"
        {...(showValue
          ? { "aria-hidden": true as const }
          : { role: "img", "aria-label": `${label ? `${label}: ` : ""}${printed} out of ${max}` })}
      >
        <span
          className="absolute inset-y-0 left-0 rounded-pill"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            transformOrigin: "left center",
            animation: "bar-grow var(--duration-slower) var(--ease-out-quiet) both",
          }}
        />
      </span>

      {showValue ? (
        <span className="tnum w-12 shrink-0 text-right text-13 font-medium text-foreground">
          {printed}
        </span>
      ) : null}
    </div>
  );
}
