import { EVENT_NAMES, GAME_MODES, MAX_DURATION_MS, type EventName, type GameMode, type StoredEvent, type UtmFields } from "@/lib/analytics/types";
import { utcDay } from "@/lib/analytics/time";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HEX_64 = /^[0-9a-f]{64}$/;
const UTM = /^[A-Za-z0-9._~-]{1,80}$/;
const PATH = /^\/[A-Za-z0-9/_.~-]*$/;
const HOST = /^(?=.{1,120}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export function cleanUtm(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!UTM.test(trimmed)) return null;
  return trimmed;
}

export function cleanPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.split("?")[0]?.split("#")[0] ?? "";
  if (path.length < 1 || path.length > 120) return null;
  if (!path.startsWith("/") || path.includes("..") || path.includes("\\")) return null;
  if (!PATH.test(path)) return null;
  return path;
}

export function cleanHost(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase().replace(/\.$/, "");
  if (host.includes(":") || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return null;
  if (!HOST.test(host)) return null;
  return host;
}

export function referrerHostname(referrer: string, pageHost: string): string | null {
  try {
    const url = new URL(referrer);
    if (url.host === pageHost) return null;
    return cleanHost(url.hostname);
  } catch {
    return null;
  }
}

export function parseUtm(search: string): UtmFields {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return {
    source: cleanUtm(params.get("utm_source")),
    medium: cleanUtm(params.get("utm_medium")),
    campaign: cleanUtm(params.get("utm_campaign")),
    content: cleanUtm(params.get("utm_content")),
  };
}

export function hasUtm(utm: UtmFields): boolean {
  return Boolean(utm.source || utm.medium || utm.campaign || utm.content);
}

function cleanHash(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  return HEX_64.test(trimmed) ? trimmed : null;
}

function cleanMode(value: unknown): GameMode | null {
  return typeof value === "string" && (GAME_MODES as readonly string[]).includes(value) ? (value as GameMode) : null;
}

export type ParseResult = { ok: true; event: StoredEvent } | { ok: false; status: 400; error: string };

export function parseCollectBody(text: string, options: { now: Date; siteHost: string | null }): ParseResult {
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON" };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "Expected an object" };
  }
  const record = body as Record<string, unknown>;
  const eventName = record.event;
  if (typeof eventName !== "string" || !(EVENT_NAMES as readonly string[]).includes(eventName)) {
    return { ok: false, status: 400, error: "Unknown event" };
  }
  const event = eventName as EventName;
  if (typeof record.sessionId !== "string" || !UUID.test(record.sessionId)) {
    return { ok: false, status: 400, error: "Invalid session" };
  }

  const mode = cleanMode(record.mode);
  if (event === "game_start" && !mode) return { ok: false, status: 400, error: "Invalid mode" };

  let durationMs: number | null = null;
  if (event === "session_end" && record.durationMs !== undefined && record.durationMs !== null) {
    if (typeof record.durationMs !== "number" || !Number.isInteger(record.durationMs)) {
      return { ok: false, status: 400, error: "Invalid duration" };
    }
    if (record.durationMs < 0 || record.durationMs > MAX_DURATION_MS) {
      return { ok: false, status: 400, error: "Invalid duration" };
    }
    durationMs = record.durationMs;
  }

  let referrerHost = cleanHost(record.referrerHost);
  if (referrerHost && options.siteHost && referrerHost === options.siteHost.toLowerCase()) referrerHost = null;

  return {
    ok: true,
    event: {
      day: utcDay(options.now),
      sessionId: record.sessionId.toLowerCase(),
      visitorId: cleanHash(record.visitorId),
      visitorPrev: cleanHash(record.visitorPrev),
      visitorD7: cleanHash(record.visitorD7),
      event,
      path: cleanPath(record.path),
      referrerHost,
      utmSource: cleanUtm(record.utmSource),
      utmMedium: cleanUtm(record.utmMedium),
      utmCampaign: cleanUtm(record.utmCampaign),
      utmContent: cleanUtm(record.utmContent),
      mode: event === "game_start" ? mode : null,
      durationMs: event === "session_end" ? durationMs : null,
    },
  };
}

export function trackingAllowed(signals: { doNotTrack?: string | null; globalPrivacyControl?: boolean }): boolean {
  const dnt = signals.doNotTrack?.toLowerCase();
  if (dnt === "1" || dnt === "yes") return false;
  if (signals.globalPrivacyControl) return false;
  return true;
}
