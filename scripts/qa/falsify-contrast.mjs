/**
 * Falsification driver for scripts/qa/contrast-contract.mjs.
 *
 *   node scripts/qa/falsify-contrast.mjs
 *
 * A guard that has only ever been seen green is not evidence. This runs the
 * guard against mutated copies of app/globals.css and asserts it goes red on
 * each independent branch — and stays green on an unmutated control.
 *
 * The real stylesheet is never touched: every mutation is applied to a copy in
 * the OS temp directory and passed as the guard's optional path argument.
 *
 * This is NOT a guard, and is deliberately absent from run-all.mjs's manifest:
 * it tests the guard rather than the app, so it does not belong in the normal
 * suite. Exit 0 means every case behaved as predicted; exit 1 means one did not.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(ROOT, "app", "globals.css");
const GUARD = join(ROOT, "scripts", "qa", "contrast-contract.mjs");
const TMP = join(tmpdir(), "contrast-contract-falsify");
mkdirSync(TMP, { recursive: true });

const original = readFileSync(SRC, "utf8");

const CASES = [
  {
    name: "control — the shipped file is green",
    mutate: (css) => css,
    exit: 0,
    expect: "0 fail",
  },
  {
    name: "a text token drops below 4.5:1 (contract branch)",
    // muted-foreground is the lightest grey allowed to carry text; #a1a1aa is
    // the zinc-400 value the file's own comment says was removed for failing.
    mutate: (css) => css.replace("--color-muted-foreground: #6f6f78;", "--color-muted-foreground: #a1a1aa;"),
    exit: 1,
    expect: "below threshold",
  },
  {
    name: "the same edit also makes the comment a false claim (documented-number branch)",
    mutate: (css) => css.replace("--color-muted-foreground: #6f6f78;", "--color-muted-foreground: #a1a1aa;"),
    exit: 1,
    expect: "documented 4.53",
  },
  {
    name: "a viz solid drops below 3:1 (graphical branch)",
    mutate: (css) => css.replace("--color-viz-5: #d97706;", "--color-viz-5: #f59e0b;"),
    exit: 1,
    expect: "viz solids (graphical) meet 3:1",
  },
  {
    name: "the viz table number goes stale (table branch)",
    mutate: (css) => css.replace("--color-viz-5: #d97706;", "--color-viz-5: #f59e0b;"),
    exit: 1,
    expect: "viz-5 on white",
  },
  {
    name: "a new colour token appears unchecked (coverage branch)",
    mutate: (css) => css.replace(
      "  --color-faint: #6f6f78;",
      "  --color-brand-new: #eeeeee;\n  --color-faint: #6f6f78;",
    ),
    exit: 1,
    expect: "neither checked nor exempt",
  },
  {
    name: "a new unverifiable ratio claim appears",
    mutate: (css) => css.replace(
      "  --color-faint: #6f6f78;",
      "  /* roughly 9:1 against everything */\n  --color-faint: #6f6f78;",
    ),
    exit: 1,
    expect: "unverifiable claim",
  },
  {
    name: "the documented inverse-band failure is 'fixed' (warning goes stale)",
    // Lighten primary until it passes on the dark band; the file's warning that
    // it fails would then be untrue, and the guard must say so.
    mutate: (css) => css.replace("--color-primary: #2563eb;", "--color-primary: #93c5fd;"),
    exit: 1,
    expect: "documented failure is real",
  },
  {
    name: "a token the contract references is deleted (could-not-run branch)",
    mutate: (css) => css.replace(/^\s*--color-faint: #6f6f78;.*$/m, ""),
    exit: 2,
    expect: "not declared",
  },
];

let bad = 0;
for (const c of CASES) {
  const file = join(TMP, "globals.mutated.css");
  writeFileSync(file, c.mutate(original), "utf8");
  const run = spawnSync(process.execPath, [GUARD, file], { encoding: "utf8" });
  const out = `${run.stdout}${run.stderr}`;
  const exitOk = run.status === c.exit;
  const textOk = out.includes(c.expect);
  const ok = exitOk && textOk;
  if (!ok) bad += 1;
  console.log(
    `${ok ? "  ok  " : "FAIL"}  ${c.name}\n` +
      `        expected exit ${c.exit} + "${c.expect}" — got exit ${run.status}` +
      `${textOk ? "" : `, "${c.expect}" NOT in output`}`,
  );
}

console.log(`\n${CASES.length - bad}/${CASES.length} falsification cases behaved as predicted`);
process.exit(bad === 0 ? 0 : 1);
