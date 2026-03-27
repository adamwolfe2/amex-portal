import type { Metadata } from "next";
import Link from "next/link";
import {
  MONTHLY_PRICE,
  ANNUAL_PRICE,
  LIFETIME_PRICE,
} from "@/lib/referral";

export const metadata: Metadata = {
  title: "Refund Policy",
};

const LAST_UPDATED = "March 26, 2026";

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <header className="mb-12">
          <Link
            href="/"
            className="text-sm text-[#666666] hover:text-[#111111] transition-colors"
          >
            &larr; Back to Home
          </Link>
          <h1 className="text-xl font-semibold text-[#111111] mt-6">
            Refund Policy
          </h1>
          <p className="text-sm text-[#666666] mt-2">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-10 text-[#333333] text-[15px] leading-relaxed">
          <section id="monthly">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              Monthly Plan (${MONTHLY_PRICE}/month)
            </h2>
            <p>
              You may cancel your monthly subscription at any time. Your access
              will continue until the end of the current billing period. No
              refunds are issued for partial months.
            </p>
          </section>

          <section id="annual">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              Annual Plan (${ANNUAL_PRICE}/year)
            </h2>
            <p className="mb-2">
              <strong>Within 30 days of purchase:</strong> You are eligible for
              a full refund, no questions asked.
            </p>
            <p>
              <strong>After 30 days:</strong> A prorated refund may be issued
              based on the remaining months in your billing cycle, at our
              discretion.
            </p>
          </section>

          <section id="lifetime">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              Lifetime Plan (${LIFETIME_PRICE} one-time)
            </h2>
            <p className="mb-2">
              <strong>Within 30 days of purchase:</strong> You are eligible for
              a full refund, no questions asked.
            </p>
            <p>
              <strong>After 30 days:</strong> No refunds are issued for lifetime
              plans after the 30-day window.
            </p>
          </section>

          <section id="how-to-cancel">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              How to Cancel
            </h2>
            <p>
              You can cancel your subscription at any time by navigating to{" "}
              <strong>Settings &rarr; Manage Billing</strong> in the
              application. This will open the Stripe customer portal where you
              can manage or cancel your subscription directly.
            </p>
          </section>

          <section id="processing">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              Processing Time
            </h2>
            <p>
              Approved refunds are processed within 5&ndash;10 business days.
              The refund will be issued to the original payment method. Please
              note that your bank or card issuer may take additional time to
              reflect the refund on your statement.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              Questions
            </h2>
            <p>
              If you have questions about our refund policy or need assistance
              with a refund, contact us at{" "}
              <span className="text-[#8B6914]">support@creditos.app</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
