"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist";
import { CreditCard, Check, ArrowRight, Sparkles } from "lucide-react";
import type { CardKey } from "@/lib/data/types";

type CardSelection = "platinum" | "gold" | "both" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<CardSelection>(null);
  const [saving, setSaving] = useState(false);

  const selectedCards: CardKey[] =
    selection === "both"
      ? ["platinum", "gold"]
      : selection
        ? [selection]
        : [];

  const relevantTasks = CHECKLIST_ITEMS.filter((t) =>
    selectedCards.includes(t.card)
  );

  const handleContinue = async () => {
    if (step === 1 && selection) {
      setStep(2);
      return;
    }

    setSaving(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: selectedCards }),
      });
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          <span
            className={`h-2 w-8 rounded-full transition-colors ${
              step >= 1 ? "bg-[#1a1a2e]" : "bg-[#e0ddd9]"
            }`}
          />
          <span
            className={`h-2 w-8 rounded-full transition-colors ${
              step >= 2 ? "bg-[#1a1a2e]" : "bg-[#e0ddd9]"
            }`}
          />
        </div>

        {step === 1 ? (
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
                className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
                  selection === "platinum"
                    ? "border-[#1a1a2e] bg-[#fafaf9]"
                    : "border-[#e0ddd9] bg-white hover:border-[#ccc]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#1a1a2e" }}
                    >
                      <CreditCard className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        Platinum Card
                      </p>
                      <p className="text-xs text-[#666666]">$895/year</p>
                    </div>
                  </div>
                  {selection === "platinum" && (
                    <Check className="h-5 w-5 text-[#1a1a2e]" />
                  )}
                </div>
              </button>

              {/* Gold */}
              <button
                onClick={() => setSelection("gold")}
                className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
                  selection === "gold"
                    ? "border-[#8B6914] bg-[#fafaf9]"
                    : "border-[#e0ddd9] bg-white hover:border-[#ccc]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#8B6914" }}
                    >
                      <CreditCard className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        Gold Card
                      </p>
                      <p className="text-xs text-[#666666]">$325/year</p>
                    </div>
                  </div>
                  {selection === "gold" && (
                    <Check className="h-5 w-5 text-[#8B6914]" />
                  )}
                </div>
              </button>

              {/* Both */}
              <button
                onClick={() => setSelection("both")}
                className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
                  selection === "both"
                    ? "border-[#1a1a2e] bg-[#fafaf9]"
                    : "border-[#e0ddd9] bg-white hover:border-[#ccc]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#8B6914]">
                      <Sparkles className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        Both Cards
                      </p>
                      <p className="text-xs text-[#666666]">
                        Platinum + Gold
                      </p>
                    </div>
                  </div>
                  {selection === "both" && (
                    <Check className="h-5 w-5 text-[#1a1a2e]" />
                  )}
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
        ) : (
          <>
            {/* Step 2: Setup checklist */}
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
                onClick={() => setStep(1)}
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={saving}
                className="flex-1"
                size="lg"
              >
                {saving ? "Saving..." : "Continue to Dashboard"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
