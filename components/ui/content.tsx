import * as React from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatPercentValue } from "@/lib/utils";

/* ==========================================================================
   SECTION HEADING — editorial section header used across marketing pages
   ========================================================================= */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
  id?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 label-caps text-muted-foreground">{eyebrow}</p>}
        <Tag id={id} className="text-xl font-semibold tracking-[-0.02em]">
          {title}
        </Tag>
        {description && (
          <p className="mt-1 max-w-2xl text-13 text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** "Browse all →" style trailing link. */
export function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      // -my-1 py-1 keeps the visual position unchanged while lifting the hit area to
      // ~28px tall, which clears the WCAG 2.5.8 24px minimum for a standalone link.
      className="-my-1 inline-flex shrink-0 items-center gap-1 py-1 text-13 font-medium text-primary transition-colors hover:text-primary-hover"
    >
      {children}
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

/* ==========================================================================
   EMPTY STATE
   Never a dead end: every instance takes at least one onward route.
   ========================================================================= */

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong bg-subtle px-6 py-12 text-center",
        className,
      )}
    >
      <span className="text-faint" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-3 text-base font-semibold">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-13 leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   KPI CARD — dashboard metric with an explicit delta direction
   ========================================================================= */

export function KpiCard({
  label,
  value,
  delta,
  hint,
  className,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  className?: string;
}) {
  const positive = delta !== undefined && delta >= 0;
  return (
    <div className={cn("rounded-card border border-border bg-card p-4 shadow-card", className)}>
      <p className="label-caps text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] tnum">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium tnum",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? (
              <TrendingUp className="size-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3" aria-hidden="true" />
            )}
            {positive ? "+" : ""}
            {formatPercentValue(delta)}
          </span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

/* ==========================================================================
   PROGRESS BAR
   Linear only — never a pie, never 3D. Used for rating distributions and
   satisfaction breakdowns.
   ========================================================================= */

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  label,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-pill bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-pill bg-primary transition-[width] duration-200 ease-out", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Small inline stat used in trust strips and quick-stats panels. */
export function StatPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      <span className="text-2xs text-muted-foreground">{label}</span>
      <span className="text-13 font-medium tnum">{value}</span>
    </div>
  );
}
