#!/usr/bin/env node
/**
 * Guard: production must defer to the platform-supplied PORT.
 *
 * The regression this catches: a `start` script of `next start -p 3000`.
 * Next's `start` command declares `-p/--port` as
 *     .argParser(parseValidPositiveInteger).default(3000).env('PORT')
 * and commander resolves  explicit CLI flag > env var > default.  So a
 * hardcoded `-p 3000` silently outranks the PORT the platform injects and
 * port detection fails — while `PORT` still looks correctly set.  The fix is
 * to pass no port flag at all: `next start` then reads PORT natively and
 * still falls back to 3000 for local development.
 *
 * Note `dev` is deliberately allowed to pin 3000 — only `start` is checked,
 * because only `start` runs in production.
 *
 * Usage:
 *   node scripts/qa/port-binding.mjs
 *
 * The static half always runs. The runtime half starts a real server on a
 * port obtained from the OS; it self-skips if no production build is present.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

let failures = 0;
// A skipped check is not a passed check. The static half always runs, but the
// runtime half is the whole reason this guard exists (the `-p 3000` regression),
// and on a fresh clone with no build it silently did not run — while the guard
// still printed "OK — all checks passed" and exited 0. Proven by forcing the
// nobuild branch: 3 static ✓, 1 SKIP, "OK — all checks passed", exit 0.
// A skip now exits 2 ("could not run"), which is the suite's convention for
// exactly this, so it can never be quoted as evidence.
let skipped = 0;
const pass = (m) => console.log(`  \u2713 ${m}`);
const fail = (m) => {
  failures++;
  console.log(`  \u2717 ${m}`);
};

console.log("\nport-binding guard\n");

// --- 1. the start script must not pin a port -------------------------------
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const start = pkg.scripts?.start ?? "";

if (!start) {
  fail("package.json has no `start` script");
} else if (/(^|\s)(-p|--port)(\s|=)/.test(start)) {
  fail(
    `\`start\` pins a port on the command line: "${start}"\n` +
      "        A CLI flag outranks $PORT, so the platform value is ignored.",
  );
} else {
  pass(`\`start\` passes no port flag ("${start}")`);
}

// --- 2. nothing may hardcode PORT -----------------------------------------
for (const f of [
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
  ".env.example",
]) {
  const p = path.join(root, f);
  if (!existsSync(p)) continue;
  const hit = readFileSync(p, "utf8").match(/^\s*PORT\s*=\s*(\S+)/m);
  if (hit) {
    fail(`${f} sets PORT=${hit[1]} — the platform supplies PORT; setting it breaks detection`);
  } else {
    pass(`${f}: no PORT assignment`);
  }
}

// --- 3. a Blueprint must not declare PORT ---------------------------------
const renderYaml = path.join(root, "render.yaml");
if (existsSync(renderYaml)) {
  if (/^\s*-\s*key:\s*PORT\s*$/m.test(readFileSync(renderYaml, "utf8"))) {
    fail("render.yaml declares PORT in envVars — omit it so the platform value wins");
  } else {
    pass("render.yaml does not declare PORT");
  }
} else {
  pass("no render.yaml (nothing to check)");
}

// --- 4. the server must actually bind the PORT it is handed ---------------
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

if (!existsSync(nextBin)) {
  console.log("  \u2013 SKIP runtime check: next binary not found at node_modules/next/dist/bin/next.");
  skipped += 1;
} else {
  // Ask the OS for a free port, then close it so the server can claim it.
  const probe = createServer();
  const port = await new Promise((res) =>
    probe.listen(0, "127.0.0.1", () => {
      const p = probe.address().port;
      probe.close(() => res(p));
    }),
  );

  if (port === 3000) {
    console.log("  \u2013 SKIP runtime check: could not obtain a port other than 3000.");
    skipped += 1;
  } else {
    // Run the ACTUAL production command from package.json, through a shell,
    // exactly as npm would. Invoking `next start` directly would bypass the
    // script and silently miss the very regression this guard exists for.
    const binDir = path.join(root, "node_modules", ".bin");
    const child = spawn(start, {
      cwd: root,
      shell: true,
      env: {
        ...process.env,
        PORT: String(port),
        NODE_OPTIONS: "",
        PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ""}`,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let log = "";
    child.stdout.on("data", (d) => (log += d));
    child.stderr.on("data", (d) => (log += d));

    // Do not gate on a build-artifact path. Next 16 + Turbopack writes no
    // `.next/BUILD_ID`, so presence checks are version-fragile. Let the
    // server itself report whether a production build exists.
    const outcome = await new Promise((res) => {
      const timer = setTimeout(() => res("timeout"), 60000);
      const tick = setInterval(() => {
        if (/Ready in/.test(log)) {
          clearInterval(tick);
          clearTimeout(timer);
          res("ready");
        } else if (/Could not find a production build|No production build/i.test(log)) {
          clearInterval(tick);
          clearTimeout(timer);
          res("nobuild");
        }
      }, 200);
    });

    if (outcome === "nobuild") {
      console.log("  \u2013 SKIP runtime check: no production build. Run `npm run build` first.");
      skipped += 1;
    } else if (outcome === "timeout") {
      fail(`server did not report ready within 60s when given PORT=${port}`);
      console.log(
        log
          .split("\n")
          .slice(0, 12)
          .map((l) => "        " + l)
          .join("\n"),
      );
    } else {
      if (new RegExp(`:${port}(\\D|$)`).test(log)) {
        pass(`server honoured PORT=${port} rather than defaulting to 3000`);
      } else {
        fail(
          `server did not report PORT=${port}. Its own log said:\n` +
            log
              .split("\n")
              .filter((l) => /Local:|Network:/.test(l))
              .map((l) => "        " + l)
              .join("\n"),
        );
      }

      // Next prints a `Network:` line only when bound beyond loopback. A
      // loopback-only bind passes a local curl and still fails PaaS routing.
      if (/Network:\s+http/.test(log)) {
        pass("bound on a non-loopback address (a `Network:` line is present)");
      } else {
        fail("no `Network:` line — server may be loopback-only, which PaaS routing cannot reach");
      }

      let code = 0;
      let lastErr = "";
      for (let attempt = 0; attempt < 10; attempt++) {
        try {
          code = (await fetch(`http://127.0.0.1:${port}/`)).status;
          break;
        } catch (e) {
          lastErr = e?.cause?.code || e?.message || String(e);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      if (code === 200) pass(`GET / on :${port} -> 200`);
      else fail(`GET / on :${port} -> ${code || `no response (${lastErr})`}`);
    }

    if (process.platform === "win32") {
      spawn("taskkill", ["/PID", String(child.pid), "/F", "/T"], { stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  }
}

if (skipped > 0) {
  console.log(
    `\nINCOMPLETE — ${skipped} check(s) SKIPPED, ${failures} failed.\n` +
      `The runtime half of this guard did not run, so it has NOT been verified.\n` +
      `Run \`npm run build\` and re-run before quoting this as evidence.\n`,
  );
  process.exit(2);
}

console.log(`\n${failures === 0 ? "OK \u2014 all checks passed" : `${failures} check(s) FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
