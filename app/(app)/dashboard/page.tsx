import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";

export const metadata: Metadata = { title: "Dashboard" };
import { auth } from "@clerk/nextjs/server";
import {
  getUserByClerkId,
  getChecklistProgress,
  getUserClaims,
  getUserClaimsForYear,
} from "@/lib/db/queries";
import { BENEFITS, CARDS } from "@/lib/data";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist";
import { getActionItems } from "@/lib/data/actions";
import { computeStreak } from "@/lib/data/streaks";
import {
  computeAvailableValue,
  computeCapturedValue,
  computeMonthlyProgress,
} from "@/lib/data/roi";
import { getUrgencyMessage, getDaysRemainingInMonth } from "@/lib/data/urgency";
import type { CardKey } from "@/lib/data/types";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { MonthlyProgress } from "@/components/dashboard/monthly-progress";
import { MarkAsUsed } from "@/components/dashboard/mark-as-used";
import { ValueCaptured } from "@/components/dashboard/value-captured";
import { ROICard } from "@/components/dashboard/roi-card";
import { ProgressWidget } from "@/components/dashboard/progress-widget";
import { UpcomingResets } from "@/components/dashboard/upcoming-resets";
import { ActionPreview } from "@/components/dashboard/action-preview";
import { NotEnrolled } from "@/components/dashboard/not-enrolled";
import { CheckoutToast } from "@/components/dashboard/checkout-toast";
import { ActivityGrid } from "@/components/dashboard/activity-grid";

export default async function DashboardPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Determine user's cards for filtering
  let userCards: CardKey[] = ["platinum", "gold"];
  const { userId } = await auth();
  let dbUser: Awaited<ReturnType<typeof getUserByClerkId>> | null = null;
  if (userId) {
    dbUser = await getUserByClerkId(userId);
    if (dbUser) {
      const dbCards = dbUser.cards as string[] | null;
      if (dbCards && dbCards.length > 0) {
        userCards = dbCards.filter(
          (c): c is CardKey => c === "platinum" || c === "gold"
        );
      }
    }
  }

  // Filter benefits and checklist items to user's cards
  const userBenefits = BENEFITS.filter((b) => userCards.includes(b.card));
  const userChecklistItems = CHECKLIST_ITEMS.filter((t) =>
    userCards.includes(t.card)
  );
  const actions = getActionItems().filter(
    (a) => a.card === "both" || userCards.includes(a.card as CardKey)
  );

  const totalFees = userCards.reduce(
    (sum, key) =>
      sum + (CARDS as Record<CardKey, { annualFee: number }>)[key].annualFee,
    0
  );

  const availableValue = computeAvailableValue(userBenefits);

  // Defaults for unauthenticated state
  let completedIds = new Set<string>();
  let claimDates: string[] = [];
  let streakData = { current: 0, longest: 0 };
  let capturedValue = 0;
  let monthlyData = { captured: 0, available: 0 };
  let monthlyBenefits: Array<{
    id: string;
    name: string;
    card: "platinum" | "gold";
    monthlyValue: number;
  }> = [];
  let claimedThisMonth: string[] = [];

  if (dbUser) {
    const [progress, allClaims, yearClaims] = await Promise.all([
      getChecklistProgress(dbUser.id),
      getUserClaims(dbUser.id),
      getUserClaimsForYear(dbUser.id, year),
    ]);

    completedIds = new Set(
      progress.filter((p) => p.completed).map((p) => p.itemId)
    );

    // Activity grid dates (claims + checklist completions)
    const claimIsos = allClaims
      .map((c) => c.claimedAt?.toISOString() ?? "")
      .filter(Boolean);
    const checklistIsos = progress
      .filter((p) => p.completed && p.completedAt)
      .map((p) => p.completedAt!.toISOString());
    claimDates = [...claimIsos, ...checklistIsos];

    // Streak
    const claimDateObjects = allClaims
      .filter((c) => c.claimedAt)
      .map((c) => c.claimedAt!);
    streakData = computeStreak(claimDateObjects);

    // ROI — use filtered benefits
    capturedValue = computeCapturedValue(yearClaims, userBenefits, year);
    monthlyData = computeMonthlyProgress(yearClaims, userBenefits, year, month);

    // Monthly benefits for "Mark as Used" — filtered to user's cards
    monthlyBenefits = userBenefits
      .filter((b) => b.cadence === "monthly" && b.value !== null)
      .map((b) => ({
        id: b.id,
        name: b.name,
        card: b.card,
        monthlyValue: Math.round((b.value ?? 0) / 12),
      }));

    // Which monthly benefits are already claimed this month
    const thisMonthClaims = yearClaims.filter((c) => {
      if (!c.claimedAt) return false;
      return c.claimedAt.getMonth() + 1 === month;
    });
    claimedThisMonth = thisMonthClaims.map((c) => c.benefitId);
  }

  const unclaimedCount = monthlyBenefits.filter(
    (b) => !claimedThisMonth.includes(b.id)
  ).length;
  const urgencyMessage = getUrgencyMessage(
    unclaimedCount,
    getDaysRemainingInMonth()
  );

  function computeProgress(card: CardKey) {
    const tasks = userChecklistItems.filter((t) => t.card === card);
    const completed = tasks.filter((t) => completedIds.has(t.id)).length;
    return { completed, total: tasks.length };
  }

  const progressWidgets = userCards.map((card) => ({
    card,
    ...computeProgress(card),
  }));

  return (
    <div className="max-w-5xl">
      <Suspense fallback={null}>
        <CheckoutToast />
      </Suspense>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#111111]">Dashboard</h1>
        <p className="text-sm text-[#777777] mt-1">
          Your credit card rewards command center
        </p>
        <div className="flex items-center gap-2 mt-3">
          {userCards.includes("platinum") && (
            <Image
              src="/platinum-card.png"
              alt="American Express Platinum Card"
              width={48}
              height={30}
              className="rounded shadow-sm"
              priority
            />
          )}
          {userCards.includes("gold") && (
            <Image
              src="/gold-card.png"
              alt="American Express Gold Card"
              width={48}
              height={30}
              className="rounded shadow-sm"
              priority
            />
          )}
        </div>
      </div>

      {/* Streak + Monthly Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <StreakCounter
          currentStreak={streakData.current}
          longestStreak={streakData.longest}
        />
        <MonthlyProgress
          captured={monthlyData.captured}
          available={monthlyData.available}
          urgencyMessage={urgencyMessage}
        />
      </div>

      {/* Mark as Used — primary CTA */}
      <div className="mb-4">
        <MarkAsUsed
          benefits={monthlyBenefits}
          claimedIds={claimedThisMonth}
        />
      </div>

      {/* ROI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ValueCaptured captured={capturedValue} available={availableValue} />
        <ROICard captured={capturedValue} totalFees={totalFees} />
      </div>

      {/* Activity Grid */}
      <div className="mb-4">
        <ActivityGrid claimDates={claimDates} />
      </div>

      {/* Setup Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {progressWidgets.map((pw) => (
          <ProgressWidget
            key={pw.card}
            title={`${pw.card === "platinum" ? "Platinum" : "Gold"} Setup`}
            completed={pw.completed}
            total={pw.total}
            color={pw.card === "platinum" ? "#1a1a2e" : "#8B6914"}
          />
        ))}
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ActionPreview actions={actions} />
        <UpcomingResets benefits={userBenefits} />
        <div className="md:col-span-2">
          <NotEnrolled benefits={userBenefits} />
        </div>
      </div>
    </div>
  );
}
