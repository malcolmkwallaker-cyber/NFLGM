"use client";

import { DailyClient } from "@/components/game/daily-client";
import { useTodayPuzzle } from "@/components/game/use-today";

export function TodayDaily() {
  const today = useTodayPuzzle();
  if (!today) {
    return <p className="text-sm text-muted-foreground">Setting the board…</p>;
  }
  return <DailyClient day={today.day} puzzle={today.puzzle} challengeId={today.challengeId} />;
}
