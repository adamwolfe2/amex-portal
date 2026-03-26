export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import {
  getUserByClerkId,
  getChecklistProgress,
  updateChecklistItem,
} from "@/lib/db/queries";
import { checklistSchema } from "@/lib/validation";
import { rateLimit, getRateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const progress = await getChecklistProgress(user.id);
  const completedIds = progress
    .filter((p) => p.completed)
    .map((p) => p.itemId);

  return Response.json({ completedIds });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = await rateLimit(ip);
  if (!ok) return getRateLimitResponse();

  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = checklistSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { itemId, completed } = parsed.data;

  try {
    const result = await updateChecklistItem(user.id, itemId, completed);
    return Response.json(result);
  } catch (error) {
    logger.error("Failed to update checklist", { error: error instanceof Error ? error.message : String(error) });
    return Response.json(
      { error: "Failed to update checklist item" },
      { status: 500 }
    );
  }
}
