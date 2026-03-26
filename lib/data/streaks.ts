/**
 * Streak computation — tracks consecutive months of benefit usage.
 * A streak breaks when an entire calendar month has zero claims.
 */

interface StreakResult {
  current: number;
  longest: number;
}

function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function computeStreak(claimDates: Date[]): StreakResult {
  if (claimDates.length === 0) return { current: 0, longest: 0 };

  const activeMonths = new Set(
    claimDates.map((d) => toMonthKey(d.getFullYear(), d.getMonth()))
  );

  // Walk backwards from current month to find current streak
  const now = new Date();
  let current = 0;
  let monthsBack = 0;

  while (true) {
    const check = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    if (!activeMonths.has(toMonthKey(check.getFullYear(), check.getMonth()))) break;
    current++;
    monthsBack++;
  }

  // Find longest streak by walking forward through sorted month keys
  const sortedMonths = [...activeMonths].sort();
  if (sortedMonths.length === 0) return { current, longest: current };

  let longest = 1;
  let run = 1;

  for (let i = 1; i < sortedMonths.length; i++) {
    const [prevY, prevM] = sortedMonths[i - 1].split("-").map(Number);
    const expected = new Date(prevY, prevM - 1 + 1, 1); // next month from prev
    const expectedKey = toMonthKey(expected.getFullYear(), expected.getMonth());

    if (sortedMonths[i] === expectedKey) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  return { current: Math.max(current, 0), longest: Math.max(longest, current) };
}
