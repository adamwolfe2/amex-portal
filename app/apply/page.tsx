"use client";

import { useState } from "react";
import { CreditCard, Link2, BarChart3, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

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
              Thanks for applying! We'll review your application and get back to
              you within 48 hours with your custom referral link.
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
              Amex OS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
            Ambassador Program
          </h1>
          <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-md mx-auto">
            Earn 30% commission on every Pro upgrade from your referral link.
            Share Amex OS with your audience and help them maximize their card
            benefits.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: BarChart3, label: "30% Revenue Share" },
            { icon: Link2, label: "Custom Referral Link" },
            { icon: BarChart3, label: "Real-Time Dashboard" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="bg-white border border-[#e0ddd9] rounded-lg p-3 text-center"
            >
              <div className="mx-auto w-8 h-8 rounded-md bg-[#1a1a2e]/5 flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-[#1a1a2e]" />
              </div>
              <p className="text-xs font-medium text-[#1a1a2e] leading-tight">
                {label}
              </p>
            </div>
          ))}
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
              Which Amex cards do you have?
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
              Why do you want to be an Amex OS ambassador?{" "}
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
