import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

const FROM_ADDRESS = "CreditOS <reminders@creditos.app>";

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
    console.warn("Resend not configured — skipping email");
    return false;
  }

  const totalValue = benefits.reduce((s, b) => s + (b.value ?? 0), 0);
  const greeting = userName ? `Hi ${userName}` : "Hi there";

  const benefitRows = benefits
    .map(
      (b) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e0ddd9;font-size:14px;color:#111111;">${b.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e0ddd9;font-size:14px;color:#111111;text-align:right;">${b.value ? `$${b.value}` : "—"}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e0ddd9;font-size:13px;color:#666666;">${b.action}</td>
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
    console.error("Failed to send email:", error);
    return false;
  }
}
