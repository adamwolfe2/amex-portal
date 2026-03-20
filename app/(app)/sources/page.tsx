import type { Metadata } from "next";
import {
  BookOpen,
  ExternalLink,
  Building2,
  Globe,
  Users,
} from "lucide-react";
import { SOURCES } from "@/lib/data/sources";

export const metadata: Metadata = { title: "Sources" };

const typeConfig = {
  official: {
    label: "Official Sources",
    desc: "Direct from American Express",
    Icon: Building2,
    badgeBg: "bg-[#1a1a2e]",
    badgeText: "text-white",
  },
  "third-party": {
    label: "Third-Party Sources",
    desc: "Expert analysis and tools",
    Icon: Globe,
    badgeBg: "bg-[#f0efed]",
    badgeText: "text-[#666666]",
  },
  community: {
    label: "Community Sources",
    desc: "Data points from cardholders",
    Icon: Users,
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
  },
} as const;

export default function SourcesPage() {
  const official = SOURCES.filter((s) => s.type === "official");
  const thirdParty = SOURCES.filter((s) => s.type === "third-party");
  const community = SOURCES.filter((s) => s.type === "community");

  const groups = [
    { type: "official" as const, items: official },
    { type: "third-party" as const, items: thirdParty },
    { type: "community" as const, items: community },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">Sources</h1>
        </div>
        <p className="text-sm text-[#666666]">
          References and data sources used throughout CreditOS
        </p>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const config = typeConfig[group.type];
          return (
            <div key={group.type}>
              <div className="flex items-center gap-2 mb-3">
                <config.Icon className="h-4 w-4 text-[#666666]" />
                <h2 className="text-xs font-medium text-[#999999] uppercase tracking-wider">
                  {config.label}
                </h2>
                <span className="text-xs text-[#999999]">
                  — {config.desc}
                </span>
              </div>
              <div className="space-y-2">
                {group.items.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-[#e0ddd9] rounded-lg bg-white p-4 hover:border-[#1a1a2e] transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-medium text-[#111111] group-hover:text-[#1a1a2e]">
                            {source.title}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${config.badgeBg} ${config.badgeText}`}
                          >
                            {group.type === "official"
                              ? "Official"
                              : group.type === "third-party"
                                ? "Third-Party"
                                : "Community"}
                          </span>
                        </div>
                        <p className="text-xs text-[#666666]">
                          {source.description}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-[#999999] group-hover:text-[#1a1a2e] shrink-0 mt-0.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
