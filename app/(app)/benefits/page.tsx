"use client";

import { useState, useMemo } from "react";
import { BENEFITS, CARDS } from "@/lib/data";
import { useUser } from "@/lib/user-context";
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

type FilterKey =
  | "all"
  | "platinum"
  | "gold"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annual"
  | "enrollment";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "platinum", label: "Platinum" },
  { key: "gold", label: "Gold" },
  { key: "monthly", label: "Monthly" },
  { key: "quarterly", label: "Quarterly" },
  { key: "semiannual", label: "Semiannual" },
  { key: "annual", label: "Annual" },
  { key: "enrollment", label: "Enrollment Required" },
];

function CardBadge({ card }: { card: string }) {
  const color = card === "platinum" ? CARDS.platinum.color : CARDS.gold.color;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {card === "platinum" ? "Platinum" : "Gold"}
    </span>
  );
}

function CadenceBadge({ cadence }: { cadence: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e0ddd9] bg-[#fafaf9] px-2 py-0.5 text-xs font-medium text-[#555]">
      {cadence.charAt(0).toUpperCase() + cadence.slice(1)}
    </span>
  );
}

export default function BenefitsPage() {
  const { cards: userCards } = useUser();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Only show benefits for the user's selected cards
  const userBenefits = useMemo(
    () => BENEFITS.filter((b) => userCards.includes(b.card)),
    [userCards]
  );

  const filtered = useMemo(() => {
    return userBenefits.filter((b) => {
      // search
      if (search) {
        const q = search.toLowerCase();
        const match =
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      // filter
      if (filter === "all") return true;
      if (filter === "platinum") return b.card === "platinum";
      if (filter === "gold") return b.card === "gold";
      if (filter === "enrollment") return b.enrollmentRequired;
      return b.cadence === filter;
    });
  }, [search, filter, userBenefits]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#111111]">
          Benefits Database
        </h1>
        <p className="text-sm text-[#777] mt-1">
          All Platinum & Gold benefits, searchable and filterable
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#999]" />
        <input
          type="text"
          placeholder="Search benefits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#e0ddd9] bg-white py-2 pl-10 pr-4 text-base sm:text-sm text-[#111111] placeholder:text-[#999] outline-none focus:border-[#bbb] transition-colors"
        />
      </div>

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
        {filtered.length} benefit{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Benefit cards */}
      <div className="space-y-3">
        {filtered.map((b) => {
          const isExpanded = expandedId === b.id;
          return (
            <div
              key={b.id}
              className="rounded-lg border border-[#e0ddd9] bg-white overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : b.id)}
                className="w-full text-left px-4 py-3 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-[#111111]">
                      {b.name}
                    </span>
                    {b.value !== null && (
                      <span className="text-xs font-semibold text-[#1a1a2e]">
                        ${b.value}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <CardBadge card={b.card} />
                    <CadenceBadge cadence={b.cadence} />
                  </div>
                  <p className="text-xs text-[#666] leading-relaxed">
                    {b.description}
                  </p>
                </div>
                <div className="shrink-0 mt-1 text-[#999]">
                  {isExpanded ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[#e0ddd9] px-4 py-3 bg-[#fafaf9] space-y-2.5">
                  <div>
                    <span className="text-xs font-medium text-[#999] uppercase tracking-wide">
                      Action
                    </span>
                    <p className="text-xs text-[#444] mt-0.5">{b.action}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#999] uppercase tracking-wide">
                      Caveats
                    </span>
                    <p className="text-xs text-[#444] mt-0.5">{b.caveats}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[#999] uppercase tracking-wide">
                      Enrollment
                    </span>
                    {b.enrollmentRequired ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <CheckCircle className="size-3" />
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[#999]">
                        <XCircle className="size-3" />
                        Not required
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {b.portalLink && (
                      <a
                        href={b.portalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        Portal
                      </a>
                    )}
                    <a
                      href={b.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      {b.sourceLabel}
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-[#999]">
            No benefits match your search.
          </div>
        )}
      </div>
    </div>
  );
}
