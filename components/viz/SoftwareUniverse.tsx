"use client";

import * as React from "react";
import * as THREE from "three";
import { VIZ3D } from "@/lib/viz";
import { rngFor, between } from "@/lib/procedural";

/**
 * SoftwareUniverse — the procedural 3D field behind the homepage hero.
 *
 * WHAT THIS IS
 * A slowly rotating cloud of nodes on a sphere, joined by short arcs. It reads
 * as a software ecosystem seen from outside: a few bright hubs, a long tail of
 * quieter satellites, and the connections between them.
 *
 * IT IS DECORATION, AND IT SAYS SO
 * The whole canvas is `aria-hidden` and carries no data. Nothing is encoded
 * here, no node is a real product, and no fact appears only in this scene. That
 * is a deliberate constraint, not a shortcut — a decorative layer that pretends
 * to be a chart is worse than no decoration at all. It communicates a mood
 * (connected, spatial, alive) and nothing else.
 *
 * WHY PLAIN three.js AND NOT @react-three/fiber
 * R3F was the intended renderer and had to be dropped: every published version,
 * including all 10.0.0 canaries, declares `peer react ">=19 <19.3"`, and this
 * project is on React 19.3.0. Forcing it with --legacy-peer-deps would put an
 * explicitly unsupported reconciler into production. Plain three has no React
 * peer dependency, is smaller, and this scene does not need a declarative
 * renderer — it builds its geometry once and animates one group.
 *
 * WHY IT COSTS NOTHING UNTIL IT IS EARNED
 * `three` is roughly 600 KB. This module is only ever reached through a
 * dynamic import in `HeroScene`, so it is absent from initial JS and cannot
 * threaten the 1.5 MB budget. The SVG NodeField underneath stays as the
 * baseline, so the hero is complete and on-brand before — and without — this.
 *
 * DETERMINISM
 * Node positions come from `rngFor(seed)`, the same mulberry32 the rest of the
 * visual layer uses. No `Math.random`, per the project rule. The layout is
 * identical on every load, so the hero never reshuffles between visits.
 *
 * PERFORMANCE
 * - Node count, edge count and device pixel ratio all come from the tier, which
 *   is resolved from the viewport once at mount and never during render.
 * - The animation loop stops when the canvas scrolls out of view, when the tab
 *   is hidden, and when the user prefers reduced motion (which renders a single
 *   static frame instead of a loop).
 * - Everything is disposed on unmount. A leaked WebGL context survives
 *   navigation and eventually costs a real context slot.
 */

export interface SoftwareUniverseProps {
  /** Node count. */
  count: number;
  /** Edge budget — the loop stops adding once this many links exist. */
  maxEdges: number;
  /** Device pixel ratio cap for this tier. */
  dpr: number;
  /** Any stable string. A different seed gives a different composition. */
  seed?: string;
  /** When true, render one frame and never animate. */
  static?: boolean;
  className?: string;
}

/** Fibonacci-sphere distribution with a small deterministic radial jitter. */
function buildNodes(count: number, seed: string) {
  const rnd = rngFor(seed);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes: THREE.Vector3[] = [];
  const palette = [VIZ3D.node, VIZ3D.nodeAlt, VIZ3D.nodeWarm, VIZ3D.nodeQuiet];
  const colours: THREE.Color[] = [];

  for (let i = 0; i < count; i++) {
    // Even distribution over the sphere: the vertical coordinate steps
    // uniformly and the angle advances by the golden angle, which avoids the
    // clustering a naive lat/long loop produces at the poles.
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const jitter = between(rnd, 0.9, 1.12);

    nodes.push(
      new THREE.Vector3(
        Math.cos(theta) * radius * jitter,
        y * jitter,
        Math.sin(theta) * radius * jitter,
      ),
    );

    // Overwhelmingly quiet, with accents as a rare minority. An ecosystem has
    // far more participants than hubs, and at this size a 44% accent rate read
    // as noise rather than as hierarchy.
    const roll = rnd();
    const hex =
      roll > 0.93 ? palette[0]! : roll > 0.85 ? palette[1]! : roll > 0.77 ? palette[2]! : palette[3]!;
    colours.push(new THREE.Color(hex));
  }

  return { nodes, colours };
}

/** Shortest links between nearby nodes, capped so the result stays legible. */
function buildEdges(nodes: THREE.Vector3[], maxEdges: number): Float32Array {
  const pairs: number[] = [];
  const maxDistance = 0.28;

  for (let i = 0; i < nodes.length && pairs.length / 2 < maxEdges; i++) {
    let linked = 0;
    for (let j = i + 1; j < nodes.length && linked < 2 && pairs.length / 2 < maxEdges; j++) {
      if (nodes[i]!.distanceTo(nodes[j]!) < maxDistance) {
        pairs.push(i, j);
        linked++;
      }
    }
  }

  const positions = new Float32Array(pairs.length * 3);
  for (let k = 0; k < pairs.length; k++) {
    const node = nodes[pairs[k]!]!;
    positions[k * 3] = node.x;
    positions[k * 3 + 1] = node.y;
    positions[k * 3 + 2] = node.z;
  }
  return positions;
}

export function SoftwareUniverse({
  count,
  maxEdges,
  dpr,
  seed = "software-universe",
  static: isStatic = false,
  className,
}: SoftwareUniverseProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const { nodes, colours } = buildNodes(count, seed);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.05);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: dpr > 1,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(dpr, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // Everything lives in one group so the animation is a single transform
    // rather than a per-node update.
    const universe = new THREE.Group();
    scene.add(universe);

    /* ---------------------------------------------------------------- nodes */
    const nodeGeometry = new THREE.SphereGeometry(1, 10, 10);
    // Transparent + low opacity because this is a *depth* layer, not a chart.
    // The first pass drew opaque 8px dots and they read as confetti scattered
    // over the headline and the content cards — the same legibility failure the
    // SVG field had, reintroduced in 3D. A background field should be felt, not
    // counted.
    const nodeMaterial = new THREE.MeshBasicMaterial({
      toneMapped: false,
      transparent: true,
      opacity: 0.5,
    });
    const nodeMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodes.length);
    nodeMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);

    const matrix = new THREE.Matrix4();
    // At the hero's camera distance the sphere spans roughly 85% of the view
    // height, so 0.0055 lands at ~1.7px radius on a 713px-tall hero. Size is
    // expressed in world units, so this scales with the viewport rather than
    // with device pixel ratio.
    const scale = 0.0055;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]!;
      matrix.makeScale(scale, scale, scale);
      matrix.setPosition(node.x, node.y, node.z);
      nodeMesh.setMatrixAt(i, matrix);
      nodeMesh.setColorAt(i, colours[i]!);
    }
    nodeMesh.instanceMatrix.needsUpdate = true;
    if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;
    universe.add(nodeMesh);

    /* ---------------------------------------------------------------- edges */
    const edgePositions = buildEdges(nodes, maxEdges);
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(VIZ3D.edge),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    universe.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));

    /* --------------------------------------------------------------- sizing */
    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    /* ------------------------------------------------------------ animation */
    let frame = 0;
    let visible = true;
    let onScreen = true;

    const renderFrame = (elapsed: number) => {
      // Two axes at different rates so the motion never looks like a turntable.
      universe.rotation.y = elapsed * 0.055;
      universe.rotation.x = Math.sin(elapsed * 0.16) * 0.11;
      renderer.render(scene, camera);
    };

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible || !onScreen) return;
      renderFrame(performance.now() / 1000);
    };

    if (isStatic) {
      // Reduced motion: one correct frame, no loop, nothing to stop later.
      renderFrame(0);
    } else {
      frame = requestAnimationFrame(loop);
    }

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Stop burning GPU on a canvas nobody can see. This matters more than it
    // looks: the hero scrolls away almost immediately on a long homepage.
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(host);

    /* -------------------------------------------------------------- cleanup */
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      universe.remove(nodeMesh);
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      nodeMesh.dispose();

      edgeGeometry.dispose();
      edgeMaterial.dispose();

      renderer.dispose();
      // A detached canvas keeps its WebGL context alive until it is dropped.
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [count, maxEdges, dpr, seed, isStatic]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default SoftwareUniverse;
