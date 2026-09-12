"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { leadSchema, toFieldErrors, type FieldErrors } from "@/lib/validation/schemas";
import type { LeadType } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form-controls";
import { Alert } from "@/components/ui/feedback";
import { NoteLine } from "@/components/domain/atoms";

const INTENTS = [
  "Replacing an existing tool",
  "Searching for options",
  "Browsing the category",
];

/**
 * Lead capture.
 *
 * Ambient by design — a sticky rail on product pages and an inline strip on comparison
 * pages. No popups, no exit-intent overlays. The buyer decides when to make contact,
 * and the microcopy states plainly what happens to their data.
 */
export function LeadForm({
  type = "GET_PRICING",
  productSlug,
  productName,
  categorySlug,
  sourceLocation,
  variant = "rail",
  className,
}: {
  type?: LeadType;
  productSlug?: string;
  productName?: string;
  categorySlug?: string;
  sourceLocation: string;
  variant?: "rail" | "inline" | "compare";
  className?: string;
}) {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [intent, setIntent] = React.useState<string>(INTENTS[1]);

  const isCompact = variant === "inline" || variant === "compare";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const formData = new FormData(event.currentTarget);
    const raw = {
      type,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      intent,
      productSlug: productSlug ?? "",
      categorySlug: categorySlug ?? "",
      sourceLocation,
    };

    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      // Move focus to the first invalid field so keyboard users are not stranded.
      const firstKey = Object.keys(toFieldErrors(parsed.error))[0];
      if (firstKey) {
        const el = event.currentTarget.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        el?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "We could not send your request.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again in a moment.",
      );
    }
  };

  /* ------------------------------------------------------------- success */
  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-card border border-success-border bg-success-subtle p-4",
          className,
        )}
      >
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Request received</p>
            <p className="mt-1 text-13 leading-relaxed text-muted-foreground">
              {productName
                ? `We have passed your details to ${productName}. Expect a response within one business day.`
                : "We have your details. Expect a response within one business day."}
            </p>
            <p className="mt-2 text-2xs text-faint">
              Reference {sourceLocation} · Demonstration build, no email was actually sent.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)} noValidate>
      <div className={cn("grid gap-3", isCompact && "sm:grid-cols-2")}>
        <Field label="Full name" htmlFor={`${sourceLocation}-name`} required error={errors.name}>
          <Input
            id={`${sourceLocation}-name`}
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            placeholder="Alex Morgan"
          />
        </Field>

        <Field
          label="Work email"
          htmlFor={`${sourceLocation}-email`}
          required
          error={errors.email}
        >
          <Input
            id={`${sourceLocation}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            placeholder="alex@company.com"
          />
        </Field>

        <Field label="Company" htmlFor={`${sourceLocation}-company`} required error={errors.company}>
          <Input
            id={`${sourceLocation}-company`}
            name="company"
            autoComplete="organization"
            placeholder="Company name"
          />
        </Field>

        {!isCompact && (
          <Field label="Phone" htmlFor={`${sourceLocation}-phone`} error={errors.phone}>
            <Input
              id={`${sourceLocation}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 000 0000"
            />
          </Field>
        )}
      </div>

      <div className="space-y-1.5">
        <span className="block text-13 font-medium">What are you doing?</span>
        <Select value={intent} onValueChange={setIntent}>
          <SelectTrigger className="w-full" label="Purchase intent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[260px]">
            {INTENTS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isCompact && (
        <Field label="Anything specific?" htmlFor={`${sourceLocation}-message`} error={errors.message}>
          <Textarea
            id={`${sourceLocation}-message`}
            name="message"
            rows={3}
            placeholder="Team size, timeline, must-have integrations…"
          />
        </Field>
      )}

      {serverError && <Alert tone="error" title="Could not send">{serverError}</Alert>}

      <Button type="submit" block disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            {type === "REQUEST_DEMO" ? "Request a demo" : "Get pricing"}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </>
        )}
      </Button>

      <NoteLine>
        Free, no spam. Response within one business day. Your details are shared only with the
        vendor you selected — see our{" "}
        <a href="/privacy" className="text-primary underline-offset-2 hover:underline">
          privacy policy
        </a>
        .
      </NoteLine>
    </form>
  );
}
