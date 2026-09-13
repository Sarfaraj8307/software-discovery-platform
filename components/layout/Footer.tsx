import Link from "next/link";
import { formatCount } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandMark";
import { getPillarsWithChildren, getSocialProof } from "@/lib/data/queries";
import { DemoDataNotice } from "@/components/domain/atoms";

const BUYER_LINKS = [
  { href: "/search", label: "Search software" },
  { href: "/categories", label: "All categories" },
  { href: "/compare", label: "Comparison hub" },
  { href: "/methodology", label: "How we score" },
];

const VENDOR_LINKS = [
  { href: "/vendor", label: "Vendor portal" },
  { href: "/vendor/leads", label: "Lead inbox" },
  { href: "/admin", label: "Moderation" },
  { href: "/about", label: "Get listed" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/graph", label: "Codebase graph" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
];

export function Footer() {
  const pillars = getPillarsWithChildren().slice(0, 7);
  const proof = getSocialProof();

  return (
    <footer className="mt-16 border-t border-border bg-subtle print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="Software Discovery — home">
              <BrandLogo />
            </Link>

            <p className="mt-3 max-w-sm text-13 leading-relaxed text-muted-foreground">
              An independent directory for business software. Rankings are built from verified
              reviews, transparent scoring and structured feature data — vendors cannot pay for
              placement.
            </p>

            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <div>
                <dt className="label-caps text-faint">Products</dt>
                <dd className="text-13 font-medium tnum">{formatCount(proof.totalProducts)}</dd>
              </div>
              <div>
                <dt className="label-caps text-faint">Reviews</dt>
                <dd className="text-13 font-medium tnum">{formatCount(proof.totalReviews)}</dd>
              </div>
              <div>
                <dt className="label-caps text-faint">Categories</dt>
                <dd className="text-13 font-medium tnum">{formatCount(proof.totalCategories)}</dd>
              </div>
              <div>
                <dt className="label-caps text-faint">Vendors</dt>
                <dd className="text-13 font-medium tnum">{formatCount(proof.totalCompanies)}</dd>
              </div>
            </dl>
          </div>

          <FooterColumn title="Top categories">
            {pillars.map((pillar) => (
              <FooterLink key={pillar.slug} href={`/categories/${pillar.slug}`}>
                {pillar.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="For buyers">
            {BUYER_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="space-y-8">
            <FooterColumn title="For vendors">
              {VENDOR_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title="Company">
              {COMPANY_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>
        </div>

        {/* ------------------------------------------------ compliance block */}
        <div className="mt-10 space-y-4 border-t border-border pt-6">
          <div className="rounded-card border border-border bg-card p-3">
            <p className="label-caps text-muted-foreground">Disclosure</p>
            <p className="mt-1.5 max-w-4xl text-xs leading-relaxed text-muted-foreground">
              Some listings are marked <span className="font-medium text-warning">Sponsored</span>.
              Sponsored placement is paid for by the vendor, is always labelled, and is excluded
              from every ranking and composite score. Where a reviewer received any incentive, the
              review is labelled <span className="font-medium text-warning">Incentivized</span> and
              weighted lower in the score — we never remove that label. This disclosure is made in
              accordance with the FTC&rsquo;s guidance on endorsements and testimonials (16 CFR
              Part 255).
            </p>
          </div>

          <DemoDataNotice variant="banner" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Software Discovery Platform. Demonstration build.
            </p>
            <p className="text-xs text-muted-foreground">
              Product and vendor names are trademarks of their respective owners and are used for
              identification only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="label-caps text-muted-foreground">{title}</h2>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="rounded-[4px] text-13 text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
