import { describe, it, expect } from "vitest";
import {
  computeAvailableValue,
  computeCapturedValue,
  computeMonthlyProgress,
  PERIODS_PER_YEAR,
} from "../roi";
import type { Benefit } from "../types";

function makeBenefit(overrides: Partial<Benefit> = {}): Benefit {
  return {
    id: "test-benefit",
    card: "platinum",
    name: "Test Benefit",
    value: 200,
    cadence: "monthly",
    resetDay: 1,
    category: "Transportation",
    description: "Test",
    action: "Test",
    caveats: "Test",
    enrollmentRequired: false,
    portalLink: null,
    sourceUrl: "https://example.com",
    sourceLabel: "Test",
    ...overrides,
  };
}

describe("PERIODS_PER_YEAR", () => {
  it("has no zero values that could cause division by zero", () => {
    for (const [cadence, periods] of Object.entries(PERIODS_PER_YEAR)) {
      expect(periods, `${cadence} should not be zero`).not.toBe(0);
      expect(periods, `${cadence} should be positive`).toBeGreaterThan(0);
    }
  });

  it("has correct values for all cadences", () => {
    expect(PERIODS_PER_YEAR.monthly).toBe(12);
    expect(PERIODS_PER_YEAR.quarterly).toBe(4);
    expect(PERIODS_PER_YEAR.semiannual).toBe(2);
    expect(PERIODS_PER_YEAR.annual).toBe(1);
    expect(PERIODS_PER_YEAR["multi-year"]).toBe(1);
    expect(PERIODS_PER_YEAR.ongoing).toBe(1);
  });
});

describe("computeAvailableValue", () => {
  it("returns 0 for empty array", () => {
    expect(computeAvailableValue([])).toBe(0);
  });

  it("sums valued benefits correctly", () => {
    const benefits = [
      makeBenefit({ id: "a", value: 200 }),
      makeBenefit({ id: "b", value: 300 }),
    ];
    expect(computeAvailableValue(benefits)).toBe(500);
  });

  it("skips benefits with null value", () => {
    const benefits = [
      makeBenefit({ id: "a", value: 200 }),
      makeBenefit({ id: "b", value: null, cadence: "ongoing" }),
      makeBenefit({ id: "c", value: 100 }),
    ];
    expect(computeAvailableValue(benefits)).toBe(300);
  });

  it("returns 0 when all benefits have null value", () => {
    const benefits = [
      makeBenefit({ id: "a", value: null }),
      makeBenefit({ id: "b", value: null }),
    ];
    expect(computeAvailableValue(benefits)).toBe(0);
  });
});

describe("computeCapturedValue", () => {
  it("sums claim amounts when provided", () => {
    const benefits = [makeBenefit({ id: "uber", value: 200, cadence: "monthly" })];
    const claims = [
      { benefitId: "uber", claimedAt: new Date(2026, 0, 15), amount: "15" },
      { benefitId: "uber", claimedAt: new Date(2026, 1, 15), amount: "15" },
    ];
    expect(computeCapturedValue(claims, benefits, 2026)).toBe(30);
  });

  it("falls back to per-period value when claim amount is missing", () => {
    const benefits = [makeBenefit({ id: "uber", value: 240, cadence: "monthly" })];
    const claims = [
      { benefitId: "uber", claimedAt: new Date(2026, 0, 15), amount: null },
    ];
    // 240 / 12 = 20
    expect(computeCapturedValue(claims, benefits, 2026)).toBe(20);
  });

  it("filters by year correctly", () => {
    const benefits = [makeBenefit({ id: "uber", value: 200, cadence: "monthly" })];
    const claims = [
      { benefitId: "uber", claimedAt: new Date(2025, 5, 15), amount: "15" },
      { benefitId: "uber", claimedAt: new Date(2026, 0, 15), amount: "15" },
      { benefitId: "uber", claimedAt: new Date(2027, 0, 15), amount: "15" },
    ];
    // Only the 2026 claim should count
    expect(computeCapturedValue(claims, benefits, 2026)).toBe(15);
  });

  it("skips claims with null claimedAt", () => {
    const benefits = [makeBenefit({ id: "uber", value: 200, cadence: "monthly" })];
    const claims = [
      { benefitId: "uber", claimedAt: null, amount: "15" },
    ];
    expect(computeCapturedValue(claims, benefits, 2026)).toBe(0);
  });

  it("skips claims for benefits with null value", () => {
    const benefits = [makeBenefit({ id: "lounge", value: null, cadence: "ongoing" })];
    const claims = [
      { benefitId: "lounge", claimedAt: new Date(2026, 0, 15), amount: "50" },
    ];
    expect(computeCapturedValue(claims, benefits, 2026)).toBe(0);
  });

  it("returns 0 for empty claims", () => {
    const benefits = [makeBenefit({ id: "uber", value: 200, cadence: "monthly" })];
    expect(computeCapturedValue([], benefits, 2026)).toBe(0);
  });

  it("uses per-period value for quarterly benefit without amount", () => {
    const benefits = [makeBenefit({ id: "resy", value: 400, cadence: "quarterly" })];
    const claims = [
      { benefitId: "resy", claimedAt: new Date(2026, 0, 15), amount: null },
    ];
    // 400 / 4 = 100
    expect(computeCapturedValue(claims, benefits, 2026)).toBe(100);
  });
});

describe("computeMonthlyProgress", () => {
  it("returns correct captured and available for a monthly benefit", () => {
    const benefits = [makeBenefit({ id: "uber", value: 240, cadence: "monthly" })];
    const claims = [
      { benefitId: "uber", claimedAt: new Date(2026, 0, 15), amount: "20" },
    ];
    // month=1 (January), available = 240/12 = 20
    const result = computeMonthlyProgress(claims, benefits, 2026, 1);
    expect(result.captured).toBe(20);
    expect(result.available).toBe(20);
  });

  it("includes quarterly benefit in months it resets", () => {
    const benefits = [
      makeBenefit({
        id: "resy",
        value: 400,
        cadence: "quarterly",
        resetDay: null,
        resetMonths: [1, 4, 7, 10],
      }),
    ];
    // Month 1 is a reset month, so available = 400/4 = 100
    const result = computeMonthlyProgress([], benefits, 2026, 1);
    expect(result.available).toBe(100);
    expect(result.captured).toBe(0);
  });

  it("excludes quarterly benefit in non-reset months", () => {
    const benefits = [
      makeBenefit({
        id: "resy",
        value: 400,
        cadence: "quarterly",
        resetDay: null,
        resetMonths: [1, 4, 7, 10],
      }),
    ];
    // Month 2 is not a reset month
    const result = computeMonthlyProgress([], benefits, 2026, 2);
    expect(result.available).toBe(0);
  });

  it("filters claims by both year and month", () => {
    const benefits = [makeBenefit({ id: "uber", value: 200, cadence: "monthly" })];
    const claims = [
      { benefitId: "uber", claimedAt: new Date(2026, 0, 15), amount: "15" }, // Jan 2026
      { benefitId: "uber", claimedAt: new Date(2026, 1, 15), amount: "15" }, // Feb 2026
      { benefitId: "uber", claimedAt: new Date(2025, 0, 15), amount: "15" }, // Jan 2025
    ];
    const result = computeMonthlyProgress(claims, benefits, 2026, 1);
    expect(result.captured).toBe(15);
  });

  it("returns zeros when no benefits match the month", () => {
    const benefits = [
      makeBenefit({
        id: "resy",
        value: 400,
        cadence: "quarterly",
        resetMonths: [1, 4, 7, 10],
      }),
    ];
    const result = computeMonthlyProgress([], benefits, 2026, 3);
    expect(result).toEqual({ captured: 0, available: 0 });
  });
});
