"use client";

import { ArrowDownUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterFacets, SortKey } from "@/lib/data/types";
import type { SearchParams } from "@/lib/data/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form-controls";
import { useFilterNavigation } from "./useFilters";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "score", label: "Composite score" },
  { value: "satisfaction", label: "Highest rated" },
  { value: "popularity", label: "Most popular" },
  { value: "reviews", label: "Most reviews" },
  { value: "name", label: "Name (A–Z)" },
];

const PRICING_LABELS: Record<string, string> = {
  free: "Free version",
  free_trial: "Free trial",
  paid: "Paid only",
};

const DEPLOYMENT_LABELS: Record<string, string> = {
  cloud: "Cloud",
  on_premise: "On-premise",
  mobile: "Mobile app",
  hybrid: "Hybrid",
};

const SIZE_LABELS: Record<string, string> = {
  small: "Small business",
  mid: "Mid-market",
  enterprise: "Enterprise",
};

/**
 * Result toolbar: sort control plus removable filter chips.
 *
 * Chips are the visible receipt for what is currently filtered — without them, a
 * narrow result set with an off-screen filter reads as a bug.
 */
export function ResultToolbar({
  total,
  sort,
  facets,
  basePath,
  params,
  activeCount,
  filterButton,
  className,
}: {
  total: number;
  sort: SortKey;
  facets: FilterFacets;
  basePath: string;
  params: SearchParams;
  activeCount: number;
  filterButton?: React.ReactNode;
  className?: string;
}) {
  const { values, clearOne, clearAll, push } = useFilterNavigation(basePath, params);

  const labelFor = (key: string, value: string): string => {
    if (key === "pricing") return PRICING_LABELS[value] ?? value;
    if (key === "deployment") return DEPLOYMENT_LABELS[value] ?? value;
    if (key === "size") return SIZE_LABELS[value] ?? value;
    if (key === "rating") return `${value}+ stars`;
    if (key === "feature") return facets.features.find((f) => f.value === value)?.label ?? value;
    if (key === "integration") {
      return facets.integrations.find((f) => f.value === value)?.label ?? value;
    }
    return value;
  };

  const chips: { key: string; value: string; label: string }[] = [];
  for (const key of ["pricing", "deployment", "size", "rating", "feature", "integration"]) {
    for (const value of values(key)) {
      chips.push({ key, value, label: labelFor(key, value) });
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-13 text-muted-foreground tnum">
          <span className="font-medium text-foreground">{total.toLocaleString("en-US")}</span>{" "}
          {total === 1 ? "product" : "products"}
        </p>

        <div className="flex items-center gap-2">
          {filterButton}
          <div className="flex items-center gap-1.5">
            <ArrowDownUp className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
            <Select
              value={sort}
              onValueChange={(value) => push({ sort: value === "score" ? null : value })}
            >
              <SelectTrigger label="Sort results" className="min-w-[168px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <li key={`${chip.key}-${chip.value}`}>
              <button
                type="button"
                onClick={() => clearOne(chip.key, chip.value)}
                className="inline-flex items-center gap-1 rounded-pill border border-primary-border bg-primary-subtle py-0.5 pl-2.5 pr-1.5 text-2xs font-medium text-primary transition-colors hover:border-primary"
              >
                {chip.label}
                <X className="size-3" aria-hidden="true" />
                <span className="sr-only">
                  Remove {chip.label} filter
                </span>
              </button>
            </li>
          ))}
          {activeCount > 1 && (
            <li>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-pill px-2 py-0.5 text-2xs font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
              >
                Clear all
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
