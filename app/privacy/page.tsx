import type { Metadata } from "next";
import Link from "next/link";
import { monthYear } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/navigation";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What data this directory collects, why it collects it, how long it is kept, and the choices available to you.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const updated = monthYear("2026-09-12");

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />

      <header className="mt-4">
        <p className="label-caps text-muted-foreground">Legal</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Privacy policy</h1>
        <p className="mt-2 text-2xs text-muted-foreground">Last updated {updated}.</p>
      </header>

      <div className="mt-8 space-y-8 text-13 leading-relaxed">
        <section aria-labelledby="collect">
          <h2 id="collect" className="text-base font-semibold tracking-[-0.01em]">
            What we collect
          </h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">Enquiry details.</span> When you submit
                a contact or pricing request we collect the name, work email, and optionally the
                company, phone number and message you provide, together with the product or category
                the enquiry relates to. This is the only data we collect that identifies you.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">Comparison selection.</span> The
                products you add to a comparison are stored in your own browser’s local storage. They
                are never transmitted to us.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">Aggregate usage.</span> Page views and
                search terms, aggregated and not tied to an individual. We use this to decide which
                categories to expand.
              </span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="why">
          <h2 id="why" className="text-base font-semibold tracking-[-0.01em]">
            Why we collect it
          </h2>
          <p className="mt-3 text-muted-foreground">
            Enquiry details are used for one purpose: routing your request to the vendor or vendors
            you asked about, so they can respond. Aggregate usage informs editorial priorities.
            Comparison selections exist only to make the comparison feature work in your browser.
          </p>
        </section>

        <section aria-labelledby="sharing">
          <h2 id="sharing" className="text-base font-semibold tracking-[-0.01em]">
            Who we share it with
          </h2>
          <p className="mt-3 text-muted-foreground">
            When you submit an enquiry about a specific product, the details you entered are passed
            to that vendor so they can respond. We do not sell contact data, and we do not share it
            with vendors you did not enquire about.
          </p>
        </section>

        <section aria-labelledby="retention">
          <h2 id="retention" className="text-base font-semibold tracking-[-0.01em]">
            How long we keep it
          </h2>
          <p className="mt-3 text-muted-foreground">
            Enquiry records are retained for 24 months, after which they are deleted. You can request
            earlier deletion at any time — see your choices below.
          </p>
        </section>

        <section aria-labelledby="choices">
          <h2 id="choices" className="text-base font-semibold tracking-[-0.01em]">
            Your choices
          </h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
              <span>
                Request a copy of the enquiry data we hold about you, or ask us to delete it. Both
                requests are honoured within 30 days.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-primary" aria-hidden="true" />
              <span>
                Clear your comparison selection at any time from the comparison bar, or by clearing
                site data in your browser.
              </span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies" className="text-base font-semibold tracking-[-0.01em]">
            Cookies and local storage
          </h2>
          <p className="mt-3 text-muted-foreground">
            We use browser local storage for one thing: remembering which products you added to a
            comparison. We do not set advertising cookies or run cross-site trackers. Because no
            personal data is stored in local storage, clearing it has no effect on your account or
            enquiries.
          </p>
        </section>

        <section aria-labelledby="demo">
          <h2 id="demo" className="text-base font-semibold tracking-[-0.01em]">
            About this deployment
          </h2>
          <p className="mt-3 text-muted-foreground">
            This instance of the directory runs on a synthetic demonstration dataset. Product and
            vendor names are real and used descriptively, but ratings, review counts and prices are
            generated. Enquiries submitted here are recorded in memory on the server and are not
            forwarded to any vendor.
          </p>
        </section>
      </div>

      <footer className="mt-12 border-t border-border pt-6">
        <p className="text-13 text-muted-foreground">
          See also our{" "}
          <Link href="/terms" className="text-primary underline-offset-2 hover:underline">
            terms of use
          </Link>{" "}
          and the{" "}
          <Link href="/methodology" className="text-primary underline-offset-2 hover:underline">
            ranking methodology
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
