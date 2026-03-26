export const dynamic = "force-dynamic";

import { BENEFITS } from "@/lib/data";
import { getPaidUsers } from "@/lib/db/queries";
import { sendResetReminder } from "@/lib/email";
import { logger } from "@/lib/logger";

/**
 * Vercel Cron job that runs on the 1st of each month.
 * Finds benefits resetting this month and emails all users a reminder.
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  const currentDay = now.getDate();

  // Find benefits that reset this month
  const resettingBenefits = BENEFITS.filter((b) => {
    if (b.cadence === "monthly" && b.resetDay && currentDay <= 3) {
      return true; // Monthly benefits, remind in first 3 days
    }
    if (b.resetMonths && b.resetMonths.includes(currentMonth) && currentDay <= 3) {
      return true; // Quarterly/semiannual benefits resetting this month
    }
    if (b.cadence === "annual" && b.resetMonths?.includes(currentMonth) && currentDay <= 3) {
      return true;
    }
    return false;
  });

  if (resettingBenefits.length === 0) {
    return Response.json({ message: "No benefits resetting", sent: 0 });
  }

  try {
    const users = await getPaidUsers();
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      if (!user.email) continue;

      const reminders = resettingBenefits.map((b) => ({
        name: b.name,
        value: b.value,
        cadence: b.cadence,
        action: b.action,
      }));

      const ok = await sendResetReminder(user.email, user.name, reminders);
      if (ok) sent++;
      else failed++;
    }

    return Response.json({
      message: `Sent ${sent} reminders, ${failed} failed`,
      sent,
      failed,
      benefitsReset: resettingBenefits.length,
    });
  } catch (error) {
    logger.error("Cron reminders failed", { error: error instanceof Error ? error.message : String(error) });
    return Response.json({ error: "Cron job failed" }, { status: 500 });
  }
}
