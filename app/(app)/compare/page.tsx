import type { Metadata } from "next";
import { BENEFITS, CARDS } from "@/lib/data";
import { ArrowLeftRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Cards",
  description:
    "Side-by-side comparison of Amex Platinum vs Gold card benefits.",
};

export default function ComparePage() {
  const platBenefits = BENEFITS.filter(
    (b) => b.card === "platinum" && b.value !== null,
  );
  const goldBenefits = BENEFITS.filter(
    (b) => b.card === "gold" && b.value !== null,
  );

  const platTotal = platBenefits.reduce((s, b) => s + (b.value ?? 0), 0);
  const goldTotal = goldBenefits.reduce((s, b) => s + (b.value ?? 0), 0);

  const categories = [...new Set(BENEFITS.map((b) => b.category))];

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">
            Compare Cards
          </h1>
        </div>
        <p className="text-sm text-[#666666] mt-1">
          Side-by-side breakdown of Platinum vs Gold card benefits
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-4">
          <p className="text-[11px] text-[#999999]">Platinum Card</p>
          <p
            className="text-2xl font-semibold text-[#111111]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            ${platTotal.toLocaleString()}/yr
          </p>
          <p className="text-xs text-[#666666] mt-1">
            {platBenefits.length} valued benefits | $
            {CARDS.platinum.annualFee} annual fee
          </p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-4">
          <p className="text-[11px] text-[#999999]">Gold Card</p>
          <p
            className="text-2xl font-semibold text-[#111111]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            ${goldTotal.toLocaleString()}/yr
          </p>
          <p className="text-xs text-[#666666] mt-1">
            {goldBenefits.length} valued benefits | $
            {CARDS.gold.annualFee} annual fee
          </p>
        </div>
      </div>

      {/* Category-by-category comparison */}
      {categories.map((category) => {
        const platInCat = platBenefits.filter((b) => b.category === category);
        const goldInCat = goldBenefits.filter((b) => b.category === category);
        if (platInCat.length === 0 && goldInCat.length === 0) return null;

        return (
          <div
            key={category}
            className="border border-[#e0ddd9] rounded-lg bg-white mb-4 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#e0ddd9] bg-[#fafaf9]">
              <h2 className="text-sm font-semibold text-[#111111]">
                {category}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#e0ddd9]">
              {/* Platinum column */}
              <div className="p-4">
                <p className="text-[11px] text-[#999999] mb-2">Platinum</p>
                {platInCat.length > 0 ? (
                  <ul className="space-y-2">
                    {platInCat.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-[#111111]">
                          {b.name}
                        </span>
                        <span className="text-sm font-medium text-[#111111]">
                          ${b.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#999999]">
                    No benefits in this category
                  </p>
                )}
              </div>
              {/* Gold column */}
              <div className="p-4">
                <p className="text-[11px] text-[#999999] mb-2">Gold</p>
                {goldInCat.length > 0 ? (
                  <ul className="space-y-2">
                    {goldInCat.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-[#111111]">
                          {b.name}
                        </span>
                        <span className="text-sm font-medium text-[#111111]">
                          ${b.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#999999]">
                    No benefits in this category
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
