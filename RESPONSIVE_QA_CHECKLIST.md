# Responsive Visual QA Checklist

**Purpose.** The agent cannot run a real browser in this sandbox, so the pixel-level
pass at each breakpoint is a human task. This checklist tells you exactly what to eyeball
at each width against the live preview at **http://127.0.0.1:3120**.

**Breakpoints.** Test in device-emulation (or real devices) at:
- **1440px** — desktop design target
- **1024px** — tablet-landscape / the `lg` switch (login split appears here)
- **768px** — tablet-portrait (header collapses, grids go 2-up)
- **390px** — large phone (everything single-column; the hardest case)

**Gate rule.** At every width, confirm: no horizontal scroll, no clipped/overlapping
text, tap targets ≥ 40px, and contrast holds (the dark `surface-inverse` band uses
white text — verify it reads cleanly on your display).

---

## 1. Header / navigation (every page)
- [ ] Sticky bar stays at top; gains a quiet shadow after scrolling 4px (`shadow-sticky`).
- [ ] Brand wordmark hidden < 640px, visible ≥ 640px.
- [ ] Primary nav (Compare / Methodology) + "For vendors" button hidden < 1024px; the
      MobileNav (hamburger) + secondary search row take over.
- [ ] Search box never overflows its slot (`min-w-0` on the flex child).
- [ ] Active route shows a muted pill + `aria-current="page"`.

## 2. Homepage
- [ ] Gradient CTA band (`bg-gradient-cta`) reads as a wash, not a neon block; text AA-legible.
- [ ] Dark contrast band (`surface-inverse`) white text is readable; at 390px the band
      padding doesn't crowd content.
- [ ] Buyer-voices testimonial cards: 4-up → 2-up → 1-up; scroll-reveal fades in once
      (and content is fully visible if JS is off — check with JS disabled).
- [ ] Category-hued tiles (`bg-cat-*`) are distinct but not saturated.

## 3. Login page (`/login`)
- [ ] ≥ 1024px: split layout — brand gradient panel left (50%), form right (50%).
- [ ] < 1024px: brand panel hidden; brand logo shows at top of the form; form is
      centered, `max-w-sm`, no horizontal scroll at 390px.
- [ ] Form inputs, "Remember me" checkbox, submit button all reachable and tappable.
- [ ] "Back to the directory" arrow nudges right on hover.

## 4. Product grid / search (`/search`, category pages)
- [ ] Cards reflow 4 → 3 → 2 → 1 without gaps or overflow.
- [ ] Filter rail (if present) collapses gracefully; no layout jump.
- [ ] Skeleton loading state shows on navigation before data paints.

## 5. Product detail (`/product/[slug]`)
- [ ] Hero gradient band + category-hued brand tile render; title not truncated awkwardly.
- [ ] KPI/feature tables scroll horizontally inside their container at 390px (not the page).

## 6. Admin (`/admin`) & Vendor (`/vendor`) dashboards
- [ ] KPI tiles lift on hover (`card-lift`); grid reflows at smaller widths.
- [ ] Queue / product tables: horizontal scroll contained; `min-w-0` respected.
- [ ] Empty state shows the `EmptyArt` illustration; error state shows `ErrorArt`.

## 7. Motion & accessibility
- [ ] Reveal animations respect `prefers-reduced-motion` (no fade/translate when set).
- [ ] With JS disabled, all `.reveal` content is visible (noscript fallback).
- [ ] Focus rings visible on keyboard tab through nav, forms, switches, sliders.

---

## What to report back
Note any width + section + symptom (e.g. "768px, homepage CTA band, text touches edge").
The agent will fix and re-verify via build; only the eyeball pass needs you.

## Image scaffolding (ready, not yet visible)
`next/image` is wired but unused until real assets arrive:
- `next.config.ts` → `images.remotePatterns` (replace `cdn.software-discovery.example`),
  `formats: [avif, webp]`, `deviceSizes` / `imageSizes`.
- `lib/images.ts` → `IMAGE_SIZES` map for `sizes` props.
- `components/ui/responsive-image.tsx` → `<ResponsiveImage>` wrapper (lazy by default).
