import type { ScheduledGame } from "@/lib/types";
import { makeRng } from "@/lib/engine/rng";

/** Balanced circle slate. Every team plays `weeks` games, one per week. */
export function buildSchedule(teamIds: string[], weeks: number, seed: number): ScheduledGame[] {
  const ids = teamIds.slice();
  if (ids.length < 2) return [];
  if (ids.length % 2 === 1) ids.push("BYE");
  const n = ids.length;
  const rng = makeRng(seed);
  const arr = ids.slice();
  const games: ScheduledGame[] = [];
  const maxWeeks = Math.min(weeks, n - 1);
  for (let w = 0; w < maxWeeks; w++) {
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (!a || !b || a === "BYE" || b === "BYE") continue;
      const flip = (w + i + (rng.next() > 0.5 ? 1 : 0)) % 2 === 0;
      games.push({ week: w + 1, home: flip ? a : b, away: flip ? b : a });
    }
    const fixed = arr[0];
    const rest = arr.slice(1);
    const last = rest.pop();
    if (last) rest.unshift(last);
    arr.splice(0, arr.length, fixed as string, ...rest);
  }
  return games;
}
