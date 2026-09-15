import { Building2, Clock, CornerDownRight, ThumbsDown, ThumbsUp } from "lucide-react";
import { formatDate, relativeDate } from "@/lib/utils";
import type { Review } from "@/lib/data/types";
import { Avatar } from "@/components/ui/avatar";
import { StarRating, VerificationBadge } from "@/components/domain/atoms";
import { HelpfulButton } from "./HelpfulButton";

const SIZE_LABELS: Record<string, string> = {
  small: "1–50 employees",
  mid: "51–1,000 employees",
  enterprise: "1,000+ employees",
};

/**
 * Review card.
 *
 * Verification badges sit at the top of the card, not in a footer: a reader should know
 * how much weight to give a review before reading it, not after. Negative content is
 * never hidden or edited.
 *
 * `displayHelpfulCount` and `hasVotedHelpful` come from the page that renders the card,
 * which reads the `helpful_voter` cookie server-side and looks up the user's vote in
 * the `helpfulVotes` map (lib/data/repository.ts). The button itself stays a pure
 * client component; the only "is the user a voter" question is answered upstream.
 */
export function ReviewCard({
  review,
  displayHelpfulCount,
  hasVotedHelpful,
  className,
}: {
  review: Review;
  displayHelpfulCount: number;
  hasVotedHelpful: boolean;
  className?: string;
}) {
  return (
    <article
      // Stable per-review anchor. A review is a linkable entity — a vendor quoting one in
      // a dispute, or a buyer sharing one, needs a URL that lands on it rather than on the
      // top of a five-per-page list whose ordering changes as new reviews arrive.
      id={`review-${review.id}`}
      className={
        className ??
        "rounded-card border border-border bg-card p-4 shadow-card"
      }
    >
      {/* ------------------------------------------------------------ header */}
      <header className="flex flex-wrap items-start gap-3">
        <Avatar name={review.authorName} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-13 font-semibold">{review.authorName}</p>
            <VerificationBadge verification={review.verification} />
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {review.authorRole}
          </p>

          <ul className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-faint">
            <li className="inline-flex items-center gap-1">
              <Building2 className="size-3" aria-hidden="true" />
              {SIZE_LABELS[review.authorCompanySize] ?? review.authorCompanySize}
            </li>
            <li className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              Used for {review.useDuration}
            </li>
            <li>{review.authorIndustry}</li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <StarRating rating={review.rating} size={14} />
          <time dateTime={review.createdAt} className="text-2xs text-faint">
            {relativeDate(review.createdAt)}
          </time>
        </div>
      </header>

      {/* -------------------------------------------------------------- body */}
      <div className="mt-3.5">
        <h3 className="text-sm font-semibold tracking-[-0.01em]">{review.title}</h3>
        <p className="mt-1.5 text-13 leading-relaxed text-muted-foreground">{review.body}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-[6px] border border-success-border bg-success-subtle p-2.5">
            <p className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.06em] text-success">
              <ThumbsUp className="size-3" aria-hidden="true" />
              What they liked
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{review.pros}</p>
          </div>
          <div className="rounded-[6px] border border-border bg-subtle p-2.5">
            <p className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              <ThumbsDown className="size-3" aria-hidden="true" />
              What they disliked
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{review.cons}</p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- vendor response */}
      {review.vendorResponse && (
        <div className="mt-3 rounded-[6px] border-l-2 border-primary bg-primary-subtle/50 p-3">
          <p className="inline-flex items-center gap-1.5 text-2xs font-semibold text-primary">
            <CornerDownRight className="size-3" aria-hidden="true" />
            Vendor response
            <span className="font-normal text-faint">
              · {formatDate(review.vendorResponse.respondedAt)}
            </span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {review.vendorResponse.body}
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------ footer */}
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <HelpfulButton
            reviewId={review.id}
            initialCount={displayHelpfulCount}
            initialHasVoted={hasVotedHelpful}
          />
          <button
            type="button"
            className="rounded-control px-2 py-1.5 text-2xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Report
          </button>
        </div>
        <p className="text-2xs text-faint">Source: {review.source}</p>
      </footer>
    </article>
  );
}
