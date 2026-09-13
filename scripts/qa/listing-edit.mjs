/**
 * Listing-edit guard — run against a served build.
 *
 *   node scripts/qa/listing-edit.mjs [baseUrl]
 *
 * Two things worth proving here, and the second is the one that matters:
 *   1. A proposal is QUEUED, not applied — the vendor page promises review before go-live,
 *      so an endpoint that writes straight to the listing makes that copy false.
 *   2. A vendor cannot propose edits to another vendor's listing (403).
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

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON body is itself informative */
  }
  return { status: res.status, json };
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const slugs = [...new Set([...sitemap.matchAll(/\/product\/([a-z0-9-]+)</g)].map((m) => m[1]))];
const mine = slugs.find((s) => s.startsWith("salesforce")) ?? slugs[0];
const theirs = slugs.find((s) => !s.startsWith("salesforce")) ?? slugs[1];

/* A unique token per run. The previous version of this guard compared the `<title>` before
 * and after, which could go green for any unrelated difference and could never go red when
 * the write landed in a `dataset` copy no page reads. Grepping the rendered body for a token
 * that only this run could have produced is the only version that can actually fail. */
const token = `QALISTING${Date.now()}`;

const COPY = {
  tagline: `Proposed tagline ${token} from the listing-edit guard`,
  shortDescription:
    "This description was submitted by the automated guard to prove that proposals are queued for moderation rather than written straight to the live listing.",
};

async function publicPage(slug) {
  return (await fetch(`${base}/product/${slug}`)).text();
}


/* 1. Proposal is accepted. */
const proposed = await post(`/api/vendor/listings/${mine}`, COPY);
check("proposal is accepted", proposed.status === 201, `status ${proposed.status}`);
const editId = proposed.json?.id ?? null;
check("proposal is queued as PENDING", proposed.json?.status === "PENDING", proposed.json?.status);

/* 2. THE IMPORTANT ONE: it must not be live yet. */
const during = await publicPage(mine);
check(
  "proposal is NOT applied before moderation",
  !during.includes(token),
  during.includes(token)
    ? "PROPOSAL WENT LIVE WITHOUT MODERATION — the vendor page promises review before go-live"
    : "public listing still shows the original copy",
);

/* 3. Scope. */
const cross = await post(`/api/vendor/listings/${theirs}`, COPY);
check(
  "proposal on another vendor's listing returns 403",
  cross.status === 403,
  `status ${cross.status}${cross.status === 403 ? "" : " — scope check is NOT enforcing"}`,
);

/* 4. Validation: too-short copy. */
const short = await post(`/api/vendor/listings/${mine}`, {
  tagline: "Hi",
  shortDescription: "Too short.",
});
check("too-short copy is rejected with 422", short.status === 422, `status ${short.status}`);

/* 5. Applying the proposal makes it live. */
if (editId) {
  const applied = await post("/api/moderation/listing-edit", { id: editId, decision: "APPLY" });
  check("apply is accepted", applied.status === 200, `status ${applied.status}`);

  const after = await publicPage(mine);
  check(
    "applied proposal reaches the public listing",
    after.includes(token),
    after.includes(token)
      ? "token found on the product page after approval"
      : "approved copy accepted but NOT rendered on the product page",
  );

  /* 6. Deciding twice must not silently re-apply. */
  const twice = await post("/api/moderation/listing-edit", { id: editId, decision: "APPLY" });
  check("re-deciding an applied proposal returns 409", twice.status === 409, `status ${twice.status}`);
} else {
  failures += 1;
  console.log("  FAIL no edit id returned — cannot test apply");
}

/* 7. Unknown proposal id. */
const missing = await post("/api/moderation/listing-edit", {
  id: "edit_nope",
  decision: "APPLY",
});
check("unknown proposal id returns 404", missing.status === 404, `status ${missing.status}`);

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — listing edits`);
process.exit(failures === 0 ? 0 : 1);
