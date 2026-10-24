import { DAILY_CHALLENGES } from "@/lib/data/daily-challenges";
import { hashSeed } from "@/lib/engine/rng";
import type { DailyChallenge, DailyOption, GradeColor } from "@/lib/types";

export const DAILY_EPOCH = Date.UTC(2026, 2, 11);
export const DAILY_EXPANSION_DATE = "2026-10-24";
const LEGACY_CHALLENGE_COUNT = 33;

export function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function puzzleNumber(date = new Date()): number {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((utc - DAILY_EPOCH) / 86400000);
}

export function challengeForDate(date = new Date()): { challenge: DailyChallenge; puzzle: number } {
  const puzzle = puzzleNumber(date);
  const count = DAILY_CHALLENGES.length;
  const day = utcDay(date);
  const expansionPuzzle = puzzleNumber(new Date(`${DAILY_EXPANSION_DATE}T00:00:00Z`));
  const idx = day < DAILY_EXPANSION_DATE
    ? ((puzzle % LEGACY_CHALLENGE_COUNT) + LEGACY_CHALLENGE_COUNT) % LEGACY_CHALLENGE_COUNT
    : ((LEGACY_CHALLENGE_COUNT + puzzle - expansionPuzzle) % count + count) % count;
  return { challenge: DAILY_CHALLENGES[idx] as DailyChallenge, puzzle };
}

export function optionById(challenge: DailyChallenge, optionId: string): DailyOption {
  return challenge.options.find((o) => o.id === optionId) ?? challenge.options[0];
}

export function dailyOptionOrder(challenge: DailyChallenge, day: string): DailyOption[] {
  return challenge.options
    .slice()
    .sort((a, b) => hashSeed(day, challenge.id, a.id) - hashSeed(day, challenge.id, b.id));
}

export function percentileFor(challenge: DailyChallenge, optionId: string): number {
  const mine = optionById(challenge, optionId);
  const worse = challenge.options
    .filter((o) => o.score < mine.score)
    .reduce((sum, o) => sum + o.popularity, 0);
  const same = challenge.options
    .filter((o) => o.score === mine.score)
    .reduce((sum, o) => sum + o.popularity, 0);
  return Math.round((worse + same * 0.5) * 100);
}

export const GRADE_WORD: Record<GradeColor, string> = {
  green: "ELITE",
  yellow: "SOLID",
  orange: "COSTLY",
  red: "MISS",
};

export const GRADE_EMOJI: Record<GradeColor, string> = {
  green: "🟩",
  yellow: "🟨",
  orange: "🟧",
  red: "🟥",
};

export function yesterday(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

export function nextStreak(lastPlayed: string | null, streak: number, today: string): number {
  if (lastPlayed === today) return streak;
  if (lastPlayed === yesterday(today)) return streak + 1;
  return 1;
}

export function advanceDailyProgress(input: {
  lastPlayed: string | null;
  streak: number;
  freezeTokens: number;
  frozenDates: string[];
  today: string;
  completedBefore: number;
}) {
  if (input.lastPlayed === input.today) return { streak: input.streak, freezeTokens: input.freezeTokens, frozenDates: input.frozenDates };
  const prior = yesterday(input.today);
  const missed = yesterday(prior);
  const useFreeze = input.lastPlayed === missed && input.freezeTokens > 0;
  const streak = input.lastPlayed === prior || useFreeze ? input.streak + 1 : 1;
  const earned = (input.completedBefore + 1) % 7 === 0 ? 1 : 0;
  return {
    streak,
    freezeTokens: Math.min(2, input.freezeTokens - (useFreeze ? 1 : 0) + earned),
    frozenDates: useFreeze ? [...input.frozenDates, prior].slice(-30) : input.frozenDates,
  };
}
