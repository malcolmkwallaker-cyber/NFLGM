import type { Profile } from "@/lib/types";

export const STORAGE_KEY = "nfl-gm-career-v1";

export function freshProfile(name = "GM"): Profile {
  return {
    version: 1,
    name,
    pro: false,
    email: "",
    settings: { experimentalNarrative: false },
    daily: { streak: 0, bestStreak: 0, lastPlayed: null, results: [] },
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
    return { ...freshProfile(), ...parsed, daily: { ...freshProfile().daily, ...parsed.daily } };
  } catch {
    return freshProfile();
  }
}

export function saveProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
