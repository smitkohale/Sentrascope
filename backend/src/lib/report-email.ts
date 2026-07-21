import type { EnvironmentReport, PeriodType } from "./report-data.js";

function getAppUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  return "http://localhost:5173";
}

const PERIOD_LABELS: Record<PeriodType, { title: string; subtitle: string; badge: string }> = {
  daily:   { title: "Daily Intelligence Brief",   subtitle: "24-Hour Environmental Summary",  badge: "DAILY"   },
  weekly:  { title: "Weekly Strategic Review",    subtitle: "7-Day Environmental Analysis",   badge: "WEEKLY"  },
  monthly: { title: "Monthly Impact Report",      subtitle: "30-Day Environmental Overview",  badge: "MONTHLY" },
};

function aqiColor(aqi: number): string {
  if (aqi <= 50)  return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 150) return "#f97316";
  if (aqi <= 200) return "#ef4444";
  if (aqi <= 300) return "#a855f7";
  return "#7f1d1d";
}

function uvColor(uv: number): string {
  if (uv < 3)  return "#22c55e";
  if (uv < 6)  return "#eab308";
  if (uv < 8)  return "#f97316";
  if (uv < 11) return "#ef4444";
  return "#a855f7";
}

function noiseColor(db: number): string {
  if (db < 50) return "#22c55e";
  if (db < 60) return "#eab308";
  if (db < 70) return "#f97316";
  if (db < 80) return "#ef4444";
  return "#a855f7";
}

function thermalColor(count: number): string {
  if (count === 0)   return "#22c55e";
  if (count < 5)     return "#eab308";
  if (count < 20)    return "#f97316";
  return "#ef4444";
}

function fmt(val: number, unit: string, decimals = 0): string {
  return `${val.toFixed(decimals)}${unit}`;
}

function metricCard(
  icon: string,
  label: string,
  value: string,
  sublabel: string,
  color: string,
): string {
  return `
    <td width="25%" style="padding:8px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background:#0d1829;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:20px 16px 16px;text-align:center;">
          <div style="font-size:1.5rem;margin-bottom:8px;">${icon}</div>
          <div style="font-family:Inter,system-ui,sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.12em;color:#64748b;text-transform:uppercase;margin-bottom:10px;">${label}</div>
          <div style="font-family:Inter,system-ui,sans-serif;font-size:1.5rem;font-weight:800;color:${color};line-height:1;">${value}</div>
          <div style="font-family:Inter,system-ui,sans-serif;font-size:0.72rem;color:#64748b;margin-top:6px;">${sublabel}</div>
        </td></tr>
      </table>
    </td>`;
}

function stateRow(s: { name: string; aqi: number; aqiLabel: string; thermalHotspots: number; uvIndex: number; uvLabel: string; noiseDb: number; noiseLabel: string }, idx: number): string {
  const bg = idx % 2 === 0 ? "#0d1829" : "#0a1422";
  return `
  <tr style="background:${bg};">
    <td style="padding:10px 16px;font-family:Inter,system-ui,sans-serif;font-size:0.82rem;font-weight:600;color:#e2e8f0;border-bottom:1px solid rgba(255,255,255,0.04);">${s.name}</td>
    <td style="padding:10px 12px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);">
      <span style="font-family:Inter,system-ui,sans-serif;font-size:0.85rem;font-weight:800;color:${aqiColor(s.aqi)};">${s.aqi}</span>
      <div style="font-family:Inter,system-ui,sans-serif;font-size:0.65rem;color:#475569;margin-top:2px;">${s.aqiLabel}</div>
    </td>
    <td style="padding:10px 12px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);">
      <span style="font-family:Inter,system-ui,sans-serif;font-size:0.85rem;font-weight:800;color:${thermalColor(s.thermalHotspots)};">${s.thermalHotspots}</span>
      <div style="font-family:Inter,system-ui,sans-serif;font-size:0.65rem;color:#475569;margin-top:2px;">hotspots</div>
    </td>
    <td style="padding:10px 12px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);">
      <span style="font-family:Inter,system-ui,sans-serif;font-size:0.85rem;font-weight:800;color:${uvColor(s.uvIndex)};">${s.uvIndex}</span>
      <div style="font-family:Inter,system-ui,sans-serif;font-size:0.65rem;color:#475569;margin-top:2px;">${s.uvLabel}</div>
    </td>
    <td style="padding:10px 12px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);">
      <span style="font-family:Inter,system-ui,sans-serif;font-size:0.85rem;font-weight:800;color:${noiseColor(s.noiseDb)};">${s.noiseDb} dB</span>
      <div style="font-family:Inter,system-ui,sans-serif;font-size:0.65rem;color:#475569;margin-top:2px;">${s.noiseLabel}</div>
    </td>
  </tr>`;
}

export function buildReportEmail(report: EnvironmentReport, recipientName: string): { html: string; text: string; subject: string } {
  const APP_URL = getAppUrl();
  const { period, generatedAt, india, states } = report;
  const pl = PERIOD_LABELS[period];
  const dateStr = generatedAt.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = generatedAt.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const subject = `SentraScope ${pl.badge} — ${dateStr}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#020617;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(160deg,#020617 0%,#0c1628 50%,#020617 100%);min-height:100vh;">
  <tr><td align="center" style="padding:40px 16px 32px;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;">

      <!-- ── HEADER ── -->
      <tr><td align="center" style="padding-bottom:24px;">
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
      </td></tr>

      <!-- ── TITLE CARD ── -->
      <tr><td style="background:#0d1829;border:1px solid rgba(56,189,248,0.18);border-radius:24px;overflow:hidden;margin-bottom:24px;">
        <div style="height:3px;background:linear-gradient(90deg,transparent,#38bdf8,#2563eb,transparent);"></div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:36px 40px 32px;text-align:center;">
            <div style="display:inline-block;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.25);border-radius:100px;padding:6px 18px;margin-bottom:16px;">
              <span style="font-family:Inter,system-ui,sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.18em;color:#38bdf8;text-transform:uppercase;">${pl.badge}</span>
            </div>
            <h1 style="font-family:Inter,system-ui,sans-serif;font-size:1.8rem;font-weight:800;color:#f8fafc;margin:0 0 8px;letter-spacing:-0.5px;">${pl.title}</h1>
            <p style="font-family:Inter,system-ui,sans-serif;font-size:0.9rem;color:#64748b;margin:0 0 4px;">${pl.subtitle}</p>
            <p style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#334155;margin:0;">${dateStr} &bull; ${timeStr} IST</p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="height:20px;"></td></tr>

      <!-- ── INDIA OVERVIEW ── -->
      <tr><td style="background:#0d1829;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;padding:28px 24px;">
        <div style="font-family:Inter,system-ui,sans-serif;font-size:0.7rem;font-weight:800;letter-spacing:0.16em;color:#38bdf8;text-transform:uppercase;margin-bottom:20px;">&#127470;&#127475; India — National Overview</div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            ${metricCard("💨", "AQI", String(india.avgAqi), india.aqiLabel, aqiColor(india.avgAqi))}
            ${metricCard("🔥", "Thermal Hotspots", String(india.totalHotspots), `${period} detections`, thermalColor(india.totalHotspots))}
            ${metricCard("☀️", "UV Index", india.uvIndex.toFixed(1), india.uvLabel, uvColor(india.uvIndex))}
            ${metricCard("🔊", "Avg Noise", `${india.avgNoise} dB`, india.noiseLabel, noiseColor(india.avgNoise))}
          </tr>
        </table>
      </td></tr>

      <tr><td style="height:20px;"></td></tr>

      <!-- ── STATE-BY-STATE TABLE ── -->
      <tr><td style="background:#0d1829;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
        <div style="padding:24px 24px 16px;">
          <span style="font-family:Inter,system-ui,sans-serif;font-size:0.7rem;font-weight:800;letter-spacing:0.16em;color:#38bdf8;text-transform:uppercase;">States &amp; Union Territories — Alphabetical</span>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr style="background:#0a1422;">
            <th style="padding:10px 16px;text-align:left;font-family:Inter,system-ui,sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;color:#475569;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.08);">State / UT</th>
            <th style="padding:10px 12px;text-align:center;font-family:Inter,system-ui,sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;color:#475569;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.08);">AQI</th>
            <th style="padding:10px 12px;text-align:center;font-family:Inter,system-ui,sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;color:#475569;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.08);">Thermal</th>
            <th style="padding:10px 12px;text-align:center;font-family:Inter,system-ui,sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;color:#475569;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.08);">UV</th>
            <th style="padding:10px 12px;text-align:center;font-family:Inter,system-ui,sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;color:#475569;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.08);">Noise</th>
          </tr>
          ${states.map((s, i) => stateRow(s, i)).join("")}
        </table>
      </td></tr>

      <tr><td style="height:20px;"></td></tr>

      <!-- ── DATA NOTE ── -->
      <tr><td style="background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.1);border-radius:14px;padding:16px 20px;">
        <p style="font-family:Inter,system-ui,sans-serif;font-size:0.75rem;color:#475569;margin:0;line-height:1.6;">
          <strong style="color:#38bdf8;">Data sources:</strong>
          AQI data from India Central Pollution Control Board (CPCB) via data.gov.in.
          Thermal hotspots from NASA FIRMS VIIRS SNPP (${period === "daily" ? "1-day" : period === "weekly" ? "7-day" : "30-day"} window).
          UV index fetched per-state via OpenUV / Open-Meteo using each state&rsquo;s coordinates. Noise estimated from industrial &amp; population density indices.
        </p>
      </td></tr>

      <!-- ── FOOTER ── -->
      <tr><td style="padding:28px 0 0;text-align:center;">
        <table width="100%" cellpadding="0" cellspacing="12" border="0">
          <tr>
            <td align="center" style="padding-bottom:10px;">
              <table cellpadding="0" cellspacing="12"><tr>
                <td><a href="${APP_URL}/dashboard" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">Dashboard</a></td>
                <td><span style="color:#1e293b;">·</span></td>
                <td><a href="${APP_URL}/alerts" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">Manage Alerts</a></td>
                <td><span style="color:#1e293b;">·</span></td>
                <td><a href="${APP_URL}/about" style="font-family:Inter,system-ui,sans-serif;font-size:0.78rem;color:#475569;text-decoration:none;">About</a></td>
              </tr></table>
            </td>
          </tr>
          <tr><td align="center">
            <p style="margin:0;font-family:Inter,system-ui,sans-serif;font-size:0.72rem;color:#1e293b;">&copy; 2026 SentraScope &mdash; Engineered in India</p>
          </td></tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = `${pl.title} — ${dateStr} ${timeStr} IST\n\n` +
    `INDIA OVERVIEW\n` +
    `AQI: ${india.avgAqi} (${india.aqiLabel})\n` +
    `Thermal Hotspots: ${india.totalHotspots}\n` +
    `UV Index: ${india.uvIndex} (${india.uvLabel})\n` +
    `Avg Noise: ${india.avgNoise} dB (${india.noiseLabel})\n\n` +
    `STATE-BY-STATE DATA\n` +
    states.map(s =>
      `${s.name}: AQI ${s.aqi} (${s.aqiLabel}) | Thermal ${s.thermalHotspots} hotspots | UV ${s.uvIndex} (${s.uvLabel}) | Noise ${s.noiseDb} dB (${s.noiseLabel})`
    ).join("\n") +
    `\n\n© 2026 SentraScope — Engineered in India`;

  return { html, text, subject };
}
