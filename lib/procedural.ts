/**
 * Deterministic procedural primitives, shared by every generated visual.
 *
 * WHY THIS MODULE EXISTS
 * The same FNV-1a hash had already been written four times — `lib/brand.ts`,
 * `lib/viz.ts`, `lib/data/seed.ts` and `components/viz/NodeField.tsx` — and
 * mulberry32 twice. A fifth copy was about to be written for the screenshot
 * plates. This is the single implementation the *visual* layer reads from.
 *
 * WHAT IS DELIBERATELY NOT HERE
 * `lib/data/seed.ts` keeps its own private copy and is NOT refactored to use
 * this module. That file generates all 230 products, 1,176 reviews, 72
 * categories and 180 comparison pages at module load. Its PRNG is part of the
 * dataset's definition: swapping the implementation would silently change every
 * generated value and invalidate every number recorded in the reports and in
 * `project-execution-state.json`. It is frozen on purpose.
 *
 * The requirement is weaker here anyway. Data generation must be stable across
 * *releases*; rendering only has to be stable between a server render and the
 * client hydration that follows it. Same guarantee, much smaller blast radius.
 *
 * WHY DETERMINISM IS NON-NEGOTIABLE
 * `Math.random()` is forbidden project-wide. A procedural graphic that
 * re-rolled its geometry on the client would desync from the server HTML and
 * React would either throw a hydration error or visibly re-shuffle the layout.
 * Seeding from a stable string means "random-looking" is really a pure
 * function of that string — identical on both sides of the wire.
 */

/** FNV-1a, 32-bit. The same constants as `lib/brand.ts` and `lib/viz.ts`. */
export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — the same PRNG family the data layer uses. */
export function mulberry32(seed: number): () => number {
  return function next(): number {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A generator seeded straight from a string. This is the entry point every
 * component should use — it makes the seed string visible at the call site,
 * which is what keeps the whole layer reproducible and debuggable.
 */
export function rngFor(seed: string): () => number {
  return mulberry32(hashSeed(seed));
}

/** Deterministic float in [min, max). */
export function between(rnd: () => number, min: number, max: number): number {
  return min + rnd() * (max - min);
}

/** Deterministic integer in [min, max] inclusive. */
export function intBetween(rnd: () => number, min: number, max: number): number {
  return Math.floor(min + rnd() * (max - min + 1));
}

/** Deterministic choice from a non-empty list. */
export function pick<T>(rnd: () => number, items: readonly T[]): T {
  return items[Math.floor(rnd() * items.length) % items.length]!;
}

/**
 * A stable 0–1 value from a seed string alone, with no generator state.
 * Useful when you want a single deterministic number rather than a sequence —
 * e.g. "how tall is this bar", answered without threading an `rnd` around.
 */
export function seededUnit(seed: string): number {
  return mulberry32(hashSeed(seed))();
}
