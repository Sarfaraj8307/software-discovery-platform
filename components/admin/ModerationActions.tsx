"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Flag, X, type LucideIcon } from "lucide-react";
import type { ModerationAction } from "@/lib/data/types";
import { Button } from "@/components/ui/button";

/**
 * Approve / reject / flag controls for one queue row.
 *
 * The decision is written through POST /api/moderation and the route is then refreshed, so
 * the row leaves the queue via the server rather than by hiding itself locally — a locally
 * hidden row would reappear on the next navigation and look like the action never happened.
 *
 * `targetLabel` exists purely for accessibility: three buttons reading "Approve" are
 * indistinguishable in a screen reader's element list when the table has 50 rows.
 */
const ACTIONS: {
  action: ModerationAction;
  label: string;
  icon: LucideIcon;
}[] = [
  { action: "APPROVE", label: "Approve", icon: Check },
  { action: "REJECT", label: "Reject", icon: X },
  { action: "FLAG", label: "Flag", icon: Flag },
];

export function ModerationActions({
  targetType,
  targetId,
  targetLabel,
}: {
  targetType: "review" | "product";
  targetId: string;
  targetLabel: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState<ModerationAction | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function decide(action: ModerationAction) {
    setPending(action);
    setError(null);

    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, action }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : "That decision could not be recorded.";
        setError(message);
        setPending(null);
        return;
      }

      setPending(null);
      router.refresh();
    } catch {
      setError("We could not reach the server. Your decision was not saved.");
      setPending(null);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {ACTIONS.map(({ action, label, icon: Icon }) => (
        <Button
          key={action}
          type="button"
          variant="outline"
          size="sm"
          className="px-2"
          disabled={pending !== null}
          aria-label={`${label} ${targetType} “${targetLabel}”`}
          onClick={() => void decide(action)}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">
            {pending === action ? "Saving…" : label}
          </span>
        </Button>
      ))}
      {error && (
        <span role="alert" className="text-2xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
