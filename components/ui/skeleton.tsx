import { cn } from "@/lib/utils";

/**
 * Neutral placeholder block for loading states. Decorative only — hidden from
 * assistive tech. The pulse is disabled under `prefers-reduced-motion` (see the
 * `.skeleton` guard in globals.css) so reduced-motion users see a static fill.
 */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("skeleton", className)} />;
}
