import { z } from "zod";
import { LEAD_STATUSES } from "@/lib/data/types";

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
