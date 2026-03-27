import type { Metadata } from "next";
import Link from "next/link";
import {
  MONTHLY_PRICE,
  ANNUAL_PRICE,
  LIFETIME_PRICE,
} from "@/lib/referral";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const LAST_UPDATED = "March 26, 2026";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-[#666666] mt-2">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-10 text-[#333333] text-[15px] leading-relaxed">
          <section id="acceptance">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using CreditOS (&quot;the Service&quot;), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, do not use the Service. CreditOS reserves the
              right to update these terms at any time, and continued use of the
              Service constitutes acceptance of any changes.
            </p>
          </section>

          <section id="service-description">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              2. Service Description
            </h2>
            <p>
              CreditOS is a benefits tracking and reminder platform designed to
              help American Express cardholders maximize the value of their card
              credits and perks. The Service provides benefit tracking, smart
              reminders, enrollment guides, and analytics. CreditOS is not
              affiliated with, endorsed by, or sponsored by American Express.
            </p>
          </section>

          <section id="accounts">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              3. Account Terms
            </h2>
            <p className="mb-2">
              You must provide accurate and complete information when creating
              your account. You are responsible for maintaining the security of
              your account credentials and for all activity that occurs under
              your account.
            </p>
            <p>
              You must be at least 18 years of age to use the Service. One
              person or legal entity may not maintain more than one account.
              CreditOS reserves the right to suspend or terminate accounts that
              violate these terms.
            </p>
          </section>

          <section id="payment">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              4. Payment and Billing
            </h2>
            <p className="mb-2">CreditOS offers the following plans:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>
                <strong>Monthly:</strong> ${MONTHLY_PRICE}/month, billed
                monthly
              </li>
              <li>
                <strong>Annual:</strong> ${ANNUAL_PRICE}/year, billed annually
                (includes a 7-day free trial)
              </li>
              <li>
                <strong>Lifetime:</strong> ${LIFETIME_PRICE} one-time payment
              </li>
            </ul>
            <p>
              All payments are processed securely through Stripe. Prices are
              listed in US dollars and are subject to change with reasonable
              notice. Subscription renewals are automatic unless cancelled
              before the renewal date.
            </p>
          </section>

          <section id="cancellation">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              5. Cancellation and Refunds
            </h2>
            <p className="mb-2">
              <strong>Monthly plans</strong> may be cancelled at any time. Your
              access continues until the end of the current billing period. No
              refunds are issued for partial months.
            </p>
            <p className="mb-2">
              <strong>Annual plans</strong> are eligible for a full refund
              within 30 days of purchase. After 30 days, a prorated refund may
              be issued at our discretion.
            </p>
            <p className="mb-2">
              <strong>Lifetime plans</strong> are eligible for a full refund
              within 30 days of purchase. No refunds are issued after 30 days.
            </p>
            <p>
              Cancellations can be managed through Settings &rarr; Manage
              Billing in the application. For full details, see our{" "}
              <Link
                href="/refunds"
                className="text-[#8B6914] hover:underline"
              >
                Refund Policy
              </Link>
              .
            </p>
          </section>

          <section id="acceptable-use">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              6. Acceptable Use
            </h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Use the Service for any unlawful purpose or in violation of any
                applicable laws
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or its
                related systems
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service
              </li>
              <li>
                Reproduce, duplicate, copy, sell, or resell any portion of the
                Service without express written permission
              </li>
              <li>
                Use automated systems or software to extract data from the
                Service (scraping)
              </li>
              <li>
                Share your account credentials with third parties or allow
                others to access the Service through your account
              </li>
            </ul>
          </section>

          <section id="intellectual-property">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              7. Intellectual Property
            </h2>
            <p>
              The Service, including all content, features, and functionality,
              is owned by CreditOS and is protected by copyright, trademark,
              and other intellectual property laws. You retain ownership of any
              data you input into the Service. By using the Service, you grant
              CreditOS a limited license to use your data solely to provide and
              improve the Service.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              8. Limitation of Liability
            </h2>
            <p className="mb-2">
              CreditOS is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied. CreditOS does not guarantee that credit information is
              accurate, complete, or current.
            </p>
            <p className="mb-2">
              To the maximum extent permitted by law, CreditOS shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses.
            </p>
            <p>
              In no event shall CreditOS&apos;s total liability exceed the
              amount you paid for the Service in the twelve months preceding the
              claim.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              9. Changes to Terms
            </h2>
            <p>
              CreditOS reserves the right to modify these terms at any time. We
              will provide notice of material changes by posting the updated
              terms on this page and updating the &quot;Last updated&quot; date.
              Your continued use of the Service after changes are posted
              constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              10. Contact
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at{" "}
              <span className="text-[#8B6914]">support@creditos.app</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
