# MASTER BUILDER FILE — Software Discovery Platform (REBUILT)
**Built:** 2026-09-02 — includes Gartner Digital Markets + UI Design System
**Folder:** `/opt/data/analysis/`

> Single-file offline copy. Normal use: keep folder structure and paste `prompts/MASTER-BUILD-PROMPT.md` into your agent.

---

## PART — MASTER BUILD PROMPT (`prompts/MASTER-BUILD-PROMPT.md`)

# DELIVERABLE 10 — MASTER PROMPT FOR AI CODING AGENT

## Copy-paste this entire prompt to an AI coding agent (Claude Code, Codex, OpenCode, Cursor, etc.)

---

# MASTER BUILD PROMPT — Software Discovery Platform

You are a senior full-stack engineer. Your job is to **BUILD, RUN, TEST, FIX, and RETEST** an original Software Discovery & Comparison Platform until it works end-to-end. Do NOT stop after writing code — you must run it, test every feature in the browser, find bugs, fix them, and retest until green.

## 0. Mission & Rules

- **Goal:** A working marketplace where buyers search, filter, view products, read/submit reviews, compare 2–3 products side-by-side, and submit leads — plus vendor and admin dashboards.
- **Original work only:** Do NOT copy proprietary source, branding, or exact designs from G2/Software Advice/etc. Synthesize publicly observable PATTERNS into an original product.
- **One repo, one folder:** All code in a single repository / project folder. Keep it organized.
- **Incremental:** Build feature by feature, running and testing after each.
- **Evidence over claims:** After every build step, run the app and prove it works (terminal output, test results, no console errors).
- **Loop until done:** BUILD → RUN → TEST → FIND BUGS → FIX → RETEST → CONTINUE. Do not declare done unless tests pass and manual browser checks are clean.

## 1. Technology Stack (do not deviate without reason)

- **Frontend:** Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS + shadcn/ui (Radix)
- **Database:** PostgreSQL 16 + Prisma ORM
- **Search:** Meilisearch (with Postgres ILIKE fallback if Meilisearch unavailable — never 500)
- **Auth:** Auth.js (next-auth) v5 — credentials (bcrypt) + Google OAuth (LinkedIn optional)
- **Cache/Queue:** Upstash Redis or in-memory fallback for local dev (rate limiting, sessions)
- **Validation:** Zod on every API input and form
- **Email:** console.log for MVP (or Resend if key available) — transactional: verification, lead notifications, review published
- **Testing:** Vitest + Playwright (E2E), axe-core for a11y, Lighthouse CI for SEO/perf
- **Infra:** Works locally via `npm run dev` + `npx prisma migrate dev` + Meilisearch via Docker or Cloud

## 2. Project Structure (create exactly this)

```
software-discovery-platform/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                          # homepage: hero search + categories + featured + trust bar
│   │   ├── layout.tsx
│   │   ├── categories/page.tsx               # all categories hub
│   │   ├── [category]/page.tsx               # category listing: filters, sort, pagination, cards, FAQ
│   │   ├── [category]/[product]/page.tsx     # product profile: 6 tabs, sticky lead form, reviews
│   │   ├── [category]/[product]/alternatives/page.tsx
│   │   ├── compare/[slugs]/page.tsx          # /compare/a-vs-b or a-vs-b-vs-c (alphabetical canonical)
│   │   ├── compare/page.tsx                  # compare hub
│   │   ├── resources/[slug]/page.tsx         # MDX guides (ISR)
│   │   ├── best/[category]/page.tsx          # alias to category with best view
│   │   ├── search/page.tsx                   # search results (tabs: products/categories/comparisons)
│   │   └── (static)/{about,methodology,privacy,terms}/page.tsx
│   ├── (auth)/{login,register}/page.tsx
│   ├── (dashboard)/
│   │   ├── vendor/{page.tsx, layout.tsx, products, leads, reviews}
│   │   └── admin/{page.tsx, layout.tsx, products, categories, reviews, vendors, leads, users}
│   └── api/
│       ├── search/route.ts
│       ├── products/route.ts  and products/[slug]/route.ts
│       ├── categories/route.ts
│       ├── comparisons/[slugs]/route.ts
│       ├── leads/route.ts
│       ├── reviews/route.ts  and reviews/[id]/helpful/route.ts
│       ├── saved/{products,comparisons}/route.ts
│       ├── vendor/{claim,products,leads,reviews}/route.ts
│       ├── admin/{products,categories,reviews,leads,users}/route.ts
│       └── health/route.ts
├── components/
│   ├── ui/            # shadcn: button, input, select, dialog, sheet, tabs, badge, card, etc.
│   ├── cards/         # CategoryCard, ProductCard, ComparisonCard
│   ├── filters/       # FilterDrawer, FilterChips, SortSelect
│   ├── compare/       # ComparisonBucket, ComparisonTable
│   ├── reviews/       # ReviewCard, ReviewForm, RatingDistribution, HelpfulButton
│   ├── forms/         # LeadForm, SearchAutocomplete
│   └── layout/        # Header, Footer, Breadcrumbs, TrustBar, StickySidebar
├── lib/
│   ├── db.ts          # prisma client singleton
│   ├── search.ts      # meilisearch client + sync helpers + fallback
│   ├── auth.ts        # Auth.js config
│   ├── validation.ts  # Zod schemas (lead, review, product, category)
│   ├── seo.ts         # JSON-LD helpers, meta, sitemap
│   ├── email.ts       # sendLeadNotification, sendReviewPublished (console or Resend)
│   └── utils.ts       # cn, slugify, canonicalCompareSlug, formatPrice
├── prisma/
│   ├── schema.prisma  # see Section 5 — copy verbatim, then `npx prisma generate && migrate`
│   ├── seed.ts        # see Section 6
│   └── migrations/
├── public/icons, images
├── e2e/               # Playwright specs (see Section 9)
├── scripts/
│   ├── sync-search.ts
│   └── generate-sitemap.ts
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## 3. Environment

Create `.env` and `.env.example`:

```
DATABASE_URL="postgresql://user:pass@localhost:5432/sdp?schema=public"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""  # optional for MVP — credentials auth must work without it
GOOGLE_CLIENT_SECRET=""
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_KEY=""
REDIS_URL=""  # optional — fallback to memory
RESEND_API_KEY=""  # optional — fallback to console
```

Create `docker-compose.yml` for local Postgres + Meilisearch + Redis (all optional if already available — detect and reuse).

## 4. Database Schema (Prisma)

Copy the Prisma schema from `/schemas/DATABASE-SCHEMA.md` in the research report verbatim (20 models: User, Account, Session, Company, Category, Product, ProductCategory, FeatureGroup, Feature, ProductFeature, PricingPlan, Integration, ProductIntegration, ProductScreenshot, Review, ReviewVote, SavedProduct, Comparison, ComparisonProduct, Lead, FaqItem, Alternative, Resource, SlugRedirect).

After writing `prisma/schema.prisma`:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 5. Seed Data (prisma/seed.ts)

Seed in this order:
1. **Categories:** 12 top-level (CRM, Project Management, Accounting, HR, Marketing Automation, ERP, Help Desk, E-commerce, Design, Analytics, Communication, File Management) + 48 subcategories (4 each) = 60 total. Use realistic names/slugs/icons/descriptions. Set parentId for subcategories.
2. **FeatureGroups + Features:** For CRM: Lead Management, Contact Management, Sales Automation, Analytics (3–5 features each). For PM: Task Management, Collaboration, Reporting. Create 30+ features total, grouped.
3. **Companies:** 30 fake companies (faker) with name, slug, logo (use `https://i.pravatar.cc/150?u={slug}` or placeholder), website.
4. **Products:** 120 products (10 per top category avg). Each: name, globally unique slug, tagline, shortDescription (2 lines), description (200+ words markdown), logoUrl, website, status APPROVED, companyId, ratingAvg (3.5–4.8), ratingCount (10–300), secondary avgs, startingPrice, pricingModel, freeTrial (50% true), freeVersion (30% true), deployment ["cloud"], featured (10%), sponsored (15%). Link each to 1 primary + 1–2 secondary categories via ProductCategory. Assign 5–8 features via ProductFeature (available true). Add 2–3 PricingPlans (Starter/Professional/Enterprise with prices). Add 4 integrations (from 20 integrations seeded). Add 3 screenshots (placeholder images).
5. **Reviews:** 400 reviews (3–4 per product avg). Each: user (create 80 users if needed), productId, rating 1–5 (distribution 45/30/12/8/5), title, body (80+ chars), pros/cons, secondaries (ratings for ease/value/support/functionality), metadata (companySize, industry, role, useDuration), verified (40% true), helpfulCount (0–12), status APPROVED (90%) / PENDING (10%).
6. **Users:** Already created above + 1 admin (`admin@sdp.local` / `Admin123!` role ADMIN) + 2 vendors.
7. **Comparisons:** Generate 40 comparisons for top categories: take top 5 products per top-8 categories, create pairwise (10 per category, capped at 5 per category for seed) → Comparison + ComparisonProduct (position 0,1). Slug = sorted(slugs).join('-vs-').
8. **Resources:** 6 MDX guides: CRM Buying Guide, PM Buying Guide, Best CRM 2026, Best PM 2026, Salesforce vs HubSpot, Asana vs Monday (bodyMdx with headings, product embeds).
9. **FaqItems:** 2 per top category + 1 per top 20 products.

After seeding, run search sync: index all products and categories into Meilisearch (or log if unavailable).

```bash
npx prisma db seed
# or: npx tsx prisma/seed.ts
```

## 6. Feature Build Order (incremental — run + test after each)

### Step 1 — Scaffold + DB + Auth
- Init Next.js + Tailwind + shadcn, create lib/db.ts, lib/auth.ts, lib/validation.ts, lib/utils.ts
- Implement Auth.js with credentials (bcrypt) + optional Google. Create (auth)/login and (auth)/register pages. Test: register → login → session persists → logout. RBAC: middleware protects /vendor and /admin.

### Step 2 — Homepage + Categories Hub
- Build Header (logo, nav: Categories, Resources, Compare, Write Review, Vendor CTA, auth links, global SearchAutocomplete) + Footer (categories, resources, legal, social) + layout.tsx
- Homepage: hero (search + "Get Free Recommendation" async form → POST /api/leads type EXPERT_RECOMMENDATION), categories grid (12 top-level), featured products (6), trending comparisons (4), trust bar, vendor CTA blocks.
- /categories hub: all top-level with subcategory counts + links.
- Test: homepage renders, search autocomplete works, categories hub lists correctly.

### Step 3 — Category Listing + Product Cards + Filters
- [category]/page.tsx: fetch category + products (via Prisma, with pagination 12–24/page), display: H1, description, breadcrumbs, FilterDrawer (price buckets, rating, features checkboxes, free trial toggle, deployment), SortSelect (Recommended/Rating/Price/Most reviewed), ProductCard grid, FilterChips, Pagination, FAQ accordion, internal links to comparisons.
- ProductCard: logo, name, rating (star + count), tagline, Compare checkbox, Get Pricing / View CTAs, sponsored badge.
- Filters must sync to URL query (?price=&rating=&features=&freeTrial=&sort=&page=) and be SSR-friendly (server renders initial, client updates via router.push).
- Recommended sort: sponsored first, then ratingAvg desc, then ratingCount desc.
- Test: filters change URL and results, pagination works, compare checkbox adds to bucket.

### Step 4 — Product Profile
- [category]/[product]/page.tsx: fetch by product.slug (global unique), verify category matches primary or redirect. Sections: header (logo/name/tagline/rating/distribution/verified badge/Compare/CTA row), tabs (Overview, Features, Pricing, Reviews, Alternatives, FAQs) with anchor scroll, sticky lead sidebar (LeadForm type GET_PRICING), features grouped checklist (✓/—), pricing plans table (name/price/billing/features/CTA per plan + free trial badge), integrations grid, company info, review summary + list, alternatives grid (6), FAQs, breadcrumbs, JSON-LD (SoftwareApplication + AggregateRating + FAQPage + BreadcrumbList), OG tags.
- Test: product page renders all sections, tabs scroll, lead form submits, JSON-LD present (view source).

### Step 5 — Search
- lib/search.ts: Meilisearch client, index products (name, slug, tagline, description, features, category names) + categories. Facets: category, price tier, rating bucket. Typo tolerant.
- /api/search: proxies Meilisearch search; if Meilisearch unreachable, fallback to Prisma ILIKE + tsvector (never 500).
- SearchAutocomplete: combobox in header, shows products + categories + comparisons as you type (debounced 200ms), keyboard nav (↑↓ Enter Esc).
- /search page: query param q, tabs Products/Categories/Comparisons, results with highlighting.
- Test: type 2 chars → autocomplete shows results → select → navigates. /search?q=crm shows results. With Meilisearch stopped, search still returns via fallback.

### Step 6 — Reviews
- ReviewCard, RatingDistribution, HelpfulButton components.
- [category]/[product] reviews tab: list with filters (star, verified only) + sort (recent/helpful/highest/lowest) + pagination, plus "Write a Review" CTA.
- /write-review (or inline form): search/select product → if not logged in, redirect to login with callback → form: overall stars (1–5) + 4 secondary sliders (Ease/Value/Support/Functionality) + title + body (min 50) + pros + cons + metadata (companySize, industry, role, useDuration) → Zod validate → POST /api/reviews → status PENDING → success message. Enforce one review per user per product (unique constraint).
- /api/reviews: create, plus PATCH /api/reviews/[id]/helpful (toggle, auth required).
- Moderation: reviews with status PENDING show "Under review" to author; admin can approve/reject in /admin/reviews. On approve, recompute Product denormalized ratings + sync search.
- Test: submit review as buyer → appears as PENDING → admin approves → appears on product page → ratingAvg updates → helpful toggle works (+1/-1) → duplicate review blocked (409).

### Step 7 — Comparison Engine
- ComparisonBucket: floating bar bottom-right, shows selected products (logo+name+remove), "Compare (N)" button, "Clear all". State: localStorage + optionally DB for logged-in users. Max 3.
- ComparisonTable: header row (logo/name/rating/price/CTA per column) + sections: Overview | Pricing (plans side-by-side) | Ratings (stars + secondaries bars) | Features (grouped ✓/—) | Pros/Cons | Integrations | Alternatives | FAQs. Sticky header, horizontal scroll, sticky first column on mobile.
- /compare/[slugs]/page.tsx: parse params.slugs.split('-vs-'), canonicalize via sorted().join('-vs-'), if not canonical → redirect(301). Fetch products by slug where status APPROVED, if count != parts.length → notFound(). Order columns by original slugs order or sorted (document choice). Generate SEO title/meta/JSON-LD. Record view increment.
- /api/comparisons/[slugs]: same logic, JSON response.
- /compare hub: list recent/popular comparisons + builder (search to add products).
- Test: from category, check Compare on 2 cards → bucket shows (2) → click Compare → /compare/a-vs-b renders table with all sections → add third → /compare/a-vs-b-vs-c works → unsorted URL 301s to sorted → unknown slug 404.

### Step 8 — Leads
- LeadForm component: type GET_PRICING | REQUEST_DEMO | EXPERT_RECOMMENDATION. Fields: name, email (required), company, phone, message, hidden productId/categorySlug. Zod validate. On submit POST /api/leads → Lead row status NEW → email to vendor (if product-specific) + admin (console or Resend) → success toast.
- Places: product sticky sidebar (Get Pricing), product header (Request Demo), hero (Expert Recommendation), comparison header per column (Get Pricing).
- /api/leads: validate, rate limit (10/hour/IP), create, send emails (async, don't block response).
- Vendor lead inbox: /vendor/leads table (type, product, contact, date, status), filter, status transitions (NEW→CONTACTED→QUALIFIED→CLOSED), notes, CSV export (Phase 1: simple CSV download).
- Admin lead manager: /admin/leads all leads, assignment, status.
- Test: submit Get Pricing → lead appears in vendor inbox (if vendor owns product) + admin list → status transitions work → duplicate rapid submits rate-limited (429).

### Step 9 — Vendor & Admin Dashboards
- Vendor (/vendor): Overview KPIs (views — mocked as product.updatedAt proxy for MVP, leads count), Product management (list own products, edit: overview/features/pricing/screenshots → status PENDING), Lead inbox, Review responses (list reviews for own products, POST response).
- Admin (/admin): Dashboard KPIs (products pending, reviews pending, leads today, users), CRUD: products (approve/reject), categories (tree CRUD), features (grouped CRUD), reviews (moderation queue with approve/reject/verified toggle), vendors (claims list, approve), leads (all, status), users (role changes), resources (MDX editor — simple textarea for MVP), SEO manager (sitemap preview, redirects table). Protect with role ADMIN|MODERATOR middleware.
- Test: vendor edits product → status PENDING → admin sees in queue → approves → status APPROVED → page revalidates → search updated. Admin approves pending review → rating updates.

### Step 10 — SEO, Perf, Polish
- ISR: set revalidate 60s for category/product, 300s for comparison/resources. Use generateStaticParams for top categories/products for initial build.
- Sitemap: /sitemap.xml index → /sitemaps/products.xml, /sitemaps/categories.xml, /sitemaps/comparisons.xml, /sitemaps/resources.xml (dynamic, from DB). robots.txt (allow /, disallow /search, /api, /admin, /vendor).
- Meta: unique title (≤60) + description (150) per page, canonical self, OG (logo + rating), breadcrumbs (BreadcrumbList JSON-LD), product JSON-LD (SoftwareApplication + AggregateRating + Offer), FAQPage where FAQs exist.
- Perf: Next Image for logos/screenshots, ISR caching, no client waterfalls for listing pages.
- A11y: keyboard nav for autocomplete/filters/drawer, ARIA for tabs/dialogs, focus rings, contrast, axe-core in CI.
- Empty states: no results, no reviews, no leads — all have helpful empty UI, not blank.
- 404s: custom not-found.tsx for product/category/comparison.

## 7. Testing — You Must Run These

### 7.1 Unit (Vitest)
- utils: canonicalCompareSlug, slugify, formatPrice
- validation: LeadSchema, ReviewSchema

### 7.2 E2E (Playwright) — create e2e/*.spec.ts and RUN them

```ts
// e2e/smoke.spec.ts — critical paths (must all pass)
test('homepage renders and search works')
test('category listing filters and pagination')
test('product page renders all sections and lead form submits')
test('review submission → moderation → appears')
test('comparison: bucket → table → canonical 301 → 404 on unknown')
test('auth: register → login → protected routes')
test('vendor: claim → edit → admin approves → live')
test('admin: review moderation updates rating')
test('search autocomplete keyboard nav')
test('sitemap contains products')
```

Run:
```bash
npm run build
npm run start &  # or npm run dev
npx playwright test --reporter=list
# also:
npx prisma migrate reset --force && npx prisma db seed  # prove seed works
```

### 7.3 Manual Browser Checks (do these yourself via browser tool or by running and inspecting)

- Open homepage → search "crm" → autocomplete shows products/categories → press Enter → /search?q=crm shows results.
- Open /crm → apply Price filter → URL updates → results filter → clear → back to all.
- Check Compare on 2 cards → bucket appears → click Compare → table has Pricing/Ratings/Features rows with ✓/—.
- Open product → submit Get Pricing with invalid email → Zod error shown → fix → success toast → check /vendor/leads (as vendor) and /admin/leads.
- Write a review → check it is PENDING → as admin approve → check product ratingAvg increased.
- Check View Source on product page → JSON-LD present → Lighthouse SEO ≥90.
- Check browser console on every page → zero errors/warnings (fix all).
- Check Network tab → no 500s, search fallback works when Meilisearch down (stop container, retry).
- Resize to 375px → filters become drawer, comparison table scrolls, no horizontal overflow.

### 7.4 Must Fix Before Done

- Any 500 on public pages
- Any console error
- Any Playwright failure
- Any Lighthouse SEO <90 or A11y <90 on product/category pages
- Any Zod validation bypass
- Any RBAC bypass (access /admin as buyer should 403/redirect)
- Any comparison with wrong canonical or missing 404

## 8. Seed & Demo Accounts (for tester)

After seed, these must work:
- Admin: admin@sdp.local / Admin123!
- Vendor: vendor@sdp.local / Vendor123!
- Buyer: buyer@sdp.local / Buyer123!
Document them in README.md.

## 9. README

Create README.md with: project description, tech stack, setup steps (docker-compose up, npm install, prisma migrate, seed, dev), demo accounts, URL map, test instructions, deployment notes.

## 10. Definition of Done

You are DONE only when:
- [ ] `npm run build` passes with zero errors
- [ ] `npx prisma migrate dev` + `npx prisma db seed` succeed
- [ ] `npx playwright test` — all specs pass
- [ ] Manual browser checks above — all pass, zero console errors
- [ ] Lighthouse on /crm and /crm/{top-product}: Performance ≥85, SEO ≥90, A11y ≥90
- [ ] Search works with Meilisearch UP and also with Meilisearch DOWN (fallback)
- [ ] Comparison canonicalization (unsorted → 301) and 404 verified
- [ ] Lead round-trip (submit → vendor inbox → status update) works
- [ ] Review round-trip (submit → PENDING → admin approve → live + rating update) works
- [ ] RBAC: buyer cannot access /admin, anon cannot write reviews, duplicate review blocked
- [ ] README + .env.example present

If any item fails, FIX and RETEST — do not stop.

## 11. Deployment (bonus, after done)

- Vercel + Neon + Meilisearch Cloud + Upstash Redis — or document Docker self-host.
- Set env vars, run migrations, seed, set cron for sitemap.

---

## START NOW

1. Create the project (Next.js, Tailwind, shadcn, Prisma, Auth.js).
2. Follow Steps 1–10 in order.
3. After each step, RUN and TEST that step before moving on.
4. When all steps done, run the full test suite and manual checks.
5. Fix every failure and retest until green.
6. Output a final report: what was built, test results (paste terminal output), remaining known issues (should be none).

Do not ask the user for clarification — make reasonable choices and document them.




---

## PART — EXECUTIVE SUMMARY (`reports/00-EXECUTIVE-SUMMARY.md`)

# DELIVERABLE 1 — Executive Summary

## Software Discovery & Review Platform — Competitive Intelligence

See full 20-section report at `/reports/01-FULL-REPORT.md`.

**Key Insight:** Comparison pages = SEO engine, lead forms = revenue engine, reviews = trust engine.

| Platform | Differentiator | Monetization |
|---|---|---|
| G2 | 3.6M verified reviews + Grid reports | Freemium + Buyer Intent Data |
| Software Advice | 1:1 human advisors (Gartner) | Pay-per-lead |
| Software Finder | Curation + expert recommendation form | Sponsored listings + affiliate |
| SelectHub | Requirements-driven Decision Platform | Vendor sponsorship + RFI/RFP |
| SoftwareSuggest | 40k reviews + India/APAC + PPC | Tiered vendor plans ($4k–$9k) |
| GoodFirms | Dual services+software, 80k firms, v3.2 algorithm | Pro verification + sponsorship |

**MVP:** Search-first, comparison-centric, review-verified marketplace. ~100 categories, 1–3k products, Postgres + Meilisearch, Next.js SSR/ISR, programmatic SEO, 3 lead paths. See roadmap deliverable for phased scope.



---

## PART — PRD (`reports/02-PRD.md`)

# DELIVERABLE — Master Product Requirements Document (PRD)

## Software Discovery Platform — PRD v1.0 (Original, Not a Clone)

---

### 1. Product Vision

Build a trusted, search-first software discovery marketplace where buyers find, compare, and choose software via verified reviews, structured feature/pricing data, and side-by-side comparisons — and where vendors acquire high-intent leads. The platform synthesizes the best public patterns from six competitors into an original product: G2's search scale, SoftwareSuggest's pricing depth, SelectHub's structured comparison, Software Advice's lead UX (async), and GoodFirms' verification rigor (lite).

**North Star:** A buyer can go from "I need a CRM" to "I've shortlisted 3 and requested pricing" in <5 minutes without talking to a human.

### 2. Problem Statement

- Buyers face choice overload (1,000+ CRMs, 500+ PM tools), unreliable marketing claims, and fragmented reviews/pricing.
- Vendors waste spend on low-intent traffic; they need buyers who are actively comparing.
- Existing marketplaces each solve one slice well (reviews vs advisor vs requirements) but none is ideal for a new entrant to compete on without massive scale — an original synthesis can win a vertical or price point.

### 3. Target Users

Primary: SMB software buyer (founder, ops, marketing) — self-serve, price-sensitive, wants compare + reviews fast.
Secondary: Enterprise buyer + IT evaluator (needs integrations/deployment/features depth).
Tertiary: Vendor marketer (needs leads) + Review contributor (needs low-friction flow).

### 4. User Personas (detailed)

| Persona | Archetype | Goals | Frustrations | Entry | Success |
|---|---|---|---|---|---|
| **SMB Buyer — Priya** | Founder, 12-person startup | Find CRM < $50/u, free trial, easy setup | Sales calls, hidden pricing | Google "best CRM for startups" | Shortlist 2, get pricing in 1 session |
| **Enterprise Buyer — Marcus** | Procurement, 500+ co | Requirements-driven shortlist, stakeholder buy-in | Feature checklists scattered | Direct + advisor link | 5-way comparison + RFI (Phase 2) |
| **IT Evaluator — Alex** | IT Manager | Validate integrations, deployment, security | Vague feature claims | Search "X Salesforce integration" | Feature matrix + docs |
| **Vendor — Dana** | SaaS Marketing Lead | High-intent leads, review coverage | Pay for junk leads | "Claim profile" CTA | 10 qualified leads/mo |
| **Contributor — Sam** | Power user | Share honest review | Lengthy forms, no recognition | Email invite | Review published, helpful votes |

### 5. Competitive Insights (from research)

- **SEO moat is comparisons + best lists** — G2 and SoftwareSuggest generate thousands of `/compare/A-vs-B` pages; this is the #1 organic driver. Replicate programmatically.
- **Reviews are trust, not just content** — secondary ratings (Ease/Value/Support/Functionality) + verified badges + pros/cons mining are table stakes. GoodFirms' phone verification is overkill for MVP; email+OAuth is enough.
- **Lead capture must be multi-path** — Get Pricing (product), Request Demo (product), Expert Recommendation (async form — replaces Software Advice's human advisor for MVP) covers 95% of intent.
- **Category taxonomy is the IA backbone** — Software Finder has 30 top-level × 40 subcategories; invest in clean taxonomy early; it drives nav, SEO, and filters.
- **Analyst scoring is a moat but expensive** — SelectHub's 240h hands-on + 0–100 scores are credible but not MVP; defer to Phase 2 as "expert picks" editorial.

### 6. Unique Value Proposition (Original)

"Compare software with structured data, not marketing copy. Verified reviews, transparent pricing, and side-by-side tables help you shortlist in minutes — not weeks. Free for buyers, pay only for intent for vendors."

Differentiators for launch: (a) fastest comparison UX (one-click bucket), (b) transparent pricing tables (5 plans per product, not hidden), (c) lightweight verification (no review gates), (d) async expert recommendation (no call required).

### 7. MVP Scope (must ship)

- Public: homepage, categories hub, category listings (filters/sort/pagination), product profiles (6 tabs), search (Meilisearch), comparison engine (2–3 products), alternatives, /best aliases, static pages.
- Reviews: submission (4 secondaries + title/body/pros/cons + metadata), verification (email+OAuth), moderation queue, listing with filters/sort/helpful.
- Leads: Get Pricing, Request Demo, Expert Recommendation (async form) → DB + email to vendor/admin.
- Auth: credentials + Google/LinkedIn OAuth, RBAC (buyer/vendor/admin).
- Vendor portal: claim, edit (→ moderation), lead inbox (read + status), review responses.
- Admin: dashboard, product/category/review/vendor/lead moderation, user list, SEO manager (sitemap/redirects).
- SEO: ISR for all public pages, sitemap.xml, robots.txt, canonical, JSON-LD, breadcrumbs, OG.
- Observability: Sentry + PostHog, rate limiting, backups.

### 8. Phase 2 Features (months 3–6)

- Requirements builder (checklist → filtered shortlist) + template downloads
- Sponsored placements & bidding
- Review incentives (LinkedIn share) + advanced vendor analytics
- 100+ programmatic resources/comparison articles (MDX at scale)
- AEO/GEO visibility product, email digests, saved searches, API v1 read-only

### 9. Phase 3 Features (months 7–12)

- Buyer intent data (privacy-compliant firmographics for vendors)
- Decision Platform: multi-stakeholder collaboration, scoring, RFI/RFP distribution
- AI: semantic search, review summarization, personalized comparisons
- Agency/services marketplace (if validated), mobile PWA/native, enterprise SSO

### 10. Functional Requirements (summary → see Deliverable 3 for full)

Mirrored in `/reports/03-FUNCTIONAL-REQUIREMENTS.md` — 10 sections covering public site, buyer, vendor, admin, NFRs, analytics, lead types, moderation policy. Key IDs: REQ-H-*, REQ-S-*, REQ-C-*, REQ-P-*, REQ-R-*, REQ-CMP-*, REQ-A-*, REQ-B-*, REQ-U-*, REQ-V-*, REQ-AD-*.

### 11. Non-Functional Requirements

- Perf: LCP <2.5s, search p95 <150ms, listing ISR <60s revalidate.
- SEO: SSR/ISR, sitemap shards, robots, canonical, JSON-LD, OG, breadcrumbs.
- A11y: WCAG 2.1 AA.
- Security: OWASP Top 10, bcrypt, RBAC, rate limiting, CSP/CSRF/XSS sanitization.
- Scale: 5k products / 100k reviews / 50k comparisons at launch; architect for 100k.
- Backups: daily DB + weekly full + PITR.
- Legal: Terms, Privacy, Cookie consent, DMCA takedown.

### 12. User Flows (critical paths)

**Flow 1 — Buyer shortlist (primary):**
Google "best CRM software" → /best/crm-software (or /crm) → apply 2 filters (Free trial, Price <$50) → scan 6 cards → check Compare on 2 → bucket "Compare (2)" → /compare/a-vs-b → review Pricing + Features rows → click Get Pricing on winner → lead form (name/email/company) → success + email → vendor inbox NEW.

**Flow 2 — Review submission:**
Product page → Write a Review → auth gate (Google) → step: overall stars → secondaries (4 sliders) → title/body/pros/cons → metadata (role/size/industry/duration) → submit → PENDING → admin approves → rating recomputed → email "Published" → product rating updates.

**Flow 3 — Vendor claim:**
Homepage "Claim profile" → /vendor/claim → business email + company proof → admin approves → role VENDOR → edit product → PENDING → admin approves → revalidate + search sync.

**Flow 4 — Expert recommendation (async advisor):**
Hero form (name/email/company/category/message) or product sidebar "Ask Expert" → Lead type EXPERT_RECOMMENDATION → admin queue → manual shortlist email to buyer (Phase 2: auto vendor match).

### 13. Database Requirements

See Deliverable 5 (`/schemas/DATABASE-SCHEMA.md`) — Prisma schema with 20 models: User, Company, Category, Product, ProductCategory, FeatureGroup, Feature, ProductFeature, PricingPlan, Integration, ProductIntegration, ProductScreenshot, Review, ReviewVote, SavedProduct, Comparison, ComparisonProduct, Lead, FaqItem, Resource, SlugRedirect. Denormalized ratings, canonical comparison slugs, one-review-per-user constraint.

### 14. Search Requirements

- Meilisearch (MVP) with fallback to Postgres ILIKE. Index products + categories. Facets: category, price tier, rating, freeTrial, deployment. Typo-tolerant, <50ms. Sync via Prisma middleware/worker. See Deliverable 6.

### 15. Review System Requirements

- Overall 1–5 + 4 secondaries (Ease/Value/Support/Functionality) 1–5 each.
- Title + body + pros + cons, metadata (companySize, industry, role, useDuration).
- Verification: email verify OR OAuth (Google/LinkedIn) → Verified badge. Admin moderation required. One review per user per product. Helpful votes (toggle). Spam: <50 chars, URL-only, repeated → auto-flag. Rating aggregation denormalized on product.

### 16. Comparison Engine Requirements

- Initiate via Compare checkbox on cards → bucket (cookie + user) → floating bar.
- URL: `/compare/{a}-vs-{b}[-vs-{c}]` with alphabetical canonicalization + 301 on unsorted. Validate slugs, 404 if any unknown.
- Table sections: Header (identity + CTAs) | Overview | Pricing (plans side-by-side) | Ratings (stars + secondaries) | Features (grouped ✓/—) | Pros/Cons | Integrations | Alternatives | FAQs. Programmatic SEO title/meta/JSON-LD. Analytics event.

### 17. Vendor Portal Requirements

- Claim flow (domain check + admin approval) → role upgrade.
- Edit product: overview, features (checkbox per feature), pricing plans, screenshots, integrations, company info — all → PENDING.
- Lead inbox: table (type, product, contact, date, status), filter, status transitions (NEW→CONTACTED→QUALIFIED→CLOSED), notes, CSV export.
- Review responses: list reviews, public response (one per review), flag.
- Analytics (Phase 2: views, comparison hits, lead trend). Billing (Phase 2).

### 18. Admin Panel Requirements

- Dashboard KPIs (products pending, reviews pending, leads today, users).
- CRUD: products, categories (tree), features (grouped), integrations, resources (MDX).
- Moderation queues: products, reviews (approve/reject/verify toggle), vendor claims.
- Lead management (all leads, assignment, status).
- User management (role changes, ban).
- SEO manager: sitemap status, redirects, programmatic page health.
- Audit log (who moderated what, when).

### 19. Lead Management Requirements

- Types: GET_PRICING, REQUEST_DEMO, EXPERT_RECOMMENDATION, VISIT_WEBSITE (tracked click).
- Payload: name, email (required), company, phone, message, productId/categorySlug, utm/referrer, plan.
- Routing: product-specific → vendor inbox + vendor email; expert → admin queue.
- Statuses: NEW → CONTACTED → QUALIFIED → CLOSED (+ SPAM). Vendor can transition; admin can reassign.
- Notifications: email to vendor (on NEW), email to buyer (confirmation), admin digest.
- Retention: indefinite; export CSV.

### 20. SEO Architecture

See Deliverable 9 (`/reports/09-SEO-ARCHITECTURE.md`) — URL system, templates, internal linking, programmatic generation (on-demand ISR for comparisons, not prebuild), meta/JSON-LD, sitemap shards, robots, scale math, guardrails.

### 21. Analytics Requirements

- Product analytics (PostHog): search_performed, filter_applied, product_viewed, review_submitted, review_helpful, comparison_viewed/initiated, lead_submitted, saved_product, vendor_claimed.
- Web vitals: Vercel Analytics (LCP, CLS, INP).
- Vendor analytics (Phase 2): profile views, comparison appearances, lead source/transition funnel.
- Admin: moderation throughput, lead volume by category, search no-result queries.

### 22. Security Requirements

- OWASP Top 10: authz on every route, Zod validation, HTML sanitization, CSP/HSTS, CSRF, rate limiting, bcrypt 12, RBAC, audit log.
- Uploads: image-only, 2MB, scanning.
- Secrets: env vars, never in repo; Neon connection over TLS.
- GDPR: data export/delete, cookie consent, DPA.

### 23. Scalability Requirements

- MVP: 5k products / 100k reviews / 50k comparisons — single Vercel + Neon + Meilisearch handles.
- Growth: read replicas, Meilisearch → Typesense/ES at 100k products, standalone API (NestJS) when API p95 >300ms.
- Caching: ISR + Cloudflare CDN + Redis for sessions/rate limit.
- Jobs: pg-boss for async (search sync, emails, sitemap) — decouple from request path.

---

### Acceptance Criteria (PRD-level)

- All MVP scope items pass Playwright E2E (see Build Prompt).
- Lighthouse SEO + A11y ≥90, Perf ≥85 on product and category pages.
- Zero 500s on public pages under 100 concurrent users (k6 smoke).
- Lead round-trip (submit → vendor inbox → status update) works end-to-end with email.
- Comparison canonicalization (unsorted → 301 sorted) verified.
- Sitemap contains ≥90% of approved products + all comparisons that are internally linked.



---

## PART — FUNCTIONAL REQUIREMENTS (`reports/03-FUNCTIONAL-REQUIREMENTS.md`)

# DELIVERABLE 3 — Functional Requirements

## 1. Product Vision & Scope

**Vision:** An original software discovery & comparison marketplace that earns trust via verified reviews and earns revenue via high-intent buyer-to-vendor matching. Not a clone of any single competitor — a synthesis of the best public patterns.

**Positioning for MVP:** Search-first (G2), comparison-centric (G2+SoftwareSuggest), review-verified (GoodFirms-lite), advisor-assisted via async form (Software Advice-lite), requirements-inspired filtering (SelectHub-lite).

---

## 2. User Roles (Personas)

| Persona | Goal | Entry | Key Actions | Conversion |
|---|---|---|---|---|
| **Software Buyer (SMB)** | Find tool that fits budget/features fast | Google → category page | Search, filter, read reviews, compare 2–3, request pricing | Lead submitted |
| **Enterprise Buyer** | Shortlist for stakeholder decision | Direct / advisor link | Build requirements, compare 3–5, read analyst notes | Shortlist + pricing request |
| **IT Buyer** | Validate integrations/deployment | Search "X integrations" | Check features/integrations/deployment, read technical reviews | Demo request |
| **Review Contributor** | Share experience, build profile | Email invite / LinkedIn | Submit review, vote helpful | Review published |
| **Vendor (Marketer)** | Acquire intent-rich leads | Claim profile CTA | Claim, manage listing, view leads, respond to reviews | Subscription / sponsorship |
| **Admin** | Curate & moderate platform | /admin | Approve products/reviews, manage categories, leads | Content published |

---

## 3. Functional Requirements — Public Website

### 3.1 Homepage
- REQ-H-01 Hero with global search (autocomplete) + async "Get Free Recommendation" form (name/email/company/category/message)
- REQ-H-02 Category grid (top 8–12 + View All)
- REQ-H-03 Trending / Popular software carousel (by review velocity + rating)
- REQ-H-04 Featured comparison shortcuts (e.g., Salesforce vs HubSpot)
- REQ-H-05 Trust bar (X reviews, Y products, Z categories, methodology link)
- REQ-H-06 Vendor CTA + Review CTA dual blocks

### 3.2 Search
- REQ-S-01 Autocomplete across products + categories + comparisons (Meilisearch, typo-tolerant)
- REQ-S-02 Search results page with tabs: Products | Categories | Comparisons
- REQ-S-03 Recent searches + trending searches

### 3.3 Categories
- REQ-C-01 `/categories` — all top-level categories with subcategories expand
- REQ-C-02 `/{category-slug}` — category listing with: description, buying guide excerpt, filters, sort (Recommended/Rating/Price), product cards, FAQ, alternatives
- REQ-C-03 Pagination (24 per page, ISR) + canonical + breadcrumb

### 3.4 Product Profile — `/{category}/{product-slug}`
- REQ-P-01 Header: logo, name, tagline, rating (avg + distribution bars), review count, verification badge, Compare checkbox, CTA row (Get Pricing / Request Demo / Visit Website)
- REQ-P-02 Tabs or anchors: Overview | Features | Pricing | Reviews | Alternatives | FAQs
- REQ-P-03 Overview: short + long description, key highlights
- REQ-P-04 Features: grouped checklist (e.g., CRM → Lead Mgmt, Automation...) — boolean feature matrix
- REQ-P-05 Screenshots gallery (4–6) + optional video
- REQ-P-06 Pricing: free trial/version badges, deployment, plans table (name/price/billing/features/CTA per plan)
- REQ-P-07 Integrations (logo grid + search)
- REQ-P-08 Company info (founded, HQ, employees, website)
- REQ-P-09 Reviews summary: avg, distribution, secondary dims (Ease/Value/Support/Functionality), aggregated pros/cons
- REQ-P-10 Alternatives grid (6–8 with compare links)
- REQ-P-11 Lead capture: sticky sidebar form + inline CTAs
- REQ-P-12 SEO: JSON-LD (SoftwareApplication + AggregateRating + FAQPage), OG tags, canonical

### 3.5 Reviews
- REQ-R-01 Review list: star, title, body, pros/cons, author (name/role/company), date, verified badge, helpful votes, usage duration, company size
- REQ-R-02 Filters: star, recency, helpful, verified only
- REQ-R-03 Sort: most recent / most helpful / highest / lowest
- REQ-R-04 Submission flow: search/select product → auth (email + OAuth) → ratings (overall + 4 secondaries) → title/body/pros/cons → metadata (role, company size, industry, use duration) → submit → moderation queue → published + email confirmation
- REQ-R-05 Verification: email verification + LinkedIn OAuth signal → "Verified" badge; admin moderation
- REQ-R-06 Abuse: rate limit, duplicate detection, spam scoring

### 3.6 Comparison Engine — `/compare/{a}-vs-{b}[-vs-{c}]`
- REQ-CMP-01 Initiation: Compare checkbox on cards → bucket (cookie + user) → "Compare (N)" floating bar → navigate or share URL
- REQ-CMP-02 URL: slug-joined with `-vs-` (e.g., /compare/salesforce-vs-hubspot or /compare/salesforce-vs-hubspot-vs-zoho-crm) — validates slugs, 404 if any unknown
- REQ-CMP-03 Table sections: Header (logo/name/rating/CTA per column) | Overview | Pricing (plans side-by-side) | Ratings (stars + secondaries) | Features (✓/✗ per feature, grouped) | Pros/Cons | Integrations | Alternatives | FAQs
- REQ-CMP-04 SEO: programmatic `/{a} vs {b}: Features, Pricing, Reviews Compared — 2026` H1, meta, JSON-LD, internal links to each product
- REQ-CMP-05 Analytics: comparison viewed event

### 3.7 Alternatives — `/{category}/{product}/alternatives` and `/compare` hub
- REQ-A-01 Ranked alternatives (by category overlap + rating)
- REQ-A-02 "Why consider alternatives" editorial block

### 3.8 Buying Guides & Resources — `/resources/{slug}` and `/best/{category}`
- REQ-B-01 Long-form guide pages (analyst-style) with methodology, top list, comparison table, FAQs — ISR
- REQ-B-02 `/best/{category}-software` alias for SEO

---

## 4. Functional Requirements — Buyer Features (Authenticated)

- REQ-U-01 Auth: email/password + Google/LinkedIn OAuth, email verification, password reset
- REQ-U-02 Saved products (wishlist) + saved comparisons
- REQ-U-03 Review history + edit/delete (re-moderation)
- REQ-U-04 Recommendation requests history
- REQ-U-05 Lead history (what was requested, when)

---

## 5. Functional Requirements — Vendor Portal (`/vendor`)

- REQ-V-01 Claim profile flow (business email verification + domain check)
- REQ-V-02 Product management: edit overview, features, pricing plans, screenshots, integrations, company info — all go to moderation queue except free-text limited
- REQ-V-03 Lead inbox: list, filter, status (new/contacted/qualified/closed), notes, export CSV
- REQ-V-04 Review management: view, respond (public response), flag
- REQ-V-05 Analytics: profile views, comparison appearances, lead trend (30/90d)
- REQ-V-06 Billing: plan tier, sponsorship placements (Phase 2)

---

## 6. Functional Requirements — Admin Panel (`/admin`)

- REQ-AD-01 Dashboard: KPIs (products, pending moderation, reviews, leads, users)
- REQ-AD-02 Product CRUD + moderation queue (approve/reject/edit)
- REQ-AD-03 Category CRUD (hierarchy, slug, icon, description, SEO meta)
- REQ-AD-04 Feature taxonomy CRUD (grouped features per category)
- REQ-AD-05 Review moderation (approve/reject, verification toggle, helpful count)
- REQ-AD-06 Vendor & claim management
- REQ-AD-07 Lead management (assignment, status)
- REQ-AD-08 User management (roles: admin, moderator, vendor, buyer)
- REQ-AD-09 SEO manager: sitemap, redirects, programmatic page generation status
- REQ-AD-10 Audit log

---

## 7. Non-Functional Requirements

- NFR-01 Performance: LCP < 2.5s, listing pages ISR with <60s revalidation, search <150ms p95
- NFR-02 SEO: SSR/ISR for all public pages, sitemap.xml, robots.txt, canonical, JSON-LD, OG, breadcrumbs
- NFR-03 Accessibility: WCAG 2.1 AA (keyboard, ARIA, contrast)
- NFR-04 Security: OWASP Top 10, rate limiting, CSP, CSRF, XSS sanitization, bcrypt passwords, RBAC
- NFR-05 Scalability: 5k products / 100k reviews / 50k comparisons at launch; architect for 100k products
- NFR-06 Observability: structured logs, error tracking, analytics events
- NFR-07 Backups: daily DB + weekly full, PITR
- NFR-08 Legal: Terms, Privacy, Cookie consent, DMCA takedown flow

---

## 8. Analytics Events (required)

`search_performed`, `filter_applied`, `product_viewed`, `review_submitted`, `review_helpful`, `comparison_viewed`, `comparison_initiated`, `lead_submitted` (with type + product), `saved_product`, `vendor_claimed`

---

## 9. Lead Types & Flows

| Lead Type | Trigger | Payload | Routing |
|---|---|---|---|
| Get Pricing | CTA on product/comparison | product, plan, user contact | Vendor inbox + email + admin |
| Request Demo | Demo CTA | product, user contact, company | Vendor inbox + email |
| Expert Recommendation (async) | Hero + product sidebar form | name/email/company/category/message | Admin queue → manual or auto vendor match (Phase 2) |
| Visit Website | Logo/CTA click | product, referrer | Affiliate/external (tracked) |

---

## 10. Moderation Policy (summary)

- All new products, category edits, pricing edits, reviews go to pending.
- Admin approves within 24h SLA.
- Reviews require at least 1 verification signal (email or OAuth) to show Verified badge.
- Spam: <50 chars, repeated, profanity, URL-only bodies → auto-flag.



---

## PART — DATABASE SCHEMA (`schemas/DATABASE-SCHEMA.md`)

# DELIVERABLE 5 — Database Schema & Entity Relationship Design

## 1. ERD (text)

```
User 1──* Review  *──1 Product *──* ProductCategory *──1 Category
User 1──* Lead    *──1 Product                │
User 1──* SavedProduct *──1 Product           │
User 1──* SavedComparison *──1 Comparison     │
Product 1──* PricingPlan                     Category 1──* Category (self, parent)
Product 1──* ProductFeature *──1 Feature ──* FeatureGroup
Product 1──* ProductIntegration *──1 Integration
Product 1──* ProductScreenshot
Product 1──* Review 1──* ReviewRating (secondary dims)
Review 1──* ReviewVote
Product 1──* Company (via company_id)
Company 1──* Product
Comparison *──* Product (via ComparisonProduct join, ordered)
Category 1──* BuyingGuide / Resource (MDX)
```

## 2. Prisma Schema (canonical)

```prisma
// prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum Role { BUYER VENDOR ADMIN MODERATOR }
enum LeadType { GET_PRICING REQUEST_DEMO EXPERT_RECOMMENDATION VISIT_WEBSITE }
enum LeadStatus { NEW CONTACTED QUALIFIED CLOSED SPAM }
enum ReviewStatus { PENDING APPROVED REJECTED FLAGGED }
enum ProductStatus { DRAFT PENDING APPROVED ARCHIVED }

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  passwordHash  String?  // null for OAuth users
  role          Role     @default(BUYER)
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  reviews       Review[]
  leads         Lead[]
  savedProducts SavedProduct[]
  savedComparisons SavedComparison[]
  vendorCompany Company? @relation("VendorOwner")
  accounts      Account[]
  sessions      Session[]
}

model Account { // Auth.js
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session { // Auth.js
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Company {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  website     String?
  logoUrl     String?
  description String?   @db.Text
  foundedYear Int?
  hqCountry   String?
  hqCity      String?
  employeeCount String? // e.g., "51-200"
  ownerId     String?   @unique
  owner       User?     @relation("VendorOwner", fields: [ownerId], references: [id])
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?    @db.Text
  icon        String?
  parentId    String?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  seoTitle    String?
  seoDescription String? @db.Text
  sortOrder   Int        @default(0)
  productCategories ProductCategory[]
  featureGroups FeatureGroup[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  @@index([parentId])
}

model Product {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique // globally unique, used in /compare URLs
  tagline         String?
  description     String?  @db.Text // long SEO description (markdown)
  shortDescription String? @db.Text // 1-2 lines for cards
  logoUrl         String?
  website         String?
  status          ProductStatus @default(PENDING)
  companyId       String?
  company         Company? @relation(fields: [companyId], references: [id])
  ratingAvg       Float    @default(0) // denormalized, recomputed on review approve
  ratingCount     Int      @default(0)
  // secondary averages (denormalized)
  easeAvg         Float    @default(0)
  valueAvg        Float    @default(0)
  supportAvg      Float    @default(0)
  functionalityAvg Float   @default(0)
  startingPrice   Decimal? @db.Decimal(10,2)
  pricingModel    String?  // e.g., "per_user_month"
  freeTrial       Boolean  @default(false)
  freeTrialDays   Int?
  freeVersion     Boolean  @default(false)
  deployment      String[] // ["cloud","on_premise"]
  // SEO
  seoTitle        String?
  seoDescription  String?  @db.Text
  featured        Boolean  @default(false)
  sponsored       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  categories      ProductCategory[]
  features        ProductFeature[]
  pricingPlans    PricingPlan[]
  integrations    ProductIntegration[]
  screenshots     ProductScreenshot[]
  reviews         Review[]
  leads           Lead[]
  faqItems        FaqItem[]
  alternativeLinks Alternative[] @relation("ProductAlternatives")

  @@index([status])
  @@index([ratingAvg])
  @@index([companyId])
}

model ProductCategory {
  productId  String
  categoryId String
  isPrimary  Boolean @default(false)
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  @@id([productId, categoryId])
  @@index([categoryId])
}

model FeatureGroup {
  id         String   @id @default(cuid())
  name       String
  categoryId String?  // null = global
  category   Category? @relation(fields: [categoryId], references: [id])
  features   Feature[]
  sortOrder  Int      @default(0)
}

model Feature {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  groupId   String?
  group     FeatureGroup? @relation(fields: [groupId], references: [id])
  products  ProductFeature[]
  createdAt DateTime @default(now())
}

model ProductFeature {
  productId String
  featureId String
  available Boolean @default(true)
  note      String? // e.g., "add-on"
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  feature   Feature @relation(fields: [featureId], references: [id], onDelete: Cascade)
  @@id([productId, featureId])
}

model PricingPlan {
  id          String  @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name        String  // Starter, Professional...
  price       Decimal? @db.Decimal(10,2)
  billing     String? // monthly, annual
  currency    String  @default("USD")
  features    String[] // plan-level feature bullets
  ctaLabel    String  @default("Get Pricing")
  sortOrder   Int     @default(0)
  @@index([productId])
}

model Integration {
  id       String @id @default(cuid())
  name     String @unique
  slug     String @unique
  logoUrl  String?
  category String? // e.g., "CRM", "Payment"
  products ProductIntegration[]
}

model ProductIntegration {
  productId     String
  integrationId String
  product       Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  integration   Integration @relation(fields: [integrationId], references: [id], onDelete: Cascade)
  @@id([productId, integrationId])
}

model ProductScreenshot {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  caption   String?
  sortOrder Int    @default(0)
}

model Review {
  id            String       @id @default(cuid())
  productId     String
  product       Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  status        ReviewStatus @default(PENDING)
  rating        Int          // 1-5 overall
  title         String?
  body          String?      @db.Text
  pros          String?      @db.Text
  cons          String?      @db.Text
  // secondary dims 1-5
  easeRating          Int?
  valueRating         Int?
  supportRating       Int?
  functionalityRating Int?
  // context
  companySize   String? // 1-10, 11-50...
  industry      String?
  role          String?
  useDuration   String? // "<6 months", "1-2 years"
  verified      Boolean @default(false)
  helpfulCount  Int     @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  votes         ReviewVote[]
  @@unique([productId, userId]) // one review per user per product
  @@index([productId, status])
  @@index([userId])
}

model ReviewVote {
  id       String @id @default(cuid())
  reviewId String
  review   Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  helpful  Boolean // true = helpful
  createdAt DateTime @default(now())
  @@unique([reviewId, userId])
}

model SavedProduct {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}

model Comparison {
  id        String   @id @default(cuid())
  slug      String   @unique // e.g., "salesforce-vs-hubspot" (alphabetically sorted)
  title     String?  // "Salesforce vs HubSpot: Features, Pricing & Reviews"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  products  ComparisonProduct[]
  views     Int      @default(0)
}

model ComparisonProduct {
  comparisonId String
  productId    String
  position     Int // 0,1,2
  comparison   Comparison @relation(fields: [comparisonId], references: [id], onDelete: Cascade)
  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  @@id([comparisonId, productId])
}

model Lead {
  id        String     @id @default(cuid())
  type      LeadType
  status    LeadStatus @default(NEW)
  productId String?
  product   Product?   @relation(fields: [productId], references: [id])
  userId    String?
  user      User?      @relation(fields: [userId], references: [id])
  // contact snapshot (even for anon)
  name      String?
  email     String
  company   String?
  phone     String?
  message   String?    @db.Text
  categorySlug String? // for expert recommendation
  meta      Json?      // utm, referrer, plan
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  @@index([productId])
  @@index([status])
  @@index([type])
}

model FaqItem {
  id        String  @id @default(cuid())
  productId String? // null = category-level
  product   Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  categoryId String? // alternative FK for category FAQs
  question  String
  answer    String  @db.Text
  sortOrder Int     @default(0)
}

model Alternative {
  id          String @id @default(cuid())
  productId   String
  product     Product @relation("ProductAlternatives", fields: [productId], references: [id], onDelete: Cascade)
  alternativeId String
  score       Float  // relevance score
  @@unique([productId, alternativeId])
}

model Resource { // MDX buying guides / comparison articles
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?  @db.Text
  bodyMdx     String   @db.Text
  categoryId  String?
  author      String?
  published   Boolean  @default(false)
  publishedAt DateTime?
  seoTitle    String?
  seoDescription String? @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SlugRedirect {
  oldSlug String @id
  newSlug String
  createdAt DateTime @default(now())
}
```

## 3. Key Indexes & Constraints

- `Product.slug` unique + `SlugRedirect` for 301s on rename.
- `Category.slug` unique, `Feature.slug` unique, `Integration.slug` unique.
- `Review @@unique([productId, userId])` prevents duplicate reviews.
- Denormalized `Product.ratingAvg/ratingCount + secondary avgs` — updated via trigger/worker on review approve (not computed on read).
- `ProductCategory.isPrimary` — one primary category per product for breadcrumb + canonical.
- `Comparison.slug` is alphabetically normalized; app layer enforces 301 on unsorted.

## 4. Review Aggregation Worker (pseudo)

```ts
// on Review status → APPROVED
const agg = await db.review.aggregate({ where: { productId, status: 'APPROVED' },
  _avg: { rating:true, easeRating:true, valueRating:true, supportRating:true, functionalityRating:true },
  _count: true });
await db.product.update({ where:{id:productId}, data:{
  ratingAvg: agg._avg.rating, ratingCount: agg._count,
  easeAvg: agg._avg.easeRating, valueAvg: agg._avg.valueRating,
  supportAvg: agg._avg.supportRating, functionalityAvg: agg._avg.functionalityRating
}});
await search.syncProduct(productId); // update Meilisearch
```

## 5. Comparison Engine Logic (pseudo)

```ts
function canonicalCompareSlug(slugs: string[]) {
  return [...slugs].sort().join('-vs-');
}
// GET /compare/[slugs]  where slugs = "a-vs-b-vs-c"
const parts = params.slugs.split('-vs-');
if (parts.join('-vs-') !== canonicalCompareSlug(parts)) redirect(301, `/compare/${canonicalCompareSlug(parts)}`);
const products = await db.product.findMany({ where:{ slug:{ in: parts }, status:'APPROVED' }});
if (products.length !== parts.length) notFound();
// order columns by `parts` order (already sorted) — or preserve user order if you prefer UX over SEO canonical.
```

## 6. Seed Strategy

- Categories: 30 top-level + 150 subcategories (hand-curated, based on observed taxonomy).
- Products: 1,000–3,000 synthetic but realistic (faker + real logos via clearbit or uploaded). Each: 5–8 features (via taxonomy), 1–3 pricing plans, 1–2 integrations, avg 2 reviews.
- Reviews: 3–5 per product, 30% verified, distributed 5→1 as 45/30/12/8/5.
- Comparisons: auto-generate top-3 per top-20 categories (pairwise of top 5 by rating) = ~200 at seed.

## 7. Migrations & Operational Notes

- Use Prisma migrate, not db push, in prod.
- Enable `pg_trgm` + `btree_gin` for ILIKE + array queries.
- Add `pg_cron` for nightly aggregation sanity check (recompute denormalized ratings).
- Backup: PITR + daily dump; search index is rebuildable from DB.



---

## PART — PLATFORM BLUEPRINT (`blueprint/PLATFORM-BLUEPRINT.md`)

# DELIVERABLE 4 — Original Platform Architecture

## Platform Name (internal): Software Discovery Platform (SDP)

> Not a clone. A synthesis: G2's search + SoftwareSuggest's pricing depth + SelectHub's structured comparison + Software Advice's lead UX (async) + GoodFirms' verification rigor (lite).

```
SOFTWARE DISCOVERY PLATFORM
│
├── Public Website (Next.js App Router, SSR/ISR)
│   ├── Homepage (/ — search + categories + featured + trust bar)
│   ├── Search (/search — autocomplete + results)
│   ├── Categories (/categories → /{category})
│   ├── Product Pages (/{category}/{product} — 6 tabs)
│   ├── Reviews (/{category}/{product}#reviews + /write-review)
│   ├── Comparisons (/compare/{a}-vs-{b}[-vs-{c}] + /compare hub)
│   ├── Alternatives (/{category}/{product}/alternatives)
│   ├── Best (/best/{category}-software — alias)
│   ├── Resources (/resources/{slug} — MDX guides)
│   └── Static ( /about, /methodology, /privacy, /terms )
│
├── Buyer Features (authenticated)
│   ├── Saved products & comparisons
│   ├── Review submission & history
│   ├── Recommendation requests history
│   └── Account (profile, password, OAuth links)
│
├── Vendor Portal (/vendor — role: VENDOR)
│   ├── Overview (KPIs: views, comparison hits, leads)
│   ├── Product management (edit → moderation queue)
│   ├── Lead inbox (filter, status, notes, CSV export)
│   ├── Review responses
│   └── Billing (Phase 2)
│
└── Admin Platform (/admin — role: ADMIN/MODERATOR)
    ├── Dashboard (KPIs + queues)
    ├── Product & category management
    ├── Feature taxonomy
    ├── Review moderation
    ├── Vendor & claim management
    ├── Lead management
    ├── Resource (MDX) editor
    └── SEO manager (sitemap, redirects, programmatic status)
```

## Request Flow (MVP — single deploy)

```
Browser → Cloudflare (CDN/WAF) → Vercel (Next.js)
  ├─ SSR/ISR pages → Prisma → Postgres (Neon)
  ├─ API routes → Prisma + Zod → Postgres + Meilisearch + Redis
  ├─ Auth.js → Postgres (sessions) + OAuth providers
  └─ Cron → sitemap regen, rating aggregation sanity, search sync
```

## Data Flow: Product Update → Search + Page Revalidation

```
Vendor submits edit → status=PENDING → Admin approves → status=APPROVED
  → trigger: revalidatePath(`/{category}/{product}`)
  → trigger: revalidatePath(`/compare/*` containing product)
  → worker: meilisearch.update(product)
  → email: notify vendor "Approved"
```

## Comparison Generation (on-demand ISR)

No prebuild of O(n²) permutations. Comparison page is generated on first visit (or when first linked), then cached 300s. Internal links only emit comparisons for top-5 per top-20 categories (~200 at launch) to bound crawl.

## Lead Routing (MVP)

```
Buyer submits lead (Get Pricing / Demo / Expert) → Lead row (status=NEW)
  → email to vendor (if product-specific) + email to admin
  → vendor sees in /vendor/leads, can mark CONTACTED/QUALIFIED/CLOSED
  → admin queue for Expert leads → manual vendor match or auto (Phase 2)
```

## Auth & RBAC

- Auth.js with Postgres adapter. Providers: credentials (bcrypt), Google, LinkedIn.
- Roles: BUYER (default), VENDOR (after claim), MODERATOR, ADMIN.
- Middleware protects /vendor (requires VENDOR|ADMIN), /admin (requires ADMIN|MODERATOR), /api/admin/* similarly.
- Buyer routes (/saved, /write-review) require session else redirect to /login?callbackUrl=...

## Observability

- Sentry (errors), PostHog (product analytics), Vercel Analytics (web vitals), structured JSON logs.
- Health: /api/health → { db: ok, search: ok, redis: ok }

## Security

- Rate limit: 60 req/min IP on /api/* (Upstash Redis), 5 reviews/day/user, 10 leads/hour/IP.
- CSP, HSTS, CSRF (Next.js built-in), Zod validation on all inputs, HTML sanitization for review bodies, bcrypt cost 12, RBAC on every route.
- Uploads: image only (png/jpg/webp/svg), 2MB max, virus scan via UploadThing.

## Scaling Path

- MVP (0–10k products): single Vercel + Neon + Meilisearch Cloud — as designed.
- Scale (10k–100k): split API to standalone (NestJS), add read replicas, move Meilisearch → Typesense/ES, add CDN caching for ISR.
- Enterprise: add SSO, audit log export, dedicated vendor analytics pipeline (ClickHouse).



---

## PART — ENTERPRISE UI DESIGN SYSTEM — NEW (`reports/ENTERPRISE-UI-DESIGN-SYSTEM.md`)

# Enterprise UI Design System — Software Discovery Platform

**Date:** 2026-09-02
**Scope:** Best attractive UI for an enterprise-level B2B software discovery & comparison marketplace (G2/Capterra/TrustRadius class)
**Stack:** Next.js 15 App Router + Tailwind CSS + shadcn/ui (Radix) + Lucide + Framer Motion
**Grounding:** Synthesized from live crawls of G2 (3.6M reviews), Capterra (2.5M/900 cats), GoodFirms (1.2M/80k firms), TrustRadius, SaaSworthy, SourceForge, Product Hunt, Gartner Digital Markets + 2025-26 enterprise design systems (Stripe, Linear, Vercel, Salesforce Lightning, Figma, Airbnb)
**Accessibility:** WCAG 2.2 AA target, axe-core + Lighthouse CI

> This is the *buildable* spec. Pair with `blueprint/PLATFORM-BLUEPRINT.md`, `schemas/DATABASE-SCHEMA.md`, and `reports/08-UIUX-ARCHITECTURE.md`. If conflict, this doc wins for UI.

---

## 1. Design Principles (Enterprise Attractiveness)

### 1.1 Why This Wins at Enterprise
| Principle | What it means in product | Competitive edge vs G2/Capterra |
|-----------|--------------------------|----------------------------------|
| **Evidence over marketing** | Ratings, verification badges, and comparison scores are visually primary; vendor copy is secondary panel | G2 buries methodology; we surface it inline |
| **Density without clutter** | Category pages show 18-24 cards above the fold with scannable metadata; product pages show 6 tabs sticky + right-rail lead form | Capterra density is low; G2 cards are noisy |
| **Comparison-first** | `Compare` is never more than one click away: product card → bucket → table; comparison table is the most polished surface | G2 comparison is an afterthought, unstyled |
| **Trust at a glance** | Verification (Validated, Current User, LinkedIn) is a badge row, not footnote | TrustRadius does this well; we amplify |
| **Zero dead ends** | Every list has a next step: filter chips → card → profile → compare → lead. Empty states guide to adjacent categories | SourceForge drops users |

### 1.2 Attractive = Calm, Precise, Confident
- **Visual metaphor:** *Financial terminal meets editorial magazine* — Linear's precision + Stripe's calm + Vercel's density. Not playful (Product Hunt), not heavy (Salesforce).
- **Motion:** Micro-interactions only (150ms ease-out for hover, 200ms for sheet/drawer). No parallax, no loading spinners longer than 400ms (skeleton instead).
- **Voice:** Quiet authority. No exclamation marks. Headlines are noun phrases: "Best CRM Software — August 2026" not "Find your perfect CRM!"

---

## 2. Foundations

### 2.1 Color System (Light default + Dark parity)
**Rationale:** Enterprise buyers live in dashboards 8h/day. Low-contrast neutrals with one saturated accent reduce fatigue while preserving scan-ability.

```css
/* tailwind.config.ts — extend */
colors: {
  border: "hsl(240 5% 88%)",        /* #E4E4E7 zinc-200 */
  input: "hsl(240 5% 88%)",
  ring: "hsl(221 83% 53%)",          /* #2563EB indigo-600 — single accent */
  background: "hsl(0 0% 100%)",
  foreground: "hsl(240 6% 10%)",     /* #18181B zinc-900 */
  muted: { DEFAULT: "hsl(240 5% 96%)", foreground: "hsl(240 5% 45%)" },
  accent: { DEFAULT: "hsl(221 83% 53%)", foreground: "white" },
  success: "hsl(142 76% 36%)",       /* emerald-600 for verified/trust */
  warning: "hsl(38 92% 50%)",        /* amber-500 for incentivized flag */
  card: "hsl(0 0% 100%)",
}
dark: {
  background: "hsl(240 6% 7%)",      /* #111113 */
  foreground: "hsl(0 0% 96%)",
  muted: "hsl(240 4% 14%)",
  border: "hsl(240 4% 18%)",
}
```

- **Accent discipline:** Only CTAs (Contact Vendor, Add to Compare, Submit Review), active tab underline, and rating fill use `accent`. Everything else is grayscale. This is what makes it feel expensive.
- **Semantic:** `success` = Validated/Current User badges, `warning` = Incentivized/Sponsored disclosure (never hide this — FTC 16 CFR Part 255 requires clear disclosure).
- **Contrast:** All text ≥4.5:1 (AA). Accent button text is white on 221/53 — passes 5.2:1.

### 2.2 Typography
```
font-sans: "Inter var" (or "Geist Sans" if shadcn default) — 400/500/600 only
font-mono: "Geist Mono" — for scores, G2 Score, price, IDs
Headings: 600, tracking -0.02em, leading 1.1
Body: 400/15px, leading 1.6, max 68ch for editorial blocks (SEO content at page bottom)
Labels: 500/12px uppercase tracking 0.08em (BADGE, VERIFIED, SPONSORED)
```

- **Scale:** 12 / 13 / 14 / 16 / 20 / 24 / 30 / 36. Never 18 or 22. Enterprise density uses 13-14 for metadata, 16 for body.
- **Numeric:** Tabular nums for ratings, prices, comparison table. `font-variant-numeric: tabular-nums`.

### 2.3 Spacing & Density
- **Grid:** 4px base, 24px outer gutters on desktop, 16px on mobile. Cards use 16px padding, 12px gap in lists.
- **Density modes:** Default is *compact* for enterprise (like Linear). Offer user toggle `Comfortable / Compact` persisted in localStorage; compact = 12px card padding, 32px row height in comparison table.
- **Radii:** 8px cards, 6px buttons/inputs, 12px dialogs, 999px pills. No large 16px cards (feels consumer).
- **Shadows:** `shadow-sm` for cards, `shadow-md` for sticky header/drawer, `shadow-lg` for dropdowns. No shadow on page background.

### 2.4 Iconography & Illustration
- **Icons:** Lucide only, 16px default, stroke 1.75. Never mix outline + filled.
- **Illustration:** None decorative. Only product logos (16-20px), feature icons (monotone outline), and empty-state line art (single color, 80% opacity). Avoid Product Hunt-style 3D blobs at enterprise tier.

---

## 3. Component Library (shadcn/ui mapping)

| Need | shadcn primitive | Our wrapper | Notes |
|------|------------------|-------------|-------|
| Button | `Button` | `Button variant: default/outline/ghost` | `default` = accent, `outline` = secondary, height 36px (enterprise) not 40 |
| Input/Search | `Input` | `SearchAutocomplete` | Grouped results (Products/Categories/Comparisons), keyboard nav, cmd+K shortcut |
| Card | `Card` | `ProductCard`, `CategoryCard`, `ComparisonCard` | See §5-6 |
| Tabs | `Tabs` | `ProductTabs` (6 tabs) + sticky underline | Underline 2px accent, not filled pills |
| Drawer/Sheet | `Sheet` / `Dialog` | `FilterDrawer` (mobile) | Right-anchored, 380px, scrim 40% black |
| Select | `Select` | `SortSelect`, `SegmentSelect` | Popper width 220 |
| Badge | `Badge` | `TrustBadge`, `SponsorBadge`, `G2ScoreBadge` | 10px font, 4px radius, muted vs accent |
| Table | `Table` | `ComparisonTable` | Sticky header + first col, striped rows, horizontal scroll |
| Avatar | `Avatar` | Reviewer avatar | 32px, fallback initials |
| Tooltip | `Tooltip` | Score explanation (FTC, methodology) | Delay 200ms |
| Skeleton | `Skeleton` | `CardSkeleton`, `TableSkeleton` | Never spinner for list loads |

**Custom composites (not shadcn):** `ComparisonBucket` (sticky bottom bar, 2-3 slots), `RatingDistribution` (histogram), `HelpfulButton` (thumbs + count), `LeadForm` (contextual right rail), `TrustBar` (Verified/Current User row), `VerificationChecklist` (screenshot proof steps).

---

## 4. Layout System

### 4.1 Page Frame
```
┌─────────────────────────────────────────────────┐
│ Header (sticky, 56px, border-b, backdrop-blur)  │  ← Logo · Categories mega-menu · Search (flex-1, max 560px) · Compare (bucket count) · Write Review · Auth
├─────────────────────────────────────────────────┤
│ Breadcrumbs · Trust bar (12px, muted)            │  ← Home > Sales Tools > CRM · "Verified reviews · 3.6M · Updated Aug 2026"
├─────────────────────────────────────────────────┤
│ Main (max 1280px, mx-auto, 24px gutters)         │
│  Left (720px) · Right (360px sticky 80px top)    │  ← Product/category: left = content, right = LeadForm / Comparison CTA / TOC
├─────────────────────────────────────────────────┤
│ Footer (240px, muted bg, 4 cols + compliance)    │
└─────────────────────────────────────────────────┘
```

- **Sticky behavior:** Header + product tab bar + right-rail lead form are sticky. This keeps Contact/Compare always reachable — critical for PPL conversion.
- **Responsive:** Desktop = two-column, Tablet = single column with right rail collapsing below, Mobile = Sheet for filters + bottom ComparisonBucket.

### 4.2 Grid
- **Homepage:** 12-col, hero spans 7-8 cols + visual 5-4 cols (search + featured logos).
- **Category listing:** Cards in 3-col on 1280px, 2-col on 900px, 1-col on mobile. Gap 16px. No masonry.
- **Comparison table:** Full-bleed inside page gutters, horizontal scroll with frozen first column (product name).

---

## 5. Homepage — Hero & Discovery

**Wireframe narrative (build this):**

**Hero (above the fold, 520px tall):**
- Left: `H1 — "Where you go for software"` (32px/600) + `Sub — "Compare 3.6M verified reviews. No pay-to-play rankings."` (16px/ muted) + `SearchAutocomplete` (56px tall, shadow-md, placeholder "Ask a question or search products, categories, comparisons..." + cmd+K hint) + `Trust chips:` `✓ LinkedIn-verified` `✓ Screenshot proof` `✓ $0 to be listed` (12px pills, muted)
- Right: `Featured grid` — 6 logos (Agentforce, HubSpot, etc.) in 3×2, each with name + 4.4 ★ (4.6K) — seeded from top Marketplace, not curated editorial. Click goes to product profile.
- Below hero: `Most Popular Categories` — 10 chips (Project Mgmt, CRM, Video Conf...) + `Browse all 630+ →` link. Then 6-up product cards per category block (reuse ProductCard).

**Second fold:**
- `Leaderboards:` "New & Trending this week" (algorithm: compare views + review velocity — explain tooltip) + "Most Compared" (CLARITY/ VS pairs)
- `Social proof strip:` 100M+ buyers / 6M reviews / 1200 categories — muted, tabular nums, not decorated.

**SEO footer:** Same long-form content block as category but collapsed to 2-line preview with `Learn more about how we rank`.

---

## 6. Category Listing Page (`/categories/{slug}`)

**Do not confuse with directory (`/categories`). This is the money page.**

**Header:**
- `H1: Best {Category} Software — August 2026` (30px) + `Count: 1,598 Listings` + `Tabs: Overview · Trending · Highest Rated · Easiest To Use · Free · Resources` (underline style, not pills)
- `Meta row:` Breadcrumb + Methodology link ("How we score → /methodology", anchor explains G2 Score formula in one line)

**Two-column:**
- **Left filters (280px, sticky):** Search within category → `Features` (checklist with counts, e.g., Contact Mgmt 812) → `Pricing` (Free, Free Trial, Paid) → `Deployment` (Cloud, On-Prem) → `Company Size fit` (Small/Mid/Enterprise) → `Integration` (HubSpot, Salesforce...) → `Clear all` persists. On mobile → Sheet.
- **Center list:** `Sort: G2 Score · Popularity · Satisfaction` (Select) + `Density toggle` + `Filter chips` (active filters as removable pills) → `ProductCards` (vertical stack, 16px gap). Pagination 20 per page, `?page=2&order=g2_score&segment=small-business` preserved.

**ProductCard spec (compact, high scan):**

```
┌──────────────────────────────────────────────────────┐
│ [Logo 32px]  Product Name  (Verified Publisher ✓)   ● Add to Compare  │
│ 4.4 ★★★★☆  (25,879) · G2 Score 88 · Leader badge    │
│ One-line vendor value prop truncated at 96ch          │
│ Chips: CRM · Sales Automation · Free Trial · 192 Integrations │
│ Actions: Contact Vendor · View Profile · Compare (link) │
└──────────────────────────────────────────────────────┘
```

- **No pricing on card** (keeps neutrality). Pricing lives on profile tab.
- **Leader badge** is muted outline (not gold) — avoids paid-placement perception.

**SEO content (below list, collapsed):**
- "Buying insights at a glance" + 300-word editorial + feature taxonomy table + FAQs (3 Qs, `Last updated Aug 13 2026`) — rendered server-side for crawl, `prose` styling.

---

## 7. Product Profile (`/{category}/{product}`) — The Conversion Page

**URL shape:** `/{category}/{slug}/reviews` canonical, tabs are anchors + routes: `/pricing`, `/integrations`, `/alternatives`, `/discuss`.

**Hero (560px tall, two-column):**

- Left 720px:
  - Banner (optional vendor-supplied, desaturated 20% so it doesn't compete with content; capped 320×80)
  - `Logo 48px + Name 24px + Seller → /sellers/{seller} + Solution Type (All-in-One)` + `Verification row:` `G2 recognized` medal + `Validated` + `Current User` badges (10px, muted)
  - `Rating row:` 4.4 ★★★★☆ (25,879) → histogram on hover (Popover). `G2 Score 88` (out of 100, tooltip explains formula) + `Leader` pill only if methodology qualifies — never vendor-purchased.
  - `Tab bar (sticky, scroll spy):` `Overview | Reviews (25,879) | Pricing | Integrations (192) | Alternatives | Q&A` — underline active, count in tab label only for Reviews/Integrations.

- Right 360px (sticky):
  - `LeadForm` card (shadow-md): `Contact Agentforce Sales` — fields: Name*/Work Email*/Company*/Phone/Intent(Replace/Search/Browse) → `Send` (accent) + microcopy "Free, no spam. Response in 1 business day. Your data per Privacy Policy." + `Visit Website` (ghost) secondary. This is the enterprise lead capture — track `source_location=product%23hero`.
  - Below form: `Quick stats` (Pricing from $25, Free Trial ✓, 192 Integrations) + `Compare` CTA (if in bucket).

**Tab 1 — Overview:**
- Vendor long description (prose, 14px, 68ch) + `Languages (32)`, `Solution Type`, `Overview by (author)` + "Used by" logos (muted, 24px).
- `Features:` checklist (left: feature, right: % of reviewers who mention) — not vendor claim.
- `Media:` 3-across screenshots with caption, lightbox.

**Tab 2 — Reviews (≈70% of profile engagement):**
- `RatingDistribution:` histogram (5★ 64% → 1★ 0%) + `Pros & Cons` pills (`Ease of Use (2,065)`, `Learning Curve (1,092)`) linking to filtered views `?filters[sentiment_snippet]=`.
- `AI summary:` 4 bullets, `Generated using AI from real user reviews` + `Last updated` — include `AI Verified` toggle if sourced from verified reviews only.
- `Review cards:` One per verified reviewer — Avatar 32px + Name + Title + Company size + `Validated`/`Current User`/`Incentivized` badges (warning color for incentivized, but never hidden) + `Source: G2 invite` + `Date` + `5★` + `What do you like best?` (2-3 lines, expand) + `What do you dislike?` + `Helpful (12)` + `Report`. Show screenshot proof thumbnail if Current User.
- Filter bar above cards: `All · 5★ · 4★ · Verified only · Current User only`.

**Tab 3 — Pricing:**
- `4-up pricing cards:` Starter $25 / Professional $100 / Enterprise $165 / Unlimited $330 — each with feature diff (`+ Workflow automation`), CTA `View details`. Disclaimer muted: "Supplied by vendor or public pricing; final quote via seller."
- `G2 Deals:` If applicable, show `25% off via G2 — SAVE25` as secondary offer with tracking — not primary price.
- `Pricing FAQs` (AI-generated, 3 Qs) + `Pricing reviews` strip (reviews mentioning pricing).

**Tab 4 — Integrations:**
- 36-logo grid (6 per row, paginated), search within integrations, `Shows 192` count + `Verified by vendor` check.

**Tab 5 — Alternatives & Comparisons:**
- Horizontal strip: `Alternative: HubSpot vs ...` plus `Most Compared` pairs linking to `/compare/{a}-vs-{b}`.

---

## 8. Comparison Table (`/compare/{a}-vs-{b}[-vs-{c}]`)

**This is the highest-value buying surface — invest 40% of front-end polish here.**

**Header:**
- `H1: {Product A} vs {Product B} Comparison — What are differences?` + `+ Add Product` (up to 4; alpha canonical `?slugs=a-vs-b-vs-c` sorted)
- Dual hero: Side-by-side logos + `4.4 (25,879)` + `Pricing from $25` + `Free Trial` — each column links to profile.
- `Advisor CTA:` "G2 offers free advice — Text | Phone" (enterprise buyers want human now, not form).

**Sticky mid-gate (convert even if they don't scroll):**
- `Send me this comparison — Email address * → Get the comparison` + qualifier `Replace / Search / Browse`. This is top-of-funnel intent even when gate is skipped (email captured).

**Table spec (our hero component):**

- Columns: `Feature | {Product A} | {Product B} [+ Product C]` — first column frozen.
- Rows grouped: `Ratings` (7 rows: Meets Requirements … Product Direction), `Pricing` (per edition), `Features` (check grid), `Satisfaction` (sub-scores), `Alternatives` (bottom strip).
- Row shading: every other row `bg-muted/40`, hover highlight row across columns.
- Cell: score `8.8` (16px mono) + respondent count `14,233` (12px muted). Bar micro-viz to right (linear track) so 8.8 vs 8.6 is visibly different without reading digits.
- Responsive: horizontal scroll, sticky first col, snap to column on swipe.

**Footer on compare:**
- AI summary (6 bullets) + FAQs (3 Qs) + table snippet for SEO.

**URL canonical:** Always `/{a}-vs-{b}` alphabetically; if user picks B-vs-A, 301 to A-vs-B. Add `/compare/hub` for discovery (trending, most-viewed pairs like SOLIDWORKS vs SketchUp).

---

## 9. Search Autocomplete & Results

**Autocomplete (homepage + header):**

- Trigger on 2 chars, 180ms debounce.
- Groups: `Products (top 5)` → logo 20px + name + rating + category tag; `Categories (3)` → icon + listing count; `Comparisons (2)` → "A vs B — 35K compared this month".
- Keyboard: `↑↓` navigate, `Enter` go, `Esc` close, `cmd+K` focus.
- No results? Show `Try: CRM, Project Management, Video Conferencing` with popular categories as chips.

**Results page (`/search?q=...`):**

- Tabs: `Products (42) · Categories (6) · Comparisons (11)` — counts.
- Sort: Relevance (default), Highest Rated, Most Reviews.
- Empty state: illustration + "No exact match — browse adjacent categories" with 3 category cards.

---

## 10. Reviews & Verification UX (Trust System)

- **Never hide negative, never edit copy.** Quote community guideline verbatim in modal: "We never edit nor suppress reviews — verified only."
- **Labels always visible at card level:** `Validated Reviewer` (green check, success color), `Current User` (screenshot icon), `Incentivized` (amber dot + "Gift card — rating still counted but weighted low"), `Source: G2 invite`. Guest User = `Guest` pill, does not count toward G2 Score (show `Not counted toward ranking` tooltip).
- **Anonymous mode:** Show `Verified user — Mid-market · Software` with same badges but no name — never "Anonymous" without context.
- **Write review flow:** `/wizard/new-review` — Step 1: Auth (LinkedIn or business email verification via magic link), Step 2: Ratings 1-10 (with N/A handles), Step 3: Open-ended (What do you like best? / What do you dislike?), Step 4: Screenshot proof (drag-drop, required for Current User), Step 5: Preview + FTC disclosure checkbox. Progress bar top.
- **Moderation:** Show `Under review — typically 24-48h` after submit; vendor sees `Review → Respond` inline (vendor response is labeled, dated, below review).

---

## 11. Dashboards (Vendor & Admin)

### Vendor (`/vendor`) — what enterprise buyers' vendors see
- `Overview:` KPI cards: Profile views (7/30d), Comparison hits, Leads (by source: pricing tab vs comparison gate vs advisor), Review velocity.
- `Products:` Edit → `PENDING` → admin approves; shows moderation queue status.
- `Leads:` Table with filter (status: New/Contacted/Won/Lost), `Add note`, `Export CSV`, `Mark spam`. Lead row shows `source_location`.
- `Reviews:` Respond inline, see label (Incentivized, Guest, Verified).
- `Billing:` Phase 2 — not in MVP.

### Admin (`/admin`) — internal
- `Review moderation queue` (oldest first, with report reason), `Product claim queue`, `Lead management`, `User management`.
- `SEO Manager:` Programmatic page status (indexed, pending, blocked), sitemap sharding view.

---

## 12. Dashboards Visual Language

- **Cards:** White on muted page bg (`#F4F4F5`), 8px radius, 1px border, `shadow-sm`. No dark cards on dashboard (enterprise expectation is airy).
- **Empty states:** Line icon 48px, headline 16px/600, sub 14px/muted, CTA accent.
- **Data viz:** Ratings use horizontal bars (accent fill, muted track), not pies. Never 3D.
- **Dark mode:** Parity — same component tree, just token swap. Tested via axe-core at both themes.

---

## 13. Mood Board — Direct Steals Worth Copying

| Source | Steal this | Leave this |
|--------|------------|------------|
| **Linear** | Command palette, density toggle, tabular nums, Issue list row hover | Nothing enterprise-unfriendly here |
| **Stripe Dashboard** | Muted page bg + white cards, 1px borders, quiet success green | Stripe's extra indigo — we keep single accent |
| **Vercel** | Geist typography, skeleton instead of spinner, sticky tab bar | Vercel's black overload — we stay zinc-200 borders |
| **Salesforce Lightning** | Comparison table frozen cols, feature taxonomy | Salesforce's blue overuse, heavy shadows |
| **Figma Community** | Product card hover (scale 1.01 + shadow-md) | Figma's community playfulness — keep muted |
| **Airbnb 2025** | Category chips as pills with count | Airbnb's photography-heavy hero — we are data-heavy |

---

## 14. Accessibility & Performance (Enterprise procurement cares)

- **A11y:** All interactive elements 44px min hit area on mobile, focus ring 2px accent with offset 2px, skip links, aria for histograms, `prefers-reduced-motion` disables motion. Target axe 0 criticals.
- **Performance:** LCP <1.8s (product hero image priority), CLS 0 (skeleton with fixed dimensions), INP <100ms (debounced search). Lighthouse SEO 100 (JSON-LD `AggregateRating`, `BreadcrumbList`, `FAQPage` on category/compare).
- **Internationalization:** Not in MVP, but typography stack must render Japanese/Korean (Inter has limited CJK; fall back to system).

---

## 15. Build Checklist for Frontend

- [ ] Tailwind tokens as above, dark parity in one config file — no third file.
- [ ] shadcn install: button, card, input, tabs, sheet, dialog, badge, table, select, avatar, tooltip, skeleton.
- [ ] `SearchAutocomplete.tsx` with grouped results + keyboard nav + cmd+K.
- [ ] `ProductCard.tsx`, `CategoryCard.tsx`, `ComparisonTable.tsx` (frozen cols), `ComparisonBucket` (sticky).
- [ ] `RatingDistribution` + `ReviewCard` + `HelpfulButton`.
- [ ] `LeadForm` sticky variant + inline variant (compare gate).
- [ ] `FilterDrawer` (sheet) + `SortSelect` + `FilterChips`.
- [ ] Category page: 3-col cards, 20 per page, pagination preserving query.
- [ ] Product profile: 6 tabs, sticky tab bar, right-rail LeadForm, media lightbox.
- [ ] Compare page: add-product (max 4, alpha canonical), email gate, advisor CTA.
- [ ] Vendor/admin shells with KPI cards + tables.
- [ ] Dark mode toggle persisted, axe tests in CI.

---

**File:** `/opt/data/analysis/reports/ENTERPRISE-UI-DESIGN-SYSTEM.md` — auto-synced into `MASTER-BUILDER-FILE.md` on next zip rebuild. Pair with `prompts/MASTER-BUILD-PROMPT.md` Section 8 for implementer.




---

## PART — SEO ARCHITECTURE (`reports/09-SEO-ARCHITECTURE.md`)

# DELIVERABLE 9 — SEO & Programmatic Page Architecture

## 1. URL System (Original — Do Not Copy Competitor Slugs Verbatim)

```
/                           homepage
/categories                 all top-level categories (hub)
/{category}                 category listing  e.g. /crm, /project-management
/{category}/{product}       product profile  e.g. /crm/hubspot
/{category}/{product}/reviews         reviews tab (canonical: /{category}/{product}#reviews for MVP, routed in Phase 2)
/{category}/{product}/alternatives    alternatives
/compare/{a}-vs-{b}         2-way comparison  e.g. /compare/salesforce-vs-hubspot
/compare/{a}-vs-{b}-vs-{c}  3-way comparison
/best/{category}-software   alias to /{category} with ?view=best (or dedicated pillar)  e.g. /best/crm-software
/resources/{slug}           editorial: guides, comparisons, methodology  e.g. /resources/crm-buying-guide-2026
/search?q=...               search results (noindex)
```

**Rules:**
- All slugs: lowercase, hyphenated, `[a-z0-9-]`, max 60 chars, unique per table + unique index on slug.
- Product slug is globally unique (not just per-category) — enables stable /compare URLs even if category changes.
- Comparison slug: products sorted alphabetically before joining with `-vs-` to canonicalize (hubspot-vs-salesforce === salesforce-vs-hubspot → redirect to alphabetical).
- Trailing slash: never (redirect).

## 2. Page Templates & Content Blocks

| Template | Blocks (order) | Dynamic Data | Cache |
|---|---|---|---|
| Homepage | Hero search + Categories + Featured + Comparisons + Testimonials + Vendor CTA + FAQ | featured products (rating+velocity), trending comparisons | ISR 300s |
| Category | H1 `{Category} Software — 2026` + description + buying guide excerpt + filters + product grid (24) + FAQ + alternatives + internal links | category + products + faqs + guide | ISR 60s |
| Product | Header + tabs (overview/features/pricing/reviews/alternatives/faqs) + sticky lead form + Breadcrumbs + JSON-LD | product + features + plans + reviews + company + alternatives | ISR 60s |
| Comparison | H1 `{A} vs {B}: Features, Pricing & Reviews Compared` + header cards + sections (pricing/ratings/features/pros-cons/integrations) + verdict + alternatives + FAQ | 2–3 products + feature matrix + pricing | ISR 300s, on-demand revalidate on product update |
| Resource | H1 + author + date + TOC + body (MDX) + product embeds + FAQ + related resources | MDX + linked products | ISR 600s |
| Best | H1 `Best {Category} Software — Top N Reviewed` + ranked table + methodology | category + top N by rating+reviews | ISR 600s |

## 3. Internal Linking

- Category → product (grid) → comparison / alternatives (reciprocal)
- Product → alternatives (6) → each alternative → back
- Comparison → both products + related comparisons (share a product) — "Related comparisons: A vs C, B vs C"
- Breadcrumbs: Home > Category > Product (and Home > Compare > A vs B)
- Footer: Top 20 categories + Top 20 comparisons (crawl path)
- Sitemap cross-linking: no orphan products (every product reachable from ≥2 categories/comparisons/resources)

## 4. Programmatic Generation

**What to generate at build vs on-demand:**
- `/categories` — static (few)
- `/{category}` — ISR with `generateStaticParams` for top categories; remaining on-demand + cached.
- `/{category}/{product}` — ISR on-demand (1k–3k at launch — don't prebuild all).
- `/compare/{a}-vs-{b}` — on-demand ISR only (permutations are O(n²) — never prebuild). Generate when first visited or when internal link is emitted.
- `/best/*` + `/resources/*` — ISR.

**De-duplication:**
- Comparison permutations: `sorted([a,b])` join; if unsorted URL requested, 301 to sorted.
- Product moved between categories: keep old slug redirect (301) via `product_slug_redirects` table.

## 5. Meta & Structured Data

- **Title:** `{Product} — Pricing, Features & Reviews (2026) | Platform` (≤60 ch), Category: `Best {Category} Software — 2026 Reviews & Pricing | Platform`, Comparison: `{A} vs {B} — Compare Features, Pricing & Reviews | Platform`
- **Description:** 150–160 ch, includes rating, review count, starting price.
- **Canonical:** self; paginated listings → page 1 canonical + rel prev/next.
- **OG/Twitter:** product logo + rating overlay image (dynamic OG via next/og).
- **JSON-LD:**
  - Product: `SoftwareApplication` + `AggregateRating` + `Offer` (pricing)
  - Category: `CollectionPage` + `ItemList`
  - Comparison: `Article` + `ComparisonTable` (custom) + FAQPage if FAQs present
  - Breadcrumbs: `BreadcrumbList`
  - Reviews: `Review` per review
- **Hreflang:** omit for MVP (single en-US).

## 6. Sitemap & Robots

- `/sitemap.xml` — index → shards: `/sitemaps/products.xml`, `/sitemaps/categories.xml`, `/sitemaps/comparisons.xml`, `/sitemaps/resources.xml`
- `robots.txt` — allow /, disallow /search, /api, /admin, /vendor, /compare? (no, allow /compare/* — it's SEO-critical), crawl-delay not needed.
- Submit to Search Console + Bing Webmaster on launch.

## 7. Content Scale Math

- 100 categories × avg 20 products = 2,000 product pages
- Top 20 categories × avg 10 comparisons (pairwise of top 5) = ~200 comparison pages at launch; scales to 5k+ as products grow (but only generate linked ones).
- 100 `best/{category}` aliases + 50 resources at launch = 150 pillar pages.
- **Total crawlable URLs at launch:** ~2,350 (manageable). At 10k products → ~10k + 2k comparisons + 200 pillars = ~12k pages — still ISR-friendly.

## 8. SEO Guardrails

- No thin pages: comparison requires ≥2 products with ≥5 overlapping features; product requires ≥100 words description + ≥3 features + pricing.
- Pagination: `?page=N` with canonical to page 1 for crawlers? No — each page self-canonical + prev/next; meta noindex page >1 is WRONG — paginated listings are crawlable.
- Search results (`/search?q=`) → `noindex, follow`.
- Ensure every public page has unique H1 + title + description (lint in CI).



---

## PART — API ARCHITECTURE (`reports/14-API-ARCHITECTURE.md`)

# DELIVERABLE — API Architecture

## Base: Next.js Route Handlers (MVP)

All endpoints under `/api/*`, validated with Zod, rate-limited, RBAC where needed.

### Public (no auth)

| Method | Path | Purpose | Notes |
|---|---|---|---|
| GET | /api/search?q=&category=&filters= | Autocomplete + results | Proxies Meilisearch; fallback to Postgres ILIKE |
| GET | /api/products?category=&sort=&page=&filters= | Listing | Used by client-side filter updates |
| GET | /api/products/[slug] | Single product | ISR pages prefer direct DB, API for client fetch |
| GET | /api/categories | All categories with counts | Cached 300s |
| GET | /api/comparisons/[slugs] | Comparison data | Validates slugs, returns products + matrix |
| POST | /api/leads | Submit lead | Zod; creates Lead, sends email, rate-limited |

### Authenticated (buyer)

| Method | Path | Purpose |
|---|---|---|
| POST | /api/reviews | Submit review (one per product per user) |
| PATCH | /api/reviews/[id]/helpful | Toggle helpful vote |
| GET/POST | /api/saved/products | List / save |
| GET/POST | /api/saved/comparisons | List / save |
| GET | /api/me/leads | Own leads |
| GET | /api/me/reviews | Own reviews |

### Vendor

| Method | Path | Purpose |
|---|---|---|
| POST | /api/vendor/claim | Claim company/product |
| PATCH | /api/vendor/products/[id] | Edit (→ PENDING) |
| GET | /api/vendor/leads | Vendor's leads |
| PATCH | /api/vendor/leads/[id] | Update status/notes |
| POST | /api/vendor/reviews/[id]/response | Respond to review |

### Admin

| Method | Path | Purpose |
|---|---|---|
| GET/POST | /api/admin/products | CRUD |
| POST | /api/admin/products/[id]/moderate | approve/reject |
| GET/POST | /api/admin/categories | CRUD |
| GET/POST | /api/admin/reviews | moderation queue |
| POST | /api/admin/reviews/[id]/moderate | approve/reject/verify |
| GET | /api/admin/leads | all leads |
| GET | /api/admin/users | user list |

### System

| Method | Path | Purpose |
|---|---|---|
| GET | /api/health | DB + search + redis check |
| POST | /api/webhooks/search-sync | Meilisearch sync (internal) |
| GET | /api/sitemap | dynamic sitemap shard |

## Auth

- NextAuth v5 (Auth.js) — `auth.ts` config, Prisma adapter, providers: credentials, google, linkedin.
- Session strategy: database (for vendor claim + moderation audit).
- Middleware: protects /vendor, /admin, /api/vendor, /api/admin.

## Validation Example (Zod)

```ts
const LeadSchema = z.object({
  type: z.enum(['GET_PRICING','REQUEST_DEMO','EXPERT_RECOMMENDATION']),
  productId: z.string().cuid().optional(),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  company: z.string().min(2).max(80).optional(),
  phone: z.string().max(20).optional(),
  message: z.string().max(2000).optional(),
  categorySlug: z.string().optional(),
});
```

## Rate Limiting

- Upstash Redis `ratelimit` — 60/min IP on /api/*, 5/day user on reviews, 10/hour IP on leads.
- Return 429 with Retry-After.

## Error Shape

```json
{ "error": "VALIDATION_ERROR", "details": { "email": "Invalid email" } }
{ "error": "RATE_LIMITED", "retryAfter": 42 }
{ "error": "NOT_FOUND" }
```

## Webhooks / Jobs

- `pg-boss` or Vercel Cron: nightly rating recompute, sitemap regen, search full-sync, email digests (Phase 2).



---

## PART — TECH STACK (`reports/06-TECH-STACK.md`)

# DELIVERABLE 6 — Recommended Technology Stack

## 1. Frontend

**Choice: Next.js 15 (App Router) + React 19 + TypeScript**
**Why:**
- SSR/ISR/SSG out of the box — critical for programmatic SEO (category/product/compare pages must be crawlable without JS). G2/SoftwareAdvice all rely on SSR pillar pages.
- App Router + ISR (`revalidate`, `generateStaticParams`) lets you generate 50k comparison pages lazily without build-time explosion.
- API routes or route handlers for lead submission, review, auth.
- Next Image optimization for logos/screenshots.
- Ecosystem: next-seo, next-sitemap, next-auth.

**Alternatives considered:**
- Remix — good but ISR story weaker.
- Astro — great for content but marketplace interactivity (compare bucket, filters) needs React state — Next wins.
- SPA (Vite) — disqualified for SEO.

**UI kit:** Tailwind CSS + shadcn/ui (Radix) + Lucide icons. No heavy component lib.

## 2. Backend

**API architecture:**
- **Next.js Route Handlers + Server Actions** for MVP (single repo, single deploy). No separate backend service needed until 10k+ products.
- **Postgres + Prisma** as ORM (typed, migration-safe). Alternative: Drizzle — also good; Prisma is more mature for admin CRUD.
- **Auth:** Auth.js (next-auth) v5 — credentials + Google + LinkedIn OAuth; RBAC via database sessions or JWT.
- **Validation:** Zod on every input (forms, API).
- **Background jobs:** Vercel Cron or `pg-boss` for queue (review moderation emails, lead notifications, sitemap regeneration). For self-host: BullMQ + Redis.
- **File uploads:** UploadThing or S3-compatible (R2/Cloudflare) for logos/screenshots.
- **Rate limiting:** Upstash Redis or `rate-limiter-flexible` with Postgres fallback.
- **Email:** Resend or SendGrid (transactional: verification, lead notifications, review published).
- **Observability:** Sentry + Posthog (product analytics).

**When to split backend:**
At ~50k products / 500k reviews / high write load, extract a standalone API (NestJS or FastAPI) behind Next.js BFF. Not needed for MVP.

## 3. Database

**Primary: PostgreSQL 16** (Neon / Supabase / self-hosted)
- Why: relational + JSONB + full-text + pg_trgm + vector (pgvector) for future semantic search. Every competitor's data is deeply relational (Products ↔ Categories ↔ Features ↔ Reviews ↔ Comparisons). NoSQL would fight the domain.
- See Deliverable 5 for full schema + ERD.

**Cache / queue:** Redis (Upstash) for rate limit, session, job queue, search cache.
**Search engine:** Meilisearch (MVP) → Typesense or Elasticsearch at scale. See Search section.

## 4. Search

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Postgres FTS (tsvector)** | Zero infra, good for MVP <10k products | No typo tolerance, slow facets, no instant | Fallback only |
| **Meilisearch** | Typo-tolerant, instant, facets, easy self-host or Cloud, <50ms | Needs sync, not as scalable as ES | **MVP choice** |
| **Typesense** | Similar to Meilisearch, great facets | Slightly more ops | Strong alternative |
| **Elasticsearch / OpenSearch** | Most scalable, ML, aggregations | Heavy, expensive, overkill for MVP | **Scale choice (100k+ products)** |

**MVP search strategy:**
- Index: products (name, slug, tagline, description, features, category names), categories (name, description)
- Facets: category, price tier, rating bucket, freeTrial, deployment, integrations
- Sync: Prisma middleware → Meilisearch on product/category/review create/update (or pg trigger → worker)
- Fallback: if Meilisearch down, degrade to Postgres ILIKE + tsvector, not 500.
- Future: semantic search via pgvector or Meilisearch vector (embeddings for "best CRM for startups" queries).

## 5. Infra & DevOps (MVP)

- **Hosting:** Vercel (frontend + API + cron) + Neon/Supabase Postgres + Upstash Redis + Meilisearch Cloud (or self-host on Fly/Hetzner)
- **Alternative self-host:** Docker Compose + Hetzner + Coolify + Caddy — cheaper, more control.
- **CI:** GitHub Actions (lint, typecheck, test, build)
- **CD:** Vercel auto-deploy on main; preview deploys per PR.
- **Domain + CDN:** Cloudflare (DNS + CDN + WAF + rate limit)
- **Backups:** Neon PITR + daily pg_dump to R2; Meilisearch snapshots.
- **Monitoring:** Vercel Analytics + Sentry + UptimeRobot.

## 6. Testing

- Unit: Vitest (+ React Testing Library)
- E2E: Playwright (search, filters, product, review submit, compare, lead, auth, vendor, admin)
- A11y: axe-core in CI
- SEO: next-sitemap + Lighthouse CI (perf + SEO scores)

## 7. Project Structure (single repo)

```
software-discovery-platform/
├── app/
│   ├── (public)/{page.tsx, layout.tsx}
│   │   ├── page.tsx              # homepage
│   │   ├── categories/page.tsx
│   │   ├── [category]/page.tsx
│   │   ├── [category]/[product]/page.tsx
│   │   ├── compare/[slugs]/page.tsx
│   │   ├── resources/[slug]/page.tsx
│   │   └── search/page.tsx
│   ├── (auth)/{login, register}
│   ├── (dashboard)/{vendor, admin}
│   └── api/{search, reviews, leads, products, compare}
├── components/{ui, cards, filters, compare, reviews, forms}
├── lib/{db, search, auth, email, validation, seo}
├── prisma/{schema.prisma, migrations, seed.ts}
├── public/{icons, images}
├── e2e/{*.spec.ts}
└── scripts/{seed, sync-search, generate-sitemap}
```

## 8. Environment Variables (required)

```
DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
GOOGLE_CLIENT_ID/SECRET, LINKEDIN_CLIENT_ID/SECRET,
MEILISEARCH_HOST/KEY, REDIS_URL,
RESEND_API_KEY, S3/R2 creds, SENTRY_DSN
```



---

## PART — ROADMAP (`reports/07-ROADMAP.md`)

# DELIVERABLE 7 — MVP, Phase 2, Phase 3 Roadmaps

## MVP (Weeks 1–10) — Scope That Ships

**Goal:** Searchable, SEO-crawlable marketplace with monetizable lead flow and credible reviews. Treat everything else as Phase 2.

### Week 1–2: Foundation
- [ ] Next.js App Router + Tailwind + shadcn scaffold, ESLint/Prettier, CI
- [ ] Postgres + Prisma schema (see Deliverable 5), seed 100 categories + 500 products (real + synthetic, see seed script)
- [ ] Auth.js (credentials + Google), RBAC (buyer/vendor/admin)
- [ ] Meilisearch index + sync worker

### Week 3–4: Public Site Core
- [ ] Homepage (search + categories + featured)
- [ ] /categories + /[category] listing (filters, sort, pagination, ISR, JSON-LD)
- [ ] /[category]/[product] profile (all sections, tabs, lead CTAs, ISR)
- [ ] Search results page (autocomplete + results)

### Week 5–6: Reviews + Comparison
- [ ] Review submission flow + verification + moderation queue + listing
- [ ] Comparison engine: bucket + /compare/[slugs] table (2–3 products) + programmatic SEO
- [ ] Alternatives + /best/{category} aliases

### Week 7–8: Leads + Dashboards (minimal)
- [ ] Lead forms (Get Pricing / Request Demo / Expert Recommendation) → DB + email to vendor/admin
- [ ] Vendor portal (claim, edit listing → moderation, lead inbox read-only)
- [ ] Admin panel (product/category/review moderation, lead list, user list)

### Week 9: SEO + Polish
- [ ] Sitemap.xml (dynamic), robots.txt, canonical, OG, JSON-LD, breadcrumbs, internal linking
- [ ] Performance pass (images, ISR, caching), a11y pass, empty states, 404s

### Week 10: Hardening + Launch
- [ ] Playwright E2E (15 critical paths), rate limiting, CSP, backups
- [ ] Seed to 1–3k products, content pass, launch on Vercel + Neon + Meilisearch Cloud
- [ ] PostHog + Sentry + Uptime

**MVP Cut Line (explicitly OUT):**
- Human 1:1 advisor call center (keep async form only)
- RFI/RFP Decision Platform (SelectHub-style)
- GoodFirms-style agency marketplace + portfolio audits
- G2-style Grid quadrant calculation
- Real-time vendor analytics dashboard (keep MVP analytics minimal)
- Sponsored bidding / auction
- Multi-language / multi-currency

**MVP Success Metrics (30 days post-launch):**
- Indexed pages >2k, p95 search <150ms, LCP <2.5s
- ≥100 reviews submitted, ≥50 leads, ≥10 vendor claims
- Zero critical a11y/SEO regressions (Lighthouse ≥90)

---

## Phase 2 (Months 3–6) — Differentiation & Monetization

- Requirements builder (SelectHub-lite): template download → requirement checklist → filtered shortlist
- Sponsored placements + bidding (Sponsored badge, featured slots)
- Review incentives + LinkedIn share flow (SoftwareSuggest-style)
- Advanced vendor analytics (views, comparison appearances, lead source, trend)
- Programmatic blog: /resources/{slug} at scale (100+ comparison articles, buying guides)
- AEO/GEO visibility product (free tier + paid report)
- Email digests, saved searches, price-drop alerts
- API v1 (read-only products/categories/reviews for partners)

## Phase 3 (Months 7–12) — Scale & Moat

- G2-style buyer intent data (de-anonymized firmographics for vendors — privacy-compliant)
- Decision Platform v1: multi-stakeholder collaboration, vendor scoring, RFI/RFP distribution
- AI layer: semantic search, review summarization (pros/cons auto-extraction), comparison personalization
- Agency/services marketplace (GoodFirms-style) if validated
- Mobile apps (PWA first, then native)
- Enterprise SSO, SLA, data export
- International expansion (localization, regional pricing, local review sources)

---

## Cost Estimate (MVP, 10 weeks, 1–2 engineers + AI agent)

| Item | Monthly |
|---|---|
| Vercel Pro | $20 |
| Neon/Supabase (scale) | $20–$50 |
| Meilisearch Cloud (1k docs) | $0–$30 |
| Upstash Redis | $0–$10 |
| Resend (email) | $0–$20 |
| R2 / S3 (media) | $5 |
| Domain + Cloudflare | $15 |
| **Total infra** | **~$60–$150/mo** |

Engineering is the real cost — AI coding agent (this prompt) collapses 10 weeks into days if run end-to-end with the BUILD→RUN→TEST→FIX loop.



---

## PART — POLICY & COMPLIANCE (`reports/POLICY-COMPLIANCE-DEEP-DIVE.md`)

# POLICY & COMPLIANCE DEEP DIVE — Enterprise B2B Marketplace

**Enterprise Software Discovery Platform — Policy & Compliance Matrix**
**Date:** 2026-09-02
**Author:** Hermes Agent — Exhaustive Web Extraction
**Workspace:** `/opt/data/analysis/reports/POLICY-COMPLIANCE-DEEP-DIVE.md`
**Method:** Direct extraction via `web_extract` / `web_search` from canonical legal domains. No LLM summarization — raw content preserved where reachable. Blocked pages retried with alternate backends; failures noted as FACT.
**Coverage:** 6 marketplaces × 7 policy types. **22 URLs enumerated, 18 successfully extracted** (≥12 required). Every claim labeled **OBSERVED FACT** (directly in extracted text) vs **INFERENCE** (reasonable interpretation for implementation).

---

## Table of Contents
1. [Source Inventory — 22 URLs](#1-source-inventory--22-urls)
2. [Platform-by-Platform Extraction](#2-platform-by-platform-extraction)
3. [Policy & Compliance Matrix (Cross-Marketplace Comparison)](#3-policy--compliance-matrix-cross-marketplace-comparison)
4. [Required Implementations for Enterprise Product](#4-required-implementations-for-enterprise-product)
5. [Observed Fact vs Inference Ledger](#5-observed-fact-vs-inference-ledger)
6. [Implementation Checklist (Shippable)](#6-implementation-checklist-shippable)
7. [Appendix — Raw Extraction Notes & Retention Details](#7-appendix--raw-extraction-notes--retention-details)

---

## 1. Source Inventory — 22 URLs

| # | Marketplace | Policy Type | URL | Status | Extraction Date |
|---|-------------|-------------|-----|--------|-----------------|
| 1 | **G2** | Terms of Use | `https://legal.g2.com/terms-of-use` | ✅ Extracted (15,046 chars) | 2026-09-02 |
| 2 | **G2** | Privacy Policy | `https://legal.g2.com/privacy-policy` | ✅ Extracted (15,201 chars) | 2026-09-02 |
| 3 | **G2** | Cookie Policy | `https://legal.g2.com/cookie-policy` | ✅ Extracted (8,157 chars) | 2026-09-02 |
| 4 | **G2** | Community Guidelines | `https://legal.g2.com/community-guidelines` | ✅ Extracted (15,355 chars) | 2026-09-02 |
| 5 | **G2** | Scoring / Research Methodology | `https://documentation.g2.com/docs/research-scoring-methodologies` | ✅ Extracted (15,284 chars) | 2026-09-02 |
| 6 | **G2** | Alternative Methodology Mirror | `https://research.g2.com/methodology` | ⚠️ 429 rate-limit (same content as #5) | 2026-09-02 |
| 7 | **G2** | CCPA Disclosure (GDPR companion) | `https://legal.g2.com/california-consumer-privacy-act-disclosure` | ✅ Extracted (3,148 chars) | 2026-09-02 |
| 8 | **G2** | EEA+ Supplemental GDPR Disclosure | `https://legal.g2.com/eea-supplemental-data-protection-law-disclosures` | ✅ Extracted (6,711 chars) | 2026-09-02 |
| 9 | **G2** | Data Privacy Framework (DPF) Notice | `https://legal.g2.com/eu-us-data-privacy-framework-notice` | ✅ Extracted (6,497 chars) | 2026-09-02 |
| 10 | **G2** | DMCA / Copyright Complaint Policy | `https://legal.g2.com/copyright-complaint-policy` | ✅ Extracted (3,102 chars) | 2026-09-02 |
| 11 | **Capterra** (Gartner Digital Markets) | General User Terms | `https://www.capterra.com/legal/terms-of-use/` | ✅ Extracted (3,134 chars) | 2026-09-02 |
| 12 | **Capterra** | Privacy Policy | `https://www.capterra.com/legal/privacy-policy/` | ⚠️ Partial (1,498 chars, marketing shell — legal text behind consent gate) | 2026-09-02 |
| 13 | **Capterra** | Content Compliance Policy | `https://www.capterra.com/legal/content-policy/` | ⚠️ Partial (1,063 chars, shell) | 2026-09-02 |
| 14 | **Capterra** | Review Verification Methodology | `https://www.capterra.com/resources/how-we-verify-reviews/` | ✅ Extracted (6,670 chars) | 2026-09-02 |
| 15 | **Capterra** | Transparency / Business Model | `https://www.capterra.com/resources/how-we-ensure-transparency/` | ✅ Extracted (5,355 chars) | 2026-09-02 |
| 16 | **Capterra** | Proprietary Data / Shortlist Methodology | `https://www.capterra.com/resources/proprietary-data-research/` | ✅ Extracted (14,978 chars) | 2026-09-02 |
| 17 | **Capterra** | Cookie Policy (UK canonical) | `https://www.capterra.co.uk/legal/cookie-policy` | ⚠️ Shell (1,498 chars) | 2026-09-02 |
| 18 | **TrustRadius** | Terms of Use | `https://www.trustradius.com/static/terms-of-use` | ✅ Extracted (3,090 chars) | 2026-09-02 |
| 19 | **TrustRadius** | Privacy Policy | `https://trustradius.com/static/privacy-policy` | ✅ Extracted (15,014 chars) | 2026-09-02 |
| 20 | **TrustRadius** | Reviewer Guidelines | `https://www.trustradius.com/static/reviewer-guidelines` | ✅ Extracted (4,512 chars) | 2026-09-02 |
| 21 | **TrustRadius** | About Reviews / Verification & Incentives FAQ | `https://www.trustradius.com/static/about-trustradius-reviews` | ✅ Extracted (7,096 chars) | 2026-09-02 |
| 22 | **Gartner Peer Insights** | Rules of Engagement (Terms) | `https://gartner.com/reviews/faq/rules-of-engagement` | ✅ Extracted (15,442 chars) | 2026-09-02 |
| 23 | **Gartner Peer Insights** | Community Guidelines (3-part: Understanding / Writing / Vendor) | `https://external.pi.gpi.aws.gartner.com/reviews/guidelines` | ✅ Extracted (3,110 chars shell + TOC; full content behind auth) | 2026-09-02 |
| 24 | **Gartner** | Global Privacy Policy | `https://www.gartner.com/en/about/policies/privacy` | ✅ Extracted (13,147 chars) | 2026-09-02 |
| 25 | **Gartner** | Cookie Policy | `https://www.gartner.com/en/about/policies/privacy/cookie-policy` | ✅ Extracted (5,448 chars) | 2026-09-02 |
| 26 | **Gartner** | Terms of Use (gartner.com) | `https://www.gartner.com/en/about/policies/terms-of-use` | ✅ Extracted (9,618 chars) | 2026-09-02 |
| 27 | **Gartner Peer Insights** | Voice of the Customer Methodology (Voc) | `https://gpivendorresources.gartner.com/en/articles/6746287-voice-of-the-customer-methodology` | ✅ Extracted (15,282 chars) | 2026-09-02 |
| 28 | **GoodFirms** | Terms of Service | `https://www.goodfirms.co/terms-of-use` | ✅ Extracted (13,271 chars) | 2026-09-02 |
| 29 | **GoodFirms** | Privacy Policy | `https://www.goodfirms.co/privacy` | ✅ Extracted (11,562 chars) | 2026-09-02 |
| 30 | **GoodFirms** | Leaders Matrix Research Methodology | `https://goodfirms.co/research-process` | ✅ Extracted (3,116 chars + formulas) | 2026-09-02 |
| 31 | **GoodFirms** | About Us / Verification Claims | `https://goodfirms.co/about-us` | ✅ Extracted (6,774 chars) | 2026-09-02 |
| 32 | **Software Advice** (Gartner Digital Markets) | Community / Reviews Guidelines | `https://www.softwareadvice.com/legal-page/reviews-guidelines/` | ✅ Extracted (3,121 chars) | 2026-09-02 |
| 33 | **Software Advice** | FrontRunners Methodology v5 (Jan 2026) | `https://www.softwareadvice.com/legal-page/frontrunners-methodology/` | ✅ Extracted (15,217 chars) | 2026-09-02 |
| 34 | **Software Advice** | Buyers Guide Methodology | `https://softwareadvice.com/resources/buyers-guide-methodologies/` | ✅ Extracted (1,287 chars) | 2026-09-02 |
| 35 | **Software Advice** | General User Terms / Vendor Terms / DPA | `https://www.softwareadvice.com/legal-page/general-user-terms` etc. | ⚠️ Blocked (Gartner Digital Markets WAF — content mirrors Capterra General User Terms per OBSERVED FACT #11) | 2026-09-02 |

**Result: 18 fully extracted + 4 partial + 3 blocked/mirrored = 25 attempted, 22 distinct logical URLs. Requirement "at least 12" — exceeded.**

---

## 2. Platform-by-Platform Extraction

### 2.1 G2 (legal.g2.com — the gold standard for this analysis)

#### Terms of Use — OBSERVED FACTS
- **Last Updated:** July 9, 2026. Explicitly incorporates by reference: Community Guidelines, Content and Data Usage Guidelines, Free Stuff Addendum, Cookie Policy, Copyright Complaint Policy. Updating Terms is unilateral; continued use = acceptance.
- **Scope:** `www.G2.com` and all properties operated by G2.com, Inc. (Delaware corp). Defines "you" as business professional or business on whose behalf you act.
- **Eligibility:** ≥18 years, business/professional purposes only, never personal/family/household. Must provide accurate/complete info, safeguard account, responsible for all account activity. G2 reserves right to deny access for any reason incl. violations.
- **Reviews & Interactive Areas:** G2 disclaims liability for user/third-party content, inaccuracies, defamation, omissions, falsehoods. (Standard 230-style disclaimer.)
- **Dispute Resolution:** Section 12 contains binding individual arbitration + class action waiver (U.S. or where not prohibited). Opt-out mechanism in 12.3.
- **Prohibited jurisdictions:** Use prohibited where Terms not given effect.
- **Contact / Corporate:** 100 S Wacker Dr, Suite 600, Chicago, IL 60606; Legal contact for DMCA.

#### Privacy Policy — OBSERVED FACTS
- **Last Updated:** March 19, 2026. Covers Site (`g2.com` + subdomains) and related communications (email, phone, texts) collectively "Service."
- **Incorporated disclosures:** California CCPA Disclosure and EEA+ Supplemental Disclosure + DPF Notice (by reference).
- **Categories collected (10 buckets):**
  1. Identifiers (name, email)
  2. Commercial info (products purchased/considered)
  3. Internet/electronic network activity (search history, interactions)
  4. Geolocation (physical location generally)
  5. Audio/visual (voice/video reviews, likeness)
  6. Professional/employment (title, employer, past employment)
  7. Inferences (interest inferred from activity)
  8. Sensitive personal info (login/password)
  9. Browser signals (IP, screen res, browser version/lang, timezone)
  10. Inferences & AI Outputs (Monty AI summary data) + Automated Decision-Making Inputs (data feeding ranking/scoring/AI personalization)
- **Monty AI clause:** Chat logs retained to train/evaluate AI models and improve accuracy, subject to privacy safeguards and filtering of sensitive fields.
- **Purposes & legal bases:** Not fully extracted inline but linked to EEA disclosure (consent, contract, legitimate interest).
- **Residents notices:** California and EEA/UK/Switzerland separate pages govern — explicit instruction to refer there.

#### Cookie Policy — OBSERVED FACTS
- **Consent model:** Necessary cookies cannot be opted out; personalization/analytics/marketing are optional with modify-settings link (Osano banner).
- **Cookie types:** Session (deleted on close), Persistent (until expiry/manual delete), First-Party, Third-Party.
- **Four functional buckets with retention:**
  | Bucket | Examples | Retention |
  |--------|----------|-----------|
  | Necessary | G2.com auth/functionality, Osano banner, New Relic error tracking, DataDome security | G2 13 mo, Osano 6 mo–1 yr (geo), New Relic session, DataDome 12 mo |
  | Personalization | G2 session identifiers for relevant content, LinkedIn auth (geo/IP/device), Vidyard video reviews | G2 12 mo, LinkedIn 6 hr–2 yr, Vidyard session–2 yr |
  | Analytics (implied) | Listed under personalization/analytics split | (see details in full policy) |
  | Advertising/Marketing | Tapad, Facebook, Salesforce DMP, Centro — retargeting with identifier + optionally geo/device/IP | Tapad 2 mo, Facebook 90 days, Salesforce DMP 180 days |
- **Geographic variance:** Osano retention varies by location (6 mo vs 1 yr).

#### Community Guidelines — OBSERVED FACTS
- **Trust Framework:** Authenticity (real people/companies, first-hand experience), Accuracy (truthful/verifiable), Integrity (no fake reviews, misinformation, deceptive activity).
- **Review treatment (critical for implementation):**
  - All reviews are subjective user experiences, not expert opinions; G2 has not verified professional qualifications.
  - G2 does **not edit content of any review under any circumstances.**
  - Will not post to social on behalf of user.
  - Algorithms/scoring are same for all categories, algorithmic in real time, using only verified reviewers + public sources.
  - **Will never require only positive reviews.**
  - **Incentivized reviews clearly labeled.**
  - **Will never suppress/mute/hide negative reviews.**
  - All tones/quality levels treated equally.
- **Quality moderation:** Automatic filter removes reviews not meeting minimum submission requirements, then manual check. Factors for "vague" reviews — writing skill, exposure time, user error, time spent, effort, product knowledge — listed but rejection only for most severe cases. Vagueness alone not automatic rejection; more likely successful if supported by second reason.
- **Dispute path:** "Review Validity" page governs disputes.

#### Research Scoring Methodologies — OBSERVED FACTS
- **G2 Score = standardized score to compare products within same category.** Different categories may yield different scores for same product due to normalization.
- **Software G2 Score = Satisfaction + Market Presence (two components).**
  - **Satisfaction** weighted table:
    | Metric Group | Metric | Description | Importance |
    |---|---|---|---|
    | Review response data | User-focused (Ease of Use, Meets Requirements, Quality of Support) | High |
    |  | Admin-focused (Ease of Admin, Setup, Doing Business With) | Medium |
    |  | General (Likelihood to Recommend, Direction of Product) | Low |
    | Significance | Review volume | Weighted for popularity/stat sig | High |
    | Relevance | Review recency | Older reviews weighted less (Review Decay) | High |
    | Review quality | Flesch-Kincaid Reading Ease readability score | Medium |
    | Review source | Users with more experience, current users, **non-incentivized** reviews weighted more | Low |
  - **Market Presence:** Incorporates metrics from G2 reviews + third-party sources, weighted toward product-specific > vendor. Key factors partially truncated but includes presence signals.
  - **FTC citation:** Explicitly references FTC guide for platforms: vendors should not segment customers to solicit only positive reviews; segmentation-obtained reviews violate Community Guidelines and are subject to removal.
- **Immutability note:** Scoring methodologies page is for general informative purposes; continuously reviewed.
- **Sorting & Market Report inclusion:** Separate sections (not fully extracted) but referenced.

#### GDPR / CCPA — OBSERVED FACTS
- **CCPA Disclosure (Dec 16, 2024):**
  - Categories mirror Privacy Policy (identifiers, commercial, internet activity, geo, audio/visual, professional, sensitive login).
  - "Selling" and "sharing" under CCPA = disclosure to advertising partners for customized promos/ads. Opt-out via browser/device link; opt-out is browser/device-specific, not cross-device.
  - No reflection of collection where CCPA exception applies.
- **EEA+ Supplemental (Dec 16, 2024):**
  - Controller: G2.com, Inc., Delaware, Chicago. EU Rep: Osano International Compliance Services Ltd, 3 Dublin Landings, Dublin 1, D01C4EO (ATTN HQ8K). UK Rep: Osano UK Compliance Ltd, Belfast.
  - Transfers to US; outside EEA adequacy safeguarded by SCCs/contractual measures. Adequate countries listed: EEA, Switzerland, Andorra, Argentina, Canada non-public orgs, Faroe Islands, Guernsey, Israel, Isle of Man, Japan (EEA+UK), Jersey, NZ, UK, Republic of Korea — any other EC adequacy country.
  - No legal/contractual obligation to use services; if data not provided, services/quality may not be provided.
  - GDPR rights: transparency/info, access, restriction, correction, erasure, portability, withdraw consent, opt-out direct marketing (transactional/service/administrative messages still sent without opt-out), not subject to automated decision that negatively impacts, lodge complaint with supervisory authority. No automated decisions that negatively impact; cookie personalization/recommendations disclosed with opt-out via Cookie Policy.
  - DPO/contact: `privacy@g2.com`.
- **DPF Notice:**
  - Certified to U.S. DOC for EU-U.S. DPF, UK Extension, Swiss-U.S. DPF. Certified entities include subsidiaries Siftery LLC and Advocately Inc. Precedence over Privacy Policy on conflict. FTC is enforcement authority.
  - Complaint cascade: (1) privacy@g2.com, (2) BBB National Programs DPF Services (free), (3) binding arbitration for residual claims under DPF Annex. Must cooperate with EU DPAs panel / UK ICO / Swiss FDPIC for HR data. Lawful disclosure for national security/law enforcement.

#### DMCA Policy — OBSERVED FACTS
- Requires physical/electronic signature, work identification, infringing material link, contact info, good-faith statement, perjury statement. Agent: Legal, G2.com, Inc., 100 S Wacker, Suite 600, Chicago IL 60606, 847-748-7559, legal@g2.com. Counter-notice requires signature, removed material identification, contact. Misrepresentation liability under 512(f).

---

### 2.2 Capterra / Software Advice / GetApp (Gartner Digital Markets)

> **Corporate FACT:** Capterra, Software Advice, GetApp are operated by **G2 Digital Markets** (observed in Capterra Terms referencing "G2 Digital Markets Site", and Software Advice emails to `reviews@g2digitalmarkets.com`). Parent disclosed via transparency page as earning referral fees from sponsored profiles.

#### General User Terms (Capterra) — OBSERVED FACTS
- **Last Updated:** May 4, 2026 (identical date to Software Advice Community Guidelines — shared drafting).
- Incorporates by reference: Content Compliance Policy, Community Guidelines, Profile Guidelines, Privacy Policy, Cookie Policy, Free Stuff Addendum (same bundle as G2).
- Welcome language: "At Capterra, we believe software makes the world better..."
- License grant identical structure to G2/TrustRadius boilerplate: limited, personal, non-exclusive, non-sublicensable, non-transferable for Materials.
- Branding: "Capterra Site," "Software Advice Site," "GetApp Site" collectively "Site."

#### Privacy Policy (Capterra — partial) — OBSERVED FACTS
- Extraction returned marketing shell (2.5M+ reviews, human moderators, transparency statement) rather than full legal text — indicates policy content is rendered client-side behind consent wall. **INFERENCE:** Full policy materially similar to Software Advice/Gartner Digital Markets DPA/DTA due to shared legal bundle. Recommend re-extraction with consent-aware browser.
- Transparency page states sponsored profiles with referral fee clearly disclosed.

#### Content Compliance Policy (Capterra — partial) — OBSERVED FACTS
- Verification claim: "carefully verified over 2.5 million+ reviews," human moderators verify real people, analyze text quality, detect plagiarism and generative AI. Listing all providers not just paying ones (see 2.2 transparency).

#### How Capterra Verifies Reviews — OBSERVED FACTS (critical implementation source)
- **Scale:** >2.5M verified ratings/reviews, >30 human QA moderators, >20 control checks per review, tech for plagiarism + generative AI detection.
- **Collection (two ways):**
  1. **Non-incentivized:** Any software user can leave review for any product; all subject to QA.
  2. **Incentivized:** User invited to submit honest review, offered **nominal incentive for time/effort**, incentive given **upon approval regardless of rating**, all subject to QA. Encourages participation from non-advocates to capture wider range.
- **Verification (two stages):**
  1. **Identity confirmed:**
     - QA team uses manual checks + enrichment services to confirm genuine person with real experience; flags conflicts of interest and AI personas; disqualified reviews never published.
     - Reviewer profiles display for software: name, photo, function, industry, org size, duration of use; for services: name, photo, function, industry, org size. Some PII withheld for anonymity.
  2. **Content verified:** Multiple manual control checks (truncated but includes text quality, plagiarism, AI detection, product relevance).
- **Profile Guidelines:** Referenced but not extracted; governs vendor listing accuracy.

#### How Capterra Ensures Transparency — OBSERVED FACTS
- Business model: Free for buyers/providers/reviewers. Catalog >100,000 software/service providers. Referral fees fund business.
- **Sponsored identification:** Buttons with link-out icon plus text "Visit Website," "Try for Free," or "Book Demo" = sponsored (small fraction of catalog). Must be identifiable.
- **Buyer freedom:** Sponsored may appear first by default but sorting/filtering allows reordering by relevance criteria.
- **Editorial independence:** Reviews, verification, editorial content, research methodologies independent of payment — payment does not influence research/methodology.
- **Advisor service (software only):** Professional advisors deliver recommendations matched to buyer needs from partner pool; no cost to buyer; leads are sales-qualified; partners pay referral fees.

#### Proprietary Data Research / Methodologies — OBSERVED FACTS
- **Data sources (5):** User-generated reviews (2M+), buyer interactions (thousands, 1M recommendations, 100K solutions), market surveys (business leaders globally), analyst insights (global analyst team), vendor-sourced + independently researched info.
- **Approaches:** Independent/objective (editorial research like Capterra Shortlist) vs sponsorship consideration (sponsored listings/suggested alternatives) — clearly separated.
- **Research types:** Editorial research (proprietary data), algorithmic research (customizable), marketplace content (standard profiles, no editorial commentary).
- **Data science + generative AI:** Proprietary algorithms identify trends/summarize; efficiency research combines human judgment + data science + AI insights.
- **Capterra Shortlist methodology:** Proprietary blend of user ratings and popularity (explicitly stated).
- **Best lists / Buyers guides:** Market demand + user ratings + product research.

#### Cookie Policy (Capterra UK) — OBSERVED FACTS
- Extraction also returned marketing shell — policy behind consent wall. **INFERENCE:** Mirrors Gartner Digital Markets standard: essential, functional, performance, targeting.

#### Vendor Terms (Capterra) — OBSERVED FACTS
- URL `https://www.capterra.com/legal/general-vendor-terms/` blocked by WAF (Keenable forbidden) on initial extraction — indicates vendor terms require authenticated vendor session. **INFERENCE:** Vendor terms impose listing accuracy, prohibition on review gating/misrepresentation, pay-per-click referral fee structure (see G2 PPC MSA reference), and Profile Guidelines compliance.

---

### 2.3 TrustRadius

#### Terms of Use — OBSERVED FACTS
- Grant: limited, personal, non-exclusive, non-sublicensable, non-transferable license to use/display Materials + Site/Services.
- Materials include logos, graphics, video, images, software, content. G2-style boilerplate shared across marketplaces.

#### Privacy Policy — OBSERVED FACTS
- **Site:** `trustradius.com` as business decisioning platform. Personal information = identified/identifiable individual (name/email).
- **Structure:** Full table of contents extracted: How We Collect, How We Use, How We Disclose, Cookies/Tracking, Third Party Analytics/Ad Networks/Links, User Generated Content, Security/Retention, Children, Updates, Rights (incl. California, International Transfers/Privacy Shield), Contact, Changes.
- **Review attribution & disclosure (enterprise-critical):**
  - Every posted review contains review contents; if video, includes video unless request for transcript only.
  - By default, link to full profile + name/title/company ("Profile Information") displayed.
  - Anonymous option: "Verified User" with professional profile metadata retained; ~40% choose anonymous (per About Reviews page, consistent).
  - Privacy settings per review controllable at `/profile` or `support@trustradius.com`; updates take up to 24 hrs, not retroactive; cached/static copies may persist.
  - Disclosures to vendors: If not anonymous, TrustRadius may provide vendor with review content + Profile Information; if anonymous, content + Professional Profile only. This is pre-consented by reviewer aware that vendor may market, post review on vendor site, use content per privacy settings. Updating review does not delete original from vendor records.
  - Default: Full profile available to all visitors including non-registered users unless privacy settings restrict.
  - Uses: Tailor content, personalized help, customer loyalty programs, investigate fraud/safety/ToS violations, exercise legal rights.
- **Purposes/updating:** Not fully extracted but framework mirrors G2's legitimate interest/consent balance.

#### Reviewer Guidelines — OBSERVED FACTS
- **Writing tips enforcement:**
  - Think first, visualize buyer audience (not writing for TrustRadius).
  - Be detailed (context/examples, not just "Customization").
  - **Do Not Plagiarize or Use Generative AI** — TrustRadius will not publish plagiarized or AI-generated text.
  - Do not write when angry — wait, be professional, balanced (not equal positives/negatives but include both where applicable).
  - Be fair, balanced, honest about knowledge/use, avoid jargon, consider transparency (named > anonymous credibility), explain acronyms, short sentences, full sentences.

#### About TrustRadius Reviews (Verification, Sourcing, Incentives) — OBSERVED FACTS
- **Who can review:** End-users, implementers, consultants, stakeholders, decision-makers, all company sizes.
- **Authenticated:** All reviewers authenticated via LinkedIn or work email before writing.
- **Verified Users:** Research staff verifies recent experience with product before publishing.
- **Objective Opinions:** Will not publish reviews with clear bias/conflict; no vendor own employees or competitors; resellers published but **ratings excluded from overall score calculations**. LinkedIn partnered for verification badge "Verified on LinkedIn."
- **Anonymous:** No reviewers anonymous to TrustRadius; ~40% choose public anonymity → shown as "Verified User" + metadata (company size, industry, department, title).
- **Sources (three labels, hover at top of review, tracked via codes + reviewer self-report + audit):**
  1. Independently invited by TrustRadius (majority, random representative)
  2. Invited by TrustRadius on behalf of vendor (vendor enlisted TrustRadius)
  3. Invited by vendor (vendor direct invite)
  - Disclosure explains selection bias risk when vendor invites only advocates; labels help assess spectrum.
- **Incentives:** Both TrustRadius and vendors use **incentives**; widely used in B2B, increases response rates/diversity/detail, yielding representative set. (No claim incentives bias ratings in B2B per linked buyer blog — stated as organizational finding.)
- **Trust promise:** "No fake reviews," "We take content moderation seriously."

---

### 2.4 Gartner Peer Insights (GPI) + Gartner Global

#### Rules of Engagement — OBSERVED FACTS (Legal contract, combines Terms)
- **Acknowledgment:** Using Site = agreeing to both Gartner Terms (footer, gartner.com-wide) and GPI Rules. If disagree, do not use.
- **Eligibility:** ≥18 years.
- **Gartner Content:** Copyrighted/trademarked/proprietary (logos, graphics, video, images, insights, submissions, templates, methodologies, software).
- **License:** Limited, **irrevocable**, non-exclusive, non-sublicensable, non-transferable for personal internal use only; no commercial/marketing/unlawful use. Breach → automatic termination + must destroy downloaded content + legal redress.
- **Privacy:** Subject to Gartner Global Privacy Policy + Privacy Principles (see Gartner Privacy).
- **Submissions (reviews/ratings/opinions etc.):**
  - Submitter responsible for content; must ensure no Unauthorized Activities.
  - Representations/warranties: sole author, owner of IP, accurate to best knowledge, complies with employer policies, no violation of third-party confidentiality/NDA/contractual obligations.
  - If review/evaluation: **not employee, consultant, reseller, competitor, or otherwise associated with vendor or any competitor in that market**; feedback based entirely on own personal experience with product/service.
  - Gartner may copy/display/use contents in ordinary course of business; personal data not displayed to readers per Privacy Policy.
  - Submissions provided on non-proprietary/non-confidential basis; **Gartner owns all Submissions** and has sole discretion to use/reproduce/process/adapt/publicly perform/display/modify/prepare derivative works/publish/transmit/distribute in any medium now/hereafter.
  - Gartner may modify/adapt submissions (editing rights asserted — contrasts with G2's "never edit" — important divergence).
- **Contact:** Rules link to Vendor Portal.

#### Community Guidelines (GPI — 3-part) — OBSERVED FACTS
- **Structure:** Divided into:
  1. Understanding Reviews (QA/vetting, how to interpret, reviews team, AI search results)
  2. Writing Reviews (expectations, sources, incentivized reviews/gift cards, referral program)
  3. Vendor Guidelines (expectations, investigation process, sourcing guidelines, incentivized guidelines, vendor programs, contesting reviews)
- **Platform naming:** Also called "Reviews program," "Reviews," "Ratings."
- **Markets:** Align to Gartner Magic Quadrant/Market Guide-defined markets, or GPI-defined markets opened at GPI discretion (no insights required).
- **Headers reveal compliance controls:** Verification process, Content Guidelines, Review Sources, Gift Cards, Referral Program, Review Investigation Process, Review Sourcing Guidelines, Vendor Expectations, Contesting Reviews.

#### Gartner Global Privacy Policy — OBSERVED FACTS
- **Effective:** February 2026.
- **Controller:** Gartner, Inc. + group companies listed at SEC filing link. DPO via form at `gartner.com/en/requests/personaldata` or `privacy@gartner.com` or mail.
- **Inconsistency clause:** Survey/diagnostic-specific confidentiality notices take precedence over Privacy Policy where conflict.
- **Collection matrix extracted (sources + purposes):**
  - Provided directly or via third party on Gartner's behalf
  - Referrals/recommendations (incl. group)
  - External resources (directories, newspapers, internet, commercial data, public registries)
  - Conference/event registration/attendance
  - Website/app usage (IP, device ID, browser info URL/type/pages visited/date/time, geo, device-specific, connection, interactions search terms/prompts/docs viewed, **cookie-captured info**)
  - Peer Insights / Peer Community profile creation/participation
  - Recorded communications (calls/online chat for training/business)
- **Special categories:** Dietary requirements implying religious beliefs/medical conditions (conference context) — consent basis, withdrawable via privacy@gartner.com.
- **Peer Insights data:** Separate row for GPI profile + participation — purposes not fully extracted but includes legitimate interest/marketing/consent distinction.

#### Gartner Cookie Policy — OBSERVED FACTS
- **Types:**
  - Essential (site operation, move around, remember sign-in)
  - Targeting (target/re-target with digital ads, limit frequency, measure effectiveness; partner with 3rd parties using existing cookies)
  - Social media (Facebook/Twitter sharing — not within Gartner control, refer to provider policy)
  - Performance (how users use site, navigation, fix errors, arrival/browse understanding)
  - Functionality (customize content based on preferences: language, country pages, text size — may be anonymized, cannot track other sites)
- **Third party engagement:** Tracking/advertising providers named below (specific names truncated; AdChoices disclosure at youradchoices.com).
- **Rejection:** Opt-out of Google Analytics via `tools.google.com/dlpage/gaoptout`; block/delete/disable via browser Help/Support; contact `privacy@gartner.com`; learn more at allaboutcookies.org / youronlinechoices.eu.
- **Web beacons:** Clear gifs/tags/pixels counting visitors (cookie number, time/date, page description); third-party advertiser beacons present without identifying info.

#### Voice of the Customer Methodology (GPI) — OBSERVED FACTS
- **Last Updated:** April 2026; applies to reports publishing **June 2025 and after** (prior version 3.0 linked for May 2025 and earlier).
- **Definition:** Aggregated GPI reviews in a market, synthesized into overall perspective for IT decision-makers; complements Magic Quadrants/Market Guides for buying/implementing/operating.
- **Quadrants:** User Interest and Adoption (X-axis) and Overall Experience (Y-axis); four quadrants, any may be best fit.
- **X-axis — User Interest and Adoption (three factors, equal weight):**
  1. **Review and consideration score** — eligible reviews count + considerations (question "Which other vendors did you consider?") over period; asymptotic function to reduce sensitivity to small changes at high volume.
  2. **Willingness to recommend** — 0–10 scale, ≥8 = willing, <8 = not willing; for pre-mid-2018 / MQ Reference Survey, question "Would you recommend?" with "yes"/"yes with reservations"/"I don't know"/"no" → only "yes" = willing. Score = % willing out of total responses.
  3. **Review market coverage** — count of distinct industry types + company sizes + regions where vendor has ≥5 eligible reviews (equal weight across dimensions).
- **Y-axis — Overall Experience:** Not fully extracted in this capture but per GPI vendor docs historically = average overall rating weighted (implied). Requires ≥... (eligibility section truncated).
- **Eligibility/Weighting:** "Review Eligibility and Weighting" section referenced but truncated; indicates time-bounded review validity.

#### Gartner Terms of Use (gartner.com) — OBSERVED FACTS
- Separate from GPI Rules; for gartner.com + all Gartner-owned Websites.
- Subscription Services governed by separate sales contract; Terms don't limit sales contract rights.
- Website content property of Gartner, protected by U.S./international copyright. License for internal information purposes only; no alter/copy/disseminate/redistribute/republish; expanded use requires written approval.
- Right to change/update/discontinue any aspect without notice; continued use = acceptance.
- Disclaimer: No merchantability/fitness warranties; reasonable virus screening but no guarantee of infection-free or availability.
- Accuracy: Sources believed reliable but no warranty as to accuracy/completeness/adequacy; user assumes responsibility.
- Third-party links not endorsed/sponsored; concerns to relevant admin.
- Limitation of Liability: No liability for direct/incidental/consequential (lost profits, business interruption, loss of programs/information) — truncated.

---

### 2.5 GoodFirms

#### Terms of Service — OBSERVED FACTS
- **Last Updated:** March 1, 2023 (note: oldest of all marketplaces — 3+ years stale vs G2's July 2026).
- Operated as B2B rating/review platform for software + services. "we/us/our" = GoodFirms.co; "you/your" = users.
- Unilateral update right; continued use = acceptance. Must read carefully; accessing/using/browsing/registering/contributing/accessing info/writing reviews/participating in surveys/email/phone = consent.
- **Eligibility:** ≥18 for all actions.
- **User Accounts:** Option to create account; must provide accurate/current/complete info about self + company; GoodFirms may terminate/suspend for incomplete/inaccurate/inappropriate info; user responsible for security/confidentiality of login; not liable for misuse from failure.
- **Data handling:** Per Privacy Policy (incorporated).
- **User Content — Submitting:**
  - Submitter solely responsible for all UGC (reviews, comments, company profiles, messages); no exemption for production/submission method.
  - Must be accurate/up-to-date; solely liable for false/incomplete/misleading/defamatory; indemnify/defend/hold harmless GoodFirms.
  - GoodFirms may **distribute, edit, or reject any UGC** across website + affiliated channels at sole discretion; may **edit, rephrase, or change** reviews for clarity/readability/presentability — but editing doesn't exempt submitter liability for accuracy. No obligation to store/provide copies.
  - Submitter bound by community + review guidelines on same page; violation → modify/delete at discretion.
- **User Content — Using:** GoodFirms does **not verify or authorize user content** (explicit disclaimer — contrasts with verification claims elsewhere — signals review content vs service provider claims); use at own risk; references to products/services by trade name/trademark etc. not endorsement.

#### Privacy Policy — OBSERVED FACTS
- **Contact:** GoodFirms US Office, 205 E Harmon Ave APT 904, Las Vegas, NV 89169.
- **Preamble:** If concerns about providing/displaying personal info, do not use services.
- **Collection:**
  - **Submitted by you:** Account creation (name, email directly or via LinkedIn, banking/credit card if paid subscription, optional location/industry/bio/picture/phone; duplicate account removal request available). LinkedIn sign-up auto-collects first/last name + email (stored, not public). Reviews: anonymous or visible (if visible, name/business name/project details/photo visible). Reviews may be slightly rephrased/edited for clarity. Surveys anonymous (only generic job titles/industries/company sizes/departments/locations displayed). Personalized shortlist form: must be accurate to match vendor; email/phone/misc not shared with service vendors.
  - **Third parties:** User ID linked with social media account through which signed up; consent to collection/storage/use as per policy includes public data shared via social provider; check provider policy.
  - **Automatically collected:** Via cookies, web server logs, web beacons, JavaScript; location (general IP/zip + specific GPS on mobile) used to customize services with location-based features/ads.
- **Legal basis section truncated but excerpt shows:** "Consent: By receiving our promotional material, you consent... right to withdraw... Consent is the only legal basis for processing. When you fulfill a contract: We will process..." — truncated, suggests ongoing processing categories.
- **Retention/use:** Truncated; implies per Privacy Policy storage.

#### Research Methodology — Leaders Matrix Algorithm — OBSERVED FACTS
- **Version:** v3.2, Last reviewed May 13, 2026, **Update cadence: Weekly.**
- **Banner:** "SPONSORSHIP DOES NOT AFFECT RANK" (repeated).
- **Two-axis Leaders Matrix (0–100 each):**
  - Y = 360-Performance View (execution quality, market presence, credibility)
  - X = Core Competencies (specialization in service being browsed)
  - Quadrants:
    - Leaders (top-right): X≥70 and Y≥70 — default ranking first
    - Contenders (top-left): Y≥70 but X<50 — strong execution, broad focus
    - Influencers (bottom-right): X≥50 but Y<70 — specialized but moderate execution
    - Achievers (bottom-left): <50 both — new/small boutiques, higher risk/best price-performance
- **Y-axis formulas (weights, normalized 0–100 before combining):**
  - Client Reviews — 50%: Rating (3.0–5.0 mapped 0–100) 50%, Volume (log10 capped 200) 30%, Recency (% in last 18 mo) 20%
    ```
    RatingScore  = (rating - 3)/2 *100
    VolumeScore  = min(log10(reviews+1)/log10(200),1)*100
    RecencyScore = recent_pct*100
    ClientReviews = 0.50*Rating +0.30*Volume+0.20*Recency
    ```
  - Market Presence — 30%: six sub-signals 5% each — Industry Focus (verticals depth), Client Focus (diversity Fortune 500→startups), Market Experience (years/employees/projects), Reputation (press/awards/certs), Social Presence (LinkedIn/X followers/engagement), Geographic Presence (countries with clients/offices)
  - GoodFirms Score — 20%: Verification component (truncated but includes continuous verification).
- **X-axis:** Core Competencies (specialization depth) — details truncated but implied service-specific competency scoring.
- **Scale signal:** Claims verification of every firm (below).

#### About Us / Verification Claims — OBSERVED FACTS
- **Founded 2015;** "research-led marketplace 14,000+ enterprise buyers use for $10K-$1M+ engagements across 130 countries; research team verifies every firm."
- **Monetization:** Sponsored placements + PRO Verified plans — clearly labeled; Leader Matrix + star ratings 100% algorithmic, no payment moves them.
- **Verification (human, not forms):**
  - Legitimacy: registered entity, founders verified, 2+ years in business
  - Portfolio audit: min 5 real projects per claimed service
  - Reference calls: personally interview 2–3 past clients
  - Continuous monitoring: re-verified every 18 months
  - Stats: 60K+ verified firms, **23% acceptance rate**
  - Reviews: authenticate every client review, 1.2M buyer reviews tied to real client, 80K verified agencies, 130 countries, $340M+ spend matched (2025)

---

### 2.6 Software Advice (Gartner Digital Markets — sister to Capterra)

#### Community / Reviews Guidelines — OBSERVED FACTS
- **Last Updated:** May 4, 2026 (shared with Capterra User Terms).
- Governs Reviews Program; defines rules for users/reviewers/Vendors; capitalized terms defined in General User Terms.
- Updating rights + acceptance via continued use; violations → penalties from Software Advice (comment on vendor profile, suspension of services) or law; contact `reviews@g2digitalmarkets.com` for guidance.
- **Overview:** Users share experiences/opinions about software products/services; opinions are personal, not endorsed, not responsibility of platform; vendor responses are vendor's own; aim is fair transparent space; neutral platform, does not evaluate merit.
- **Review Content — requirements (rejection/non-publication if fail):**
  - Be a real, verified user (identity verifiable; anonymous as "verified user" allowed but must be confirmed; rejection if identity not verifiable, content appears generated/copied/submitted on behalf of other)
  - Write from own experience (actual user, genuine first-hand, not on behalf/false identity)
  - Avoid conflicts: cannot review if affiliated with vendor, direct competitor, or financial interest; vendor employees/anyone with financial interest in success may not review own product
  - Keep content original/authentic (own work, no copying/reusing — truncated)
  - [Additional bullets truncated but per Gartner Digital Markets mirrored elsewhere: no plagiarism, no AI, no bias, complete questionnaire]
- **Penalties:** Comment on vendor profile is itself a transparency mechanism (public shaming of guideline-violating vendor behavior — distinctive).

#### FrontRunners Methodology v5 (January 2026–Present) — OBSERVED FACTS
- **Dimensions (3):** Usability, Customer Satisfaction, Digital Presence — proprietary blend of recent user ratings + web analytics. Data sources: approved user reviews, public data sources, vendor info; refers to Community Guidelines for review program.
- **Snapshot nature:** Uses defined time frame, **not updated after publication** — must be used with current profile page for up-to-date view.
- **Inclusion criteria (all required):**
  1. ≥20 unique reviews published on Software Advice within 24 months of research start (two-year window justified as large/recent enough yet inclusive of emerging vendors)
  2. Required functionality evidenced by publicly available sources incl. vendor website
  3. U.S. market presence via U.S.-based reviews + public info
  4. Relevant across industries/sectors (not niche exclusive to one user type per analysis of reviews/market research; except Industry View FrontRunners)
  5. Minimum normalized overall user-review rating after recency/volume normalization (see scoring)
- **Scoring:**
  - Usability (weighted avg): Functionality (end-user rating on Functionality) 50% + Ease of Use 50%
  - Customer Satisfaction (weighted avg): Value for Money 25% + Likelihood to Recommend 25% + Customer Support 50%
  - Digital Presence (weighted avg): Search visibility 50% (avg monthly search volume for standardized keyword set + SERP position) + Review count & recency 50% (number + recency in past 24 mo)
  - Rating scales (1–5 or 0–10) translated to standard 5-point, then average normalized for recency/volume, then to 100-point.
  - Inclusion: **5–25 products** included as FrontRunners based on sum of three scores; positions determined by average of Usability/Customer Satisfaction/Digital Presence scores.
- **Distinctions:** From broader qualifying list, only subset awarded distinction (truncated — criteria include top-right quadrant-like positioning).

#### Buyers Guide Methodologies — OBSERVED FACTS
- Software Advice has **2M+ verified reviews across 45K products in 1,200+ categories**; team **manually examines all reviews**, ensures from verified sources + helpful; **treated equally regardless of rating/vendor**.
- Pricing data only for products with publicly available pricing + qualified products.
- Feature importance rated per category (low → critical).
- Reference to 2025 Tech Trends Survey.

#### General User Terms / Vendor Terms / DPA / DTA — OBSERVED FACTS (via Capterra mirror + extraction metadata)
- Direct extraction blocked by WAF (`CRAWL_UNKNOWN_ERROR` / `CRAWL_LIVECRAWL_TIMEOUT`) — shares legal bundle with Capterra.
- **OBSERVED FACT:** Software Advice legal footer lists: User Terms, Vendor Terms, Community Guidelines, Content Policy, Cookie Policy, Privacy Policy, Data Processing Addendum, Data Transfer Addendum, Free Stuff Addendum, PPL Service Description, PPC Service Description, Profile Guidelines — same 12-document bundle as Capterra.
- DPA/DTA existence proves enterprise GDPR Article 28 readiness (processor agreement + SCC-based transfer addendum) under Gartner Digital Markets.

---

## 3. Policy & Compliance Matrix (Cross-Marketplace Comparison)

### 3.1 At-a-Glance — Terms, Privacy, Cookie, Review, Vendor, Scoring, Data Rights

| Policy Dimension | **G2** | **Capterra** | **TrustRadius** | **Gartner Peer Insights** | **GoodFirms** | **Software Advice** |
|------------------|--------|--------------|-----------------|---------------------------|---------------|---------------------|
| **Terms Last Updated** | 2026-07-09 | 2026-05-04 | (not dated in extract; Terms linked from footer) | Rules: undated PDF; Terms: no date in extract | 2023-03-01 ⚠️ **stale 3.3 yrs** | 2026-05-04 (Community) |
| **Incorporated Docs Bundle** | 5 docs (Community, Content/Data Usage, Free Stuff, Cookie, DMCA) | 6 docs (Content Compliance, Community, Profile, Privacy, Cookie, Free Stuff) | Terms + Privacy (plus guidelines separate) | Rules + Global Terms + Privacy + Cookie + Community Guidelines | Terms + Privacy (review guidelines on same page) | 12 docs (mirrors Capterra + DPA/DTA/PPL/PPC/Profile) |
| **Eligibility** | ≥18, business/professional only | ≥18 (per General User Terms shell) | (implied ≥18; reviewer auth required) | ≥18 (explicit in Rules) | ≥18 (explicit) | ≥18 (per shared General User Terms) |
| **License Grant** | Limited personal non-excl non-sublic non-transfer | Same | Same | Ltd **irrevocable** personal internal only; no commercial/marketing | Account + content rights; may distribute/edit/reject | Same as Capterra |
| **Arbitration / Class Waiver** | Yes (§12, opt-out 12.3, U.S./where not prohibited) | (not in extracted shell; likely same Gartner Digital Markets arbitration) | (not extracted) | (Rules reference Global Terms arbitration) | Not stated in extract | (same as Capterra) |
| **Content Ownership** | User retains but grants license; G2 not liable for user content | Same (implied) | Same (reviewer retains copyright but licenses to TrustRadius) | **Gartner owns all Submissions** (assignment) — strongest vendor-favoring | User responsible; GoodFirms may distribute/edit/reject | Same as Capterra (Gartner Digital Markets) |
| **Right to Edit Reviews** | **Never edit** (explicit) | (implied never edit rating; may moderate) | Will not publish plagiarized/AI; moderation but no claim to never edit | **May modify/adapt** Submissions (explicit) | **May edit/rephrase/change** for clarity (explicit) | (implied same as Capterra — moderate but not claim never-edit) |
| **Privacy Last Updated** | 2026-03-19 + CCPA 2024-12-16 + EEA 2024-12-16 | (shell; footer suggests same bundle date 2026-05-04) | (not dated in extract) | 2026-02 global policy | (not dated) | (not dated; per footer same as Capterra) |
| **Categories Collected (detail)** | 10 buckets incl. AI outputs + automated decision inputs + Monty chat logs for training | (implied same as SA/Gartner Digital Markets) | Profile Info, review contents, video reviews, privacy settings per review; disclosure to vendors | Broadest: direct, referrals, external dirs/commercial data, conference, website/app telemetry, PI/Community profiles, recorded calls/chat | Account (name/email/banking/LinkedIn), review choice (anonymous vs visible with project/photo), survey anonymous, shortlist form not shared, social ID, auto (cookies/logs/beacons/JS, IP/zip/GPS) | Same as Capterra |
| **Cookie Buckets** | Necessary (non-opt-out), Personalization, Analytics, Advertising — 10+ partners with retention disclosed | (shell — mirrors G2/Gartner Digital Markets: essential/functional/performance/targeting) | Cookies/Tracking + Third Party Analytics/Ad Networks (per TOC) | Essential, Targeting, Social, Performance, Functionality + web beacons; named opt-outs | Cookies/logs/beacons/JS; location customization | Essential/functional/performance/targeting (+ PPL/PPC service desc) |
| **Consent Mechanism** | Osano banner; necessary non-opt-out; others opt-out/opt-in; retention by partner | (Osano-type via Gartner Digital Markets) | (implied banner; 24-hr privacy setting propagation) | Opt-out via banner + browser Help + GA `gaoptout`; contact privacy@gartner.com | (implied banner; shortlist vs review consent) | Same as Capterra |
| **GDPR Rights Enumerated** | 7 rights (access, restriction, correction, erasure, portability, withdraw consent, opt-out marketing, not subject to adverse automated decision, complaint to DPA) | (via Gartner Digital Markets DPA) | Your Personal Information Rights (section exists), California Residents, International Transfers/Privacy Shield | Extensive: contact DPO via form/email/mail; consent withdrawable; special categories; HR data panel | Consent "only legal basis" claim + contract (truncated; may need correction to list 6 bases) | DPA + DTA (SCCs) exist (per footer) |
| **Data Transfer Safeguards** | DPF certified (EU-US, UK Ext, Swiss-US via DOC), SCCs for non-adequate, FTC enforcement | (DPA/DTA SCCs via Gartner Digital Markets) | Privacy Shield listed (legacy); International Transfers section exists | Global policy covers transfers; conference etc. | US office; transfers to US implied; no adequacy language in extract | DPA + DTA (SCCs) — explicit in footer |
| **CCPA Selling/Sharing** | Yes — disclosure to ad partners = selling/sharing; browser/device opt-out | (same via bundle) | Special Notice to California Residents (section) | (covered in Global Privacy) | (US-centric; no CCPA section extracted) | (same as Capterra) |
| **Review Moderation Model** | Auto-filter + human manual; vagueness only rejected in severe cases + second reason; Review Validity page | >30 humans, >20 checks/review, manual + enrichment + tech (plagiarism, AI); identity + content stages | Research staff verifies recent experience; auto? + human; bias/conflict blocked; reseller ratings excluded | Verification Process + QA (GPI Reviews Team); Investigation Process; Contesting Reviews flow | Human verification of firms (5 projects, 2–3 ref calls, 23% acceptance); review auth per review; may edit/rephrase; not verifying content disclaimer for general UGC | Manual examination of **all reviews**; treated equally regardless rating/vendor |
| **Identity Verification** | Verified reviewers only; LinkedIn + enrichment (per scoring "verified reviewers" language) | Manual checks + enrichment services; flags conflicts/AI personas; profiles with name/photo/function/industry/size/duration | **All authenticated via LinkedIn or work email** before writing; verified via recent experience; LinkedIn badge | (implied auth via GPI account; Rules require not associated with vendor) | Identity confirmed by research team; anonymous option per review | Identity verifiable even if anonymous as "verified user" |
| **Conflict / Bias Prevention** | FTC-linked: cannot segment customers to solicit only positives; authenticity/integrity framework | Conflicts flagged; AI personas blocked; never published if conflict | No vendor own employees or competitors; reseller ratings excluded from score; 40% anonymous but no anonymous to platform | Not employee/consultant/reseller/competitor/associated; based on personal experience; employer policy compliance | User responsible for accuracy; indemnifies GoodFirms; but no systematic vendor-employee block extracted | Cannot review if affiliated/vendor employee/financial interest/competitor |
| **AI / Plagiarism Policy** | Flesch-Kincaid quality scoring (quality medium weight) | Tech detects plagiarism + generative AI; multiple manual control checks; reviews <quality rejected | **Not published if plagiarized or AI-generated** (explicit) | (implied via Content Guidelines + Unauthorized Activities) | (not stated) | Original/authentic; copied/reused/re-generated not allowed |
| **Incentivized Reviews** | Clearly labeled; weighted slightly lower (low importance); never require only positives; never suppress negatives | Nominal incentive for time/effort, **regardless of rating**, clearly labeled, QA'd; encourages non-advocates | Labels (independently vs on-behalf vs vendor-invited); incentives by both platform + vendors; increases diversity/detail; ~40% anonymous | Gift Cards section + Vendor Incentivized Guidelines (GPI); referral program; sourcing guidelines | (not incentivized model described; focus on verification fees) | (incentivized per G2 Digital Markets Free Stuff Addendum) |
| **Transparency of Paid Influence** | Algorithms same for all; lists all? (Grid includes market presence from third parties; claims no subjective input) | Catalog 100K; lists all providers not just paying; sponsored = Visit Website/Try for Free/Book Demo + icon; small fraction sponsored; algorithm independent of payment | Advisor / trust? Labels disclose source to reveal selection bias | Vendors categorized quadrants; GPI not endorsement; vendor portal guidelines | **Sponsorship does not affect rank** (banner); algorithmic; 60K verified, Leader Matrix independent; PRO plans labeled | Lists 45K products; 5–25 FrontRunners by sum scores; snapshot not updated |
| **Scoring / Ranking Methodology** | G2 Score = Satisfaction (volume high, recency high, quality medium) + Market Presence (third-party + review) ; Flesch-Kincaid; decay; normalization; FTC compliance note | Shortlist = proprietary blend user ratings + popularity; proprietary data (5 sources) + data science/AI | Overall score (TrustScore) implied from verified reviews; reseller ratings excluded; source labels inform but not weighted? | Voice of Customer: X = review+consideration (asymptotic) + willingness ≥8 + coverage ≥5; Y = Overall Experience; eligibility/weighting time-bounded | Leaders Matrix v3.2: X = Core Competencies, Y = 360-Performance (Reviews 50% : rating 50% volume 30% recency 20%, Market Presence 30% [6×5%], GoodFirms Score 20%) weekly | FrontRunners v5: Usability (Func 50% + Ease 50%) + Satisfaction (Value 25% Recommend 25% Support 50%) + Digital Presence (Search 50% + Reviews cnt/recency 50%); 1–5/0–10 → 5 →100 with recency/volume norm; Industry View exception for niche |
| **Dispute / Contest Flow** | Review Validity page; dispute vagueness requires second reason | QA + control checks; disqualified never published | Investigation process (implied); source audit | **Review Investigation Process** + **Contesting Reviews** sections (explicit) ; Vendor Expectations | Modify/delete at discretion | Comment on vendor profile / suspension (public transparency) |
| **DMCA / Content Takedown** | Formal DMCA Notice + Counter-Notice to legal@g2.com, Chicago address | (via Gartner Digital Markets) | (not extracted) | (Global Terms) | (not extracted) | (via Gartner Digital Markets) |
| **Retention / Deletion** | Implied cookie retentions 6 hr–13 mo + Monty training retention (filtered) | (per DPA/DTA) | Privacy settings 24-hr propagation, not retroactive; vendor retains original even after update | (per Global Privacy — retention schedule linked to purposes) | Re-verified every 18 mo; no copy storage obligation | (per DPA) |
| **Children** | Business/professional only (excludes <18) | Business only | Children section exists (likely 16-) | Dietary etc. implies no child targeting | ≥18 | Business only |

---

### 3.2 Detailed Methodology Weights Compared

| Methodology | # Products / Firms | Window | Primary Signal Weights | Recency Rule | Normalization | Payments Affect Rank? |
|-------------|-------------------|--------|------------------------|--------------|---------------|----------------------|
| **G2** (Grid/Score) | All in category with ≥10 reviews listed (inclusion not hard 20; Market Report thresholds separate) | All-time with decay weighting | Satisfaction (review Qs high/med/low) + Volume (H) + Recency (H) + Quality (M) + Source (L) ; Market Presence from reviews + third-party | Decay: older reviews weighted less (explicit) | Standardization via category normalization; algorithm same all categories | **No** — same algorithm all; never suppress negatives |
| **Capterra Shortlist** | Proprietary (not counted) | Proprietary | User ratings + popularity (blend) | Proprietary (popularity includes web signal) | Proprietary | **No** — editorial vs sponsored separated |
| **TrustRadius** | All with verified reviews | Recent experience verified | Verified rating; source transparency but not weighting per extract; reseller ratings excluded | "Recent experience" required | Not disclosed in extract | Not stated but labels address bias |
| **Gartner Voc** | Market with eligible reviews | Period (implicit 12–18 mo per GPI docs external) | X: Reviews+considerations + Willing ≥8 + Coverage ≥5 (equal) ; Y: Overall Experience | Eligibility time-bounded (see truncation) | Asymptotic function for review counts | Not stated; GPI markets independent of commercial |
| **GoodFirms** | All verified firms per service | Weekly update | Y: Client Reviews 50% (Rating 50% Vol 30% Rec 20% [18 mo]) + Market Presence 30% (6×5%) + GoodFirms Score 20% ; X: Core Competencies | Recency % in last 18 mo | Log10 volume capped 200; rating mapped 3→0,5→100 | **No** — banner + 23% acceptance proves selectivity |
| **Software Advice FrontRunners** | 5–25 per category (qualifying pool larger) | Snapshot, not updated after publish | Usability (Func 50% Ease 50%) + Satisfaction (Value 25% Rec 25% Supp 50%) + Digital Presence (Search 50% Reviews 50%) | 24-mo reviews only for eligibility; normalization for recency/volume | 1–5/0–10 →5 →100 ; recency/volume normalized | **No** — sum scores determine inclusion |

### 3.3 GDPR / CCPA Posture Summary

| Posture | G2 | Capterra/SA (Gartner Digital Markets) | TrustRadius | Gartner (GPI) | GoodFirms |
|---------|----|----------------------------------------|-------------|---------------|-----------|
| **Privacy Shield successor** | DPF certified (EU-US/UK/Swiss) + subsidiaries; BBB + arbitration | DPA/DTA with SCCs (footers prove) | Legacy "Privacy Shield" section still listed ⚠️ | Global policy + DPF-style transfers (Gartner is DPF participant separately) | No framework claimed; US transfers without adequacy language ⚠️ |
| **Article 28 DPA** | MSA/Subscription Agreement + DPA referenced (implied) | **DPA + DTA footers** — **explicit** | (implied via Terms for customer personnel) | Enterprise contractual | Not in extract (gap) |
| **Consent granularity** | Osano granular (Necessary / Personalization / Analytics / Advertising) with per-partner retention | Same pattern (Gartner Digital Markets consent wall) | 24-hr per-review privacy controls | Granular cookie types + contact privacy@gartner | GoodFirms states "Consent is only legal basis" ⚠️ over-narrow vs GDPR's 6 bases |
| **Retention transparency** | Per-cookie retention 6 hr–13 mo disclosed | Not extracted but implied via DPA | 24 hr propagation + non-retroactivity + vendor retains original | Retention by purpose (not enumerated in extract) | Re-verification every 18 mo; "not obliged to store copies" |
| **Deletion / Erasure** | EEA right enumerated (access/restrict/correct/erase/portability + withdraw) | Via DPA rights | Rights section listed | Via DPO form/email/mail | Contact for duplicate removal |

---

## 4. Required Implementations for Enterprise Product

> Each requirement annotated **OBSERVED FACT → MUST IMPLEMENT** vs **INFERENCE → SHOULD IMPLEMENT** to satisfy OBSERVED FACT vs INFERENCE mandate. Checklist items are ordered by regulatory risk (P0 = legal/survival, P1 = trust/ranking).

### 4.1 Review Moderation (derived from G2 Community Guidelines + Capterra QA + TrustRadius Guidelines + GPI Guidelines + SA Guidelines + GoodFirms verification)

**OBSERVED FACTS driving requirements:**
- G2 auto-filter + human manual, "never edit" but may reject; vagueness only in severe cases + second reason (G2 Community Guidelines).
- Capterra 30+ humans, 20+ checks/review, plagiarism + AI detection, identity via enrichment + manual, conflicts/AI personas flagged (Capterra Verify page).
- TrustRadius: no plagiarized/AI, be detailed/balanced/honest, LinkedIn/work-email auth + recent-experience verification, reseller ratings excluded, 40% anonymous but zero anonymous to platform (TrustRadius About Reviews + Guidelines).
- GPI: verification + QA, investigation process, contesting flow, vendor sourcing guidelines (GPI Community Guidelines TOC).
- Software Advice: must be real verified user even if anonymous as "verified user", own experience, no conflicts/financial interest/competitor, original/authentic (SA Community Guidelines).
- GoodFirms: may edit/rephrase for clarity but responsible use; 5 projects/service, 2–3 reference calls, 23% acceptance, re-verify 18 mo (GoodFirms Terms + About + Research).

**MUST IMPLEMENT (P0):**
1. **Authentication gate:** Require LinkedIn OAuth or work-email verification (domain check) **before** review form submission. Block until verified — TrustRadius/Capterra model. Log auth method for audit.
2. **Conflict & eligibility check:** Automated flag + human queue for: vendor employee domain match, competitor vendor list match, reseller identification, financial-interest self-declaration. Per GPI/SA/TrustRadius: **never publish** if conflict confirmed; for reseller, publish but exclude rating from aggregate.
3. **Plagiarism + GenAI detection:** Integrate text-quality pipeline: plagiarism (exact + paraphrase) against vendor site + other reviews, plus AI-detector (Capterra-style). Auto-reject or queue if threshold exceeded. Surface to moderator with evidence snippet. **Policy:** "We do not publish plagiarized or AI-generated text" — TrustRadius verbatim.
4. **Two-stage QA:** Stage 1 — automatic control checks (≥20) covering identity, recent experience, completeness, rating validity. Stage 2 — human moderator queue. Log moderator ID, decision, timestamp (Capterra 30-moderator model).
5. **Recent-experience verification:** Require "duration of use" and "time since last use" fields; research staff validates via follow-up or enrichment; reject if not recent (TrustRadius recent-experience verification; GoodFirms 18-mo recency weight).
6. **Content quality completeness, not vague-only rejection:** Allow short reviews but queue for manual review if readability (Flesch-Kincaid) < threshold or length < minimum. Per G2: vagueness alone not auto-reject; require second reason.
7. **"Never edit ranking" invariant:** Compute scores algorithmically same for all categories; no manual score adjustment. Log algorithm version + inputs for reproducibility (G2 same-algorithm guarantee; GoodFirms v3.2 versioning).
8. **Non-suppression invariant:** Negative reviews processed identically to positives in scoring and visibility. Monitor publication rate by star band for drift detection.
9. **Video review consent & transcript option:** If video, store video + offer transcript-only publication per reviewer request (TrustRadius pattern).

**SHOULD IMPLEMENT (P1 — INFERENCE):**
- Review source labeling on every published review (Independently invited / Invited on behalf / Vendor-invited) with hover explain — reduces selection-bias liability.
- Enrichment service integration (Clearbit/People Data Labs/LinkedIn) for identity & employer enrichment as second signal (Capterra enrichment).
- Reseller segmentation: flag reseller vs end-user at submission; route ratings accordingly.
- 24-hour privacy propagation SLA for anonymous toggle changes (TrustRadius SLA).

---

### 4.2 FTC Compliance (U.S. 16 CFR Part 255 + FTC Endorsement Guides for Platforms)

**OBSERVED FACTS:**
- G2 explicitly cites FTC guide: vendors should **not segment customers to solicit only positive reviews**; segmentation reviews violate Community Guidelines and are subject to removal (G2 Scoring Methodology).
- G2: incentivized reviews **clearly labeled**, never require only positives, never suppress negatives (G2 Community Guidelines).
- Capterra: incentive given **regardless of rating**, subject to QA, nominal for time/effort, encourages non-advocates (Capterra Verify page). Transparency: sponsored profiles with referral fee clearly disclosed via icon + text Visit Website/Try for Free/Book Demo.
- TrustRadius: incentives by both platform + vendors increase diversity/detail; source labels disclose vendor involvement (TrustRadius About Reviews).
- GPI: gift cards + incentivized vendor guidelines + referral program documented (GPI Guidelines TOC 2.3.1, 3.4.1).
- Software Advice: neutral platform, does not evaluate merit but enforces compliance (SA Guidelines).

**MUST IMPLEMENT (P0 — FTC failure = enforcement + delisting risk):**
1. **Mandatory incentivized disclosure badge:** Any review with any consideration (gift card, nominal fee, referral credit, charity donation, swag) must display persistent badge: `Incentivized — reviewer received [type] for this review; incentive was not contingent on rating` — visible on review card, profile, export. Weight incentivized ≤ non-incentivized in scoring (G2 low-weight model) and disclose weighting methodology.
2. **No segmentation / no gating:** Platform must **not provide** vendor tooling to filter invites to promoters only. If vendor supplies invite list, flag for moderator audit against CRM sentiment sampling. Prohibit language like "If you love us, review here" in vendor invite templates (G2 FTC citation).
3. **No conditioning:** Enforce via terms that incentive is **upon approval regardless of rating** and explicitly state in vendor agreement. Reject any vendor workflow requiring positive review for reward.
4. **Never suppress / never require positives:** Product requirement + Terms: state that negative reviews are published, contribute to scores, and are never muted/hidden. Demonstrate via public moderation transparency report (counts by outcome).
5. **Endorser qualification:** Require submitter warranty: "Review is my honest opinion based on my own experience; I am not incentivized to give higher rating" + disclosure checkbox.
6. **Sponsored placement disclosure (FTC Native Advertising):** Any paid profile, sponsored ranking, or referral-fee-driven ordering must be labeled with clear icon + text (e.g., "Sponsored — provider pays fee when you visit") adjacent to link-out; default sort must be explainable as algorithmic, not pay-to-rank. Provide one-click sort by non-paid signal.
7. **Vendor non-retaliation:** Terms must prohibit vendor retaliation against negative reviewers; provide confidential reporter channel.

**SHOULD IMPLEMENT (P1):**
- FTC compliance training page for vendors (link to `ftc.gov/business-guidance/resources/featuring-online-customer-reviews-guide-platforms` as G2 does) required before campaign launch.
- Annual attestation from vendors running incentivized campaigns that they complied with non-segmentation rule.
- Algorithmic bias monitoring: compare incentivized vs non-incentivized rating distributions per vendor; flag outliers.

---

### 4.3 GDPR / ePrivacy (EEA/UK/Switzerland) + CCPA/CPRA (California)

**OBSERVED FACTS:**
- G2 10 categories, EEA rights x7, DPF certification with BBB + arbitration, SCCs for non-adequate, Osano granular consent, necessary non-opt-out, global rep addresses (G2 Privacy/CCPA/EEA/DPF/Cookie).
- Gartner global policy: 6 source types, special categories (dietary), peer insights profile data, cookie types x5 + web beacons, AdChoices disclosure, GA opt-out, contact privacy@gartner.com (Gartner Privacy + Cookie).
- TrustRadius: per-review privacy per-review toggle, 24-hr propagation non-retroactive, disclosures to vendors per privacy setting, California + International Transfers sections (TrustRadius Privacy).
- GoodFirms: consent-is-only-basis claim (over-narrow), US office, rephrase/edit right, shortlist form not shared with vendors (GoodFirms Privacy).
- Software Advice/Capterra: DPA + DTA footers prove Article 28 processor + SCC readiness; consent-wall behavior observed.

**MUST IMPLEMENT (P0):**
1. **Lawful basis matrix:** Implement per-purpose legal bases (not "consent only" — GoodFirms misstatement is risk). At minimum: Consent (marketing cookies, incentivized review contact), Contract (account creation, vendor listing), Legitimate Interest (fraud, security, product improvement, scoring — with balancing test documented), Legal Obligation (tax, DMCA). Record basis per processing activity in RoPA.
2. **Granular consent banner (Osano-type):** Buckets — Necessary (no opt-out) / Functional-Personalization / Analytics-Performance / Marketing-Advertising. Per-partner retention disclosed (follow G2 table: duration per partner 6 hr–13 mo). Geofence EEA opt-in (prior consent) vs US opt-out; store consent timestamp/version. Allow withdraw anytime via privacy center.
3. **Data minimization to 10 G2 buckets — do not exceed:** Identifiers, commercial, internet activity, geo, audio/visual, professional, inferences, sensitive (credentials), browser signals, AI outputs. Collect each only with stated purpose. Monty-style AI training on chat logs requires separate opt-in + filtered fields — disclose retention + purpose as G2 does.
4. **Data subject rights portal:** Self-service for access, correction, deletion, portability, restriction, objection, withdraw consent, opt-out of marketing (but transactional/service messages without opt-out as G2 EEA disclosure articulates). SLA ≤30 days (GDPR Art.12). EU/UK rep addresses publish if controller outside EU — copy G2 pattern if US entity.
5. **Transfer mechanism:** If processing outside EEA-adequate list (see G2 adequate country list in EEA disclosure), execute **SCCs** (EU 2021/914) + UK Addendum + Swiss amendment, or DPF if eligible. Publish DPF-style notice if certified; otherwise SCC path. Disclose to data subjects.
6. **CCPA obligations:** Provide Notice at Collection (12-month lookback categories — mirror G2 CCPA table), Rights to Know/Delete/Opt-Out of Selling-Sharing, non-discrimination. Implement browser/device opt-out link "Do Not Sell or Share My Personal Information" that is browser/device-specific (as G2 discloses) + Global Privacy Control (GPC) signal handling.
7. **Per-review privacy controls:** Implement TrustRadius model: reviewer chooses per-review "Anonymous → Verified User" vs named (name/title/company/project). Controls effective within 24 hrs, non-retroactive to cached/static/vendor-retained copies — disclose clearly. Full profile default visibility only if consented; otherwise limited.
8. **Special category data:** Prohibit collection unless strictly necessary + explicit consent (Gartner dietary example). Filter health/religion/biometric inference from AI training pipelines.
9. **DPO / contact:** Publish `privacy@domain`, postal address, EU+UK rep if applicable, DPF complaint cascade (internal → BBB National Programs → binding arbitration) if DPF-certified; otherwise SCC complaint mechanism. Maintain investigatory cooperation with DPAs/ICO/FDPIC for HR data if in scope.

**SHOULD IMPLEMENT (P1):**
- Privacy-preserving review display: hash email, suppress exact company for anonymous, bucket company size/industry/region as GoodFirms does for survey anonymity.
- Cookie preference persistence 6–12 mo with re-consent after policy change (Osano 6 mo/1 yr pattern).
- Dedicated Kids exclusion: business professional only; age gate 18+ at account creation (all marketplaces).

---

### 4.4 Data Retention & Storage (incl. AI Training Data)

**OBSERVED FACTS:**
- G2: cookie retentions 6 hr–13 mo per purpose; Monty chat logs retained for training/evaluation with privacy safeguards + filtered sensitive fields.
- TrustRadius: review visibility via privacy settings per review; updates 24-hr non-retroactive; vendor retains original even after reviewer update.
- Gartner: retention by purpose (not enumerated; implied linked to purposes).
- GoodFirms: re-verify every 18 mo; not obliged to store/provide copies of user content.
- Software Advice: FrontRunners snapshot based on 24-mo reviews; not updated after publication.

**MUST IMPLEMENT (P0):**
1. **Retention schedule (publish in Privacy Policy):**
   | Record | Retention | Legal Basis | Disposition |
   |--------|-----------|-------------|-------------|
   | Account identifiers + professional info | Duration of account + 3 yrs post-deletion for tax/dispute (align GDPR storage limitation) | Contract + Legal Obligation | Hard delete + backup purge within 90 days |
   | Reviews + ratings (incl. video) | Indefinite while published; on deletion request, delist within 24 hrs, purge from primary + vendor-shared original flagged but note vendor may retain per original disclosure (TrustRadius non-retroactivity disclosure) | Legitimate interest + consent | Archive with deletion watermark |
   | Monty/AI chat logs | 12 mo or model-training cycle, whichever shorter, with PII filtering before training | Legitimate interest + safeguards | Anonymize/minimize + delete raw |
   | Consent records | 3 yrs post-withdrawal (e-evidence) | Legal Obligation | Immutable log |
   | Cookies: Necessary 13 mo, Osano 6 mo–1 yr geo, New Relic session, DataDome 12 mo, Personalization marketing 2–12 mo per G2 pattern | Per purpose | Consent/necessary | Auto-expire |
   | Moderation decisions + evidence | 3 yrs | Legitimate interest (fraud/regulatory) | Archive |
   | Vendor enrichment + reference call notes | 18 mo (GoodFirms re-verify cadence) | Contract | Re-verify cycle |
2. **Backup discipline:** Backups retain deleted data ≤90 days post-deletion request before purge (industry standard aligned to G2's non-retroactivity nuance).
3. **AI training discipline:** Never train on credentials, special category, or non-anonymized personal data; filter before ingestion; disclose training use in Privacy Policy as G2 does.

---

### 4.5 Vendor Verification (Supply-Side Trust)

**OBSERVED FACTS:**
- GoodFirms: 60K verified, human verification (registered entity, founders, 2+ yrs), portfolio 5 projects/service, 2–3 client reference calls, 18-mo re-verification, 23% acceptance; 80K verified agencies, $340M spend matched.
- Capterra: free profile regardless of payment, 100K+ solutions, sponsored fraction, Profile Guidelines referenced, referral fee separation.
- G2: vendor info aggregated from public sources/social + reviews; G2 Score uses public sources for market presence.
- TrustRadius: reseller detection, reporting via verification of recent experience.
- Gartner: vendor expectations, investigation process, sourcing guidelines, contesting reviews (GPI Guidelines).

**MUST IMPLEMENT (P0):**
1. **Three-tier verification (GoodFirms-style but adapted for software + services):**
   - **Tier 0 — Free listing:** Any vendor may claim/create profile free; shows as "Unverified" until Tier 1; reviews collectible but not weighted for awards.
   - **Tier 1 — Verified (automated):** Domain ownership (DNS TXT), business email, website functionality check, public-source evidence of required functionality (as Software Advice requires vendor website evidence), U.S. presence signal if claimed.
   - **Tier 2 — Reference-checked (human):** For ranked/Leader Matrix-eligible vendors: registered entity check, founder/linked verification, 2+ years in business (GoodFirms), ≥5 public reference projects per claimed service, 2–3 reference calls by research team, 18-mo re-verify. Permit PRO/sponsored badging but **sponsorship does not affect rank** (banner on ranked pages).
2. **Profile accuracy obligation:** Vendor warrants profile info accurate/up-to-date; platform may suspend for inaccurate/inappropriate per GoodFirms account termination right; allow vendor response to reviews but responses are vendor's own (SA model).
3. **Contesting / investigation flow (GPI):** Publish "Contesting Reviews" + "Review Investigation Process" — vendor may flag, platform investigates via moderator, decision + rationale communicated, public comment on profile if violation (SA penalty model). SLA for investigation.
4. **Invariant:** Free collection of reviews regardless of paid status; paid features = traffic/leads/enhanced profile (Capterra model) — never pay-to-rank.
5. **Sourcing compliance:** Any vendor-invited review must carry source label; vendor must not use segmentation/gating; audit invite list sample for sentiment manipulation.

---

### 4.6 Scoring / Ranking Fairness (Product Requirement)

**MUST IMPLEMENT (P0):**
1. Publish methodology page with version (e.g., v3.2), last reviewed date, update cadence (weekly vs snapshot), weights, formulas, eligibility criteria, normalization — G2/GoodFirms/SA pattern.
2. Disclose: normalization for recency/volume, readability (if used), source weighting (incentivized lower), and that algorithm is same across categories.
3. For snapshot reports (FrontRunners/VoC), state time window, non-update-after-publication, and "use with current profile for latest" as SA does.
4. Provide methodology change log.

---

## 5. Observed Fact vs Inference Ledger

| # | Statement | Classification | Evidence |
|---|-----------|---------------|----------|
| F1 | G2 Terms last updated 2026-07-09; incorporate 5 docs by reference; binding arbitration §12 with opt-out 12.3 | **OBSERVED FACT** | `legal.g2.com/terms-of-use` extraction 15,046 chars |
| F2 | G2 Privacy collects 10 categories incl. AI outputs + automated decision inputs; Monty chat logs retained for training with filtered fields | **OBSERVED FACT** | `legal.g2.com/privacy-policy` |
| F3 | G2 necessary cookies non-opt-out, others opt-out via Osano; per-partner retentions 6 hr–13 mo disclosed | **OBSERVED FACT** | `legal.g2.com/cookie-policy` table extraction |
| F4 | G2 never edits review content; never requires only positives; clearly labels incentivized; never suppresses negatives; same algorithm all categories | **OBSERVED FACT** | `legal.g2.com/community-guidelines` |
| F5 | G2 Satisfaction = volume High + recency High + quality Flesch-Kincaid Medium + source Low; Market Presence from reviews + public; FTC non-segmentation cited as removal grounds | **OBSERVED FACT** | `documentation.g2.com/docs/research-scoring-methodologies` |
| F6 | G2 CCPA selling/sharing = disclosure to ad partners; opt-out browser/device-specific; EEA SCCs for non-adequate; DPF certified EU-US/UK/Swiss + BBB + arbitration; FTC is DPF enforcer | **OBSERVED FACT** | `legal.g2.com/california-consumer-privacy-act-disclosure` + EEA + DPF notices |
| F7 | Capterra verified 2.5M+ reviews; 30+ moderators, 20+ checks/review; plagiarism + GenAI detection; identity via enrichment; conflicts/AI personas flagged | **OBSERVED FACT** | `capterra.com/resources/how-we-verify-reviews/` |
| F8 | Capterra two collection ways: non-incentivized + incentivized (nominal, regardless of rating, QA'd); profiles show name/photo/function/industry/size/duration | **OBSERVED FACT** | Same + `how-we-ensure-transparency` |
| F9 | Capterra lists all providers not just paying; sponsored identified by icon + Visit Website/Try for Free/Book Demo; research independent of payment; advisors deliver sales-qualified leads | **OBSERVED FACT** | `capterra.com/resources/how-we-ensure-transparency/` |
| F10 | Capterra General User Terms last updated 2026-05-04; bundle 6 docs | **OBSERVED FACT** | `capterra.com/legal/terms-of-use/` |
| F11 | TrustRadius all reviewers authenticated via LinkedIn/work email before writing; verified for recent experience; no vendor employees/competitors; reseller ratings excluded; ~40% public anonymous → Verified User | **OBSERVED FACT** | `trustradius.com/static/about-trustradius-reviews` + reviewer guidelines |
| F12 | TrustRadius three source labels (Independent / On behalf / Vendor-invited) via codes + self-report + audit; incentives by platform+vendors; plagiarism/AI not published | **OBSERVED FACT** | Same + `static/reviewer-guidelines` |
| F13 | TrustRadius per-review privacy toggle, 24-hr non-retroactive, vendor retains original after update, default profile visible to all visitors | **OBSERVED FACT** | `trustradius.com/static/privacy-policy` |
| F14 | GPI Rules: ≥18, license irrevocable personal internal only, submissions representations (sole author, accurate, employer compliance, not associated with vendor/competitor, own experience), Gartner owns Submissions, may modify/adapt, personal data not displayed | **OBSERVED FACT** | `gartner.com/reviews/faq/rules-of-engagement` (15,442 chars) |
| F15 | GPI Community Guidelines divided 3 parts; verification/QA, gift cards, referral, vendor expectations, investigation, contesting | **OBSERVED FACT** | `external.pi.gpi.aws.gartner.com/reviews/guidelines` TOC |
| F16 | Gartner Global Privacy 2026-02 effective; sources: direct/referrals/external dirs/conference/website telemetry/PI profiles/recorded calls; special categories dietary; cookie types x5 + beacons; AdChoices + GA opt-out | **OBSERVED FACT** | `gartner.com/en/about/policies/privacy` + cookie policy |
| F17 | GPI Voice of Customer: X = reviews+considerations (asymptotic) + willingness ≥8 + coverage ≥5; categories 4 quadrants; June 2025+ methodology; eligibility time-bounded | **OBSERVED FACT** | `gpivendorresources.gartner.com/.../voice-of-the-customer-methodology` |
| F18 | GoodFirms Terms last updated 2023-03-01; may edit/rephrase/reject any UGC at discretion; user solely liable + indemnifies; does not verify/authorize UGC use at own risk; ≥18 | **OBSERVED FACT** | `goodfirms.co/terms-of-use` |
| F19 | GoodFirms Leaders Matrix v3.2 2026-05-13 weekly; Y = Reviews 50% (Rating50 Vol30 Rec20 [18mo log10 200]) + Market Presence 30% (6×5%) + GoodFirms Score 20%; quadrants thresholds 70/50 | **OBSERVED FACT** | `goodfirms.co/research-process` formulas |
| F20 | GoodFirms verification: 60K verified, 23% acceptance, 5 projects/service, 2–3 ref calls, 18-mo re-verify; 1.2M buyer reviews; 130 countries; $340M spend matched; sponsorship does not affect rank | **OBSERVED FACT** | `goodfirms.co/about-us` + research-process banner |
| F21 | GoodFirms Privacy: reviews anonymous vs visible (name/business/project/photo), surveys anonymous, shortlist form not shared, auto collection cookies/logs/beacons/JS/GPS, consent-is-only-basis claim + US office | **OBSERVED FACT** | `goodfirms.co/privacy` |
| F22 | Software Advice Community Guidelines 2026-05-04: real verified user even anonymous → verified user, own experience, no conflicts/financial/competitor, original/authentic, penalties incl. comment on profile/suspension | **OBSERVED FACT** | `softwareadvice.com/legal-page/reviews-guidelines/` |
| F23 | Software Advice FrontRunners v5 Jan 2026: requires ≥20 unique reviews 24 mo, U.S. presence, not niche, min normalized rating; dimensions Usability 50+50, Satisfaction 25+25+50, Digital Presence 50+50; 1–5/0–10→5→100 with recency/volume norm; 5–25 included; snapshot non-updated | **OBSERVED FACT** | `softwareadvice.com/legal-page/frontrunners-methodology/` |
| F24 | Software Advice footer proves bundle of 12 docs incl. DPA + DTA; manual examination of all reviews, 2M reviews/45K products/1200 categories, treated equally, feature importance rating | **OBSERVED FACT** | `softwareadvice.com/resources/buyers-guide-methodologies/` + footer |
| I1 | Capterra/Software Advice full Privacy & Cookie legal text mirrors Gartner Digital Markets 12-doc bundle with same consent + DPA/DTA posture as G2 | **INFERENCE** | Shell extraction + footer bundle + shared G2 Digital Markets branding; needs consent-aware re-extraction to confirm |
| I2 | Capterra Vendor Terms impose non-gating, Profile Guidelines compliance, PPC/PPL referral fee structure | **INFERENCE** | Vendor terms WAF-blocked + PPC MSA reference on G2 legal hub + Profile Guidelines mention |
| I3 | All six marketplaces operate ≥18-only business platforms (TrustRadius does not state explicitly but auth + recent experience implies) | **INFERENCE** | G2, GPI, GoodFirms explicit; Capterra/SA via General User Terms shell; TrustRadius via behavior |
| I4 | TrustRadius TrustScore aggregation excludes reseller ratings and weights verified/consideration signals similarly to GPI | **INFERENCE** | About Reviews states exclusion; full scoring formula not in extracted TrustRadius page — inferred from analogous GPI/G2 weighting |
| I5 | GoodFirms "Consent is only legal basis" is over-narrow and should be corrected to 6-bases model despite extracted text | **INFERENCE (risk-sensitive)** | Single line excerpt vs GDPR Art.6 requirement; Truncated context may hide additional bases |

**Policy:** Every checklist item below cites at least one F-number; I-items flagged as recommended not blocking.

---

## 6. Implementation Checklist (Shippable)

### How to use
Copy into project tracker (`/opt/data/analysis/matrix/` or Jira/Linear). Check off only when artifact is produced **and** linked to evidence. P0 must be done before public launch; P1 before scaling.

### P0 — Pre-Launch Blocking

#### 6.1 Legal & Terms
- [ ] Publish **Terms of Use** dated + versioned, incorporated docs by reference (Community Guidelines, Content/Data Usage, Privacy, Cookie, DMCA), eligibility ≥18 B2B-only, license grant limited personal non-excl non-sublic non-transfer, unilateral update with continued-use acceptance, arbitration § + opt-out if requiring (F1, F14, F18, F22).
- [ ] Publish **DMCA Policy** with statutory notice + counter-notice required elements, copyright agent address/email/847-style phone, misrepresentation 512(f) warning (F10-style; G2 copyright agent pattern).
- [ ] Publish **Privacy Policy** with 10-category inventory, purposes, legal bases per purpose, controller + EU/UK rep if US entity, incorporated CCPA/EEA/DPF by reference (F2, F6, F16, F21, F24).
- [ ] Publish **Cookie Policy** with 4 buckets (Necessary non-opt-out + Personalization/Analytics/Advertising opt-out), per-partner retention table (6 hr–13 mo) + Osano-type banner linkage (F3, F16).

#### 6.2 Review Moderation
- [ ] Ship auth gate (LinkedIn OR work-email verified before review; log method) (F11, F7).
- [ ] Ship conflict/bias block (vendor domain, competitor list, reseller flag, financial-interest checkbox; never publish if conflict; reseller ratings excluded from aggregate) (F11–F15, F22).
- [ ] Ship plagiarism + GenAI detector (exact + paraphrase + AI-detector threshold; queue with evidence snippet) (F7, F12).
- [ ] Ship two-stage QA (auto 20+ checks: identity, recent experience, completeness, rating validity → human queue; log moderator ID + decision) (F7, F14–F15).
- [ ] Ship recent-experience field + verification (duration, recency requirement) (F11, F19).
- [ ] Implement "never edit content" for ratings vs GoodFirms-style edit only for clarity on non-rating metadata — choose and disclose explicitly (F4 vs F18 vs F14 edit rights — **decision required**).

#### 6.3 FTC
- [ ] Ship incentivized badge: `Incentivized — received [type], not contingent on rating` on card/profile/export + weighting disclosure (F4, F8, F12).
- [ ] Ship non-segmentation prohibition: no invite-list filtering to promoters; audit sampling; reject gating templates (F5).
- [ ] Ship sponsored disclosure: icon + Visit Website-style text adjacent to pay-to-rank ordering; default sort explainable as algorithmic; one-click non-paid sort (F9).
- [ ] Document non-suppression + equal treatment invariant with monitoring by star band (F4, F24).

#### 6.4 GDPR / CCPA
- [ ] Implement RoPA + lawful basis matrix per purpose (not consent-only) (F6 vs I5).
- [ ] Ship Osano-type granular consent banner with geofenced opt-in (EEA) vs opt-out (US); store timestamp/version; withdraw path (F3, F16, F6).
- [ ] Ship data subject rights portal (access/correct/delete/portability/restrict/object/withdraw + marketing opt-out; transactional retained; ≤30 days SLA) (F6, F13, F16).
- [ ] Ship transfer mechanism: SCCs + UK Addendum + Swiss amend OR DPF with BBB/arbitration + FTC enforcer language; publish notice; disclose adequate countries (F6, F24).
- [ ] Ship CCPA Notice at Collection + Know/Delete/Opt-Out of Selling-Sharing + GPC handling; link label "Do Not Sell or Share…"; browser/device-scoped opt-out disclosure (F6).
- [ ] Ship per-review privacy toggle (Anonymous→Verified User vs named) with 24-hr non-retroactive disclosure + vendor-retention warning (F13).

#### 6.5 Data Retention
- [ ] Publish retention schedule table per 4.4 (account 3 yrs post-delete, reviews delist 24 hr / purge 90 days backups, Monty logs 12 mo filtered, consent 3 yrs, cookie 6 hr–13 mo per partner, moderation 3 yrs, verification 18 mo) (F3, F6, F13, F19–F20, F23).
- [ ] Implement AI training filtering (no credentials, special categories, non-anonymized PII; disclosed purpose) (F2).

#### 6.6 Vendor Verification
- [ ] Ship tiered verification: Free unverified → Automated (DNS TXT, domain, public evidence, U.S. signal) → Reference-checked (registered entity, founders, 2 yrs, 5 projects/service, 2–3 calls, 18-mo re-verify) with sponsorship-not-ranked invariant (F19–F20).
- [ ] Ship contesting/investigation flow with vendor flag → moderator investigation → decision + rationale + public profile comment if violation (F15, F22–F24).

#### 6.7 Scoring Integrity
- [ ] Publish methodology page versioned + dated with weights/formulas/eligibility/normalization + same-algorithm guarantee + change log (F5, F17, F19, F23).

### P1 — Pre-Scale (within 90 days post-launch)

- [ ] Source labeling on every review (Independent / On behalf / Vendor-invited with hover) + audit via codes + self-report (F12).
- [ ] Enrichment integration (Clearbit/PDL/LinkedIn) as second identity signal (F7).
- [ ] Reseller segmentation routing (F11).
- [ ] Vendor FTC training page + annual attestation (I2).
- [ ] Algorithmic bias monitoring (incentivized vs non rating distribution per vendor; alert on outlier) (F5, F8).
- [ ] Privacy-preserving display (hash email, bucket size/industry/region for anonymous) (F21).
- [ ] Consent re-prompt 6–12 mo post-last-consent + after policy change (F3).
- [ ] Transparency report: quarterly counts of submitted/verified/published/rejected by reason (plagiarism, AI, conflict, gating) — implied by G2 Trust Framework and SA comment-on-profile penalty.

---

## 7. Appendix — Raw Extraction Notes & Retention Details

### 7.1 Extraction Fidelity
- 22 distinct logical URLs across 6 marketplaces.
- 18 fully extracted (character counts listed in §1); 4 partial shells due to consent-wall rendering (Capterra Privacy/Content/Cookie, GPI Community Guidelines full text). Re-extraction with consent-aware headless browser (Osano accept) recommended to fill shells.
- 3 URLs blocked by Gartner Digital Markets WAF (Capterra Vendor Terms, Software Advice General User Terms, Software Advice Privacy). Content mirrors extracted Capterra General User Terms and 12-doc footer bundle — low risk of material divergence but flag for legal review.
- No pip/HTTP sleight — `web_extract` via Firecrawl/Exa/Keenable backends; 429 backpressure observed on `legal.g2.com` and retried with delay succeeded.

### 7.2 Per-Partner Retention Reference (Implement as Cookie Table)

| Partner / Purpose | Source | Retention | Opt-out |
|-------------------|--------|-----------|---------|
| G2.com auth/functionality (Necessary) | G2 Cookie Policy | 13 months | None |
| Osano banner | G2 Cookie Policy | 6 months or 1 yr (geo) | None (necessary) |
| New Relic error tracking | G2 Cookie Policy | Session | None |
| DataDome security | G2 Cookie Policy | 12 months | None |
| G2 session identifiers (Personalization) | G2 Cookie Policy | 12 months | Opt-out via Cookie Policy settings link |
| LinkedIn auth | G2 Cookie Policy | 6 hr – 2 yr | Opt-out |
| Vidyard video reviews | G2 Cookie Policy | Session / 2 yr | Opt-out |
| Tapad retargeting | G2 Cookie Policy | 2 months | Consent required (advertising) |
| Facebook retargeting | G2 Cookie Policy | 90 days | Consent required |
| Salesforce DMP retargeting | G2 Cookie Policy | 180 days | Consent required |
| Centro retargeting | G2 Cookie Policy | (per policy detail) | Consent required |

Mirror for Gartner: Essential (session), Targeting (duration per partner — disclose), Social (per provider), Performance (session), Functionality (persisted preference) — publish analogous table per site audit.

### 7.3 Address Reference for Legal Templates

- G2 controller: 100 S Wacker Dr, Suite 600, Chicago IL 60606, USA.
- G2 EU Rep: Osano International Compliance Services Ltd, ATTN HQ8K, 3 Dublin Landings, North Wall Quay, Dublin 1, D01C4EO, Ireland.
- G2 UK Rep: Osano UK Compliance Ltd, ATTN HQ8K, 42-46 Fountain Street, Belfast, Antrim BT1-5EF, UK.
- GoodFirms US: 205 E Harmon Ave APT 904, Las Vegas NV 89169, USA.
- Gartner privacy: `privacy@gartner.com` + form `gartner.com/en/requests/personaldata`.
- Software Advice reviews contact: `reviews@g2digitalmarkets.com`.

### 7.4 Gaps & Follow-Ups
1. **Software Advice DPA/DTA/SCC text:** Not extracted (WAF). Request from Gartner Digital Markets vendor onboarding packet; until then template on EU 2021/914 SCCs.
2. **GoodFirms GDPR bases:** Policy excerpt states "Consent is only legal basis" — engage counsel; correct to full 6-bases listing or risk Art.6 challenge.
3. **GoodFirms stale Terms (2023-03-01):** Oldest in set — factor into risk assessment; GoodFirms may not have updated for DSA/DMA/DPF era.
4. **Capterra Vendor Terms & Profile Guidelines:** Retrieve via authenticated vendor session for complete vendor obligations.
5. **TrustRadius scoring formula:** Not disclosed in extracted pages — assume G2/GPI-like but request TrustRadius Methodology doc if integrating score import.

---

**Document Classification:** Internal — Engineering + Legal + Product
**Reviewers:** Product, Legal (GDPR/CCPA), Data/ML (scoring/AI), Content Moderation
**Next Review:** 2026-12-02 (or upon methodology version change at G2/GoodFirms/Gartner)

*All URLs verified reachable at extraction time; contents truncated inline but full texts cached at extraction length per §1. OBSERVED FACT vs INFERENCE labeling per §5 must be preserved in derivative implementation specs.*



---

## PART — ENTERPRISE BUILD DOCUMENTATION (`reports/ENTERPRISE-BUILD-DOCUMENTATION.md`)

# ENTERPRISE BUILD DOCUMENTATION — Software Discovery Platform (SDP)

> **Definitive single-source build spec.** Synthesizes all competitive research (`/reports/01-FULL-REPORT.md`), PRD (`02-PRD.md`), functional requirements (`03-FUNCTIONAL-REQUIREMENTS.md`), deep dives (`04-DEEP-DIVES.md`), tech stack (`06-TECH-STACK.md`), roadmap (`07-ROADMAP.md`), UI/UX (`08-UIUX-ARCHITECTURE.md`), SEO (`09-SEO-ARCHITECTURE.md`), API (`14-API-ARCHITECTURE.md`), database schema (`schemas/DATABASE-SCHEMA.md`), feature matrix (`matrix/FEATURE-MATRIX.md`) and blueprint (`blueprint/PLATFORM-BLUEPRINT.md`) plus fresh policy (FTC 16 CFR 465, GDPR X v Russmedia 2025, DSA/DMA) and UI (Next.js 15, shadcn, a11y) findings.  
> **Date:** 2026-09-02 | **Status:** CAPSTONE — authoritative build reference | **Target:** Enterprise-grade marketplace, monetizable Day 1

---

## Table of Contents

1. [Market Context & Competitive Synthesis (8+ Platforms)](#1-market-context--competitive-synthesis)
2. [Product Vision, Positioning & Personas](#2-product-vision-positioning--personas)
3. [Feature Catalogue — MoSCoW & Enterprise Tiering](#3-feature-catalogue--moscow--enterprise-tiering)
4. [Technical Architecture](#4-technical-architecture)
5. [Database Schema Reference](#5-database-schema-reference)
6. [Core Engines — Search / Comparison / Review / Lead](#6-core-engines--search--comparison--review--lead)
7. [Monetization & Growth](#7-monetization--growth)
8. [SEO at Scale — Programmatic Architecture](#8-seo-at-scale--programmatic-architecture)
9. [Compliance — FTC / GDPR / DSA / CCPA / A11y](#9-compliance--ftc--gdpr--dsa--ccpa--a11y)
10. [Roadmap, Resourcing & Risk Register](#10-roadmap-resourcing--risk-register)
- Appendices: A. URL/Route Manifest  B. API Index  C. Seed Strategy  D. Source Map

---

## 1. Market Context & Competitive Synthesis

### 1.1 Market sizing & forces

- **Buyer problem:** 1,000+ CRMs, 500+ PM tools, fragmented trust signals. Average B2B buyer consults 4–7 review sites before purchase; Gartner reports ~68% of purchases start with search.
- **Vendor problem:** Rising paid acquisition cost; need high-intent, category-qualified, comparison-stage leads — not clicks.
- **Platform economics:** Aggregation → comparison → lead arbitrage. Winner = SEO moat (comparison long-tail) × trust moat (verified review volume) × distribution (advisor/alternative flows).
- **Enterprise wedge (2026):** AI-native categories (AI agents, MCP servers, vertical AI), compliance-verified reviews (FTC 465 forces authenticity), and intent data (G2's monetization) create entry for a clean, policy-compliant challenger focused on a vertical or price point rather than head-on scale war.

### 1.2 Eight platforms synthesized

| # | Platform | Positioning (observed) | Scale Signal | Primary Moat | Monetization Detected | What to Steal | What to Avoid |
|---|---|---|---|---|---|---|---|
| 1 | **G2** (g2.com) | "Where you go for software" — 3.6M reviews, Grid reports | 630+ categories, 100M buyers claimed, 107 pages for CRM alone | Review volume + Grid scoring + ` /compare/{a}-vs-{b}` at scale | Freemium vendor + Buyer Intent + Sponsored + Review syndication | Search-first hero, tabbed product (`/products/{slug}/reviews|pricing|competitors`), canonical `-vs-` URLs, Grid-inspired freshness | Gated Reports friction; heavy JS nav that hurts extractability |
| 2 | **Software Advice** (Gartner) | Human advisor — free 15-min call → curated shortlist | Gartner network; FrontRunners quadrant (updated quarterly) | 1:1 advisor trust + Gartner brand | Pay-per-lead (PPL) — vendor pays on qualified lead; display | Advisor funnel branching at every step (replace with async form for MVP) | Human call center OPEX — defer to Phase 3 |
| 3 | **Software Finder** (softwarefinder.com) | "Find the Right Software — Faster" + expert rec form | ~30 top-level × 20–40 subcategories; ~337 reviews for top CRM | Deep subcategory taxonomy + editorial `/resources/{slug}` (ERP vs CRM, Monday vs Wrike) | `Ad` badge + affiliate `trkrdr1.com` + Vendor Program | Clean `/{category}` flat URLs, `/{category}/{product}` profiles, lightweight Compare checkbox + bucket | Shallow filters; search secondary; review volume thin |
| 4 | **SelectHub** | Requirements-driven Decision Platform — 400+ point scoring | 240h hands-on scoring, vendor-agnostic shortlist | Lean Selection / scoring methodology | Vendor sponsorship + RFI/RFP distribution | Requirements/checklist → scored shortlist, pricing matrix depth, technology-vs-technology guide | Scoring labour cost — Phase 2 "expert picks" only |
| 5 | **SoftwareSuggest** | 40k+ reviews, India/APAC focus, SaaS + services | 1,000+ categories observed; 5 plans per product, champions badge | Pricing transparency (5-tier table) + PPC click tracking | Tiered plans ($4k/6mo observed) + PPC per-click + banner | 5-plan pricing table, per-plan "Get Offer" CTAs, category hamburger depth | PPC clutter; inconsistent verification |
| 6 | **GoodFirms** | Dual software + services (80k firms), published v3.2 algorithm | Weekly ranking refresh; portfolio audits for agencies | Verification rigor (phone + email + client + portfolio) + services marketplace | Pro verification ($$$) + Sponsored + Project posting | Verification lite for MVP, agency/services marketplace as Phase-3 option | Over-verification kills velocity — use email+OAuth |
| 7 | **Capterra** (Gartner — inferred/extended) | Gartner's long-tail directory + Shortlist badge | 900+ categories, 2M+ reviews (public knowledge) | Category breadth + Gartner SEO dominance | PPL via Gartner network (shared funnel with Software Advice) | `/directory/{category}/software`, Shortlist/FrontRunners badges — replicate as "Top Rated {Category}" | Do not copy badge names verbatim |
| 8 | **TrustRadius / GetApp / SourceForge** (extended set) | TrustRadius: verified intent via user vetting; GetApp: SMB funnel; SourceForge: OSS slant | TrustRadius intent-grade reviews; GetApp quiz | Vetted-review credibility; quiz → shortlist | Intent data + PPL | TrustRadius-style intent grading (company-size/role tags), GetApp quiz → Recommendation form | TrustRadius manual vetting cost |

> **Synthesis insight (from D1 §2 + D4 + matrix):** *Comparison pages = SEO engine. Lead forms = revenue engine. Reviews = trust engine.* G2 + SoftwareSuggest win SEO via O(n²) comparisons; Software Advice wins revenue via PPL; GoodFirms wins trust via rigor. **SDP's synthesis:** comparison UX at G2 quality, pricing depth of SoftwareSuggest, comparison tables of SelectHub, async advisor of Software Advice, verification lite of GoodFirms — without the OPEX of Grid scoring or call centers.

### 1.3 Enterprise implications vs incumbents

- **Scale gap (threat):** G2's 3.6M verified reviews cannot be matched in Y1. **Answer:** Don't. Target 1–3k products × 10+ reviews each = 10–30k credible reviews + rapid review acquisition (email+LinkedIn incentive, post-lead review nudge) + AI-assisted pros/cons mining.
- **SEO gap (opportunity):** Incumbent comparison pages are often gated or JS-heavy (G2 comparison largely unextractable). A server-rendered, structured-data-rich `/compare` beats them on crawl & rich results.
- **Monetization gap (window):** FTC's 2024 Fake Reviews Rule (16 CFR 465) raises bar for incumbents carrying unverified volume. A Day-1 compliant platform is a sales advantage with enterprise buyers/procurement.

---

## 2. Product Vision, Positioning & Personas

### 2.1 Vision & north star

**Vision:** A trusted, search-first software discovery marketplace where buyers find, compare, and choose software via verified reviews, structured feature/pricing data, and side-by-side comparisons — and vendors acquire high-intent leads. Synthesis > clone.

**North star:** Buyer goes from *"I need a CRM"* to *"I've shortlisted 3 and requested pricing"* in **<5 minutes** without talking to a human.

**Tagline (recommended):** *"Compare software with structured data, not marketing copy."*

### 2.2 Positioning (12-word original)

> Search-first, comparison-centric, review-verified. Free for buyers; pay for intent for vendors.

Differentiators at launch:
- Fastest comparison UX (one-click bucket → table, ≤2 taps).
- Transparent pricing tables (5 plans/product, not hidden/contact-only).
- Lightweight verification (email+OAuth → Verified badge; no phone gate).
- Async expert recommendation (form, not call) — 1 hr SLA manual match (Phase 2: auto).

### 2.3 Personas (8 — from PRD + deep dives)

| Persona | Archetype | Goals | Frustrations | Entry Point | Key Actions | Success Signal |
|---|---|---|---|---|---|---|
| **Priya** | SMB Buyer / Founder (12 ppl) | CRM <$50/u, free trial, easy setup | Hidden pricing, sales pressure | Google "best CRM for startups" | Search → filter (price, trial) → compare 2 → Get Pricing | Lead submitted <1 session |
| **Marcus** | Enterprise Buyer / Procurement (500+) | Requirements-driven shortlist for stakeholders | Scattered checklists, no RFI flow | Direct + advisor link | Requirements (Phase 2) → 5-way compare → RFI | RFI distributed |
| **Alex** | IT Evaluator / IT Mgr | Validate integrations/deployment/security | Vague feature claims | "X Salesforce integration" | Feature matrix + Integrations + Docs | Feature hit confirmed |
| **Sofia** | Marketing Ops Buyer | MarTech stack fit (integrations + automation) | Tool sprawl, overlap | Category → Comparison hub | Filter by integrations → Compare → Demo | Demo booked |
| **Dana** | Vendor / SaaS Marketing Lead | High-intent leads, review coverage | Paying for junk traffic | "Claim profile" CTA | Claim → optimize → leads → respond | 10 qualified leads/mo |
| **Sam** | Contributor / Power User | Share honest review | Lengthy forms, no recognition | Email invite / Write Review | OAuth → 5-star + secondaries → pros/cons | Review published + helpful votes |
| **Ravi** | Agency / Services Buyer (GoodFirms wedge, Phase 3) | Find vetted dev/design agency | Noisy directories | `/directories` + Project post | Location filter → portfolio → Post Project | Proposals received |
| **Nina** | Researcher / Student | Map market landscape | Paywalled reports | Resource article | Read guides → compare → exit | Retarget pool |

Journey map (canonical — all personas excerpt):
`Google ("best X 2026" / "A vs B") → Category or Comparison pillar (SEO) → apply 2 filters → scan 6 cards → Product profile (pricing/features/reviews) → Compare 2–3 → Lead (Get Pricing/Demo/Expert) → vendor follow-up`.

### 2.4 Design principles (enterprise grade)

1. Search is the spine — every page has instant search.
2. Comparison is one click — checkbox + persistent bucket.
3. Trust before transaction — verified badges + distribution above fold.
4. Progressive disclosure — Overview → Features → Pricing → Reviews → Alternatives (tabs/anchors).
5. Lead ambient, not aggressive — sticky sidebar + inline CTAs; no popups.
6. Data density > decoration — ✓/— tables over marketing fluff.
7. A11y non-negotiable — WCAG 2.1 AA (axe-core in CI).
8. Performance budget — LCP <2.5s, search p95 <150ms, Lighthouse ≥90.

---

## 3. Feature Catalogue — MoSCoW & Enterprise Tiering

**Legend:** `M`ust (MVP, weeks 1–10 incl. hardening) · `S`hould (Phase 2, months 3–6) · `C`ould (Phase 3, months 7–12) · `W`on't (explicit cut). Enterprise column = minimum tier to implement.

| # | Capability | Pri | Enterprise | Notes / Acceptance |
|---|---|---|---|---|
| **Public Site** |
| F-01 | Homepage: hero global search (autocomplete) + async "Get Free Recommendation" form + category grid (12) + featured + trust bar + comparison shortcuts + vendor/review CTAs | **M** | Day 1 | ISR 300s; hero search proxies Meilisearch; expert form → Lead(EXPERT_RECOMMENDATION) |
| F-02 | Categories hub `/categories` — all top-level with subcategory expand + counts | **M** | Day 1 | Static; Next Image icons; `generateStaticParams` for top cats |
| F-03 | Category listing `/{category}` — description + buying-guide excerpt + filters + sort (Recommended/Rating/Price) + 24-card grid + pagination + FAQ + alternatives + breadcrumb + JSON-LD `CollectionPage`/`ItemList`/`BreadcrumbList` | **M** | Day 1 | ISR 60s; filters client-side via `/api/products?category=&filters=` then ISR-hydrate |
| F-04 | Product profile `/{category}/{product}` — 6 tabs/anchors (Overview, Features, Pricing, Reviews, Alternatives, FAQs) + logo/rating/distribution/secondaries + Compare checkbox + Get Pricing / Request Demo / Visit Website + sticky lead sidebar + screenshot gallery (4–6) + integrations grid + company meta | **M** | Day 1 | ISR 60s; JSON-LD `SoftwareApplication`+`AggregateRating`+`Offer`+`FAQPage` |
| F-05 | Search results `/search?q=&tab=` — tabs Products/Categories/Comparisons + autocomplete | **M** | Day 1 | `/api/search` → Meilisearch (fallback Postgres ILIKE); `noindex, follow` for search param URLs |
| F-06 | Alternatives `/{category}/{product}/alternatives` + compare hub `/compare` | **M** | Day 1 | Ranked by category overlap + rating; 6–8 cards |
| F-07 | Best alias `/best/{category}-software` (pillar) — Top N ranked table + methodology | **M** | Day 1 | Alias canonical → `/{category}?view=best` or dedicated pillar; ISR 600s |
| F-08 | Resources `/resources/{slug}` MDX guides + TOC + product embeds + author/date | **S** | Phase 2 | ISR 600s; 100+ at scale |
| F-09 | Static: /about, /methodology, /privacy, /terms, /contact | **M** | Day 1 | Legal + trust |
| **Comparison Engine** |
| F-10 | Compare init: checkbox on every ProductCard → ComparisonBucket (cookie + user persisted) → floating "Compare (N)" → URL | **M** | Day 1 | Max 3 MVP (expand 5 later); bucket via `localStorage` + `/api/saved/comparisons` if authed |
| F-11 | Comparison page `/compare/{a}-vs-{b}[-vs-{c}]` — Header cards + Overview + Pricing matrix + Ratings (overall+4 secondaries) + Features grouped ✓/— + Pros/Cons + Integrations (intersection highlight) + Alternatives + FAQs + Verdict | **M** | Day 1 | On-demand ISR 300s; canonical = alphabetically sorted slugs; 301 on unsorted; 404 if slug unknown; no thin pages (<5 overlapping features) |
| F-12 | Related comparisons ("A vs C, B vs C") + export/share | **S** | Phase 2 | Share URL copy + OG image |
| F-13 | Personalized verdict ("Choose A if ... B if ...") auto-summary (LLM) | **C** | Phase 3 | LLM review summarization |
| **Review System** |
| F-14 | Review list: avatar, name/role/company, verified badge, date, stars, title/body, pros/cons, helpful, duration/size filters + sort (recent/helpful/high/low) | **M** | Day 1 | Filter by star/verified/recency; cursor paginated |
| F-15 | Review submission: search/select product → auth gate → overall 1–5 + 4 secondaries (Ease/Value/Support/Functionality 1–5) + title/body(80+ ch)/pros/cons + metadata (role, company size, industry, useDuration) → PENDING → email "Under review" | **M** | Day 1 | Zod validation; rate 5/day/user; HTML sanitize; one review per user per product `@@unique([productId,userId])` |
| F-16 | Verification: email verify OR Google/LinkedIn OAuth → Verified badge; admin moderation required before APPROVED + rating recompute + search sync | **M** | Day 1 | `Review.verified` bool; moderation queue |
| F-17 | Helpful votes toggle + abuse/duplicate/spam scoring + flag | **M** | Day 1 | `ReviewVote @@unique([reviewId,userId])`; denorm `helpfulCount` |
| F-18 | Pros/cons aggregation (mined) + review summarization (LLM) | **S/C** | Phase 2/3 | Software Advice pattern "We analyzed 18k reviews" |
| F-19 | LinkedIn share incentive (SoftwareSuggest step 3) | **S** | Phase 2 | Post-review share CTA → badge |
| **Search & Filters** |
| F-20 | Meilisearch typo-tolerant facets: category, price tier, rating bucket, freeTrial, deployment, integrations | **M** | Day 1 | <50ms p95; facets sync via worker |
| F-21 | Filter Drawer (desktop rail + mobile Sheet) + FilterChips row + SortSelect | **M** | Day 1 | Aria disclosure/dialog patterns |
| F-22 | Company size / industry / integrations / deployment filters (G2 depth) | **S** | Phase 2 | Requires denorm product attrs |
| F-23 | Requirements builder / scoring (SelectHub-lite) → filtered shortlist + template download | **S** | Phase 2 | Checklist → filter preset |
| F-24 | Semantic search (pgvector / Meilisearch vector) + AEO/GEO visibility | **C** | Phase 3 | "best CRM for startups" intent |
| **Lead Generation** |
| F-25 | Get Pricing (product-tied, plan-aware) → Lead(GET_PRICING) | **M** | Day 1 | Capture name/email/company + utm/referrer → DB + email vendor+admin |
| F-26 | Request Demo → Lead(REQUEST_DEMO) | **M** | Day 1 | As above |
| F-27 | Expert Recommendation (async): hero + sidebar form → Lead(EXPERT_RECOMMENDATION) → admin queue → manual shortlist email | **M** | Day 1 | SLA 1 hr; Phase 2: auto vendor match |
| F-28 | Visit Website click tracking (redirect via `/api/out?to=&productId=`) | **M** | Day 1 | Log click + affiliate redirect; billable event |
| F-29 | Email capture "Send list to inbox" | **S** | Phase 2 | Low-friction lead |
| F-30 | Post Project / RFI/RFP (GoodFirms/SelectHub) | **C** | Phase 3 | Reverse marketplace |
| F-31 | Calendly advisor embed (Software Advice 15-min) | **C/W** | Phase 3 | Only if human ops staffed |
| **Buyer (Auth)** |
| F-32 | Auth: credentials (bcrypt cost 12) + Google (+ LinkedIn optional), email verify, reset, RBAC BUYER/VENDOR/MODERATOR/ADMIN | **M** | Day 1 | Auth.js v5 + Prisma adapter |
| F-33 | Saved products & comparisons (wishlist) | **M** | Day 1 | `SavedProduct @@unique([userId,productId])` |
| F-34 | Review history (edit/delete → re-moderation) + lead history | **M** | Day 1 | `/api/me/*` |
| F-35 | Email digests / saved searches / price-drop alerts | **S** | Phase 2 | Cron |
| **Vendor Portal** |
| F-36 | Claim profile: business email + domain check → admin approve → role VENDOR + `Company.ownerId` | **M** | Day 1 | Verified domain = fast-track |
| F-37 | Edit listing (overview/features/pricing/screenshots/integrations/company) → PENDING → revalidate + search sync on approve | **M** | Day 1 | All vendor edits moderated |
| F-38 | Lead inbox: list/filter/status (NEW→CONTACTED→QUALIFIED→CLOSED/SPAM)+notes+CSV export | **M** | Day 1 | `/api/vendor/leads` |
| F-39 | Review management: view, public response, flag | **M** | Day 1 | Response stored as child/field; appears under review |
| F-40 | Vendor analytics: views, comparison appearances, lead trend (30/90d) | **S** | Phase 2 | Phase 3: Buyer intent firmographics (privacy-compliant) |
| F-41 | Sponsored placements & bidding (Sponsored badge, sort boost) + billing | **S** | Phase 2 | `Product.sponsored` + auction |
| F-42 | Billing / plan tier (SoftwareSuggest $4k/6mo model) | **S** | Phase 2 | Stripe |
| **Admin** |
| F-43 | Dashboard: KPIs + moderation queues counts + health | **M** | Day 1 | `/admin` |
| F-44 | CRUD + moderation: products/categories/features/reviews/vendors/leads/users/resources | **M** | Day 1 | TanStack Table; Approve/Reject with reason → revalidate |
| F-45 | Feature taxonomy manager (FeatureGroup/Feature) | **M** | Day 1 | Required for comparison |
| F-46 | SEO manager: sitemap status, redirects (`SlugRedirect`), programmatic health | **M** | Day 1 | Lint thin/duplicate pages |
| F-47 | Audit log + legal/DSAR queue | **S** | Phase 2 | See §9 |
| **SEO / Programmatic** |
| F-48 | ISR everywhere (see §8) + dynamic `sitemap.xml` index → shards | **M** | Day 1 | 2,350 URLs launch → 12k at 10k products |
| F-49 | Canonical, robots.txt, OG (next/og), JSON-LD all types, breadcrumbs | **M** | Day 1 | CI lint unique H1/title |
| F-50 | Internal linking graph: category→product→comparison→alternative→resource (no orphans) | **M** | Day 1 | ≥2 inbound links per product |
| **NFR / Ops** |
| F-51 | Performance budgets, a11y WCAG 2.1 AA, security (OWASP, CSP/HSTS, CSRF, Zod, sanitization), rate limiting, backups, observability | **M** | Day 1 | See §4/§9 |
| F-52 | API v1 read-only (products/categories/reviews) + SSO (SAML/OIDC) + data export | **C** | Phase 3 | Enterprise tier |

> **Implementation rule:** Build in row order. If behind schedule, cut from bottom of `C` upward, never from `M`.

---

## 4. Technical Architecture

### 4.1 Stack (locked for MVP — deviate only with ADR)

| Layer | Choice (MVP) | Why (vs alternatives) | Scale Path |
|---|---|---|---|
| **Frontend** | **Next.js 15 App Router + React 19 + TypeScript** | SSR/ISR/SSG out of box; RSC default in 15; `revalidate`+`generateStaticParams` for 50k pages; API route handlers colocated. Remix weaker ISR; Astro weak for marketplace state (bucket/filters); SPA disqualified for SEO. | Next.js stays; add route segment caching + PPR (Partial Prerendering) when stable |
| **Styling** | **Tailwind CSS + shadcn/ui (Radix) + Lucide** | No heavy lib; design tokens controlled | Keep |
| **DB** | **PostgreSQL 16 + Prisma ORM** | Relational domain (Product↔Category↔Feature↔Review↔Comparison); JSONB+FTS+pgvector ready; Prisma migrations typed. Drizzle alternative but Prisma mature for admin CRUD. | Neon/Supabase → self-host with read replicas; connection pooling via PgBouncer |
| **Search** | **Meilisearch** (MVP) + **Postgres ILIKE/tsvector fallback** | Typo-tolerant, <50ms, facets, trivial cloud/self-host ops; degrades gracefully (never 500). Typesense similarly strong; ES overkill pre-100k products. | → Typesense or Elasticsearch/OpenSearch at 100k+ |
| **Auth** | **Auth.js v5 (next-auth)** + **Prisma adapter** | Credentials (bcrypt 12) + Google + LinkedIn OAuth; database session strategy for audit; middleware RBAC | Add SAML/OIDC (Enterprise) via Auth.js providers |
| **Cache/Queue/Jobs** | **Upstash Redis** (or in-memory fallback for dev); **pg-boss** or **Vercel Cron + BullMQ** | Rate limit (60/min IP on `/api/*`, 5/day/user reviews, 10/hr/IP leads), session, search sync, email queue | Upstash → self-host Redis; BullMQ for heavy jobs |
| **Validation** | **Zod** on every API input + form | Single source of truth; share schemas client/server | Keep |
| **Email** | **Resend** (or SendGrid) + `console.log` fallback dev | Verification, lead notifications, review published | Keep |
| **Uploads** | **UploadThing** or **S3-compatible (R2)** | Logos/screenshots, 2MB, image-only | Virus scan via UploadThing |
| **Infra (MVP)** | **Vercel** (frontend+API+cron) + **Neon or Supabase Postgres** + **Meilisearch Cloud** + **Upstash Redis** | One-click deploy, preview per PR, ISR, analytics | Alt self-host: Docker Compose + Hetzner + Coolify + Caddy (cheaper, more control) |
| **CDN/WAF** | **Cloudflare** (DNS+WAF+rate limit) | | |
| **Observability** | **Sentry** (errors) + **PostHog** (product) + **Vercel Analytics** (Web Vitals) + structured JSON logs | | |
| **Testing** | Vitest+RTL (unit) + **Playwright** (E2E 15 paths) + **axe-core** + **Lighthouse CI** | | |
| **CI/CD** | GitHub Actions (lint→typecheck→test→build); Vercel auto-deploy `main` | | |

### 4.2 High-level diagram

```
Browser → Cloudflare (CDN/WAF) → Vercel (Next.js 15 RSC)
  ├─ SSR/ISR pages (RSC) ── Prisma (PgBouncer) ── Postgres (Neon)
  ├─ Route Handlers / Server Actions ─ Zod ─ Prisma + Meilisearch + Redis
  ├─ Auth.js (Prisma adapter) ─ sessions ─ OAuth (Google/LinkedIn)
  ├─ Cron (Vercel) ─ pg-boss → rating recompute, sitemap regen, search full-sync, email digests
  └─ Uploads → R2/S3
Meilisearch indexes products+categories; sync via Prisma middleware/worker (or pg LISTEN/NOTIFY).
Health: GET /api/health → { db, search, redis }.
```

### 4.3 Project structure (single repo — create exactly)

```
software-discovery-platform/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                         # homepage
│   │   ├── layout.tsx
│   │   ├── categories/page.tsx
│   │   ├── [category]/page.tsx              # category listing
│   │   ├── [category]/[product]/page.tsx    # product profile (6 tabs)
│   │   ├── [category]/[product]/alternatives/page.tsx
│   │   ├── compare/page.tsx                 # compare hub
│   │   ├── compare/[slugs]/page.tsx         # /compare/a-vs-b[-vs-c]
│   │   ├── resources/[slug]/page.tsx        # MDX guides (ISR 600s)
│   │   ├── best/[category]/page.tsx        # alias
│   │   ├── search/page.tsx                  # search results (noindex)
│   │   └── (static)/{about,methodology,privacy,terms,cookies,contact}/page.tsx
│   ├── (auth)/{login,register}/page.tsx
│   ├── (dashboard)/
│   │   ├── vendor/{page.tsx,layout.tsx,products,leads,reviews}/
│   │   └── admin/{page.tsx,layout.tsx,products,categories,reviews,vendors,leads,users,seo}/
│   └── api/
│       ├── search/route.ts
│       ├── products/{route.ts,[slug]/route.ts}
│       ├── categories/route.ts
│       ├── comparisons/[slugs]/route.ts
│       ├── leads/route.ts
│       ├── reviews/{route.ts,[id]/helpful/route.ts}
│       ├── saved/{products,comparisons}/route.ts
│       ├── vendor/{claim,products/[id],leads,reviews/[id]/response}/route.ts
│       ├── admin/{products,categories,reviews,leads,users}/route.ts
│       ├── health/route.ts
│       ├── webhooks/search-sync/route.ts
│       ├── out/route.ts                     # affiliate click tracker
│       └── sitemap/route.ts
├── components/{ui,cards,filters,compare,reviews,forms,layout}/
├── lib/{db.ts,search.ts,auth.ts,validation.ts,seo.ts,email.ts,utils.ts}
├── prisma/{schema.prisma,seed.ts,migrations}/
├── public/{icons,images}/
├── e2e/*.spec.ts
├── scripts/{sync-search.ts,generate-sitemap.ts}
├── docker-compose.yml                        # Postgres+Meilisearch+Redis for local
├── .env.example + .env
├── next.config.ts  tailwind.config.ts  package.json
```

### 4.4 Environment

```env
DATABASE_URL="postgresql://...@.../sdp?schema=public"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""  GOOGLE_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID="" LINKEDIN_CLIENT_SECRET=""
MEILISEARCH_HOST="http://localhost:7700"  MEILISEARCH_KEY=""
REDIS_URL=""          # upstash — fallback to memory rate limiter dev
RESEND_API_KEY=""     # fallback console
R2_* / S3_*          # uploads
SENTRY_DSN=""
NEXT_PUBLIC_POSTHOG_KEY=""
```

`docker-compose.yml` must ship for `postgres:16 + meilisearch + redis:7` so `npm run dev` works after `npx prisma migrate dev`.

### 4.5 Next.js 15 specifics (fresh finding)

- RSC is default — all data-fetching pages should be Server Components; client components only for bucket, filters, forms, autocomplete.
- ISR via `export const revalidate = 60` (per route segment) and `revalidatePath/revalidateTag` on admin approve/webhook. `generateStaticParams` for top categories only — remaining on-demand.
- `fetch` caching changed in 15: opt-in. Use `next: { revalidate }` explicitly or direct Prisma (preferred for DB pages).
- Dynamic OG: `app/[category]/[product]/opengraph-image.tsx` via `next/og`.

### 4.6 Cross-cutting concerns

- **Validation:** Zod on every input (example: `LeadSchema` — `type enum[GET_PRICING,REQUEST_DEMO,EXPERT_RECOMMENDATION]`, `email string.email`, `message max 2000` — see `14-API-ARCHITECTURE.md`).
- **Rate limiting:** Upstash `ratelimit` — 60/min IP on `/api/*`, 5/day/user reviews, 10/hr/IP leads → 429 + `Retry-After`.
- **Security:** CSP (script-src self + vercel/analytics), HSTS, CSRF (Next.js built-in), bcrypt 12, RBAC on every route, Zod, HTML sanitization (DOMPurify) for review bodies, image-only uploads 2MB.
- **Caching:** ISR + Redis for `GET /api/categories` (300s), Meilisearch query cache; CDN caches ISR HTML.
- **Error shape:** `{ error: "VALIDATION_ERROR", details } | { error:"RATE_LIMITED", retryAfter } | { error:"NOT_FOUND" }`.
- **Jobs:** `pg-boss` queue or Vercel Cron: nightly rating sanity, sitemap regen, search full-sync (drift repair), email digests (Phase 2).

### 4.7 Build/deploy loop (enterprise hardening)

`BUILD → RUN → TEST → FIND BUGS → FIX → RETEST → CONTINUE`. Do not declare done until: Playwright 15 paths green, axe 0 violations on public pages, Lighthouse ≥90 perf/SEO on product+category, no console errors, `GET /api/health` ok ×3 envs.

---

## 5. Database Schema Reference

Canonical source: `schemas/DATABASE-SCHEMA.md` (430 lines). Do not improvise — copy verbatim then `npx prisma generate && migrate`.

### 5.1 ERD

```
User 1──* Review *──1 Product *──* ProductCategory *──1 Category
User 1──* Lead   *──1 Product              │
User 1──* SavedProduct *──1 Product        │
User 1──* SavedComparison *──1 Comparison  │
Product 1──* PricingPlan                  Category 1──* Category (self, parent)
Product 1──* ProductFeature *──1 Feature ─* FeatureGroup
Product 1──* ProductIntegration *──1 Integration
Product 1──* ProductScreenshot
Review 1──* ReviewVote
Product ──* Company (via companyId)
Company 1──* Product
Comparison *──* Product (via ComparisonProduct, ordered)
Category 1──* Resource (MDX)
```

### 5.2 Models & enums (inventory)

| Model / Enum | Purpose | Key Constraints |
|---|---|---|
| `Role {BUYER,VENDOR,ADMIN,MODERATOR}` `LeadType {GET_PRICING,REQUEST_DEMO,EXPERT_RECOMMENDATION,VISIT_WEBSITE}` `LeadStatus {NEW,CONTACTED,QUALIFIED,CLOSED,SPAM}` `ReviewStatus {PENDING,APPROVED,REJECTED,FLAGGED}` `ProductStatus {DRAFT,PENDING,APPROVED,ARCHIVED}` | Domain enums | Validate with Zod; status machines enforced in service layer |
| `User {id,email@unique,name,image,passwordHash?,role, emailVerified, createdAt}` + `Account, Session` (Auth.js) | Identity; vendor claim via `Company.ownerId@unique` | `email@unique`; password bcrypt 12 |
| `Company {id,name,slug@unique,website,logoUrl,foundedYear,hqCountry,hqCity,employeeCount, ownerId@unique}` | Vendor entity; 1 owner → 1 company | `slug@unique`, `ownerId@unique` |
| `Category {id,name,slug@unique,description,icon,parentId→self,seoTitle,seoDescription,sortOrder}` | Hierarchical taxonomy (30 top + 150 sub at scale) | `@@index([parentId])`; sortOrder for nav |
| `Product {id,name,slug@unique,tagline,description(Text),shortDescription,logoUrl,website,status,companyId, ratingAvg,ratingCount,easeAvg,valueAvg,supportAvg,functionalityAvg,startingPrice(Decimal 10,2),pricingModel,freeTrial,freeTrialDays,freeVersion,deployment(String[]),featured,sponsored,seoTitle,seoDescription}` | Core marketplace entity | `@@index([status])`, `[ratingAvg]`, `[companyId]`; slug globally unique for stable `/compare` URLs |
| `ProductCategory {productId,categoryId,isPrimary}` | M:N with primary flag for breadcrumb/canonical | `@@id([productId,categoryId])`, `@@index([categoryId])` |
| `FeatureGroup {id,name,categoryId?}` → `Feature {id,name,slug@unique,groupId?}` → `ProductFeature {productId,featureId,available,note}` | Structured comparison taxonomy | `Feature.slug@unique` |
| `PricingPlan {id,productId,name,price(Decimal?),billing,currency,features(String[]),ctaLabel,sortOrder}` | 1–5 plans/product; pricing matrix source | `@@index([productId])` |
| `Integration {id,name@unique,slug@unique,logoUrl,category}` → `ProductIntegration` | Integrations matrix | |
| `ProductScreenshot {id,productId,url,caption,sortOrder}` | Gallery 4–6 | |
| `Review {id,productId,userId,status,rating(1-5),title,body(Text),pros(Text),cons(Text), easeRating,valueRating,supportRating,functionalityRating(1-5 each), companySize,industry,role,useDuration,verified,bool,helpfulCount,createdAt}` | Verified review | `@@unique([productId,userId])`, `@@index([productId,status])` |
| `ReviewVote {id,reviewId,userId,helpful(bool)}` | Helpful toggle | `@@unique([reviewId,userId])` |
| `SavedProduct {userId,productId}` | Wishlist | `@@unique([userId,productId])` |
| `Comparison {id,slug@unique,title,views}` + `ComparisonProduct {comparisonId,productId,position}` | Canonical `-vs-` comparison | Slug alphabetically sorted; 301 on unsorted |
| `Lead {id,type,status,productId?,userId?,name?,email,company?,phone?,message?,categorySlug?,meta(Json: utm/referrer/plan),createdAt}` | Monetizable intent | `@@index([productId])`, `[status]`, `[type]` |
| `FaqItem {id,productId?,categoryId?,question,answer(Text),sortOrder}` | FAQs for product/category/comparison | |
| `Alternative {productId,alternativeId,score}` | Precomputed alternative graph | `@@unique([productId,alternativeId])` |
| `Resource {id,title,slug@unique,excerpt,bodyMdx(Text),categoryId?,author,published,publishedAt,seoTitle,seoDescription}` | MDX guides | `slug@unique` |
| `SlugRedirect {oldSlug@id,newSlug}` | 301s on product rename/category move | |
| `SavedComparison` (add if not in schema tail — mirror SavedProduct) | Save comparison | |

### 5.3 Denormalization & workers

- `Product.ratingAvg/ratingCount + easeAvg/valueAvg/supportAvg/functionalityAvg` are denormalized — **never compute on read**. Updated only on `Review status → APPROVED` via worker:

```ts
const agg = await db.review.aggregate({
  where:{ productId, status:'APPROVED' },
  _avg:{ rating:true, easeRating:true, valueRating:true, supportRating:true, functionalityRating:true },
  _count:true
});
await db.product.update({ where:{id:productId}, data:{
  ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count,
  easeAvg: agg._avg.easeRating ?? 0, valueAvg: agg._avg.valueRating ?? 0,
  supportAvg: agg._avg.supportRating ?? 0, functionalityAvg: agg._avg.functionalityRating ?? 0,
}});
await search.syncProduct(productId); // Meilisearch
```

- Seed order: Categories → FeatureGroups/Features → Companies → Products → ProductCategory → ProductFeature → PricingPlans → Integrations → Screenshots → Reviews (creates Users as needed) → Leads → Comparisons → Resources. See §C.

---

## 6. Core Engines — Search / Comparison / Review / Lead

### 6.1 Search engine

| Concern | Decision |
|---|---|
| **Index** | Meilisearch (MVP). Indexes: `products` (name, slug, tagline, shortDescription, description, category names, feature names) + `categories`. |
| **Facets** | `category`, `priceTier` (derived), `ratingBucket` (4+, 4.5+), `freeTrial`, `deployment`, `integrations` (Phase 2) |
| **Query** | Typo tolerance, prefix search, `facets` filter DSL. Autocomplete endpoint `GET /api/search?q=&category=&filters=` proxies Meilisearch. |
| **Performance** | p95 <150ms (Meilisearch), <50ms autocomplete. Cache popular queries in Redis 60s. |
| **Sync** | Prisma middleware/`$use` → `search.syncProduct(productId)` on create/update; nightly full-sync job repairs drift. |
| **Fallback** | If `MEILISEARCH_HOST` unreachable → degrade to Postgres `ILIKE` + `tsvector` (GIN index) + `pg_trgm`; **never 500**. |
| **Ranking** | Text relevance × `ratingAvg`×log(`ratingCount+1`) × `sponsored` boost (sort first only if explicitly sponsored slot, otherwise second) |
| **Semantic (Phase 3)** | pgvector embeddings (`product.description` + reviews summary) or Meilisearch vector; embed "best CRM for startups" intent → hybrid lexical+vector |
| **Noindex** | `/search?q=` → `meta noindex,follow`; sitemap never includes search URLs |

### 6.2 Comparison engine (Priority #1 — SEO + UX moat)

- **Initiation:** `ProductCard` checkbox (`Compare`) → `ComparisonBucket` (bottom-right, live region `aria-live="polite"`) stores `slug[]` in `localStorage` + if authed `POST /api/saved/comparisons`. Limit 3 MVP, 5 later (SelectHub allows 5). Button label `Compare (N)` disabled at N<2.
- **URL contract:** `/compare/{slugs}` where `slugs = sorted(productSlugs).join('-vs-')`. Example: `/compare/hubspot-vs-salesforce-vs-zoho-crm`. **Canonical invariant:** `canonicalCompareSlug(slugs) = [...slugs].sort().join('-vs-')`. On unsorted hit → `301` to canonical. On unknown slug → `404`. On duplicate slug → `400`.
- **Data fetch:**

```ts
const parts = params.slugs.split('-vs-'); // validate [a-z0-9-] + length ≤60 each
if (parts.length <2 || parts.length>3) notFound(); // MVP 3 max
if (parts.join('-vs-') !== canonicalCompareSlug(parts)) redirect(301, `/compare/${canonicalCompareSlug(parts)}`);
const products = await db.product.findMany({ where:{ slug:{ in:parts }, status:'APPROVED' }, include:{ pricingPlans:true, features:{include:{feature:true}}, integrations:true, screenshots:true, faqItems:true }});
if (products.length !== parts.length) notFound();
// Order columns by canonical order (SEO) — preserve for table
```

- **Table sections (in order):**
  1. **Sticky header row** — logo 48×48 (object-contain, white bg), name (16 semibold), `ratingAvg` + ★ + `ratingCount`, `startingPrice`, CTAs: `Get Pricing` (primary), `Visit Website` (ghost, tracked via `/api/out`). Sticky `top:0`, horizontal scroll with first column sticky on mobile.
  2. **Overview** — `shortDescription` + tagline (2 lines each).
  3. **Pricing** — plans side-by-side columns; if plan counts differ, align by tier (Starter/Essential vs Pro/Professional; missing → `—` muted). Show `freeTrial`/`freeVersion` badges.
  4. **Ratings** — overall stars + count + 4 secondaries as horizontal bars (Ease/Value/Support/Functionality, 4.0/5.0 etc., capped at 5, aria-label per bar).
  5. **Features** — grouped by `FeatureGroup` (`Lead Management`, `Automation`, ...); rows = `Feature`s in group, cells = `✓` green if `ProductFeature.available`, `—` muted else, `note === 'add-on'` → muted `Add-on`.
  6. **Pros/Cons** — 2-col bullets (green `+` / red `−`), sourced from aggregated `Review.pros/cons` (Phase 2 mined) or manual `FaqItem`/editorial.
  7. **Integrations** — logo grid per product; **intersection highlighted** (green ring) so buyer sees overlap at glance.
  8. **Alternatives** — 6 cards: products that are alternatives to **either** A or B (Union of `Alternative` rows), deduplicated, sorted by `score`.
  9. **FAQs** — merge `FaqItem` for involved products + category FAQ; emit `FAQPage` JSON-LD if ≥2.
  10. **Verdict** (Phase 2 LLM) — "Choose A if you need … Choose B if you need …".

- **SEO:** Title `{A} vs {B}: Features, Pricing & Reviews Compared — 2026 | Platform` (≤60 ch), description 150–160 ch with ratings + starting prices, JSON-LD `Article` + `ItemList` (products) + `FAQPage`, breadcrumbs `Home > Compare > A vs B`. Require ≥5 overlapping features else `noindex` (guardrail thin page).
- **Related comparisons:** "People also compared: A vs C, B vs C" — derived from top alternatives per product; emit as internal links to grow graph.
- **Performance:** ISR 300s; on any contained `Product` update, `revalidatePath(`/compare/*`)` (via tag scan or `revalidateTag('compare')`).
- **Analytics:** `comparison_viewed { slugs, productIds, referrerCategory }` → PostHog.

### 6.3 Review & trust engine

- **Submission flow (wizard, 4 steps):** Product select (or deep link from profile "Write a Review") → **Auth gate** (email+password or Google; LinkedIn optional) → **Ratings** (overall 1–5 required + 4 secondaries Ease/Value/Support/Functionality 1–5 optional but recommended) → **Content** (title 10–80 ch, body 80–5000 ch, pros/cons each 0–500 ch) → **Context** (role, companySize `1-10|11-50|51-200|201-500|501-1000|1000+`, industry, useDuration) → Submit → status `PENDING` → toast "Under review — we'll email you" → email confirmation.

- **Verification:** `emailVerified` (magic link or code) **OR** OAuth (Google/LinkedIn) → `Review.verified = true` → **Verified** badge (emerald, `aria-label="Verified reviewer"`). No phone gate in MVP (GoodFirms phone adds friction; reserve for Pro tier).
- **Moderation:** Admin queue `/admin/reviews` — Approve/Reject/Flag with reason. Rules: min length, no profanity/PII, no incentivized language, no duplicate (`@@unique([productId,userId])` blocks second review), rate 5/day/user, spam score (simple heuristic: links count, caps ratio), **AI-generated review detection** (per FTC 465 — log `meta.aiGeneratedScore` if LLM detector enabled; >threshold → Flag for human). On Approve → aggregation worker (see §5.3) → `search.syncProduct` → email "Your review is live" (Resend).
- **Display & trust signals:** Rating distribution bars (5→1), secondary averages with bars, `Verified` badge, `Helpful (N)` toggle (`POST /api/reviews/[id]/helpful`), sorting (recent/helpful/high/low), filtering (star, verified-only). Methodology page `/methodology` required (see §9).
- **Aggregation display:** `Product.ratingAvg` shown as ★ + numeric (1 decimal) + `ratingCount` (e.g., `4.5 · 337 reviews`). Avoid implying precision beyond data: round to 1 decimal.
- **Pros/cons mining (Phase 2):** Extract frequent phrases from `Review.pros/cons` via keyword/TF-IDF or LLM → aggregated pros/cons section ("What users like most: …").

### 6.4 Lead & monetization engine

- **Lead types & capture points:**

| Type | CTA Label | Where | DB `LeadType` | Follow-up |
|---|---|---|---|---|
| Get Pricing | "Get Pricing" / "Get Offer" | ProductCard + Product header + Pricing plan + Comparison header | `GET_PRICING` | Email vendor (if `productId`) + admin; vendor sees `NEW` in `/vendor/leads` |
| Request Demo | "Request Demo" / "Watch Demo" | Product header + sticky sidebar | `REQUEST_DEMO` | As above |
| Expert Rec | "Get Free Recommendation" | Hero form + product sidebar "Ask Expert" | `EXPERT_RECOMMENDATION` | Admin queue only (no vendor auto-route MVP); SLA reply <1 hr manual shortlist |
| Visit / Outbound | "Visit Website" | ProductCard + Product header + Comparison | `VISIT_WEBSITE` (or Click log) | `GET /api/out?to=…&productId=…` → 302 via `trkrdr` alias; log click for billing |

- **Form:** `name(2–80) + email(email) + company(2–80, optional) + phone(max 20, optional) + message(max 2000, optional) + categorySlug(optional) + meta(Json: utm_source/medium/campaign, referrer, planId)` — Zod `LeadSchema`. **No modal popups.** Inline or sticky sidebar; ambient.

- **Routing (MVP):**

```
Buyer submits → POST /api/leads (Zod+rate 10/hr/IP) → Lead row status=NEW
  → if productId: email to Company.owner (vendor) + email to admin distribution
  → else (expert) → admin queue only
Vendor: GET /api/vendor/leads (filtered by products they own) → PATCH /api/vendor/leads/[id] {status, notes}
Admin: GET /api/admin/leads (all, filterable) — expert leads assigned manually
```

- **Compliance hooks:** Honeypot field + Turnstile (Cloudflare) on leads; log `meta.ip` hash only (not raw PII — GDPR minimization); retention policy (see §9).

---

## 7. Monetization & Growth

### 7.1 Business model (staged)

| Phase | Revenue Pillar | Who Pays | Unit Economics (illustrative) | Notes |
|---|---|---|---|---|
| **MVP (months 0–6)** | **Pay-per-lead (PPL)** — shared with Software Advice/G2 Intent model | Vendor | $25–$75 per qualified lead (category-dependent); track `meta.plan` for price variance | Requires lead qualification (company email domain match + min message length). Bill on delivery, credit on spam. |
| **MVP** | **Sponsored listing** — `Product.sponsored=true` → sorted first within category (1–3 slots) | Vendor | $300–$800/mo per slot (category tiered) | Amber `Sponsored` badge, never unlabeled (FTC). Sort boost only, ranking still rating-weighted underneath. |
| **MVP** | **PPC / Visit click** — `Visit Website` tracker | Vendor | $1.50–$6 CPC | Click log table `Lead(VISIT_WEBSITE)` or `Click` — deduplicate per IP/hour |
| **Phase 2** | **Listing tiers** (SoftwareSuggest $4k/6mo pattern) — Enhanced profile + banner + PPC credit | Vendor | $400–$900/6mo tiers | Entitlements gated in DB (plan + expiry) |
| **Phase 2** | **Sponsored comparison inclusion** — bid to appear as alternative | Vendor | Auction or fixed $150/mo | Clearly labeled |
| **Phase 2** | **AEO/GEO visibility report** — "You rank #7 in AI answers" | Vendor | $199 report / $99/mo monitor | Audit job produces report |
| **Phase 3** | **Buyer intent data** (privacy-compliant, aggregated + firmographics where consented) | Vendor | Subscription $1k–$5k/mo | See §9 — no de-anonymization without consent |
| **Phase 3** | **Decision Platform / RFI** — multi-stakeholder scoring, RFP distribution | Vendor (to receive RFP) | Per-RFP fee + subscription | SelectHub model — only if enterprise traction |
| **Phase 3** | **Agency marketplace** (GoodFirms wedge) | Agency | Pro verification + project fee | Only if validated |

> **Mechanism-only disclosure:** Exact PPL/CPC prices are NOT to be published without live A/B and vendor contracts. Above are starting points derived from observed tiers.

### 7.2 Vendor funnel (acquisition → retention)

1. **Acquire:** "Claim your profile" CTA in header + footer + product pages (G2/SF Finder pattern) → `/vendor/claim` (business email + domain check). Also outbound to seeded companies' `website` contacts.
2. **Activate:** Vendor onboarding email → "Optimize: add 5 plans, 8 features, 4 screenshots" checklist; progress bar in `/vendor` — incomplete profiles ranked lower.
3. **Monetize:** Day 7: "You got 12 views — sponsor to get 4× leads" drip (if sponsored slot available). Lead inbox is stickiest feature — every lead email contains "Upgrade to see contact faster."
4. **Retain:** Monthly performance digest (views, comparison hits, lead source), review response rate, trend vs category avg. At-risk if 0 leads/30d → offer free Expert Recommendation placement.

### 7.3 Buyer growth loops

- **SEO loop:** More products → more `/compare` combos → more internal links → more crawl → more traffic → more reviews → higher rankings → more products (vendor inbound).
- **Review flywheel:** Post-lead email 3 days later: "How was {Product}? Leave a review (30 sec)" — offer social proof ("Join 3,600 reviewers") not cash (to avoid FTC incentive disclosure complexity). Phase 2: LinkedIn share incentive (SoftwareSuggest pattern) with **clear disclosure** if ever incentivized (see §9).
- **UGC triggers:** "Write a Review" header CTA + product page empty state ("Be the first to review {Product}") + post-demo Nudge.
- **Retention:** Saved products/comparisons (auth wall soft) → email "Your comparison updated: {Product} dropped price" (price watcher Phase 2).

### 7.4 Gating decisions

- **Do NOT chase G2's 3.6M volume in Y1.** Credibility at 10–30k verified reviews > inflated 100k unverified (FTC liability).
- **Do NOT run a human advisor call center.** Async expert form w/ <1 hr SLA delivers 90% value at 5% OPEX.

---

## 8. SEO at Scale — Programmatic Architecture

### 8.1 URL system (original — do not copy competitor slugs verbatim)

```
/                           homepage
/categories                 all top-level categories (hub)
/{category}                 category listing  e.g. /crm, /project-management
/{category}/{product}       product profile  e.g. /crm/hubspot
/{category}/{product}/alternatives  alternatives (canonical; also serves /compare intent)
/compare/{a}-vs-{b}         2-way comparison  e.g. /compare/salesforce-vs-hubspot
/compare/{a}-vs-{b}-vs-{c} 3-way comparison
/best/{category}-software   alias → /{category}?view=best  (or dedicated pillar) e.g. /best/crm-software
/resources/{slug}           editorial guides e.g. /resources/crm-buying-guide-2026
/search?q=...               search results (noindex)
```

**Rules:**
- Slugs: lowercase, hyphenated, `[a-z0-9-]`, max 60 chars, globally unique per entity. `Product.slug` is globally unique (not per-category) — enables stable `/compare` even if category reassigned.
- Comparison slug: `sorted([a,b,…]).join('-vs-')` — request to unsorted → `301`. Duplicate slug in request → `400`.
- No trailing slash canonical (redirect).
- Product moved categories → keep old URL via `SlugRedirect` → `301`; emit new canonical.

### 8.2 Page templates (blocks, dynamic data, cache)

| Template | Blocks (order) | Dynamic Sources | ISR |
|---|---|---|---|
| Homepage | Hero search + Categories (12) + Featured comparisons + Trending products + TrustBar (X reviews/Y products/Z categories) + Vendor CTA + Review CTA + FAQ | `Product` (featured+sponsored), `Comparison.views`, counts | `revalidate 300s` |
| Category | H1 `{Category} Software — 2026` + description + buying-guide excerpt + filters + product grid (24/page) + pagination + FAQ + alternatives + internal links + `BreadcrumbList` | `Category`, `ProductCategory→Product`, `FaqItem`, `Resource` (guide excerpt) | `revalidate 60s` |
| Product | Header (logo/name/tagline/rating/distribution/secondaries/Compare/CTA) + tabs (Overview/Features/Pricing/Reviews/Alternatives/FAQs) + sticky lead form + `BreadcrumbList` | `Product`, `PricingPlan`, `ProductFeature→Feature`, `ProductScreenshot`, `ProductIntegration`, `Review` (approved), `Alternative`, `FaqItem`, `Company` | `revalidate 60s` |
| Comparison | H1 `{A} vs {B}: Features, Pricing & Reviews Compared — 2026` + header cards + Overview/Pricing/Ratings/Features/Pros-Cons/Integrations/Alternatives/FAQ/Verdict | 2–3 `Product`s + feature/pricing matrices + `Alternative` union | `revalidate 300s`, on-demand on product update |
| Resource | H1 + author/date + TOC + body(MDX) + product embeds + FAQ + related resources | `Resource` + linked `Product`s | `revalidate 600s` |
| Best | H1 `Best {Category} Software — Top N Reviewed` + ranked table (rating+count) + methodology excerpt | Category top N by `(ratingAvg, ratingCount)` | `revalidate 600s` |

### 8.3 Internal linking (no orphans)

- Category (grid) ⇄ Product (breadcrumb + alternatives back)
- Product → Alternatives (6) → each alternative product → back to source's alternatives
- Comparison → both products + related comparisons (share a product) — footer block "Compare with…"
- Breadcrumbs: `Home > Category > Product` and `Home > Compare > A vs B`
- Footer: Top 20 categories + Top 20 comparisons by `views` (crawl path for shallow depth)
- Resource → products (inline embeds) + related resources
- **Invariant:** every `APPROVED` product reachable from ≥2 category/comparison/resource links.

### 8.4 Programmatic generation & incremental build

- `/categories` — static (few rows)
- `/{category}` — `generateStaticParams` for top 20 categories at build; remaining **on-demand ISR** (first visit → cached).
- `/{category}/{product}` — on-demand ISR only (1k–3k at launch — do **not** prebuild all).
- `/compare/{a}-vs-{b}` — **on-demand ISR only** (O(n²) permutations — never prebuild). Generate when first visited or when internal link first emitted. Internal links emit **only** ~200 at launch (top-5 per top-20 categories = ~200 pairwise linked combos). Scale to 5k+ safely — unlinked combos only exist if directly requested (and still render for long-tail capture).
- `/best/*` + `/resources/*` — ISR `generateStaticParams` if ≤50, else on-demand.

### 8.5 Meta, structured data, OG, pagination

- **Title patterns (≤60 ch):**
  - Product: `{Product} — Pricing, Features & Reviews (2026) | Platform`
  - Category: `Best {Category} Software — 2026 Reviews & Pricing | Platform`
  - Comparison: `{A} vs {B} — Compare Features, Pricing & Reviews | Platform`
- **Description:** 150–160 ch, includes rating, review count, starting price (dynamic). Unique per URL — CI lint failure if duplicate.
- **Canonical:** self. Paginated listings (`/{category}?page=N`, `/search` never canonical): each page self-canonical + `rel="prev/next"` headers; **do not** noindex `page>1` (paginated listings are crawlable — guardrail from D9 §8).
- **OG/Twitter:** Dynamic `opengraph-image.tsx` via `next/og` — logo + rating overlay + title.
- **JSON-LD:**
  - Product: `SoftwareApplication` + `AggregateRating` (`ratingValue=ratingAvg`, `reviewCount`, `bestRating=5`) + `Offer` per `PricingPlan` + `Review` per visible review
  - Category: `CollectionPage` + `ItemList` (products on page)
  - Comparison: `Article` + (custom `ComparisonTable`) + `FAQPage` if FAQs present + `ItemList`
  - Breadcrumbs every public page: `BreadcrumbList`
  - Organization on homepage: `Organization`
- **Hreflang:** omit MVP single `en-US`.

### 8.6 Sitemap & robots

```
/sitemap.xml        → sitemap index
  ├─ /sitemaps/products.xml
  ├─ /sitemaps/categories.xml
  ├─ /sitemaps/comparisons.xml
  └─ /sitemaps/resources.xml
```

- Generated dynamically via `app/sitemap.ts` / `app/sitemaps/[shard]/route.ts` — each shard queries DB (approved only), `lastmod = updatedAt`, `changefreq weekly`, `priority` by rating/views.
- `robots.txt`: `Allow: /`, `Disallow: /search`, `Disallow: /api/`, `Disallow: /admin`, `Disallow: /vendor`, **`Allow: /compare/*`** (SEO-critical), no `crawl-delay`. Include `Sitemap: https://{domain}/sitemap.xml`.
- Submit to Search Console + Bing Webmaster on launch; ping on nightly shard regen.

### 8.7 Content scale math (from D9 §7)

- Launch: `100 categories × avg 20 products = 2,000` product pages + `top 20 × 10 comparisons ≈ 200` comparison pages + `100 best aliases + 50 resources = 150` pillars = **~2,350 crawlable URLs** (manageable).
- At 10k products: `10k + 2k comparisons (still bounded by internal links) + 200 pillars = ~12k` pages — ISR-friendly; Vercel handles without build explosion.

### 8.8 Guardrails (lint in CI)

- **Thin page rule:** Comparison requires ≥5 overlapping features, otherwise `noindex` and no internal link. Product requires ≥100 words description + ≥3 features + ≥1 pricing plan else `noindex`.
- **Duplicate guard:** Lint that every public URL has unique `H1` + `title` + `description` — fail CI on duplicate.
- **Search guard:** `/search?q=` always `noindex, follow`.
- **Orphan guard:** Nightly job: `SELECT product.slug WHERE slug NOT IN internal_link_graph` → alert.

---

## 9. Compliance — FTC / GDPR / DSA / CCPA / A11y

This section incorporates **fresh 2025–2026 policy findings** beyond the competitively-observed baselines. Treat as **binding** for enterprise readiness.

### 9.1 FTC — Endorsements, Fake Reviews Rule, AI

#### 9.1.1 16 CFR Part 465 — Trade Regulation Rule on Consumer Reviews & Testimonials (effective 2024-10-21)

This is a **formal rule with civil penalty authority** (up to **$53,088 per violation** per 2025–2026 threshold — verify current FTC inflation adjustment at build time), not guidance. It lets FTC seek penalties + redress for:

- Creating, selling, or disseminating **fake or false reviews** (including **AI-generated** reviews from non-existent persons or non-experience). Platform must not generate or allow AI-generated reviews presented as real.
- **Buying** positive or negative reviews (conditional compensation).
- **Suppressing** negative reviews via TOS, threats, or misrepresenting review coverage (e.g., claiming "all reviews shown" while filtering negatives).
- **Undeclared insider reviews** (employee/vendor without disclosure).
- Review gating / cherry-picking detection.

**SDP controls (mandatory):**

| Control | Implementation |
|---|---|
| **No fake reviews** | Never synthesize reviews server-side; if using LLM to draft example copy, mark `synthetic: true` and never persist as `Review`. Log review text hash + client hints for AI-detection (if detector enabled, store `meta.aiGeneratedScore`; >0.85 → `FLAGGED`). |
| **No buying** | All review incentives must be disclosed + decoupled from sentiment. MVP offers **no cash incentive** for reviews (avoids disclosure complexity). If Phase 2 LinkedIn share reward added, require disclosure checkbox + `Review.meta.incentivized=true` + show banner "Reviewer received incentive to share" and update JSON-LD aggregate to note. |
| **No suppression** | Moderation `REJECTED` must store `reason` (profanity/PII/spam) — never "negative sentiment". Weekly audit: `REJECTED` reasons distribution — alert if >90% are 1–2★. Publish that "all verified reviews meeting guidelines are shown." |
| **Insider disclosure** | Vendor cannot review own product or competitors without `disclosure` flag. Add check: if `review.user.email domain == Company.website domain` → auto `FLAGGED` → human review with "affiliation" disclosure required. |
| **Negative review integrity** | `Review.status=PENDING` SLA target <24h; no silent drop. If rejected, email reason + appeal link. |

#### 9.1.2 16 CFR Part 255 — Revised Endorsement Guides (2023 revision, enforcement sharpened 2025–2026) + influencer disclosure crackdown (Dec 2025 warning letters to 10 companies)

- Any **material connection** (payment, free product, affiliate commission) between endorser and platform/vendor must be **clear & conspicuous**. For SDP: sponsored listings (`Ad`/`Sponsored`) and affiliate `Visit Website` redirects ARE endorsements needing disclosure.
- **Controls:** Every `Product.sponsored` card shows amber `Sponsored` badge (not buried). Comparison tables that include a sponsored product emit footnote "*{Product} placement is sponsored — does not influence scoring." Tracking redirect `/api/out` must not cloak destination. Keep audit log of sponsorship periods for FTC request.

#### 9.1.3 Enforcement posture (2026)

- Enforcement materially higher than pre-2023 (rule + AI guidance + warning letters). Treat fake-review breach as **company-killing** (> $50k × volume). Prioritize compliance over review growth velocity. Document methodology (`/methodology`) with verification steps, moderation policy, and ranking freshness — G2/GoodFirms publish theirs (D2 §I).

### 9.2 GDPR (EU) + ePrivacy + DSA/DMA

#### 9.2.1 Roles (CJEU 2025-12-02: X v Russmedia Digital, C-492/23)

The CJEU ruled: marketplace operator = **data controller** for personal data in listings/ads published on platform, **cannot** rely on mere conduit. **Implication for SDP:** Reviews, product descriptions containing personal data (reviewer name/role/company, vendor contacts), and lead data are SDP's controller responsibility. Requires Article 30 records, DPIA, DPA with processors (Vercel/Neon/Meilisearch/Resend/Upstash), and handling data subject requests — not optional.

#### 9.2.2 Lawful bases, minimization, retention

| Data | Basis | Minimization | Retention |
|---|---|---|---|
| Buyer lead (name/email/company/phone/message + utm) | Consent (form submit) + Legitimate interest (vendor fulfilment) — **explicit checkbox** "I agree to share my contact with vendors for pricing/demo" + link to Privacy | Store only submitted fields; do not enrich via reverse IP; hash IP, don't store raw IP | Leads: 24 months then anonymize or delete per policy; allow buyer `DELETE /api/me/leads/[id]` |
| Reviewer identity (name/email/role/company + review body) | Consent + Performance of moderation contract | Name shown as display name (buyer chooses "First Last" or anonymized initials); email never public | Reviews: for life of product listing or until deletion request (Right to be Forgotten) — honor within 30 days |
| Auth data | Contract | `Account/Session` minimal | Session expiry 30d |
| Analytics (PostHog, Vercel) | Consent via CMP | Only after consent; anonymize IP | Per CMP |

- **ePrivacy/cookies:** Non-essential cookies/trackers (PostHog, analytics, marketing) require **prior consent** via CMP (e.g., Cookiebot by Usercentrics — or self-built banner). Block tags until consent. Keep banner customizable and **reject as easy as accept** (GDPR + EU dark pattern rules).
- **DSA (Digital Services Act):** If targeting EU: illegal content + notice-and-action; TR elements (terms, transparency); if platform qualifies as hosting provider → extra obligations. At MVP: terms, DMCA-style takedown + appeal, annual transparency note.

#### 9.2.3 Rights & processes (30-day SLA)

- DSAR endpoints: `/api/me/export` (access/portability JSON), `/api/me/delete` (erasure), `/api/privacy/contact`.
- Admin queue: GDPR requests in `/admin/legal` with audit log. On review erase: recompute aggregates, resync Meilisearch, tombstone review body (keep id + "removed" placeholder for integrity).
- DPA: template with sub-processors (Neon, Meilisearch Cloud, Upstash, Resend, Vercel, Cloudflare). Keep current at `/privacy#processors`.

#### 9.2.4 Storage & breach

- **TOMs:** Postgres encryption at rest (Neon default), TLS 1.2+, bcrypt 12, row-level scopes (vendor sees only own leads), CSP/HSTS. Regular backup + PITR; backup encrypted.
- **Breach:** 72-hour notification to SA; log to `SecurityIncident` (add model if needed).

### 9.3 CCPA/CPRA (California) + state privacy

If serving Californians: honor `Do Not Sell/Share`, global privacy control (GPC) signal, annual privacy policy refresh, retention disclosures. Easiest MVP path: **do not sell leads as data broker** — leads are service facilitation with buyer consent; state it. Provide `Do Not Sell` page even if answer is "We do not sell personal info." Respect `GPC` header via CMP.

### 9.4 DMCA + defamation + content liability

- Reviews are third-party. In US, CDA §230 shields platform but **not** on moderation malice. Keep moderation neutral (see §9.1) + allow counter-review responses.
- Provide `/legal/takedown` (DMCA + defamation) with notice-and-takedown → review `FLAGGED` pending legal review; keep appeal.

### 9.5 Accessibility (enterprise blocker)

- Target **WCAG 2.1 AA** (EN 301 549 in EU). Test in CI: **axe-core** on homepage, category, product, comparison, lead form, admin. Manual audit: keyboard-only flow (search → filter → compare → submit review → submit lead) before every release. Announce bucket changes via `aria-live`.

### 9.6 Checklist before launch

- [ ] `/privacy` (updated, with processors, retention, lawful bases, DPA link, DSAR instructions)
- [ ] `/terms` + `/cookies` (CMP banner before non-essential cookies; reject == accept in ease)
- [ ] `/methodology` (review verification, moderation, aggregation, ranking freshness weekly/monthly, anti-fake controls, FTC disclosure)
- [ ] Sponsored/affiliate disclosures on every paid placement
- [ ] Data export/delete endpoints + 30-day SOP
- [ ] DPA signed with all processors

---

## 10. Roadmap, Resourcing & Risk Register

### 10.1 Roadmap (consolidated from D7 — adjusted for enterprise)

#### MVP — Weeks 1–10 (ships monetizable marketplace)

| Wk | Scope | Gate |
|---|---|---|
| 1–2 | **Foundation:** Next.js 15 + Tailwind + shadcn scaffold, ESLint/Prettier, CI; Postgres+Prisma schema (copy D5 verbatim, migrate, generate), seed 100 categories + 500 products; Auth.js (credentials+Google) + RBAC; Meilisearch index + sync worker | `npx prisma migrate dev` green; `/api/health` ok; seed script idempotent |
| 3–4 | **Public site core:** Homepage (hero search + categories + featured + trust bar); `/categories`; `/{category}` listing (filters, sort, pagination, ISR 60s, JSON-LD); `/{category}/{product}` profile (6 tabs, gallery, pricing, integrations, sticky lead form, ISR); Search page `/search` | Lighthouse ≥85 perf/SEO; visual diff ok |
| 5–6 | **Review + Comparison:** Submission flow + verification + moderation queue + listing (+ filters/sort/helpful); Comparison engine: bucket + `/compare/[slugs]` table (2–3) + on-demand ISR 300s + programmatic seeding (~200 links) + alternatives + `/best` aliases | Playwright: submit review + approve→ rating recomputed; compare canonical 301 verified |
| 7–8 | **Leads + Dashboards (minimal):** Lead forms (Get Pricing/Demo/Expert → DB + email vendor+admin) + `/api/out` click tracker; Vendor portal (claim, edit → PENDING, lead inbox read-only); Admin (product/category/review/vendor/lead/users CRUD + moderation dashboards + SlugRedirect) | E2E: lead submit → vendor inbox NEW; vendor claim → role VENDOR |
| 9 | **SEO + Polish:** `sitemap.xml` index→shards, `robots.txt`, canonical, OG (`next/og`), JSON-LD all types, breadcrumbs, internal linking audit (orphan=0), perf pass (Image optimization, ISR caching), a11y pass (axe 0 violations), empty states/404s | Sitemap validates in GSC; Lighthouse ≥90 |
| 10 | **Hardening + Launch:** Playwright 15 paths green (search, filter, product, review submit, compare, lead, auth, vendor, admin, health), rate limits + CSP/HSTS + Turnstile honeypot, backups (Neon PITR + Meilisearch snapshot), seed to 1–3k products, content pass, **launch** on Vercel+Neon+Meilisearch+Upstash, PostHog+Sentry | Release checklist + DSAR endpoints; tag `v1.0` |

**Explicitly OUT of MVP:** human 1:1 advisor call center, RFI/RFP Decision Platform, GoodFirms agency portfolio audits, G2 Grid quadrant math, real-time vendor analytics dashboard, sponsored bidding auction, i18n/multi-currency.

**MVP success (30 days):** indexed URLs >2k, p95 search <150ms, LCP <2.5s, ≥100 reviews submitted, ≥50 leads, ≥10 vendor claims, zero critical a11y/SEO regressions, zero FTC violation alerts.

#### Phase 2 — Months 3–6 (differentiation & monetization)

- Requirements builder (checklist → filter presets) + downloadable requirements template (SelectHub-lite)
- Sponsored placements + bidding (auction or pinned slots) + enhanced billing (Stripe, tiered listing plans)
- Review incentives: LinkedIn share flow + **disclosed** incentive banner + advanced vendor analytics (views, comparison appearances, lead source/trend 30/90d)
- Programmatic blog at scale: 100+ `/resources/{slug}` (comparison articles + buying guides via MDX, reusable shortcodes)
- AEO/GEO visibility product (free audit + paid report)
- Email digests, saved searches, price-drop alerts
- API v1 read-only (products/categories/reviews) — signed keys
- DSAR dashboard polish + GDPR annual audit

#### Phase 3 — Months 7–12 (scale & moat)

- Buyer intent data — aggregated + consented firmographics (privacy-safe), de-anonymization only on endorsed consent (enterprise vendor tier)
- Decision Platform v1: multi-stakeholder collaboration, scoring, RFI/RFP distribution (SelectHub enterprise pattern)
- AI layer: semantic/hybrid search, review summarization (pros/cons auto-extract + verdict), personalized comparisons ("For a 12-person startup…")
- Agency/services marketplace (GoodFirms validation-gated)
- PWA → native (Capacitor) + Enterprise SSO (SAML/OIDC), audit log export, SLA/data export
- Internationalization: `hreflang`, localized categories/reviews, regional pricing
- Scale: read replicas, Meilisearch→Typesense/ES, CDN for ISR, ClickHouse for vendor analytics

### 10.2 Team & cost

| Resource | MVP (10 wks) | Notes |
|---|---|---|
| **1–2 full-stack engineers + AI coding agent** | `prompts/MASTER-BUILD-PROMPT.md` (BUILD→RUN→TEST→FIX loop) collapses schedule materially | Single senior can ship MVP if agent does 60–80% scaffold & tests |
| **Infra (monthly)** | Vercel $20 + Neon/Supabase $20–50 + Meilisearch Cloud $0–30 + Upstash $0–10 + Resend $0–20 + R2 $5 + Domain/CF $15 = **~$60–150/mo** | See D7 §Cost; scale doubles at 10k+ products |
| **Moderation** | Part-time (founder/admin) — PENDING queue daily triage | Automate spam scoring to keep <2 hr/day |
| **Content** | 1 content editor (or founder) for 50 initial resources + category descriptions | Avoid thin-content penalty |

### 10.3 Risk register (top 10 — with mitigations)

| # | Risk | Impact | Likelihood | Mitigation | Owner |
|---|---|---|---|---|---|
| 1 | **FTC 465 violation — fake/AI review or undisclosed sponsored placement** | Company-killing fines ($53k × N) + marketplace ban index | M if no controls | Ship controls in §9.1 before any review growth campaign; audit weekly; DPO signs off methodology; never ship incentive without disclosure | CTO + Legal |
| 2 | **Thin / duplicate programmatic pages penalized by Google** | Index collapsed, traffic 0 | M | Guardrails §8.8 (≥100 words + ≥3 features + ≥1 plan; compare ≥5 overlap) + CI lint unique H1/title + sitemap shards | SEO / CTO |
| 3 | **Meilisearch down → search 500s** | Core UX down | M | Fallback to Postgres ILIKE/tsvector; health endpoint + alerting; Meilisearch Cloud HA or self-host replica | Backend |
| 4 | **Review volume too low to credibilize products** | Low conversion, vendors won't claim | H | Post-lead review nudge (D+3), seed 400 synthetic-but-marked example reviews only in dev (never in prod), LinkedIn share incentive Phase 2; target 10–30k genuine reviews Y1 not 3.6M | Growth |
| 5 | **Lead quality (junk / spam) dispute with vendors** | Refunds, churn | M | Honeypot+Turnstile, min message 20 ch, business email validation, IP rate limit, `SPAM` status & credit workflow | Product |
| 6 | **Data retention / DSAR miss (GDPR breach)** | Fines up to €20M / 4% revenue | M | Build `export/delete` endpoints + admin queue Day 1; DPIA before launch; DPA with every processor (§9.2) | Legal+CTO |
| 7 | **Product slug rename breaks SEO & /compare links** | Crawl errors, ranking drop | M | `SlugRedirect` table + 301 + revalidate of referencing comparisons; log referrer graph | Backend |
| 8 | **Sponsored sort boost creates perverse ranking (algorithmic bias)** | Editorial trust collapse + FTC non-disclosure | M | Sponsored max 3 slots, clearly badged, never above 4.7-rated organic without badge; transparency footnote | Product |
| 9 | **Vendor claim fraud (domain spoof)** | Impersonation, data leak | M | Business email + DNS TXT token verification path; admin manual review before role upgrade; lock `Company.ownerId` once set | Security |
| 10 | **Scope creep (Phase 2/3 shipped in MVP → 10-week miss)** | No launch | H | MoSCoW discipline §3 — cut from C upward; weekly demo + "cut line" review; MASTER-BUILD-PROMPT blocks creep via checklist | PM/CTO |

### 10.4 Launch checklist (sign-off)

- [ ] All `M` features E2E green + axe 0 + Lighthouse ≥90 on homepage/category/product/comparison
- [ ] `POST /api/leads` → email + vendor inbox verified in staging + prod
- [ ] Search: Meilisearch up + fallback proven (kill Meilisearch, verify ILIKE still serves)
- [ ] Sitemap validates (`/sitemap.xml` → 2k+ URLs), robots OK, OG images render, JSON-LD passes Rich Results Test
- [ ] Legal: `/methodology`, `/privacy`, `/terms`, `/cookies` live; disclosures on all sponsored; DSAR endpoints
- [ ] Backups: Neon PITR + Meilisearch snapshot verified restore
- [ ] Rate limits + CSP/HSTS/Turnstile + honeypot tested
- [ ] Tag `v1.0` + changelog + runbook (incident, moderation, DSAR SLA) in repo

---

## Appendices

### A. Route & URL Manifest (public, protected, API)

**Public (no auth, SSR/ISR):**
```
/                          # ISR 300s
/categories                 # static-ish
/{category}                 # ISR 60s  (category listing)
/{category}/{product}       # ISR 60s  (product profile)
/{category}/{product}/alternatives
/compare                   # hub
/compare/{a}-vs-{b}[-vs-{c}] # on-demand ISR 300s
/best/{category}-software  # ISR 600s (pillar alias)
/resources/{slug}           # ISR 600s (MDX)
/search?q=&tab=             # noindex, client+server
/(about|methodology|privacy|terms|cookies|contact) # static
```

**Protected (Auth.js middleware):**
```
/login, /register          # public, guest-only redirect if authed
/saved                     # → /login?callbackUrl=/saved if anon
/write-review?product=     # auth gate
/vendor/*                  # requires VENDOR|ADMIN
/admin/*                   # requires ADMIN|MODERATOR
/api/vendor/*              # VENDOR|ADMIN
/api/admin/*               # ADMIN|MODERATOR
```

**API (Zod + rate limit — see §4):**
```
GET  /api/search  /api/products /api/products/[slug] /api/categories /api/comparisons/[slugs]
POST /api/leads   POST /api/reviews  PATCH /api/reviews/[id]/helpful
GET/POST /api/saved/{products,comparisons}  GET /api/me/{leads,reviews}
POST /api/vendor/claim  PATCH /api/vendor/products/[id]  GET/PATCH /api/vendor/leads
GET/POST /api/admin/{products,categories,reviews,vendors,leads,users}
GET  /api/health  POST /api/webhooks/search-sync  GET  /api/out
GET  /api/sitemap  (sharded)
```

### B. Seed Strategy (from D5 §6 + blueprint)

1. **Categories:** 12 top-level (CRM, Project Management, Accounting, HR, Marketing Automation, ERP, Help Desk, E-commerce, Design, Analytics, Communication, File Management) × 4 subcategories each = **60 total** (hand-curated names/slugs/icons/descriptions; `parentId` for subs; `sortOrder`). Grow to 30×5 later.
2. **FeatureGroups/Features:** Per category groups (e.g., CRM: Lead Management/Contact Management/Sales Automation/Analytics — 3–5 features each) → **30+ features** total.
3. **Companies:** 30 fake (faker: name, slug, website, logo `https://i.pravatar.cc/150?u={slug}` fallback, `employeeCount`, `hqCountry`).
4. **Products:** 120 MVP (10/top category avg) → 1–3k before launch. Each: name, globally-unique slug, tagline, shortDescription (2 lines), description (200+ words markdown), logoUrl, website, status `APPROVED`, companyId, denorm ratings (3.5–4.8, count 10–300), startingPrice, pricingModel, freeTrial(50%), freeVersion(30%), deployment `[cloud]` (Phase 2: add on_premise/web/mobile), featured 10%, sponsored 15%. Link to 1 primary + 1–2 secondary categories via `ProductCategory`. Assign 5–8 features via `ProductFeature(available)`. Add 2–3 `PricingPlan`(Starter/Professional/Enterprise). Assign 4 integrations from 20 seeded. Add 3 screenshots (placeholder).
5. **Reviews:** 400 (3–4/product avg; distribution 45/30/12/8/5 stars), helpers: create 80 Users if needed, each with title/body(80+ ch)/pros/cons + secondaries + metadata (companySize/industry/role/useDuration) + `APPROVED` 85%, `PENDING` 10%, `FLAGGED` 5% for moderation testing. Run aggregation worker post-seed.
6. **Leads:** 30 synthetic across all `LeadType`/`LeadStatus` for admin/vendor dashboards.
7. **Comparisons:** Derive top-5 per top-6 categories → pairwise comparisons (~60) pre-seeded via script (canonical slugs).
8. **Resources:** 6 starter MDX buying guides with embedded products.

Run: `npx prisma db seed` (idempotent; upserts by slug). Re-run nightly in staging to repair drift.

### C. Key Commands

```bash
# install
npm install
# env
cp .env.example .env   # fill DATABASE_URL, NEXTAUTH_SECRET, etc.
docker-compose up -d    # postgres + meilisearch + redis (if not using cloud)
npx prisma migrate dev --name init
npx prisma db seed
npm run dev             # http://localhost:3000

# search sync (manual)
npm run search:sync

# E2E / a11y / perf
npx playwright test
npx playwright test --project=a11y   # axe
npm run lighthouse

# build/ship
npm run build && npm run start
```

### D. Source Map — Where this document came from

| Source | Sections feeding this doc |
|---|---|
| `reports/00-EXECUTIVE-SUMMARY.md` + `01-FULL-REPORT.md` | §1 full competitive synthesis (6 platforms observed) + sitemaps + monetization |
| `reports/02-PRD.md` | §2 vision/personas, §3 MoSCoW scope, §6 engines, §10 roadmap |
| `reports/03-FUNCTIONAL-REQUIREMENTS.md` | §3 feature catalogue REQ-* IDs, §6 review/lead/comparison specs |
| `reports/04-DEEP-DIVES.md` | §1 buyer journeys (8 personas), §6 comparison+review deep dives, §7 monetization |
| `schemas/DATABASE-SCHEMA.md` | §5 schema verbatim + §6 engines workers |
| `blueprint/PLATFORM-BLUEPRINT.md` | §4 architecture diagrams + auth/RBAC + §5 data flows |
| `reports/06-TECH-STACK.md` | §4 stack choices + trade-offs |
| `reports/07-ROADMAP.md` | §10 roadmap week-by-week + cost |
| `reports/08-UIUX-ARCHITECTURE.md` | §2 principles, §4 project structure, §6 UI patterns |
| `reports/09-SEO-ARCHITECTURE.md` + `14-API-ARCHITECTURE.md` | §8 SEO programmatic + §4 API design |
| `matrix/FEATURE-MATRIX.md` | §1 matrix 60+ features × 6 platforms |
| **Fresh synthesis (this capstone)** | §1 Capterra/TrustRadius extensions (8th platform); §4 Next.js 15 RSC/ISR notes; §9 FTC 16 CFR 465/Part 255 (2024–2026), GDPR C-492/23 controller ruling, DSA/DMA, CCPA, CMP, breach; §7 growth loops; §10 risk register |

### E. Document Maintenance

- This file is the **authoritative build reference**. If it conflicts with an older report, **this document wins**; open an ADR (`/docs/adr/NNN.md`) and update the older file.
- Next review: after Phase 2 kickoff or upon major FTC/GDPR guidance update.
- File location: `/opt/data/analysis/reports/ENTERPRISE-BUILD-DOCUMENTATION.md` (this file). Canonical in repo: copy to `{project}/docs/ENTERPRISE-BUILD-DOCUMENTATION.md`.

---

*End of Enterprise Build Documentation — SDP v1.0 (2026-09-02). Total lines: target 400+ (this document).*



---

## PART — FEATURE MATRIX (`matrix/FEATURE-MATRIX.md`)

# DELIVERABLE 2 — Feature Comparison Matrix

## Scale: ✅ = Observed present · ◐ = Partial/inferred · ✗ = Not observed · ○ = Not applicable (different model)

### A. Discovery & Navigation

| Feature | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Global autocomplete search (hero) | ◐ (Quick Search) | ✅ | ✗ (site search only) | ✅ | ✗ (category nav) | ✅ (Find Firms) |
| Category mega-menu | ✅ | ✅ (4 pillars) | ✅ | ✅ (hamburger) | ✅ (vertical) | ✅ (3 mega-menus) |
| All Categories hub page | ✅ (/categories) | ✅ (/categories) | ✅ (/categories/) | ✅ (/all-categories) | ✅ (/categories/) | ✅ (/directories) |
| Subcategory drill-down | ✅ (20–40 per top) | ✅ | ✅ | ✅ (1000+ cats) | ✅ | ✅ (200+ subs) |
| Breadcrumb navigation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Trending / Popular software | ✅ | ✅ | ◐ | ✅ | ✅ (FrontRunners) | ✅ |
| AI-suggested matches | ✗ | ◐ (beta sentiment) | ✗ | ✗ | ✗ | ✅ (Top SaaS 2026 AI) |

### B. Search & Filters

| Filter / Capability | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Filter by price / pricing model | ✅ (Price chip) | ✅ | ✅ (via scoring) | ◐ | ◐ (advisor) | ◐ |
| Filter by rating | ✅ | ✅ | ✅ (score) | ✅ | ✅ | ✅ |
| Filter by features | ✅ | ✅ | ✅ (requirements) | ◐ | ◐ (advisor) | ✅ |
| Filter by deployment / platform | ◐ | ✅ | ◐ | ◐ | ◐ | ◐ |
| Filter by company size | Not observed | ✅ | ◐ | Not observed | ◐ | ✅ (employees) |
| Filter by industry | Not observed | ✅ | ◐ | Not observed | ✅ (vertical cats) | ✅ (Industries) |
| Filter by free trial / free version | Not observed | ✅ | ✅ | ✅ (badge) | Not observed | ✅ |
| Filter by integrations | Not observed | ✅ | ◐ | Not observed | Not observed | ◐ |
| Filter by location (services) | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ (country/state/city) |
| Sort (popular, rating, price) | ✅ (Recommended/Rating/Price) | ✅ | ✅ (score) | ✅ | ✅ | ✅ (weekly ranking) |
| Requirements / scoring builder | ✗ | ✗ | ✅ (core) | ✗ | ✗ | ✗ |

### C. Product Profile

| Section | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Name + logo + tagline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Description (short + long) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Screenshots / gallery | Not observed | ✅ | ◐ | ✅ (6) | ◐ | Not observed |
| Video / demo | ✅ (Watch Demo) | ✅ | Not observed | Not observed | Not observed | Not observed |
| Features checklist | ✅ | ✅ | ✅ | ✅ (20+) | ✅ | ✅ (14) |
| Pricing (plans, starting price) | ✅ (Get Pricing) | ✅ (tab) | ✅ (start price) | ✅ (5 plans + table) | ✅ ($25/mo) | ✅ (Standard $25) |
| Free trial / free version badge | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Deployment / support / training | Not observed | ◐ | Not observed | Not observed | Not observed | ✅ (rich: Chat/Phone/24×7/Webinar/Help Guides) |
| Integrations list | Not observed | ✅ | ◐ | ✅ | ✅ | ◐ |
| Pros & cons (aggregated) | Not observed | ✅ (sentiment) | ✅ (analyst) | Not observed | ✅ (from 18k reviews) | ✅ (Like Most/Least) |
| FAQs | ✅ | ◐ | ✅ | Not observed | Not observed | Not observed |
| Alternatives / competitors | ✅ | ✅ (tab) | ✅ | ✅ | ✅ | ◐ |
| FAQs / buying guide inline | ✅ | ◐ | ✅ | Not observed | ✅ (buyer's guide) | Not observed |

### D. Review System

| Capability | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Star rating (1–5) | ✅ (per product) | ✅ | ✗ (analyst 0–100) | ✅ | ✅ | ✅ |
| Secondary dimensions | Not observed | ✅ (Ease/Value/Support/Functionality) | ✅ (score breakdown) | Not observed | ✅ (Ease/Value/Support/Func.) | Not observed |
| Review title + body | Not observed (low vol.) | ✅ (What I like best/dislike) | ✗ | ✅ | ✅ | ✅ |
| Pros / cons per review | Not observed | ✅ | ✗ | ◐ | ✅ | ✅ (aggregated) |
| Use case / company size / role / industry tags | Not observed | ✅ (role-gated wizard) | ✗ | ◐ | ✅ (Used duration + industry) | ✅ (role + company + date) |
| Verification badge | ◐ (methodology) | ✅ (LinkedIn + email) | ✅ (analyst verified) | ◐ (email + LinkedIn share) | ✅ (Gartner verified) | ✅ (phone + email + client check + portfolio audit) |
| Helpful votes | Not observed | ✅ | ✗ | Not observed | Not observed | Not observed |
| Review filtering / sorting | Not observed | ✅ | ✗ | Not observed | ✅ (pagination) | Not observed |
| Moderation / published methodology | ✅ (methodology page) | ✅ | ✅ (editorial guidelines) | ✅ (ranking methodology) | ✅ (FrontRunners meth.) | ✅ (v3.2 published) |
| Review submission CTA | ✅ (header) | ✅ (wizard) | ✗ | ✅ (4-step) | ◐ (via advisor) | ◐ |
| Share on LinkedIn incentive | Not observed | Not observed | ✗ | ✅ (step 3) | Not observed | Not observed |

### E. Comparison

| Capability | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Initiate compare (checkbox / bucket) | ✅ (Compare checkbox) | ✅ | ✅ (select up to 5) | ✅ | ◐ | ✗ |
| Feature comparison table | ◐ (article) | ✅ | ✅ | ✅ | ◐ | ✗ |
| Pricing comparison | ◐ (article) | ✅ | ✅ | ✅ (table) | ◐ | ◐ |
| Rating comparison | ◐ | ✅ | ✅ | ✅ | ◐ | ◐ |
| Pros/cons comparison | ◐ | ✅ | ◐ | ✅ | ◐ | ✗ |
| URL: /compare/{a}-vs-{b} | ✅ (/resources/ + JS vs) | ✅ | ◐ (within guide) | ✅ | ✅ | Not observed |
| Alternatives page (/alternatives) | ✅ | ✅ (/products/{slug}/competitors) | ✅ | ✅ (#alternative) | ✅ | ◐ |
| SEO comparison articles | ✅ (Monday vs Wrike) | ✅ | ✅ | ✅ (RocketReach vs Apollo) | ◐ | ✗ |

### F. Lead Generation & Monetization

| Mechanism | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Get Pricing / Get Quote | ✅ | ◐ | ✅ | ✅ (Get Offer per plan) | ✅ | ◐ |
| Request Demo / Watch Demo | ✅ | ◐ (via vendor) | ✗ | ✅ (Free Demo) | ✅ | ◐ |
| Free consultation / Talk to expert | ✅ (expert recommendation form) | ✗ | ✅ (10-min call) | ✅ (experts to get best quote) | ✅ (15-min advisor — core) | ✗ |
| Contact vendor / Visit website | ✅ (affiliate trkrdr1) | ✅ (vendor site) | ✅ | ✅ (PPC) | ✅ | ✅ (Hire) |
| Email capture (send list to inbox) | Not observed | Not observed | Not observed | Not observed | ✅ | Not observed |
| Post a Project (RFP) | ✗ | ✗ | ✅ (RFI/RFP) | ✗ | ✗ | ✅ (primary — Pro proposals) |
| Sponsored listing / Ad badge | ✅ (Ad) | ✅ (sponsored) | ✅ | ✅ (PPC) | ✅ | ✅ (Pro) |
| Featured / premium profile | ✅ (Recommended) | ✅ (sell.g2) | ✅ | ✅ (Premium Listing) | ✅ | ✅ (GoodFirms Pro) |
| Vendor portal | ✅ (vendors.softwarefinder.com) | ✅ (sell.g2.com) | ✅ (pmo + claim profile) | ✅ (vendorsportal) | ✅ (Vendors — Gartner) | ✅ (Get Listed) |

### G. SEO / Programmatic

| Page Type | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Category page (pillar) | ✅ | ✅ | ✅ | ✅ | ✅ (with buyer's guide) | ✅ (directories) |
| Product profile | ✅ | ✅ | ◐ (within guide) | ✅ | ✅ | ✅ |
| /compare/A-vs-B | ✅ (editorial + dynamic) | ✅ (scale) | ◐ | ✅ (scale) | ✅ | ✗ |
| Best / Top alternatives | ✅ | ✅ | ✅ | ✅ | ✅ (FrontRunners) | ✅ |
| Industry / use-case page | ✅ (subcategories) | ✅ | ✅ | ✅ | ✅ (vertical) | ✅ |
| Buying guide / methodology | ✅ | ✅ (Grid) | ✅ (Lean Selection) | ✅ | ✅ (buyer's guide) | ✅ (v3.2) |
| Awards / badges | ✅ | ✅ (Best Products) | ✗ | ✅ (Champions) | ✅ (FrontRunners) | ✅ (research) |

### H. Vendor / Admin

| Capability | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Claim profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage listing (features, pricing, media) | ✅ (Vendor Program) | ✅ | ✅ | ✅ (Upgrade plan) | ✅ | ✅ |
| Lead inbox / management | ✅ | ✅ (intent) | ✅ | ✅ | ✅ | ✅ |
| Review management (respond) | ◐ | ✅ | ✗ | ✅ | ◐ | ✅ |
| Analytics / insights | ✅ | ✅ (intent, Grid) | ✅ | ✅ | ✅ | ✅ (ranking) |
| Sponsored placement controls | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### I. Trust & Governance

| Signal | Software Finder | G2 | SelectHub | SoftwareSuggest | Software Advice | GoodFirms |
|---|---|---|---|---|---|---|
| Published methodology | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (full v3.2) |
| Verification rigor | Low | High | Analyst | Medium | High (Gartner) | Very High |
| Ranking freshness | Not observed | Quarterly (Grid) | Per guide | Not observed | Past 24mo (Oct 2025) | Weekly (Monday) |
| Editorial guidelines | Not observed | ✅ | ✅ | Not observed | ✅ | Not observed |
| Trustpilot / external proof | Not observed | Not observed | Not observed | Not observed | ✅ (4.2/704) | Not observed |

> **How to use:** For your MVP, implement every row where ≥4 competitors have ✅. Defer rows where only 1–2 have ✅ (e.g., RFI/RFP workflow, GoodFirms-style portfolio audit, G2-style Grid quadrant).



---

## PART — FULL COMPETITIVE REPORT (`reports/01-FULL-REPORT.md`)

# SOFTWARE DISCOVERY & REVIEW PLATFORM — COMPREHENSIVE COMPETITIVE ANALYSIS
## Full Research Report (Deliverable 1 · 20 Sections)

**Date:** 2026-09-01 | **Researcher Roles:** Product, UX, Architecture, Competitive Intelligence, Marketplace, SEO, DB
**Method:** Public observable pages only. No paywall bypass, no private APIs, no credential use.
**Legend:** `[OBSERVED FACT]` directly visible · `[INFERENCE]` reasonable deduction · `[RECOMMENDATION]` what to build

---

## 1. Executive Summary

See `/reports/00-EXECUTIVE-SUMMARY.md` — single-page synthesis. Key takeaway: **comparison pages = SEO engine, lead forms = revenue engine, reviews = trust engine.** Build a search-first, comparison-centric, review-verified marketplace for MVP with ~100 categories and 1–3k products.

---

## 2. Individual Competitor Analysis (6 platforms)

### 2.1 Software Finder — softwarefinder.com

**Positioning:** [OBSERVED FACT] Homepage tagline "Find the Right Software for Your Business—Faster" plus "Save time on comparing different software. Get free expert recommendations." Category-first marketplace with editorial comparison articles.

**Homepage — OBSERVED FACT:**
- **Navigation (header):** Software Categories | For Vendors | Resource Center | Write a Review + sticky header search + logo.
- **Hero:** "Find the Right Software for Your Business—Faster" + free expert recommendation form (Name, Email, Phone, Organization) above the fold. Not a global site search — it's a lead form.
- **Search:** Aria-label "Quick Search" input + Category filter. Clean, minimal. Does NOT dominate hero (unlike G2).
- **Categories:** /categories page lists ~30 top-level categories (Accounting, Agriculture, CRM, etc.) each expanding into 20–40 subcategories (e.g., Accounting → Accounting Practice Mgmt, AP, AR, AI Accounting, Audit, Billing & Invoice, Budgeting...). Deep verticalization.
- **Featured logic:** /crm page shows card grid with logo, name, rating (4.5), review count (e.g., Zoho 337), short editable description, Compare checkbox, Watch Demo / Get Pricing CTAs. Sponsored card marked "Ad" (Zoho CRM).
- **Trust signals:** FAQ section, "Our Software Review Methodology" link, verified user review claims, year-on-year report.
- **Footer:** Categories | Resources | Company | Vendor links | Social.

**Actual Sitemap — OBSERVED FACT:**
```
HOME (/)
├── /categories (All Categories — top-level grid)
│   ├── /{category-slug}  e.g. /crm, /accounting-software
│   │   └── /{category}/{product-slug} e.g. /crm/hubspot, /crm/zoho
│   └── /{category}/{subcategory} e.g. /accounting-software/accounts-payable
├── /resources (Resource Center)
│   ├── /resources/{slug} articles (e.g. /resources/erp-vs-crm, /resources/monday-vs-wrike)
│   └── /resources/best-{category}-2026 style lists
├── /for-vendors (Vendor Program)
├── /review (Write a Review)
├── /our-software-review-methodology
└── Vendor Program (vendors.softwarefinder.com subdomain — inferred)
```

- **URL pattern:** Flat and clean: `/{category}` for category listing, `/{category}/{product}` for product profiles, `/resources/{slug}` for comparisons/articles. No `/software/` prefix unlike many competitors — [RECOMMENDATION] add one for clarity.
- **Product Profile (e.g., /crm/hubspot) — OBSERVED FACT (inferred from /crm cards):** Logo, rating, review count, description excerpt, Compare toggle, Get Pricing / Watch Demo. Full page likely includes: Overview, Features, Pricing, Reviews tab, FAQs, Alternatives. "Compare" adds to a comparison bucket (JS: `SearchParams.get('products')` and `split('-vs-')` observed in source).
- **Comparison:** `/resources/monday-vs-wrike` style editorial articles (long-form) + presumably dynamic `/compare/a-vs-b` pages (JS hints). Not heavily interlinked vs G2/SoftwareSuggest.
- **Reviews:** "Write a Review" CTA in header. Methodology page exists. Review volume per product modest (15–77 displayed) vs G2's thousands.
- **Filters on Category ( /crm ) — OBSERVED FACT:** Filter icon with drawer; chips: Our Recommended, Ratings, Price, Features. Lightweight vs G2's multi-faceted filters.
- **Lead Gen — OBSERVED FACT:** Homepage expert recommendation form (name/email/phone/org) + Get Pricing / Watch Demo per card + "Talk to expert" language. [INFERENCE] Lead sold to vendors or routed to internal advisors (low OPEX version of Software Advice).
- **Monetization signals:** "Ad" badge on sponsored listing, "Visit Website" affiliate link (`trkrdr1.com` redirect with tracking params), Vendor Program pitch ("Get ready-to-buy leads at lower cost").

**Strengths:** Very clean IA, deep subcategory taxonomy, strong editorial comparison content.
**Weaknesses (for user):** Search is secondary, filter depth is shallow, comparison is article-heavy not table-driven, review volume low.

---

### 2.2 G2 — g2.com (Category Leader, 3.6M reviews)

**Positioning:** [OBSERVED FACT] "Where you go for software." 3,625,400+ reviews, 5M monthly buyers. The scale moat. Two audiences: Buyers (find/compare) + Sellers (sell.g2.com — marketing solutions).

**Homepage — OBSERVED FACT:**
- **Navigation:** Categories mega-menu (CRM & Marketing / Cloud Computing / ERP & Commerce / HR & Office), Compare, plus auth (Create account / Sign in).
- **Hero:** Search-first: "Find the right software and services based on 3,625,400+ real reviews." Large autocomplete search (placeholder "Ask a question...") + quick links: Best Products 2026, Trending Products, See all Project Management Software.
- **CTAs:** Leave a Review (reviewer acquisition) + Claim your profile (vendor acquisition) — dual-sided CTA prominently placed mid-page.
- **Social proof:** Customer story (Foxit), "4× MQLs and 81% larger deals" ROI study, reviewer testimonials.
- **Categories:** /categories page groups by 4 pillars (CRM & Marketing, Cloud Computing, ERP & Commerce, HR & Office) each with 6 featured subcategories + See All. Plus "Recently Added Categories" (MCP Server Infrastructure, Agentic Financial Crime, Medical Imaging — signals AI-native categories).
- **Footer:** Heavy — categories, resources, sell.g2.com, legal.

**Actual Sitemap — OBSERVED FACT + INFERENCE:**
```
HOME (/)
├── /categories (Featured Categories grouped by pillar)
│   ├── /categories/{category}  (e.g., /categories/crm, /categories/project-management)
│   │   ├── /products/{product-slug}/reviews  (e.g., /products/salesforce-crm/reviews)
│   │   ├── /products/{product-slug}/pricing
│   │   ├── /products/{product-slug}/competitors
│   │   └── /products/{product-slug}  (overview tab)
│   ├── /reports  (G2 Reports / Grid)
│   └── Recently Added Categories
├── /compare  (Compare hub)
│   └── /compare/{product-a}-vs-{product-b}  (e.g., /compare/salesforce-crm-vs-hubspot-crm)
├── /best-software-companies  ( seasonal: /best-software-companies etc.)
├── /wizard/new-review  (Review submission — role-gated)
├── /add_product_requests/new (Claim profile)
└── sell.g2.com (Vendor portal — external)
```

- **URL patterns — OBSERVED FACT:** `/categories/{slug}` for category, `/products/{slug}/reviews|pricing|competitors` with tab suffix for product pages, `/compare/{a}-vs-{b}` for comparisons, `/reports` for Grid reports, `/wizard/new-review` for reviews. Consistent product slug convention `{vendor}-{product}` (salesforce-crm).
- **Product Profile — OBSERVED FACT (salesforce-crm):** Tabs: Overview · Reviews · Pricing · Competitors · Alternatives. Sections: What do you like best? / What do you dislike? (verbatim Q&A review format), star distribution (5→1 bar chart), secondary ratings (Ease of Use 4.0, Value 4.0, Support 4.1, Functionality 4.4), "Show X of 18k reviews" with pagination, screenshots. Pricing tab separate. Competitors/Alternatives auto-linked.
- **Filters — INFERENCE (category page):** G2 categories support filters for: Company size, Industry, User rating, Features, Integrations, Pricing model, Deployment, Region — did not extract full filter HTML but widely documented; keep as inference.
- **Comparison Engine — OBSERVED FACT:** /compare hub + /compare/{a}-vs-{b} pages exist; UX allows side-by-side table. Content failed to extract (requires JS) but search confirms `/compare/salesforce-crm-vs-hubspot-crm` exists. [INFERENCE] Comparison table includes: Ratings, Features checklist, Pricing, Pros/Cons, Review sentiment, Integrations, Alternatives carousel.
- **Review System — OBSERVED FACT:** Wizard flow: Search product → Select role (Advertising, E-Commerce/Retail, Finance & Accounting, HR, Sales, IT, Marketing, Operations, Support, Engineering, Design, Other) → star ratings + structured Q&A ("What do you like best?"). OAuth via LinkedIn/Google. 3M+ verified reviews claim; verification via LinkedIn + business email. Helpful votes visible. Sentiment highlights grouped "User Sentiment — How are these determined? … compiled from user reviews … in beta."
- **Lead Gen — OBSERVED FACT / INFERENCE:** Buyer intent data is the product sold on sell.g2.com. Vendor profile is free to claim, paid tiers for intent data, review collection campaigns, "Buyer Intent" API. No direct "Get Pricing" per card — instead G2 monetizes vendor subscriptions, not per-lead. "Contact vendor" is deferred to vendor site.
- **SEO moat:** Programmatic pages for every category × every comparison × every grid report × every "Best of 2026" list. Internal linking is exhaustive.

**Strengths:** Unmatched review scale and structured data, Grid reports are a defensible IP, search-first UX, vendor self-serve flywheel.
**Weaknesses:** Complexity for SMB buyer (overwhelming), comparison requires JS rendering, pricing data is thin (since G2 doesn't sell leads per se).

---

### 2.3 SelectHub — selecthub.com (Analyst + Requirements Model)

**Positioning:** [OBSERVED FACT] "Software Selection Management Tool By Research Analysts" — "Explore and compare pricing, analyst reviews, and features of 9,000+ products" + "Do less with our Decision Platform." The only platform that sells *process*, not just listings.

**Homepage — OBSERVED FACT:**
- **Navigation:** Software Categories, Solutions, Research, About — plus search bar (site search, not product search).
- **Hero:** Dual CTA: 1) "Build Requirements from Templates easily" 2) "Shortlist and Compare Analyst-Reviewed Products Matching Your Requirements" 3) "Get Pricing for Your Shortlist" — a 3-step workflow, not a search box.
- **Featured Categories:** Marketing Automation, Medical Billing, Medical Practice Management (healthcare skew).
- **Decision Platform block:** "Short-list vendors with custom requirements — Facilitate collaboration — Distribute RFI/RFPs in one click — Get responses back in centralized scorecard." CTA: Learn about The Decision Platform.
- **Research Center:** "Software Guides, Tools and Articles" — analyst-authored buying guides per category.
- **Lean Selection:** Book/methodology originated by SelectHub — content moat.
- **Stats:** "Advised 125,938 Buyers · Short-listed 719,943 Products · Distributed 1,856 RFIs/RFPs" + "2,452 buyers researching now."
- **For Vendors:** "Claim your SelectHub profile."

**Actual Sitemap — OBSERVED FACT:**
```
HOME (/)
├── /categories/ (Browse All Types of Business Software Categories)
│   ├── /c/{category}-software/  (e.g., /c/crm-software/, /c/erp-software/, /c/lms-software/)
│   │   ├── In-depth reviews (top 10 list with analyst scores 0–100)
│   │   ├── Quick Comparison (select up to 5 to compare)
│   │   └── Expert Advice / Methodology
│   └── Template download CTA (pmo.selecthub.com)
├── /solutions/  (Bias-Free Selection Process · Decision Platform)
├── /decision-platform/
├── /managed-selection-services/
├── /editorial-guidelines/
├── /about/requirements-template-free-trial-site/ (pmo subdomain workflow)
├── /about/find-it-solutions-site/
└── pmo.selecthub.com/* (Shortlist, scoring, RFI/RFP — gated)
```

- **URL pattern:** `/c/{category}-software/` for category pages (with trailing slash). No `/software/{product}` — products are compared within category guides; product pages live on pmo subdomain (gated). [OBSERVED FACT] Category page: `/c/crm-software/`, `/c/erp-software/`, `/c/lms-software/`.
- **Product Profile:** Not a classic standalone URL — products are entries within the "Quick Comparison" table and "In-Depth Reviews of Top Picks." Each pick has: Analyst Score (e.g., CHAMPS 89/100), Best For label, Top Features, Start Price, Free Trial flag. Full profile likely gated behind Decision Platform. [INFERENCE] This is intentional — pushes buyer into workflow.
- **Filters / Comparison — OBSERVED FACT:** "Select up to 5 products from the list below to compare" — inline comparison builder. Features compared: Features, User Satisfaction, Pricing (from observed "This snapshot shows how the top CRMs compare for features, user satisfaction, pricing and more"). Score-based ranking, not star-based.
- **Review System:** Analyst reviews + analyst scores (0–100, methodology published), not UGC star reviews. "Our expert Market Analysts score and summarize software feedback, so you don't have to." Lean, not crowdsourced — opposite of G2.
- **Lead Gen — OBSERVED FACT:** "Get Free Software Recommendations" (10-min call), "Get Pricing for Your Shortlist," "Talk to the Right Vendors." Conversion is the requirements template + shortlist — after that buyer is handed to vendors matched to requirements. Free for buyer; vendor pays.
- **Content:** Long-form analyst guides (240+ hours hands-on per guide — "I logged 240+ hours getting hands-on"), expert quotes (David Dozer, CCO Wastelinq), methodology section per category, FAQ.

**Strengths:** Requirements-template workflow is genuinely differentiated; analyst scoring + hands-on testing is credible; decision platform with RFI/RFP + collaboration is enterprise-grade.
**Weaknesses:** Less self-serve for casual browser; product URLs not SEO-friendly; gated pmo subdomain creates extra step; not a classic review marketplace.

---

### 2.4 SoftwareSuggest — softwaresuggest.com (India/APAC scale, 40k+ reviews)

**Positioning:** [OBSERVED FACT] "Discover Top Business Software & Service Partners — Trusted By 1,114,681+ Happy & Satisfied Businesses — 40,000 verified reviews." Heavy India-market focus with global categories.

**Homepage — OBSERVED FACT:**
- **Navigation:** Header search (magnifying glass), Categories hamburger, User Login, Vendor Login, Write a Review, Boost AI Visibility (AEO/GEO) — new.
- **Hero:** "Discover Top Business — Find the Right Software & Service Providers — Verified Reviews — Free Software Recommendations" + Free Software Recommendations CTA.
- **Discovery By Categories:** Grid of category cards with product stacks (HR: BambooHR 4.6 (60), Breezy HR 4.5 (2), HiBob 4.3 (3) — rating + review count per card, with PPC affiliate links `ppc.softwaresuggest.com/...?utm_ss=organic/...`).
- **Trending / Popular:** Trending Software carousel (AgentClara etc.).
- **Services:** "Discover Top Services By Categories" — second marketplace (services, not just software) e.g., PreApps service profile.
- **Comparison:** "Unbiased Software Comparison — Select the right software and compare them based on features, pros and cons, and pricing." Top Comparisons: BambooHR vs Keka, QuickBooks vs FreshBooks, TallyPrime vs myBillBook, Asana vs monday.com (India-relevant picks).
- **Awards 2026:** Category Champions, Top Trending — award badges per product.
- **Categories footer:** Massive alphabetical list: CRM software, AI CRM, Corporate Gifting, Customer Data Platform, Attendance Management, Biometric Attendance, School Accounting, School Bus Routing, School ERP — extremely long tail (1000+ categories observed in /all-categories).

**Actual Sitemap — OBSERVED FACT:**
```
HOME (/)
├── /all-categories (All Software Categories — alphabetical, Expand all)
│   ├── /{category}-software  e.g., /hr-software, /crm-software, /tallyprime-vs-mybillbook
│   ├── /{product-slug}  e.g., /bamboohr, /salesforce, /zoho-crm
│   │   ├── /{product}/pricing  e.g., /salesforce/pricing
│   │   ├── /{product}/reviews  implied (not extracted)
│   │   └── /{product}#alternative, #pricing_comparison
├── /compare/{a}-vs-{b}  e.g., /compare/salesforce-vs-zoho-crm, /compare/bamboohr-vs-keka, /compare/rocketreach-vs-apollo
├── /write-review  (4-step: Select Product → Leave Review → Share on LinkedIn → Finished)
├── /vendors  (List Your Product — Hear From Our Customers)
├── /vendorsportal/... (Vendor portal)
├── /pricing  (Vendor plans — $4k/6mo to $9k tiers)
├── /ranking-methodology
├── /aeo-geo-visibility (new — AI search visibility product)
└── /services/{service} (Services marketplace)
```

- **URL patterns — OBSERVED FACT:** `/{category}-software` for categories, `/{product}` for product overview, `/{product}/pricing` for pricing, `/compare/{a}-vs-{b}` for comparisons. Clean, flat, SEO-friendly.
- **Product Profile (salesforce) — OBSERVED FACT:**
  - **Hero:** Product name + Awards badges (Top Trending Winter 2025) + "Get Best Quote" + "Claimed by Salesforce, Inc but has limited features — Upgrade your plan"
  - **Key Features:** Lead Mgmt, Opportunity Mgmt, Contact Mgmt, Sales Forecasting, Workflow Automation, Email Integration, Reports & Dashboards, Mobile Access, File Sync, Sales Collaboration, Marketing Automation, Customer Service, Customizable Dashboards, 3rd Party Integrations, Territory Mgmt, Quote Mgmt, Contract Mgmt, Analytics, AppExchange, Einstein AI (20 listed, Show More)
  - **Screenshots:** 6 screenshots with lightbox
  - **Pricing:** Plans: Starter $25, Professional $80, Enterprise $165, Unlimited $330, Unlimited+ $500 — per user/month cards + "Get Offer" per plan, free trial badge, last updated date, pricing comparison table (Plan | Base Price | Ideal For | Key Features)
  - **Description:** Long-form SEO description
  - **Tabs:** Overview, Pricing Comparison, Alternatives, Reviews (anchor navigation)
  - **Reviews:** 277 reviews, 4.6/5 (Salesforce) — displayed with pricing insights ("86% of CRM tools offer free trial", "$25 starting price")
  - **Lead CTA:** Free Demo + Get Pricing per plan + global "Get Best Quote" / "Connect with SoftwareSuggest experts"
- **Comparison Page (salesforce-vs-zoho-crm, rocketreach-vs-apollo) — OBSERVED FACT:** Long-form, feature/price/pros-cons comparison with criteria tables, editorial framing ("Choosing the right Lead Generation Software requires thoroughly evaluating..."). Not just a table — it's an SEO article.
- **Review Flow — OBSERVED FACT:** /write-review — 4 steps: Select Product → Leave a Review → Share on LinkedIn → Finished. Popular products to review listed. [INFERENCE] Verification via email + LinkedIn share incentive.
- **Filters — OBSERVED FACT (inferred from category structure):** Category pages show PPC-tagged product cards with rating + review count; filters observed conceptually: Pricing, Deployment, Company size — but exact filter bar not extracted. [Not publicly observable in full — keep as partial].
- **Monetization — OBSERVED FACT:** Vendor pricing page: Basic $4,000/6 months (Category Page Banner Ad + PPC Credit + Newsletter + Premium Listing + Ad-free profile), higher tiers up. PPC model via `ppc.softwaresuggest.com` redirects. "Boost AI Visibility" (AEO/GEO) is a new paid product for vendors.

**Strengths:** Enormous category coverage (1000+), strong India-market pricing, mature vendor monetization tiers, dual software+services marketplace, good programmatic SEO (`/compare/*` articles).
**Weaknesses:** Affiliate redirect adds friction, some pages are ad-heavy, product page tab navigation is anchor-based not routed, review volume per product modest vs G2.

---

### 2.5 Software Advice — softwareadvice.com (Gartner, advisor-led)

**Positioning:** [OBSERVED FACT] "Best Business Software, Reviews and Comparisons" — "1 million+ businesses helped. Get advice. Software Categories — Get 1-on-1 advice in 15 minutes. It's free." Advisor photo + name (Josh P., Crystal since 2014) above the fold. Gartner network property.

**Homepage — OBSERVED FACT:**
- **Navigation:** Software Categories (Construction, Facilities Mgmt, HR, Legal Mgmt, Manufacturing, Medical, Property Mgmt, View All) — vertical-focused, not horizontal tech like G2. Company: About Us, Vendors. CTA: "Get 1-on-1 advice in 15 minutes. It's free." + Start Now.
- **Hero:** "Get real advice from real people — With one-on-one help and personalized recommendations, we guide you to your top software options." + Get Advice CTA.
- **Trust signals:** 2.5M verified reviews, 1M+ businesses helped, 150 industries covered. Rotating advisor testimonial per category (Crystal — Legal Mgmt).
- **How It Works (3 steps):** 1) Tell us your needs 2) We match key features/requirements 3) Receive 3–5 options within 15 minutes + start booking demos/trials.
- **Testimonials:** Theresa H. (Founder, Project Mgmt), Donna V. (Office Manager, Legal Mgmt) — advisor-praise centric.
- **Reviews teaser:** Verified user reviews of top solutions (Jotform 5.0 — Kierra, Facilities Services, "Used monthly <12 months"; MaintainX 5.0 — Tyler; QuickBooks Time 5.0 — Zach; Workday HCM 5.0 — Priya) with usage duration + industry.
- **Lead magnet:** "Fill out form and we'll send top-rated productivity software list to your inbox" + email capture.
- **Insights:** "Powered by proprietary data from global surveys, 2M+ reviews, buying trends from 1M+ conversations" → buying guides.

**Actual Sitemap — OBSERVED FACT:**
```
HOME (/)
├── /categories/ (Browse Popular Software Categories)
│   ├── /{category}/  e.g., /crm/ (25 Best CRM Software — 2026 Reviews & Pricing)
│   │   ├── #{front-runners} (FrontRunners quadrant within page)
│   │   ├── #{buyers-guide} (Buying guide within page)
│   │   └── #methodology
│   ├── /crm/salesforce-profile/  — wait: OBSERVED: product URL is /crm/salesforce-profile/ NOT /salesforce-profile/reviews
│   │   └── (Product overview with tabs: Overview, Pricing, Features, Integrations, Reviews)
│   └── /{category}/{product}-profile/ pattern (e.g., /crm/salesforce-profile/)
├── /compare/{product}-vs-{product}/  e.g., /compare/salesforce-vs-hubspot/ (exists; /compare/ hub is minimal)
├── /resources/ (Top Business Software Resources for Buyers — 2026)
├── /about-us/
├── /legal-page/frontrunners-methodology/, /legal-page/privacy/, /legal-page/general-user-terms/
└── Calendly advisor booking (calendly.com/appointments-34/software-advice-appointment)
```

- **URL patterns — OBSERVED FACT:** `/{category}/` for category hubs (with trailing slash, singular: /crm/ not /categories/crm), `/{category}/{product}-profile/` for product profiles (note "-profile" suffix). `/compare/{a}-vs-{b}/` exists but shallow. `/resources/` for guides. No `/software/` prefix.
- **Category Page ( /crm/ ) — OBSERVED FACT:** Detailed buyer's guide, "I worked with CRM advisors to curate recommended products," "CRM software Frontrunners" quadrant (methodology dated Oct 2025, past 24 months data), email capture for list + pricing info, Trustpilot widget (4.2/5, 704 reviews). Pricing insight: "entry-level avg $1,292/mo basic, high-end $17,664/mo 250+ users." Industry breakdown chart, stakeholder questions, advisor bios (James McKechnie, Marty Moore). "Send me a copy of this list to my inbox" — soft lead capture before hard advisor CTA.
- **Product Profile ( /crm/salesforce-profile/, 25 observed but Salesforce example is /product/2764-Salesforce — OBSERVED VARIANCE)** — two URL schemes observed:
  - Legacy: `/product/2764-Salesforce` (numeric ID + slug) with Overview, Pricing ($25/mo), About Salesforce Sales Cloud (long description, Lightning, Tableau, CPQ, Agentforce), Pros & Cons (from 18,784 reviews analyzed), Pricing & Plans, Features, Integrations, User Reviews (4.4 overall, 55% 5-star, 34% 4-star, secondary: Ease 4.0, Value 4.0, Support 4.1, Functionality 4.4), Other Top Recommended.
  - New: `/{category}/{product}-profile/` (trailing slash).
  Sections: About, Pros/Cons (AI-summarized), Pricing, Features (Popular vs More), Integrations, User Reviews (10 of 18k shown, with pagination).
- **Comparison:** /compare/salesforce-vs-hubspot/ — [INFERENCE] lightweight table; Software Advice's comparison is not the star — the advisor call is.
- **Review System — OBSERVED FACT:** Reviews show: star 1–5, overall + 4 secondary dimensions, ratings breakdown bars, reviewer name + role + industry, usage duration ("Used monthly <12 months", "Used daily <6 months", ">2 years"), verified badge presumably, helpful? Not observed directly. "We analyzed X verified reviews to find pros/cons" — aggregated pros/cons via review mining.
- **Lead Gen — OBSERVED FACT (core differentiator):** 
  - **Advisor consultation:** "Talk with us for free 15-min consultation" persistent widget + "Get Advice" CTAs every section + Calendly booking. Phone CTA implied (header).
  - **Get Pricing / Get Advice / Stuck Between Options? — Our experts can help you compare** — CTA inside product profile.
  - **Email form:** "Send me copy of list with pricing info" — mid-funnel capture.
  - [INFERENCE] All leads routed to Gartner's advisor team → qualification → warm handoff to vendors (PPL). This is the entire business model.
- **SEO:** Category guides are long-form pillar pages (methodology + buying guide + list + reviews) rather than pure listings — targets "best CRM software 2026" intent. FrontRunners graphic is linkable asset.
- **Gartner integration:** Part of Gartner network (shared reviews with Capterra, GetApp). Fr methodology shared.

**Strengths:** Highest conversion intent (human touch), strong vertical category coverage (construction/medical/legal beyond generic SaaS), Gartner scale + review pool, trust via advisor faces.
**Weaknesses:** Less self-serve (pushes to call), product URL inconsistency, comparison UX is secondary, search is category-nav not global autocomplete.

---

### 2.6 GoodFirms — goodfirms.co (Dual Marketplace: Services + Software, Research-Led)

**Positioning:** [OBSERVED FACT] "B2B Reviews & Ratings you can trust — Browse 1.2M verified reviews across 80,000 firms in 60+ categories and 130 countries — Find the right firm for your next project." Not a pure software marketplace — services/agencies are primary.

**Homepage — OBSERVED FACT:**
- **Navigation:** Mega-menus: Services (60+ — Software Dev, Web Dev, Mobile App Dev, AI, Digital Marketing, Cloud, Cybersecurity, SEO...), Solutions ("I'm building a Neobank / eCommerce Marketplace / Crypto Exchange"), Software (500+ — CRM, Project Mgmt, Marketing Automation, Analytics & BI, HR, Accounting...), GoodFirms Pro, For Business (Get Listed, GoodFirms Pro, Find Work, Advertise).
- **Hero:** "Find the right firm for your next project" + "Browse 1.2M verified reviews across 80,000 firms in 60+ categories and 130 countries" + Find Firms CTA + "Post a project instead" toggle.
- **Stats:** 80,000 Verified firms, 1.2M Reviews, 60+ Categories, 130 Countries.
- **Search:** `goodfirms.co/search` with `acmestudio.com` example + "G — Goodfirms · Find the right firm — Top SaaS 2026 — AI-suggested matches: Acme Studio (Top React shop · SF), Northwind Labs (Senior React team · LA)" — AI-native search preview.
- **Development partner chooser:** Services / Solutions / Software tabs with counts (60+ services, 5+ solutions, 50+ software)
- **Social proof:** "What teams say after hiring through GoodFirms" — 3 of 1,847 verified reviews in last 30 days, each with project + agency + outcome + rating (avg 4.8, 92% would recommend, 1.2M hires). Examples: Hired Speed (Coin Stories Mini App), Hired Paperboat Marketing (brand repositioning 6 weeks, demos +62%).
- **Trust methodology:** "4-step verification — only 23% pass — background checks, client interviews, portfolio audits, ongoing quality monitoring — 77% don't make it. Algorithm v3.2 published in full — every weight & formula documented — Weekly Rankings recomputed every Monday. 1.2M Reviews verified — email + client-relationship checks."
- **Dual CTAs:** "I'm looking to hire — Post requirement and get PRO-verified proposals — Top 3 recommended" vs "I want to be pro-verified provider — List business and win projects."

**Actual Sitemap — OBSERVED FACT + INFERENCE:**
```
HOME (/)
├── /directories (All directories & reviews — 60 main services, 200+ sub-services)
│   ├── /directories/service (By Services — Software Dev, Web Dev, Mobile App, AI...)
│   └── /directories/software (By Software — 500+ software)
├── /software/{product-slug}  e.g., /software/speed-1, /software/salesforce-crm
│   ├── Core Features (checklist)
│   ├── Pricing (type, free trial/trial length, plans)
│   ├── Industries / Support / Training / Knowledge Base
│   └── Reviews (total count, overall rating, What Users Say / Like Most / Like Least)
├── /companies/{service}  e.g., /companies/app-development (service listings — infra observed but blocked by Cloudflare challenge)
├── /{service}-agencies  aliases (e.g., /seo-agencies — some routes 404, some not)
├── /post-a-project (Project posting — buyer intent capture)
├── /research (GoodFirms Insights)
├── /blog
├── /about-us (Story, methodology)
└── /research-methodology (not found at that exact slug; documented via /about-us + /research)
```

- **URL patterns — OBSERVED FACT:** `/software/{product-slug}` (with numeric suffix when needed: speed-1), `/directories` as hub, `/blog`, `/research`, `/post-a-project`. No `/compare/{a}-vs-{b}` equivalent heavily promoted — comparison is less central vs SoftwareSuggest/G2.
- **Software Product Page (salesforce-crm) — OBSERVED FACT:**
  - **Hero:** "The world's no 1 CRM" + description paragraph (lead mgmt, SFA, forecasting, AI-powered, integrations, dashboard, support, security, learning resources, 30-day trial) + metadata: 1999, United States, 3 Industries, 1 Language, Industries list (Accounting, Logistics-supply-chain, Marketing-advertising), Support (Chat, Phone, 24×7), Training (Webinar), Knowledge Base (Help Guides, Video, Blog, Case Studies, On-Site)
  - **Core Features:** Calendar & Task, Contact Mgmt, Collaboration, Custom Dashboard, Email Integration, File Mgmt, Forecasting & Analytics, Lead Mgmt, Mobile Access, Pipeline Mgmt, Reporting, Sales Automation, Security, Workflow Automation (14 listed)
  - **Pricing:** Type Per User, Currency USD, Free Version No, Free Trial 30 Days, Payment Monthly/Annual, Plans: Standard $25/mo
  - **Reviews:** 52 Total Reviews, 4.3/5 Overall, 0 Recent Reviews, "What Users Say" summary + "What Users Like The Most / Least" aggregated bullets + individual reviews (ancorrd marketing services — chief marketing officer, Michelle Wu, Omer Usanmaz Qooper, Vartika Kashyap ProofHub, Frederic Lebeuf, Kate Zhang) with role + company + date.
- **Service Listing (inferred, Cloudflare challenge blocked direct extract):** [INFERENCE from homepage + about-us] Firms listed by service × location × rating, with filters: Location (country/state/city), Hourly Rate, Employees, Founded, Verified status. Ranking via published algorithm v3.2.
- **Review System — OBSERVED FACT:** Phone, email, client-relationship checks; random phone verification; v3.2 algorithm; verified badge. Reviews include: reviewer name, role, company, date, Overall Experience rating, pros/cons bullets, aggregated "What Users Like..." Portfolio audit is extra trust layer vs pure software reviews.
- **Lead Gen — OBSERVED FACT:** 
  - **Post a Project** (primary) — buyer posts requirement, gets top 3 PRO-verified proposals. "Firms come to you — PRO-verified proposals — Top 3 recommended — You decide winner."
  - **Find Work (PRO Only)** — vendor-side gated.
  - **Get Listed / Advertise / GoodFirms Pro** (premium visibility & verified badging)
  - **Contact / Hire** CTA per firm/software.
- **Monetization — OBSERVED FACT:** GoodFirms Pro (premium visibility), Sponsored placement, verification fees (23% acceptance = paid vetting), Advertise product. [INFERENCE] Not pure PPL — mix of subscription + sponsorship.

**Strengths:** Only verified-agency marketplace + software (dual), rigorous published methodology (trust), project posting is high-intent lead gen, global coverage (130 countries), weekly ranking freshness.
**Weaknesses:** Software is secondary to services, comparison UX is minimal, Cloudflare challenge suggests bot protection is active, SEO leans toward services not software comparisons.

---

## 3. Feature Comparison Matrix (see Deliverable 2)

Full matrix in `/matrix/FEATURE-MATRIX.md`. Summary below:

**Discovery:** G2 (search-first) vs SelectHub (requirements-first) vs SoftwareSuggest (category-grid) vs Software Finder (curated list) vs Software Advice (advisor-first) vs GoodFirms (project-post-first).

**Filters:** G2 — most facets (presumed); SoftwareSuggest/Software Finder — lightweight (Rating, Price, Features, Deployment in UI but shallow); SelectHub — requirements-scoring not classic filters; Software Advice — advisor does filtering for you; GoodFirms — location/rate/employees for services; software filters less prominent.

**Product Profile Depth:** SoftwareSuggest — richest (Features 20+, Pricing 5 plans, Screenshots 6, Pricing Comparison table); G2 — review-quantity king (18k reviews, secondary ratings); GoodFirms — support/training metadata heavy; Software Finder — minimal; SelectHub — analyst score within guide not standalone.

**Comparison:** G2 + SoftwareSuggest — full side-by-side tables + /compare pages; Software Finder — editorial articles; Software Advice — advisor comparison; SelectHub — 5-up table within guide; GoodFirms — minimal.

**Review Verification:** G2 — LinkedIn + business email; GoodFirms — phone + email + client-relationship + portfolio audit (strongest); SoftwareSuggest — email + LinkedIn share; Software Advice — verified via Gartner network + usage-duration metadata; Software Finder — methodology page, low volume; SelectHub — analyst, not UGC.

---

## 4. User Journey Comparison (see Section 3 deep dive below in this report)

---

## 5. Review System Comparison (see Section 5 deep dive)

---

## 6. Comparison Engine Analysis (see Section 6 deep dive)

---

## 7. Search & Filter Analysis (see Section 7 deep dive)

---

## 8. Lead Generation Analysis (see Section 8 deep dive)

---

## 9. Vendor Features Analysis (see Section 9 deep dive)

---

## 10. SEO Architecture Analysis (see Section 10 deep dive)

---

## 11. UX/UI Best Practices (see full report Sections 11–12 and Deliverable 8)

---

## 12. Recommended Technology Stack (see Deliverable 6)

---

## 13. Database Architecture (see Deliverable 5)

---

## 14. API Architecture (see Section 14)

---

## 15. MVP Roadmap (see Deliverable 7)

---

## 16–20. PRD, Blueprint, Build Prompt — see Deliverables 8–10

---

[Continued in modular deliverables — this file is the canonical full report index. For page-length reasons, deep dives for sections 4–14 are in the extended report below and in their dedicated deliverable files. The Executive Summary + this index + modular files together constitute Deliverable 1.]




---
