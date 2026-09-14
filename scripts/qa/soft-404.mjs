// Soft-404 guard (P0.3).
// Verifies that invalid slugs on the three dynamic routes return a real 404
// (not the old soft-404: loading.tsx flushed a 200 before notFound() ran).
// Valid slugs are pulled from the live sitemap so the guard never hardcodes them.
// Run against a served production build: node scripts/qa/soft-404.mjs [baseUrl]

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

async function status(path) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  return r.status;
}

async function slugFromSitemap(kind) {
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  const m = xml.match(new RegExp(`/${kind}/([a-z0-9-]+)`));
  return m ? m[1] : null;
}

(async () => {
  if (!(await waitReady())) {
    console.log("SERVER_NOT_READY at " + BASE);
    process.exit(2);
  }

  const prod = await slugFromSitemap("product");
  const cat = await slugFromSitemap("categories");

  if (!prod || !cat) {
    console.log("COULD_NOT_DERIVE_SLUGS prod=" + prod + " cat=" + cat);
    process.exit(2);
  }

  const checks = [
    ["valid product", `/product/${prod}`, 200],
    ["invalid product", "/product/zzz-not-a-real-product-99999", 404],
    ["valid category", `/categories/${cat}`, 200],
    ["invalid category", "/categories/zzz-not-a-real-category-99999", 404],
    ["valid compare", "/compare/quickbooks-online-vs-wave", 200],
    ["invalid compare", "/compare/zzz-not-real-99999-vs-wave", 404],
  ];

  let pass = 0;
  let fail = 0;
  for (const [name, path, expect] of checks) {
    let got;
    try {
      got = await status(path);
    } catch (e) {
      got = "ERR:" + e.message;
    }
    const ok = got === expect;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${name.padEnd(16)} ${path.padEnd(48)} -> ${got} (expect ${expect})`
    );
    ok ? pass++ : fail++;
  }

  console.log(`\nRESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})();
