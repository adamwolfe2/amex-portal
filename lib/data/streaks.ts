/**
 * Streak computation — tracks consecutive months of benefit usage.
 * A streak breaks when an entire calendar month has zero claims.
 */

interface StreakResult {
  current: number;
  longest: number;
}

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function computeStreak(claimDates: Date[]): StreakResult {
  if (claimDates.length === 0) return { current: 0, longest: 0 };

  const activeMonths = new Set(claimDates.map(toMonthKey));

  // Walk backwards from current month to find current streak
  const now = new Date();
  let current = 0;
  let cursor = new Date(now.getFullYear(), now.getMonth(), 1);

  while (activeMonths.has(toMonthKey(cursor))) {
    current++;
    cursor.setMonth(cursor.getMonth() - 1);
  }

  // Find longest streak by walking forward through all months from earliest to latest
  const sortedMonths = [...activeMonths].sort();
  if (sortedMonths.length === 0) return { current, longest: current };

  let longest = 1;
  let run = 1;

  for (let i = 1; i < sortedMonths.length; i++) {
    const [prevY, prevM] = sortedMonths[i - 1].split("-").map(Number);
    const [curY, curM] = sortedMonths[i].split("-").map(Number);

    const prevDate = new Date(prevY, prevM - 1, 1);
    prevDate.setMonth(prevDate.getMonth() + 1);
    const expectedKey = toMonthKey(prevDate);

    if (sortedMonths[i] === expectedKey) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  longest = Math.max(longest, current);

  return { current, longest };
}
