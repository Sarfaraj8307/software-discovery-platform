import { NextResponse } from "next/server";
import { submitReview } from "@/lib/data/repository";
import { reviewSubmissionSchema, toFieldErrorsGeneric } from "@/lib/validation/schemas";

/**
 * Public review-submission endpoint. Submitted reviews enter the moderation queue as PENDING
 * (see `submitReview`) and are not shown on any product page until approved. Validation runs
 * here against the same Zod schema the form uses, so a field is never enforced in one place
 * and not the other. This route is the actual gate; the form is a convenience.
 */

export const runtime = "nodejs";

/* --------------------------------------------------------------------------
   Abuse control — a public write endpoint will be hit by bots. Small sliding-window
   limiter. The window lives in module memory, so it is per-instance; behind multiple
   instances an attacker gets a multiple of the limit. Acceptable for a demo — a real
   deployment moves this counter to Redis, keyed identically, and nothing else changes.
   -------------------------------------------------------------------------- */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return false;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = reviewSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields and try again.",
        errors: toFieldErrorsGeneric(parsed.error),
      },
      { status: 422 },
    );
  }

  const review = submitReview(parsed.data);

  // The client only needs to know it succeeded and where it landed. Returning the id makes
  // the submission traceable in logs without echoing the payload back.
  return NextResponse.json({ id: review.id, status: review.status }, { status: 201 });
}
