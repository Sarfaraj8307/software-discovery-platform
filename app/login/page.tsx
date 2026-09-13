"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/form-controls";
import { BrandLogo, BrandMark } from "@/components/brand/BrandMark";

const TRUST_POINTS = [
  { icon: BadgeCheck, label: "Identity-verified reviews" },
  { icon: TrendingUp, label: "Transparent, evidence-based scoring" },
  { icon: ShieldCheck, label: "Independent — vendors can't buy placement" },
];

export default function LoginPage() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Brand visual panel — only on large screens, where the split reads well. */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-cta p-12 text-white lg:flex">
        <BrandLogo wordmarkClassName="text-white" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">
           Compare business software on the evidence, not the ad budget.
          </h2>
          <p className="mt-3 text-15 leading-relaxed text-white/80">
            Rankings built from verified buyer reviews and structured feature data. Sign in to track
            comparisons, manage your vendor profile, or moderate the directory.
          </p>

          <ul className="mt-8 space-y-3">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-white/90">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-white/15">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} Software Discovery. Independent software comparison.
        </p>

        {/* Quiet watermark so the panel never reads as flat. */}
        <BrandMark className="pointer-events-none absolute -right-10 -bottom-10 size-72 text-white/5" />
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <BrandLogo className="lg:hidden" />

          <h1 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">Sign in</h1>
          <p className="mt-2 text-14 text-muted-foreground">
            Welcome back. Enter your details to continue.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <Field label="Work email" htmlFor="email" required>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
            </Field>

            <Field label="Password" htmlFor="password" required>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-13 text-muted-foreground">
                <Checkbox defaultChecked />
                Remember me
              </label>
              <Link href="/login" className="text-13 font-medium text-primary hover:text-primary-hover">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" block size="lg">
              Sign in
            </Button>
          </form>

          {submitted && (
            <p
              role="status"
              className="mt-4 rounded-control border border-border bg-subtle px-3 py-2.5 text-13 text-muted-foreground"
            >
              This is a demo environment — authentication is not wired up, so no credentials are sent
              anywhere.
            </p>
          )}

          <p className="mt-6 text-center text-13 text-muted-foreground">
            Are you a software vendor?{" "}
            <Link href="/vendor" className="font-medium text-primary hover:text-primary-hover">
              Claim your profile
            </Link>
          </p>
          <p className="mt-2 text-center text-13 text-muted-foreground">
            <Link href="/" className="group inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover">
              Back to the directory
              <ArrowRight className="size-3.5 nudge group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
