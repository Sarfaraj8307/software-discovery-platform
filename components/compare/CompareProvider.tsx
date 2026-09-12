"use client";

import * as React from "react";

/**
 * Comparison bucket state.
 *
 * Deliberately a single provider rather than per-page state: the bucket is global, and
 * the count must survive navigation from a category listing to a product profile. The
 * minimal item shape is stored (not just slugs) so the sticky bucket can render names
 * and logos without any data fetching on the client.
 */

export interface CompareItem {
  slug: string;
  name: string;
  logoDomain: string;
  categoryName: string;
}

export const COMPARE_LIMIT = 4;
const STORAGE_KEY = "sdp:compare";

interface CompareContextValue {
  items: CompareItem[];
  has: (slug: string) => boolean;
  toggle: (item: CompareItem) => { ok: boolean; reason?: "limit" | "removed" };
  remove: (slug: string) => void;
  clear: () => void;
  isFull: boolean;
}

const CompareContext = React.createContext<CompareContextValue | null>(null);

/* ------------------------------------------------------------------- store
   localStorage is the source of truth, exposed to React via
   useSyncExternalStore. This is React's documented answer for reading an
   external store without a hydration mismatch: the server snapshot is empty,
   React hydrates against it, then immediately re-reads the client snapshot.
   It replaces a mount-time setState that `react-hooks/set-state-in-effect`
   flags as a cascading render, and it drops the `hydrated` write-guard the
   old two-effect version needed.
   ------------------------------------------------------------------------ */

const EMPTY: CompareItem[] = [];

const listeners = new Set<() => void>();
let memory: CompareItem[] = EMPTY;
let loaded = false;

function parse(raw: string | null): CompareItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const items = parsed
      .filter(
        (v): v is CompareItem =>
          typeof v === "object" &&
          v !== null &&
          typeof (v as CompareItem).slug === "string" &&
          typeof (v as CompareItem).name === "string",
      )
      .slice(0, COMPARE_LIMIT);
    return items.length > 0 ? items : EMPTY;
  } catch {
    // Corrupt or unavailable storage must never break the page.
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Must be referentially stable while the store is unchanged, or React loops. */
function getSnapshot(): CompareItem[] {
  if (!loaded) {
    memory = parse(readRaw());
    loaded = true;
  }
  return memory;
}

function getServerSnapshot(): CompareItem[] {
  return EMPTY;
}

function notify() {
  for (const listener of [...listeners]) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab wrote the key: drop the cache and re-read.
  const onStorage = () => {
    loaded = false;
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Commit a new bucket: memory first, storage best-effort, then wake React. */
function commit(next: CompareItem[]) {
  memory = next.length > 0 ? next : EMPTY;
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* storage disabled — comparison still works for this session */
  }
  notify();
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const has = React.useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const toggle = React.useCallback<CompareContextValue["toggle"]>((item) => {
    const prev = getSnapshot();
    if (prev.some((i) => i.slug === item.slug)) {
      commit(prev.filter((i) => i.slug !== item.slug));
      return { ok: true, reason: "removed" };
    }
    if (prev.length >= COMPARE_LIMIT) return { ok: false, reason: "limit" };
    commit([...prev, item]);
    return { ok: true };
  }, []);

  const remove = React.useCallback((slug: string) => {
    commit(getSnapshot().filter((i) => i.slug !== slug));
  }, []);

  const clear = React.useCallback(() => commit([]), []);

  const value = React.useMemo<CompareContextValue>(
    () => ({ items, has, toggle, remove, clear, isFull: items.length >= COMPARE_LIMIT }),
    [items, has, toggle, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const ctx = React.useContext(CompareContext);
  if (!ctx) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("useCompare must be used within <CompareProvider>");
    }
    return {
      items: [],
      has: () => false,
      toggle: () => ({ ok: false }),
      remove: () => undefined,
      clear: () => undefined,
      isFull: false,
    };
  }
  return ctx;
}

/** Canonical compare href, alphabetically sorted so the URL is stable and crawlable. */
export function compareHref(items: CompareItem[]): string {
  const slugs = items.map((i) => i.slug).sort((a, b) => a.localeCompare(b));
  return `/compare/${slugs.join("-vs-")}`;
}
