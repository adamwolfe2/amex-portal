import type { Metadata } from "next";
import {
  CreditCard,
  ChevronDown,
  UtensilsCrossed,
  ShoppingCart,
  Plane,
  Building2,
  ShoppingBag,
  RefreshCw,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { BEST_CARD_RULES } from "@/lib/data/best-card";

export const metadata: Metadata = {
  title: "Best Card",
  description:
    "Find the best Amex card for your spending habits with personalized category recommendations.",
};

const categoryIcons: Record<string, React.ElementType> = {
  dining: UtensilsCrossed,
  groceries: ShoppingCart,
  flights: Plane,
  hotels: Building2,
  "portal-shopping": ShoppingBag,
  rakuten: RefreshCw,
  "non-bonus": Wallet,
  "edge-cases": AlertTriangle,
};

const recommendBadge = {
  platinum: { label: "Use Platinum", bg: "bg-[#1a1a2e]", text: "text-white" },
  gold: { label: "Use Gold", bg: "bg-[#92702a]", text: "text-white" },
  varies: {
    label: "Varies",
    bg: "bg-[#f0efed]",
    text: "text-[#666666]",
  },
} as const;

export default function BestCardPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">
            Best Card to Use
          </h1>
        </div>
        <p className="text-sm text-[#666666]">
          Which card earns the most points for each spending category
        </p>
      </div>

      <div className="space-y-3">
        {BEST_CARD_RULES.map((rule) => {
          const Icon = categoryIcons[rule.id] ?? CreditCard;
          const badge = recommendBadge[rule.recommended];

          return (
            <details
              key={rule.id}
              className="group border border-[#e0ddd9] rounded-lg bg-white overflow-hidden"
            >
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none hover:bg-[#fafaf9] transition-colors">
                <Icon className="h-5 w-5 text-[#666666] shrink-0" />
                <span className="flex-1 text-sm font-medium text-[#111111]">
                  {rule.category}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}
                >
                  {badge.label}
                </span>
                <ChevronDown className="h-4 w-4 text-[#999999] transition-transform group-open:rotate-180 shrink-0" />
              </summary>
              <div className="px-4 pb-4 pt-1 border-t border-[#e0ddd9] space-y-3">
                <div>
                  <p className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-1">
                    Why
                  </p>
                  <p className="text-sm text-[#333333]">{rule.why}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-1">
                    Earn Rates
                  </p>
                  <p className="text-sm text-[#333333]">{rule.earn}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-1">
                    Exceptions
                  </p>
                  <p className="text-sm text-[#333333]">{rule.exceptions}</p>
                </div>
                <div className="bg-[#fafaf9] border border-[#e0ddd9] rounded-lg p-3">
                  <p className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-1">
                    Rakuten Stacking
                  </p>
                  <p className="text-xs text-[#666666]">{rule.rakutenNote}</p>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
