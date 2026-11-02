import { describe, expect, it } from "vitest";
import { handleCollect, handleDashboard, type CollectDeps, type DashboardDeps } from "@/lib/analytics/http";
import { DAILY_EVENT_CAP, type StoredEvent } from "@/lib/analytics/types";

const SESSION = "11111111-1111-4111-8111-111111111111";
const TOKEN = "dashboard-token-12";

function collectDeps(events: StoredEvent[], overrides?: Partial<CollectDeps>): CollectDeps & { events: StoredEvent[] } {
  return {
    events,
    now: new Date("2026-11-02T18:00:00.000Z"),
    enabled: true,
    insert: async (event) => {
      if (events.length < DAILY_EVENT_CAP) events.push(event);
    },
    ...overrides,
  };
}

function post(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://runtheroster.com/api/collect/", {
    method: "POST",
    headers: { origin: "https://runtheroster.com", "content-type": "text/plain", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function auth(password: string): string {
  return `Basic ${Buffer.from(`operator:${password}`).toString("base64")}`;
}

describe("collection endpoint", () => {
  it("defaults off before reading the body or touching the database", async () => {
    for (const enabled of [undefined, false]) {
      const deps = collectDeps([], { enabled, insert: async () => { throw new Error("must not connect"); } });
      expect((await handleCollect(post("invalid JSON"), deps)).status).toBe(204);
      expect(deps.events).toEqual([]);
    }
  });

  it("limits UTF-8 bytes rather than JavaScript characters", async () => {
    expect((await handleCollect(post("é".repeat(2500)), collectDeps([]))).status).toBe(413);
  });
  it("accepts a same-site page view and ignores personal fields", async () => {
    const deps = collectDeps([]);
    const response = await handleCollect(
      post({
        event: "pageview",
        sessionId: SESSION,
        path: "/",
        utmCampaign: "creator_outreach",
        utmContent: "coach-maya",
        ip: "203.0.113.9",
        email: "gm@example.com",
      }),
      deps,
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(deps.events).toHaveLength(1);
    expect(deps.events[0]?.utmContent).toBe("coach-maya");
    expect(JSON.stringify(deps.events[0])).not.toContain("203.0.113.9");
    expect(JSON.stringify(deps.events[0])).not.toContain("gm@example.com");
  });

  it("drops cross-site, Do Not Track, and over-cap requests without writing", async () => {
    const deps = collectDeps([]);
    const body = { event: "game_start", sessionId: SESSION, mode: "Season" };
    expect((await handleCollect(post(body, { origin: "https://evil.example" }), deps)).status).toBe(403);
    expect((await handleCollect(post(body, { dnt: "1" }), deps)).status).toBe(204);
    expect((await handleCollect(post(body, { "sec-gpc": "1" }), deps)).status).toBe(204);
    const capped = collectDeps([], { insert: async () => {} });
    expect((await handleCollect(post(body), capped)).status).toBe(204);
    expect(deps.events).toEqual([]);
    expect(capped.events).toEqual([]);
  });

  it("returns 400 for a bad payload and 503 when the store fails", async () => {
    const deps = collectDeps([]);
    expect((await handleCollect(post("{"), deps)).status).toBe(400);
    expect((await handleCollect(new Request("https://runtheroster.com/api/collect/", { method: "GET" }), deps)).status).toBe(405);
    const failing = collectDeps([], {
      insert: async () => {
        throw new Error("database unavailable");
      },
    });
    expect((await handleCollect(post({ event: "pageview", sessionId: SESSION, path: "/" }), failing)).status).toBe(503);
  });
});

describe("dashboard endpoint", () => {
  function deps(token: string | undefined, events: StoredEvent[] = []): DashboardDeps {
    return {
      now: new Date("2026-11-02T18:00:00.000Z"),
      token,
      load: async () => ({ events, truncated: false }),
    };
  }

  it("stays closed until a long token is configured", async () => {
    const response = await handleDashboard(new Request("https://runtheroster.com/analytics/"), deps("short"));
    expect(response.status).toBe(503);
    expect(await response.text()).toContain("ANALYTICS_DASHBOARD_TOKEN");
  });

  it("rejects a wrong password before reading statistics", async () => {
    let loaded = false;
    const response = await handleDashboard(new Request("https://runtheroster.com/analytics/", { headers: { authorization: auth("nope-not-token") } }), {
      ...deps(TOKEN),
      load: async () => {
        loaded = true;
        return { events: [], truncated: false };
      },
    });
    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toContain("Basic");
    expect(loaded).toBe(false);
  });

  it("renders the range for the operator password without setting a cookie", async () => {
    const response = await handleDashboard(
      new Request("https://runtheroster.com/analytics/?days=7", { headers: { authorization: auth(TOKEN) } }),
      deps(TOKEN, [
        {
          day: "2026-11-02",
          sessionId: SESSION,
          visitorId: null,
          visitorPrev: null,
          visitorD7: null,
          event: "pageview",
          path: "/",
          referrerHost: null,
          utmSource: "youtube",
          utmMedium: "creator",
          utmCampaign: "creator_outreach",
          utmContent: "coach-maya",
          mode: null,
          durationMs: null,
        },
      ]),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toBeNull();
    const html = await response.text();
    expect(html).toContain("coach-maya");
    expect(html).toContain("creator_outreach");
    expect(html).toContain("noindex");
  });
});
