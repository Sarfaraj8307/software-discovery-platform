# DELIVERABLE 7 — MVP, Phase 2, Phase 3 Roadmaps

## MVP (Weeks 1–10) — Scope That Ships

**Goal:** Searchable, SEO-crawlable marketplace with monetizable lead flow and credible reviews. Treat everything else as Phase 2.

### Week 1–2: Foundation
- [ ] Next.js App Router + Tailwind + shadcn scaffold, ESLint/Prettier, CI
- [ ] Postgres + Prisma schema (see Deliverable 5), seed 100 categories + 500 products (real + synthetic, see seed script)
- [ ] Auth.js (credentials + Google), RBAC (buyer/vendor/admin)
- [ ] Meilisearch index + sync worker

### Week 3–4: Public Site Core
- [ ] Homepage (search + categories + featured)
- [ ] /categories + /[category] listing (filters, sort, pagination, ISR, JSON-LD)
- [ ] /[category]/[product] profile (all sections, tabs, lead CTAs, ISR)
- [ ] Search results page (autocomplete + results)

### Week 5–6: Reviews + Comparison
- [ ] Review submission flow + verification + moderation queue + listing
- [ ] Comparison engine: bucket + /compare/[slugs] table (2–3 products) + programmatic SEO
- [ ] Alternatives + /best/{category} aliases

### Week 7–8: Leads + Dashboards (minimal)
- [ ] Lead forms (Get Pricing / Request Demo / Expert Recommendation) → DB + email to vendor/admin
- [ ] Vendor portal (claim, edit listing → moderation, lead inbox read-only)
- [ ] Admin panel (product/category/review moderation, lead list, user list)

### Week 9: SEO + Polish
- [ ] Sitemap.xml (dynamic), robots.txt, canonical, OG, JSON-LD, breadcrumbs, internal linking
- [ ] Performance pass (images, ISR, caching), a11y pass, empty states, 404s

### Week 10: Hardening + Launch
- [ ] Playwright E2E (15 critical paths), rate limiting, CSP, backups
- [ ] Seed to 1–3k products, content pass, launch on Vercel + Neon + Meilisearch Cloud
- [ ] PostHog + Sentry + Uptime

**MVP Cut Line (explicitly OUT):**
- Human 1:1 advisor call center (keep async form only)
- RFI/RFP Decision Platform (SelectHub-style)
- GoodFirms-style agency marketplace + portfolio audits
- G2-style Grid quadrant calculation
- Real-time vendor analytics dashboard (keep MVP analytics minimal)
- Sponsored bidding / auction
- Multi-language / multi-currency

**MVP Success Metrics (30 days post-launch):**
- Indexed pages >2k, p95 search <150ms, LCP <2.5s
- ≥100 reviews submitted, ≥50 leads, ≥10 vendor claims
- Zero critical a11y/SEO regressions (Lighthouse ≥90)

---

## Phase 2 (Months 3–6) — Differentiation & Monetization

- Requirements builder (SelectHub-lite): template download → requirement checklist → filtered shortlist
- Sponsored placements + bidding (Sponsored badge, featured slots)
- Review incentives + LinkedIn share flow (SoftwareSuggest-style)
- Advanced vendor analytics (views, comparison appearances, lead source, trend)
- Programmatic blog: /resources/{slug} at scale (100+ comparison articles, buying guides)
- AEO/GEO visibility product (free tier + paid report)
- Email digests, saved searches, price-drop alerts
- API v1 (read-only products/categories/reviews for partners)

## Phase 3 (Months 7–12) — Scale & Moat

- G2-style buyer intent data (de-anonymized firmographics for vendors — privacy-compliant)
- Decision Platform v1: multi-stakeholder collaboration, vendor scoring, RFI/RFP distribution
- AI layer: semantic search, review summarization (pros/cons auto-extraction), comparison personalization
- Agency/services marketplace (GoodFirms-style) if validated
- Mobile apps (PWA first, then native)
- Enterprise SSO, SLA, data export
- International expansion (localization, regional pricing, local review sources)

---

## Cost Estimate (MVP, 10 weeks, 1–2 engineers + AI agent)

| Item | Monthly |
|---|---|
| Vercel Pro | $20 |
| Neon/Supabase (scale) | $20–$50 |
| Meilisearch Cloud (1k docs) | $0–$30 |
| Upstash Redis | $0–$10 |
| Resend (email) | $0–$20 |
| R2 / S3 (media) | $5 |
| Domain + Cloudflare | $15 |
| **Total infra** | **~$60–$150/mo** |

Engineering is the real cost — AI coding agent (this prompt) collapses 10 weeks into days if run end-to-end with the BUILD→RUN→TEST→FIX loop.
