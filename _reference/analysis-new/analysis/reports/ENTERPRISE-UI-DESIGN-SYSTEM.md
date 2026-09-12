# Enterprise UI Design System — Software Discovery Platform

**Date:** 2026-09-02
**Scope:** Best attractive UI for an enterprise-level B2B software discovery & comparison marketplace (G2/Capterra/TrustRadius class)
**Stack:** Next.js 15 App Router + Tailwind CSS + shadcn/ui (Radix) + Lucide + Framer Motion
**Grounding:** Synthesized from live crawls of G2 (3.6M reviews), Capterra (2.5M/900 cats), GoodFirms (1.2M/80k firms), TrustRadius, SaaSworthy, SourceForge, Product Hunt, Gartner Digital Markets + 2025-26 enterprise design systems (Stripe, Linear, Vercel, Salesforce Lightning, Figma, Airbnb)
**Accessibility:** WCAG 2.2 AA target, axe-core + Lighthouse CI

> This is the *buildable* spec. Pair with `blueprint/PLATFORM-BLUEPRINT.md`, `schemas/DATABASE-SCHEMA.md`, and `reports/08-UIUX-ARCHITECTURE.md`. If conflict, this doc wins for UI.

---

## 1. Design Principles (Enterprise Attractiveness)

### 1.1 Why This Wins at Enterprise
| Principle | What it means in product | Competitive edge vs G2/Capterra |
|-----------|--------------------------|----------------------------------|
| **Evidence over marketing** | Ratings, verification badges, and comparison scores are visually primary; vendor copy is secondary panel | G2 buries methodology; we surface it inline |
| **Density without clutter** | Category pages show 18-24 cards above the fold with scannable metadata; product pages show 6 tabs sticky + right-rail lead form | Capterra density is low; G2 cards are noisy |
| **Comparison-first** | `Compare` is never more than one click away: product card → bucket → table; comparison table is the most polished surface | G2 comparison is an afterthought, unstyled |
| **Trust at a glance** | Verification (Validated, Current User, LinkedIn) is a badge row, not footnote | TrustRadius does this well; we amplify |
| **Zero dead ends** | Every list has a next step: filter chips → card → profile → compare → lead. Empty states guide to adjacent categories | SourceForge drops users |

### 1.2 Attractive = Calm, Precise, Confident
- **Visual metaphor:** *Financial terminal meets editorial magazine* — Linear's precision + Stripe's calm + Vercel's density. Not playful (Product Hunt), not heavy (Salesforce).
- **Motion:** Micro-interactions only (150ms ease-out for hover, 200ms for sheet/drawer). No parallax, no loading spinners longer than 400ms (skeleton instead).
- **Voice:** Quiet authority. No exclamation marks. Headlines are noun phrases: "Best CRM Software — August 2026" not "Find your perfect CRM!"

---

## 2. Foundations

### 2.1 Color System (Light default + Dark parity)
**Rationale:** Enterprise buyers live in dashboards 8h/day. Low-contrast neutrals with one saturated accent reduce fatigue while preserving scan-ability.

```css
/* tailwind.config.ts — extend */
colors: {
  border: "hsl(240 5% 88%)",        /* #E4E4E7 zinc-200 */
  input: "hsl(240 5% 88%)",
  ring: "hsl(221 83% 53%)",          /* #2563EB indigo-600 — single accent */
  background: "hsl(0 0% 100%)",
  foreground: "hsl(240 6% 10%)",     /* #18181B zinc-900 */
  muted: { DEFAULT: "hsl(240 5% 96%)", foreground: "hsl(240 5% 45%)" },
  accent: { DEFAULT: "hsl(221 83% 53%)", foreground: "white" },
  success: "hsl(142 76% 36%)",       /* emerald-600 for verified/trust */
  warning: "hsl(38 92% 50%)",        /* amber-500 for incentivized flag */
  card: "hsl(0 0% 100%)",
}
dark: {
  background: "hsl(240 6% 7%)",      /* #111113 */
  foreground: "hsl(0 0% 96%)",
  muted: "hsl(240 4% 14%)",
  border: "hsl(240 4% 18%)",
}
```

- **Accent discipline:** Only CTAs (Contact Vendor, Add to Compare, Submit Review), active tab underline, and rating fill use `accent`. Everything else is grayscale. This is what makes it feel expensive.
- **Semantic:** `success` = Validated/Current User badges, `warning` = Incentivized/Sponsored disclosure (never hide this — FTC 16 CFR Part 255 requires clear disclosure).
- **Contrast:** All text ≥4.5:1 (AA). Accent button text is white on 221/53 — passes 5.2:1.

### 2.2 Typography
```
font-sans: "Inter var" (or "Geist Sans" if shadcn default) — 400/500/600 only
font-mono: "Geist Mono" — for scores, G2 Score, price, IDs
Headings: 600, tracking -0.02em, leading 1.1
Body: 400/15px, leading 1.6, max 68ch for editorial blocks (SEO content at page bottom)
Labels: 500/12px uppercase tracking 0.08em (BADGE, VERIFIED, SPONSORED)
```

- **Scale:** 12 / 13 / 14 / 16 / 20 / 24 / 30 / 36. Never 18 or 22. Enterprise density uses 13-14 for metadata, 16 for body.
- **Numeric:** Tabular nums for ratings, prices, comparison table. `font-variant-numeric: tabular-nums`.

### 2.3 Spacing & Density
- **Grid:** 4px base, 24px outer gutters on desktop, 16px on mobile. Cards use 16px padding, 12px gap in lists.
- **Density modes:** Default is *compact* for enterprise (like Linear). Offer user toggle `Comfortable / Compact` persisted in localStorage; compact = 12px card padding, 32px row height in comparison table.
- **Radii:** 8px cards, 6px buttons/inputs, 12px dialogs, 999px pills. No large 16px cards (feels consumer).
- **Shadows:** `shadow-sm` for cards, `shadow-md` for sticky header/drawer, `shadow-lg` for dropdowns. No shadow on page background.

### 2.4 Iconography & Illustration
- **Icons:** Lucide only, 16px default, stroke 1.75. Never mix outline + filled.
- **Illustration:** None decorative. Only product logos (16-20px), feature icons (monotone outline), and empty-state line art (single color, 80% opacity). Avoid Product Hunt-style 3D blobs at enterprise tier.

---

## 3. Component Library (shadcn/ui mapping)

| Need | shadcn primitive | Our wrapper | Notes |
|------|------------------|-------------|-------|
| Button | `Button` | `Button variant: default/outline/ghost` | `default` = accent, `outline` = secondary, height 36px (enterprise) not 40 |
| Input/Search | `Input` | `SearchAutocomplete` | Grouped results (Products/Categories/Comparisons), keyboard nav, cmd+K shortcut |
| Card | `Card` | `ProductCard`, `CategoryCard`, `ComparisonCard` | See §5-6 |
| Tabs | `Tabs` | `ProductTabs` (6 tabs) + sticky underline | Underline 2px accent, not filled pills |
| Drawer/Sheet | `Sheet` / `Dialog` | `FilterDrawer` (mobile) | Right-anchored, 380px, scrim 40% black |
| Select | `Select` | `SortSelect`, `SegmentSelect` | Popper width 220 |
| Badge | `Badge` | `TrustBadge`, `SponsorBadge`, `G2ScoreBadge` | 10px font, 4px radius, muted vs accent |
| Table | `Table` | `ComparisonTable` | Sticky header + first col, striped rows, horizontal scroll |
| Avatar | `Avatar` | Reviewer avatar | 32px, fallback initials |
| Tooltip | `Tooltip` | Score explanation (FTC, methodology) | Delay 200ms |
| Skeleton | `Skeleton` | `CardSkeleton`, `TableSkeleton` | Never spinner for list loads |

**Custom composites (not shadcn):** `ComparisonBucket` (sticky bottom bar, 2-3 slots), `RatingDistribution` (histogram), `HelpfulButton` (thumbs + count), `LeadForm` (contextual right rail), `TrustBar` (Verified/Current User row), `VerificationChecklist` (screenshot proof steps).

---

## 4. Layout System

### 4.1 Page Frame
```
┌─────────────────────────────────────────────────┐
│ Header (sticky, 56px, border-b, backdrop-blur)  │  ← Logo · Categories mega-menu · Search (flex-1, max 560px) · Compare (bucket count) · Write Review · Auth
├─────────────────────────────────────────────────┤
│ Breadcrumbs · Trust bar (12px, muted)            │  ← Home > Sales Tools > CRM · "Verified reviews · 3.6M · Updated Aug 2026"
├─────────────────────────────────────────────────┤
│ Main (max 1280px, mx-auto, 24px gutters)         │
│  Left (720px) · Right (360px sticky 80px top)    │  ← Product/category: left = content, right = LeadForm / Comparison CTA / TOC
├─────────────────────────────────────────────────┤
│ Footer (240px, muted bg, 4 cols + compliance)    │
└─────────────────────────────────────────────────┘
```

- **Sticky behavior:** Header + product tab bar + right-rail lead form are sticky. This keeps Contact/Compare always reachable — critical for PPL conversion.
- **Responsive:** Desktop = two-column, Tablet = single column with right rail collapsing below, Mobile = Sheet for filters + bottom ComparisonBucket.

### 4.2 Grid
- **Homepage:** 12-col, hero spans 7-8 cols + visual 5-4 cols (search + featured logos).
- **Category listing:** Cards in 3-col on 1280px, 2-col on 900px, 1-col on mobile. Gap 16px. No masonry.
- **Comparison table:** Full-bleed inside page gutters, horizontal scroll with frozen first column (product name).

---

## 5. Homepage — Hero & Discovery

**Wireframe narrative (build this):**

**Hero (above the fold, 520px tall):**
- Left: `H1 — "Where you go for software"` (32px/600) + `Sub — "Compare 3.6M verified reviews. No pay-to-play rankings."` (16px/ muted) + `SearchAutocomplete` (56px tall, shadow-md, placeholder "Ask a question or search products, categories, comparisons..." + cmd+K hint) + `Trust chips:` `✓ LinkedIn-verified` `✓ Screenshot proof` `✓ $0 to be listed` (12px pills, muted)
- Right: `Featured grid` — 6 logos (Agentforce, HubSpot, etc.) in 3×2, each with name + 4.4 ★ (4.6K) — seeded from top Marketplace, not curated editorial. Click goes to product profile.
- Below hero: `Most Popular Categories` — 10 chips (Project Mgmt, CRM, Video Conf...) + `Browse all 630+ →` link. Then 6-up product cards per category block (reuse ProductCard).

**Second fold:**
- `Leaderboards:` "New & Trending this week" (algorithm: compare views + review velocity — explain tooltip) + "Most Compared" (CLARITY/ VS pairs)
- `Social proof strip:` 100M+ buyers / 6M reviews / 1200 categories — muted, tabular nums, not decorated.

**SEO footer:** Same long-form content block as category but collapsed to 2-line preview with `Learn more about how we rank`.

---

## 6. Category Listing Page (`/categories/{slug}`)

**Do not confuse with directory (`/categories`). This is the money page.**

**Header:**
- `H1: Best {Category} Software — August 2026` (30px) + `Count: 1,598 Listings` + `Tabs: Overview · Trending · Highest Rated · Easiest To Use · Free · Resources` (underline style, not pills)
- `Meta row:` Breadcrumb + Methodology link ("How we score → /methodology", anchor explains G2 Score formula in one line)

**Two-column:**
- **Left filters (280px, sticky):** Search within category → `Features` (checklist with counts, e.g., Contact Mgmt 812) → `Pricing` (Free, Free Trial, Paid) → `Deployment` (Cloud, On-Prem) → `Company Size fit` (Small/Mid/Enterprise) → `Integration` (HubSpot, Salesforce...) → `Clear all` persists. On mobile → Sheet.
- **Center list:** `Sort: G2 Score · Popularity · Satisfaction` (Select) + `Density toggle` + `Filter chips` (active filters as removable pills) → `ProductCards` (vertical stack, 16px gap). Pagination 20 per page, `?page=2&order=g2_score&segment=small-business` preserved.

**ProductCard spec (compact, high scan):**

```
┌──────────────────────────────────────────────────────┐
│ [Logo 32px]  Product Name  (Verified Publisher ✓)   ● Add to Compare  │
│ 4.4 ★★★★☆  (25,879) · G2 Score 88 · Leader badge    │
│ One-line vendor value prop truncated at 96ch          │
│ Chips: CRM · Sales Automation · Free Trial · 192 Integrations │
│ Actions: Contact Vendor · View Profile · Compare (link) │
└──────────────────────────────────────────────────────┘
```

- **No pricing on card** (keeps neutrality). Pricing lives on profile tab.
- **Leader badge** is muted outline (not gold) — avoids paid-placement perception.

**SEO content (below list, collapsed):**
- "Buying insights at a glance" + 300-word editorial + feature taxonomy table + FAQs (3 Qs, `Last updated Aug 13 2026`) — rendered server-side for crawl, `prose` styling.

---

## 7. Product Profile (`/{category}/{product}`) — The Conversion Page

**URL shape:** `/{category}/{slug}/reviews` canonical, tabs are anchors + routes: `/pricing`, `/integrations`, `/alternatives`, `/discuss`.

**Hero (560px tall, two-column):**

- Left 720px:
  - Banner (optional vendor-supplied, desaturated 20% so it doesn't compete with content; capped 320×80)
  - `Logo 48px + Name 24px + Seller → /sellers/{seller} + Solution Type (All-in-One)` + `Verification row:` `G2 recognized` medal + `Validated` + `Current User` badges (10px, muted)
  - `Rating row:` 4.4 ★★★★☆ (25,879) → histogram on hover (Popover). `G2 Score 88` (out of 100, tooltip explains formula) + `Leader` pill only if methodology qualifies — never vendor-purchased.
  - `Tab bar (sticky, scroll spy):` `Overview | Reviews (25,879) | Pricing | Integrations (192) | Alternatives | Q&A` — underline active, count in tab label only for Reviews/Integrations.

- Right 360px (sticky):
  - `LeadForm` card (shadow-md): `Contact Agentforce Sales` — fields: Name*/Work Email*/Company*/Phone/Intent(Replace/Search/Browse) → `Send` (accent) + microcopy "Free, no spam. Response in 1 business day. Your data per Privacy Policy." + `Visit Website` (ghost) secondary. This is the enterprise lead capture — track `source_location=product%23hero`.
  - Below form: `Quick stats` (Pricing from $25, Free Trial ✓, 192 Integrations) + `Compare` CTA (if in bucket).

**Tab 1 — Overview:**
- Vendor long description (prose, 14px, 68ch) + `Languages (32)`, `Solution Type`, `Overview by (author)` + "Used by" logos (muted, 24px).
- `Features:` checklist (left: feature, right: % of reviewers who mention) — not vendor claim.
- `Media:` 3-across screenshots with caption, lightbox.

**Tab 2 — Reviews (≈70% of profile engagement):**
- `RatingDistribution:` histogram (5★ 64% → 1★ 0%) + `Pros & Cons` pills (`Ease of Use (2,065)`, `Learning Curve (1,092)`) linking to filtered views `?filters[sentiment_snippet]=`.
- `AI summary:` 4 bullets, `Generated using AI from real user reviews` + `Last updated` — include `AI Verified` toggle if sourced from verified reviews only.
- `Review cards:` One per verified reviewer — Avatar 32px + Name + Title + Company size + `Validated`/`Current User`/`Incentivized` badges (warning color for incentivized, but never hidden) + `Source: G2 invite` + `Date` + `5★` + `What do you like best?` (2-3 lines, expand) + `What do you dislike?` + `Helpful (12)` + `Report`. Show screenshot proof thumbnail if Current User.
- Filter bar above cards: `All · 5★ · 4★ · Verified only · Current User only`.

**Tab 3 — Pricing:**
- `4-up pricing cards:` Starter $25 / Professional $100 / Enterprise $165 / Unlimited $330 — each with feature diff (`+ Workflow automation`), CTA `View details`. Disclaimer muted: "Supplied by vendor or public pricing; final quote via seller."
- `G2 Deals:` If applicable, show `25% off via G2 — SAVE25` as secondary offer with tracking — not primary price.
- `Pricing FAQs` (AI-generated, 3 Qs) + `Pricing reviews` strip (reviews mentioning pricing).

**Tab 4 — Integrations:**
- 36-logo grid (6 per row, paginated), search within integrations, `Shows 192` count + `Verified by vendor` check.

**Tab 5 — Alternatives & Comparisons:**
- Horizontal strip: `Alternative: HubSpot vs ...` plus `Most Compared` pairs linking to `/compare/{a}-vs-{b}`.

---

## 8. Comparison Table (`/compare/{a}-vs-{b}[-vs-{c}]`)

**This is the highest-value buying surface — invest 40% of front-end polish here.**

**Header:**
- `H1: {Product A} vs {Product B} Comparison — What are differences?` + `+ Add Product` (up to 4; alpha canonical `?slugs=a-vs-b-vs-c` sorted)
- Dual hero: Side-by-side logos + `4.4 (25,879)` + `Pricing from $25` + `Free Trial` — each column links to profile.
- `Advisor CTA:` "G2 offers free advice — Text | Phone" (enterprise buyers want human now, not form).

**Sticky mid-gate (convert even if they don't scroll):**
- `Send me this comparison — Email address * → Get the comparison` + qualifier `Replace / Search / Browse`. This is top-of-funnel intent even when gate is skipped (email captured).

**Table spec (our hero component):**

- Columns: `Feature | {Product A} | {Product B} [+ Product C]` — first column frozen.
- Rows grouped: `Ratings` (7 rows: Meets Requirements … Product Direction), `Pricing` (per edition), `Features` (check grid), `Satisfaction` (sub-scores), `Alternatives` (bottom strip).
- Row shading: every other row `bg-muted/40`, hover highlight row across columns.
- Cell: score `8.8` (16px mono) + respondent count `14,233` (12px muted). Bar micro-viz to right (linear track) so 8.8 vs 8.6 is visibly different without reading digits.
- Responsive: horizontal scroll, sticky first col, snap to column on swipe.

**Footer on compare:**
- AI summary (6 bullets) + FAQs (3 Qs) + table snippet for SEO.

**URL canonical:** Always `/{a}-vs-{b}` alphabetically; if user picks B-vs-A, 301 to A-vs-B. Add `/compare/hub` for discovery (trending, most-viewed pairs like SOLIDWORKS vs SketchUp).

---

## 9. Search Autocomplete & Results

**Autocomplete (homepage + header):**

- Trigger on 2 chars, 180ms debounce.
- Groups: `Products (top 5)` → logo 20px + name + rating + category tag; `Categories (3)` → icon + listing count; `Comparisons (2)` → "A vs B — 35K compared this month".
- Keyboard: `↑↓` navigate, `Enter` go, `Esc` close, `cmd+K` focus.
- No results? Show `Try: CRM, Project Management, Video Conferencing` with popular categories as chips.

**Results page (`/search?q=...`):**

- Tabs: `Products (42) · Categories (6) · Comparisons (11)` — counts.
- Sort: Relevance (default), Highest Rated, Most Reviews.
- Empty state: illustration + "No exact match — browse adjacent categories" with 3 category cards.

---

## 10. Reviews & Verification UX (Trust System)

- **Never hide negative, never edit copy.** Quote community guideline verbatim in modal: "We never edit nor suppress reviews — verified only."
- **Labels always visible at card level:** `Validated Reviewer` (green check, success color), `Current User` (screenshot icon), `Incentivized` (amber dot + "Gift card — rating still counted but weighted low"), `Source: G2 invite`. Guest User = `Guest` pill, does not count toward G2 Score (show `Not counted toward ranking` tooltip).
- **Anonymous mode:** Show `Verified user — Mid-market · Software` with same badges but no name — never "Anonymous" without context.
- **Write review flow:** `/wizard/new-review` — Step 1: Auth (LinkedIn or business email verification via magic link), Step 2: Ratings 1-10 (with N/A handles), Step 3: Open-ended (What do you like best? / What do you dislike?), Step 4: Screenshot proof (drag-drop, required for Current User), Step 5: Preview + FTC disclosure checkbox. Progress bar top.
- **Moderation:** Show `Under review — typically 24-48h` after submit; vendor sees `Review → Respond` inline (vendor response is labeled, dated, below review).

---

## 11. Dashboards (Vendor & Admin)

### Vendor (`/vendor`) — what enterprise buyers' vendors see
- `Overview:` KPI cards: Profile views (7/30d), Comparison hits, Leads (by source: pricing tab vs comparison gate vs advisor), Review velocity.
- `Products:` Edit → `PENDING` → admin approves; shows moderation queue status.
- `Leads:` Table with filter (status: New/Contacted/Won/Lost), `Add note`, `Export CSV`, `Mark spam`. Lead row shows `source_location`.
- `Reviews:` Respond inline, see label (Incentivized, Guest, Verified).
- `Billing:` Phase 2 — not in MVP.

### Admin (`/admin`) — internal
- `Review moderation queue` (oldest first, with report reason), `Product claim queue`, `Lead management`, `User management`.
- `SEO Manager:` Programmatic page status (indexed, pending, blocked), sitemap sharding view.

---

## 12. Dashboards Visual Language

- **Cards:** White on muted page bg (`#F4F4F5`), 8px radius, 1px border, `shadow-sm`. No dark cards on dashboard (enterprise expectation is airy).
- **Empty states:** Line icon 48px, headline 16px/600, sub 14px/muted, CTA accent.
- **Data viz:** Ratings use horizontal bars (accent fill, muted track), not pies. Never 3D.
- **Dark mode:** Parity — same component tree, just token swap. Tested via axe-core at both themes.

---

## 13. Mood Board — Direct Steals Worth Copying

| Source | Steal this | Leave this |
|--------|------------|------------|
| **Linear** | Command palette, density toggle, tabular nums, Issue list row hover | Nothing enterprise-unfriendly here |
| **Stripe Dashboard** | Muted page bg + white cards, 1px borders, quiet success green | Stripe's extra indigo — we keep single accent |
| **Vercel** | Geist typography, skeleton instead of spinner, sticky tab bar | Vercel's black overload — we stay zinc-200 borders |
| **Salesforce Lightning** | Comparison table frozen cols, feature taxonomy | Salesforce's blue overuse, heavy shadows |
| **Figma Community** | Product card hover (scale 1.01 + shadow-md) | Figma's community playfulness — keep muted |
| **Airbnb 2025** | Category chips as pills with count | Airbnb's photography-heavy hero — we are data-heavy |

---

## 14. Accessibility & Performance (Enterprise procurement cares)

- **A11y:** All interactive elements 44px min hit area on mobile, focus ring 2px accent with offset 2px, skip links, aria for histograms, `prefers-reduced-motion` disables motion. Target axe 0 criticals.
- **Performance:** LCP <1.8s (product hero image priority), CLS 0 (skeleton with fixed dimensions), INP <100ms (debounced search). Lighthouse SEO 100 (JSON-LD `AggregateRating`, `BreadcrumbList`, `FAQPage` on category/compare).
- **Internationalization:** Not in MVP, but typography stack must render Japanese/Korean (Inter has limited CJK; fall back to system).

---

## 15. Build Checklist for Frontend

- [ ] Tailwind tokens as above, dark parity in one config file — no third file.
- [ ] shadcn install: button, card, input, tabs, sheet, dialog, badge, table, select, avatar, tooltip, skeleton.
- [ ] `SearchAutocomplete.tsx` with grouped results + keyboard nav + cmd+K.
- [ ] `ProductCard.tsx`, `CategoryCard.tsx`, `ComparisonTable.tsx` (frozen cols), `ComparisonBucket` (sticky).
- [ ] `RatingDistribution` + `ReviewCard` + `HelpfulButton`.
- [ ] `LeadForm` sticky variant + inline variant (compare gate).
- [ ] `FilterDrawer` (sheet) + `SortSelect` + `FilterChips`.
- [ ] Category page: 3-col cards, 20 per page, pagination preserving query.
- [ ] Product profile: 6 tabs, sticky tab bar, right-rail LeadForm, media lightbox.
- [ ] Compare page: add-product (max 4, alpha canonical), email gate, advisor CTA.
- [ ] Vendor/admin shells with KPI cards + tables.
- [ ] Dark mode toggle persisted, axe tests in CI.

---

**File:** `/opt/data/analysis/reports/ENTERPRISE-UI-DESIGN-SYSTEM.md` — auto-synced into `MASTER-BUILDER-FILE.md` on next zip rebuild. Pair with `prompts/MASTER-BUILD-PROMPT.md` Section 8 for implementer.

