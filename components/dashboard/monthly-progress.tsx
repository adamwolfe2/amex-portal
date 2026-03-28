"use client";

import { useState, useEffect } from "react";

interface MonthlyProgressProps {
  captured: number;
  available: number;
  urgencyMessage: string;
}

export function MonthlyProgress({
  captured,
  available,
  urgencyMessage,
}: MonthlyProgressProps) {
  const percent = available > 0 ? Math.min(100, Math.round((captured / available) * 100)) : 0;
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayPercent(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="border border-[#e0ddd9] rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#111111]">This Month</span>
        <span className="text-[11px] text-[#999999]">{percent}%</span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span
          className="text-2xl font-semibold text-[#111111]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          ${captured}
        </span>
        <span className="text-sm text-[#999999]">of ${available}</span>
      </div>
      <div className="w-full h-1.5 bg-[#f0eeeb] rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${displayPercent}%`, backgroundColor: "#1a1a2e" }}
        />
      </div>
      <p className="text-xs text-[#666666]">{urgencyMessage}</p>
    </div>
  );
}
