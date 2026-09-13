import { NextResponse } from "next/server";
import { decideProduct, decideReview } from "@/lib/data/repository";
import { moderationDecisionSchema, toFieldErrors } from "@/lib/validation/schemas";

/**
 * Moderation decisions.
 *
 * Every accepted request appends to an append-only audit log (see the moderation section
 * of the repository). The log records the actor, the note and the before/after status —
 * a queue with only a status column cannot explain *why* a listing was rejected, which is
 * the whole reason this route exists rather than a direct status write.
 *
 * AUTHENTICATION: this build has none (deferred by decision). So the route does not
 * pretend to know who is acting — it records the literal actor `"unauthenticated"`. That
 * is deliberate: inventing a moderator identity would make the audit log worse than
 * useless, because it would look trustworthy while recording a fiction. When auth lands,
 * replace ACTOR with the session principal and nothing else here changes.
 */

export const runtime = "nodejs";

const ACTOR = "unauthenticated";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = moderationDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "That is not a valid moderation decision.",
        errors: toFieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const { targetType, targetId, action, note } = parsed.data;
  const decision =
    targetType === "review"
      ? decideReview(targetId, action, ACTOR, note || null)
      : decideProduct(targetId, action, ACTOR, note || null);

  if (!decision) {
    return NextResponse.json(
      { message: `No ${targetType} with that id is in the queue.` },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      id: decision.id,
      toStatus: decision.toStatus,
      fromStatus: decision.fromStatus,
      decidedAt: decision.decidedAt,
    },
    { status: 200 },
  );
}
