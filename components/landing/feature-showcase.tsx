"use client";

import { useState } from "react";
import {
  CheckSquare,
  TrendingUp,
  CalendarClock,
  Activity,
  Flame,
  ArrowLeftRight,
} from "lucide-react";
import { BenefitTrackerDemo } from "./benefit-tracker-demo";
import { ROICalculatorDemo } from "./roi-calculator-demo";
import { MonthlyResetDemo } from "./monthly-reset-demo";
import { ActivityHeatmapDemo } from "./activity-heatmap-demo";
import { SavingsStreakDemo } from "./savings-streak-demo";
import { BeforeAfterDemo } from "./before-after-demo";

const tabs = [
  {
    id: "tracker",
    label: "Track Benefits",
    icon: CheckSquare,
    demo: <BenefitTrackerDemo />,
  },
  {
    id: "roi",
    label: "ROI Calculator",
    icon: TrendingUp,
    demo: <ROICalculatorDemo />,
  },
  {
    id: "resets",
    label: "Monthly Resets",
    icon: CalendarClock,
    demo: <MonthlyResetDemo />,
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
    demo: <ActivityHeatmapDemo />,
  },
  {
    id: "streak",
    label: "Savings Streak",
    icon: Flame,
    demo: <SavingsStreakDemo />,
  },
  {
    id: "compare",
    label: "Before / After",
    icon: ArrowLeftRight,
    demo: <BeforeAfterDemo />,
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function FeatureShowcase() {
  const [active, setActive] = useState<TabId>("tracker");

  const activeTab = tabs.find((t) => t.id === active)!;

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? "bg-[#1a1a2e] text-white shadow-sm"
                  : "text-[#666666] hover:text-[#111111] hover:bg-[#f0efed]"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Browser-frame container */}
      <div className="rounded-2xl border border-[#e0ddd9] bg-white shadow-lg overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e0ddd9] bg-[#fafaf9]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#e0ddd9]" />
            <div className="w-3 h-3 rounded-full bg-[#e0ddd9]" />
            <div className="w-3 h-3 rounded-full bg-[#e0ddd9]" />
          </div>
          <div className="flex-1 max-w-xs mx-auto">
            <div className="bg-[#f0efed] rounded-md px-3 py-1 text-xs text-[#999999] text-center font-mono">
              app.creditos.io/dashboard
            </div>
          </div>
        </div>

        {/* Demo content */}
        <div className="p-6 sm:p-10 bg-[#fafaf9] min-h-[420px] flex items-start justify-center">
          <div
            key={active}
            className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {activeTab.demo}
          </div>
        </div>
      </div>
    </div>
  );
}
