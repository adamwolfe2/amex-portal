/**
 * ROI and value computation — tracks how much value the user has captured
 * from their card benefits vs. what's available and what they pay in fees.
 */

import type { Benefit } from "./types";

interface ClaimRecord {
  benefitId: string;
  claimedAt: Date | null;
  amount: string | null;
}

const CADENCE_MULTIPLIER: Record<string, number> = {
  monthly: 12,
  quarterly: 4,
  semiannual: 2,
  annual: 1,
  "multi-year": 0.25, // ~once every 4 years
  ongoing: 0,
};

export function computeAvailableValue(benefits: Benefit[]): number {
  return benefits.reduce((sum, b) => {
    if (b.value === null) return sum;
    const mult = CADENCE_MULTIPLIER[b.cadence] ?? 0;
    return sum + b.value * mult;
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

    // Use claim amount if provided, otherwise use benefit's per-period value
    if (claim.amount && !isNaN(Number(claim.amount))) {
      total += Number(claim.amount);
    } else {
      total += benefit.value / (CADENCE_MULTIPLIER[benefit.cadence] ?? 1);
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

  // Available this month: monthly benefits + quarterly/semiannual/annual that reset this month
  let available = 0;
  for (const b of benefits) {
    if (b.value === null) continue;
    if (b.cadence === "monthly") {
      available += b.value / 12;
    } else if (b.resetMonths?.includes(month)) {
      available += b.value / (CADENCE_MULTIPLIER[b.cadence] ?? 1);
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
      captured += benefit.value / (CADENCE_MULTIPLIER[benefit.cadence] ?? 1);
    }
  }

  return { captured: Math.round(captured), available: Math.round(available) };
}
