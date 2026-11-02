import type { Summary } from "@/lib/analytics/summary";

const RANGES = [7, 14, 30, 90] as const;

export function dashboardRange(value: string | null): (typeof RANGES)[number] {
  const parsed = Number(value);
  return (RANGES as readonly number[]).includes(parsed) ? (parsed as (typeof RANGES)[number]) : 14;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPercent(rate: number | null): string {
  if (rate === null) return "—";
  return `${Math.round(rate * 1000) / 10}%`;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder.toString().padStart(2, "0")}s`;
}

function rows(items: Array<{ name: string; sessions: number }>, empty: string): string {
  if (!items.length) return `<p class="empty">${empty}</p>`;
  return `<table><tbody>${items
    .map((item) => `<tr><td>${escapeHtml(item.name)}</td><td class="num">${item.sessions}</td></tr>`)
    .join("")}</tbody></table>`;
}

export function renderDashboard(summary: Summary, selectedDays: number): string {
  const maxFunnel = Math.max(summary.funnel.visit, 1);
  const funnel = [
    ["Visit", summary.funnel.visit],
    ["Game start", summary.funnel.gameStart],
    ["First action", summary.funnel.firstAction],
    ["Season complete", summary.funnel.seasonComplete],
  ] as const;
  const modeMax = Math.max(...summary.modes.map((mode) => mode.starts), 1);
  const options = RANGES.map(
    (days) => `<option value="${days}"${days === selectedDays ? " selected" : ""}>${days} days</option>`,
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Run The Roster statistics</title>
  <style>
    :root { color-scheme: dark; }
    body { margin: 0; font: 15px/1.45 ui-sans-serif, system-ui, sans-serif; background: #0b1018; color: #f4f7fb; }
    main { max-width: 980px; margin: 0 auto; padding: 28px 20px 64px; }
    h1 { font: 600 42px/0.95 ui-sans-serif, system-ui, sans-serif; letter-spacing: 0.04em; margin: 0; }
    h2 { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #b8ff39; margin: 28px 0 10px; }
    p { color: #c3ccda; }
    .kicker { color: #b8ff39; letter-spacing: 0.16em; text-transform: uppercase; font-size: 11px; margin-bottom: 8px; }
    .stats { display: flex; flex-wrap: wrap; gap: 10px; margin: 14px 0; }
    .stat { background: #121a27; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; min-width: 140px; }
    .stat b { display: block; font-size: 28px; color: #fff; }
    .stat span { color: #9aa6b8; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
    form { display: flex; gap: 8px; align-items: end; margin: 8px 0 4px; }
    select, button { background: #121a27; color: #fff; border: 1px solid rgba(255,255,255,0.16); border-radius: 8px; padding: 8px 10px; }
    button { background: #b8ff39; color: #07111f; font-weight: 700; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; }
    td, th { text-align: left; padding: 7px 8px; border-bottom: 1px solid rgba(255,255,255,0.08); vertical-align: top; }
    th { color: #9aa6b8; font-size: 12px; font-weight: 600; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .bar { height: 8px; background: rgba(184,255,57,0.18); border-radius: 99px; overflow: hidden; margin-top: 6px; }
    .bar i { display: block; height: 100%; background: #b8ff39; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
    .card { background: #121a27; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px 14px; }
    .empty, .note { color: #9aa6b8; }
    .warn { color: #ffd27a; }
  </style>
</head>
<body>
<main>
  <p class="kicker">Operator only · UTC</p>
  <h1>RUN THE ROSTER</h1>
  <p>Cookieless statistics for ${escapeHtml(summary.start)} through ${escapeHtml(summary.end)}. No names, saves, IP addresses, or user agents are stored.</p>
  <form method="get" action="/analytics/">
    <label>Range <select name="days">${options}</select></label>
    <button type="submit">Update</button>
  </form>
  ${summary.truncated ? `<p class="warn">This range hit the row cap, so older events in the window were left out.</p>` : ""}
  <div class="stats">
    <div class="stat"><b>${summary.latest.visitors}</b><span>Visitors on ${escapeHtml(summary.latest.day)}</span></div>
    <div class="stat"><b>${summary.latest.sessions}</b><span>Sessions that day</span></div>
    <div class="stat"><b>${summary.totals.sessions}</b><span>Sessions in range</span></div>
    <div class="stat"><b>${summary.totals.visitorDays}</b><span>Visitor-days</span></div>
    <div class="stat"><b>${formatDuration(summary.totals.averageSessionSeconds)}</b><span>Avg. session</span></div>
  </div>

  <h2>Daily</h2>
  <table>
    <thead><tr><th>Day</th><th class="num">Visitors</th><th class="num">Sessions</th><th class="num">Page views</th><th class="num">D1</th><th class="num">D7</th></tr></thead>
    <tbody>
      ${summary.days
        .map(
          (day) => `<tr><td>${escapeHtml(day.day)}</td><td class="num">${day.visitors}</td><td class="num">${day.sessions}</td><td class="num">${day.pageviews}</td><td class="num">${formatPercent(day.d1.rate)}</td><td class="num">${formatPercent(day.d7.rate)}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <p class="note">D1 and D7 are the share of the earlier day’s rotating visitor ids that showed up again. A dash means that earlier day had no visitor id.</p>

  <h2>Acquisition</h2>
  <div class="grid">
    <section class="card"><h2>UTM sources</h2>${rows(summary.sources, "No tagged sources in this range.")}</section>
    <section class="card"><h2>UTM campaigns</h2>${rows(summary.campaigns, "No tagged campaigns in this range.")}</section>
    <section class="card"><h2>creator_outreach</h2>${rows(summary.creatorOutreach, "No creator_outreach sessions in this range.")}</section>
    <section class="card"><h2>Referrer hosts</h2>${rows(summary.referrers, "No external referrers in this range.")}</section>
  </div>
  <p class="note">Source, campaign, and referrer counts are distinct sessions with a tagged page view. creator_outreach is split by utm_content.</p>

  <h2>Funnel</h2>
  <div class="card">
    ${funnel
      .map(
        ([label, count]) => `<div><span>${label}</span> <b>${count}</b><div class="bar"><i style="width:${Math.round((count / maxFunnel) * 100)}%"></i></div></div>`,
      )
      .join("")}
    <p class="note">Each step counts sessions that recorded that event. A resumed save can reach a later step without a new game start.</p>
  </div>

  <h2>Mode split</h2>
  <div class="card">
    ${
      summary.modes.length
        ? summary.modes
            .map(
              (mode) => `<div><span>${escapeHtml(mode.mode)}</span> <b>${mode.starts}</b><div class="bar"><i style="width:${Math.round((mode.starts / modeMax) * 100)}%"></i></div></div>`,
            )
            .join("")
        : `<p class="empty">No game starts in this range.</p>`
    }
  </div>

  <h2>Other events</h2>
  <table>
    <tbody>
      <tr><td>Draft complete</td><td class="num">${summary.eventCounts.draft_complete}</td></tr>
      <tr><td>Trade made</td><td class="num">${summary.eventCounts.trade_made}</td></tr>
      <tr><td>Share card click</td><td class="num">${summary.eventCounts.share_card_click}</td></tr>
      <tr><td>Session end</td><td class="num">${summary.eventCounts.session_end}</td></tr>
    </tbody>
  </table>
</main>
</body>
</html>`;
}
