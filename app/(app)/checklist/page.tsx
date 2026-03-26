"use client";

import { useState, useEffect } from "react";
import {
  CheckSquare,
  ExternalLink,
  CreditCard,
  List,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { CHECKLIST_ITEMS } from "@/lib/data/checklist";
import { EnrollmentWizard } from "@/components/checklist/enrollment-wizard";

const priorityLabels = {
  high: "Do first",
  medium: "When ready",
  low: "Optional",
} as const;

type ViewMode = "list" | "wizard";

export default function ChecklistPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("wizard");

  useEffect(() => {
    fetch("/api/user/checklist")
      .then((r) => r.json())
      .then((data) => {
        setCompletedIds(new Set(data.completedIds ?? []));
      })
      .catch(() => {
        toast.error("Failed to load progress. Please refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (itemId: string) => {
    const newCompleted = !completedIds.has(itemId);
    const prev = new Set(completedIds);
    const next = new Set(completedIds);
    if (newCompleted) {
      next.add(itemId);
    } else {
      next.delete(itemId);
    }
    setCompletedIds(next);

    try {
      const res = await fetch("/api/user/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, completed: newCompleted }),
      });
      if (!res.ok) {
        setCompletedIds(prev);
        toast.error("Failed to save. Please try again.");
      }
    } catch {
      setCompletedIds(prev);
      toast.error("Failed to save. Please try again.");
    }
  };

  const platItems = CHECKLIST_ITEMS.filter((t) => t.card === "platinum");
  const goldItems = CHECKLIST_ITEMS.filter((t) => t.card === "gold");
  const platDone = platItems.filter((t) => completedIds.has(t.id)).length;
  const goldDone = goldItems.filter((t) => completedIds.has(t.id)).length;

  const renderGroup = (
    label: string,
    items: typeof CHECKLIST_ITEMS,
    done: number,
    accentColor: string
  ) => (
    <div className="border border-[#e0ddd9] rounded-lg bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e0ddd9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" style={{ color: accentColor }} />
          <h2 className="text-sm font-medium text-[#111111]">{label}</h2>
        </div>
        <span className="text-xs text-[#666666]">
          {done}/{items.length} complete
        </span>
      </div>
      <div className="divide-y divide-[#e0ddd9]">
        {items.map((item) => {
          const checked = completedIds.has(item.id);
          return (
            <div
              key={item.id}
              className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                checked ? "bg-[#fafaf9]" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(item.id)}
                className="mt-0.5 h-4 w-4 rounded border-[#e0ddd9] cursor-pointer"
                style={{ accentColor }}
                aria-label={`Mark "${item.title}" as ${checked ? "incomplete" : "complete"}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-medium ${
                      checked
                        ? "text-[#999999] line-through"
                        : "text-[#111111]"
                    }`}
                  >
                    {item.title}
                  </p>
                  <span className="text-[11px] text-[#999999] shrink-0 mt-0.5">
                    {priorityLabels[item.priority]}
                  </span>
                </div>
                <p className="text-xs text-[#666666] mt-0.5">
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#1a1a2e] hover:underline mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open enrollment
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[#1a1a2e]" />
            <h1 className="text-xl font-semibold text-[#111111]">
              Setup Checklist
            </h1>
          </div>
          {/* View toggle */}
          <div className="flex items-center border border-[#e0ddd9] rounded-md overflow-hidden">
            <button
              onClick={() => setView("wizard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "wizard"
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-white text-[#666666] hover:text-[#111111]"
              }`}
            >
              <Compass className="h-3 w-3" />
              Guided
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "list"
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-white text-[#666666] hover:text-[#111111]"
              }`}
            >
              <List className="h-3 w-3" />
              List
            </button>
          </div>
        </div>
        <p className="text-sm text-[#666666]">
          {view === "wizard"
            ? "Walk through each benefit setup step by step"
            : "Complete these one-time tasks to activate all your card benefits"}
        </p>
      </div>

      {view === "wizard" ? (
        <EnrollmentWizard
          items={CHECKLIST_ITEMS}
          completedIds={completedIds}
          onToggle={toggle}
        />
      ) : (
        <div className="space-y-6">
          {renderGroup("Platinum Card", platItems, platDone, "#1a1a2e")}
          {renderGroup("Gold Card", goldItems, goldDone, "#8B6914")}
        </div>
      )}
    </div>
  );
}
