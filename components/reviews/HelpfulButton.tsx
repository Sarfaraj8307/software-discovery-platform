"use client";

import * as React from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Helpful vote — server-backed.
 *
 * Optimistic update: the click posts to /api/reviews/[id]/helpful, which toggles the
 * voter's vote on the server and returns the new count + hasVoted. The client applies
 * whatever the server says (the optimistic local update is just for the loading state)
 * so two browser tabs see the same count and a refresh lands on the right number.
 *
 * `initialCount` and `initialHasVoted` are computed server-side in the page that
 * renders the ReviewCard, so the button is correct on first paint with no
 * client-only hydration flash.
 */
export function HelpfulButton({
  reviewId,
  initialCount,
  initialHasVoted,
  className,
}: {
  reviewId: string;
  initialCount: number;
  initialHasVoted: boolean;
  className?: string;
}) {
  const [count, setCount] = React.useState(initialCount);
  const [voted, setVoted] = React.useState(initialHasVoted);
  const [pending, setPending] = React.useState(false);

  const toggle = React.useCallback(async () => {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, { method: "POST" });
      if (!res.ok) return; // server-side rejection; leave the existing UI as-is
      const data = (await res.json()) as { helpfulCount: number; hasVoted: boolean };
      setCount(data.helpfulCount);
      setVoted(data.hasVoted);
    } finally {
      setPending(false);
    }
  }, [pending, reviewId]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={voted}
      aria-busy={pending}
      disabled={pending}
      className={cn(
        // py-1.5 lifts this to 24px, the WCAG 2.5.8 minimum for a standalone control.
        "inline-flex items-center gap-1.5 rounded-control border px-2 py-1.5 text-2xs font-medium transition-colors disabled:opacity-60",
        voted
          ? "border-primary-border bg-primary-subtle text-primary"
          : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
        className,
      )}
    >
      <ThumbsUp className="size-3" aria-hidden="true" />
      Helpful
      <span className="tnum">{count.toLocaleString("en-US")}</span>
    </button>
  );
}