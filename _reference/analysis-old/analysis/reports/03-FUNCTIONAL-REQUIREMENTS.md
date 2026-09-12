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
