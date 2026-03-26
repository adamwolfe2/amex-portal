import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { feedbackResponses } from "@/lib/db/schema";
import { feedbackSchema } from "@/lib/validation";
import { rateLimit, getRateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { ok } = await rateLimit(ip);
  if (!ok) return getRateLimitResponse();

  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      email,
      cards,
      mainProblem,
      wishFeature,
      priceWillingness,
      currentTracking,
      additionalNotes,
    } = parsed.data;

    await db.insert(feedbackResponses).values({
      email,
      cards: cards ?? [],
      mainProblem,
      wishFeature,
      priceWillingness,
      currentTracking: currentTracking ?? [],
      additionalNotes: additionalNotes ?? null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    logger.error("Feedback submission error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
