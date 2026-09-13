import * as React from "react";
import { VIZ_PALETTE } from "@/lib/viz";
import { hashSeed, rngFor, between, intBetween } from "@/lib/procedural";
import { cn } from "@/lib/utils";

/**
 * ScreenshotPlate — a procedural product-UI mock, drawn as SVG.
 *
 * WHY THIS REPLACES THE GREY BOX
 * The audit found every screenshot slot on `/product/[slug]` rendering as a
 * bare grey rectangle with a centred image icon. That is the single most
 * conspicuous "unfinished" signal on the highest-value page in the product: a
 * buyer scanning a vendor profile sees four empty frames and concludes the
 * listing is abandoned.
 *
 * Real captures are not available — this build ships no binary assets, and the
 * dataset is synthetic and disclosed as such. So the honest fix is not to fake
 * a photograph but to draw something that reads as *a product interface*:
 * chrome, navigation, data. It says "here is where the screenshot goes" while
 * looking deliberate rather than broken.
 *
 * WHY SVG AND NOT AN IMAGE
 * A generated raster would need a generator, a cache and a payload. This is
 * inline SVG: no network request, no binary in the repo, crisp at any density,
 * and it re-colours automatically because the palette comes from tokens. It
 * also renders on the server, so it costs zero JavaScript — which matters when
 * the component appears up to six times on each of 230 product pages.
 *
 * DETERMINISM
 * Every dimension that varies — chart series, row counts, card counts, which
 * nav item is active — comes from `rngFor(seed)`. The same product always
 * produces the same plates, and the server and client agree exactly. No
 * `Math.random`, per the project rule.
 *
 * ACCESSIBILITY
 * The graphic is `aria-hidden` and carries no information. The caption beneath
 * it is real text, and the lightbox description explains what these are. A
 * screen-reader user loses nothing.
 */

const VARIANTS = ["dashboard", "table", "board", "chart", "settings"] as const;
type PlateVariant = (typeof VARIANTS)[number];

/** Spread across the range, then clamped — see the note in `variantFor`. */
export function plateVariant(seed: string): PlateVariant {
  return VARIANTS[hashSeed(seed) % VARIANTS.length]!;
}

/* ------------------------------------------------------------------ chrome */

const INK = {
  frame: "#ffffff",
  chrome: "#fafafa",
  rail: "#f8fafc",
  line: "#e4e4e7",
  lineSoft: "#eef0f3",
  bar: "#e4e4e7",
  barStrong: "#cbd5e1",
  pill: "#f1f5f9",
} as const;

/**
 * The window chrome every variant sits inside: a rounded frame, a title bar
 * with three dots and an address pill, and a left navigation rail with one
 * active item. Shared so all five variants read as the same product.
 */
function Chrome({ activeNav, accent, navCount }: { activeNav: number; accent: string; navCount: number }) {
  return (
    <>
      {/* frame */}
      <rect x="0.5" y="0.5" width="159" height="99" rx="2.5" fill={INK.frame} stroke={INK.line} />

      {/* title bar */}
      <path d="M0.5 3 A2.5 2.5 0 0 1 3 0.5 L157 0.5 A2.5 2.5 0 0 1 159.5 3 L159.5 10 L0.5 10 Z" fill={INK.chrome} />
      <line x1="0.5" y1="10" x2="159.5" y2="10" stroke={INK.line} strokeWidth="0.4" />
      <circle cx="4.5" cy="5.2" r="0.85" fill="#f0a3a3" />
      <circle cx="7.5" cy="5.2" r="0.85" fill="#f3d09a" />
      <circle cx="10.5" cy="5.2" r="0.85" fill="#a8d5b5" />
      <rect x="16" y="2.8" width="54" height="4.6" rx="2.3" fill={INK.pill} />

      {/* navigation rail */}
      <path d="M0.5 10 L24.5 10 L24.5 99.5 L3 99.5 A2.5 2.5 0 0 1 0.5 97 Z" fill={INK.rail} />
      <line x1="24.5" y1="10" x2="24.5" y2="99.5" stroke={INK.line} strokeWidth="0.4" />

      <circle cx="7" cy="16" r="1.9" fill={accent} opacity="0.9" />
      <rect x="11" y="14.9" width="9" height="2.2" rx="1.1" fill={INK.barStrong} />

      {Array.from({ length: navCount }).map((_, i) => {
        const y = 24 + i * 6.4;
        const active = i === activeNav;
        return (
          <g key={`nav-${i}`}>
            {active ? (
              <>
                <rect x="2" y={y - 1.5} width="0.9" height="5.4" rx="0.45" fill={accent} />
                <rect x="3.6" y={y - 1.5} width="19.2" height="5.4" rx="1.4" fill={accent} opacity="0.1" />
              </>
            ) : null}
            <circle cx="7" cy={y + 1.2} r="1.15" fill={active ? accent : INK.barStrong} opacity={active ? 1 : 0.75} />
            <rect x="10.5" y={y + 0.2} width={active ? 10 : 8} height="2" rx="1" fill={active ? accent : INK.bar} opacity={active ? 0.55 : 1} />
          </g>
        );
      })}
    </>
  );
}

/* ---------------------------------------------------------------- variants */

function Dashboard({ seed, accent }: { seed: string; accent: string }) {
  const rnd = rngFor(`${seed}-dash`);
  const series = Array.from({ length: 13 }, () => between(rnd, 0.22, 0.95));
  const kpis = [between(rnd, 0.45, 0.95), between(rnd, 0.4, 0.9), between(rnd, 0.5, 1)];

  // Chart frame: x 28..150, y 56..90. Baseline at y=90.
  const x0 = 30;
  const w = 118;
  const baseY = 90;
  const topY = 56;
  const step = w / (series.length - 1);
  const points = series.map((v, i) => [x0 + i * step, baseY - (baseY - topY) * v] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${(x0 + w).toFixed(1)} ${baseY} L${x0} ${baseY} Z`;

  return (
    <>
      <rect x="28" y="14" width="30" height="3.6" rx="1.4" fill={INK.barStrong} />
      <rect x="28" y="19.6" width="46" height="2.1" rx="1.05" fill={INK.bar} />

      {kpis.map((v, i) => {
        const x = 28 + i * 42;
        return (
          <g key={`kpi-${i}`}>
            <rect x={x} y="25" width="38" height="21" rx="2" fill="#fff" stroke={INK.line} strokeWidth="0.4" />
            <rect x={x + 3.5} y="28.5" width="13" height="1.9" rx="0.95" fill={INK.bar} />
            <rect x={x + 3.5} y="33" width={10 + v * 9} height="4.6" rx="1.4" fill={INK.barStrong} />
            <path
              d={`M${x + 3.5} ${43} l3.5 -2.2 l3.5 1.1 l3.5 -3 l3.5 1.6 l3.5 -2.6 l3.5 0.9`}
              fill="none"
              stroke={i === 0 ? accent : INK.barStrong}
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={i === 0 ? 0.95 : 0.6}
            />
          </g>
        );
      })}

      {/* area chart */}
      <rect x="28" y="51" width="122" height="41" rx="2" fill="#fff" stroke={INK.line} strokeWidth="0.4" />
      <rect x="32" y="54.5" width="20" height="2.1" rx="1.05" fill={INK.bar} />
      {[62, 71, 80].map((y) => (
        <line key={`g-${y}`} x1="32" y1={y} x2="146" y2={y} stroke={INK.lineSoft} strokeWidth="0.4" />
      ))}
      <path d={area} fill={accent} opacity="0.13" />
      <path d={line} fill="none" stroke={accent} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (i % 3 === 0 ? <circle key={`p-${i}`} cx={x} cy={y} r="1.1" fill="#fff" stroke={accent} strokeWidth="0.9" /> : null))}
    </>
  );
}

function Table({ seed, accent }: { seed: string; accent: string }) {
  const rnd = rngFor(`${seed}-table`);
  const rows = intBetween(rnd, 6, 8);
  const widths = Array.from({ length: rows }, () => [between(rnd, 9, 20), between(rnd, 7, 15)]);

  return (
    <>
      <rect x="28" y="14" width="26" height="3.4" rx="1.4" fill={INK.barStrong} />
      <rect x="28" y="21" width="48" height="5.4" rx="2.7" fill={INK.pill} />
      <circle cx="32" cy="23.7" r="1.3" fill="none" stroke={INK.barStrong} strokeWidth="0.7" />
      <rect x="113" y="21" width="17" height="5.4" rx="1.6" fill={accent} opacity="0.9" />
      <rect x="133" y="21" width="17" height="5.4" rx="1.6" fill="#fff" stroke={INK.line} strokeWidth="0.4" />

      <rect x="28" y="30" width="122" height="5.6" rx="1.2" fill={INK.rail} />
      {[34, 60, 88, 118].map((x, i) => (
        <rect key={`h-${i}`} x={x} y="32.2" width={i === 0 ? 12 : 9} height="1.9" rx="0.95" fill={INK.barStrong} />
      ))}

      {Array.from({ length: rows }).map((_, i) => {
        const y = 36 + i * 7.2;
        const tint = i % 2 === 0 ? "#ffffff" : "#fcfcfd";
        const [w1, w2] = widths[i]!;
        return (
          <g key={`r-${i}`}>
            <rect x="28" y={y} width="122" height="7.2" fill={tint} />
            <line x1="28" y1={y + 7.2} x2="150" y2={y + 7.2} stroke={INK.lineSoft} strokeWidth="0.4" />
            <circle cx="33" cy={y + 3.6} r="1.7" fill={VIZ_PALETTE[(hashSeed(`${seed}-av-${i}`) % VIZ_PALETTE.length)!]!.solid} opacity="0.55" />
            <rect x="37.5" y={y + 2.5} width={w1} height="2.1" rx="1.05" fill={INK.barStrong} />
            <rect x="60" y={y + 2.5} width={w2} height="2.1" rx="1.05" fill={INK.bar} />
            <rect x="88" y={y + 2.3} width={16} height="2.5" rx="1.25" fill={INK.bar} />
            <rect x="118" y={y + 2} width={14} height="3.1" rx="1.55" fill={i % 3 === 0 ? accent : INK.barStrong} opacity={i % 3 === 0 ? 0.22 : 0.35} />
          </g>
        );
      })}
    </>
  );
}

function Board({ seed, accent }: { seed: string; accent: string }) {
  const rnd = rngFor(`${seed}-board`);
  const cols = [3, 2, 4];

  return (
    <>
      <rect x="28" y="14" width="30" height="3.6" rx="1.4" fill={INK.barStrong} />
      <rect x="28" y="20" width="40" height="2.1" rx="1.05" fill={INK.bar} />
      <rect x="136" y="14" width="14" height="5" rx="1.6" fill={accent} opacity="0.9" />

      {cols.map((cards, c) => {
        const x = 28 + c * 42;
        return (
          <g key={`col-${c}`}>
            <rect x={x} y="27" width="38" height="66" rx="2" fill={INK.rail} />
            <rect x={x + 3.5} y="30.5" width="14" height="2.1" rx="1.05" fill={INK.barStrong} />
            <circle cx={x + 34.5} cy="31.5" r="1.5" fill={INK.bar} />

            {Array.from({ length: cards }).map((_, i) => {
              const y = 36 + i * 14;
              const hue = VIZ_PALETTE[(hashSeed(`${seed}-card-${c}-${i}`) % VIZ_PALETTE.length)!]!;
              return (
                <g key={`card-${i}`}>
                  <rect x={x + 3} y={y} width="32" height="12" rx="1.6" fill="#fff" stroke={INK.line} strokeWidth="0.4" />
                  <rect x={x + 3} y={y} width="32" height="1.5" rx="0.75" fill={hue.solid} opacity="0.8" />
                  <rect x={x + 6} y={y + 3.6} width={between(rnd, 14, 24)} height="2" rx="1" fill={INK.barStrong} />
                  <rect x={x + 6} y={y + 7} width={between(rnd, 9, 17)} height="1.8" rx="0.9" fill={INK.bar} />
                  <circle cx={x + 30} cy={y + 8.4} r="1.4" fill={hue.solid} opacity="0.45" />
                </g>
              );
            })}
          </g>
        );
      })}
    </>
  );
}

function Chart({ seed, accent }: { seed: string; accent: string }) {
  const rnd = rngFor(`${seed}-chart`);
  const groups = 9;
  const series = [accent, VIZ_PALETTE[2]!.solid, VIZ_PALETTE[3]!.solid];

  return (
    <>
      <rect x="28" y="14" width="28" height="3.6" rx="1.4" fill={INK.barStrong} />
      <rect x="28" y="20" width="44" height="2.1" rx="1.05" fill={INK.bar} />

      {series.map((c, i) => (
        <g key={`leg-${i}`}>
          <rect x={106 + i * 15} y="15.4" width="4" height="2.4" rx="0.7" fill={c} />
          <rect x={111.5 + i * 15} y="15.9" width="8" height="1.5" rx="0.75" fill={INK.bar} />
        </g>
      ))}

      <rect x="28" y="26" width="122" height="60" rx="2" fill="#fff" stroke={INK.line} strokeWidth="0.4" />
      {[38, 50, 62, 74].map((y) => (
        <line key={`gl-${y}`} x1="33" y1={y} x2="145" y2={y} stroke={INK.lineSoft} strokeWidth="0.4" />
      ))}

      {Array.from({ length: groups }).map((_, g) => {
        const gx = 36 + g * 12.4;
        return (
          <g key={`grp-${g}`}>
            {series.map((c, s) => {
              const h = between(rnd, 0.18, 0.92) * 44;
              return (
                <rect
                  key={`b-${s}`}
                  x={gx + s * 3.2}
                  y={80 - h}
                  width="2.6"
                  height={h}
                  rx="0.8"
                  fill={c}
                  opacity={s === 0 ? 0.95 : 0.62}
                />
              );
            })}
            <rect x={gx - 0.6} y="83" width="9" height="1.5" rx="0.75" fill={INK.bar} />
          </g>
        );
      })}
    </>
  );
}

function Settings({ seed, accent }: { seed: string; accent: string }) {
  const rnd = rngFor(`${seed}-settings`);
  const fields = intBetween(rnd, 4, 5);

  return (
    <>
      <rect x="28" y="14" width="32" height="3.6" rx="1.4" fill={INK.barStrong} />
      <rect x="28" y="20" width="50" height="2.1" rx="1.05" fill={INK.bar} />

      {Array.from({ length: fields }).map((_, i) => {
        const y = 28 + i * 12.5;
        return (
          <g key={`f-${i}`}>
            <rect x="28" y={y} width="20" height="2" rx="1" fill={INK.barStrong} />
            <rect x="28" y={y + 3.4} width="58" height="6.4" rx="1.6" fill="#fff" stroke={INK.line} strokeWidth="0.4" />
            <rect x="31" y={y + 5.7} width={between(rnd, 14, 30)} height="1.9" rx="0.95" fill={INK.bar} />
            <rect x="92" y={y} width="16" height="2" rx="1" fill={INK.barStrong} />
            <rect x="92" y={y + 3.4} width="58" height="6.4" rx="1.6" fill="#fff" stroke={INK.line} strokeWidth="0.4" />
          </g>
        );
      })}

      <line x1="28" y1="88" x2="150" y2="88" stroke={INK.lineSoft} strokeWidth="0.4" />
      <rect x="28" y="91" width="20" height="5.6" rx="1.7" fill={accent} opacity="0.9" />
      <rect x="51" y="91" width="16" height="5.6" rx="1.7" fill="#fff" stroke={INK.line} strokeWidth="0.4" />
    </>
  );
}

/* ------------------------------------------------------------------- plate */

export interface ScreenshotPlateProps {
  /** Stable seed — use the screenshot id so each plate differs. */
  seed: string;
  /** Override the derived variant. Mostly for tests and previews. */
  variant?: PlateVariant;
  className?: string;
}

export function ScreenshotPlate({ seed, variant, className }: ScreenshotPlateProps) {
  const resolved = variant ?? plateVariant(seed);
  const accent = VIZ_PALETTE[(hashSeed(`${seed}-accent`) % VIZ_PALETTE.length)!]!.solid;
  const activeNav = intBetween(rngFor(`${seed}-nav`), 0, 3);

  return (
    <svg
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn("h-full w-full", className)}
    >
      <Chrome activeNav={activeNav} accent={accent} navCount={5} />
      {resolved === "dashboard" ? <Dashboard seed={seed} accent={accent} /> : null}
      {resolved === "table" ? <Table seed={seed} accent={accent} /> : null}
      {resolved === "board" ? <Board seed={seed} accent={accent} /> : null}
      {resolved === "chart" ? <Chart seed={seed} accent={accent} /> : null}
      {resolved === "settings" ? <Settings seed={seed} accent={accent} /> : null}
    </svg>
  );
}
