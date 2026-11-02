import { eachUtcDay } from "@/lib/analytics/time";
import type { GameMode, StoredEvent } from "@/lib/analytics/types";

export type Retention = { returned: number; base: number; rate: number | null };

export type DayStat = {
  day: string;
  visitors: number;
  sessions: number;
  pageviews: number;
  d1: Retention;
  d7: Retention;
};

export type NamedCount = { name: string; sessions: number };

export type Summary = {
  start: string;
  end: string;
  truncated: boolean;
  latest: DayStat;
  days: DayStat[];
  totals: {
    visitorDays: number;
    sessions: number;
    pageviews: number;
    averageSessionSeconds: number | null;
  };
  funnel: {
    visit: number;
    gameStart: number;
    firstAction: number;
    seasonComplete: number;
  };
  modes: Array<{ mode: GameMode; starts: number }>;
  sources: NamedCount[];
  campaigns: NamedCount[];
  creatorOutreach: NamedCount[];
  referrers: NamedCount[];
  eventCounts: Record<StoredEvent["event"], number>;
};

function distinct(events: StoredEvent[], include: (event: StoredEvent) => boolean, id: (event: StoredEvent) => string | null): number {
  const ids = new Set<string>();
  for (const event of events) {
    if (!include(event)) continue;
    const value = id(event);
    if (value) ids.add(value);
  }
  return ids.size;
}

function retention(events: StoredEvent[], day: string, lag: 1 | 7): Retention {
  const prior = addDays(day, -lag);
  const priorVisitors = new Set<string>();
  for (const event of events) {
    if (event.day === prior && event.visitorId) priorVisitors.add(event.visitorId);
  }
  if (priorVisitors.size === 0) return { returned: 0, base: 0, rate: null };
  const field = lag === 1 ? "visitorPrev" : "visitorD7";
  const returned = new Set<string>();
  for (const event of events) {
    const value = event[field];
    if (event.day === day && value && priorVisitors.has(value)) returned.add(value);
  }
  return { returned: returned.size, base: priorVisitors.size, rate: returned.size / priorVisitors.size };
}

function addDays(day: string, delta: number): string {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + delta);
  return date.toISOString().slice(0, 10);
}

function inRange(day: string, start: string, end: string): boolean {
  return day >= start && day <= end;
}

function topSessions(groups: Map<string, Set<string>>, limit = 8): NamedCount[] {
  return [...groups.entries()]
    .map(([name, sessions]) => ({ name, sessions: sessions.size }))
    .sort((a, b) => b.sessions - a.sessions || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function addSession(groups: Map<string, Set<string>>, name: string | null, sessionId: string) {
  if (!name) return;
  const bucket = groups.get(name) ?? new Set<string>();
  bucket.add(sessionId);
  groups.set(name, bucket);
}

const EMPTY_COUNTS: Record<StoredEvent["event"], number> = {
  pageview: 0,
  game_start: 0,
  first_action: 0,
  season_complete: 0,
  draft_complete: 0,
  trade_made: 0,
  share_card_click: 0,
  session_end: 0,
};

export function summarize(events: StoredEvent[], options: { start: string; end: string; truncated?: boolean }): Summary {
  const ranged = events.filter((event) => inRange(event.day, options.start, options.end));
  const days = eachUtcDay(options.start, options.end).map((day) => ({
    day,
    visitors: distinct(events, (event) => event.day === day, (event) => event.visitorId),
    sessions: distinct(events, (event) => event.day === day, (event) => event.sessionId),
    pageviews: events.filter((event) => event.day === day && event.event === "pageview").length,
    d1: retention(events, day, 1),
    d7: retention(events, day, 7),
  }));
  const latest = days[days.length - 1] ?? {
    day: options.end,
    visitors: 0,
    sessions: 0,
    pageviews: 0,
    d1: { returned: 0, base: 0, rate: null },
    d7: { returned: 0, base: 0, rate: null },
  };

  const durations = ranged.filter((event) => event.event === "session_end" && event.durationMs !== null).map((event) => event.durationMs ?? 0);
  const sources = new Map<string, Set<string>>();
  const campaigns = new Map<string, Set<string>>();
  const creatorOutreach = new Map<string, Set<string>>();
  const referrers = new Map<string, Set<string>>();
  const eventCounts = { ...EMPTY_COUNTS };
  const modeStarts = new Map<GameMode, number>();

  for (const event of ranged) {
    eventCounts[event.event] += 1;
    if (event.event === "pageview") {
      addSession(sources, event.utmSource, event.sessionId);
      addSession(campaigns, event.utmCampaign, event.sessionId);
      addSession(referrers, event.referrerHost, event.sessionId);
      if (event.utmCampaign?.toLowerCase() === "creator_outreach") {
        addSession(creatorOutreach, event.utmContent ?? "(none)", event.sessionId);
      }
    }
    if (event.event === "game_start" && event.mode) {
      modeStarts.set(event.mode, (modeStarts.get(event.mode) ?? 0) + 1);
    }
  }

  return {
    start: options.start,
    end: options.end,
    truncated: Boolean(options.truncated),
    latest,
    days,
    totals: {
      visitorDays: days.reduce((sum, day) => sum + day.visitors, 0),
      sessions: distinct(ranged, () => true, (event) => event.sessionId),
      pageviews: eventCounts.pageview,
      averageSessionSeconds: durations.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length / 1000) : null,
    },
    funnel: {
      visit: distinct(ranged, (event) => event.event === "pageview", (event) => event.sessionId),
      gameStart: distinct(ranged, (event) => event.event === "game_start", (event) => event.sessionId),
      firstAction: distinct(ranged, (event) => event.event === "first_action", (event) => event.sessionId),
      seasonComplete: distinct(ranged, (event) => event.event === "season_complete", (event) => event.sessionId),
    },
    modes: [...modeStarts.entries()]
      .map(([mode, starts]) => ({ mode, starts }))
      .sort((a, b) => b.starts - a.starts || a.mode.localeCompare(b.mode)),
    sources: topSessions(sources),
    campaigns: topSessions(campaigns),
    creatorOutreach: topSessions(creatorOutreach),
    referrers: topSessions(referrers),
    eventCounts,
  };
}
