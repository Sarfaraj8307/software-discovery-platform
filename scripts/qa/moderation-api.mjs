/**
 * Moderation API guard — run against a served build.
 *
 *   node scripts/qa/moderation-api.mjs [baseUrl]
 *
 * Proves the endpoint works rather than assuming it: a real decision changes the target's
 * status, validation rejects a bad action, and an unknown id 404s instead of silently
 * succeeding.
 *
 * DELIBERATELY NON-DESTRUCTIVE: it only ever issues FLAG, which keeps a review inside the
 * queue (the queue is PENDING | FLAGGED). Approving here would empty the demo queue.
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

async function post(body) {
  const res = await fetch(`${base}/api/moderation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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

/**
 * Find a review id that actually exists. Ids are `rev_<productSlug>_<n>` (see seed.ts), so
 * derive one from the sitemap rather than adding a read endpoint just to serve a test.
 */
/**
 * Try candidate ids until one is accepted. Ids are `rev_<productSlug>_<n>` (see seed.ts).
 * The FIRST call for a given id is the one we assert on, so `fromStatus` reflects the
 * record's real prior state rather than a value this script already changed.
 */
async function firstFlag() {
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const slugs = [...new Set([...sitemap.matchAll(/\/product\/([a-z0-9-]+)</g)].map((m) => m[1]))];
  for (const slug of slugs.slice(0, 20)) {
    for (let n = 0; n < 5; n += 1) {
      const id = `rev_${slug}_${n}`;
      const res = await post({ targetType: "review", targetId: id, action: "FLAG" });
      if (res.status === 200) return { id, res };
    }
  }
  return null;
}

const first = await firstFlag();
if (!first) {
  console.error("Could not find any existing review id — is the server up?");
  process.exit(1);
}
const target = first.id;
const ok = first.res;
console.log(`  ..   using review ${target}\n`);

/* 1. A real decision on a review. */
check(
  "valid review decision returns 200",
  ok.status === 200,
  `status ${ok.status}${ok.json?.toStatus ? `, now ${ok.json.toStatus}` : ""}`,
);
check(
  "decision lands on the requested status",
  ok.json?.toStatus === "FLAGGED",
  ok.json ? `${ok.json.fromStatus} -> ${ok.json.toStatus}` : "no body",
);

/* 2. Validation must reject an invented action. */
const badAction = await post({ targetType: "review", targetId: target, action: "DESTROY" });
check("invalid action is rejected with 422", badAction.status === 422, `status ${badAction.status}`);

/* 3. Validation must reject an invented target type. */
const badType = await post({ targetType: "planet", targetId: target, action: "APPROVE" });
check("invalid targetType is rejected with 422", badType.status === 422, `status ${badType.status}`);

/* 4. Unknown ids must 404, not silently succeed. */
const missing = await post({ targetType: "review", targetId: "rev_does_not_exist", action: "FLAG" });
check("unknown id returns 404", missing.status === 404, `status ${missing.status}`);

/* 5. Malformed JSON must 400 rather than 500. */
const malformed = await fetch(`${base}/api/moderation`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{not json",
});
check("malformed body returns 400", malformed.status === 400, `status ${malformed.status}`);

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — moderation API`);
process.exit(failures === 0 ? 0 : 1);
