import { describe, expect, it } from "vitest";
import {
  historicScenarioForDate,
  isPublishableHistoricScenario,
  scoreHistoricTurnaround,
  type HistoricTurnaroundScenario,
} from "@/lib/engine/historic-turnaround";
import { HISTORIC_TURNAROUNDS } from "@/lib/data/historic-turnarounds";
import { applyAction, createSeason, simulateUntil } from "@/lib/engine/season";

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
    const first = createSeason({ teamId: scenario.teamId, gmName: "Replay GM", seed });
    const replay = createSeason({ teamId: scenario.teamId, gmName: "Replay GM", seed });
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
