import { describe, expect, it } from "vitest";
import { createCareer } from "@/lib/engine/career";
import { createSeason } from "@/lib/engine/season";
import { activateSaveSlot, startSaveWarning } from "@/lib/save-slots";
import { freshProfile } from "@/lib/storage";

describe("independent save slots", () => {
  it("resumes a legacy career without changing the separate season slot", () => {
    const profile = freshProfile("Legacy GM");
    profile.active = "season";
    profile.season = createSeason({ teamId: "DET", gmName: "Legacy GM", seed: 12 });
    profile.career = createCareer("Legacy GM", "KC", 34);
    profile.career.season.year = 2028;
    const beforeCareer = JSON.stringify(profile.career);
    const beforeSeason = JSON.stringify(profile.season);

    const resumed = activateSaveSlot(profile, "career");

    expect(resumed.active).toBe("career");
    expect(JSON.stringify(resumed.career)).toBe(beforeCareer);
    expect(JSON.stringify(resumed.season)).toBe(beforeSeason);
    expect(resumed.career?.season.teamId).toBe("KC");
    expect(resumed.career?.season.year).toBe(2028);
  });

  it("warns that turnaround replaces the season slot and only pauses an active career", () => {
    const profile = freshProfile("Protected GM");
    profile.active = "career";
    profile.career = createCareer("Protected GM", "KC", 34);
    profile.season = createSeason({ teamId: "BUF", gmName: "Protected GM", seed: 56 });

    const warning = startSaveWarning(profile, "season", "today’s Historic Turnaround");

    expect(warning).toContain("replaces your saved Single Season file (BUF 2027)");
    expect(warning).toContain("active Career will be paused, not deleted");
    expect(warning).toContain("Daily Challenge results and streak stay untouched");
  });

  it("warns before replacing a career and preserves the season slot when merely switching", () => {
    const profile = freshProfile("Two Slot GM");
    profile.active = "season";
    profile.season = createSeason({ teamId: "DET", gmName: "Two Slot GM", seed: 12 });
    profile.career = createCareer("Two Slot GM", "KC", 34);

    const warning = startSaveWarning(profile, "career", "a new Career");
    const resumed = activateSaveSlot(profile, "season");

    expect(warning).toContain("replaces your saved Career file (Two Slot GM)");
    expect(warning).toContain("Single Season will be paused, not deleted");
    expect(warning).toContain("Daily Challenge results and streak stay untouched");
    expect(resumed.season).toBe(profile.season);
    expect(resumed.career).toBe(profile.career);
  });
});
