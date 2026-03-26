"use client";

import { Flame } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
}: StreakCounterProps) {
  const active = currentStreak > 0;

  return (
    <div className="border border-[#e0ddd9] rounded-lg p-4 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <Flame
          className={`h-5 w-5 ${active ? "text-[#8B6914]" : "text-[#999999]"}`}
        />
        <span
          className="text-2xl font-semibold text-[#111111]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {currentStreak}
        </span>
      </div>
      <p className="text-[11px] text-[#999999]">
        Month streak
      </p>
      {longestStreak > 0 && (
        <p className="text-xs text-[#666666] mt-1">
          Longest: {longestStreak} month{longestStreak !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
