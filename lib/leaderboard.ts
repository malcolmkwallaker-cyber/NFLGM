import type { Profile, SeasonSummary } from "@/lib/types";
import { HISTORIC_TURNAROUNDS } from "@/lib/data/historic-turnarounds";
import { scoreHistoricTurnaround } from "@/lib/engine/historic-turnaround";

export const LEADERBOARD_CONTRACT_VERSION = 1 as const;

export type LeaderboardBoard = {
  kind: "historic-turnaround";
  challengeDate: string;
  scenarioId: string;
  rulesVersion: string;
};

export type LeaderboardSubmission = {
  version: typeof LEADERBOARD_CONTRACT_VERSION;
  board: LeaderboardBoard;
  run: {
    seed: number;
    score: number;
    finalWins: number;
    finalLosses: number;
    playoffRound: string;
    decisionsDigest: string;
    completedAt: string;
  };
  player: {
    anonymousId: string;
    displayName: string;
  };
};

export type LeaderboardEntry = {
  rank: number;
  score: number;
  displayName: string;
  finalRecord: string;
  playoffRound: string;
  submittedAt: string;
};

export type LeaderboardResponse = {
  version: typeof LEADERBOARD_CONTRACT_VERSION;
  board: LeaderboardBoard;
  entries: LeaderboardEntry[];
  playerEntry: LeaderboardEntry | null;
};

export type PersonalBest = {
  id: "daily" | "season" | "career" | "turnaround";
  label: string;
  score: number;
  detail: string;
  scoreLabel: string;
};

const DAILY_GRADE_SCORE = { green: 100, yellow: 75, orange: 45, red: 20 } as const;

function bestSeason(rows: SeasonSummary[]): SeasonSummary | null {
  return rows.slice().sort((a, b) => b.gradeScore - a.gradeScore || b.wins - a.wins)[0] ?? null;
}

export function personalBests(profile: Profile): PersonalBest[] {
  const rows: PersonalBest[] = [];
  const daily = profile.daily.results
    .slice()
    .sort((a, b) => DAILY_GRADE_SCORE[b.grade] - DAILY_GRADE_SCORE[a.grade])[0];
  if (daily) {
    rows.push({
      id: "daily",
      label: "Daily Challenge",
      score: DAILY_GRADE_SCORE[daily.grade],
      detail: `${daily.date} · puzzle ${daily.puzzle} · ${daily.grade}`,
      scoreLabel: "decision grade score",
    });
  }

  const turnaroundId = profile.season?.flags.turnaroundScenarioId;
  const turnaround = typeof turnaroundId === "string"
    ? HISTORIC_TURNAROUNDS.find((scenario) => scenario.id === turnaroundId)
    : null;
  if (profile.season?.grade && turnaround) {
    const grade = profile.season.grade;
    rows.push({
      id: "turnaround",
      label: "Historic Turnaround",
      score: scoreHistoricTurnaround(turnaround, {
        finalWins: grade.wins,
        finalLosses: grade.losses,
        playoffRound: grade.round,
        gradeScore: grade.score,
        ownerConfidence: profile.season.meters.owner,
      }).total,
      detail: `${turnaround.title} · ${grade.wins}-${grade.losses}`,
      scoreLabel: "simulated turnaround score",
    });
  } else if (profile.season?.grade) {
    const { grade } = profile.season;
    rows.push({
      id: "season",
      label: "Single Season",
      score: grade.score,
      detail: `${profile.season.year} · ${grade.wins}-${grade.losses} · grade ${grade.letter}`,
      scoreLabel: "GM grade score",
    });
  }

  const careerRows = profile.career?.history ?? [];
  const currentCareer = profile.career?.season.grade
    ? [{
        year: profile.career.season.year,
        teamId: profile.career.season.teamId,
        teamName: profile.career.season.directory.find((team) => team.id === profile.career?.season.teamId)?.name ?? profile.career.season.teamId,
        wins: profile.career.season.grade.wins,
        losses: profile.career.season.grade.losses,
        round: profile.career.season.grade.round,
        champ: profile.career.season.grade.champ,
        fired: profile.career.season.phase === "fired",
        grade: profile.career.season.grade.letter,
        gradeScore: profile.career.season.grade.score,
        legacy: 0,
        headline: profile.career.season.grade.headline,
      } satisfies SeasonSummary]
    : [];
  const career = bestSeason([...careerRows, ...currentCareer]);
  if (career) {
    rows.push({
      id: "career",
      label: "Career season",
      score: career.gradeScore,
      detail: `${career.year} · ${career.teamName} · ${career.wins}-${career.losses} · grade ${career.grade}`,
      scoreLabel: "GM grade score",
    });
  }

  return rows;
}

export function isLeaderboardSubmission(value: unknown): value is LeaderboardSubmission {
  if (!value || typeof value !== "object") return false;
  const submission = value as Partial<LeaderboardSubmission>;
  return (
    submission.version === LEADERBOARD_CONTRACT_VERSION &&
    submission.board?.kind === "historic-turnaround" &&
    /^\d{4}-\d{2}-\d{2}$/.test(submission.board.challengeDate ?? "") &&
    Boolean(submission.board.scenarioId && submission.board.rulesVersion) &&
    Number.isInteger(submission.run?.seed) &&
    Number.isInteger(submission.run?.score) &&
    (submission.run?.score ?? -1) >= 0 &&
    (submission.run?.score ?? 1001) <= 1000 &&
    Boolean(submission.run?.decisionsDigest && submission.run?.completedAt) &&
    Boolean(submission.player?.anonymousId && submission.player?.displayName)
  );
}
