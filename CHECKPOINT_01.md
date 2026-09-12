# Checkpoint 01 — recoverable baseline

**Date:** 2026-09-12 · **Phase:** pre-1 (recommended first task from `AUDIT_PHASE1.md` and `G2_BENCHMARK_AND_GAP.md`)
**Decision A (design direction):** *deferred*. Both the previous "Light enterprise only" and the new "premium futuristic" options remain viable; the first task is orthogonal to it.

---

## What changed

| Change | File(s) |
|---|---|
| Initialised git repository | `.git/` |
| Verified `.gitignore` covers `node_modules/`, `.next/`, `*.log`, `.env*` (with `.env.example` negated), `qa-screenshots/`, `*.tsbuildinfo`, `next-env.d.ts`, `.vercel`, `out/`, `build/` | `.gitignore` (unchanged — verified adequate) |
| Added `.env.example` with placeholders and security comments | `.env.example` (new) |
| This checkpoint record | `CHECKPOINT_01.md` (new) |

No application source was modified. No `package.json` changes. No new dependencies.

## Files added or modified

```
A  .env.example
A  CHECKPOINT_01.md
```

(Tracked source: `app/`, `components/`, `lib/`, `scripts/`, plus `AUDIT_PHASE1.md`, `G2_BENCHMARK_AND_GAP.md`, `WEBSITE_REBUILD_PLAN.md`, `eslint.config.mjs`, `next.config.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, `postcss.config.mjs`, `.workbuddy-ai/`.)

## Database changes

None. Database work is the next task.

## Environment variables required

The application **still runs without** any `.env` — it falls back to its deterministic in-process dataset (`lib/data/seed.ts`). The `.env.example` documents what *will* be needed when Supabase is wired up. No new variables are required for this checkpoint.

## Deploy target decision

**Vercel** is the recommended default for this project — Next.js 16 App Router, no custom server code, no non-Next binaries, no unusual dependencies. Rationale:

- Zero-config Next.js support including the standalone build, RSC, and `next/image` optimisation out of the box.
- Free tier covers the current scale.
- Vercel's environment-variable management keeps `.env.example` as the single source of truth.

Alternative considered and not chosen: **self-hosted Node** (requires writing a Dockerfile + a CI workflow; only justified if the same project needs custom edge logic Supabase Functions can't host). Deferred unless a real requirement appears.

No `vercel.json` is created in this checkpoint — it will land with the first deploy task so it carries real routing rules (e.g. the port-redirect for `127.0.0.1` is dev-only).

## Tests performed

| Check | Result |
|---|---|
| `git status --short` after init | 16 top-level entries, `node_modules` / `.next` / `*.log` / `.env*` / `qa-screenshots/` correctly ignored |
| `git check-ignore` on `node_modules`, `.next`, `.env`, `.env.local`, `qa-screenshots/server4.log` | all ignored (with rules shown) |
| `git check-ignore` on `app/globals.css` (sanity) | not ignored — correctly tracked |
| `git config user.name` / `user.email` (local + global) | set — no commit will fail for missing identity |
| `next build` (re-verified) | still 0 errors, 280 pages |
| `tsc --noEmit` | still 0 errors |
| `eslint .` | still 0 problems |
| Route smoke `scripts/qa/smoke.sh` on `127.0.0.1:3116` | **25/25** PASS |
| Server still healthy | PID 2980, healthy |

The build is genuinely unchanged. This checkpoint is recovery infrastructure, not a feature.

## Remaining issues (carried forward, not introduced)

- `--color-input` `#e4e4e7` is 1.27:1 vs white; WCAG 1.4.11 needs 3:1. Awaiting Decision A.
- Product hero has ~580px dead space at 1440px. Editorial call.
- No git history before this commit (by definition — there was no git).
- `metadataBase` is still the placeholder `software-discovery.example`. Will be replaced when `NEXT_PUBLIC_SITE_URL` is set in `.env.local` and the metadata is refactored to read from it.
- G2 render still blocked by anti-bot. Visual reference set pending.

## Next recommended task

> **Phase 5 — Supabase project + first migration.** Create the Supabase project (or document how to for local dev), then land the first SQL migration containing the **P0 tables only** (from `G2_BENCHMARK_AND_GAP.md` §M): `profiles`, `roles`, `user_roles`, `permissions`, `role_permissions`, `vendors`, `vendor_members`, `categories`, `products`, `product_categories`, `product_plans`, `product_media`, `reviews`, `review_responses`, `comparisons`, `leads`, `audit_logs`, plus the **RLS policies**. The P1 tables (`site_settings`, `content_blocks`, `media`, `featured_companies`, `badges`) and the P2 tables (`favorites`, `notifications`) deliberately stay out.

> **And in parallel**: install the Supabase JS client (`@supabase/supabase-js` + `@supabase/ssr`) and a thin server-side client wrapper. No application code calls it yet — that's the following task.

> **Exit criteria** for that task: `supabase db diff` produces a no-op against a fresh project (schema is reproducible); the SQL is committed to `supabase/migrations/`; the client wrapper exposes `createServerClient()` (cookies-bound) and `createAdminClient()` (service-role, server-only) with no way to import the latter from a `"use client"` module.

> **After that**: Phase 6 auth (Supabase Auth wired through the server client, login/register/reset pages, session middleware); Phase 7 middleware + role checks; then Phase 9 admin.