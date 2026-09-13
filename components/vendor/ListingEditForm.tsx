"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Propose new listing copy.
 *
 * Submits a PROPOSAL, not an edit — the portal tells vendors changes are reviewed before
 * they go live, so this must not write straight to the listing. The button label and the
 * confirmation both say "submit for review" for that reason.
 *
 * Only tagline and description are editable. Ratings, review counts and feature coverage
 * feed the composite score and are not offered here: letting a vendor edit those would let
 * them edit their own ranking.
 */
export function ListingEditForm({
  slug,
  productName,
  tagline,
  shortDescription,
}: {
  slug: string;
  productName: string;
  tagline: string;
  shortDescription: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [next, setNext] = React.useState({ tagline, shortDescription });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/vendor/listings/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : "That proposal could not be submitted.";
        setError(message);
        setSaving(false);
        return;
      }

      setSaving(false);
      setSent(true);
      setOpen(false);
      router.refresh();
    } catch {
      setError("We could not reach the server. Nothing was submitted.");
      setSaving(false);
    }
  }

  if (!open && !sent) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PencilLine className="size-3.5" aria-hidden="true" />
        Propose edit
      </Button>
    );
  }

  if (sent) {
    return (
      <p className="text-2xs text-muted-foreground">
        Submitted for review — it goes live once moderation approves it.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full space-y-2 rounded-control border border-border bg-subtle p-3">
      <div>
        <label htmlFor={`tagline-${slug}`} className="label-caps text-muted-foreground">
          Tagline
        </label>
        <input
          id={`tagline-${slug}`}
          value={next.tagline}
          maxLength={120}
          disabled={saving}
          onChange={(e) => setNext((p) => ({ ...p, tagline: e.target.value }))}
          className="mt-1 w-full rounded-[7px] border border-border bg-card px-2.5 py-1.5 text-13 text-foreground disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor={`desc-${slug}`} className="label-caps text-muted-foreground">
          Description
        </label>
        <textarea
          id={`desc-${slug}`}
          value={next.shortDescription}
          rows={3}
          maxLength={400}
          disabled={saving}
          aria-label={`Description for ${productName}`}
          onChange={(e) => setNext((p) => ({ ...p, shortDescription: e.target.value }))}
          className="mt-1 w-full resize-y rounded-[7px] border border-border bg-card px-2.5 py-1.5 text-13 leading-relaxed text-foreground disabled:opacity-60"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={saving}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={saving || next.tagline.trim().length < 10 || next.shortDescription.trim().length < 40}
        >
          {saving ? "Submitting…" : "Submit for review"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-2xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
