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
