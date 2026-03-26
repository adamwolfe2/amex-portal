/**
 * Urgency messaging — drives action with time-sensitive copy.
 */

export function getUrgencyMessage(
  unclaimedCount: number,
  daysRemaining: number
): string {
  if (unclaimedCount === 0) return "All caught up this month";

  if (daysRemaining <= 3) {
    return `${unclaimedCount} credit${unclaimedCount !== 1 ? "s" : ""} expiring in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`;
  }

  if (daysRemaining <= 7) {
    return `${unclaimedCount} credit${unclaimedCount !== 1 ? "s" : ""} expiring this week`;
  }

  return `${unclaimedCount} credit${unclaimedCount !== 1 ? "s" : ""} available to claim`;
}

export function getDaysRemainingInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}
