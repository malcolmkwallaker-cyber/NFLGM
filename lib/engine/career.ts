import { teamById, teamLabel } from "@/lib/data/teams";
import { teamRatings } from "@/lib/engine/ratings";
import { createSeason, rolloverSeason } from "@/lib/engine/season";
import type { CareerState, SeasonState, SeasonSummary } from "@/lib/types";
import { normalizeGmName } from "@/lib/gm-name";

export function legacyFor(summary: Pick<SeasonSummary, "wins" | "champ" | "round" | "fired" | "gradeScore">): number {
  let points = summary.wins;
  if (summary.champ) points += 30;
  else if (summary.round === "superbowl") points += 16;
  else if (summary.round === "conference") points += 10;
  else if (summary.round === "divisional") points += 6;
  else if (summary.round === "wildcard") points += 3;
  if (summary.fired) points -= 12;
  points += Math.round((summary.gradeScore - 60) / 4);
  return points;
}

export function summarize(state: SeasonState): SeasonSummary {
  const grade = state.grade;
  const summary: SeasonSummary = {
    year: state.year,
    teamId: state.teamId,
    teamName: teamLabel(teamById(state.teamId, state.directory)),
    wins: grade?.wins ?? 0,
    losses: grade?.losses ?? 0,
    round: grade?.round ?? "missed",
    champ: grade?.champ ?? false,
    fired: state.phase === "fired",
    grade: grade?.letter ?? "F",
    gradeScore: grade?.score ?? 40,
    legacy: 0,
    headline: grade?.headline ?? "The year ended.",
  };
  summary.legacy = legacyFor(summary);
  return summary;
}

export function createCareer(gmName: string, teamId: string, seed?: number): CareerState {
  const normalizedName = normalizeGmName(gmName);
  const season = createSeason({ gmName: normalizedName, teamId, seed, mode: "career" });
  return {
    id: season.id.replace("season", "career"),
    gmName: normalizedName,
    seed: season.seed,
    legacy: 0,
    jobs: 1,
    fired: 0,
    superBowls: 0,
    history: [],
    season,
    status: "active",
    wikipedia: null,
    jobOffers: [],
  };
}

export function advanceCareer(career: CareerState): CareerState {
  if (career.season.phase !== "recap") throw new Error("Finish the season before the next year");
  const summary = summarize(career.season);
  return {
    ...career,
    legacy: career.legacy + summary.legacy,
    superBowls: career.superBowls + (summary.champ ? 1 : 0),
    history: [...career.history, summary],
    season: rolloverSeason(career.season),
    jobOffers: [],
  };
}

export function withJobOffers(career: CareerState): CareerState {
  if (career.season.phase !== "fired" || career.jobOffers.length) return career;
  const ranked = Object.values(career.season.teams)
    .filter((t) => t.id !== career.season.teamId)
    .map((t) => ({ id: t.id, power: teamRatings(career.season, t.id).off + teamRatings(career.season, t.id).def }))
    .sort((a, b) => a.power - b.power)
    .slice(0, 3);
  return {
    ...career,
    jobOffers: ranked.map((t) => {
      const info = teamById(t.id, career.season.directory);
      return {
        teamId: t.id,
        teamName: teamLabel(info),
        blurb: `${info.city} is looking for someone who still answers the phone. The roster is not a shortcut.`,
      };
    }),
  };
}

export function takeJob(career: CareerState, teamId: string): CareerState {
  const summary = summarize(career.season);
  if (!career.season.teams[teamId]) throw new Error("That job is no longer available");
  const season = rolloverSeason({ ...career.season, teamId });
  season.staff = {};
  season.staffStep = 0;
  season.meters.owner = 58;
  season.log.unshift(`${career.gmName} is hired after being fired.`);
  return {
    ...career,
    jobs: career.jobs + 1,
    fired: career.fired + 1,
    legacy: career.legacy + summary.legacy,
    history: [...career.history, summary],
    season,
    jobOffers: [],
    status: "active",
  };
}

export function hofStatus(career: CareerState): string {
  if (career.superBowls >= 2 || career.legacy >= 140) return "Elite legacy";
  if (career.superBowls >= 1 || career.legacy >= 80) return "Strong legacy";
  if (career.history.length >= 1) return "Building a file";
  return "No résumé yet";
}
