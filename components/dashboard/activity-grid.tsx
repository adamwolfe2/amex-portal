"use client";

import { useMemo } from "react";

interface ActivityGridProps {
  /** ISO date strings of claim dates */
  claimDates: string[];
}

/**
 * GitHub-style contribution grid showing benefit redemption activity
 * over the past 6 months. Each cell = 1 day. Darker = more claims.
 */
export function ActivityGrid({ claimDates }: ActivityGridProps) {
  const { weeks, months, totalClaims, activeDays } = useMemo(() => {
    const now = new Date();
    const daysBack = 182; // ~6 months
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);
    // Align to start of week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Count claims per day
    const countMap = new Map<string, number>();
    let total = 0;
    for (const d of claimDates) {
      const key = d.slice(0, 10); // YYYY-MM-DD
      countMap.set(key, (countMap.get(key) ?? 0) + 1);
      total++;
    }

    // Build weeks array
    const weeksArr: { date: Date; count: number; key: string }[][] = [];
    let currentWeek: { date: Date; count: number; key: string }[] = [];
    const cursor = new Date(startDate);
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 1);

    while (cursor <= endDate) {
      const key =
        cursor.getFullYear() +
        "-" +
        String(cursor.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(cursor.getDate()).padStart(2, "0");
      currentWeek.push({
        date: new Date(cursor),
        count: countMap.get(key) ?? 0,
        key,
      });
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (currentWeek.length > 0) {
      weeksArr.push(currentWeek);
    }

    // Build month labels
    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeksArr.forEach((week, wi) => {
      const mid = week[Math.min(3, week.length - 1)];
      const m = mid.date.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({
          label: mid.date.toLocaleString("en-US", { month: "short" }),
          weekIndex: wi,
        });
        lastMonth = m;
      }
    });

    const active = new Set(
      claimDates
        .map((d) => d.slice(0, 10))
        .filter((k) => {
          const date = new Date(k);
          return date >= startDate && date <= now;
        })
    ).size;

    return { weeks: weeksArr, months: monthLabels, totalClaims: total, activeDays: active };
  }, [claimDates]);

  const isFuture = (date: Date) => date > new Date();

  function getCellColor(count: number): string {
    if (count === 0) return "bg-[#ebedf0]";
    if (count === 1) return "bg-[#c6cdd5]";
    if (count === 2) return "bg-[#8b95a1]";
    if (count === 3) return "bg-[#545d69]";
    return "bg-[#1a1a2e]";
  }

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#111111]">
          Benefit Activity
        </span>
        <span className="text-[11px] text-[#999999]">
          {totalClaims} actions &middot; {activeDays} active days
        </span>
      </div>

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-1 ml-0">
          {months.map((m, i) => (
            <span
              key={`${m.label}-${i}`}
              className="text-[10px] text-[#999999]"
              style={{
                position: "relative",
                left: `${m.weekIndex * 14}px`,
                marginRight: i < months.length - 1
                  ? `${((months[i + 1]?.weekIndex ?? 0) - m.weekIndex) * 14 - 28}px`
                  : 0,
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-0.5 sm:gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5 sm:gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.key}
                  className={`w-2.5 h-2.5 sm:w-[11px] sm:h-[11px] rounded-[2px] transition-colors ${
                    isFuture(day.date)
                      ? "bg-transparent"
                      : getCellColor(day.count)
                  }`}
                  title={
                    isFuture(day.date)
                      ? ""
                      : `${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${day.count} action${day.count !== 1 ? "s" : ""}`
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-[#999999]">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-2.5 h-2.5 sm:w-[11px] sm:h-[11px] rounded-[2px] ${getCellColor(level)}`}
          />
        ))}
        <span className="text-[10px] text-[#999999]">More</span>
      </div>
    </div>
  );
}
