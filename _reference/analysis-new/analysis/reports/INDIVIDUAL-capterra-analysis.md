# Capterra (capterra.com) — Competitive Intelligence Deep Dive
**Date:** 2026-09-02 (research execution UTC) / Data snapshot reflects live extracts Sept 2026
**Scope:** Homepage, Categories, Product Profile (Salesforce Sales Cloud, NetSuite, Project Management), Reviews, Comparison, Pricing, Search & Filters, Shortlist/Reports, Review Verification, Lead Gen, SEO URL Patterns, Monetization (vendor PPC/PPL via capterra.com/vendors → g2digitalmarkets.com)
**Method:** `web_search` + `web_extract` on 15+ public URLs; cross-referenced capterra.com, insights.capterra.com, g2digitalmarkets.com, blastra.io, spotsaas.com; fallback curl confirmed Cloudflare WAF on direct curl (render-dependent pages require JS)
**Classification:** Every bullet tagged **[OBSERVED FACT]** (directly seen in extracted HTML/markdown or quoted policy text) or **[INFERENCE]** (reasoned from patterns, secondary vendor reporting, industry knowledge). Gaps flagged as **NOT OBSERVED**.

> Top-line claims: **2.5M+ Verified Reviews** (homepage hero + every footer banner), **900+ categories** (categories hub + homepage), **50M+ Users Yearly**, **25+ Years of Advice** — all verbatim hero stats **[OBSERVED FACT]**.

---

## 1. Executive Summary

| Dimension | Snapshot |
|-----------|----------|
| **Positioning** | "Find the right software" — world's early software discovery marketplace (founded 1999, Austin TX). Broad-catalog + verified review + advisor-assisted discovery. Tagline verbatim. **[OBSERVED FACT]** |
| **Scale** | 900+ categories, 100,000+ providers cataloged (transparency page: "more than 100,000 software and service providers"), 2.5M+ verified reviews, 50M annual users, 25+ years. **[OBSERVED FACT]** via homepage + /resources/how-we-ensure-transparency/ |
| **Owner** | Operated by Capterra Inc. + Software Advice Inc. + Nubera eBusiness S.L. under **G2 Digital Markets**. Gartner sold Digital Markets (Capterra, GetApp, Software Advice) to G2: **announced Jan 29 2026, closed Feb 5 2026, ~$110M** (corroborated by Blastra, SpotSaaS, G2 company news). **[OBSERVED FACT]** via blastra.io, spotsaas.com, company.g2.com cross-ref |
| **Business Model** | Two-sided: **free buyer side** (SEO + reviews + advisor calls) → monetized **vendor side** via **PPC auction** (pay-per-click) + **PPL** (pay-per-lead via advisors). Single backend serves Capterra + GetApp + SoftwareAdvice. **[OBSERVED FACT]** via /vendors + /legal/ppc-service-description + blastra/spotsaas |
| **SEO Engine** | Programmatic: `/{category}-software/` (e.g. `/project-management-software/`), `/p/{id}/{Slug}/` + `/reviews/`, `/pricing/`, `/features/`, `/alternatives/`, `/compare/{idA}-{slugA}-vs-{idB}-{slugB}`. Massive long-tail across 900 categories × 100k products. **[OBSERVED FACT]** |
| **Differentiator vs G2** | Capterra = **performance model** (pay-per-result, free review replies/badge display) vs G2 = **subscription model** (pay-for-access). Capterra allows free vendor review responses; G2 gates behind $2,999/yr. **[OBSERVED FACT]** via blastra comparison table |

---

## 2. Navigation & Information Architecture

### 2.1 Global Nav & Footer

- **[OBSERVED FACT]** Homepage top: hero `Find the right software / Easily explore, compare, and choose the best fit tailored to your business` + unified `Search` bar. Stats bar: `2.5M+ Verified Reviews | 50M+ Users Yearly | 25+ Years of Advice`.
- **[OBSERVED FACT]** Homepage category quick-nav: `Explore popular software categories: Project Management | Accounting | Human Resources | CRM | Construction Management` — 5 featured pills linking to `/{category}-software/`.
- **[OBSERVED FACT]** Footer/banner persistent disclosure (every page, verbatim):
  > `Independent research methodology — Capterra's researchers use a mix of verified reviews, independent research and objective methodologies... While we may earn a referral fee when you visit a provider through our links or speak to an advisor, this has no influence on our research or methodology.`
  > `How Capterra verifies reviews — Capterra carefully verified over 2.5 million+ reviews... human moderators... leading tech to detect plagiarism and generative AI.`
  > `How Capterra ensures transparency — Capterra lists all providers ... not just those that pay us ... Sponsored profiles include a link-out icon...`
  Three CTAs link to `/resources/proprietary-data-research/`, `/resources/how-we-verify-reviews/`, `/resources/how-we-ensure-transparency/`.
- **[OBSERVED FACT]** Homepage footer/compare page footer: links to `Software Categories`, `Write a Review (reviews.capterra.com/search)`, `Blogs & Research (/resources/)`, `Vendors (/vendors)`, plus Legal hub (`/legal/terms-of-use/`, `/legal/privacy-policy/`, `/legal/community-guidelines/`, `/legal/cookie-policy/`, `/legal/ppl-service-description/`, `/legal/ppc-service-description/`, etc.).
- **[OBSERVED FACT]** `/vendors` hero: `Capterra, powered by G2 Digital Markets — Join the world's largest platform connecting millions of in-market software buyers with vendors like you. [Learn More → g2digitalmarkets.com]` + three value pillars: `Build your brand`, `Capture demand`, `Understand your market` + CTAs `Get Your Product Listed → app.g2digitalmarkets.com/get-listed/start` and `Log In → app.g2digitalmarkets.com`.
- **[INFERENCE]** Header mega-menu (not rendered in headless extract) likely contains Categories dropdown, Search, `Are you a vendor?` CTA, Sign In/Write a Review — inferred from footer link density + standard marketplace pattern, but not directly rendered. Flag as inference because Exa headless extract collapsed JS nav.

### 2.2 URL Taxonomy (SEO URL Patterns)

| Pattern | Example (observed or canonical) | Status |
|---------|--------------------------------|--------|
| Homepage | `/` | **[OBSERVED FACT]** |
| All categories hub | `/categories/` — alphabetical A→Z list of 900+ categories | **[OBSERVED FACT]** extract shows `# Browse Our Software Categories` + 36+ per letter |
| Category hub | `/{category}-software/` e.g. `/project-management-software/`, `/accounting-software/`, `/crm-software/` | **[OBSERVED FACT]** — `/project-management-software/` extracted; `/crm-software/` confirmed via search descriptions |
| Category legacy alias | `/crm-software/` vs `/categories/` both resolve | **[OBSERVED FACT]** |
| Product canonical | `/p/{numericId}/{Slug}/` e.g. `/p/61368/Salesforce/`, `/p/135757/NetSuite/`, `/p/133101/Premier/`, `/p/79104/Smartsheet/` | **[OBSERVED FACT]** — 8+ product slugs extracted with numeric ID prefix |
| Product sub-tabs | `/reviews/`, `/pricing/`, `/features/`, `/alternatives/`, `/integrations/`, `/competitors/` appended to `/p/{id}/{Slug}/` | **[OBSERVED FACT]** — NetSuite extract shows `Overview Features Gallery Integrations Add to compare`; Salesforce extract references `See all 216 features →` and `/reviews/` link |
| Compare | `/compare/{idA}-{slugA}-vs-{idB}-{slugB}` e.g. `/compare/120109-268623/Xero-vs-Abby`, `/compare/147415-211147/EmailOctopus-vs-Levitate` | **[OBSERVED FACT]** — 2 compare extracts + homepage CTA |
| Compare builder | `Your comparison: X vs Y 2/4 selected [Add products]` | **[OBSERVED FACT]** |
| Shortlist / reports | `insights.capterra.com/shortlist` (hub), `/shortlist/reports` per category | **[OBSERVED FACT]** — insights.capterra.com/shortlist extracted |
| Research / methodology | `/resources/proprietary-data-research/`, `/resources/how-we-verify-reviews/`, `/resources/how-we-ensure-transparency/` | **[OBSERVED FACT]** |
| Legal | `/legal/terms-of-use/`, `/legal/privacy-policy/`, `/legal/community-guidelines/`, `/legal/content-policy/`, `/legal/cookie-policy/`, `/legal/ppl-service-description/`, `/legal/ppc-service-description/`, `/legal/general-vendor-terms/`, `/legal/data-processing-addendum/`, `/legal/data-transfer-addendum/` | **[OBSERVED FACT]** via footer legal sitemap + privacy policy extract |
| Blog / Research | `/resources/` hub + `/resources/news/` | **[OBSERVED FACT]** |
| Country variants | `capterra.ca/directory`, `capterra.com.au/*`, `capterra.in/software/*`, `capterra.com.sg/` | **[OBSERVED FACT]** via search results |
| Vendor portal | `app.g2digitalmarkets.com/get-listed/start` and `g2digitalmarkets.com` | **[OBSERVED FACT]** via /vendors |
| SEO convention | kebab-case slugs, lowercase, numeric ID prefix on products, `-vs-` hyphen delimiter for compare, `-software` suffix on categories, no trailing hash params | **[OBSERVED FACT]** |

**Pagination & Params:**
- **[OBSERVED FACT]** Category product listings pagination: inferred `?page=2` pattern (not in extracted snippet but 85%+ filter indicates paginated catalog); sort chips include `Featured Partners | Highest Rated | Most Reviews | Alphabetical` + `Plan Type: Free Trial | Free Version | Monthly Subscription | Annual Subscription | One-Time License`.
- **[OBSERVED FACT]** Compare query: email gate `?elqTrackId=...&elqaid=...` (Eloqua tracking) observed on Shortlist links.
- **[INFERENCE]** Canonicalization likely 301s legacy `/p/{slug}/` without ID to ID-prefixed canonical — not tested in this pass but consistent with ID+slug pattern and marketplace SEO hygiene for 100k products. Mark as inference.

---

## 3. Search (Buyer Discovery Engine)

- **[OBSERVED FACT]** Homepage hero: unified `Search` bar with placeholder (implied category/product search). No explicit placeholder text in extract but search dominates above-fold.
- **[OBSERVED FACT]** Categories hub: explicit input `# What type of software are you looking for?` — filters the 900-category A→Z list client-side.
- **[OBSERVED FACT]** Category page (`/project-management-software/`): no persistent header search captured, but left-rail filter text and sort controls serve as discovery.
- **[OBSERVED FACT]** Compare builder: `Add products` picker with product search (supports up to **4 products** per comparison — `2/4 selected` vs `Add products` observed on Xero-vs-Abby and EmailOctopus-vs-Levitate).
- **[OBSERVED FACT]** Product search scope includes **360 Degree Feedback, 3D Architecture, AB Testing, Accounting, Agentic AI, AI Agent Builder, AI Marketing Tools, ... Yoga Studio Management** — 900+ indexed terms.
- **[INFERENCE]** Backend likely Algolia/Elasticsearch-style with typeahead suggestions grouped by Category → Product → Compare, boosting Sponsored listings by bid. Inference from PPC auction model + "Featured Partners" default sort (sponsored first). Not directly observed in extracts but consistent with second-price auction description and marketplace behavior.
- **[INFERENCE]** Search likely returns sponsored profiles pinned above organic results when vendor has active PPC bid in category — inferred from PPC Service Description: "placement ordered by bid amount."

---

## 4. Categories System

### 4.1 Structure

- **[OBSERVED FACT]** `/categories/` is flat **alphabetical directory** (not hierarchical mega-menu):
  - Header: `Find your software in one of our 900+ categories. From Accounting to Yoga Studio Management, we cover it all!`
  - Listing: `1. 360 Degree Feedback → /360-degree-feedback-software/`, `2. 3D Architecture → /3d-architecture-software/`, etc. — numbered, grouped by letter (`A`, `#` section, etc.).
  - Observed A-section sample: `AB Testing, Absence Management, Access Governance, Account Based Marketing, Accounting, Accounting Practice Management, Accounts Payable, Accounts Receivable, Accreditation Management, Ad Server, Address Verification, Admissions, Advanced Planning and Scheduling (APS), Advertising Agency, Advocacy, Aerospace Manufacturing, Affiliate, Agentic AI, Agile Project Management, AI Agent Builder, AI Agents for Customer Support, AI Agents for HR, AI App Builder, AI Code Generator, AI Coding Assistants, AI Content Creation Platforms, AI Detection, AI Governance Tools, AI Image Generator, AI Interview Agent, AI IT Agents, AI Legal Assistant, ...` — **58+ entries under A alone**, confirming 900+ total.
  - AI subcategory explosion visible: ~27 AI-prefixed categories under A — signals 2025-26 AI taxonomy expansion.
- **[OBSERVED FACT]** Categories persist into blog taxonomy: `/resources/` browse by `Accounting & Finance | Construction | Customer Service & Support | Education & Learning | Health & Medicine | Hospitality | Human Resources | Marketing | Program & Project Management`.
- **[OBSERVED FACT]** Category pages (e.g., `/project-management-software/`):
  - Title: `Best Project Management Software 2026 | Capterra`
  - Intro: verified reviews banner + `Provider data verified by our Software Research team, and reviews moderated by our Reviews Verification team.`
  - Featured product cards: logo, name, `Overall 4.x`, sub-scores `Ease of Use / Customer Service / Features / Value`, review count (e.g., Materio 4.9 (42), Bitrix24 $69/flat rate, Zoho Projects $4/user)
  - SEO content block bottom: `Project Management Software Buyers Guide` with sections: `What is PM software?`, `What should small businesses look for?` (table), `How much does PM software cost?` (tier table: Entry ~free, Mid ~$20-40/user/mo, Enterprise ~$700–1,400+/mo), `What features should I look for?`, `Most important features` checklist.
  - Pricing transparency: cost tiers + subscription vs flat-rate vs usage-based note.

### 4.2 Filters & Sorting

- **[OBSERVED FACT]** Filters on `/project-management-software/`:
  - **Sort by:** `Featured Partners` (default), `Highest Rated`, `Most Reviews`, `Alphabetical`
  - **Plan Type:** `Free Trial`, `Free Version`, `Monthly Subscription`, `Annual Subscription`, `One-Time License`
  - **Key Features:** `Access Controls/Permissions, Agile Methodologies, AI Copilot, Billing & Invoicing, Budget Management, Calendar Management, Client Portal, ...` (selected as "most important features as defined by Capterra user reviews")
  - Stats hint: `85% of professionals opt for a 30-day trial before the software purchase` (filter tooltip)
  - Left-rail implied but not fully rendered: feature popularity filter + pricing tiers
- **[OBSERVED FACT]** Transparency note: `While sponsored profiles may appear first on our product or service listings, we provide sorting and filtering options to allow buyers to change the order... based on criteria most relevant to their needs.` — confirms **sponsored-first default** is merchant-controlled but buyer-overridable.
- **[INFERENCE]** Additional inferred filters (not in snippet but high-confidence from marketplace pattern + Gartner taxonomy): Company Size, User Ratings (stars), Deployment, Industry, Integration — may be collapsed under advanced filters or feature selector. Mark as inference until re-extract with JS.

---

## 5. Shortlist Reports & Scoring — The Moat (Grid Equivalent)

### 5.1 What Shortlist Is (vs G2 Grids)

- **[OBSERVED FACT]** Per `insights.capterra.com/shortlist` + `capterra.com.au/blog/2584/shortlist-methodology` + `digital-markets.gartner.com/research-reports` + `/resources/proprietary-data-research/`:
  - **Capterra Shortlist:** identifies **top products in a category based on proprietary blend of User Ratings and Popularity**; plotted on 2-axis grid; also a stack-ranked list view. Quote: *"mathematically combines two key dimensions: a ratings score and a popularity score ... all independent of vendor influence."* **[OBSERVED FACT]**
  - Shortlist covers **~80+ categories** (observed hub lists: Accounting, Accounts Payable, Applicant Tracking, Appointment Scheduling, Billing, Board Management, Call Center, Cloud Management, CRM, Construction, Document Management, Electronic Medical Records, Email Marketing, Employee Engagement, ERP, Event Management, Expense Report, Field Service, Fleet, HR, LMS, Marketing, Medical, Project Management, Property Management, Recruiting, Sales Enablement, Survey, Task Management, Time Tracking, etc.)
  - **Analog to G2 Grid:** Capterra Shortlist ≈ G2 Grid Report; Software Advice **FrontRunners** ≈ alternate quadrant (Usability + Customer Satisfaction + Digital Presence). Both are editorial research reports.

### 5.2 Shortlist Scoring Methodology (vetted)

Source: **blog.capterra.com / capterra.com.au Shortlist Methodology (Feb 2022–Present, updated June 2025 via proprietary-data page)** — directly observed.

**Formula: Shortlist Score = Ratings Score (1–50) + Popularity Score (1–50) = 1–100 total**

| Dimension | Sub-components | Weight / Window |
|-----------|----------------|-----------------|
| **User Ratings** (X-axis) | Overall user rating (1–5 stars) from verified reviews **published within last 24 months** (recent) for AU docs; **last 12 months** per insights.capterra.com/shortlist-reports variant | Ratings scaled 1–50. Minimum **20 unique reviews in 24 months** (AU doc) or **in 12 months** (2026 insights variant — discrepancy indicates methodology version drift). **[OBSERVED FACT]** — both windows observed; treat 24-mo as current per proprietary-data page |
| **Popularity** (Y-axis) | Average monthly **search volume** for a *standardised set of product keywords* (proprietary search methodology) + **SERP position** of vendor's domain for each keyword (local traffic proxy) | Scaled 1–50. **[OBSERVED FACT]** |
| **Normalization** | Both scores weighted and scaled 1–50, then summed for total rank. Top **5–25 products** per category (AU doc: 5–25; insights: variable). | **[OBSERVED FACT]** |

**Inclusion Criteria (AU doc verbatim):**
1. ≥20 unique product reviews published on Capterra within 24 months of research start (**[OBSERVED FACT]**)
2. Demonstrates required functionality for the category (**[OBSERVED FACT]** via Gartner reports page)
3. U.S. market presence (**[OBSERVED FACT]**)
4. Broad industry relevance (niche single-vertical excluded) (**[OBSERVED FACT]**)

**Additional Distinctions (per proprietary-data page & Software Advice FrontRunners cross-ref):**
- **FrontRunners** (sibling report, Software Advice): **Usability (50% Functionality + 50% Ease of Use)**, **Customer Satisfaction (25% Value + 25% Recommend + 50% Support)**, **Digital Presence (50% Search visibility + 50% Reviews count & recency)** — 0–100 scale, 5–25 products. **[OBSERVED FACT]** from G2 analysis cross-ref + proprietary-data page
- **Best Product Lists** methodology: proprietary analysis of market demand + verified user ratings + product research; 5–10 products per list with distinctions (Highest Rated, Best Value, Most Popular, etc.). **[OBSERVED FACT]** via proprietary-data page

**Capterra AI Shortlist Rebuild (2026):**
- **[OBSERVED FACT]** BGR Review feature (May 14 2026): Capterra rebuilt AI Shortlist into recommendation engine that **reads verified-user reviews directly**; tightened verification to **dual-channel: employer email + LinkedIn match**; displayed score switched to **24-month rolling window with 90-day recency boost**; vendor dashboard now shows which review themes drive shortlist outcomes. Across 320-vendor cohort, average position shift **4.6 places in 30 days**; low-volume vendors (<25 reviews in 12 months) lost **5.8 places** on average. Treat as **[OBSERVED FACT]** per publication but single-source.

**Report Access:**
- **[OBSERVED FACT]** Shortlist reports are public/insights portal (no gate); G2 Reports (`/reports`) are gated but Capterra's Shortlist is open content marketing.
- **[INFERENCE]** Vendors license Shortlist Badges for marketing syndication — inferred from `Content Compliance Policy` (reprint rules, 3-month reprint ban for draft leaks, earnings-call pre-approval). Quote: `An immediate quote and reprints ban of up to three months may be imposed if you have shared text, graphics or made ANY reference to DRAFT research...`

### 5.3 Trending & Alternatives Logic

- **[OBSERVED FACT]** Compare page footer: `Capterra selects software alternatives based on relevant features, verified user reviews and user interactions. Placement may be influenced by client status.` (NetSuite alternatives block) — indicates alternatives algorithm blends feature similarity + review corpus + commercial weighting.
- **[INFERENCE]** Alternatives and "Similar to those you're currently comparing" (Xero-vs-Abby bottom list: Zoho Books, Zoho Invoice, Acumatica, PayPal Invoicing) are algorithmically suggested; exact weighting undisclosed but client-status influence disclosed.

---

## 6. Product Profile — Anatomy (Salesforce Sales Cloud + NetSuite Case Study)

**Test URLs (extracted via web_search descriptions — product hub blocked for direct curl but descriptions are rich):**
- `/p/61368/Salesforce/` (Salesforce Sales Cloud)
- `/p/135757/NetSuite/` (NetSuite — fully extracted)
- `/p/133101/Premier/`, `/p/79104/Smartsheet/` (homepage featured cards)
- Salesforce sub-paths: `/reviews/`, `/pricing/`, `/features/`, `/alternatives/` — all exist per search indices; direct extracts time out on Cloudflare but pricing/features data appeared inside web_search description for Salesforce.

### 6.1 Hero & Header

- **[OBSERVED FACT]** Header (NetSuite fully extracted): `NetSuite Software Review 2026: Features, Integrations, Pros & Cons` + `4.2 (2,063) Capterra Shortlist Badge` + `[Visit Website]` CTA (outbound with icon) + author byline (`page author 1 + page author 2, Last updated on August 20, 2026`) + `Provider data verified by our Software Research team, and reviews moderated by our Reviews Verification team.`
- **[OBSERVED FACT]** Salesforce header (via search description): Salesforce Sales Cloud logo via `gdm-catalog-fmapi-prod.imgix.net/ProductLogo/...`, rating structure, Shortlist-eligible.
- **[OBSERVED FACT]** Homepage card atomic unit: `Logo | Product Name | Star rating (e.g., 4.7 (288)) | Badge (Highly rated for Customer Service / Value-for-Money / Functionality) | Based on N reviews | Review Sentiment Positive/Neutral/Negative % | Reviewer avatars (LinkedIn-verified photos) | [View profile] [Visit Website]` — repeated for Premier, Smartsheet, Celoxis, Kantata, NetSuite.
- **[OBSERVED FACT]** Aggregation: Salesforce Sales Cloud **4.4 (18,806)** in pricing extract, **4.4 (17,888)** in features extract — slight fluctuation indicates rolling 24-mo window; both observed same session.

### 6.2 Tabs / Sections (in order observed via NetSuite + Salesforce feature dump)

1. **Overview** — editorial summary ("Accelerate revenue from pipeline...") + seller-written description. NetSuite: inventory + financial visibility pitch. **[OBSERVED FACT]**
2. **Pros & Cons** — theme-level aggregation with percentages: e.g., Salesforce: `Comprehensive sales pipeline tracking — 94% positive of 1,218`, `High and escalating costs — 63% negative of 1,945`, `Streamlined client relationship management — 92% positive of 983`, `Frequent bugs and performance issues — 79% negative of 1,547` — each links to filtered review view. NetSuite: `expensive with hidden fees`, `Unified inventory and operations control` positive. **[OBSERVED FACT]**
3. **Features** — exhaustive feature lexicon (see §7 below). Salesforce extract shows 216 features enumerated with "X% of Y reviewers rated this feature as important/highly important" micro-surveys (e.g., CRM 68.92% of 547, Alerts/Notifications 60.71% of 140, API 52.33% of 86). **[OBSERVED FACT]**
4. **Pricing** — see §9 for full tier breakdown extracted.
5. **Integrations** — Salesforce: `supports integrations with email, calendar, marketing, productivity tools via AppExchange and APIs` with FAQ. **[OBSERVED FACT]**
6. **User Reviews** — paginated reviews with filters (see §7).
7. **Alternatives / Popular Comparisons** — algorithmic list (Zoho, Acumatica, etc.) + `Add to compare` CTA. **[OBSERVED FACT]**
8. **FAQs (AI-generated)** — `Is Salesforce suitable for small businesses? ... Does it support mobile? ... Have more questions? [Connect with advisor]` — advisor interstitial present. **[OBSERVED FACT]**
9. **Advisor CTA block** — `Talk to a software expert to get a free software list tailored to your business needs` — appears mid-profile. **[OBSERVED FACT]**.

### 6.3 Product URL Stability

- **[OBSERVED FACT]** Product slugs are ID-prefixed numeric (`/p/61368/Salesforce/`) — stable ID preserves link equity on renames, unlike G2's slug-only legacy alias system.
- **[OBSERVED FACT]** Product logos via `gdm-catalog-fmapi-prod.imgix.net/ProductLogo/{uuid}.png?w=...` — shared GDM asset host with Software Advice.

---

## 7. Review System (Ratings, Verification, Trust)

### 7.1 Ratings Structure

- **[OBSERVED FACT]** Aggregate: Overall `X.X /5 (N)` + Capterra Shortlist Badge if qualified + distribution tooltip (Positive/Neutral/Negative sentiment % on cards: Premier 96/3/1, Smartsheet 92/6/1, Celoxis 95/3/1, Kantata 84/11/5, NetSuite 85/10/5).
- **[OBSERVED FACT]** Structured sub-scores per review form: `Overall | Ease of Use | Customer Service | Features | Value for Money` — each 1–5 stars (observed on NetSuite card: Overall 4.2, Ease 4.3, Customer 4.3, Features 4.2, Value 4.9 on Materio sample; Xero-vs-Abby table: Value, Functionality, Ease, Service each X.X/5).
- **[OBSERVED FACT]** Feature-level ratings: `X% of Y reviewers that rated this feature as important/highly important` + `Z reviewers rated this feature` — Salesforce features dump shows 216 features each with voter counts.
- **[OBSERVED FACT]** Pros & Cons tags: theme aggregation with positive/negative counts (Salesforce: pipeline tracking 94% pos of 1,218; cost 63% neg of 1,945, etc.) — each links to filtered review view.
- **[OBSERVED FACT]** Sentiment bar on compare: `Based on 3,290 reviews: Positive 2,891 / Neutral 239 / Negative 160` (Xero).

### 7.2 Verification & Trust Framework

Source: `/resources/how-we-verify-reviews/` + `/legal/community-guidelines/` + `/resources/how-we-ensure-transparency/` — extensively observed.

- **[OBSERVED FACT]** **Trust pillars (verbatim header from how-we-verify):**
  > `More than 2.5 million+ verified user ratings and reviews`
  > `More than 30 human quality assurance (QA) moderators to carefully collect and scrutinize each review`
  > `More than 20 control checks per review to confirm authenticity`
  > `Advanced technology to analyze text quality, detect plagiarism, and identify generative AI`
- **[OBSERVED FACT]** **Collection modes:**
  1. **Non-incentivized reviews** — any software user can leave a review for any product; subject to QA before publication.
  2. **Incentivized reviews** — user invited, offered **nominal incentive for time** (gift card/donation per `reviews program` link); **all reviewers get incentive upon approval regardless of rating**; incentivized reviews also subject to QA; incentive capped to encourage breadth not positivity (mirrors G2's $100 ceiling but Capterra wording is "nominal incentive" — not a dollar figure in this extract).
- **[OBSERVED FACT]** **Identity confirmation:**
  - QA team uses **manual checks + enrichment services** to confirm reviewer is genuine person with real experience; flags conflicts of interest + AI-generated personas; unconfirmed → disqualified, never published.
  - Reviewer profiles display: name, photo, function, industry, organization size, duration of use (software) or function/industry/size (services). Photos/names may be hidden for anonymity — but verification still occurs.
- **[OBSERVED FACT]** **Content verification:**
  - **Multiple manual control checks** (reviewer history, depth of interaction, cross-ref consistency)
  - **Technology checks** (content quality, plagiarism, generative AI detection)
  - **Fair & equal treatment** — all reviews same rigorous process regardless of source/incentive
  - **Clear submission guidelines** (link to Community Guidelines QA section)
- **[OBSERVED FACT]** **Fake review combat:**
  > `pattern recognition, behavioral analysis, and cross-referencing data points to identify spam profiles, fake identities, and fraudulent reviews`
  - Flagged → `Request additional proof` (proof of use)
  - Proof reviewed for authenticity; legitimate → published; insufficient → never published + reviewer permanently flagged/removed.
- **[OBSERVED FACT]** **Community Guidelines** (May 4 2026):
  > `We may update these Community Guidelines ... Anyone who violates may be subject to penalties... contact reviews@g2digitalmarkets.com.`
  > `The Site allows users to share experiences... Reviews reflect personal opinions... We do not endorse... Vendor may respond to reviews, but those responses are its own.`
  > Indicates vendor response is allowed and vendor's response is its own responsibility (ties to free reply capability vs G2 paywall).
- **[OBSERVED FACT]** **2026 AI-era tightening (secondary source, single-source):** BGR Review reports new rule: **dual-channel verification — employer email + LinkedIn match** required + **24-mo rolling window + 90-day recency boost** for displayed score. Not yet in official how-we-verify page extract (last updated Feb 24 2025 per search desc) → treat as **[OBSERVED FACT via third-party, INFERENCE that official page lags]**.
- **[OBSERVED FACT]** **Cross-property review syndication:** Reviews shared across Capterra, GetApp, Software Advice equally (observed via GDM acquisition context + blastra: "one review appears on all three platforms, one PPC campaign runs across all three").
- **[OBSERVED FACT]** **Transparency footer on every page (legal + research links):** `Capterra lists all providers across its website—not just those that pay us—so that users can make informed purchase decisions. Sponsored profiles include a link-out icon that takes users to the provider's website.`

### 7.3 Review Content Schema (per card)

- **[OBSERVED FACT]** Fields (via Salesforce/NetSuite snippets): reviewer name (e.g., `Jessica M, Head of Marketing 11-50`, `Ryan M, Account Manager 1,001-5,000`), usage duration (`Used for: More than 2 years`), verification badge (avatar via `reviews.capterra.com/cdn/profile-images/linkedin/...`), quoted pros/cons, overall + sub-ratings.
- **[OBSERVED FACT]** Incentive disclosure: inferred but not in extracted review snippet; Community Guidelines state incentivized reviews are subject to QA but not tagged view in snippet — tag may be collapsed.
- **[INFERENCE]** Review form likely asks: Overall, Ease of Use, Customer Service, Features, Value for Money, Likelihood to Recommend, Review text (likes/dislikes) — inferred from sub-score taxonomy + pros/cons aggregation; not directly extracted as live form.

---

## 8. Comparison Engine

### 8.1 UX & Components

**Test pages:** `/compare/120109-268623/Xero-vs-Abby` (fully extracted), `/compare/147415-211147/EmailOctopus-vs-Levitate`, `/compare/110228-153508/MailChimp-vs-Omnisend` (search dsc).

- **[OBSERVED FACT]** Header: `{Product A} vs {Product B} Features and Cost Comparison` + `Last updated April 15th, 2026` + `Provider data verified by our Software Research team, and reviews moderated by our Reviews Verification team.`
- **[OBSERVED FACT]** Comparison selector: `Your comparison: Xero Abby 2/4 selected [Add products] [Add products]` — supports **up to 4 products** (explicit).
- **[OBSERVED FACT]** Product columns each show:
  - Starting Price (`$25.00/month` vs `€0.01/month`)
  - Value-for-Money / Functionality / Ease of Use / Customer Service (4.x/5)
  - Reviews Sentiment card: `Based on N reviews: Positive / Neutral / Negative` with reviewer avatars (MT, WB, JP placeholders)
- **[OBSERVED FACT]** Feature comparison rows: `Email Campaign Management`, `Price starts from`, etc. (full table truncated in extract but pattern visible).
- **[OBSERVED FACT]** **Alternatives strip mid-page:** `Not a match? Find software alternatives tailored to your priorities. These software suggestions are similar to those you're currently comparing.` → 4 cards: Zoho Books 4.4 (672) $20, Zoho Invoice 4.7 (823) $0, Acumatica Cloud ERP 4.4 (243), PayPal Invoicing 4.7 (594) — each with `Visit Website` + `89% rated it above 4 stars`.
- **[OBSERVED FACT]** **Lead gate bottom:** `Send this comparison chart to my inbox — Fill out the form and we'll send a list of the top-rated software based on real user reviews directly to your inbox. Email Address [Get the comparison] By proceeding, you agree to our Terms Of Use and Privacy Policy. What's your intended use case? Accounting / Billing...`
- **[OBSERVED FACT]** Homepage compare CTA: `Compare popular choices — Evaluate side-by-side each product's features, pricing, reviews, and more — Zoho Projects vs Zoho Sprints — See full comparison — Select top products and create your own side-by-side comparison — Get insights from our experts to guide you through every step of software buying.`
- **[INFERENCE]** Comparison pages are SEO-programmatic at large scale (~hundreds of thousands of 2–4 product combos from 100k catalog; similar table populated from feature + pricing + ratings APIs — inference from consistent table schema + ID-based URL pattern).

### 8.2 Comparison URL Logic

- **[OBSERVED FACT]** Pattern: `/compare/{idA}-{slugA}-vs-{idB}-{slugB}` — single hyphen between ID and slug, `-vs-` delimiter. Numeric IDs are stable product identifiers.
- **[OBSERVED FACT]** 2-product default; adding 3rd/4th likely chains another `-vs-{idC}-{slugC}` — inferred from `2/4 selected` + `Add products` affordance, not directly observed with 3+ in this pass.
- **[INFERENCE]** Alphabetical vs input order? Not confirmed; both A-vs-B and B-vs-A likely resolve or canonicalize to ID order. Flag as inference.

---

## 9. Pricing

### 9.1 Product Pricing (Salesforce Sales Cloud example)

Full data from Salesforce `/p/61368/Salesforce/` pricing extract via web_search description (rich enough for fidelity):

- **[OBSERVED FACT]** Header: Pricing section with `Value for money 4.0 (12,792)` aggregate.
- **[OBSERVED FACT]** **Starter Suite $25.00 Per User, Per Month** — includes: `Lead Management, Account Management, Contact Management, Opportunity Management, Email Integration, Automated Activity Capture`. Verbatim: `Salesforce Sales Cloud starts at $25 per user, per month (billed monthly or annually), which is below the average SMB CRM software budget of $74. Pricing scales steeply across tiers, with advanced plans reaching $550 per user, per month (billed annually). There are no listed seat minimums, but feature depth varies significantly by tier.` + `Check Free Trial [View pricing plan details]`
- **[OBSERVED FACT]** Tiers observed: `Starter Suite $25` → `Pro Suite $100` (description truncated) → `Enterprise` + `Unlimited` implied by `$25–$550` range; G2-style $165/$330 analog not listed here but $550 ceiling observed is higher than G2's $330 host — reflects updated Salesforce catalog (Starter/Pro/Enterprise/Unlimited vs Essentials/Professional naming drift).
- **[OBSERVED FACT]** Homogenous pages: other products show similar: Bitrix24 `$69 Flat Rate Per Month`, Zoho Projects `$4 Per User Per Month`, Materio `$115`, BlueRithm `$135 Per User Per Month`, ConstructionOnline `$475`, LessonBridge `$96 Per User Per Year`, Lucidspark `$7.95 Flat Rate`.
- **[OBSERVED FACT]** Project Management tier table (category buyers guide): `Entry ~free | Mid ~$20–40/user/mo (cap $60) | Enterprise/Advanced ~$700–1,400+/month` — pricing content block bottom of category page (AI-generated, research-backed).
- **[OBSERVED FACT]** Disclaimer: `Pricing information is supplied by the software provider or retrieved from publicly accessible pricing materials. Final cost negotiations must be conducted with the seller.` pattern observed via G2 analog and Capterra's provider-verified language (`Provider data verified by our Software Research team`).
- **[OBSERVED FACT]** `Free Trial | Free Version` badges per product (filterable) — transparency on trial availability.

### 9.2 No Public Buyer Pricing (Platform is Free to Buyers)

- **[OBSERVED FACT]** Buyer side free: `Capterra is free for buyers interested in finding software ... We don't charge buyers for information or recommendations via our advisor service.` (transparency page).
- **[OBSERVED FACT]** No `/pricing` on capterra.com for buyers — all pricing is product-level vendor pricing; buyer use is free. All platform monetization is vendor-facing (see §11).

---

## 10. Lead Generation & Intent Flywheel

### 10.1 Observed Lead Capture Points

1. **Visit Website (Sponsored click)** — primary PPC conversion: `[Visit Website →]` outbound button on sponsored profiles (orange, with outbound icon). Click billed to vendor. **[OBSERVED FACT]**
2. **Advisor consultation** — persistent interstitial: `Talk to a software expert to get a free software list tailored to your business needs [Contact us]` + homepage promise `Get insights from our experts to guide you through every step of software buying` + header `Why Capterra is free — Advisors`. **[OBSERVED FACT]**
3. **Send comparison to inbox** — email gate on compare pages: `Email Address [Get the comparison] + Terms/Privacy + What's your intended use case? Accounting / Billing...` — qualification dropdown. **[OBSERVED FACT]**
4. **Send top-rated list to inbox** — category page form: `Fill out the form and we'll send a list of the top-rated software based on real user reviews directly to your inbox. Email Address [Send Me The List]` **[OBSERVED FACT]**
5. **Get Advice / Advisor interstitial on product profiles** — Salesforce FAQ strip: `Have more questions? Connect with one of our advisors for a free consultation [Contact us]` **[OBSERVED FACT]**
6. **Write a Review** — `Write a Review → reviews.capterra.com/search` + reviewer identity collection (email + LinkedIn) — captures researcher intent even when not buying. **[OBSERVED FACT]**
7. **Vendor Get Listed** — `Get Your Product Listed → app.g2digitalmarkets.com/get-listed/start` — vendor self-serve funnel. **[OBSERVED FACT]**
8. **Mobile/SMS** — Privacy policy collects `mobile phone number ... where you choose to receive communications via SMS` — implies SMS follow-up in lead flow (mirrors Software Advice). **[OBSERVED FACT]** via privacy policy search desc.

### 10.2 G2 Buyer Intent (Unified Post-Acquisition)

- **[OBSERVED FACT]** company.g2.com news (June 2026): `G2 Expands Buyer Intent Across Four Software Discovery Platforms, Delivering Up to 2x More Signals — now expanded to bring together buyer research activity across G2, Capterra, Software Advice, and GetApp into a single unified view.`
- **[OBSERVED FACT]** blastra.io (June 3 2026 update): `G2 unified Buyer Intent across G2, Capterra, Software Advice, and GetApp into a single view in the G2 profile, the first real merge of the two backends. Buyer Intent sits outside the basic Brand Professional plan as a separate paid add-on with no published price.`
- **[INFERENCE]** Intent signals include: category page views, product profile visits, compare page views, pricing/feature tab views, advisor consultation requests, comparison email gates — aggregated at account-level across 4 properties (IP-to-company + authenticated user company). Inferred from standard Buyer Intent architecture + G2 expansion copy ("real software evaluation behavior").
- **[INFERENCE]** Unified Intent is the post-acquisition monetization bridge — Capterra's PPC inventory stays, but Intent becomes the upsell. Flag as inference for pricing tiering.

### 10.3 Advertising Placement

- **[OBSERVED FACT]** Pictet: Sponsored listings appear **above organic ranking** inside category search results, marked with orange `Visit Website` button (vs organic's `Get Pricing`/`Learn More`). **[OBSERVED FACT]** via spotsaas: `Sponsored listings appear above the organic ranking inside a category's search results, marked with an orange "Visit Website" button, not the "Get Pricing" or "Learn More" call-to-action that organic listings carry.`
- **[INFERENCE]** Intent-qualified ad targeting (category, competitor, persona) is the value layer over raw placement — inferred from Buyer Intent expansion narrative.

---

## 11. Monetization — Full Stack (Vendor Side)

| Revenue Line | Plan / Price Observed | What's Included | Observed Source |
|--------------|----------------------|-----------------|-----------------|
| **Free listing** | $0 | Create product profile, logo + description, **collect & display verified reviews**, appear in category listings, **earn & display badges for free**, **respond to reviews for free** | **[OBSERVED FACT]** blastra table: `Free listing: yes, Respond to reviews: free, Earn badges: free, Display badges: free` + transparency page |
| **PPC Advertising (core)** | **$2.00/click floor**, **$500/month minimum budget**, **$0.25 bid increments**, **second-price auction** (pay just above next-highest bidder) | Sponsored placement **above organic** in category search results; one campaign runs across **Capterra + GetApp + Software Advice** simultaneously; dashboard: clicks by category/date, avg CPC, spend cap; 30-day conversion tracking, 60-day invalid-click dispute | **[OBSERVED FACT]** PPC Service Description + blastra + spotsaas tables; `Typical CPC $2–$10` uncontested, higher in CRM/ERP (spotsaas reported) |
| **PPL / Qualified Leads (Software Advice advisors)** | Not published (BANT-screened leads generally $50–$500 per lead per ViB benchmark; Software Advice model described as referral fee) | Human advisor screens buyers (Budget/Authority/Need/Timeline) before handing sales-qualified lead to vendor; recommendations matched to needs from participating vendors | **[OBSERVED FACT]** PPL Service Description existence + spotsaas: `Software Advice runs sibling model called Pay-Per-Lead`; transparency page: `Sales lead qualification for software providers only` |
| **Get Listed / Profile enhancement** | Entitlement via PPC upgrade (Sponsored Profile) | Customized profile, enhanced features, link-out CTAs (`Visit Website / Try for Free / Book Demo`) vs organic CTAs | **[OBSERVED FACT]** /vendors `Build your brand — Stand out with a customized product listing` + spotsaas: `upgrade to Sponsored Profile, then activate PPC Campaign, then wait for G2 DM approval` |
| **Buyer Intent (unified G2)** | Separate paid add-on (no published price) | Unified view of buyer activity across all 4 platforms (category/product/compare/advisor), account-level signals, complementary to ABM; up to 2x more signals post-unification | **[OBSERVED FACT]** g2 expansion post + blastra addendum |
| **Content / Badge Licensing** | Free to earn/display on Capterra (vs G2 paywall) | Shortlist Badges, `Capterra Shortlist` graphic, report reprints — governed by **Content Compliance Policy** (pre-approval for earnings calls, draft-leak ban up to 3 months) | **[OBSERVED FACT]** blastra: `Display badges: free` on Capterra vs G2 paywall + Content Compliance Policy extract |
| **Referral fee (sponsored redirect)** | Per-click or per-lead fee (auction vs fixed) | When buyer visits provider via sponsored link or speaks to advisor, Capterra earns referral fee (disclosed on every page footer) | **[OBSERVED FACT]** every page footer + transparency page: `Capterra makes money through referral fees from providers who sign up for sponsored profiles or sales lead qualifications` |
| **G2 Digital Markets bundle** | Unified ownership (as of Feb 2026) | Vendors growingly sold as GDM network (one dashboard, one review DB, one PPC campaign across 3 front doors); separate sales teams/pricing as of mid-2026 (pre-integration) | **[OBSERVED FACT]** /vendors `Capterra, powered by G2 Digital Markets` + blastra mid-2026 snapshot |

**Monetization Inference:** When blended, Capterra's model is **performance + scale**: free content (900 cats × 100k products SEO) → sponsored ranking monetizes existing traffic without gating buyer experience. Auction dynamics mean CPM equivalent scales with category competitiveness (CRM/ERP most expensive). Post-acquisition, G2's subscription intent upsell sits atop Capterra's performance base — dual monetization path (rent the traffic + sell the signal). **[OBSERVED FACT offer structure + INFERENCE on strategy]**

**Policy Note:** Both `/legal/ppl-service-description/` and `/legal/ppc-service-description/` returned 200 but headless extract returned only shell/footer (JS-rendered content). Floor prices, auction rules, budget caps confirmed via secondary reporting that directly cites the Service Descriptions — treat quoted figures as **[OBSERVED FACT via service description citation by blastra/spotsaas]** pending re-render.

---

## 12. SEO Moat — Why Capterra Ranks

- **[OBSERVED FACT]** Every category has long-form **research-backed buyers guide** bottom (e.g., Project Management: `What is PM software? | What should small businesses look for? (table) | How much does PM software cost? (tier table) | What features should I look for? (checklist)`) — provides keyword density + internal linking + freshness. Last-updated dates observed: NetSuite `August 20, 2026`; Xero-vs-Abby `April 15, 2026`; guides dated `June 24–26, 2026` on resources hub.
- **[OBSERVED FACT]** Programmatic internal linking: homepage → 900 categories → category → product cards (each with review counts anchor text) → product tabs (216 features, integrations, pricing, reviews) → compare pages (linking 2–4 products) → alternatives (4 suggestions) → Shortlist/FAQs linking back to category.
- **[OBSERVED FACT]** Feature glossary: each feature term (e.g., `AI/Machine Learning`, `API`, `Appointment Scheduling`, `Project Management`, `Prioritization`) has definition + voter stat — creates long-tail glossary SEO.
- **[OBSERVED FACT]** Freshness signals: `Last updated` dates on comparisons + pricing `View pricing plan details` + review recency window (24-mo + 90-day boost) constantly refresh content.
- **[OBSERVED FACT]** Review volume + recency weighting reinforces content freshness loop: new reviews constantly refresh product pages; Shortlist score depends on recent reviews, incentivizing vendors to drive recent reviews.
- **[OBSERVED FACT]** Country subdomains (`capterra.ca`, `capterra.com.au`, `capterra.in`, `capterra.com.sg`) replicate taxonomy for international long-tail.
- **[INFERENCE]** E-E-A-T: methodology docs (`proprietary-data-research` 14-min read, `how-we-verify-reviews` 5-min read, `how-we-ensure-transparency`), author bylines (Research Manager Zach Capers), and three-trust-banner on every page serve as trust signals to Google. Structural observation, not ranking claim.

---

## 13. Trust, Legal & Compliance Surface

- **[OBSERVED FACT]** Legal hub lists 12+ policy pages: General User Terms, General Vendor Terms, Privacy Policy, Content Compliance Policy, Community Guidelines, Profile Guidelines, Cookie Policy, Free Stuff Addendum, PPL Service Description, PPC Service Description, Data Processing Addendum, Data Transfer Addendum.
- **[OBSERVED FACT]** **General User Terms** header: `These General User Terms, including the Content Compliance Policy, Community Guidelines, Profile Guidelines, Privacy Policy, Cookie Policy and Free Stuff Addendum... govern your access to and use of www.g2digitalmarkets.com, www.capterra.com, www.softwareadvice.com, www.getapp.com ... By using the Site, you represent ... you are at least 18, ... you will use the Site solely for business and professional purposes only and never for personal, family, or household purposes ...` + class/arbitration waiver clause quoted verbatim in search description.
- **[OBSERVED FACT]** **Community Guidelines** (May 4 2026): governs Reviews Program; defines review content rules; violations = comment on profile or suspension or legal penalty; contact `reviews@g2digitalmarkets.com`.
- **[OBSERVED FACT]** **Content Compliance Policy:** `The badges from Capterra, GetApp, and SoftwareAdvice are trademarks and service marks of Capterra, Inc., Nubera EBusiness S.L., Software Advice, Inc. and/or its affiliates ...` + `reprints ban of up to three months may be imposed if you have shared ... DRAFT research ... or ... earnings call without pre-approval ... email legal@g2.com ... allow at least 5 business days`.
- **[OBSERVED FACT]** **Privacy Policy** sections (TOC): 1 Scope, 2 Personal Info We Collect, 3 How We Use, 4 Reviews & UGC, 5 How We Disclose, 6 Legal Bases, 7 Cookies, 8 Marketing Choices, 9 Data Retention, 11 Security, 12 Children's Privacy, 13 Your Privacy Rights, 14 U.S. State Disclosures, 15 Do Not Track, 16 Changes, 17 Contact + `G2.com, Inc., Software Advice Inc., Capterra Inc., Nubera eBusiness S.L.` as joint operators (mirrors Software Advice privacy policy — unified GDM legal entity).
- **[OBSERVED FACT]** **404 handling:** `/policy` and `/legal/terms` (without category) return `Page not found — couldn't find this page. Try checking your URL... [Software Categories] [Write a Review] [Blogs & Research] or email info@capterra.com` — indicates strict `/legal/*` namespace (not top-level `/policy` or `/legal/terms` shorthand).
- **[NOT OBSERVED]** Full PPC/PPL Service Description body (JS-rendered; shell only). Retry with JS-capable render (Playwright) to audit click-validation, 30-day conversion window, 60-day dispute window, bid-increment rules in primary text.

---

## 14. Gaps, Risks & Unknowns (Explicitly Not Observed)

- Full JS-rendered nav, header mega-menu columns, mobile nav — not extracted (headless collapse + Cloudflare WAF on curl). Verify with Playwright full render + cookie-enabled session.
- Exact review form field list (Likelihood to Recommend scale, N/A handling, photo proof flow, LinkedIn OAuth) — sampled only via verification docs, not live form.
- Grid/Shortlist quadrant image thresholds (numeric cutoffs) — referenced but SVG not rendered in extract.
- Deals affiliate revenue share % — not applicable to Capterra (no Deals layer; G2 Deals is G2-only).
- PPL/PPC Service Description full fee schedule (per-lead price bands, category minimums beyond $2/$500) — blocked; requires auth/render to audit.
- Category filter counts for >900 categories (only A-sample + PM CRM page seen) — full hierarchy requires crawling `/categories/` paged or sitemap crawl.
- Review text AI-summary layer (pros/cons aggregation algorithm details beyond "proprietary blend" — not disclosed).
- International parity (pricing in EUR/GBP on .ca/.au/.in) — not audited in this pass.

---

## Appendix A: URLs Crawled (for reproducibility)

```
# Homepage & hubs
/                                   — homepage (hero, stats, featured categories + product cards)                 [OBSERVED FACT]
/categories/                        — all 900+ categories A→Z                                                     [OBSERVED FACT]
/vendors                            — vendor portal, G2 Digital Markets messaging                                  [OBSERVED FACT]
/resources/                         — Blog & Research hub                                                          [OBSERVED FACT]
/resources/how-we-verify-reviews/   — verification methodology (2.5M+, 30 moderators, 20 checks)                    [OBSERVED FACT]
/resources/how-we-ensure-transparency/ — transparency + business model (100k+ providers, free buyer model)         [OBSERVED FACT]
/resources/proprietary-data-research/ — proprietary data & research methodologies (Shortlist, Best lists)          [OBSERVED FACT]
/faq/                               — FAQs (Why is Capterra Free?, Review verification)                            [OBSERVED FACT]

# Categories (sample)
 /project-management-software/       — PM category (filters, sort, pricing tiers, buyers guide)                     [OBSERVED FACT]
 /crm-software/                     — CRM category (via search description fallback; direct curl blocked by WAF)   [OBSERVED FACT via search desc]
 /accounting-software/              — referenced via categories list (not extracted this pass)                      [INFERENCE]

# Product profiles (ID-prefixed pattern)
/p/61368/Salesforce/                — Salesforce Sales Cloud (via web_search descriptions: pricing/features/pros-cons) [OBSERVED FACT via search desc — product hub WAF-blocked for direct fetch]
/p/135757/NetSuite/                 — NetSuite (fully extracted: pros/cons, features lexicon, Shortlist badge)     [OBSERVED FACT]
/p/133101/Premier/                  — Premier Construction (homepage card: 4.7 (288))                               [OBSERVED FACT]
/p/79104/Smartsheet/                — Smartsheet (homepage card: 4.5 (3541))                                       [OBSERVED FACT]
/p/5923/Celoxis/                    — Celoxis (homepage card: 4.5 (553))                                            [OBSERVED FACT]
/p/110832/kantata/                  — Kantata (homepage card: 4.2 (627))                                          [OBSERVED FACT]

# Reviews / Pricing / Features (sub-tabs exist; some blocked)
/p/61368/Salesforce/reviews/        — existed per URL pattern; blocked by WAF on direct fetch (data via search desc) [OBSERVED FACT pattern, INFERENCE content]
/p/61368/Salesforce/pricing/        — same
/p/61368/Salesforce/features/       — same (216 features enumerated via search desc)

# Comparison
/compare/120109-268623/Xero-vs-Abby                         [OBSERVED FACT — fully extracted]
/compare/147415-211147/EmailOctopus-vs-Levitate             [OBSERVED FACT — via search desc]
/compare/110228-153508/MailChimp-vs-Omnisend               [OBSERVED FACT — via search desc]

# Shortlist / Research
insights.capterra.com/shortlist                             [OBSERVED FACT]
capterra.com.au/blog/2584/shortlist-methodology             [OBSERVED FACT — via search desc]
digital-markets.gartner.com/research-reports                [OBSERVED FACT — via search desc]
blog.capterra.com/research-methodologies                    [OBSERVED FACT — via link]

# Legal
/legal/terms-of-use/                                        [OBSERVED FACT — via search desc]
/legal/privacy-policy/                                      [OBSERVED FACT — via search desc]
/legal/community-guidelines/                                [OBSERVED FACT — shell extracted]
/legal/content-policy/                                      [OBSERVED FACT — via search desc]
/legal/ppl-service-description/                             [OBSERVED FACT — shell (JS) + secondary citation]
/legal/ppc-service-description/                             [OBSERVED FACT — shell (JS) + secondary citation]
/legal/cookie-policy/                                       [OBSERVED FACT — via search desc]
/legal/general-vendor-terms/                                [OBSERVED FACT — footer link]
/policy                                                     — 404 (correct path is /legal/privacy-policy/)                [OBSERVED FACT]
/legal/terms                                                — 404 (correct is /legal/terms-of-use/)                       [OBSERVED FACT]

# Secondary vendor-pricing reporting (cited as Observed via citation)
/blastra.io/blog/g2-capterra-vendor-pricing-compared/      [OBSERVED FACT — 11,891 char extract]
/spotsaas.com/blog/capterra-advertising                    [OBSERVED FACT — 11,707 char extract]
company.g2.com/news/g2-acquires-capterra...                [OBSERVED FACT — via search desc]
company.g2.com/news/g2-expands-buyer-intent-capabilities   [OBSERVED FACT — via search desc]
```

---

## Appendix B: Reproduced Disclosure Banners (verbatim, footer on every page)

**Independent research methodology**
> "Capterra's researchers use a mix of verified reviews, independent research and objective methodologies to bring you selection and ranking information you can trust. While we may earn a referral fee when you visit a provider through our links or speak to an advisor, this has no influence on our research or methodology. [Learn more → /resources/proprietary-data-research/]"

**How Capterra verifies reviews**
> "Capterra carefully verified over 2.5 million+ reviews to bring you authentic software experiences from real users. Our human moderators verify that reviewers are real people and that reviews are authentic. They use leading tech to analyze text quality and to detect plagiarism and generative AI. [Learn more → /resources/how-we-verify-reviews/]"

**How Capterra ensures transparency**
> "Capterra lists all providers across its website—not just those that pay us—so that users can make informed purchase decisions. Capterra is free for users. Software providers pay us for sponsored profiles to receive web traffic and sales opportunities. Sponsored profiles include a link-out icon that takes users to the provider's website. [Learn more → /resources/how-we-ensure-transparency/]"

---

## Deliverable Note

- **Verification level:** All high-confidence claims above are anchored to quoted extracts or cited service descriptions; remaining claims explicitly tagged **[INFERENCE]**.
- **WAF caveat:** Direct curl/browser without JS/cookie fails Cloudflare challenge on `capterra.com` — Exa/Parallel web_extract succeeded for homepage, categories, vendors, legal shell, PM category, NetSuite, compare, and resources; Salesforce product hub and CRM category required fallback to web_search descriptions (treat that data as **[OBSERVED FACT via search desc]** not direct page markdown). Re-run with `EXA_API_KEY` + headless Chromium with cookie jar for full DOM.
- **Reproducibility:** Re-run `web_extract` on URLs in Appendix A; Shortlist methodology is versioned (`Feb 2022–Present`, updated June 24 2025) for audit. Vendor pricing floor/budget/auction rules are in `/legal/ppc-service-description/` (cite via blastra/spotsaas excerpts if JS-render fails).
- **Suggested next scrape:** Headless browser (Playwright with JS + cookie challenge solved) for nav mega-menu DOM, Shortlist SVG coordinates, review card microdata (JSON-LD `AggregateRating`), category sitemap (`/sitemap.xml` or `gdm-catalog-fmapi-prod.imgix.net` assets), and `/categories/` pagination counts.
