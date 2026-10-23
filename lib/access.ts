import type { Profile } from "@/lib/types";

/**
 * Temporary launch control for public playtesting.
 *
 * Keep the stored `pro` entitlement intact so a later billing rollout can turn
 * this off without rewriting or invalidating existing browser saves.
 */
export const FREE_TESTING_MODE = true;

export function hasFullAccess(profile: Pick<Profile, "pro">): boolean {
  return FREE_TESTING_MODE || profile.pro;
}
