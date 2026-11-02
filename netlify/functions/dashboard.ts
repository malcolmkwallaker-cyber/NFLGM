import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { handleDashboard } from "../../lib/analytics/http";
import { loadEvents } from "./_shared/store";

export default async function dashboard(req: Request): Promise<Response> {
  const db = getDatabase();
  return handleDashboard(req, {
    now: new Date(),
    token: Netlify.env.get("ANALYTICS_DASHBOARD_TOKEN"),
    load: (from, to) => loadEvents(db, from, to),
  });
}

export const config: Config = {
  method: "GET",
};
