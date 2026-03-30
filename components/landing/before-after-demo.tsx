"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

const benefits = [
  { name: "Uber Cash", total: 200, withoutPct: 0.25, withPct: 0.95 },
  { name: "Digital Entertainment", total: 300, withoutPct: 0.2, withPct: 0.95 },
  { name: "Resy Dining Credit", total: 400, withoutPct: 0.15, withPct: 0.95 },
  { name: "Hotel Credit", total: 600, withoutPct: 0.3, withPct: 0.95 },
  { name: "Airline Fee Credit", total: 200, withoutPct: 0.35, withPct: 0.95 },
  { name: "Walmart+", total: 155, withoutPct: 0.4, withPct: 0.95 },
  { name: "Saks Credit", total: 100, withoutPct: 0.2, withPct: 0.95 },
  { name: "Dining Credit", total: 120, withoutPct: 0.25, withPct: 0.95 },
];

const withoutTotal = benefits.reduce((sum, b) => sum + Math.round(b.total * b.withoutPct), 0);
const withTotal = benefits.reduce((sum, b) => sum + Math.round(b.total * b.withPct), 0);
const difference = withTotal - withoutTotal;

const withoutPct = Math.round((withoutTotal / withTotal) * 100);
const withPct = 95;

export function BeforeAfterDemo() {
  const [view, setView] = useState<"without" | "with">("without");
  const [barWidth, setBarWidth] = useState(0);

  const isWithout = view === "without";

  useEffect(() => {
    setBarWidth(0);
    const t = setTimeout(() => setBarWidth(isWithout ? withoutPct : withPct), 150);
    return () => clearTimeout(t);
  }, [view, isWithout]);

  return (
    <div className="bg-white min-h-full px-4 py-3">
      {/* Toggle pill */}
      <div className="flex bg-[#f0eeeb] rounded-xl p-1 mb-5">
        <button
          onClick={() => setView("without")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            isWithout ? "bg-white text-[#111111] shadow-sm" : "text-[#666666]"
          }`}
        >
          Without CreditOS
        </button>
        <button
          onClick={() => setView("with")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            !isWithout ? "bg-white text-[#111111] shadow-sm" : "text-[#666666]"
          }`}
        >
          With CreditOS
        </button>
      </div>

      {/* Big number */}
      <div className="text-center mb-3">
        <p
          className={`text-[40px] font-bold tabular-nums leading-none ${
            isWithout ? "text-red-600" : "text-emerald-600"
          }`}
        >
          ${(isWithout ? withoutTotal : withTotal).toLocaleString()}
        </p>
        <p className="text-xs text-[#666666] mt-1">Annual Credits Claimed</p>
      </div>

      {/* Progress bar */}
      <div className="mb-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-[#999999]">% of potential captured</p>
          <p
            className={`text-[10px] font-semibold ${
              isWithout ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {isWithout ? withoutPct : withPct}%
          </p>
        </div>
        <div className="h-3 bg-[#f0eeeb] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isWithout ? "bg-red-500" : "bg-emerald-500"
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* BREAKDOWN section */}
      <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mt-4 mb-2">
        Breakdown
      </p>
      <div>
        {benefits.map((benefit, i) => {
          const claimed = Math.round(
            benefit.total * (isWithout ? benefit.withoutPct : benefit.withPct)
          );
          const isMissed = isWithout && claimed < benefit.total * 0.5;
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 py-2.5 border-b border-[#f0eeeb]"
            >
              {isMissed ? (
                <X className="h-4 w-4 text-red-500 flex-shrink-0" />
              ) : (
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              )}
              <span
                className={`flex-1 text-sm ${
                  isMissed ? "text-[#999999]" : "text-[#111111] font-medium"
                }`}
              >
                {benefit.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    isMissed ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  ${claimed}
                </span>
                <span className="text-xs text-[#999999] tabular-nums">
                  / ${benefit.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary card */}
      <div
        className={`mt-4 rounded-xl p-4 ${
          isWithout ? "bg-red-50" : "bg-emerald-50"
        }`}
      >
        <p
          className={`text-base font-bold tabular-nums mb-0.5 ${
            isWithout ? "text-red-600" : "text-emerald-600"
          }`}
        >
          ${difference.toLocaleString()}
        </p>
        <p
          className={`text-xs font-medium ${
            isWithout ? "text-red-600" : "text-emerald-600"
          }`}
        >
          {isWithout
            ? `You're leaving $${difference.toLocaleString()} on the table`
            : `You're capturing $${difference.toLocaleString()} more per year`}
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}
