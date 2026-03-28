"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const benefits = [
  { name: "Uber Cash", value: 15, card: "Platinum" },
  { name: "Digital Entertainment", value: 25, card: "Platinum" },
  { name: "Dining Credit", value: 10, card: "Gold" },
  { name: "Walmart+", value: 12.95, card: "Platinum" },
  { name: "Dunkin' Credit", value: 7, card: "Gold" },
  { name: "Uber Cash", value: 10, card: "Gold" },
];

const totalValue = benefits.reduce((sum, b) => sum + b.value, 0);

export function BenefitTrackerDemo() {
  const [claimed, setClaimed] = useState<Set<number>>(new Set());

  const claimedValue = benefits.reduce(
    (sum, b, i) => (claimed.has(i) ? sum + b.value : sum),
    0
  );
  const progress = (claimedValue / totalValue) * 100;

  function toggle(index: number) {
    setClaimed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e0ddd9] p-5 sm:p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-[#111111]">
          This Month&apos;s Credits
        </p>
        <p className="text-sm font-semibold text-[#111111] tabular-nums">
          {Math.round(progress)}%
        </p>
      </div>
      <div className="h-2 bg-[#f0eeeb] rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-[#1a1a2e] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-2xl font-bold text-[#111111] tabular-nums">
          ${claimedValue.toFixed(2)}
        </p>
        <p className="text-sm text-[#666666]">
          of ${totalValue.toFixed(2)} available
        </p>
      </div>
      <div className="space-y-0 divide-y divide-[#f0eeeb]">
        {benefits.map((benefit, i) => {
          const done = claimed.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="flex items-center gap-3 w-full py-3 text-left group cursor-pointer"
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  done
                    ? "bg-[#1a1a2e] border-[#1a1a2e]"
                    : "border-[#ccc9c4] group-hover:border-[#1a1a2e]"
                }`}
              >
                {done && <Check className="h-3 w-3 text-white" />}
              </div>
              <span
                className={`flex-1 text-sm transition-all duration-200 ${
                  done
                    ? "line-through text-[#999999]"
                    : "text-[#111111] font-medium"
                }`}
              >
                {benefit.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  benefit.card === "Platinum"
                    ? "bg-[#1a1a2e]/10 text-[#1a1a2e]"
                    : "bg-[#8B6914]/10 text-[#8B6914]"
                }`}
              >
                {benefit.card}
              </span>
              <span
                className={`text-sm tabular-nums transition-all duration-200 ${
                  done ? "text-[#999999]" : "text-[#111111] font-semibold"
                }`}
              >
                ${benefit.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
