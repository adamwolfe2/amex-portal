"use client";

import { useState, useMemo, useEffect } from "react";
import { TIPS, EVIDENCE_LEVELS } from "@/lib/data";
import { ExternalLink, Plus, Send, X } from "lucide-react";
import { toast } from "sonner";

type FilterKey =
  | "all"
  | "official"
  | "editor-tested"
  | "community"
  | "dead"
  | "platinum"
  | "gold";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "official", label: "Official" },
  { key: "editor-tested", label: "Editor-Tested" },
  { key: "community", label: "Community" },
  { key: "dead", label: "Dead / Unreliable" },
  { key: "platinum", label: "Platinum" },
  { key: "gold", label: "Gold" },
];

const CARD_OPTIONS = [
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "both", label: "Both" },
] as const;

const CATEGORY_OPTIONS = [
  { value: "", label: "Select category (optional)" },
  { value: "earning", label: "Earning" },
  { value: "redeeming", label: "Redeeming" },
  { value: "stacking", label: "Stacking" },
  { value: "general", label: "General" },
] as const;

function EvidenceLabel({ evidence }: { evidence: string }) {
  const meta = EVIDENCE_LEVELS[evidence];
  if (!meta) return null;
  return (
    <span className="text-[11px] text-[#999999] shrink-0">
      {meta.label}
    </span>
  );
}

function SubmitTipForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [card, setCard] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const payload: Record<string, string> = { title, body, card };
      if (category) {
        payload.category = category;
      }

      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      toast.success("Tip submitted for review");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit tip"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#e0ddd9] bg-white p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#1a1a2e]">
          Submit a Community Tip
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center size-[44px] rounded-lg text-[#666] hover:bg-[#f5f5f3] transition-colors"
          aria-label="Close form"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="tip-title"
            className="block text-xs font-medium text-[#666] mb-1"
          >
            Title
          </label>
          <input
            id="tip-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short, descriptive title"
            required
            minLength={5}
            maxLength={200}
            className="w-full rounded-lg border border-[#e0ddd9] bg-[#fafaf9] px-3 py-2 text-base text-[#1a1a2e] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/30 focus:border-[#8B6914] min-h-[44px]"
          />
        </div>

        <div>
          <label
            htmlFor="tip-body"
            className="block text-xs font-medium text-[#666] mb-1"
          >
            Details
          </label>
          <textarea
            id="tip-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe the tip, how it works, and any caveats (min 20 characters)"
            required
            minLength={20}
            maxLength={1000}
            rows={4}
            className="w-full rounded-lg border border-[#e0ddd9] bg-[#fafaf9] px-3 py-2 text-base text-[#1a1a2e] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/30 focus:border-[#8B6914] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="tip-card"
              className="block text-xs font-medium text-[#666] mb-1"
            >
              Card
            </label>
            <select
              id="tip-card"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              required
              className="w-full rounded-lg border border-[#e0ddd9] bg-[#fafaf9] px-3 py-2 text-base text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/30 focus:border-[#8B6914] min-h-[44px]"
            >
              <option value="" disabled>
                Select card
              </option>
              {CARD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tip-category"
              className="block text-xs font-medium text-[#666] mb-1"
            >
              Category
            </label>
            <select
              id="tip-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-[#e0ddd9] bg-[#fafaf9] px-3 py-2 text-base text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/30 focus:border-[#8B6914] min-h-[44px]"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 text-sm font-medium text-white hover:bg-[#1a1a2e]/90 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          <Send className="size-3.5" />
          {submitting ? "Submitting..." : "Submit Tip"}
        </button>
      </div>
    </form>
  );
}

type CommunityTip = {
  id: number;
  title: string;
  body: string;
  card: string;
  category: string | null;
  createdAt: string | null;
};

export default function TipsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showForm, setShowForm] = useState(false);
  const [communityTips, setCommunityTips] = useState<CommunityTip[]>([]);

  useEffect(() => {
    fetch("/api/tips")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => Array.isArray(data) ? setCommunityTips(data) : null)
      .catch(() => null);
  }, []);

  const allTips = useMemo(() => {
    const mapped = communityTips.map((t) => ({
      id: `community-${t.id}`,
      title: t.title,
      description: t.body,
      evidence: "community" as const,
      card: t.card as "platinum" | "gold" | "both",
      category: t.category ?? undefined,
      sourceUrl: "#",
      sourceLabel: "Community submission",
    }));
    return [...TIPS, ...mapped];
  }, [communityTips]);

  const filtered = useMemo(() => {
    return allTips.filter((t) => {
      if (filter === "all") return true;
      if (filter === "platinum") return t.card === "platinum" || t.card === "both";
      if (filter === "gold") return t.card === "gold" || t.card === "both";
      return t.evidence === filter;
    });
  }, [filter, allTips]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">
            Tips & Data Points
          </h1>
          <p className="text-sm text-[#777] mt-1">
            Official rules, editor-tested strategies, and community reports
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 text-sm font-medium text-white hover:bg-[#1a1a2e]/90 transition-colors min-h-[44px]"
        >
          <Plus className="size-4" />
          Submit a Tip
        </button>
      </div>

      {showForm && <SubmitTipForm onClose={() => setShowForm(false)} />}

      {/* Filter row */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[44px] flex items-center ${
              filter === f.key
                ? "bg-[#1a1a2e] text-white"
                : "bg-white border border-[#e0ddd9] text-[#555] hover:bg-[#f5f5f3]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-[#999] mb-3">
        {filtered.length} tip{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Tip cards */}
      <div className="space-y-3">
        {filtered.map((t) => {
          const isDead = t.evidence === "dead";
          return (
            <div
              key={t.id}
              className={`rounded-lg border border-[#e0ddd9] bg-white px-4 py-3 transition-opacity ${
                isDead ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <span className="font-medium text-sm text-[#111111]">
                  {t.title}
                </span>
                <EvidenceLabel evidence={t.evidence} />
              </div>
              <p className="text-xs text-[#666] leading-relaxed mb-2">
                {t.description}
              </p>
              {t.sourceUrl !== "#" && (
                <a
                  href={t.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:underline"
                >
                  <ExternalLink className="size-3" />
                  {t.sourceLabel}
                </a>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-[#999]">
            No tips match your filter.
          </div>
        )}
      </div>
    </div>
  );
}
