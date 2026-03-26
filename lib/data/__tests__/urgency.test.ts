import { describe, it, expect, vi, afterEach } from "vitest";
import { getUrgencyMessage, getDaysRemainingInMonth } from "../urgency";

describe("getUrgencyMessage", () => {
  it('returns "All caught up this month" when 0 unclaimed', () => {
    expect(getUrgencyMessage(0, 15)).toBe("All caught up this month");
  });

  it('returns "All caught up this month" when 0 unclaimed regardless of days', () => {
    expect(getUrgencyMessage(0, 1)).toBe("All caught up this month");
    expect(getUrgencyMessage(0, 30)).toBe("All caught up this month");
  });

  it("uses plural form for multiple credits expiring in multiple days (<=3)", () => {
    expect(getUrgencyMessage(3, 2)).toBe("3 credits expiring in 2 days");
  });

  it("uses singular form for 1 credit expiring in 1 day", () => {
    expect(getUrgencyMessage(1, 1)).toBe("1 credit expiring in 1 day");
  });

  it("uses singular credit with plural days", () => {
    expect(getUrgencyMessage(1, 3)).toBe("1 credit expiring in 3 days");
  });

  it("uses plural credits with singular day", () => {
    expect(getUrgencyMessage(5, 1)).toBe("5 credits expiring in 1 day");
  });

  it('shows "expiring this week" for 4-7 days remaining', () => {
    expect(getUrgencyMessage(3, 5)).toBe("3 credits expiring this week");
    expect(getUrgencyMessage(1, 7)).toBe("1 credit expiring this week");
    expect(getUrgencyMessage(2, 4)).toBe("2 credits expiring this week");
  });

  it('shows "available to claim" for >7 days remaining', () => {
    expect(getUrgencyMessage(3, 15)).toBe("3 credits available to claim");
    expect(getUrgencyMessage(1, 20)).toBe("1 credit available to claim");
  });

  it("handles boundary at exactly 3 days (should show expiring in N days)", () => {
    expect(getUrgencyMessage(2, 3)).toBe("2 credits expiring in 3 days");
  });

  it("handles boundary at exactly 7 days (should show expiring this week)", () => {
    expect(getUrgencyMessage(2, 7)).toBe("2 credits expiring this week");
  });

  it("handles boundary at 8 days (should show available to claim)", () => {
    expect(getUrgencyMessage(2, 8)).toBe("2 credits available to claim");
  });
});

describe("getDaysRemainingInMonth", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns correct value for mid-month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 15)); // March 15, 2026 (31-day month)
    expect(getDaysRemainingInMonth()).toBe(16); // 31 - 15
  });

  it("returns 0 on last day of month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 31)); // March 31, 2026
    expect(getDaysRemainingInMonth()).toBe(0);
  });

  it("returns correct value for February (non-leap year)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 1)); // Feb 1, 2026
    expect(getDaysRemainingInMonth()).toBe(27); // 28 - 1
  });

  it("returns correct value for February (leap year)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2028, 1, 1)); // Feb 1, 2028 (leap year)
    expect(getDaysRemainingInMonth()).toBe(28); // 29 - 1
  });

  it("returns correct value on first day of 30-day month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 1)); // April 1, 2026
    expect(getDaysRemainingInMonth()).toBe(29); // 30 - 1
  });
});
