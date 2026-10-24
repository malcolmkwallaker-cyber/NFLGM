import type { Player, Pos, SeasonState, StaffMember } from "@/lib/types";
import { clamp } from "@/lib/engine/rng";

const OFF_POS: Pos[] = ["QB", "RB", "WR", "TE", "OL"];

export function effectiveOvr(p: Player): number {
  if (p.injured) return Math.round(p.ovr * 0.72);
  if (p.limited) return Math.round(p.ovr * 0.88);
  return p.ovr;
}

function best(roster: Player[], pos: Pos, n: number): number {
  const list = roster
    .filter((p) => p.pos === pos)
    .map(effectiveOvr)
    .sort((a, b) => b - a);
  if (!list.length) return 64;
  const take = list.slice(0, n);
  return take.reduce((s, v) => s + v, 0) / take.length;
}

export function offenseRating(roster: Player[], staff?: Partial<{ hc: StaffMember; oc: StaffMember }>, extras = 0): number {
  const qb = best(roster, "QB", 1);
  const skill =
    best(roster, "RB", 1) * 0.18 +
    best(roster, "WR", 2) * 0.42 +
    best(roster, "TE", 1) * 0.16 +
    best(roster, "OL", 3) * 0.24;
  let rating = qb * 0.42 + skill * 0.58;
  if (staff?.hc) rating += (staff.hc.leadership - 3) * 0.7;
  if (staff?.oc) rating += (staff.oc.aggression - 3) * 0.35 + (staff.oc.development - 3) * 0.25;
  return clamp(rating + extras, 50, 99);
}

export function defenseRating(roster: Player[], staff?: Partial<{ hc: StaffMember; dc: StaffMember }>, extras = 0): number {
  const front =
    best(roster, "DL", 2) * 0.34 +
    best(roster, "EDGE", 2) * 0.36 +
    best(roster, "LB", 2) * 0.3;
  const cover = best(roster, "CB", 2) * 0.62 + best(roster, "S", 1) * 0.38;
  let rating = front * 0.55 + cover * 0.45;
  if (staff?.hc) rating += (staff.hc.leadership - 3) * 0.55;
  if (staff?.dc) rating += (staff.dc.aggression - 3) * 0.4 + (staff.dc.leadership - 3) * 0.3;
  return clamp(rating + extras, 50, 99);
}

export function teamRatings(state: SeasonState, teamId: string): { off: number; def: number } {
  const team = state.teams[teamId];
  if (!team) return { off: 70, def: 70 };
  if (team.lockOff && team.lockDef && team.roster.length === 0) {
    return { off: team.lockOff, def: team.lockDef };
  }
  const mine = teamId === state.teamId;
  const staff = mine ? state.staff : undefined;
  const chem = mine ? (state.meters.locker - 65) * 0.045 : 0;
  const ident =
    mine && state.identity === "aggressive" ? 1.1 : mine && state.identity === "conservative" ? -0.4 : 0;
  const mod = mine ? state.teamMod : 0;
  const off = team.lockOff && !mine ? team.lockOff : offenseRating(team.roster, staff, chem + ident + mod);
  const def =
    team.lockDef && !mine
      ? team.lockDef
      : defenseRating(team.roster, staff, chem + mod + (mine && state.identity === "conservative" ? 0.8 : 0));
  return {
    off: team.lockOff && team.roster.length === 0 ? team.lockOff : off,
    def: team.lockDef && team.roster.length === 0 ? team.lockDef : def,
  };
}

export function rosterValue(roster: Player[]): number {
  return roster.reduce((s, p) => s + effectiveOvr(p), 0);
}

export function topByPos(roster: Player[], pos: Pos): Player | undefined {
  return roster
    .filter((p) => p.pos === pos)
    .sort((a, b) => effectiveOvr(b) - effectiveOvr(a))[0];
}

export function isSkill(pos: Pos): boolean {
  return pos === "QB" || pos === "RB" || pos === "WR" || pos === "TE";
}

export function sideOf(pos: Pos): "off" | "def" | "st" {
  if (OFF_POS.includes(pos)) return "off";
  if (pos === "K") return "st";
  return "def";
}
