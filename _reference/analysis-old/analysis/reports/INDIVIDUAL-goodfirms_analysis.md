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
