"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Apply or discard a proposed listing change.
 *
 * The proposal is shown inline rather than as a diff against the current copy, because a
 * moderator's actual question is "is this acceptable copy", not "what changed".
 */
export function ListingEditDecider({
  editId,
  productName,
}: {
  editId: string;
  productName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<"APPLY" | "DISCARD" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function decide(decision: "APPLY" | "DISCARD") {
    setBusy(decision);
    setError(null);

    try {
      const res = await fetch("/api/moderation/listing-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, decision }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : "That decision could not be recorded.";
        setError(message);
        setBusy(null);
        return;
      }

      setBusy(null);
      router.refresh();
    } catch {
      setError("We could not reach the server.");
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy !== null}
        aria-label={`Apply the proposed copy for ${productName}`}
        onClick={() => void decide("APPLY")}
      >
        {busy === "APPLY" ? "Applying…" : "Apply"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy !== null}
        aria-label={`Discard the proposed copy for ${productName}`}
        onClick={() => void decide("DISCARD")}
      >
        {busy === "DISCARD" ? "Discarding…" : "Discard"}
      </Button>
      {error && (
        <span role="alert" className="text-2xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
