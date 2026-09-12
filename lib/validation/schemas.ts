import { z } from "zod";

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
