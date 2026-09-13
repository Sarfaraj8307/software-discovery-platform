"use client";

import * as React from "react";

/**
 * The embedded Graphify viewer, gated on viewport width.
 *
 * WHY THERE IS A GATE AT ALL
 * Graphify's viewer reserves a fixed 280px sidebar for search, node info and the
 * community list. Measured at a 390px viewport, the iframe is 341px wide, which
 * leaves 61px of actual canvas. That is not a small graph, it is a sliver — so
 * below the breakpoint this renders an explanation and a full-screen link
 * instead of an unusable canvas.
 *
 * WHY A JS GATE RATHER THAN `hidden sm:block`
 * A CSS hide would still download the viewer, which is ~1.4 MB. The whole point
 * of deciding in JS is that a phone never pays for it. This mirrors the way
 * `HeroScene` keeps `three` off small screens for the same reason.
 *
 * The breakpoint is 640px, not 768px, because the sidebar is a fixed width: at
 * 640px the canvas is still ~310px, which pans and zooms acceptably.
 */

const MIN_VIEWPORT_WIDTH = 640;

/** Graphify paints its own canvas on #0f0f1a — see the note in app/graph/page.tsx. */
const CANVAS_BG = "#0f0f1a";

export interface GraphFrameProps {
  src: string;
  title: string;
}

export function GraphFrame({ src, title }: GraphFrameProps) {
  // Starts false so the server and the first client render agree. A wide screen
  // swaps in the frame one tick after hydration; a narrow one never loads it.
  const [wide, setWide] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia(`(min-width: ${MIN_VIEWPORT_WIDTH}px)`);
    const sync = () => setWide(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!wide) {
    return (
      <div
        className="grid h-full place-items-center px-6 text-center"
        style={{ backgroundColor: CANVAS_BG }}
      >
        <div className="max-w-sm">
          <p className="text-13 font-semibold text-[#e6e6ef]">Best opened full screen</p>
          <p className="mt-1.5 text-13 leading-relaxed text-[#a0a0b8]">
            The viewer keeps a fixed-width sidebar for search and node details, which leaves
            too little room for the graph on a screen this size. It pans and zooms, so it is
            worth opening properly.
          </p>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="mt-3.5 inline-block rounded-lg border border-[#3a3a5c] px-3.5 py-2 text-13 font-medium text-[#e6e6ef] transition-colors hover:border-[#5a5a8c]"
          >
            Open the graph ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sits behind the frame. An iframe paints nothing until its document
          loads, so this shows through on a slow connection instead of a bare
          rectangle — and it needs no JS to dismiss itself. */}
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <p className="text-13 text-[#a0a0b8]">
          Loading the graph — the viewer is about 1.4&nbsp;MB, most of it the layout engine.
        </p>
      </div>
      <iframe src={src} title={title} className="relative h-full w-full border-0" />
    </>
  );
}
