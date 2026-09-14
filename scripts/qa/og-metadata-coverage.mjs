/**
 * OG/Twitter metadata coverage guard — run against a served build.
 *
 *   node scripts/qa/og-metadata-coverage.mjs [baseUrl]
 *
 * Audit items E2 (OG/Twitter on 17 of 21 routes) and E3 (no root-level fallback) were
 * closed by:
 *   - app/layout.tsx — root openGraph + twitter blocks (siteName, locale, default
 *     title/description, twitter card).
 *   - Seven static routes added per-page openGraph + twitter: /, /about, /privacy,
 *     /terms, /methodology, /categories, /compare.
 *   - Three dynamic routes added only twitter blocks (openGraph already existed):
 *     /product/[slug], /categories/[slug], /compare/[slugs].
 *
 * Noindex routes (/search, /login, /admin/*, /vendor/*, /graph, /reviews/new) are not
 * required to publish OG/Twitter, so they are intentionally excluded.
 *
 * `og:image` is deliberately omitted everywhere — audit E5 deferred the imagery work
 * until there is real brand artwork. Generating one with `ImageResponse` is therefore
 * also deferred.
 *
 * The Next.js metadata layer emits these as `<meta property="og:...">` and
 * `<meta name="twitter:...">` tags in the served HTML. We assert on the `content` attr
 * being non-empty for each required key.
 *
 * Falsifiable by construction: each public route must satisfy all seven keys. A future
 * regression that drops one block on one page lights up the per-route `check()`.
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

/* A meta tag is "<meta property=\"og:title\" content=\"...\">" or
 * "<meta name=\"twitter:card\" content=\"...\">". We only care that the tag is present
 * and the content is non-empty. The actual content values are checked by the next.js
 * metadata layer; this guard is structural. */
function hasMeta(html, kind, key) {
  // `<meta property="og:title" content="..." />` — property is the OG convention.
  // `<meta name="twitter:card" content="..." />` — name is the twitter convention.
  const re =
    kind === "property"
      ? new RegExp(`<meta[^>]+property=["']${key}["'][^>]*content=["']([^"']+)["']`)
      : new RegExp(`<meta[^>]+name=["']${key}["'][^>]*content=["']([^"']+)["']`);
  const match = html.match(re);
  // Also accept the rare attribute-order variant (`content` before `property`/`name`).
  const reAlt =
    kind === "property"
      ? new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*property=["']${key}["']`)
      : new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*name=["']${key}["']`);
  const matchAlt = match ?? html.match(reAlt);
  const content = matchAlt ? matchAlt[1] : null;
  return { present: Boolean(content), content: content ?? "" };
}

/* Discover the first matching href from a page so we can test dynamic routes without
 * hardcoding slugs. The catalogue is deterministic (PRNG-seeded) so any seed-derived
 * slug is fine for the assertion — we are proving metadata shape, not slug semantics.
 *
 * We grab the first href that matches a given path pattern. This avoids depending on
 * the exact ordering of the catalogue from a specific seed. */
function firstHref(html, pathPattern) {
  // href="/categories/some-slug" or href="/product/some-slug" — match the literal path
  // prefix, allow any chars in the slug.
  const re = new RegExp(`href=["']${pathPattern.replace(/\//g, "\\/")}([^"'#]+)["']`);
  const m = html.match(re);
  return m ? m[1] : null;
}

/* The seven required meta keys per page. site_name on og: is inherited from the root
 * layout block, so every page should have it without having to declare it explicitly. */
const REQUIRED_OG = ["og:title", "og:description", "og:site_name", "og:type"];
const REQUIRED_TWITTER = ["twitter:card", "twitter:title", "twitter:description"];

async function assertRoute(path) {
  console.log(`\n${path}`);
  let html;
  try {
    const res = await fetch(`${base}${path}`);
    check(`route returns 200`, res.status === 200, `status ${res.status}`);
    html = await res.text();
  } catch (err) {
    check(`route returns 200`, false, `fetch error: ${err.message}`);
    return;
  }

  for (const key of REQUIRED_OG) {
    const r = hasMeta(html, "property", key);
    check(
      `${path} has meta property="${key}"`,
      r.present && r.content.length > 0,
      r.present ? `content: ${truncate(r.content, 60)}` : "missing",
    );
  }
  for (const key of REQUIRED_TWITTER) {
    const r = hasMeta(html, "name", key);
    check(
      `${path} has meta name="${key}"`,
      r.present && r.content.length > 0,
      r.present ? `content: ${truncate(r.content, 60)}` : "missing",
    );
  }
}

function truncate(s, n) {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

/* Discover dynamic slugs from the live pages. */
async function discover() {
  const home = await (await fetch(`${base}/`)).text();
  const productSlug = firstHref(home, "/product/");
  if (!productSlug) throw new Error("Could not discover a /product/<slug> from the homepage");

  const cats = await (await fetch(`${base}/categories`)).text();
  const categorySlug = firstHref(cats, "/categories/");
  if (!categorySlug) throw new Error("Could not discover a /categories/<slug> from /categories");

  const compareHub = await (await fetch(`${base}/compare`)).text();
  const comparisonSlug = firstHref(compareHub, "/compare/");
  if (!comparisonSlug) throw new Error("Could not discover a /compare/<slugs> from /compare");

  return { productSlug, categorySlug, comparisonSlug };
}

const dynamic = await discover();
console.log(
  `Discovered: /product/${dynamic.productSlug}, /categories/${dynamic.categorySlug}, /compare/${dynamic.comparisonSlug}`,
);

const staticRoutes = [
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/methodology",
  "/categories",
  "/compare",
];
for (const r of staticRoutes) await assertRoute(r);

await assertRoute(`/product/${dynamic.productSlug}`);
await assertRoute(`/categories/${dynamic.categorySlug}`);
await assertRoute(`/compare/${dynamic.comparisonSlug}`);

console.log(
  `\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — OG/Twitter metadata coverage (${staticRoutes.length + 3} routes)`,
);
process.exit(failures === 0 ? 0 : 1);