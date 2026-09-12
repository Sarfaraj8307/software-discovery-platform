import { cn } from "@/lib/utils";

/**
 * Generated illustration states for empty / error surfaces.
 *
 * Quiet, enterprise-grade line art — never neon, never 3D. Accent is the brand-2
 * gradient partner (indigo-600) used sparingly; the rest is neutral slate so the
 * mark reads as a calm placeholder, not a banner. Decorative only: `aria-hidden`.
 */

const INDIGO = "#4f46e5";
const SLATE_100 = "#f1f5f9";
const SLATE_200 = "#e2e8f0";
const SLATE_300 = "#cbd5e1";

/** Empty / no-results: a document with placeholder lines and a magnifier. */
export function EmptyArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 144 120"
      className={cn("size-32", className)}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="14" y="18" width="116" height="84" rx="12" fill={SLATE_100} stroke={SLATE_300} strokeWidth="1.5" />
      <rect x="28" y="36" width="62" height="7" rx="3.5" fill={SLATE_200} />
      <rect x="28" y="52" width="88" height="6" rx="3" fill={SLATE_200} />
      <rect x="28" y="66" width="72" height="6" rx="3" fill={SLATE_200} />
      <circle cx="108" cy="86" r="15" fill="#ffffff" stroke={INDIGO} strokeWidth="2.5" />
      <line x1="119" y1="97" x2="130" y2="108" stroke={INDIGO} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Error / something-went-wrong: a shield with an exclamation mark. */
export function ErrorArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 144 120"
      className={cn("size-32", className)}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M72 18 L122 40 V70 C122 96 99 109 72 114 C45 109 22 96 22 70 V40 Z"
        fill={SLATE_100}
        stroke={SLATE_300}
        strokeWidth="1.5"
      />
      <circle cx="72" cy="60" r="6" fill={INDIGO} />
      <line x1="72" y1="73" x2="72" y2="88" stroke={INDIGO} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
