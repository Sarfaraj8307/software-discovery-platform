"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { TIER_BUDGET, tierFromWidth, type VizTier } from "@/lib/viz";

/**
 * HeroScene — the gate in front of the 3D hero.
 *
 * WHY A GATE EXISTS AT ALL
 * `three` is roughly 600 KB and a WebGL context is an expensive thing to hold
 * open on someone else's device. Neither should be handed out unconditionally
 * for a decorative background. This component decides whether the scene is
 * appropriate, and renders nothing at all when it is not — leaving the
 * server-rendered SVG NodeField as the complete hero, not a degraded one.
 *
 * THE SCENE IS NEVER IN INITIAL JS
 * `dynamic(..., { ssr: false })` is what keeps `three` out of the initial
 * bundle. That is load-bearing for the 1.5 MB budget, and it is also why this
 * has to be a client component: in the App Router, `ssr: false` is not allowed
 * in a Server Component, so the dynamic import has to live behind a client
 * boundary.
 *
 * WHAT DISQUALIFIES A CLIENT — all checked before any download starts
 *   - no WebGL context at all
 *   - viewport below the `low` tier (phones get the SVG, by design)
 *   - `prefers-reduced-motion: reduce` — the scene is pure motion, so it is
 *     rendered as a single static frame rather than animated
 *   - `prefers-reduced-data: reduce`, or a 2g/3g connection, or `saveData` —
 *     a 600 KB download for decoration is not a fair trade on a metered link
 *
 * HYDRATION
 * Every input is read in an effect, after mount, so the server and the first
 * client render agree (both render nothing). Deciding during render would
 * produce markup that cannot match on the server and would trip a hydration
 * mismatch.
 */

const SoftwareUniverse = dynamic(() => import("@/components/viz/SoftwareUniverse"), {
  ssr: false,
});

/**
 * Below this width the hero text spans the full column, so a full-bleed 3D
 * scene would sit directly behind body copy. The SVG NodeField survives that
 * because it is confined to the top-right corner and a scrim fades it out; a
 * full-bleed canvas does not. `lg` is the breakpoint where the hero splits into
 * two columns, so it is also the point at which the scene has somewhere to live.
 *
 * This is checked in JS rather than hidden with `hidden lg:block`, because a CSS
 * hide would still have downloaded `three` and opened a WebGL context.
 */
const MIN_SCENE_WIDTH = 1024;

/** Cheap synchronous WebGL probe. Creates a context and immediately releases it. */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) return false;
    // Release the probe context rather than leaving it to the GC — browsers cap
    // the number of live contexts and this one is not needed.
    const lose = (context as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Conservative connection check. `navigator.connection` is Chromium-only, so a
 * missing API means "unknown", which we treat as acceptable — refusing to
 * enhance every Firefox and Safari user would be the wrong default.
 */
function connectionAllowsHeavyAsset(): boolean {
  type NetworkInformation = { saveData?: boolean; effectiveType?: string };
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(connection.effectiveType ?? "");
}

export interface HeroSceneProps {
  className?: string;
  /** Stable seed, so the composition never reshuffles between visits. */
  seed?: string;
}

export function HeroScene({ className, seed = "software-universe" }: HeroSceneProps) {
  const [decision, setDecision] = React.useState<
    { render: false } | { render: true; tier: VizTier; static: boolean }
  >({ render: false });

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");

    const decide = () => {
      if (!supportsWebGL() || reducedData.matches || !connectionAllowsHeavyAsset()) {
        setDecision({ render: false });
        return;
      }

      const tier = tierFromWidth(window.innerWidth);
      // Phones and tablets keep the SVG hero. See MIN_SCENE_WIDTH and the note
      // on TIER_BUDGET.
      if (tier === "low" || window.innerWidth < MIN_SCENE_WIDTH) {
        setDecision({ render: false });
        return;
      }

      setDecision({ render: true, tier, static: reducedMotion.matches });
    };

    decide();

    // Re-decide on the changes that actually matter: crossing the mobile
    // breakpoint, and the user toggling reduced motion mid-session.
    const onChange = () => decide();
    reducedMotion.addEventListener("change", onChange);
    reducedData.addEventListener("change", onChange);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(decide, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      reducedMotion.removeEventListener("change", onChange);
      reducedData.removeEventListener("change", onChange);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  if (!decision.render) return null;

  const budget = TIER_BUDGET[decision.tier];

  return (
    <div className={className} aria-hidden="true">
      <SoftwareUniverse
        count={budget.nodes}
        maxEdges={budget.edges}
        dpr={budget.dpr}
        seed={seed}
        static={decision.static}
      />
    </div>
  );
}
