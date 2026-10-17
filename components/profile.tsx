"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { advanceCareer, createCareer, summarize, takeJob, withJobOffers } from "@/lib/engine/career";
import { challengeForDate, nextStreak, optionById, percentileFor } from "@/lib/engine/daily";
import { applyAction, createSeason } from "@/lib/engine/season";
import { writeWikipedia } from "@/lib/engine/wikipedia";
import { freshProfile, loadProfile, saveProfile } from "@/lib/storage";
import type { Action, DailyResult, Profile, SeasonState } from "@/lib/types";

type GameContextValue = {
  ready: boolean;
  profile: Profile;
  error: string | null;
  clearError: () => void;
  notice: (message: string) => void;
  update: (recipe: (profile: Profile) => Profile) => void;
  setPro: (on: boolean) => void;
  dispatch: (action: Action) => void;
  startSeason: (teamId: string, historicalId?: string) => void;
  startCareer: (teamId: string) => void;
  advanceYear: () => void;
  openJobOffers: () => void;
  acceptJob: (teamId: string) => void;
  retire: () => void;
  playDaily: (optionId: string, day: string) => void;
  season: SeasonState | null;
};

const GameContext = createContext<GameContextValue | null>(null);

const serverProfile = freshProfile();
let currentProfile = serverProfile;
let booted = false;
const listeners = new Set<() => void>();

function bootProfile() {
  if (booted || typeof window === "undefined") return;
  currentProfile = loadProfile();
  booted = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function profileSnapshot() {
  bootProfile();
  return currentProfile;
}

function commitProfile(next: Profile) {
  currentProfile = next;
  saveProfile(next);
  listeners.forEach((listener) => listener());
}

function clientReady() {
  return true;
}

function serverReady() {
  return false;
}

function currentSeason(profile: Profile): SeasonState | null {
  if (profile.active === "career") return profile.career?.season ?? null;
  return profile.season;
}

function writeSeason(profile: Profile, season: SeasonState): Profile {
  if (profile.active === "career" && profile.career) {
    return { ...profile, career: { ...profile.career, season } };
  }
  return { ...profile, active: "season", season };
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const profile = useSyncExternalStore(subscribe, profileSnapshot, () => serverProfile);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback((recipe: (profile: Profile) => Profile) => {
    commitProfile(recipe(currentProfile));
  }, []);

  const notice = useCallback((message: string) => setError(message), []);
  const clearError = useCallback(() => setError(null), []);

  const setPro = useCallback(
    (on: boolean) => {
      update((prev) => ({ ...prev, pro: on }));
    },
    [update],
  );

  const dispatch = useCallback((action: Action) => {
    setError(null);
    const season = currentSeason(currentProfile);
    if (!season) return;
    try {
      commitProfile(writeSeason(currentProfile, applyAction(season, action)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "That move did not go through.");
    }
  }, []);

  const startSeason = useCallback(
    (teamId: string, historicalId?: string) => {
      setError(null);
      update((prev) => {
        const season = createSeason({
          teamId,
          gmName: prev.name || "GM",
          mode: historicalId ? "historical" : "season",
          historicalId,
        });
        return { ...prev, active: "season", season };
      });
      router.push("/play");
    },
    [router, update],
  );

  const startCareer = useCallback(
    (teamId: string) => {
      setError(null);
      update((prev) => ({
        ...prev,
        active: "career",
        career: createCareer(prev.name || "GM", teamId),
      }));
      router.push("/play");
    },
    [router, update],
  );

  const advanceYear = useCallback(() => {
    setError(null);
    if (!currentProfile.career) return;
    try {
      commitProfile({
        ...currentProfile,
        career: advanceCareer(currentProfile.career),
        active: "career",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The next year is not open.");
    }
  }, []);

  const openJobOffers = useCallback(() => {
    update((prev) => (prev.career ? { ...prev, career: withJobOffers(prev.career) } : prev));
  }, [update]);

  const acceptJob = useCallback(
    (teamId: string) => {
      setError(null);
      if (!currentProfile.career) return;
      try {
        commitProfile({
          ...currentProfile,
          active: "career",
          career: takeJob(currentProfile.career, teamId),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "That job fell through.");
        return;
      }
      router.push("/play");
    },
    [router],
  );

  const retire = useCallback(() => {
    update((prev) => {
      if (!prev.career) return prev;
      let career = prev.career;
      const phase = career.season.phase;
      const already = career.history.some(
        (row) => row.year === career.season.year && row.teamId === career.season.teamId,
      );
      if ((phase === "recap" || phase === "fired") && !already) {
        const summary = summarize(career.season);
        career = {
          ...career,
          legacy: career.legacy + summary.legacy,
          superBowls: career.superBowls + (summary.champ ? 1 : 0),
          fired: career.fired + (summary.fired ? 1 : 0),
          history: [...career.history, summary],
        };
      }
      const retired = { ...career, status: "retired" as const, wikipedia: "" };
      retired.wikipedia = writeWikipedia(retired);
      return { ...prev, career: retired };
    });
  }, [update]);

  const playDaily = useCallback(
    (optionId: string, day: string) => {
      setError(null);
      const today = day;
      update((prev) => {
        if (prev.daily.results.some((row) => row.date === today)) return prev;
        const { challenge, puzzle } = challengeForDate(new Date(`${today}T12:00:00Z`));
        const option = optionById(challenge, optionId);
        const result: DailyResult = {
          date: today,
          puzzle,
          challengeId: challenge.id,
          optionId,
          grade: option.grade,
          percentile: percentileFor(challenge, optionId),
          echo: option.echo,
        };
        const streak = nextStreak(prev.daily.lastPlayed, prev.daily.streak, today);
        return {
          ...prev,
          daily: {
            streak,
            bestStreak: Math.max(prev.daily.bestStreak, streak),
            lastPlayed: today,
            results: [...prev.daily.results, result].slice(-180),
          },
        };
      });
    },
    [update],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      ready,
      profile,
      error,
      clearError,
      notice,
      update,
      setPro,
      dispatch,
      startSeason,
      startCareer,
      advanceYear,
      openJobOffers,
      acceptJob,
      retire,
      playDaily,
      season: currentSeason(profile),
    }),
    [
      ready,
      profile,
      error,
      clearError,
      notice,
      update,
      setPro,
      dispatch,
      startSeason,
      startCareer,
      advanceYear,
      openJobOffers,
      acceptJob,
      retire,
      playDaily,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside ProfileProvider");
  return ctx;
}
