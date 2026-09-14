import { z } from "zod";
import { DEMO_OWNER_IDS, LEAD_STATUSES } from "@/lib/data/types";

/**
 * Shared validation. Imported by both the client form and the API route, so a field
 * can never be enforced in one place and not the other.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LEAD_TYPES = [
  "GET_PRICING",
  "REQUEST_DEMO",
  "EXPERT_RECOMMENDATION",
  "VISIT_WEBSITE",
  "COMPARISON_EMAIL",
] as const;

export const leadSchema = z.object({
  type: z.enum(LEAD_TYPES),
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "That name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "A work email is required")
    .max(200, "That email is too long")
    .regex(EMAIL_PATTERN, "Enter a valid email address"),
  company: z.string().trim().max(160, "That company name is too long").optional().or(z.literal("")),
  phone: z.string().trim().max(40, "That phone number is too long").optional().or(z.literal("")),
  message: z.string().trim().max(2000, "Please keep this under 2,000 characters").optional().or(z.literal("")),
  intent: z.string().trim().max(80).optional().or(z.literal("")),
  productSlug: z.string().trim().max(200).optional().or(z.literal("")),
  categorySlug: z.string().trim().max(200).optional().or(z.literal("")),
  sourceLocation: z.string().trim().min(1).max(80),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** PATCH body for an enquiry's status. The status list itself lives in `types.ts`. */
export const leadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

/**
 * Owner is a demo-roster id (see `DEMO_OWNER_IDS` in types.ts) or the literal `null` for
 * unassign. The `null` is encoded with `.nullable()` because a missing key is the same as
 * "do not change the owner" — the PATCH route only updates the fields the body supplies.
 */
export const leadOwnerIdSchema = z.union([
  z.enum(DEMO_OWNER_IDS),
  z.null(),
]);

/**
 * PATCH body that may update status, owner, or both. At least one must be present so a
 * PATCH cannot succeed without changing anything — that would be a green button that does
 * nothing, exactly the trap the validation is here to prevent. `.strict()` rejects any
 * field that is not `status` or `ownerId`, so a typo like `{"statuz": ...}` returns 422
 * rather than a silent no-op.
 */
export const leadUpdateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    ownerId: leadOwnerIdSchema.optional(),
  })
  .strict()
  .refine((value) => value.status !== undefined || value.ownerId !== undefined, {
    message: "Supply `status` and/or `ownerId`.",
  });

/**
 * A vendor's public reply. Bounded on both ends: a one-word reply is not a response, and
 * this is a reply shown beside the review rather than a blog post.
 */
export const vendorResponseSchema = z.object({
  body: z
    .string()
    .trim()
    .min(20, "Please write at least a sentence — replies this short read as dismissive")
    .max(1200, "Replies are capped at 1,200 characters"),
});

export const MODERATION_ACTIONS = ["APPROVE", "REJECT", "FLAG"] as const;

/**
 * Vendor-proposed listing copy. Deliberately excludes every score input — see `ListingEdit`
 * in types.ts. Both fields are bounded; a tagline is not a description and a description is
 * not a documentation page.
 */
export const listingEditSchema = z.object({
  tagline: z
    .string()
    .trim()
    .min(10, "Give the tagline at least a few words")
    .max(120, "Taglines are capped at 120 characters"),
  shortDescription: z
    .string()
    .trim()
    .min(40, "Please describe the product in a sentence or two")
    .max(400, "Descriptions are capped at 400 characters"),
});

export const LISTING_EDIT_DECISIONS = ["APPLY", "DISCARD"] as const;

export const listingEditDecisionSchema = z.object({
  id: z.string().trim().min(1).max(120),
  decision: z.enum(LISTING_EDIT_DECISIONS),
});

/**
 * Moderation is a state transition on an existing record, not a free-form write, so the
 * schema pins both the target and the action to enums. `note` is captured but optional —
 * a rejection with no stated reason is exactly the case the audit log exists to expose.
 */
export const moderationDecisionSchema = z.object({
  targetType: z.enum(["review", "product"]),
  targetId: z.string().trim().min(1).max(200),
  action: z.enum(MODERATION_ACTIONS),
  note: z.string().trim().max(500, "Please keep the note under 500 characters").optional().or(z.literal("")),
});

export type ModerationDecisionInput = z.infer<typeof moderationDecisionSchema>;

/** Field-level errors keyed by field name, ready to spread into the form. */
export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) {
      out[key as keyof LeadInput] = issue.message;
    }
  }
  return out;
}

/* ==========================================================================
   SEARCH
   ========================================================================= */

export const searchQuerySchema = z.object({
  q: z.string().trim().max(120).optional().default(""),
});

/* ==========================================================================
   REVIEW SUBMISSION
   ========================================================================= */

export const VERIFICATION_LABELS = ["VALIDATED", "CURRENT_USER", "INCENTIVIZED", "GUEST"] as const;

export const COMPANY_SIZES = ["small", "mid", "enterprise"] as const;

/**
 * Public review-submission payload. Mirrors `ReviewSubmissionInput` in types.ts field-for-field;
 * `submitReview` owns the fields a client must never supply (id, status, helpfulCount,
 * vendorResponse, createdAt). Ratings are coerced so the form can send strings or numbers.
 */
export const reviewSubmissionSchema = z.object({
  productSlug: z.string().trim().min(1, "Choose a product").max(200),
  authorName: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(120, "That name is too long"),
  authorRole: z.string().trim().max(120).optional().or(z.literal("")),
  authorCompanySize: z.enum(COMPANY_SIZES),
  authorIndustry: z.string().trim().max(120).optional().or(z.literal("")),
  useDuration: z.string().trim().max(80).optional().or(z.literal("")),
  rating: z.coerce.number().min(1, "Add an overall rating").max(5),
  easeRating: z.coerce.number().min(1).max(5),
  valueRating: z.coerce.number().min(1).max(5),
  supportRating: z.coerce.number().min(1).max(5),
  functionalityRating: z.coerce.number().min(1).max(5),
  title: z
    .string()
    .trim()
    .min(4, "Give your review a short title")
    .max(160, "Titles are capped at 160 characters"),
  body: z
    .string()
    .trim()
    .min(20, "Please write at least a sentence about your experience")
    .max(4000, "Reviews are capped at 4,000 characters"),
  pros: z.string().trim().max(500, "Keep this under 500 characters").optional().or(z.literal("")),
  cons: z.string().trim().max(500, "Keep this under 500 characters").optional().or(z.literal("")),
  verification: z.enum(VERIFICATION_LABELS),
  source: z.string().trim().max(80).optional().or(z.literal("")),
});

export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;

/**
 * Generic field-error extractor for any ZodError. The leads route keeps `toFieldErrors`
 * typed to LeadInput; this serves the review form (and any future schema) without coupling
 * the helper to one input type.
 */
export function toFieldErrorsGeneric(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) out[key] = issue.message;
  }
  return out;
}
