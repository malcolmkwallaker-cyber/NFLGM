import type { DatabaseConnection } from "@netlify/database";
import { DAILY_EVENT_CAP, DASHBOARD_ROW_CAP, type StoredEvent } from "../../../lib/analytics/types";

type EventRow = {
  day: string;
  session_id: string;
  visitor_id: string | null;
  visitor_prev: string | null;
  visitor_d7: string | null;
  event: StoredEvent["event"];
  path: string | null;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  mode: StoredEvent["mode"];
  duration_ms: number | string | null;
};

function rowToEvent(row: EventRow): StoredEvent {
  return {
    day: String(row.day).slice(0, 10),
    sessionId: row.session_id,
    visitorId: row.visitor_id,
    visitorPrev: row.visitor_prev,
    visitorD7: row.visitor_d7,
    event: row.event,
    path: row.path,
    referrerHost: row.referrer_host,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    mode: row.mode,
    durationMs: row.duration_ms === null || row.duration_ms === undefined ? null : Number(row.duration_ms),
  };
}

export async function insertEvent(db: DatabaseConnection, event: StoredEvent): Promise<void> {
  await db.sql`
    WITH accepted AS (
      INSERT INTO analytics_daily_counts (day, event_count)
      VALUES (CAST(${event.day} AS date), 1)
      ON CONFLICT (day) DO UPDATE
      SET event_count = analytics_daily_counts.event_count + 1
      WHERE analytics_daily_counts.event_count < ${DAILY_EVENT_CAP}
      RETURNING day
    )
    INSERT INTO analytics_events (
      day, session_id, visitor_id, visitor_prev, visitor_d7,
      event, path, referrer_host,
      utm_source, utm_medium, utm_campaign, utm_content,
      mode, duration_ms
    ) SELECT
      day,
      ${event.sessionId},
      ${event.visitorId},
      ${event.visitorPrev},
      ${event.visitorD7},
      ${event.event},
      ${event.path},
      ${event.referrerHost},
      ${event.utmSource},
      ${event.utmMedium},
      ${event.utmCampaign},
      ${event.utmContent},
      ${event.mode},
      ${event.durationMs}
    FROM accepted
  `;
}

export async function loadEvents(db: DatabaseConnection, from: string, to: string): Promise<{ events: StoredEvent[]; truncated: boolean }> {
  const limit = DASHBOARD_ROW_CAP + 1;
  const rows = await db.sql<EventRow>`
    SELECT
      to_char(day, 'YYYY-MM-DD') AS day,
      session_id, visitor_id, visitor_prev, visitor_d7,
      event, path, referrer_host,
      utm_source, utm_medium, utm_campaign, utm_content,
      mode, duration_ms
    FROM analytics_events
    WHERE day >= CAST(${from} AS date) AND day <= CAST(${to} AS date)
    ORDER BY day, id
    LIMIT ${limit}
  `;
  const truncated = rows.length > DASHBOARD_ROW_CAP;
  return { events: rows.slice(0, DASHBOARD_ROW_CAP).map(rowToEvent), truncated };
}

export async function deleteExpiredEvents(db: DatabaseConnection): Promise<void> {
  await db.sql`DELETE FROM analytics_events WHERE day < (CURRENT_DATE - INTERVAL '90 days')`;
  await db.sql`DELETE FROM analytics_daily_counts WHERE day < (CURRENT_DATE - INTERVAL '90 days')`;
}
