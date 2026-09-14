"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DEMO_OWNERS, type LeadOwner } from "@/lib/data/types";

/**
 * Inline owner control for one enquiry row.
 *
 * Same pattern as `LeadStatusSelect`: a native <select> rather than the Radix menu, so a
 * 50-row table can render once per row without per-instance JS. The accessible name
 * includes the contact so a screen reader's form-control list reads "Owner for Alex
 * Morgan" rather than fifty identical "Owner" entries.
 *
 * The demo roster is hardcoded (see DEMO_OWNERS in types.ts) — auth (P0.2) is the only
 * honest way to replace it, and the page discloses that the roster is illustrative.
 */
export function LeadOwnerSelect({
  leadId,
  contact,
  ownerId,
}: {
  leadId: string;
  contact: string;
  ownerId: LeadOwner | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function change(next: string) {
    setSaving(true);
    setError(null);

    // The <select> uses "" for the unassigned option; map it back to null on the wire
    // so the route receives the same shape as the Lead.ownerId field.
    const payload: { ownerId: LeadOwner | null } = {
      ownerId: next === "" ? null : (next as LeadOwner),
    };

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // Empty string is the HTML convention for the unassigned option.
  const selectValue = ownerId ?? "";

  return (
    <span className="inline-flex items-center justify-end gap-1.5">
      <select
        aria-label={`Owner for ${contact}`}
        value={selectValue}
        disabled={saving}
        onChange={(event) => void change(event.target.value)}
        className="h-7 rounded-[7px] border border-border bg-card px-1.5 text-2xs font-medium text-foreground disabled:opacity-60"
      >
        <option value="">Unassigned</option>
        {DEMO_OWNERS.map((option) => (
          <option key={option.id} value={option.id}>
            {saving && option.id === ownerId ? "Saving…" : option.name}
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