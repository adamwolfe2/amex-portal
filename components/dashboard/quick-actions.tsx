"use client";

import Link from "next/link";
import { Gift, Calendar, Lock, Wrench } from "lucide-react";

const ACTIONS = [
  { href: "/benefits", label: "Benefits", icon: Gift },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/vault", label: "Vault", icon: Lock },
  { href: "/tools", label: "Tools", icon: Wrench },
] as const;

export function QuickActions() {
  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white">
      <div className="px-4 pt-4 pb-2">
        <span className="text-sm font-semibold text-[#111111]">
          Quick Actions
        </span>
      </div>
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e0ddd9] px-3 py-2 text-xs font-medium text-[#444444] hover:text-[#111111] hover:bg-[#f5f4f1] transition-colors min-h-[44px]"
            >
              <action.icon className="size-3.5" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
