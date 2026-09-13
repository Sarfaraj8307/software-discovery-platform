/**
 * W7 trust-signal audit — run against a served build.
 *
 * Guards the invariants that a 2026-09-13 audit found violated:
 *
 *   1. A number labelled "verified" must be a count of verified things. (The category
 *      trust bars used to render `sum(ratingCount) * 12`, i.e. 150,972 "verified reviews"
 *      for a category whose products carry 51 verified reviews between them.)
 *   2. JSON-LD `AggregateRating.reviewCount` must equal the number of reviews actually
 *      published on the page. (It used to carry `ratingCount`: 1,891 declared vs 7 shown.)
 *   3. A page must not render two different numbers under the same "Reviews" label.
 *      (The homepage showed 4.9M and 1,176 at once.)
 *
 *   node scripts/qa/trust-audit.mjs [baseUrl] [sampleSize]
 */
const base = process.argv[2] ?? "http://127.0.0.1:3000";
const sampleSize = Number(process.argv[3] ?? 12);

/** React emits `<!-- -->` between interpolated text nodes — see MEMORY.md. */
const CLAIM_RE = /([\d,]+)<!-- -->\s*verified reviews/;
/** Badges only: the label always follows the icon's closing `</svg>`. Prose hits excluded. */
const BADGE_RE = /<\/svg>(Validated Reviewer|Current User|Incentivized|Guest)<\/span>/g;

async function get(path) {
  const res = await fetch(base + path);
  return { status: res.status, html: await res.text() };
}

const num = (s) => Number(String(s).replace(/,/g, ""));

/** Walk every review page and count the rendered review cards. Out-of-range pages clamp. */
async function countPublishedReviews(slug) {
  let total = 0;
  let seen = new Set();
  for (let page = 1; page <= 50; page += 1) {
    const { html } = await get(`/product/${slug}?reviewPage=${page}`);
    const cards = [...html.matchAll(BADGE_RE)].length;
    const label = html.match(/Page <!-- -->(\d+)<!-- --> of <!-- -->(\d+)/);
    if (!label) {
      total += cards;
      break;
    }
    const [, shown, pages] = label;
    if (seen.has(shown)) break; // clamped to the last page — we are done
    seen.add(shown);
    total += cards;
    if (Number(shown) >= Number(pages)) break;
  }
  return total;
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const slugs = [...new Set([...sitemap.matchAll(/\/product\/([a-z0-9-]+)</g)].map((m) => m[1]))].slice(
  0,
  sampleSize,
);

if (slugs.length === 0) {
  console.error("No product slugs found in sitemap — is the server up?");
  process.exit(1);
}

let failures = 0;
console.log(`${"slug".padEnd(34)} ${"ratings".padStart(8)} ${"jsonLD".padStart(7)} ${"shown".padStart(6)}  result`);

for (const slug of slugs) {
  const { html } = await get(`/product/${slug}`);
  const agg = html.match(/"aggregateRating":\{"@type":"AggregateRating","ratingValue":[\d.]+,"ratingCount":(\d+),"reviewCount":(\d+)/);

  if (!agg) {
    console.log(`${slug.padEnd(34)} ${"".padStart(8)} ${"".padStart(7)} ${"".padStart(6)}  FAIL no AggregateRating`);
    failures += 1;
    continue;
  }

  const ratingCount = num(agg[1]);
  const reviewCount = num(agg[2]);
  const published = await countPublishedReviews(slug);

  const problems = [];
  if (reviewCount !== published) problems.push(`reviewCount ${reviewCount} != ${published} rendered`);
  if (CLAIM_RE.test(html)) problems.push(`still labels a number "verified reviews"`);

  if (problems.length) failures += 1;
  console.log(
    `${slug.padEnd(34)} ${String(ratingCount).padStart(8)} ${String(reviewCount).padStart(7)} ${String(published).padStart(6)}  ${problems.length ? "FAIL " + problems.join("; ") : "ok"}`,
  );
}

/* ---- single-label consistency on the listing surfaces ------------------- */
/**
 * A label must map to exactly one value on a page.
 *
 * The homepage used to render "Reviews 4.9M" in one strip and "Reviews 1,176" in another.
 * Both strips exist in both dt/dd orders, so collect pairs in either direction.
 */
async function distinctReviewNumbers(path, label) {
  const { html } = await get(path);
  const pairs = [];
  for (const m of html.matchAll(/<dt[^>]*>([^<]+)<\/dt><dd[^>]*>([^<]+)<\/dd>/g)) {
    pairs.push([m[1].trim(), m[2].trim()]);
  }
  for (const m of html.matchAll(/<dd[^>]*>([^<]+)<\/dd><dt[^>]*>([^<]+)<\/dt>/g)) {
    pairs.push([m[2].trim(), m[1].trim()]);
  }

  const byLabel = new Map();
  for (const [k, v] of pairs) {
    const key = k.toLowerCase();
    if (!byLabel.has(key)) byLabel.set(key, new Set());
    byLabel.get(key).add(v);
  }

  const conflicts = [...byLabel.entries()].filter(([, vs]) => vs.size > 1);
  const reviewish = [...byLabel.entries()].filter(([k]) => k.includes("review"));

  if (conflicts.length) {
    failures += 1;
    for (const [k, vs] of conflicts) {
      console.log(`\nFAIL ${path}: "${k}" renders conflicting values -> ${[...vs].join(" | ")}`);
    }
  } else {
    const summary =
      reviewish.map(([k, vs]) => `${k}=${[...vs][0]}`).join(", ") || "no review stats on page";
    console.log(`\nok   ${path}: ${label} -> ${summary}`);
  }
}

await distinctReviewNumbers("/", "homepage review stats");
await distinctReviewNumbers("/categories", "category trust bar");

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — trust-signal invariants`);
process.exit(failures === 0 ? 0 : 1);
