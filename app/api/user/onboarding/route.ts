export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId, updateUserCards } from "@/lib/db/queries";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const { cards } = body;

  if (!cards || !Array.isArray(cards)) {
    return NextResponse.json(
      { error: "cards must be an array" },
      { status: 400 }
    );
  }

  const validCards = cards.filter(
    (c: string) => c === "platinum" || c === "gold"
  );

  const updated = await updateUserCards(userId, validCards);
  return NextResponse.json(updated);
}
