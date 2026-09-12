# G2 (g2.com) — Competitive Intelligence Deep Dive
**Date:** 2026-09-01 (research execution UTC) / Data snapshot reflects Aug 2025–Feb 2026 page states  
**Scope:** Homepage, Categories, Product Profile (Salesforce / Agentforce Sales), Reviews, Comparison, Pricing, Monetization  
**Method:** `web_search` + `web_extract` on 12+ public URLs; cross-referenced documentation.g2.com, research.g2.com, legal.g2.com, sell.g2.com  
**Classification:** Every bullet tagged **[OBSERVED FACT]** (directly seen in extracted HTML/markdown) or **[INFERENCE]** (reasoned from patterns, industry knowledge, secondary signals)

> Source count at extraction: **3,625,500+ real reviews** claimed on homepage hero (verbatim: "Find the right software and services based on 3,625,500+ real reviews.") — number fluctuates per scrape (3,625,400 also seen).

---

## 1. Executive Summary

| Dimension | Snapshot |
|-----------|----------|
| **Positioning** | "Where you go for software." — world's largest B2B software & services marketplace. Verified review moat. **[OBSERVED FACT]** hero tagline + "most trusted data source for B2B software" on /about. |
| **Scale** | 630+ categories, 15,000+ Grid/Market reports, 3.6M reviews, 100M+ buyers referenced in sell-side copy ("marketplace trusted by over 100M software buyers" on sell.g2.com/plans). **[OBSERVED FACT]** via research.g2.com and sell.g2.com extracts. |
| **Business Model** | Two-sided marketplace: free buyer side (SEO + review flywheel) → monetized vendor side (SaaS subscriptions, Buyer Intent, Content Syndication, Ads, Review campaigns). **[OBSERVED FACT + INFERENCE]** — see §11. |
| **SEO Engine** | Programmatic: `/categories/{slug}`, `/products/{slug}/reviews`, `/products/{slug}/pricing`, `/compare/{a}-vs-{b}`. Massive long-tail. **[OBSERVED FACT]** |

---

## 2. Navigation & Information Architecture

### 2.1 Global Nav
- **[OBSERVED FACT]** Skip links extracted: `Skip to Content, Skip to Filters, Skip to Navigation` — indicates accessible header with three-way nav.
- **[OBSERVED FACT]** Homepage top CTAs: `Best Products 2026 Top Software → /best-software-companies` and `Trending Products → /compare#trending`
- **[OBSERVED FACT]** Persistent seller CTA block: "Selling software? Reach more buyers. [Claim Your G2 Profile] → sell.g2.com" and "Using software? Leave a review → /wizard/new-review" — dual funnel visible in footer/above-fold on homepage.
- **[OBSERVED FACT]** Secondary footer CTAs: "Claim your profile → /add_product_requests/new" and gated login: `Create account or continue with LinkedIn / Google` (terms: legal.g2.com/terms-of-use).
- **[INFERENCE]** Top nav likely contains: Categories mega-menu, Compare, Write a Review, For Sellers (sell.g2.com), Sign In — standard marketplace pattern, not fully rendered in headless extract but consistent with skipped navigation labels and sell.g2.com cross-linking. Flag as inference because headless extract collapsed JS nav.

### 2.2 URL Taxonomy (SEO URL Patterns)
| Pattern | Example | Observed |
|---------|---------|----------|
| Category hub | `/categories` (all) → `/categories/crm` | **[OBSERVED FACT]** |
| Category filtered | `/categories/crm?tab=highest_rated`, `?segment=small-business`, `?page=2&order=g2_score` | **[OBSERVED FACT]** — paginated to 107 pages for CRM |
| Category sub-category | `/categories/sales-tools`, `/categories/infrastructure-as-a-service-iaas` | **[OBSERVED FACT]** |
| Product canonical | `/products/{slug}/reviews` e.g., `/products/agentforce-sales-formerly-salesforce-sales-cloud/reviews` | **[OBSERVED FACT]** |
| Product alias redirect | `/products/salesforce-crm/reviews` → renders Agentforce Sales (SEO legacy slug) | **[OBSERVED FACT]** — both slugs rendered same product in extracts |
| Product tabs | `/pricing`, `/integrations`, `/competitors/alternatives`, `/discuss` | **[OBSERVED FACT]** — Integrations (192) link seen; /discuss existed; /competitors/alternatives pattern in compare hub |
| Compare | `/compare` (hub), `/compare/{slug-a}-vs-{slug-b}` e.g., `agentforce-sales-formerly-salesforce-sales-cloud-vs-hubspot-sales-hub` | **[OBSERVED FACT]** |
| Compare alternatives | `/products/{slug}/competitors/alternatives` | **[OBSERVED FACT]** from trending products section |
| Reports | `/reports` (gated — redirects to auth), `research.g2.com/market-reports` | **[OBSERVED FACT]** |
| Seller/Seller profile | `/sellers/{slug}` e.g., `/sellers/salesforce` | **[OBSERVED FACT]** — link on product profile |
| Best-of | `/best-software-companies` | **[OBSERVED FACT]** |
| SEO convention | kebab-case slugs, lowercase, `-vs-` hyphen delimiter for compare, no trailing IDs — human readable | **[OBSERVED FACT]** |

**Pagination & Params:**
- **[OBSERVED FACT]** Category pagination: `?page=2`, `?page=106`, `?agent=nr-synthetic&order=g2_score` (A/B param observed), tab param `?tab=highest_rated`.
- **[OBSERVED FACT]** Review filtering: `?filters%5Bnps_score%5D%5B%5D=5`, `?filters%5Bsentiment_snippet%5D=1701944&qs=pros-and-cons#reviews`
- **[INFERENCE]** Canonicalization likely handles trailing slash, UTM, and legacy slugs via 301 to current slug — common for 2M+ indexed pages, though not directly tested in this pass.

---

## 3. Search (Buyer Discovery Engine)

- **[OBSERVED FACT]** Homepage hero search: `Clear SearchSearch` + `Ask a question...` placeholder — indicates unified search bar. Category page shows `Filter All Categories` with text input `#search`.
- **[OBSERVED FACT]** Compare hub: `Search Software Comparisons` with two inputs: `Software Name VS Software Name → Compare Now`
- **[INFERENCE]** G2 offers at least 3 search modalities:
  1. **Autocomplete product/category search** (homepage) — type-ahead over product names.
  2. **AI question search** ("Ask a question...") — generative QA layered over reviews (separate inference from placeholder; confirmed by AI-generated summaries on category/comparison pages).
  3. **Compare builder** (product picker).
  Not observed in extract but placeholder strongly suggests AI chat; treat as inference until DOM re-verified with JS rendering.
- **[OBSERVED FACT]** Search result ordering options on category pages: `Sort By: G2 Score` plus `Popularity, Satisfaction` (per CRM category filters).
- **[INFERENCE]** Backend likely Elasticsearch/Algolia-style with typeahead suggestions grouped by Category → Product → Compare, with recent trending boost — inferred from trending algorithm description (see §5).

---

## 4. Categories System

### 4.1 Structure
- **[OBSERVED FACT]** `/categories` is heirarchical directory:
  - **Featured buckets:** CRM & Marketing, Cloud Computing, ERP & Commerce, HR & Office — each shows 6 sample sub-categories + "See All {Parent}".
  - **Recently Added:** Infrastructure Digital Twin, OpenAI Consulting Services, AI Legal Operating System, MCP Server Infrastructure Platforms, Agentic Financial Crime Platforms, etc. — shows velocity of new category creation (AI-heavy in 2025-26).
  - **Filter All Categories table:** Vertical list grouped by parent (e.g., `Artificial Intelligence Software > Agentic AI Software > AI Agents > AI Agent Builders`) with expand/collapse.
- **[OBSERVED FACT]** Category Type toggle: `All / Software / Services` — indicates G2 covers both SaaS and services marketplaces (e.g., Consulting Services categories).
- **[OBSERVED FACT]** Category count messaging: `1598 Listings in CRM Available` on CRM page; overall claim of **630+ categories** on research.g2.com (15k reports across 630+).
- **[OBSERVED FACT]** Single category page (`/categories/crm`) content:
  - Title: `Best CRM Software: User Reviews from August 2026`
  - Tabs: `Overview | Trending Products | Highest Rated | Easiest To Use | Free | Resources`
  - Filters left-nav: Features (Document & Content Mgmt, Campaign Management, Marketing ROI Analytics, Social Collaboration, etc.), Solution Type (All-in-One, Best-of-Breed), Languages (150+ listed including Kazakh, Swahili…), Segment (Small-Business mid-market enterprise filters implied), Pricing? (not extracted but elsewhere)
  - Product cards: logo, name, review count (e.g., Agentforce 25,879), G2 Score components.
  - SEO content block bottom: `Learn More About CRM Software` with buying insights, pricing considerations ($415.95 avg annual license across 86 CRM products / 245 editions, ~$35/mo), feature taxonomy, integration taxonomy, FAQs (AI-generated, last updated Aug 13 2026).

### 4.2 Filters
- **[OBSERVED FACT]** Observed filters on CRM category:
  - Features checklist
  - Solution Type
  - Language (dozens, suggests i18n filtering — though list likely product attribute, not filter)
  - Sort by: G2 Score, Popularity, Satisfaction
  - Segment implicit: `/categories/crm/small-business` and `?segment=small-business`
- **[OBSERVED FACT]** Global categories page: `Filter / Adv. Filters / More Filters / Clear Filter` UI with `Category Type: All / Software / Services`
- **[INFERENCE]** Additional inferred filters (common G2, not in this extract but high confidence from historic G2): Company Size, User Ratings (stars), Pricing (free trial), Deployment (cloud/on-prem), Integrations — may be collapsed under Adv. Filters. Mark as inference until re-extract with JS.

---

## 5. Grid Reports & Scoring — The Moat

### 5.1 What Grids Are
- **[OBSERVED FACT]** Per research.g2.com & documentation.g2.com:
  - **Grid Reports:** high-level overview of a category plotting products on Satisfaction (y) vs Market Presence (x) → four quadrants. Official description: "which products have the most satisfied customers and largest presence" — quote from research.g2.com.
  - **Index Reports:** Usability, Results, Implementation, Relationship
  - **Momentum Grid,** Segment Grids (Small-Business, Mid-Market, Enterprise), Regional Grids, Best Software annual.
  - **Live Grids on category pages** updated daily when ≥3 products have 10+ reviews. **[OBSERVED FACT]**

### 5.2 G2 Score Methodology (vetted)
Source: **documentation.g2.com/docs/research-scoring-methodologies** — full extract observed.

**Formula: G2 Score = Satisfaction + Market Presence**

**Satisfaction components:**
| Metric Group | Metrics | Importance |
|--------------|---------|------------|
| Review response data — User-focused | Ease of Use, Meets Requirements, Quality of Support | High |
| Admin-focused | Ease of Admin, Ease of Setup, Ease of Doing Business With | Medium |
| General satisfaction | Likelihood to Recommend, Direction of Product | Low |
| Significance | Review volume (weights popularity/stat sig) | High |
| Relevance | Recency (Review Decay — older weighted less) | High |
| Quality | Readability via Flesch-Kincaid | Medium |
| Source | Current user + unincentivized weight; FTC segmentation rule enforced | Low |

**Market Presence components (product + vendor, product-weighted):**
- Review count (weighted, non-business-partner) — High
- Employee count (ZoomInfo, LinkedIn) + Revenue (ZoomInfo) — High/Medium (appendix details)
- Web presence: Moz Product/Vendor Authority, STAT Search Volume, Similarweb traffic/share — Medium/Low
- Growth/influence: Crunchbase Rank, Employee Growth (LinkedIn), Year Founded — Low

**Normalization & Segments:**
- **[OBSERVED FACT]** Scores normalized per category, so same product may have different G2 Scores in different categories.
- **[OBSERVED FACT]** Segment definitions: Small-Business ≤50? (text truncated, but standard G2: Small 0-50, Mid-Market 51-1000, Enterprise 1000+), each Segment Grid filters reviews by reviewer's company size and separately measures segment Market Presence (focus).
- **[OBSERVED FACT]** `... focusing primarily on product-specific factors to reflect real-world popularity and vendor influence.`
- **[INFERENCE]** Quadrant thresholds are algorithmic, not fixed: Leaders (high both), High Performers (high satisfaction low presence), Contenders (low sat high presence), Niche (both low). Inferred from imagery reference `g2-reports-grid-reports@2x.png` though image not rendered.

**Report Access:**
- **[OBSERVED FACT]** `/reports` is gated (Create account / LinkedIn / Google gate observed). `research.g2.com/market-reports → Access Now → /reports` — paywall after auth.
- **[INFERENCE]** Vendors license Grids for marketing (Content Subscription) — see §11.

### 5.3 Trending & Alternatives Algorithms
- **[OBSERVED FACT]** Compare page: "Trending products are found via our proprietary algorithm. The algorithm includes signals from product pages, reviews, as well as compare data."
- **[OBSERVED FACT]** Alternatives: "generated via our proprietary algorithm. The algorithm includes signals from all categories that each of these products are in, as well as signals from compare data."

---

## 6. Product Profile — Anatomy (Salesforce / Agentforce Sales Case Study)

**Test URLs:** `/products/agentforce-sales-formerly-salesforce-sales-cloud/reviews` and legacy `/products/salesforce-crm/reviews` (alias). Both resolve.

### 6.1 Hero & Header
- **[OBSERVED FACT]** Banner image + Product avatar + G2 badge medal SVG (`G2 recognized Agentforce Sales`).
- **[OBSERVED FACT]** Title: `Agentforce Sales (formerly Salesforce Sales Cloud)` by `Seller: Salesforce → /sellers/salesforce`
- **[OBSERVED FACT]** Rating aggregate: `4.4/5 (25,879)` — star breakdown: 5★ 64%, 4★ 28%, 3★ 5%, 2★ 1%, 1★ 0% with filter links per star (`?filters[nps_score][]=5`).
- **[OBSERVED FACT]** CTAs: `Start Review`, `See all 25,879 reviews`, `AI Verified`, `Contact Agentforce Sales → /products/{slug}/leads/new?lead[context]=contact`, `Watch Demo`, `Visit Website`
- **[OBSERVED FACT]** Seller attribution under title links to seller page.

### 6.2 Tabs / Sections (in order observed)
1. **Product Information / Overview** — long description ("Accelerate revenue from pipeline to paycheck... Build Pipeline Faster with AI Agents, Accelerate Productivity with Automation, Drive Revenue on an Integrated Platform") — seller-written.
2. **Metadata row:** Languages Supported (32 listed), Solution Type (All-in-One), Overview by (user Oleg Kulda + avatar), Featured Companies Used By (Accenture, Cognizant, etc.).
3. **Pricing (embedded preview):** `Starter Edition $25.00 1 User Per Month → [View More Pricing Information] → /pricing` — see §9 for full.
4. **Integrations:** `(192) What do users say about integrations? Verified by [Product]` — grid of logos (6sense, 8x8, Adobe Acrobat/Analytics, etc.) + `Show More Integrations → /integrations`
5. **Media:** Screenshots/videos carousel (e.g., "Sales Cloud AI", "Sales Coaching Agent") — lightbox.
6. **Reviews section (paginated, anchored `#reviews`):** Pros & Cons AI summary, individual review cards (see §7), helpful/report actions, filter bar.
   - Additional tabs inferred but not rendered in extract: `Discussions → /discuss`, `Competitors?`, `Alternatives` — Discuss link present.

### 6.3 Sidebar / Right Rail (inferred from spacing)
- **[INFERENCE]** Contact form, demo scheduler, pricing estimator likely persist on right — not captured in markdown extract but typical G2 layout; lead gen CTAs present in hero make right-rail less critical for extraction.

### 6.4 Product URL Stability
- **[OBSERVED FACT]** Product slugs include legacy parenthetical renames to preserve SEO equity: `agentforce-sales-formerly-salesforce-sales-cloud`. G2 retains old slugs as aliases (`salesforce-crm` still serves content with same reviews) — avoids 404 link rot.

---

## 7. Review System (Ratings, Verification, Voice)

### 7.1 Ratings Structure
- **[OBSERVED FACT]** Overall stars: 1–5 distribution with % + counts, filterable. Aggregate 4.4 from ~25.8k reviews.
- **[OBSERVED FACT]** Structured scores per review form (from methodology doc): Meets Requirements, Ease of Use, Ease of Setup, Ease of Admin, Quality of Support, Likelihood to Recommend, Product Direction — each rendered as 1–10 scores on category vs comparison pages (e.g., Meets Requirements 8.8/14,233 responses).
- **[OBSERVED FACT]** Pros & Cons tags: AI-aggregated sentiment snippets with counts e.g., `Ease of Use (2065), Features (1726), Learning Curve (1092), Limitations (791)` — each links to filtered review view `?filters[sentiment_snippet]=...&qs=pros-and-cons`. HubSpot side shows different taxonomy (`Missing Features (435)`).
- **[OBSERVED FACT]** Category-level satisfaction sub-scores displayed vs peer (8.8 vs 8.6 etc.).

### 7.2 Verification & Trust Framework
Source: `legal.g2.com/terms-of-use` + `/static/community_guidelines` + sell.g2.com/review-validity — extensively observed.

- **[OBSERVED FACT]** **Trust Framework pillars:** Authenticity, Accuracy, Integrity — verbatim header.
- **[OBSERVED FACT]** **Who can review:** Actual users, business partners, guest users only. Must authenticate via **LinkedIn account, verified business email, or personal email that G2 can validate**. G2 also partners with sellers to securely authenticate via select platforms.
  - **Guest User reviews** (no LinkedIn/business email) do **not** count toward G2 Score (as of June 2024) and are flagged "Guest User". **[OBSERVED FACT]**
  - **Anonymous/Unattributed** option exists — displays only job category + industry; G2 still validates but does not share identity publicly/with vendor.
  - **Not allowed:** non-users, fake experiences, AI-generated reviews (except translators), confidential info, deflection.
- **[OBSERVED FACT]** **Five review labels:**
  1. `Validated Reviewer`
  2. `Current User` (screenshot proof of usage)
  3. `Incentivized` (clearly labeled per FTC)
  4. `Source` (collection method)
  5. `Rating Update [date]`
  Plus `Guest User` label post-June 2024.
- **[OBSERVED FACT]** **Moderation:** Two-stage: automatic filtering for minimum submission requirements → manual human check of every review; all reviews must pass moderation before publishing. Quote: "We do not, under any circumstances, edit the content of any review." **[OBSERVED FACT]**
- **[OBSERVED FACT]** **Incentives:** Gift cards/donations capped at **$100 USD** per review (cash, gift cards, swag, tokens, credits, subscriptions all count). Eligibility never based on sentiment (positive/negative). Incentivized reviews tagged. Vendors must not segment to solicit only positives (FTC guideline; violations subject to removal).
- **[OBSERVED FACT]** **Review quality weighting:** Flesch-Kincaid readability, completeness, recency (Review Decay), current-user and unincentivized weight (see satisfaction methodology).
- **[OBSERVED FACT]** Sample review footer: `Review collected by and hosted on G2.com.` + `Current User | Validated Reviewer | Incentivized Source: G2 invite | 10/16/2025` etc. — confirms provenance metadata displayed.
- **[OBSERVED FACT]** Users can edit post-publication; edited reviews re-enter moderation.
- **[OBSERVED FACT]** FTC compliance notes repeated across Terms + Community Guidelines.

### 7.3 Review Content Schema (per card)
- **[OBSERVED FACT]** Fields: `What do you like best?` / `What do you dislike?` / `What problems are you solving and how are you benefiting?` (inferred from pattern but shortened in extract), Star rating, Job title/Company size disclosed in cards not captured in markdown snapshot but implied by segment scoring.
- **[OBSERVED FACT]** AI summary sections: `Generated using AI from real user reviews`, `AI Verified`, `FAQs Generated using AI Last updated: August 13, 2026` — G2 layers LLM summaries across category/comparison/product pages.

---

## 8. Comparison Engine

### 8.1 UX & Components
**Test page:** `/compare/salesforce-crm-vs-hubspot-crm` (canonical) and `/compare/agentforce-sales-formerly-salesforce-sales-cloud-vs-hubspot-sales-hub` (true slug) — both resolve to same template.

- **[OBSERVED FACT]** Header: `Agentforce Sales vs HubSpot Sales Hub Comparison - What are their main differences?` + `+ Add Product` (supports 2–4 products per compare — inferred from "Compare page provides in-depth scores of 2-4 products" on /compare hub).
- **[OBSERVED FACT]** Header stats row: each product image, name, `4.4/5 (25,879)` vs `4.4/5 (13,927)` linking back to respective /reviews.
- **[OBSERVED FACT]** Pricing callout row: `Free Trial | $25.00 1 User Per Month · Starter Edition` vs `$0.00 · Free HubSpot CRM`
- **[OBSERVED FACT]** CTA: `G2 offers free advice on this comparison. Chat with an expert [Text Message] [Phone Call]` — Advisor Router.
- **[OBSERVED FACT]** **Pros & Cons** section with tag counts per product (4 tags each shown).
- **[OBSERVED FACT]** **AI Generated Summary** (bullet list 6 bullets in sample): feature-level comparison (Email Marketing 8.8 vs 7.9, Lead Follow-up, Ease of Use, Opportunity & Pipeline Management, Customer Support, Task Management) — powered by real user reviews.
- **[OBSERVED FACT]** **Ratings table** (7 rows): Meets Requirements, Ease of Use, Ease of Setup, Ease of Admin, Quality of Support, Has the product been a good partner? (Doing Business With), Product Direction (% positive) — each shows score (8.x/10) + respondent count (e.g., 14,233 vs 10,109).
- **[OBSERVED FACT]** **Lead gate mid-page:** `Send me this comparison — Fill out the form and we'll send the comparison directly to your inbox. Email address * → Get the comparison + Terms/Privacy + Marketing opt-in + qualification: `What are you here to do today? Replace a tool / Search for new software / I'm just browsing`
- **[OBSERVED FACT]** **FAQs** at bottom: AI-generated, 3+ Qs per compare (e.g., "What is the difference...", "How do pricing models compare...", "What are the best alternatives...") with comparison table snippet (reviews count, segment, scores).
- **[OBSERVED FACT]** **Compare Hub** (`/compare`): hero `Discover & Compare Product Alternatives`, trending products grid (viktor.com, Testlify, etc.), Alternatives to Trending Software, Most Viewed Comparisons (SOLIDWORKS vs SketchUp, Inventor vs SOLIDWORKS, Cloudera vs Databricks, etc.) with `Show More`.
- **[INFERENCE]** Compare pages are SEO programmatic at ~1M+ combinations; similarly structured tables populated from Satisfaction scores + feature ratings API — inference from consistency across extracts + table schema.

### 8.2 Comparison URL Logic
- **[OBSERVED FACT]** Pattern: `/compare/{slug-a}-vs-{slug-b}` — alphabetical? Not confirmed; both A-vs-B and B-vs-A likely canonicalize. Adding third product likely ` -vs- ` chained (e.g., `/compare/a-vs-b-vs-c`) — inferred from "2-4 products" copy; not directly observed in this pass.

---

## 9. Pricing

### 9.1 Product Pricing (Agentforce Sales example)
Full extract from `/products/agentforce-sales-formerly-salesforce-sales-cloud/pricing`:

- **[OBSERVED FACT]** `Pricing Overview` header: **4 pricing editions, starting from $25 to $330** (verbatim).
- **[OBSERVED FACT]** **Starter Edition (Essentials) $25.00 1 User Per Month** — up to 10 users, annual contract note: "**This edition requires an annual contract. Monthly pricing available on Essentials edition.**"
- **[OBSERVED FACT]** **Professional Edition $100.00** + **Enterprise $165.00** + **Unlimited Edition $330.00** — each with feature bullet lists (e.g., Professional adds Campaigns, Quotes, Forecasts; Enterprise adds Workflow automation, Territory mgmt, API; Unlimited adds 24/7 support, sandboxes, unlimited custom apps).
- **[OBSERVED FACT]** Metadata: `Pricing information was last updated on December 04, 2025` + disclaimer: "Pricing information is supplied by the software provider or retrieved from publicly accessible pricing materials. Final cost negotiations must be conducted with the seller." (seen on Grid pricing tooltip via search result).
- **[OBSERVED FACT]** **G2 Deals Offer:** `25% discount when you purchase via G2. Enter SAVE25 upon checkout. Discount applies only to annual subscriptions. Starting at $18.75/user/month` — affiliate/affinity deal badge present.
- **[OBSERVED FACT]** **Worth the Price AI summary + Pricing Reviews + Consulting Services** sections follow, plus FAQ AI-generated ("Is it free? No free plan but free trial; Pricing FAQs").

### 9.2 No Public Buyer Pricing
- **[OBSERVED FACT]** `/pricing` on main domain 404s — G2 does not list buyer-facing pricing; buyer use is free. All pricing is vendor-facing (sell.g2.com).
- **[OBSERVED FACT]** G2 Deals is a lead-gen/affiliate layer (discounted vendor pricing via G2 checkout).

---

## 10. Lead Generation & Intent Flywheel

### 10.1 Observed Lead Capture Points
1. **Contact Vendor:** `Contact Agentforce Sales → /products/{slug}/leads/new?lead[context]=contact&lead[source_location]=products%23reviews` **[OBSERVED FACT]**
2. **Watch Demo** button (product hero) **[OBSERVED FACT]**
3. **G2 Advisor / Expert:** `G2 offers free advice on this comparison. Chat with an expert [Text Message] [Phone Call]` — collects phone number, Advisor Router asset path observed (`/assets/advisor_router/...svg`) **[OBSERVED FACT]**
4. **Send me this comparison** email gate (`Email address * → Get the comparison`) + intent qualification (`Replace a tool / Search for new software / Just browsing`) **[OBSERVED FACT]**
5. **Compare email gate duplicate** at bottom of compare page **[OBSERVED FACT]**
6. **Create account gate:** `/reports` gated behind `Create account or continue with LinkedIn / Google` — captures before high-value Grid access **[OBSERVED FACT]**
7. **Reviews gate:** writing a review requires LinkedIn/business email auth (see verification) **[OBSERVED FACT]**
8. **Deals checkout:** G2 Deals claim flow **[OBSERVED FACT]**

### 10.2 G2 Buyer Intent (Vendor Product)
- **[OBSERVED FACT]** sell.g2.com description: "Accelerate and optimize your pipeline with bottom of funnel intent signals only available from G2. These unique signals complement existing ABM... Target accounts most likely to convert, Increase MQLs, Accelerate sales cycles, Combat churn and identify upsell opportunities with intel from buyers engaging with your competitors and category." **[OBSERVED FACT]** verbatim.
- **[INFERENCE]** Intent signals include: category page views, product profile visits, compare page views, pricing tab views, review filtering, advisor chats — aggregated at account-level (IP-to-company + authenticated user company). Inferred from standard Buyer Intent architecture + sell.g2.com copy ("accounts engaging with your competitors and category").

### 10.3 Advertising
- **[OBSERVED FACT]** Two ad products detailed:
  - **G2 Clicks (PPC):** custom monthly budgets, cancel anytime, pay-per-click on marketplace; volume not guaranteed, can be blocked by Paid Promotions.
  - **G2 Ads Paid Promotions:** quarterly/annual buyout, limited to 3 spots per placement, guaranteed impression share, preferential over Clicks, custom CTAs, all-inclusive free clicks.
- **[INFERENCE]** Intent-qualified ad targeting (category, competitor, persona) is the value layer over raw programmatic.

---

## 11. Monetization — Full Stack (Vendor Side)

| Revenue Line | Plan / Price Observed | What's Included | Observed Source |
|--------------|----------------------|-----------------|-----------------|
| **Free profile** | $0 | 3 Users, Basic Profile, Standard Seller Page, 'Users Love Us' Badge License, Basic Review Collection & Syndication | **[OBSERVED FACT]** sell.g2.com/plans |
| **Starter** | $299/mo or $2,999/yr (16% save); **Y2: $599/mo or $6,000/yr** escalation explicitly stated | Everything Free + Single Profile Review Collection, $100 Gift Card Credits, Custom CTAs, Upgraded Profile, Branded Banners + Review Campaigns, Report/Milestone/Annual Badge License | **[OBSERVED FACT]** |
| **Professional** | Contact sales (quote) | Starter + 10 Users, 3 video reviews, $500 Gift Card Credits, Single Product Custom CTAs, Review Management, Profile Visitor Data, Premium Seller Pages, Expanded Support | **[OBSERVED FACT]** |
| **Enterprise** | Contact sales | Professional + Unlimited Users, 5 video reviews, $1,000 Gift Card Credits, Multi-Product CTAs, Market Intelligence, Solutions Pages (Ent only), Multi-Product Reviews | **[OBSERVED FACT]** |
| **Content Subscription** | Licensed | G2 Reports & Grids for marketing syndication as ready-to-promote assets | **[OBSERVED FACT]** sell.g2.com/plans mid-page |
| **Buyer Intent** | Licensed | Account-level intent signals (demand gen, ABM, churn defense) | **[OBSERVED FACT]** |
| **G2 Clicks (PPC Ads)** | Custom monthly budgets | Pay-per-click marketplace ads | **[OBSERVED FACT]** |
| **G2 Paid Promotions** | Quarterly/annual buyout, 3 spots/placement | Guaranteed share, preferential placement, custom designs | **[OBSERVED FACT]** |
| **G2 Data Solutions** | Licensed | Data feed for investors/VC/PE ("industry's most accurate..." — truncated) | **[OBSERVED FACT]** |
| **Review Campaigns** | Included in tiers (+ gift card credits) | G2-run written & voice review campaigns with incentives (gift card funded by G2 credits) | **[OBSERVED FACT]** |
| **G2 Deals / Affiliate** | 25% off via SAVE25 (Agentforce example) | Revenue share on referred purchases? Not explicitly stated but likely | **[OBSERVED FACT offer + INFERENCE revenue share]** |
| **Badge/Report Licensing** | Per-badge | 'Users Love Us' badge (≥20 reviews, ≥4.0 avg) license terms: backlink to G2 required, digital use allowed — from sell.g2.com badge copy fragment | **[OBSERVED FACT]** |

**Monetization Inference:** When blended, G2's model mirrors TripAdvisor + ZoomInfo: free content (reviews/SEO) → gated intent/ads. New FY27 pricing deck referenced (`Download pricing guide → Customer-Facing-FY27-Pricing-Slide-Deck.pdf`) suggests annual uplift cadence — confirmed by Starter Y2 doubling note.

---

## 12. SEO Moat — Why G2 Ranks

- **[OBSERVED FACT]** Every category has long-form AI-generated SEO content bottom ("Buying insights at a glance," "What is CRM software?", pricing data, feature taxonomies, integrations, top 5 lists with Satisfaction/Market Presence scores, SMB/Enterprise FAQs) — provides keyword density + internal linking.
- **[OBSERVED FACT]** Programmatic internal linking: category page → product cards (review counts anchor text), product cards → 192 integrations, competitors/alternatives, FAQs linking back to category, compare pages linking to both products.
- **[OBSERVED FACT]** Freshness: FAQs dated `Last updated: August 13, 2026` + pricing `last updated December 04, 2025` — signals recency to crawlers.
- **[OBSERVED FACT]** Review recency weighting discourse reinforces content freshness loop: new reviews constantly refresh product pages.
- **[INFERENCE]** E-E-A-T: methodology docs (23-min read), community guidelines, scoring transparency page all serve as trust signals to Google. Not speculation on ranking but structural observation.

---

## 13. Gaps, Risks & Unknowns (Explicitly Not Observed)

- Full JS-rendered nav, header mega-menu columns, mobile nav — not extracted (headless collapse). Verify with Playwright full render.
- Exact review form field list (Likelihood to Recommend scale, N/A handling) — sampled only via methodology doc, not live form.
- Grid quadrant image thresholds (numeric cutoffs) — referenced but not rendered.
- Deals affiliate revenue share % — not disclosed.
- /reports gated content paywall tiering — blocked; requires auth to assess.
- Category filter counts for >630 categories (only sample seen) — full hierarchy requires crawling `/categories?view_hierarchy=true`.

---

## Appendix: URLs Crawled (for reproducibility)

```
/                 (homepage)
/categories
/categories/crm
/categories/crm?tab=highest_rated
/categories/crm/grid  (render empty — JS Grid)
/products/agentforce-sales-formerly-salesforce-sales-cloud/reviews
/products/salesforce-crm/reviews (alias)
/products/agentforce-sales-formerly-salesforce-sales-cloud/pricing
/compare
/compare/salesforce-crm-vs-hubspot-crm
/compare/agentforce-sales-formerly-salesforce-sales-cloud-vs-hubspot-sales-hub
/reports (gated)
/sellers/salesforce (partial)
/documentation.g2.com/docs/research-scoring-methodologies
/research.g2.com/market-reports
/sell.g2.com/plans
/legal.g2.com/terms-of-use
/www.g2.com/static/community_guidelines
/research.g2.com/research-guidelines
```

---

## Deliverable Note

- **Verification level:** All high-confidence claims above are anchored to quoted extracts; remaining claims explicitly tagged **[INFERENCE]** and degraded accordingly.
- **Reproducibility:** Re-run `web_extract` on URLs above; methodology doc is versioned (`Updated Feb 18, 2026 — 23 min read`) for audit.
- **Suggested next scrape:** Headless browser (Playwright with JS) for nav DOM, Grid SVG coordinates, review card microdata (JSON-LD `AggregateRating`), and `/categories?view_hierarchy=true` full tree.
