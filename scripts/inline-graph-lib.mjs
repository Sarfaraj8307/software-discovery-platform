/**
 * Inline vis-network into the published Graphify viewer.
 *
 * WHY THIS EXISTS
 * graphify 0.9.61's HTML template emits the visualisation library as an external
 * CDN tag:
 *
 *   <script src="https://unpkg.com/vis-network@9.1.6/standalone/umd/vis-network.min.js"
 *           integrity="sha384-..." crossorigin="anonymous"></script>
 *
 * Older graphify releases inlined the library, so the committed artifact at
 * public/graphify/graph.html was self-contained. Regenerating with 0.9.61 silently
 * regressed that: the iframe would render an empty canvas with no network access,
 * behind a strict CSP, or if unpkg is unreachable. Self-containment is the recorded
 * decision for this artifact, so the build restores it.
 *
 * The library bytes come from scripts/vendor/vis-network-9.1.6.min.js — the SAME
 * 9.1.6 build the template pins, extracted from the previously-committed artifact.
 * No download, no version drift.
 *
 * Idempotent: if the CDN tag is already gone, this is a no-op.
 *
 *   node scripts/inline-graph-lib.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const HTML = "public/graphify/graph.html";
const LIB = "scripts/vendor/vis-network-9.1.6.min.js";

/** Matches the whole CDN <script ...></script> tag, including its multi-line attributes. */
const CDN_TAG =
  /<script\s+src="https:\/\/unpkg\.com\/vis-network@[\d.]+\/standalone\/umd\/vis-network\.min\.js"[\s\S]*?<\/script>/;

if (!existsSync(HTML)) {
  console.error(`inline-graph-lib: ${HTML} not found — run graphify-build.sh first.`);
  process.exit(1);
}

const html = readFileSync(HTML, "utf8");

if (!CDN_TAG.test(html)) {
  // Already inlined by this script, or graphify changed its template again. Check for a
  // real external <script src> reference — NOT the substring "vis-network.min.js", which
  // the inlined bundle itself contains (version banner / sourcemap comment).
  const externalVis = /<script[^>]*src=["'][^"']*vis-network[^"']*["']/i.test(html);
  if (externalVis) {
    console.error(
      "inline-graph-lib: an external vis-network <script src> remains but did not match " +
        "the known unpkg tag shape. Inspect public/graphify/graph.html — the template " +
        "may have changed.",
    );
    process.exit(1);
  }
  console.log("inline-graph-lib: already self-contained, nothing to do.");
  process.exit(0);
}

if (!existsSync(LIB)) {
  console.error(
    `inline-graph-lib: ${LIB} is missing. It cannot be downloaded here by design — ` +
      "restore it from git history (it was extracted from the previous artifact).",
  );
  process.exit(1);
}

const lib = readFileSync(LIB, "utf8").trim();

// A literal "</script" inside the bundle would terminate the tag early and break the
// page. vis-network 9.1.6 does not contain one; fail loudly rather than ship a
// half-inlined document if that ever changes.
if (lib.includes("</script")) {
  console.error(
    "inline-graph-lib: the vendor library contains '</script' and cannot be inlined " +
      "verbatim. Escaping is required before this can proceed.",
  );
  process.exit(1);
}

const inlined = html.replace(CDN_TAG, `<script>\n${lib}\n</script>`);
writeFileSync(HTML, inlined);

const before = html.length;
const after = inlined.length;
console.log(
  `inline-graph-lib: inlined vis-network 9.1.6 (${lib.length} bytes). ` +
    `${before} -> ${after} bytes; no external script references remain.`,
);
