"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Settings,
  Copy,
  Check,
  CreditCard,
  LogOut,
  Crown,
  User,
  AlertTriangle,
  Clock,
  Download,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { MONTHLY_PRICE, ANNUAL_PRICE, LIFETIME_PRICE } from "@/lib/referral";

type UserStatus = {
  planType: string;
  subscriptionStatus: string;
  referralCode: string;
  trialEndsAt: string | null;
  cards: string[];
};

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [copied, setCopied] = useState(false);
  const [platChecked, setPlatChecked] = useState(false);
  const [goldChecked, setGoldChecked] = useState(false);
  const [upgrading, setUpgrading] = useState<
    "monthly" | "annual" | "lifetime" | null
  >(null);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [savingCards, setSavingCards] = useState(false);

  useEffect(() => {
    fetch("/api/user/status")
      .then((r) => r.json())
      .then((data: UserStatus) => {
        setStatus(data);
        setPlatChecked(data.cards?.includes("platinum") ?? false);
        setGoldChecked(data.cards?.includes("gold") ?? false);
      })
      .catch(() => {
        toast.error("Failed to load account status. Please refresh.");
      });
  }, []);

  // Poll for status update after checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        return;
      }

      try {
        const res = await fetch("/api/user/status");
        if (!res.ok) return;
        const data: UserStatus = await res.json();
        if (data.planType !== "free") {
          setStatus(data);
          clearInterval(interval);
          window.history.replaceState({}, "", "/settings");
          toast.success("Your plan has been upgraded!");
        }
      } catch {
        // Silently retry on next interval
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const saveCards = useCallback(
    async (plat: boolean, gold: boolean) => {
      if (savingCards) return;
      setSavingCards(true);
      const cards: string[] = [];
      if (plat) cards.push("platinum");
      if (gold) cards.push("gold");
      try {
        await fetch("/api/user/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cards }),
        });
      } finally {
        setSavingCards(false);
      }
    },
    [savingCards]
  );

  const handlePlatChange = (checked: boolean) => {
    setPlatChecked(checked);
    saveCards(checked, goldChecked);
  };

  const handleGoldChange = (checked: boolean) => {
    setGoldChecked(checked);
    saveCards(platChecked, checked);
  };

  const handleUpgrade = async (plan: "monthly" | "annual" | "lifetime") => {
    setUpgrading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Failed to start checkout. Please try again.");
        setUpgrading(null);
      }
    } catch {
      toast.error("Failed to connect. Please try again.");
      setUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch("/api/billing", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to open billing portal.");
      }
    } catch {
      toast.error("Failed to connect. Please try again.");
    }
  };

  const plan = status?.planType === "free" || !status ? "free" : "pro";
  const referralCode = status?.referralCode ?? "--------";
  const isPastDue = status?.subscriptionStatus === "past_due";

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  if (!isLoaded || !status) {
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
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            <Image
              src={user.imageUrl}
              alt={`${user.fullName ?? "User"} profile photo`}
              width={48}
              height={48}
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
            {isPastDue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                <AlertTriangle className="h-3 w-3" />
                Past Due
              </span>
            )}
            <span className="text-sm text-[#666666]">
              {plan === "pro"
                ? status.planType === "lifetime"
                  ? "Lifetime access"
                  : status.planType === "annual"
                    ? "Annual plan"
                    : "Monthly plan"
                : "Limited features"}
            </span>
          </div>
          {plan === "pro" && !isPastDue && (
            <span className="text-sm text-[#666666]">Active</span>
          )}
        </div>
        {status.trialEndsAt && plan === "pro" && (
          <div className="flex items-center gap-2 text-xs text-[#999999]">
            <Clock className="h-3 w-3" />
            Trial ends{" "}
            {new Date(status.trialEndsAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
        {plan === "pro" && status.planType !== "lifetime" && (
          <button
            onClick={handleManageBilling}
            className="text-sm font-medium text-[#1a1a2e] hover:underline"
          >
            Manage Billing
          </button>
        )}
        {plan === "free" && (
          <div className="space-y-3">
            <p className="text-xs text-[#999999]">Choose your plan</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleUpgrade("monthly")}
                disabled={upgrading !== null}
                className="border border-[#e0ddd9] rounded-lg p-3 text-left hover:border-[#1a1a2e] transition-colors"
              >
                <p className="text-sm font-semibold text-[#111111]">
                  ${MONTHLY_PRICE}/month
                </p>
                <p className="text-xs text-[#666666] mt-0.5">
                  Less than two cups of coffee you&apos;d buy with your Gold
                  Card anyway
                </p>
              </button>
              <button
                onClick={() => handleUpgrade("annual")}
                disabled={upgrading !== null}
                className="border-2 border-[#1a1a2e] rounded-lg p-3 text-left relative"
              >
                <span className="absolute -top-2.5 left-3 bg-[#1a1a2e] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  7-day free trial
                </span>
                <p className="text-sm font-semibold text-[#111111]">${ANNUAL_PRICE}/year</p>
                <p className="text-xs text-[#666666] mt-0.5">
                  Save ${MONTHLY_PRICE * 12 - ANNUAL_PRICE} vs monthly
                </p>
              </button>
              <button
                onClick={() => handleUpgrade("lifetime")}
                disabled={upgrading !== null}
                className="border border-[#e0ddd9] rounded-lg p-3 text-left hover:border-[#1a1a2e] transition-colors relative"
              >
                <span className="absolute -top-2.5 left-3 bg-[#1a1a2e] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  Limited time
                </span>
                <p className="text-sm font-semibold text-[#111111]">
                  ${LIFETIME_PRICE} lifetime
                </p>
                <p className="text-xs text-[#666666] mt-0.5">
                  Pay once, yours forever
                </p>
              </button>
            </div>
            {upgrading && (
              <p className="text-xs text-[#999999]">
                Redirecting to checkout...
              </p>
            )}
          </div>
        )}
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
          <Button
            variant="outline"
            size="icon"
            onClick={copyReferralCode}
            aria-label="Copy referral code"
            className="min-h-[44px] min-w-[44px]"
          >
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
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#fafaf9] transition-colors">
            <input
              type="checkbox"
              checked={platChecked}
              onChange={(e) => handlePlatChange(e.target.checked)}
              className="h-4 w-4 rounded border-[#e0ddd9] text-[#1a1a2e] focus:ring-[#1a1a2e]"
            />
            <Image
              src="/platinum-card.png"
              alt="American Express Platinum Card"
              width={40}
              height={25}
              className="rounded shadow-sm"
            />
            <span className="text-sm text-[#111111]">Platinum Card</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#fafaf9] transition-colors">
            <input
              type="checkbox"
              checked={goldChecked}
              onChange={(e) => handleGoldChange(e.target.checked)}
              className="h-4 w-4 rounded border-[#e0ddd9] text-[#8B6914] focus:ring-[#8B6914]"
            />
            <Image
              src="/gold-card.png"
              alt="American Express Gold Card"
              width={40}
              height={25}
              className="rounded shadow-sm"
            />
            <span className="text-sm text-[#111111]">Gold Card</span>
          </label>
        </div>
      </div>

      {/* Data section */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
        <h2 className="text-sm font-semibold text-[#111111] mb-3">Your Data</h2>
        <p className="text-xs text-[#666666] mb-3">
          Download all your CreditOS data including claims, checklist progress, and account info.
        </p>
        <a
          href="/api/export"
          download
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#e0ddd9] rounded-md text-[#111111] hover:bg-[#f5f3f0] transition-colors min-h-[44px]"
        >
          <Download className="h-4 w-4" />
          Export My Data
        </a>
      </div>

      {/* Danger zone */}
      <div className="border border-red-200 rounded-lg bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-medium text-red-600">Danger Zone</h2>
        </div>
        <Button variant="destructive" size="sm" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-1.5" />
          Sign Out
        </Button>
      </div>

      {/* Delete account */}
      <div className="border border-red-200 rounded-lg bg-white p-5">
        <h2 className="text-sm font-semibold text-[#111111] mb-1">Delete Account</h2>
        <p className="text-xs text-[#666666] mb-3">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm("Are you sure? This will permanently delete your account, all claims, and checklist progress. This cannot be undone.")) {
              toast.error("Please contact support to delete your account.");
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-red-200 rounded-md text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}
