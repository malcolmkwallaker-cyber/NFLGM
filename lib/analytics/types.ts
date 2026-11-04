export const GAME_MODES = ["Career", "Season", "Daily", "Historical", "Turnaround"] as const;
export type GameMode = (typeof GAME_MODES)[number];

export const EVENT_NAMES = [
  "pageview",
  "game_start",
  "first_action",
  "season_complete",
  "draft_complete",
  "trade_made",
  "share_card_click",
  "session_end",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

export const MAX_DURATION_MS = 12 * 60 * 60 * 1000;
export const DAILY_EVENT_CAP = 20_000;
export const MAX_BODY_BYTES = 4_096;
export const DASHBOARD_ROW_CAP = 200_000;
export const RETENTION_DAYS = 90;

export type StoredEvent = {
  day: string;
  sessionId: string;
  visitorId: string | null;
  visitorPrev: string | null;
  visitorD7: string | null;
  event: EventName;
  path: string | null;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  mode: GameMode | null;
  durationMs: number | null;
};

export type UtmFields = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
};
