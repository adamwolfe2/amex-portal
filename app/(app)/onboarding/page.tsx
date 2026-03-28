"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist";
import { BENEFITS, CARDS } from "@/lib/data";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { CardKey } from "@/lib/data/types";
import { quickClaimBenefit } from "@/lib/actions/claims";

const platBenefitCount = BENEFITS.filter((b) => b.card === "platinum").length;
const goldBenefitCount = BENEFITS.filter((b) => b.card === "gold").length;

const PERIODS_MAP: Record<string, number> = {
  monthly: 12,
  quarterly: 4,
  semiannual: 2,
  annual: 1,
  "multi-year": 1,
  ongoing: 1,
};

type CardSelection = "platinum" | "gold" | "both" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<CardSelection>(null);
  const [saving, setSaving] = useState(false);
  const [baselineClaimed, setBaselineClaimed] = useState<Set<string>>(
    new Set()
  );
  const [isClaiming, startClaiming] = useTransition();

  const selectedCards: CardKey[] =
    selection === "both"
      ? ["platinum", "gold"]
      : selection
        ? [selection]
        : [];

  const relevantTasks = CHECKLIST_ITEMS.filter((t) =>
    selectedCards.includes(t.card)
  );

  const relevantBenefits = BENEFITS.filter(
    (b) => selectedCards.includes(b.card) && b.value !== null
  );

  // Benefits that can be baselined (have a claimable value with periodic resets)
  const baselineBenefits = relevantBenefits.filter(
    (b) => b.cadence !== "ongoing" && b.cadence !== "multi-year"
  );

  const totalAnnualValue = relevantBenefits.reduce(
    (sum, b) => sum + (b.value ?? 0),
    0
  );

  const baselineClaimedValue = baselineBenefits
    .filter((b) => baselineClaimed.has(b.id))
    .reduce((sum, b) => {
      const periods = PERIODS_MAP[b.cadence] ?? 1;
      return sum + (b.value ?? 0) / periods;
    }, 0);

  const baselineAvailableValue = baselineBenefits.reduce((sum, b) => {
    const periods = PERIODS_MAP[b.cadence] ?? 1;
    return sum + (b.value ?? 0) / periods;
  }, 0);

  const baselinePercent =
    baselineAvailableValue > 0
      ? Math.round((baselineClaimedValue / baselineAvailableValue) * 100)
      : 0;

  const topBenefits = [...relevantBenefits]
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, 3);

  function toggleBaseline(id: string) {
    setBaselineClaimed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const handleContinue = async () => {
    if (step === 1 && selection) {
      setStep(2);
      return;
    }

    if (step === 2) {
      // Save baseline claims
      if (baselineClaimed.size > 0) {
        startClaiming(async () => {
          const promises = [...baselineClaimed].map((id) =>
            quickClaimBenefit(id)
          );
          const results = await Promise.all(promises);
          const failures = results.filter((r) => !r.success);
          if (failures.length > 0) {
            toast.error(
              `Could not save ${failures.length} claim${failures.length > 1 ? "s" : ""}. You can update these later.`
            );
          }
          setStep(3);
        });
      } else {
        setStep(3);
      }
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: selectedCards }),
      });
      if (!res.ok) {
        toast.error("Failed to save your card selection. Please try again.");
        return;
      }
      router.refresh();
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-full max-w-lg space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={`h-2 w-8 rounded-full transition-colors ${
                step >= s ? "bg-[#1a1a2e]" : "bg-[#e0ddd9]"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            {/* Step 1: Card selection */}
            <div className="text-center">
              <h1 className="text-xl font-semibold text-[#111111] mb-1">
                Which cards do you have?
              </h1>
              <p className="text-sm text-[#666666]">
                We will tailor your experience based on your card portfolio
              </p>
            </div>

            <div className="space-y-3">
              {/* Platinum */}
              <button
                onClick={() => setSelection("platinum")}
                className={`w-full rounded-xl border-2 text-left transition-all overflow-hidden ${
                  selection === "platinum"
                    ? "border-[#1a1a2e] shadow-lg"
                    : "border-[#e0ddd9] hover:border-[#ccc]"
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">
                        Platinum Card
                      </p>
                      <p className="text-xs text-[#666666]">
                        $895/year — {platBenefitCount} benefits
                      </p>
                    </div>
                    {selection === "platinum" && (
                      <Check className="h-5 w-5 text-[#1a1a2e]" />
                    )}
                  </div>
                  <Image
                    src="/platinum-card.png"
                    alt="Platinum Card"
                    width={280}
                    height={176}
                    className="w-full max-w-[240px] rounded-lg shadow-md"
                  />
                </div>
              </button>

              {/* Gold */}
              <button
                onClick={() => setSelection("gold")}
                className={`w-full rounded-xl border-2 text-left transition-all overflow-hidden ${
                  selection === "gold"
                    ? "border-[#8B6914] shadow-lg"
                    : "border-[#e0ddd9] hover:border-[#ccc]"
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">
                        Gold Card
                      </p>
                      <p className="text-xs text-[#666666]">
                        $325/year — {goldBenefitCount} benefits
                      </p>
                    </div>
                    {selection === "gold" && (
                      <Check className="h-5 w-5 text-[#8B6914]" />
                    )}
                  </div>
                  <Image
                    src="/gold-card.png"
                    alt="Gold Card"
                    width={280}
                    height={176}
                    className="w-full max-w-[240px] rounded-lg shadow-md"
                  />
                </div>
              </button>

              {/* Both */}
              <button
                onClick={() => setSelection("both")}
                className={`w-full rounded-xl border-2 text-left transition-all overflow-hidden ${
                  selection === "both"
                    ? "border-[#1a1a2e] shadow-lg"
                    : "border-[#e0ddd9] hover:border-[#ccc]"
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">
                        Both Cards
                      </p>
                      <p className="text-xs text-[#666666]">
                        Platinum + Gold — All benefits
                      </p>
                    </div>
                    {selection === "both" && (
                      <Check className="h-5 w-5 text-[#1a1a2e]" />
                    )}
                  </div>
                  <div className="flex items-center -space-x-8">
                    <Image
                      src="/platinum-card.png"
                      alt="Platinum"
                      width={160}
                      height={100}
                      className="rounded-lg shadow-md -rotate-3"
                    />
                    <Image
                      src="/gold-card.png"
                      alt="Gold"
                      width={160}
                      height={100}
                      className="rounded-lg shadow-md rotate-3 relative z-10"
                    />
                  </div>
                </div>
              </button>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!selection}
              className="w-full"
              size="lg"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2: Baseline benefits */}
            <div className="text-center">
              <h1 className="text-xl font-semibold text-[#111111] mb-1">
                What have you used this month?
              </h1>
              <p className="text-sm text-[#666666]">
                Check off credits you&apos;ve already claimed so we can
                show your real progress
              </p>
            </div>

            {/* Progress summary */}
            <div className="bg-white border border-[#e0ddd9] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-[#111111]">
                  This Period
                </p>
                <p className="text-sm font-semibold text-[#111111] tabular-nums">
                  {baselinePercent}%
                </p>
              </div>
              <div className="h-2 bg-[#f0eeeb] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-[#1a1a2e] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${baselinePercent}%` }}
                />
              </div>
              <p className="text-xs text-[#666666]">
                <span className="font-semibold text-[#111111] tabular-nums">
                  ${Math.round(baselineClaimedValue)}
                </span>{" "}
                of ${Math.round(baselineAvailableValue)} claimed
              </p>
            </div>

            {/* Benefits list grouped by card */}
            <div className="max-h-[45vh] overflow-y-auto space-y-4">
              {selectedCards.map((cardKey) => {
                const card = CARDS[cardKey];
                const cardBenefits = baselineBenefits.filter(
                  (b) => b.card === cardKey
                );
                if (cardBenefits.length === 0) return null;
                return (
                  <div key={cardKey}>
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-[#fafaf9] py-1 z-10">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: card.color }}
                      />
                      <p className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
                        {card.name}
                      </p>
                    </div>
                    <div className="border border-[#e0ddd9] rounded-lg bg-white divide-y divide-[#f0eeeb]">
                      {cardBenefits.map((benefit) => {
                        const checked = baselineClaimed.has(benefit.id);
                        const perPeriod =
                          (benefit.value ?? 0) /
                          (PERIODS_MAP[benefit.cadence] ?? 1);
                        return (
                          <button
                            key={benefit.id}
                            onClick={() => toggleBaseline(benefit.id)}
                            className="flex items-center gap-3 w-full p-3.5 text-left group cursor-pointer"
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                checked
                                  ? "border-[#1a1a2e] bg-[#1a1a2e]"
                                  : "border-[#ccc9c4] group-hover:border-[#1a1a2e]"
                              }`}
                            >
                              {checked && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm transition-colors ${
                                  checked
                                    ? "text-[#999999] line-through"
                                    : "text-[#111111] font-medium"
                                }`}
                              >
                                {benefit.name}
                              </p>
                              <p className="text-xs text-[#999999] capitalize">
                                {benefit.cadence}
                              </p>
                            </div>
                            <span
                              className={`text-sm tabular-nums font-semibold transition-colors ${
                                checked ? "text-[#999999]" : "text-[#111111]"
                              }`}
                            >
                              ${Math.round(perPeriod)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isClaiming}
                className="flex-1"
                size="lg"
              >
                {isClaiming
                  ? "Saving..."
                  : baselineClaimed.size > 0
                    ? `Continue (${baselineClaimed.size})`
                    : "Skip for Now"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {/* Step 3: Setup checklist */}
            <div className="text-center">
              <h1 className="text-xl font-semibold text-[#111111] mb-1">
                Quick Setup
              </h1>
              <p className="text-sm text-[#666666]">
                Here are the key steps to maximize your{" "}
                {selection === "both"
                  ? "Platinum & Gold"
                  : selection === "platinum"
                    ? "Platinum"
                    : "Gold"}{" "}
                benefits
              </p>
            </div>

            <div className="border border-[#e0ddd9] rounded-lg bg-white divide-y divide-[#e0ddd9] max-h-[50vh] overflow-y-auto">
              {relevantTasks
                .filter((t) => t.priority === "high")
                .map((task) => (
                  <div key={task.id} className="p-4 flex items-start gap-3">
                    <span
                      className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                        task.priority === "high"
                          ? "bg-red-400"
                          : task.priority === "medium"
                            ? "bg-yellow-400"
                            : "bg-[#ccc]"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        {task.title}
                      </p>
                      <p className="text-xs text-[#666666] mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1"
                size="lg"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            {/* Step 4: Celebration / value summary */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="h-6 w-6 text-[#8B6914]" />
                <h1 className="text-xl font-semibold text-[#111111]">
                  You&apos;re all set
                </h1>
              </div>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-3">
                ${totalAnnualValue.toLocaleString()}/year in benefits
              </p>
              {baselineClaimed.size > 0 && (
                <p className="text-sm text-[#666666] mt-1">
                  {baselineClaimed.size} benefit
                  {baselineClaimed.size > 1 ? "s" : ""} already tracked this
                  month
                </p>
              )}
              <p className="text-sm text-[#666666] mt-1">
                Let&apos;s start tracking
              </p>
            </div>

            <div className="border border-[#e0ddd9] rounded-lg bg-white divide-y divide-[#e0ddd9]">
              {topBenefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {baselineClaimed.has(benefit.id) && (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                    <p className="text-sm font-medium text-[#111111]">
                      {benefit.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">
                    ${benefit.value?.toLocaleString()}/yr
                  </p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleContinue}
              disabled={saving}
              className="w-full min-h-[44px]"
              size="lg"
            >
              {saving ? "Saving..." : "Go to Dashboard"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>

            <p className="text-center text-xs text-[#666666]">
              You can set up each benefit from the checklist anytime
            </p>
          </>
        )}
      </div>
    </div>
  );
}
