import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { feedbackResponses } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      cards,
      mainProblem,
      wishFeature,
      priceWillingness,
      currentTracking,
      additionalNotes,
    } = body;

    if (!email || !mainProblem || !wishFeature || !priceWillingness) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.insert(feedbackResponses).values({
      email,
      cards: cards || [],
      mainProblem,
      wishFeature,
      priceWillingness,
      currentTracking: currentTracking || [],
      additionalNotes: additionalNotes || null,
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
