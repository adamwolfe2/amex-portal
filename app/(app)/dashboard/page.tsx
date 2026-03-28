import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Amex benefits command center. Track credit usage, streaks, and ROI at a glance.",
};
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
import { ACHIEVEMENTS, getUnlockedAchievements } from "@/lib/data/achievements";
import type { UserStats } from "@/lib/data/achievements";
import { Achievements } from "@/components/dashboard/achievements";
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
import { ShareCard } from "@/components/dashboard/share-card";
import { RecommendedNext } from "@/components/dashboard/recommended-next";
import { SpendingTip } from "@/components/dashboard/spending-tip";
import { UpgradePrompt } from "@/components/upgrade-prompt";

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

  // Determine Pro status for feature gating
  const isPro =
    dbUser?.subscriptionStatus === "pro" ||
    dbUser?.subscriptionStatus === "active" ||
    dbUser?.subscriptionStatus === "trialing" ||
    dbUser?.subscriptionStatus === "past_due";

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
  let yearClaimCount = 0;

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
    yearClaimCount = yearClaims.length;

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

  const claimedSet = new Set(claimedThisMonth);
  const recommendedBenefits = userBenefits
    .filter((b) => b.value !== null && !claimedSet.has(b.id))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      name: b.name,
      card: b.card,
      value: b.value!,
      cadence: b.cadence,
    }));

  // Compute achievement badges
  const checklistCompleted = userChecklistItems.filter((t) =>
    completedIds.has(t.id)
  ).length;
  const userStatsForAchievements: UserStats = {
    totalClaims: yearClaimCount,
    currentStreak: streakData.current,
    longestStreak: streakData.longest,
    checklistCompleted,
    checklistTotal: userChecklistItems.length,
    capturedValue,
    benefitsClaimed: new Set(claimedThisMonth),
  };
  const unlockedAchievements = getUnlockedAchievements(userStatsForAchievements);
  const unlockedIds = new Set(unlockedAchievements.map((a) => a.id));
  const achievementBadges = ACHIEVEMENTS.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    iconName: a.icon.displayName ?? "Star",
    unlocked: unlockedIds.has(a.id),
  }));

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
      <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
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

      {/* Mark as Used — primary CTA (Pro only) */}
      {isPro && (
        <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
          <MarkAsUsed
            benefits={monthlyBenefits}
            claimedIds={claimedThisMonth}
          />
        </div>
      )}

      {/* Setup Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
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

      {/* Widgets Grid — free for all users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 animate-in fade-in duration-300 delay-150">
        <RecommendedNext benefits={recommendedBenefits} />
        <ActionPreview actions={actions} />
        <UpcomingResets benefits={userBenefits} />
        <SpendingTip />
      </div>

      {/* Activity Grid */}
      <div className="mb-4 animate-in fade-in duration-300 delay-200">
        <ActivityGrid claimDates={claimDates} />
      </div>

      {/* Not Enrolled */}
      <div className="mb-4 animate-in fade-in duration-300 delay-200">
        <NotEnrolled benefits={userBenefits} />
      </div>

      {/* ROI row (Pro only) */}
      {isPro && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 animate-in fade-in duration-300 delay-250">
          <ValueCaptured captured={capturedValue} available={availableValue} />
          <ROICard captured={capturedValue} totalFees={totalFees} />
        </div>
      )}

      {/* Achievement Badges (Pro only) */}
      {isPro && (
        <div className="mb-4 animate-in fade-in duration-300 delay-250">
          <Achievements
            badges={achievementBadges}
            totalCount={ACHIEVEMENTS.length}
          />
        </div>
      )}

      {/* Share Your Savings (Pro only) */}
      {isPro && capturedValue > 0 && (
        <div className="mb-4 animate-in fade-in duration-300 delay-300">
          <ShareCard
            captured={capturedValue}
            available={availableValue}
            streak={streakData.current}
            claimCount={yearClaimCount}
          />
        </div>
      )}

      {/* Single upgrade banner for free users — after all free content */}
      {!isPro && (
        <div className="mb-4 animate-in fade-in duration-300 delay-300">
          <UpgradePrompt
            feature="Unlock Pro"
            description="Get one-tap benefit tracking, ROI analytics, achievement badges, and shareable savings reports."
          />
        </div>
      )}
    </div>
  );
}
