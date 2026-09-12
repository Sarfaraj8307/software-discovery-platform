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
