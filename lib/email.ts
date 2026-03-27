import { Resend } from "resend";
import { logger } from "@/lib/logger";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

const FROM_ADDRESS = "CreditOS <reminders@creditos.app>";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface BenefitReminder {
  name: string;
  value: number | null;
  cadence: string;
  action: string;
}

export async function sendResetReminder(
  to: string,
  userName: string | null,
  benefits: BenefitReminder[]
): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    logger.warn("Resend not configured — skipping email");
    return false;
  }

  const totalValue = benefits.reduce((s, b) => s + (b.value ?? 0), 0);
  const greeting = userName ? `Hi ${escapeHtml(userName)}` : "Hi there";

  const benefitRows = benefits
    .map(
      (b) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e0ddd9;font-size:14px;color:#111111;">${escapeHtml(b.name)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e0ddd9;font-size:14px;color:#111111;text-align:right;">${b.value ? `$${b.value}` : "—"}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e0ddd9;font-size:13px;color:#666666;">${escapeHtml(b.action)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fafaf9;">
      <div style="padding:32px 24px;background:#1a1a2e;border-radius:8px 8px 0 0;">
        <h1 style="color:white;font-size:20px;font-weight:600;margin:0;">Credit Reset Reminder</h1>
        <p style="color:#c0c0c0;font-size:14px;margin:8px 0 0;">Don't leave money on the table</p>
      </div>
      <div style="padding:24px;background:white;border:1px solid #e0ddd9;border-top:none;border-radius:0 0 8px 8px;">
        <p style="font-size:15px;color:#111111;margin:0 0 16px;">${greeting},</p>
        <p style="font-size:14px;color:#444444;margin:0 0 20px;">
          You have <strong>${benefits.length} benefit${benefits.length !== 1 ? "s" : ""}</strong> resetting soon${totalValue > 0 ? ` worth up to <strong>$${totalValue}</strong>` : ""}. Use them before they expire:
        </p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#f5f3f0;">
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666666;font-weight:600;">Benefit</th>
              <th style="padding:8px 12px;text-align:right;font-size:12px;color:#666666;font-weight:600;">Value</th>
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666666;font-weight:600;">Action</th>
            </tr>
          </thead>
          <tbody>${benefitRows}</tbody>
        </table>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://amex-portal.vercel.app"}/dashboard"
           style="display:inline-block;padding:10px 20px;background:#1a1a2e;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
          View Dashboard
        </a>
        <p style="font-size:12px;color:#999999;margin:20px 0 0;">
          You're receiving this because you use CreditOS to track your Amex benefits.
        </p>
      </div>
    </div>`;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `${benefits.length} benefit${benefits.length !== 1 ? "s" : ""} resetting soon — $${totalValue} at stake`,
      html,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send email", { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

export async function sendReferralNotification(
  to: string,
  referrerName: string | null,
  referredName: string,
  commission: number,
  plan: string
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const greeting = referrerName ? `Hi ${escapeHtml(referrerName)}` : "Hi there";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fafaf9;">
      <div style="padding:32px 24px;background:#1a1a2e;border-radius:8px 8px 0 0;">
        <h1 style="color:white;font-size:20px;font-weight:600;margin:0;">You earned a referral commission</h1>
      </div>
      <div style="padding:24px;background:white;border:1px solid #e0ddd9;border-top:none;border-radius:0 0 8px 8px;">
        <p style="font-size:15px;color:#111111;margin:0 0 16px;">${greeting},</p>
        <p style="font-size:14px;color:#444444;margin:0 0 20px;">
          <strong>${escapeHtml(referredName)}</strong> just signed up for the <strong>${escapeHtml(plan)}</strong> plan using your referral link. You earned <strong>$${commission.toFixed(2)}</strong> in commission.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://amex-portal.vercel.app"}/refer"
           style="display:inline-block;padding:10px 20px;background:#1a1a2e;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
          View Referrals
        </a>
        <p style="font-size:12px;color:#999999;margin:20px 0 0;">
          You're receiving this because someone used your CreditOS referral link.
        </p>
      </div>
    </div>`;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `You earned $${commission.toFixed(2)} from a referral`,
      html,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send referral notification", { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

export async function sendWelcomeEmail(
  to: string,
  userName: string | null
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const greeting = userName ? `Hi ${escapeHtml(userName)}` : "Welcome";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fafaf9;">
      <div style="padding:32px 24px;background:#1a1a2e;border-radius:8px 8px 0 0;">
        <h1 style="color:white;font-size:20px;font-weight:600;margin:0;">Welcome to CreditOS</h1>
        <p style="color:#c0c0c0;font-size:14px;margin:8px 0 0;">Your card benefits command center</p>
      </div>
      <div style="padding:24px;background:white;border:1px solid #e0ddd9;border-top:none;border-radius:0 0 8px 8px;">
        <p style="font-size:15px;color:#111111;margin:0 0 16px;">${greeting},</p>
        <p style="font-size:14px;color:#444444;margin:0 0 16px;">
          You just joined CreditOS. Here's how to get the most out of your Amex Platinum and Gold cards:
        </p>
        <ol style="margin:0 0 20px;padding-left:20px;color:#444444;font-size:14px;">
          <li style="margin-bottom:8px;"><strong>Complete onboarding</strong> — Select your cards and see what benefits you have.</li>
          <li style="margin-bottom:8px;"><strong>Run through the checklist</strong> — Set up each benefit to start earning credits.</li>
          <li style="margin-bottom:8px;"><strong>Claim monthly credits</strong> — Use the dashboard to track and claim benefits before they reset.</li>
        </ol>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://amex-portal.vercel.app"}/dashboard"
           style="display:inline-block;padding:10px 20px;background:#1a1a2e;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
          Go to Dashboard
        </a>
        <p style="font-size:12px;color:#999999;margin:20px 0 0;">
          You're receiving this because you signed up for CreditOS.
        </p>
      </div>
    </div>`;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Welcome to CreditOS — let's maximize your Amex benefits",
      html,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send welcome email", { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

export async function sendTrialExpiringEmail(
  to: string,
  userName: string | null,
  daysLeft: number
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const greeting = userName ? `Hi ${escapeHtml(userName)}` : "Hi there";
  const daysText = daysLeft === 1 ? "1 day" : `${daysLeft} days`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fafaf9;">
      <div style="padding:32px 24px;background:#1a1a2e;border-radius:8px 8px 0 0;">
        <h1 style="color:white;font-size:20px;font-weight:600;margin:0;">Your free trial ends in ${daysText}</h1>
        <p style="color:#c0c0c0;font-size:14px;margin:8px 0 0;">Upgrade to keep your premium features</p>
      </div>
      <div style="padding:24px;background:white;border:1px solid #e0ddd9;border-top:none;border-radius:0 0 8px 8px;">
        <p style="font-size:15px;color:#111111;margin:0 0 16px;">${greeting},</p>
        <p style="font-size:14px;color:#444444;margin:0 0 16px;">
          Your CreditOS trial expires in <strong>${daysText}</strong>. After that you'll lose access to:
        </p>
        <ul style="margin:0 0 20px;padding-left:20px;color:#444444;font-size:14px;">
          <li style="margin-bottom:8px;"><strong>Quick Claim</strong> — One-tap benefit claiming from the dashboard.</li>
          <li style="margin-bottom:8px;"><strong>ROI Analytics</strong> — Track how much value you're capturing each month.</li>
          <li style="margin-bottom:8px;"><strong>Smart Alerts</strong> — Get notified before benefits reset so you never miss a credit.</li>
        </ul>
        <p style="font-size:14px;color:#444444;margin:0 0 20px;">
          Your data is safe — upgrade anytime to pick up where you left off.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://amex-portal.vercel.app"}/settings"
           style="display:inline-block;padding:10px 20px;background:#1a1a2e;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
          Upgrade Now
        </a>
        <p style="font-size:12px;color:#999999;margin:20px 0 0;">
          You're receiving this because you started a free trial on CreditOS.
        </p>
      </div>
    </div>`;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Your CreditOS trial ends in ${daysText} — upgrade to keep your benefits`,
      html,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send trial expiring email", { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

export async function sendMonthlyRecap(
  to: string,
  userName: string | null,
  month: string,
  captured: number,
  available: number,
  claimCount: number,
  streak: number
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const greeting = userName ? `Hi ${escapeHtml(userName)}` : "Hi there";
  const pct = available > 0 ? Math.round((captured / available) * 100) : 0;
  const streakText = streak > 0 ? `${streak} month${streak !== 1 ? "s" : ""}` : "No active streak";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fafaf9;">
      <div style="padding:32px 24px;background:#1a1a2e;border-radius:8px 8px 0 0;">
        <h1 style="color:white;font-size:20px;font-weight:600;margin:0;">Your ${escapeHtml(month)} Savings Recap</h1>
        <p style="color:#c0c0c0;font-size:14px;margin:8px 0 0;">Here's how you did this month</p>
      </div>
      <div style="padding:24px;background:white;border:1px solid #e0ddd9;border-top:none;border-radius:0 0 8px 8px;">
        <p style="font-size:15px;color:#111111;margin:0 0 20px;">${greeting},</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr style="background:#f5f3f0;">
            <td style="padding:12px;font-size:13px;color:#666666;font-weight:600;">Value Captured</td>
            <td style="padding:12px;font-size:16px;color:#111111;text-align:right;font-weight:700;">$${captured} of $${available} (${pct}%)</td>
          </tr>
          <tr>
            <td style="padding:12px;border-bottom:1px solid #e0ddd9;font-size:13px;color:#666666;font-weight:600;">Claims Made</td>
            <td style="padding:12px;border-bottom:1px solid #e0ddd9;font-size:16px;color:#111111;text-align:right;font-weight:700;">${claimCount}</td>
          </tr>
          <tr>
            <td style="padding:12px;border-bottom:1px solid #e0ddd9;font-size:13px;color:#666666;font-weight:600;">Current Streak</td>
            <td style="padding:12px;border-bottom:1px solid #e0ddd9;font-size:16px;color:#111111;text-align:right;font-weight:700;">${escapeHtml(streakText)}</td>
          </tr>
        </table>
        ${available > 0 && captured < available ? `<p style="font-size:14px;color:#444444;margin:0 0 20px;">You still have <strong>$${available - captured}</strong> in unclaimed benefits. There's still time to use them before the month ends!</p>` : ""}
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://amex-portal.vercel.app"}/dashboard"
           style="display:inline-block;padding:10px 20px;background:#1a1a2e;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
          View Dashboard
        </a>
        <p style="font-size:12px;color:#999999;margin:20px 0 0;">
          You're receiving this because you use CreditOS to track your Amex benefits.
        </p>
      </div>
    </div>`;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Your ${month} savings recap — $${captured} captured`,
      html,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send monthly recap", { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}
