"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  SkipForward,
  CreditCard,
  Sparkles,
} from "lucide-react";
import type { SetupTask } from "@/lib/data/types";

/** Maps checklist item IDs to their annual dollar value (from BENEFITS data) */
const ITEM_VALUES: Record<string, number> = {
  "setup-plat-airline": 200,
  "setup-plat-uber": 320, // $200 Uber Cash + $120 Uber One
  "setup-plat-digital": 300,
  "setup-plat-resy": 400,
  "setup-plat-clear": 209,
  "setup-plat-global-entry": 120,
  "setup-plat-saks": 100,
  "setup-plat-walmart": 155,
  "setup-plat-lululemon": 300,
  "setup-plat-equinox": 300,
  "setup-plat-oura": 200,
  "setup-gold-uber": 120,
  "setup-gold-dining": 120,
  "setup-gold-resy": 100,
  "setup-gold-dunkin": 84,
};

interface EnrollmentWizardProps {
  items: SetupTask[];
  completedIds: Set<string>;
  onToggle: (itemId: string) => void;
}

export function EnrollmentWizard({
  items,
  completedIds,
  onToggle,
}: EnrollmentWizardProps) {
  // Sort: high priority first, then medium, then low. Completed items go to end.
  const sorted = [...items].sort((a, b) => {
    const aCompleted = completedIds.has(a.id);
    const bCompleted = completedIds.has(b.id);
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  // Find first incomplete item as starting point
  const firstIncompleteIdx = sorted.findIndex((t) => !completedIds.has(t.id));
  const [stepIdx, setStepIdx] = useState(
    firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0
  );

  const totalItems = sorted.length;
  const completedCount = sorted.filter((t) => completedIds.has(t.id)).length;
  const current = sorted[stepIdx];
  const isComplete = completedIds.has(current.id);

  // Calculate unlocked value
  const unlockedValue = sorted
    .filter((t) => completedIds.has(t.id))
    .reduce((sum, t) => sum + (ITEM_VALUES[t.id] ?? 0), 0);

  const totalValue = sorted.reduce(
    (sum, t) => sum + (ITEM_VALUES[t.id] ?? 0),
    0
  );

  const currentValue = ITEM_VALUES[current.id];
  const progressPercent = Math.round((completedCount / totalItems) * 100);
  const cardColor = current.card === "platinum" ? "#1a1a2e" : "#8B6914";

  const goNext = () => setStepIdx((i) => Math.min(i + 1, totalItems - 1));
  const goPrev = () => setStepIdx((i) => Math.max(i - 1, 0));

  const handleComplete = () => {
    if (!isComplete) {
      onToggle(current.id);
    }
    // Auto-advance to next incomplete
    const nextIncomplete = sorted.findIndex(
      (t, i) => i > stepIdx && !completedIds.has(t.id) && t.id !== current.id
    );
    if (nextIncomplete >= 0) {
      setStepIdx(nextIncomplete);
    } else {
      // Stay on current (all done)
    }
  };

  const allDone = completedCount === totalItems;

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[#111111]">
            Setup Progress
          </span>
          <span className="text-[11px] text-[#999999]">
            {completedCount} of {totalItems} complete
          </span>
        </div>
        <div className="w-full h-2 bg-[#ebedf0] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "#1a1a2e",
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#8B6914]" />
            <span className="text-sm font-medium text-[#111111]">
              ${unlockedValue.toLocaleString()}/yr unlocked
            </span>
          </div>
          <span className="text-[11px] text-[#999999]">
            ${totalValue.toLocaleString()}/yr total available
          </span>
        </div>
      </div>

      {/* All done state */}
      {allDone ? (
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f0efed] mb-4">
            <Check className="h-6 w-6 text-[#1a1a2e]" />
          </div>
          <h2 className="text-lg font-semibold text-[#111111] mb-2">
            All set up
          </h2>
          <p className="text-sm text-[#666666] max-w-md mx-auto">
            You&apos;ve completed all {totalItems} setup tasks and unlocked $
            {unlockedValue.toLocaleString()}/year in card benefits.
          </p>
        </div>
      ) : (
        /* Current step card */
        <div className="border border-[#e0ddd9] rounded-lg bg-white overflow-hidden">
          {/* Step indicator */}
          <div className="px-5 py-3 border-b border-[#e0ddd9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" style={{ color: cardColor }} />
              <span className="text-xs font-medium text-[#666666]">
                {current.card === "platinum" ? "Platinum" : "Gold"} Card
              </span>
            </div>
            <span className="text-xs text-[#999999]">
              Step {stepIdx + 1} of {totalItems}
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-base font-semibold text-[#111111] mb-2">
              {current.title}
            </h2>
            <p className="text-sm text-[#666666] mb-4">
              {current.description}
            </p>

            {currentValue && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f5f3f0] mb-4">
                <span className="text-xs font-medium text-[#111111]">
                  ${currentValue}/yr value
                </span>
              </div>
            )}

            {current.link && (
              <div className="mb-6">
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1a1a2e] hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open enrollment page
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isComplete ? (
                <button
                  onClick={goNext}
                  disabled={stepIdx === totalItems - 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-40"
                  style={{ backgroundColor: "#1a1a2e" }}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md"
                  style={{ backgroundColor: "#1a1a2e" }}
                >
                  <Check className="h-4 w-4" />
                  Mark as done
                </button>
              )}
              {!isComplete && (
                <button
                  onClick={goNext}
                  disabled={stepIdx === totalItems - 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666666] hover:text-[#111111] transition-colors disabled:opacity-40"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  Skip for now
                </button>
              )}
            </div>
          </div>

          {/* Navigation footer */}
          <div className="px-5 py-3 border-t border-[#e0ddd9] flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={stepIdx === 0}
              className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#111111] transition-colors disabled:opacity-40"
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </button>
            {/* Step dots */}
            <div className="flex items-center gap-1">
              {sorted.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setStepIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === stepIdx
                      ? "bg-[#1a1a2e]"
                      : completedIds.has(t.id)
                        ? "bg-[#999999]"
                        : "bg-[#e0ddd9]"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              disabled={stepIdx === totalItems - 1}
              className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#111111] transition-colors disabled:opacity-40"
            >
              Next
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
