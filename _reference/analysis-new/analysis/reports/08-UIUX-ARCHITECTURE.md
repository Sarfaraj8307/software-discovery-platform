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
