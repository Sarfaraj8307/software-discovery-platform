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
