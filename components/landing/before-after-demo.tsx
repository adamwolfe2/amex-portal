"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

const benefits = [
  { name: "Uber Cash", value: 200 },
  { name: "Digital Entertainment", value: 300 },
  { name: "Resy Dining Credit", value: 400 },
  { name: "Hotel Credit", value: 600 },
  { name: "Airline Fee Credit", value: 200 },
  { name: "Walmart+", value: 155 },
  { name: "Saks Credit", value: 100 },
  { name: "Dining Credit", value: 120 },
];

const withoutTotal = benefits.reduce(
  (sum, b) => sum + Math.round(b.value * 0.35),
  0
);
const withTotal = benefits.reduce(
  (sum, b) => sum + Math.round(b.value * 0.95),
  0
);

export function BeforeAfterDemo() {
  const [view, setView] = useState<"without" | "with">("without");

  const isWithout = view === "without";

  return (
    <div className="max-w-lg mx-auto">
      {/* Toggle */}
      <div className="flex bg-[#f0eeeb] rounded-xl p-1 mb-5 max-w-xs mx-auto">
        <button
          onClick={() => setView("without")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            isWithout
              ? "bg-white text-[#111111] shadow-sm"
              : "text-[#666666]"
          }`}
        >
          Without CreditOS
        </button>
        <button
          onClick={() => setView("with")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            !isWithout
              ? "bg-white text-[#111111] shadow-sm"
              : "text-[#666666]"
          }`}
        >
          With CreditOS
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e0ddd9] p-5 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-5">
          <p className="text-sm font-semibold text-[#111111]">
            Annual Credits Claimed
          </p>
          <p
            className={`text-2xl font-bold tabular-nums ${
              isWithout ? "text-red-600" : "text-emerald-600"
            }`}
          >
            ${(isWithout ? withoutTotal : withTotal).toLocaleString()}
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-0 divide-y divide-[#f0eeeb]">
          {benefits.map((benefit, i) => {
            const claimed = isWithout
              ? Math.round(benefit.value * 0.35)
              : Math.round(benefit.value * 0.95);
            const missed = isWithout && claimed < benefit.value * 0.5;
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5"
              >
                {missed ? (
                  <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                ) : (
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                )}
                <span
                  className={`flex-1 text-sm ${
                    missed ? "text-[#999999]" : "text-[#111111]"
                  }`}
                >
                  {benefit.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      missed ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    ${claimed}
                  </span>
                  <span className="text-xs text-[#999999] tabular-nums">
                    / ${benefit.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        <div
          className={`mt-5 rounded-xl p-3 text-center text-sm font-medium ${
            isWithout
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isWithout
            ? `You're leaving $${(withTotal - withoutTotal).toLocaleString()} on the table`
            : `You're capturing $${(withTotal - withoutTotal).toLocaleString()} more per year`}
        </div>
      </div>
    </div>
  );
}
