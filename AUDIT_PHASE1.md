# PHASE 1 — PRODUCTION TRANSFORMATION AUDIT
**Date:** 2026-09-12 · **Scope:** audit only. No code changed, no dependency added.
**Method:** direct inspection of source, plus the running production build (`127.0.0.1:3116`).

---

## 0. PREMISE CORRECTION — read before acting on this audit

The master prompt assumes *"the existing website is LIVE and already contains an existing
product, pages, components, functionality, styling, assets, and business logic."*

Inspection does not support that premise as stated. Verified:

| Claim in prompt | Verified reality |
|---|---|
| A pre-existing live application exists | **No separate legacy codebase exists here.** The app in this workspace was built during the immediately preceding session, to the spec in `_reference/analysis-new` (`analysis-20260902-0621.zip`). |
| The website is live / deployed | **No deployment configuration of any kind** — no `vercel.json`, `netlify.toml`, `Dockerfile`, CI workflow, or `Procfile`. Not deployed anywhere. |
| Existing business logic to preserve | Yes — but it is *newly written* logic, already documented in `WEBSITE_REBUILD_PLAN.md` (tasks 001–052). |

**What this changes, and how:**

- **Good news:** there is no legacy debt and no framework migration to justify. §0's "do not
  replace the stack" is satisfied by default — Next.js 16 is a reasonable, current choice.
- **Good news:** nothing is live, so §32's "must not break the live site" imposes no
  constraint. We have a clean local build to iterate on.
- **Bad news:** **there is no version control.** `git rev-parse` → *"not a git repository."*
  A Supabase migration on an unversioned tree is not recoverable. This is a blocking
  prerequisite, not a formality.
- **Honest framing:** subsequent phases are *greenfield feature work on a fresh codebase*,
  not *transformation of a legacy product*. The work is just as real — it is simply
  building the backend, auth and CMS that were explicitly deferred, not rescuing an
  inherited system.

---

## 1. ARCHITECTURE SUMMARY

A **server-rendered Next.js App Router monolith** with a deliberately isolated persistence
edge. No client-side data fetching for content; filters live in the URL.

```
Browser
  └─ Next.js 16 App Router (RSC by default, "use client" only for interactive islands)
       ├─ app/**/page.tsx        → server components, read repository directly
       ├─ app/api/*/route.ts     → 2 route handlers
       └─ client islands         → search, compare, filters, modals, toasts
Data
  └─ lib/data/seed.ts (1202 lines) → deterministic in-process dataset
       └─ lib/data/repository.ts (709 lines) — THE ONLY data entry point
```

**The single most important architectural fact:** `lib/data/repository.ts` is the sole
module through which any page or route touches data (43 exported accessors). Its own
header comment states the intent: swapping to a real database means reimplementing this
one file with the compiler checking the seam. **This is the correct place for Supabase to
land, and it already exists.** Swapping it is a bounded, low-risk change.

**State management** — three mechanisms, all appropriate:
1. Server state: none (no cache layer, no ORM).
2. URL state: `components/filters/useFilters.ts` writes filter/sort/pagination to the
   querystring via `router.push(..., { scroll: false })` — shareable, crawlable, back-button
   correct. Good.
3. Client-only ephemeral state: comparison bucket via `useSyncExternalStore` over
   localStorage; toast + tooltip providers via context.

---

## 2. TECHNOLOGY STACK

| Layer | Choice | Verified |
|---|---|---|
| Framework | Next.js **16.3.5**, App Router, Turbopack | `package.json` |
| UI runtime | React **19.3.0** | `package.json` |
| Language | TypeScript **5.6**, strict | `tsconfig.json` |
| Styling | Tailwind CSS **v4** (`@theme` tokens in `app/globals.css`) | 321-line token file |
| Components | **Radix UI** (17 primitives) + shadcn-style wrappers in `components/ui/` | 17 deps |
| Icons | `lucide-react` 1.45 (tree-shaken via `optimizePackageImports`) | `next.config.ts` |
| Validation | **Zod 4.6.2** — shared by client form *and* API route | `lib/validation/schemas.ts` |
| Fonts | Inter + JetBrains Mono, self-hosted via `next/font/google` | `app/layout.tsx` |
| Package manager | **npm** (`package-lock.json`, 266 KB) | lockfile |
| Build | `next build` (Turbopack) | `package.json` |
| Database | **None.** Deterministic seeded dataset | `lib/data/seed.ts` |
| ORM | **None.** Spec anticipates Prisma | types.ts comment |
| Auth | **None.** | grep → 0 hits |
| Search | **In-process** scoring/filtering (`lib/search/index.ts`, 215 lines) | code |
| Testing | **No test framework.** One curl smoke script | `scripts/qa/smoke.sh` |

**Stack verdict: keep it.** Nothing here is obsolete or in need of migration. The only
missing layers are the ones the prompt wants added — database, auth, storage.

---

## 3. ROUTE / PAGE INVENTORY

21 routable endpoints — 19 pages + 2 API routes. All verified **200** by smoke test
(`PASS=25 FAIL=0`, including canonical 308 and 404 assertions).

### Public (8)
| Route | Rendering | Notes |
|---|---|---|
| `/` | static | 392 lines; hero, categories, leaderboard, trending, most-compared |
| `/categories` | static | category hub |
| `/categories/[slug]` | dynamic + SSG | 334 lines; facets, editorial, FAQ schema |
| `/product/[slug]` | dynamic + SSG | **819 lines** — the largest module in the app |
| `/compare` | static | picker + saved comparisons |
| `/compare/[slugs]` | SSG (80 paths) | canonical 2–4 product comparison |
| `/search` | static | server-rendered results |
| `/methodology` | static | **publishes the actual score formula** — rare and good |

### Compliance / static (4)
`/about`, `/privacy`, `/terms`, plus `app/not-found.tsx` and `app/error.tsx`.

### Vendor portal (4) — **no auth**
`/vendor`, `/vendor/leads`, `/vendor/products`, `/vendor/reviews`

### Admin portal (4) — **no auth**
`/admin`, `/admin/moderation`, `/admin/leads`, `/admin/seo`

### API (2)
`POST /api/leads`, `GET /api/search`

### Generated
`sitemap.ts` (**489 URLs**), `robots.ts` (disallows `/search`, `/api/`, `/vendor`, `/admin`).

---

## 4. COMPONENT INVENTORY

38 components, ~5,500 LOC.

| Group | Count | Modules |
|---|---|---|
| `ui/` | 11 | avatar, badge, button, card, content, feedback, form-controls, input, navigation, overlay, table |
| `compare/` | 5 | ComparePicker, CompareProvider, CompareSelection, ComparisonBucket, ComparisonTable |
| `layout/` | 6 | Header, Footer, MegaMenu, MobileNav, PortalNav, TrustBar |
| `product/` | 4 | ProductTabs, PricingTable, IntegrationGrid, MediaGallery |
| `reviews/` | 3 | ReviewCard, RatingDistribution, HelpfulButton |
| `filters/` | 3 | FilterRail, ResultToolbar, useFilters |
| `cards/` | 2 | ProductCard, CategoryCard |
| `domain/` | 2 | atoms, icon |
| `forms/` | **1** | **LeadForm — the only form in the application** |
| `search/` | 1 | SearchAutocomplete (439 lines, ARIA combobox) |

**Notable:** `components/forms/` contains exactly one entry. There are no product-edit,
vendor-profile, login or registration forms anywhere in the tree.

---

## 5. CURRENT DATA MODEL

`lib/data/types.ts` (441 lines) defines **20 entities**, explicitly mirroring the spec's
Prisma schema. Quality is high — it is a genuine relational design expressed as interfaces.

**Present:** `Category`, `FeatureGroup`, `Feature`, `Integration`, `Company`, `Product`
(46 fields), `PricingPlan`, `ProductScreenshot`, `Review`, `Comparison`, `ComparisonSection`
/ `Row` / `Value`, `Lead`, `Resource`, plus `VendorMetrics` / `AdminMetrics`.

**Enums already defined and correct for what the prompt wants:**
- `Role = "BUYER" | "VENDOR" | "MODERATOR" | "ADMIN"`
- `ProductStatus = "DRAFT" | "PENDING" | "APPROVED" | "ARCHIVED"` ← *already matches the
  vendor workflow in §9; needs `REJECTED` added for the rejection path*
- `ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED"`
- `LeadStatus`, `VerificationLabel` (incl. `INCENTIVIZED` — FTC-aware), `PricingModel`,
  `DeploymentModel`, `CompanySize`

**Absent, and required by §4:**

| Missing entity | Why it matters |
|---|---|
| `users` / `profiles` / `sessions` | No auth is possible without them |
| `permissions` | `Role` exists as a string; no permission granularity |
| `vendor_members` | §9 needs vendor↔user linking; not modelled |
| `audit_logs` | §7 explicitly requires "who changed what, when" |
| `notifications` | §9/§10 assume submission feedback |
| `favorites` / `saved` | §15 lists favourites as expected |
| `site_settings` / `content_blocks` | §10 requires DB-backed content |
| `media` / `product_media` | §11 media management; only `ProductScreenshot.tone` (a string) exists |
| `SUPER_ADMIN` | Prompt's role model has 4 tiers; the code has no super-admin tier |

Two modelling notes for Phase 4:
- `PricingPlan` and `ProductScreenshot` are **embedded arrays** on `Product`. Normalising
  them into `product_plans` / `product_media` is required for §8/§11 management.
- `Product.ratingAvg` / `ratingCount` / `score` are **denormalised** (deliberately, per the
  comment). Keep the denormalisation, but they must become DB-maintained or trigger-maintained.

---

## 6. BACKEND / API SITUATION

**Two route handlers. That is the entire backend.**

| Route | Method | Behaviour | Quality |
|---|---|---|---|
| `/api/leads` | POST | Zod-validated (same schema as the form), in-memory sliding-window rate limit (5/60 s), returns 201 / 422 / 400 / 429 | **Good** — server-side validation is the real gate; the form is convenience |
| `/api/search` | GET | In-process scoring over the seeded dataset | Works; won't scale. Meilisearch is the documented intent |

**There are ZERO mutating endpoints for products, vendors, users, content or media.**
A grep for `"use server"`, `revalidatePath`, `revalidateTag` and `redirect(` across
`app/`, `components/` and `lib/` returns **nothing**. Neither portal can write.

Rate limiting is in-memory and per-instance — correctly documented as a limitation in the
source, and per §18 it must move to Redis or a DB-backed counter for production.

---

## 7. AUTHENTICATION SITUATION

**There is no authentication of any kind.** Verified by grep for
`next-auth | supabase | prisma | password | jwt | bearer | clerk | auth0 | session | cookie
| csrf | signIn | signUp` across all source: every hit is either a *product listed in the
catalogue* or a code comment. No client, no middleware, no session, no cookies.

Consequences, all currently true:

- `/admin/*` and `/vendor/*` are **publicly reachable**. Anyone with the URL sees the
  moderation queue, the lead table and vendor analytics.
- The vendor portal is hard-pinned to a single demo vendor:
  `export const DEMO_VENDOR_SLUG = "salesforce";` (`lib/portals.ts`), with the comment
  *"When auth lands, `DEMO_VENDOR_SLUG` is replaced by the session's company slug and nothing
  else in the vendor area has to change."*
  → **This is a well-designed seam.** Every vendor page already reads through one slug, so
  real vendor isolation is close to a one-file change *once a session exists*.
- There is no `middleware.ts`, so no route protection exists even in skeleton form.

This is the largest single gap in the project and is the core of §6/§7.

---

## 8. ADMIN / VENDOR CAPABILITIES

Both portals exist, look professional, and are **entirely read-only**.

**Vendor portal** — dashboard, leads inbox, products, reviews. Has metrics, charts, status
badges, empty states. Cannot create or edit anything. Source states plainly:
> *"Status transitions, assignment and vendor hand-off are not implemented in this build."*

**Admin portal** — overview, moderation queue, lead table, SEO status. Cannot approve,
reject, publish or archive. The moderation page states that queue actions require an audit
log as a prerequisite — a correct and honest call, but it means the approval gate does not
exist.

Against §7's suggested admin navigation, the coverage is roughly:

| §7 section | Present? |
|---|---|
| Dashboard | Partial (metrics only, no charts/analytics surface) |
| Products (CRUD, drafts, published, archived, categories, media) | **Absent** |
| Vendors (approval, profiles, status) | **Absent** |
| Users / Roles / Permissions | **Absent** |
| Content (pages, banners, announcements, FAQs) | **Absent** (hard-coded in `lib/data/seed.ts`) |
| Media | **Absent** |
| Analytics | Partial (counters, no trends) |
| Settings | **Absent** |
| Audit logs | **Absent** (explicitly named as a prerequisite by the moderation page) |

---

## 9. UI / UX WEAKNESSES

Measured against the prompt's own §12/§23 criteria. Strengths first, honestly:

**Already strong:** one consistent type system (Inter + mono, 2 families — satisfies
"maximum of a small number"); WCAG AA contrast verified 16/16; skip-link, single `<h1>`,
`<main id="main">`, focus-visible rings, `prefers-reduced-motion` respected; no horizontal
overflow at 1440/1024/768/390; skeleton/empty/error states present on interactive surfaces.

**Weaknesses:**

| # | Weakness | Evidence |
|---|---|---|
| U1 | **Zero imagery anywhere.** No `public/` directory. Logos and avatars are deterministic monogram plates (initials on a tint). `ProductScreenshot` carries only a `tone` string. | `components/ui/avatar.tsx`; no `next/image` usage |
| U2 | **Product hero dead space ~580px at 1440px** — lead rail stretches the grid to ~932px against ~350px of content. | previously measured, flagged, not fixed |
| U3 | `--color-input` `#e4e4e7` is **1.27:1** vs white; WCAG 1.4.11 requires 3:1 for control boundaries | token audit |
| U4 | No loading/skeleton states on **server** navigation (only client islands have them) | — |
| U5 | Vendor + admin tables have no search, sorting, pagination or bulk actions (§8/§24 require them) | page inspection |
| U6 | No toast/confirmation on the read-only portals — no destructive ops exist to confirm | — |

---

## 10. TECHNICAL WEAKNESSES

| # | Weakness | Severity |
|---|---|---|
| T1 | **No version control.** No git repo, no history, no rollback. | **Critical** |
| T2 | **No environment configuration.** No `.env`, no `.env.example`, no env validation. | High |
| T3 | **No deployment configuration** of any kind. | High |
| T4 | **No tests.** No framework; one 25-assertion curl script. §22 mandates functional + security + responsive + regression. | High |
| T5 | In-memory lead store (`globalThis` singleton) — lost on restart; no persistence. | High |
| T6 | In-process search — O(n) scan per request; Meilisearch is the stated intent. | Medium |
| T7 | `app/product/[slug]/page.tsx` is **819 lines** — a maintenance hazard before it gains forms. | Medium |
| T8 | Rate limiter is per-instance (documented). | Medium |
| T9 | No error monitoring / structured logging. | Medium |
| T10 | `metadataBase` is `https://software-discovery.example` — a placeholder. | High (SEO) |

---

## 11. SECURITY WEAKNESSES

| # | Weakness | Severity |
|---|---|---|
| S1 | **No authentication or session management at all.** | **Critical** |
| S2 | **`/admin/*` and `/vendor/*` are publicly reachable** — no middleware, no guard. | **Critical** |
| S3 | **Zero vendor isolation.** Vendor scope is a hardcoded constant. | **Critical** |
| S4 | No authorization layer of any kind (no RLS — no database to have RLS on). | **Critical** |
| S5 | **No security headers.** `next.config.ts` sets no CSP, `X-Frame-Options`, `HSTS`, `X-Content-Type-Options` or `Referrer-Policy`. | High |
| S6 | No CSRF consideration on the mutating endpoint (currently low-risk: JSON-only, no cookie auth — but becomes live the moment cookie sessions are added). | High (once auth lands) |
| S7 | No file-upload validation path exists — must be designed, not retrofitted (§18). | Medium |
| S8 | Rate limiting per-instance, trivially bypassed across instances. | Medium |
| S9 | `poweredByHeader: false` is good; no other hardening present. | — |

**Positive:** Zod validation on the only write path is server-side and shared with the
client, so it cannot drift. Lead responses return only `{ id, status }` — no payload echo.

---

## 12. PERFORMANCE WEAKNESSES

Measured from `.next/`:

| Metric | Value |
|---|---|
| Total client JS | **1.2 MB across 18 chunks** (uncompressed) |
| Largest chunk | **395 KB** |
| CSS | **65 KB** |
| Homepage HTML | **825 KB** uncompressed (includes the inlined RSC flight payload) |
| Category page HTML | 470 KB · Product page 600 KB · Compare page 402 KB (same caveat) |

| # | Weakness | Note |
|---|---|---|
| P1 | 395 KB largest chunk — needs route-level code splitting review | React 19 + Radix baseline |
| P2 | No image optimisation pipeline — **because there are no images**. Introducing imagery without `next/image` + `remotePatterns` will regress LCP sharply. | §11 |
| P3 | Search is O(n) per keystroke (debounced 180 ms) | fine at 230 products, not at 10k |
| P4 | No caching layer / no `revalidate` strategy for the (future) DB reads | §19 |
| P5 | 1.2 MB uncompressed is acceptable *before* admin/vendor/auth bundles are added; budget now | — |
| P6 | **825 KB homepage HTML** — the RSC flight payload duplicates rendered content and is inlined. Gzipped it is far smaller, but the payload grows with every category/product row shipped to the client. | Measured 2026-09-12 |

---

## 13. SEO WEAKNESSES

**Already good:** `sitemap.ts` (489 URLs), `robots.ts`, canonical URLs, per-page titles via
a metadata template, JSON-LD on 4 page types (BreadcrumbList, ItemList, FAQPage,
SoftwareApplication + AggregateRating), `/methodology` publishing the real formula.

| # | Weakness | Evidence |
|---|---|---|
| E1 | **`metadataBase` is a placeholder** (`software-discovery.example`) — poisons canonicals and every OG URL until a real domain is set. | `app/layout.tsx` |
| E2 | **No Open Graph or Twitter card config** on 17 of 21 routes. Only `app/page.tsx`, `product/[slug]`, `categories/[slug]`, `compare/[slugs]` have them. | grep |
| E3 | No root-level `openGraph` / `twitter` block in `layout.tsx` as a fallback. | `app/layout.tsx` |
| E4 | `/vendor` + `/admin` are correctly disallowed in robots — but they should additionally be `noindex` once they exist, rather than relying on robots alone. | `robots.ts` |
| E5 | No `og:image` possible — no imagery exists (see U1). | — |

---

## 14. MARKET / PRODUCT GAP ANALYSIS

### Market context (researched, 2026)

Two structural shifts define the competitive landscape **right now**:

1. **Consolidation destroyed the "second opinion".** G2 acquired Capterra, Software Advice
   and GetApp from Gartner (announced 2026-01-29, closed February, ~$110M). Four of the
   largest review properties now share one owner — roughly 6M reviews, 200M+ annual buyers,
   10,000+ vendors, 2,000+ categories. *"Independence is a property of ownership, not of the
   number of domain names in your browser tabs."* Cross-checking G2 vs Capterra now checks
   one company against itself.
2. **The FTC Consumer Review Rule (16 CFR Part 465)** took effect 2024-10-21; **enforcement
   began 2025-12-22** with warning letters to ten companies. Penalties up to
   **$53,088 per violation**. It bans sentiment-contingent incentives, undisclosed insider
   reviews, and review suppression. *(The existing build already carries FTC Part 255
   disclosure discipline and an `INCENTIVIZED` label — well-positioned, but Part 465 is the
   operative rule and should be named.)*

Buyer behaviour (G2 2026 Buyer Behavior Report, n>1,000):
- **80%** of buyers use AI search to shortcut discovery.
- **Evaluation is now the longest stage** — 40%, up from 36%. Discovery is solved; proof is
  the bottleneck.
- **IT security review is the single biggest post-selection delay (39%; 50% enterprise)**,
  ahead of budget approval (32%) and implementation planning (25%).
- Nearly half of buyers have had an approved purchase **vetoed by the CFO**.
- **87% are more likely to buy from a vendor offering transparent AI** over a cheaper
  black-box competitor.

### Positioning

The product's stated claim — *"Independent rankings — vendors cannot pay for placement"* —
is **precisely the differentiator the 2026 market has vacated**. That is a genuine
opportunity, not a tagline. It should be made load-bearing (verifiable, evidenced), because
every incumbent now has a conflict of interest they cannot design away.

### CURRENT STATE → MARKET EXPECTATION → GAP → PRIORITY → RECOMMENDATION

| # | Current state | Market expectation | Gap | P | Recommendation |
|---|---|---|---|---|---|
| G1 | No auth; `/admin` and `/vendor` public | Role-based access, protected routes | Anyone can read the moderation queue and lead table | **P0** | Auth + middleware + server-side role checks before anything else |
| G2 | Vendor pinned to `DEMO_VENDOR_SLUG` | Vendor sees only own data | No isolation | **P0** | Resolve vendor from session; enforce in RLS *and* server |
| G3 | No database | Real persistence | Nothing persists; leads vanish on restart | **P0** | Supabase Postgres; repository swap |
| G4 | No product CRUD; portals read-only | Vendor creates/submits; admin approves/publishes/archives | No workflow at all | **P0** | Product CRUD + `DRAFT→SUBMITTED→REVIEW→APPROVED/REJECTED→PUBLISHED` |
| G5 | No media; no `public/`; monogram logos | Real logos, screenshots, OG images | No imagery whatsoever | **P0** | Supabase Storage + `next/image`; seeded from vendor domains |
| G6 | No users/profiles/roles/permissions tables | 4-tier role model | No identity model | **P0** | Schema: users, profiles, roles, vendor_members, permissions |
| G7 | No audit log | "Who changed what, when" | Absent; moderation page already calls it a prerequisite | **P0** | `audit_logs` + write on every mutation |
| G8 | No git, no `.env`, no deploy config | Versioned, configurable, deployable | Unrecoverable migrations | **P0** | git + `.env.example` + deploy target **before** schema work |
| G9 | No security headers | CSP/HSTS/frame-options | None set | **P1** | Add via `next.config.ts` headers |
| G10 | No tests | Functional + security + regression suites | One curl script | **P1** | Add a test runner; encode §22 cases |
| G11 | Content hard-coded in `seed.ts` | Admin edits homepage/banners/FAQs | Requires code change | **P1** | `site_settings` + `content_blocks`, selectively |
| G12 | OG/cards on 4 of 21 routes; placeholder `metadataBase` | Full social metadata | 17 routes have none; canonicals wrong | **P1** | Root OG fallback + real `metadataBase` |
| G13 | No security/trust surface; security review is the #1 buyer delay | Trust centre: how reviews are verified, data handling | Missing a whole conversion surface | **P1** | Verification + security page; directly targets the 39% delay |
| G14 | Methodology published (strength) | Transparency is ammunition for the internal sale | Already ahead — under-marketed | **P1** | Surface it as a trust signal, not a footer link |
| G15 | No favourites / saved comparisons | Save & resume shortlists | Absent | **P2** | `favorites` table |
| G16 | No notifications | Submission/approval feedback | Absent | **P2** | `notifications` + email |
| G17 | Search in-process | Typo-tolerant, faceted, fast | Won't scale | **P2** | Meilisearch when catalogue grows |
| G18 | `aiSummary` disclosed as synthetic | 87% prefer transparent AI | Disclosure exists but is buried mid-page | **P2** | Keep disclosure; give AI treatment a visible, linked explanation |
| G19 | Sparse animations (reduced-motion respected) | Subtle motion, skeletons, transitions | Under-designed | **P2** | Add restrained motion; never at the cost of a11y |
| G20 | Product page 819 lines | Maintainable modules | Refactor hazard before forms are added | **P2** | Split when CRUD lands |
| G21 | No i18n, no realtime, no blog surfacing | Varies | Out of scope | **P3** | Defer |

**What NOT to build** (per §26): no AI win-loss interviewing, no microservices, no
real-time collaboration, no recommendation engine, no bespoke analytics warehouse. The
differentiation is *independence and verifiable evidence*, not feature parity with a
consolidated incumbent.

---

## 15. PRIORITISED ROADMAP

### P0 — blocking; the product cannot be called production-ready without these
1. **Baseline safety**: git init, `.gitignore` verification, `.env.example`, deployment target. *(§31, §32 — must precede a DB migration)*
2. **Supabase project + schema + reproducible migrations** (users, profiles, roles, permissions, vendor_members, vendors, products, product_plans, product_media, categories, reviews, leads, comparisons, audit_logs, site_settings, content_blocks, media)
3. **Row Level Security** for PUBLIC / USER / VENDOR / ADMIN / SUPER_ADMIN
4. **Authentication**: login, logout, registration, password reset, session persistence, expired-session handling
5. **Authorization**: middleware + **server-side role checks** (never frontend-only)
6. **Vendor isolation**: session-derived vendor slug replacing `DEMO_VENDOR_SLUG`; verified by attempting cross-vendor access
7. **Product CRUD + publishing workflow** incl. `REJECTED` state and resubmission
8. **Media management**: Supabase Storage, upload/replace/delete/order, `next/image`, validated file types
9. **Audit logging** on every mutation

### P1 — high
10. Security headers (CSP, HSTS, frame-options, referrer-policy)
11. Test framework + §22 functional and security suites
12. Admin: users/roles/permissions, vendor approval, content management, settings
13. Vendor: product creation, submission status, approval feedback
14. Real imagery: logos, screenshots, OG images, alt text
15. SEO: root OG/Twitter fallback, real `metadataBase`, `noindex` on portals
16. Trust/security surface (targets the 39% security-review delay)

### P2 — medium
17. Favourites / saved comparisons · 18. Notifications + email · 19. Search upgrade
(Meilisearch) · 20. Restrained motion · 21. AI-transparency surface · 22. Split the 819-line
product page · 23. Redis-backed rate limiting

### P3 — deferred
24. i18n · 25. Realtime · 26. Blog/resource publishing · 27. Advanced analytics

---

## RECOMMENDED FIRST IMPLEMENTATION TASK

> **Establish a recoverable baseline: initialise git, verify `.gitignore`, add
> `.env.example` (placeholders only), and commit the known-good build.**
> *Do not modify application code. Do not create the Supabase schema yet.*

**Why this and not the schema.** Phase 4 asks for a database schema, and it is tempting to
start there. But §32 requires migrations to be safe and validated, and §30 requires
checkpoints — both are impossible without version control. Right now a bad migration has no
rollback: no git history, no deployment target, no environment configuration. Fifteen
minutes here makes every subsequent phase reversible.

This is also the smallest possible first task, in the spirit of §29 — it produces no
behaviour change, so it cannot regress the 25/25 build that is currently green.

**Exit criteria:** `git log` shows a baseline commit containing the verified build;
`.gitignore` confirmed to exclude `node_modules/`, `.next/`, `*.log`, `.env*`,
`qa-screenshots/`; `.env.example` documents `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (server-only) and `NEXT_PUBLIC_SITE_URL` with placeholders only;
`npm run build && sh scripts/qa/smoke.sh` still passes 25/25.

**Then, on your go-ahead:** Phase 2 (full market/gap analysis document) and Phase 3 (target
architecture), followed by Phase 4 (schema design).

---

## AUDIT BASELINE — VERIFIED RUNNING STATE

| Check | Result |
|---|---|
| `next build` | 0 errors, 280 pages |
| `tsc --noEmit` | 0 errors |
| `eslint .` | 0 problems |
| Route smoke | **25/25** (incl. 308 canonical, 404) |
| Contrast | 16/16 AA |
| Horizontal overflow | none at 1440/1024/768/390 |
| Server | `127.0.0.1:3116`, PID 2980, healthy |
| Known open (pre-existing) | `--color-input` 1.27:1 vs WCAG 1.4.11; product-hero dead space |

**Awaiting your next instruction. No code was changed during this audit.**
