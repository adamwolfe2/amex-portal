import type { Metadata } from "next";
import { getActionItems } from "@/lib/data/actions";

export const metadata: Metadata = { title: "Actions" };
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CreditCard,
} from "lucide-react";

const priorityConfig = {
  high: { dot: "bg-red-500", label: "High", Icon: AlertCircle },
  medium: { dot: "bg-amber-500", label: "Medium", Icon: AlertTriangle },
  low: { dot: "bg-blue-400", label: "Low", Icon: Info },
} as const;

const cardBadge = {
  platinum: { label: "Platinum", bg: "bg-[#1a1a2e]", text: "text-white" },
  gold: { label: "Gold", bg: "bg-[#92702a]", text: "text-white" },
  both: { label: "Both Cards", bg: "bg-[#f0efed]", text: "text-[#666666]" },
} as const;

export default function ActionsPage() {
  const actions = getActionItems();

  const high = actions.filter((a) => a.priority === "high");
  const medium = actions.filter((a) => a.priority === "medium");
  const low = actions.filter((a) => a.priority === "low");

  const groups = [
    { label: "High Priority", items: high, priority: "high" as const },
    { label: "Medium Priority", items: medium, priority: "medium" as const },
    { label: "Low Priority", items: low, priority: "low" as const },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">Actions</h1>
        </div>
        <p className="text-sm text-[#666666]">
          Time-sensitive reminders based on your benefit reset schedule
        </p>
      </div>

      {groups.length === 0 && (
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-8 text-center">
          <Info className="h-8 w-8 text-[#999999] mx-auto mb-3" />
          <p className="text-sm text-[#666666]">
            No time-sensitive actions right now. Check back at the start of the
            month or quarter.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {groups.map((group) => {
          const config = priorityConfig[group.priority];
          return (
            <div key={group.priority}>
              <h2 className="text-xs font-medium text-[#999999] uppercase tracking-wider mb-3">
                {group.label}
              </h2>
              <div className="space-y-2">
                {group.items.map((item, i) => {
                  const badge = cardBadge[item.card];
                  return (
                    <div
                      key={`${group.priority}-${i}`}
                      className="border border-[#e0ddd9] rounded-lg bg-white p-4 flex items-start gap-3"
                    >
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${config.dot}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}
                          >
                            <CreditCard className="h-3 w-3" />
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#111111]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#666666] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
