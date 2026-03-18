"use client";

import { useState, useMemo } from "react";
import { TIPS, EVIDENCE_LEVELS } from "@/lib/data";
import { ExternalLink } from "lucide-react";

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

function EvidenceBadge({ evidence }: { evidence: string }) {
  const meta = EVIDENCE_LEVELS[evidence];
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

export default function TipsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    return TIPS.filter((t) => {
      if (filter === "all") return true;
      if (filter === "platinum") return t.card === "platinum" || t.card === "both";
      if (filter === "gold") return t.card === "gold" || t.card === "both";
      return t.evidence === filter;
    });
  }, [filter]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111111]">
          Tips & Data Points
        </h1>
        <p className="text-sm text-[#777] mt-1">
          Official rules, editor-tested strategies, and community reports
        </p>
      </div>

      {/* Filter row */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
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
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-medium text-sm text-[#111111]">
                  {t.title}
                </span>
                <EvidenceBadge evidence={t.evidence} />
              </div>
              <p className="text-xs text-[#666] leading-relaxed mb-2">
                {t.description}
              </p>
              <a
                href={t.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:underline"
              >
                <ExternalLink className="size-3" />
                {t.sourceLabel}
              </a>
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
