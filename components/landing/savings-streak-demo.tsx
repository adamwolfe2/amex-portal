"use client";

import { useState, useEffect, useRef } from "react";
import { Flame, Trophy } from "lucide-react";

export function SavingsStreakDemo() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const targetStreak = 7;
  const longestStreak = 9;

  const months = [
    { label: "Sep", claimed: true },
    { label: "Oct", claimed: true },
    { label: "Nov", claimed: false },
    { label: "Dec", claimed: true },
    { label: "Jan", claimed: true },
    { label: "Feb", claimed: true },
    { label: "Mar", claimed: true },
  ];

  // Count up animation triggered by intersection
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          let count = 0;
          const interval = setInterval(() => {
            count++;
            setCurrentStreak(count);
            if (count >= targetStreak) clearInterval(interval);
          }, 120);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-[#e0ddd9] p-5 sm:p-6 max-w-md mx-auto"
    >
      <p className="text-sm font-semibold text-[#111111] mb-5">
        Savings Streak
      </p>

      <div className="flex items-center justify-center gap-8 mb-6">
        {/* Current Streak */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 mb-2">
            <Flame
              className={`h-8 w-8 text-orange-500 ${
                currentStreak >= targetStreak ? "animate-pulse" : ""
              }`}
            />
            <span className="absolute -bottom-1 -right-1 bg-[#1a1a2e] text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center tabular-nums">
              {currentStreak}
            </span>
          </div>
          <p className="text-xs text-[#666666]">Current Streak</p>
          <p className="text-sm font-semibold text-[#111111]">
            {currentStreak} months
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-[#e0ddd9]" />

        {/* Best Streak */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-yellow-50 mb-2">
            <Trophy className="h-8 w-8 text-[#8B6914]" />
            <span className="absolute -bottom-1 -right-1 bg-[#8B6914] text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center tabular-nums">
              {longestStreak}
            </span>
          </div>
          <p className="text-xs text-[#666666]">Personal Best</p>
          <p className="text-sm font-semibold text-[#111111]">
            {longestStreak} months
          </p>
        </div>
      </div>

      {/* Monthly pills */}
      <div className="flex gap-2 justify-center">
        {months.map((m, i) => (
          <div key={i} className="text-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 text-xs font-medium ${
                m.claimed
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-[#f0eeeb] text-[#999999]"
              }`}
            >
              {m.claimed ? "✓" : "✕"}
            </div>
            <span className="text-[10px] text-[#666666]">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
