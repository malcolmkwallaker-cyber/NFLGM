import { describe, expect, it } from "vitest";
import { applyAction, createSeason, suggestedCuts, suggestAction, yourRoster } from "@/lib/engine/season";
import type { Phase, SeasonState } from "@/lib/types";

function advanceTo(state: SeasonState, phase: Phase): SeasonState {
  let current = state;
  for (let guard = 0; guard < 300 && current.phase !== phase; guard += 1) {
    const action = suggestAction(current);
    if (!action) throw new Error(`No action while advancing from ${current.phase} to ${phase}`);
    current = applyAction(current, action);
  }
  expect(current.phase).toBe(phase);
  return current;
}

describe("audit regressions", () => {
  it("round-trips and resumes from every reachable gameplay phase", () => {
    const seen = new Set<Phase>();
    let last = createSeason({ teamId: "KC", gmName: "Save Audit", seed: 1, mode: "career" });

    for (let seed = 1; seed <= 12 && !seen.has("playoffs"); seed += 1) {
      let state = createSeason({ teamId: "KC", gmName: "Save Audit", seed, mode: "career" });
      for (let guard = 0; guard < 300 && state.phase !== "recap" && state.phase !== "fired"; guard += 1) {
        seen.add(state.phase);
        state = JSON.parse(JSON.stringify(state)) as SeasonState;
        const action = suggestAction(state);
        if (!action) throw new Error(`No action in ${state.phase}`);
        state = applyAction(state, action);
      }
      seen.add(state.phase);
      last = state;
    }

    const fired = JSON.parse(JSON.stringify({ ...last, phase: "fired" })) as SeasonState;
    seen.add(fired.phase);

    expect([...seen].sort()).toEqual(
      (["camp", "cap", "draft", "fa", "fired", "intro", "playoffs", "recap", "regular", "staff", "trade"] satisfies Phase[]).sort(),
    );
  });

  it("rejects repeated phase submissions without changing accepted state", () => {
    const intro = createSeason({ teamId: "KC", gmName: "Double Click", seed: 12 });
    const staff = applyAction(intro, { type: "intro", choice: "embrace" });
    const snapshot = JSON.stringify(staff);

    expect(() => applyAction(staff, { type: "intro", choice: "embrace" })).toThrow("No owner meeting");
    expect(JSON.stringify(staff)).toBe(snapshot);

    let camp = advanceTo(staff, "camp");
    const cuts = suggestedCuts(camp);
    camp = applyAction(camp, { type: "camp", cutIds: cuts });
    const regularSnapshot = JSON.stringify(camp);

    expect(() => applyAction(camp, { type: "camp", cutIds: cuts })).toThrow("Camp cuts are done");
    expect(JSON.stringify(camp)).toBe(regularSnapshot);
  });

  it("removes the outgoing player and moves the incoming player and pick exactly once", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "Trade Audit", seed: 7 }), "trade");
    const offer = state.tradeOffers.find((candidate) => candidate.incoming && candidate.pickRound);
    expect(offer).toBeTruthy();
    if (!offer?.incoming || !offer.pickRound || !offer.pickYear) return;

    const outgoing = offer.wantId;
    const incoming = offer.incoming.id;
    const source = offer.fromTeamId;
    state = applyAction(state, { type: "trade", offerId: offer.id, accept: true });

    expect(yourRoster(state).some((player) => player.id === outgoing)).toBe(false);
    expect(yourRoster(state).filter((player) => player.id === incoming)).toHaveLength(1);
    expect(state.teams[source].roster.some((player) => player.id === incoming)).toBe(false);
    expect(state.extraPicks.filter((pick) => pick.round === offer.pickRound && pick.year === offer.pickYear)).toHaveLength(1);
    expect(() => applyAction(state, { type: "trade", offerId: offer.id, accept: true })).toThrow("That offer expired");
  });
});
