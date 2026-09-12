# DELIVERABLE 5 — Database Schema & Entity Relationship Design

## 1. ERD (text)

```
User 1──* Review  *──1 Product *──* ProductCategory *──1 Category
User 1──* Lead    *──1 Product                │
User 1──* SavedProduct *──1 Product           │
User 1──* SavedComparison *──1 Comparison     │
Product 1──* PricingPlan                     Category 1──* Category (self, parent)
Product 1──* ProductFeature *──1 Feature ──* FeatureGroup
Product 1──* ProductIntegration *──1 Integration
Product 1──* ProductScreenshot
Product 1──* Review 1──* ReviewRating (secondary dims)
Review 1──* ReviewVote
Product 1──* Company (via company_id)
Company 1──* Product
Comparison *──* Product (via ComparisonProduct join, ordered)
Category 1──* BuyingGuide / Resource (MDX)
```

## 2. Prisma Schema (canonical)

```prisma
// prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum Role { BUYER VENDOR ADMIN MODERATOR }
enum LeadType { GET_PRICING REQUEST_DEMO EXPERT_RECOMMENDATION VISIT_WEBSITE }
enum LeadStatus { NEW CONTACTED QUALIFIED CLOSED SPAM }
enum ReviewStatus { PENDING APPROVED REJECTED FLAGGED }
enum ProductStatus { DRAFT PENDING APPROVED ARCHIVED }

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  passwordHash  String?  // null for OAuth users
  role          Role     @default(BUYER)
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  reviews       Review[]
  leads         Lead[]
  savedProducts SavedProduct[]
  savedComparisons SavedComparison[]
  vendorCompany Company? @relation("VendorOwner")
  accounts      Account[]
  sessions      Session[]
}

model Account { // Auth.js
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session { // Auth.js
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Company {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  website     String?
  logoUrl     String?
  description String?   @db.Text
  foundedYear Int?
  hqCountry   String?
  hqCity      String?
  employeeCount String? // e.g., "51-200"
  ownerId     String?   @unique
  owner       User?     @relation("VendorOwner", fields: [ownerId], references: [id])
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?    @db.Text
  icon        String?
  parentId    String?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  seoTitle    String?
  seoDescription String? @db.Text
  sortOrder   Int        @default(0)
  productCategories ProductCategory[]
  featureGroups FeatureGroup[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  @@index([parentId])
}

model Product {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique // globally unique, used in /compare URLs
  tagline         String?
  description     String?  @db.Text // long SEO description (markdown)
  shortDescription String? @db.Text // 1-2 lines for cards
  logoUrl         String?
  website         String?
  status          ProductStatus @default(PENDING)
  companyId       String?
  company         Company? @relation(fields: [companyId], references: [id])
  ratingAvg       Float    @default(0) // denormalized, recomputed on review approve
  ratingCount     Int      @default(0)
  // secondary averages (denormalized)
  easeAvg         Float    @default(0)
  valueAvg        Float    @default(0)
  supportAvg      Float    @default(0)
  functionalityAvg Float   @default(0)
  startingPrice   Decimal? @db.Decimal(10,2)
  pricingModel    String?  // e.g., "per_user_month"
  freeTrial       Boolean  @default(false)
  freeTrialDays   Int?
  freeVersion     Boolean  @default(false)
  deployment      String[] // ["cloud","on_premise"]
  // SEO
  seoTitle        String?
  seoDescription  String?  @db.Text
  featured        Boolean  @default(false)
  sponsored       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  categories      ProductCategory[]
  features        ProductFeature[]
  pricingPlans    PricingPlan[]
  integrations    ProductIntegration[]
  screenshots     ProductScreenshot[]
  reviews         Review[]
  leads           Lead[]
  faqItems        FaqItem[]
  alternativeLinks Alternative[] @relation("ProductAlternatives")

  @@index([status])
  @@index([ratingAvg])
  @@index([companyId])
}

model ProductCategory {
  productId  String
  categoryId String
  isPrimary  Boolean @default(false)
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  @@id([productId, categoryId])
  @@index([categoryId])
}

model FeatureGroup {
  id         String   @id @default(cuid())
  name       String
  categoryId String?  // null = global
  category   Category? @relation(fields: [categoryId], references: [id])
  features   Feature[]
  sortOrder  Int      @default(0)
}

model Feature {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  groupId   String?
  group     FeatureGroup? @relation(fields: [groupId], references: [id])
  products  ProductFeature[]
  createdAt DateTime @default(now())
}

model ProductFeature {
  productId String
  featureId String
  available Boolean @default(true)
  note      String? // e.g., "add-on"
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  feature   Feature @relation(fields: [featureId], references: [id], onDelete: Cascade)
  @@id([productId, featureId])
}

model PricingPlan {
  id          String  @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name        String  // Starter, Professional...
  price       Decimal? @db.Decimal(10,2)
  billing     String? // monthly, annual
  currency    String  @default("USD")
  features    String[] // plan-level feature bullets
  ctaLabel    String  @default("Get Pricing")
  sortOrder   Int     @default(0)
  @@index([productId])
}

model Integration {
  id       String @id @default(cuid())
  name     String @unique
  slug     String @unique
  logoUrl  String?
  category String? // e.g., "CRM", "Payment"
  products ProductIntegration[]
}

model ProductIntegration {
  productId     String
  integrationId String
  product       Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  integration   Integration @relation(fields: [integrationId], references: [id], onDelete: Cascade)
  @@id([productId, integrationId])
}

model ProductScreenshot {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  caption   String?
  sortOrder Int    @default(0)
}

model Review {
  id            String       @id @default(cuid())
  productId     String
  product       Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  status        ReviewStatus @default(PENDING)
  rating        Int          // 1-5 overall
  title         String?
  body          String?      @db.Text
  pros          String?      @db.Text
  cons          String?      @db.Text
  // secondary dims 1-5
  easeRating          Int?
  valueRating         Int?
  supportRating       Int?
  functionalityRating Int?
  // context
  companySize   String? // 1-10, 11-50...
  industry      String?
  role          String?
  useDuration   String? // "<6 months", "1-2 years"
  verified      Boolean @default(false)
  helpfulCount  Int     @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  votes         ReviewVote[]
  @@unique([productId, userId]) // one review per user per product
  @@index([productId, status])
  @@index([userId])
}

model ReviewVote {
  id       String @id @default(cuid())
  reviewId String
  review   Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  helpful  Boolean // true = helpful
  createdAt DateTime @default(now())
  @@unique([reviewId, userId])
}

model SavedProduct {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}

model Comparison {
  id        String   @id @default(cuid())
  slug      String   @unique // e.g., "salesforce-vs-hubspot" (alphabetically sorted)
  title     String?  // "Salesforce vs HubSpot: Features, Pricing & Reviews"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  products  ComparisonProduct[]
  views     Int      @default(0)
}

model ComparisonProduct {
  comparisonId String
  productId    String
  position     Int // 0,1,2
  comparison   Comparison @relation(fields: [comparisonId], references: [id], onDelete: Cascade)
  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  @@id([comparisonId, productId])
}

model Lead {
  id        String     @id @default(cuid())
  type      LeadType
  status    LeadStatus @default(NEW)
  productId String?
  product   Product?   @relation(fields: [productId], references: [id])
  userId    String?
  user      User?      @relation(fields: [userId], references: [id])
  // contact snapshot (even for anon)
  name      String?
  email     String
  company   String?
  phone     String?
  message   String?    @db.Text
  categorySlug String? // for expert recommendation
  meta      Json?      // utm, referrer, plan
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  @@index([productId])
  @@index([status])
  @@index([type])
}

model FaqItem {
  id        String  @id @default(cuid())
  productId String? // null = category-level
  product   Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  categoryId String? // alternative FK for category FAQs
  question  String
  answer    String  @db.Text
  sortOrder Int     @default(0)
}

model Alternative {
  id          String @id @default(cuid())
  productId   String
  product     Product @relation("ProductAlternatives", fields: [productId], references: [id], onDelete: Cascade)
  alternativeId String
  score       Float  // relevance score
  @@unique([productId, alternativeId])
}

model Resource { // MDX buying guides / comparison articles
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?  @db.Text
  bodyMdx     String   @db.Text
  categoryId  String?
  author      String?
  published   Boolean  @default(false)
  publishedAt DateTime?
  seoTitle    String?
  seoDescription String? @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SlugRedirect {
  oldSlug String @id
  newSlug String
  createdAt DateTime @default(now())
}
```

## 3. Key Indexes & Constraints

- `Product.slug` unique + `SlugRedirect` for 301s on rename.
- `Category.slug` unique, `Feature.slug` unique, `Integration.slug` unique.
- `Review @@unique([productId, userId])` prevents duplicate reviews.
- Denormalized `Product.ratingAvg/ratingCount + secondary avgs` — updated via trigger/worker on review approve (not computed on read).
- `ProductCategory.isPrimary` — one primary category per product for breadcrumb + canonical.
- `Comparison.slug` is alphabetically normalized; app layer enforces 301 on unsorted.

## 4. Review Aggregation Worker (pseudo)

```ts
// on Review status → APPROVED
const agg = await db.review.aggregate({ where: { productId, status: 'APPROVED' },
  _avg: { rating:true, easeRating:true, valueRating:true, supportRating:true, functionalityRating:true },
  _count: true });
await db.product.update({ where:{id:productId}, data:{
  ratingAvg: agg._avg.rating, ratingCount: agg._count,
  easeAvg: agg._avg.easeRating, valueAvg: agg._avg.valueRating,
  supportAvg: agg._avg.supportRating, functionalityAvg: agg._avg.functionalityRating
}});
await search.syncProduct(productId); // update Meilisearch
```

## 5. Comparison Engine Logic (pseudo)

```ts
function canonicalCompareSlug(slugs: string[]) {
  return [...slugs].sort().join('-vs-');
}
// GET /compare/[slugs]  where slugs = "a-vs-b-vs-c"
const parts = params.slugs.split('-vs-');
if (parts.join('-vs-') !== canonicalCompareSlug(parts)) redirect(301, `/compare/${canonicalCompareSlug(parts)}`);
const products = await db.product.findMany({ where:{ slug:{ in: parts }, status:'APPROVED' }});
if (products.length !== parts.length) notFound();
// order columns by `parts` order (already sorted) — or preserve user order if you prefer UX over SEO canonical.
```

## 6. Seed Strategy

- Categories: 30 top-level + 150 subcategories (hand-curated, based on observed taxonomy).
- Products: 1,000–3,000 synthetic but realistic (faker + real logos via clearbit or uploaded). Each: 5–8 features (via taxonomy), 1–3 pricing plans, 1–2 integrations, avg 2 reviews.
- Reviews: 3–5 per product, 30% verified, distributed 5→1 as 45/30/12/8/5.
- Comparisons: auto-generate top-3 per top-20 categories (pairwise of top 5 by rating) = ~200 at seed.

## 7. Migrations & Operational Notes

- Use Prisma migrate, not db push, in prod.
- Enable `pg_trgm` + `btree_gin` for ILIKE + array queries.
- Add `pg_cron` for nightly aggregation sanity check (recompute denormalized ratings).
- Backup: PITR + daily dump; search index is rebuildable from DB.
