"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Loader2, DollarSign } from "lucide-react";
import {
  COMMISSION_RATE,
  MONTHLY_PRICE,
  ANNUAL_PRICE,
  LIFETIME_PRICE,
} from "@/lib/referral";

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Twitter/X", "Blog", "Other"];
const FOLLOWER_RANGES = ["Under 1K", "1K-10K", "10K-50K", "50K-100K", "100K+"];
const CARD_OPTIONS = ["Platinum", "Gold", "Neither"];

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [reason, setReason] = useState("");

  // Earnings calculator state
  const [referrals, setReferrals] = useState(100);
  const [calcPlan, setCalcPlan] = useState<"monthly" | "annual" | "lifetime">("monthly");

  const MONTHLY_COMMISSION = Math.round(MONTHLY_PRICE * COMMISSION_RATE);
  const ANNUAL_COMMISSION = Math.round(ANNUAL_PRICE * COMMISSION_RATE);
  const LIFETIME_COMMISSION = Math.round(LIFETIME_PRICE * COMMISSION_RATE);

  const monthlyEarnings = referrals * MONTHLY_COMMISSION;
  const yearlyEarnings = monthlyEarnings * 12;
  const annualEarnings = referrals * ANNUAL_COMMISSION;
  const lifetimeEarnings = referrals * LIFETIME_COMMISSION;

  const PRESETS = [
    { label: "100", value: 100 },
    { label: "500", value: 500 },
    { label: "1K", value: 1000 },
    { label: "5K", value: 5000 },
    { label: "10K", value: 10000 },
  ];

  function toggleCard(card: string) {
    setCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          handle,
          platform,
          followerCount,
          cards,
          reason: reason || null,
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
              Application Received
            </h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">
              We&apos;ll review your application and get back to you within 48
              hours with your custom referral link.
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
          <Image
            src="/logo.png"
            alt="CreditOS"
            width={48}
            height={32}
            className="mx-auto mb-4 rounded"
          />
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
            Ambassador Program
          </h1>
          <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-sm mx-auto">
            Earn 30% commission on every Pro upgrade from your referral link.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "30% Revenue\nShare" },
            { label: "Custom Referral\nLink" },
            { label: "Real-Time\nDashboard" },
          ].map(({ label }) => (
            <div
              key={label}
              className="bg-white border border-[#e0ddd9] rounded-lg px-3 py-3.5 text-center"
            >
              <p className="text-xs font-medium text-[#1a1a2e] leading-tight whitespace-pre-line">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Earnings Calculator */}
        <div className="bg-white border border-[#e0ddd9] rounded-xl p-6 mb-8">
          <style>{`
            input[type="range"].calc-slider {
              -webkit-appearance: none;
              appearance: none;
              width: 100%;
              height: 6px;
              border-radius: 3px;
              background: #e0ddd9;
              outline: none;
            }
            input[type="range"].calc-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #1a1a2e;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            input[type="range"].calc-slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #1a1a2e;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
          `}</style>

          <div className="flex items-center gap-2 mb-5">
            <DollarSign className="w-4 h-4 text-[#1a1a2e]" />
            <h2 className="text-sm font-semibold text-[#1a1a2e]">
              Earnings Calculator
            </h2>
          </div>

          {/* Plan Toggle */}
          <div className="flex items-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => setCalcPlan("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                calcPlan === "monthly"
                  ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                  : "bg-white text-[#6b6b6b] border-[#e0ddd9] hover:border-[#ccc]"
              }`}
            >
              Monthly (${MONTHLY_PRICE}/mo)
            </button>
            <button
              type="button"
              onClick={() => setCalcPlan("annual")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                calcPlan === "annual"
                  ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                  : "bg-white text-[#6b6b6b] border-[#e0ddd9] hover:border-[#ccc]"
              }`}
            >
              Annual (${ANNUAL_PRICE}/yr)
            </button>
            <button
              type="button"
              onClick={() => setCalcPlan("lifetime")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                calcPlan === "lifetime"
                  ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                  : "bg-white text-[#6b6b6b] border-[#e0ddd9] hover:border-[#ccc]"
              }`}
            >
              Lifetime (${LIFETIME_PRICE})
            </button>
          </div>

          {/* Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[#6b6b6b]">
                Referrals
              </label>
              <span className="text-xs font-semibold text-[#1a1a2e]">
                {referrals.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={10000}
              step={10}
              value={referrals}
              onChange={(e) => setReferrals(Number(e.target.value))}
              className="calc-slider"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {PRESETS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setReferrals(value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  referrals === value
                    ? "bg-[#1a1a2e]/5 border-[#1a1a2e] text-[#1a1a2e]"
                    : "bg-white border-[#e0ddd9] text-[#6b6b6b] hover:border-[#ccc]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Results */}
          {calcPlan === "monthly" ? (
            <div className="text-center">
              <p className="text-xs text-[#6b6b6b] mb-1">
                {referrals.toLocaleString()} referrals x ${MONTHLY_COMMISSION}/mo
              </p>
              <p className="text-3xl font-bold text-green-600 mb-1">
                ${monthlyEarnings.toLocaleString()}/month
              </p>
              <div className="mt-3 pt-3 border-t border-[#e0ddd9]">
                <p className="text-sm text-[#444444]">
                  That&apos;s{" "}
                  <span className="font-semibold text-[#111111]">
                    ${yearlyEarnings.toLocaleString()}
                  </span>{" "}
                  /year in recurring revenue
                </p>
              </div>
            </div>
          ) : calcPlan === "annual" ? (
            <div className="text-center">
              <p className="text-xs text-[#6b6b6b] mb-1">
                {referrals.toLocaleString()} referrals x ${ANNUAL_COMMISSION}/yr
              </p>
              <p className="text-3xl font-bold text-green-600 mb-1">
                ${annualEarnings.toLocaleString()}/year
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs text-[#6b6b6b] mb-1">
                {referrals.toLocaleString()} referrals x ${LIFETIME_COMMISSION}
              </p>
              <p className="text-3xl font-bold text-[#1a1a2e] mb-1">
                ${lifetimeEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-[#6b6b6b]">one-time</p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#e0ddd9] rounded-xl p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full h-9 px-3 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors placeholder:text-[#aaa]"
            />
          </div>

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

          {/* Handle */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Instagram / TikTok / YouTube handle
            </label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@yourhandle"
              className="w-full h-9 px-3 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors placeholder:text-[#aaa]"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Primary platform
            </label>
            <select
              required
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors appearance-none"
            >
              <option value="" disabled>
                Select a platform
              </option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Follower Count */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Approximate follower count
            </label>
            <select
              required
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors appearance-none"
            >
              <option value="" disabled>
                Select a range
              </option>
              {FOLLOWER_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
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

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Why do you want to be a CreditOS ambassador?{" "}
              <span className="text-[#aaa] font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Tell us a bit about why you'd be a great fit..."
              className="w-full px-3 py-2 text-sm border border-[#e0ddd9] rounded-lg bg-[#fafaf9] outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-colors resize-none placeholder:text-[#aaa]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#1a1a2e] text-white text-sm font-medium rounded-lg hover:bg-[#1a1a2e]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Submit Application
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-[#999] mt-6">
          Questions? Reply to your confirmation email.
        </p>
      </div>
    </div>
  );
}
