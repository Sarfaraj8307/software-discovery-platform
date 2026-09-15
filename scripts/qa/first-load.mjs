#!/usr/bin/env node
/**
 * First-load payload for a route, measured from the HTML the server actually
 * serves — not from a build manifest.
 *
 * WHY NOT THE MANIFEST
 * Next 16 with Turbopack does not emit `.next/app-build-manifest.json`, and the
 * build summary no longer prints a Size / First Load JS column. Even when a
 * manifest exists it describes what the build *intends* to send. Parsing the
 * served HTML and fetching every referenced asset measures what the browser
 * really downloads, which is the thing the 1.5 MB budget is about.
 *
 * Usage:
 *   node scripts/qa/first-load.mjs /            # one route
 *   node scripts/qa/first-load.mjs / /graph     # several
 *   BASE=http://127.0.0.1:3000 node scripts/qa/first-load.mjs /
 *   JS_BUDGET_KB=1536 node scripts/qa/first-load.mjs /
 *
 * Node's fetch does not honour HTTP_PROXY, so loopback works here without the
 * proxy workaround the browser tools need.
 */

const BASE = (process.env.BASE || "http://127.0.0.1:3000").replace(/\/$/, "");
const JS_BUDGET_KB = Number(process.env.JS_BUDGET_KB || 1536);

const routes = process.argv.slice(2);
if (routes.length === 0) {
  console.error("usage: node scripts/qa/first-load.mjs <route> [route...]");
  process.exit(2);
}

const KB = 1024;

/** Pull every same-origin /_next/static asset the document references up front. */
function extractAssets(html) {
  const urls = new Set();
  // <script src="...">, <link href="...">, and Next's preload hints.
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith("/_next/static/")) urls.add(url);
  }
  return [...urls];
}

async function sizeOf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const body = await res.arrayBuffer();
  return body.byteLength;
}

let failed = 0;

for (const route of routes) {
  const pageUrl = `${BASE}${route}`;
  let html;
  try {
    const res = await fetch(pageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.log(`${route.padEnd(30)} FAILED to fetch page — ${err.message}`);
    failed++;
    continue;
  }

  const assets = extractAssets(html);
  let js = 0;
  let css = 0;
  const missing = [];

  for (const asset of assets) {
    try {
      const bytes = await sizeOf(`${BASE}${asset}`);
      if (asset.endsWith(".css")) css += bytes;
      else js += bytes;
    } catch {
      missing.push(asset);
    }
  }

  const jsKb = js / KB;
  const cssKb = css / KB;
  const withinBudget = jsKb <= JS_BUDGET_KB;

  // An asset we could not fetch is NOT a zero-byte asset. If any asset is
  // unmeasurable the total is a lower bound, so the budget comparison cannot
  // certify anything — report INCOMPLETE and fail the run.
  //
  // Without this the guard goes green exactly when the page is most broken.
  // Proven: a mock server serving a page whose three /_next/static references
  // all return 404 produced "JS 0.0 KB ... PASS (1536 KB)" and exit 0, with the
  // three failures demoted to a "note". A budget check that passes while
  // measuring nothing is worse than no check, because it is quoted as evidence.
  const complete = missing.length === 0;

  console.log(
    `${route.padEnd(30)} JS ${jsKb.toFixed(1).padStart(8)} KB   ` +
      `CSS ${cssKb.toFixed(1).padStart(7)} KB   ` +
      `assets ${String(assets.length).padStart(3)}   ` +
      `${complete ? (withinBudget ? "PASS" : "OVER BUDGET") : "INCOMPLETE"} (${JS_BUDGET_KB} KB)`,
  );

  if (!complete) {
    console.log(
      `  FAIL: ${missing.length} of ${assets.length} asset(s) could not be fetched — ` +
        `the total above is a lower bound, not a measurement`,
    );
    for (const asset of missing) console.log(`        ${asset}`);
  }

  if (!complete || !withinBudget) failed++;
}

process.exit(failed === 0 ? 0 : 1);
