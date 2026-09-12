# MASTER BUILDER FILE — Software Discovery Platform
**Generated:** 2026-09-01
**Location:** `/opt/data/analysis/MASTER-BUILDER-FILE.md`
**Source folder:** `/opt/data/analysis/`

> This single file concatenates the entire build package for offline/air-gapped use. For normal use, keep the folder structure intact and copy-paste `prompts/MASTER-BUILD-PROMPT.md` into your coding agent.

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

## PART — UI/UX ARCHITECTURE (`reports/08-UIUX-ARCHITECTURE.md`)

# DELIVERABLE 8 — UI/UX Component Architecture

## Design Principles (Original — Not Copied)

1. **Search is the spine.** Every page has instant search; category nav is secondary. (G2 got this right; Software Advice buried it.)
2. **Comparison is one click.** Compare checkbox on every card + persistent bucket — never more than 2 taps to a comparison table.
3. **Trust before transaction.** Verified badges, methodology link, and review distribution are above the fold on product pages — not hidden in tabs.
4. **Progressive disclosure.** Overview → Features → Pricing → Reviews → Alternatives — tabs with anchor scroll, not modal soup.
5. **Lead capture is ambient, not aggressive.** Sticky sidebar + inline CTAs + no popups. Buyer chooses when.
6. **Data density > decoration.** Tables with ✓/✗, not marketing fluff. Inspired by SelectHub's scorecards and SoftwareSuggest's pricing tables.
7. **Accessibility is non-negotiable.** Keyboard, screen reader, contrast, focus rings — built in, not bolted on.

---

## Layout System

- **Container:** max-w-7xl, 16px gutters mobile → 24px desktop.
- **Grid:** 12-col. Category listings: filters 3-col | cards 9-col. Product: content 8-col | sticky sidebar 4-col. Comparison: equal columns per product + sticky header row.
- **Spacing:** 4px base (Tailwind default). Section padding: py-12 mobile, py-16 desktop.
- **Typography:** Inter or Geist Sans (body), Geist Mono for code/pricing. H1 36/40, H2 24/32, H3 18/28. Prose max-width 65ch for guides.
- **Color:** Light-first. Neutral (zinc) + single accent (violet or teal) for CTAs + sponsored badge (amber). No competitor palette copying.
- **Elevation:** Subtle borders (zinc-200) + shadow-sm for cards; no heavy shadows.

---

## Component Library (shadcn/ui + custom)

### Primitives (shadcn)
Button, Input, Select, Dialog, Sheet, Tabs, Accordion, Badge, Card, Dropdown, Toast, Skeleton, Separator, Breadcrumb, Pagination.

### Domain Components

| Component | Props | States | A11y |
|---|---|---|---|
| **SearchAutocomplete** | query, onSelect, facets | idle / loading / results / empty | combobox, aria-expanded |
| **CategoryCard** | icon, name, subcategoryCount, href | default / hover | link |
| **ProductCard** | logo, name, rating, reviewCount, tagline, sponsored, compareChecked, onCompare, ctas[] | default / hover / selected | article, checkbox |
| **FilterDrawer** | groups[], selected, onChange, onClear | collapsed / open | dialog on mobile, disclosure on desktop |
| **FilterChips** | activeFilters[], onRemove, onClearAll | empty / populated | list, remove buttons |
| **ComparisonBucket** | products[], onRemove, onCompare | empty (hidden) / 1 / 2 / 3 | region live |
| **ComparisonTable** | products[], sections[] | sticky header, horizontal scroll | table, th scope |
| **RatingDistribution** | avg, distribution[5], secondary{} | compact / full | aria-label per bar |
| **ReviewCard** | author, verified, rating, title, body, pros/cons, helpful, date | default / helpful-pressed | article |
| **ReviewForm** | product, ratings, title, body, metadata | step 1–4, submitting, success | form, error announcements |
| **PricingTable** | plans[] | mobile stacked / desktop columns | table |
| **LeadForm** | type, product, fields[] | idle / submitting / success / error | form |
| **StickySidebar** | children | static / sticky | complementary |
| **TrustBar** | stats[] | — | list |
| **Breadcrumbs** | items[] | — | nav, ol |

### Patterns

**Card pattern:** Logo (48×48, object-contain, white bg) + Name (16 semibold) + Rating (star + count, 14) + Tagline (14, 2 lines, truncate) + CTAs (Ghost: Compare checkbox · Primary: Get Pricing · Secondary: View). Sponsored → amber badge top-right.

**Filter pattern:** Desktop: left rail with collapsible groups (Price slider, Rating radio, Features checkboxes, Deployment, Free trial toggle). Mobile: Sheet drawer triggered by "Filters" button + chips row above results.

**Comparison table pattern:**
- Sticky header row (product identity)
- Section headers (Pricing, Ratings, Features — grouped: "Sales & CRM" etc.)
- Row: feature name (left, 200px) | ✓/— per product (centered, green check / muted dash)
- Alternating row bg (zinc-50 every other)
- Horizontal scroll with sticky first column on mobile.

**Review pattern:**
- Header: avatar (initials) + name/role/company + verified badge (emerald) + date + star row
- Body: title (16 semibold) + excerpt (14) + pros (green +) / cons (red −) chips
- Footer: Helpful (👍 count) + Share

---

## Key Flows (wireframe notes)

**Homepage → Search → Product:**
Header autocomplete (shows products + categories + comparisons) → results page (tabs) → product card → profile with sticky lead sidebar.

**Category → Filter → Compare:**
Category grid → apply 2 filters → 24-card grid → check Compare on 2 cards → bucket appears bottom-right ("Compare (2)") → click → /compare/a-vs-b table.

**Review submission:**
Search product (or from product page "Write review") → auth gate (email/Google/LinkedIn) → step: overall stars → secondaries (4 sliders) → title/body/pros/cons → metadata → submit → "Under review — we'll email you" + moderation queue.

---

## Dashboard Patterns

- Vendor: left nav (Overview | Product | Leads | Reviews | Analytics | Billing) + table with filters + status pills (new/contacted/qualified)
- Admin: left nav (Dashboard | Products | Categories | Reviews | Vendors | Leads | Users | SEO) + data table (TanStack Table) + moderation actions (Approve/Reject) with reason.

---

## Motion & Feedback

- No gratuitous animation. 150ms ease for hover, 200ms for drawer/sheet. Skeletons for loading, not spinners. Toast for success/error with 4s auto-dismiss.



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

## PART — FULL COMPETITIVE REPORT (6 PLATFORMS) (`reports/01-FULL-REPORT.md`)

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
