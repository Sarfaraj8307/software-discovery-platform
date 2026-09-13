import * as React from "react";
import { VIZ_PALETTE, vizIndex } from "@/lib/viz";
import { rngFor } from "@/lib/procedural";
import { cn } from "@/lib/utils";

/**
 * NodeField — the procedural "software ecosystem" graphic.
 *
 * This is the visual anchor the hero was missing. It is a deterministic graph
 * of nodes and edges that reads as a software/integration landscape: a few
 * large hubs, a ring of mid-tier nodes, and faint connections between them.
 *
 * WHY SVG AND NOT THREE.JS HERE
 * The homepage hero must not depend on WebGL to look finished. This renders on
 * the server, ships as inline SVG, costs no JavaScript, and works with WebGL
 * disabled or on a low-end device. The Three.js scene (wave 3) is an
 * *enhancement* layered on top for capable clients — not a replacement. That
 * ordering is what stops the page from being blank while a 600 KB renderer
 * loads, and it keeps the initial bundle inside the 1.5 MB contract.
 *
 * DETERMINISM
 * Positions come from mulberry32 seeded by a string, so the same seed always
 * produces the same layout. No Math.random, per the project's determinism rule.
 * That also means server and client agree exactly, so nothing shifts on
 * hydration — and the "random-looking" hue of each node is really
 * `vizIndex(nodeId)`, which is stable across renders.
 *
 * DECORATION, NOT INFORMATION
 * The whole thing is `aria-hidden`. It communicates a mood — connected,
 * intelligent, spatial — and carries no data. Nothing here should ever be the
 * only place a fact appears.
 */

/** mulberry32 and the FNV-1a seed hash now live in `lib/procedural.ts`. */

interface Node {
  x: number;
  y: number;
  r: number;
  hue: number;
  hub: boolean;
}

function buildField(count: number, seed: string): { nodes: Node[]; edges: [number, number][] } {
  const rnd = rngFor(seed);
  const nodes: Node[] = [];

  // Hubs sit on a wide ellipse so the composition has a readable structure
  // rather than looking like scattered noise.
  //
  // RADII ARE IN VIEWBOX UNITS, and the viewBox is 100 units wide rendered into
  // anything from a 320px phone to a 700px desktop panel. The first pass used
  // r 4–6, which rendered as 30–45px translucent discs — it read as soap
  // bubbles and, worse, sat behind body copy and hurt legibility. These values
  // are deliberately an order of magnitude smaller: a hub is ~10px on desktop,
  // a leaf ~3px. Density now comes from COUNT, not from size.
  const hubs = Math.max(4, Math.round(count * 0.12));
  for (let i = 0; i < hubs; i++) {
    const angle = (i / hubs) * Math.PI * 2 + rnd() * 0.4;
    nodes.push({
      x: 50 + Math.cos(angle) * (26 + rnd() * 9),
      y: 50 + Math.sin(angle) * (24 + rnd() * 9),
      r: 1.15 + rnd() * 0.75,
      hue: vizIndex(`${seed}-hub-${i}`),
      hub: true,
    });
  }

  // Leaf nodes fill the interior, pulled toward the centre so the field has
  // density in the middle and breathing room at the edges.
  for (let i = hubs; i < count; i++) {
    const angle = rnd() * Math.PI * 2;
    const dist = 5 + Math.pow(rnd(), 0.6) * 38;
    nodes.push({
      x: 50 + Math.cos(angle) * dist * 1.04,
      y: 50 + Math.sin(angle) * dist * 0.94,
      r: 0.32 + rnd() * 0.42,
      hue: vizIndex(`${seed}-leaf-${i}`),
      hub: false,
    });
  }

  // Connect each node to its nearest neighbours. Capping degree keeps the
  // graphic legible — an all-pairs graph reads as mush.
  const edges: [number, number][] = [];
  const threshold = 15;
  for (let i = 0; i < nodes.length; i++) {
    let linked = 0;
    const maxLinks = nodes[i]!.hub ? 4 : 2;
    for (let j = i + 1; j < nodes.length && linked < maxLinks; j++) {
      const a = nodes[i]!;
      const b = nodes[j]!;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < threshold && (a.hub || b.hub || d < threshold * 0.55)) {
        edges.push([i, j]);
        linked++;
      }
    }
  }

  return { nodes, edges };
}

export interface NodeFieldProps {
  /** Node count. Keep <= ~60; beyond that it reads as noise, not structure. */
  count?: number;
  /** Any stable string. Different seeds give a different composition. */
  seed?: string;
  className?: string;
  /** Draw a faint dot-grid behind the field. */
  grid?: boolean;
}

export function NodeField({ count = 34, seed = "ecosystem", className, grid = false }: NodeFieldProps) {
  const { nodes, edges } = buildField(count, seed);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn("h-full w-full", className)}
    >
      <defs>
        {grid ? (
          <pattern id={`nf-grid-${seed}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#e4e4e7" strokeWidth="0.15" />
          </pattern>
        ) : null}
        {/* Soft bloom so hubs glow rather than sit flat. Kept very low alpha —
            this sits behind text on the homepage. */}
        <radialGradient id={`nf-bloom-${seed}`}>
          <stop offset="0%" stopColor={VIZ_PALETTE[0]!.solid} stopOpacity="0.10" />
          <stop offset="100%" stopColor={VIZ_PALETTE[0]!.solid} stopOpacity="0" />
        </radialGradient>
      </defs>

      {grid ? <rect width="100" height="100" fill={`url(#nf-grid-${seed})`} /> : null}

      <circle cx="50" cy="50" r="48" fill={`url(#nf-bloom-${seed})`} />

      {/* Edges carry the "network" read, so they need to be visible. Hairline
          strokes disappear entirely once the field is scaled down. */}
      <g stroke="#94a3b8" strokeWidth="0.16" strokeLinecap="round">
        {edges.map(([i, j], k) => (
          <line
            key={`e-${k}`}
            x1={nodes[i]!.x}
            y1={nodes[i]!.y}
            x2={nodes[j]!.x}
            y2={nodes[j]!.y}
            opacity={nodes[i]!.hub || nodes[j]!.hub ? 0.7 : 0.35}
          />
        ))}
      </g>

      <g>
        {nodes.map((n, i) => (
          <g key={`n-${i}`}>
            {n.hub ? (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r * 2.6}
                fill={VIZ_PALETTE[n.hue]!.solid}
                opacity="0.12"
              />
            ) : null}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={VIZ_PALETTE[n.hue]!.solid}
              opacity={n.hub ? 0.9 : 0.5}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
