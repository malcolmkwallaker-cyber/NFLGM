import type { Player, SeasonState } from "@/lib/types";
import { clamp } from "@/lib/engine/rng";

export function payroll(roster: Player[]): number {
  return roster.reduce((sum, p) => sum + p.cap, 0);
}

export function capSpace(state: SeasonState, roster = state.teams[state.teamId]?.roster ?? []): number {
  return Math.round((state.capLimit - payroll(roster) - state.deadMoney) * 10) / 10;
}

export function capHealth(state: SeasonState): number {
  const space = capSpace(state);
  const limit = Math.max(1, state.capLimit);
  const spaceRatio = space / limit;
  const currentDeadRatio = state.deadMoney / limit;
  const futureDeadRatio = state.futureDead / limit;
  const health =
    55 +
    (spaceRatio >= 0 ? spaceRatio * 85 : spaceRatio * 180) -
    currentDeadRatio * 70 -
    futureDeadRatio * 30;
  return Math.round(clamp(health, 0, 100));
}

const MULT: Record<string, number> = {
  QB: 1.7,
  EDGE: 1.15,
  WR: 1.05,
  DL: 1,
  CB: 0.95,
  OL: 0.9,
  LB: 0.78,
  S: 0.75,
  TE: 0.72,
  RB: 0.52,
  K: 0.22,
};

export function marketAsk(p: Player): number {
  const built = Math.max(0.9, (p.ovr - 58) * 0.62 * (MULT[p.pos] ?? 0.8));
  return Math.round(Math.max(p.cap * 0.9, built) * 10) / 10;
}

export function offerYears(p: Player): number {
  if (p.age >= 34) return 1;
  if (p.age >= 31) return 2;
  return 3;
}
