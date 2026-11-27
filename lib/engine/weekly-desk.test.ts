import { describe, expect, it } from "vitest";
import { capSpace, committedPayroll } from "@/lib/engine/cap";
import { teamRatings } from "@/lib/engine/ratings";
import { applyAction, createSeason, lateSeasonStakes, playoffReadiness, playoffReadinessRating, restoreWeeklyDecision, suggestAction, weeklyChoicePreview, yourRoster } from "@/lib/engine/season";
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
        const expected = weeklyChoicePreview(state, decision, choice);
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
    const ready = migrateProfile({ ...freshProfile(), season: state }).season!;
    expect(ready.activeDecision?.id).toBe("week-roster");
    expect(ready.activeDecision?.options.some((option) => option.id === "street-sign")).toBe(true);
    const signed = applyAction(ready, { type: "decide", choiceId: "street-sign" });
    const acquired = yourRoster(signed).at(-1)!;
    expect(acquired.id).toMatch(/^weekly-fa-KC-/);
    expect(acquired.years).toBe(1);
    expect(capSpace(signed)).toBeCloseTo(capSpace(state) - acquired.cap, 1);
    const noRoom = structuredClone(state);
    noRoom.activeDecision = null;
    noRoom.deadMoney += 6;
    const underReview = migrateProfile({ ...freshProfile(), season: noRoom }).season!;
    expect(underReview.activeDecision?.options.some((option) => option.id === "street-sign")).toBe(false);
  });
});

describe("late-season stakes", () => {
  it("slows gains crossing 85 and scales desk swings starting at Week 12, with no historical change", () => {
    const state = campStart("KC", 1403389971);
    const decision = {
      id: "week-practice", title: "Test practice", kicker: "", body: "",
      options: [{ id: "extra", label: "Extra reps", detail: "", log: "", owner: 2, fans: 2, locker: -2 }],
    };
    const choice = decision.options[0];
    state.meters = { owner: 84, fans: 85, locker: 96 };
    state.week = 11;
    expect(lateSeasonStakes(state)).toBe(false);
    const early = weeklyChoicePreview(state, decision, choice);
    expect(early.owner.applied).toBe(1);
    expect(early.fans.applied).toBe(1);
    expect(early.locker.applied).toBe(-2);
    expect(early.readiness).toEqual({ before: 0, after: 0 });
    state.week = 12;
    state.meters.owner = 86;
    const late = weeklyChoicePreview(state, decision, choice);
    expect(late.owner).toEqual({ requested: 4, adjusted: 2, applied: 2 });
    expect(late.fans.applied).toBe(2);
    expect(late.locker.applied).toBe(-4);
    expect(late.readiness).toEqual({ before: 0, after: 1 });
    state.mode = "historical";
    expect(weeklyChoicePreview(state, decision, choice)).toMatchObject({ owner: { applied: 2 }, locker: { applied: -2 }, readiness: { before: 0, after: 0 } });
  });

  it("applies a visible playoff stake even if approval is capped, and preserves it on reload", () => {
    const state = campStart("KC", 1403389971);
    state.week = 15;
    state.meters = { owner: 96, fans: 100, locker: 96 };
    state.activeDecision = {
      id: "week-practice", title: "Test practice", kicker: "", body: "",
      options: [{ id: "extra", label: "Extra reps", detail: "", log: "Extra reps.", owner: 2, fans: 2, locker: 2 }],
    };
    const played = applyAction(state, { type: "decide", choiceId: "extra" });
    expect(played.meters).toEqual(state.meters);
    expect(played.decisions.at(-1)?.log).toContain("Playoff readiness 0 → +1");
    const saved = migrateProfile({ ...freshProfile(), season: JSON.parse(JSON.stringify(played)) });
    expect(saved.version).toBe(1);
    expect(playoffReadiness(saved.season!)).toBe(1);
    expect(playoffReadinessRating(saved.season!)).toBe(0.35);
    expect(playoffReadiness(state)).toBe(0);
  });

  it("moves real Week 15 and 17 choices before simulating the game in a natural 14-win Career", () => {
    let state = campStart("KC", 1403389971);
    const affected: number[] = [];
    for (let i = 0; i < 100 && state.phase !== "recap"; i++) {
      const suggested = suggestAction(state);
      if (!suggested) throw new Error(`No action in ${state.phase}`);
      const action = state.week === 4 && state.activeDecision?.options.some(o => o.id === "sit")
        ? { type: "decide" as const, choiceId: "sit" } : suggested;
      const before = state;
      state = applyAction(state, action);
      if (action.type === "decide" && (before.week === 15 || before.week === 17)) {
        expect(state.results).toEqual(before.results);
        expect(playoffReadiness(state)).not.toBe(playoffReadiness(before));
        expect(state.meters).not.toEqual(before.meters);
        affected.push(before.week);
      }
    }
    expect(affected).toEqual([15, 17]);
    expect(state.grade).toMatchObject({ wins: 14, losses: 3 });
  });

  it("changes the deterministic playoff simulation without changing the existing bracket", () => {
    let state = campStart("KC", 1403389971);
    for (let i = 0; i < 80 && state.phase !== "playoffs"; i++) {
      const suggested = suggestAction(state);
      if (!suggested) throw new Error("Could not reach playoffs");
      state = applyAction(state, state.week === 4 && state.activeDecision?.options.some(o => o.id === "sit")
        ? { type: "decide", choiceId: "sit" } : suggested);
    }
    if (!state.playoff?.pending.some(game => game.home === state.teamId || game.away === state.teamId)) state = applyAction(state, { type: "playoff" });
    const match = state.playoff?.pending.find(game => game.home === state.teamId || game.away === state.teamId);
    if (!match) throw new Error("Missing playoff fixture game");
    const high = applyAction({ ...state, flags: { ...state.flags, "playoff-readiness": 6 } }, { type: "playoff" });
    const low = applyAction({ ...state, flags: { ...state.flags, "playoff-readiness": -6 } }, { type: "playoff" });
    const firstResult = (s: SeasonState) => s.results.find(g => g.round === match.round && g.home === match.home && g.away === match.away);
    expect(firstResult(high)).toBeDefined();
    expect(firstResult(low)).toBeDefined();
    expect(firstResult(high)).not.toEqual(firstResult(low));
  });
});
