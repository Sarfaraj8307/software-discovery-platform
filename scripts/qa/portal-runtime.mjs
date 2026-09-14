// Portal-runtime guard.
// Proves the /admin and /vendor portal pages reflect runtime writes into the
// globalThis singleton (lead store). The build route table already shows them
// as `ƒ Dynamic`, but a green build flag is not the same as a working system:
// if a page were prerendered and frozen at build, the build would still report
// Dynamic yet a POSTed lead would never appear.
//
//   1. POST a lead via /api/leads carrying a unique token in the name.
//   2. Assert the token appears on /admin/leads (admin sees all leads).
//   3. Assert the token appears on /vendor/leads (vendor is scoped, but the
//      same POST shape used by scripts/qa/lead-export.mjs is associated with
//      the demo vendor — verified by that guard).
//
// Run against a served production build: node scripts/qa/portal-runtime.mjs [baseUrl]

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

async function firstProductSlug() {
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  const match = xml.match(/\/product\/([a-z0-9-]+)/i);
  return match ? match[1] : null;
}

(async () => {
  if (!(await waitReady())) {
    console.log("SERVER_NOT_READY at " + BASE);
    process.exit(2);
  }

  // /vendor/leads scopes by lead.productSlug ∈ vendor's products (see app/vendor/leads/page.tsx).
  // An unscoped lead is correctly excluded from /vendor/leads, so to prove the vendor portal
  // reflects runtime writes the POST must carry a real demo-vendor product slug. Derive one
  // from the sitemap so the guard stays self-contained and cannot drift from the catalogue.
  const slug = await firstProductSlug();
  if (!slug) {
    console.log("FAIL  could not derive a product slug from /sitemap.xml");
    process.exit(1);
  }

  const token = "qaportal" + Date.now();
  let pass = 0;
  let fail = 0;
  const check = (name, ok, detail) => {
    const suffix = detail ? " (" + detail + ")" : "";
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}${suffix}`);
    ok ? pass++ : fail++;
  };

  // 1) POST a lead carrying the unique token in its name AND a demo-vendor product slug
  //    so the lead legitimately belongs to the vendor's inbox.
  const postRes = await fetch(BASE + "/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      type: "GET_PRICING",
      name: `Portal Runtime QA ${token}`,
      email: "portal-runtime@example.com",
      sourceLocation: "qa#portal-runtime",
      productSlug: slug,
    }),
  });
  const posted = await postRes.json().catch(() => ({}));
  check(
    "POST /api/leads -> 201",
    postRes.status === 201,
    String(postRes.status),
  );
  check(
    "POST returned lead id",
    typeof posted.id === "string" && posted.id.length > 0,
    posted.id || "",
  );

  // 2) Admin portal sees the new lead.
  const adminRes = await fetch(BASE + "/admin/leads");
  const adminHtml = await adminRes.text();
  check("GET /admin/leads 200", adminRes.status === 200, String(adminRes.status));
  check("token present on /admin/leads", adminHtml.includes(token));

  // 3) Vendor portal sees the new lead (scoped to demo vendor).
  const vendorRes = await fetch(BASE + "/vendor/leads");
  const vendorHtml = await vendorRes.text();
  check("GET /vendor/leads 200", vendorRes.status === 200, String(vendorRes.status));
  check("token present on /vendor/leads", vendorHtml.includes(token));

  console.log(`\nRESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})();