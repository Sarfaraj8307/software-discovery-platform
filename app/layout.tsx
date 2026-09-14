import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CompareProvider } from "@/components/compare/CompareProvider";
import { ComparisonBucket } from "@/components/compare/ComparisonBucket";
import { ToastProvider } from "@/components/ui/feedback";
import { TooltipProvider } from "@/components/ui/overlay";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCategoryTree } from "@/lib/data/queries";

/**
 * Inter for everything, JetBrains Mono for numbers that sit in columns.
 * Self-hosted through next/font: no external request on first paint, no layout shift
 * from a late font swap.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono-stack",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://software-discovery.example"),
  title: {
    default: "Software Discovery — compare business software on evidence",
    template: "%s | Software Discovery",
  },
  description:
    "Compare business software on verified reviews, transparent scoring and structured feature data. Independent rankings — vendors cannot pay for placement.",
  applicationName: "Software Discovery",
  robots: { index: true, follow: true },
  // OG/Twitter root fallback (audit E2/E3). Per-route metadata merges with these; pages
  // without their own openGraph/twitter blocks (e.g. compliance pages, the homepage)
  // inherit siteName, locale, default title/description and the template from here.
  //
  // `images` is deliberately omitted: there is no real brand artwork yet (audit E5).
  // `ImageResponse`-generated cards are deferred until the imagery work begins, at which
  // point a single 1200x630 source image should be added here *and* per-route overrides
  // should switch to route-specific artwork.
  openGraph: {
    type: "website",
    siteName: "Software Discovery",
    title: {
      default: "Software Discovery — compare business software on evidence",
      template: "%s | Software Discovery",
    },
    description:
      "Compare business software on verified reviews, transparent scoring and structured feature data. Independent rankings — vendors cannot pay for placement.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: {
      default: "Software Discovery — compare business software on evidence",
      template: "%s | Software Discovery",
    },
    description:
      "Compare business software on verified reviews, transparent scoring and structured feature data. Independent rankings — vendors cannot pay for placement.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { pillars, subcategories } = getCategoryTree();

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col bg-background antialiased">
        <a href="#main" className="sr-only-focusable">
          Skip to main content
        </a>

        {/* No-JS safety: scroll-reveal starts hidden, so force it visible when JS is off.
            (The `@media (scripting: none)` guard in globals.css covers modern browsers too.) */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <TooltipProvider delayDuration={200} skipDelayDuration={300}>
          <ToastProvider>
            <CompareProvider>
              <Header pillars={pillars} categories={subcategories} />
              <div className="flex-1">{children}</div>
              <Footer />
              <ComparisonBucket />
            </CompareProvider>
          </ToastProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
