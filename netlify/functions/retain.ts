import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { deleteExpiredEvents } from "./_shared/store";

export default async function retain(req: Request): Promise<Response> {
  let scheduled = false;
  try {
    const body = (await req.json()) as { next_run?: unknown };
    scheduled = typeof body?.next_run === "string";
  } catch {
    scheduled = false;
  }
  if (!scheduled) return new Response("Not found", { status: 404 });
  await deleteExpiredEvents(getDatabase());
  return new Response(null, { status: 204 });
}

export const config: Config = {
  schedule: "@daily",
};
