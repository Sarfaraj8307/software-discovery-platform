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

