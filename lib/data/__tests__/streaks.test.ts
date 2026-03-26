import { describe, it, expect, vi, afterEach } from "vitest";
import { computeStreak } from "../streaks";

function makeDate(year: number, month: number, day = 15): Date {
  return new Date(year, month - 1, day);
}

describe("computeStreak", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns {current: 0, longest: 0} for no claims", () => {
    const result = computeStreak([]);
    expect(result).toEqual({ current: 0, longest: 0 });
  });

  it("returns {current: 1, longest: 1} for claims only in current month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 15)); // March 2026

    const result = computeStreak([makeDate(2026, 3, 10)]);
    expect(result).toEqual({ current: 1, longest: 1 });
  });

  it("returns {current: 2, longest: 2} for claims in current + previous month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 15)); // March 2026

    const result = computeStreak([
      makeDate(2026, 2, 5), // Feb
      makeDate(2026, 3, 10), // Mar
    ]);
    expect(result).toEqual({ current: 2, longest: 2 });
  });

  it("handles gap correctly (Jan + Mar, not Feb)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 15)); // March 2026

    const result = computeStreak([
      makeDate(2026, 1, 10), // Jan
      makeDate(2026, 3, 10), // Mar (current month)
    ]);
    // Current streak is 1 (only March, gap in Feb breaks it)
    // Longest is 1 (each active month is isolated)
    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
  });

  it("tracks claims spanning 6+ consecutive months", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15)); // June 2026

    const claims = [
      makeDate(2026, 1, 5), // Jan
      makeDate(2026, 2, 5), // Feb
      makeDate(2026, 3, 5), // Mar
      makeDate(2026, 4, 5), // Apr
      makeDate(2026, 5, 5), // May
      makeDate(2026, 6, 5), // Jun (current)
    ];

    const result = computeStreak(claims);
    expect(result.current).toBe(6);
    expect(result.longest).toBe(6);
  });

  it("does not double-count multiple claims in the same month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 15)); // March 2026

    const claims = [
      makeDate(2026, 3, 1),
      makeDate(2026, 3, 5),
      makeDate(2026, 3, 20),
    ];

    const result = computeStreak(claims);
    // Three claims in March still counts as 1 month
    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
  });

  it("correctly identifies longest streak when it's not the current streak", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15)); // June 2026

    const claims = [
      // Long streak: Jan-Apr (4 months)
      makeDate(2026, 1, 5),
      makeDate(2026, 2, 5),
      makeDate(2026, 3, 5),
      makeDate(2026, 4, 5),
      // Gap in May
      // Current: June only (1 month)
      makeDate(2026, 6, 5),
    ];

    const result = computeStreak(claims);
    expect(result.current).toBe(1);
    expect(result.longest).toBe(4);
  });
});
