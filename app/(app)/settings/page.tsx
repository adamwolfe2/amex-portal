"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Copy,
  Check,
  CreditCard,
  LogOut,
  Crown,
  User,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [copied, setCopied] = useState(false);
  const [platChecked, setPlatChecked] = useState(false);
  const [goldChecked, setGoldChecked] = useState(false);

  // In a real app this would come from the DB user record
  const plan = "free" as "free" | "pro";
  const referralCode = user?.id?.slice(-8) ?? "--------";

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">Settings</h1>
        </div>
        <p className="text-sm text-[#666666]">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile section */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-[#666666]" />
          <h2 className="text-sm font-medium text-[#111111]">Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="h-12 w-12 rounded-full border border-[#e0ddd9]"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-[#f0efed] flex items-center justify-center">
              <User className="h-5 w-5 text-[#666666]" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[#111111]">
              {user?.fullName ?? "User"}
            </p>
            <p className="text-xs text-[#666666]">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription section */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="h-4 w-4 text-[#666666]" />
          <h2 className="text-sm font-medium text-[#111111]">Subscription</h2>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                plan === "pro"
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-[#f0efed] text-[#666666]"
              }`}
            >
              {plan === "pro" ? "Pro" : "Free"}
            </span>
            <span className="text-sm text-[#666666]">
              {plan === "pro" ? "Lifetime access" : "Limited features"}
            </span>
          </div>
          {plan === "free" && (
            <Button size="sm">
              Upgrade to Pro — $29 lifetime
            </Button>
          )}
        </div>
      </div>

      {/* Referral code */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Copy className="h-4 w-4 text-[#666666]" />
          <h2 className="text-sm font-medium text-[#111111]">
            My Referral Code
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#fafaf9] border border-[#e0ddd9] rounded-lg font-mono text-[#111111] truncate min-w-0">
            {referralCode}
          </code>
          <Button variant="outline" size="icon" onClick={copyReferralCode}>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* My Cards */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-4 w-4 text-[#666666]" />
          <h2 className="text-sm font-medium text-[#111111]">My Cards</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={platChecked}
              onChange={(e) => setPlatChecked(e.target.checked)}
              className="h-4 w-4 rounded border-[#e0ddd9] text-[#1a1a2e] focus:ring-[#1a1a2e]"
            />
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "#1a1a2e" }}
              />
              <span className="text-sm text-[#111111]">Platinum Card</span>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={goldChecked}
              onChange={(e) => setGoldChecked(e.target.checked)}
              className="h-4 w-4 rounded border-[#e0ddd9] text-[#8B6914] focus:ring-[#8B6914]"
            />
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "#8B6914" }}
              />
              <span className="text-sm text-[#111111]">Gold Card</span>
            </div>
          </label>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-red-200 rounded-lg bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-medium text-red-600">Danger Zone</h2>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" data-icon="inline-start" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
