"use client";

import { useState, useEffect } from "react";
import { Flame, Check, Clock } from "lucide-react";

const monthlyBenefits = [
  { name: "Uber Cash", card: "Platinum", value: 15 },
  { name: "Digital Entertainment", card: "Platinum", value: 25 },
  { name: "Dining Credit", card: "Gold", value: 10 },
  { name: "Walmart+", card: "Platinum", value: 12.95 },
  { name: "Dunkin' Credit", card: "Gold", value: 7 },
  { name: "CLEAR Plus", card: "Platinum", value: 13 },
];

const totalValue = monthlyBenefits.reduce((sum, b) => sum + b.value, 0);
const capturedValue = 47.95;
const actualPct = Math.round((capturedValue / totalValue) * 100);

const upcomingResets = [
  { name: "Uber Cash", card: "Platinum", daysLeft: 1, urgency: "high" },
  { name: "Dining Credit", card: "Gold", daysLeft: 4, urgency: "medium" },
];

export function DashboardDemo() {
  const [displayPct, setDisplayPct] = useState(0);
  const [claimed, setClaimed] = useState<Set<number>>(new Set([2, 4]));

  useEffect(() => {
    const t = setTimeout(() => setDisplayPct(actualPct), 150);
    return () => clearTimeout(t);
  }, []);

  function toggle(index: number) {
    setClaimed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="bg-white min-h-full px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-base font-bold text-[#111111]">CreditOS</p>
        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          <span className="text-xs font-semibold text-orange-600">7</span>
        </div>
      </div>

      {/* THIS MONTH section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-2 mb-2">
        This Month
      </p>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-semibold text-[#111111]">
          $47.95 <span className="text-[#999999] font-normal">/ $79.95</span>
        </p>
        <p className="text-sm font-semibold text-[#1a1a2e]">{displayPct}% captured</p>
      </div>
      <div className="h-2 bg-[#f0eeeb] rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-[#1a1a2e] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${displayPct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-1">
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <p className="text-base font-bold text-[#111111]">7</p>
          </div>
          <p className="text-[10px] text-[#666666]">Streak</p>
        </div>
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-[#111111] tabular-nums">$47.95</p>
          <p className="text-[10px] text-[#666666]">Captured</p>
        </div>
        <div className="bg-[#f0efed] rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-emerald-600 tabular-nums">3.8x</p>
          <p className="text-[10px] text-[#666666]">ROI</p>
        </div>
      </div>

      {/* MONTHLY CREDITS section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Monthly Credits
      </p>
      <div>
        {monthlyBenefits.map((benefit, i) => {
          const done = claimed.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex items-center gap-3 w-full py-2.5 border-b border-[#f0eeeb] text-left cursor-pointer transition-colors ${
                done ? "bg-[#f8f8f6]" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  done
                    ? "bg-[#1a1a2e] border-[#1a1a2e]"
                    : "border-[#ccc9c4]"
                }`}
              >
                {done && <Check className="h-3 w-3 text-white" />}
              </div>
              <span
                className={`flex-1 text-sm transition-all duration-200 ${
                  done ? "line-through text-[#999999]" : "text-[#111111] font-medium"
                }`}
              >
                {benefit.name}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  benefit.card === "Platinum"
                    ? "bg-[#1a1a2e]/10 text-[#1a1a2e]"
                    : "bg-[#8B6914]/10 text-[#8B6914]"
                }`}
              >
                {benefit.card}
              </span>
              <span
                className={`text-sm tabular-nums min-w-[40px] text-right transition-all duration-200 ${
                  done ? "text-[#999999]" : "font-semibold text-[#111111]"
                }`}
              >
                ${benefit.value}
              </span>
            </button>
          );
        })}
      </div>

      {/* UPCOMING RESETS section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Upcoming Resets
      </p>
      <div>
        {upcomingResets.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 border-b border-[#f0eeeb]"
          >
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.urgency === "high" ? "bg-red-500" : "bg-amber-400"
              }`}
            />
            <Clock className="h-3.5 w-3.5 text-[#999999]" />
            <span className="flex-1 text-sm text-[#111111]">{item.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                item.card === "Platinum"
                  ? "bg-[#1a1a2e]/10 text-[#1a1a2e]"
                  : "bg-[#8B6914]/10 text-[#8B6914]"
              }`}
            >
              {item.card}
            </span>
            <span
              className={`text-xs font-semibold ${
                item.urgency === "high" ? "text-red-600" : "text-amber-600"
              }`}
            >
              {item.daysLeft}d left
            </span>
          </div>
        ))}
      </div>

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  );
}
