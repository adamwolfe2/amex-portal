export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserByClerkId,
  getUserClaims,
  createBenefitClaim,
  deleteBenefitClaim,
} from "@/lib/db/queries";
import { claimsCreateSchema } from "@/lib/validation";
import { rateLimit, getRateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const claims = await getUserClaims(user.id);
    return NextResponse.json(claims);
  } catch (error) {
    logger.error("Failed to fetch claims", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
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
  const parsed = claimsCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { benefitId, amount, period, notes } = parsed.data;

  try {
    const claim = await createBenefitClaim({
      userId: user.id,
      benefitId,
      amount: amount ?? undefined,
      period: period ?? undefined,
      notes: notes ?? undefined,
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    logger.error("Failed to create claim", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to create claim" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
  }

  try {
    const deleted = await deleteBenefitClaim(Number(id), user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete claim", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to delete claim" }, { status: 500 });
  }
}
