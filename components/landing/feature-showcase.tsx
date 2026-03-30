"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  CalendarClock,
  Activity,
  Flame,
  ArrowLeftRight,
  ChevronRight,
} from "lucide-react";
import { DashboardDemo } from "./dashboard-demo";
import { BenefitTrackerDemo } from "./benefit-tracker-demo";
import { ROICalculatorDemo } from "./roi-calculator-demo";
import { MonthlyResetDemo } from "./monthly-reset-demo";
import { ActivityHeatmapDemo } from "./activity-heatmap-demo";
import { SavingsStreakDemo } from "./savings-streak-demo";
import { BeforeAfterDemo } from "./before-after-demo";

// Phone dimensions
const OUTER_W = 288;
const OUTER_H = 588;
const BORDER = 10;
const SCREEN_W = OUTER_W - BORDER * 2; // 268
const CONTENT_W = 390;
const SCALE = SCREEN_W / CONTENT_W; // ≈ 0.687

const features = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Your command center — streak, monthly progress, one-tap claiming, and upcoming resets at a glance.",
    Demo: DashboardDemo,
  },
  {
    id: "tracker",
    icon: CheckSquare,
    title: "Track Benefits",
    description: "Mark monthly credits as used with one tap. See your captured value grow in real time.",
    Demo: BenefitTrackerDemo,
  },
  {
    id: "roi",
    icon: TrendingUp,
    title: "ROI Calculator",
    description: "See your exact return on annual fees. Know whether your cards are paying for themselves.",
    Demo: ROICalculatorDemo,
  },
  {
    id: "resets",
    icon: CalendarClock,
    title: "Monthly Resets",
    description: "Know exactly which credits expire at month end before it's too late.",
    Demo: MonthlyResetDemo,
  },
  {
    id: "activity",
    icon: Activity,
    title: "Activity Heatmap",
    description: "A GitHub-style heatmap of every credit you've claimed all year.",
    Demo: ActivityHeatmapDemo,
  },
  {
    id: "streak",
    icon: Flame,
    title: "Savings Streak",
    description: "Build momentum with streaks and personal bests that keep you accountable.",
    Demo: SavingsStreakDemo,
  },
  {
    id: "compare",
    icon: ArrowLeftRight,
    title: "Before / After",
    description: "See exactly how much your card could pay for itself vs what you're missing.",
    Demo: BeforeAfterDemo,
  },
] as const;

type FeatureId = (typeof features)[number]["id"];

function IPhoneFrame({ activeId, Demo }: { activeId: FeatureId; Demo: React.ComponentType }) {
  return (
    <div className="flex justify-center">
      <div
        className="relative flex-shrink-0"
        style={{ width: OUTER_W, height: OUTER_H }}
      >
        {/* Outer shell */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: 44,
            background: "linear-gradient(160deg, #2e2e2e 0%, #141414 60%, #1a1a1a 100%)",
            boxShadow:
              "0 40px 80px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.4)",
          }}
        />
        {/* Volume buttons */}
        {[104, 152].map((top) => (
          <div
            key={top}
            className="absolute"
            style={{ left: -3, top, width: 3, height: 34, borderRadius: "2px 0 0 2px", background: "#2a2a2a" }}
          />
        ))}
        {/* Power button */}
        <div
          className="absolute"
          style={{ right: -3, top: 134, width: 3, height: 58, borderRadius: "0 2px 2px 0", background: "#2a2a2a" }}
        />
        {/* Screen */}
        <div
          className="absolute overflow-hidden bg-[#f5f5f7]"
          style={{ inset: BORDER, borderRadius: 36 }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute z-20"
            style={{ top: 11, left: "50%", transform: "translateX(-50%)", width: 118, height: 33, borderRadius: 20, background: "#111" }}
          />
          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5"
            style={{ paddingTop: 13, paddingBottom: 6 }}
          >
            <span className="text-[11px] font-bold tracking-tight" style={{ color: "#111" }}>9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="6" width="3" height="6" rx="0.8" fill="#111" opacity="0.3" />
                <rect x="4.5" y="4" width="3" height="8" rx="0.8" fill="#111" opacity="0.5" />
                <rect x="9" y="1.5" width="3" height="10.5" rx="0.8" fill="#111" />
              </svg>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#111" />
                <path d="M4.2 6.3C5.1 5.4 6.3 4.9 7.5 4.9c1.2 0 2.4.5 3.3 1.4" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M1.3 3.5C3.1 1.7 5.2.9 7.5.9c2.3 0 4.4.8 6.2 2.6" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#111" strokeOpacity="0.4" />
                <rect x="2" y="2" width="16" height="8" rx="1.5" fill="#111" />
                <path d="M22.5 4v4" stroke="#111" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          {/* Demo area */}
          <div
            className="absolute overflow-hidden"
            style={{ top: 50, left: 0, right: 0, bottom: 24 }}
          >
            <div
              key={activeId}
              className="animate-in fade-in duration-300"
              style={{
                width: `${(100 / SCALE).toFixed(2)}%`,
                transform: `scale(${SCALE})`,
                transformOrigin: "top left",
              }}
            >
              <Demo />
            </div>
          </div>
          {/* Home indicator */}
          <div
            className="absolute bottom-2 left-1/2"
            style={{ transform: "translateX(-50%)", width: 96, height: 4, borderRadius: 4, background: "rgba(0,0,0,0.22)" }}
          />
        </div>
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  const [active, setActive] = useState<FeatureId>("dashboard");
  const activeFeature = features.find((f) => f.id === active)!;
  const { Demo } = activeFeature;

  return (
    <div>
      {/* ── MOBILE layout: phone + scrollable pill tabs ── */}
      <div className="lg:hidden">
        <IPhoneFrame activeId={active} Demo={Demo} />
        {/* Scrollable pill tab strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-6 scrollbar-none">
          {features.map((f) => {
            const Icon = f.icon;
            const isActive = f.id === active;
            return (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-[#f0efed] text-[#666666]"
                }`}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                {f.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP layout: feature list + phone ── */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_auto] gap-20 items-center">
        {/* Feature list */}
        <div className="divide-y divide-[#e0ddd9]">
          {features.map((feature) => {
            const isActive = feature.id === active;
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActive(feature.id)}
                className="w-full text-left py-4 flex items-start gap-4 group"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                    isActive ? "bg-[#1a1a2e]" : "bg-[#f0efed] group-hover:bg-[#e5e3e0]"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-white" : "text-[#888888]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold transition-colors duration-150 ${isActive ? "text-[#111111]" : "text-[#666666] group-hover:text-[#333333]"}`}>
                    {feature.title}
                  </p>
                  <p
                    className={`text-sm mt-0.5 leading-relaxed transition-all duration-200 overflow-hidden ${
                      isActive ? "text-[#555555] max-h-16 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
                <ChevronRight
                  className={`h-4 w-4 mt-1 flex-shrink-0 transition-all duration-150 ${isActive ? "text-[#1a1a2e] opacity-100" : "opacity-0"}`}
                />
              </button>
            );
          })}
        </div>

        {/* iPhone mockup */}
        <IPhoneFrame activeId={active} Demo={Demo} />
      </div>
    </div>
  );
}
