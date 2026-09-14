"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type Option = { slug: string; name: string };

const VERIFICATION_OPTIONS: { value: string; label: string; hint: string }[] = [
  { value: "VALIDATED", label: "Verified customer", hint: "Identity confirmed by our team" },
  { value: "CURRENT_USER", label: "Logged-in user", hint: "Submitted from an authenticated account" },
  { value: "INCENTIVIZED", label: "Incentivized", hint: "Disclosed on the published review" },
  { value: "GUEST", label: "Guest", hint: "No identity verification — does not count toward the score" },
];

const COMPANY_SIZES: { value: string; label: string }[] = [
  { value: "small", label: "Small (under 50)" },
  { value: "mid", label: "Mid-market (50–999)" },
  { value: "enterprise", label: "Enterprise (1000+)" },
];

const STEPS = ["Your rating", "Your review", "About you"] as const;

/* -------------------------------------------------------------------------- */

function StarInput({
  value,
  onChange,
  label,
  id,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  id: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} id={id} className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} out of 5`}
          onClick={() => onChange(n)}
          className="rounded-md p-1 transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={n <= value ? "text-amber-500" : "text-muted-foreground/40"}
            fill={n <= value ? "currentColor" : "none"}
            size={22}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function ReviewSubmissionWizard({
  productOptions,
  preselectedSlug,
}: {
  productOptions: Option[];
  preselectedSlug: string | null;
}) {
  const [step, setStep] = React.useState(0);
  const [productSlug, setProductSlug] = React.useState(preselectedSlug ?? "");

  const [rating, setRating] = React.useState(0);
  const [ease, setEase] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [support, setSupport] = React.useState(0);
  const [func, setFunc] = React.useState(0);

  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [pros, setPros] = React.useState("");
  const [cons, setCons] = React.useState("");

  const [authorName, setAuthorName] = React.useState("");
  const [authorRole, setAuthorRole] = React.useState("");
  const [companySize, setCompanySize] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [useDuration, setUseDuration] = React.useState("");
  const [verification, setVerification] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedId, setSubmittedId] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Picking an overall rating also seeds the four dimensions, so they are never left at 0.
  function setOverall(n: number) {
    setRating(n);
    setEase((d) => (d === 0 || d === rating ? n : d));
    setValue((d) => (d === 0 || d === rating ? n : d));
    setSupport((d) => (d === 0 || d === rating ? n : d));
    setFunc((d) => (d === 0 || d === rating ? n : d));
  }

  function validateStep(s: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!productSlug) e.productSlug = "Choose a product";
      if (rating < 1) e.rating = "Add an overall rating";
      if (ease < 1) e.easeRating = "Rate ease of use";
      if (value < 1) e.valueRating = "Rate value";
      if (support < 1) e.supportRating = "Rate support";
      if (func < 1) e.functionalityRating = "Rate functionality";
    }
    if (s === 1) {
      if (title.trim().length < 4) e.title = "Give your review a short title";
      if (body.trim().length < 20) e.body = "Please write at least a sentence about your experience";
    }
    if (s === 2) {
      if (authorName.trim().length < 2) e.authorName = "Please enter your name";
      if (!companySize) e.authorCompanySize = "Select your company size";
      if (!verification) e.verification = "Choose how you're verified";
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(2, s + 1));
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const all = { ...validateStep(0), ...validateStep(1), ...validateStep(2) };
    if (Object.keys(all).length) {
      setErrors(all);
      const firstBad = [0, 1, 2].find((s) => Object.keys(validateStep(s)).length) ?? 0;
      setStep(firstBad);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          authorName,
          authorRole,
          authorCompanySize: companySize,
          authorIndustry: industry,
          useDuration,
          rating,
          easeRating: ease,
          valueRating: value,
          supportRating: support,
          functionalityRating: func,
          title,
          body,
          pros,
          cons,
          verification,
        }),
      });

      if (res.status === 201) {
        const data: unknown = await res.json().catch(() => null);
        const id = data && typeof data === "object" && "id" in data ? String((data as { id: unknown }).id) : null;
        setSubmittedId(id);
        setSubmitting(false);
        return;
      }

      if (res.status === 422) {
        const data: unknown = await res.json().catch(() => null);
        const serverErrors =
          data && typeof data === "object" && "errors" in data
            ? (data as { errors: Record<string, string> }).errors
            : {};
        setErrors(serverErrors);
        const firstBad = [0, 1, 2].find((s) => {
          const stepErrors = validateStep(s);
          return Object.keys(stepErrors).some((k) => k in serverErrors);
        });
        if (firstBad !== undefined) setStep(firstBad);
        setSubmitting(false);
        return;
      }

      const data: unknown = await res.json().catch(() => null);
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message: unknown }).message)
          : "We could not submit your review. Please try again.";
      setServerError(message);
      setSubmitting(false);
    } catch {
      setServerError("We could not reach the server. Your review was not saved.");
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <div className="rounded-card border border-success-border bg-success-subtle p-6 text-center">
        <h2 className="text-lg font-semibold text-success">Thanks — your review is in the queue</h2>
        <p className="mt-2 text-13 leading-relaxed text-muted-foreground">
          Submitted reviews are reviewed by a moderator before they appear on the product page.
          You&rsquo;ll see it once it&rsquo;s approved. Reference: <code className="text-12">{submittedId}</code>.
        </p>
      </div>
    );
  }

  const selectedProductName =
    productOptions.find((o) => o.slug === productSlug)?.name ?? null;

  return (
    <form onSubmit={submit} className="rounded-card border border-border bg-card p-5">
      {/* step indicator */}
      <ol className="mb-5 flex items-center gap-2 text-2xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={
                "inline-flex size-5 items-center justify-center rounded-full text-2xs font-semibold " +
                (i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-success text-success-foreground"
                    : "bg-subtle text-muted-foreground")
              }
            >
              {i + 1}
            </span>
            <span className={i === step ? "font-medium text-foreground" : "text-muted-foreground"}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
          </li>
        ))}
      </ol>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="mb-4 rounded-control border border-destructive/40 bg-destructive/5 px-3 py-2 text-2xs text-destructive">
          Please fix the highlighted fields before continuing.
        </p>
      )}

      {/* STEP 0 — rating */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <span className="label-caps text-muted-foreground">Product</span>
            {preselectedSlug && selectedProductName ? (
              <p className="mt-1.5 text-13 font-medium text-foreground">{selectedProductName}</p>
            ) : (
              <select
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
                aria-label="Product you are reviewing"
                aria-invalid={Boolean(errors.productSlug)}
                className="mt-1.5 w-full rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground disabled:opacity-60"
              >
                <option value="">Select a product…</option>
                {productOptions.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </select>
            )}
            {errors.productSlug && <p className="mt-1 text-2xs text-destructive">{errors.productSlug}</p>}
          </div>

          <div>
            <span className="label-caps text-muted-foreground">Overall rating</span>
            <div className="mt-1.5">
              <StarInput id="rating" label="Overall rating out of 5" value={rating} onChange={setOverall} />
            </div>
            {errors.rating && <p className="mt-1 text-2xs text-destructive">{errors.rating}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { id: "easeRating", label: "Ease of use", v: ease, set: setEase },
              { id: "valueRating", label: "Value for money", v: value, set: setValue },
              { id: "supportRating", label: "Support", v: support, set: setSupport },
              { id: "functionalityRating", label: "Functionality", v: func, set: setFunc },
            ].map((d) => (
              <div key={d.id}>
                <span className="label-caps text-muted-foreground">{d.label}</span>
                <div className="mt-1.5">
                  <StarInput id={d.id} label={`${d.label} out of 5`} value={d.v} onChange={d.set} />
                </div>
                {errors[d.id] && <p className="mt-1 text-2xs text-destructive">{errors[d.id]}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 — written review */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="rv-title" className="label-caps text-muted-foreground">
              Title
            </label>
            <input
              id="rv-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={160}
              aria-invalid={Boolean(errors.title)}
              placeholder="Summarise your experience in a few words"
              className="mt-1.5 w-full rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground disabled:opacity-60"
            />
            {errors.title && <p className="mt-1 text-2xs text-destructive">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="rv-body" className="label-caps text-muted-foreground">
              Your review
            </label>
            <textarea
              id="rv-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              maxLength={4000}
              aria-invalid={Boolean(errors.body)}
              placeholder="What worked, what didn't, and who it's right for."
              className="mt-1.5 w-full resize-y rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 leading-relaxed text-foreground disabled:opacity-60"
            />
            <p className="mt-1 text-2xs tnum text-muted-foreground">{4000 - body.length} characters remaining</p>
            {errors.body && <p className="mt-1 text-2xs text-destructive">{errors.body}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rv-pros" className="label-caps text-muted-foreground">
                What you liked (optional)
              </label>
              <textarea
                id="rv-pros"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="e.g. Fast onboarding"
                className="mt-1.5 w-full resize-y rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground"
              />
            </div>
            <div>
              <label htmlFor="rv-cons" className="label-caps text-muted-foreground">
                What to watch for (optional)
              </label>
              <textarea
                id="rv-cons"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="e.g. Pricing jumps at scale"
                className="mt-1.5 w-full resize-y rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — about you */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rv-name" className="label-caps text-muted-foreground">
                Your name
              </label>
              <input
                id="rv-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={120}
                aria-invalid={Boolean(errors.authorName)}
                placeholder="Jane Doe"
                className="mt-1.5 w-full rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground"
              />
              {errors.authorName && <p className="mt-1 text-2xs text-destructive">{errors.authorName}</p>}
            </div>
            <div>
              <label htmlFor="rv-role" className="label-caps text-muted-foreground">
                Role (optional)
              </label>
              <input
                id="rv-role"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                maxLength={120}
                placeholder="e.g. IT Manager"
                className="mt-1.5 w-full rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground"
              />
            </div>
            <div>
              <label htmlFor="rv-size" className="label-caps text-muted-foreground">
                Company size
              </label>
              <select
                id="rv-size"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                aria-invalid={Boolean(errors.authorCompanySize)}
                className="mt-1.5 w-full rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground"
              >
                <option value="">Select…</option>
                {COMPANY_SIZES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.authorCompanySize && (
                <p className="mt-1 text-2xs text-destructive">{errors.authorCompanySize}</p>
              )}
            </div>
            <div>
              <label htmlFor="rv-industry" className="label-caps text-muted-foreground">
                Industry (optional)
              </label>
              <input
                id="rv-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                maxLength={120}
                placeholder="e.g. Fintech"
                className="mt-1.5 w-full rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground"
              />
            </div>
            <div>
              <label htmlFor="rv-duration" className="label-caps text-muted-foreground">
                Time using it (optional)
              </label>
              <input
                id="rv-duration"
                value={useDuration}
                onChange={(e) => setUseDuration(e.target.value)}
                maxLength={80}
                placeholder="e.g. 8 months"
                className="mt-1.5 w-full rounded-[7px] border border-border bg-card px-2.5 py-2 text-13 text-foreground"
              />
            </div>
          </div>

          <fieldset>
            <legend className="label-caps text-muted-foreground">How are you verified?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {VERIFICATION_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={
                    "flex cursor-pointer items-start gap-2 rounded-[7px] border px-3 py-2 text-13 " +
                    (verification === opt.value
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-foreground")
                  }
                >
                  <input
                    type="radio"
                    name="verification"
                    value={opt.value}
                    checked={verification === opt.value}
                    onChange={() => setVerification(opt.value)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-medium">{opt.label}</span>
                    <span className="block text-2xs text-muted-foreground">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.verification && <p className="mt-1 text-2xs text-destructive">{errors.verification}</p>}
          </fieldset>
        </div>
      )}

      {serverError && (
        <p role="alert" className="mt-4 text-2xs text-destructive">
          {serverError}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="outline" size="sm" onClick={back} disabled={submitting}>
            Back
          </Button>
        ) : (
          <span />
        )}

        {step < 2 ? (
          <Button type="button" size="sm" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit review"}
          </Button>
        )}
      </div>
    </form>
  );
}
