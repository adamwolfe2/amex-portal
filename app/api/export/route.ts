export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId, getUserClaims, getChecklistProgress } from "@/lib/db/queries";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const [claims, progress] = await Promise.all([
      getUserClaims(user.id),
      getChecklistProgress(user.id),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        email: user.email,
        name: user.name,
        cards: user.cards,
        planType: user.planType,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
      claims: claims.map((c) => ({
        benefitId: c.benefitId,
        claimedAt: c.claimedAt,
        amount: c.amount,
        period: c.period,
        notes: c.notes,
      })),
      checklistProgress: progress.map((p) => ({
        itemId: p.itemId,
        completed: p.completed,
        completedAt: p.completedAt,
      })),
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="creditos-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    logger.error("Failed to export data", { error: error instanceof Error ? error.message : String(error) });
    return Response.json({ error: "Export failed" }, { status: 500 });
  }
}
