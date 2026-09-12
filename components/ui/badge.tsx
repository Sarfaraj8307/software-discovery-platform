import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badges carry meaning, so the palette is constrained on purpose:
 * `success` is reserved for verification, `warning` for disclosure (sponsored /
 * incentivized). Using either decoratively would dilute the trust signal.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[4px] border font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-muted-foreground",
        outline: "border-border bg-card text-muted-foreground",
        primary: "border-primary-border bg-primary-subtle text-primary",
        success: "border-success-border bg-success-subtle text-success",
        warning: "border-warning-border bg-warning-subtle text-warning",
        destructive: "border-destructive-border bg-destructive-subtle text-destructive",
        solid: "border-transparent bg-foreground text-background",
      },
      size: {
        sm: "px-1.5 py-0.5 text-2xs",
        default: "px-2 py-0.5 text-2xs",
        md: "px-2 py-1 text-xs",
      },
      caps: {
        true: "label-caps",
      },
    },
    defaultVariants: { variant: "neutral", size: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, caps, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, caps }), className)} {...props} />;
}

/**
 * Sponsored / incentivized disclosure. Kept as a named component so it can never be
 * accidentally rendered without its tooltip — FTC 16 CFR Part 255 requires the
 * disclosure to be clear, not merely present.
 */
export function DisclosureBadge({
  label,
  title,
  className,
}: {
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <Badge variant="warning" size="sm" caps className={cn("cursor-help", className)} title={title}>
      {label}
    </Badge>
  );
}
