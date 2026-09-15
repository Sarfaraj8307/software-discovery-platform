/**
 * Helpful-vote pipeline guard — run against a served build.
 *
 *   node scripts/qa/helpful-votes.mjs [baseUrl]
 *
 * Proves the persistent helpful-vote flow end-to-end:
 *   - Click toggles a vote on the server (not just locally in useState).
 *   - The displayed count for the review = baseline + votes.size (PRNG-seeded
 *     helpfulCount is left untouched; user votes live in a separate Set on globalThis).
 *   - Clicking twice returns the count to baseline (toggle, not lock-once).
 *   - The server sets the helpful_voter cookie on the first POST and reuses it on the
 *     second so the SAME browser toggles its own vote (a fresh cookie would treat every
 *     click as a new voter and the count would never go back down).
 *   - A fresh cookie on the SAME review from a different browser increments the count
 *     independently — proving voter identity, not just per-tab state.
 *   - Unknown review id -> 404.
 *   - GET (and other methods) -> 405 (this route is POST-only).
 *
 * The original HelpfulButton was purely client-side useState with a "lock once"
 * comment ("a reviewer cannot inflate a count by clicking repeatedly"), so the guard's
 * first falsification probe was simply to run it against the unchanged server: the
 * page rendered the seeded helpfulCount, the route did not exist (404), and the test
 * failed on the existence check itself. That is the load-bearing assertion.
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

/**
 * Tiny cookie jar. Just needs to survive one tab's session for this guard.
 * Returns the value of a Set-Cookie header's `name=value` pair, if present.
 */
function cookieFromSetCookie(setCookieHeader, name) {
  if (!setCookieHeader) return null;
  const parts = setCookieHeader.split(/,(?=[^ ]+=)/);
  for (const part of parts) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq);
    if (k !== name) continue;
    const v = trimmed.slice(eq + 1).split(";")[0];
    return v;
  }
  return null;
}

/* 1. Discover a review id and the baseline count from a known product page.
 *    We pick /product/zoom because the seed deterministically renders it (matches
 *    the discovery approach used by og-metadata-coverage.mjs). */
const productHtml = await (await fetch(`${base}/product/zoom`)).text();

/** Find a review id by the anchor ReviewCard sets (`id="review-<id>"`). */
function findReviewIds(html) {
  return [...html.matchAll(/id="review-(rev_[a-z0-9_]+)"/g)].map((m) => m[1]);
}
const reviewIds = findReviewIds(productHtml);
check(
  "the product page renders at least one review anchor",
  reviewIds.length > 0,
  reviewIds.length ? `found ${reviewIds.length} ids (first: ${reviewIds[0]})` : "no id=\"review-*\" in HTML",
);
const reviewId = reviewIds[0];
if (!reviewId) {
  console.log(`\nFAIL (${failures}) — helpful votes (no review id discovered)`);
  process.exit(1);
}

/** Extract the rendered "Helpful <n>" text for THIS review's footer.
 *  HelpfulButton renders `<span class="tnum">N</span>` immediately after the word
 *  "Helpful". We scope by walking from the review's anchor down to the next
 *  `</article>` to avoid counting the testimonial or another review's count. */
function extractBaseline(html, rid) {
  const anchorIdx = html.indexOf(`id="review-${rid}"`);
  if (anchorIdx === -1) return null;
  const articleEnd = html.indexOf("</article>", anchorIdx);
  if (articleEnd === -1) return null;
  const slice = html.slice(anchorIdx, articleEnd);
  // The button text is "Helpful <span class="tnum" ...>N</span>". Capture N.
  const m = slice.match(/Helpful[\s\S]{0,80}?tnum[^>]*>(\d+)</);
  return m ? Number.parseInt(m[1], 10) : null;
}

const baseline = extractBaseline(productHtml, reviewId);
check(
  "the rendered baseline count is a number",
  Number.isFinite(baseline),
  baseline !== null ? `baseline ${baseline}` : "could not parse 'Helpful <N>'",
);

/* 2. POST /api/reviews/<id>/helpful with a fresh cookie jar.
 *    Expect 200 + a Set-Cookie header that creates `helpful_voter`, and JSON
 *    { helpfulCount: baseline+1, hasVoted: true }. */
const cookieJar = new Map();
async function postHelpful(rid, jar) {
  const headers = { "Content-Type": "application/json" };
  if (jar.has("helpful_voter")) headers.Cookie = `helpful_voter=${jar.get("helpful_voter")}`;
  const res = await fetch(`${base}/api/reviews/${rid}/helpful`, {
    method: "POST",
    headers,
    body: "",
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const v = cookieFromSetCookie(setCookie, "helpful_voter");
    if (v) jar.set("helpful_voter", v);
  }
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON body */
  }
  return { status: res.status, json };
}

const first = await postHelpful(reviewId, cookieJar);
check(
  "first POST returns 200",
  first.status === 200,
  `status ${first.status}`,
);
check(
  "first POST sets the helpful_voter cookie",
  cookieJar.has("helpful_voter"),
  cookieJar.has("helpful_voter") ? "cookie stored" : "no Set-Cookie header",
);
check(
  "first POST returns hasVoted: true",
  first.json?.hasVoted === true,
  first.json ? JSON.stringify(first.json) : "no JSON body",
);
check(
  "first POST increments the count by exactly 1",
  first.json?.helpfulCount === baseline + 1,
  first.json
    ? `server says ${first.json.helpfulCount}, baseline ${baseline}`
    : "no JSON body",
);

/* 3. POST again with the same cookie — toggle semantics.
 *    Expect helpfulCount back to baseline and hasVoted: false. The lock-once
 *    client behaviour of the old implementation could NOT satisfy this — the
 *    second click was a no-op in useState. */
const second = await postHelpful(reviewId, cookieJar);
check(
  "second POST returns 200",
  second.status === 200,
  `status ${second.status}`,
);
check(
  "second POST toggles hasVoted back to false",
  second.json?.hasVoted === false,
  second.json ? JSON.stringify(second.json) : "no JSON body",
);
check(
  "second POST decrements the count back to baseline",
  second.json?.helpfulCount === baseline,
  second.json
    ? `server says ${second.json.helpfulCount}, baseline ${baseline}`
    : "no JSON body",
);

/* 4. The page now reflects the new state on a re-fetch (server-rendered). */
const productHtml2 = await (await fetch(`${base}/product/zoom`)).text();
const baseline2 = extractBaseline(productHtml2, reviewId);
check(
  "the product page's rendered count returns to baseline after the toggle",
  baseline2 === baseline,
  `page now shows ${baseline2}, baseline was ${baseline}`,
);

/* 5. A FRESH cookie on the SAME review increments independently.
 *    This proves voter identity lives in the cookie, not in some hidden global
 *    counter on the client. */
const freshJar = new Map();
const third = await postHelpful(reviewId, freshJar);
check(
  "fresh-cookie POST on the same review returns 200",
  third.status === 200,
  `status ${third.status}`,
);
check(
  "fresh-cookie POST increments the count again",
  third.json?.helpfulCount === baseline + 1,
  third.json
    ? `server says ${third.json.helpfulCount}, baseline ${baseline}`
    : "no JSON body",
);
/* Clean up so this run does not bleed into the next one. */
await postHelpful(reviewId, freshJar);

/* 6. Unknown review id -> 404, with no JSON helpfulCount to confuse the client. */
const ghost = await fetch(`${base}/api/reviews/rev_does_not_exist/helpful`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "",
});
check("unknown review id returns 404", ghost.status === 404, `status ${ghost.status}`);

/* 7. GET (and other methods) -> 405. This route is POST-only. */
const getRes = await fetch(`${base}/api/reviews/${reviewId}/helpful`, { method: "GET" });
check("GET returns 405", getRes.status === 405, `status ${getRes.status}`);

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — helpful votes pipeline`);
process.exit(failures === 0 ? 0 : 1);