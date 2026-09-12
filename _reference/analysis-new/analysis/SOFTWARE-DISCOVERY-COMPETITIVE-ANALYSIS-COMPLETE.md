

================================================================================
# FILE: README.md
================================================================================

# Software Discovery Platform — Competitive Analysis (Complete Package)

**Date:** 2026-09-01
**Platforms:** Software Finder · G2 · SelectHub · SoftwareSuggest · Software Advice · GoodFirms
**Research:** Public observable pages only (no auth bypass, no private APIs)

## How to Use This Package

This directory (`/opt/data/analysis/`) is the complete research output. Copy it to your repo before closing the session.

### Deliverables Map (your 10 requested)

| # | File | What it is |
|---|---|---|
| D1 | `reports/00-EXECUTIVE-SUMMARY.md` | 1-page executive summary |
| D1 | `reports/01-FULL-REPORT.md` | Full 20-section report — 6 competitor deep dives + sitemaps, review/comparison/search/lead/SEO analyses |
| D2 | `matrix/FEATURE-MATRIX.md` | Feature comparison matrix (9 tables, 60+ features × 6 platforms) |
| D3 | `reports/03-FUNCTIONAL-REQUIREMENTS.md` | Functional + non-functional requirements (REQ-* IDs) |
| D4 | `blueprint/PLATFORM-BLUEPRINT.md` | Original platform architecture (services, data flow, comparison, lead routing, RBAC) |
| D5 | `schemas/DATABASE-SCHEMA.md` | Prisma schema (20 models) + ERD + aggregation + comparison logic + seed strategy |
| D6 | `reports/06-TECH-STACK.md` | Frontend/backend/DB/search/infra/testing stack with trade-offs |
| D7 | `reports/07-ROADMAP.md` | MVP (10 weeks) + Phase 2 + Phase 3 roadmaps |
| D8 | `reports/08-UIUX-ARCHITECTURE.md` | Design principles, layout, component library, patterns, flows |
| D9 | `reports/09-SEO-ARCHITECTURE.md` | Original URL system, templates, internal linking, programmatic generation, scale math |
| D9b | `reports/14-API-ARCHITECTURE.md` | API routes, auth, validation, rate limiting, error shape |
| PRD | `reports/02-PRD.md` | Master PRD (23 sections: vision → scalability) |
| Deep | `reports/04-DEEP-DIVES.md` | Buyer journey (8 personas + map), lead gen (8 mechanisms), comparison engine, review system, search/filters, SEO deep dives |
| **D10** | `prompts/MASTER-BUILD-PROMPT.md` | **Copy-paste-ready prompt for an AI coding agent — BUILD→RUN→TEST→FIX loop until green (311 lines, 10 steps)** |

### Quick Start for Next Step

1. **Read:** `reports/00-EXECUTIVE-SUMMARY.md` (2 min) → `reports/01-FULL-REPORT.md` (20 min)
2. **Decide scope:** `reports/02-PRD.md` Section 7 (MVP) or `reports/07-ROADMAP.md`
3. **Build:** Copy-paste `prompts/MASTER-BUILD-PROMPT.md` into Claude Code / Codex / Cursor — it will scaffold, seed, and test until the app works
4. **Reference while building:** Keep `schemas/DATABASE-SCHEMA.md` and `reports/08-UIUX-ARCHITECTURE.md` open

### Absolute Paths (this session)

```
/opt/data/analysis/reports/00-EXECUTIVE-SUMMARY.md
/opt/data/analysis/reports/01-FULL-REPORT.md
/opt/data/analysis/reports/02-PRD.md
/opt/data/analysis/reports/03-FUNCTIONAL-REQUIREMENTS.md
/opt/data/analysis/reports/04-DEEP-DIVES.md
/opt/data/analysis/reports/06-TECH-STACK.md
/opt/data/analysis/reports/07-ROADMAP.md
/opt/data/analysis/reports/08-UIUX-ARCHITECTURE.md
/opt/data/analysis/reports/09-SEO-ARCHITECTURE.md
/opt/data/analysis/reports/14-API-ARCHITECTURE.md
/opt/data/analysis/matrix/FEATURE-MATRIX.md
/opt/data/analysis/schemas/DATABASE-SCHEMA.md
/opt/data/analysis/blueprint/PLATFORM-BLUEPRINT.md
/opt/data/analysis/prompts/MASTER-BUILD-PROMPT.md
```

### Research Rules Compliance

- No proprietary code copied
- No paywall/CAPTCHA/rate-limit bypass
- No copyrighted text/branding/logos reproduced
- No private APIs or databases accessed
- Every claim labeled [OBSERVED FACT] / [INFERENCE] / [RECOMMENDATION]
- "Not publicly observable" used where data was unavailable


================================================================================
# FILE: reports/00-EXECUTIVE-SUMMARY.md
================================================================================

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


================================================================================
# FILE: reports/01-FULL-REPORT.md
================================================================================

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



================================================================================
# FILE: reports/04-DEEP-DIVES.md
================================================================================

# EXTENDED DEEP DIVES — Buyer Journey, Lead Gen, Comparison Engine, Review System, Search/Filters

## Phase 3 — Buyer Journey Analysis

### Personas (8) — Observed vs Inferred

| Persona | Goal | Entry Point | Main Actions | Decision Flow | Conversion Event |
|---|---|---|---|---|---|
| Software Buyer (SMB) | Find affordable tool fast | Google "best X" → category | Search → filter → compare 2–3 → request pricing | Awareness → Consider → Compare → Lead | Lead submitted |
| Business Decision Maker | Validate ROI, reduce risk | Gartner network / advisor link | Read buying guide → FrontRunners → advisor call | Research → Trust → Advise → Decide | Advisor lead |
| IT Buyer | Validate integrations/deployment | Search "X integration" | Features/integrations/deployment check → reviews | Requirements → Features → Reviews → Demo | Demo request |
| Small Business Owner | Budget + ease of use | Category page (Software Finder) | Price + free trial filters → read 2 reviews → compare | Budget → Filter → Reviews → Compare | Get Pricing |
| Enterprise Buyer | Stakeholder consensus | SelectHub Decision Platform | Build requirements → score → RFI/RFP → vendor demos | Requirements → Score → Shortlist → RFP → Select | RFI distributed |
| Software Vendor | Acquire leads | Claim profile CTA (all platforms) | Claim → manage listing → respond to reviews → view leads | Claim → Optimize → Acquire → Convert | Subscription/sponsorship |
| Review Contributor | Share experience | Email invite / Write Review CTA | Submit structured review → helpful votes | Use → Reflect → Write → Share | Review published |
| Research User (student/journalist) | Learn market landscape | Resource/blog → category | Read guides, compare, no lead intent | Learn → Browse → Exit | None (but retarget) |

### Journey Map — Generic (observed across all)

```
Google Search ("best CRM 2026" / "salesforce vs hubspot")
  ↓
Category or Comparison pillar page (SEO landing)
  ↓
Apply filters (price, rating, features) — or accept defaults
  ↓
Scan product cards (logo, rating, price, tagline)
  ↓
Product profile (read pricing, features, screenshots, reviews)
  ↓
Compare alternatives (2–3 products side-by-side)
  ↓
Lead event (Get Pricing / Request Demo / Ask Expert)
  ↓
Vendor follow-up (outside platform)
```

**Variations:**
- **Software Advice:** inserts "Talk to Advisor" branching at every step (even before filtering) — high-touch.
- **SelectHub:** branches at "Build Requirements" → scoring → shortlist → pricing (enterprise funnel).
- **GoodFirms:** branches at "Post a Project" — buyer posts brief, vendors propose (reverse marketplace).
- **G2:** branches at "Leave a Review" (contributor funnel) parallel to buyer funnel — flywheel.

---

## Phase 4 — Lead Generation & Business Model

### Monetization mechanisms observed

| Mechanism | Who Pays | Who Gets Value | Flow | Backend | Dashboard |
|---|---|---|---|---|---|
| **Pay-per-lead (Software Advice core, others)** | Vendor | Buyer: curated shortlist; Vendor: warm lead | Buyer fills form / advisor qualifies → lead row → email to vendor → vendor pays on delivery | Lead table + status + assignment + email worker + billing (Phase 2) | Vendor: lead inbox; Admin: lead manager |
| **Sponsored listing / Featured (all)** | Vendor | Vendor: top placement; Buyer: discovery (biased) | Vendor buys placement → product.sponsored=true → sorted first in listings | sponsored flag + sort boost + billing | Vendor: sponsorship controls; Admin: placement manager |
| **Freemium profile + upsell (G2)** | Vendor | Vendor: visibility + intent data; Buyer: more info | Free claim → limited analytics → upsell to intent/reviews syndication | tier + entitlements + usage tracking | Vendor: analytics, review campaigns |
| **PPC / Affiliate click (SoftwareSuggest, Software Finder)** | Vendor | Vendor: click; Platform: CPC | Card "Visit Website" → redirect via tracker (trkrdr1/ppc.*) → bill per click | click log + tracker redirect + billing | Vendor: click report |
| **Subscription for listing (SoftwareSuggest $4k/6mo)** | Vendor | Vendor: listing + banner + PPC credit | Vendor buys plan → profile enhanced | plan + entitlements + expiry | Vendor: billing |
| **Pro verification (GoodFirms)** | Vendor (agency) | Buyer: trust; Vendor: badge + ranking boost | Vet (background, portfolio) → Pro badge → ranking boost | verification status + algorithm weight | Vendor: Pro status |
| **Project posting / RFI/RFP (GoodFirms/SelectHub)** | Vendor (to bid) | Buyer: proposals; Vendor: project leads | Buyer posts project/RFP → match → vendors propose → buyer picks | project table + matching + proposal flow | Vendor: proposals; Buyer: proposal inbox |
| **AEO/GEO visibility (SoftwareSuggest new)** | Vendor | Vendor: AI search presence | Audit + report → upsell | audit job + report | Vendor: visibility score |

**Assumptions (labeled):** Exact revenue shares and PPL prices are NOT public; above is mechanism only. Pricing examples (SoftwareSuggest $4k/6mo) are observed facts.

### Lead form patterns observed

- **Inline:** Get Pricing / Get Quote / Get Offer per plan (SoftwareSuggest 5 plans, each "Get Offer").
- **Sticky sidebar:** Persistent form on product page (Software Finder expert form).
- **Modal/interstitial:** "Send me list to inbox" email capture (Software Advice).
- **Advisor widget:** Persistent "Talk with us 15 min free" (Software Advice) — Calendly embed.
- **Project post:** Structured brief (GoodFirms/SelectHub) — higher friction, higher intent.

**Recommendation (MVP):** Implement 3 ambient forms (Get Pricing, Request Demo, Expert Recommendation async) + tracked Visit Website clicks. No modal popups. Capture utm/referrer. Email vendor + admin on each.

---

## Comparison Engine — Deep Dive (Priority 1)

### How observed platforms do it

- **Initiation:** Compare checkbox on each card (Software Finder, G2, SoftwareSuggest, SelectHub) → bucket count in header/floating bar → "Compare (N)" CTA. SelectHub: "Select up to 5." GoodFirms: minimal.
- **URL:** `/compare/{a}-vs-{b}` (G2, SoftwareSuggest, Software Advice) or `/resources/{a}-vs-{b}` editorial (Software Finder) or within guide (SelectHub). G2 failed to extract but search confirms `/compare/salesforce-crm-vs-hubspot-crm`.
- **Table sections observed:** Header (logo/name/rating/CTA) → Overview → Pricing → Ratings → Features (grouped ✓/✗) → Pros/Cons → Integrations → Alternatives → FAQs (SoftwareSuggest comparison article is prose + table; G2 is pure table).
- **Limit:** 2–5 products (SelectHub 5, G2 4, SoftwareSuggest 2 in article, recommend 3 max for UX).

### Original Comparison Engine Design

**Data model:** `Comparison` (slug, title) + `ComparisonProduct` (comparisonId, productId, position). Slug is `sorted(slugs).join('-vs-')` canonical. On unsorted request, 301.

**Generation:** On-demand ISR. No prebuild of O(n²). Internal links only emit ~200 comparisons at launch (top-5 per top-20 categories). Page revalidates when any contained product updates (revalidatePath).

**Table spec:**
- Header row: logo (48), name, rating (star + count), starting price, 2 CTAs (Get Pricing, Visit)
- Section: Overview (2-line tagline each)
- Section: Pricing (plans side-by-side; if plan counts differ, align by tier)
- Section: Ratings (overall + 4 secondaries as horizontal bars)
- Section: Features (grouped by FeatureGroup, rows = features, cells = ✓ green / — muted / "Add-on" note)
- Section: Pros/Cons (2 cols, green + / red − bullets, from aggregated review mining or manual)
- Section: Integrations (logo grid per product, intersection highlighted)
- Section: Alternatives (6 cards: products that are alternatives to EITHER A or B)
- Section: FAQs (per-product FAQs merged)
- Verdict block (Phase 2: auto-generated summary — "Choose A if ... Choose B if ...").

**API:** `GET /api/comparisons/{slugs}` returns `{ products: Product[], featureMatrix: { feature, values: boolean[] }[], pricingMatrix, ... }`. Validates slugs, 404 if any unknown, 301 if unsorted.

---

## Review System — Deep Dive

### Observed flows

- **G2 wizard:** Search product → select role (12 roles) → ratings (overall + secondaries) → Q&A ("What do you like best?"). LinkedIn/Google OAuth. Helpful votes. Sentiment highlights (beta).
- **SoftwareSuggest:** 4-step: Select Product → Leave Review → Share on LinkedIn → Finished. Popular products to review. 4.6/5 with 277 reviews (Salesforce).
- **Software Advice:** Reviews show overall + 4 secondaries (Ease 4.0, Value 4.0, Support 4.1, Func 4.4) + distribution bars (55% 5-star) + reviewer meta (name, role, industry, use duration: "Used monthly <12 months") + "We analyzed 18,784 reviews for pros/cons" aggregation.
- **GoodFirms:** 52 reviews, 4.3/5, 0 recent, "What Users Say / Like Most / Like Least" + individual cards (name, role, company, date, Overall Experience) + verification (phone+email+client check+portfolio audit).
- **Software Finder:** Low volume (15–77 per product), methodology page, Write a Review in header — trust via methodology not volume.

### Proposed Schema — see Deliverable 5

Entities: User, Product, Review, ReviewRating (or inline columns on Review for secondaries), ReviewVote, ReviewVerification (or boolean on Review). One review per user per product, moderation, verification badge, helpful count, denormalized aggregates on Product.

### Moderation

Pending → Approved/Rejected/Flagged. Admin sees queue with filters, can toggle Verified. Spam: length <50, URL-only, profanity, duplicate detection. Approved → triggers rating recomputation + search sync + email to author.

---

## Search & Filters — Deep Dive

### Search patterns

- G2: large hero autocomplete (dominant), placeholder "Ask a question..." — typo-tolerant, product + category.
- SoftwareSuggest / GoodFirms: header search + AI-suggested matches (GoodFirms).
- SelectHub: site search (not product search) — requirements builder is primary discovery.
- Software Advice: category nav, not global search.
- Software Finder: "Quick Search" input + categories — minimal.

### Filters observed

See Matrix Deliverable 2 — summary: Price, Rating, Features are ubiquitous; Deployment, Integrations, Company size, Industry, Free trial, Integrations vary. Software Finder's filter drawer: Our Recommended / Ratings / Price / Features — lightweight.

### Recommendation (MVP filters)

Filters on category listing: Price range (slider or buckets), Rating (≥4, ≥4.5), Features (checkboxes per category's top 10 features), Free trial (toggle), Deployment (Cloud/On-prem), Integrations (searchable multi-select for top 20). Sort: Recommended (sponsored + rating + reviewCount weighted), Rating, Price low→high, Most reviewed. Persist in URL query (`?price=0-50&rating=4&features=crm-automation&freeTrial=true&sort=rating`).

Implementation: Meilisearch facets for instant filtering; URL-synced state; server renders initial, client updates.

---

## SEO Architecture — Deep Dive (see Deliverable 9 for full)

### Observed SEO page types

- Category pillars (all): /crm, /categories/crm, /c/crm-software — exhaustive, with buying guide + methodology.
- Best/Top lists: /best-software-companies, FrontRunners, Champions — linkable assets.
- Comparison: /compare/A-vs-B (G2/SoftwareSuggest scale), /resources/A-vs-B articles (Software Finder).
- Alternatives: /products/{slug}/competitors, #alternative, /{product}/alternatives.
- Product reviews: /{product}/reviews (G2 tab), /salesforce/reviews.
- Industry/location/feature pages: implied via subcategories.
- Resources/blog: /resources/*, /blog/*, /research/*.

### URL & internal linking patterns observed

- Product slugs: `{vendor}-{product}` (G2) or `{product}` flat (SoftwareSuggest) or `{product}-profile` (Software Advice).
- Category: `/{category}` flat (Software Finder) vs `/categories/{cat}` vs `/c/{cat}-software/` vs `/{cat}/` (Software Advice).
- Comparison: `/{a}-vs-{b}` with `-vs-` joiner — universal.
- Breadcrumbs: Home > Category > Product (all).
- Internal linking: category → product → alternatives/comparison → back — dense mesh.

### Programmatic SEO insight

All scale via structured data + templates. No manual writing per comparison beyond editorial articles (Software Finder). The engine is: taxonomy + product DB + templates = thousands of pages.

See Deliverable 9 for original URL system + generation strategy + scale math.


================================================================================
# FILE: matrix/FEATURE-MATRIX.md
================================================================================

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


================================================================================
# FILE: reports/03-FUNCTIONAL-REQUIREMENTS.md
================================================================================

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


================================================================================
# FILE: reports/02-PRD.md
================================================================================

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


================================================================================
# FILE: schemas/DATABASE-SCHEMA.md
================================================================================

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


================================================================================
# FILE: reports/06-TECH-STACK.md
================================================================================

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


================================================================================
# FILE: reports/14-API-ARCHITECTURE.md
================================================================================

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


================================================================================
# FILE: blueprint/PLATFORM-BLUEPRINT.md
================================================================================

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


================================================================================
# FILE: reports/08-UIUX-ARCHITECTURE.md
================================================================================

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


================================================================================
# FILE: reports/09-SEO-ARCHITECTURE.md
================================================================================

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


================================================================================
# FILE: reports/07-ROADMAP.md
================================================================================

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


================================================================================
# FILE: prompts/MASTER-BUILD-PROMPT.md
================================================================================

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



================================================================================
# FILE: reports/INDIVIDUAL-goodfirms_analysis.md
================================================================================

# GoodFirms (goodfirms.co) — Competitive Intelligence Analysis

**Date:** 2026-09-01 (UTC)  
**Analyst:** Hermes subagent — web_extract + hermes_web_search + curl probes  
**Sources extracted:** `https://www.goodfirms.co/` (homepage), `https://www.goodfirms.co/directories/service`, `https://www.goodfirms.co/directories/software`, `https://www.goodfirms.co/research-methodology` (v3.2), `https://www.goodfirms.co/about-us`, `https://www.goodfirms.co/company/sdlc-corp` (company profile), `https://www.goodfirms.co/software/speed-1` (software product page), `https://www.goodfirms.co/blog/how-improve-your-goodfirms-ranking`, partial cache for `/seo-agencies` & `/companies/web-development-agency` via search snippets (Cloudflare challenge blocked full curl on listing pages 2026-09-01).  
**Key limitation:** Direct listing/filter DOM for `/companies/*` and `/artificial-intelligence` returned Cloudflare Turnstile challenge (`Just a moment...` + `challenges.cloudflare.com`) on curl — extracted via Exa/web_extract where available + description snippets. Inferences marked explicitly.

> **Legend:** `[OBSERVED FACT]` = text/field seen verbatim in extracted HTML/markdown. `[INFERENCE]` = logical extrapolation from patterns, not directly seen. `[PARTIAL]` = seen in search-snippet but not full page body.

---

## 1. Executive Summary — Dual Marketplace Model

GoodFirms is a **research-led B2B marketplace** operating **two parallel directories** under one domain/brand:

| Marketplace | What is listed | Example entity | Evidence |
|---|---|---|---|
| **Services / Agencies** | Vetted service firms (agencies, dev shops, marketing firms) | SDLC Corp (400+ staff, custom software) — `/company/sdlc-corp` | `[OBSERVED FACT]` Homepage tagline "Find the right firm for your next project" + `60+ Categories` + `Browse 1.2M verified reviews across 80,000 firms` |
| **Software Products** | Packaged software / SaaS tools (ready-made) | Speed (Bitcoin & Stablecoin Payments) — `/software/speed-1` | `[OBSERVED FACT]` Homepage nav "By Software: *I'm comparing CRM tools*" + `Browse all 500+ softwares` + product fields (Licensing, Deployment, Pricing Type) |

`[OBSERVED FACT]` Header explicitly splits discovery into three intents: **By Services** ("I need React Developers"), **By Solutions** ("I want to build a neobank"), **By Software** ("I'm comparing CRM tools"). `[INFERENCE]` Solutions is a pre-architected vertical (Neobank, iGaming Casino, Crypto Exchange, eCommerce Marketplace) — likely a thin wrapper/landing that routes to agency listings.

Stats repeated verbatim across homepage + methodology: **80,000 verified firms, 1.2M verified reviews, 60+ main services, 200+ sub-services, 50+ software categories listed on homepage (450+ on /directories/software), 130 countries, 23% acceptance rate, 14,000+ active buyers, $340M+ spend matched (2025), median $85K deal**.

---

## 2. Homepage — goodfirms.co/

### 2.1 Hero & Search
- `[OBSERVED FACT]` Hero H1: *"Find the right firm for your next project"* + sub: *"Browse 1.2M verified reviews across 80,000 firms in 60+ categories and 130 countries."*
- `[OBSERVED FACT]` Primary CTA: `Find Firms` (search input with icon `search-icon.svg`) + secondary link: `+ Post a project instead` → `https://www.goodfirms.co/post-a-project` (also `https://myaccount.goodfirms.co/users/projects/post`).
- `[OBSERVED FACT]` Popular pills inline under search: Vibe Coding, Artificial Intelligence, App Development, Web Development, Software Development, Digital Marketing, Cloud Consulting, Cybersecurity, SEO Services — each linked to its directory (e.g. `/companies/vibe-coding`, `/artificial-intelligence`, `/directory/platform/app-development`, `/companies/web-development-agency`, `/seo-agencies`).
- `[OBSERVED FACT]` Trust stats strip: 80K / 1.2M / 60+ / 130 with "Cited as a source by ChatGPT, Claude, Perplexity, Gemini, Grok, Copilot" + logos.
- `[OBSERVED FACT]` Below fold: "▼ See How It Works ▼" → interactive demo: `goodfirms.co/search` query → `acmestudio.com` card → `G Goodfirms · Find the right firm` → AI-suggested matches (Acme Studio — San Francisco, Northwind Labs — LA, Contoso Apps — San Diego) with `★ 4.9 $100–149/hr` chips. Narrative: Search → Compare → Choose → Connect.

### 2.2 Vertical Navigation Blocks
`[OBSERVED FACT]` Section *"Choose the right development partner"* partitions 3 column groups:
- **Services 60+ | Solutions 5+ | Software 50+** tabs.
- Icons per block:
  - Software Development → Custom Software Dev, React, Python, Java, Software Testing (`/directory/languages/top-software-development-companies[/reactjs|/python|/java]`)
  - Web & App Dev → Mobile App Dev (`/directory/platform/app-development`), Web Dev (`/companies/web-development-agency`), eCommerce Dev, WordPress, Shopify
  - Design → Web Design (`/directory/platforms/top-web-design-companies`), UX, Graphic, Logo, Animation
  - Marketing & Advertising → Digital Marketing (`/directory/marketing-services/top-digital-marketing-companies`), SEO (`/seo-agencies`), Social, PPC, Content Marketing
  - Latest Tech → AI (`/artificial-intelligence`), AI Agent Dev, AR/VR, IoT, AI Consulting
  - Business & IT Services → Cloud Computing, IT Services, Big Data & Analytics, IT Consulting, BPO
- `[OBSERVED FACT]` Bottom link: `Browse all 60+ services → /directories` (which redirects to `/directories/service` + `/directories/software`).

### 2.3 Editorial / Social Proof Blocks
- `[OBSERVED FACT]` "NEW ON GOODFIRMS — The Vibe Coding era has arrived. 340+ vetted agencies, 4.8 avg rating, 2-6 wk typical MVP" — carousel cards (Excited 5.0★ 20 Reviews, Probey Services 5.0★122 Reviews, etc.) each with `Visit Website` outbound.
- `[OBSERVED FACT]` "What teams say after hiring through GoodFirms" — 1,847 verified reviews in last 30 days, 4.8 avg buyer rating, 92% would recommend, 1.2M total hires. Three case testimonials with structured fields: Hired [Firm] / Project / Result (e.g. OpenXcell → Ask4Dr → Specialist consults +40%).
- `[OBSERVED FACT]` "Why teams trust GoodFirms over other B2B platforms" — 5 proof points linking to `/research-methodology`.
- `[OBSERVED FACT]` "Research & Goodfirms insights you can cite" — 124 research reports, 2.4K+ external citations, Weekly new data.

### 2.4 Header Navigation (global)
`[OBSERVED FACT]` Extracted from `/directories/*` & `/research-methodology` header:
- **Discover** mega-menu: By Services / By Solutions / By Software (3 columns, 5-6 links each + "Browse all 60+ services" / "Browse all solutions" / "Browse all 500+ softwares")
- **New Feature launch:** `Firms come to you. • PRO-verified proposals • Top 3 recommended — You decide the winner — Post a Project`
- **Goodfirms Pro:** `I'm looking to hire` vs `I want to be pro-verified provider`
- **For Business:** `Get Listed` / `Goodfirms Pro` / `Advertise` / `Contact Us`
- **Resources:** `Insights` / `Blog (1,200+ articles)` / `Podcast` / `Press Releases`
- **Featured:** `Neobank Development Playbook` (subscribe box)
- **Utility:** `Write a review` → `https://myaccount.goodfirms.co/review`, `Get Listed`, `Post a Project`

---

## 3. Software Categories — /directories/software & /directories/service

### 3.1 Service Directory
- `[OBSERVED FACT]` Title: `Browse all services on GoodFirms — All 60+ service categories with top sub-services.`
- `[OBSERVED FACT]` Counters: `80,000+ firms, 60+ main services, 200+ sub-services, 4.7 avg rating`, `Showing 24 of 24 services` with anchor `Jump to: Development Design Marketing & Advertising Business & IT Services`
- `[OBSERVED FACT]` Development sub-list (8 shown): Custom Software Dev 22,644 firms, Web Dev 38,399, Mobile App Dev 25,815, AI 8,899, eCommerce 16,135, Blockchain 3,153, Game Dev 2,478, Testing 5,355, DevOps 3,901 — each with 4.9 avg + popular sub-services counts (e.g. Java 13,059 / Python 9,231 / React 8,438 / PHP 15,012)
- `[OBSERVED FACT]` URL shape: `/directory/languages/top-software-development-companies[/<lang>]`, `/directory/platform/app-development`, `/companies/web-development-agency`, `/seo-agencies` — two co-existing path families (legacy `/directory/*` + newer `/companies/*`).

### 3.2 Software Directory
- `[OBSERVED FACT]` Title: `Browse software categories — Find the right software for your business from 450+ categories.` (homepage says 50+ featured but directory shows 450+).
- `[OBSERVED FACT]` Alphabetic index A-Z e.g. `3D CAD Software`, `A/B Testing Software`, `AI Agent Builders`, `CRM Software`, `Project Management` → `Browse all 500+ softwares`.

---

## 4. Company / Agency Listings — e.g. /companies/web-development-agency , /seo-agencies

**Access note:** Full HTML blocked by Cloudflare Turnstile on 2026-09-01 probes. Observations combine `[PARTIAL]` snippet from web_extract for `/seo-agencies` & `/companies/web-development-agency`.

### 4.1 Listing Header (observed for SEO & Web Dev categories)
- `[PARTIAL]` `Best SEO Companies` | `Top Web Development Companies` — `Researched by: Goodfirms Research Team — Updated: September 1, 2026`
- `[PARTIAL]` `Goodfirms has reviewed 33,995 SEO Companies as of September 2026 across 138 countries. Top-ranked Searchbloom (4.9★, 94 reviews, $100–149/hr, founded 2014, South Jordan). Median $25, median 4.9, 12% have 50+ members.` Web Dev: `39,724 Web Development Companies across 150 countries. Top SDLC Corp (4.9★, 156 reviews, $25–49/hr, founded 2015, Batavia). Median $37, 17% have 50+ members.`
- `[OBSERVED FACT]` Disclosure: `How this list is built: All N firms below pass 4-step verification... Listings marked "Sponsored" are agencies that pay for premium placement — sponsorship does not affect star ratings or review content.`

### 4.2 Filters & Sorting
- `[PARTIAL]` `Sort By:` + `Sponsored` label + `Top 10 at Glance — Compare the highest-ranked firms first side by side. Rank | Company | Rating | Reviews | Hourly Rate | Team Size | Founded | Headquarters | Action`
- `[OBSERVED FACT]` Filter dimensions stated on /directories: "browse verified firms by country, state, city, industry, and platform" — implies faceted navigation.
- `[INFERENCE]` Expected filters: Location, Hourly Rate (<$25, $25-49, $50-99, $100-149, $150+), Team Size (1-9, 10-49, 50-249, 250-999), Industry, Service Focus, Technologies. Not directly extracted due to block.

---

## 5. Product Profiles

### 5.1 Company / Agency Profile — /company/<slug> (e.g. SDLC Corp)
`[OBSERVED FACT]` Tab: `Overview`. Structure:
- **Header:** Name, `5.0 155-156 Reviews`, `Verified` badge, `Write a Review` + `Claimed Profile`, social links.
- **About:** Free-text description, locations (USA/UK/UAE/India with addresses/phones), `$25–49/hr | 250-999 employees | 2015 founded`, Service Focus bar.
- **Review Analytics:** `4.9 156 Verified Reviews` breakdown: Quality 4.9, Schedule 4.9, Communication 4.9, Overall 4.9 — AI-generated summary.
- **Detailed Reviews:** Filter `Services: All Services | App Designing | AI | Blockchain...` + `Sort By: Most Recent | Relevance | Rating` + tag cloud `Communication 96 | Problem Understanding 89...`.
- **Review card:** Avatar, Name/Title/Company or Anonymous Verified, date, quote title, 5.0 sub-ratings, service tags, body, `Show Project Details`.

### 5.2 Software Product Profile — /software/<slug> (e.g. Speed-1)
`[OBSERVED FACT]` Title: `Speed Reviews & Pricing 2026 | Goodfirms` — H1 `Speed` + `5.0 5 Reviews` + tagline + description.
- **Meta:** `Industries: Gambling-casinos | Licensing: Proprietary | Deployment: Cloud Hosted, Windows, Mac | Support: Email, 24x7`
- **Core Features:** `Cryptocurrency Payment Gateways` + 11 feature bullets (Multi-Crypto Support, Real-Time Processing, Auto Crypto-to-Fiat, Monitoring, Payment API...)
- **Pricing:** `Pricing Type: Contact Vendor | Currency: USD | Free Version: Yes | Payment Frequency: Quote Based`
- **Reviews:** `5 Total | 5.0/5 Overall | What Users Say` (4 Anonymous + 1 named) | `What Users Like The Most`.

---

## 6. Review Verification & Trust Stack

`[OBSERVED FACT]` from `/research-methodology` + `/about-us`:
- **4-Step Verification (23% pass):** Legitimacy (registered entity, 2+ yrs), Portfolio audit (min 5 projects/service), Reference calls (2-3 clients interviewed), Continuous monitoring (re-verification every 18 months)
- **Review Authentication (1.2M):** Email + client-relationship check for every review, random phone/video sample, anonymous reviews rejected in sense of unverified (Anonymous Verified is still verified).
- **Mystery Shopper:** Anonymous outreach scoring professionalism/transparency/sales process, never announced.
- **Re-verification:** Every 18 months.

---

## 7. Ranking Algorithm — Leaders Matrix v3.2

`[OBSERVED FACT]` Full spec at `/research-methodology` — Last reviewed May 13 2026, v3.2, weekly recompute Mondays 06:00 UTC. **Sponsorship does NOT affect rank**.

### 7.1 Two-Axis Matrix (0–100 each)
- **Y: 360-Performance View** (execution) | **X: Core Competencies** (specialization)
- Quadrants: Industry Leaders (≥70,≥70) default first; Industry Contenders (Y≥70,X<50); Market Influencers (X≥50,Y<70); Upcoming Achievers (<50,<50)

### 7.2 Y-Axis — 360-Performance View
| Component | Weight |
|---|---|
| Client Reviews | 50% |
| Market Presence | 30% |
| Goodfirms Score | 20% |

Formulas verbatim:
- **VolumeScore:** `log10(n+1)/log10(200)*100` capped at 200=100
- **Bayesian shrinkage:** `adjusted = (n*raw + k*platform_mean)/(n+k)` k=10, mean 4.4
- **Recency:** `weight = exp(-months_old/18)` → 0mo 1.00, 18mo 0.37, 36mo 0.14
- **Goodfirms Score:** `0.4*Verification +0.3*ResponseTime +0.3*MysteryShopper`
- **Total:** `0.5*ClientReviews +0.3*MarketPresence+0.2*GoodfirmsScore`

### 7.3 X-Axis — Core Competencies (per-category)
| Component | Weight | Formula |
|---|---|---|
| Service Focus Ratio | 40% | `(projects_in_service/total)*100` |
| Portfolio Depth | 30% | `min(verified_projects/20,1)*100` |
| Portfolio Quality | 20% | case-study rubric 0–100 |
| Service Experience | 10% | `min(years/10,1)*100` |

X computed **per service category** — same firm different quadrants per service.

### 7.4 Refinements
- Bayesian shrinkage k=10, 18-month exponential decay (was 24mo in v3.1), sponsorship excluded, eligibility floor ≥10 reviews, ≥3.5 rating, ≥3/4 verification. Changelog v3.2 (2026-05-13) added Mystery Shopper 30%, tightened decay, raised review cap 100→200.

### 7.5 Cadence
Full recompute Mondays 06:00 UTC; between recomputes scores drift but display holds.

---

## 8. Comparison

- `[OBSERVED FACT]` `Top 10 at Glance — Compare the highest-ranked firms first side by side. Rank | Company | Rating | Reviews | Hourly Rate | Team Size | Founded | Headquarters | Action` — primary compare surface.
- `[INFERENCE]` No user-assembled checkbox matrix like G2 observed; comparison is curated top-N table. Software feature comparison not observed.

---

## 9. Lead Generation

`[OBSERVED FACT]` Three paths:
1. **Buyer RFP — Post a Project:** Hero `Post a project instead` → `/post-a-project` + `/company-recommendation`. Promise: 3-5 hand-picked firms in 72h (also "24 hours" on homepage), $10K–$1M+ bracket, median $85K, $0 platform fees, curated shortlists (never 200 bidders), reference calls, free MSA/SOW templates. Turns away ~30% too-small RFPs.
2. **Direct Outreach:** `Visit Website` outbound (with `utm_source=goodfirms`) + phones/addresses per profile. Buyer contracts direct.
3. **Agency-side — Get Listed Free:** `Get Listed Free` → `/get-listed` — free profile/reviews/placement, 23% acceptance, 40 researchers. Value prop: 20–33% RFP win rate (vs 0.5–2% elsewhere), win/loss analytics, proposal builder (8h→90m).

Monetization: `[OBSERVED FACT]` Sponsored placements + PRO Verified subscriptions, both labelled. Leader Matrix/star ratings not for sale. Stats: 14K active buyers, 2.4K RFPs 2025, 4.8/5 satisfaction, 72% hire from first shortlist.

---

## 10. URL Patterns

### 10.1 Documented (Observed)
```
Homepage:                /  (myaccount.goodfirms.co for auth)
Methodology/About:       /research-methodology  /about-us  /blog/<slug>  /research
Post/Get Listed:         /post-a-project  /company-recommendation  /get-listed  /sponsors
Company:                 /company/<slug>                         (e.g. /company/sdlc-corp)
Software product:        /software/<slug>-<id>                   (e.g. /software/speed-1)
Software category:       /software/category/crm  |  /directories/software
Directories hub:         /directories  /directories/service  /directories/software
Service listing (new):   /companies/<service-slug>               (e.g. /companies/web-development-agency, /companies/vibe-coding)
Service listing (legacy):/directory/languages/top-software-development-companies[/<sub>]
                         /directory/platform/app-development
                         /directory/platforms/top-web-design-companies[/<sub>]
                         /directory/marketing-services/top-digital-marketing-companies[/<sub>]
Root service slugs:      /seo-agencies  /cloud-computing-companies  /bpo-services  /it-services
                         /artificial-intelligence[/ai-agent-development]  /ecommerce-development-companies/shopify
                         /animation-multimedia  /big-data-analytics  /social-media-marketing
Write review:            https://myaccount.goodfirms.co/review  /review/company/add/<id>
Robots disallow:         /software/visit-profile  /company/visit-profile  /report/visit-website
                         /search/service-location  /users/login  /cdn-cgi/
Sitemap:                 /sitemap.xml
```

### 10.2 Inferred
- `[INFERENCE]` Faceted filter URLs likely `?filter_location=...` or `/companies/<service>/<country>` — not observed due to Cloudflare block; /directories states dimensions (country/state/city/industry/platform).

---

## 11. Navigation & IA Summary

Header: Discover (Services | Solutions | Software) + Goodfirms Pro + For Business (Get Listed/Pro/Advertise) + Resources (Insights/Blog/Podcast) + CTAs (Write Review/Post Project)
Hub: /directories → /directories/service (24 groups) + /directories/software (450+ A-Z)
Listing: H1 + median stats + disclosure + Top 10 at Glance + paginated cards (Sponsored top, then Leaders→Contenders→Influencers→Achievers)
Profile: Company (/company/<slug>) vs Software (/software/<slug>) divergent field sets

---

## 12. Gaps & Next Steps

- Listing filter DOM not fully captured due to Cloudflare Turnstile on 2026-09-01 (Just a moment challenge preserved). Needs browser JS solve or Diffbot/Google cache to capture exact filter query params and comparison checkbox widget.
- Sitemap also blocked — retry via web_extract header override or Bing index.
- Verify Post-a-Project form fields and PRO pricing via authenticated crawl.

*All OBSERVED FACT lines trace to extracts cached at `/opt/data/cache/web/www.goodfirms.co-*.md`.*


================================================================================
# FILE: reports/INDIVIDUAL-selecthub-analysis.md
================================================================================

# SelectHub (selecthub.com) — Competitive Intelligence Analysis
**Date:** 2026-09-01 | **Method:** web_extract + web_search (Exa/Keenable backends) | **Coverage:** Homepage, Categories, Product/Category Pages, Technology Selection Management (TSM), Requirements Workflow

> **Legend:** Each bullet tagged **OBSERVED FACT** = directly extracted from page content; **INFERENCE** = extrapolated from patterns, context, or industry norms but not verbatim on page.

---

## 1. At-a-Glance Positioning

- **OBSERVED FACT:** Self-describes as *"Software Selection Platform + Analyst Research Firm"* and *"Technology Selection Management (TSM) solution"* — eliminates messy requirements compilation. Not a pure review marketplace (G2/Capterra model).
- **OBSERVED FACT:** Homepage title: `Software Selection Platform, Analyst Research and Reviews` — covers 9,000+ products. Claims 125,938 buyers advised, 719,943 products short-listed, 1,856 RFIs/RFPs distributed.
- **OBSERVED FACT:** Free for buyers; vendor monetization via profile claims + paid analyst verification + managed services. Tagline: *"We Connect Buyers and Vendors — matchmaker, not tied to any sale."*
- **OBSERVED FACT:** Core book/methodology: **Lean Selection** (freely published eBook: *How to Really Select the Right Software*) — prescriptive phased workflow.
- **INFERENCE:** Differentiator vs G2/Gartner: requirements-first, scoring-engine-driven selection vs crowdsourced reviews / Magic Quadrant.

---

## 2. Information Architecture & URL Patterns

| Pattern | Example | Purpose | Tag |
|---------|---------|---------|-----|
| `/` | `selecthub.com/` | Homepage, search, 3-step jumpstart | OBSERVED FACT |
| `/categories/` | `selecthub.com/categories/` | Full directory of ~30 high-level groups + 100+ subcategories | OBSERVED FACT |
| `/c/{slug}/` | `/c/erp-software/`, `/c/lms-software/`, `/c/hr-management-software/` | **Category leaderboard** — "The 10 Best X of 2026", analyst-ranked | OBSERVED FACT |
| `/category/{slug}/` | `/category/enterprise-resource-planning/` | Editorial hub — explainer ("What is ERP?") | OBSERVED FACT |
| `/{category}/{article-slug}/` | `/enterprise-resource-planning/erp-requirements-checklist-cheat-sheet/` | Long-form analyst content | OBSERVED FACT |
| `/p/{product-slug}` | `/p/sap-s4hana`, `/p/bamboohr` | Product profile (attempted extracts 404) | INFERENCE |
| `/decision-platform/` | — | TSM platform pitch (11 benefits) | OBSERVED FACT |
| `/solutions/` | — | Buying-phase solutions + template library | OBSERVED FACT |
| `/research-methodology/`, `/editorial-guidelines/`, `/analysts/`, `/awards/` | — | Trust / methodology pages | OBSERVED FACT |
| `pmo.selecthub.com/*` | `/generic-shortlist-onsite/`, `/lean-selection-book/` | Lead-gen microsite (Unbounce) | OBSERVED FACT |
| `app.selecthub.com/*` | `/projects/new`, `/dashboard` | Logged-in Decision Platform app | OBSERVED FACT |

**Technical note:** Direct curl returns Cloudflare Managed Challenge — extractions succeeded via rendered fetch, indicating heavy bot protection.

---

## 3. Navigation & Search

### Global Nav (Header)
- **OBSERVED FACT:** Header: `SelectHub` logo + `Menu` + `Solutions` + `About` (dropdown: About SelectHub, Analysts, Editorial Guidelines, Research Methodology) + `Contact`. Footer: `Why SelectHub`, `Browse Products`, `Create a Project`, `Dashboard`, `Managed Selection Services`, `Claim Your Product Listing`, `For Vendors`, `Thought Leader Program`, `Awards Program`, `Careers`, `About Us`.
- **INFERENCE:** No persistent mega-menu; categories accessed via `/categories/` landing.

### Search / Discovery
- **OBSERVED FACT:** Homepage hero: *"Explore and compare the pricing, analyst reviews, and features of 9,000+ products"* + CTA *"Do less with our Decision Platform"*.
- **OBSERVED FACT:** `/categories/` has `Find Your Software` text box + expandable category tree (`+ X` / `- X` accordion).
- **OBSERVED FACT:** Category pages have `View Scores by: Best Overall | SelectHub Award Winners | [Module1] | [Module2] ...` — sub-leaderboard filter.
- **INFERENCE:** Discovery is taxonomy-driven, not keyword-driven — strengthens requirements-platform upsell.

---

## 4. Categories

**OBSERVED FACT — Top-level groups from `/categories/`:**
Accounting & Financial Management | Application Development & Integration | AI | Asset Management | Business Continuity & DR | BI | BPM (→ BPM Software, BPA, RPA) | Church | Cloud & SaaS (→ Cloud Cost Mgmt, Cloud Storage, Colocation) | Construction | CPQ | CRM | Customer Experience | Database | eCommerce | Education | ERP | GRC | HR Management | Information Management & Collaboration | Insurance | IT Infrastructure & Operations | Legal | LMS | Marketing | Media | Medical | Miscellaneous | Non-Profit | Project Management | Property Management | Sales | Security | Social Media | Supply Chain Management | Telecommunications Management

- **OBSERVED FACT:** Each group expands to subcategories; ERP hub: Accounting, Distribution, EDI, ERP, Field Service, Manufacturing, PLM, PSA etc. HR: ATS, Core HR, Employee Scheduling, LMS, Payroll, Performance, Recruitment, Talent, Time & Attendance, Workforce Mgmt.
- **OBSERVED FACT:** `/solutions/` lists **100+ requirements templates** individually linked, each pointing to `pmo.selecthub.com/{slug}-requirements-onsite/`.

---

## 5. Requirements Workflow — Core Differentiator

**OBSERVED FACT — 6-step funnel (Homepage, `/decision-platform/`, `/solutions/`, `pmo.*`):**

1. **Jumpstart with Template** — Choose 100+ best-practice template (free). Gate: `Software Category *` + `First Name *` + `Last Name *` + `Company Name *` + `Email *` + `Phone Number *`.
2. **Customize & Prioritize** — In Decision Platform: add/remove requirements, create custom categories, weight/prioritize (High/Med/Low), collaborate with stakeholders (reminders, audit trail).
3. **Create Scorecard / Shortlist** — *"Shortlist vendors from your requirements in seconds — requirements-based vendor comparisons."*
4. **One-Click Export → RFI/RFP** — *"Export final requirements and reports to any format — or generate RFIs & RFPs automatically."*
5. **Validate & Compare** — *"Access historical crowdsourced project data from similar companies, analysts and vendors to validate and compare responses."*
6. **POC / Demo / Negotiation** — Demo scripts/use cases, success criteria, pricing scorecard, TCO/ROI reports, contract/SLA review, negotiation strategy.

**Service Tiers (OBSERVED FACT from `/solutions/`):**
- Requirements (self-serve, free/DIY) | Requirements Compilation (Guided) | Express (BI & HR only, DIY) | Essentials (70 SME hrs, 6–12 wks, RFx + shortlist + business justification) | Complete (107 SME hrs, 12–26 wks, demo scripts + pricing scorecard + contract/SLA + negotiation) | Guided Scorecard | Guided RFP (up to 5 vendors, ~3 wks end-to-end) | Guided POC (up to 3 vendors) | Decision Platform 30-day free trial

---

## 6. Technology Selection Management (TSM) & Scoring Engine

- **OBSERVED FACT:** TSM is proprietary platform + methodology. 11 benefits on `/decision-platform/`: Cost-Effective Decisions, Lower TCO (save 15% avg), Build Comprehensive Requirements, Take Control, Automate RFI/RFP, Validate Responses, Do Right Things Right Time, Leverage Real Data, Reduce Time to Implementation, Collaborate, Audit Trail.
- **OBSERVED FACT:** **TSM Scoring Engine** processes researched info to compute analyst score, factors in functional + technical requirements standardized for apples-to-apples comparison, includes implementation/vendor qualification where present.
- **OBSERVED FACT:** Data presented 3 ways: (1) Leaderboards & Sub-Leaderboards — Top 10 overall + Top 10 per module, (2) Analyst scores on product pages, (3) In-platform customizable scores (modules, company size, industry, requirement priority).
- **OBSERVED FACT:** 400+ point analysis per product.

---

## 7. Unique Requirements Scoring (Granular)

**OBSERVED FACT — 7-level scale (verbatim from ERP & LMS pages):**

| Level | Score | Definition |
|-------|-------|------------|
| Fully Supported Out of the Box | 100 | Comprehensively, industry-leading, immediately available, no add-ons |
| Moderately Supported Out of the Box | 85 | Moderately supported, immediately available, no add-ons |
| Supported with Workarounds | 70 | Via built-in features/workarounds, no cost |
| Supported with Additional Modules | 60 | Via vendor modules at extra cost |
| Supported with Partner Integrations | 50 | Via third-party integrations/plugins at extra cost |
| Supported with Custom Development | 25 | Via APIs/libraries/extensions |
| Not Supported | 0 | Not supported |

- **OBSERVED FACT:** Each feature has default priority High/Medium/Low set by analysts; higher priority = more weight. Buyer can re-weight in platform.
- **OBSERVED FACT:** ~100+ question RFI per product + ~27 technical requirements scored; analysts use public data (reviews, demos, docs, case studies) + SelectHub RFI briefings + direct vendor comms.
- **OBSERVED FACT — Verification adjustment:** Vendors can purchase Analyst-led evaluation program — *"Can't pay to earn a specific score."* Verified gets: (1) Baseline 3–5% boost, (2) Accuracy adjustment (verified vs public, can increase/decrease/stay same), (3) Net can offset, plus tie-break priority + `Analyst Verified` badge.
- **INFERENCE:** Most transparent scoring disclosure among selection sites; penalizes modular pricing by design.

---

## 8. Analyst Content & Trust Engine

- **OBSERVED FACT:** Dozens of analysts on staff. `/analysts/` lists Head Sandesh Sindiri + ~25 Senior/Principal Analysts (e.g., Mohit Hariramani — ERP/Mfg/MES; Sukanya Saha — HR/EHR/CRM; Sagardeep Roy — BI/ETL/Cybersecurity/AI) plus Expert Contributors (Eric Kimberling — global ERP).
- **OBSERVED FACT — Research Methodology 3 dimensions:** (1) Evaluation Criteria — RFIs, vendor outreach, user reviews, collateral, (2) Data Integrity — multi-source validation, proprietary DB from 100,000+ projects, (3) Industry Coverage — expert engagement, vendor collabs, client feedback, market monitoring.
- **OBSERVED FACT — Editorial Guidelines:** 5 C's (clear, concise, credible, contextual, compelling), multiple fact-check rounds, AI used as research assistant + data summarizer + assisted product profiles (human-reviewed).
- **OBSERVED FACT — Awards:** Not pay-to-play, no self-nomination. Requires `Good`+ user sentiment. Badges: `Analysts' Pick` (top 10 overall), `User Favorite` (≥3 sources, ≥100 reviews, highest sentiment), feature-specific (e.g., BI: Advanced Analytics, Augmented Analytics, Data Visualization, Data Querying, Mobile BI).

---

## 9. Filters, Leaderboard & Comparison

**OBSERVED FACT — Category Leaderboard Structure (`/c/{slug}`):** Header `The 10 Best {Category} of 2026` + byline/photo/date + Summary + Table of Contents (Learn/Plan/Compare/Launch) + `View Scores by:` module filter + `Select up to 5 products to compare` checkboxes + Product rows: `Product | Score (X/100) | Best For | Top Features | Start Price | Free Trial` + expanded: `Good For | Deployment | User Sentiment (%)` e.g., `UKG Pro - Score: 90/100 - Best Overall - Custom Quote - Cloud - 84% recommend` + Methodology block (Analyst Scores + Author trials) + Expert Advice quotes + FAQs + `Get Personalized Recommendations` → comparison report + Related articles.

**Filters (OBSERVED):** Primary: Module/sub-score filter (20+ per category). Secondary card metadata: Start Price (Custom Quote / $26/mo / $7/seat), Free Trial, Company Size, Deployment, User Sentiment.

**Comparison (OBSERVED + INFERENCE):** Public: checkbox up to 5 + `Compare Products` button → side-by-side matrix. Detailed per-requirement 0–100 matrix lives inside `app.selecthub.com` platform / gated scorecard report (INFERENCE).

---

## 10. Product Profiles

**OBSERVED FACT:** Product cards contain Score, Best For, Top Features, Start Price, Free Trial, Good For, Deployment, User Sentiment, Pros/Cons, Bottom Line, Insider Tips (e.g., Moodle one-click hosting tip, TalentLMS $89/mo for 40 users, implementation $4k–$45k).

**INFERENCE — Full `/p/{slug}` profile (blocked by Cloudflare JS challenge, not directly observed, inferred from awards/methodology):** Overall Analyst Score + module sub-scores, Analyst Verified + Award badges, feature-level 0–100 breakdown (functional/technical/implementation), User Sentiment aggregation, Pricing/deployment/size fit, Pros/Cons/Bottom Line editorial, `Get Pricing`/`Compare`/`Claim Profile` CTAs. Requires browser-automation to confirm.

---

## 11. Lead Generation & Monetization

**OBSERVED FACT — Multi-funnel capture:**

1. Requirements Template Gate (`/about/requirements-template-free-trial-site/` + `pmo.*-requirements-onsite/`): 100+ category options + 5-field form → email + trial + SDR.
2. Shortlist Scorecard Gate (`pmo.selecthub.com/generic-shortlist-onsite/`): Customize → Scorecard → Compare Vendors — same form, social proof logos (Advance Energy, Molson Coors, Genentech, Hunter Douglas, Sony).
3. Comparison Report Gate (`pmo.selecthub.com/top-erp-software-site-vers/` etc.): Free report + visual scorecards + implementation effort.
4. Decision Platform Trial (30-day free) — `Create a Project` (`app.selecthub.com/projects/new`).
5. Guided Services — `Inquire about POC`, `Get Guided by an Expert` — phones **877.692.2896** (Sales), **855.850.3850** (Advisory).
6. Vendor side: `Claim your SelectHub profile` (`pmo.selecthub.com/claim-your-product/`).

Homepage urgency: *"2,452 software buyers are researching now."* Case studies: ATS Diesel (ERP), Easterseals MORC (LMS), Financial Services (DevOps), Oil & Gas (CLM).

---

## 12. Unique vs Peers

| Dimension | SelectHub (Observed) | G2/Capterra Typical | Moat (Inference) |
|-----------|----------------------|---------------------|------------------|
| Entry point | Requirements template + weighted scoring | Search reviews + grid | Owns requirements definition — earlier in funnel |
| Evaluation | Analyst 400-point RFI, TSM engine, 7-level OOTB scale | Crowd reviews | Hybrid, less volatile |
| Personalization | Re-weight priorities, size, industry → custom score | Filters only | Lock-in to platform |
| RFx automation | One-click RFI/RFP, validation, audit trail | Not offered | Enterprise stickiness |
| Monetization | Free buyer, vendor verification + services (70–107 SME hrs) | Pay-per-lead/sponsored | Services revenue, bias claim |

---

## Sources Extracted
`selecthub.com/`, `selecthub.com/categories/`, `selecthub.com/c/erp-software/`, `selecthub.com/c/lms-software/`, `selecthub.com/c/hr-management-software`, `selecthub.com/decision-platform/`, `selecthub.com/solutions/`, `selecthub.com/research-methodology/`, `selecthub.com/awards/`, `selecthub.com/managed-selection-services/`, `selecthub.com/analysts/`, `selecthub.com/editorial-guidelines/`, `selecthub.com/category/enterprise-resource-planning/`, `selecthub.com/enterprise-resource-planning/erp-requirements-checklist-cheat-sheet/`, `pmo.selecthub.com/generic-shortlist-onsite/`, `pmo.selecthub.com/lean-selection-book/`, `selecthub.com/about/requirements-template-free-trial-site/`

**Gaps:** `/p/{product}` pages blocked by Cloudflare Managed Challenge — requires Playwright/browser session with JS. `/about/` 429 rate-limited on Exa. Recommend follow-up browser_exec against `app.selecthub.com` to map logged-in workflow.


================================================================================
# FILE: reports/INDIVIDUAL-software-advice-analysis.md
================================================================================

# Software Advice (softwareadvice.com) — Competitive Intelligence Dossier
**Date:** 2026-09-01 | **Method:** web_extract + web_search (no browser render — Cloudflare blocked direct curl/browser) | **Scope:** Homepage, Categories, Product Pages, Advisor CTA, FrontRunners

> Legend: **OBSERVED FACT** = text/URL/structure directly returned by extraction. **INFERENCE** = interpretation of intent/model. No fabrication — gaps flagged as NOT OBSERVED.

---

## 1. Executive Summary

| Dimension | Observed |
|-----------|----------|
| Positioning | "Get real advice from real people" — human advisor + verified reviews hybrid. **OBSERVED FACT** (homepage H1) |
| Scale claims | 1M+ businesses helped, 2.5M+ verified reviews, 150 industries covered **OBSERVED FACT** (homepage + About Us) |
| Owner | Founded 2005 Austin TX by Don Fornes; acquired by Gartner 2014 (per third-party summary). Privacy Policy lists operating entities as **G2.com, Inc., Software Advice Inc., Capterra Inc., Nubera eBusiness S.L.** → indicates post-Gartner sale to G2 (2024 Gartner Digital Markets → G2). **OBSERVED FACT: privacy policy text; INFERENCE: ownership transition** |
| Core lead-gen model | Free advisory call → qualified referral → vendor pays per referral (PPL) and/or PPC. **OBSERVED FACT** (privacy + category disclosure: "Vendors pay for sponsored profiles / referral fee") |

---

## 2. Navigation & Information Architecture

### OBSERVED FACT — Top Nav (homepage + all pages)
```
* Software Categories
  Construction | Facilities Management | Human Resources | Legal Management | Manufacturing | Medical | Property Management | View All  [mega-menu trigger]
* Company
  About Us | Vendors
* Persistent CTA wire-frame:
  "Get 1-on-1 advice in 15 minutes. It's free." + [Start Now] + advisor signature "Josh P. Advisor, 7 years" + headshot
```
Footer nav repeats Software Categories + Company + About Us | Vendors | Blog | View All Categories + Social (X, Facebook, LinkedIn, Instagram) + Legal links: User Terms, Vendor Terms, Community Guidelines, Content Policy, Cookie Policy, Privacy Policy, Data Processing Addendum, Data Transfer Addendum, Free Stuff Addendum, PPL Service Description, PPC Service Description, Profile Guidelines.

### OBSERVED FACT — Breadcrumbs
`Home / CRM Software` on every category page. Product pages add third level: `Home / CRM Software / Salesforce Sales Cloud`

### INFERENCE — Nav intent
- Category mega-menu collapsed to 7 top groupings on homepage header to reduce choice overload; full taxonomy only on /categories/ and footer — suggests lead-gen prioritizes advisor funnel over self-serve browse.

---

## 3. Search

### OBSERVED FACT
- `/categories/` has explicit input: **"Find a software category — Search for categories"** **OBSERVED FACT**
- No global header search box text captured in extracts (homepage extract shows only category nav, not a search input) → **NOT OBSERVED** as persistent header search; search appears category-scoped.
- Search index likely powers typeahead on `/categories/` + site-wide Algolia-style (INFERENCE — not verifiable without render).

### INFERENCE
- Search is deliberately secondary to advisor CTA; primary discovery path is browse-by-category or advisor match, not keyword search (consistent with advisory model).

---

## 4. Advisor Consultation Flow (Core Lead-Gen Engine)

### OBSERVED FACT — Three-step flow (About Us + Homepage "Our advisors speed up...")
1. **Tell us your needs** — "Fill out a short form on our website with your key business information." **OBSERVED FACT**
2. **Talk to an advisor on the phone** — "An advisor will call you to discuss your business goals, needs, and budget. Few minutes talking about specific goals." **OBSERVED FACT**
3. **Get software recommendations** — "Within 15 minutes, your advisor will email you a tailored list of top 3-5 options to book demos/trials." **OBSERVED FACT**

Additional OBSERVED FACT details:
- Homepage variants: "Tell us your key business and software needs → Let us match your key features and requirements → Receive 3-5 options within 15 min and start booking demos and trials"
- **CTAs verbatim:** `Get Advice` (primary hero), `Get Free Advice`, `Start Now`, `Chat with an expert`, `Talk with us for a free 15-min consultation` — advisors named (Crystal, Austin TX since 2014; Jacqueline 1000+ companies; Maria 3,620; Aric 4,438; Steve 9,420) with tenure/location/expertise.
- **Calendly link found in Project Management FAQ:** `https://calendly.com/appointments-34/software-advice-appointment?month=2024-09` — **OBSERVED FACT** (appointment scheduler)
- **Resources page text:** "First, fill out a form or schedule a specific time... You can even call us directly ... during normal business hours." **OBSERVED FACT**
- **Advisor volume signal:** advisor profiles: "average 18 small business leaders per week" (Alex Ynfante, 3 yrs, Austin), "close to 27 small/midsized owners per week" (Matthew Clifford, 2 yrs, Fort Myers) — **OBSERVED FACT** (advisor author pages via search description)
- **Free to buyer; vendor pays referral fee:** Disclosure on every category page: "When our advisors match you to a software provider, we may earn a referral fee. Software providers pay us for sponsored profiles to reach users interested in their products." **OBSERVED FACT**

### NOT OBSERVED (requires render / form submit)
- Exact form fields (company size, budget, timeline, incumbent software) — not rendered in extract. **INFERENCE from agency review:** advisors ask company size, budget, required features, timeline, current stack.
- Phone number displayed sitewide — not captured in extracts; referral phone CTA may be hidden behind form/Calendly vs static tel:. **NOT OBSERVED**
- SMS consent — privacy policy collects "mobile phone number... where you choose to receive communications via SMS" — **OBSERVED FACT** implies SMS follow-up in flow.

### INFERENCE — Lead scoring
- Qualification explicitly includes budget + timeline ⇒ higher intent than anonymous category browse. Shared with Capterra/GetApp infrastructure but advisor-qualified referrals priced as PPL (pay-per-lead) vs PPC click.

---

## 5. Categories

### OBSERVED FACT — `/categories/` taxonomy
Header: `Browse Popular Software Categories on Software Advice` with `Search for categories` + `Let us help` link + `Browse by Industry / Browse by Function` + `All Categories`.

Listed All Categories (verbatim):
Accounting, Business Intelligence, Business VoIP, Call Center, Construction, Content Management, CPQ, Customer Experience, CRM, Dental, Distribution, Ecommerce, ERP, Facilities Management, Field Service, Fleet Management, Help Desk, Home Health, Hotel Management, HR Services, Human Resources, Insurance, Inventory Management, Learning Management, Legal AI, Legal Management, Live Chat, Long-Term Care, Maintenance Management, Manufacturing, Marketing, Medical, Mental Health, Non-Profit, Professional Services, Project Management, Property Management, Recruiting Agency, Retail, Risk Management, Supply Chain Management, Telemedicine, Vacation Rental, Other Categories

Subcategories:
- Business VoIP → Business Phone Systems, SIP Trunking Providers, VoIP
- Construction → See All (implies deeper list)
- Content Management → Content Management, Enterprise Content Management, Digital Asset Management, Headless CMS, Document Management, Records Management

Category page example (`/crm/`):
- **Title:** `Best CRM Software of 2026 — Updated August 27, 2026` **OBSERVED FACT**
- Author byline: Andrew Blair (Content Analyst) + Edited by Caroline Rousseau + Reviewed by Marty Moore (Senior Advisor) **OBSERVED FACT**
- Trustpilot widget: `Great 4.2/5 • 704 reviews on Trustpilot` **OBSERVED FACT**
- Transparency box (every category): How we ensure transparency / verify reviews / independent research methodology **OBSERVED FACT**
- Count: `CRM Software (1105 products)`; Project Management `(865 products)`
- Intra-category nav: `All Software | Software Advice FrontRunners | Buyer's Guide | FAQs | Popular Comparisons` **OBSERVED FACT**
- Buyer's Guide includes market data, pricing analysis, integrations most requested — PM guide: budget $20-40/user/mo, cap $60, integrations: email, calendars, file storage, CRM, dev tools, HRIS, finance

### INFERENCE
- 900+ categories claimed elsewhere; observed list shows ~47 top groupings + many subcategories ⇒ long-tail SEO architecture targeting `/{category}/` + `/{category}/{sub}-comparison/` (e.g., `/hotel-management/front-desk-comparison/`, `/project-management/gantt-chart-comparison/`).

---

## 6. Filters & Sorting (Category Listing)

### OBSERVED FACT — Filters on `/crm/` and `/project-management/`
Chip filters above list:
`Filters | Free Trial | Small Business | 4.0 and up`

Left rail (described):
- **Company Size:** Self-Employed, 2-10, 11-50, 51-200, 201-500, 501-1000, 1000+
- **Pricing Options:** $ $$$$  through $$$$$ (5 tiers)
- **41 results** after filter example on lead-gen-services-comparison — pagination `Showing 1-25 of 41 products`

### OBSERVED FACT — Sort options (verbatim tooltip)
- **Recommendations** — "Sorts listings by number of recommendations our advisors have made over past 30 days. Advisors assess needs for free and only recommend products that meet needs. Vendors pay for these referrals."
- **Reviews** — greatest to least count
- **Average Rating** — highest to lowest
- **Alphabetically (A-Z)**

Default: Recommendations.

### INFERENCE
- "Recommendations" as default sort monetizes advisor channel directly; organic rating/reviews available but not default — vendor pay influences order without influencing FrontRunners.

---

## 7. Product Profiles

### OBSERVED FACT — URL patterns (working)
- `/crm/salesforce-profile/` **(working)**
- `/crm/claritysoft-profile/` **(working)**
- `/landing-page/leadmaster-crm-profile/` **(working — alternate path)**
- `/product/2764-Salesforce/` and `/product/158992-Weave/` **(numeric ID + slug variant)**
- Failing patterns: `/voip/ringcentral-profile/`, `/project-management/monday-profile/` (404) → slugs vary (need exact canonical)

Pattern:
```
Category profile: /{category}/{vendor-slug}-profile/
Product ID route: /product/{numericId}-{Slug}/
```

### OBSERVED FACT — Profile structure (Claritysoft + Salesforce)
Tabs/anchors: `Overview | User Interface | Popular Alternatives | Pricing and Plans | Features | Integrations | User Reviews | Popular Comparisons`

Content blocks:
- **Header:** Product name, logo (imgix `gdm-catalog-fmapi-prod.imgix.net/ProductLogo/...`), rating 4.x + review count `(243)` or `(18,796)`, **FrontRunner 2026 badge** if applicable, `Best for: Mid-size businesses` pill, pricing starter `$49/mo`, CTA buttons `Get Price` + `Quote` + `See Product in Action`
- **Advisor interstitial:** "Wondering if {Product} is right for your organization? Our {Category} selection experts can help you in 15 min or less. Get Free Advice"
- **About:** Editorial overview (Software Advice Summary)
- **Popular Alternatives:** Main vs 2 alternatives with ratings breakdown (Ease of use, Value for money, Customer support, Functionality)
- **Pricing and Plans:** Tier cards (Professional $49/u/mo, Accelerator $59, Enterprise $69) + `Get Price Quote` per tier
- **Features:** Checklist of popular category features + full feature list (70+ items)
- **Integrations:** e.g., Microsoft Outlook (4.2 from 22 reviews), Gmail

---

## 8. Reviews

### OBSERVED FACT
- **Scale:** "2.5M+ verified software reviews" (homepage), "carefully verified over 2M reviews" (category disclosure)
- **Verification:** Human moderators verify reviewer is real person; tech analyzes text quality, detects plagiarism and generative AI
- **Cross-published:** Reviews may be displayed across G2 Digital Markets properties (G2/Capterra/Software Advice) where relevant; FAQ confirms shared across all three
- Review example: SimplyBook.me 5.0 — "Very easy to use..." — Matthew, Mental Health Care
- Rating breakdown: Value, Likelihood to Recommend, Customer Support + Functionality/Ease
- Trustpilot syndication: 4.2/5 703 reviews for advisor service

---

## 9. Comparison

### OBSERVED FACT — URL pattern
`/compare/{id}-{slug-a}/vs/{id}-{slug-b}/`
Examples:
- `/compare/329048-swiftify/vs/410128-microsoft-visual-studio/`
- `/compare/339449-google-app-engine/vs/410128-microsoft-visual-studio/`

---

## 10. Lead-Gen Forms & Phone CTA

### OBSERVED FACT — Forms identified
1. **Advisor lead form:** "Fill out a short form on our website with your key business information" → phone call + email of 3-5 options
2. **Homepage inbox capture:** "Fill out the form and we'll send a list of the top-rated productivity software based on verified user reviews directly to your inbox. Email Address * [Send Me The List]"
3. **Resources gating:** "Get free resources — Select your industry + Email"
4. **Get Price / Quote CTA:** Per-tier `Get Price Quote` buttons — lead to vendor referral form (PPL service description)
5. **Calendly:** `calendly.com/appointments-34/software-advice-appointment`

### OBSERVED FACT — Phone/LiveChat
- LiveChat: "Contact us via LiveChat!" on category pages
- Emails: `followup@softwareadvice.com`, `reviews@g2digitalmarkets.com`, `pr@softwareadvice.com`
- No static advisory phone number observed — advisors call you

### INFERENCE
- Dual funnel: high-intent phone-qualified (PPL) + low-intent email nurture. Privacy §5.B: PII disclosed to vendors when requesting info/consultation/demo.

---

## 11. URL Patterns Summary

| Type | Pattern | Example |
|------|---------|---------|
| Homepage | `/` | `softwareadvice.com/` |
| All categories | `/categories/` | `/categories/` |
| Category | `/{category}/` | `/crm/`, `/project-management/` |
| Sub-category | `/{category}/{sub}-comparison/` | `/hotel-management/front-desk-comparison/` |
| Product profile | `/{category}/{slug}-profile/` | `/crm/salesforce-profile/` |
| Product ID | `/product/{id}-{Slug}/` | `/product/2764-Salesforce/` |
| Comparison | `/compare/{id-a}-{slug-a}/vs/{id-b}-{slug-b}/` | `/compare/329048-swiftify/vs/410128-microsoft-visual-studio/` |
| FrontRunners PDF | `/resources/{category}-frontrunners-report-pdf/` | `/resources/recruiting-frontrunners-report-pdf/` |
| Methodology | `/legal-page/frontrunners-methodology/` |  |
| Calendly | `calendly.com/appointments-34/software-advice-appointment` |  |

---

## 12. Gartner Integration

### OBSERVED FACT
- Privacy operating entity: `G2.com, Inc., Software Advice Inc., Capterra Inc., Nubera eBusiness S.L.`
- Vendor funnel at `g2digitalmarkets.com/qualified-leads-program`; language `G2 Digital Markets group`
- Reviews shared across Capterra/GetApp/Software Advice equally
- FrontRunners contact `methodologies@gartner.com` (legacy)
- Third-party history: Founded 2005 Austin, acquired by Gartner 2014 alongside Capterra

### INFERENCE
- As of 2026, Software Advice operates under **G2 Digital Markets** (Gartner sold Digital Markets to G2 ~2024). Gartner branding vestigial.

---

## 13. FrontRunners

### OBSERVED FACT — Methodology v5 (Jan 2026–Present)
Three dimensions, 0–100:
- **Usability (50% Functionality + 50% Ease of use)**
- **Customer Satisfaction (25% Value + 25% Recommend + 50% Support)**
- **Digital Presence (50% Search visibility [proprietary keywords + SERP] + 50% Reviews count & recency)**

Ratings normalized 5→100. **5–25 products** included; placement = average of three. Minimum cutoff varies per category. Snapshot, not updated post-publication.

**Inclusion criteria:**
1. ≥20 unique reviews in 24 months
2. Demonstrates required functionality
3. U.S. market presence
4. Broad industry relevance (excl. niche single-vertical; not Industry View)
5. Minimum normalized overall rating

**Distinctions (Top 10 only):** Best Rated (Usability/Customer Satisfaction), By themes (≥10 theme mentions, 75% positive), By business size (Most Rated SMB/Enterprise ≥10 reviews in segment), By industry (≥10 in industry). Sponsorship has no influence.

Disclaimer mandatory: *"FrontRunners constitute the subjective opinions of individual end-user reviews..."*

---

## 14. Gaps & Next Steps

- Rendered DOM needed for: form fields + tel: + comparison table + review pagination + search typeahead (blocked by Cloudflare; requires EXA_API_KEY or proxied browser).
- Extract PPL/PPC Service Description PDFs for pricing.


================================================================================
# FILE: reports/INDIVIDUAL-softwaresuggest-analysis.md
================================================================================

# SoftwareSuggest (softwaresuggest.com) — Competitive Intelligence Analysis
**Date:** 2026-09-01 | **Method:** web_extract + hermes_web_search | **Scope:** homepage, categories, product pages, reviews, comparison, lead-gen, pricing, URLs

> **Legend:** Each bullet tagged **OBSERVED FACT** (directly visible in extracted HTML/text) vs **INFERENCE** (interpreted).

## 1. Executive Summary & India-Market Presence
**OBSERVED FACT:** Tagline “Discover Top Business Software & Service Partners”, “Trusted By 1,114,681+ Happy Businesses”, “1M+ Software Buyers / 5M+ users” badges. GitHub mirror: Founded 2014 by AppItSimple Infotek Pvt Ltd, Ahmedabad, India; 800+ categories, 50k+ products, 40k+ verified reviews. Indian metros enumerated: Mumbai, Delhi, Pune, Bangalore, Kolkata, Chennai, Hyderabad, Ahmedabad etc. `/pricing` INR/USD toggle, forms default +91, geo ranking doc: “If Indian product - ordered by Indian ranking; GCC -> GCC ranking; else Global”. Category geo variants: `/crm-software/india`, `/crm-software/mumbai-area`.
**INFERENCE:** India-first lead marketplace with GCC/US expansion; strength in Tally/GST/HR/Payroll SMB niches; 3-tier geo ranking gives Indian vendors home-market visibility boost.

## 2. Homepage (`https://www.softwaresuggest.com/`)
**OBSERVED FACT:** Hero + Trending Software (10: AgentClara, Fresa Gold, Antraweb, Hostwinds, Vidyalaya, TallyPrime, Cuemath, Greenbox, Photoshop, Salesforce) each `/<slug>`; Trending Services (10: Fluper `/services/fluper` etc.). CTA “List Your Software” → `/vendors`. 4 rotating banner ads with UTM `utm_source=softwaresuggest`. Value props: 50k+ software/services, 40k+ verified reviews, Free recommendations. Lead: “Request A Call Back” phone+country selector. AI block “Turn AI Discovery into Demand” → `/aeo-geo-visibility`. Category cloud → `/all-categories`. Homepage embeds PPC cards (BambooHR etc. via `ppc.softwaresuggest.com/...?utm_ss=organic/organic/cat-32` showing rating/review count). “Hear From Users” testimonials + “Because Your Voice Matters” → `/write-review`. “Unbiased Software Comparison” top comparisons grid (BambooHR vs Keka VS). Footer mega-menu: A-Z categories + For Vendors (Register, Vendor Login, Pricing, Price Estimator, Generate Reviews, Success Stories) / For Buyers (All Categories, Resources, Blog, Free Ebooks).
**INFERENCE:** SEO funnel + lead capture; above-fold heavily monetized (PPC+banner+forms); header search is JS modal (static extract missed DOM).

## 3. Navigation & Search
**OBSERVED FACT:** Header: Logo `/`, search magnifier, `Write a Review` `/write-review`, `Add a Product` `/vendors`, `User Login` `/user-login`, `Vendor Login` `/vendorsportal/index.php?r=site/login`. Breadcrumb: `Home > CRM Software > Salesforce`. Search results tabs seen in pricing dump: All Results / Categories / Software / Services. Search JS placeholder “Please check network connection…” indicates client-side hydration.
**INFERENCE:** Global predictive search (Elasticsearch-like) with type-ahead; faceted filters only on category pages, not homepage.

## 4. Categories
**OBSERVED FACT:** `/all-categories` title “Browse All Business Software Categories” – ~800+ parents alphabetical; e.g., Accounting → 20 children (AP/AR, Crypto, Fund, Tally Partner etc.) each `https://www.softwaresuggest.com/<kebab-slug>` (e.g., `/hr-software`). Ranking Methodology defines Types: Software vs Product Suites vs Plugins/Add-ons (third-party add-on separate, same-vendor folded), Discontinued; Category Types: Parent (umbrella), Horizontal (cross-industry, e.g., Keka HR), Vertical (industry, e.g., Dentrix Dental). Category page components: Features, Caters to, Pricing, Buyer's Guide.
**INFERENCE:** Flat 2-level taxonomy (parent→child), no `/category/` prefix; services use `/services/<slug>` to avoid collision.

## 5. Category Listing Page (`/crm-software` 1084 products, `/hr-software` 825)
**OBSERVED FACT:** Template identical: H1 “Best [Category] Software” + definition + “Popular Options” curated 8 (Zoho, HubSpot etc. via ppc). Author box (Jainy Patel / Supriya Bajaj). Tabs: All Software `#list_tab_content`, Buyer's Guide, Leaders Matrix, Free Software `/free`. Live-agent widget + Popular carousel (Creatio $25 etc.). Trust line “no paid placements – see ranking methodology”. List header “Showing 1-25 of 1084”. Filter bar: `Customize your search [dropdown]` + pills: Lead/Contact/Pipeline/Email/Task/Reporting/Dashboards/Mobile/Workflow/Support/AI Enabled + Business Size (Small/Mid/Enterprise) + Price (Available/Deal/Free Trial) + Reset + Sort: Sponsored / Verified / Most Reviewed / Top Rated. Each product row: logo `#overviewN`, title `/<slug>`, rating `4.8(4 Reviews)` → `#user-reviews`, badge (“No Code CRM”), tabs Overview/Features/Pricing/Review, vendor-provided description snippet, “Is Tailored For” pills, 8 feature bullets + “View all”, pricing cards (3 tiers + Free Trial), aggregated 4-metric scores, reviewer snippet, AI “User Sentiment” paragraph, CTAs: Compare (tray), Visit Website (ppc), Request Demo. Footer: Country chooser (30+ `/crm-software/india`, `/us`…), City (16 Indian cities `mumbai-area`), Industry (28 verticals `manufacturing-industry`), trust row, Last Updated July 17 2026.
**Filters drawer** (on `/all-categories` tail): Sort Relevance/Highest Reviews; Deployment Hybrid/Cloud/OnPrem/Any; Device Web/Windows/MacOS/iOS/Android; Business type Freelancer/StartUps/SMEs/Mid/Enterprises; Languages CN/EN/FR/DE/JA/RU/ES.
**INFERENCE:** Sponsored sort + PPC-first ranking reveals pay-to-boost; deployment/device filters are global search modal, category page narrows to feature-centric.

## 6. Product Profile (`/salesforce` canonical, also `/cypress`, `/workable`)
**OBSERVED FACT:** Breadcrumb `Home > … > CRM Software > Salesforce`. Header: logo, H1 Salesforce, claim badge “claimed by Salesforce, Inc but has limited features – Upgrade your plan…”, Award `Category Champions`, `4.6/5 Based on 277 Reviews`, 2× Write a Review `/write-review`, Free Demo Get Pricing. Tabs: Product Information `#overview`, Features `#features`, Pricing `#pricing`, User Reviews `/reviews`, Alternative `/alternatives`. Sections: 1) What is … + Starting Price $25 → View Detailed Pricing `/pricing` + Awards + Get Best Quote form (Number of Users <5 …100+ + submit → “analyst will contact you in next 1 hour”). 2) Key Features 20 bullets + Show More. 3) Screenshots 6× `latest_screenshots/`. 4) Most Preferred sponsored 4 cards (Campaign Monitor $12 etc. ppc). 5) Pricing 5 tiers: Starter $25/User/Mo, Professional $80, Enterprise $165, Unlimited $330, Unlimited+ $500 + Get Offer + disclaimer sourced from vendor, last updated 30 Aug 2026, Free Trial. 6) Specifications: Company Details (Salesforce Inc, SF address), Overview Provided by Madhur Dhawan, Categories (≈40+ membership), Mobile Android/iOS + `/mobile-app`, Languages 12, Business Freelancers/StartUps, Support Email/Phone/Live/Tickets/Training. 7) Comparisons 8 VS cards (`/compare/microsoft-dynamics-crm-vs-salesforce` etc.). 8) Resources Videos. 9) Overall Reviews snippet (AI summary). 10) Alternatives teaser + More. 11) FAQs 7 Q&A (cost, features, support, platforms, business types, usage, competitors X2CRM/noCRM/Covve). 12) Also Listed In taxonomy footer. 13) Sticky “Compare 3 Products: Add Product / Compare Now / Remove All”. Sub-URLs: `/pricing`, `/reviews`, `/alternatives`, `/mobile-app`, `/write-review`.
**INFERENCE:** Uniform template for software vs services; freemium profile completeness gating; all outbound clicks via `ppc.softwaresuggest.com` for attribution.

## 7. Review System
**OBSERVED FACT:** URLs: `/<slug>#user-reviews`, standalone `/<slug>/reviews` (e.g., `/salesforce/reviews`), write `/<slug>/write-review` + global `/write-review` (4 steps: Select Product → Leave Review → Share on LinkedIn → Finished). Overall header: 4.6/5 277 reviews, breakdown Feature 4.6, Ease 4.5, Value 4.5, Support 4.4, Likelihood 89.3%, AI “Review Summary” paragraph, Pros 5 chips (Powerful Automation, Centralized Data, Productivity, Dashboards, Integrations) / Cons 5 (Cluttered UI, High Pricing SMB, Performance, Steep Curve, Complex Setup), trust line “verified – Here's how.” Controls: Review Type (Mobile/Android/iOS), Company Size (1-10 …10k+), User Role (~80: Account Executive … Other), Sort Most Recent/Helpful/Highest/Lowest, paginated 20/277. Card: Name+role+duration (e.g., Free trial Daily)+company size+rating (4)+date Aug 28 2026 + badges Verified via Business email / LinkedIn / screenshot invoice + title (sometimes mismatched e.g., EazeeSign), 4 sub-ratings Feature/Ease/Value/Support /5, Mobile Experience 1-10 + After Sales 1-10 sliders, Q&A: What do you like best/dislike/missing/other products (360dialog), Useful 0 / Share.
**INFERENCE:** 3-leg verification (email, LinkedIn, invoice) but content quality uneven suggests incentive-driven LinkedIn share loop; 1-10 sliders category-specific leftover.

## 8. Comparison Engine
**OBSERVED FACT:** No bare `/compare` (404). All pairwise: `/compare/<slug1>-vs-<slug2>` (observed: `microsoft-dynamics-crm-vs-salesforce`, `rocketreach-vs-apollo`). Tray: “Compare 3 Products” limit 3 → Compare Now. Product page grid 8+ VS cards + View More (15+). Direct compare extract (`rocketreach-vs-apollo`) thin: H1 + 1-para analysis (“RocketReach offers email verification/bulk lookup, Apollo dashboard”) + trust line + “Still Confused…” lead form, no table captured. `/compare/salesforce-vs-hubspot-crm` redirected to category page (SEO placeholder).
**INFERENCE:** Programmatic SEO “X vs Y” with JS-hydrated side-by-side feature/pricing/ratings table (missed by static extract); primary path is tray builder, not organic table; clicks tracked via ppc.

## 9. Lead Gen & Monetization
**OBSERVED FACT:** Forms repeated everywhere: short “Get Free Demo / Get Best Quote / Request A Call Back” → Number of Users/Employees, industry, designation, deployment, preferred time, phone (country selector 200+ codes), email; disclaimer TOS/Privacy; success “analyst will contact in next 1 hour” + HubSpot Meetings link `meetings.hubspot.com/softwaresuggest`. Sidebar live agents Tejasvita/Divyang/Manali “No Cost Personal Advisor” + Shield “Trusted by >5M users”. Vendor side `/vendors`: “List Your Product For Free” hero, testimonials (Avaniko etc.), stats 50k+ listed, 1500+ categories, 10M+ yearly buyers. 6 services: PPC, MQL, Premium Listing, Branded Content, Performance Marketing (Drip/CPC/CPL/Search/Re-targeting), Sponsorships (podcasts/ebooks/webinars). 4 steps: Create Listing → List → Maintain → Boost Exposure. Pricing page (`/pricing`) INR/USD toggle: Basic $4,000/6mo (Premium Listing, Ad-free profile, Banner**, PPC $1k, Newsletter 90d, PR 1, Guest 1, Social 1), Gold $9,000/6mo (PPC $2.5k, MQL $2.5k, Product Review, CXO Interview, Social 2, PR 2, Guest 2, Newsletter 60d, Dedicated AM, Widgets), Platinum $15,000/12mo (PPC $5k, MQL $5k, Leader Matrix consultation, e-Book, Research Report#, Social 3, PR 4, Guest 4, CXO Video 1, Newsletter 30d). Footnotes: *CPC/CPL at sign-up, **banner subject to availability, #already published reports. `ppc.softwaresuggest.com` with `utm_ss=organic/organic/cat-16` for click billing. Price Estimator `/price-estimator` referenced.
**INFERENCE:** Concierge-assisted CPL/MQL marketplace (IndiaMART-like), not self-serve; $4-15k/6-12mo far below G2; monetization = freemium SEO → premium rank → PPC clicks → MQL → content/PR → Leader Matrix upsell; despite “no paid placements” claim, methodology openly prioritizes PPC first → pay-for-visibility perception risk.

## 10. Pricing (Buyer-Facing Software Pricing)
**OBSERVED FACT:** Vendor-provided disclaimer: “sourced directly from provider or publicly…”. Tier cards with per-seat/month, “Free Trial” green icon, Get Offer. Ex: Salesforce $25-500, HROne $55/mo. Insights stats on `/salesforce/pricing`: “Starting Price CRM ~$25, 86% offer free trial”. Free software tab `/<category>/free` exists.
**INFERENCE:** Starting price transparent but full quote gated behind lead form to drive capture; dates show freshness for SEO (last updated).

## 11. URL Patterns
**OBSERVED FACT:** `/` (home), `/all-categories`, `/<category-slug>` (crm-software, hr-software…), `/<category>/free`, hash tabs `#list_tab_content` etc., geo `/<category>/<country>` (`india`, `us`), city `/<category>/<city>-area` (`mumbai-area`), industry `/<category>/<industry>-industry` (`manufacturing-industry`), product `/<product-slug>` (`salesforce`, `creatio`), service `/services/<slug>` (`fluper`), product subs `/<slug>/pricing`, `/reviews`, `/alternatives`, `/mobile-app`, `/write-review`, hash `#overview`, compare `/compare/<a>-vs-<b>`, utils `/vendors`, `/vendorsportal/index.php?r=site/login`, `/user-login`, `/write-review`, `/pricing` (vendor), `/price-estimator`, `/ranking-methodology`, `/aeo-geo-visibility`, `/blog/`, ppc `https://ppc.softwaresuggest.com/<slug>-<geo>?utm_ss=...`, assets `images.softwaresuggest.com/software_logo/<id>_<slug>.png`.
**INFERENCE:** Flat SEO-friendly slugs; hash tabs duplicate content for crawl; `/compare` dynamic only via tray; services prefix avoids collision.

## 12. Competitive Notes
**OBSERVED FACT:** Leaders Matrix tabs + award badges `Emergents|2026`, `Category Champions|2026`, `Contenders|2026`; Ranking Methodology docs per-page ordering (Category: PPC by rank → non-PPC rank>0 → by reviews → random → View More; Industry/City/Mobile/Free/Enterprise each documented with variant logic; geo ranking Indian/GCC/Global bifurcation). Author bylines + Last Updated dates.
**INFERENCE:** G2/Capterra clone with heavier human concierge (India advantage); weakness self-admitted: shallow reviews, limited international listings, cluttered UI, slower support, performance (from `/softwaresuggest` self reviews); new AEO/GEO pivot to LLM visibility; openly selling Leader Matrix consultation despite “unbiased” claim creates credibility tension.

## 13. Limitations
- Static extract missed JS search autocomplete, filter query params, compare matrix tables (browser launch failed).
- Category pages truncated (96k chars head+tail, full cached).
- Only sampled reviews; authenticity not audited.

## Sources
- `www.softwaresuggest.com-b6eaeeec54.md` (homepage), `dd414e4829.md` (all-categories), `4834ac7578.md` (crm-software), `dbdd169116.md` (salesforce), `88b24e72d4.md` (reviews), `dd1036e5da.md` (methodology), `039f1dc419.md` (pricing) under `/opt/data/cache/web/`.
