import type { Profile } from "@/lib/types";
import { ensureMinimumRoster, suggestedCuts } from "@/lib/engine/season";
import { normalizeGmName } from "@/lib/gm-name";

export const STORAGE_KEY = "nfl-gm-career-v1";

export function freshProfile(name = "GM"): Profile {
  return {
    version: 1,
    name: normalizeGmName(name),
    pro: false,
    email: "",
    settings: { experimentalNarrative: false, testerMode: false },
    daily: { streak: 0, bestStreak: 0, lastPlayed: null, freezeTokens: 0, frozenDates: [], results: [] },
    active: null,
    season: null,
    career: null,
    leagues: [],
  };
}

export function loadProfile(): Profile {
  if (typeof window === "undefined") return freshProfile();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshProfile();
    const parsed = JSON.parse(raw) as Profile;
    if (parsed.version !== 1) return freshProfile();
    return migrateProfile({ ...freshProfile(), ...parsed, daily: { ...freshProfile().daily, ...parsed.daily } });
  } catch {
    return freshProfile();
  }
}

export function migrateProfile(profile: Profile): Profile {
  const next = structuredClone(profile);
  next.name = normalizeGmName(next.name);
  if (next.season) next.season.gmName = normalizeGmName(next.season.gmName || next.name);
  if (next.career) {
    next.career.gmName = normalizeGmName(next.career.gmName || next.name);
    next.career.season.gmName = normalizeGmName(next.career.season.gmName || next.career.gmName);
  }
  next.settings = { ...freshProfile().settings, ...next.settings };
  next.daily.freezeTokens ??= 0;
  next.daily.frozenDates ??= [];
  const seasons = [next.season, next.career?.season].filter((season) => season !== null && season !== undefined);
  for (const season of seasons) {
    season.restructuredIds ??= [];
    season.franchiseTagUsed ??= false;
    season.faPool ??= [];
    if (season.phase !== "camp") continue;
    const addedToUser = ensureMinimumRoster(season, season.teamId);
    for (const teamId of Object.keys(season.teams)) {
      if (teamId !== season.teamId) ensureMinimumRoster(season, teamId);
    }
    if (addedToUser.length) season.campCutIds = suggestedCuts(season);
  }
  return next;
}

export function saveProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
