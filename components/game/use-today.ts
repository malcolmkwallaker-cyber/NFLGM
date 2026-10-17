"use client";

import { useSyncExternalStore } from "react";
import { challengeForDate, utcDay } from "@/lib/engine/daily";

export type TodayPuzzle = {
  day: string;
  puzzle: number;
  challengeId: string;
};

let cached: TodayPuzzle | null = null;

function readToday(): TodayPuzzle {
  if (!cached) {
    const now = new Date();
    const { challenge, puzzle } = challengeForDate(now);
    cached = { day: utcDay(now), puzzle, challengeId: challenge.id };
  }
  return cached;
}

function subscribe() {
  return () => {};
}

export function useTodayPuzzle(): TodayPuzzle | null {
  return useSyncExternalStore(subscribe, readToday, () => null);
}
