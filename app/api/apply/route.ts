import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ambassadorApplications } from "@/lib/db/schema";
import { applySchema } from "@/lib/validation";
import { rateLimit, getRateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { ok } = await rateLimit(ip);
  if (!ok) return getRateLimitResponse();

  try {
    const body = await req.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, handle, platform, followerCount, cards, reason } =
      parsed.data;

    await db.insert(ambassadorApplications).values({
      name,
      email,
      handle,
      platform,
      followerCount,
      cards: cards ?? [],
      reason: reason ?? null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    logger.error("Ambassador application error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
