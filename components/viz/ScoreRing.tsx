import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ScoreRing — the composite-score visualisation the product page was missing.
 *
 * WHY THIS IS A SERVER COMPONENT
 * The arc is drawn with `stroke-dashoffset` and animated by a CSS keyframe that
 * reads two custom properties set inline. No JavaScript, no hydration, no
 * client bundle cost. That matters because this component appears on 230
 * product pages — making it interactive would be the single most expensive
 * decision in the visual program for the least benefit.
 *
 * HOW THE ANIMATION WORKS
 * `--ring-circumference` is the full circle; `--ring-offset` is where the arc
 * should stop for this value. The keyframe animates between them. Because the
 * target is a custom property rather than a hardcoded class, one keyframe
 * serves every score without generating 100 CSS rules.
 *
 * REDUCED MOTION
 * The global block in globals.css collapses animation-duration to 0.01ms, so a
 * reduced-motion user sees the arc already at its final, correct offset. That
 * is the right degradation: the information is present, only the transition is
 * gone. Nothing here is load-bearing on motion.
 *
 * ACCESSIBILITY
 * The ring is `role="img"` with an aria-label carrying the actual value, and
 * the inner numeral is real text — so the score is readable by a screen reader
 * and selectable, not just drawn.
 */

export interface ScoreRingProps {
  /** 0–100. Clamped. */
  value: number;
  /** Rendered diameter in px. */
  size?: number;
  /** Stroke width in px. */
  thickness?: number;
  /** Small caps line under the number. */
  label?: string;
  /** Ring colour. Defaults to the primary accent. */
  color?: string;
  /** Track colour. Defaults to the standard border token. */
  trackColor?: string;
  /** Tailwind classes for the numeral. */
  valueClassName?: string;
  className?: string;
}

export function ScoreRing({
  value,
  size = 132,
  thickness = 9,
  label,
  color = "var(--color-viz-1)",
  trackColor = "var(--color-border)",
  valueClassName,
  className,
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Composite score ${clamped} out of 100${label ? `, ${label}` : ""}`}
        className="-rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={
            {
              "--ring-circumference": `${circumference}`,
              "--ring-offset": `${offset}`,
              animation:
                "ring-draw var(--duration-slower) var(--ease-out-quiet) both",
            } as React.CSSProperties
          }
        />
      </svg>

      {/* Numerals sit outside the rotated SVG so they are not rotated with it. */}
      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "tnum font-semibold leading-none tracking-tight text-foreground",
            valueClassName,
          )}
          style={{ fontSize: Math.round(size * 0.3) }}
        >
          {clamped}
        </span>
        {label ? (
          <span className="label-caps mt-1 text-muted-foreground">{label}</span>
        ) : null}
      </span>
    </div>
  );
}

/**
 * ScoreBar — a single labelled horizontal bar.
 *
 * Used in the comparison matrix where three or four products are stacked
 * against the same metric. The value is always printed at the end of the bar,
 * because a bar without a number forces the reader to estimate — which is
 * exactly what a comparison surface must not do.
 */
export function ScoreBar({
  value,
  max = 100,
  label,
  color = "var(--color-viz-1)",
  showValue = true,
  valueSuffix = "",
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
  valueSuffix?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label ? (
        <span className="w-28 shrink-0 truncate text-13 text-muted-foreground">{label}</span>
      ) : null}
      <span
        className="relative h-2 flex-1 overflow-hidden rounded-pill bg-muted"
        role="img"
        aria-label={`${label ? label + ": " : ""}${value}${valueSuffix} out of ${max}`}
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
        <span className="tnum w-11 shrink-0 text-right text-13 font-medium text-foreground">
          {value}
          {valueSuffix}
        </span>
      ) : null}
    </div>
  );
}
