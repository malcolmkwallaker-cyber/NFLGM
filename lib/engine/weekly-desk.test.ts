import { describe, expect, it } from "vitest";
import { capSpace, committedPayroll } from "@/lib/engine/cap";
import { teamRatings } from "@/lib/engine/ratings";
import { applyAction, createSeason, meterImpactPreview, restoreWeeklyDecision, suggestAction, yourRoster } from "@/lib/engine/season";
import { freshProfile, migrateProfile } from "@/lib/storage";
import type { SeasonState } from "@/lib/types";

function campStart(teamId: string, seed: number): SeasonState {
  let state = createSeason({ teamId, seed, gmName: "Weekly Desk QA", mode: "career" });
  for (let actions = 0; state.phase !== "regular" && actions < 200; actions++) {
    const next = suggestAction(state);
    if (!next) throw new Error("Could not make it to Week 1");
    state = applyAction(state, next);
  }
  expect(state.phase).toBe("regular");
  return state;
}

describe("weekly desk", () => {
  it.each([["KC", 1403389951], ["SEA", 3868239877]] as const)(
    "plays all 17 weeks from camp with exactly one decision per week for %s",
    (team, seed) => {
      let state = campStart(team, seed);
      const types = new Set<string>();
      for (let week = 1; week <= 17; week++) {
        expect(state.week).toBe(week);
        const decision = state.activeDecision;
        expect(decision?.options.length).toBeGreaterThan(1);
        if (!decision) throw new Error("Missing weekly decision");
        types.add(decision.id);
        expect(() => applyAction(state, { type: "play-week" })).toThrow("decision on the desk");
        for (const option of decision.options) {
          expect([option.owner ?? 0, option.fans ?? 0, option.locker ?? 0].some((value) => value < 0)).toBe(true);
        }
        const choice = week === 4 ? decision.options.find((option) => option.id === "sit") ?? decision.options[0] : decision.options[0];
        const expected = meterImpactPreview(state, choice);
        const before = state.meters;
        state = applyAction(state, { type: "decide", choiceId: choice.id });
        expect(state.activeDecision).toBeNull();
        expect(state.meters).toEqual({ owner: before.owner + expected.owner.applied, fans: before.fans + expected.fans.applied, locker: before.locker + expected.locker.applied });
        state = migrateProfile({ ...freshProfile(), season: JSON.parse(JSON.stringify(state)) }).season!;
        expect(state.activeDecision).toBeNull();
        state = applyAction(state, { type: "play-week" });
      }
      expect([...types]).toEqual(expect.arrayContaining(["week-matchup", "week-practice", "injury", "week-roster"]));
      expect(state.results.filter((game) => game.round === "regular" && [game.home, game.away].includes(team))).toHaveLength(17);
      while (state.phase === "playoffs") state = applyAction(state, { type: "playoff" });
      expect(state.phase).toBe("recap");
    },
  );

  it("restores a blank legacy desk but never repeats a completed decision", () => {
    let state = campStart("KC", 1403389951);
    state = applyAction(state, { type: "decide", choiceId: state.activeDecision!.options[0].id });
    delete state.flags["desk-resolved:1"];
    restoreWeeklyDecision(state);
    expect(state.activeDecision).toBeNull();
    state = applyAction(state, { type: "play-week" });
    state.activeDecision = null;
    const reloaded = migrateProfile({ ...freshProfile(), season: JSON.parse(JSON.stringify(state)) });
    expect(reloaded.version).toBe(1);
    expect(reloaded.season?.week).toBe(2);
    expect(reloaded.season?.activeDecision?.id).toBe("week-matchup");
    expect(reloaded.season?.results).toEqual(state.results);
  });

  it("applies a weekly focus only to the upcoming game", () => {
    let state = campStart("KC", 1403389951);
    state = applyAction(state, { type: "decide", choiceId: state.activeDecision!.options[0].id });
    state = applyAction(state, { type: "play-week" });
    const before = teamRatings(state, state.teamId);
    state = applyAction(state, { type: "decide", choiceId: "attack" });
    expect(teamRatings(state, state.teamId)).toEqual({ off: before.off + 1, def: before.def - 0.5 });
    state = applyAction(state, { type: "play-week" });
    expect(state.flags["weekly-off"]).toBeUndefined();
    expect(state.flags["weekly-def"]).toBeUndefined();
  });

  it("shows a legal street signing and charges the cap only on acceptance", () => {
    const state = campStart("KC", 1403389951);
    state.week = 5;
    state.ripples = [];
    state.activeDecision = null;
    state.teams.KC.roster = yourRoster(state).slice(0, 25);
    state.capMode = "hard";
    state.deadMoney = state.capLimit - committedPayroll(yourRoster(state)) - 6;
    restoreWeeklyDecision(state);
    expect(state.activeDecision?.id).toBe("week-roster");
    expect(state.activeDecision?.options.some((option) => option.id === "street-sign")).toBe(true);
    const signed = applyAction(state, { type: "decide", choiceId: "street-sign" });
    const acquired = yourRoster(signed).at(-1)!;
    expect(acquired.id).toMatch(/^weekly-fa-KC-/);
    expect(acquired.years).toBe(1);
    expect(capSpace(signed)).toBeCloseTo(capSpace(state) - acquired.cap, 1);
    const noRoom = structuredClone(state);
    noRoom.activeDecision = null;
    noRoom.deadMoney += 6;
    restoreWeeklyDecision(noRoom);
    expect(noRoom.activeDecision?.options.some((option) => option.id === "street-sign")).toBe(false);
  });
});
