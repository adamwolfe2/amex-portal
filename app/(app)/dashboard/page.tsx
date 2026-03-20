import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";

export const metadata: Metadata = { title: "Dashboard" };
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId, getChecklistProgress } from "@/lib/db/queries";
import { BENEFITS, CARDS } from "@/lib/data";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist";
import { getActionItems } from "@/lib/data/actions";
import type { CardKey } from "@/lib/data/types";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressWidget } from "@/components/dashboard/progress-widget";
import { UpcomingResets } from "@/components/dashboard/upcoming-resets";
import { ActionPreview } from "@/components/dashboard/action-preview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { NotEnrolled } from "@/components/dashboard/not-enrolled";
import { CheckoutToast } from "@/components/dashboard/checkout-toast";

function computeStats() {
  const valuedBenefits = BENEFITS.filter((b) => b.value !== null);

  const totalAnnualValue = valuedBenefits.reduce(
    (sum, b) => sum + (b.value ?? 0),
    0
  );

  const benefitCount = BENEFITS.length;

  const monthlyValue = Math.round(totalAnnualValue / 12);

  const totalFees =
    (CARDS as Record<CardKey, { annualFee: number }>).platinum.annualFee +
    (CARDS as Record<CardKey, { annualFee: number }>).gold.annualFee;

  return { totalAnnualValue, benefitCount, monthlyValue, totalFees };
}

export default async function DashboardPage() {
  const { totalAnnualValue, benefitCount, monthlyValue, totalFees } =
    computeStats();
  const actions = getActionItems();

  // Fetch real checklist progress from DB
  let completedIds = new Set<string>();
  const { userId } = await auth();
  if (userId) {
    const dbUser = await getUserByClerkId(userId);
    if (dbUser) {
      const progress = await getChecklistProgress(dbUser.id);
      completedIds = new Set(
        progress.filter((p) => p.completed).map((p) => p.itemId)
      );
    }
  }

  function computeProgress(card: CardKey) {
    const tasks = CHECKLIST_ITEMS.filter((t) => t.card === card);
    const completed = tasks.filter((t) => completedIds.has(t.id)).length;
    return { completed, total: tasks.length };
  }

  const platProgress = computeProgress("platinum");
  const goldProgress = computeProgress("gold");

  return (
    <div className="max-w-5xl">
      <Suspense fallback={null}>
        <CheckoutToast />
      </Suspense>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#111111]">Dashboard</h1>
        <p className="text-sm text-[#777777] mt-1">
          Your credit card rewards command center
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Image
            src="/platinum-card.png"
            alt="American Express Platinum Card"
            width={48}
            height={30}
            className="rounded shadow-sm"
          />
          <Image
            src="/gold-card.png"
            alt="American Express Gold Card"
            width={48}
            height={30}
            className="rounded shadow-sm"
          />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Annual Value"
          value={`$${totalAnnualValue.toLocaleString()}`}
          subtitle={`Across ${benefitCount} benefits`}
        />
        <StatCard
          label="Benefits Count"
          value={String(benefitCount)}
          subtitle="Platinum + Gold"
        />
        <StatCard
          label="Monthly Value"
          value={`$${monthlyValue.toLocaleString()}`}
          subtitle="Average per month"
        />
        <StatCard
          label="Combined Fees"
          value={`$${totalFees.toLocaleString()}`}
          subtitle={`$${CARDS.platinum.annualFee} + $${CARDS.gold.annualFee}`}
        />
      </div>

      {/* Setup Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ProgressWidget
          title="Platinum Setup"
          completed={platProgress.completed}
          total={platProgress.total}
          color="#1a1a2e"
        />
        <ProgressWidget
          title="Gold Setup"
          completed={goldProgress.completed}
          total={goldProgress.total}
          color="#8B6914"
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ActionPreview actions={actions} />
        <UpcomingResets benefits={BENEFITS} />
        <div className="md:col-span-2">
          <NotEnrolled benefits={BENEFITS} />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
