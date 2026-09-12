/**
 * Repository — the ONLY data entry point for the application.
 *
 * Every page and component reads through this module. Nothing imports `seed.ts`
 * directly. That constraint is what makes the eventual swap to Prisma a one-file
 * change: reimplement these functions against the schema in `DATABASE-SCHEMA.md`
 * and no page or component needs to move.
 */

import { dataset } from "./seed";
import type {
  AdminMetrics,
  Category,
  Company,
  Comparison,
  Dataset,
  DeploymentModel,
  FacetCount,
  Feature,
  FeatureGroup,
  FilterFacets,
  Integration,
  Lead,
  LeadStatus,
  LeadType,
  Paginated,
  Product,
  ProductFilters,
  ProductQuery,
  Resource,
  Review,
  SearchResults,
  SortKey,
  VendorMetrics,
} from "./types";
import { slugify } from "./seed";

/* ==========================================================================
   INDEXES — built once per process
   ========================================================================= */

const productBySlug = new Map<string, Product>();
const categoryBySlug = new Map<string, Category>();
const companyBySlug = new Map<string, Company>();
const comparisonBySlug = new Map<string, Comparison>();
const resourceBySlug = new Map<string, Resource>();
const reviewsByProduct = new Map<string, Review[]>();
const featureBySlug = new Map<string, Feature>();
const integrationBySlug = new Map<string, Integration>();

for (const p of dataset.products) productBySlug.set(p.slug, p);
for (const c of dataset.categories) categoryBySlug.set(c.slug, c);
for (const c of dataset.companies) companyBySlug.set(c.slug, c);
for (const c of dataset.comparisons) comparisonBySlug.set(c.slug, c);
for (const r of dataset.resources) resourceBySlug.set(r.slug, r);
for (const f of dataset.features) featureBySlug.set(f.slug, f);
for (const i of dataset.integrations) integrationBySlug.set(i.slug, i);
for (const r of dataset.reviews) {
  const list = reviewsByProduct.get(r.productSlug) ?? [];
  list.push(r);
  reviewsByProduct.set(r.productSlug, list);
}
for (const [, list] of reviewsByProduct) {
  list.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

/**
 * Runtime-mutable lead store. Stands in for the `Lead` table.
 *
 * It is parked on `globalThis` deliberately. A plain module-scoped array is re-created
 * once per route bundle in a production build, so `app/api/leads/route.ts` and the
 * vendor portal would each hold a *separate* copy — an enquiry would be accepted with a
 * 201 and then never appear in the inbox. `globalThis` is shared across bundles within a
 * process, which is the same reason Prisma clients get cached there.
 *
 * The limitation this does not solve: it is still per-process, so it does not survive a
 * restart and is not shared between instances. Swapping it for the real `Lead` table is
 * the entirety of the migration — every reader goes through `listLeads`/`createLead`.
 */
const globalForLeads = globalThis as unknown as { __leadStore?: Lead[] };
const leadStore: Lead[] = (globalForLeads.__leadStore ??= [...dataset.leads]);

/* ==========================================================================
   CATEGORIES
   ========================================================================= */

export function getDataset(): Dataset {
  return dataset;
}

export function listCategories(): Category[] {
  return [...dataset.categories].sort(
    (a, b) => a.depth - b.depth || a.sortOrder - b.sortOrder,
  );
}

export function listPillarCategories(): Category[] {
  return listCategories().filter((c) => c.depth === 0);
}

export function getCategory(slug: string): Category | null {
  return categoryBySlug.get(slug) ?? null;
}

export function getSubcategories(parentSlug: string): Category[] {
  return listCategories().filter((c) => c.parentSlug === parentSlug);
}

/** Sibling pillars, used for "browse adjacent categories" empty states. */
export function getAdjacentCategories(slug: string, limit = 3): Category[] {
  const pillar = getCategory(slug);
  const root = pillar?.depth === 0 ? pillar.slug : (pillar?.parentSlug ?? slug);
  const siblings = listPillarCategories().filter((c) => c.slug !== root);
  const index = listPillarCategories().findIndex((c) => c.slug === root);
  const start = index < 0 ? 0 : index;
  const out: Category[] = [];
  for (let i = 1; i <= siblings.length && out.length < limit; i++) {
    const candidate = listPillarCategories()[(start + i) % listPillarCategories().length];
    if (candidate && candidate.slug !== root) out.push(candidate);
  }
  return out.slice(0, limit);
}

export function getTopCategories(limit = 10): Category[] {
  return listPillarCategories()
    .slice()
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, limit);
}

/**
 * Products belonging to a category. Pillars match on the primary category; a
 * subcategory matches on membership, so a product can appear in both its pillar
 * ranking and its subcategory page — which is how the taxonomy is meant to work.
 */
export function getCategoryProducts(slug: string): Product[] {
  const category = getCategory(slug);
  if (!category) return [];
  if (category.depth === 0) {
    return dataset.products.filter((p) => p.primaryCategorySlug === slug);
  }
  return dataset.products.filter((p) => p.categorySlugs.includes(slug));
}

/* ==========================================================================
   PRODUCTS — QUERY
   ========================================================================= */

function matchesFilters(
  product: Product,
  filters: ProductFilters,
  except?: keyof ProductFilters,
): boolean {
  if (except !== "categories" && filters.categories?.length) {
    if (!filters.categories.some((slug) => product.categorySlugs.includes(slug))) {
      return false;
    }
  }

  if (except !== "pricing" && filters.pricing?.length) {
    const ok = filters.pricing.some((mode) => {
      if (mode === "free") return product.freeVersion || product.startingPrice === 0;
      if (mode === "free_trial") return product.freeTrial;
      return product.startingPrice !== 0;
    });
    if (!ok) return false;
  }

  if (except !== "deployment" && filters.deployment?.length) {
    if (!filters.deployment.some((d) => product.deployment.includes(d))) return false;
  }

  if (except !== "companySize" && filters.companySize?.length) {
    if (!filters.companySize.some((s) => product.companySizes.includes(s))) return false;
  }

  if (except !== "features" && filters.features?.length) {
    if (!filters.features.every((f) => product.featureSlugs.includes(f))) return false;
  }

  if (except !== "integrations" && filters.integrations?.length) {
    if (!filters.integrations.every((i) => product.integrationSlugs.includes(i))) return false;
  }

  if (except !== "minRating" && filters.minRating) {
    if (product.ratingAvg < filters.minRating) return false;
  }

  if (except !== "minScore" && filters.minScore) {
    if (product.score < filters.minScore) return false;
  }

  if (except !== "q" && filters.q) {
    const needle = filters.q.trim().toLowerCase();
    if (needle) {
      const haystack = [
        product.name,
        product.tagline,
        product.companyName,
        product.primaryCategoryName,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
  }

  return true;
}

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  score: (a, b) => b.score - a.score || b.ratingAvg - a.ratingAvg,
  popularity: (a, b) => b.profileViews - a.profileViews,
  satisfaction: (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
  reviews: (a, b) => b.ratingCount - a.ratingCount,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function listProducts(query: ProductQuery = {}): Paginated<Product> {
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.max(1, Math.min(100, query.perPage ?? 20));

  const filtered = dataset.products.filter((p) => matchesFilters(p, query));
  const sorted = filtered.slice().sort(SORTERS[query.sort ?? "score"]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;

  return {
    items: sorted.slice(start, start + perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
  };
}

export function getProduct(slug: string): Product | null {
  return productBySlug.get(slug) ?? null;
}

export function getProductsBySlugs(slugs: string[]): Product[] {
  return slugs
    .map((s) => productBySlug.get(s))
    .filter((p): p is Product => Boolean(p));
}

export function getProductsByCategorySlug(slug: string, limit = 6): Product[] {
  return getCategoryProducts(slug)
    .slice()
    .sort(SORTERS.score)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 6): Product[] {
  const featured = dataset.products.filter((p) => p.featured && !p.sponsored);
  const pool = featured.length >= limit ? featured : dataset.products;
  return pool
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getTrendingProducts(limit = 6): Product[] {
  return dataset.products
    .filter((p) => p.trendingRank !== null)
    .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
    .slice(0, limit);
}

export function getMostCompared(limit = 6): Comparison[] {
  return dataset.comparisons.slice(0, limit);
}

export function getComparisonsForProduct(slug: string, limit = 4): Comparison[] {
  return dataset.comparisons
    .filter((c) => c.productSlugs.includes(slug))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/** Alternatives: same primary category, ranked by score, excluding the product. */
export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return dataset.products
    .filter(
      (p) => p.slug !== product.slug && p.primaryCategorySlug === product.primaryCategorySlug,
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getCompany(slug: string): Company | null {
  return companyBySlug.get(slug) ?? null;
}

export function getCompanyProducts(slug: string): Product[] {
  return dataset.products.filter((p) => p.companySlug === slug);
}

/* ==========================================================================
   FACETS
   ========================================================================= */

function countBy<T>(items: T[], key: (item: T) => string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const k of key(item)) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

/**
 * Facet counts are computed against the result set filtered by every OTHER active
 * dimension. That is what makes the counts honest — a filter never advertises
 * options that would return nothing.
 */
export function getFacets(base: ProductFilters, scopeSlug?: string): FilterFacets {
  const scoped = scopeSlug
    ? dataset.products.filter((p) => p.categorySlugs.includes(scopeSlug))
    : dataset.products;

  const forDimension = (dimension: keyof ProductFilters) =>
    scoped.filter((p) => matchesFilters(p, base, dimension));

  const pricingPool = forDimension("pricing");
  const pricing: FacetCount[] = [
    { value: "free", label: "Free version", count: pricingPool.filter((p) => p.freeVersion || p.startingPrice === 0).length },
    { value: "free_trial", label: "Free trial", count: pricingPool.filter((p) => p.freeTrial).length },
    { value: "paid", label: "Paid only", count: pricingPool.filter((p) => p.startingPrice !== 0).length },
  ].filter((f) => f.count > 0);

  const deploymentPool = forDimension("deployment");
  const deploymentCounts = countBy(deploymentPool, (p) => p.deployment);
  const deployment: FacetCount[] = (["cloud", "on_premise", "mobile", "hybrid"] as DeploymentModel[])
    .map((value) => ({
      value,
      label: { cloud: "Cloud", on_premise: "On-premise", mobile: "Mobile app", hybrid: "Hybrid" }[value],
      count: deploymentCounts.get(value) ?? 0,
    }))
    .filter((f) => f.count > 0);

  const sizePool = forDimension("companySize");
  const sizeCounts = countBy(sizePool, (p) => p.companySizes);
  const companySize: FacetCount[] = (["small", "mid", "enterprise"] as const)
    .map((value) => ({
      value,
      label: { small: "Small business", mid: "Mid-market", enterprise: "Enterprise" }[value],
      count: sizeCounts.get(value) ?? 0,
    }))
    .filter((f) => f.count > 0);

  const featurePool = forDimension("features");
  const featureCounts = countBy(featurePool, (p) => p.featureSlugs);
  const features: FacetCount[] = dataset.features
    .map((f) => ({
      value: f.slug,
      label: f.name,
      count: featureCounts.get(f.slug) ?? 0,
    }))
    .filter((f) => f.count > 0 && f.count < featurePool.length)
    .sort((a, b) => b.count - a.count)
    .slice(0, 24);

  const integrationPool = forDimension("integrations");
  const integrationCounts = countBy(integrationPool, (p) => p.integrationSlugs);
  const integrations: FacetCount[] = dataset.integrations
    .map((i) => ({
      value: i.slug,
      label: i.name,
      count: integrationCounts.get(i.slug) ?? 0,
    }))
    .filter((f) => f.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const ratingPool = forDimension("minRating");
  const rating: FacetCount[] = [4.5, 4, 3.5, 3]
    .map((value) => ({
      value: String(value),
      label: `${value}+ stars`,
      count: ratingPool.filter((p) => p.ratingAvg >= value).length,
    }))
    .filter((f) => f.count > 0);

  return { pricing, deployment, companySize, features, integrations, rating };
}

/* ==========================================================================
   REVIEWS
   ========================================================================= */

export interface ReviewQuery {
  rating?: number;
  verifiedOnly?: boolean;
  currentUserOnly?: boolean;
  sort?: "recent" | "helpful" | "rating";
  page?: number;
  perPage?: number;
}

export function getReviewsForProduct(slug: string, query: ReviewQuery = {}): Paginated<Review> {
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.max(1, Math.min(50, query.perPage ?? 5));

  let items = (reviewsByProduct.get(slug) ?? []).filter((r) => r.status === "APPROVED");

  if (query.rating) items = items.filter((r) => r.rating === query.rating);
  if (query.verifiedOnly) {
    items = items.filter((r) => r.verification === "VALIDATED" || r.verification === "CURRENT_USER");
  }
  if (query.currentUserOnly) items = items.filter((r) => r.verification === "CURRENT_USER");

  const sort = query.sort ?? "recent";
  items = items.slice().sort((a, b) => {
    if (sort === "helpful") return b.helpfulCount - a.helpfulCount;
    if (sort === "rating") return b.rating - a.rating;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
  };
}

export interface ReviewSummary {
  total: number;
  distribution: [number, number, number, number, number];
  verifiedCount: number;
  currentUserCount: number;
  incentivizedCount: number;
  withResponses: number;
}

export function getReviewSummary(slug: string): ReviewSummary {
  const approved = (reviewsByProduct.get(slug) ?? []).filter((r) => r.status === "APPROVED");
  return {
    total: approved.length,
    distribution: [5, 4, 3, 2, 1].map(
      (star) => approved.filter((r) => r.rating === star).length,
    ) as [number, number, number, number, number],
    verifiedCount: approved.filter((r) => r.verification === "VALIDATED").length,
    currentUserCount: approved.filter((r) => r.verification === "CURRENT_USER").length,
    incentivizedCount: approved.filter((r) => r.verification === "INCENTIVIZED").length,
    withResponses: approved.filter((r) => r.vendorResponse).length,
  };
}

export function getRecentReviews(limit = 12): Review[] {
  return dataset.reviews
    .filter((r) => r.status === "APPROVED")
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, limit);
}

/* ==========================================================================
   COMPARISONS
   ========================================================================= */

export function listComparisons(): Comparison[] {
  return dataset.comparisons;
}

export function getComparison(slug: string): Comparison | null {
  return comparisonBySlug.get(slug) ?? null;
}

/* ==========================================================================
   TAXONOMY
   ========================================================================= */

export function getFeatureGroups(): FeatureGroup[] {
  return [...dataset.featureGroups].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeatures(): Feature[] {
  return dataset.features;
}

/** Features belonging to one taxonomy group, in catalogue order. */
export function getFeaturesByGroup(groupSlug: string): Feature[] {
  return dataset.features.filter((f) => f.groupSlug === groupSlug);
}

export function getFeaturesForProduct(slug: string): Feature[] {
  const product = productBySlug.get(slug);
  if (!product) return [];
  return dataset.features.filter((f) => product.featureSlugs.includes(f.slug));
}

export function getIntegrationsForProduct(slug: string): Integration[] {
  const product = productBySlug.get(slug);
  if (!product) return [];
  return product.integrationSlugs
    .map((s) => integrationBySlug.get(s))
    .filter((i): i is Integration => Boolean(i))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getTopIntegrations(limit = 24): Integration[] {
  return dataset.integrations.slice(0, limit);
}

export function getFeatureBySlug(slug: string): Feature | null {
  return featureBySlug.get(slug) ?? null;
}

/* ==========================================================================
   RESOURCES
   ========================================================================= */

export function listResources(): Resource[] {
  return [...dataset.resources].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export function getResource(slug: string): Resource | null {
  return resourceBySlug.get(slug) ?? null;
}

/* ==========================================================================
   LEADS
   ========================================================================= */

export interface CreateLeadInput {
  type: LeadType;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  message?: string | null;
  intent?: string | null;
  productSlug?: string | null;
  categorySlug?: string | null;
  sourceLocation: string;
}

export function createLead(input: CreateLeadInput): Lead {
  const product = input.productSlug ? productBySlug.get(input.productSlug) : null;
  const now = new Date().toISOString();
  const lead: Lead = {
    id: `lead_${String(leadStore.length + 1).padStart(3, "0")}`,
    type: input.type,
    status: "NEW",
    productSlug: product?.slug ?? null,
    productName: product?.name ?? null,
    name: input.name,
    email: input.email,
    company: input.company ?? null,
    phone: input.phone ?? null,
    message: input.message ?? null,
    intent: input.intent ?? null,
    sourceLocation: input.sourceLocation,
    categorySlug: input.categorySlug ?? product?.primaryCategorySlug ?? null,
    createdAt: now,
    updatedAt: now,
  };
  leadStore.unshift(lead);
  return lead;
}

export function listLeads(filter?: { status?: LeadStatus; type?: LeadType }): Lead[] {
  return leadStore.filter((l) => {
    if (filter?.status && l.status !== filter.status) return false;
    if (filter?.type && l.type !== filter.type) return false;
    return true;
  });
}

export function getLead(id: string): Lead | null {
  return leadStore.find((l) => l.id === id) ?? null;
}

/* ==========================================================================
   DASHBOARDS
   ========================================================================= */

const LEAD_SOURCE_LABELS: Record<string, string> = {
  "product#hero": "Product page hero",
  "product#rail": "Product page rail",
  "compare#gate": "Comparison email gate",
  "category#rail": "Category rail",
  "search#empty": "Search empty state",
};

export function getVendorMetrics(companySlug?: string): VendorMetrics {
  const products = companySlug ? getCompanyProducts(companySlug) : dataset.products;
  const slugs = new Set(products.map((p) => p.slug));
  const leads = leadStore.filter((l) => l.productSlug && slugs.has(l.productSlug));

  const now = Date.parse(dataset.generatedAt);
  const within = (days: number) =>
    leads.filter((l) => now - Date.parse(l.createdAt) <= days * 86_400_000);

  const profileViews30d = products.reduce((s, p) => s + Math.round(p.profileViews / 12), 0);
  const profileViews7d = Math.round(profileViews30d / 4.3);
  const comparisonHits = products.reduce((s, p) => s + Math.round(p.comparisonViews / 12), 0);

  const sourceCounts = new Map<string, number>();
  for (const lead of leads) {
    sourceCounts.set(lead.sourceLocation, (sourceCounts.get(lead.sourceLocation) ?? 0) + 1);
  }

  const avgRating =
    products.reduce((s, p) => s + p.ratingAvg, 0) / Math.max(1, products.length);

  const reviews = dataset.reviews.filter((r) => slugs.has(r.productSlug));

  return {
    profileViews7d,
    profileViews30d,
    profileViewDelta: 12.4,
    comparisonHits,
    leads7d: within(7).length,
    leads30d: within(30).length,
    leadDelta: 8.1,
    reviewVelocity: Math.round((reviews.length / Math.max(1, products.length)) * 10) / 10,
    avgRating: Math.round(avgRating * 100) / 100,
    responseRate: 0.78,
    leadsBySource: [...sourceCounts.entries()]
      .map(([source, count]) => ({
        source,
        label: LEAD_SOURCE_LABELS[source] ?? source,
        count,
      }))
      .sort((a, b) => b.count - a.count),
    viewsTrend: Array.from({ length: 8 }, (_, i) => {
      const weekStart = profileViews30d / 4.3;
      const wobble = 1 + Math.sin(i * 1.7) * 0.16;
      return {
        label: `W${i + 1}`,
        value: Math.round((weekStart / 7) * 7 * wobble * (0.82 + i * 0.045)),
      };
    }),
  };
}

export function getAdminMetrics(): AdminMetrics {
  const approvedProducts = dataset.products.filter((p) => p.status === "APPROVED");
  return {
    pendingReviews: dataset.reviews.filter((r) => r.status === "PENDING").length,
    pendingProducts: 7,
    pendingClaims: 4,
    newLeads: leadStore.filter((l) => l.status === "NEW").length,
    totalProducts: approvedProducts.length,
    totalReviews: dataset.reviews.length,
    flaggedReviews: dataset.reviews.filter((r) => r.status === "FLAGGED").length,
    indexedPages: approvedProducts.length * 3 + dataset.comparisons.length + dataset.categories.length,
    queuedPages: 148,
    blockedPages: 9,
  };
}

export function getModerationQueue(limit = 20): Review[] {
  return dataset.reviews
    .filter((r) => r.status === "PENDING" || r.status === "FLAGGED")
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .slice(0, limit);
}

export function getPendingProducts(limit = 12): Product[] {
  // The generated catalogue is all APPROVED; surface a deterministic slice as the
  // moderation queue so the admin surface has realistic content to render.
  return dataset.products
    .slice()
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, limit)
    .map((p, i) => (i % 3 === 0 ? { ...p, status: "PENDING" as const } : p));
}

/* ==========================================================================
   SOCIAL PROOF
   ========================================================================= */

export function getSocialProof() {
  const totalReviews = dataset.reviews.length;
  const totalProducts = dataset.products.length;
  const totalCategories = dataset.categories.length;
  const totalCompanies = dataset.companies.length;
  const avgRating =
    dataset.products.reduce((s, p) => s + p.ratingAvg, 0) / dataset.products.length;

  return {
    totalReviews,
    totalProducts,
    totalCategories,
    totalCompanies,
    avgRating: Math.round(avgRating * 100) / 100,
    // Scaled for the "directory scale" strip — labelled as directory totals.
    reviewScale: totalReviews * 4_180,
    buyerScale: 2_400_000,
  };
}

export { slugify };

/* Re-export for consumers that only need search typing. */
export type { SearchResults };
