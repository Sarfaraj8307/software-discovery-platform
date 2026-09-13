/**
 * Vendor reply guard — run against a served build.
 *
 *   node scripts/qa/vendor-response.mjs [baseUrl]
 *
 * Proves the reply endpoint works AND that its scope check actually bites. The scope test is
 * the important one: an endpoint that accepts a reply for any review id in the catalogue
 * would look fine in the happy-path test while being wide open.
 *
 * The visibility checks deliberately post a unique marker and grep for THAT, rather than
 * asserting on a static string like "Your response" (which also appears in the reply form's
 * own label, so it passed even when the write went somewhere no page ever read).
 */
const base = process.argv[2] ?? "http://127.0.0.1:3000";

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log("  ok   " + name + (detail ? " — " + detail : ""));
  } else {
    failures += 1;
    console.log("  FAIL " + name + (detail ? " — " + detail : ""));
  }
}

async function post(path, body) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status };
}

const VALID =
  "Thank you for the detailed feedback — the reporting gap you describe is on our roadmap for the next release.";

/* Discover a review belonging to the demo vendor (salesforce) and one that does not. */
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const slugs = [...new Set([...sitemap.matchAll(/\/product\/([a-z0-9-]+)</g)].map((m) => m[1]))];
const vendorSlug = slugs.find((s) => s.startsWith("salesforce")) ?? slugs[0];
const otherSlug = slugs.find((s) => !s.startsWith("salesforce")) ?? slugs[1];

/* Target a review that is actually rendered on page one of the product page. Guessing
 * `rev_<slug>_0` is not good enough: the product page shows five of them, newest first, so
 * an arbitrary id may simply be on another page — which would make the visibility check
 * fail for a reason that has nothing to do with the reply. */
const productHtml = await (await fetch(base + "/product/" + vendorSlug)).text();
const visible = [...new Set([...productHtml.matchAll(/id="review-(rev_[^"]+)"/g)].map((m) => m[1]))];
const mine = visible[0] ?? "rev_" + vendorSlug + "_0";
const theirs = "rev_" + otherSlug + "_0";
console.log("  ..   target " + mine + " (" + visible.length + " reviews rendered on " + vendorSlug + ")");

/* 1. Happy path — a real reply on the vendor's own product. */
const ok = await post("/api/reviews/" + mine + "/response", { body: VALID });
check("reply to own product is accepted", ok.status === 201, "status " + ok.status);

/* 2. The reply must actually be visible in the portal, not just accepted. */
const marker = "QA-MARKER-" + Date.now();
await post("/api/reviews/" + mine + "/response", { body: VALID + " " + marker });

const portal = await (await fetch(base + "/vendor/reviews")).text();
check(
  "published reply appears in the vendor portal",
  portal.includes(marker),
  portal.includes(marker)
    ? "marker found in the Responded list"
    : "201 returned but the marker is NOT in the portal HTML",
);

/* 2b. And it must reach the public product page — the reply is buyer-facing copy, so a
 * write that never leaves the portal is still only half a feature. */
const after = await (await fetch(base + "/product/" + vendorSlug)).text();
check(
  "published reply appears on the public product page",
  after.includes(marker),
  after.includes(marker)
    ? "marker found on the product page"
    : "marker NOT on the product page",
);

/* 3. SCOPE: a review on another vendor's product must be refused with 403. */
const cross = await post("/api/reviews/" + theirs + "/response", { body: VALID });
check(
  "reply to another vendor's product returns 403",
  cross.status === 403,
  "status " + cross.status + (cross.status === 403 ? "" : " — scope check is NOT enforcing"),
);

/* 4. Validation: too short. */
const short = await post("/api/reviews/" + mine + "/response", { body: "Thanks!" });
check("a too-short reply is rejected with 422", short.status === 422, "status " + short.status);

/* 5. Validation: unknown id. */
const missing = await post("/api/reviews/rev_nope_0/response", { body: VALID });
check("unknown review id returns 404", missing.status === 404, "status " + missing.status);

/* 6. Malformed JSON. */
const malformed = await fetch(base + "/api/reviews/" + mine + "/response", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{not json",
});
check("malformed body returns 400", malformed.status === 400, "status " + malformed.status);

console.log("\n" + (failures === 0 ? "PASS" : "FAIL (" + failures + ")") + " — vendor replies");
process.exit(failures === 0 ? 0 : 1);
