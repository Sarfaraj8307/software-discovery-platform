import * as React from "react";
import { BadgeCheck, Camera, Gift, Info, ShieldCheck, Star, UserRound } from "lucide-react";
import { cn, formatCompact, formatCount, formatRating } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/overlay";
import type { VerificationLabel } from "@/lib/data/types";

/* ==========================================================================
   STAR RATING
   Two layers: an outline row, and a filled row clipped to the exact fraction.
   That keeps half-stars honest without shipping a half-star glyph.
   ========================================================================= */

export function StarRating({
  rating,
  size = 14,
  className,
  label,
}: {
  rating: number;
  size?: number;
  className?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const stars = [0, 1, 2, 3, 4];

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? `Rated ${formatRating(rating)} out of 5`}
    >
      {stars.map((i) => (
        <Star
          key={`o-${i}`}
          style={{ width: size, height: size }}
          className="text-border-strong"
          strokeWidth={1.75}
          fill="none"
          aria-hidden="true"
        />
      ))}
      <span
        className="pointer-events-none absolute inset-0 flex items-center gap-0.5 overflow-hidden"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      >
        {stars.map((i) => (
          <Star
            key={`f-${i}`}
            style={{ width: size, height: size, minWidth: size }}
            className="text-warning"
            strokeWidth={1.75}
            fill="currentColor"
          />
        ))}
      </span>
    </span>
  );
}

/** Rating + review count, the single most repeated unit in the product. */
export function RatingLine({
  rating,
  count,
  size = 14,
  className,
  showCount = true,
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
  showCount?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-13", className)}>
      <span className="font-medium tnum">{formatRating(rating)}</span>
      <StarRating rating={rating} size={size} />
      {showCount && count !== undefined && (
        <span className="text-muted-foreground tnum">({formatCompact(count)})</span>
      )}
    </span>
  );
}

/* ==========================================================================
   SCORE BADGE
   The composite score is proprietary, so it always carries its explanation.
   ========================================================================= */

export function ScoreBadge({
  score,
  size = "default",
  className,
}: {
  score: number;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const dims = {
    sm: "text-2xs px-1.5 py-0.5",
    default: "text-13 px-2 py-0.5",
    lg: "text-base px-2.5 py-1",
  }[size];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-baseline gap-0.5 rounded-[5px] border border-border bg-subtle font-mono font-medium tabular-nums",
            dims,
            className,
          )}
        >
          {score}
          <span className="text-2xs text-faint">/100</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Composite score out of 100. Weighted: verified review volume, satisfaction across four
        dimensions, and functional coverage against the category taxonomy. Vendors cannot
        influence it. See our methodology.
      </TooltipContent>
    </Tooltip>
  );
}

/* ==========================================================================
   TRUST BADGES
   Verification is a badge row, not a footnote. The incentivized label is rendered
   with equal prominence — suppressing it would breach FTC 16 CFR Part 255.
   ========================================================================= */

const VERIFICATION_META: Record<
  VerificationLabel,
  { label: string; icon: React.ReactNode; variant: React.ComponentProps<typeof Badge>["variant"]; title: string }
> = {
  VALIDATED: {
    label: "Validated Reviewer",
    icon: <BadgeCheck className="size-3" aria-hidden="true" />,
    variant: "success",
    title: "Identity verified against a business email address.",
  },
  CURRENT_USER: {
    label: "Current User",
    icon: <Camera className="size-3" aria-hidden="true" />,
    variant: "success",
    title: "Reviewer supplied a screenshot of the product in use.",
  },
  INCENTIVIZED: {
    label: "Incentivized",
    icon: <Gift className="size-3" aria-hidden="true" />,
    variant: "warning",
    title:
      "Reviewer received a gift card. The rating still counts but is weighted lower in the score. We never hide this.",
  },
  GUEST: {
    label: "Guest",
    icon: <UserRound className="size-3" aria-hidden="true" />,
    variant: "neutral",
    title: "Submitted without identity verification. Not counted toward the composite score.",
  },
};

export function VerificationBadge({
  verification,
  size = "sm",
  className,
}: {
  verification: VerificationLabel;
  size?: React.ComponentProps<typeof Badge>["size"];
  className?: string;
}) {
  const meta = VERIFICATION_META[verification];
  return (
    <Badge variant={meta.variant} size={size} className={cn("cursor-help", className)} title={meta.title}>
      {meta.icon}
      {meta.label}
    </Badge>
  );
}

/** Verified-publisher marker for a product or vendor. */
export function VerifiedPublisherBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-success", className)}
      title="The vendor has claimed and verified this listing."
    >
      <ShieldCheck className="size-3.5" aria-hidden="true" />
      <span className="text-2xs font-medium">Verified publisher</span>
    </span>
  );
}

/* ==========================================================================
   SMALL PARTS
   ========================================================================= */

/** Neutral capability tag, e.g. "Free Trial" or "192 integrations". */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "success";
  className?: string;
}) {
  const tones = {
    neutral: "border-border bg-subtle text-muted-foreground",
    primary: "border-primary-border bg-primary-subtle text-primary",
    success: "border-success-border bg-success-subtle text-success",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[5px] border px-2 py-0.5 text-2xs font-medium whitespace-nowrap",
        tones,
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Interpunct separator for inline metadata rows. */
export function MetaDot({ className }: { className?: string }) {
  return (
    <span className={cn("text-faint select-none", className)} aria-hidden="true">
      ·
    </span>
  );
}

/** Inline explanatory note, always paired with an icon so it reads as guidance. */
export function NoteLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground", className)}>
      <Info className="mt-0.5 size-3 shrink-0 text-faint" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/**
 * The synthetic-data disclosure. Present on every surface that renders generated
 * ratings or reviews — fabricated reviews must never be presented as genuine.
 */
export function DemoDataNotice({
  className,
  variant = "inline",
}: {
  className?: string;
  variant?: "inline" | "banner";
}) {
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex items-start gap-2 rounded-card border border-warning-border bg-warning-subtle px-3 py-2 text-xs leading-relaxed text-warning",
          className,
        )}
      >
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-medium">Demonstration dataset.</span> Product and vendor names are
          real and used descriptively, but every rating, review, review count and price on this
          page is synthetic. None of it reflects real user feedback.
        </p>
      </div>
    );
  }

  return (
    <p className={cn("text-2xs text-faint", className)}>
      Demonstration dataset — ratings and reviews are synthetic, not real user feedback.
    </p>
  );
}

/** Score → bar micro-visualisation, so 8.8 vs 8.6 is legible without reading digits. */
export function ScoreBar({
  score,
  max = 10,
  className,
}: {
  score: number;
  max?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="w-7 shrink-0 text-right font-mono text-13 font-medium tabular-nums">
        {score.toFixed(1)}
      </span>
      <span className="h-1 w-16 shrink-0 overflow-hidden rounded-pill bg-muted" aria-hidden="true">
        <span className="block h-full rounded-pill bg-primary" style={{ width: `${pct}%` }} />
      </span>
    </span>
  );
}

export { formatCount, formatCompact };
