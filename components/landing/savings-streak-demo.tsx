"use client";

import { useState, useEffect, useRef } from "react";
import { Flame, Trophy, Check, X, Award, Star, DollarSign } from "lucide-react";

const months = [
  { label: "Jan", status: "claimed" as const },
  { label: "Feb", status: "claimed" as const },
  { label: "Mar", status: "claimed" as const },
  { label: "Apr", status: "future" as const },
  { label: "May", status: "future" as const },
  { label: "Jun", status: "future" as const },
  { label: "Jul", status: "future" as const },
  { label: "Aug", status: "future" as const },
  { label: "Sep", status: "future" as const },
  { label: "Oct", status: "future" as const },
  { label: "Nov", status: "missed" as const },
  { label: "Dec", status: "future" as const },
];

const achievements = [
  { label: "First Claim", icon: Award, locked: false },
  { label: "Month Streak", icon: Flame, locked: false },
  { label: "High Roller", icon: DollarSign, locked: true },
];

export function SavingsStreakDemo() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const targetStreak = 7;

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
    <div ref={ref} className="bg-white min-h-full px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-base font-bold text-[#111111]">Streak</p>
      </div>

      {/* Big streak display */}
      <div className="flex flex-col items-center mb-4">
        <Flame className="h-12 w-12 text-orange-500 animate-pulse mb-1" />
        <p className="text-5xl font-bold text-[#111111] tabular-nums">{currentStreak}</p>
        <p className="text-sm text-[#666666] mt-1">month streak</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Trophy className="h-3.5 w-3.5 text-[#8B6914]" />
          </div>
          <p className="text-sm font-bold text-[#111111]">9 months</p>
          <p className="text-[10px] text-[#666666]">Personal Best</p>
        </div>
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <p className="text-sm font-bold text-[#111111] tabular-nums">47</p>
          <p className="text-[10px] text-[#666666]">Total Claims</p>
        </div>
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <p className="text-sm font-bold text-[#111111] tabular-nums">6</p>
          <p className="text-[10px] text-[#666666]">This Month</p>
        </div>
      </div>

      {/* THIS YEAR section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        This Year
      </p>
      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                m.status === "claimed"
                  ? "bg-[#1a1a2e]"
                  : m.status === "missed"
                  ? "bg-[#c7c3bd]"
                  : "bg-[#f0eeeb]"
              }`}
            >
              {m.status === "claimed" ? (
                <Check className="h-4 w-4 text-white" />
              ) : m.status === "missed" ? (
                <X className="h-4 w-4 text-[#666666]" />
              ) : null}
            </div>
            <span className="text-[10px] text-[#999999]">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Motivational section */}
      <div className="mt-4 bg-[#1a1a2e]/5 rounded-xl p-3.5">
        <p className="text-sm font-semibold text-[#1a1a2e] mb-1">Keep it going!</p>
        <p className="text-xs text-[#666666] leading-relaxed">
          You&apos;re on a 7-month streak. Claim your March credits before April 1st.
        </p>
      </div>

      {/* ACHIEVEMENTS section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Achievements
      </p>
      <div className="grid grid-cols-3 gap-2">
        {achievements.map((ach, i) => {
          const Icon = ach.icon;
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${
                ach.locked ? "bg-[#f0eeeb]" : "bg-[#1a1a2e]/5"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ach.locked ? "bg-[#e0ddd9]" : "bg-[#1a1a2e]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    ach.locked ? "text-[#999999]" : "text-white"
                  }`}
                />
              </div>
              <p
                className={`text-[10px] font-medium text-center leading-tight ${
                  ach.locked ? "text-[#999999]" : "text-[#111111]"
                }`}
              >
                {ach.label}
              </p>
              {ach.locked && (
                <span className="text-[9px] text-[#bbb]">Locked</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-4" />
    </div>
  );
}
