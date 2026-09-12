import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { StarRating, VerificationBadge } from "@/components/domain/atoms";
import { formatRating } from "@/lib/utils";
import type { Review } from "@/lib/data/types";

/**
 * Buyer-voice card for social-proof bands (homepage). Deliberately lighter than
 * the full `ReviewCard`: a portrait plate, a star rating, and the quote. No
 * pros/cons split, no helpful/report affordances — those belong on the product
 * page where the review lives in context.
 */
export function TestimonialCard({
  review,
  productName,
  productSlug,
}: {
  review: Review;
  productName?: string;
  productSlug?: string;
}) {
  return (
    <figure className="flex h-full flex-col rounded-card border border-border bg-card p-5 shadow-card card-lift">
      <figcaption className="flex items-center gap-3">
        <Avatar name={review.authorName} size="md" />
        <div className="min-w-0">
          <p className="truncate text-13 font-semibold">{review.authorName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {review.authorRole}
            {review.authorCompanySize ? ` · ${review.authorCompanySize}` : ""}
          </p>
        </div>
        <VerificationBadge verification={review.verification} size="sm" className="ml-auto" />
      </figcaption>

      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={review.rating} size={14} />
        <span className="text-2xs font-medium tnum text-muted-foreground">
          {formatRating(review.rating)}
        </span>
      </div>

      <blockquote className="mt-3 flex-1 text-13 leading-relaxed text-muted-foreground">
        &ldquo;{review.body}&rdquo;
      </blockquote>

      {productName && productSlug && (
        <p className="mt-4 border-t border-border pt-3 text-2xs text-muted-foreground">
          on{" "}
          <Link
            href={`/product/${productSlug}`}
            className="font-medium text-foreground transition-colors hover:text-primary"
          >
            {productName}
          </Link>
        </p>
      )}
    </figure>
  );
}
