/**
 * Visualisation palette — the data-viz counterpart to `lib/brand.ts`.
 *
 * WHY THIS FILE EXISTS SEPARATELY FROM brand.ts
 * brand.ts owns *category identity* (8 muted tints, keyed on parent pillar).
 * This owns *data series* (10 saturated hues, keyed on whatever the caller is
 * plotting). They are different jobs: a category chip and a chart series should
 * not have to share a palette, and collapsing them would mean a chart's fifth
 * series inherits a category's tint.
 *
 * THREE ROLES PER HUE — and the role decides the contrast requirement:
 *   solid  graphical only (bars, strokes, dots, 3D materials)  >= 3:1
 *   fg     text-safe ink                                       >= 4.5:1 on white AND tint
 *   tint   decorative fill, never a state-bearing border       n/a
 * All ten were measured — see `scripts/qa/contrast-audit.py` for the numbers
 * and `app/globals.css` for them restated next to the tokens.
 *
 * CRITICAL — same trap brand.ts documents: Tailwind scans source text for class
 * names, so `bg-viz-${n}` would never be emitted and every bar would render
 * with no fill. The class strings below MUST stay literal.
 *
 * The hex values are not redundant with the CSS. SVG attributes and Three.js
 * materials need real colour values, not class names — and Recharts takes hex
 * props. Keeping both here means the 3D and chart layers read from the same
 * source of truth as the CSS.
 */

export interface VizSeries {
  /** Graphical fill/stroke. >= 3:1 on white. */
  solid: string;
  /** Text-safe ink. >= 4.5:1 on white and on `tint`. */
  fg: string;
  /** Decorative background fill. */
  tint: string;
  /** Literal Tailwind classes — never template them. */
  bar: string;
  ink: string;
  tintClass: string;
  border: string;
}

export const VIZ_PALETTE: readonly VizSeries[] = [
  {
    solid: "#2563eb",
    fg: "#1d4ed8",
    tint: "#eff6ff",
    bar: "bg-viz-1",
    ink: "text-viz-1-fg",
    tintClass: "bg-viz-1-tint",
    border: "border-viz-1",
  },
  {
    solid: "#0891b2",
    fg: "#0e7490",
    tint: "#ecfeff",
    bar: "bg-viz-2",
    ink: "text-viz-2-fg",
    tintClass: "bg-viz-2-tint",
    border: "border-viz-2",
  },
  {
    solid: "#7c3aed",
    fg: "#6d28d9",
    tint: "#f5f3ff",
    bar: "bg-viz-3",
    ink: "text-viz-3-fg",
    tintClass: "bg-viz-3-tint",
    border: "border-viz-3",
  },
  {
    solid: "#059669",
    fg: "#047857",
    tint: "#ecfdf5",
    bar: "bg-viz-4",
    ink: "text-viz-4-fg",
    tintClass: "bg-viz-4-tint",
    border: "border-viz-4",
  },
  {
    solid: "#d97706",
    fg: "#b45309",
    tint: "#fffbeb",
    bar: "bg-viz-5",
    ink: "text-viz-5-fg",
    tintClass: "bg-viz-5-tint",
    border: "border-viz-5",
  },
  {
    solid: "#e11d48",
    fg: "#be123c",
    tint: "#fff1f2",
    bar: "bg-viz-6",
    ink: "text-viz-6-fg",
    tintClass: "bg-viz-6-tint",
    border: "border-viz-6",
  },
  {
    solid: "#4f46e5",
    fg: "#4338ca",
    tint: "#eef2ff",
    bar: "bg-viz-7",
    ink: "text-viz-7-fg",
    tintClass: "bg-viz-7-tint",
    border: "border-viz-7",
  },
  {
    solid: "#0d9488",
    fg: "#0f766e",
    tint: "#f0fdfa",
    bar: "bg-viz-8",
    ink: "text-viz-8-fg",
    tintClass: "bg-viz-8-tint",
    border: "border-viz-8",
  },
  {
    solid: "#c026d3",
    fg: "#a21caf",
    tint: "#fdf4ff",
    bar: "bg-viz-9",
    ink: "text-viz-9-fg",
    tintClass: "bg-viz-9-tint",
    border: "border-viz-9",
  },
  {
    solid: "#475569",
    fg: "#334155",
    tint: "#f8fafc",
    bar: "bg-viz-10",
    ink: "text-viz-10-fg",
    tintClass: "bg-viz-10-tint",
    border: "border-viz-10",
  },
] as const;

export const VIZ_COUNT = VIZ_PALETTE.length;

/**
 * FNV-1a → palette index. Same hash as `lib/brand.ts` and the data layer's
 * PRNG, deliberately: one deterministic primitive across the codebase means a
 * seed string always maps to the same hue everywhere, on server and client.
 *
 * This is what keeps procedural visuals inside the no-Math.random rule — a
 * "random" node colour is really `vizIndex(nodeId)`, so SSR and hydration
 * agree and nothing flickers.
 */
export function vizIndex(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % VIZ_COUNT;
}

/** Series for a seed string. Deterministic. */
export function vizFor(seed: string): VizSeries {
  return VIZ_PALETTE[vizIndex(seed)]!;
}

/** Series by position, wrapping. Use when plotting an ordered list. */
export function vizAt(index: number): VizSeries {
  const i = ((index % VIZ_COUNT) + VIZ_COUNT) % VIZ_COUNT;
  return VIZ_PALETTE[i]!;
}

/** Ordered hex list, for Recharts series props. */
export const VIZ_HEX: readonly string[] = VIZ_PALETTE.map((s) => s.solid);

/**
 * 3D material colours, mirroring the `--viz3d-*` tokens in globals.css.
 * Duplicated here rather than parsed from CSS at runtime: reading computed
 * styles inside a render loop is a layout-thrash trap, and a WebGL scene must
 * not depend on a stylesheet having loaded.
 */
export const VIZ3D = {
  node: "#2563eb",
  nodeAlt: "#7c3aed",
  nodeWarm: "#0891b2",
  nodeQuiet: "#94a3b8",
  edge: "#cbd5e1",
  edgeActive: "#93c5fd",
  surface: "#e2e8f0",
  field: "#f8fafc",
} as const;

/**
 * Quality tier for procedural visuals. Resolved from the viewport at mount and
 * never during render, so it cannot desync between server and client.
 *
 * The brief requires mobile to be a *designed* simplification rather than a
 * scaled-down desktop scene — this is the single switch that drives that.
 */
export type VizTier = "low" | "medium" | "high";

export function tierFromWidth(width: number): VizTier {
  if (width < 768) return "low";
  if (width < 1280) return "medium";
  return "high";
}

/**
 * Node / edge / DPR budget per tier, for the 3D hero scene.
 *
 * `low` is a *ceiling*, not a target: the hero gate treats a low tier as
 * "SVG only" and never builds a WebGL context on a phone. A scaled-down desktop
 * scene on a 390px screen is worse than a purpose-built SVG — it costs battery,
 * runs at a worse frame rate, and reads as clutter. The simplification is the
 * design, not a compromise.
 *
 * DPR is capped below 2 even on `high`. The scene is a soft background behind
 * text; the difference between 1.75x and 2x is invisible there and costs ~23%
 * more pixels every frame.
 */
export const TIER_BUDGET: Record<VizTier, { nodes: number; edges: number; dpr: number }> = {
  low: { nodes: 60, edges: 90, dpr: 1 },
  medium: { nodes: 120, edges: 210, dpr: 1.5 },
  high: { nodes: 190, edges: 340, dpr: 1.75 },
};
