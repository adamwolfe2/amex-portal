/**
 * In-app notification generation — computes notifications from existing data.
 * Pure function, no external services. Notifications are ephemeral and
 * recomputed on each page load.
 */

import type { Benefit, SetupTask } from "./types";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "reset" | "streak" | "action" | "setup";
  priority: "high" | "medium" | "low";
  createdAt: Date;
}

interface ClaimRecord {
  benefitId: string;
  claimedAt: Date | null;
}

interface ChecklistRecord {
  itemId: string;
  completed: boolean | null;
}

/** Months that start each cadence period */
const CADENCE_RESET_MONTHS: Record<string, number[]> = {
  monthly: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  quarterly: [1, 4, 7, 10],
  semiannual: [1, 7],
  annual: [1],
};

/** Last day of a given month (1-indexed) */
function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Compute the next reset date for a benefit relative to `now`.
 * Returns null for ongoing/multi-year benefits that don't reset periodically.
 */
function getNextResetDate(
  benefit: Benefit,
  now: Date
): Date | null {
  const currentMonth = now.getMonth() + 1; // 1-indexed
  const currentDay = now.getDate();
  const year = now.getFullYear();

  if (benefit.cadence === "ongoing" || benefit.cadence === "multi-year") {
    return null;
  }

  // For benefits with explicit resetMonths
  const resetMonths = benefit.resetMonths ??
    CADENCE_RESET_MONTHS[benefit.cadence] ??
    [];
  const resetDay = benefit.resetDay ?? 1;

  if (resetMonths.length === 0) return null;

  // Find the next reset month/day from now
  for (const rm of resetMonths) {
    if (rm > currentMonth || (rm === currentMonth && resetDay > currentDay)) {
      return new Date(year, rm - 1, resetDay);
    }
  }

  // Wrap to next year's first reset month
  return new Date(year + 1, resetMonths[0] - 1, resetDay);
}

/**
 * Compute the end date of the current period for a benefit.
 * For monthly benefits, end of current month.
 * For quarterly benefits, end of the current quarter.
 * For semiannual, end of the current half.
 */
function getCurrentPeriodEnd(
  benefit: Benefit,
  now: Date
): Date | null {
  const year = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (benefit.cadence === "ongoing" || benefit.cadence === "multi-year") {
    return null;
  }

  if (benefit.cadence === "monthly") {
    return new Date(year, now.getMonth() + 1, 0); // last day of current month
  }

  const resetMonths = benefit.resetMonths ??
    CADENCE_RESET_MONTHS[benefit.cadence] ??
    [];

  if (resetMonths.length === 0) return null;

  // Find which period we're in by finding the reset month <= currentMonth
  let periodStartMonth = resetMonths[resetMonths.length - 1];
  let periodYear = year;

  for (const rm of resetMonths) {
    if (rm <= currentMonth) {
      periodStartMonth = rm;
    }
  }

  // If currentMonth is before the first reset month, we're in a period that started last year
  if (currentMonth < resetMonths[0]) {
    periodStartMonth = resetMonths[resetMonths.length - 1];
    periodYear = year - 1;
  }

  // Find the next reset month after periodStartMonth
  const idx = resetMonths.indexOf(periodStartMonth);
  if (idx < resetMonths.length - 1) {
    // End is the day before the next reset month
    const nextResetMonth = resetMonths[idx + 1];
    return new Date(periodYear, nextResetMonth - 1, 0); // last day of month before next reset
  }

  // Last period of the year — ends Dec 31 or day before first reset of next year
  const firstResetNextYear = resetMonths[0];
  return new Date(periodYear + 1, firstResetNextYear - 1, 0);
}

/**
 * Check if a benefit has been claimed in the current period.
 */
function isClaimedInCurrentPeriod(
  benefit: Benefit,
  claims: ClaimRecord[],
  now: Date
): boolean {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const benefitClaims = claims.filter((c) => c.benefitId === benefit.id && c.claimedAt);

  if (benefit.cadence === "monthly") {
    return benefitClaims.some((c) => {
      const d = c.claimedAt!;
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }

  // For other cadences, check if claimed since last reset
  const resetMonths = benefit.resetMonths ??
    CADENCE_RESET_MONTHS[benefit.cadence] ??
    [];
  const resetDay = benefit.resetDay ?? 1;

  let periodStart: Date;
  let periodStartMonth = resetMonths[0] ?? 1;

  for (const rm of resetMonths) {
    if (rm <= month) {
      periodStartMonth = rm;
    }
  }

  if (month < (resetMonths[0] ?? 1)) {
    periodStartMonth = resetMonths[resetMonths.length - 1] ?? 1;
    periodStart = new Date(year - 1, periodStartMonth - 1, resetDay);
  } else {
    periodStart = new Date(year, periodStartMonth - 1, resetDay);
  }

  return benefitClaims.some((c) => c.claimedAt! >= periodStart);
}

/**
 * Generate all notifications from existing data.
 * Pure function — no side effects, no DB calls, no external services.
 */
export function generateNotifications(params: {
  benefits: Benefit[];
  claims: ClaimRecord[];
  checklistProgress: ChecklistRecord[];
  checklistItems: SetupTask[];
  now?: Date;
}): AppNotification[] {
  const {
    benefits,
    claims,
    checklistProgress,
    checklistItems,
    now = new Date(),
  } = params;

  const notifications: AppNotification[] = [];
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;

  // ── Reset alerts: benefits resetting TODAY ──
  for (const benefit of benefits) {
    if (benefit.value === null) continue;

    const nextReset = getNextResetDate(benefit, now);
    if (!nextReset) continue;

    const daysUntilReset = Math.ceil(
      (nextReset.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilReset === 0) {
      notifications.push({
        id: `reset-today-${benefit.id}`,
        title: `${benefit.name} resets today`,
        body: `Your ${benefit.name} credit resets today. Use it before it expires.`,
        type: "reset",
        priority: "high",
        createdAt: now,
      });
    } else if (daysUntilReset > 0 && daysUntilReset <= 7) {
      // ── Reset alerts: benefits resetting within 7 days ──
      // Only alert if not yet claimed in current period
      const claimed = isClaimedInCurrentPeriod(benefit, claims, now);
      if (!claimed) {
        notifications.push({
          id: `reset-soon-${benefit.id}`,
          title: `${benefit.name} resets in ${daysUntilReset} day${daysUntilReset !== 1 ? "s" : ""}`,
          body: `Use your ${benefit.name} credit before it resets. Don't leave money on the table.`,
          type: "reset",
          priority: daysUntilReset <= 3 ? "high" : "medium",
          createdAt: now,
        });
      }
    }
  }

  // ── Streak nudges: no claims this month, past the 15th ──
  if (currentDay > 15) {
    const monthlyBenefits = benefits.filter(
      (b) => b.cadence === "monthly" && b.value !== null
    );
    const unclaimedMonthly = monthlyBenefits.filter(
      (b) => !isClaimedInCurrentPeriod(b, claims, now)
    );

    if (unclaimedMonthly.length > 0) {
      const totalMissing = unclaimedMonthly.reduce(
        (sum, b) => sum + Math.round((b.value ?? 0) / 12),
        0
      );
      const daysLeft = lastDayOfMonth(now.getFullYear(), currentMonth) - currentDay;

      notifications.push({
        id: `streak-nudge-${currentMonth}`,
        title: `${unclaimedMonthly.length} monthly credit${unclaimedMonthly.length !== 1 ? "s" : ""} unused`,
        body: `$${totalMissing} in monthly credits expire in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Claim them to keep your streak alive.`,
        type: "streak",
        priority: daysLeft <= 5 ? "high" : "medium",
        createdAt: now,
      });
    }
  }

  // ── End-of-period nudges for non-monthly benefits ──
  for (const benefit of benefits) {
    if (benefit.value === null) continue;
    if (benefit.cadence === "monthly" || benefit.cadence === "ongoing" || benefit.cadence === "multi-year") continue;

    const periodEnd = getCurrentPeriodEnd(benefit, now);
    if (!periodEnd) continue;

    const daysUntilEnd = Math.ceil(
      (periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilEnd >= 0 && daysUntilEnd <= 7) {
      const claimed = isClaimedInCurrentPeriod(benefit, claims, now);
      if (!claimed) {
        notifications.push({
          id: `period-end-${benefit.id}`,
          title: `${benefit.name} period ending soon`,
          body: `${daysUntilEnd} day${daysUntilEnd !== 1 ? "s" : ""} left to use your ${benefit.name} credit this period.`,
          type: "reset",
          priority: daysUntilEnd <= 3 ? "high" : "medium",
          createdAt: now,
        });
      }
    }
  }

  // ── Uncompleted high-priority checklist items ──
  const completedIds = new Set(
    checklistProgress
      .filter((p) => p.completed)
      .map((p) => p.itemId)
  );

  const uncompletedHighPriority = checklistItems.filter(
    (item) => item.priority === "high" && !completedIds.has(item.id)
  );

  if (uncompletedHighPriority.length > 0) {
    // Group by count rather than one notification per item
    const count = uncompletedHighPriority.length;
    const firstFew = uncompletedHighPriority.slice(0, 3).map((i) => i.title);
    const suffix = count > 3 ? ` and ${count - 3} more` : "";

    notifications.push({
      id: "setup-incomplete",
      title: `${count} high-priority setup task${count !== 1 ? "s" : ""} remaining`,
      body: `${firstFew.join(", ")}${suffix}`,
      type: "setup",
      priority: "medium",
      createdAt: now,
    });
  }

  // Sort by priority (high first) then by type
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return notifications.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}
