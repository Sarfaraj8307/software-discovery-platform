"use client";

import * as React from "react";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/overlay";

/**
 * ScreenshotFrame — the interactive shell around a screenshot plate.
 *
 * WHY THE PLATE ARRIVES AS `children`
 * This is the only part of the gallery that needs JavaScript: the lightbox is a
 * Radix dialog and must run on the client. The plate itself is a server-rendered
 * SVG. Passing it in as `children` keeps the SVG generation out of the client
 * bundle entirely — the browser receives finished markup and hydrates only this
 * thin wrapper.
 *
 * That split is deliberate. `/product/[slug]` renders up to six plates and there
 * are 230 product pages; rendering the plates on the client would put the whole
 * procedural generator on the critical path for the least benefit.
 *
 * The same element is rendered twice — once inside the trigger, once inside the
 * dialog. That is safe: React elements are descriptions, not instances, and the
 * dialog content is portalled and only mounted when opened.
 */
export function ScreenshotFrame({
  children,
  caption,
  title,
  description,
}: {
  /** A server-rendered `<ScreenshotPlate />`. */
  children: React.ReactNode;
  caption: string;
  title: string;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group block w-full overflow-hidden rounded-card border border-border bg-card text-left transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="relative block aspect-[16/10] w-full overflow-hidden border-b border-border bg-subtle">
            {children}
            <span className="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-[5px] border border-border bg-card/90 text-muted-foreground opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn className="size-3.5" aria-hidden="true" />
            </span>
          </span>
          <span className="block px-3 py-2 text-2xs text-muted-foreground">{caption}</span>
        </button>
      </DialogTrigger>

      <DialogContent title={title} description={description} className="max-w-3xl">
        <div className="overflow-hidden rounded-card border border-border bg-subtle">
          <span className="block aspect-[16/10] w-full">{children}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
