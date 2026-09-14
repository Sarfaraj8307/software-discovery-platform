import type { Metadata } from "next";
import { DemoDataNotice } from "@/components/domain/atoms";
import { ReviewSubmissionWizard } from "@/components/reviews/ReviewSubmissionWizard";
import { listProductOptions } from "@/lib/data/repository";

export const metadata: Metadata = {
  title: "Write a review",
  description: "Share your experience with a product. Submitted reviews are reviewed by a moderator before they appear.",
  robots: { index: false, follow: true },
};

export default async function WriteReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const options = listProductOptions();
  const preselectedSlug =
    product && options.some((o) => o.slug === product) ? product : null;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Write a review</h1>
        <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">
          Tell other buyers what it was like to actually use the product. Your review goes into the
          moderation queue and is published once a moderator approves it.
        </p>
      </header>

      <DemoDataNotice variant="banner" className="mb-5" />

      <ReviewSubmissionWizard productOptions={options} preselectedSlug={preselectedSlug} />
    </main>
  );
}
