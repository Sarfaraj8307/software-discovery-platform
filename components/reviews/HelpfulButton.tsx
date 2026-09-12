"use client";

import * as React from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Helpful vote.
 *
 * Optimistic and local: the vote is reflected immediately and the control is locked
 * after use, so a reviewer cannot inflate a count by clicking repeatedly. Persisted
 * server-side once accounts exist — see the deferred-auth note in the plan.
 */
export function HelpfulButton({
  initialCount,
  className,
}: {
  initialCount: number;
  className?: string;
}) {
  const [count, setCount] = React.useState(initialCount);
  const [voted, setVoted] = React.useState(false);

  const toggle = () => {
    setVoted((prev) => {
      setCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={voted}
      className={cn(
        // py-1.5 lifts this to 24px, the WCAG 2.5.8 minimum for a standalone control.
        "inline-flex items-center gap-1.5 rounded-control border px-2 py-1.5 text-2xs font-medium transition-colors",
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
