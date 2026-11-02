import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { handleCollect } from "../../lib/analytics/http";
import { insertEvent } from "./_shared/store";

export default async function collect(req: Request): Promise<Response> {
  return handleCollect(req, {
    now: new Date(),
    enabled: Netlify.env.get("ANALYTICS_COLLECTION") === "on",
    insert: (event) => insertEvent(getDatabase(), event),
  });
}

export const config: Config = {
  method: "POST",
};
