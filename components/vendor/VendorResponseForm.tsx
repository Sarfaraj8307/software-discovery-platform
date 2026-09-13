"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Inline reply composer for one unanswered review.
 *
 * Collapsed to a single "Reply" button until asked for: every review in this list renders
 * one of these, and opening a textarea on each would bury the reviews under their own
 * reply boxes.
 *
 * The character count is shown live because the server cap (1,200) is generous enough to
 * hit by accident, and discovering that on submit is the annoying way to find out.
 */
const MAX = 1200;

export function VendorResponseForm({ reviewId, reviewTitle }: { reviewId: string; reviewTitle: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [body, setBody] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const remaining = MAX - body.trim().length;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/reviews/${reviewId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : "That reply could not be published.";
        setError(message);
        setSaving(false);
        return;
      }

      setSaving(false);
      setOpen(false);
      setBody("");
      router.refresh();
    } catch {
      setError("We could not reach the server. Your reply was not saved.");
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <div className="mt-3">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          <MessageSquare className="size-3.5" aria-hidden="true" />
          Reply
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 rounded-control border border-border bg-subtle p-3">
      <label htmlFor={`reply-${reviewId}`} className="label-caps text-muted-foreground">
        Your public reply
      </label>
      <textarea
        id={`reply-${reviewId}`}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        maxLength={MAX}
        disabled={saving}
        aria-label={`Your public reply to “${reviewTitle}”`}
        aria-describedby={`reply-count-${reviewId}`}
        placeholder="Thank the reviewer, then address the specific point they raised."
        className="mt-1.5 w-full resize-y rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 leading-relaxed text-foreground disabled:opacity-60"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p id={`reply-count-${reviewId}`} className="text-2xs tnum text-muted-foreground">
          {remaining} characters remaining
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={saving || body.trim().length < 20}>
            {saving ? "Publishing…" : "Publish reply"}
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-2xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
