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

function computeProgress(card: CardKey) {
  const tasks = CHECKLIST_ITEMS.filter((t) => t.card === card);
  // In a real app, completed count would come from user state.
  // For now, show 0 completed (fresh user).
  return { completed: 0, total: tasks.length };
}

export default function DashboardPage() {
  const { totalAnnualValue, benefitCount, monthlyValue, totalFees } =
    computeStats();
  const platProgress = computeProgress("platinum");
  const goldProgress = computeProgress("gold");
  const actions = getActionItems();

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#111111]">Dashboard</h1>
        <p className="text-sm text-[#777777] mt-1">
          Your Amex rewards control center
        </p>
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
