"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

const expiringBenefits = [
  { name: "Uber Cash", value: 15, card: "Platinum", urgency: "high" },
  { name: "Digital Entertainment", value: 25, card: "Platinum", urgency: "high" },
  { name: "Dining Credit", value: 10, card: "Gold", urgency: "high" },
  { name: "Dunkin' Credit", value: 7, card: "Gold", urgency: "medium" },
  { name: "Walmart+", value: 12.95, card: "Platinum", urgency: "medium" },
];

const totalAtRisk = expiringBenefits.reduce((sum, b) => sum + b.value, 0);

function getDaysRemaining() {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.max(
    0,
    Math.ceil(
      (endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
  );
}

export function MonthlyResetDemo() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    setDaysLeft(getDaysRemaining());
  }, []);

  const urgencyColor =
    daysLeft !== null && daysLeft <= 5
      ? "text-red-600 bg-red-50"
      : daysLeft !== null && daysLeft <= 14
        ? "text-amber-600 bg-amber-50"
        : "text-[#111111] bg-[#f0eeeb]";

  return (
    <div className="bg-white rounded-2xl border border-[#e0ddd9] p-5 sm:p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-[#111111]">
          Monthly Reset Countdown
        </p>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${urgencyColor}`}
        >
          <Clock className="h-3 w-3" />
          {daysLeft !== null ? `${daysLeft} days left` : "—"}
        </div>
      </div>

      <div className="bg-[#fafaf9] rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111111]">
            ${totalAtRisk.toFixed(2)} at risk
          </p>
          <p className="text-xs text-[#666666]">
            {expiringBenefits.length} unclaimed credits expiring this month
          </p>
        </div>
      </div>

      <div className="space-y-0 divide-y divide-[#f0eeeb]">
        {expiringBenefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5">
            <div
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                benefit.urgency === "high" ? "bg-red-500" : "bg-amber-400"
              }`}
            />
            <span className="flex-1 text-sm text-[#111111]">
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
            <span className="text-sm font-semibold text-[#111111] tabular-nums">
              ${benefit.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
