export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, gte, lt, eq, lte } from "drizzle-orm";
import { sendTrialExpiringEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json({ error: "Not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(
      now.getTime() + 3 * 24 * 60 * 60 * 1000
    );

    // Find users whose trial ends in 2-3 days
    const trialingUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.subscriptionStatus, "pro"),
          gte(users.trialEndsAt, twoDaysFromNow),
          lt(users.trialEndsAt, threeDaysFromNow)
        )
      );

    let sent = 0;
    for (const user of trialingUsers) {
      if (!user.email || !user.trialEndsAt) continue;
      const daysLeft = Math.ceil(
        (user.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const ok = await sendTrialExpiringEmail(user.email, user.name, daysLeft);
      if (ok) sent++;
    }

    // Downgrade users whose trial has expired
    const expiredTrialUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.subscriptionStatus, "trialing"),
          lte(users.trialEndsAt, now)
        )
      );

    if (expiredTrialUsers.length > 0) {
      await db
        .update(users)
        .set({ subscriptionStatus: "free", planType: "free", updatedAt: now })
        .where(
          and(
            eq(users.subscriptionStatus, "trialing"),
            lte(users.trialEndsAt, now)
          )
        );
      logger.info("Downgraded expired trial users", { count: expiredTrialUsers.length });
    }

    return Response.json({ sent, checked: trialingUsers.length, expired: expiredTrialUsers.length });
  } catch (error) {
    logger.error("Trial reminder cron failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ error: "Cron failed" }, { status: 500 });
  }
}
