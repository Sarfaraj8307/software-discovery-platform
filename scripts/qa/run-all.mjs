#!/usr/bin/env node
/**
 * The whole guard suite, run correctly, in one command.
 *
 *   node scripts/qa/run-all.mjs --base http://127.0.0.1:3064
 *   node scripts/qa/run-all.mjs --base ... --only graph-artifact,soft-404
 *   node scripts/qa/run-all.mjs --list
 *
 * WHY THIS EXISTS
 * Every guard exits 0 for pass, 1 for a failed assertion, and 2 for "I could not
 * run" (server not up, slug could not be derived). Running them by hand has two
 * costs, both of which have already produced false conclusions on this project:
 *
 *   1. POST /api/leads and POST /api/reviews are rate-limited to 5 per minute
 *      per IP, keyed on x-forwarded-for -> x-real-ip -> "unknown". The guards
 *      send no such header, so they ALL share one bucket. Run the suite
 *      back-to-back and the later guards get 429 — which reads exactly like a
 *      regression. It has been misreported as one. This runner detects 429 in
 *      the output and retries, so contention stops looking like breakage.
 *
 *   2. Exit code 2 means the guard never ran. Treating that as a failure is
 *      wrong (nothing is broken) and treating it as success is worse (nothing
 *      was checked). It gets its own label here and still fails the run.
 *
 * It also clears NODE_OPTIONS for every child, because the sandbox injects a
 * language shim whose unlink counter saturates over a long session and makes
 * spawned Node children hang with no output.
 *
 * INCLUDED: smoke.sh — 25 route assertions, curl-only, no browser. It was
 * originally left out on the assumption that every .sh guard needed a browser;
 * that was wrong and it had been verifying nothing inside the suite.
 *
 * INCLUDED: contrast-contract and port-binding need no server at all ("self").
 * contrast-contract reads app/globals.css off disk, so it runs first and still
 * contributes when the app is down — the moment every http guard can only
 * report exit 2.
 *
 * NOT INCLUDED: ab, overflow, shot-route, visual-shots. Those four drive a real
 * browser, which survives roughly 8-11 page checks before wedging and needs the
 * split-run technique described in the handover. Run them separately.
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/* ---------------------------------------------------------------- manifest */

/**
 * kind:
 *   "http" — takes the base URL as argv[2]
 *   "env"  — reads BASE from the environment and takes routes as argv[2..]
 *   "self" — needs no base URL at all; starts whatever it needs itself
 *   "sh"   — a POSIX shell guard that reads PORT (not a base URL). Only
 *            smoke.sh qualifies: it is curl-only. The other four .sh guards
 *            drive agent-browser and are excluded — see the note at the top.
 */
const GUARDS = [
  /* No server needed, so it runs first and still contributes when the app is
   * down — which is exactly when the http guards can only report exit 2. */
  { name: "contrast-contract", kind: "self", file: "contrast-contract.mjs" },
  { name: "smoke", kind: "sh", file: "smoke.sh" },
  { name: "trust-audit", kind: "http", file: "trust-audit.mjs" },
  { name: "og-metadata-coverage", kind: "http", file: "og-metadata-coverage.mjs" },
  { name: "soft-404", kind: "http", file: "soft-404.mjs" },
  { name: "admin-metrics-honesty", kind: "http", file: "admin-metrics-honesty.mjs" },
  { name: "graph-artifact", kind: "http", file: "graph-artifact.mjs" },
  { name: "moderation-api", kind: "http", file: "moderation-api.mjs" },
  { name: "vendor-response", kind: "http", file: "vendor-response.mjs" },
  { name: "listing-edit", kind: "http", file: "listing-edit.mjs" },
  { name: "lead-status", kind: "http", file: "lead-status.mjs" },
  { name: "lead-ownership", kind: "http", file: "lead-ownership.mjs" },
  { name: "lead-export", kind: "http", file: "lead-export.mjs" },
  { name: "portal-runtime", kind: "http", file: "portal-runtime.mjs" },
  { name: "review-submission", kind: "http", file: "review-submission.mjs" },
  { name: "helpful-votes", kind: "http", file: "helpful-votes.mjs" },
  {
    name: "first-load",
    kind: "env",
    file: "first-load.mjs",
    routes: ["/", "/about", "/categories", "/methodology", "/graph", "/product/zoom", "/admin"],
  },
  { name: "port-binding", kind: "self", file: "port-binding.mjs", timeoutMs: 180_000 },
];

/* ------------------------------------------------------------------- flags */

const flags = {
  base: process.env.BASE || "http://127.0.0.1:3000",
  only: null,
  skip: null,
  gapMs: 1500,
  retries: 3,
  retryWaitMs: 20_000,
  timeoutMs: 90_000,
  verbose: false,
  list: false,
};

const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 1) {
  const a = argv[i];
  const next = () => argv[++i];
  if (a === "--base") flags.base = next();
  else if (a === "--only") flags.only = next().split(",").map((s) => s.trim());
  else if (a === "--skip") flags.skip = next().split(",").map((s) => s.trim());
  else if (a === "--gap") flags.gapMs = Number(next());
  else if (a === "--retries") flags.retries = Number(next());
  else if (a === "--retry-wait") flags.retryWaitMs = Number(next());
  else if (a === "--timeout") flags.timeoutMs = Number(next());
  else if (a === "--verbose") flags.verbose = true;
  else if (a === "--list") flags.list = true;
  else if (a === "--help" || a === "-h") {
    console.log(
      [
        "usage: node scripts/qa/run-all.mjs [options]",
        "",
        "  --base URL       base URL of a running server (default $BASE or :3000)",
        "  --only a,b       run only these guards",
        "  --skip a,b       run everything except these",
        "  --gap MS         pause between guards (default 1500)",
        "  --retries N      retries when a 429 is detected (default 3)",
        "  --retry-wait MS  pause before a retry (default 20000)",
        "  --timeout MS     per-guard timeout (default 90000)",
        "  --verbose        stream each guard's output as it runs",
        "  --list           print the manifest and exit",
      ].join("\n"),
    );
    process.exit(0);
  } else {
    console.error(`unknown flag: ${a} (try --help)`);
    process.exit(2);
  }
}

if (flags.list) {
  for (const g of GUARDS) console.log(`${g.name.padEnd(24)} ${g.kind.padEnd(5)} ${g.file}`);
  process.exit(0);
}

/* --------------------------------------------------------------- selection */

const selected = GUARDS.filter((g) => {
  if (flags.only && !flags.only.includes(g.name)) return false;
  if (flags.skip && flags.skip.includes(g.name)) return false;
  return true;
});

if (selected.length === 0) {
  console.error("no guards selected — check --only / --skip against --list");
  process.exit(2);
}

/* ------------------------------------------------------------------ runner */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run one guard once. Returns { code, output, timedOut }. */
function runOnce(guard) {
  return new Promise((resolve) => {
    const env = { ...process.env, NODE_OPTIONS: "" };
    let cmd;
    let args;

    if (guard.kind === "sh") {
      // Shell guards read PORT, not a base URL. smoke.sh defaults to 3000, so
      // passing the wrong port would silently test nothing.
      env.PORT = new URL(flags.base).port || "3000";
      cmd = "sh";
      args = [join(HERE, guard.file)];
    } else {
      args = [join(HERE, guard.file)];
      if (guard.kind === "http") args.push(flags.base);
      if (guard.kind === "env") {
        args.push(...guard.routes);
        env.BASE = flags.base;
      }
      cmd = process.execPath;
    }

    const child = spawn(cmd, args, { env, cwd: process.cwd() });

    let output = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, guard.timeoutMs ?? flags.timeoutMs);

    child.stdout.on("data", (d) => {
      output += d;
      if (flags.verbose) process.stdout.write(d);
    });
    child.stderr.on("data", (d) => {
      output += d;
      if (flags.verbose) process.stderr.write(d);
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: -1, output: output + `\nspawn error: ${err.message}`, timedOut: false });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, output, timedOut });
    });
  });
}

/**
 * How many checks did the guard actually run?
 *
 * The guards report in two conventions and neither is universal:
 *   - per-check lines:   "  ok   <name>"   /  "  FAIL <name>"
 *   - a closing tally:   "RESULT: 6 pass, 0 fail"
 * Prefer the guard's own tally when it gives one, fall back to counting `ok`
 * lines. If neither is present the count is genuinely unknown, and reporting
 * it as 0 would imply "ran nothing" when the guard may simply print a
 * per-route line and no total.
 */
function tally(output) {
  const okLines = (output.match(/^\s*ok\b/gm) || []).length;
  const failLines = (output.match(/^\s*FAIL\b/gm) || []).length;

  // Only four guards print a numeric tally, and always in this exact shape:
  //   "RESULT: 6 pass, 0 fail"
  // Anchoring on "RESULT:" is load-bearing. A loose /(\d+)\s+pass/ matches
  // ACROSS newlines, so "…returns 400" followed by a line reading
  // "PASS — vendor replies" captured the HTTP status code 400 as a check count.
  // It did exactly that for vendor-response (400), listing-edit (404),
  // lead-ownership (422) and helpful-votes (405) — four plausible-looking wrong
  // numbers, which is worse than no number.
  const tallyLine = /RESULT:\s*(\d+)\s+pass,\s*(\d+)\s+fail\b/i.exec(output);

  const countable = tallyLine !== null || okLines > 0;
  return {
    checks: tallyLine ? Number(tallyLine[1]) : okLines,
    failures: tallyLine ? Number(tallyLine[2]) : failLines,
    countable,
  };
}

const RATE_LIMITED = /\b429\b|too many requests/i;

/**
 * A guard that exits 0 while telling you it skipped a check has not passed —
 * it has PARTIALLY run, and a partial run must never be quoted as evidence.
 *
 * port-binding.mjs did exactly this: three SKIP branches printed
 * "– SKIP runtime check: ..." and left the exit code at 0, so a fresh clone
 * reported a green port-binding whose runtime half — the entire reason the
 * guard exists — had never executed. That guard now exits 2 on a skip, which
 * lands in the ENV bucket. This detector is the backstop for the next guard
 * that grows a silent skip, because the exit code alone cannot be trusted to
 * report one.
 */
const SKIP_MARKER = /(^|\s)(SKIP|SKIPPED|SKIPPING)\b/i;

const results = [];

for (const guard of selected) {
  const started = Date.now();
  let attempt = 0;
  let last;

  for (;;) {
    attempt += 1;
    last = await runOnce(guard);
    if (last.code === 0) break;

    const rateLimited = RATE_LIMITED.test(last.output);
    const canRetry = rateLimited && attempt <= flags.retries;
    if (!canRetry) break;

    console.log(
      `  ..  ${guard.name} got 429 — waiting ${flags.retryWaitMs / 1000}s ` +
        `(attempt ${attempt} of ${flags.retries})`,
    );
    await sleep(flags.retryWaitMs);
  }

  const durationMs = Date.now() - started;
  const { checks, failures, countable } = tally(last.output);

  let status;
  if (last.timedOut) status = "TIMEOUT";
  else if (last.code === 0) status = "PASS";
  else if (last.code === 2) status = "ENV";
  else status = "FAIL";

  // A guard that exits 0 without reporting a single check has not verified
  // anything, whatever its exit code says. Only flag it when the output carries
  // no evidence of a check at all — a guard that prints per-route results and
  // no total is countable-unknown, not unverified.
  const suspicious =
    status === "PASS" &&
    !countable &&
    !/pass/i.test(last.output) &&
    !/\bok\b/i.test(last.output);

  // Exit 0, but the guard said it skipped something.
  const skippedCheck = status === "PASS" && SKIP_MARKER.test(last.output);

  results.push({
    guard,
    status,
    checks,
    failures,
    countable,
    durationMs,
    attempt,
    output: last.output,
    suspicious,
    skippedCheck,
  });

  const label = skippedCheck ? "SKIPPED" : suspicious ? "PASS?" : status;
  console.log(
    `  ${label.padEnd(8)} ${guard.name.padEnd(24)} ` +
      `checks ${countable ? String(checks).padStart(3) : "n/a"}` +
      `${failures ? ` (+${failures} failed)` : ""}  ` +
      `${(durationMs / 1000).toFixed(1)}s` +
      (attempt > 1 ? `  after ${attempt} attempts` : ""),
  );

  // Show why, immediately, rather than making the operator re-run to find out.
  if (status !== "PASS" && !flags.verbose) {
    const lines = last.output.trimEnd().split("\n");
    for (const line of lines.slice(-6)) console.log(`           | ${line}`);
  }
  if (suspicious) {
    console.log("           | exited 0 but reported no checks — treat as unverified");
  }

  if (guard !== selected[selected.length - 1]) await sleep(flags.gapMs);
}

/* ----------------------------------------------------------------- summary */

/* A guard is only green if it ran and passed. Exit 0 with a skipped check, or
 * exit 0 having reported no checks at all, is neither. Counting those as PASS
 * is how a suite ends up certifying a run that never happened. */
const effective = (r) => (r.skippedCheck ? "SKIPPED" : r.suspicious ? "UNVERIFIED" : r.status);

const counts = results.reduce((acc, r) => {
  const k = effective(r);
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});

const notGreen = results.filter((r) => effective(r) !== "PASS");

console.log("");
console.log(
  `${results.length} guards: ` +
    Object.entries(counts)
      .map(([k, v]) => `${v} ${k}`)
      .join(", ") +
    `   (${(results.reduce((s, r) => s + r.durationMs, 0) / 1000).toFixed(0)}s total)`,
);

if (notGreen.length > 0) {
  console.log("");
  for (const r of notGreen) {
    console.log(`  ${effective(r).padEnd(10)} ${r.guard.name}`);
  }
  if (counts.ENV) {
    console.log(
      "\n  ENV means the guard could not run — usually the server is not up at " +
        `${flags.base}, or a slug could not be derived. It is not an app defect.`,
    );
  }
  if (counts.SKIPPED) {
    console.log(
      "\n  SKIPPED means the guard exited 0 while reporting that it skipped a check. " +
        "The skipped work is unverified — do not quote this run as a full pass.",
    );
  }
  if (counts.UNVERIFIED) {
    console.log(
      "\n  UNVERIFIED means the guard exited 0 without reporting any checks at all.",
    );
  }
  process.exit(1);
}

console.log(`\nPASS — all ${results.length} guards ran and are green`);
process.exit(0);
