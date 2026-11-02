import { createHash, timingSafeEqual } from "node:crypto";
import { renderDashboard, dashboardRange } from "@/lib/analytics/dashboard-page";
import { summarize } from "@/lib/analytics/summary";
import { addUtcDays, utcDay } from "@/lib/analytics/time";
import { DAILY_EVENT_CAP, MAX_BODY_BYTES, type StoredEvent } from "@/lib/analytics/types";
import { parseCollectBody } from "@/lib/analytics/validate";

const PRIVATE_HEADERS = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

export type CollectDeps = {
  now: Date;
  countDay: (day: string) => Promise<number>;
  insert: (event: StoredEvent) => Promise<void>;
};

export type DashboardDeps = {
  now: Date;
  token: string | undefined;
  load: (from: string, to: string) => Promise<{ events: StoredEvent[]; truncated: boolean }>;
};

function requestHost(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-host");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return req.headers.get("host") ?? safeHost(req.url);
}

function safeHost(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function sameSite(req: Request): boolean {
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === requestHost(req);
  } catch {
    return false;
  }
}

function doNotTrackRequest(req: Request): boolean {
  const dnt = req.headers.get("dnt")?.toLowerCase();
  return dnt === "1" || dnt === "yes" || req.headers.get("sec-gpc") === "1";
}

function empty(status: number, extra?: Record<string, string>): Response {
  return new Response(null, { status, headers: { ...PRIVATE_HEADERS, ...extra } });
}

export async function handleCollect(req: Request, deps: CollectDeps): Promise<Response> {
  if (req.method !== "POST") return empty(405, { allow: "POST" });
  if (!sameSite(req)) return empty(403);
  if (doNotTrackRequest(req)) return empty(204);

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return empty(413);
  const parsed = parseCollectBody(text, { now: deps.now, siteHost: requestHost(req)?.split(":")[0]?.toLowerCase() ?? null });
  if (!parsed.ok) return new Response(parsed.error, { status: parsed.status, headers: PRIVATE_HEADERS });

  try {
    const count = await deps.countDay(parsed.event.day);
    if (count >= DAILY_EVENT_CAP) return empty(204);
    await deps.insert(parsed.event);
  } catch {
    return empty(503);
  }
  return empty(204);
}

function configuredToken(token: string | undefined): string | null {
  const trimmed = token?.trim() ?? "";
  if (trimmed.length < 12) return null;
  return trimmed;
}

export function passwordMatches(password: string, expected: string): boolean {
  const left = createHash("sha256").update(password).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function basicPassword(header: string | null): string | null {
  if (!header) return null;
  const match = /^Basic\s+([A-Za-z0-9+/=]+)$/i.exec(header.trim());
  if (!match?.[1]) return null;
  const decoded = Buffer.from(match[1], "base64").toString("utf8");
  const colon = decoded.indexOf(":");
  if (colon < 0) return null;
  return decoded.slice(colon + 1);
}

function html(status: number, body: string, extra?: Record<string, string>): Response {
  return new Response(body, {
    status,
    headers: {
      ...PRIVATE_HEADERS,
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "x-robots-tag": "noindex, nofollow",
      ...extra,
    },
  });
}

function messagePage(title: string, message: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>${title}</title></head><body style="font-family:ui-sans-serif,system-ui,sans-serif;background:#0b1018;color:#f4f7fb;padding:32px"><h1>${title}</h1><p>${message}</p></body></html>`;
}

export async function handleDashboard(req: Request, deps: DashboardDeps): Promise<Response> {
  if (req.method !== "GET") return empty(405, { allow: "GET" });
  const token = configuredToken(deps.token);
  if (!token) {
    return html(503, messagePage("Statistics unavailable", "Set ANALYTICS_DASHBOARD_TOKEN to a secret of at least 12 characters, then publish a new deploy."));
  }
  const password = basicPassword(req.headers.get("authorization"));
  if (!password || !passwordMatches(password, token)) {
    return html(401, messagePage("Sign in", "This page is for the site operator."), {
      "www-authenticate": 'Basic realm="Run The Roster analytics", charset="UTF-8"',
    });
  }

  const url = new URL(req.url);
  const days = dashboardRange(url.searchParams.get("days"));
  const end = utcDay(deps.now);
  const start = addUtcDays(end, -(days - 1));
  const from = addUtcDays(start, -7);
  let loaded: { events: StoredEvent[]; truncated: boolean };
  try {
    loaded = await deps.load(from, end);
  } catch {
    return html(503, messagePage("Statistics unavailable", "The statistics store did not respond. The game itself is unaffected."));
  }
  const summary = summarize(loaded.events, { start, end, truncated: loaded.truncated });
  return html(200, renderDashboard(summary, days));
}
