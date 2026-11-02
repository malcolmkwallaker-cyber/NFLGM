import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { handleCollect } from "../../lib/analytics/http";
import { countEventsOnDay, insertEvent } from "./_shared/store";

export default async function collect(req: Request): Promise<Response> {
  const db = getDatabase();
  return handleCollect(req, {
    now: new Date(),
    countDay: (day) => countEventsOnDay(db, day),
    insert: (event) => insertEvent(db, event),
  });
}

export const config: Config = {
  method: "POST",
};
