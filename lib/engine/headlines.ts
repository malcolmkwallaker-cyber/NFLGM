import type { Headline, SeasonState } from "@/lib/types";
import { teamById, teamLabel } from "@/lib/data/teams";
import type { Rng } from "@/lib/engine/rng";

export function outletNames(state: SeasonState): { beat: string; national: string; analytics: string } {
  const team = teamById(state.teamId, state.directory);
  return {
    beat: `${team.city} Ledger`,
    national: "Prime Cut",
    analytics: "Down & Distance",
  };
}

export function makeHeadlines(
  state: SeasonState,
  tone: Headline["tone"],
  lines: { beat: string; national: string; analytics: string },
): Headline[] {
  const names = outletNames(state);
  return [
    { outlet: "beat", outletName: names.beat, text: lines.beat, tone },
    { outlet: "national", outletName: names.national, text: lines.national, tone: tone === "positive" ? "neutral" : tone },
    { outlet: "analytics", outletName: names.analytics, text: lines.analytics, tone: "neutral" },
  ];
}

export function resultHeadlines(state: SeasonState, won: boolean, score: string, opp: string, rng: Rng): Headline[] {
  const team = teamLabel(teamById(state.teamId, state.directory));
  const week = `Week ${state.week}: `;
  const withoutWeek = (line: string) => line.replace(/^Week \d+:\s*/, "");
  const previous = new Set(state.headlines.map((headline) => withoutWeek(headline.text)));
  const pickFresh = (lines: string[]) => {
    const fresh = lines.filter((line) => !previous.has(line));
    return `${week}${rng.pick(fresh.length ? fresh : lines)}`;
  };
  const beat = won
    ? pickFresh([
        `${team} take ${score} over ${opp}. The building exhaled.`,
        `${score}. ${team} looked like the roster the GM thought they were building.`,
        `${team} handle ${opp}, ${score}. Owner's box actually clapped.`,
      ])
    : pickFresh([
        `${team} fall ${score} to ${opp}. The silence on the walk back said enough.`,
        `${score}. ${opp} dictated it, and ${team} never flipped the script.`,
        `A loss to ${opp}, ${score}. This one will be on the Monday tape for the wrong reasons.`,
      ]);
  const national = won
    ? pickFresh([
        `Are the ${team} quietly a problem, or was ${opp} just soft?`,
        `${team} got the win. Let's see if they do it against someone that can tackle.`,
        `Credit where it's due: ${team} won a game they were supposed to sweat.`,
      ])
    : pickFresh([
        `${team} are who we thought they were until they prove otherwise.`,
        `That's on the GM as much as the headset. The roster lost that game.`,
        `${opp} didn't steal it. ${team} handed it over.`,
      ]);
  const analytics = won
    ? pickFresh([
        `Game script favored the ${team}. The down-to-down profile was ahead of the final score, not behind it.`,
        `${team} stayed ahead of schedule often enough to make the final margin hold.`,
        `The efficiency line backs the result: ${team} created the cleaner high-leverage snaps.`,
      ])
    : pickFresh([
        `Success rate sagged after halftime. The score flatters nobody on the ${team} sideline.`,
        `${team} spent too many downs behind schedule and never recovered the leverage.`,
        `The efficiency line matches the loss: ${team} lost too many high-leverage snaps.`,
      ]);
  return makeHeadlines(state, won ? "positive" : "negative", { beat, national, analytics });
}
