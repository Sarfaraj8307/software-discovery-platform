import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { PricingPlan } from "@/lib/data/types";
import { NoteLine } from "@/components/domain/atoms";
import { Badge } from "@/components/ui/badge";

/**
 * Pricing plans.
 *
 * Prices are presented as supplied by the vendor, with an explicit disclaimer — the
 * directory does not negotiate or verify commercial terms, and implying otherwise would
 * be misleading. Quote-only tiers are shown rather than hidden, because their absence
 * would misrepresent the entry price.
 */
export function PricingTable({
  plans,
  productName,
  className,
}: {
  plans: PricingPlan[];
  productName: string;
  className?: string;
}) {
  if (plans.length === 0) return null;

  const columns =
    plans.length >= 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : plans.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <div className={className}>
      <div className={`grid gap-3 ${columns}`}>
        {plans.map((plan, index) => {
          const isHighlighted = index === 1 && plans.length > 2;
          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-card border p-4 ${
                isHighlighted
                  ? "border-primary-border bg-primary-subtle/40"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{plan.name}</h3>
                {isHighlighted && (
                  <Badge variant="primary" size="sm" caps>
                    Most common
                  </Badge>
                )}
              </div>

              <p className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-semibold tracking-[-0.02em] tnum">
                  {plan.price === null ? "Custom" : formatPrice(plan.price)}
                </span>
                <span className="text-2xs text-muted-foreground">
                  {plan.price === null ? "quoted" : `/ ${plan.billing === "monthly" ? "mo" : "yr"}`}
                </span>
              </p>

              <ul className="mt-3 flex-1 space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Check className="mt-0.5 size-3 shrink-0 text-success" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-4 inline-flex h-9 items-center justify-center rounded-control text-sm font-medium transition-colors ${
                  isHighlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "border border-border-strong bg-card text-foreground hover:bg-muted"
                }`}
              >
                {plan.ctaLabel}
              </a>
            </div>
          );
        })}
      </div>

      <NoteLine className="mt-3">
        Pricing shown for {productName} is supplied by the vendor or taken from public pricing
        pages and is indicative only. Final pricing depends on seat count, contract length and
        negotiated terms — confirm directly with the vendor before budgeting.
      </NoteLine>
    </div>
  );
}
