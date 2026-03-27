export const dynamic = "force-dynamic";

import { BENEFITS } from "@/lib/data";
import { getPaidUsers, getUserClaimsForYear } from "@/lib/db/queries";
import { sendWeeklyDigest } from "@/lib/email";
import { logger } from "@/lib/logger";
import type { CardKey } from "@/lib/data/types";

const WEEKLY_TIPS = [
  "Use your Gold Card at restaurants for 4X Membership Rewards points.",
  "Gold Card earns 4X at US supermarkets (up to $25K/yr).",
  "Book flights directly with airlines using Platinum for 5X points.",
  "Book hotels through Amex Travel with Platinum for 5X points.",
  "Stack Rakuten cashback with your Amex card for double-dip rewards.",
  "Your Platinum Digital Entertainment credit covers streaming services.",
  "Don't forget to use your monthly Uber Cash credit before it resets.",
];

function getDaysUntilMonthEnd(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.max(1, lastDay.getDate() - now.getDate());
}

function getWeeklyTip(): string {
  const weekOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (7 * 86400000)
  );
  return WEEKLY_TIPS[weekOfYear % WEEKLY_TIPS.length];
}

/**
 * Vercel Cron job that runs every Monday at 2pm UTC.
 * Sends a weekly digest email to all paid users with unclaimed
 * credits, days until reset, and a rotating tip.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysUntilReset = getDaysUntilMonthEnd();
  const topTip = getWeeklyTip();

  try {
    const paidUsers = await getPaidUsers();
    let sent = 0;
    let failed = 0;

    for (const user of paidUsers) {
      if (!user.email) continue;

      const userCards = (user.cards as string[]) ?? ["platinum", "gold"];
      const validCards = userCards.filter(
        (c): c is CardKey => c === "platinum" || c === "gold"
      );

      const userBenefits = BENEFITS.filter(
        (b) =>
          validCards.includes(b.card) &&
          b.cadence === "monthly" &&
          b.value !== null
      );

      const yearClaims = await getUserClaimsForYear(user.id, year);
      const thisMonthClaims = yearClaims.filter((c) => {
        if (!c.claimedAt) return false;
        return c.claimedAt.getMonth() + 1 === month;
      });
      const claimedIds = new Set(thisMonthClaims.map((c) => c.benefitId));

      const unclaimedCount = userBenefits.filter(
        (b) => !claimedIds.has(b.id)
      ).length;

      const ok = await sendWeeklyDigest(
        user.email,
        user.name,
        unclaimedCount,
        daysUntilReset,
        topTip
      );
      if (ok) sent++;
      else failed++;
    }

    return Response.json({
      message: `Sent ${sent} weekly digests, ${failed} failed`,
      sent,
      failed,
    });
  } catch (error) {
    logger.error("Weekly digest cron failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ error: "Cron job failed" }, { status: 500 });
  }
}
