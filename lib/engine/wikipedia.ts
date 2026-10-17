import { priorityLabel } from "@/lib/engine/season";
import { hofStatus } from "@/lib/engine/career";
import type { CareerState } from "@/lib/types";

export function writeWikipedia(career: CareerState): string {
  const years = career.history.length;
  const wins = career.history.reduce((sum, s) => sum + s.wins, 0);
  const losses = career.history.reduce((sum, s) => sum + s.losses, 0);
  const bowls = career.history.filter((s) => s.champ);
  const fired = career.history.filter((s) => s.fired);
  const best = career.history.slice().sort((a, b) => b.gradeScore - a.gradeScore)[0];
  const opener = `${career.gmName} is a former NFL general manager whose career file covers ${years} season${years === 1 ? "" : "s"} and ${career.jobs} job${career.jobs === 1 ? "" : "s"}.`;
  const record = `The teams finished ${wins}-${losses} in the regular seasons on the résumé.`;
  const titles = bowls.length
    ? `Championships: ${bowls.map((s) => `${s.year} ${s.teamName}`).join("; ")}.`
    : "No championship is listed.";
  const trouble = fired.length
    ? `The owner pulled the job ${fired.length} time${fired.length === 1 ? "" : "s"}, including ${fired.map((s) => `${s.year} ${s.teamName}`).join(", ")}.`
    : "The file does not include a firing.";
  const peak = best
    ? `The strongest grade on file is a ${best.grade} in ${best.year} with the ${best.teamName} (${best.wins}-${best.losses}, ${best.headline}).`
    : "No completed season is on file.";
  const legacy = `Legacy score ${career.legacy}. Canton status: ${hofStatus(career)}.`;
  const style = career.season.owner
    ? `The last owner on the file, ${career.season.owner.name}, wanted ${priorityLabel(career.season.owner.priority).toLowerCase()}.`
    : "";
  return [opener, record, titles, trouble, peak, legacy, style].filter(Boolean).join(" ");
}
