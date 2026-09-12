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
