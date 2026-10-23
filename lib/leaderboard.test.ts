import { describe, expect, it } from "vitest";
import { freshProfile } from "@/lib/storage";
import { isLeaderboardSubmission, personalBests } from "@/lib/leaderboard";
import { HISTORIC_TURNAROUNDS } from "@/lib/data/historic-turnarounds";
import { historicScenarioForDate, scoreHistoricTurnaround } from "@/lib/engine/historic-turnaround";
import { createSeason, simulateUntil } from "@/lib/engine/season";

describe("personal leaderboard", () => {
  it("derives personal bests without changing the saved profile", () => {
    const profile = freshProfile("Test GM");
    profile.daily.results = [
      { date: "2026-10-22", puzzle: 1, challengeId: "a", optionId: "x", grade: "yellow", percentile: 61, echo: "" },
      { date: "2026-10-23", puzzle: 2, challengeId: "b", optionId: "y", grade: "green", percentile: 88, echo: "" },
    ];
    const before = JSON.stringify(profile);
    const rows = personalBests(profile);

    expect(rows).toEqual([
      expect.objectContaining({ id: "daily", score: 88, scoreLabel: "modeled benchmark percentile" }),
    ]);
    expect(JSON.stringify(profile)).toBe(before);
  });

  it("records a completed turnaround with the exact disclosed score", () => {
    const { scenario, seed } = historicScenarioForDate(new Date("2026-10-23T12:00:00Z"), HISTORIC_TURNAROUNDS);
    const season = createSeason({ teamId: scenario.teamId, gmName: "Score GM", seed });
    season.flags.turnaroundScenarioId = scenario.id;
    season.flags.turnaroundDate = "2026-10-23";
    const complete = simulateUntil(season, "recap");
    if (!complete.grade) throw new Error("Turnaround did not produce a grade");

    const profile = freshProfile("Score GM");
    profile.active = "season";
    profile.season = JSON.parse(JSON.stringify(complete));
    const expected = scoreHistoricTurnaround(scenario, {
      finalWins: complete.grade.wins,
      finalLosses: complete.grade.losses,
      playoffRound: complete.grade.round,
      gradeScore: complete.grade.score,
      ownerConfidence: complete.meters.owner,
    });

    expect(personalBests(profile)).toContainEqual({
      id: "turnaround",
      label: "Historic Turnaround",
      score: expected.total,
      detail: `${scenario.title} · ${complete.grade.wins}-${complete.grade.losses}`,
      scoreLabel: "simulated turnaround score",
    });
  });

  it("validates the versioned shared submission shape", () => {
    const valid = {
      version: 1,
      board: { kind: "historic-turnaround", challengeDate: "2026-10-23", scenarioId: "fixture", rulesVersion: "v1" },
      run: { seed: 12, score: 720, finalWins: 11, finalLosses: 6, playoffRound: "divisional", decisionsDigest: "sha256:test", completedAt: "2026-10-23T12:00:00Z" },
      player: { anonymousId: "anon-test", displayName: "Test GM" },
    };
    expect(isLeaderboardSubmission(valid)).toBe(true);
    expect(isLeaderboardSubmission({ ...valid, run: { ...valid.run, score: 1200 } })).toBe(false);
  });
});
