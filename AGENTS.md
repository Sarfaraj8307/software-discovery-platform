# AGENTS.md — start here

Entry point for any agent (or human) picking up this repository. Read this page, then the two
canonical files below, and you will know the state of the project without re-deriving anything.

---

## What this is

A B2B software discovery / review marketplace — Next.js 16.3.5 App Router (Turbopack), React 19.3,
TypeScript 5.6, Tailwind v4, Zod 4. It was built from scratch in this repository; it is **not** a
migration, so do not treat any code as legacy.

Two locked decisions shape everything:

- **Light enterprise UI only.** Zinc borders, a single accent `#2563EB`. A dark / neon / glassmorphism
  direction was considered and rejected.
- **All data is synthetic, and it is disclosed as such.** Keep it that way. Do not introduce
  realistic-looking fake customers, logos or testimonials presented as real.

---

## Read these two files, in this order

| # | File | What it is |
|---|---|---|
| 1 | `project-execution-state.json` | **Machine-readable live state.** Current phase, every locked decision, per-phase history with the falsification record for each guard, baselines, known issues, and the environment gotchas. Its own first field says to read it first. This is the single source of truth. |
| 2 | `PRODUCT_HANDOVER_REPORT.html` | **The human-facing report.** Same truth, written to be read: what ships, route inventory, the QA harness, the enhancement roadmap, and the open decisions. Open it in a browser. |

Between them they contain the architecture commitments, the reasoning behind past decisions, and the
list of what is blocked. Do not duplicate them; update them in place.

---

## Other root documents are historical — read them as dated records, not as current state

Everything below predates the completed rebuild and describes work that is already done, or a
website that no longer exists. None of them is authoritative.

| File | Status |
|---|---|
| `WEBSITE_REBUILD_PLAN.md` | **Superseded, and its own header is now false** — it declares "Source of truth: this file", which was true on 2026-09-12 and is not true now. Use `project-execution-state.json` instead. |
| `CHECKPOINT_01.md` | Historical. Records a "recoverable baseline" from before the rebuild, when the design direction was still *deferred*. The direction is now locked (light enterprise). |
| `AUDIT_PHASE1.md` | Historical. Audits the **pre-rebuild** website; contains a premise correction to the original brief. |
| `VISUAL_TRANSFORMATION_PLAN.md` / `VISUAL_TRANSFORMATION_AUDIT.html` | Historical. The enterprise-UI transformation they plan is complete. |
| `FUNCTIONALITY_AND_UI_REPORT.html` | Historical snapshot dated 2026-09-13. |
| `G2_BENCHMARK_AND_GAP.md` | Competitive benchmark (analysis only). Still useful for product direction; not a statement of what is built. |
| `RESPONSIVE_QA_CHECKLIST.md` | **Not superseded** — this one is still live. It is a human task: the agent cannot run a real browser reliably here, so the pixel-level pass at each breakpoint is yours to eyeball. |

---

## The rules that are not in the repository

These live in the agent's local memory directory (`.workbuddy-ai/`), which is deliberately
**gitignored and not published** — it contains notes about the user personally. They are reproduced
here because a fresh clone would otherwise lose them. Each one cost real time to learn.

**Build and verify**

- **Clear `NODE_OPTIONS`** for any build or QA command (`NODE_OPTIONS= node ...`). The sandbox injects
  a language shim whose unlink counter saturates over a long session and makes spawned Node children
  hang with no output. Call local bins (`./node_modules/.bin/eslint`), not `npx`.
- **Never chain `rm` before a build.** A delete guard blocks `rm`, `&&` short-circuits, the build never
  runs, and you read a **stale log** and declare success. This has happened twice.
- **Never `rm` anything under `app/`** — the same guard wipes the directory. Use `mv` + `git add`.
- **A stale `next start` can own port 3000 indefinitely** and shadow your fresh server. When two PIDs
  appear for one port, the wildcard (`0.0.0.0`) owner is usually the stale one, and it may resist
  `taskkill`. The clean escape is to bind your new server to a non-default port (`-p 3050 -H
  127.0.0.1`) rather than fight it. **Confirm the PID that owns a port before trusting a 200.**

**Editing**

- **Parallel `Edit` calls to one file silently drop one.** One file per message, then re-read.
- **Never edit a shell script while it is executing.** Bash reads scripts progressively by byte offset,
  so a mid-run edit produces a spurious syntax error on a valid line.
- **A bare `<tbody>` is not a safe anchor for inserting a row** in the handover HTML — it matches the
  first table, not the one you meant, and leaves the file with unbalanced tags. Anchor on the first
  row's content instead.

**Git**

- **New git refs cannot be created in this sandbox.** `.git/refs/heads/` is not writable, so
  `git checkout -b`, `git branch <name> <start>` and `git update-ref` all fail to create a branch —
  and **all three report success while creating nothing**, so the failure is silent. (`git checkout -b`
  prints "Switched to a new branch" and leaves you on an *unborn* HEAD: the whole tree then shows as
  staged-new, and committing would produce a root commit with no shared history.) Committing and
  pushing on an **existing** branch work normally.
- **To publish work on a new branch without moving the current one:**

  ```bash
  git add <files>
  TREE=$(git write-tree)
  SHA=$(git commit-tree "$TREE" -p <base-commit> -m "message")
  git push origin "$SHA:refs/heads/<new-branch>"
  ```

  This creates the branch on the remote with correct history and leaves your local branch untouched.
  You cannot check the new branch out locally — fetching it needs a new ref too, so read it through
  the GitHub API or work from a fresh clone.

**Running the tests**

- **Run the whole suite with one command — do not run guards by hand:**

  ```bash
  npm run build
  # serve on a free port (see the stale-port note above)
  node scripts/qa/run-all.mjs --base http://127.0.0.1:<port>
  ```

- `POST /api/leads` and `POST /api/reviews` are **rate-limited to 5 per minute per IP**, keyed on
  `x-forwarded-for` → `x-real-ip` → the literal `"unknown"`. The guards send none of those headers, so
  **they all share one bucket**. Firing the suite back-to-back returns `429`, which reads exactly like
  a regression — it has been misreported as one **five times**. `run-all.mjs` detects 429 in a guard's
  output and retries. That is the main reason it exists.
- **The guards use a three-way exit code, and it is not a boolean:** `0` every assertion passed,
  `1` an assertion failed, `2` the guard **could not run** (server down, fixture underivable).
  Treating `2` as a failure is wrong; treating it as success is worse. `run-all.mjs` keeps them apart.
- `node scripts/qa/run-all.mjs --list` shows the 18 guards; `--only` / `--skip` for iteration.

**Standing constraints**

- **Do not add `recharts`.** It is installed and imported nowhere. The `/vendor` charts are
  hand-rolled and dependency-free by choice.
- **Do not build a treemap on `/categories`.** It was built, measured, and rejected: uniform pillar
  counts gave area-encoding nothing to encode. Do not retry it.
- **`og:image` must not be faked.** It is absent everywhere and needs real 1200×630 brand artwork.
  Do not generate placeholder art with `ImageResponse` and call it done.
- **Flag judgement calls, do not silently make them.** If a fix would contradict a decision the user
  already made, or is a matter of taste rather than correctness, write it down and raise it.

---

## How this project expects work to be done

The user's standard, which the whole codebase is built to serve: **never confuse a green checkmark
with a working system.** A build that compiles proves the types line up and nothing else. Almost every
real defect here was invisible to `tsc` and `next build` and surfaced only by curling a route, driving
a headless browser, or reading rendered output.

So the working loop is **act → verify → improve → continue**, with these habits:

1. **One small task at a time**, with a verified gate between steps.
2. **Every claim needs a guard, and every guard must be able to go red.** A guard that has only ever
   been seen green is not evidence. Break the thing on purpose, watch the guard fail, restore it,
   confirm green — and record that falsification in `project-execution-state.json`.
3. **A guard that cannot fail is worse than none.** The three shapes to hunt, all of which have
   occurred here: an error caught and demoted to a warning; a self-skip that leaves the exit code at
   0; and a could-not-run gate placed *before* the code that populates its list.
4. **A label is a claim.** If a surface says "verified", the number must be a count of verified
   items. Derive it or change the noun — then add a guard.
5. **Update the two canonical files in place** after meaningful work. Do not create a third report.

The falsification discipline is written up in more detail as a reusable skill in the agent's local
skill directory, alongside `scripts/qa/falsify-contrast.mjs`, which is a worked example: it mutates a
copy of `app/globals.css` nine ways and asserts the guard's exit code and message for each.

---

## Current status

- **The build is green and the suite is green:** `tsc` 0, `eslint` 0 errors, `next build` 0, and
  **18/18 guards passing** in roughly 30 seconds.
- **Public catalogue, vendor portal and admin shell all ship.** Auth, saved items and the review
  wizard were deliberately deferred.

### Nothing buildable is unblocked — the remaining items are decisions

These are product calls, not implementation gaps. Do not make them unilaterally; the reasoning and the
blast radius of each are in `project-execution-state.json` (`nextAutonomousAction`) and in the
handover report's roadmap.

| Item | Why it needs a decision |
|---|---|
| **Score / methodology contradiction** | Copy says Guest reviews do not count toward the score, but the volume factor derives from a count that includes them. Fixing the maths **regenerates the dataset and invalidates every recorded number** — high blast radius. |
| **Persistence store** | The repository accessors are in-memory (`globalThis`). A real store unblocks saved items, listing claims, and revalidation on write. |
| **Auth layer** | Deferred until persistence exists. |
| **`pendingClaims: 4`** | Still hardcoded, with a source comment flagging it. Derive to 0, hide the card, or relabel it. |
| **`metadataBase`** | A placeholder domain in `app/layout.tsx`. Needs the real one. |
| **`og:image`** | Absent everywhere. Needs real brand artwork. |
| **`/graph` is `noindex` + robots-disallowed** | A visible SEO change awaiting confirmation. |

The nearest unblocked code work is whatever the persistence and score decisions unlock. There is also
one piece of verification tooling left, described at the end of the handover report's harness section:
two orphaned Python scripts in `scripts/qa/` that sit outside the suite.
