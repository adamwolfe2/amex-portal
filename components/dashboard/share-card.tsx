"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareCardProps {
  captured: number;
  available: number;
  streak: number;
  claimCount: number;
}

export function ShareCard({ captured, available, streak, claimCount }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const percent = available > 0 ? Math.round((captured / available) * 100) : 0;

  const shareText = `I've captured $${captured.toLocaleString()} of my Amex card benefits this year using CreditOS. That's ${percent}% of my available value. ${streak > 0 ? `${streak}-month streak! ` : ""}Track yours at amex-portal.vercel.app`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My CreditOS Savings",
          text: shareText,
        });
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard not available
      }
    }
  };

  if (captured === 0) return null;

  return (
    <div className="border border-[#e0ddd9] rounded-lg bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#111111]">Share Your Progress</span>
        <span className="text-[11px] text-[#999999]">{percent}% captured</span>
      </div>

      {/* Preview card */}
      <div className="rounded-lg p-5 mb-3" style={{ backgroundColor: "#1a1a2e" }}>
        <p className="text-[11px] text-[#999999] mb-1">CreditOS</p>
        <p className="text-2xl font-semibold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
          ${captured.toLocaleString()}
        </p>
        <p className="text-sm text-[#c0c0c0] mt-1">
          captured of ${available.toLocaleString()} available
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div>
            <p className="text-lg font-semibold text-white">{percent}%</p>
            <p className="text-[10px] text-[#999999]">Value captured</p>
          </div>
          {streak > 0 && (
            <div>
              <p className="text-lg font-semibold text-white">{streak}</p>
              <p className="text-[10px] text-[#999999]">Month streak</p>
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-white">{claimCount}</p>
            <p className="text-[10px] text-[#999999]">Claims</p>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-md border border-[#e0ddd9] text-[#111111] hover:bg-[#f5f3f0] transition-colors min-h-[44px]"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied to clipboard
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            Share your savings
          </>
        )}
      </button>
    </div>
  );
}
