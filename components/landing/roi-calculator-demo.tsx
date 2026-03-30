"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";

const cards = {
  platinum: { name: "Platinum", fee: 895, value: 3105 },
  gold: { name: "Gold", fee: 325, value: 1551 },
};

export function ROICalculatorDemo() {
  const [active, setActive] = useState({ platinum: true, gold: true });
  const [barWidth, setBarWidth] = useState(0);

  const totalValue =
    (active.platinum ? cards.platinum.value : 0) +
    (active.gold ? cards.gold.value : 0);
  const totalFees =
    (active.platinum ? cards.platinum.fee : 0) +
    (active.gold ? cards.gold.fee : 0);
  const netROI = totalValue - totalFees;

  const platNet = cards.platinum.value - cards.platinum.fee;
  const goldNet = cards.gold.value - cards.gold.fee;

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(100), 150);
    return () => clearTimeout(t);
  }, []);

  const feesRatio = totalValue > 0 ? (totalFees / totalValue) * 100 : 0;
  const netRatio = totalValue > 0 ? (netROI / totalValue) * 100 : 0;

  return (
    <div className="bg-white min-h-full px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-base font-bold text-[#111111]">ROI Calculator</p>
      </div>

      {/* Card toggles — show card images */}
      <div className="flex gap-3 mb-5">
        {(["platinum", "gold"] as const).map((key) => {
          const isActive = active[key];
          return (
            <button
              key={key}
              onClick={() => setActive((prev) => ({ ...prev, [key]: !prev[key] }))}
              className={`flex-1 rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-center py-2 ${
                isActive ? "border-[#1a1a2e] shadow-sm" : "border-[#e0ddd9] opacity-40"
              }`}
            >
              <img
                src={key === "platinum" ? "/platinum-card.png" : "/gold-card.png"}
                alt={key === "platinum" ? "Amex Platinum" : "Amex Gold"}
                style={{ height: 44, objectFit: "contain", mixBlendMode: "multiply" }}
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      {/* Big ROI display */}
      <div className="text-center mb-5">
        <p className="text-[40px] font-bold text-[#1a1a2e] tabular-nums leading-none">
          +${netROI.toLocaleString()}
        </p>
        <p className="text-xs text-[#666666] mt-1">net return this year</p>
      </div>

      {/* Bar chart */}
      <div className="space-y-2.5 mb-5">
        {/* Value row */}
        <div className="flex items-center gap-2">
          <p className="text-xs text-[#666666] w-10 flex-shrink-0">Value</p>
          <div className="flex-1 h-5 bg-[#f0eeeb] rounded overflow-hidden">
            <div
              className="h-full bg-[#1a1a2e] rounded transition-all duration-700 ease-out"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-[#111111] tabular-nums w-14 text-right">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        {/* Fees row */}
        <div className="flex items-center gap-2">
          <p className="text-xs text-[#666666] w-10 flex-shrink-0">Fees</p>
          <div className="flex-1 h-5 bg-[#f0eeeb] rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-700 ease-out"
              style={{ width: `${(feesRatio * barWidth) / 100}%`, background: "#c4c0bb" }}
            />
          </div>
          <p className="text-xs font-semibold text-[#111111] tabular-nums w-14 text-right">
            ${totalFees.toLocaleString()}
          </p>
        </div>
        {/* Net row */}
        <div className="flex items-center gap-2">
          <p className="text-xs text-[#666666] w-10 flex-shrink-0">Net</p>
          <div className="flex-1 h-5 bg-[#f0eeeb] rounded overflow-hidden">
            <div
              className="h-full bg-[#1a1a2e] rounded transition-all duration-700 ease-out"
              style={{ width: `${(netRatio * barWidth) / 100}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-[#1a1a2e] tabular-nums w-14 text-right">
            +${netROI.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#f0eeeb] mb-3" />

      {/* Per-card breakdown */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Breakdown
      </p>

      {/* Header row */}
      <div className="flex items-center py-1.5 mb-0.5">
        <p className="flex-1 text-[10px] text-[#999999] uppercase tracking-wider">Card</p>
        <p className="text-[10px] text-[#999999] w-14 text-right">Value</p>
        <p className="text-[10px] text-[#999999] w-14 text-right">Fee</p>
        <p className="text-[10px] text-[#999999] w-14 text-right">Net</p>
      </div>

      <div className="flex items-center py-2.5 border-b border-[#f0eeeb]">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />
          <p className="text-sm font-medium text-[#111111]">Platinum</p>
        </div>
        <p className="text-sm tabular-nums text-[#111111] w-14 text-right">
          ${cards.platinum.value.toLocaleString()}
        </p>
        <p className="text-sm tabular-nums text-[#666666] w-14 text-right">
          ${cards.platinum.fee}
        </p>
        <p className="text-sm font-semibold tabular-nums text-[#1a1a2e] w-14 text-right">
          +${platNet.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center py-2.5 border-b border-[#f0eeeb]">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#8B6914]" />
          <p className="text-sm font-medium text-[#111111]">Gold</p>
        </div>
        <p className="text-sm tabular-nums text-[#111111] w-14 text-right">
          ${cards.gold.value.toLocaleString()}
        </p>
        <p className="text-sm tabular-nums text-[#666666] w-14 text-right">
          ${cards.gold.fee}
        </p>
        <p className="text-sm font-semibold tabular-nums text-[#1a1a2e] w-14 text-right">
          +${goldNet.toLocaleString()}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <TrendingUp className="h-4 w-4 text-[#1a1a2e]" />
        <p className="text-sm font-medium text-[#1a1a2e]">
          Your cards are paying for themselves!
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}
