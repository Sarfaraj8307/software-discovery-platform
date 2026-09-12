# BENCHMARK & GAP ANALYSIS — G2 vs OUR PLATFORM
**Date:** 2026-09-12 · **Scope:** analysis only (Phases 1–3 of the brief). No code changes.
**Refers to:** `AUDIT_PHASE1.md` for the existing-website audit (do not duplicate; this report picks up from there).

---

## ⚠️ TWO DECISIONS REQUIRED BEFORE THIS REPORT BECOMES A ROADMAP

### Decision A — the design direction has changed in the brief

In the prior session you confirmed **"Light enterprise only"**: light-first, zinc-200 borders, single blue accent `#2563EB`, no glassmorphism, no neon, no glow. The current build was specified against that.

The new brief (§33 *Design Direction*) asks for **"premium, modern, futuristic, intelligent, clean, trustworthy, colorful but professional, visually rich, interactive, high-end SaaS"**, with §9 calling for *"sophisticated dark/light theme, colorful gradients, soft 3D background, floating abstract shapes, subtle glassmorphism, layered depth, gradient glows, subtle animated mesh, futuristic abstract graphical elements."*

These are not the same direction. The prior decision was explicit and recent (same project, same build). I am not silently picking one. Options:

1. **Stay with "Light enterprise only"** — what the codebase was built to.
2. **Adopt the new "premium futuristic" direction** — would mean redoing the design tokens, typography scale, surface system, and a substantial chunk of the UI. The current palette and components are not on that curve.
3. **A hybrid** — keep light-first as the default for the catalogue (where reading + density matters), and apply the "premium" treatment selectively to the login + marketing surfaces (§9 hints at this split).

This affects every UI recommendation downstream. **Until you decide, the recommendations in §D / §E / §N are written to be implementable under either option, with the directional bias stated.**

### Decision B — Phase 1 audit still stands, not re-run

`AUDIT_PHASE1.md` (18 sections, 27.8 KB) is the authoritative existing-application baseline. This report references it (Section A) rather than redoing it. The verified running build is **25/25 smoke, 0 lint, 0 tsc, 280 pages** on `127.0.0.1:3116`.

### A note on the G2 render itself

A direct automated fetch of `g2.com` returns an anti-bot interstitial ("Access is temporarily restricted" — see `qa-screenshots/g2-home.png`). I also attempted a headless-browser render; it hit the same gate. The benchmark below is therefore built from **G2's own published documentation** (sell.g2.com, research.g2.com, documentation.g2.com — these are not blocked) and from the 2026 G2 Buyer Behavior Report I fetched in the previous session. That is a defensible base for a structural benchmark (taxonomy, scoring, profile schema, gates), but **not for live visual design analysis**. The visual gap matrix in §E flags where I am working from documentation rather than a current render, and the recommended first task includes capturing a proper G2 visual reference set before any design work starts.

---

## A. EXISTING ARCHITECTURE
See `AUDIT_PHASE1.md` (full report). Headlines that matter for this benchmark:
- 21 routable endpoints (19 pages + 2 API routes), 38 components, ~15.5K LOC, build green.
- **Zero auth, zero database, zero mutation surface** beyond lead capture.
- Sole data entry point already exists: `lib/data/repository.ts` (43 accessors).
- Vendor seam already documented: `DEMO_VENDOR_SLUG` in `lib/portals.ts`.
- No `public/`, no imagery; logos are deterministic monogram plates.

---

## B. G2 BENCHMARK

### B.1 What G2 is, structurally
A B2B software **review + discovery marketplace**, monetised by selling buyer intent data, vendor profiles, lead generation, ads on category/competitor pages, and "Best of" reports. **Not** primarily a CMS.

| Layer | G2 reality |
|---|---|
| Catalogue | 10,000+ products across 2,000+ categories; 6M+ reviews; 200M+ annual buyers |
| Taxonomy | Parent categories (no products) → child categories (products live here) → optional subcategories; horizontal + vertical + marketplace + "Other" |
| Product profile | Header (logo, badge, banner 1260×240), Overview, Pricing tab, Reviews, Alternatives, Features, Screenshots, Integrations, Compare CTAs, Featured Companies (paid, up to 15), AI Trust Tier badges, Grid placement, All-in-One/Best-of-Breed classification, G2-managed details |
| Scoring | **G2 Score** (the headline number) + **Satisfaction** + **Market Presence**; maps to a 2×2 **Grid** with quadrants **Leader / High Performer / Contender / Niche**. Sortable by Score (default), Satisfaction, Popularity |
| Review system | Verified reviews with **labels**: Validated Reviewer, Current User, Incentivized, Source, Rating Update; vendor can respond publicly; incentive cap **$100** (FTC-aligned) |
| Vendor portal (my.G2) | Manage product profile, categories, featured customers, AI trust tier, Grid logo; submit category-creation requests |
| Buyer flow | Search → category or grid → product profile → read reviews / see alternatives / compare / **Get pricing** or **Visit website** (lead-capture) |
| SEO/programmatic | Massive: `/categories/<name>`, `/products/<slug>`, `/products/<slug>/reviews`, `/products/<slug>/pricing`, `/compare/<a>-vs-<b>` — each templated |
| Public procurement surfaces | "Best of" annual lists (Best Software, Best for Enterprise, etc.), Grid® reports (per-category, paid), G2 Deals (vendor-funded discounts, gated by buyer intent) |
| 2026 shift | G2 acquired Capterra, Software Advice, GetApp from Gartner (Feb 2026, ~$110M) — four review properties now one owner. "Independence" vacated as a differentiator. |
| 2026 buyer behaviour | 80% use AI search to discover; **evaluation is now the longest stage (40%)**; **IT security review is the #1 post-selection delay (39%, 50% enterprise)**; ~50% had an approved purchase vetoed by CFO; **87% prefer transparent AI** over cheaper black-box |

### B.2 URL patterns confirmed from G2's own documentation
| Pattern | Purpose |
|---|---|
| `g2.com/categories` | Category directory |
| `g2.com/categories/<slug>` | Category page (Grid + filters + product list) |
| `g2.com/products/<slug>` | Product profile (default tab) |
| `g2.com/products/<slug>/<tab>` | Tab (pricing, reviews, alternatives, features, screenshots, integrations) |
| `g2.com/compare/<a>-vs-<b>-vs-<c>...` | Programmatic comparison (canonical, alphabetically ordered) |
| `my.g2.com/~/...` | Vendor management |

### B.3 Taxonomic rules confirmed from `sell.g2.com/about-our-data`
- Parent categories **hold no products** — only child categories do.
- Every category has a written **market definition + inclusion-criteria feature list**.
- Products can be in **multiple** categories if they meet each category's feature list.
- **Dynamic attributes** are category-level filters that appear only on categories where relevant (e.g., B2B vs B2C for Marketing Automation).
- Minimum **10 products** to create a new category.
- Minimum **10 recent reviews** for Grid placement; segment Grids (SMB / Mid / Enterprise) each need **10 reviews from that segment**.
- "Other" categories catch products that fit no defined category; a product cannot be in both a defined and an "Other" category.

### B.4 Scoring (Grid) rules
- **G2 Score** blends Satisfaction and Market Presence; it is the default sort and the headline number on a profile.
- **Satisfaction** = weighted average across review sub-scores (ease, value, support, functionality, etc.), recency-weighted.
- **Market Presence** = a 14-signal blend (search volume, social, employees, web traffic, growth, etc.).
- **Grid quadrants**: Leader (high both), High Performer (high satisfaction, lower presence), Contender (high presence, lower satisfaction), Niche (low both — but specialised).
- Rankings update **daily**.

### B.5 What G2 is NOT (useful to know for differentiation)
- Not a CMS for vendor content.
- Not a transactional marketplace (no checkout, no licences, no billing).
- Not a community (reviews are one-shot, no forums).
- Not first-party — reviews are submitted by buyers; vendors can respond but not edit or delete reviews.
- Not industry-vertical-specific (horizontal + vertical coexist; vertical is the minority).

---

## C. FEATURE GAP MATRIX — G2 vs OUR PLATFORM

Columns: **G2** = what they have (verified) · **OURS** = current state (verified in audit) · **GAP** = distance · **IMPACT** (BUYER × VENDOR) · **COMPLEXITY** · **P** · **RECOMMENDATION** (one line).

| # | Area | G2 | Ours | Gap | Impact | Cx | P | Recommendation |
|---|---|---|---|---|---|---|---|---|
| C1 | Database | Postgres (vendor-managed) | None — seeded dataset | Total | Both | H | **P0** | Supabase Postgres + migrations |
| C2 | Authentication | Email + SSO + 2FA + session | None | Total | Buyer | H | **P0** | Supabase Auth + protected routes |
| C3 | Public product CRUD | Vendor creates via my.G2; admin moderates | None | Total | Vendor | H | **P0** | Vendor portal product CRUD |
| C4 | Admin moderation (approve/publish/archive) | Full queue with audit log | None (page exists, no actions) | Total | Both | M | **P0** | Wire approve/reject/publish with `audit_logs` |
| C5 | Real product imagery (logos, banners, screenshots) | Up to ~15 logos, 1260×240 banner, screenshots tab | Monogram plates, no `public/` | Total | Buyer | M | **P0** | Supabase Storage + `next/image` |
| C6 | RLS / vendor isolation | Implicit via my.G2 + role checks | None | Total | Both | M | **P0** | RLS policies for vendor scoping |
| C7 | Verified reviews with labels | Validated / Current User / Incentivized / Source / Rating Update | `INCENTIVIZED` enum only; all reviews synthetic | High | Buyer | M | **P0** | Review labels surfaced + collection flow |
| C8 | Vendor response on reviews | Public response with timestamp | Schema field exists (`vendorResponse`) | Low (data only) | Vendor | S | **P1** | Render existing field; add write path |
| C9 | Pricing tab | Dedicated tab with structured plans | Embedded in product page (`PricingPlan[]`) | Low | Buyer | S | **P1** | Promote to dedicated tab + admin editor |
| C10 | Alternatives / "Compare with" | Algorithmic — top-N by category + competitive set | `getComparisonsForProduct` returns up to 4 | None | Buyer | S | **P1** | Already adequate; add admin curation |
| C11 | Featured Companies (logos on profile) | Paid: up to 15 logos + names | None | Total | Vendor | M | **P1** | New entity + admin/vendor upload |
| C12 | Best-of lists | Curated annual lists per category, SEO'd | None | High | Buyer | S | **P1** | Editorial workflow + templated pages |
| C13 | Deals (vendor-funded discount via G2) | Yes — gated by buyer intent | None | Medium | Vendor | M | **P2** | Defer; not core to discovery quality |
| C14 | Programmatic SEO | Thousands of `/compare/...` and `/categories/...` | Already have this for `/compare` (180 paths) and `/categories` | Partial | Buyer | S | **P1** | Already mostly in place; expand content per template |
| C15 | URL patterns | `/products/<slug>/<tab>` | `/product/<slug>` only | Medium | Buyer | S | **P1** | Add `/product/<slug>/reviews`, `/pricing`, `/alternatives` |
| C16 | Dynamic category attributes (B2B/B2C etc.) | Yes, category-level | None | Medium | Buyer | M | **P2** | Add `category_attributes` JSONB |
| C17 | Search | Full-text + faceted + autocomplete | In-process, debounced 180 ms, URL state | Functional at 230 products; won't scale | Buyer | M | **P2** | Postgres FTS now; Meilisearch later |
| C18 | Trust signals on profile | Rating + count + badges + Grid quadrant + AI tier | Rating + count + INCENTIVIZED | Medium | Buyer | S | **P1** | Add Grid-style "Headline Score" + badge row |
| C19 | All-in-One / Best-of-Breed classification | Filter on category + Grid pages | None | Medium | Buyer | S | **P2** | Editorial classification + filter |
| C20 | Vendor analytics dashboard | Deep (intents, comparisons, lead conversion) | Vendor portal exists, metrics real-but-synthetic | Low | Vendor | M | **P1** | Already adequate; gate real data behind auth |
| C21 | Admin analytics dashboard | Clicks, impressions, intent, revenue | Counter-only | Medium | Admin | M | **P1** | Wire from DB once data exists |
| C22 | Content/learn hub | G2 Learn, reports, webinars, guides | `/methodology` only | Medium | Buyer | M | **P2** | Add `/resources` or `/learn` scaffold (deferred to Phase 10) |
| C23 | Saved products / lists | Yes | `localStorage` only for compare bucket | Medium | Buyer | M | **P2** | `favorites` table once auth lands |
| C24 | Personalized homepage | Yes (G2 My) | None | Medium | Buyer | M | **P2** | Defer until auth + behaviour data |
| C25 | Public vendor profile pages | Yes (linked from product) | None | Medium | Buyer | S | **P1** | Add `/vendor/<slug>` (separate from `/vendor` portal) |

**Tally by priority:** P0 = 9 · P1 = 12 · P2 = 6 · P3 = 0.

---

## D. UX GAP MATRIX

| # | Topic | G2 behaviour | Our behaviour | Gap | P |
|---|---|---|---|---|---|
| D1 | Discovery entry | Hero search + mega-menu + grid below + trending carousel + recent | Hero search + categories hub + leaderboards + trending + most-compared | **Close**. We have the equivalent pieces, less polished, no imagery | P1 |
| D2 | Category page | Grid quadrant + product list with score chips + facets rail | List + facets rail; no Grid | **Missing Grid visualisation** (large) | P1 |
| D3 | Product page IA | Header → tabs → overview → reviews → alternatives → pricing → features | Single long page (819 lines) with all sections stacked | **Need tabs and shorter landing** | P1 |
| D4 | Comparison flow | Pick up to 4 products, see side-by-side matrix with "differs" highlighting | 4-way supported but heavy single page | Adequate | — |
| D5 | Lead capture | "Get pricing" / "Visit website" / "Start free trial" on every product surface; tracked, attributed | LeadForm on product page; one form, one attribution field | **CTAs need more granularity** (per-intent) | P1 |
| D6 | Empty / loading / error | Polished everywhere, skeletons, no dead-ends | Polished on interactive surfaces, no skeletons on RSC transitions | **Add skeletons for RSC navigation** | P2 |
| D7 | Onboarding | None — buyers discover; vendors onboard via my.G2 | n/a | — | — |
| D8 | Mobile | Responsive, dense | Already responsive + verified 4 breakpoints | **Close**, dense product page is heaviest on mobile | P2 |
| D9 | Accessibility | Generally high | Verified 24 routes clean | **Close** | — |
| D10 | Search suggest | Live, faceted, recent, popular | Live autocomplete (439 LOC), no recents/popular | **Add recents and trending in suggest** | P2 |

---

## E. VISUAL GAP MATRIX

Caveat: G2's homepage render was blocked. The visual comparison below is from secondary sources and G2's published UI in documentation; live differences are likely larger.

| # | Topic | G2 | Ours | Gap | P |
|---|---|---|---|---|---|
| E1 | Brand colour | Red G2 orange-red, generous accent | Single blue `#2563EB` (your confirmed direction) | **Decided directionally — already differs from G2** | — |
| E2 | Imagery | Photographs of software UIs, headshots, customer logos | Monogram plates | **Total** (see U1 in audit) | **P0** |
| E3 | Logo quality | Real vendor logos | Generated initials | Total | **P0** |
| E4 | Typography | Inter (sans), no second family | Inter + JetBrains Mono (2 families — within "small number") | **Close**; tighten mono usage | P3 |
| E5 | Surface system | Flat surfaces, soft shadows, generous whitespace | Same | **Close** | — |
| E6 | Animation | Subtle (skeletons, page transitions, card hover) | Restrained; reduced-motion respected | **Close**, add a couple of purposeful cues | P2 |
| E7 | Login | G2-style branded splash with marketing copy on left, form on right | Not built (no auth) | **Section §9 of the brief specifies the design; needs Decision A** | P0 |
| E8 | Hero | Search-centric, large imagery | Search-centric, no imagery | **Imagery missing** | **P0** |
| E9 | Category thumbnails | Photographic / branded | Lucide icons + colour tint | **Iconic vs photographic — decide per design direction** | P1 |
| E10 | Card density | Dense product rows with score chip + rating + badges | Comparable | **Close** | — |

**Net visual verdict:** the design system is structurally competent (typography, contrast, hierarchy). The largest gap is **imagery**, and the second is **no login**. Both are downstream of design-direction Decision A.

---

## F. TECHNICAL GAP MATRIX

See `AUDIT_PHASE1.md` §10–13 for the full audit. Headline differences from G2:

| Topic | G2 | Ours | Gap | P |
|---|---|---|---|---|
| Stack | Java/Spring + heavy JS | Next.js 16 App Router | **None — we are simpler and modern** | — |
| Database | Postgres (managed) | None | P0 |
| Auth | Internal + SSO | None | P0 |
| CDN/Edge | Yes | None configured | P2 |
| Image pipeline | Yes | None | P0 |
| Tests | Yes (huge suite) | One curl script | P1 |
| CI/CD | Yes | None + no git | P0 (git first) |
| Monitoring | Yes | None | P2 |

---

## G. DATABASE GAP MATRIX

`AUDIT_PHASE1.md` §5 lists the 20 entities already modelled in `lib/data/types.ts`. The G2 standard adds (or formalises):

| New or restructured entity | Why | P |
|---|---|---|
| `users`, `profiles`, `roles`, `permissions`, `vendor_members` | Auth, vendor↔user linking, RBAC | **P0** |
| `audit_logs` | Every mutation; moderation depends on it | **P0** |
| Normalised `product_plans` (was embedded) | Admin/vendor pricing editor | P1 |
| Normalised `product_media` (was `tone` placeholder) | Real screenshots | **P0** |
| `vendor_assets` (logos + covers) | Vendor profile | P1 |
| `featured_companies` (vendor customers, logo+name, max 15) | G2-style social proof | P1 |
| `badges` (profile badge, AI tier, Grid logo) | Trust signals | P1 |
| `grid_reports` (per-category) | Editorial scoring — we will mock until data warrants | P2 |
| `site_settings` + `content_blocks` | Admin-editable homepage / banners | P1 |
| `favorites` | Buyer saved products (Phase 10) | P2 |
| `notifications` | Submission feedback (Phase 10) | P2 |
| `media` (separate from product_media — for site-wide assets) | Banners, hero, vendor covers | P1 |

The single largest **shape change** is splitting the embedded `Product.screenshots[]` / `Product.pricingPlans[]` / `Product.featureSlugs[]` / `Product.integrationSlugs[]` into proper child tables. The compiler will catch most of it because the existing types are already concrete interfaces.

---

## H. AUTHENTICATION GAP MATRIX

G2's login experience (§9 of the brief) is **branded, single-pane-with-marketing-copy, social + email + SSO, 2FA optional**. We have nothing.

The functional matrix:

| Capability | G2 | Ours | P |
|---|---|---|---|
| Email + password | ✓ | — | **P0** |
| OAuth (Google, Microsoft, GitHub) | ✓ | — | P1 |
| Password reset | ✓ | — | P0 |
| Email verification | ✓ | — | P0 |
| 2FA | ✓ | — | P2 |
| SSO/SAML (enterprise buyers) | ✓ | — | P3 |
| Role-based access (4-tier) | ✓ (my.G2) | — | **P0** |
| Server-side role checks | ✓ | — | **P0** |
| RLS in DB | — | — | **P0** |
| Session persistence + expired-session handling | ✓ | — | **P0** |
| Login visual design (§9) | Branded | n/a | **P0** but **Decision A blocks the visual direction** |

---

## I. MASTER ADMIN PANEL REQUIREMENTS

Coverage of §6 of the brief, derived from the entity list:

| Module | Required | Status |
|---|---|---|
| Categories (CRUD + reorder + parent + SEO + activate) | Yes | Absent |
| Subcategories (CRUD + parent change + SEO) | Yes | Absent (data exists but no UI) |
| Products (CRUD + publish + archive + feature + SEO + assign category + assign vendor) | Yes | Absent |
| Vendors (CRUD + approve + reject + suspend + view products) | Yes | Absent |
| Testimonials (CRUD + image + publish + feature) | Yes | Absent (data exists) |
| Pages (CRUD + publish + SEO) | Yes | Absent |
| Homepage content (hero, banners, featured sets) | Yes | Absent (hard-coded in `app/page.tsx`) |
| Media (upload + replace + delete + search + associate) | Yes | Absent |
| Site settings (branding, nav, contact, social, SEO defaults) | Yes | Absent |
| Audit logs (entity + action + actor + before/after) | Yes | Absent (named prerequisite in code) |
| Users + roles + permissions + impersonate-as | Yes | Absent |

The existing admin layout (`app/admin/layout.tsx`, 85 lines) is **too narrow** — only 4 nav items. A real panel needs 20+ routes and a real sidebar.

---

## J. VENDOR PORTAL REQUIREMENTS

The existing portal (`/vendor/*`) is well-structured but read-only. Requirements per §7:

| Module | Required | Status |
|---|---|---|
| Login + session | Yes | Absent |
| Profile (logo, cover, info) | Yes | Absent (data model OK) |
| Products (CRUD + submit + resubmit + view status) | Yes | Absent (schema needs `REJECTED` added) |
| Media (upload + replace + delete) | Yes | Absent |
| Review responses (public response to a review) | Yes | Absent (field exists) |
| Analytics (real data, gated by auth) | Partial | Mock numbers |
| Settings | Yes | Absent |
| **Vendor isolation** (Vendor A never sees Vendor B's data) | Yes | **Absent — gap is critical** |

Workflow state machine: `DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → PUBLISHED`. Rejection path: `SUBMITTED → REJECTED → EDIT → RESUBMIT`. The current `ProductStatus` enum (`DRAFT | PENDING | APPROVED | ARCHIVED`) maps roughly; needs `REJECTED` and ideally `UNDER_REVIEW` separate from `PENDING` for clean queue filtering.

---

## K. PRIORITY ROADMAP

P0 first. The order matters.

### P0 — blocking; product cannot be called production-ready without these
1. **Recoverable baseline** — git init, `.gitignore` verification, `.env.example`, deploy target *(must precede schema)* [AUDIT §T1, §T2, §T3]
2. **Database schema** — Supabase Postgres, all P0 tables from §G, RLS policies [§C1, §C6]
3. **Auth** — Supabase Auth, login + register + reset + verify + session persistence [§C2]
4. **Authorization** — `middleware.ts` route protection + server-side role checks (never frontend-only) [§C2, §H]
5. **Vendor isolation** — session-derived vendor slug, RLS-enforced + verified by cross-vendor access tests [§C6, §J]
6. **Admin product CRUD + workflow** — DRAFT/SUBMITTED/UNDER_REVIEW/APPROVED/PUBLISHED/REJECTED, audit-logged [§C3, §I]
7. **Vendor product CRUD + submit + resubmit** [§J]
8. **Media storage** — Supabase Storage, product_media + vendor_assets + media, `next/image`, validated file types [§C5]
9. **Audit logs** — every mutation [§I]

### P1 — high
10. Review system real (labels, validation, vendor response write path) [§C7, §C8]
11. Login visual design *(blocked by Decision A)* [§9, §H]
12. Admin modules: categories, subcategories, vendors, users/roles, content blocks, site settings, audit-log viewer [§I]
13. Public vendor profile pages (`/vendor/<slug>`, separate from `/vendor` portal) [§C25]
14. Pricing tab (`/product/<slug>/pricing`) [§C9]
15. Alternatives curation [§C10]
16. Best-of lists editorial scaffold [§C12]
17. Real product imagery seed + on-upload flow [§C5]
18. Security headers (CSP/HSTS/frame-options/referrer-policy) [AUDIT §S5]
19. Test framework + §22 functional + security suites [AUDIT §T4, §22]
20. Featured Companies module [§C11]
21. Trust signals: Grid-style headline score, badges row, AI tier label [§C18]

### P2 — medium
22. URL structure: `/products/<slug>/<tab>` [§C15]
23. SEO: root OG fallback, real `metadataBase`, `noindex` on portals [AUDIT §E1–§E3]
24. Skeletons for RSC navigation [§D6]
25. Search recents + trending suggest [§D10]
26. Admin analytics wired from DB [§C21]
27. Dynamic category attributes [§C16]
28. Normalise embedded product_plans + features + integrations into child tables [§G]
29. Search upgrade (Postgres FTS now; Meilisearch later) [§C17]
30. Restrained motion [AUDIT §22]
31. All-in-One / Best-of-Breed classification [§C19]
32. Trust/security surface (targets the 39% security-review delay)
33. Favorites [§C23]
34. Notifications + email [§C20 backend]
35. Redis-backed rate limiting [AUDIT §T8]

### P3 — deferred
36. 2FA · 37. SSO/SAML · 38. Deals module · 39. Personalized homepage · 40. Learn hub

---

## L. TARGET INFORMATION ARCHITECTURE

G2 model adopted, refined for an **independent, evidence-led** positioning (this matters — the brief is "transform the existing website"; the *positioning* changes with §B.1's G2 acquisition note).

### IA tree
```
Home (/                                  )
├── Categories directory (/categories    )
│   ├── Pillar: Sales Software            (parent — no products)
│   │   ├── Child: CRM Software           (products live here)
│   │   │   ├── /product/<slug>           (header + Overview tab)
│   │   │   ├── /product/<slug>/pricing   (pricing tab)
│   │   │   ├── /product/<slug>/reviews   (verified reviews)
│   │   │   └── /product/<slug>/alternatives  (algorithmic + curated)
│   │   └── Child: Sales Engagement Software
│   │       └── ...
│   └── Pillar: Marketing Software
│       └── Child: Marketing Automation Software
│           └── ...
├── Vendors directory (/vendors           )  ← public, separate from /vendor portal
├── Compare hub (/compare                 )
│   └── /compare/<a>-vs-<b>-vs-<c>...
├── Best of (/best                        )  ← editorial lists
├── Methodology (/methodology              )  ← already exists
├── About / Privacy / Terms               ← already exist
├── Login / Register / Reset              ← missing
├── /vendor                               ← vendor portal (auth-gated)
└── /admin                                ← admin panel (auth-gated, noindex)
```

**Schema-level rules, carried over from G2's published methodology:**
- Parent categories hold no products.
- A category must have ≥10 products before being ranked/Grid-eligible.
- A product can be in multiple categories if it meets each one's feature criteria (we will enforce this in admin, not in DB).
- Categories carry **dynamic attributes** as `JSONB` — only rendered when present.

**Differentiators we will encode in the IA, not copy from G2:**
- **Every product has a published methodology score** linked from the profile to `/methodology` — visible, not buried.
- **No "Boost" / paid placement** — homepage and category ordering use the same Score, paid slots do not exist.
- **Every review has a date and a label** rendered on the profile, not aggregated into an opaque average.

---

## M. TARGET DATABASE ARCHITECTURE

Postgres via Supabase. RLS enabled everywhere. Anon role = public read; authenticated = role-scoped read/write; service-role = server-only, never browser.

### Core tables (P0)
```
profiles               id (auth.users FK), display_name, avatar_url, created_at, updated_at
roles                  id, name (SUPER_ADMIN|ADMIN|VENDOR|USER|GUEST)  -- enum via check
user_roles             user_id, role_id  -- composite PK; one row per role per user
permissions            id, name
role_permissions       role_id, permission_id
vendors                id, slug (unique), name, website, logo_url, cover_url,
                       description, founded_year, hq_city, hq_country,
                       employee_count, verified_publisher, status, created_at, updated_at
vendor_members         vendor_id, user_id, role (OWNER|EDITOR|VIEWER) -- composite PK
categories             id, slug (unique), parent_id NULLABLE, depth (0|1),
                       name, description, icon, sort_order, seo_title,
                       seo_description, seo_keywords JSONB,
                       dynamic_attributes JSONB, is_active, created_at, updated_at
                       -- CHECK: parent_id IS NULL <=> depth=0
products               id, slug (unique), primary_category_id, vendor_id,
                       name, tagline, short_description, body_md,
                       website, logo_url, cover_url, status (enum),
                       published_at NULLABLE, archived_at NULLABLE,
                       score NUMERIC, leader BOOLEAN,
                       featured BOOLEAN, sponsored BOOLEAN, comparison_views,
                       profile_views, created_at, updated_at
                       -- INDEX (primary_category_id), (vendor_id), (status, score DESC)
product_categories     product_id, category_id  -- composite PK (many-to-many)
product_plans          id, product_id, name, price NUMERIC, billing, currency,
                       features TEXT[], cta_label, sort_order
product_media          id, product_id, kind (screenshot|gallery|video), url,
                       caption, sort_order
product_features       product_id, feature_id  -- composite PK
product_integrations   product_id, integration_id -- composite PK
reviews                id, product_id, author_user_id NULLABLE,
                       author_name, author_role, author_company_size,
                       author_industry, use_duration, rating, ease_rating,
                       value_rating, support_rating, functionality_rating,
                       title, body, pros, cons,
                       verification (VALIDATED|CURRENT_USER|INCENTIVIZED|GUEST),
                       source, helpful_count, status (PENDING|APPROVED|REJECTED|FLAGGED),
                       created_at
review_responses       review_id, body, vendor_user_id, responded_at
                       -- one-to-one with reviews; only vendors respond
comparisons            id, slug (unique, "a-vs-b-vs-c"), title,
                       product_ids UUID[], views, updated_at
leads                  id, type, status, product_id, vendor_id,
                       name, email, company, phone, message, intent,
                       source_location, category_id, created_at, updated_at
                       -- INDEX (vendor_id, created_at DESC)
audit_logs             id, actor_user_id, entity_type, entity_id, action,
                       before_json JSONB, after_json JSONB,
                       ip, user_agent, created_at
                       -- INDEX (entity_type, entity_id, created_at DESC)
site_settings          key (PK), value JSONB, updated_at, updated_by
content_blocks         id, slug, scope (home|legal|methodology|page), body,
                       published BOOLEAN, updated_at
media                  id, url, kind (image|video), mime, width, height,
                       bytes, alt, uploaded_by, created_at
featured_companies     product_id, name, logo_url, sort_order  -- up to 15
notifications          id, user_id, kind, body, read_at, created_at
favorites              user_id, product_id, created_at  -- composite PK
```

### RLS sketch (policies, not DDL — full DDL in Phase 4)
```
products  SELECT  WHERE status = 'APPROVED' OR status = 'PUBLISHED'
                OR auth.uid() IN (SELECT user_id FROM vendor_members WHERE vendor_id = products.vendor_id)
                OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('ADMIN','SUPER_ADMIN'))
products  INSERT/UPDATE/DELETE  vendor_members of vendor_id
                OR ADMIN/SUPER_ADMIN

reviews   SELECT  status='APPROVED'
reviews   INSERT  authenticated, status defaults to PENDING
reviews   UPDATE  ADMIN/SUPER_ADMIN (moderate)
                OR auth.uid() = author_user_id AND status = 'PENDING'  -- author edits own

leads     INSERT  anon (public lead form) -- Zod validates; rate-limited at edge
leads     SELECT  vendor_members of product's vendor
                OR ADMIN/SUPER_ADMIN

audit_logs SELECT  ADMIN/SUPER_ADMIN only
audit_logs INSERT  service-role only  -- enforced by trigger

site_settings, content_blocks  SELECT anon, write ADMIN/SUPER_ADMIN

categories  SELECT anon, write ADMIN/SUPER_ADMIN

vendor_members, user_roles  SELECT self, write ADMIN/SUPER_ADMIN
```

### Storage (Supabase Storage)
- `media/` — public bucket for product_media, vendor_assets, hero, banners (read anon, write authenticated via signed upload URLs)
- `private/` — non-public assets (e.g. vendor payout documents if ever needed); write service-role only

---

## N. TARGET DESIGN SYSTEM

This section is **directionally neutral until Decision A is made**. Two passes below; both achievable from the current token file with edits, not a rebuild.

### N.1 If we stay with **"Light enterprise only"** (your prior decision)
- Keep Inter + JetBrains Mono; tighten mono to numeric tables and inline code only.
- Keep zinc-200 borders; keep single blue accent `#2563EB`.
- **Add**: real imagery from Supabase Storage; replace monogram `ProductLogo` with `<Image src=...>`. The component shape already supports it.
- **Add**: subtle row hover lift on tables (`translate-y-[-1px]` + `shadow-card-hover`); section fade-in on scroll (reduced-motion respected).
- **Add**: skeleton blocks for RSC navigation (matches the brief's D6 / Phase 15).
- Login page: light, single-pane, marketing copy on the left, form on the right. Sober, trustworthy.

### N.2 If we move to **"premium futuristic"** (brief §33)
- Introduce a second accent for highlight (G2 uses red; we will pick a distinct one to avoid imitation).
- Add a **surface system**: card / raised / floating-glass / gradient-glow, each with explicit use rules.
- Add a **dark theme** that is the default for login + admin, with light fallback for the catalogue (G2 itself runs mixed — dark admin, light public is standard).
- **Real imagery** still required; do not substitute glassmorphism for photography.
- Animations: card hover with `transform` + shadow, hero gradient drift (very slow), modal transitions; respect `prefers-reduced-motion` strictly.
- Login: per §9 — branded splash, gradient/glow accents, **not** a gaming-style particle field.

### N.3 Either way, what the design system must produce
- A **token-only** change to switch themes — no per-component colour drift.
- A documented **density scale** (compact, default, comfortable) used by admin + vendor tables.
- A documented **state vocabulary** (rest, hover, focus, active, disabled, loading) consistent across surfaces.
- A documented **elevation scale** (1–4) used sparingly.
- A **no-arbitrary-values** rule: every colour/size via `var(--token)` or Tailwind class derived from tokens.

---

## O. RECOMMENDED FIRST SMALL IMPLEMENTATION TASK

> **Establish a recoverable baseline: initialise git, verify `.gitignore`, add `.env.example` with placeholders only, choose and document a deploy target, and commit the verified build. Do not modify application code. Do not create the Supabase schema yet.**

**Why this, again, and not the schema.** Unchanged from the Phase 1 audit recommendation. §32 requires safe, validated migrations; on an unversioned tree they are unrecoverable. This is also the smallest possible first task — zero behaviour change, cannot regress the 25/25 build.

**Exit criteria**
- `git log` shows a baseline commit on the verified build.
- `.gitignore` is verified to exclude `node_modules/`, `.next/`, `*.log`, `.env*`, `qa-screenshots/`, `tsconfig.tsbuildinfo`, `next-env.d.ts`.
- `.env.example` lists, with placeholders only: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only, with a comment forbidding client exposure), `NEXT_PUBLIC_SITE_URL`, and the existing config keys (none currently — the project has no env config at all).
- A **deploy-target decision** is recorded in the plan (Vercel is the obvious default for Next.js 16; self-host is possible but means writing a Dockerfile + a CI workflow).
- `npm run build && sh scripts/qa/smoke.sh` still passes **25/25**.

**Two parallel prerequisites this does not cover, that you might want to bundle:**
1. **Decision A** (design direction) — see top of this document. Affects every downstream UI recommendation.
2. **Capture a current-G2 visual reference set** — `g2.com` blocked automated access. Either (a) fetch G2 screenshots manually from a browser I can drive *with cookies and an ad-blocker disabled*, or (b) you provide reference screenshots. Without this, §E is working from documentation, not from a live render.

**Once those are decided and committed**, the next task is Phase 5 (Supabase project + migrations + RLS, against the schema in §M). After that: Phase 6 auth, Phase 7 middleware + role checks, then Phase 9 admin, Phase 10/14 vendor, Phase 12 public-data swap.

**Awaiting your decisions on the design direction (Decision A) and the first task. No code was changed during this analysis.**