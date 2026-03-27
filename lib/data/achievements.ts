import { Award, Flame, Target, Star, Zap, Crown, Trophy, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  check: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalClaims: number;
  currentStreak: number;
  longestStreak: number;
  checklistCompleted: number;
  checklistTotal: number;
  capturedValue: number;
  benefitsClaimed: Set<string>;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-claim",
    name: "First Steps",
    description: "Claim your first benefit",
    icon: Star,
    check: (s) => s.totalClaims >= 1,
  },
  {
    id: "ten-claims",
    name: "Getting Started",
    description: "Record 10 benefit claims",
    icon: Target,
    check: (s) => s.totalClaims >= 10,
  },
  {
    id: "fifty-claims",
    name: "Power User",
    description: "Record 50 benefit claims",
    icon: Zap,
    check: (s) => s.totalClaims >= 50,
  },
  {
    id: "streak-3",
    name: "On a Roll",
    description: "Maintain a 3-month streak",
    icon: Flame,
    check: (s) => s.longestStreak >= 3,
  },
  {
    id: "streak-6",
    name: "Half Year Hero",
    description: "Maintain a 6-month streak",
    icon: Flame,
    check: (s) => s.longestStreak >= 6,
  },
  {
    id: "streak-12",
    name: "Full Year Champion",
    description: "Maintain a 12-month streak",
    icon: Crown,
    check: (s) => s.longestStreak >= 12,
  },
  {
    id: "checklist-complete",
    name: "Fully Enrolled",
    description: "Complete your entire setup checklist",
    icon: Shield,
    check: (s) => s.checklistCompleted === s.checklistTotal && s.checklistTotal > 0,
  },
  {
    id: "value-1000",
    name: "Thousand Club",
    description: "Capture $1,000+ in benefits",
    icon: Trophy,
    check: (s) => s.capturedValue >= 1000,
  },
  {
    id: "value-3000",
    name: "Maximizer",
    description: "Capture $3,000+ in benefits",
    icon: Award,
    check: (s) => s.capturedValue >= 3000,
  },
];

export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.check(stats));
}
