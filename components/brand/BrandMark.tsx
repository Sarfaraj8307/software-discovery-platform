import { cn } from "@/lib/utils";

/**
 * The mark: three ascending rounded bars.
 *
 * Reads as ranking / comparison / growth — which is what the product actually
 * does — rather than the generic scales-of-justice glyph it replaces. Drawn on
 * a 24px grid so it stays crisp at 16px (favicon) and 28px (header plate).
 *
 * Fills with `currentColor`, so it inherits on any surface: white on the
 * gradient plate, `text-primary` on white, white on the inverse band. No
 * hardcoded colour, no `useId` (this renders in server components).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.5" y="13" width="5" height="8" rx="2.5" fill="currentColor" />
      <rect x="9.5" y="8" width="5" height="13" rx="2.5" fill="currentColor" />
      <rect x="16.5" y="3" width="5" height="18" rx="2.5" fill="currentColor" />
    </svg>
  );
}

type BrandLogoProps = {
  /** Classes applied to the gradient plate. */
  className?: string;
  /** Classes applied to the wordmark — the header hides it below `sm`. */
  wordmarkClassName?: string;
  /** Set false for icon-only usages. */
  withWordmark?: boolean;
};

/**
 * Lockup = gradient plate + wordmark. The plate uses `--background-image-gradient-brand`
 * (primary → brand-2). This is the one place a gradient is structural rather than
 * decorative, which is exactly the role `brand-2` exists for.
 */
export function BrandLogo({
  className,
  wordmarkClassName,
  withWordmark = true,
}: BrandLogoProps) {
  return (
    <>
      <span
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-gradient-brand text-white shadow-card",
          className,
        )}
        aria-hidden="true"
      >
        <BrandMark className="size-4" />
      </span>
      {withWordmark ? (
        <span
          className={cn("text-sm font-semibold tracking-[-0.02em]", wordmarkClassName)}
        >
          Software Discovery
        </span>
      ) : null}
    </>
  );
}
