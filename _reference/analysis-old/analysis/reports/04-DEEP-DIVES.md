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
