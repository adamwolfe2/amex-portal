import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const LAST_UPDATED = "March 26, 2026";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-[#666666] mt-2">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-10 text-[#333333] text-[15px] leading-relaxed">
          <section id="overview">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              1. Overview
            </h2>
            <p>
              CreditOS (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              respects your privacy and is committed to protecting the personal
              information you share with us. This Privacy Policy explains what
              data we collect, how we use it, and your rights regarding that
              data.
            </p>
          </section>

          <section id="data-collected">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect the following categories of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account information:</strong> Your name and email
                address, provided through our authentication provider (Clerk)
              </li>
              <li>
                <strong>Card selections:</strong> Which American Express cards
                you have selected to track within the Service
              </li>
              <li>
                <strong>Benefit claim history:</strong> Records of which
                benefits you have marked as claimed, including dates and amounts
              </li>
              <li>
                <strong>Usage data:</strong> How you interact with the Service,
                including feature usage and session information
              </li>
            </ul>
          </section>

          <section id="third-parties">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              3. Third-Party Services
            </h2>
            <p className="mb-3">
              We use the following third-party services to operate CreditOS:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Clerk</strong> &mdash; Authentication and user
                management. Clerk processes your email address and name to
                manage your account.
              </li>
              <li>
                <strong>Stripe</strong> &mdash; Payment processing. Stripe
                handles all payment information directly. We do not store your
                credit card details.
              </li>
              <li>
                <strong>Neon</strong> &mdash; Database hosting. Your benefit
                tracking data is stored securely in our Neon PostgreSQL
                database.
              </li>
              <li>
                <strong>Resend</strong> &mdash; Email delivery. Used to send
                benefit reminders and account notifications.
              </li>
              <li>
                <strong>Vercel</strong> &mdash; Application hosting and
                infrastructure.
              </li>
            </ul>
          </section>

          <section id="data-use">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              4. How We Use Your Data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personalization:</strong> To display your selected cards
                and track your benefit usage
              </li>
              <li>
                <strong>Reminders:</strong> To send timely notifications before
                your credits reset
              </li>
              <li>
                <strong>Analytics:</strong> To calculate your savings, ROI, and
                usage streaks
              </li>
              <li>
                <strong>Service improvement:</strong> To understand how the
                Service is used and identify areas for improvement
              </li>
            </ul>
          </section>

          <section id="data-retention">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              5. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. If you
              delete your account, we will delete your personal data within 30
              days. Aggregated, anonymized data that cannot be used to identify
              you may be retained for analytics purposes.
            </p>
          </section>

          <section id="user-rights">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              6. Your Rights
            </h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights
              under applicable data protection laws (including GDPR and CCPA):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of the personal data we
                hold about you
              </li>
              <li>
                <strong>Deletion:</strong> Request that we delete your personal
                data
              </li>
              <li>
                <strong>Export:</strong> Request a machine-readable export of
                your data
              </li>
              <li>
                <strong>Correction:</strong> Request that we correct inaccurate
                personal data
              </li>
              <li>
                <strong>Objection:</strong> Object to the processing of your
                personal data for certain purposes
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <span className="text-[#8B6914]">support@creditos.app</span>.
              We will respond to your request within 30 days.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              7. Cookies
            </h2>
            <p className="mb-3">CreditOS uses the following cookies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>amex_ref:</strong> Stores referral tracking information.
                Expires after 90 days.
              </li>
              <li>
                <strong>Clerk authentication cookies:</strong> Required for
                maintaining your login session and account security.
              </li>
            </ul>
            <p className="mt-3">
              We do not use advertising or third-party tracking cookies.
            </p>
          </section>

          <section id="data-sharing">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              8. Data Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third
              parties. We share data only with the third-party service providers
              listed above, solely for the purpose of operating the Service.
            </p>
          </section>

          <section id="security">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              9. Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data, including encryption in transit (TLS) and at rest. However,
              no method of electronic transmission or storage is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by posting the updated policy on
              this page and updating the &quot;Last updated&quot; date. Your
              continued use of the Service after changes are posted constitutes
              your acceptance of the revised policy.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-semibold text-[#111111] mb-3">
              11. Contact
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <span className="text-[#8B6914]">support@creditos.app</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
