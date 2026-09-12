"use client";

import * as React from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterFacets } from "@/lib/data/types";
import type { SearchParams } from "@/lib/data/queries";
import { Button } from "@/components/ui/button";
import { CheckboxRow, RadioGroup, RadioRow } from "@/components/ui/form-controls";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/overlay";
import { useFilterNavigation } from "./useFilters";

/* ==========================================================================
   DISCLOSURE GROUP
   ========================================================================= */

function FilterGroup({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = React.useId();

  return (
    <div className="border-b border-border py-3 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-[5px] py-0.5 text-left"
        >
          <span className="flex items-baseline gap-1.5 text-13 font-semibold">
            {title}
            {count !== undefined && count > 0 && (
              <span className="text-2xs font-normal text-primary tnum">{count}</span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      {open && (
        <div id={contentId} className="mt-2.5 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

/** Long feature lists are truncated with an explicit expander, not a scrollbar. */
function ExpandableList({ children, initial = 8 }: { children: React.ReactNode[]; initial?: number }) {
  const [expanded, setExpanded] = React.useState(false);
  const visible = expanded ? children : children.slice(0, initial);

  return (
    <>
      {visible}
      {children.length > initial && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          {expanded ? "Show fewer" : `Show ${children.length - initial} more`}
        </button>
      )}
    </>
  );
}

/* ==========================================================================
   FILTER RAIL
   ========================================================================= */

export function FilterRail({
  facets,
  basePath,
  params,
  activeCount,
  onNavigate,
  className,
}: {
  facets: FilterFacets;
  basePath: string;
  params: SearchParams;
  activeCount: number;
  onNavigate?: () => void;
  className?: string;
}) {
  const { values, toggleMulti, setSingle, clearAll } = useFilterNavigation(basePath, params);

  const isChecked = (key: string, value: string) => values(key).includes(value);

  const handleMulti = (key: string, value: string) => {
    toggleMulti(key, value);
    onNavigate?.();
  };
  const handleSingle = (key: string, value: string) => {
    setSingle(key, value);
    onNavigate?.();
  };

  return (
    <div className={cn("text-foreground", className)}>
      <div className="flex items-center justify-between gap-2 pb-2">
        {/* A real heading, not a styled paragraph: the groups below are <h3>, and an
            h1 → h3 jump breaks the document outline for screen-reader users. */}
        <h2 className="label-caps text-muted-foreground">
          Filters
          {activeCount > 0 && <span className="ml-1 text-primary">({activeCount})</span>}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => {
              clearAll();
              onNavigate?.();
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Pricing">
        {facets.pricing.map((facet) => (
          <CheckboxRow
            key={facet.value}
            id={`pricing-${facet.value}`}
            label={facet.label}
            count={facet.count}
            checked={isChecked("pricing", facet.value)}
            onCheckedChange={() => handleMulti("pricing", facet.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Minimum rating">
        <RadioGroup
          value={values("rating")[0] ?? ""}
          onValueChange={(v) => handleSingle("rating", v)}
          className="space-y-2"
        >
          {facets.rating.map((facet) => (
            <RadioRow
              key={facet.value}
              id={`rating-${facet.value}`}
              value={facet.value}
              label={facet.label}
              count={facet.count}
            />
          ))}
        </RadioGroup>
      </FilterGroup>

      <FilterGroup title="Deployment">
        {facets.deployment.map((facet) => (
          <CheckboxRow
            key={facet.value}
            id={`deployment-${facet.value}`}
            label={facet.label}
            count={facet.count}
            checked={isChecked("deployment", facet.value)}
            onCheckedChange={() => handleMulti("deployment", facet.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Company size">
        {facets.companySize.map((facet) => (
          <CheckboxRow
            key={facet.value}
            id={`size-${facet.value}`}
            label={facet.label}
            count={facet.count}
            checked={isChecked("size", facet.value)}
            onCheckedChange={() => handleMulti("size", facet.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Features" defaultOpen={false}>
        <ExpandableList>
          {facets.features.map((facet) => (
            <CheckboxRow
              key={facet.value}
              id={`feature-${facet.value}`}
              label={facet.label}
              count={facet.count}
              checked={isChecked("feature", facet.value)}
              onCheckedChange={() => handleMulti("feature", facet.value)}
            />
          ))}
        </ExpandableList>
      </FilterGroup>

      <FilterGroup title="Integrations" defaultOpen={false}>
        <ExpandableList>
          {facets.integrations.map((facet) => (
            <CheckboxRow
              key={facet.value}
              id={`integration-${facet.value}`}
              label={facet.label}
              count={facet.count}
              checked={isChecked("integration", facet.value)}
              onCheckedChange={() => handleMulti("integration", facet.value)}
            />
          ))}
        </ExpandableList>
      </FilterGroup>

      <p className="pt-3 text-2xs leading-relaxed text-faint">
        Filter counts reflect the current result set. Selecting a filter never narrows a count to
        zero.
      </p>
    </div>
  );
}

/* ==========================================================================
   MOBILE FILTER DRAWER
   ========================================================================= */

export function FilterDrawer({
  facets,
  basePath,
  params,
  activeCount,
}: {
  facets: FilterFacets;
  basePath: string;
  params: SearchParams;
  activeCount: number;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-pill bg-primary px-1.5 text-2xs font-semibold text-primary-foreground tnum">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent title="Filters" description="Narrow the results" side="right">
        <div className="p-4">
          <FilterRail
            facets={facets}
            basePath={basePath}
            params={params}
            activeCount={activeCount}
          />
          <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border bg-card p-4">
            <Button block onClick={() => setOpen(false)}>
              Show results
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
