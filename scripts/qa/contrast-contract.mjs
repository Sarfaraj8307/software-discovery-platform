/**
 * Contrast contract guard — needs no server; reads app/globals.css off disk.
 *
 *   node scripts/qa/contrast-contract.mjs [path/to/globals.css]
 *
 * The optional path argument exists so the guard can be falsified against a
 * mutated copy without editing the real stylesheet. The runner passes no
 * argument, so the default below is always the shipped file.
 *
 * WHY THIS EXISTS
 *
 * app/globals.css states ~72 specific contrast ratios in its comments, plus the
 * rule each token obeys ("viz-N-fg needs >= 4.5:1 on BOTH white and its own
 * tint"). Those comments are what the next person trusts when they nudge a hex.
 * Nothing verified a single one of them: scripts/qa/contrast-audit.py is a
 * palette *exploration* from when the colours were being chosen — it has no
 * exit code at all, so it prints "FAILURES:" and exits 0 regardless, and its
 * candidate list is a hardcoded copy that never touches the shipped tokens.
 *
 * So this guard reads the source of truth and asserts three things:
 *
 *   1. CONTRACT — every pair the design system relies on meets the threshold its
 *      documented role requires: 4.5:1 for text (WCAG 2.2 AA 1.4.3), 3:1 for
 *      non-text UI boundaries (WCAG 2.2 SC 1.4.11).
 *   2. DOCUMENTED NUMBERS — every "N:1" written in the CSS is recomputed from
 *      the live token values and must match. A stale comment is a false claim,
 *      and a false claim is worse than no comment. Claims that are not pair
 *      assertions (bare thresholds like "needs >= 4.5:1") must be listed in
 *      THRESHOLD_STATEMENTS with a reason; an unrecognised "N:1" fails the run,
 *      so a NEW claim cannot be added without being verified.
 *   3. COVERAGE — every hex-valued --color-* token is either checked, used as a
 *      ground in a checked pair, or exempt WITH A STATED REASON. Adding
 *      --color-new-thing: #eee cannot slip through unmeasured.
 *
 * The one documented failure (--color-primary on --color-surface-inverse) is
 * asserted to be a real failure, so the warning cannot go stale: if someone
 * darkens the inverse band enough to fix it, this guard tells them the comment
 * now lies.
 *
 * EXIT CODES (the suite's three-way contract, not a boolean)
 *   0  every assertion passed
 *   1  an assertion failed
 *   2  the guard could not run (globals.css missing, or a token value that
 *      cannot be resolved to a hex colour)
 *
 * Luminance maths matches scripts/qa/contrast-audit.py exactly (WCAG 2.x
 * relative luminance, sRGB, 0.04045 knee), so the two agree on any shared value.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CSS = join(HERE, "..", "..", "app", "globals.css");
const CSS_PATH = process.argv[2] ?? DEFAULT_CSS;

/* -------------------------------------------------------------- luminance */

const channel = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

function luminance(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* ----------------------------------------------------------------- parsing */

let css;
try {
  css = readFileSync(CSS_PATH, "utf8");
} catch (err) {
  console.log(`FAIL: cannot read ${CSS_PATH} — ${err.message}`);
  process.exit(2);
}

const HEX = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;

/* Every --color-* declaration, in source order, with its line number. */
const declared = new Map();
const declaredLines = new Map();
css.split(/\r?\n/).forEach((line, i) => {
  const m = /(--color-[a-z0-9-]+)\s*:\s*([^;]+);/.exec(line);
  if (!m) return;
  const name = m[1].replace(/^--color-/, "");
  if (declared.has(name)) return; // first declaration wins; the file has no overrides
  declared.set(name, m[2].trim());
  declaredLines.set(name, i + 1);
});

/** Resolve a token name to a hex value, following var() aliases. */
function resolve(name, seen = new Set()) {
  if (name === "white") return "#ffffff";
  if (HEX.test(name)) return name;
  if (seen.has(name)) return { error: `alias cycle through --color-${name}` };
  if (!declared.has(name)) return { error: `--color-${name} is not declared` };
  const raw = declared.get(name);
  if (HEX.test(raw)) return raw;
  const alias = /^var\(\s*--color-([a-z0-9-]+)\s*\)$/.exec(raw);
  if (alias) return resolve(alias[1], new Set([...seen, name]));
  return { error: `--color-${name} is "${raw}", not a hex colour or a var() alias` };
}

/* ------------------------------------------------------------------ checks */

let failures = 0;
let checksRun = 0;
const unresolved = [];

function check(name, condition, detail) {
  checksRun += 1;
  if (condition) {
    console.log(`  ok   ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/**
 * Print a group of individually-counted assertions as one line. The members
 * have already been counted (and any failure already recorded), so this must
 * NOT go through check() — doing that would count each bad claim twice.
 */
function reportGroup(label, items) {
  const bad = items.filter((c) => !c.ok);
  console.log(`  ${bad.length === 0 ? "ok  " : "FAIL"} ${label}`);
  for (const c of bad) console.log(`       ${c.label} — ${c.detail}`);
}

/**
 * Assert every pair in a group meets its threshold. Prints one summary line;
 * failures are enumerated individually so a red run names the exact pair.
 *
 * A pair that cannot be resolved is NOT a pass. It is counted separately and
 * the group refuses to report ok, because "23/23 meet 4.5:1" over a set that
 * silently dropped two unmeasurable pairs is a false claim — the same defect
 * this guard exists to catch elsewhere.
 */
function checkPairs(label, pairs, threshold) {
  const bad = [];
  let unmeasurable = 0;
  for (const [fg, bg] of pairs) {
    const a = resolve(fg);
    const b = resolve(bg);
    if (typeof a !== "string" || typeof b !== "string") {
      unmeasurable += 1;
      unresolved.push(`${fg} on ${bg}: ${a.error ?? b.error}`);
      continue;
    }
    const got = ratio(a, b);
    if (got + 1e-9 < threshold) bad.push(`${fg} on ${bg} = ${got.toFixed(2)}:1`);
  }
  const measured = pairs.length - unmeasurable;
  check(
    `${measured}/${pairs.length} ${label} meet ${threshold}:1`,
    bad.length === 0 && unmeasurable === 0,
    unmeasurable > 0
      ? `${unmeasurable} pair(s) could not be measured — see the could-not-run report`
      : bad.length === 0
        ? ""
        : `below threshold — ${bad.join("; ")}`,
  );
}

/* ---- 1. CONTRACT: thresholds assigned by documented role ---------------- */

const TEXT = 4.5; // WCAG 2.2 AA, normal-size text (1.4.3)
const NON_TEXT = 3.0; // WCAG 2.2 AA, non-text UI boundaries (1.4.11)

const TEXT_PAIRS = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["secondary-foreground", "secondary"],
  ["secondary-foreground", "secondary-hover"],
  ["primary-foreground", "primary"],
  ["primary-foreground", "primary-hover"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "subtle"],
  ["muted-foreground", "surface-3"],
  ["faint", "background"],
  ["faint", "muted"],
  ["primary", "primary-subtle"],
  ["success", "success-subtle"],
  ["warning", "warning-subtle"],
  ["destructive", "destructive-subtle"],
  ["info", "background"],
  ["info", "info-subtle"],
  ["brand-ink", "background"],
  ["brand-ink", "surface-2"],
  ["brand-ink", "surface-3"],
  ["chart-axis", "chart-tooltip"],
];

const INVERSE_PAIRS = [
  ["surface-inverse-foreground", "surface-inverse"],
  ["surface-inverse-muted", "surface-inverse"],
  ["surface-inverse-accent", "surface-inverse"],
];

const BOUNDARY_PAIRS = [
  ["input", "background"], // form-control boundary — the reason --color-input exists
  ["ring", "background"], // focus indicator
];

const VIZ_HUES = Array.from({ length: 10 }, (_, i) => i + 1);
const CAT_HUES = Array.from({ length: 8 }, (_, i) => i + 1);

const vizSolidPairs = VIZ_HUES.map((n) => [`viz-${n}`, "background"]);
const vizInkPairs = VIZ_HUES.flatMap((n) => [
  [`viz-${n}-fg`, "background"],
  [`viz-${n}-fg`, `viz-${n}-tint`],
]);
const catInkPairs = CAT_HUES.flatMap((n) => [
  [`cat-${n}-fg`, "background"],
  [`cat-${n}-fg`, `cat-${n}`],
  [`cat-${n}-fg`, "surface-3"],
]);

/**
 * The file documents that --color-primary fails on the inverse band and tells
 * you to use --color-surface-inverse-accent instead. Assert the failure is REAL
 * (so the warning is not stale) and that the documented number is accurate.
 */
const DOCUMENTED_FAILURES = [
  {
    fg: "primary",
    bg: "surface-inverse",
    documented: 3.66,
    why: "on dark use --color-surface-inverse-accent, never --color-primary",
  },
];

/* ---- 2. DOCUMENTED NUMBERS: verify the claims written in the CSS --------- */

/* Shape A — number first: "4.53:1 on muted", "~3:1 vs white". The "~" marks an
 * explicit approximation, so it gets a wider tolerance. Grounds are lowercase
 * names; that is deliberate, because it stops "on BOTH white and" from being
 * read as a ground called BOTH. */
const CLAIM_A = /(~?)(\d+(?:\.\d+)?):1\s+(?:on|vs)\s+([a-z][a-z0-9-]*)/g;
/* Shape B — subject first: "#f4f4f7 on #0b1020  = 17.25:1" */
const CLAIM_B = /(#[0-9a-fA-F]{6})\s+on\s+(#[0-9a-fA-F]{6})\s*=\s*(\d+(?:\.\d+)?):1/g;
/* Shape C — token subject, prose ground: "--color-primary on the inverse
 * surface measures 3.66:1". Narrow on purpose; it exists for one line. */
const CLAIM_C =
  /--color-([a-z0-9-]+)\s+on\s+the\s+inverse\s+surface\s+measures\s+(\d+(?:\.\d+)?):1/g;
/* Any bare "N:1" claims N on white for the nearest preceding hex ON THE SAME
 * LINE — that is how "(1.27:1)" after "zinc-200 #e4e4e7" reads. */
const ANY_NUMBER = /(\d+(?:\.\d+)?):1/g;
const ANY_HEX = /#[0-9a-fA-F]{6}/g;

/**
 * "N:1" statements that are not pair claims and must not be read as one.
 * Matched against the line text. Every entry needs a reason; an unrecognised
 * "N:1" fails the run rather than being skipped.
 */
const THRESHOLD_STATEMENTS = [
  {
    re: /can reach 4\.5:1/,
    why: "universal claim that no lighter grey can reach AA — a threshold, not a pair",
  },
  {
    re: /Needs >= 3:1/,
    why: "requirement stated for the viz-N role, not a measurement",
  },
  {
    re: /Needs >= 4\.5:1 on BOTH/,
    why: "requirement stated for the viz-N-fg role, not a measurement",
  },
  {
    re: /All ten pass graphical 3:1 and AA text 4\.5:1/,
    why: "summary of the table below it, which is verified number by number",
  },
];

const blocks = [...css.matchAll(/\/\*([\s\S]*?)\*\//g)];
const lineOf = (offset) => css.slice(0, offset).split("\n").length;

/* Map an absolute CSS offset to the token whose declaration that line annotates.
 * The convention is that the comment sits on or immediately before its token, so
 * look forward first, then backward. */
const cssLines = css.split(/\r?\n/);
function annotatedToken(offset) {
  const lineNo = lineOf(offset); // 1-based
  for (const dir of [1, -1]) {
    for (let i = 0; i < 6; i += 1) {
      const idx = lineNo - 1 + dir * i;
      if (idx < 0 || idx >= cssLines.length) break;
      const m = /(--color-[a-z0-9-]+)\s*:\s*([^;]+);/.exec(cssLines[idx]);
      if (m) return { name: m[1].replace(/^--color-/, ""), value: m[2].trim() };
      if (i === 0 && dir === 1) continue; // same line, then next line, then back
    }
  }
  return null;
}

const claimResults = []; // { ok, label, detail }
/* Absolute [start, end) ranges already accounted for by a shaped claim. The
 * bare-"N:1" sweep consults this so a number verified by CLAIM_A/B/C is not then
 * re-read as an unverifiable one. Ranges, not start offsets: CLAIM_C's match
 * begins at "--color-primary" and its number sits 46 characters later, so a
 * proximity window around the match start missed it. */
const consumed = [];

/** True when the line containing this offset is a declared threshold statement. */
function isThresholdStatement(absOffset) {
  const lineText = cssLines[lineOf(absOffset) - 1] ?? "";
  return THRESHOLD_STATEMENTS.some((t) => t.re.test(lineText));
}

function verifyClaim(span, subject, ground, expected, approx, label) {
  consumed.push(span);
  const a = resolve(subject);
  const b = resolve(ground);
  if (typeof a !== "string" || typeof b !== "string") {
    unresolved.push(`${label}: ${a.error ?? b.error}`);
    return;
  }
  const got = ratio(a, b);
  const tol = approx ? 0.05 : 0.011;
  const ok = Math.abs(got - expected) <= tol;
  checksRun += 1;
  if (!ok) failures += 1;
  claimResults.push({
    ok,
    label,
    detail: ok
      ? `documented ${expected.toFixed(2)} = computed ${got.toFixed(2)}`
      : `documented ${expected.toFixed(2)} but computed ${got.toFixed(2)} (${a} on ${b})`,
  });
}

function rejectClaim(label, detail) {
  checksRun += 1;
  failures += 1;
  claimResults.push({ ok: false, label, detail });
}

for (const block of blocks) {
  const body = block[1];
  const base = block.index + 2; // first char of the comment body
  const spanOf = (m) => ({ start: base + m.index, end: base + m.index + m[0].length });

  for (const m of body.matchAll(CLAIM_B)) {
    if (isThresholdStatement(base + m.index)) continue;
    verifyClaim(spanOf(m), m[1], m[2], Number(m[3]), false, `#hex on #hex = ${m[3]}:1`);
  }

  for (const m of body.matchAll(CLAIM_C)) {
    if (isThresholdStatement(base + m.index)) continue;
    verifyClaim(
      spanOf(m),
      m[1],
      "surface-inverse",
      Number(m[2]),
      false,
      `--color-${m[1]} on the inverse surface`,
    );
  }

  for (const m of body.matchAll(CLAIM_A)) {
    if (m.index === undefined) continue;
    /* An allowlisted threshold statement is not a pair claim in ANY shape, so the
     * allowlist is consulted here too — not only in the bare sweep below. This
     * matters: the viz block's "All ten pass graphical 3:1 and AA text 4.5:1 on
     * white and on tint" shares a comment with "--color-primary remains the only
     * affordance", so the shaped matcher resolved the subject to `primary` and
     * compared it against a summary figure that was never about primary. */
    if (isThresholdStatement(base + m.index)) continue;
    const before = body.slice(0, m.index);
    const hexBefore = [...before.matchAll(ANY_HEX)].pop();
    /* Only a token that actually exists can be the subject. The CSS writes role
     * placeholders like `--color-viz-N-fg` with a literal capital N, and a naive
     * [a-z0-9-]+ capture reads that as "viz-" — a token that does not exist. */
    const tokenBefore = [...before.matchAll(/--color-([a-z0-9-]+)/g)]
      .filter((t) => declared.has(t[1]))
      .pop();
    let subject;
    if (hexBefore) subject = hexBefore[0];
    else if (tokenBefore) subject = tokenBefore[1];
    else {
      const annot = annotatedToken(base + m.index);
      subject = annot ? annot.name : null;
    }
    if (!subject) {
      rejectClaim(
        `${m[2]}:1 on ${m[3]}`,
        "cannot determine which colour this claim is about",
      );
      continue;
    }
    verifyClaim(
      spanOf(m),
      subject,
      m[3],
      Number(m[2]),
      m[1] === "~",
      `${subject} on ${m[3]}`,
    );
  }

  /* Bare "N:1" — nearest preceding hex on the same line, claimed against white. */
  for (const m of body.matchAll(ANY_NUMBER)) {
    const abs = base + m.index;
    if (consumed.some((r) => abs >= r.start && abs < r.end)) continue;
    if (isThresholdStatement(abs)) continue;
    const before = body.slice(0, m.index);
    const sameLineHex = [...before.matchAll(ANY_HEX)]
      .filter((h) => lineOf(base + h.index) === lineOf(abs))
      .pop();
    if (!sameLineHex) {
      rejectClaim(
        `bare ${m[1]}:1`,
        `unverifiable claim on line ${lineOf(abs)} — verify it or add a reason to THRESHOLD_STATEMENTS`,
      );
      continue;
    }
    verifyClaim(
      spanOf(m),
      sameLineHex[0],
      "white",
      Number(m[1]),
      false,
      `${sameLineHex[0]} on white`,
    );
  }
}

/* The category-hue table and the viz-hue table are dense numeric blocks. Parse
 * them structurally and check every number. */
const tableClaims = [];

const CAT_TABLE_ROW =
  /(\d)\s+([a-z]+)\s+(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g;
for (const block of blocks) {
  const body = block[1];
  const catRows = [...body.matchAll(CAT_TABLE_ROW)];
  if (catRows.length !== 8) continue; // only the 8-row category table
  for (const row of catRows) {
    const n = Number(row[1]);
    const grounds = ["white", `cat-${n}`, "surface-3"];
    row.slice(3).forEach((doc, i) => {
      const a = resolve(`cat-${n}-fg`);
      const b = resolve(grounds[i]);
      if (typeof a !== "string" || typeof b !== "string") {
        unresolved.push(`cat-${n}-fg on ${grounds[i]}`);
        return;
      }
      const got = ratio(a, b);
      const ok = Math.abs(got - Number(doc)) <= 0.011;
      checksRun += 1;
      if (!ok) failures += 1;
      tableClaims.push({
        ok,
        label: `cat-${n}-fg on ${grounds[i]}`,
        detail: ok ? "" : `documented ${doc} but computed ${got.toFixed(2)}`,
      });
    });
  }
}

/* The viz table has no index column, so row order carries it: row N is
 * --color-viz-N. Assert the row count so a reordered or truncated table is loud. */
const vizRows = [];
for (const block of blocks) {
  const body = block[1];
  if (!/hue\s+solid\/white\s+fg\/white\s+fg\/tint/.test(body)) continue;
  for (const line of body.split("\n")) {
    const m = /^\s*([a-z]+)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*$/.exec(
      line,
    );
    if (m) vizRows.push(m);
  }
}

/* Asserted in the report section, so the header prints before any result line. */
const vizRowCountOk = vizRows.length === VIZ_HUES.length;

vizRows.forEach((row, i) => {
  const n = i + 1;
  const specs = [
    [`viz-${n}`, "white", row[2]],
    [`viz-${n}-fg`, "white", row[3]],
    [`viz-${n}-fg`, `viz-${n}-tint`, row[4]],
  ];
  for (const [fg, bg, doc] of specs) {
    const a = resolve(fg);
    const b = resolve(bg);
    if (typeof a !== "string" || typeof b !== "string") {
      unresolved.push(`${fg} on ${bg}`);
      continue;
    }
    const got = ratio(a, b);
    const ok = Math.abs(got - Number(doc)) <= 0.011;
    checksRun += 1;
    if (!ok) failures += 1;
    tableClaims.push({
      ok,
      label: `${fg} on ${bg}`,
      detail: ok ? "" : `documented ${doc} but computed ${got.toFixed(2)}`,
    });
  }
});

/* ---- 3. COVERAGE: nothing colour-shaped goes unchecked ------------------- */

/**
 * Tokens that are deliberately NOT held to a text or boundary threshold.
 * Every entry needs a reason, and the reason has to be a design decision that
 * already exists in the file — not a convenient excuse for a failing value.
 */
const EXEMPT = new Map([
  ["border", "decorative 1px separators (1.27:1); never a sole affordance — see knownIssues"],
  ["border-strong", "decorative dividers needing weight (1.48:1)"],
  ["primary-border", "border of a subtle button; the button's text carries the affordance"],
  ["success-border", "decorative callout border"],
  ["warning-border", "decorative callout border"],
  ["destructive-border", "decorative callout border"],
  ["info-border", "alias of --color-primary-border; decorative"],
  ["chart-grid", "alias of --color-border; decorative chart chrome"],
  ["chart-grid-strong", "alias of --color-border-strong; decorative chart chrome"],
  ["chart-tooltip-border", "alias of --color-border-strong; decorative"],
  ["brand-2", "gradient far-stop only — never text, never interactive (file header rule)"],
  ["chart-cursor", "translucent cursor wash, not a colour value"],
  [
    "surface-1",
    "alias of --color-background (#ffffff); declared for the elevation ladder but no component references bg-surface-1",
  ],
]);

const checkedTokens = new Set();
const groundTokens = new Set();
for (const pairs of [
  TEXT_PAIRS,
  INVERSE_PAIRS,
  BOUNDARY_PAIRS,
  vizSolidPairs,
  vizInkPairs,
  catInkPairs,
]) {
  for (const [fg, bg] of pairs) {
    checkedTokens.add(fg);
    groundTokens.add(bg);
  }
}
for (const n of VIZ_HUES) {
  checkedTokens.add(`viz-${n}-fg`);
  groundTokens.add(`viz-${n}-tint`);
}
for (const n of CAT_HUES) groundTokens.add(`cat-${n}`);

const unaccounted = [];
for (const [name, raw] of declared) {
  const resolved = resolve(name);
  if (typeof resolved !== "string") {
    // A non-hex, non-alias value (e.g. an rgb() wash) is out of scope, but it
    // must not silently masquerade as a colour we verified.
    if (!EXEMPT.has(name)) unaccounted.push(`${name} ("${raw}") is not a hex or alias`);
    continue;
  }
  if (checkedTokens.has(name) || groundTokens.has(name) || EXEMPT.has(name)) continue;
  unaccounted.push(`--color-${name} (${resolved}) is neither checked nor exempt`);
}

/* ------------------------------------------------------------------ report */

const hexTokens = [...declared.keys()].filter((n) => typeof resolve(n) === "string");

console.log("contrast-contract — app/globals.css is the source of truth");
console.log(
  `tokens: ${declared.size} declared, ${hexTokens.length} resolve to a hex colour, ` +
    `${EXEMPT.size} exempt with a stated reason`,
);
console.log(`source: ${CSS_PATH} (${cssLines.length} lines)\n`);

console.log("1. CONTRACT — threshold assigned by documented role");
checkPairs("text pairs on their surface", TEXT_PAIRS, TEXT);
checkPairs("inverse-band pairs", INVERSE_PAIRS, TEXT);
checkPairs("focus / form boundaries", BOUNDARY_PAIRS, NON_TEXT);
checkPairs("viz solids (graphical)", vizSolidPairs, NON_TEXT);
checkPairs("viz inks on white and own tint", vizInkPairs, TEXT);
checkPairs("category inks on white, tint, surface-3", catInkPairs, TEXT);

for (const d of DOCUMENTED_FAILURES) {
  const a = resolve(d.fg);
  const b = resolve(d.bg);
  const got = typeof a === "string" && typeof b === "string" ? ratio(a, b) : NaN;
  check(
    `documented failure is real: ${d.fg} on ${d.bg}`,
    Number.isFinite(got) && got < TEXT && Math.abs(got - d.documented) <= 0.011,
    `${got.toFixed(2)}:1 (documented ${d.documented}) — ${d.why}`,
  );
}

console.log("\n2. DOCUMENTED NUMBERS — the comments are claims");
check(
  "the viz table has one row per viz hue",
  vizRowCountOk,
  `parsed ${vizRows.length} row(s), expected ${VIZ_HUES.length}`,
);
reportGroup(
  `${claimResults.length} inline claims match the computed ratio` +
    (claimResults.every((c) => c.ok) ? "" : ` — ${claimResults.filter((c) => !c.ok).length} wrong`),
  claimResults,
);
reportGroup(
  `${tableClaims.length} table numbers match the computed ratio` +
    (tableClaims.every((c) => c.ok) ? "" : ` — ${tableClaims.filter((c) => !c.ok).length} wrong`),
  tableClaims,
);

console.log("\n3. COVERAGE — no colour goes unchecked");
check(
  "every hex-valued --color-* token is checked, a ground, or exempt with a reason",
  unaccounted.length === 0,
  unaccounted.length === 0
    ? `${hexTokens.length} tokens accounted for`
    : unaccounted.join("; "),
);

/* The could-not-run gate goes LAST. Unresolved pairs are added by checkPairs in
 * section 1 as well as by the claim and table parsers, so checking before
 * section 1 let an unresolvable contract pair through as a green "23/23" — the
 * exact "error demoted to a warning" shape this guard exists to catch. Proven by
 * deleting --color-faint, which the contract references. */
if (unresolved.length > 0) {
  console.log("\nCannot measure — the following do not resolve to a colour:");
  for (const u of unresolved) console.log(`  - ${u}`);
  console.log(
    "\nThis is a guard bug or a deleted token, not a contrast failure. Fix the\n" +
      "pair list or restore the token, then re-run. Exiting 2 (could not run)\n" +
      "so this is never quoted as a pass.\n",
  );
  process.exit(2);
}

console.log(`\nRESULT: ${checksRun - failures} pass, ${failures} fail`);
process.exit(failures === 0 ? 0 : 1);
