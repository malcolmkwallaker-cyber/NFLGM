"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { advanceCareer, createCareer, retireCareer, takeJob, withJobOffers } from "@/lib/engine/career";
import { advanceDailyProgress, challengeForDate, optionById } from "@/lib/engine/daily";
import { applyAction, createSeason } from "@/lib/engine/season";
import { freshProfile, loadProfile, saveProfile } from "@/lib/storage";
import type { Action, DailyResult, Profile, SeasonState } from "@/lib/types";
import {
  createHistoricTurnaroundSeason,
  type HistoricTurnaroundScenario,
} from "@/lib/engine/historic-turnaround";
import { activateSaveSlot, startSaveWarning, type SaveSlot } from "@/lib/save-slots";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type GameContextValue = {
  ready: boolean;
  interactionLocked: boolean;
  profile: Profile;
  error: string | null;
  clearError: () => void;
  notice: (message: string) => void;
  confirmAction: (message: string, action: () => void, options?: { title?: string; confirmLabel?: string }) => void;
  update: (recipe: (profile: Profile) => Profile) => void;
  setPro: (on: boolean) => void;
  dispatch: (action: Action) => void;
  startSeason: (teamId: string, historicalId?: string, warningAccepted?: boolean) => void;
  startCareer: (teamId: string) => void;
  startTurnaround: (scenario: HistoricTurnaroundScenario, seed: number, day: string) => void;
  resumeSave: (slot: SaveSlot) => void;
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
  const [interactionLocked, setInteractionLocked] = useState(false);
  const [confirmation, setConfirmation] = useState<{ message: string; action: () => void; title?: string; confirmLabel?: string } | null>(null);
  const actionLockRef = useRef(0);

  const acquireInteractionLock = useCallback(() => {
    const now = Date.now();
    if (now < actionLockRef.current) return false;
    actionLockRef.current = now + 450;
    setInteractionLocked(true);
    window.setTimeout(() => {
      if (Date.now() >= actionLockRef.current) setInteractionLocked(false);
    }, 460);
    return true;
  }, []);

  const update = useCallback((recipe: (profile: Profile) => Profile) => {
    commitProfile(recipe(currentProfile));
  }, []);

  const notice = useCallback((message: string) => setError(message), []);
  const confirmAction = useCallback((message: string, action: () => void, options?: { title?: string; confirmLabel?: string }) => {
    setConfirmation({ message, action, ...options });
  }, []);
  const clearError = useCallback(() => setError(null), []);

  const setPro = useCallback(
    (on: boolean) => {
      update((prev) => ({ ...prev, pro: on }));
    },
    [update],
  );

  const dispatch = useCallback((action: Action) => {
    if (action.type !== "camp-selection" && !acquireInteractionLock()) return;
    setError(null);
    const season = currentSeason(currentProfile);
    if (!season) return;
    try {
      commitProfile(writeSeason(currentProfile, applyAction(season, action)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "That move did not go through.");
    }
  }, [acquireInteractionLock]);

  const startSeason = useCallback(
    (teamId: string, historicalId?: string, warningAccepted = false) => {
      const warning = startSaveWarning(currentProfile, "season", historicalId ? "this Historical Season" : "a new Single Season");
      const run = () => {
        if (!acquireInteractionLock()) return;
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
      };
      if (!warningAccepted && warning) {
        confirmAction(warning, run);
        return;
      }
      run();
    },
    [acquireInteractionLock, confirmAction, router, update],
  );

  const startCareer = useCallback(
    (teamId: string) => {
      const warning = startSaveWarning(currentProfile, "career", "a new Career");
      const run = () => {
        if (!acquireInteractionLock()) return;
        setError(null);
        update((prev) => ({ ...prev, active: "career", career: createCareer(prev.name || "GM", teamId) }));
        router.push("/play");
      };
      if (warning) {
        confirmAction(warning, run);
        return;
      }
      run();
    },
    [acquireInteractionLock, confirmAction, router, update],
  );

  const startTurnaround = useCallback(
    (scenario: HistoricTurnaroundScenario, seed: number, day: string) => {
      const warning = startSaveWarning(currentProfile, "season", "today’s Historic Turnaround");
      const run = () => {
        if (!acquireInteractionLock()) return;
        setError(null);
        update((prev) => {
          const season = createHistoricTurnaroundSeason(scenario, prev.name || "GM", seed, day);
          return { ...prev, active: "season", season };
        });
        router.push("/play");
      };
      if (warning) {
        confirmAction(warning, run);
        return;
      }
      run();
    },
    [acquireInteractionLock, confirmAction, router, update],
  );

  const resumeSave = useCallback(
    (slot: SaveSlot) => {
      if (!acquireInteractionLock()) return;
      const next = activateSaveSlot(currentProfile, slot);
      if (next === currentProfile) {
        setError(`There is no saved ${slot === "career" ? "Career" : "Single Season"} to resume.`);
        return;
      }
      setError(null);
      commitProfile(next);
      router.push("/play");
    },
    [acquireInteractionLock, router],
  );

  const advanceYear = useCallback(() => {
    if (!acquireInteractionLock()) return;
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
  }, [acquireInteractionLock]);

  const openJobOffers = useCallback(() => {
    if (!acquireInteractionLock()) return;
    update((prev) => (prev.career ? { ...prev, career: withJobOffers(prev.career) } : prev));
  }, [acquireInteractionLock, update]);

  const acceptJob = useCallback(
    (teamId: string) => {
      if (!acquireInteractionLock()) return;
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
    [acquireInteractionLock, router],
  );

  const retire = useCallback(() => {
    if (!acquireInteractionLock()) return;
    setError(null);
    if (!currentProfile.career) return;
    commitProfile({ ...currentProfile, career: retireCareer(currentProfile.career), active: "career" });
    router.push("/career");
  }, [acquireInteractionLock, router]);

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
          percentile: option.score,
          echo: option.echo,
        };
        const progress = advanceDailyProgress({
          lastPlayed: prev.daily.lastPlayed,
          streak: prev.daily.streak,
          freezeTokens: prev.daily.freezeTokens ?? 0,
          frozenDates: prev.daily.frozenDates ?? [],
          today,
          completedBefore: prev.daily.results.length,
        });
        return {
          ...prev,
          daily: {
            streak: progress.streak,
            bestStreak: Math.max(prev.daily.bestStreak, progress.streak),
            lastPlayed: today,
            freezeTokens: progress.freezeTokens,
            frozenDates: progress.frozenDates,
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
      interactionLocked,
      profile,
      error,
      clearError,
      notice,
      confirmAction,
      update,
      setPro,
      dispatch,
      startSeason,
      startCareer,
      startTurnaround,
      resumeSave,
      advanceYear,
      openJobOffers,
      acceptJob,
      retire,
      playDaily,
      season: currentSeason(profile),
    }),
    [
      ready,
      interactionLocked,
      profile,
      error,
      clearError,
      notice,
      confirmAction,
      update,
      setPro,
      dispatch,
      startSeason,
      startCareer,
      startTurnaround,
      resumeSave,
      advanceYear,
      openJobOffers,
      acceptJob,
      retire,
      playDaily,
    ],
  );

  return (
    <GameContext.Provider value={value}>
      {children}
      <Dialog open={Boolean(confirmation)} onOpenChange={(open) => { if (!open) setConfirmation(null); }}>
        <DialogContent data-testid="save-confirmation" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmation?.title ?? "Replace this saved file?"}</DialogTitle>
            <DialogDescription>{confirmation?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmation(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                const action = confirmation?.action;
                setConfirmation(null);
                action?.();
              }}
            >
              {confirmation?.confirmLabel ?? "Continue and replace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside ProfileProvider");
  return ctx;
}
