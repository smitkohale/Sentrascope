import { logger } from "./logger.js";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || "noreply@sentrascopeapp.com";
const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME || "SentraScope";

export function getAppUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  return "http://localhost:5173";
}

async function brevoSend(opts: { to: string; toName?: string; subject: string; html: string; text: string }): Promise<void> {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": BREVO_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: BREVO_FROM_NAME, email: BREVO_FROM_EMAIL },
      to: [{ email: opts.to, name: opts.toName ?? opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
      textContent: opts.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error({ brevoStatus: response.status, body }, "Brevo email send failed");
    throw new Error(`Failed to send email via Brevo: ${response.status} ${body}`);
  }
}

export async function sendEmail(opts: { to: string; subject: string; html: string; text: string }): Promise<void> {
  if (!BREVO_API_KEY) {
    logger.warn({ to: opts.to, subject: opts.subject }, "BREVO_API_KEY not set — email skipped (dry-run)");
    return;
  }
  await brevoSend(opts);
}

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const APP_URL = getAppUrl();
  const verifyUrl = `${APP_URL}/verify?token=${token}`;

  if (!BREVO_API_KEY) {
    logger.warn({ to, verifyUrl }, "BREVO_API_KEY not set — verification link (dry-run)");
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify your SentraScope identity</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    body { margin:0; padding:0; background:#020617; }
    * { box-sizing: border-box; }
  </style>
</head>
<body style="margin:0;padding:0;background:#020617;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(160deg,#020617 0%,#0c1628 50%,#020617 100%);min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px 40px;">

        <!-- Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- ── HEADER ── -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:12px;vertical-align:middle;">
                    <img src="${APP_URL}/logo.png" alt="SentraScope Logo" width="52" height="52" style="display:inline-block;border-radius:12px;vertical-align:middle;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:Inter,system-ui,sans-serif;font-size:1.3rem;font-weight:800;color:#f8fafc;letter-spacing:-0.5px;">SentraScope</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── CARD ── -->
          <tr>
            <td style="background:#0d1829;border:1px solid rgba(56,189,248,0.15);border-radius:24px;overflow:hidden;">

              <!-- Card top accent bar -->
              <div style="height:3px;background:linear-gradient(90deg,transparent,#38bdf8,#2563eb,transparent);"></div>

              <!-- Card body -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:44px 44px 0;text-align:center;">

                    <!-- ── RADAR VISUAL ── -->
                    <div style="position:relative;width:120px;height:120px;margin:0 auto 32px;text-align:center;">
                      <div style="position:absolute;inset:0;border-radius:50%;border:1px solid rgba(56,189,248,0.2);"></div>
                      <div style="position:absolute;inset:16px;border-radius:50%;border:1px solid rgba(56,189,248,0.15);"></div>
                      <div style="position:absolute;inset:32px;border-radius:50%;border:1px solid rgba(56,189,248,0.12);"></div>
                      <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at center,rgba(56,189,248,0.12) 0%,transparent 70%);"></div>
                      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
                        <div style="width:52px;height:52px;background:linear-gradient(135deg,rgba(56,189,248,0.2),rgba(37,99,235,0.2));border:1px solid rgba(56,189,248,0.35);border-radius:16px;margin:34px auto 0;text-align:center;line-height:52px;font-size:24px;">&#128737;&#65039;</div>
                      </div>
                    </div>

                    <!-- ── STATUS PILL ── -->
                    <div style="display:inline-block;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:100px;padding:6px 16px;margin-bottom:24px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
                        <tr>
                          <td style="vertical-align:middle;padding-right:7px;">
                            <div style="width:7px;height:7px;border-radius:50%;background:#38bdf8;"></div>
                          </td>
                          <td style="vertical-align:middle;">
                            <span style="font-family:'Courier New',monospace;font-size:0.65rem;font-weight:700;color:#38bdf8;letter-spacing:2px;text-transform:uppercase;">SECURE CHANNEL OPEN</span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- ── HEADLINE ── -->
                    <h1 style="margin:0 0 14px;font-family:Inter,system-ui,sans-serif;font-size:1.75rem;font-weight:800;color:#f8fafc;letter-spacing:-0.8px;line-height:1.2;">
                      Verify your identity
                    </h1>

                    <!-- ── SUBTEXT ── -->
                    <p style="margin:0 0 36px;font-family:Inter,system-ui,sans-serif;font-size:0.95rem;color:#94a3b8;line-height:1.7;max-width:360px;margin-left:auto;margin-right:auto;">
                      Hi <strong style="color:#e2e8f0;font-weight:700;">${name}</strong> — a secure access link has been dispatched. Click below to authorize your station. This link expires in <strong style="color:#e2e8f0;font-weight:700;">24 hours</strong>.
                    </p>

                    <!-- ── CTA BUTTON ── -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 40px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#38bdf8,#2563eb);border-radius:14px;box-shadow:0 8px 32px -8px rgba(56,189,248,0.5);">
                          <a href="${verifyUrl}"
                             style="display:inline-block;padding:15px 44px;font-family:Inter,system-ui,sans-serif;font-size:1rem;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;white-space:nowrap;">
                            &#128274;&nbsp;&nbsp;Authorize Access
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin-bottom:28px;"></div>

                  </td>
                </tr>

                <!-- ── URL FALLBACK ROW ── -->
                <tr>
                  <td style="padding:0 44px 28px;text-align:center;">
                    <p style="margin:0 0 8px;font-family:Inter,system-ui,sans-serif;font-size:0.75rem;color:#475569;line-height:1.5;">
                      Button not working? Copy and paste this link into your browser:
                    </p>
                    <p style="margin:0;word-break:break-all;">
                      <a href="${verifyUrl}" style="font-family:'Courier New',monospace;font-size:0.7rem;color:#38bdf8;text-decoration:none;">${verifyUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- ── SECURITY NOTE ── -->
                <tr>
                  <td style="background:rgba(239,68,68,0.04);border-top:1px solid rgba(255,255,255,0.05);padding:20px 44px;text-align:center;border-radius:0 0 24px 24px;">
                    <p style="margin:0;font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;line-height:1.6;">
                      &#128274; If you didn't create a SentraScope account, ignore this email — no action needed.<br>
                      This link automatically expires and cannot be reused.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="12">
                      <tr>
                        <td><a href="${APP_URL}" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">Home</a></td>
                        <td><span style="color:#1e293b;">·</span></td>
                        <td><a href="${APP_URL}/privacy" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">Privacy</a></td>
                        <td><span style="color:#1e293b;">·</span></td>
                        <td><a href="${APP_URL}/about" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">About</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;font-family:Inter,system-ui,sans-serif;font-size:0.72rem;color:#1e293b;">&copy; 2026 SentraScope &mdash; Engineered in India</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  await brevoSend({
    to,
    toName: name,
    subject: "SentraScope — Authorize your station access",
    html,
    text: `Hi ${name},\n\nAuthorize your SentraScope station by visiting this link:\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't sign up, ignore this email.\n\n© 2026 SentraScope — Engineered in India`,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const APP_URL = getAppUrl();
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  if (!BREVO_API_KEY) {
    logger.warn({ to, resetUrl }, "BREVO_API_KEY not set — password reset link (dry-run)");
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset your SentraScope access key</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    body { margin:0; padding:0; background:#020617; }
    * { box-sizing: border-box; }
  </style>
</head>
<body style="margin:0;padding:0;background:#020617;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(160deg,#020617 0%,#0c1628 50%,#020617 100%);min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:12px;vertical-align:middle;">
                    <img src="${APP_URL}/logo.png" alt="SentraScope Logo" width="52" height="52" style="display:inline-block;border-radius:12px;vertical-align:middle;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:Inter,system-ui,sans-serif;font-size:1.3rem;font-weight:800;color:#f8fafc;letter-spacing:-0.5px;">SentraScope</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CARD -->
          <tr>
            <td style="background:#0d1829;border:1px solid rgba(239,68,68,0.2);border-radius:24px;overflow:hidden;">
              <div style="height:3px;background:linear-gradient(90deg,transparent,#ef4444,#f97316,transparent);"></div>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:44px 44px 0;text-align:center;">

                    <!-- LOCK VISUAL -->
                    <div style="position:relative;width:120px;height:120px;margin:0 auto 32px;">
                      <div style="position:absolute;inset:0;border-radius:50%;border:1px solid rgba(239,68,68,0.2);"></div>
                      <div style="position:absolute;inset:16px;border-radius:50%;border:1px solid rgba(239,68,68,0.15);"></div>
                      <div style="position:absolute;inset:32px;border-radius:50%;border:1px solid rgba(239,68,68,0.12);"></div>
                      <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at center,rgba(239,68,68,0.1) 0%,transparent 70%);"></div>
                      <div style="position:absolute;inset:0;">
                        <div style="width:52px;height:52px;background:linear-gradient(135deg,rgba(239,68,68,0.2),rgba(249,115,22,0.2));border:1px solid rgba(239,68,68,0.35);border-radius:16px;margin:34px auto 0;text-align:center;line-height:52px;font-size:24px;">&#128274;</div>
                      </div>
                    </div>

                    <!-- STATUS PILL -->
                    <div style="display:inline-block;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:100px;padding:6px 16px;margin-bottom:24px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
                        <tr>
                          <td style="vertical-align:middle;padding-right:7px;">
                            <div style="width:7px;height:7px;border-radius:50%;background:#ef4444;"></div>
                          </td>
                          <td style="vertical-align:middle;">
                            <span style="font-family:'Courier New',monospace;font-size:0.65rem;font-weight:700;color:#ef4444;letter-spacing:2px;text-transform:uppercase;">KEY RESET REQUESTED</span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- HEADLINE -->
                    <h1 style="margin:0 0 14px;font-family:Inter,system-ui,sans-serif;font-size:1.75rem;font-weight:800;color:#f8fafc;letter-spacing:-0.8px;line-height:1.2;">
                      Reset your access key
                    </h1>

                    <!-- SUBTEXT -->
                    <p style="margin:0 0 36px;font-family:Inter,system-ui,sans-serif;font-size:0.95rem;color:#94a3b8;line-height:1.7;max-width:360px;margin-left:auto;margin-right:auto;">
                      Hi <strong style="color:#e2e8f0;font-weight:700;">${name}</strong> — a key reset has been requested for your station. Click below to set a new password. This link expires in <strong style="color:#e2e8f0;font-weight:700;">1 hour</strong>.
                    </p>

                    <!-- CTA BUTTON -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 40px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#ef4444,#f97316);border-radius:14px;box-shadow:0 8px 32px -8px rgba(239,68,68,0.45);">
                          <a href="${resetUrl}"
                             style="display:inline-block;padding:15px 44px;font-family:Inter,system-ui,sans-serif;font-size:1rem;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;white-space:nowrap;">
                            &#128274;&nbsp;&nbsp;Reset Access Key
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin-bottom:28px;"></div>
                  </td>
                </tr>

                <!-- URL FALLBACK -->
                <tr>
                  <td style="padding:0 44px 28px;text-align:center;">
                    <p style="margin:0 0 8px;font-family:Inter,system-ui,sans-serif;font-size:0.75rem;color:#475569;line-height:1.5;">
                      Button not working? Copy and paste this link into your browser:
                    </p>
                    <p style="margin:0;word-break:break-all;">
                      <a href="${resetUrl}" style="font-family:'Courier New',monospace;font-size:0.7rem;color:#38bdf8;text-decoration:none;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- SECURITY NOTE -->
                <tr>
                  <td style="background:rgba(239,68,68,0.04);border-top:1px solid rgba(255,255,255,0.05);padding:20px 44px;text-align:center;border-radius:0 0 24px 24px;">
                    <p style="margin:0;font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;line-height:1.6;">
                      &#9888;&#65039; If you did not request this reset, you can safely ignore this email.<br>
                      Your password will remain unchanged. This link expires in 1 hour.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="12">
                      <tr>
                        <td><a href="${APP_URL}" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">Home</a></td>
                        <td><span style="color:#1e293b;">·</span></td>
                        <td><a href="${APP_URL}/privacy" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">Privacy</a></td>
                        <td><span style="color:#1e293b;">·</span></td>
                        <td><a href="${APP_URL}/about" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">About</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;font-family:Inter,system-ui,sans-serif;font-size:0.72rem;color:#1e293b;">&copy; 2026 SentraScope &mdash; Engineered in India</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  await brevoSend({
    to,
    toName: name,
    subject: "SentraScope — Reset your access key",
    html,
    text: `Hi ${name},\n\nReset your SentraScope password by visiting:\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.\n\n© 2026 SentraScope — Engineered in India`,
  });
}
