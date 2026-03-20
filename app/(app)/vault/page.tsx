"use client";

import { useState, useEffect, useCallback } from "react";
import { BENEFITS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Plus,
  Trash2,
  Download,
  Upload,
  Info,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Claim = {
  id: number;
  benefitId: string;
  claimedAt: string;
  amount: string | null;
  notes: string | null;
};

export default function VaultPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formBenefitId, setFormBenefitId] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/claims");
      if (res.ok) {
        const data = await res.json();
        setClaims(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBenefitId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          benefitId: formBenefitId,
          amount: formAmount || undefined,
          notes: formNotes || undefined,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setFormBenefitId("");
        setFormAmount("");
        setFormNotes("");
        fetchClaims();
        toast.success("Claim saved.");
      } else {
        toast.error("Failed to save claim. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this claim? This cannot be undone.")) return;
    const res = await fetch(`/api/claims?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setClaims((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(claims, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "creditos-vault.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${claims.length} claims.`);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const imported = JSON.parse(text) as Claim[];
        for (const item of imported) {
          await fetch("/api/claims", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              benefitId: item.benefitId,
              amount: item.amount,
              notes: item.notes,
            }),
          });
        }
        await fetchClaims();
        toast.success(`Imported ${imported.length} claims.`);
      } catch {
        toast.error("Invalid file format. Please upload a valid CreditOS export.");
      }
    };
    input.click();
  };

  const getBenefitName = (id: string) =>
    BENEFITS.find((b) => b.id === id)?.name ?? id;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-5 w-5 text-[#1a1a2e]" />
          <h1 className="text-xl font-semibold text-[#111111]">Vault</h1>
        </div>
        <p className="text-sm text-[#666666]">
          Track your benefit redemptions over time
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-[#e0ddd9] bg-[#fafaf9]">
        <Info className="h-4 w-4 text-[#1a1a2e] mt-0.5 shrink-0" />
        <p className="text-sm text-[#666666]">
          Add entries as you redeem benefits to see your total value
          captured over time. Export your data anytime as JSON.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Entry
        </Button>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1.5" />
          Export JSON
        </Button>
        <Button onClick={handleImport} variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1.5" />
          Import JSON
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div
          className="border border-[#e0ddd9] rounded-lg p-4 bg-white space-y-4"
          onKeyDown={(e) => { if (e.key === "Escape") setShowForm(false); }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#111111]">
              New Claim Entry
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-[#f0efed] rounded"
            >
              <X className="h-4 w-4 text-[#666666]" />
            </button>
          </div>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Benefit
              </label>
              <select
                value={formBenefitId}
                onChange={(e) => setFormBenefitId(e.target.value)}
                required
                className="w-full h-8 px-2 text-sm border border-[#e0ddd9] rounded-lg bg-white text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e]"
              >
                <option value="">Select a benefit...</option>
                {BENEFITS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.card === "platinum" ? "Plat" : "Gold"})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-8 px-2 text-sm border border-[#e0ddd9] rounded-lg bg-white text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Notes
              </label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full h-8 px-2 text-sm border border-[#e0ddd9] rounded-lg bg-white text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e]"
              />
            </div>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : "Save Entry"}
            </Button>
          </form>
        </div>
      )}

      {/* Claims list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg border border-[#e0ddd9] bg-[#f0efed] animate-pulse"
            />
          ))}
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-12 border border-[#e0ddd9] rounded-lg bg-white">
          <Lock className="h-8 w-8 text-[#ccc] mx-auto mb-3" />
          <p className="text-sm text-[#666666]">No claims yet</p>
          <p className="text-xs text-[#999999] mt-1">
            Start tracking your benefit redemptions
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="flex items-center justify-between p-4 border border-[#e0ddd9] rounded-lg bg-white"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#111111] truncate">
                  {getBenefitName(claim.benefitId)}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#666666]">
                    {new Date(claim.claimedAt).toLocaleDateString()}
                  </span>
                  {claim.amount && (
                    <span className="text-xs font-medium text-[#1a1a2e]">
                      ${Number(claim.amount).toFixed(2)}
                    </span>
                  )}
                </div>
                {claim.notes && (
                  <p className="text-xs text-[#999999] mt-1 truncate">
                    {claim.notes}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(claim.id)}
                aria-label="Delete claim"
                className="p-1.5 hover:bg-red-50 rounded text-[#999999] hover:text-red-500 transition-colors shrink-0 ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
