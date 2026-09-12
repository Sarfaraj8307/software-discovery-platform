# DELIVERABLE 6 — Recommended Technology Stack

## 1. Frontend

**Choice: Next.js 15 (App Router) + React 19 + TypeScript**
**Why:**
- SSR/ISR/SSG out of the box — critical for programmatic SEO (category/product/compare pages must be crawlable without JS). G2/SoftwareAdvice all rely on SSR pillar pages.
- App Router + ISR (`revalidate`, `generateStaticParams`) lets you generate 50k comparison pages lazily without build-time explosion.
- API routes or route handlers for lead submission, review, auth.
- Next Image optimization for logos/screenshots.
- Ecosystem: next-seo, next-sitemap, next-auth.

**Alternatives considered:**
- Remix — good but ISR story weaker.
- Astro — great for content but marketplace interactivity (compare bucket, filters) needs React state — Next wins.
- SPA (Vite) — disqualified for SEO.

**UI kit:** Tailwind CSS + shadcn/ui (Radix) + Lucide icons. No heavy component lib.

## 2. Backend

**API architecture:**
- **Next.js Route Handlers + Server Actions** for MVP (single repo, single deploy). No separate backend service needed until 10k+ products.
- **Postgres + Prisma** as ORM (typed, migration-safe). Alternative: Drizzle — also good; Prisma is more mature for admin CRUD.
- **Auth:** Auth.js (next-auth) v5 — credentials + Google + LinkedIn OAuth; RBAC via database sessions or JWT.
- **Validation:** Zod on every input (forms, API).
- **Background jobs:** Vercel Cron or `pg-boss` for queue (review moderation emails, lead notifications, sitemap regeneration). For self-host: BullMQ + Redis.
- **File uploads:** UploadThing or S3-compatible (R2/Cloudflare) for logos/screenshots.
- **Rate limiting:** Upstash Redis or `rate-limiter-flexible` with Postgres fallback.
- **Email:** Resend or SendGrid (transactional: verification, lead notifications, review published).
- **Observability:** Sentry + Posthog (product analytics).

**When to split backend:**
At ~50k products / 500k reviews / high write load, extract a standalone API (NestJS or FastAPI) behind Next.js BFF. Not needed for MVP.

## 3. Database

**Primary: PostgreSQL 16** (Neon / Supabase / self-hosted)
- Why: relational + JSONB + full-text + pg_trgm + vector (pgvector) for future semantic search. Every competitor's data is deeply relational (Products ↔ Categories ↔ Features ↔ Reviews ↔ Comparisons). NoSQL would fight the domain.
- See Deliverable 5 for full schema + ERD.

**Cache / queue:** Redis (Upstash) for rate limit, session, job queue, search cache.
**Search engine:** Meilisearch (MVP) → Typesense or Elasticsearch at scale. See Search section.

## 4. Search

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Postgres FTS (tsvector)** | Zero infra, good for MVP <10k products | No typo tolerance, slow facets, no instant | Fallback only |
| **Meilisearch** | Typo-tolerant, instant, facets, easy self-host or Cloud, <50ms | Needs sync, not as scalable as ES | **MVP choice** |
| **Typesense** | Similar to Meilisearch, great facets | Slightly more ops | Strong alternative |
| **Elasticsearch / OpenSearch** | Most scalable, ML, aggregations | Heavy, expensive, overkill for MVP | **Scale choice (100k+ products)** |

**MVP search strategy:**
- Index: products (name, slug, tagline, description, features, category names), categories (name, description)
- Facets: category, price tier, rating bucket, freeTrial, deployment, integrations
- Sync: Prisma middleware → Meilisearch on product/category/review create/update (or pg trigger → worker)
- Fallback: if Meilisearch down, degrade to Postgres ILIKE + tsvector, not 500.
- Future: semantic search via pgvector or Meilisearch vector (embeddings for "best CRM for startups" queries).

## 5. Infra & DevOps (MVP)

- **Hosting:** Vercel (frontend + API + cron) + Neon/Supabase Postgres + Upstash Redis + Meilisearch Cloud (or self-host on Fly/Hetzner)
- **Alternative self-host:** Docker Compose + Hetzner + Coolify + Caddy — cheaper, more control.
- **CI:** GitHub Actions (lint, typecheck, test, build)
- **CD:** Vercel auto-deploy on main; preview deploys per PR.
- **Domain + CDN:** Cloudflare (DNS + CDN + WAF + rate limit)
- **Backups:** Neon PITR + daily pg_dump to R2; Meilisearch snapshots.
- **Monitoring:** Vercel Analytics + Sentry + UptimeRobot.

## 6. Testing

- Unit: Vitest (+ React Testing Library)
- E2E: Playwright (search, filters, product, review submit, compare, lead, auth, vendor, admin)
- A11y: axe-core in CI
- SEO: next-sitemap + Lighthouse CI (perf + SEO scores)

## 7. Project Structure (single repo)

```
software-discovery-platform/
├── app/
│   ├── (public)/{page.tsx, layout.tsx}
│   │   ├── page.tsx              # homepage
│   │   ├── categories/page.tsx
│   │   ├── [category]/page.tsx
│   │   ├── [category]/[product]/page.tsx
│   │   ├── compare/[slugs]/page.tsx
│   │   ├── resources/[slug]/page.tsx
│   │   └── search/page.tsx
│   ├── (auth)/{login, register}
│   ├── (dashboard)/{vendor, admin}
│   └── api/{search, reviews, leads, products, compare}
├── components/{ui, cards, filters, compare, reviews, forms}
├── lib/{db, search, auth, email, validation, seo}
├── prisma/{schema.prisma, migrations, seed.ts}
├── public/{icons, images}
├── e2e/{*.spec.ts}
└── scripts/{seed, sync-search, generate-sitemap}
```

## 8. Environment Variables (required)

```
DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
GOOGLE_CLIENT_ID/SECRET, LINKEDIN_CLIENT_ID/SECRET,
MEILISEARCH_HOST/KEY, REDIS_URL,
RESEND_API_KEY, S3/R2 creds, SENTRY_DSN
```
