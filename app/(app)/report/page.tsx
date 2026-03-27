import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, getUserClaimsForYear } from "@/lib/db/queries";
import { BENEFITS, CARDS } from "@/lib/data";
import { computeAvailableValue, computeCapturedValue } from "@/lib/data/roi";
import { computeStreak } from "@/lib/data/streaks";
import type { CardKey, BenefitCategory } from "@/lib/data/types";
import { BarChart3, TrendingUp, Award, Flame } from "lucide-react";
import { ShareCard } from "@/components/dashboard/share-card";

export const metadata: Metadata = {
  title: "2026 Savings Report",
  description:
    "Your comprehensive annual review of Amex benefit usage and savings.",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function ReportPage() {
  const year = 2026;

  const { userId } = await auth();
  if (!userId) {
    redirect("/dashboard");
  }

  const dbUser = await getUserByClerkId(userId);
  if (!dbUser) {
    redirect("/dashboard");
  }

  // Pro-only gate
  const isPro =
    dbUser.subscriptionStatus === "pro" ||
    dbUser.subscriptionStatus === "active" ||
    dbUser.subscriptionStatus === "trialing" ||
    dbUser.subscriptionStatus === "past_due";

  if (!isPro) {
    redirect("/dashboard");
  }

  // Determine user's cards
  let userCards: CardKey[] = ["platinum", "gold"];
  const dbCards = dbUser.cards as string[] | null;
  if (dbCards && dbCards.length > 0) {
    userCards = dbCards.filter(
      (c): c is CardKey => c === "platinum" || c === "gold"
    );
  }

  const userBenefits = BENEFITS.filter((b) => userCards.includes(b.card));
  const yearClaims = await getUserClaimsForYear(dbUser.id, year);

  // Core calculations
  const availableValue = computeAvailableValue(userBenefits);
  const capturedValue = computeCapturedValue(yearClaims, userBenefits, year);
  const capturedPercent =
    availableValue > 0
      ? Math.round((capturedValue / availableValue) * 100)
      : 0;

  // Annual fees and net value
  const totalFees = userCards.reduce(
    (sum, key) =>
      sum + (CARDS as Record<CardKey, { annualFee: number }>)[key].annualFee,
    0
  );
  const netValue = capturedValue - totalFees;

  // Streak
  const claimDates = yearClaims
    .filter((c) => c.claimedAt !== null)
    .map((c) => new Date(c.claimedAt!));
  const streakData = computeStreak(claimDates);

  // Monthly breakdown
  const benefitMap = new Map(userBenefits.map((b) => [b.id, b]));
  const monthlyBreakdown = MONTH_NAMES.map((name, idx) => {
    const monthNum = idx + 1;
    let captured = 0;
    let claimCount = 0;

    for (const claim of yearClaims) {
      if (!claim.claimedAt) continue;
      const claimDate = new Date(claim.claimedAt);
      if (claimDate.getMonth() + 1 !== monthNum) continue;

      const benefit = benefitMap.get(claim.benefitId);
      if (!benefit || benefit.value === null) continue;
      claimCount++;

      if (claim.amount && !isNaN(Number(claim.amount))) {
        captured += Number(claim.amount);
      } else {
        const divisor =
          benefit.cadence === "monthly"
            ? 12
            : benefit.cadence === "quarterly"
              ? 4
              : benefit.cadence === "semiannual"
                ? 2
                : 1;
        captured += benefit.value / divisor;
      }
    }

    return { name, captured: Math.round(captured), claimCount };
  });

  // Top benefits by claim count
  const benefitClaimCounts = new Map<string, number>();
  for (const claim of yearClaims) {
    const current = benefitClaimCounts.get(claim.benefitId) ?? 0;
    benefitClaimCounts.set(claim.benefitId, current + 1);
  }
  const topBenefits = [...benefitClaimCounts.entries()]
    .map(([id, count]) => ({
      benefit: benefitMap.get(id),
      count,
    }))
    .filter((entry) => entry.benefit !== undefined)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Category breakdown
  const categoryTotals = new Map<BenefitCategory, number>();
  for (const claim of yearClaims) {
    if (!claim.claimedAt) continue;
    const benefit = benefitMap.get(claim.benefitId);
    if (!benefit || benefit.value === null) continue;

    let amount = 0;
    if (claim.amount && !isNaN(Number(claim.amount))) {
      amount = Number(claim.amount);
    } else {
      const divisor =
        benefit.cadence === "monthly"
          ? 12
          : benefit.cadence === "quarterly"
            ? 4
            : benefit.cadence === "semiannual"
              ? 2
              : 1;
      amount = benefit.value / divisor;
    }

    const prev = categoryTotals.get(benefit.category) ?? 0;
    categoryTotals.set(benefit.category, prev + amount);
  }
  const sortedCategories = [...categoryTotals.entries()]
    .map(([category, total]) => ({ category, total: Math.round(total) }))
    .sort((a, b) => b.total - a.total);

  const maxMonthly = Math.max(...monthlyBreakdown.map((m) => m.captured), 1);
  const maxCategory = Math.max(...sortedCategories.map((c) => c.total), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#1a1a2e]">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#111111]">
            {year} Savings Report
          </h1>
          <p className="text-sm text-[#666666]">
            Your annual benefit capture review
          </p>
        </div>
      </div>

      {/* Hero stat */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-6">
        <p className="text-sm text-[#666666] mb-2">Total Value Captured</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-semibold text-[#111111]">
            ${capturedValue.toLocaleString()}
          </span>
          <span className="text-lg text-[#666666]">
            of ${availableValue.toLocaleString()} available
          </span>
        </div>
        <p className="text-sm text-[#666666] mb-4">{capturedPercent}% captured</p>
        <div className="h-3 rounded-full bg-[#f0efed] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(capturedPercent, 100)}%`,
              backgroundColor: "#1a1a2e",
            }}
          />
        </div>
      </div>

      {/* ROI section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-[#8B6914]" />
            <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              Captured
            </span>
          </div>
          <p className="text-2xl font-semibold text-[#111111]">
            ${capturedValue.toLocaleString()}
          </p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-[#8B6914]" />
            <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              Annual Fees
            </span>
          </div>
          <p className="text-2xl font-semibold text-[#111111]">
            ${totalFees.toLocaleString()}
          </p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-[#8B6914]" />
            <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              Net Value
            </span>
          </div>
          <p
            className={`text-2xl font-semibold ${netValue >= 0 ? "text-[#111111]" : "text-red-600"}`}
          >
            {netValue >= 0 ? "+" : "-"}${Math.abs(netValue).toLocaleString()}
          </p>
          <p className="text-xs text-[#666666] mt-1">
            {netValue >= 0
              ? "Your cards are paying for themselves"
              : "Keep claiming to cover your fees"}
          </p>
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-6">
        <h2 className="text-base font-semibold text-[#111111] mb-4">
          Monthly Breakdown
        </h2>
        <div className="space-y-2">
          {monthlyBreakdown.map((month) => (
            <div key={month.name} className="flex items-center gap-3">
              <span className="w-20 text-xs text-[#666666] shrink-0 text-right">
                {month.name.slice(0, 3)}
              </span>
              <div className="flex-1 h-6 rounded bg-[#f0efed] overflow-hidden">
                {month.captured > 0 && (
                  <div
                    className="h-full rounded transition-all duration-300"
                    style={{
                      width: `${(month.captured / maxMonthly) * 100}%`,
                      backgroundColor: "#1a1a2e",
                    }}
                  />
                )}
              </div>
              <span
                className="w-16 text-xs font-medium text-[#111111] text-right"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                ${month.captured.toLocaleString()}
              </span>
              <span className="w-12 text-[10px] text-[#999999] text-right">
                {month.claimCount} {month.claimCount === 1 ? "claim" : "claims"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top benefits */}
      {topBenefits.length > 0 && (
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-6">
          <h2 className="text-base font-semibold text-[#111111] mb-4">
            Top Benefits
          </h2>
          <div className="space-y-3">
            {topBenefits.map(({ benefit, count }, i) => (
              <div
                key={benefit!.id}
                className="flex items-center justify-between py-2 border-b border-[#f0efed] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center h-6 w-6 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: "#1a1a2e" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#111111]">
                      {benefit!.name}
                    </p>
                    <p className="text-[11px] text-[#999999]">
                      {benefit!.category}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#111111]">
                  {count} {count === 1 ? "claim" : "claims"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {sortedCategories.length > 0 && (
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-6">
          <h2 className="text-base font-semibold text-[#111111] mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {sortedCategories.map(({ category, total }) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#111111]">{category}</span>
                  <span
                    className="text-sm font-medium text-[#111111]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    ${total.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#f0efed] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(total / maxCategory) * 100}%`,
                      backgroundColor: "#8B6914",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-[#8B6914]" />
            <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              Current Streak
            </span>
          </div>
          <p className="text-3xl font-semibold text-[#111111]">
            {streakData.current}
          </p>
          <p className="text-xs text-[#666666] mt-1">
            {streakData.current === 1 ? "month" : "months"} in a row
          </p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-[#8B6914]" />
            <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              Longest Streak
            </span>
          </div>
          <p className="text-3xl font-semibold text-[#111111]">
            {streakData.longest}
          </p>
          <p className="text-xs text-[#666666] mt-1">
            {streakData.longest === 1 ? "month" : "months"} personal best
          </p>
        </div>
      </div>

      {/* Share CTA */}
      <ShareCard
        captured={capturedValue}
        available={availableValue}
        streak={streakData.current}
        claimCount={yearClaims.length}
      />
    </div>
  );
}
