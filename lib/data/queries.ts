/**
 * View composition layer.
 *
 * `repository.ts` is data access; this module turns that into exactly the shapes pages
 * need, and owns URL → filter parsing. Keeping it separate means a page component never
 * has to know how a filter is encoded in the querystring, and the same parsing is
 * reused by the filter rail, the chips row and the API route.
 */

import { buildComparisonSections, summariseDifferences } from "@/lib/compare";
import {
  getAdjacentCategories,
  getCategory,
  getCategoryProducts,
  getCompany,
  getComparison,
  getComparisonsForProduct,
  getFacets,
  getFeaturedProducts,
  getFeatureGroups,
  getFeaturesByGroup,
  getFeaturesForProduct,
  getIntegrationsForProduct,
  getMostCompared,
  getProduct,
  getProductsByCategorySlug,
  getRelatedProducts,
  getReviewSummary,
  getReviewsForProduct,
  getSocialProof as getSocialProofFromRepo,
  getSubcategories,
  getTopCategories,
  getTrendingProducts,
  listCategories,
  listComparisons,
  listPillarCategories,
  listProducts,
  listResources,
  type ReviewQuery,
} from "./repository";
import type {
  Category,
  Company,
  Comparison,
  ComparisonSection,
  DeploymentModel,
  CompanySize,
  Feature,
  FeatureGroup,
  FilterFacets,
  Integration,
  Paginated,
  Product,
  ProductFilters,
  ProductQuery,
  Resource,
  Review,
  SortKey,
} from "./types";

export type SearchParams = Record<string, string | string[] | undefined>;
export type PillarWithChildren = Category & { children: Category[] };

/* ==========================================================================
   TAXONOMY SHAPES
   ========================================================================= */

export function getPillarsWithChildren(): PillarWithChildren[] {
  return listPillarCategories().map((pillar) => ({
    ...pillar,
    children: getSubcategories(pillar.slug),
  }));
}

export function getSocialProof() {
  return getSocialProofFromRepo();
}

export function getCategoryTree() {
  return {
    pillars: getPillarsWithChildren(),
    subcategories: listCategories().filter((c) => c.depth === 1),
  };
}

export function getCategoriesHubData() {
  return getCategoryTree();
}

/* ==========================================================================
   URL → FILTER PARSING
   ========================================================================= */

const SORT_KEYS: SortKey[] = ["score", "popularity", "satisfaction", "reviews", "name"];
const PRICING_VALUES = ["free", "free_trial", "paid"] as const;
const DEPLOYMENT_VALUES: DeploymentModel[] = ["cloud", "on_premise", "mobile", "hybrid"];
const SIZE_VALUES: CompanySize[] = ["small", "mid", "enterprise"];

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function pickMany<T extends string>(raw: string[], allowed: readonly T[]): T[] {
  return raw.filter((v): v is T => (allowed as readonly string[]).includes(v));
}

function nonEmpty(values: string[]): string[] | undefined {
  return values.length > 0 ? values : undefined;
}

/**
 * Total function: any querystring — including hostile input — produces a valid query.
 * An unrecognised sort falls back to the default rather than throwing or 500ing.
 */
export function parseProductQuery(params: SearchParams, scopeSlug?: string): ProductQuery {
  const rawSort = toArray(params.sort)[0];
  const sort: SortKey = SORT_KEYS.includes(rawSort as SortKey) ? (rawSort as SortKey) : "score";

  const pageRaw = Number.parseInt(toArray(params.page)[0] ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const ratingRaw = Number.parseFloat(toArray(params.rating)[0] ?? "");
  const minRating = Number.isFinite(ratingRaw) && ratingRaw > 0 ? ratingRaw : undefined;

  const filters: ProductFilters = {
    q: toArray(params.q)[0] || undefined,
    categories: scopeSlug ? [scopeSlug] : nonEmpty(toArray(params.category).filter(Boolean)),
    pricing: pickMany(toArray(params.pricing), PRICING_VALUES),
    deployment: pickMany(toArray(params.deployment), DEPLOYMENT_VALUES),
    companySize: pickMany(toArray(params.size), SIZE_VALUES),
    features: nonEmpty(toArray(params.feature).filter(Boolean)),
    integrations: nonEmpty(toArray(params.integration).filter(Boolean)),
    minRating,
  };

  return { ...filters, sort, page, perPage: 20 };
}

/** Number of active filter dimensions — drives the mobile "Filters (3)" badge. */
export function countActiveFilters(query: ProductQuery): number {
  return (
    (query.pricing?.length ?? 0) +
    (query.deployment?.length ?? 0) +
    (query.companySize?.length ?? 0) +
    (query.features?.length ?? 0) +
    (query.integrations?.length ?? 0) +
    (query.minRating ? 1 : 0)
  );
}

/* ==========================================================================
   CATEGORY PAGE
   ========================================================================= */

export interface CategoryPageData {
  category: Category;
  parent: Category | null;
  children: Category[];
  products: Paginated<Product>;
  facets: FilterFacets;
  query: ProductQuery;
  activeFilterCount: number;
  adjacent: Category[];
}

export function getCategoryPageData(slug: string, params: SearchParams): CategoryPageData | null {
  const category = getCategory(slug);
  if (!category) return null;

  const query = parseProductQuery(params, slug);

  return {
    category,
    parent: category.parentSlug ? getCategory(category.parentSlug) : null,
    children: getSubcategories(category.slug),
    products: listProducts(query),
    facets: getFacets(query, slug),
    query,
    activeFilterCount: countActiveFilters(query),
    adjacent: getAdjacentCategories(slug, 4),
  };
}

/* ==========================================================================
   HOME PAGE
   ========================================================================= */

export interface HomePageData {
  pillars: PillarWithChildren[];
  featured: Product[];
  trending: Product[];
  mostCompared: Comparison[];
  topCategories: Category[];
  socialProof: ReturnType<typeof getSocialProofFromRepo>;
  categoryBlocks: { category: Category; products: Product[] }[];
  resources: Resource[];
}

export function getHomePageData(): HomePageData {
  const blockCategories = getTopCategories(4);

  return {
    pillars: getPillarsWithChildren(),
    featured: getFeaturedProducts(6),
    trending: getTrendingProducts(6),
    mostCompared: getMostCompared(6),
    topCategories: getTopCategories(12),
    socialProof: getSocialProofFromRepo(),
    categoryBlocks: blockCategories.map((category) => ({
      category,
      products: getProductsByCategorySlug(category.slug, 6),
    })),
    resources: listResources().slice(0, 4),
  };
}

/* ==========================================================================
   PRODUCT PAGE
   ========================================================================= */

export interface FeatureGroupWithFeatures {
  group: FeatureGroup;
  features: (Feature & { available: boolean })[];
}

export interface ProductPageData {
  product: Product;
  company: Company | null;
  category: Category | null;
  featureGroups: FeatureGroupWithFeatures[];
  availableFeatureCount: number;
  totalFeatureCount: number;
  integrations: Integration[];
  alternatives: Product[];
  comparisons: Comparison[];
  reviews: Paginated<Review>;
  reviewSummary: ReturnType<typeof getReviewSummary>;
  reviewQuery: ReviewQuery;
  relatedCategories: Category[];
}

function parseReviewQuery(params: SearchParams): ReviewQuery {
  const ratingRaw = Number.parseInt(toArray(params.reviewRating)[0] ?? "", 10);
  const sortRaw = toArray(params.reviewSort)[0];
  const pageRaw = Number.parseInt(toArray(params.reviewPage)[0] ?? "1", 10);

  return {
    rating: Number.isFinite(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : undefined,
    verifiedOnly: toArray(params.verified)[0] === "1",
    currentUserOnly: toArray(params.currentUser)[0] === "1",
    sort: sortRaw === "helpful" || sortRaw === "rating" ? sortRaw : "recent",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    perPage: 5,
  };
}

export function getProductPageData(slug: string, params: SearchParams): ProductPageData | null {
  const product = getProduct(slug);
  if (!product) return null;

  const available = new Set(getFeaturesForProduct(slug).map((f) => f.slug));

  const featureGroups: FeatureGroupWithFeatures[] = getFeatureGroups().map((group) => ({
    group,
    features: getFeaturesByGroup(group.slug).map((feature) => ({
      ...feature,
      available: available.has(feature.slug),
    })),
  }));

  return {
    product,
    company: getCompany(product.companySlug),
    category: getCategory(product.primaryCategorySlug),
    featureGroups,
    availableFeatureCount: available.size,
    totalFeatureCount: featureGroups.reduce((sum, g) => sum + g.features.length, 0),
    integrations: getIntegrationsForProduct(slug),
    alternatives: getRelatedProducts(product, 6),
    comparisons: getComparisonsForProduct(slug, 6),
    reviews: getReviewsForProduct(slug, parseReviewQuery(params)),
    reviewSummary: getReviewSummary(slug),
    reviewQuery: parseReviewQuery(params),
    relatedCategories: getAdjacentCategories(product.primaryCategorySlug, 4),
  };
}

/* ==========================================================================
   COMPARE PAGE
   ========================================================================= */

export interface ComparePageData {
  products: Product[];
  sections: ComparisonSection[];
  summary: string[];
  slug: string;
  /** Alphabetical canonical form; if it differs from the request, the page 301s. */
  canonicalSlug: string;
}

export function getComparePageData(rawSlug: string): ComparePageData | null {
  const slugs = rawSlug.split("-vs-").filter(Boolean);
  if (slugs.length < 2 || slugs.length > 4) return null;

  const products = slugs.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p));
  if (products.length !== slugs.length) return null;

  const sections = buildComparisonSections(products);

  return {
    products,
    sections,
    summary: summariseDifferences(sections, products),
    slug: rawSlug,
    canonicalSlug: [...slugs].sort((a, b) => a.localeCompare(b)).join("-vs-"),
  };
}

export function getCompareHubData() {
  return {
    trending: getMostCompared(8),
    all: listComparisons().slice(0, 24),
    categories: getTopCategories(8),
  };
}

/* ==========================================================================
   SEARCH PAGE
   ========================================================================= */

export interface SearchPageData {
  q: string;
  products: Paginated<Product>;
  facets: FilterFacets;
  query: ProductQuery;
  activeFilterCount: number;
  adjacent: Category[];
}

export function getSearchPageData(params: SearchParams): SearchPageData {
  const q = toArray(params.q)[0] ?? "";
  const base = parseProductQuery(params);
  const query: ProductQuery = { ...base, q: q || undefined };

  return {
    q,
    products: listProducts(query),
    facets: getFacets(query),
    query,
    activeFilterCount: countActiveFilters(query),
    adjacent: getTopCategories(4),
  };
}

export {
  getCategory,
  getCategoryProducts,
  getComparison,
  getProduct,
  getProductsByCategorySlug,
};
