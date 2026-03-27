"use client";

import { useState } from "react";
import { CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

const DAILY_TIPS = [
  { category: "Dining", card: "Gold", rate: "4X points", tip: "Use your Gold Card at restaurants for 4X Membership Rewards points." },
  { category: "Groceries", card: "Gold", rate: "4X points", tip: "Gold Card earns 4X at US supermarkets (up to $25K/yr)." },
  { category: "Flights", card: "Platinum", rate: "5X points", tip: "Book flights directly with airlines using Platinum for 5X points." },
  { category: "Hotels", card: "Platinum", rate: "5X points", tip: "Book hotels through Amex Travel with Platinum for 5X points." },
  { category: "Rakuten", card: "Either", rate: "Up to 15X", tip: "Stack Rakuten cashback with your Amex card for double-dip rewards." },
  { category: "Streaming", card: "Platinum", rate: "Credit", tip: "Your Platinum Digital Entertainment credit covers streaming services." },
  { category: "Uber", card: "Platinum", rate: "Credit", tip: "Don't forget to use your monthly Uber Cash credit before it resets." },
];

function getDailyTip() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / 86400000
  );
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

export function SpendingTip() {
  const [tip] = useState(getDailyTip);

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#111111]">Daily Tip</span>
        <Link href="/bestcard" className="text-[11px] text-[#999999] hover:text-[#666666] flex items-center gap-0.5 min-h-[44px]">
          All tips <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f0efed] shrink-0">
          <CreditCard className="h-4 w-4 text-[#666666]" />
        </div>
        <div>
          <p className="text-xs font-medium text-[#111111] mb-0.5">
            {tip.category} — Use {tip.card} ({tip.rate})
          </p>
          <p className="text-xs text-[#666666]">{tip.tip}</p>
        </div>
      </div>
    </div>
  );
}
