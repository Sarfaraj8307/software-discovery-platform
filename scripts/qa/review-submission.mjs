// Review-submission guard (P1.1).
// Proves the public submission pipeline end-to-end:
//   - GET /reviews/new renders (200)
//   - POST /api/reviews with a unique token returns 201 + status PENDING
//   - the token does NOT appear on the public product page (PENDING is hidden)
//   - the token DOES appear on /admin/moderation (it entered the queue)
//   - a malformed POST (no rating) is refused with 422
// Run against a served production build: node scripts/qa/review-submission.mjs [baseUrl] [productSlug]

const BASE = process.argv[2] || "http://127.0.0.1:3210";
const FORCED_SLUG = process.argv[3];

async function waitReady(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(BASE + "/");
      if (r.status === 200) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function firstProductSlug() {
  if (FORCED_SLUG) return FORCED_SLUG;
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  const match = xml.match(/\/product\/([a-z0-9-]+)/i);
  return match ? match[1] : null;
}

(async () => {
  if (!(await waitReady())) {
    console.log("SERVER_NOT_READY at " + BASE);
    process.exit(2);
  }

  const slug = await firstProductSlug();
  if (!slug) {
    console.log("FAIL  could not derive a product slug from /sitemap.xml");
    process.exit(1);
  }
  console.log("using product slug: " + slug);

  const token = "qarev" + Date.now();

  // 1) The submission form renders.
  const formRes = await fetch(`${BASE}/reviews/new?product=${slug}`);
  const formOk = formRes.status === 200;
  console.log(`${formOk ? "PASS" : "FAIL"}  GET /reviews/new renders (${formRes.status})`);

  // 2) Submit a review carrying the unique token.
  const payload = {
    productSlug: slug,
    authorName: "QA Reviewer",
    authorRole: "QA Engineer",
    authorCompanySize: "mid",
    authorIndustry: "Software",
    useDuration: "6 months",
    rating: 5,
    easeRating: 5,
    valueRating: 4,
    supportRating: 5,
    functionalityRating: 4,
    title: `QA review ${token}`,
    body: `This is a QA submission ${token} created by the automated guard to verify the pipeline end to end.`,
    pros: "fast onboarding",
    cons: "pricey at scale",
    verification: "CURRENT_USER",
  };

  const postRes = await fetch(BASE + "/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const posted = await postRes.json().catch(() => ({}));
  const postOk = postRes.status === 201;
  const pendingOk = posted.status === "PENDING";
  const idOk = typeof posted.id === "string" && posted.id.length > 0;
  console.log(`${postOk ? "PASS" : "FAIL"}  POST /api/reviews -> 201 (${postRes.status})`);
  console.log(`${pendingOk ? "PASS" : "FAIL"}  returned status is PENDING (${posted.status})`);
  console.log(`${idOk ? "PASS" : "FAIL"}  returned review id present (${posted.id})`);

  // 3) The token must NOT be on the public product page (PENDING is hidden).
  const productHtml = await (await fetch(`${BASE}/product/${slug}`)).text();
  const hiddenOk = !productHtml.includes(token);
  console.log(`${hiddenOk ? "PASS" : "FAIL"}  token absent from public product page`);

  // 4) The token MUST be on /admin/moderation (it entered the queue).
  const adminHtml = await (await fetch(BASE + "/admin/moderation") ).text();
  const queuedOk = adminHtml.includes(token);
  console.log(`${queuedOk ? "PASS" : "FAIL"}  token present on /admin/moderation (in queue)`);

  // 5) A malformed submission (no rating) is refused with 422.
  const badRes = await fetch(BASE + "/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productSlug: slug, authorName: "X", title: "t", body: "a short body", verification: "GUEST" }),
  });
  const badOk = badRes.status === 422;
  console.log(`${badOk ? "PASS" : "FAIL"}  malformed POST -> 422 (${badRes.status})`);

  const results = [formOk, postOk, pendingOk, idOk, hiddenOk, queuedOk, badOk];
  const pass = results.filter(Boolean).length;
  const fail = results.length - pass;
  console.log(`\nRESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})();
