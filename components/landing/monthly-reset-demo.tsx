"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Check } from "lucide-react";

const expiringBenefits = [
  { name: "Uber Cash", card: "Platinum", value: 15, urgency: "high" as const },
  { name: "Digital Entertainment", card: "Platinum", value: 25, urgency: "high" as const },
  { name: "Dining Credit", card: "Gold", value: 10, urgency: "high" as const },
  { name: "Dunkin' Credit", card: "Gold", value: 7, urgency: "medium" as const },
  { name: "Walmart+", card: "Platinum", value: 12.95, urgency: "medium" as const },
];

const claimedBenefits = [
  { name: "CLEAR Plus", card: "Platinum", value: 13 },
  { name: "Hotel Credit", card: "Platinum", value: 50 },
];

const totalAtRisk = expiringBenefits.reduce((sum, b) => sum + b.value, 0);

function getDaysRemaining() {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.max(
    0,
    Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
}

export function MonthlyResetDemo() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    setDaysLeft(getDaysRemaining());
  }, []);

  return (
    <div className="bg-white min-h-full px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-base font-bold text-[#111111]">Resets</p>
        <div className="flex items-center gap-1 bg-[#f0efed] px-2.5 py-1 rounded-full">
          <span className="text-xs font-semibold text-[#1a1a2e]">
            {daysLeft !== null ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left` : "—"}
          </span>
        </div>
      </div>

      {/* Alert banner */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-white/70 flex-shrink-0" />
          <div>
            <p className="text-xl font-bold text-white tabular-nums">
              ${totalAtRisk.toFixed(2)} at risk
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              {expiringBenefits.length} credits expire this month
            </p>
          </div>
        </div>
      </div>

      {/* EXPIRING SOON section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Expiring Soon
      </p>
      <div>
        {expiringBenefits.map((benefit, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 border-b border-[#f0eeeb]"
          >
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                benefit.urgency === "high" ? "bg-[#1a1a2e]" : "bg-[#8B6914]"
              }`}
            />
            <span className="flex-1 text-sm text-[#111111] font-medium">
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
            <span className="text-sm font-semibold text-[#111111] tabular-nums min-w-[44px] text-right">
              ${benefit.value}
            </span>
            {benefit.urgency === "high" && (
              <span className="text-[10px] font-semibold text-[#1a1a2e] whitespace-nowrap">
                Claim now →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CLAIMED THIS MONTH section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Claimed This Month
      </p>
      <div>
        {claimedBenefits.map((benefit, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 border-b border-[#f0eeeb]"
          >
            <div className="w-5 h-5 rounded-full bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="flex-1 text-sm text-[#999999] line-through">
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
            <span className="text-sm font-semibold text-[#999999] tabular-nums min-w-[44px] text-right">
              ${benefit.value}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom total */}
      <div className="mt-4 py-3 border-t border-[#f0eeeb]">
        <p className="text-sm font-semibold text-[#1a1a2e] text-center tabular-nums">
          ${totalAtRisk.toFixed(2)} still unclaimed
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}
