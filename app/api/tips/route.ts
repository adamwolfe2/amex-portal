export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId, createCommunityTip, getApprovedTips } from "@/lib/db/queries";
import { communityTipSchema } from "@/lib/validation";
import {
  rateLimit,
  getRateLimitResponse,
  getClientIp,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const tips = await getApprovedTips();
    return NextResponse.json(tips);
  } catch (error) {
    logger.error("Failed to fetch approved tips", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Failed to fetch tips" }, { status: 500 });
  }
}

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
  const parsed = communityTipSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const tip = await createCommunityTip({
      userId: user.id,
      title: parsed.data.title,
      body: parsed.data.body,
      card: parsed.data.card,
      category: parsed.data.category,
    });

    return NextResponse.json(tip, { status: 201 });
  } catch (error) {
    logger.error("Failed to create community tip", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Failed to submit tip" },
      { status: 500 }
    );
  }
}
