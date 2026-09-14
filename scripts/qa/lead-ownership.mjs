/**
 * Lead ownership guard — run against a served build.
 *
 *   node scripts/qa/lead-ownership.mjs [baseUrl]
 *
 * Exercises the full path a real visitor creates, then assigns the resulting lead to a
 * demo owner via the PATCH route and proves the assignment reaches the admin table and
 * the filter narrows the list. Mirrors scripts/qa/lead-status.mjs in shape so the
 * operators' eye can compare them.
 *
 * Each run uses a unique contact name + sourceLocation so repeat runs cannot collide on
 * the admin table. A previous run's lead carries the same contact name and a null
 * ownerId by the end of its run (the unassign step at the end), so without uniqueness
 * the "absent from UNASSIGNED" assertion would always see the previous run's lead.
 *
 * It creates one enquiry per run. The public endpoint allows 5 per minute per client, so
 * repeat runs may need a pause.
 */
const base = process.argv[2] ?? "http://127.0.0.1:3000";
const RUN_TAG = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const CONTACT_NAME = `QA Owner Check ${RUN_TAG}`;
const SOURCE_LOCATION = `qa#lead-ownership-guard-${RUN_TAG}`;

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
  return { status: res.status, json, text };
}

/* 1. Create a real enquiry through the public endpoint. */
const created = await send("/api/leads", "POST", {
  type: "REQUEST_DEMO",
  name: CONTACT_NAME,
  email: "qa-owner@example.com",
  company: "QA Co",
  message: "Automated end-to-end check of the lead owner pipeline.",
  sourceLocation: SOURCE_LOCATION,
  productSlug: "pipedrive",
});

check("public enquiry is accepted", created.status === 201, `status ${created.status}`);
const leadId = created.json?.id ?? null;
if (!leadId) {
  console.error("No lead id returned — aborting.");
  process.exit(1);
}
console.log(`  ..   created ${leadId}\n`);

/* 2. Assign the lead to a demo owner. */
const assigned = await send(`/api/leads/${leadId}`, "PATCH", { ownerId: "AM" });
check(
  "ownerId PATCH succeeds",
  assigned.status === 200 && assigned.json?.ownerId === "AM",
  `status ${assigned.status}${assigned.json?.ownerId ? `, ownerId now ${assigned.json.ownerId}` : ""}`,
);

/* 3. The admin table renders the assigned owner as the SELECTED option in THIS row.
 *    Every <select> contains all four options (Unassigned + the three demo owners),
 *    so a naive "row contains the owner name" check would pass for any row — that is
 *    a guard that cannot fail and is worse than none. The ground truth is the
 *    `selected=""` attribute on the <option> whose value matches the assigned id.
 *    Walks the row backward to <tr so the assertion is row-precise.
 */
const html = await (await fetch(`${base}/admin/leads`)).text();

function rowForContact(html, contact) {
  const idx = html.indexOf(contact);
  if (idx === -1) return null;
  const trStart = html.lastIndexOf("<tr", idx);
  const trEndIdx = html.indexOf("</tr>", idx);
  if (trStart === -1 || trEndIdx === -1) return null;
  return html.slice(trStart, trEndIdx + "</tr>".length);
}

const row = rowForContact(html, CONTACT_NAME);
// Regex literals do not interpolate; build with `new RegExp` so the unique contact name
// is part of the pattern (otherwise the previous run's QA Owner Check row would match).
const ownerSelectRegex = new RegExp(
  `<select aria-label="Owner for ${CONTACT_NAME.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?<\\/select>`,
);
const ownerSelect = row && row.match(ownerSelectRegex);
const amIsSelected = ownerSelect && /<option value="AM"[^>]*selected/.test(ownerSelect[0]);
check(
  "admin row's owner <select> marks AM as selected",
  Boolean(amIsSelected),
  ownerSelect ? "rendered select for the row; AM is the selected option" : "no owner select found in row",
);

/* 4. The owner filter narrows the list — our lead is in `?owner=AM` and absent from `?owner=UNASSIGNED`.
 *    Both pages must be 200; the assertion is on presence/absence of the unique contact name.
 */
const amFiltered = await (await fetch(`${base}/admin/leads?owner=AM`)).text();
check(
  "/admin/leads?owner=AM includes the assigned lead",
  amFiltered.includes(CONTACT_NAME),
  "filter page rendered, token present",
);

const unassignedFiltered = await (await fetch(`${base}/admin/leads?owner=UNASSIGNED`)).text();
check(
  "/admin/leads?owner=UNASSIGNED excludes the assigned lead",
  !unassignedFiltered.includes(CONTACT_NAME),
  "filter page rendered, token absent",
);

/* 6. Status and owner can move in the same PATCH — a real round-trip for the operator
 *    who triages a lead (assign it AND mark CONTACTED in one click).
 */
const combo = await send(`/api/leads/${leadId}`, "PATCH", { ownerId: "JN", status: "CONTACTED" });
check(
  "status + ownerId PATCH applies both",
  combo.status === 200 && combo.json?.status === "CONTACTED" && combo.json?.ownerId === "JN",
  combo.json?.status && combo.json?.ownerId ? `status=${combo.json.status}, ownerId=${combo.json.ownerId}` : `status ${combo.status}`,
);

/* 7. Unassign is allowed — passing `null` clears the owner.
 *    Resets to AM first so the row again carries "Alex Morgan" for any later inspection.
 */
const unassigned = await send(`/api/leads/${leadId}`, "PATCH", { ownerId: null });
check(
  "ownerId null unassigns the lead",
  unassigned.status === 200 && unassigned.json?.ownerId === null,
  `status ${unassigned.status}${unassigned.json?.ownerId !== undefined ? `, ownerId now ${unassigned.json.ownerId}` : ""}`,
);

/* 8. An invented owner id is rejected with 422. */
const bogusOwner = await send(`/api/leads/${leadId}`, "PATCH", { ownerId: "XX" });
check(
  "invalid ownerId is rejected with 422",
  bogusOwner.status === 422,
  `status ${bogusOwner.status}`,
);

/* 9. An unknown lead id still 404s for owner writes — same contract as status. */
const missingOwner = await send("/api/leads/lead_does_not_exist", "PATCH", { ownerId: "AM" });
check(
  "unknown id returns 404 for owner PATCH",
  missingOwner.status === 404,
  `status ${missingOwner.status}`,
);

/* 10. A PATCH with no writable fields is 422 — a green button that does nothing is
 *    worse than no button.
 */
const noop = await send(`/api/leads/${leadId}`, "PATCH", {});
check(
  "empty PATCH body is rejected with 422",
  noop.status === 422,
  `status ${noop.status}`,
);

/* 11. Strict schema rejects unknown fields. */
const typo = await send(`/api/leads/${leadId}`, "PATCH", { ownrId: "AM" });
check(
  "unknown PATCH field is rejected with 422",
  typo.status === 422,
  `status ${typo.status}`,
);

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`} — lead ownership pipeline`);
process.exit(failures === 0 ? 0 : 1);