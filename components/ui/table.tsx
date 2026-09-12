import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

/* ==========================================================================
   TABLE PRIMITIVES
   ========================================================================= */

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto scroll-rail">
      <table className={cn("w-full border-collapse text-left text-13", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-border", className)} {...props} />;
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("transition-colors hover:bg-subtle", className)} {...props} />;
}

export function TH({
  className,
  align = "left",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" | "center" }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-2 label-caps font-medium text-muted-foreground",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    />
  );
}

export function TD({
  className,
  align = "left",
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" | "center" }) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 align-middle",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    />
  );
}

/* ==========================================================================
   GENERIC DATA TABLE
   Used by both the vendor lead inbox and every admin queue, so column definition,
   empty state and alignment behave identically across dashboards.
   ========================================================================= */

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  align?: "left" | "right" | "center";
  /** Tailwind width utility, e.g. "w-40". Omit to let the column flex. */
  width?: string;
  render: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  empty,
  className,
  rowClassName,
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  caption: string;
  empty?: React.ReactNode;
  className?: string;
  rowClassName?: (row: T) => string | undefined;
}) {
  if (rows.length === 0 && empty) {
    return <div className={className}>{empty}</div>;
  }

  return (
    <Table className={className}>
      <caption className="sr-only">{caption}</caption>
      <THead>
        <tr>
          {columns.map((col) => (
            <TH
              key={col.key}
              align={col.align}
              className={cn(col.width, col.headerClassName)}
            >
              {col.header}
            </TH>
          ))}
        </tr>
      </THead>
      <TBody>
        {rows.map((row) => (
          <TR key={getRowKey(row)} className={rowClassName?.(row)}>
            {columns.map((col) => (
              <TD key={col.key} align={col.align} className={col.cellClassName}>
                {col.render(row)}
              </TD>
            ))}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}

/* ==========================================================================
   STATUS PILL — shared vocabulary for lead and review statuses
   ========================================================================= */

const STATUS_TONE: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
  NEW: "primary",
  CONTACTED: "warning",
  QUALIFIED: "success",
  CLOSED: "neutral",
  SPAM: "destructive",
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  FLAGGED: "destructive",
  DRAFT: "neutral",
  ARCHIVED: "neutral",
};

export function StatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      variant={STATUS_TONE[status] ?? "neutral"}
      size="md"
      caps
      className={className}
    >
      {status.toLowerCase()}
    </Badge>
  );
}
