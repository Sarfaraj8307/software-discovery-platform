import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://software-directory.example";

/**
 * Robots.
 *
 * Search result pages are excluded here as well as marked `noindex` on the page itself.
 * Belt and braces: a crawler that ignores the meta tag still will not fetch them, which
 * keeps crawl budget on the category and product pages that carry real content.
 *
 * /graph is excluded for the same reason: it is a viewer for this project's own source,
 * so it has no value in an index and would only compete with the catalogue.
 *
 * IMPORTANT: this list and the inventory on /admin/seo are cross-checked against each
 * other at render time. Adding an entry here without a matching row there turns that
 * page red rather than passing silently.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search", "/api/", "/vendor", "/admin", "/graph"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
