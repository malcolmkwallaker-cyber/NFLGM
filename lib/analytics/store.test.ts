import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { DatabaseConnection } from "@netlify/database";
import { afterAll, beforeAll, expect, it } from "vitest";
import { insertEvent, loadEvents, deleteExpiredEvents } from "../../netlify/functions/_shared/store";
import { handleCollect, handleDashboard } from "./http";
import { createTracker, memoryStore } from "./track";
import { DAILY_EVENT_CAP } from "./types";

const pg = new PGlite();
// Execute the production tagged SQL against a real, isolated Postgres engine.
const db = { sql: async (parts: TemplateStringsArray, ...values: unknown[]) => {
  const query = parts.reduce((sql, part, i) => sql + (i ? `$${i}` : "") + part, "");
  return (await pg.query(query, values)).rows;
} } as unknown as DatabaseConnection;

beforeAll(async () => {
  await pg.exec(readFileSync("netlify/database/migrations/20261102020000_create_analytics_events/migration.sql", "utf8"));
  await pg.exec(readFileSync("netlify/database/migrations/20261102120000_atomic_analytics_cap.sql", "utf8"));
});
afterAll(async () => { await pg.close(); });

it("round-trips tracker events through collection, SQL and authenticated dashboard", async () => {
  const pending: Promise<Response>[] = [];
  const now = new Date();
  let id = 0;
  const tracker = createTracker({ enabled: true, local: memoryStore(), session: memoryStore(),
    now: () => now, randomId: () => `11111111-1111-4111-8111-${String(++id).padStart(12, "0")}`,
    doNotTrack: null, globalPrivacyControl: false, pageHost: "localhost",
    send: body => { pending.push(handleCollect(new Request("http://localhost/api/collect/", { method: "POST", body }), {
      enabled: true, now, insert: event => insertEvent(db, event),
    })); },
  });
  await tracker.pageview("/", "?utm_campaign=creator_outreach&utm_content=test-creator", "");
  for (const mode of ["Daily", "Season", "Career"] as const) await tracker.event("game_start", { mode });
  await tracker.event("first_action");
  await tracker.event("season_complete");
  expect((await Promise.all(pending)).every(r => r.status === 204)).toBe(true);
  const day = now.toISOString().slice(0, 10);
  const loaded = await loadEvents(db, day, day);
  expect(loaded.events).toHaveLength(6);
  const token = "test-only-dashboard-token";
  const response = await handleDashboard(new Request("http://localhost/analytics/", { headers: {
    authorization: `Basic ${Buffer.from(`operator:${token}`).toString("base64")}`,
  }}), { now, token, load: (from, to) => loadEvents(db, from, to) });
  expect(response.status).toBe(200);
  const html = await response.text();
  for (const label of ["test-creator", "Daily", "Season", "Career"]) expect(html).toContain(label);
  // Multiple requests at the last available slot must accept only one event.
  await pg.query("UPDATE analytics_daily_counts SET event_count = $1 WHERE day = $2", [DAILY_EVENT_CAP - 1, day]);
  await Promise.all(Array.from({ length: 20 }, () => insertEvent(db, loaded.events[0])));
  expect((await loadEvents(db, day, day)).events).toHaveLength(7);
  expect((await pg.query<{ event_count: number }>("SELECT event_count FROM analytics_daily_counts")).rows[0].event_count).toBe(DAILY_EVENT_CAP);
  await insertEvent(db, { ...loaded.events[0], day: "2020-01-01" });
  await deleteExpiredEvents(db);
  expect((await loadEvents(db, "2020-01-01", "2020-01-01")).events).toEqual([]);
  expect((await pg.query("SELECT * FROM analytics_daily_counts WHERE day = '2020-01-01'")).rows).toEqual([]);
});
