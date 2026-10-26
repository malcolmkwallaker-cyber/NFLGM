import { GRADE_EMOJI, GRADE_WORD } from "@/lib/engine/daily";
import type { DailyResult, GradeColor, LeagueEntry, SeasonState } from "@/lib/types";
import { teamById } from "@/lib/data/teams";

export function dailyShareText(input: {
  puzzle: number;
  category: string;
  grade: GradeColor;
  streak: number;
  date: string;
  challengeId: string;
  optionId: string;
}): string {
  return [
    "RUN THE ROSTER",
    `Daily #${input.puzzle} · ${input.category}`,
    GRADE_EMOJI[input.grade],
    `${GRADE_WORD[input.grade]} · ${input.streak > 0 ? `🔥 ${input.streak}` : "streak starts tomorrow"}`,
    "runtheroster.com",
    "",
    `RTR1|D|${input.date}|${input.challengeId}|${input.optionId}|${input.grade}|${input.streak}`,
  ].join("\n");
}

export function seasonShareText(state: SeasonState): string {
  const grade = state.grade;
  const abbr = teamById(state.teamId, state.directory).abbr;
  const record = `${grade?.wins ?? 0}-${grade?.losses ?? 0}`;
  const round = grade?.champ ? "CHAMP" : grade?.round === "superbowl" ? "RUNNER-UP" : (grade?.round ?? "missed").toUpperCase();
  return [
    "RUN THE ROSTER",
    `${state.year} ${abbr} · ${record}`,
    `Grade ${grade?.letter ?? "—"} · ${round}`,
    "runtheroster.com",
    "",
    `RTR1|S|${state.year}|${abbr}|${record}|${grade?.letter ?? "F"}|${round}|${grade?.score ?? 0}`,
  ].join("\n");
}

export function parseShare(text: string, name = "Friend"): LeagueEntry | null {
  const line = text
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.startsWith("RTR1|") || l.startsWith("NFLGM1|"));
  if (!line) return null;
  const parts = line.split("|");
  if (parts[0] === "RTR1" && parts[1] === "D" && parts.length >= 7) {
    const grade = parts[5];
    const score = grade === "green" ? 100 : grade === "yellow" ? 75 : grade === "orange" ? 45 : 20;
    return {
      name,
      kind: "daily",
      score,
      detail: `${grade} · ${parts[2]} · streak ${parts[6]}`,
      at: new Date().toISOString(),
    };
  }
  if (parts[1] === "D" && parts.length >= 8) {
    const percentile = Number(parts[6]);
    return {
      name,
      kind: "daily",
      score: Number.isFinite(percentile) ? percentile : 0,
      detail: `${parts[5]} · ${parts[2]} · streak ${parts[7]}`,
      at: new Date().toISOString(),
    };
  }
  if (parts[1] === "S" && parts.length >= 7) {
    const score = Number(parts[7] ?? 0);
    return {
      name,
      kind: "season",
      score: Number.isFinite(score) ? score : 0,
      detail: `${parts[3]} ${parts[4]} · ${parts[5]} · ${parts[6]}`,
      at: new Date().toISOString(),
    };
  }
  return null;
}

export function resultFromShare(text: string): DailyResult | null {
  const line = text
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.startsWith("RTR1|D|") || l.startsWith("NFLGM1|D|"));
  if (!line) return null;
  const [, , date, challengeId, optionId, grade, percentile] = line.split("|");
  if (!date || !challengeId || !optionId) return null;
  if (grade !== "green" && grade !== "yellow" && grade !== "orange" && grade !== "red") return null;
  return {
    date,
    puzzle: 0,
    challengeId,
    optionId,
    grade,
    percentile: line.startsWith("RTR1|") ? 0 : Number(percentile) || 0,
    echo: "",
  };
}
