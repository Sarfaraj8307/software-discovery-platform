"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * `reset()` retries the failed render, which recovers from transient failures without a
 * full reload. The error digest is surfaced because it is the only handle support has
 * for correlating a report with server logs — an error message without it is not
 * actionable.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Replace with a real error reporter (Sentry et al.) in deployment.
    console.error("Route error:", error);
  }, [error]);

  return (
    <main id="main" className="mx-auto flex max-w-2xl flex-col px-4 py-16 sm:px-6">
      <p className="label-caps text-muted-foreground">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
        This page could not be loaded
      </h1>
      <p className="mt-3 text-body leading-relaxed text-muted-foreground">
        The failure is on our side, not yours. Retrying often clears it — if it does not, the rest of
        the directory is still available.
      </p>

      <div className="mt-5 flex items-start gap-2.5 rounded-card border border-destructive-border bg-destructive-subtle p-3.5">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-13 font-medium text-destructive">Error details</p>
          <p className="mt-0.5 break-words text-xs text-destructive">
            {error.message || "An unexpected error occurred."}
          </p>
          {error.digest && (
            <p className="mt-1 text-2xs text-destructive">
              Reference: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={reset}>
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to the homepage</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/categories">Browse categories</Link>
        </Button>
      </div>
    </main>
  );
}
