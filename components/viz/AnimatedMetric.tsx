"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * AnimatedMetric — count-up for directory-scale statistics.
 *
 * DELIBERATE CONSTRAINTS (from the brief):
 *   - Animates ONCE, when it first enters the viewport. Never continuously.
 *   - Honours prefers-reduced-motion by rendering the final value immediately.
 *   - Screen readers always receive the true final number, never a mid-count.
 *
 * STATE SHAPE — why `progress` is `number | null`
 * `null` means "no animation; show the final value". That is the initial state,
 * which gives three things at once:
 *   1. Server-rendered HTML contains the REAL number, so it is correct for SEO
 *      and for a no-JS client. A count-up that starts at 0 in the markup would
 *      ship "0 products" to a crawler.
 *   2. Reduced-motion users never transition — the effect returns early without
 *      touching state at all.
 *   3. It satisfies `react-hooks/set-state-in-effect`: the only setState calls
 *      happen inside the IntersectionObserver callback and the rAF callback,
 *      both of which are external-system callbacks rather than synchronous
 *      effect-body work.
 *
 * WHY HAND-ROLLED RATHER THAN motion/react
 * ~50 lines, no dependency. A library would put a client runtime on every page
 * that shows a statistic — homepage, /about, vendor dashboard — for one counter.
 *
 * ACCESSIBILITY
 * The animating span is `aria-hidden` and a visually-hidden sibling carries the
 * real value, so a screen reader announces "1,176 reviews" once instead of
 * narrating a counter climbing through a thousand intermediate numbers.
 */

export interface AnimatedMetricProps {
  value: number;
  /** Seconds. Long enough to read as deliberate, short enough not to annoy. */
  duration?: number;
  /** Format the integer for display. Defaults to locale grouping. */
  format?: (n: number) => string;
  suffix?: string;
  prefix?: string;
  className?: string;
  /** Accessible label, e.g. "reviews". Announced after the value. */
  srLabel?: string;
}

/** easeOutQuart — fast start, gentle settle. Matches --ease-out-quiet's feel. */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function AnimatedMetric({
  value,
  duration = 1.1,
  format,
  suffix,
  prefix,
  className,
  srLabel,
}: AnimatedMetricProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = React.useState<number | null>(null);

  const fmt = React.useCallback(
    (n: number) => (format ? format(n) : Math.round(n).toLocaleString("en-US")),
    [format],
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion, or no observer support: leave `progress` at null. The
    // final value is already rendered, so there is nothing to do — and
    // crucially, no setState in the effect body.
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    let cancelled = false;

    const step = (now: number) => {
      if (cancelled) return;
      if (!start) start = now;
      const t = Math.min(1, (now - start) / 1000 / duration);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            setProgress(0);
            raf = requestAnimationFrame(step);
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    // Cancellation safety: a metric scrolled past mid-count must not keep
    // running rAF after unmount.
    return () => {
      cancelled = true;
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const shown = progress === null ? value : easeOutQuart(progress) * value;

  return (
    <span ref={ref} className={cn("tnum", className)}>
      <span aria-hidden="true">
        {prefix}
        {fmt(shown)}
        {suffix}
      </span>
      <span className="sr-only-focusable">
        {prefix}
        {fmt(value)}
        {suffix}
        {srLabel ? ` ${srLabel}` : ""}
      </span>
    </span>
  );
}
