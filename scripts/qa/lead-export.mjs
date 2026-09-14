// Lead-export guard (P1.4).
// Verifies GET /api/leads/export returns a real CSV download scoped to the demo vendor:
//   - POST a lead, then confirm its id appears in the exported CSV (end-to-end, not a stub)
//   - content-type is text/csv
//   - a mismatched companySlug is refused with 403 (same cross-vendor contract as B3/B4)
// Run against a served production build: node scripts/qa/lead-export.mjs [baseUrl]

const BASE = process.argv[2] || "http://127.0.0.1:3210";

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

(async () => {
  if (!(await waitReady())) {
    console.log("SERVER_NOT_READY at " + BASE);
    process.exit(2);
  }

  // 1) Create a lead through the real public endpoint.
  const created = await (
    await fetch(BASE + "/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "GET_PRICING",
        name: "Export Test Lead",
        email: "export-test@example.com",
        sourceLocation: "qa#lead-export",
      }),
    })
  ).json();

  if (!created.id) {
    console.log("FAIL  lead POST returned no id: " + JSON.stringify(created));
    process.exit(1);
  }
  console.log("posted lead " + created.id);

  // 2) Export and assert the new lead is in the CSV.
  const res = await fetch(BASE + "/api/leads/export");
  const csv = await res.text();
  const ctype = res.headers.get("content-type") || "";

  let pass = 0;
  let fail = 0;
  const check = (name, ok) => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
    ok ? pass++ : fail++;
  };

  check("export status 200", res.status === 200);
  check("content-type text/csv", ctype.includes("text/csv"));
  check("has header row", csv.split("\r\n")[0].startsWith('"id","type","status"'));
  check("posted lead id present in CSV", csv.includes(created.id));
  check("demo vendor filename", (res.headers.get("content-disposition") || "").includes("leads-salesforce.csv"));

  // 3) Cross-vendor scope is refused.
  const bad = await fetch(BASE + "/api/leads/export?companySlug=not-salesforce");
  check("mismatched companySlug -> 403", bad.status === 403);

  console.log(`\nRESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})();
