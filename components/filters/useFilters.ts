"use client";

import { useRouter } from "next/navigation";
import { buildQuery } from "@/lib/utils";
import type { SearchParams } from "@/lib/data/queries";

/**
 * Filter navigation.
 *
 * The URL is the single source of truth for filter state. Nothing is duplicated in
 * React state, which means filtered views are shareable, bookmarkable, crawlable and
 * survive a refresh — and there is no synchronisation bug possible between two copies.
 */
export function useFilterNavigation(basePath: string, params: SearchParams) {
  const router = useRouter();

  const push = (
    patch: Record<string, string | number | string[] | null | undefined>,
    options: { keepPage?: boolean } = {},
  ) => {
    const merged = options.keepPage ? patch : { ...patch, page: null };
    const qs = buildQuery(params, merged);
    router.push(`${basePath}${qs}`, { scroll: false });
  };

  const values = (key: string): string[] => {
    const raw = params[key];
    if (raw === undefined) return [];
    return Array.isArray(raw) ? raw : [raw];
  };

  /** Checkbox semantics: add if absent, remove if present. */
  const toggleMulti = (key: string, value: string) => {
    const current = values(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    push({ [key]: next.length > 0 ? next : null });
  };

  /** Radio semantics: replace, or clear when the same value is re-selected. */
  const setSingle = (key: string, value: string | null) => {
    const current = values(key)[0] ?? null;
    push({ [key]: current === value ? null : value });
  };

  const clearAll = () =>
    push({
      pricing: null,
      deployment: null,
      size: null,
      feature: null,
      integration: null,
      rating: null,
    });

  const clearOne = (key: string, value?: string) => {
    if (value === undefined) {
      push({ [key]: null });
      return;
    }
    const next = values(key).filter((v) => v !== value);
    push({ [key]: next.length > 0 ? next : null });
  };

  return { push, values, toggleMulti, setSingle, clearAll, clearOne };
}
