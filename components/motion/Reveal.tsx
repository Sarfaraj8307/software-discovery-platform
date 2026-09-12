"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. Renders its children inside a `.reveal` element and
 * adds `.is-visible` once it scrolls into view, so the CSS transition fires.
 *
 * Content is never trapped: a `<noscript>` fallback in the root layout forces
 * `.reveal` visible when JS is off, the `@media (scripting: none)` guard in
 * globals.css does the same for modern browsers, and any `prefers-reduced-motion:
 * reduce` user sees it immediately. If IntersectionObserver is unavailable the
 * element is shown immediately.
 */
export function Reveal({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger, ms — applied as transition-delay. Keep small. */
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Ancient browser with no IntersectionObserver: reveal on the next frame
      // rather than synchronously (avoids a cascading render and the lint rule).
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
