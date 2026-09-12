/**
 * Search.
 *
 * The contract here is deliberately the shape Meilisearch returns — grouped hits,
 * facet-aware, graceful when nothing matches. Swapping the implementation means
 * replacing this one module; `searchAll` is the only exported surface consumers use.
 */

import { dataset } from "@/lib/data/seed";
import type {
  SearchHitCategory,
  SearchHitComparison,
  SearchHitProduct,
  SearchResults,
} from "@/lib/data/types";

interface IndexedProduct {
  slug: string;
  name: string;
  nameLower: string;
  taglineLower: string;
  vendorLower: string;
  categoryLower: string;
  featureText: string;
  descriptionLower: string;
  score: number;
  ratingAvg: number;
  ratingCount: number;
}

const FEATURE_NAMES = new Map(dataset.features.map((f) => [f.slug, f.name]));

const productIndex: IndexedProduct[] = dataset.products.map((p) => ({
  slug: p.slug,
  name: p.name,
  nameLower: p.name.toLowerCase(),
  taglineLower: p.tagline.toLowerCase(),
  vendorLower: p.companyName.toLowerCase(),
  categoryLower: p.primaryCategoryName.toLowerCase(),
  featureText: p.featureSlugs
    .map((s) => FEATURE_NAMES.get(s) ?? "")
    .join(" ")
    .toLowerCase(),
  descriptionLower: p.shortDescription.toLowerCase(),
  score: p.score,
  ratingAvg: p.ratingAvg,
  ratingCount: p.ratingCount,
}));

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

/**
 * Weighted match. Exact and prefix matches on the product name dominate; description
 * and feature text contribute only enough to break ties. This is what keeps
 * "hubspot" returning HubSpot rather than a product that merely mentions it.
 */
function scoreProduct(entry: IndexedProduct, rawQuery: string, tokens: string[]): number {
  const q = rawQuery.toLowerCase().trim();
  let score = 0;

  if (entry.nameLower === q) score += 1200;
  else if (entry.nameLower.startsWith(q)) score += 700;
  else if (entry.nameLower.includes(q)) score += 420;

  if (entry.vendorLower === q) score += 380;
  else if (entry.vendorLower.startsWith(q)) score += 260;
  else if (entry.vendorLower.includes(q)) score += 150;

  if (entry.categoryLower === q) score += 300;
  else if (entry.categoryLower.includes(q)) score += 140;

  if (entry.taglineLower.includes(q)) score += 110;

  for (const token of tokens) {
    if (entry.nameLower.includes(token)) score += 90;
    else if (entry.vendorLower.includes(token)) score += 50;
    else if (entry.categoryLower.includes(token)) score += 40;
    else if (entry.taglineLower.includes(token)) score += 26;
    else if (entry.featureText.includes(token)) score += 14;
    else if (entry.descriptionLower.includes(token)) score += 8;
  }

  // Require a real signal: a lone token matching only feature text is not a hit.
  if (score < 40) return 0;

  // Quality tiebreaker — deliberately small so it never overrides textual relevance.
  return score + entry.score / 40 + Math.min(entry.ratingCount, 3000) / 3000;
}

function toHitProduct(entry: IndexedProduct): SearchHitProduct {
  const product = dataset.products.find((p) => p.slug === entry.slug)!;
  return {
    kind: "product",
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    logoDomain: product.logoDomain,
    ratingAvg: product.ratingAvg,
    ratingCount: product.ratingCount,
    categoryName: product.primaryCategoryName,
    categorySlug: product.primaryCategorySlug,
  };
}

function getPopularCategories(limit = 6): { name: string; slug: string }[] {
  return dataset.categories
    .filter((c) => c.depth === 0)
    .slice()
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, limit)
    .map((c) => ({ name: c.name, slug: c.slug }));
}

export interface SearchOptions {
  productLimit?: number;
  categoryLimit?: number;
  comparisonLimit?: number;
}

export function searchAll(query: string, options: SearchOptions = {}): SearchResults {
  const productLimit = options.productLimit ?? 8;
  const categoryLimit = options.categoryLimit ?? 5;
  const comparisonLimit = options.comparisonLimit ?? 4;

  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: trimmed,
      products: [],
      categories: [],
      comparisons: [],
      total: 0,
      suggestions: getPopularCategories(),
    };
  }

  const tokens = tokenize(trimmed);

  const products = productIndex
    .map((entry) => ({ entry, score: scoreProduct(entry, trimmed, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, productLimit)
    .map((r) => toHitProduct(r.entry));

  const categories: SearchHitCategory[] = dataset.categories
    .map((c) => {
      const nameLower = c.name.toLowerCase();
      let score = 0;
      if (nameLower === trimmed.toLowerCase()) score += 800;
      else if (nameLower.startsWith(trimmed.toLowerCase())) score += 500;
      else if (nameLower.includes(trimmed.toLowerCase())) score += 280;
      for (const token of tokens) {
        if (nameLower.includes(token)) score += 70;
        else if (c.description.toLowerCase().includes(token)) score += 20;
      }
      // A pillar is more useful to land on than a subcategory.
      if (c.depth === 0) score += 40;
      return { category: c, score };
    })
    .filter((r) => r.score > 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, categoryLimit)
    .map(({ category }) => ({
      kind: "category" as const,
      slug: category.slug,
      name: category.name,
      icon: category.icon,
      productCount: category.productCount,
      depth: category.depth,
    }));

  const comparisons: SearchHitComparison[] = dataset.comparisons
    .map((c) => {
      // Keep the real product names as an array. Joining them into a string and
      // splitting again would shred multi-word names ("Salesforce Sales Cloud"
      // would become three separate entries).
      const names = c.productSlugs
        .map((s) => dataset.products.find((p) => p.slug === s)?.name)
        .filter((name): name is string => Boolean(name));
      const haystack = `${c.title} ${names.join(" ")}`.toLowerCase();
      let score = 0;
      if (haystack.includes(trimmed.toLowerCase())) score += 300;
      for (const token of tokens) if (haystack.includes(token)) score += 60;
      return { comparison: c, names, score };
    })
    .filter((r) => r.score > 120)
    .sort((a, b) => b.score - a.score || b.comparison.views - a.comparison.views)
    .slice(0, comparisonLimit)
    .map(({ comparison, names }) => ({
      kind: "comparison" as const,
      slug: comparison.slug,
      title: comparison.title,
      productNames: names,
      views: comparison.views,
    }));

  const total = products.length + categories.length + comparisons.length;

  return {
    query: trimmed,
    products,
    categories,
    comparisons,
    total,
    suggestions: total === 0 ? getPopularCategories() : [],
  };
}

export { getPopularCategories };
