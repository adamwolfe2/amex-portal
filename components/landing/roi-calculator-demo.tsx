"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const cards = {
  platinum: {
    name: "Platinum",
    fee: 895,
    value: 3105,
    color: "#1a1a2e",
  },
  gold: {
    name: "Gold",
    fee: 325,
    value: 1551,
    color: "#8B6914",
  },
};

export function ROICalculatorDemo() {
  const [active, setActive] = useState({ platinum: true, gold: true });

  const totalFees =
    (active.platinum ? cards.platinum.fee : 0) +
    (active.gold ? cards.gold.fee : 0);
  const totalValue =
    (active.platinum ? cards.platinum.value : 0) +
    (active.gold ? cards.gold.value : 0);
  const netROI = totalValue - totalFees;
  const positive = netROI >= 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e0ddd9] p-5 sm:p-6 max-w-md mx-auto">
      <p className="text-sm font-semibold text-[#111111] mb-4">
        Card ROI Calculator
      </p>

      <div className="flex gap-3 mb-6">
        {(["platinum", "gold"] as const).map((key) => {
          const card = cards[key];
          const isActive = active[key];
          return (
            <button
              key={key}
              onClick={() =>
                setActive((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-current text-white"
                  : "border-[#e0ddd9] text-[#999999] bg-[#fafaf9]"
              }`}
              style={
                isActive ? { backgroundColor: card.color, borderColor: card.color } : undefined
              }
            >
              {card.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-3 rounded-xl bg-[#f0eeeb]">
          <p className="text-xs text-[#666666] mb-1">Value</p>
          <p className="text-lg font-bold text-[#111111] tabular-nums">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 rounded-xl bg-[#f0eeeb]">
          <p className="text-xs text-[#666666] mb-1">Fees</p>
          <p className="text-lg font-bold text-[#111111] tabular-nums">
            ${totalFees.toLocaleString()}
          </p>
        </div>
        <div
          className={`text-center p-3 rounded-xl ${
            positive ? "bg-emerald-50" : "bg-red-50"
          }`}
        >
          <p className="text-xs text-[#666666] mb-1">Net ROI</p>
          <p
            className={`text-lg font-bold tabular-nums ${
              positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {positive ? "+" : ""}${netROI.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center">
        {positive ? (
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <p
          className={`text-sm font-medium ${
            positive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {positive
            ? "Your cards are paying for themselves!"
            : "Toggle cards to see your ROI"}
        </p>
      </div>
    </div>
  );
}
