import type { Profile } from "@/lib/types";

export type SaveSlot = "season" | "career";

export function activateSaveSlot(profile: Profile, slot: SaveSlot): Profile {
  if (slot === "career" && !profile.career) return profile;
  if (slot === "season" && !profile.season) return profile;
  return { ...profile, active: slot };
}

export function startSaveWarning(profile: Profile, slot: SaveSlot, modeName: string): string | null {
  const warnings: string[] = [];
  if (slot === "season") {
    if (profile.season) {
      warnings.push(
        `Starting ${modeName} replaces your saved Single Season file (${profile.season.teamId} ${profile.season.year}).`,
      );
    }
    if (profile.active === "career" && profile.career?.status === "active") {
      warnings.push("Your active Career will be paused, not deleted, and remains available from Career GM.");
    }
  } else {
    if (profile.career) {
      warnings.push(`Starting ${modeName} replaces your saved Career file (${profile.career.gmName}).`);
    }
    if (profile.active === "season" && profile.season) {
      warnings.push("Your Single Season will be paused, not deleted, and remains available from Season Mode.");
    }
  }
  return warnings.length
    ? `${warnings.join(" ")} Your Daily Challenge results and streak stay untouched. Continue?`
    : null;
}
