# ENTERPRISE UI TRANSFORMATION — VISUAL AUDIT & PLAN
**Date:** 2026-09-12 · **Scope:** analysis (§39), then one small implementation task.
**Baseline:** 25/25 smoke, `tsc` 0, `eslint` 0. Build unchanged by this document.

### Design constraint adopted (from your note)
Predominantly **white / off-white enterprise** interface. Colour used deliberately: gradient washes,
tinted surfaces, category hues at low saturation, product imagery. **Restrained motion. No neon.
No blanket 3D.** Two saturated hues at most, and the second one is gradient-only.

---

## 1. CURRENT VISUAL WEAKNESSES

Audited against §33's ten criteria. Honest split: the *structure* is good, the *visual layer* is thin.

### What is genuinely working (do not touch)
- **Token discipline.** `app/globals.css` already has one accent, semantic colour families each with `-subtle`/`-border` variants, a locked type scale (10/12/13/14/15/16/20/24/30/36), enterprise radii (6/8/12), and a 3-step shadow set. This is better than most "premium" templates.
- **Contrast.** All 16 text token pairs pass WCAG AA.
- **Type system.** Inter + JetBrains Mono, self-hosted, 2 families — within your "small number" rule.
- **Reduced motion** already honoured globally, not per-component.
- **Focus treatment** is single and app-wide.
- **Information architecture and routing** — explicitly out of scope per §2.

### The weaknesses

| # | Weakness | Evidence |
|---|---|---|
| **V1** | **Zero imagery in the entire application.** No `public/` directory. | `ls public/` → not found |
| **V2** | **Logos and avatars are monogram plates** (initials on a tinted square). Reads placeholder, not product. | `components/ui/avatar.tsx` |
| **V3** | **`ProductScreenshot` carries only a `tone` string** — screenshots are not real. | `lib/data/types.ts:128-133` |
| **V4** | **Hero is flat.** `bg-subtle` (#fafafa), no gradient, no depth, no visual on the left column; the right column is a text list in a card. | `app/page.tsx:48-95` |
| **V5** | **No display type tier.** Largest is `--text-4xl` (36px). Hero `h1` uses `text-4xl` — no scale jump, so headlines don't have presence. | `globals.css:86` |
| **V6** | **No secondary brand hue.** `--color-secondary` is `#f4f4f5` — a gray, not a brand colour. Gradients are therefore impossible without inventing a token. | `globals.css:43` |
| **V7** | **No surface system.** `bg-background` / `bg-subtle` / `bg-muted` only. No tinted, elevated, or dark-contrast surfaces → no visual rhythm (§7). | `globals.css:12-22` |
| **V8** | **No gradient tokens at all.** | `globals.css` |
| **V9** | **No hover-elevation shadow.** Shadows are card/sticky/overlay; nothing for "lift". | `globals.css:96-101` |
| **V10** | **Every section is white or #fafafa** — the "single white background" failure §7 warns about. | homepage, category, product |
| **V11** | **Logo is a stock Lucide `Scale` icon in a rounded blue square.** Reads generic. No icon/compact/dark variants, no real favicon. | `components/layout/Header.tsx:34-42` |
| **V12** | **Category cards are icon + text.** No artwork, no colour identity per category. | `components/cards/CategoryCard.tsx` |
| **V13** | **No animation library and no motion tokens** beyond one easing curve. No scroll reveal, no card hover elevation, no page entry. | — |
| **V14** | **No skeletons on RSC navigation** — only client islands have loading states. | — |
| **V15** | **No `next/image` usage and no `remotePatterns`** — because there are no images. Adding imagery without this will regress LCP hard. | `next.config.ts` |
| **V16** | **Admin layout is 85 lines / 4 nav items**; vendor 83 lines. Structurally too thin for "SaaS control centre", and visually unstyled beyond the shared tokens. | `app/admin/layout.tsx` |
| **V17** | **No login page at all** (no auth). §20/§15 unbuilt. | — |
| **V18** | **Product page is 819 lines** and text-dense; no hero visual, no gallery (V3 means nothing to show). | `app/product/[slug]/page.tsx` |
| **V19** | **Empty/error states exist but are text-only** — no illustration system. | `components/ui/feedback.tsx` |
| **V20** | **No dark surface** anywhere, so no contrast rhythm (§29). | — |

---

## 2. TOP 20 VISUAL IMPROVEMENTS (ranked by impact ÷ effort)

| # | Improvement | Impact | Effort |
|---|---|---|---|
| 1 | Extend the token system: surfaces, gradients, brand-2 hue, shadow-lift, display type | Unblocks everything | S |
| 2 | **Create `public/` and a generated SVG art system** (category art, abstract tech panels, dashboard mockups) | Fixes V1–V3 at the root | M |
| 3 | Upgrade monogram plate → brand-tinted gradient plate (real `next/image` path ready) | Removes the "placeholder" tell | S |
| 4 | Rebuild the hero: gradient wash, floating product cards, display headline | §6 — biggest single win | M |
| 5 | New logo system: icon mark, horizontal, compact, dark variant; real favicon | §9 | S |
| 6 | Product card redesign: logo + screenshot thumb + badges + hover elevation | §12 | M |
| 7 | Category card artwork: per-category hue + generated illustration | §14 | M |
| 8 | Add `next/image` + `remotePatterns` + responsive sizes | prerequisite for 4/6/7 | S |
| 9 | Motion primitives: `Reveal` (IntersectionObserver + CSS), `hover-lift`, `page-entry` | §17/§18 | S |
| 10 | Dark contrast section (e.g. "methodology / trust" band) for rhythm | §29 | S |
| 11 | Sticky nav refinement: scroll-aware border/shadow, active-indication | §10 | S |
| 12 | Product detail hero visual + screenshot gallery | §13 | M |
| 13 | Testimonial cards with generated portrait plates + quotation styling | §15 | S |
| 14 | Skeleton system for RSC routes | §24 | S |
| 15 | Empty/error state illustration set | §25/§26 | S |
| 16 | Gradient CTA band before the footer | §7 rhythm | S |
| 17 | Admin sidebar + KPI cards + status badges visual pass | §21 | M |
| 18 | Vendor portal visual pass (consistent, simpler) | §22 | M |
| 19 | Premium login page (split: brand visual left / form right) | §20 | M |
| 20 | Micro-interactions: icon nudge, focus glow, toast, checkmark | §23 | S |

---

## 3. RECOMMENDED DESIGN SYSTEM

**Extend `app/globals.css`; do not replace it.** The existing tokens are correct — the system is missing *layers*, not correctness.

Add five token groups:

1. **Surface system** — `surface-1` (white card) → `surface-2` (#fafafa) → `surface-3` (#f4f4f5) → `surface-tint` (gradient wash) → `surface-inverse` (dark band). This creates the §7 rhythm.
2. **Brand system** — `primary` (unchanged #2563EB, interactive/CTA only) + `brand-2` (gradient partner only, never interactive) + `brand-ink` (deep, for dark sections).
3. **Gradient system** — `--gradient-hero`, `--gradient-brand`, `--gradient-cta`, `--gradient-mesh`. All derived from the two brand hues at low opacity.
4. **Elevation system** — add `--shadow-lift` (hover) alongside existing card/sticky/overlay. Keep shadows quiet; §12 explicitly forbids huge shadows.
5. **Category hue system** — 8 low-saturation hues assigned per pillar, used for tints/borders/artwork only, never for body text.

**Rules to encode:**
- `--color-primary` stays the **only** saturated interactive colour.
- `brand-2` appears **only** inside gradient definitions.
- Every new token that carries text must be re-measured for AA (the prior contrast pass found 6 failures; do not reintroduce them).
- Radii: keep 6/8/12 for controls/cards/dialogs; add `--radius-panel: 16px` **only** for large hero/panel surfaces.

---

## 4. RECOMMENDED FONT SYSTEM

**Keep Inter + JetBrains Mono.** Two families, self-hosted, no external request, no layout shift. Do not add a third.

What to *change*:

| Tier | Now | Proposed |
|---|---|---|
| Display (hero) | none — `text-4xl` 36px | `--text-display` 3.5rem/56px, tracking `-0.035em`, weight 600 |
| H1 (page) | `text-4xl` 36px | `text-4xl` → bump to 2.5rem/40px for page H1s |
| H2 | `text-2xl`/`text-3xl` | unchanged |
| Body | 0.9375rem/1.6 | unchanged (readable, already good) |
| Label | `label-caps` 10px | unchanged |
| Button | inherits | unchanged |
| Paragraph width | — | cap at `68ch` (already done in `prose-editorial`); extend to hero lede |

Add a `--text-display` token and a `text-display` utility. Headline presence comes from **size + weight + tracking**, not from a new typeface.

---

## 5. RECOMMENDED COLOR SYSTEM

| Role | Token | Value | Notes |
|---|---|---|---|
| Primary brand | `--color-primary` | `#2563EB` | **unchanged** — interactive, CTA, focus |
| Primary hover | `--color-primary-hover` | `#1D4ED8` | unchanged |
| **Secondary brand** | `--color-brand-2` | `#4F46E5` (indigo-600) | **gradient partner only**; never a button, never text |
| **Brand ink** | `--color-brand-ink` | `#1E3A8A` (blue-900) | dark sections, deep accents |
| Accent (data-viz) | `--color-accent-teal` | `#0D9488` | charts/category tints only |
| Success | `--color-success` | `#047857` | unchanged (AA-verified) |
| Warning | `--color-warning` | `#B45309` | unchanged |
| Error | `--color-destructive` | `#D42020` | unchanged |
| Info | `--color-info` | `#1D4ED8` | add — currently missing |
| Surface 1–3 | existing | #fff / #fafafa / #f4f4f5 | unchanged |
| Surface tint | `--color-surface-tint` | `linear-gradient(135deg,#F0F7FF,#FAF5FF)` | new |
| Surface inverse | `--color-surface-inverse` | `#0B1020` | dark band (§29) |
| Border | existing | #e4e4e7 / #d4d4d8 | unchanged |

**Gradients** (all two-hue, low contrast, never neon):
- `--gradient-brand: linear-gradient(135deg, #2563EB, #4F46E5)`
- `--gradient-hero: radial-gradient(...)` washes using primary at 6–10% opacity
- `--gradient-cta`: brand gradient for the final CTA band
- `--gradient-mesh`: layered radial washes for the hero/login backdrop

**Category hues** — 8 tints at ~8–12% saturation for backgrounds/borders, paired with a darker text-safe variant for labels. Assigned per pillar so categories get identity without becoming a rainbow.

---

## 6. RECOMMENDED IMAGE STRATEGY

**The honest constraint:** I cannot fetch real vendor logos, product screenshots, or people photography. Licensing prohibits scraping G2 (§5), and there's no licensed asset source available here. So:

### Phase A — generated, in-repo, zero licensing risk (do this now)
- **`public/art/`** — deterministic SVG artwork committed to the repo:
  - **Category illustrations**: abstract geometric marks per category family (CRM = connected nodes; Analytics = ascending forms; Security = shield lattice). One generator, consistent stroke weight, tinted by the category hue.
  - **Dashboard-style mockups**: abstract UI panels (charts, tables, cards) for product "screenshots" and hero composition.
  - **Hero composition**: layered floating cards + gradient mesh, built in SVG/CSS (no Three.js).
  - **Portrait plates** for testimonials: geometric avatar system, an upgrade on the current monogram.
- **Logo upgrade**: replace the flat monogram with a **brand-tinted gradient plate** (deterministic hue from the vendor domain). Keeps it honest — it's still a placeholder — but reads intentional rather than unfinished. Structure it so a real logo URL can drop in without touching call sites.

### Phase B — real assets (needs you)
When you supply them: real vendor logos → `public/logos/`, product screenshots → `public/products/`, photography → `public/people/`. The component API will already accept a URL, so Phase B is data, not code.

### Required plumbing (do with Phase A)
- `next.config.ts`: add `images.remotePatterns` + `formats: ["image/avif","image/webp"]`.
- Use `next/image` with explicit `width`/`height` or `fill` + `sizes` — **no layout shift** (§37).
- Lazy-load everything below the fold.

---

## 7. RECOMMENDED ANIMATION STRATEGY

**CSS-first. No animation library yet.**

Rationale: the project already honours `prefers-reduced-motion` globally and has one easing curve. A scroll-reveal and hover-lift need nothing more than `IntersectionObserver` + CSS transitions. `motion`/Framer Motion is ~30–50 KB gzipped — worth it only when we need orchestrated, scroll-linked or layout-animated sequences. Defer that decision until we actually need it (§3: "use the smallest appropriate dependency").

Primitives to build (all CSS + one tiny hook):
| Pattern | Implementation |
|---|---|
| Page entry | `opacity 0→1`, `translateY(8px)→0`, 240ms, `--ease-out-quiet` |
| Section reveal | `Reveal` component: IntersectionObserver adds `.is-visible`, CSS handles the transition |
| Card hover | `translateY(-1px)` + `shadow-lift`, 160ms |
| Image | `scale(1.02)` on card hover, 300ms |
| Button | icon `translateX(2px)` on hover |
| Modal | `scale(0.98)→1` + fade |
| Skeleton | shimmer via `background-position` keyframes |

**Hard rules:** every motion utility sits behind `@media (prefers-reduced-motion: no-preference)`; nothing animates on first paint above the fold; no animation gates content (§18).

---

## 8. RECOMMENDED 3D STRATEGY

**None initially. Do not install Three.js / React Three Fiber yet.**

Your note is explicit, and the numbers back it: `@react-three/fiber` + `three` is a large dependency for what §16 calls "selected areas". The depth the brief wants — layered cards, floating elements, dimensional gradients — is achievable with:
- CSS `transform: perspective()` + `rotate3d` on the hero card stack
- Layered radial-gradient "mesh"
- SVG with soft drop-shadows and overlapping translucent shapes

**If** we later add R3F, it must be: one hero scene only, `next/dynamic` with `ssr: false`, disabled under `prefers-reduced-motion`, disabled below `md`, and paused when off-screen (§28). Revisit only if the CSS version reads flat after the rest of the redesign lands.

---

## 9. RECOMMENDED LOGO DIRECTION

Current: Lucide `Scale` in a 7px-radius blue square + wordmark. Works, but generic.

**Direction: a geometric mark suggesting *ranking / comparison / discovery*.**
- Concept: three ascending rounded bars forming an abstract "S", or two overlapping rounded squares (the "compare" motif) with the overlap in a lighter tint.
- Keeps blue `#2563EB`; the overlap gives a natural two-tone for gradients.
- Deliverables: **icon mark** (navbar/favicon), **horizontal lockup** (header/footer), **compact** (mobile), **mono/inverse** (dark sections, login panel).
- All SVG, sized on a 24px grid, `currentColor` where possible.
- Favicon: derive from the icon mark; add `app/icon.svg` so Next generates the rest.

Preserve brand recognition: same blue, same name, same wordmark typography (Inter, `tracking-[-0.02em]`). This is an upgrade, not a rebrand (§9).

---

## 10. IMPLEMENTATION SEQUENCE

Maps to §35, sequenced so each step is independently buildable and testable.

| Step | Task | Depends on |
|---|---|---|
| 1 | **Extend the token system** (surfaces, brand-2, gradients, shadow-lift, display type, category hues) | — |
| 2 | Add `next/image` plumbing (`remotePatterns`, formats, sizes convention) | — |
| 3 | **New logo system + favicon** | 1 |
| 4 | **Generated SVG art system** (`public/art/`) + upgraded logo plate component | 1, 2 |
| 5 | Upgrade buttons / cards / inputs (hover-lift, focus glow) | 1 |
| 6 | **Hero rebuild** (gradient wash, floating cards, display headline) | 1, 3, 4 |
| 7 | Category card artwork + hues | 4, 5 |
| 8 | Product card redesign (logo + thumb + badges + hover) | 4, 5 |
| 9 | Product detail hero + screenshot gallery | 4, 8 |
| 10 | Testimonial cards | 4, 5 |
| 11 | Dark contrast band + gradient CTA band (rhythm) | 1 |
| 12 | Motion primitives (`Reveal`, hover-lift, page-entry) | 1 |
| 13 | Sticky nav refinement | 1, 5 |
| 14 | Skeletons for RSC routes | 5 |
| 15 | Empty / error illustration states | 4 |
| 16 | Login page (split brand visual / form) | 1, 4, 12 |
| 17 | Admin visual pass (sidebar, KPI cards, tables, badges) | 1, 5 |
| 18 | Vendor portal visual pass | 1, 5 |
| 19 | Micro-interactions (icon nudge, toast, checkmark) | 12 |
| 20 | Responsive visual QA at 1440/1024/768/390 | all |
| 21 | Performance check (bundle, LCP, CLS) | all |
| 22 | Accessibility re-check (contrast on every new token pair) | all |
| 23 | Cross-page consistency review | all |

**First implementation task = Step 1.** Everything else depends on the token layer existing, and it is a single-file change with zero behavioural risk.

---

## NEXT: FIRST SMALL VISUAL TASK (Step 1)

> **Extend the design token system in `app/globals.css`** — add the surface system, the
> `brand-2` gradient-only hue, gradient tokens, `--shadow-lift`, the `--text-display` tier,
> the info colour, and the category hue set. **No component changes. No new dependencies.**

**Exit criteria:** `tsc` 0, `eslint` 0, `next build` succeeds, smoke 25/25, and every new
token that can carry text is measured and documented as passing AA against its intended
background.
