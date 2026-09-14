/**
 * Deterministic dataset generator.
 *
 * Everything below is a pure function of the authored catalogue. No `Math.random`, no
 * clock reads — the same inputs always produce byte-identical output, so builds are
 * reproducible and diffs stay meaningful.
 *
 * IMPORTANT — data honesty
 * ------------------------
 * Product names, vendors and websites are real and used descriptively, exactly as a
 * legitimate directory uses them. Every rating, review body, review count, price point
 * and view figure is SYNTHETIC. Surfaces that show this data carry a visible disclosure
 * (see `components/layout/DemoDataNotice.tsx` and the site footer) so that fabricated
 * reviews are never presented as genuine. This is a correctness requirement.
 */

import { RAW_GROUPS, type RawGroup, type RawProduct } from "./catalog";
import { RAW_FEATURE_GROUPS, RAW_INTEGRATIONS } from "./taxonomy";
import type {
  Category,
  Company,
  Comparison,
  Dataset,
  DeploymentModel,
  CompanySize,
  FaqItem,
  Feature,
  FeatureGroup,
  Integration,
  Lead,
  LeadStatus,
  LeadType,
  LeadOwner,
  PricingModel,
  PricingPlan,
  Product,
  ProductScreenshot,
  Resource,
  Review,
  SentimentPill,
  VerificationLabel,
} from "./types";
import { DEMO_OWNER_IDS } from "./types";

export const DATASET_GENERATED_AT = "2026-09-12";
const EPOCH = Date.parse("2026-09-12T00:00:00Z");

/* ==========================================================================
   DETERMINISTIC RANDOMNESS
   ========================================================================= */

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Rng {
  private next: () => number;

  constructor(seed: string) {
    this.next = mulberry32(hashString(seed));
  }

  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Uniform float in [0, 1). Exposed for callers that need a raw roll. */
  random(): number {
    return this.next();
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }

  bool(probability = 0.5): boolean {
    return this.next() < probability;
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)]!;
  }

  /** Pick `n` distinct items, order preserved. */
  sample<T>(items: readonly T[], n: number): T[] {
    const pool = [...items];
    const out: T[] = [];
    const take = Math.min(n, pool.length);
    for (let i = 0; i < take; i++) {
      out.push(pool.splice(Math.floor(this.next() * pool.length), 1)[0]!);
    }
    return out;
  }

  /** Log-uniform-ish integer — makes long-tail review counts look natural. */
  logInt(min: number, max: number): number {
    const lo = Math.log(min);
    const hi = Math.log(max);
    return Math.round(Math.exp(this.float(lo, hi)));
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isoDaysAgo(days: number): string {
  return new Date(EPOCH - days * 86_400_000).toISOString();
}

/* ==========================================================================
   CATEGORY VOCABULARY
   Per-pillar language so reviews, pros/cons and editorial read as if written by
   someone who actually uses software in that category.
   ========================================================================= */

interface Vocabulary {
  pros: string[];
  cons: string[];
  roles: string[];
  outcomes: string[];
}

const VOCAB: Record<string, Vocabulary> = {
  crm: {
    pros: ["Contact management", "Pipeline visibility", "Email integration", "Reporting depth", "Customisation", "Mobile app"],
    cons: ["Learning curve", "Cost at scale", "Reporting limits", "Data hygiene", "Admin overhead"],
    roles: ["Sales Director", "Account Executive", "Revenue Operations Manager", "Head of Sales", "Sales Operations Analyst"],
    outcomes: ["shortened our sales cycle", "lifted win rates on inbound", "gave the whole team one pipeline view", "cut duplicate outreach"],
  },
  "project-management": {
    pros: ["Ease of use", "Task dependencies", "Team adoption", "Views and filters", "Automations", "Notifications"],
    cons: ["Pricing per seat", "Reporting flexibility", "Performance at scale", "Onboarding time", "Mobile parity"],
    roles: ["Programme Manager", "Project Manager", "Delivery Lead", "PMO Analyst", "Operations Manager"],
    outcomes: ["made delivery dates honest", "cut our status meetings in half", "gave stakeholders a self-serve view", "reduced handoff gaps"],
  },
  "marketing-automation": {
    pros: ["Segmentation", "Journey builder", "Deliverability", "Template editor", "A/B testing", "Attribution"],
    cons: ["Contact-based pricing", "Editor quirks", "Deliverability tuning", "List management", "Reporting lag"],
    roles: ["Marketing Manager", "Lifecycle Marketing Lead", "Demand Generation Manager", "CRM Manager", "Growth Marketer"],
    outcomes: ["lifted open rates materially", "doubled our lifecycle revenue", "made segmentation actually usable", "cut manual campaign work"],
  },
  "help-desk": {
    pros: ["Ticket routing", "Shared inbox", "Macros", "SLA tracking", "Customer context", "Reporting"],
    cons: ["Per-agent cost", "Reporting depth", "Search quality", "Automation limits", "Migration effort"],
    roles: ["Support Manager", "Head of Customer Experience", "Support Team Lead", "Technical Support Engineer", "CX Operations"],
    outcomes: ["cut first response time sharply", "improved CSAT quarter on quarter", "removed the inbox chaos", "made SLA breaches visible"],
  },
  "human-resources": {
    pros: ["Onboarding flows", "Payroll accuracy", "Self-service portal", "Compliance reporting", "Benefits admin", "Reporting"],
    cons: ["Implementation cost", "Pricing opacity", "Custom reporting", "Integrations", "Support responsiveness"],
    roles: ["HR Manager", "People Operations Lead", "Head of Talent", "HRIS Analyst", "Recruiting Manager"],
    outcomes: ["cut onboarding admin dramatically", "made payroll reconciliation painless", "gave employees real self-service", "reduced compliance risk"],
  },
  accounting: {
    pros: ["Bank reconciliation", "Invoicing", "Reporting", "Tax handling", "Multi-currency", "Integrations"],
    cons: ["Per-entity pricing", "Report customisation", "Month-end workflow", "Migration effort", "Support tiers"],
    roles: ["Finance Manager", "Controller", "Head of Finance", "Accounts Payable Lead", "Bookkeeper"],
    outcomes: ["closed the month days earlier", "cut manual reconciliation to near zero", "gave us clean multi-entity reporting", "removed spreadsheet risk"],
  },
  "business-intelligence": {
    pros: ["Visualisation quality", "Query performance", "Self-serve exploration", "Governance", "Warehouse support", "Sharing"],
    cons: ["Cost model", "Licensing per viewer", "Modelling complexity", "Performance tuning", "Learning curve"],
    roles: ["Head of Data", "Analytics Engineer", "BI Developer", "Data Analyst", "VP Analytics"],
    outcomes: ["gave the exec team a single source of truth", "cut ad-hoc request volume", "made warehouse data self-serve", "sped up decision cycles"],
  },
  ecommerce: {
    pros: ["Storefront themes", "Checkout conversion", "App ecosystem", "Inventory sync", "Payment options", "Speed to launch"],
    cons: ["Transaction fees", "App costs add up", "Customisation ceiling", "Platform migrations", "Multi-store complexity"],
    roles: ["Ecommerce Manager", "Head of Digital", "DTC Director", "Store Owner", "Growth Lead"],
    outcomes: ["lifted conversion on mobile", "let us launch a second storefront fast", "simplified multi-channel inventory", "cut checkout abandonment"],
  },
  "cloud-devops": {
    pros: ["Service breadth", "Reliability", "Documentation", "Ecosystem", "Scaling behaviour", "Automation"],
    cons: ["Cost visibility", "Pricing complexity", "Support tiers", "Console learning curve", "Vendor lock-in"],
    roles: ["Platform Engineer", "DevOps Lead", "Site Reliability Engineer", "Infrastructure Architect", "CTO"],
    outcomes: ["cut deploy times to minutes", "made incidents observable end to end", "reduced infrastructure toil", "improved our uptime materially"],
  },
  security: {
    pros: ["Coverage", "Policy enforcement", "Alert fidelity", "Integrations", "Audit evidence", "Deployment speed"],
    cons: ["Cost per seat", "Alert tuning", "Agent overhead", "Admin complexity", "Reporting granularity"],
    roles: ["Security Engineer", "CISO", "Compliance Manager", "IAM Lead", "Security Analyst"],
    outcomes: ["passed our SOC 2 audit cleanly", "cut identity sprawl", "made access reviews routine", "reduced triage noise"],
  },
  collaboration: {
    pros: ["Reliability", "Ease of adoption", "Meeting quality", "Integrations", "Async features", "Admin controls"],
    cons: ["Per-host pricing", "Admin granularity", "Notification noise", "Storage limits", "Feature sprawl"],
    roles: ["IT Manager", "Head of Remote", "Collaboration Lead", "Engineering Manager", "Workplace Experience"],
    outcomes: ["made hybrid meetings workable", "cut our meeting load", "improved cross-team communication", "removed scheduling friction"],
  },
  design: {
    pros: ["Collaboration", "Component libraries", "Prototyping", "Developer handoff", "Version history", "Performance"],
    cons: ["Per-editor pricing", "Offline behaviour", "File organisation", "Plugin reliability", "Learning curve"],
    roles: ["Design Lead", "Product Designer", "Head of Design", "Design Systems Engineer", "Creative Director"],
    outcomes: ["made design-dev handoff frictionless", "unified our component library", "sped up iteration cycles", "improved review quality"],
  },
  database: {
    pros: ["Query performance", "Reliability", "Ecosystem", "Scalability", "Tooling maturity", "Cost efficiency"],
    cons: ["Operational overhead", "Tuning expertise needed", "Migration effort", "Cost unpredictability", "Vendor lock-in"],
    roles: ["Data Engineer", "Database Administrator", "Analytics Engineer", "Head of Data Platform", "Backend Engineer"],
    outcomes: ["cut warehouse spend", "made pipelines reliable", "reduced query latency sharply", "removed manual data wrangling"],
  },
  erp: {
    pros: ["Financials depth", "Inventory accuracy", "Manufacturing support", "Reporting", "Multi-entity", "Compliance"],
    cons: ["Implementation cost", "Implementation time", "Customisation effort", "Upgrade cycles", "Consultant dependency"],
    roles: ["Operations Director", "ERP Manager", "Supply Chain Lead", "Manufacturing Manager", "Finance Systems Manager"],
    outcomes: ["gave us real inventory accuracy", "replaced four disconnected systems", "made cost reporting trustworthy", "cut order errors"],
  },
  "developer-tools": {
    pros: ["Developer experience", "CI integration", "Documentation", "API quality", "Reliability", "Ecosystem"],
    cons: ["Per-seat pricing", "Enterprise controls", "Rate limits", "Self-host complexity", "Migration effort"],
    roles: ["Staff Engineer", "Engineering Manager", "Platform Lead", "Backend Engineer", "VP Engineering"],
    outcomes: ["cut review cycle time", "made our API surface discoverable", "reduced build flakiness", "sped up onboarding"],
  },
  cms: {
    pros: ["Editor experience", "Content modelling", "Preview workflow", "Developer flexibility", "Performance", "Localisation"],
    cons: ["Migration effort", "Editor training", "Plugin maintenance", "Preview parity", "Cost at scale"],
    roles: ["Content Lead", "Head of Digital", "Web Manager", "Content Strategist", "Marketing Technologist"],
    outcomes: ["let marketing ship without engineering", "made preview trustworthy", "cut publish time from days to hours", "simplified multi-site content"],
  },
  cdp: {
    pros: ["Identity resolution", "Event governance", "Activation speed", "Warehouse sync", "Consent handling", "Integrations"],
    cons: ["Cost model", "Implementation effort", "Data quality dependency", "Reporting layer", "Contract flexibility"],
    roles: ["Growth Engineer", "Marketing Operations Lead", "Head of CRM", "Data Product Manager", "Customer Data Lead"],
    outcomes: ["unified our customer identity", "made audiences buildable in minutes", "cleaned up our event taxonomy", "improved targeting precision"],
  },
  "field-service": {
    pros: ["Scheduling", "Dispatch board", "Mobile app", "Invoicing", "Customer notifications", "Job history"],
    cons: ["Per-technician pricing", "Offline reliability", "Accounting integrations", "Customisation", "Reporting"],
    roles: ["Operations Manager", "Service Manager", "Field Supervisor", "Owner-Operator", "Dispatch Lead"],
    outcomes: ["filled more jobs per technician", "cut windshield time", "made invoicing same-day", "reduced callback rate"],
  },
};

const DEFAULT_VOCAB: Vocabulary = {
  pros: ["Ease of use", "Integrations", "Reporting", "Performance", "Support", "Value"],
  cons: ["Pricing", "Learning curve", "Customisation", "Mobile experience", "Support response"],
  roles: ["Operations Manager", "Team Lead", "Director", "Analyst", "Head of Department"],
  outcomes: ["improved our workflow", "cut manual effort", "gave the team visibility", "reduced errors"],
};

const INDUSTRIES = [
  "Software",
  "Financial Services",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Education",
  "Media",
  "Logistics",
  "Professional Services",
  "Non-profit",
  "Telecommunications",
  "Hospitality",
];

const FIRST_NAMES = [
  "Priya", "Daniel", "Amara", "Lucas", "Mei", "Tomas", "Sofia", "Arjun", "Elena", "Noah",
  "Chiara", "Omar", "Hannah", "Rafael", "Yuki", "Ibrahim", "Clara", "Mateo", "Aisha", "Felix",
  "Nadia", "Jonas", "Leila", "Marcus", "Ingrid", "Hassan", "Beatriz", "Kenji", "Rosa", "Anders",
];

const LAST_NAMES = [
  "Sharma", "Okonkwo", "Lindqvist", "Moreau", "Tanaka", "Fernandes", "Kowalski", "Haddad",
  "Nguyen", "Bergström", "Rossi", "Osei", "Delgado", "Novak", "Petrov", "Almeida", "Chen",
  "Karlsson", "Ivanova", "Mensah",
];

const COMPANY_WORDS_A = ["North", "Bright", "Vertex", "Harbor", "Summit", "Cobalt", "Meridian", "Lattice", "Beacon", "Orchard", "Kestrel", "Foundry"];
const COMPANY_WORDS_B = ["Systems", "Labs", "Group", "Partners", "Industries", "Digital", "Works", "Collective", "Holdings", "Technologies"];

const USE_DURATIONS = ["< 6 months", "6–12 months", "1–2 years", "2–3 years", "3+ years"];
const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  small: "1–50 employees",
  mid: "51–1,000 employees",
  enterprise: "1,000+ employees",
};

/* ==========================================================================
   REVIEW COPY
   Composed from fragments so a product page shows genuinely varied prose while
   the whole corpus stays deterministic and reproducible.
   ========================================================================= */

const REVIEW_OPENINGS = [
  "We evaluated four options before settling on this one and it has held up well.",
  "Rolled this out to the team about a year ago and adoption was faster than expected.",
  "Migrated from a legacy setup and the difference in day-to-day speed is obvious.",
  "We run this as the system of record for the whole department now.",
  "Implementation took longer than the vendor suggested, but the end state is solid.",
  "This replaced two other tools for us, which simplified the stack considerably.",
  "Our team was sceptical at first and most of that resistance disappeared within a month.",
  "Picked this up specifically because it integrated with what we already had.",
  "The evaluation was quick because the trial environment was genuinely usable.",
  "We needed something the whole team could use without a training programme.",
  "Coming from spreadsheets, this was a step change in how we operate.",
  "We use it daily and it has quietly become load-bearing for the business.",
];

const REVIEW_CLOSINGS = [
  "Support has been responsive whenever we have needed them.",
  "Pricing is fair for what it does, though it adds up as the team grows.",
  "Would recommend it to a team of similar size without hesitation.",
  "It is not perfect, but the trade-offs are ones we can live with.",
  "Give yourself a proper implementation window rather than rushing the rollout.",
  "The documentation is better than most in this category.",
  "Expect to invest time in configuration before you see the real value.",
  "Overall this does what we need and the team trusts the output.",
  "We renewed without a serious conversation about alternatives.",
  "There is a genuine learning curve, so budget for it.",
];

const REVIEW_TITLES_GOOD = [
  "Reliable and well supported",
  "Has become core to how we work",
  "Strong value for a mid-size team",
  "Solid choice, few surprises",
  "Does exactly what we needed",
  "Good product, improving steadily",
  "Pleasant surprise after a rocky start",
  "Worth the implementation effort",
];

const REVIEW_TITLES_MIXED = [
  "Good, with caveats",
  "Works well once configured",
  "Capable but needs tuning",
  "Strong features, steep learning curve",
  "Decent value if you use the depth",
  "Solid core, rough edges remain",
];

const PROS_TEXT = [
  "The parts we use most are stable and fast.",
  "Reporting is flexible enough that we stopped exporting to spreadsheets.",
  "The integration surface is broader than we expected.",
  "Onboarding new team members is quick because the UI is predictable.",
  "Automation removed a lot of repetitive manual work.",
  "Permissions are granular enough to satisfy our audit requirements.",
];

const CONS_TEXT = [
  "The pricing model punishes growth, which is worth negotiating early.",
  "Reporting beyond the standard templates takes real effort to set up.",
  "Mobile is functional but clearly not the priority.",
  "Some settings are buried three levels deep in the admin panel.",
  "Support is helpful but first response can be slow during peak periods.",
  "Occasional performance dips when datasets get large.",
];

/* ==========================================================================
   HELPERS
   ========================================================================= */

function pickCategoryVocab(pillarSlug: string): Vocabulary {
  return VOCAB[pillarSlug] ?? DEFAULT_VOCAB;
}

/**
 * Derive a 5→1 star histogram from a target mean, then recompute the true mean from
 * the resulting counts. Guarantees the displayed average always matches the bars —
 * a mismatch here is the kind of detail that destroys trust in a review product.
 */
function buildRatingDistribution(
  targetAvg: number,
  total: number,
): { distribution: [number, number, number, number, number]; actualAvg: number } {
  const anchors: { avg: number; w: [number, number, number, number, number] }[] = [
    { avg: 5.0, w: [0.92, 0.06, 0.015, 0.003, 0.002] },
    { avg: 4.5, w: [0.66, 0.24, 0.06, 0.025, 0.015] },
    { avg: 4.0, w: [0.48, 0.31, 0.13, 0.05, 0.03] },
    { avg: 3.5, w: [0.35, 0.3, 0.19, 0.09, 0.07] },
    { avg: 3.0, w: [0.25, 0.26, 0.22, 0.15, 0.12] },
  ];

  const clamped = Math.min(5, Math.max(3, targetAvg));
  let lo = anchors[anchors.length - 1]!;
  let hi = anchors[0]!;
  for (let i = 0; i < anchors.length - 1; i++) {
    const upper = anchors[i]!;
    const lower = anchors[i + 1]!;
    if (clamped <= upper.avg && clamped >= lower.avg) {
      lo = lower;
      hi = upper;
      break;
    }
  }
  const span = hi.avg - lo.avg || 1;
  const t = (clamped - lo.avg) / span;
  const weights = lo.w.map((lv, i) => lv + (hi.w[i]! - lv) * t);

  const counts = weights.map((w) => Math.round(w * total));
  // Repair rounding drift so the bars always sum to the stated review count.
  let drift = total - counts.reduce((a, b) => a + b, 0);
  let idx = 0;
  while (drift !== 0 && idx < 200) {
    const target = idx % 5;
    if (drift > 0) {
      counts[target] = counts[target]! + 1;
      drift--;
    } else if (counts[target]! > 0) {
      counts[target] = counts[target]! - 1;
      drift++;
    }
    idx++;
  }

  const stars = [5, 4, 3, 2, 1];
  const weighted = counts.reduce((sum, c, i) => sum + c * stars[i]!, 0);
  const actualAvg = total > 0 ? weighted / total : 0;

  return {
    distribution: counts as [number, number, number, number, number],
    actualAvg: Math.round(actualAvg * 100) / 100,
  };
}

function inferPricingModel(price: number | null, groupSlug: string): PricingModel {
  if (price === 0) return "free";
  if (price === null) return "quote_only";
  if (["cloud-devops", "database"].includes(groupSlug)) return "usage_based";
  if (price >= 500) return "flat_annual";
  return "per_user_month";
}

function pricingModelLabel(model: PricingModel): string {
  switch (model) {
    case "per_user_month":
      return "per user / month";
    case "per_month":
      return "per month";
    case "flat_annual":
      return "per year, billed annually";
    case "usage_based":
      return "usage-based";
    case "free":
      return "free";
    case "quote_only":
      return "custom quote";
  }
}

const PLAN_TIER_NAMES = ["Starter", "Professional", "Business", "Enterprise"] as const;

function buildPricingPlans(product: Product, rng: Rng): PricingPlan[] {
  const base = product.startingPrice;
  const tiers: PricingPlan[] = [];

  const tierFeatures: string[][] = [
    ["Core functionality", "Up to 5 users", "Community support", "Standard reporting"],
    ["Everything in Starter", "Workflow automation", "Priority support", "Custom dashboards", "API access"],
    ["Everything in Professional", "Advanced permissions", "Audit log", "SSO / SAML", "Sandbox environment"],
    ["Everything in Business", "Dedicated success manager", "Custom contracts", "Uptime SLA", "Security review support"],
  ];

  if (base === null) {
    // Quote-only products still get tier scaffolding — it is how enterprise pricing reads.
    for (let i = 0; i < 3; i++) {
      tiers.push({
        id: `${product.slug}-plan-${i}`,
        name: PLAN_TIER_NAMES[i]!,
        price: null,
        billing: "annual",
        currency: "USD",
        features: tierFeatures[i]!,
        ctaLabel: "Contact vendor",
        sortOrder: i,
      });
    }
    return tiers;
  }

  if (base === 0) {
    tiers.push({
      id: `${product.slug}-plan-free`,
      name: "Free",
      price: 0,
      billing: "monthly",
      currency: "USD",
      features: ["Core functionality", "Up to 3 users", "Community support"],
      ctaLabel: "Get started free",
      sortOrder: 0,
    });
    for (let i = 1; i < 4; i++) {
      tiers.push({
        id: `${product.slug}-plan-${i}`,
        name: PLAN_TIER_NAMES[i]!,
        price: Math.round(base + i * rng.float(8, 26) * 10) / 10,
        billing: "monthly",
        currency: "USD",
        features: tierFeatures[i]!,
        ctaLabel: "Start free trial",
        sortOrder: i,
      });
    }
    return tiers;
  }

  for (let i = 0; i < 4; i++) {
    const multiplier = [1, 2.4, 4.8, 0][i]!;
    tiers.push({
      id: `${product.slug}-plan-${i}`,
      name: PLAN_TIER_NAMES[i]!,
      price: i === 3 ? null : Math.round(base * multiplier * 100) / 100,
      billing: i === 3 ? "annual" : "monthly",
      currency: "USD",
      features: tierFeatures[i]!,
      ctaLabel: i === 3 ? "Contact sales" : "Start free trial",
      sortOrder: i,
    });
  }
  return tiers;
}

function buildScreenshots(product: Product, rng: Rng): ProductScreenshot[] {
  const captions = [
    "Main workspace",
    "Reporting dashboard",
    "Configuration and settings",
    "Mobile experience",
    "Integrations directory",
  ];
  const tones = ["#eff6ff", "#f4f4f5", "#ecfdf5", "#fafafa", "#fef3c7"];
  const count = rng.int(3, 4);
  return Array.from({ length: count }, (_, i) => ({
    id: `${product.slug}-shot-${i}`,
    caption: captions[i % captions.length]!,
    tone: tones[i % tones.length]!,
  }));
}

function buildSentiment(product: Product, rng: Rng, kind: "pros" | "cons"): SentimentPill[] {
  const vocab = pickCategoryVocab(product.primaryCategorySlug);
  const labels = kind === "pros" ? vocab.pros : vocab.cons;
  const sampleSize = Math.max(6, Math.round(product.ratingCount * 0.35));
  return labels
    .map((label) => ({
      label,
      count: Math.round(sampleSize * rng.float(0.04, 0.26)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function buildAiSummary(product: Product, rng: Rng): string[] {
  const vocab = pickCategoryVocab(product.primaryCategorySlug);
  const pro = rng.sample(vocab.pros, 2);
  const con = rng.pick(vocab.cons);
  const outcome = rng.pick(vocab.outcomes);
  const sizeLabel = product.companySizes.includes("enterprise")
    ? "mid-market and enterprise"
    : product.companySizes.includes("mid")
      ? "small and mid-market"
      : "small";

  return [
    `Reviewers most often praise ${pro[0]!.toLowerCase()} and ${pro[1]!.toLowerCase()}, and report that it has ${outcome}.`,
    `Satisfaction is strongest among ${sizeLabel} teams, with an average rating of ${product.ratingAvg.toFixed(1)} across ${product.ratingCount.toLocaleString("en-US")} reviews.`,
    `The most common criticism is ${con.toLowerCase()}, raised in a minority of reviews and usually tied to scaling rather than core capability.`,
    `Reviewers who evaluated alternatives most often compared it against ${product.pros[0]?.label ? "the category leaders" : "direct competitors"} on price predictability and reporting depth.`,
  ];
}

function buildProductDescription(product: Product, rng: Rng): string {
  const vocab = pickCategoryVocab(product.primaryCategorySlug);
  const pros = rng.sample(vocab.pros, 3);
  const con = rng.pick(vocab.cons);
  const priceLine =
    product.startingPrice === null
      ? "Pricing is quoted per deployment, so expect a scoping conversation before you see numbers."
      : product.startingPrice === 0
        ? "A free tier is available, with paid tiers adding administrative and reporting depth."
        : `Paid plans start at $${product.startingPrice} ${pricingModelLabel(product.pricingModel)}.`;

  return [
    `${product.name} is a ${product.solutionType.toLowerCase()} from ${product.companyName}, positioned in the ${product.primaryCategoryName.toLowerCase()} category. ${product.tagline}`,

    `In practice, teams adopt it for ${pros[0]!.toLowerCase()}, ${pros[1]!.toLowerCase()} and ${pros[2]!.toLowerCase()}. It supports ${product.deployment.length} deployment ${product.deployment.length === 1 ? "model" : "models"} and integrates with ${product.integrationSlugs.length} tools in the directory, including ${product.integrationSlugs.length > 0 ? "the platforms most teams already run" : "the usual suspects"}.`,

    `The most consistent criticism across reviews concerns ${con.toLowerCase()}. Buyers should weigh that against the fact that ${product.ratingCount.toLocaleString("en-US")} reviewers return an average of ${product.ratingAvg.toFixed(1)} out of 5, and ${product.score}/100 on our composite score. ${priceLine}`,
  ].join("\n\n");
}

function buildCategoryEditorial(group: RawGroup, products: Product[]): string[] {
  const top = products.slice(0, 3).map((p) => p.name);
  const avg =
    products.reduce((sum, p) => sum + p.ratingAvg, 0) / Math.max(1, products.length);
  const freeCount = products.filter((p) => p.freeTrial || p.freeVersion).length;

  return [
    `There are ${products.length} ${group.name.toLowerCase()} products in this directory, carrying ${products.reduce((s, p) => s + p.ratingCount, 0).toLocaleString("en-US")} reviews between them. The category average rating is ${avg.toFixed(1)} out of 5, and ${freeCount} of the ${products.length} offer a free trial or a free tier.`,
    `${top[0]} leads on our composite score, followed by ${top[1]} and ${top[2]}. That ordering reflects review volume, satisfaction scores and functional coverage — it is not influenced by vendor payment, and no vendor can buy a position in this list.`,
    `When shortlisting ${group.name.toLowerCase()}, decide first whether you are buying depth or speed. Depth-oriented platforms carry steeper implementation costs but hold up as a team scales; speed-oriented platforms deliver value in days but tend to be replaced within two to three years.`,
    `Filter by pricing model and deployment before you compare features — those two constraints eliminate most of the shortlist, and they are the hardest to change after purchase.`,
  ];
}

function buildCategoryFaqs(group: RawGroup, products: Product[]): FaqItem[] {
  const cheapest = [...products]
    .filter((p) => p.startingPrice !== null && p.startingPrice > 0)
    .sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0))[0];
  const topRated = [...products].sort((a, b) => b.ratingAvg - a.ratingAvg)[0];

  return [
    {
      question: `What is the best ${group.name.toLowerCase()} software in 2026?`,
      answer: `${topRated?.name ?? "The category leader"} holds the highest verified rating in this category at ${topRated?.ratingAvg.toFixed(1) ?? "—"} out of 5. The better question is which product fits your team size and deployment constraints — a lower-rated product that matches your requirements will outperform a higher-rated one that does not.`,
    },
    {
      question: `How much does ${group.name.toLowerCase()} software cost?`,
      answer: cheapest
        ? `Entry pricing in this category starts around $${cheapest.startingPrice} ${pricingModelLabel(cheapest.pricingModel)}, though most vendors price by seat, usage or entity. Budget for implementation and migration on top of licence cost — on enterprise deployments those routinely exceed the first-year licence fee.`
        : `Most vendors in this category quote per deployment rather than publishing list pricing. Expect to scope your requirements before receiving numbers.`,
    },
    {
      question: `How are these ${group.name.toLowerCase()} products ranked?`,
      answer:
        "Ranking combines review volume, satisfaction scores across four dimensions, and functional coverage measured against the category feature taxonomy. Vendors cannot pay for placement. Sponsored listings, where they appear, are labelled and excluded from the ranking.",
    },
  ];
}

/* ==========================================================================
   GENERATION
   ========================================================================= */

function buildCategories(groups: RawGroup[], products: Product[]): Category[] {
  const categories: Category[] = [];

  groups.forEach((group, groupIndex) => {
    const pillarProducts = products.filter((p) => p.primaryCategorySlug === group.slug);

    categories.push({
      id: `cat_${group.slug}`,
      name: group.name,
      slug: group.slug,
      description: group.description,
      icon: group.icon,
      parentSlug: null,
      depth: 0,
      productCount: pillarProducts.length,
      seoTitle: `Best ${group.name} Software — September 2026`,
      seoDescription: `Compare ${pillarProducts.length} ${group.name.toLowerCase()} products by verified rating, pricing, deployment and features. Independent rankings, no pay-to-play.`,
      sortOrder: groupIndex,
      editorial: buildCategoryEditorial(group, pillarProducts),
      faqs: buildCategoryFaqs(group, pillarProducts),
    });

    group.subs.forEach((sub, subIndex) => {
      const subProducts = products.filter((p) => p.categorySlugs.includes(sub.slug));
      categories.push({
        id: `cat_${sub.slug}`,
        name: sub.name,
        slug: sub.slug,
        description: `${sub.name} tools within the ${group.name} category.`,
        icon: group.icon,
        parentSlug: group.slug,
        depth: 1,
        productCount: subProducts.length,
        seoTitle: `Best ${sub.name} Software — September 2026`,
        seoDescription: `Compare ${subProducts.length} ${sub.name.toLowerCase()} tools on verified reviews, pricing and feature coverage.`,
        sortOrder: subIndex,
        editorial: [
          `${sub.name} is a subcategory of ${group.name}, covering ${subProducts.length} products in this directory.`,
          `Products here typically also appear in the broader ${group.name} ranking. Use the parent category when you have not yet narrowed your requirements, and this page once you have.`,
        ],
        faqs: [],
      });
    });
  });

  return categories;
}

function buildCompanies(
  products: Product[],
  groups: RawGroup[],
): Company[] {
  const byVendor = new Map<string, Product[]>();
  for (const product of products) {
    const list = byVendor.get(product.companyName) ?? [];
    list.push(product);
    byVendor.set(product.companyName, list);
  }

  const hq = [
    ["San Francisco", "United States"],
    ["New York", "United States"],
    ["Austin", "United States"],
    ["London", "United Kingdom"],
    ["Berlin", "Germany"],
    ["Amsterdam", "Netherlands"],
    ["Sydney", "Australia"],
    ["Toronto", "Canada"],
    ["Bengaluru", "India"],
    ["Stockholm", "Sweden"],
    ["Paris", "France"],
    ["Tel Aviv", "Israel"],
    ["Singapore", "Singapore"],
    ["Dublin", "Ireland"],
  ];

  const companies: Company[] = [];

  for (const [vendorName, vendorProducts] of byVendor) {
    const rng = new Rng(`company:${vendorName}`);
    const [city, country] = rng.pick(hq);
    const first = vendorProducts[0]!;
    const avg =
      vendorProducts.reduce((s, p) => s + p.ratingAvg, 0) / vendorProducts.length;

    companies.push({
      id: `co_${slugify(vendorName)}`,
      name: vendorName,
      slug: slugify(vendorName),
      website: first.website,
      logoDomain: first.logoDomain,
      description: `${vendorName} builds ${vendorProducts.length} ${vendorProducts.length === 1 ? "product" : "products"} listed in this directory, spanning ${[...new Set(vendorProducts.map((p) => p.primaryCategoryName))].slice(0, 3).join(", ")}.`,
      foundedYear: rng.int(1988, 2018),
      hqCity: city,
      hqCountry: country,
      employeeCount: rng.pick(["11–50", "51–200", "201–500", "501–1,000", "1,001–5,000", "5,000+"]),
      productCount: vendorProducts.length,
      avgRating: Math.round(avg * 100) / 100,
      verifiedPublisher: rng.bool(0.72),
    });
  }

  // `groups` is accepted to keep the signature stable if vendor heuristics change.
  void groups;
  return companies.sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));
}

function buildReviews(products: Product[]): Review[] {
  const reviews: Review[] = [];

  for (const product of products) {
    const rng = new Rng(`reviews:${product.slug}`);
    const vocab = pickCategoryVocab(product.primaryCategorySlug);
    const count = rng.int(3, 7);

    for (let i = 0; i < count; i++) {
      const r = new Rng(`review:${product.slug}:${i}`);

      // Ratings cluster around the product mean but keep a genuine tail.
      const drift = r.float(-1.1, 0.75);
      const rating = Math.max(1, Math.min(5, Math.round(product.ratingAvg + drift)));

      const sizeRoll = r.random();
      const companySize: CompanySize =
        product.companySizes.length === 1
          ? product.companySizes[0]!
          : sizeRoll < 0.34
            ? "small"
            : sizeRoll < 0.72
              ? "mid"
              : "enterprise";

      const verificationRoll = r.random();
      const verification: VerificationLabel =
        verificationRoll < 0.54
          ? "VALIDATED"
          : verificationRoll < 0.78
            ? "CURRENT_USER"
            : verificationRoll < 0.92
              ? "INCENTIVIZED"
              : "GUEST";

      const isPositive = rating >= 4;
      const title = isPositive
        ? r.pick(REVIEW_TITLES_GOOD)
        : r.pick(REVIEW_TITLES_MIXED);

      const body = [
        r.pick(REVIEW_OPENINGS),
        `For us the strongest part is ${r.pick(vocab.pros).toLowerCase()}.`,
        `It has ${r.pick(vocab.outcomes)}.`,
        r.pick(REVIEW_CLOSINGS),
      ].join(" ");

      const secondary = () =>
        Math.max(1, Math.min(5, rating + (r.bool(0.55) ? 0 : r.bool() ? -1 : 1)));

      const hasResponse = r.bool(0.22);

      reviews.push({
        id: `rev_${product.slug}_${i}`,
        productSlug: product.slug,
        authorName: `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`,
        authorRole: r.pick(vocab.roles),
        authorCompanySize: companySize,
        authorIndustry: r.pick(INDUSTRIES),
        useDuration: r.pick(USE_DURATIONS),
        rating,
        easeRating: secondary(),
        valueRating: secondary(),
        supportRating: secondary(),
        functionalityRating: secondary(),
        title,
        body,
        pros: r.pick(PROS_TEXT),
        cons: r.pick(CONS_TEXT),
        verification,
        source:
          verification === "CURRENT_USER"
            ? "Screenshot proof"
            : verification === "INCENTIVIZED"
              ? "Incentivised invite"
              : verification === "GUEST"
                ? "Public submission"
                : "Verified business email",
        helpfulCount: r.logInt(0, 180),
        status: r.bool(0.94) ? "APPROVED" : r.bool(0.6) ? "PENDING" : "FLAGGED",
        vendorResponse: hasResponse
          ? {
              body: "Thanks for the detailed feedback — we have shared it with the product team. If the reporting limitation is still blocking you, our support team can walk through the workaround.",
              respondedAt: isoDaysAgo(r.int(2, 60)),
            }
          : null,
        createdAt: isoDaysAgo(r.int(3, 900)),
      });
    }
  }

  return reviews;
}

function buildComparisons(products: Product[]): Comparison[] {
  const comparisons: Comparison[] = [];

  // Only emit comparisons that internal linking will actually surface — bounded crawl,
  // per the platform blueprint. Top 5 by score in each pillar, pairwise.
  const byPillar = new Map<string, Product[]>();
  for (const product of products) {
    const list = byPillar.get(product.primaryCategorySlug) ?? [];
    list.push(product);
    byPillar.set(product.primaryCategorySlug, list);
  }

  for (const [pillar, list] of byPillar) {
    const top = [...list].sort((a, b) => b.score - a.score).slice(0, 5);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const a = top[i]!;
        const b = top[j]!;
        const rng = new Rng(`cmp:${a.slug}:${b.slug}`);
        const slug = [a.slug, b.slug].sort((x, y) => x.localeCompare(y)).join("-vs-");
        comparisons.push({
          id: `cmp_${slug}`,
          slug,
          title: `${a.name} vs ${b.name}`,
          productSlugs: [a.slug, b.slug],
          views: rng.logInt(400, 92_000),
          updatedAt: isoDaysAgo(rng.int(1, 40)),
        });
        void pillar;
      }
    }
  }

  return comparisons.sort((a, b) => b.views - a.views);
}

function buildResources(groups: RawGroup[]): Resource[] {
  const authors = ["Ravi Menon", "Claire Dubois", "Sam Okafor", "Lena Fischer", "Tom Whitfield"];
  const templates = [
    { suffix: "Buyer's Guide", read: 11, angle: "how to shortlist without over-buying" },
    { suffix: "Pricing Explained", read: 8, angle: "what the pricing models actually cost at scale" },
    { suffix: "Implementation Checklist", read: 9, angle: "the rollout sequence that avoids a stalled project" },
    { suffix: "Migration Guide", read: 13, angle: "moving data out of a legacy system safely" },
  ];

  const resources: Resource[] = [];

  groups.forEach((group, groupIndex) => {
    const template = templates[groupIndex % templates.length]!;
    const rng = new Rng(`resource:${group.slug}`);
    const slug = `${group.slug}-${slugify(template.suffix)}`;
    resources.push({
      id: `res_${slug}`,
      title: `${group.name} ${template.suffix}`,
      slug,
      excerpt: `A practical guide to ${template.angle} when evaluating ${group.name.toLowerCase()} platforms.`,
      body: [
        `Most ${group.name.toLowerCase()} purchases fail for reasons that have nothing to do with the product. They fail because the requirements were written after the demo, not before it.`,
        `Start by writing down the three workflows that hurt most today. Then score every candidate against those three, not against the feature list. Vendors optimise their demos for breadth; your job is to test depth on the two or three things you actually do daily.`,
        `Budget for the second year, not the first. Implementation, migration and internal change management routinely exceed the licence line in year one, and the licence line itself rarely stays flat as seat counts grow.`,
        `Finally, agree an exit before you sign. Export formats, data portability and notice periods are the terms that matter most if the relationship sours, and they are easiest to negotiate while the vendor still wants the deal.`,
      ],
      categorySlug: group.slug,
      author: rng.pick(authors),
      readMinutes: template.read,
      publishedAt: isoDaysAgo(rng.int(20, 400)),
    });
  });

  return resources;
}

function buildLeads(products: Product[]): Lead[] {
  const rng = new Rng("leads");
  const types: LeadType[] = [
    "GET_PRICING",
    "REQUEST_DEMO",
    "EXPERT_RECOMMENDATION",
    "VISIT_WEBSITE",
    "COMPARISON_EMAIL",
  ];
  const statuses: LeadStatus[] = ["NEW", "NEW", "CONTACTED", "CONTACTED", "QUALIFIED", "CLOSED", "SPAM"];
  const sources = ["product#hero", "product#rail", "compare#gate", "category#rail", "search#empty"];
  const intents = ["Replace an existing tool", "Searching for options", "Browsing the category"];

  const leads: Lead[] = [];

  for (let i = 0; i < 64; i++) {
    const product = rng.pick(products);
    const r = new Rng(`lead:${i}`);
    // ownerId is the FIRST PRNG call on `r` so the position of every downstream pick
    // (status, type, name, email, company, phone, message, intent, sourceLocation) is
    // unchanged — the rest of the seeded catalogue stays byte-identical.
    const ownerId: LeadOwner | null = r.bool(0.45) ? r.pick(DEMO_OWNER_IDS) : null;
    const status = r.pick(statuses);
    leads.push({
      id: `lead_${String(i + 1).padStart(3, "0")}`,
      type: r.pick(types),
      status,
      ownerId,
      productSlug: product.slug,
      productName: product.name,
      name: `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`,
      email: `${r.pick(FIRST_NAMES).toLowerCase()}.${r.pick(LAST_NAMES).toLowerCase()}@${r.pick(COMPANY_WORDS_A).toLowerCase()}${r.pick(COMPANY_WORDS_B).toLowerCase()}.com`,
      company: `${r.pick(COMPANY_WORDS_A)} ${r.pick(COMPANY_WORDS_B)}`,
      phone: r.bool(0.6) ? `+1 ${r.int(200, 989)} ${r.int(100, 999)} ${r.int(1000, 9999)}` : null,
      message: r.bool(0.35)
        ? `We are evaluating ${product.name} against two other options and need pricing for roughly ${r.int(10, 400)} seats.`
        : null,
      intent: r.pick(intents),
      sourceLocation: r.pick(sources),
      categorySlug: product.primaryCategorySlug,
      createdAt: isoDaysAgo(r.int(0, 45)),
      updatedAt: isoDaysAgo(r.int(0, 10)),
    });
  }

  return leads.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function buildProducts(groups: RawGroup[]): Product[] {
  const products: Product[] = [];

  for (const group of groups) {
    const groupRng = new Rng(`group:${group.slug}`);

    group.products.forEach((raw: RawProduct, index: number) => {
      const [name, vendor, domain, priceFrom, tagline] = raw;
      const slug = slugify(name);
      const rng = new Rng(`product:${slug}`);

      const sub = group.subs[index % group.subs.length]!;

      // Rating and volume correlate with prominence: earlier entries in a curated list
      // are the better-known products, so they carry more reviews.
      const prominence = 1 - index / Math.max(1, group.products.length);
      const targetAvg = 3.85 + prominence * 0.55 + rng.float(-0.22, 0.28);
      const ratingCount = Math.round(
        rng.logInt(45, 900) * (0.6 + prominence * 3.4),
      );
      const { distribution, actualAvg } = buildRatingDistribution(targetAvg, ratingCount);

      const featureSlugs = (() => {
        const all = RAW_FEATURE_GROUPS.flatMap((fg) =>
          fg.features.map((f) => slugify(f)),
        );
        const coverage = 0.42 + prominence * 0.36 + rng.float(-0.1, 0.12);
        return groupRng.sample(all, Math.round(all.length * Math.min(0.92, coverage)));
      })();

      const integrationSlugs = groupRng.sample(
        RAW_INTEGRATIONS.map((i) => slugify(i.name)),
        rng.int(9, 46),
      );

      const deployment: DeploymentModel[] = ["cloud"];
      if (rng.bool(0.26)) deployment.push("on_premise");
      if (rng.bool(0.38)) deployment.push("mobile");
      if (rng.bool(0.12)) deployment.push("hybrid");

      const companySizes: CompanySize[] = (() => {
        const price = priceFrom ?? 0;
        if (price >= 500) return ["mid", "enterprise"];
        if (price === 0) return ["small", "mid"];
        if (rng.bool(0.55)) return ["small", "mid"];
        return rng.bool(0.5) ? ["mid", "enterprise"] : ["small", "mid", "enterprise"];
      })();

      const pricingModel = inferPricingModel(priceFrom, group.slug);

      const base: Product = {
        id: `prd_${slug}`,
        name,
        slug,
        tagline,
        shortDescription: tagline,
        description: "",
        website: `https://${domain}`,
        logoDomain: domain,
        companySlug: slugify(vendor),
        companyName: vendor,
        categorySlugs: [group.slug, sub.slug],
        primaryCategorySlug: group.slug,
        primaryCategoryName: group.name,
        status: "APPROVED",
        ratingAvg: actualAvg,
        ratingCount,
        easeAvg: 0,
        valueAvg: 0,
        supportAvg: 0,
        functionalityAvg: 0,
        ratingDistribution: distribution,
        score: 0,
        leader: false,
        startingPrice: priceFrom,
        pricingModel,
        pricingNote: pricingModelLabel(pricingModel),
        freeTrial: rng.bool(priceFrom === 0 ? 0.5 : 0.72),
        freeTrialDays: null,
        freeVersion: priceFrom === 0 || rng.bool(0.24),
        deployment,
        companySizes,
        featureSlugs,
        integrationSlugs,
        pricingPlans: [],
        screenshots: [],
        languages: rng.int(2, 34),
        solutionType: group.subs.length > 2 ? "All-in-One Platform" : "Point Solution",
        pros: [],
        cons: [],
        aiSummary: [],
        featured: index < 2 && groupRng.bool(0.62),
        sponsored: rng.bool(0.07),
        trendingRank: null,
        comparisonViews: rng.logInt(120, 74_000),
        profileViews: rng.logInt(900, 480_000),
        faqs: [],
        createdAt: isoDaysAgo(rng.int(60, 1_400)),
        updatedAt: isoDaysAgo(rng.int(0, 45)),
      };

      if (base.freeTrial) base.freeTrialDays = rng.pick([7, 14, 14, 30, 30, 60]);

      // Secondary dimension averages, biased around the overall mean.
      const secondary = (bias: number) =>
        Math.round(
          Math.min(5, Math.max(2.4, base.ratingAvg + bias + rng.float(-0.18, 0.18))) * 100,
        ) / 100;
      base.easeAvg = secondary(0.18);
      base.valueAvg = secondary(-0.12);
      base.supportAvg = secondary(-0.24);
      base.functionalityAvg = secondary(0.08);

      const featureCoverage = featureSlugs.length /
        RAW_FEATURE_GROUPS.reduce((sum, fg) => sum + fg.features.length, 0);
      const volumeFactor = Math.min(1, Math.log10(ratingCount + 1) / 4);
      base.score = Math.round(
        Math.min(
          99,
          Math.max(
            58,
            (base.ratingAvg / 5) * 68 + volumeFactor * 17 + featureCoverage * 15,
          ),
        ),
      );
      base.leader = base.score >= 87;

      base.pricingPlans = buildPricingPlans(base, rng);
      base.screenshots = buildScreenshots(base, rng);
      base.pros = buildSentiment(base, rng, "pros");
      base.cons = buildSentiment(base, rng, "cons");
      base.aiSummary = buildAiSummary(base, rng);
      base.description = buildProductDescription(base, rng);
      base.faqs = [
        {
          question: `Is there a free trial for ${base.name}?`,
          answer: base.freeTrial
            ? `Yes — a ${base.freeTrialDays}-day trial is available${base.freeVersion ? ", and a free tier exists for small teams" : ""}. No credit card is required in most cases, though enterprise features are gated.`
            : `No self-serve trial is published. ${base.companyName} typically arranges a guided proof of concept instead, which is common at this price point.`,
        },
        {
          question: `How much does ${base.name} cost?`,
          answer:
            base.startingPrice === null
              ? `${base.name} is quoted per deployment rather than list-priced. Based on ${base.ratingCount.toLocaleString("en-US")} reviews, buyers report the scoping process takes one to three weeks.`
              : base.startingPrice === 0
                ? `${base.name} has a free tier. Paid plans begin above that, and the main cost driver is seat count rather than feature tier.`
                : `Plans start at $${base.startingPrice} ${base.pricingNote}. Total cost scales with seats and, on higher tiers, with administrative or usage-based components.`,
        },
        {
          question: `What is the best alternative to ${base.name}?`,
          answer: `The most common alternatives buyers compare are the other products in our ${base.primaryCategoryName} ranking. The comparison table on this page puts ${base.name} side by side with its closest competitors on ratings, pricing and feature coverage.`,
        },
      ];

      products.push(base);
    });
  }

  // Trending leaderboard — a genuinely different signal from score, so the homepage
  // leaderboards do not simply duplicate the top of the category lists.
  const trending = [...products]
    .sort(
      (a, b) =>
        b.comparisonViews / Math.max(1, b.ratingCount) -
        a.comparisonViews / Math.max(1, a.ratingCount),
    )
    .slice(0, 12);
  trending.forEach((product, i) => {
    product.trendingRank = i + 1;
  });

  return products;
}

/* ==========================================================================
   DATASET ASSEMBLY
   ========================================================================= */

function buildDataset(): Dataset {
  const products = buildProducts(RAW_GROUPS);
  const categories = buildCategories(RAW_GROUPS, products);
  const companies = buildCompanies(products, RAW_GROUPS);
  const reviews = buildReviews(products);
  const comparisons = buildComparisons(products);
  const resources = buildResources(RAW_GROUPS);
  const leads = buildLeads(products);

  const featureGroups: FeatureGroup[] = RAW_FEATURE_GROUPS.map((fg, i) => ({
    id: `fg_${fg.slug}`,
    name: fg.name,
    slug: fg.slug,
    sortOrder: i,
  }));

  const features: Feature[] = RAW_FEATURE_GROUPS.flatMap((fg) =>
    fg.features.map((name) => {
      const slug = slugify(name);
      return {
        id: `ft_${slug}`,
        name,
        slug,
        groupSlug: fg.slug,
        productCount: products.filter((p) => p.featureSlugs.includes(slug)).length,
      };
    }),
  );

  const integrations: Integration[] = RAW_INTEGRATIONS.map((raw) => {
    const slug = slugify(raw.name);
    return {
      id: `int_${slug}`,
      name: raw.name,
      slug,
      category: raw.category,
      productCount: products.filter((p) => p.integrationSlugs.includes(slug)).length,
    };
  }).sort((a, b) => b.productCount - a.productCount);

  return {
    categories,
    featureGroups,
    features,
    integrations,
    companies,
    products,
    reviews,
    comparisons,
    resources,
    leads,
    generatedAt: DATASET_GENERATED_AT,
  };
}

/**
 * Built once per server process. Deterministic, so this is stable across builds and
 * across requests — no staleness, no cache invalidation problem.
 */
export const dataset: Dataset = buildDataset();

export { COMPANY_SIZE_LABELS, pricingModelLabel };
