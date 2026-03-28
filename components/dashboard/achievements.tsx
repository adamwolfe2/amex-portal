"use client";

import {
  Award,
  Flame,
  Target,
  Star,
  Zap,
  Crown,
  Trophy,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Flame,
  Target,
  Star,
  Zap,
  Crown,
  Trophy,
  Shield,
};

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
}

interface AchievementsProps {
  badges: AchievementBadge[];
  totalCount: number;
}

export function Achievements({ badges, totalCount }: AchievementsProps) {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="border border-[#e0ddd9] rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#111111]">Achievements</h3>
        <span className="text-xs text-[#999999]">
          {unlockedCount} of {totalCount} unlocked
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mb-1">
        {badges.map((badge) => {
          const IconComponent = ICON_MAP[badge.iconName] ?? Star;
          const unlocked = badge.unlocked;

          return (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-1.5 min-w-[56px]"
              title={badge.description}
            >
              <div
                className={`flex items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 ${
                  unlocked ? "bg-[#1a1a2e]" : "bg-[#f0efed]"
                }`}
                style={{ width: 44, height: 44 }}
              >
                <IconComponent
                  className={`h-5 w-5 ${
                    unlocked ? "text-white" : "text-[#999999]"
                  }`}
                  style={{ opacity: unlocked ? 1 : 0.2 }}
                />
              </div>
              <span
                className={`text-[10px] text-center leading-tight max-w-[56px] ${
                  unlocked ? "text-[#111111]" : "text-[#999999]"
                }`}
                style={{ opacity: unlocked ? 1 : 0.4 }}
              >
                {badge.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
