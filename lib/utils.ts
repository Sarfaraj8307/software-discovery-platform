import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names, resolving Tailwind conflicts so that a
 * caller-supplied class always wins over a component default.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1234 -> "1,234" */
export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** 1234 -> "1.2K", 25789 -> "25.8K", 3600000 -> "3.6M" */
export function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}K`;
  }
  const m = n / 1_000_000;
  return `${m >= 100 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, "")}M`;
}

/** 25 -> "$25", 24.5 -> "$24.50", null -> "Contact vendor" */
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Contact vendor";
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

/** 4.3812 -> "4.4" */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

/**
 * Ratio -> percent string. Scales by 100.
 * 0.64 -> "64%"
 *
 * Only pass a ratio (0..1). For a number that is *already* expressed in
 * percent — a delta such as 12.4 — use `formatPercentValue` instead, or the
 * value will be inflated 100x.
 */
export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/**
 * Percent number -> percent string. Does NOT scale.
 * 12.4 -> "12.4%"
 *
 * The counterpart to `formatPercent`. Use this for values that are already in
 * percent (VendorMetrics deltas), and `formatPercent` for ratios.
 */
export function formatPercentValue(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** "2026-09-12" -> "September 2026" — used in category H1s. */
export function monthYear(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "2026-08-13" -> "Aug 13, 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** Relative recency for review timestamps. */
export function relativeDate(iso: string, now = new Date("2026-09-12T00:00:00Z")): string {
  const then = new Date(iso);
  const days = Math.floor((now.getTime() - then.getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

/** Deterministic, evenly-spread hue from a string — used for logo monograms. */
export function monogramTone(seed: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  // Desaturated to stay inside the grayscale-plus-one-accent discipline.
  return { bg: `hsl(${h} 24% 94%)`, fg: `hsl(${h} 30% 32%)` };
}

/** First letters of a product or person name, max 2. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Build a querystring, preserving existing params and dropping empties.
 * Used by filter/sort/pagination controls so state always lives in the URL.
 */
export function buildQuery(
  current: Record<string, string | string[] | undefined>,
  patch: Record<string, string | number | string[] | null | undefined>,
): string {
  const sp = new URLSearchParams();
  const merged: Record<string, string | string[] | undefined> = { ...current };

  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === "") {
      delete merged[key];
    } else if (Array.isArray(value)) {
      merged[key] = value;
    } else {
      merged[key] = String(value);
    }
  }

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      for (const v of value) sp.append(key, v);
    } else {
      sp.set(key, value);
    }
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/** Canonical, alphabetically-sorted compare slug: ["b","a"] -> "a-vs-b". */
export function canonicalCompareSlug(slugs: string[]): string {
  return [...slugs].sort((a, b) => a.localeCompare(b)).join("-vs-");
}
