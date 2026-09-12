import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://software-directory.example";

/**
 * Robots.
 *
 * Search result pages are excluded here as well as marked `noindex` on the page itself.
 * Belt and braces: a crawler that ignores the meta tag still will not fetch them, which
 * keeps crawl budget on the category and product pages that carry real content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search", "/api/", "/vendor", "/admin"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
