"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  description: string;
}

export function UpgradePrompt({ feature, description }: UpgradePromptProps) {
  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
      <div className="flex items-center gap-2 mb-2">
        <Lock className="h-4 w-4 text-[#999999]" />
        <span className="text-sm font-semibold text-[#111111]">{feature}</span>
      </div>
      <p className="text-xs text-[#666666] mb-3">{description}</p>
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white rounded-md min-h-[44px]"
        style={{ backgroundColor: "#1a1a2e" }}
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
