"use client";

import { HomeClient } from "@/components/game/home-client";
import { HomeGuide, HomeStaticIntro } from "@/components/game/home-content";
import { useTodayPuzzle } from "@/components/game/use-today";

export function TodayHome() {
  const today = useTodayPuzzle();
  if (!today) {
    return (
      <div className="space-y-8">
        <HomeStaticIntro />
        <HomeGuide />
      </div>
    );
  }
  return <HomeClient day={today.day} puzzle={today.puzzle} challengeId={today.challengeId} />;
}
