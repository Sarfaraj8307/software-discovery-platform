/**
 * Knowledge-graph artifact guard — run against a served build.
 *
 *   node scripts/qa/graph-artifact.mjs [baseUrl]
 *
 * WHY THIS EXISTS
 * P2.2 regenerated public/graphify/graph.html with graphify 0.9.61 and the build
 * exited 0 while quietly shipping a viewer that loaded vis-network from
 * https://unpkg.com at runtime. The previously-committed artifact had it inlined.
 * The symptom was a file HALF the size (1.44 MB -> 735 KB) and a `<script src>`
 * that did not used to be there — neither of which fails a build. Offline, behind
 * a strict CSP, or if unpkg is unreachable, the iframe renders a blank canvas that
 * looks exactly like a successful build from the outside.
 *
 * So this guard asserts the thing the build cannot: that the served artifact is
 * SELF-CONTAINED, and that the page's disclosed build commit matches the artifact
 * actually on disk.
 *
 * Assertions:
 *   1. /graph returns 200.
 *   2. /graph discloses the same short commit as public/graphify/graph.json
 *      (compared against the generated artifact, not against a hardcoded value).
 *   3. /graph is NOT still disclosing the known-stale 91a419c.
 *   4. /graphify/graph.html returns 200.
 *   5. It has ZERO external <script src> references.  <-- the load-bearing one
 *   6. It contains the inlined vis-network library.
 *   7. It contains the embedded graph payload.
 *   8. The served artifact is CONTENT-IDENTICAL to the file on disk (SHA-256 of
 *      the served body vs the file, plus a byte-length comparison). Catches a
 *      build step that rewrites or truncates it, and — unlike a bare length
 *      comparison — also catches a same-length substitution.
 *   9. /graph renders all five derived stat labels.
 *
 * 15 checks in total. Falsification record: see project-execution-state.json
 * phases.P2.2_refresh_graph_artifact.guard.
 */
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const ARTIFACT = "public/graphify/graph.json";
const VIEWER = "public/graphify/graph.html";
const STALE_SHA = "91a419c";

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ok   ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ---- the artifact on disk is the reference ------------------------------- */

const raw = JSON.parse(readFileSync(ARTIFACT, "utf8"));
const diskSha = String(raw.built_at_commit ?? "");
const diskShort = diskSha.slice(0, 7);
check(
  "the committed artifact records a build commit",
  /^[0-9a-f]{40}$/.test(diskSha),
  diskSha || "missing built_at_commit",
);

const viewerOnDisk = readFileSync(VIEWER, "utf8");

/* ---- /graph -------------------------------------------------------------- */

const graphRes = await fetch(`${base}/graph`);
const graphHtml = await graphRes.text();
check("/graph returns 200", graphRes.status === 200, `status ${graphRes.status}`);

check(
  "/graph discloses the artifact's build commit",
  diskShort.length === 7 && graphHtml.includes(diskShort),
  `artifact says ${diskShort}, page ${graphHtml.includes(diskShort) ? "agrees" : "DISAGREES"}`,
);

check(
  "/graph is not still disclosing the stale artifact commit",
  !graphHtml.includes(STALE_SHA),
  graphHtml.includes(STALE_SHA) ? `page still shows ${STALE_SHA}` : `no ${STALE_SHA}`,
);

for (const label of ["Nodes", "Edges", "Communities", "Source files", "Relation types"]) {
  check(`/graph renders the "${label}" stat`, graphHtml.includes(label));
}

/* ---- the viewer ---------------------------------------------------------- */

const viewerRes = await fetch(`${base}/graphify/graph.html`);
const viewerServed = await viewerRes.text();
check(
  "/graphify/graph.html returns 200",
  viewerRes.status === 200,
  `status ${viewerRes.status}`,
);

/* THE assertion. An external <script src> means the viewer depends on the network. */
const externalScripts = [...viewerServed.matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/gi)].map(
  (m) => m[1],
);
check(
  "the viewer has no external <script src> — it is self-contained",
  externalScripts.length === 0,
  externalScripts.length ? `external: ${externalScripts.join(", ")}` : "0 external scripts",
);

check(
  "the viewer has the visualisation library inlined",
  /@version\s+9\.1\.6/.test(viewerServed),
  /@version\s+9\.1\.6/.test(viewerServed) ? "vis-network 9.1.6 inlined" : "library marker not found",
);

check(
  "the viewer has the graph payload embedded",
  /RAW_NODES/.test(viewerServed),
  /RAW_NODES/.test(viewerServed) ? "RAW_NODES present" : "no embedded payload",
);

/* Content identity, not just "same size". A length comparison passes on any
 * same-length substitution; the hash does not. */
const sha = (s) => createHash("sha256").update(s, "utf8").digest("hex").slice(0, 16);
const diskShaViewer = sha(viewerOnDisk);
const servedShaViewer = sha(viewerServed);
check(
  "the served viewer is content-identical to the file on disk",
  servedShaViewer === diskShaViewer,
  `served ${servedShaViewer} vs disk ${diskShaViewer}`,
);

const diskBytes = statSync(VIEWER).size;
const servedBytes = Buffer.byteLength(viewerServed, "utf8");
check(
  "the served viewer matches the file on disk byte-for-byte in length",
  servedBytes === diskBytes,
  `served ${servedBytes} B vs disk ${diskBytes} B`,
);

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — graph artifact`);
process.exit(failures === 0 ? 0 : 1);
