"use client";

import { useSyncExternalStore } from "react";
import { HISTORIC_TURNAROUNDS } from "@/lib/data/historic-turnarounds";
import { historicScenarioForDate } from "@/lib/engine/historic-turnaround";

export type TodayTurnaround = ReturnType<typeof historicScenarioForDate> & { day: string };

let cached: TodayTurnaround | null = null;

function readToday(): TodayTurnaround {
  if (!cached) {
    const now = new Date();
    cached = { ...historicScenarioForDate(now, HISTORIC_TURNAROUNDS), day: now.toISOString().slice(0, 10) };
  }
  return cached;
}

function subscribe() {
  return () => {};
}

export function useTodayTurnaround(): TodayTurnaround | null {
  return useSyncExternalStore(subscribe, readToday, () => null);
}
