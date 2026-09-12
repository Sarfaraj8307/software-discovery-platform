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

