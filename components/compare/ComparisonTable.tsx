"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { ComparisonRow, ComparisonSection, ComparisonValue, Product } from "@/lib/data/types";
import { ProductLogo } from "@/components/ui/avatar";
import { RatingLine, ScoreBar } from "@/components/domain/atoms";
import { Switch } from "@/components/ui/form-controls";

/**
 * The comparison table — the highest-value buying surface, so it gets the most care.
 *
 * Design decisions that matter here:
 *  - The first column is frozen and the header row is sticky, so a reader never loses
 *    track of which column belongs to which product.
 *  - Rows where every product is identical are muted; rows where they genuinely differ
 *    read at full contrast. That is the whole point of a comparison table.
 *  - Rows never animate. Scrolling a 100-row table must stay at 60fps.
 *  - "Differences only" collapses the table to the rows that actually discriminate.
 */
export function ComparisonTable({
  products,
  sections,
}: {
  products: Product[];
  sections: ComparisonSection[];
}) {
  const [differencesOnly, setDifferencesOnly] = React.useState(false);
  const differencesOnlyId = React.useId();

  const visibleSections = React.useMemo(() => {
    if (!differencesOnly) return sections;
    return sections
      .map((section) => ({
        ...section,
        rows: section.rows.filter((row) => row.differs),
      }))
      .filter((section) => section.rows.length > 0);
  }, [sections, differencesOnly]);

  const totalRows = sections.reduce((sum, s) => sum + s.rows.length, 0);
  const differingRows = sections.reduce(
    (sum, s) => sum + s.rows.filter((r) => r.differs).length,
    0,
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-13 text-muted-foreground tnum">
          <span className="font-medium text-foreground">{differingRows}</span> of {totalRows} rows
          differ across these products
        </p>
        <div className="flex items-center gap-2">
          <Switch
            id={differencesOnlyId}
            checked={differencesOnly}
            onCheckedChange={setDifferencesOnly}
          />
          <label htmlFor={differencesOnlyId} className="cursor-pointer text-13">
            Show differences only
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border">
        <div className="scroll-rail max-h-[75vh] overflow-auto overscroll-contain">
          <table className="w-full border-collapse text-left text-13">
            <caption className="sr-only">
              Feature and rating comparison for {products.map((p) => p.name).join(", ")}
            </caption>

            {/* ---------------------------------------------------- sticky head */}
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-30 w-[200px] min-w-[200px] border-b border-r border-border bg-subtle px-3 py-3 align-bottom"
                >
                  <span className="label-caps text-muted-foreground">Compare</span>
                </th>
                {products.map((product) => (
                  <th
                    key={product.slug}
                    scope="col"
                    className="sticky top-0 z-20 min-w-[220px] border-b border-border bg-subtle px-4 py-3 align-bottom"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex items-start gap-2.5 transition-colors hover:text-primary"
                    >
                      <ProductLogo name={product.name} domain={product.logoDomain} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{product.name}</span>
                        <span className="mt-0.5 block">
                          <RatingLine
                            rating={product.ratingAvg}
                            count={product.ratingCount}
                            size={11}
                          />
                        </span>
                        <span className="mt-0.5 block text-2xs font-normal text-muted-foreground tnum">
                          {formatPrice(product.startingPrice)}
                          {product.startingPrice ? ` ${product.pricingNote}` : ""}
                        </span>
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            {visibleSections.map((section) => (
              <tbody key={section.id}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={products.length + 1}
                    className="sticky left-0 z-10 border-y border-border bg-muted px-3 py-1.5 text-left"
                  >
                    <span className="label-caps text-foreground">{section.title}</span>
                  </th>
                </tr>

                {section.rows.map((row, rowIndex) => (
                  <ComparisonTableRow
                    key={`${section.id}-${row.label}`}
                    row={row}
                    striped={rowIndex % 2 === 1}
                  />
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>

      {visibleSections.length === 0 && (
        <p className="mt-3 rounded-card border border-dashed border-border-strong bg-subtle px-4 py-6 text-center text-13 text-muted-foreground">
          These products are identical across every tracked row. Turn off “differences only” to see
          the full table.
        </p>
      )}
    </div>
  );
}

function ComparisonTableRow({ row, striped }: { row: ComparisonRow; striped: boolean }) {
  return (
    <tr className={cn("group", striped && "bg-subtle/60")}>
      <th
        scope="row"
        className={cn(
          "sticky left-0 z-10 border-r border-border px-3 py-2.5 text-left text-13 font-normal",
          striped ? "bg-subtle" : "bg-card",
          row.differs ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {row.label}
      </th>
      {row.values.map((value, i) => (
        <td
          key={i}
          className={cn(
            "px-4 py-2.5 transition-colors group-hover:bg-muted/60",
            row.differs ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <ComparisonCell value={value} />
        </td>
      ))}
    </tr>
  );
}

function ComparisonCell({ value }: { value: ComparisonValue }) {
  switch (value.kind) {
    case "score":
      return (
        <span className="inline-flex items-baseline gap-2">
          <ScoreBar score={value.score ?? 0} />
          {value.sampleSize !== undefined && (
            <span className="text-2xs text-faint tnum">
              {value.sampleSize.toLocaleString("en-US")}
            </span>
          )}
        </span>
      );

    case "boolean":
      return value.boolean ? (
        <span className="inline-flex items-center gap-1.5 text-success">
          <Check className="size-4" aria-hidden="true" strokeWidth={2.5} />
          <span className="sr-only">Included</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-faint">
          <Minus className="size-4" aria-hidden="true" />
          <span className="sr-only">Not included</span>
        </span>
      );

    case "price":
      return (
        <span className="font-mono tnum">
          {value.price === null ? "Contact vendor" : formatPrice(value.price)}
        </span>
      );

    case "text":
      return <span className="text-13">{value.text}</span>;
  }
}
