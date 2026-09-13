/**
 * Lead status guard — run against a served build.
 *
 *   node scripts/qa/lead-status.mjs [baseUrl]
 *
 * Exercises the full path a real visitor creates: submit the public enquiry form, then move
 * the resulting lead through the NEW -> CONTACTED -> QUALIFIED pipeline from the admin
 * table. Proves the status write works end to end rather than assuming the select posts.
 *
 * It creates one enquiry per run. The public endpoint allows 5 per minute per client, so
 * repeat runs may need a pause.
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

async function send(path, method, body) {
  const res = await fetch(`${base}${path}`, {
    method,
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

/* 1. Create a real enquiry through the public endpoint. */
const created = await send("/api/leads", "POST", {
  type: "REQUEST_DEMO",
  name: "QA Pipeline Check",
  email: "qa-pipeline@example.com",
  company: "QA Co",
  message: "Automated end-to-end check of the lead status pipeline.",
  sourceLocation: "qa#lead-status-guard",
  productSlug: "pipedrive",
});

check("public enquiry is accepted", created.status === 201, `status ${created.status}`);
const leadId = created.json?.id ?? null;
if (!leadId) {
  console.error("No lead id returned — aborting.");
  process.exit(1);
}
console.log(`  ..   created ${leadId}\n`);

/* 2. A real status transition. */
const contacted = await send(`/api/leads/${leadId}`, "PATCH", { status: "CONTACTED" });
check(
  "status moves NEW -> CONTACTED",
  contacted.status === 200 && contacted.json?.status === "CONTACTED",
  `status ${contacted.status}${contacted.json?.status ? `, now ${contacted.json.status}` : ""}`,
);

/* 3. A second transition, so it is not a one-shot. */
const qualified = await send(`/api/leads/${leadId}`, "PATCH", { status: "QUALIFIED" });
check(
  "status moves CONTACTED -> QUALIFIED",
  qualified.status === 200 && qualified.json?.status === "QUALIFIED",
  qualified.json?.status ?? `status ${qualified.status}`,
);

/* 4. Validation rejects an invented status. */
const bogus = await send(`/api/leads/${leadId}`, "PATCH", { status: "DELETED" });
check("invalid status is rejected with 422", bogus.status === 422, `status ${bogus.status}`);

/* 5. Unknown ids 404 rather than silently succeeding. */
const missing = await send("/api/leads/lead_does_not_exist", "PATCH", { status: "CLOSED" });
check("unknown id returns 404", missing.status === 404, `status ${missing.status}`);

/* 6. Malformed JSON 400s rather than 500ing. */
const malformed = await fetch(`${base}/api/leads/${leadId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: "{not json",
});
check("malformed body returns 400", malformed.status === 400, `status ${malformed.status}`);

/* 7. The control actually renders in the admin table. */
const html = await (await fetch(`${base}/admin/leads`)).text();
check(
  "admin table renders a status control per row",
  /aria-label="Status for QA Pipeline Check"/.test(html),
  "select found for the created enquiry",
);

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — lead status pipeline`);
process.exit(failures === 0 ? 0 : 1);
