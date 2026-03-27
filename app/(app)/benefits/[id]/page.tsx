import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BENEFITS, CARDS } from "@/lib/data";
import type { CardKey } from "@/lib/data/types";
import { ExternalLink, ArrowLeft, CreditCard, Info } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const benefit = BENEFITS.find((b) => b.id === id);
  if (!benefit) return { title: "Benefit Not Found" };
  return {
    title: benefit.name,
    description: benefit.description,
  };
}

export function generateStaticParams() {
  return BENEFITS.map((b) => ({ id: b.id }));
}

export default async function BenefitDetailPage({ params }: Props) {
  const { id } = await params;
  const benefit = BENEFITS.find((b) => b.id === id);
  if (!benefit) notFound();

  const card = CARDS[benefit.card as CardKey];

  // Build a step-by-step guide from the action field
  const steps = benefit.action.split(". ").filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/benefits"
        className="inline-flex items-center gap-1.5 text-sm text-[#666666] hover:text-[#111111] mb-6 min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        All Benefits
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="h-5 w-5" style={{ color: card.color }} />
          <span className="text-[11px] text-[#999999]">{card.name}</span>
        </div>
        <h1 className="text-xl font-semibold text-[#111111]">{benefit.name}</h1>
        <p className="text-sm text-[#666666] mt-2">{benefit.description}</p>
      </div>

      {/* Key facts grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {benefit.value !== null && (
          <div className="border border-[#e0ddd9] rounded-lg p-3 bg-white">
            <p className="text-[11px] text-[#999999]">Annual Value</p>
            <p className="text-lg font-semibold text-[#111111]">
              ${benefit.value}
            </p>
          </div>
        )}
        <div className="border border-[#e0ddd9] rounded-lg p-3 bg-white">
          <p className="text-[11px] text-[#999999]">Resets</p>
          <p className="text-sm font-medium text-[#111111] capitalize">
            {benefit.cadence}
          </p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg p-3 bg-white">
          <p className="text-[11px] text-[#999999]">Category</p>
          <p className="text-sm font-medium text-[#111111]">
            {benefit.category}
          </p>
        </div>
        <div className="border border-[#e0ddd9] rounded-lg p-3 bg-white">
          <p className="text-[11px] text-[#999999]">Enrollment</p>
          <p className="text-sm font-medium text-[#111111]">
            {benefit.enrollmentRequired ? "Required" : "Automatic"}
          </p>
        </div>
      </div>

      {/* How to claim */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5 mb-4">
        <h2 className="text-sm font-semibold text-[#111111] mb-3">
          How to Claim
        </h2>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f0efed] text-xs font-medium text-[#666666] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[#444444]">
                {step.trim()}
                {step.endsWith(".") ? "" : "."}
              </p>
            </li>
          ))}
        </ol>
        {benefit.portalLink && (
          <a
            href={benefit.portalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[#1a1a2e] hover:underline min-h-[44px]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open enrollment page
          </a>
        )}
      </div>

      {/* Caveats */}
      {benefit.caveats && (
        <div className="border border-[#e0ddd9] rounded-lg bg-white p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-[#999999]" />
            <h2 className="text-sm font-semibold text-[#111111]">
              Important Notes
            </h2>
          </div>
          <p className="text-sm text-[#666666]">{benefit.caveats}</p>
        </div>
      )}

      {/* Source */}
      <div className="border border-[#e0ddd9] rounded-lg bg-white p-5">
        <h2 className="text-sm font-semibold text-[#111111] mb-2">Source</h2>
        <a
          href={benefit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[#1a1a2e] hover:underline min-h-[44px]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {benefit.sourceLabel}
        </a>
      </div>
    </div>
  );
}
