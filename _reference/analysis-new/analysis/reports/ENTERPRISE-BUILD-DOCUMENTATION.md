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
