/**
 * ROI and value computation — tracks how much value the user has captured
 * from their card benefits vs. what's available and what they pay in fees.
 *
 * IMPORTANT: The `value` field on each Benefit is the ANNUAL total.
 * e.g., Uber Cash value=200 means $200/year, not $200/month.
 */

import type { Benefit } from "./types";

interface ClaimRecord {
  benefitId: string;
  claimedAt: Date | null;
  amount: string | null;
}

/** How many periods per year for each cadence. Used to compute per-period value. */
export const PERIODS_PER_YEAR: Record<string, number> = {
  monthly: 12,
  quarterly: 4,
  semiannual: 2,
  annual: 1,
  "multi-year": 1, // value already represents the one-time credit amount
  ongoing: 1, // ongoing benefits have value=null, but safe divisor if not
};

/** Sum of all annual benefit values (value field is already annual). */
export function computeAvailableValue(benefits: Benefit[]): number {
  return benefits.reduce((sum, b) => {
    if (b.value === null) return sum;
    return sum + b.value;
  }, 0);
}

export function computeCapturedValue(
  claims: ClaimRecord[],
  benefits: Benefit[],
  year: number
): number {
  const benefitMap = new Map(benefits.map((b) => [b.id, b]));
  let total = 0;

  for (const claim of claims) {
    if (!claim.claimedAt) continue;
    if (claim.claimedAt.getFullYear() !== year) continue;

    const benefit = benefitMap.get(claim.benefitId);
    if (!benefit || benefit.value === null) continue;

    // Use claim amount if provided, otherwise derive per-period value
    if (claim.amount && !isNaN(Number(claim.amount))) {
      total += Number(claim.amount);
    } else {
      const divisor = PERIODS_PER_YEAR[benefit.cadence] || 1;
      total += benefit.value / divisor;
    }
  }

  return Math.round(total);
}

export function computeMonthlyProgress(
  claims: ClaimRecord[],
  benefits: Benefit[],
  year: number,
  month: number
): { captured: number; available: number } {
  const benefitMap = new Map(benefits.map((b) => [b.id, b]));

  // Available this month: monthly benefits + those that reset this specific month
  let available = 0;
  for (const b of benefits) {
    if (b.value === null) continue;
    if (b.cadence === "monthly") {
      available += b.value / 12;
    } else if (b.resetMonths?.includes(month)) {
      const divisor = PERIODS_PER_YEAR[b.cadence] || 1;
      available += b.value / divisor;
    }
  }

  // Captured this month
  let captured = 0;
  for (const claim of claims) {
    if (!claim.claimedAt) continue;
    if (claim.claimedAt.getFullYear() !== year) continue;
    if (claim.claimedAt.getMonth() + 1 !== month) continue;

    const benefit = benefitMap.get(claim.benefitId);
    if (!benefit || benefit.value === null) continue;

    if (claim.amount && !isNaN(Number(claim.amount))) {
      captured += Number(claim.amount);
    } else {
      const divisor = PERIODS_PER_YEAR[benefit.cadence] || 1;
      captured += benefit.value / divisor;
    }
  }

  return { captured: Math.round(captured), available: Math.round(available) };
}
