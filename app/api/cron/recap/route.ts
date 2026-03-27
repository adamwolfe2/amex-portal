export const dynamic = "force-dynamic";

import { BENEFITS } from "@/lib/data";
import { computeStreak } from "@/lib/data/streaks";
import { computeMonthlyProgress } from "@/lib/data/roi";
import { getPaidUsers, getUserClaims } from "@/lib/db/queries";
import { sendMonthlyRecap } from "@/lib/email";
import { logger } from "@/lib/logger";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Vercel Cron job that runs on the 28th of each month.
 * Sends each paid user a savings recap for the current month.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed
  const monthName = MONTH_NAMES[month - 1];

  try {
    const users = await getPaidUsers();
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      if (!user.email) continue;

      const claims = await getUserClaims(user.id);

      // Filter benefits to user's cards
      const userCards = (user.cards as string[]) ?? ["platinum", "gold"];
      const userBenefits = BENEFITS.filter((b) => userCards.includes(b.card));

      const { captured, available } = computeMonthlyProgress(claims, userBenefits, year, month);

      const claimDates = claims
        .filter((c) => c.claimedAt !== null)
        .map((c) => c.claimedAt as Date);
      const { current: streak } = computeStreak(claimDates);

      const monthClaims = claims.filter((c) => {
        if (!c.claimedAt) return false;
        return c.claimedAt.getFullYear() === year && c.claimedAt.getMonth() + 1 === month;
      });

      const ok = await sendMonthlyRecap(
        user.email,
        user.name,
        monthName,
        captured,
        available,
        monthClaims.length,
        streak
      );
      if (ok) sent++;
      else failed++;
    }

    return Response.json({
      message: `Sent ${sent} recaps, ${failed} failed`,
      sent,
      failed,
      month: monthName,
    });
  } catch (error) {
    logger.error("Cron recap failed", { error: error instanceof Error ? error.message : String(error) });
    return Response.json({ error: "Cron job failed" }, { status: 500 });
  }
}
