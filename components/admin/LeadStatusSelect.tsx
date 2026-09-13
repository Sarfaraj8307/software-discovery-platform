"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/data/types";

/**
 * Inline status control for one enquiry row.
 *
 * A native <select> rather than the Radix Select in `ui/form-controls`: this renders once per
 * row in a 50-row table, and a native control is keyboard- and screen-reader-complete with no
 * per-instance JS. The Radix version would be a menu with a portal per row.
 *
 * The accessible name includes the contact so a screen reader's form-control list reads
 * "Status for Alex Morgan" rather than fifty identical "Status" entries.
 */
export function LeadStatusSelect({
  leadId,
  contact,
  status,
}: {
  leadId: string;
  contact: string;
  status: LeadStatus;
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function change(next: LeadStatus) {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : "That change could not be saved.";
        setError(message);
        setSaving(false);
        return;
      }

      setSaving(false);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setSaving(false);
    }
  }

  return (
    <span className="inline-flex items-center justify-end gap-1.5">
      <select
        aria-label={`Status for ${contact}`}
        value={status}
        disabled={saving}
        onChange={(event) => void change(event.target.value as LeadStatus)}
        className="h-7 rounded-[7px] border border-border bg-card px-1.5 text-2xs font-medium text-foreground disabled:opacity-60"
      >
        {LEAD_STATUSES.map((option) => (
          <option key={option} value={option}>
            {saving && option === status ? "Saving…" : option.toLowerCase()}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="text-2xs text-destructive">
          {error}
        </span>
      )}
    </span>
  );
}
