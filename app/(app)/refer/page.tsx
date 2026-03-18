"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Users, Copy, Check, DollarSign, UserPlus, Clock } from "lucide-react";

type Referral = {
  id: number;
  name: string;
  email: string;
  date: string;
  status: string;
  commission: number;
};

type ReferralData = {
  referralCode: string;
  stats: {
    totalReferrals: number;
    paidReferrals: number;
    totalEarnings: number;
  };
  referrals: Referral[];
};

export default function ReferPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReferrals = useCallback(async () => {
    try {
      const res = await fetch("/api/referrals");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const referralLink = data?.referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${data.referralCode}`
    : "";

  const copyLink = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-6 text-center">
        <Users className="h-8 w-8 text-[#1a1a2e] mx-auto mb-3" />
        <h1 className="text-xl font-semibold text-[#111111] mb-1">
          Share CreditOS, earn 30% commission
        </h1>
        <p className="text-sm text-[#666666] max-w-md mx-auto mb-3">
          Refer friends to CreditOS and earn 30% on every Pro upgrade — monthly
          or lifetime. Your unique link tracks every signup automatically.
        </p>
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#fafaf9] border border-[#e0ddd9] rounded-lg text-xs text-[#444444]">
          <span>Monthly referral: <strong className="text-[#111111]">$2.70/mo recurring</strong></span>
          <span className="w-px h-3 bg-[#e0ddd9]" />
          <span>Lifetime referral: <strong className="text-[#111111]">$8.70 one-time</strong></span>
        </div>
      </div>

      {/* Referral link */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
        <h2 className="text-sm font-medium text-[#111111] mb-3">
          Your Referral Link
        </h2>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#fafaf9] border border-[#e0ddd9] rounded-lg font-mono text-[#111111] truncate min-w-0">
            {referralLink || "Loading..."}
          </code>
          <Button variant="outline" size="icon" onClick={copyLink}>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-3 sm:p-4 text-center">
          <UserPlus className="h-4 w-4 text-[#666666] mx-auto mb-1.5" />
          <p className="text-lg sm:text-xl font-semibold text-[#111111]">
            {data?.stats.totalReferrals ?? 0}
          </p>
          <p className="text-[10px] sm:text-xs text-[#666666]">Referrals</p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-3 sm:p-4 text-center">
          <Check className="h-4 w-4 text-[#666666] mx-auto mb-1.5" />
          <p className="text-lg sm:text-xl font-semibold text-[#111111]">
            {data?.stats.paidReferrals ?? 0}
          </p>
          <p className="text-[10px] sm:text-xs text-[#666666]">Paid</p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-3 sm:p-4 text-center">
          <DollarSign className="h-4 w-4 text-[#666666] mx-auto mb-1.5" />
          <p className="text-lg sm:text-xl font-semibold text-[#111111]">
            ${data?.stats.totalEarnings?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-[10px] sm:text-xs text-[#666666]">Earnings</p>
        </div>
      </div>

      {/* Referral list */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white">
        <div className="px-5 py-3 border-b border-[#e0ddd9]">
          <h2 className="text-sm font-medium text-[#111111]">Referrals</h2>
        </div>
        {!data?.referrals.length ? (
          <div className="text-center py-12">
            <Users className="h-8 w-8 text-[#ccc] mx-auto mb-3" />
            <p className="text-sm text-[#666666]">No referrals yet</p>
            <p className="text-xs text-[#999999] mt-1">
              Share your link to start earning
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e0ddd9]">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-2 text-xs font-medium text-[#666666]">
              <span>Name / Email</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-right">Commission</span>
            </div>
            {data.referrals.map((r) => (
              <div
                key={r.id}
                className="px-5 py-3 sm:grid sm:grid-cols-4 sm:gap-4 sm:items-center space-y-1 sm:space-y-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111111] truncate">
                    {r.name}
                  </p>
                  <p className="text-xs text-[#666666] truncate">{r.email}</p>
                </div>
                <span className="text-xs text-[#666666]">
                  {new Date(r.date).toLocaleDateString()}
                </span>
                <span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "paid"
                        ? "bg-green-50 text-green-700"
                        : "bg-[#f0efed] text-[#666666]"
                    }`}
                  >
                    {r.status === "paid" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {r.status}
                  </span>
                </span>
                <span className="text-sm font-medium text-[#111111] sm:text-right">
                  ${r.commission.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
