import { describe, expect, it } from "vitest";
import { advanceCareer, createCareer, takeJob, withJobOffers } from "@/lib/engine/career";
import { applyAction, createSeason, ensureMinimumRoster, rolloverSeason, suggestedCuts, suggestAction, yourRoster } from "@/lib/engine/season";
import type { Phase, SeasonState } from "@/lib/types";
import { freshProfile, migrateProfile } from "@/lib/storage";
import { FREE_TESTING_MODE, hasFullAccess } from "@/lib/access";

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
  it("opens public testing for anonymous and existing free saves without changing entitlement data", () => {
    const anonymous = freshProfile();
    expect(FREE_TESTING_MODE).toBe(true);
    expect(anonymous.pro).toBe(false);
    expect(hasFullAccess(anonymous)).toBe(true);

    const savedCareer = createCareer("Existing Save", "KC", 27);
    savedCareer.season.phase = "recap";
    savedCareer.season.grade = { letter: "B", score: 76, round: "divisional", champ: false, wins: 11, losses: 6, pf: 390, pa: 330, headline: "Kept the job", best: "Draft", worst: "Deadline" };
    const existing = migrateProfile(JSON.parse(JSON.stringify({ ...anonymous, active: "career", career: savedCareer })));

    expect(existing.pro).toBe(false);
    expect(hasFullAccess(existing)).toBe(true);
    if (!existing.career) throw new Error("Existing career save was lost");
    const yearTwo = advanceCareer(existing.career);
    expect(yearTwo.history).toHaveLength(1);
    expect(yearTwo.season.year).toBe(savedCareer.season.year + 1);
    expect(yearTwo.season.phase).toBe("intro");
  });

  it("lets an existing free career accept a fired-GM job in the next year", () => {
    const savedCareer = createCareer("Fired Save", "KC", 28);
    savedCareer.season.year = 2031;
    savedCareer.season.phase = "fired";
    savedCareer.season.grade = { letter: "F", score: 34, round: "missed", champ: false, wins: 3, losses: 14, pf: 220, pa: 430, headline: "Fired", best: "Draft", worst: "Record" };
    const existing = migrateProfile(JSON.parse(JSON.stringify({ ...freshProfile(), active: "career", career: savedCareer })));

    expect(hasFullAccess(existing)).toBe(true);
    if (!existing.career) throw new Error("Existing fired career save was lost");
    const offered = withJobOffers(existing.career);
    expect(offered.jobOffers).toHaveLength(3);
    const hired = takeJob(offered, offered.jobOffers[0].teamId);
    expect(hired.season.year).toBe(2032);
    expect(hired.season.phase).toBe("intro");
    expect(hired.fired).toBe(1);
    expect(hired.jobs).toBe(2);
  });

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
    expect(state.teams[source].roster.filter((player) => player.id === outgoing)).toHaveLength(1);
    expect(yourRoster(state).filter((player) => player.id === incoming)).toHaveLength(1);
    expect(state.teams[source].roster.some((player) => player.id === incoming)).toBe(false);
    expect(state.extraPicks.filter((pick) => pick.round === offer.pickRound && pick.year === offer.pickYear)).toHaveLength(1);
    expect(() => applyAction(state, { type: "trade", offerId: offer.id, accept: true })).toThrow("That offer expired");
  });

  it("assigns every CPU draft choice to the team that made the pick", () => {
    const state = advanceTo(createSeason({ teamId: "KC", gmName: "Draft Audit", seed: 18 }), "camp");
    for (const pick of state.draftPicks) {
      expect(pick.prospectId).toBeTruthy();
      expect(state.teams[pick.teamId].roster.filter((player) => player.id === `draft-${pick.prospectId}`)).toHaveLength(1);
    }
  });

  it("restores a minimum viable roster and quarterback without duplicates", () => {
    const state = createSeason({ teamId: "KC", gmName: "Roster Audit", seed: 21, mode: "career" });
    state.teams.KC.roster = state.teams.KC.roster.filter((player) => player.pos !== "QB").slice(0, 9);
    const first = ensureMinimumRoster(state, "KC");
    const second = ensureMinimumRoster(state, "KC");
    expect(first.length).toBeGreaterThan(0);
    expect(second).toHaveLength(0);
    expect(state.teams.KC.roster).toHaveLength(22);
    expect(state.teams.KC.roster.some((player) => player.pos === "QB")).toBe(true);
    expect(new Set(state.teams.KC.roster.map((player) => player.id)).size).toBe(22);
  });

  it("allows only one restructure per player per season", () => {
    const state = createSeason({ teamId: "KC", gmName: "Contract Audit", seed: 22 });
    state.phase = "cap";
    const player = state.teams.KC.roster.slice().sort((a, b) => b.cap - a.cap)[0];
    const once = applyAction(state, { type: "cap", choice: "restructure", playerId: player.id });
    const snapshot = JSON.stringify(once);
    expect(() => applyAction(once, { type: "cap", choice: "restructure", playerId: player.id })).toThrow("already restructured");
    expect(JSON.stringify(once)).toBe(snapshot);
    const next = rolloverSeason(once);
    expect(next.restructuredIds).toEqual([]);
  });

  it("uses a stable free-agent pool across waves", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "FA Audit", seed: 23 }), "fa");
    expect(state.faPool?.length).toBeGreaterThanOrEqual(8);
    const expectedWaveTwo = state.faPool?.slice(4, 8).map((player) => player.id);
    state.capMode = "payroll";
    const first = state.faBoard[0];
    state = applyAction(state, { type: "sign", playerId: first.id });
    state = applyAction(state, { type: "next-wave" });
    expect(state.faBoard.map((player) => player.id)).toEqual(expectedWaveTwo);
  });

  it("consumes current picks, prunes stale picks, and retains only future picks", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "Pick Audit", seed: 24 }), "trade");
    state.extraPicks = [
      { round: 1, year: state.year - 1 },
      { round: 2, year: state.year },
      { round: 3, year: state.year + 1 },
    ];
    state = applyAction(state, { type: "trade-done" });
    expect(state.draftPicks.some((pick) => pick.note === "Acquired" && pick.round === 2)).toBe(true);
    expect(state.extraPicks).toEqual([{ round: 3, year: state.year + 1 }]);
  });

  it("preserves league state and advances the year when changing jobs", () => {
    const career = createCareer("Job Audit", "KC", 25);
    career.season.year = 2036;
    career.season.phase = "fired";
    career.season.grade = { letter: "F", score: 35, round: "missed", champ: false, wins: 3, losses: 14, pf: 200, pa: 400, headline: "Fired", best: "None", worst: "Record" };
    const markerId = career.season.teams.BUF.roster[0].id;
    const hired = takeJob(career, "BUF");
    expect(hired.season.year).toBe(2037);
    expect(hired.season.teamId).toBe("BUF");
    expect(hired.season.teams.BUF.roster.some((player) => player.id === markerId)).toBe(true);
    expect(hired.season.staffStep).toBe(0);
    expect(hired.season.phase).toBe("intro");
  });

  it("migrates an older deadlocked camp save without losing the original", () => {
    const season = createSeason({ teamId: "KC", gmName: "Migration Audit", seed: 26, mode: "career" });
    season.phase = "camp";
    season.teams.KC.roster = season.teams.KC.roster.filter((player) => player.pos !== "QB").slice(0, 9);
    delete season.restructuredIds;
    delete season.faPool;
    const profile = { ...freshProfile(), active: "season" as const, season };
    const migrated = migrateProfile(profile);
    if (!migrated.season) throw new Error("Migration removed the active season");

    expect(profile.season?.teams.KC.roster).toHaveLength(9);
    expect(migrated.season.restructuredIds).toEqual([]);
    expect(migrated.season.faPool).toEqual([]);
    expect(migrated.season.teams.KC.roster).toHaveLength(22);
    expect(migrated.season.teams.KC.roster.some((player) => player.pos === "QB")).toBe(true);
    expect(migrated.season.campCutIds).toEqual(suggestedCuts(migrated.season));
  });
});
