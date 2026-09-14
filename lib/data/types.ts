/**
 * Domain model for the Software Discovery Platform.
 *
 * These types deliberately mirror `analysis/schemas/DATABASE-SCHEMA.md` (20 Prisma
 * models). The persistence edge is currently a generated in-process dataset, but the
 * shapes here are the shapes the database will return — so swapping in Prisma means
 * reimplementing `repository.ts` against the schema, with the compiler checking the seam.
 */

/* ------------------------------------------------------------------ ENUMS */

export type Role = "BUYER" | "VENDOR" | "MODERATOR" | "ADMIN";

export type LeadType =
  | "GET_PRICING"
  | "REQUEST_DEMO"
  | "EXPERT_RECOMMENDATION"
  | "VISIT_WEBSITE"
  | "COMPARISON_EMAIL";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "SPAM";

/**
 * Lives here rather than in `lib/validation/schemas.ts` so the admin table's status control
 * can import the list without also pulling Zod into that route's client bundle.
 */
export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "SPAM"] as const;

/**
 * Demo roster for lead assignment on /admin/leads. Until auth (P0.2) lands there is no real
 * user table to draw from, so the only honest roster is one labelled as illustrative. The
 * "Unassigned" option is the default and is rendered as `null` on the lead, not as a string
 * id, so the type system keeps the two cases distinct.
 */
export type LeadOwner = "AM" | "JN" | "RP";

export const DEMO_OWNERS: { id: LeadOwner; name: string; role: string }[] = [
  { id: "AM", name: "Alex Morgan", role: "Inbound lead desk" },
  { id: "JN", name: "Jordan Nakamura", role: "Enterprise routing" },
  { id: "RP", name: "Riya Patel", role: "SMB & partner referrals" },
];

/**
 * Tuple of demo-owner ids, typed so `z.enum()` accepts it directly. Mirrors the
 * `LEAD_STATUSES` pattern above — `as const` keeps the literal tuple so the Zod schema
 * compiles without a cast.
 */
export const DEMO_OWNER_IDS = ["AM", "JN", "RP"] as const satisfies readonly LeadOwner[];

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";

export type ProductStatus = "DRAFT" | "PENDING" | "APPROVED" | "ARCHIVED";

/** Trust labels. `incentivized` must never be hidden — FTC 16 CFR Part 255. */
export type VerificationLabel =
  | "VALIDATED"
  | "CURRENT_USER"
  | "INCENTIVIZED"
  | "GUEST";

export type DeploymentModel = "cloud" | "on_premise" | "mobile" | "hybrid";

export type CompanySize = "small" | "mid" | "enterprise";

export type PricingModel =
  | "per_user_month"
  | "per_month"
  | "flat_annual"
  | "usage_based"
  | "free"
  | "quote_only";

/* -------------------------------------------------------------- TAXONOMY */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Lucide icon name, resolved through a static map at render time. */
  icon: string;
  parentSlug: string | null;
  /** Depth 0 = top-level pillar, 1 = subcategory. */
  depth: 0 | 1;
  productCount: number;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  /** Editorial body rendered server-side at the foot of the category page. */
  editorial: string[];
  faqs: FaqItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureGroup {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface Feature {
  id: string;
  name: string;
  slug: string;
  groupSlug: string;
  /** How many products in the catalogue carry this feature. */
  productCount: number;
}

export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: string;
  productCount: number;
}

/* --------------------------------------------------------------- COMPANY */

export interface Company {
  id: string;
  name: string;
  slug: string;
  website: string;
  logoDomain: string;
  description: string;
  foundedYear: number;
  hqCity: string;
  hqCountry: string;
  employeeCount: string;
  productCount: number;
  /** Mean rating across the vendor's products. */
  avgRating: number;
  verifiedPublisher: boolean;
}

/* --------------------------------------------------------------- PRODUCT */

export interface PricingPlan {
  id: string;
  name: string;
  price: number | null;
  billing: "monthly" | "annual" | "one_time";
  currency: "USD";
  features: string[];
  ctaLabel: string;
  sortOrder: number;
}

export interface ProductScreenshot {
  id: string;
  caption: string;
  /** Deterministic placeholder tone; no binary assets shipped. */
  tone: string;
}

/** Aggregated pros/cons mined from reviews — counts, not vendor claims. */
export interface SentimentPill {
  label: string;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  /** Long-form, markdown-lite description rendered through `prose-editorial`. */
  description: string;
  website: string;
  logoDomain: string;

  companySlug: string;
  companyName: string;

  categorySlugs: string[];
  primaryCategorySlug: string;
  primaryCategoryName: string;

  status: ProductStatus;

  /* Ratings — denormalised, exactly as the schema prescribes. */
  ratingAvg: number;
  ratingCount: number;
  easeAvg: number;
  valueAvg: number;
  supportAvg: number;
  functionalityAvg: number;
  ratingDistribution: [number, number, number, number, number]; // index 0 = 5★

  /** Composite 0–100 score. Formula published on /methodology. */
  score: number;
  leader: boolean;

  startingPrice: number | null;
  pricingModel: PricingModel;
  pricingNote: string;
  freeTrial: boolean;
  freeTrialDays: number | null;
  freeVersion: boolean;

  deployment: DeploymentModel[];
  companySizes: CompanySize[];

  featureSlugs: string[];
  integrationSlugs: string[];
  pricingPlans: PricingPlan[];
  screenshots: ProductScreenshot[];

  languages: number;
  solutionType: string;

  pros: SentimentPill[];
  cons: SentimentPill[];
  aiSummary: string[];

  featured: boolean;
  sponsored: boolean;
  /** Rank in the weekly "New & Trending" leaderboard, or null. */
  trendingRank: number | null;
  comparisonViews: number;
  profileViews: number;

  faqs: FaqItem[];
  createdAt: string;
  updatedAt: string;
}

/* ---------------------------------------------------------------- REVIEW */

export interface Review {
  id: string;
  productSlug: string;
  authorName: string;
  authorRole: string;
  authorCompanySize: CompanySize;
  authorIndustry: string;
  useDuration: string;
  rating: number;
  easeRating: number;
  valueRating: number;
  supportRating: number;
  functionalityRating: number;
  title: string;
  body: string;
  pros: string;
  cons: string;
  verification: VerificationLabel;
  source: string;
  helpfulCount: number;
  status: ReviewStatus;
  /** Vendor response, rendered below the review when present. */
  vendorResponse: { body: string; respondedAt: string } | null;
  createdAt: string;
}

/**
 * The shape a public review-submission form is allowed to supply. Every other `Review`
 * field (id, status, helpfulCount, vendorResponse, createdAt, plus defaults for the
 * optional author fields) is assigned by `submitReview` so it cannot be spoofed by a
 * client. This is the data-layer contract the validation schema must mirror.
 */
export interface ReviewSubmissionInput {
  productSlug: string;
  authorName: string;
  authorRole?: string;
  authorCompanySize: CompanySize;
  authorIndustry?: string;
  useDuration?: string;
  rating: number;
  easeRating: number;
  valueRating: number;
  supportRating: number;
  functionalityRating: number;
  title: string;
  body: string;
  pros?: string;
  cons?: string;
  verification: VerificationLabel;
  source?: string;
}

/* ------------------------------------------------------------ COMPARISON */

export interface Comparison {
  id: string;
  /** Alphabetically canonical: "a-vs-b-vs-c". */
  slug: string;
  title: string;
  productSlugs: string[];
  views: number;
  updatedAt: string;
}

/** A row group inside the comparison table. */
export interface ComparisonSection {
  id: string;
  title: string;
  rows: ComparisonRow[];
}

export interface ComparisonRow {
  label: string;
  /** One value per compared product, in column order. */
  values: ComparisonValue[];
  /** Draws the eye to rows where the products genuinely differ. */
  differs: boolean;
}

export interface ComparisonValue {
  kind: "score" | "text" | "boolean" | "price";
  score?: number;
  text?: string;
  boolean?: boolean;
  price?: number | null;
  /** Respondent count behind a score, shown as muted 12px. */
  sampleSize?: number;
}

/* ------------------------------------------------------------------ LEAD */

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  /**
   * Demo-owner id from the illustrative roster, or null when unassigned.
   * Real auth (P0.2) replaces this with a foreign key into a User table; the
   * shape stays the same.
   */
  ownerId: LeadOwner | null;
  productSlug: string | null;
  productName: string | null;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  intent: string | null;
  /** e.g. "product#hero", "compare#gate", "category#rail". */
  sourceLocation: string;
  categorySlug: string | null;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------- RESOURCE */

export interface Resource {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string[];
  categorySlug: string | null;
  author: string;
  readMinutes: number;
  publishedAt: string;
}

/* ------------------------------------------------------------- AGGREGATE */

export interface Dataset {
  categories: Category[];
  featureGroups: FeatureGroup[];
  features: Feature[];
  integrations: Integration[];
  companies: Company[];
  products: Product[];
  reviews: Review[];
  comparisons: Comparison[];
  resources: Resource[];
  leads: Lead[];
  /** ISO date the dataset was generated — surfaced as "Updated {Month Year}". */
  generatedAt: string;
}

/* --------------------------------------------------- QUERY CONTRACT TYPES */

export type SortKey = "score" | "popularity" | "satisfaction" | "reviews" | "name";

export interface ProductFilters {
  q?: string;
  /** Subcategory or pillar slugs. Empty = no category constraint. */
  categories?: string[];
  pricing?: ("free" | "free_trial" | "paid")[];
  deployment?: DeploymentModel[];
  companySize?: CompanySize[];
  features?: string[];
  integrations?: string[];
  minRating?: number;
  /** Minimum composite score, 0–100. */
  minScore?: number;
}

export interface ProductQuery extends ProductFilters {
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface FacetCount {
  value: string;
  label: string;
  count: number;
}

export interface FilterFacets {
  pricing: FacetCount[];
  deployment: FacetCount[];
  companySize: FacetCount[];
  features: FacetCount[];
  integrations: FacetCount[];
  rating: FacetCount[];
}

/* -------------------------------------------------------------- SEARCH */

export interface SearchHitProduct {
  kind: "product";
  slug: string;
  name: string;
  tagline: string;
  logoDomain: string;
  ratingAvg: number;
  ratingCount: number;
  categoryName: string;
  categorySlug: string;
}

export interface SearchHitCategory {
  kind: "category";
  slug: string;
  name: string;
  icon: string;
  productCount: number;
  depth: 0 | 1;
}

export interface SearchHitComparison {
  kind: "comparison";
  slug: string;
  title: string;
  productNames: string[];
  views: number;
}

export interface SearchResults {
  query: string;
  products: SearchHitProduct[];
  categories: SearchHitCategory[];
  comparisons: SearchHitComparison[];
  total: number;
  /** Populated when nothing matched — never a dead end. */
  suggestions: { name: string; slug: string }[];
}

/* ----------------------------------------------------------- DASHBOARDS */

export interface VendorMetrics {
  profileViews7d: number;
  profileViews30d: number;
  profileViewDelta: number;
  comparisonHits: number;
  leads7d: number;
  leads30d: number;
  leadDelta: number;
  reviewVelocity: number;
  avgRating: number;
  responseRate: number;
  leadsBySource: { source: string; label: string; count: number }[];
  viewsTrend: { label: string; value: number }[];
}

export type ModerationAction = "APPROVE" | "REJECT" | "FLAG";

/**
 * An append-only moderation decision.
 *
 * `actor` is a string rather than a user id because this build has no authentication
 * (deferred by decision, see knownIssues.deployment). The surface records the honest
 * value instead of inventing a fake reviewer identity.
 */
export interface ModerationDecision {
  id: string;
  targetType: "review" | "product";
  targetId: string;
  /** Human-readable label so the log survives the target being renamed. */
  targetLabel: string;
  action: ModerationAction;
  note: string | null;
  actor: string;
  decidedAt: string;
  /** Status the target held before this decision — needed to explain a reversal. */
  fromStatus: string;
  toStatus: string;
}

/**
 * A vendor's proposed change to their own listing, awaiting moderation.
 *
 * Only fields that do NOT feed the composite score are editable. The score is
 * (rating/5 x 68) + (volume x 17) + (coverage x 15), so ratingAvg, ratingCount and
 * featureSlugs are deliberately absent from `fields` — letting a vendor edit any of them
 * would let them edit their own ranking, which the vendor page explicitly promises
 * moderation never does.
 */
export interface ListingEdit {
  id: string;
  slug: string;
  productName: string;
  fields: { tagline: string; shortDescription: string };
  status: "PENDING" | "APPLIED" | "DISCARDED";
  proposedAt: string;
  decidedAt: string | null;
}

export interface AdminMetrics {
  pendingReviews: number;
  pendingProducts: number;
  pendingClaims: number;
  newLeads: number;
  totalProducts: number;
  totalReviews: number;
  flaggedReviews: number;
}
