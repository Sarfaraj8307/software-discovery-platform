"use client";

import * as React from "react";
import { ImageIcon, ZoomIn } from "lucide-react";
import type { ProductScreenshot } from "@/lib/data/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/overlay";

/**
 * Screenshot gallery with a lightbox.
 *
 * No binary assets are shipped in this build — each frame renders as a labelled plate
 * with fixed dimensions, so the layout is final and swapping in real captures is a
 * one-component change with no reflow.
 */
export function MediaGallery({
  screenshots,
  productName,
}: {
  screenshots: ProductScreenshot[];
  productName: string;
}) {
  if (screenshots.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {screenshots.map((shot) => (
        <li key={shot.id}>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="group block w-full overflow-hidden rounded-card border border-border bg-card text-left transition-colors hover:border-border-strong"
              >
                <span
                  className="relative flex aspect-[16/10] w-full items-center justify-center border-b border-border"
                  style={{ backgroundColor: shot.tone }}
                >
                  <ImageIcon className="size-7 text-faint" aria-hidden="true" />
                  <span className="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-[5px] bg-card/90 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="size-3.5" aria-hidden="true" />
                  </span>
                </span>
                <span className="block px-3 py-2 text-2xs text-muted-foreground">
                  {shot.caption}
                </span>
              </button>
            </DialogTrigger>

            <DialogContent
              title={`${productName} — ${shot.caption}`}
              description="Screenshot placeholder. Real captures replace these plates without any layout change."
              className="max-w-3xl"
            >
              <div
                className="flex aspect-[16/10] w-full items-center justify-center rounded-card border border-border"
                style={{ backgroundColor: shot.tone }}
              >
                <ImageIcon className="size-10 text-faint" aria-hidden="true" />
              </div>
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  );
}
