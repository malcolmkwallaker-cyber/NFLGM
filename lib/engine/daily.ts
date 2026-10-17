import { DAILY_CHALLENGES } from "@/lib/data/daily-challenges";
import type { DailyChallenge, DailyOption, GradeColor } from "@/lib/types";
import { hashSeed } from "@/lib/engine/rng";

export const DAILY_EPOCH = Date.UTC(2026, 2, 11);

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
  const idx = ((puzzle % count) + count) % count;
  return { challenge: DAILY_CHALLENGES[idx] as DailyChallenge, puzzle };
}

export function optionById(challenge: DailyChallenge, optionId: string): DailyOption {
  return challenge.options.find((o) => o.id === optionId) ?? challenge.options[0];
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

export function fieldSize(date: string): number {
  return 14000 + (hashSeed(date, "field") % 28000);
}

export function rankFor(percentile: number, date: string): number {
  const field = fieldSize(date);
  return Math.max(1, Math.round(((100 - percentile) / 100) * field));
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
