import type { MetadataRoute } from "next";
import { getDataset } from "@/lib/data/repository";

/**
 * Sitemap.
 *
 * Priorities reflect how much unique value each surface carries. Category and product
 * pages are the long-tail entry points and get the highest priority; the search results
 * page is deliberately absent because it is `noindex`.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://software-directory.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const dataset = getDataset();
  const now = new Date("2026-09-12");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/categories`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/compare`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/methodology`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categories: MetadataRoute.Sitemap = dataset.categories.map((category) => ({
    url: `${SITE}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: category.depth === 0 ? 0.9 : 0.7,
  }));

  const products: MetadataRoute.Sitemap = dataset.products.map((product) => ({
    url: `${SITE}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const comparisons: MetadataRoute.Sitemap = dataset.comparisons.map((comparison) => ({
    url: `${SITE}/compare/${comparison.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Resource articles are intentionally omitted: there is no /resources route yet, and
  // a sitemap that advertises 404s is worse than one that omits them.

  return [...staticRoutes, ...categories, ...products, ...comparisons];
}
