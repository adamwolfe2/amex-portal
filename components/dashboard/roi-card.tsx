"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface ROICardProps {
  captured: number;
  totalFees: number;
}

export function ROICard({ captured, totalFees }: ROICardProps) {
  const net = captured - totalFees;
  const positive = net >= 0;

  return (
    <div className="border border-[#e0ddd9] rounded-lg p-4 bg-white">
      <span className="text-sm font-semibold text-[#111111]">Card ROI</span>
      <div className="flex items-center gap-2 mt-2 mb-1">
        {positive ? (
          <TrendingUp className="h-5 w-5 text-[#111111]" />
        ) : (
          <TrendingDown className="h-5 w-5 text-[#999999]" />
        )}
        <span
          className="text-2xl font-semibold text-[#111111]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {positive ? "+" : "-"}${Math.abs(net).toLocaleString()}
        </span>
      </div>
      <p className="text-xs text-[#666666]">
        ${captured.toLocaleString()} earned vs ${totalFees.toLocaleString()} in fees
      </p>
    </div>
  );
}
