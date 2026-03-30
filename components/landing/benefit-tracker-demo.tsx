"use client";

import { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";

const monthlyBenefits = [
  { name: "Uber Cash", card: "Platinum", value: 15 },
  { name: "Digital Entertainment", card: "Platinum", value: 25 },
  { name: "Dining Credit", card: "Gold", value: 10 },
  { name: "Walmart+", card: "Platinum", value: 12.95 },
  { name: "Dunkin' Credit", card: "Gold", value: 7 },
  { name: "Uber Cash", card: "Gold", value: 10 },
];

const annualBenefits = [
  { name: "Global Entry", card: "Platinum", value: 100, status: "claimed" as const },
  { name: "CLEAR Plus", card: "Platinum", value: 189, status: "warning" as const },
  { name: "Airline Fee Credit", card: "Platinum", value: 200, status: "claimed" as const },
];

const totalMonthly = monthlyBenefits.reduce((sum, b) => sum + b.value, 0);

export function BenefitTrackerDemo() {
  const [claimed, setClaimed] = useState<Set<number>>(new Set([2]));
  const [displayPct, setDisplayPct] = useState(0);

  const claimedValue = monthlyBenefits.reduce(
    (sum, b, i) => (claimed.has(i) ? sum + b.value : sum),
    0
  );
  const actualPct = Math.round((47.95 / totalMonthly) * 100);

  useEffect(() => {
    const t = setTimeout(() => setDisplayPct(actualPct), 150);
    return () => clearTimeout(t);
  }, [actualPct]);

  function toggle(index: number) {
    setClaimed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  const progressPct = Math.round((claimedValue / totalMonthly) * 100);

  return (
    <div className="bg-white min-h-full px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-base font-bold text-[#111111]">Benefits</p>
        <p className="text-sm text-[#666666]">March</p>
      </div>

      {/* Progress section */}
      <div className="text-center mb-4">
        <p className="text-4xl font-bold text-[#1a1a2e] tabular-nums">{displayPct}%</p>
        <div className="h-2.5 bg-[#f0eeeb] rounded-full mt-3 mb-2 overflow-hidden">
          <div
            className="h-full bg-[#1a1a2e] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-[#666666]">
          ${claimedValue.toFixed(2)} of ${totalMonthly.toFixed(2)} captured
        </p>
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

      {/* ANNUAL SETUP section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Annual Setup
      </p>
      <div>
        {annualBenefits.map((benefit, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 border-b border-[#f0eeeb]"
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                benefit.status === "claimed"
                  ? "bg-[#1a1a2e]"
                  : benefit.status === "warning"
                  ? "bg-[#8B6914]"
                  : "bg-[#f0eeeb]"
              }`}
            >
              {benefit.status === "claimed" ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <AlertCircle className="h-3 w-3 text-white" />
              )}
            </div>
            <span
              className={`flex-1 text-sm ${
                benefit.status === "warning"
                  ? "text-[#8B6914]"
                  : benefit.status === "claimed"
                  ? "text-[#999999] line-through"
                  : "text-[#111111] font-medium"
              }`}
            >
              {benefit.name}
              {benefit.status === "warning" && (
                <span className="ml-1.5 text-[10px] font-medium text-[#8B6914] no-underline">
                  not enrolled
                </span>
              )}
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
              className={`text-sm font-semibold tabular-nums min-w-[40px] text-right ${
                benefit.status === "claimed" ? "text-[#999999]" : "text-[#111111]"
              }`}
            >
              ${benefit.value}
            </span>
          </div>
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}
