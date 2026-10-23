import type { PlayoffRound } from "@/lib/types";
import { hashSeed } from "@/lib/engine/rng";

export const HISTORIC_TURNAROUND_RULES_VERSION = "historic-turnaround-v1";
export const HISTORIC_TURNAROUND_EPOCH = Date.UTC(2026, 9, 23);

export type HistoricTurnaroundScenario = {
  id: string;
  status: "fixture" | "verified";
  season: number;
  teamId: string;
  title: string;
  setup: string;
  actualWins: number;
  actualLosses: number;
  actualGames: number;
  actualOutcome: string;
  objectiveWins: number;
  initialStateHash: string;
  verifiedAt?: string;
  sources: string[];
};

export type TurnaroundResult = {
  finalWins: number;
  finalLosses: number;
  playoffRound: PlayoffRound;
  gradeScore: number;
  ownerConfidence: number;
};

export type TurnaroundScore = {
  total: number;
  winImprovement: number;
  playoffBonus: number;
  gradeAdjustment: number;
  ownerAdjustment: number;
};

const PLAYOFF_BONUS: Record<PlayoffRound, number> = {
  missed: 0,
  wildcard: 50,
  divisional: 100,
  conference: 160,
  superbowl: 250,
  champion: 350,
};

function utcDayNumber(date: Date): number {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((utc - HISTORIC_TURNAROUND_EPOCH) / 86400000);
}

export function isPublishableHistoricScenario(scenario: HistoricTurnaroundScenario): boolean {
  return (
    scenario.status === "verified" &&
    Boolean(scenario.verifiedAt) &&
    scenario.sources.length > 0 &&
    scenario.sources.every((source) => /^https:\/\//.test(source))
  );
}

export function historicScenarioForDate(
  date: Date,
  scenarios: HistoricTurnaroundScenario[],
): { scenario: HistoricTurnaroundScenario; seed: number; challengeNumber: number } {
  const publishable = scenarios.filter(isPublishableHistoricScenario);
  if (!publishable.length) throw new Error("No verified historic turnaround scenarios are available.");
  const challengeNumber = utcDayNumber(date);
  const index = ((challengeNumber % publishable.length) + publishable.length) % publishable.length;
  const scenario = publishable[index];
  const dateKey = date.toISOString().slice(0, 10);
  return {
    scenario,
    challengeNumber,
    seed: hashSeed(HISTORIC_TURNAROUND_RULES_VERSION, scenario.id, scenario.initialStateHash, dateKey),
  };
}

export function scoreHistoricTurnaround(
  scenario: Pick<HistoricTurnaroundScenario, "actualWins" | "actualGames">,
  result: TurnaroundResult,
): TurnaroundScore {
  const simulatedGames = result.finalWins + result.finalLosses;
  const normalizedBaselineWins = (scenario.actualWins / scenario.actualGames) * simulatedGames;
  const winImprovement = Math.round((result.finalWins - normalizedBaselineWins) * 35);
  const playoffBonus = PLAYOFF_BONUS[result.playoffRound];
  const gradeAdjustment = (result.gradeScore - 60) * 2;
  const ownerAdjustment = result.ownerConfidence - 50;
  const total = Math.max(0, Math.min(1000, Math.round(400 + winImprovement + playoffBonus + gradeAdjustment + ownerAdjustment)));
  return { total, winImprovement, playoffBonus, gradeAdjustment, ownerAdjustment };
}
