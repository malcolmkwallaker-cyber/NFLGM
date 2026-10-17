"use client";

import { HomeClient } from "@/components/game/home-client";
import { useTodayPuzzle } from "@/components/game/use-today";

export function TodayHome() {
  const today = useTodayPuzzle();
  if (!today) {
    return <p className="text-sm text-muted-foreground">Opening the war room…</p>;
  }
  return <HomeClient day={today.day} puzzle={today.puzzle} challengeId={today.challengeId} />;
}
