import { describe, expect, it, vi } from "vitest";
import { renderDashboard } from "@/lib/analytics/dashboard-page";
import { rotatingVisitorIds } from "@/lib/analytics/identity";
import { milestoneEvents } from "@/lib/analytics/milestones";
import { summarize } from "@/lib/analytics/summary";
import { addUtcDays } from "@/lib/analytics/time";
import { createTracker, deliver, memoryStore, type Tracker } from "@/lib/analytics/track";
import type { StoredEvent } from "@/lib/analytics/types";
import { cleanHost, cleanUtm, parseCollectBody, referrerHostname, trackingAllowed } from "@/lib/analytics/validate";

const SESSION = "11111111-1111-4111-8111-111111111111";

function event(partial: Partial<StoredEvent> & Pick<StoredEvent, "day" | "sessionId" | "event">): StoredEvent {
  return {
    visitorId: null,
    visitorPrev: null,
    visitorD7: null,
    path: null,
    referrerHost: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    mode: null,
    durationMs: null,
    ...partial,
  };
}

describe("privacy filters", () => {
  it("stops for Do Not Track and Global Privacy Control", () => {
    expect(trackingAllowed({ doNotTrack: "1" })).toBe(false);
    expect(trackingAllowed({ doNotTrack: "yes" })).toBe(false);
    expect(trackingAllowed({ globalPrivacyControl: true })).toBe(false);
    expect(trackingAllowed({ doNotTrack: "0" })).toBe(true);
  });

  it("keeps campaign slugs and drops addresses or markup", () => {
    expect(cleanUtm("creator_outreach")).toBe("creator_outreach");
    expect(cleanUtm("coach-maya")).toBe("coach-maya");
    expect(cleanUtm("player@example.com")).toBeNull();
    expect(cleanUtm("<script>")).toBeNull();
    expect(cleanHost("youtube.com")).toBe("youtube.com");
    expect(cleanHost("192.168.1.1")).toBeNull();
    expect(referrerHostname("https://runtheroster.com/daily/?x=1", "runtheroster.com")).toBeNull();
    expect(referrerHostname("https://www.youtube.com/watch?v=abc", "runtheroster.com")).toBe("www.youtube.com");
  });

  it("stores only allowlisted fields and the server's UTC day", () => {
    const parsed = parseCollectBody(
      JSON.stringify({
        event: "pageview",
        sessionId: SESSION,
        path: "/season/?utm_source=x",
        referrerHost: "t.co",
        utmSource: "youtube",
        utmMedium: "creator",
        utmCampaign: "creator_outreach",
        utmContent: "coach-maya",
        ip: "203.0.113.8",
        email: "gm@example.com",
        userAgent: "secret-browser",
        name: "Malcolm",
      }),
      { now: new Date("2026-11-02T23:30:00.000Z"), siteHost: "runtheroster.com" },
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.event).toEqual({
      day: "2026-11-02",
      sessionId: SESSION,
      visitorId: null,
      visitorPrev: null,
      visitorD7: null,
      event: "pageview",
      path: "/season/",
      referrerHost: "t.co",
      utmSource: "youtube",
      utmMedium: "creator",
      utmCampaign: "creator_outreach",
      utmContent: "coach-maya",
      mode: null,
      durationMs: null,
    });
    expect(JSON.stringify(parsed.event)).not.toContain("203.0.113.8");
    expect(JSON.stringify(parsed.event)).not.toContain("example.com");
  });

  it("rejects unknown events, bad modes, and oversized durations", () => {
    const now = new Date("2026-11-02T00:00:00.000Z");
    expect(parseCollectBody(JSON.stringify({ event: "click", sessionId: SESSION }), { now, siteHost: null }).ok).toBe(false);
    expect(parseCollectBody(JSON.stringify({ event: "game_start", sessionId: SESSION, mode: "Exhibition" }), { now, siteHost: null }).ok).toBe(false);
    expect(parseCollectBody(JSON.stringify({ event: "session_end", sessionId: SESSION, durationMs: 99_999_999_999 }), { now, siteHost: null }).ok).toBe(false);
  });
});

describe("rotating visitor ids", () => {
  it("changes each UTC day and links yesterday without sending the seed", async () => {
    const seed = "device-seed-that-must-stay-local";
    const today = await rotatingVisitorIds(seed, new Date("2026-11-02T12:00:00.000Z"));
    const yesterday = await rotatingVisitorIds(seed, new Date("2026-11-01T12:00:00.000Z"));
    expect(today.id).not.toBe(yesterday.id);
    expect(today.prev).toBe(yesterday.id);
    expect(today.id).toHaveLength(64);
    expect(today.id).not.toContain(seed);
  });
});

describe("game milestones", () => {
  it("records completed drafts, seasons, and accepted trades only", () => {
    expect(milestoneEvents({ beforePhase: "draft", afterPhase: "camp", action: { type: "draft", prospectId: "p" }, decisionId: null })).toEqual(["draft_complete"]);
    expect(milestoneEvents({ beforePhase: "playoffs", afterPhase: "recap", action: { type: "playoff" }, decisionId: null })).toEqual(["season_complete"]);
    expect(milestoneEvents({ beforePhase: "draft", afterPhase: "recap", action: { type: "sim", until: "recap" }, decisionId: null })).toEqual(["draft_complete", "season_complete"]);
    expect(milestoneEvents({ beforePhase: "trade", afterPhase: "trade", action: { type: "trade", offerId: "o", accept: true }, decisionId: null })).toEqual(["trade_made"]);
    expect(milestoneEvents({ beforePhase: "trade", afterPhase: "trade", action: { type: "trade", offerId: "o", accept: false }, decisionId: null })).toEqual([]);
    expect(milestoneEvents({ beforePhase: "draft", afterPhase: "draft", action: { type: "draft-trade", accept: false }, decisionId: null })).toEqual([]);
    expect(milestoneEvents({ beforePhase: "regular", afterPhase: "regular", action: { type: "shop-resolve", accept: true }, decisionId: null })).toEqual(["trade_made"]);
    expect(milestoneEvents({ beforePhase: "regular", afterPhase: "regular", action: { type: "decide", choiceId: "deal" }, decisionId: "deadline" })).toEqual(["trade_made"]);
    expect(milestoneEvents({ beforePhase: "regular", afterPhase: "regular", action: { type: "decide", choiceId: "keep" }, decisionId: "deadline" })).toEqual([]);
  });
});

describe("summary", () => {
  it("counts visitors, acquisition, funnel, modes, and return rates", async () => {
    const seedA = "seed-a";
    const seedB = "seed-b";
    const day0 = "2026-11-01";
    const day1 = "2026-11-02";
    const a0 = await rotatingVisitorIds(seedA, new Date(`${day0}T12:00:00.000Z`));
    const a1 = await rotatingVisitorIds(seedA, new Date(`${day1}T12:00:00.000Z`));
    const b1 = await rotatingVisitorIds(seedB, new Date(`${day1}T12:00:00.000Z`));
    const prior = addUtcDays(day0, -7);
    const aPrior = await rotatingVisitorIds(seedA, new Date(`${prior}T12:00:00.000Z`));

    const events: StoredEvent[] = [
      event({ day: prior, sessionId: SESSION, event: "pageview", visitorId: aPrior.id }),
      event({
        day: day0,
        sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        event: "pageview",
        visitorId: a0.id,
        visitorD7: a0.d7,
        utmSource: "youtube",
        utmCampaign: "creator_outreach",
        utmContent: "coach-maya",
        referrerHost: "youtube.com",
      }),
      event({ day: day0, sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", event: "game_start", visitorId: a0.id, mode: "Career" }),
      event({ day: day0, sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", event: "first_action", visitorId: a0.id }),
      event({ day: day0, sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", event: "season_complete", visitorId: a0.id }),
      event({ day: day0, sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", event: "session_end", visitorId: a0.id, durationMs: 125_000 }),
      event({
        day: day1,
        sessionId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        event: "pageview",
        visitorId: a1.id,
        visitorPrev: a1.prev,
        utmSource: "youtube",
        utmCampaign: "creator_outreach",
        utmContent: "coach-maya",
      }),
      event({ day: day1, sessionId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", event: "game_start", visitorId: a1.id, mode: "Daily" }),
      event({
        day: day1,
        sessionId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        event: "pageview",
        visitorId: b1.id,
        utmSource: "reddit",
        utmCampaign: "launch",
      }),
    ];

    const summary = summarize(events, { start: day0, end: day1 });
    expect(summary.days.map((day) => [day.day, day.visitors, day.sessions, day.pageviews])).toEqual([
      [day0, 1, 1, 1],
      [day1, 2, 2, 2],
    ]);
    expect(summary.days[1]?.d1).toEqual({ returned: 1, base: 1, rate: 1 });
    expect(summary.days[0]?.d7).toEqual({ returned: 1, base: 1, rate: 1 });
    expect(summary.totals.sessions).toBe(3);
    expect(summary.totals.visitorDays).toBe(3);
    expect(summary.totals.averageSessionSeconds).toBe(125);
    expect(summary.funnel).toEqual({ visit: 3, gameStart: 2, firstAction: 1, seasonComplete: 1 });
    expect(summary.modes).toEqual([
      { mode: "Career", starts: 1 },
      { mode: "Daily", starts: 1 },
    ]);
    expect(summary.sources).toEqual([
      { name: "youtube", sessions: 2 },
      { name: "reddit", sessions: 1 },
    ]);
    expect(summary.campaigns.map((row) => row.name)).toEqual(["creator_outreach", "launch"]);
    expect(summary.creatorOutreach).toEqual([{ name: "coach-maya", sessions: 2 }]);
    expect(summary.referrers).toEqual([{ name: "youtube.com", sessions: 1 }]);

    const html = renderDashboard(summary, 14);
    expect(html).toContain("coach-maya");
    expect(html).toContain("creator_outreach");
    expect(html).toContain("Career");
    expect(html).toContain("100%");
    expect(html).not.toContain("<script>");
  });

  it("escapes untrusted labels before inserting them into the page", () => {
    const summary = summarize([], { start: "2026-11-02", end: "2026-11-02" });
    summary.sources = [{ name: `<script>alert("x")</script>`, sessions: 1 }];
    const html = renderDashboard(summary, 14);
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert");
  });
});

describe("browser tracker", () => {
  function tracker(overrides?: Partial<Parameters<typeof createTracker>[0]>): { tracker: Tracker; sent: string[]; local: ReturnType<typeof memoryStore>; session: ReturnType<typeof memoryStore> } {
    const sent: string[] = [];
    const local = overrides?.local ?? memoryStore();
    const session = overrides?.session ?? memoryStore();
    let nextId = 0;
    const tracker = createTracker({
      enabled: true,
      local,
      session,
      doNotTrack: null,
      globalPrivacyControl: false,
      now: () => new Date("2026-11-02T15:04:00.000Z"),
      randomId: () => `22222222-2222-4222-8222-22222222222${nextId++}`,
      pageHost: "runtheroster.com",
      send: (body) => sent.push(body),
      ...overrides,
    });
    return { tracker, sent, local, session };
  }

  it("sends a page view with UTM fields and a daily hash, not the local seed", async () => {
    const setup = tracker();
    await setup.tracker.pageview("/daily/", "?utm_source=youtube&utm_medium=creator&utm_campaign=creator_outreach&utm_content=coach-maya", "https://youtube.com/watch?v=1");
    const payload = JSON.parse(setup.sent[0] ?? "{}") as Record<string, string>;
    expect(payload.event).toBe("pageview");
    expect(payload.utmCampaign).toBe("creator_outreach");
    expect(payload.utmContent).toBe("coach-maya");
    expect(payload.referrerHost).toBe("youtube.com");
    expect(payload.visitorId).toMatch(/^[a-f0-9]{64}$/);
    const seed = setup.local.get("rtr_visitor_seed");
    expect(seed).toBeTruthy();
    expect(JSON.stringify(payload)).not.toContain(seed ?? "missing-seed");
  });

  it("does not write storage or send when the visitor opts out or analytics is off", async () => {
    const optedOut = tracker({ doNotTrack: "1" });
    await optedOut.tracker.pageview("/", "", "");
    await optedOut.tracker.event("game_start", { mode: "Season" });
    expect(optedOut.sent).toEqual([]);
    expect(optedOut.local.get("rtr_visitor_seed")).toBeNull();

    const disabled = tracker({ enabled: false, globalPrivacyControl: true });
    await disabled.tracker.pageview("/", "?utm_source=youtube", "");
    expect(disabled.sent).toEqual([]);
  });

  it("records one session end with the elapsed duration", async () => {
    let now = Date.parse("2026-11-02T15:00:00.000Z");
    const setup = tracker({ now: () => new Date(now) });
    await setup.tracker.pageview("/", "", "");
    now += 5_000;
    await setup.tracker.sessionEnd();
    await setup.tracker.sessionEnd();
    const ends = setup.sent.filter((body) => (JSON.parse(body) as { event: string }).event === "session_end");
    expect(ends).toHaveLength(1);
    expect((JSON.parse(ends[0] ?? "{}") as { durationMs: number }).durationMs).toBe(5_000);
  });

  it("sends first_action once and keeps later game starts", async () => {
    const setup = tracker();
    await setup.tracker.event("game_start", { mode: "Historical" });
    await setup.tracker.event("first_action");
    await setup.tracker.event("first_action");
    await setup.tracker.event("game_start", { mode: "Turnaround" });
    const names = setup.sent.map((body) => (JSON.parse(body) as { event: string; mode?: string }).event);
    expect(names).toEqual(["game_start", "first_action", "game_start"]);
    expect(JSON.parse(setup.sent[0] ?? "{}").mode).toBe("Historical");
    expect(JSON.parse(setup.sent[2] ?? "{}").mode).toBe("Turnaround");
  });

  it("swallows a failed send", async () => {
    const setup = tracker({
      send: () => {
        throw new Error("network down");
      },
    });
    await expect(setup.tracker.pageview("/", "", "")).resolves.toBeUndefined();
  });

  it("falls back when sendBeacon fails and ignores fetch failures", () => {
    const fetched: string[] = [];
    deliver("{}", {
      beacon: () => {
        throw new Error("beacon blocked");
      },
      fetch(_url, body) {
        fetched.push(body);
      },
    });
    expect(fetched).toEqual(["{}"]);

    expect(() =>
      deliver("{}", {
        beacon: () => false,
        fetch: () => {
          throw new Error("offline");
        },
      }),
    ).not.toThrow();

    const rejected = vi.fn(() => Promise.reject(new Error("offline")));
    expect(() => deliver("{}", { beacon: () => false, fetch: rejected })).not.toThrow();
  });
});
