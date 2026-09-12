"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn, formatCount, initials, monogramTone } from "@/lib/utils";
import type { Integration } from "@/lib/data/types";
import { SearchInput } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 36;

/**
 * Integration directory.
 *
 * Capped initially rather than rendering all 46 at once: a wall of logos is not
 * scannable, and a search box is a faster path than scrolling when a buyer already
 * knows which integration they need.
 */
export function IntegrationGrid({ integrations }: { integrations: Integration[] }) {
  const [query, setQuery] = React.useState("");
  const [visible, setVisible] = React.useState(PAGE_SIZE);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return integrations;
    return integrations.filter(
      (i) =>
        i.name.toLowerCase().includes(needle) ||
        i.category.toLowerCase().includes(needle),
    );
  }, [integrations, query]);

  const shown = filtered.slice(0, visible);

  const byCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const integration of integrations) {
      map.set(integration.category, (map.get(integration.category) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [integrations]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-xs">
          <SearchInput
            icon={<Search className="size-3.5" />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search integrations…"
            aria-label="Search integrations"
          />
        </div>

        <p className="text-13 text-muted-foreground tnum">
          Showing <span className="font-medium text-foreground">{shown.length}</span> of{" "}
          {formatCount(filtered.length)}
        </p>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {byCategory.map(([category, count]) => (
          <li key={category}>
            <button
              type="button"
              onClick={() => {
                setQuery(query === category ? "" : category);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "rounded-pill border px-2.5 py-1 text-2xs font-medium transition-colors",
                query === category
                  ? "border-primary-border bg-primary-subtle text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {category}
              <span className="ml-1 text-faint tnum">{count}</span>
            </button>
          </li>
        ))}
      </ul>

      {shown.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-border-strong bg-subtle px-4 py-8 text-center text-13 text-muted-foreground">
          No integrations match “{query.trim()}”.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {shown.map((integration) => {
            const tone = monogramTone(integration.name);
            return (
              <li
                key={integration.slug}
                className="flex items-center gap-2.5 rounded-card border border-border bg-card px-2.5 py-2"
              >
                <span
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-[6px] border border-border/70 text-2xs font-semibold"
                  style={{ backgroundColor: tone.bg, color: tone.fg }}
                  aria-hidden="true"
                >
                  {initials(integration.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium">{integration.name}</span>
                  <span className="block truncate text-2xs text-faint">{integration.category}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {filtered.length > visible && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-control border border-border-strong bg-card px-4 py-2 text-13 font-medium transition-colors hover:bg-muted"
          >
            Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Badge variant="success" size="sm">
          Verified by vendor
        </Badge>
        <p className="text-2xs text-muted-foreground">
          Integration counts reflect vendor-declared listings and are not independently tested.
        </p>
      </div>
    </div>
  );
}
