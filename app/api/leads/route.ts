import { NextResponse } from "next/server";
import { createLead } from "@/lib/data/repository";
import { leadSchema, toFieldErrors } from "@/lib/validation/schemas";

/**
 * Lead capture endpoint — the conversion path every product page funnels into.
 *
 * Validation runs here as well as in the form, against the *same* Zod schema, so a
 * field can never be enforced in one place and not the other. The form is a
 * convenience; this route is the actual gate.
 */

export const runtime = "nodejs";

/* --------------------------------------------------------------------------
   Abuse control
   --------------------------------------------------------------------------
   A public write endpoint will be hit by bots. This is a deliberately small
   sliding-window limiter.

   Limitation worth stating plainly: the window lives in module memory, so it is
   per-instance. Behind multiple instances an attacker gets a multiple of the
   limit. That is an acceptable trade for a demo — a real deployment moves this
   counter to Redis, keyed identically, and nothing else here changes.
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

  // Opportunistic sweep so the map cannot grow without bound.
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

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields and try again.",
        errors: toFieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const lead = createLead(parsed.data);

  // The client only needs to know it succeeded. Returning the lead id makes the
  // submission traceable in logs without echoing the payload back.
  return NextResponse.json(
    { id: lead.id, status: lead.status },
    { status: 201 },
  );
}
