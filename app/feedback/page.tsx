"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

const CARD_OPTIONS = [
  "Platinum",
  "Gold",
  "Green",
  "Blue",
  "Business Platinum",
  "Business Gold",
  "Other",
];

const PRICE_OPTIONS = [
  "$0 Free only",
  "$5-10/mo",
  "$10-20/mo",
  "$20-30/mo",
  "One-time $29 lifetime",
  "One-time $49 lifetime",
];

const TRACKING_OPTIONS = [
  "I don't track them",
  "Spreadsheet",
  "Notes app",
  "Another app",
  "Calendar reminders",
];

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [mainProblem, setMainProblem] = useState("");
  const [wishFeature, setWishFeature] = useState("");
  const [priceWillingness, setPriceWillingness] = useState("");
  const [currentTracking, setCurrentTracking] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  function toggleCard(card: string) {
    setCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  }

  function toggleTracking(method: string) {
    setCurrentTracking((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          cards,
          mainProblem,
          wishFeature,
          priceWillingness,
          currentTracking,
          additionalNotes: additionalNotes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-dvh bg-[#fafaf9] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-[#e0ddd9] rounded-xl p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#1a1a2e]/5 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">
              Thank You
            </h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">
              Thank you for your feedback! Your input helps us build the best
              card benefits platform possible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#fafaf9] flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-[#1a1a2e] tracking-tight">
              CreditOS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
            Help Us Build CreditOS
          </h1>
          <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-md mx-auto">
            We're building the ultimate platform for maximizing your card
            benefits. Your feedback shapes what we build next.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#e0ddd9] rounded-xl p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full h-9 px-3 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors placeholder:text-[#aaa]"
            />
          </div>

          {/* Cards */}
          <fieldset>
            <legend className="block text-sm font-medium text-[#1a1a2e] mb-2">
              Which cards do you have?
            </legend>
            <div className="flex flex-wrap gap-2">
              {CARD_OPTIONS.map((card) => (
                <label
                  key={card}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                    cards.includes(card)
                      ? "border-[#1a1a2e] bg-[#1a1a2e]/5 text-[#1a1a2e] font-medium"
                      : "border-[#e0ddd9] bg-[#fafaf9] text-[#6b6b6b] hover:border-[#ccc]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={cards.includes(card)}
                    onChange={() => toggleCard(card)}
                    className="sr-only"
                  />
                  {card}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Main Problem */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              What's the #1 problem you have managing your card benefits?
            </label>
            <textarea
              required
              value={mainProblem}
              onChange={(e) => setMainProblem(e.target.value)}
              rows={3}
              placeholder="e.g., I forget to use my monthly credits before they expire..."
              className="w-full px-3 py-2 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors resize-none placeholder:text-[#aaa]"
            />
          </div>

          {/* Wish Feature */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              What's one thing you wish a platform like CreditOS could solve?
            </label>
            <textarea
              required
              value={wishFeature}
              onChange={(e) => setWishFeature(e.target.value)}
              rows={3}
              placeholder="e.g., Automatically track all my credits and remind me before reset dates..."
              className="w-full px-3 py-2 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors resize-none placeholder:text-[#aaa]"
            />
          </div>

          {/* Price Willingness */}
          <fieldset>
            <legend className="block text-sm font-medium text-[#1a1a2e] mb-2">
              How much would you pay per month for a tool that helps you maximize
              every credit and benefit?
            </legend>
            <div className="space-y-2">
              {PRICE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                    priceWillingness === option
                      ? "border-[#1a1a2e] bg-[#1a1a2e]/5 text-[#1a1a2e] font-medium"
                      : "border-[#e0ddd9] bg-[#fafaf9] text-[#6b6b6b] hover:border-[#ccc]"
                  }`}
                >
                  <input
                    type="radio"
                    name="priceWillingness"
                    value={option}
                    checked={priceWillingness === option}
                    onChange={(e) => setPriceWillingness(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      priceWillingness === option
                        ? "border-[#1a1a2e]"
                        : "border-[#ccc]"
                    }`}
                  >
                    {priceWillingness === option && (
                      <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />
                    )}
                  </div>
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Current Tracking */}
          <fieldset>
            <legend className="block text-sm font-medium text-[#1a1a2e] mb-2">
              How do you currently track your card benefits?
            </legend>
            <div className="flex flex-wrap gap-2">
              {TRACKING_OPTIONS.map((method) => (
                <label
                  key={method}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                    currentTracking.includes(method)
                      ? "border-[#1a1a2e] bg-[#1a1a2e]/5 text-[#1a1a2e] font-medium"
                      : "border-[#e0ddd9] bg-[#fafaf9] text-[#6b6b6b] hover:border-[#ccc]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={currentTracking.includes(method)}
                    onChange={() => toggleTracking(method)}
                    className="sr-only"
                  />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Anything else you'd like us to know?{" "}
              <span className="text-[#aaa] font-normal">(optional)</span>
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              placeholder="Any other thoughts, suggestions, or frustrations..."
              className="w-full px-3 py-2 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors resize-none placeholder:text-[#aaa]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !priceWillingness}
            className="w-full h-10 bg-[#1a1a2e] text-white text-sm font-medium rounded-lg hover:bg-[#1a1a2e]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Submit Feedback
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-[#999] mt-6">
          Your feedback is anonymous and helps us build a better product.
        </p>
      </div>
    </div>
  );
}
