export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId, updateUserCards } from "@/lib/db/queries";
import { onboardingSchema } from "@/lib/validation";
import { rateLimit, getRateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(ip);
  if (!ok) return getRateLimitResponse();

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = onboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const updated = await updateUserCards(userId, parsed.data.cards);
    return NextResponse.json(updated);
  } catch (error) {
    logger.error("Failed to save cards", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to save cards" }, { status: 500 });
  }
}
