/**
 * Vendor portal scope.
 *
 * There is no authentication in this build, so the portal is pinned to a single
 * representative vendor rather than pretending to resolve "the signed-in vendor".
 * When auth lands, `DEMO_VENDOR_SLUG` is replaced by the session's company slug and
 * nothing else in the vendor area has to change — every page reads the vendor through
 * the same slug.
 */

export const DEMO_VENDOR_SLUG = "salesforce";

export const VENDOR_NAV = [
  { href: "/vendor", label: "Overview", icon: "dashboard" },
  { href: "/vendor/leads", label: "Leads", icon: "inbox" },
  { href: "/vendor/products", label: "Products", icon: "package" },
  { href: "/vendor/reviews", label: "Reviews", icon: "star" },
] as const;

/* ==========================================================================
   ADMIN PORTAL
   ========================================================================= */

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: "dashboard" },
  { href: "/admin/moderation", label: "Moderation", icon: "shield" },
  { href: "/admin/leads", label: "Leads", icon: "inbox" },
  { href: "/admin/seo", label: "SEO status", icon: "search" },
] as const;
