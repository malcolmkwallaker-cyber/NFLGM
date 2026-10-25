import type { Player, SeasonState } from "@/lib/types";
import { clamp } from "@/lib/engine/rng";

export function payroll(roster: Player[]): number {
  return roster.reduce((sum, p) => sum + p.cap, 0);
}

export function committedPayroll(roster: Player[]): number {
  return payroll(roster.filter((player) => player.years > 0));
}

export function capSpace(state: SeasonState, roster = state.teams[state.teamId]?.roster ?? []): number {
  return Math.round((state.capLimit - committedPayroll(roster) - state.deadMoney) * 10) / 10;
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

export const BASE_CAP_LIMIT = 322;

export function salaryScale(capLimit: number): number {
  return Math.max(1, capLimit / BASE_CAP_LIMIT);
}

export function marketAgeFactor(p: Player): number {
  let factor = p.age >= 37 ? 0.52 : p.age >= 36 ? 0.6 : p.age >= 35 ? 0.68 : p.age >= 34 ? 0.76 : p.age >= 33 ? 0.84 : p.age >= 31 ? 0.93 : 1;
  if (p.pos === "QB" && p.ovr >= 88) factor = Math.max(factor, 0.78);
  else if (p.ovr >= 90) factor = Math.max(factor, 0.72);
  else if ((p.pos === "OL" || p.pos === "DL") && p.ovr >= 82) factor = Math.max(factor, 0.7);
  return factor;
}

export function marketAsk(p: Player, scale = 1): number {
  const built = Math.max(0.9, (p.ovr - 58) * 0.62 * (MULT[p.pos] ?? 0.8)) * scale;
  return Math.round(Math.max(p.cap * 0.9, built) * marketAgeFactor(p) * 10) / 10;
}

export function offerYears(p: Player): number {
  if (p.age >= 34) return 1;
  if (p.age >= 31) return 2;
  return 3;
}
