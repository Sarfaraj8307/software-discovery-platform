/**
 * Admin metrics honesty guard — run against a served build.
 *
 *   node scripts/qa/admin-metrics-honesty.mjs [baseUrl]
 *
 * Proves the "Pending listings" KPI in the admin layout header is not a placeholder. It
 * must equal the number of PENDING StatusPills a moderator actually sees in the
 * "Product listings awaiting approval" table on /admin/moderation. Both pages render in
 * the same process and share the globalThis productDecisions map, so a moderation
 * action moves the count on both sides — if the KPI and the table disagree, one of
 * them is lying.
 *
 * The KPI sits in a <dl> in app/admin/layout.tsx:
 *   <dt className="label-caps text-muted-foreground">Pending listings</dt>
 *   <dd className="text-base font-semibold tnum">{metrics.pendingProducts}</dd>
 *
 * The table sits in app/admin/moderation/page.tsx with a unique sr-only caption:
 *   <caption className="sr-only">Product listings awaiting approval</caption>
 *
 * The reviews table also renders PENDING pills (status breakdown: pending / flagged),
 * so scoping to the listings table by its unique caption is required — counting every
 * `>pending<` in /admin/moderation would double-count if the review queue contained
 * PENDING reviews (it does, by design).
 *
 * Regression check: the value used to be the hardcoded literal `7`. The guard also
 * asserts the value is NOT `7`, so a future regression back to the placeholder is
 * caught — the value is whatever the data layer actually has (initially 17, because
 * getPendingProducts(50) synthesises every third row of the 50-row slice as PENDING
 * unless a productDecision overrides it).
 */
const base = process.argv[2] ?? "http://127.0.0.1:3000";

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ok   ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/* 1. The "Pending listings" KPI in the admin header. */
const adminHtml = await (await fetch(`${base}/admin`)).text();

const kpiMatch = adminHtml.match(
  /Pending listings<\/dt>\s*<dd[^>]*tnum[^>]*>(\d+)<\/dd>/,
);
const kpiValue = kpiMatch ? Number.parseInt(kpiMatch[1], 10) : NaN;
check(
  "/admin renders the 'Pending listings' KPI",
  Number.isFinite(kpiValue),
  kpiMatch ? `value ${kpiValue}` : "no <dd> immediately after <dt>Pending listings</dt>",
);

/* 2. The product listings table on /admin/moderation. Scope to the table by its unique
 *    sr-only caption so the review queue's PENDING pills do not contaminate the count.
 */
const moderationHtml = await (await fetch(`${base}/admin/moderation`)).text();

function sliceListingsTable(html) {
  const captionIdx = html.indexOf("Product listings awaiting approval");
  if (captionIdx === -1) return null;
  // The <caption> is inside <table>; walk back to its <table> open tag, then forward to
  // its close. The listings table is the second <table> on the page (reviews table is
  // first), so the nearest <table> before captionIdx is the right one.
  const tableStart = html.lastIndexOf("<table", captionIdx);
  const tableEnd = html.indexOf("</table>", captionIdx);
  if (tableStart === -1 || tableEnd === -1) return null;
  return html.slice(tableStart, tableEnd + "</table>".length);
}

const listingsTable = sliceListingsTable(moderationHtml);
check(
  "/admin/moderation contains the 'Product listings awaiting approval' table",
  Boolean(listingsTable),
  listingsTable ? "table located" : "caption found but no enclosing <table>",
);

/* 3. Count PENDING pills INSIDE that table. Each StatusPill renders
 *    <span class="...">pending</span> (lowercased). We count <span> tags whose text
 *    node is exactly 'pending', so any other pill text (approved / flagged / etc.) is
 *    ignored.
 */
function countPendingPills(tableHtml) {
  if (!tableHtml) return 0;
  // Match a <span ...> whose only text content is "pending" before the next <span or </span>.
  // StatusPill renders <span ...>pending</span> with no other children, so ">pending<"
  // inside a <span>...</span> is the ground truth.
  const re = /<span[^>]*>pending<\/span>/g;
  return (tableHtml.match(re) ?? []).length;
}

const pillCount = countPendingPills(listingsTable);
check(
  "listings table contains at least one PENDING pill",
  pillCount > 0,
  `counted ${pillCount} pill(s)`,
);

/* 4. The KPI and the table agree. */
check(
  "KPI value equals the count of PENDING pills in the listings table",
  Number.isFinite(kpiValue) && kpiValue === pillCount,
  `KPI ${kpiValue} vs pills ${pillCount}`,
);

/* 5. Regression: the old hardcoded placeholder was 7. The derived count starts at 17
 *    (50-row slice, every third row PENDING) and moves with moderation decisions, so
 *    the only forbidden value is the literal that was hardcoded. Asserting only on the
 *    "is not 7" condition keeps the guard stable across legitimate count changes.
 */
check(
  "KPI is no longer the hardcoded placeholder 7",
  Number.isFinite(kpiValue) && kpiValue !== 7,
  kpiValue === 7 ? "regression: KPI == 7 (the placeholder)" : `value ${kpiValue} is derived`,
);

/* 6. The work-queue card on /admin points at the same number. The "Listing approvals"
 *    card renders `<dd ... tnum>${count}</dd>`-equivalent markup under a labelled
 *    span — assert the count appears in the queues section too.
 */
const queueMatch = adminHtml.match(/Listing approvals[\s\S]{0,200}?(\d+)</);
const queueValue = queueMatch ? Number.parseInt(queueMatch[1], 10) : NaN;
check(
  "/admin 'Listing approvals' queue card shows the same count",
  Number.isFinite(queueValue) && queueValue === kpiValue,
  queueMatch ? `queue ${queueValue} vs KPI ${kpiValue}` : "no number after 'Listing approvals'",
);

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — admin metrics honesty`);
process.exit(failures === 0 ? 0 : 1);