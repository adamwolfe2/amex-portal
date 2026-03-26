export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import {
  getUserByClerkId,
  getChecklistProgress,
  updateChecklistItem,
} from "@/lib/db/queries";
import { checklistSchema } from "@/lib/validation";

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
    console.error("Failed to update checklist:", error);
    return Response.json(
      { error: "Failed to update checklist item" },
      { status: 500 }
    );
  }
}
