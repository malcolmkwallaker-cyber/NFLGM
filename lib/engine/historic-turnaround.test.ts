import { describe, expect, it } from "vitest";
import {
  createHistoricTurnaroundSeason,
  historicScenarioForDate,
  isPublishableHistoricScenario,
  scoreHistoricTurnaround,
  type HistoricTurnaroundScenario,
} from "@/lib/engine/historic-turnaround";
import { HISTORIC_TURNAROUNDS } from "@/lib/data/historic-turnarounds";
import { HISTORICAL_TURNAROUND_ROSTERS } from "@/lib/data/historical-rosters";
import { applyAction, createSeason, simulateUntil, suggestAction } from "@/lib/engine/season";

function advanceToFreeAgency(initial: ReturnType<typeof createSeason>) {
  let season = initial;
  for (let guard = 0; guard < 30 && season.phase !== "fa"; guard += 1) {
    const action = suggestAction(season);
    if (!action) throw new Error(`No action available in ${season.phase}`);
    season = applyAction(season, action);
  }
  expect(season.phase).toBe("fa");
  return season;
}

const verifiedFixture: HistoricTurnaroundScenario = {
  id: "synthetic-verified-fixture",
  status: "verified",
  season: 2000,
  teamId: "TST",
  title: "Synthetic test season",
  setup: "Test data only.",
  actualWins: 6,
  actualLosses: 10,
  actualGames: 16,
  actualOutcome: "Synthetic test outcome.",
  objectiveWins: 10,
  initialStateHash: "fixture-v1",
  verifiedAt: "2026-10-23",
  sources: ["https://example.test/source"],
};

describe("historic turnaround challenge contract", () => {
  it("labels a turnaround with its source year while retaining modern simulation rules", () => {
    const scenario = HISTORIC_TURNAROUNDS.find((item) => item.id === "det-2008");
    if (!scenario) throw new Error("Detroit fixture missing");
    const season = createHistoricTurnaroundSeason(scenario, "Test GM", 12, "2026-10-23");
    expect(season.year).toBe(2008);
    expect(season.historicalTitle).toBe("Detroit’s winless season");
    expect(season.seasonLength).toBe(17);
    expect(season.flags.turnaroundScenarioId).toBe("det-2008");
    expect(season.flags.historicalRosterScenarioId).toBe("det-2008");
    expect(season.teams.DET.roster.some((player) => player.name === "Calvin Johnson")).toBe(true);
    expect(season.teams.DET.roster.some((player) => player.name === "Jared Goff")).toBe(false);
  });

  it("gives every verified turnaround an original compact roster without modern player leakage", () => {
    expect(HISTORICAL_TURNAROUND_ROSTERS).toHaveLength(HISTORIC_TURNAROUNDS.length);
    expect(HISTORICAL_TURNAROUND_ROSTERS.find((definition) => definition.scenarioId === "det-2008")?.sourceRosterCount).toBe(52);
    const modernLeaks: Record<string, string[]> = {
      "det-2008": ["Jared Goff"],
      "cle-2017": ["Deshaun Watson", "Shedeur Sanders"],
      "cle-2019": ["Deshaun Watson", "Shedeur Sanders"],
      "tb-1976": ["Baker Mayfield"],
      "phi-2011": ["Jalen Hurts"],
      "dal-2010": ["Dak Prescott"],
      "den-2022": ["Bo Nix"],
      "hou-2013": ["C.J. Stroud"],
    };
    for (const scenario of HISTORIC_TURNAROUNDS) {
      const season = createHistoricTurnaroundSeason(scenario, "Roster Audit", 91, "2026-10-24");
      const roster = season.teams[scenario.teamId].roster;
      expect(roster.length).toBeGreaterThanOrEqual(19);
      expect(new Set(roster.map((player) => player.id)).size).toBe(roster.length);
      expect(new Set(roster.map((player) => player.name)).size).toBe(roster.length);
      expect(roster.every((player) => player.real && !(modernLeaks[scenario.id] ?? []).includes(player.name))).toBe(true);
      expect(Object.entries(season.teams).filter(([teamId]) => teamId !== scenario.teamId).every(([, team]) => team.roster.length === 0 && Boolean(team.lockOff) && Boolean(team.lockDef))).toBe(true);
      expect((JSON.parse(JSON.stringify(season)) as typeof season).teams[scenario.teamId].roster).toEqual(roster);
    }
  });

  it("provides deterministic fictional outside markets without leaking modern players into historical modes", () => {
    const cle = HISTORIC_TURNAROUNDS.find((item) => item.id === "cle-2019");
    if (!cle) throw new Error("Cleveland fixture missing");
    const starts = [
      createSeason({ teamId: "NE", gmName: "Historical Market", seed: 2007, mode: "historical", historicalId: "2007-patriots" }),
      createHistoricTurnaroundSeason(cle, "Turnaround Market", 2455793462, "2026-10-25"),
    ];
    for (const initial of starts) {
      let season = advanceToFreeAgency(initial);
      expect(season.owner.note).toContain(String(season.year));
      season = applyAction(season, { type: "next-wave" });
      const firstWave = season.faBoard;
      expect(firstWave).toHaveLength(6);
      expect(firstWave.every((player) => !player.real && player.origin === "modeled-historical-market")).toBe(true);
      const reloaded = JSON.parse(JSON.stringify(season)) as typeof season;
      expect(reloaded.faBoard).toEqual(firstWave);
      season = applyAction(reloaded, { type: "next-wave" });
      expect(season.faBoard).toHaveLength(6);
      expect(season.faBoard.every((player) => !firstWave.some((first) => first.id === player.id))).toBe(true);
    }
  });

  it("makes the historical deadline gate and its meter effects explicit", () => {
    let season = createSeason({ teamId: "NE", gmName: "Deadline Audit", seed: 2007, mode: "historical", historicalId: "2007-patriots" });
    for (let guard = 0; guard < 160; guard += 1) {
      if (season.phase === "regular" && season.activeDecision?.id === "deadline") break;
      const action = suggestAction(season);
      if (!action) throw new Error(`No action available in ${season.phase}`);
      season = applyAction(season, action);
    }
    expect(season.phase).toBe("regular");
    expect(season.activeDecision?.id).toBe("deadline");
    expect(season.activeDecision?.body).toMatch(/good value|fair value|poor value/);
    expect(season.activeDecision?.options.every((option) => option.detail.includes("Owner"))).toBe(true);
    const tradeOption = season.activeDecision?.options.find((option) => option.id === "deal");
    expect(tradeOption?.detail).toMatch(/because the .* brief/);
    expect(tradeOption?.detail).toMatch(/Trade chart: (Good|Fair|Poor) value for you/);
    const before = season.meters.owner;
    season = applyAction(season, { type: "decide", choiceId: "keep" });
    const analytics = season.headlines.find((headline) => headline.outlet === "analytics")?.text ?? "";
    expect(analytics).toContain(`Owner ${before} → ${season.meters.owner}`);
  });

  it("offers historical teams a genuine range of trade values instead of grading every call Poor", () => {
    const grades = new Set<string>();
    for (let seed = 1; seed <= 12; seed += 1) {
      let season = createSeason({ teamId: "SEA", gmName: "Trade Distribution", seed, mode: "historical", historicalId: "2013-seahawks" });
      for (let guard = 0; guard < 40 && season.phase !== "trade"; guard += 1) {
        const action = suggestAction(season);
        if (!action) throw new Error(`No action available in ${season.phase}`);
        season = applyAction(season, action);
      }
      expect(season.phase).toBe("trade");
      for (const offer of season.tradeOffers) grades.add(offer.fair);
    }
    expect(grades.has("fleece")).toBe(true);
    expect(grades.has("fair") || grades.has("bargain")).toBe(true);
  });

  it("uses the same trade chart for a player the GM shops", () => {
    let season = createSeason({ teamId: "SEA", gmName: "Shop Audit", seed: 2013, mode: "historical", historicalId: "2013-seahawks" });
    for (let guard = 0; guard < 40 && season.phase !== "trade"; guard += 1) {
      const action = suggestAction(season);
      if (!action) throw new Error(`No action available in ${season.phase}`);
      season = applyAction(season, action);
    }
    const tate = season.teams.SEA.roster.find((player) => player.name === "Golden Tate");
    if (!tate) throw new Error("Golden Tate fixture missing");
    season = applyAction(season, { type: "shop", playerId: tate.id });
    expect(season.shop?.pickRound).toBe(1);
    expect(season.shop?.fair).toBe("fair");
    expect(season.shop?.blurb).toContain("fair value for you");
    season = applyAction(season, { type: "shop-resolve", accept: false });
    expect(season.shop).toBeNull();
    expect(season.shopUsed).toBe(true);
  });
  it("publishes only sourced season records with explicit game targets", () => {
    expect(HISTORIC_TURNAROUNDS).toHaveLength(8);
    for (const scenario of HISTORIC_TURNAROUNDS) {
      expect(isPublishableHistoricScenario(scenario)).toBe(true);
      expect(scenario.actualWins + scenario.actualLosses).toBe(scenario.actualGames);
      expect(scenario.objectiveWins).toBeGreaterThan(scenario.actualWins);
    }
  });

  it("gives all players the same scenario and seed on a UTC date", () => {
    const morning = historicScenarioForDate(new Date("2026-10-23T01:00:00Z"), [verifiedFixture]);
    const evening = historicScenarioForDate(new Date("2026-10-23T23:59:00Z"), [verifiedFixture]);
    expect(morning.scenario.id).toBe(evening.scenario.id);
    expect(morning.seed).toBe(evening.seed);
  });

  it("rotates through every verified scenario before repeating", () => {
    const ids = Array.from({ length: HISTORIC_TURNAROUNDS.length }, (_, day) =>
      historicScenarioForDate(new Date(Date.UTC(2026, 9, 23 + day)), HISTORIC_TURNAROUNDS).scenario.id,
    );
    expect(new Set(ids).size).toBe(HISTORIC_TURNAROUNDS.length);
  });

  it("replays and resumes the same seeded simulation deterministically", () => {
    const { scenario, seed } = historicScenarioForDate(new Date("2026-10-23T12:00:00Z"), HISTORIC_TURNAROUNDS);
    const first = createHistoricTurnaroundSeason(scenario, "Replay GM", seed, "2026-10-23");
    const replay = createHistoricTurnaroundSeason(scenario, "Replay GM", seed, "2026-10-23");
    expect(replay).toEqual(first);

    const progressed = applyAction(first, { type: "intro", choice: "embrace" });
    const resumed = JSON.parse(JSON.stringify(progressed)) as typeof progressed;
    const directResult = simulateUntil(progressed, "recap");
    const resumedResult = simulateUntil(resumed, "recap");
    expect({ phase: resumedResult.phase, grade: resumedResult.grade, results: resumedResult.results }).toEqual({
      phase: directResult.phase,
      grade: directResult.grade,
      results: directResult.results,
    });
  });

  it("refuses provisional or unsourced scenarios", () => {
    expect(isPublishableHistoricScenario({ ...verifiedFixture, status: "fixture" })).toBe(false);
    expect(isPublishableHistoricScenario({ ...verifiedFixture, sources: [] })).toBe(false);
    expect(() => historicScenarioForDate(new Date("2026-10-23T12:00:00Z"), [{ ...verifiedFixture, status: "fixture" }])).toThrow(
      "No verified historic turnaround scenarios are available.",
    );
  });

  it("uses the disclosed score formula and never compares a simulation to live players", () => {
    expect(
      scoreHistoricTurnaround(verifiedFixture, {
        finalWins: 10,
        finalLosses: 7,
        playoffRound: "divisional",
        gradeScore: 80,
        ownerConfidence: 70,
      }),
    ).toEqual({ total: 687, winImprovement: 127, playoffBonus: 100, gradeAdjustment: 40, ownerAdjustment: 20 });
  });
});
