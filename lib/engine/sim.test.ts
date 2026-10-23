import { describe, expect, it } from "vitest";
import { DAILY_CHALLENGES } from "@/lib/data/daily-challenges";
import { HISTORICAL } from "@/lib/data/historical";
import { TEAMS } from "@/lib/data/teams";
import { advanceCareer, createCareer, takeJob, withJobOffers } from "@/lib/engine/career";
import { advanceDailyProgress, challengeForDate, percentileFor, puzzleNumber } from "@/lib/engine/daily";
import { interpretFreeText } from "@/lib/engine/keywords";
import { buildSchedule } from "@/lib/engine/schedule";
import { applyAction, capSpace, createSeason, simulateUntil, standings } from "@/lib/engine/season";
import { writeWikipedia } from "@/lib/engine/wikipedia";
import { dailyShareText, parseShare } from "@/lib/share";
import { formatMoney } from "@/lib/format";

describe("daily challenge", () => {
  it("has at least 100 substantive challenges with one best answer", () => {
    expect(DAILY_CHALLENGES.length).toBeGreaterThanOrEqual(100);
    expect(new Set(DAILY_CHALLENGES.map((challenge) => challenge.id)).size).toBe(DAILY_CHALLENGES.length);
    expect(new Set(DAILY_CHALLENGES.map((challenge) => challenge.title)).size).toBe(DAILY_CHALLENGES.length);
    for (const challenge of DAILY_CHALLENGES) {
      expect(challenge.options).toHaveLength(4);
      expect(challenge.options.filter((o) => o.grade === "green")).toHaveLength(1);
      const pop = challenge.options.reduce((sum, o) => sum + o.popularity, 0);
      expect(pop).toBeGreaterThan(0.97);
      expect(pop).toBeLessThan(1.03);
      expect(challenge.options.some((o) => o.id === challenge.actualOptionId)).toBe(true);
      expect(percentileFor(challenge, challenge.options[0].id)).toBeGreaterThanOrEqual(0);
      expect(percentileFor(challenge, challenge.options[0].id)).toBeLessThanOrEqual(100);
      expect(challenge.situation.length).toBeGreaterThan(100);
    }
  });

  it("keeps the Daily bank labels honest", () => {
    expect(DAILY_CHALLENGES.filter((challenge) => !challenge.fictional)).toHaveLength(33);
    expect(DAILY_CHALLENGES.filter((challenge) => challenge.fictional)).toHaveLength(68);
    expect(DAILY_CHALLENGES.filter((challenge) => challenge.fictional).every((challenge) => challenge.situation.includes("original fictional scenario"))).toBe(true);
  });

  it("gives every player the same challenge on a date", () => {
    const a = challengeForDate(new Date("2026-10-16T15:00:00Z"));
    const b = challengeForDate(new Date("2026-10-16T23:30:00Z"));
    expect(a.challenge.id).toBe(b.challenge.id);
    expect(a.puzzle).toBe(puzzleNumber(new Date("2026-10-16T00:00:00Z")));
  });

  it("preserves the released 33-item calendar before expanding the rotation", () => {
    const legacyDate = new Date("2026-10-23T12:00:00Z");
    const legacyIndex = ((puzzleNumber(legacyDate) % 33) + 33) % 33;
    expect(challengeForDate(legacyDate).challenge.id).toBe(DAILY_CHALLENGES[legacyIndex]?.id);
    expect(challengeForDate(new Date("2026-10-24T12:00:00Z")).challenge.id).toBe(DAILY_CHALLENGES[33]?.id);
  });

  it("uses one earned freeze for exactly one missed day without inventing a result", () => {
    const progress = advanceDailyProgress({ lastPlayed: "2026-10-21", streak: 6, freezeTokens: 1, frozenDates: [], today: "2026-10-23", completedBefore: 6 });
    expect(progress).toEqual({ streak: 7, freezeTokens: 1, frozenDates: ["2026-10-22"] });
  });

  it("resets a streak after more than one missed day", () => {
    const progress = advanceDailyProgress({ lastPlayed: "2026-10-20", streak: 8, freezeTokens: 2, frozenDates: [], today: "2026-10-23", completedBefore: 8 });
    expect(progress.streak).toBe(1);
    expect(progress.freezeTokens).toBe(2);
    expect(progress.frozenDates).toEqual([]);
  });
});

describe("schedule", () => {
  it("plays each modern team once per week", () => {
    const ids = TEAMS.map((t) => t.id);
    const games = buildSchedule(ids, 17, 7);
    for (let week = 1; week <= 17; week++) {
      const seen = new Set<string>();
      for (const game of games.filter((g) => g.week === week)) {
        expect(seen.has(game.home)).toBe(false);
        expect(seen.has(game.away)).toBe(false);
        seen.add(game.home);
        seen.add(game.away);
      }
      expect(seen.size).toBe(32);
    }
  });
});

describe("season", () => {
  it("plays a full modern season without throwing", () => {
    const state = createSeason({ teamId: "KC", gmName: "Test GM", seed: 42 });
    const done = simulateUntil(state, "recap");
    expect(["recap", "fired"]).toContain(done.phase);
    expect(done.grade).toBeTruthy();
    const record = (done.grade?.wins ?? 0) + (done.grade?.losses ?? 0);
    expect(record).toBeGreaterThan(10);
    expect(standings(done).length).toBe(32);
  });

  it("blocks a hard-cap signing that does not fit", () => {
    let state = createSeason({ teamId: "KC", gmName: "Test GM", seed: 3 });
    state = applyAction(state, { type: "intro", choice: "embrace" });
    while (state.phase === "staff") {
      const role = (["hc", "oc", "dc", "scout"] as const)[state.staffStep] ?? "hc";
      state = applyAction(state, { type: "hire", id: state.market[role][0].id });
    }
    let guard = 0;
    while (state.phase === "cap" && guard++ < 12) {
      if (capSpace(state) < 0) {
        const big = state.teams.KC.roster.slice().sort((a, b) => b.cap - a.cap)[0];
        state = applyAction(state, { type: "cap", choice: "restructure", playerId: big?.id });
      } else {
        state = applyAction(state, { type: "cap", choice: "hold" });
      }
    }
    expect(state.phase).toBe("fa");
    const rich = state.faBoard[0];
    if (rich && rich.cap > capSpace(state)) {
      expect(() => applyAction(state, { type: "sign", playerId: rich.id })).toThrow();
    }
  });

  it("persists training-camp selections across serialization", () => {
    const state = createSeason({ teamId: "KC", gmName: "Test GM", seed: 12 });
    state.phase = "camp";
    const roster = state.teams.KC.roster;
    const selected = [roster[1].id, roster[2].id];

    const edited = applyAction(state, { type: "camp-selection", cutIds: selected });
    const reloaded = JSON.parse(JSON.stringify(edited)) as typeof edited;

    expect(reloaded.campCutIds).toEqual(selected);
    expect(state.campCutIds).toEqual([]);
  });

  it("plays the 1985 Bears through a season", () => {
    const state = createSeason({
      teamId: "CHI",
      gmName: "Test GM",
      seed: 85,
      mode: "historical",
      historicalId: "1985-bears",
    });
    expect(state.historicalTitle).toBe("1985 Bears");
    expect(state.teams.CHI.roster.some((p) => p.name === "Walter Payton")).toBe(true);
    const done = simulateUntil(state, "recap");
    expect(["recap", "fired"]).toContain(done.phase);
    expect(done.grade?.wins ?? 0).toBeGreaterThan(8);
    if (done.grade?.letter === "A+") {
      expect(done.grade.champ).toBe(true);
      expect(done.grade.wins).toBe(done.seasonLength);
    }
  });

  it("does not make undefeated the default 1985 Bears outcome", () => {
    const rows = Array.from({ length: 50 }, (_, index) => {
      const done = simulateUntil(createSeason({ teamId: "CHI", gmName: "Balance Test", seed: index + 1, mode: "historical", historicalId: "1985-bears" }), "recap");
      return done.grade;
    });
    const averageWins = rows.reduce((sum, grade) => sum + (grade?.wins ?? 0), 0) / rows.length;
    expect(averageWins).toBeLessThan(15);
    expect(rows.filter((grade) => grade?.losses === 0).length).toBeLessThanOrEqual(8);
  });
});

describe("career", () => {
  it("rolls into a second season and can change jobs", () => {
    const career = createCareer("Alex Kim", "BUF", 9);
    const done = simulateUntil(career.season, "recap");
    expect(done.phase === "recap" || done.phase === "fired").toBe(true);
    if (done.phase === "recap") {
      const next = advanceCareer({ ...career, season: done });
      expect(next.history).toHaveLength(1);
      expect(next.season.year).toBe(done.year + 1);
      expect(next.season.phase).toBe("intro");
      expect(next.season.teams.BUF.roster[0].age).toBeGreaterThan(20);
    } else {
      const offered = withJobOffers({ ...career, season: done });
      expect(offered.jobOffers.length).toBe(3);
      const hired = takeJob(offered, offered.jobOffers[0].teamId);
      expect(hired.season.teamId).toBe(offered.jobOffers[0].teamId);
      expect(hired.fired).toBe(1);
    }
    const page = writeWikipedia({ ...career, season: done, history: [{ year: 2027, teamId: "BUF", teamName: "Buffalo Bills", wins: 11, losses: 6, round: "divisional", champ: false, fired: false, grade: "B", gradeScore: 74, legacy: 20, headline: "A real year." }] });
    expect(page).toContain("Alex Kim");
  });

  it("preserves a three-season history and writes a complete retirement retrospective", () => {
    let career = createCareer("Morgan Lee", "BUF", 90);
    for (let year = 0; year < 3; year += 1) {
      career.season.phase = "recap";
      career.season.grade = { letter: "B+", score: 80, round: year === 2 ? "conference" : "divisional", champ: false, wins: 10 + year, losses: 7 - year, pf: 400, pa: 330, headline: `Season ${year + 1}`, best: "Draft", worst: "Cap" };
      career = advanceCareer(career);
    }
    expect(career.history.map((season) => season.year)).toEqual([2027, 2028, 2029]);
    expect(career.season.year).toBe(2030);
    const retrospective = writeWikipedia(career);
    expect(retrospective).toContain("3 seasons");
    expect(retrospective).toContain("2029");
    expect(retrospective).toContain("Morgan Lee");
  });
});

describe("text and shares", () => {
  it("reads a free-text plan without a model", () => {
    expect(interpretFreeText("I want to build through the draft and develop youth")?.path).toBe("youth");
    expect(interpretFreeText("hello there friend")?.path).toBeUndefined();
  });

  it("round-trips a daily share card", () => {
    const text = ["NFL GM CAREER", "Daily #1", "🟩", "", "NFLGM1|D|2026-10-16|eli-2004|trade|green|81|4"].join("\n");
    const entry = parseShare(text, "Sam");
    expect(entry?.kind).toBe("daily");
    expect(entry?.score).toBe(81);
    expect(entry?.name).toBe("Sam");
  });

  it("shares a streak without inventing a global rank", () => {
    const text = dailyShareText({ puzzle: 8, category: "Draft", grade: "green", streak: 4, date: "2026-10-23", challengeId: "test", optionId: "pick" });
    expect(text).toContain("RUN THE ROSTER");
    expect(text).toContain("🔥 4");
    expect(text).toContain("runtheroster.com");
    expect(text).not.toContain("rank");
    expect(text).not.toContain("better than");
    expect(text).toContain("RTR1|D|");
    expect(text).not.toContain("NFLGM1|D|");
    expect(parseShare(text, "Taylor")?.score).toBe(100);
  });

  it("formats negative cap space with the sign before the currency symbol", () => {
    expect(formatMoney(-9.7)).toBe("−$9.7M");
    expect(formatMoney(9.7)).toBe("$9.7M");
  });
});

describe("historical catalog", () => {
  it("includes the famous buildings", () => {
    const ids = HISTORICAL.map((h) => h.id);
    expect(ids).toContain("1985-bears");
    expect(ids).toContain("1993-cowboys");
    expect(ids).toContain("2013-seahawks");
    for (const pack of HISTORICAL) {
      expect(pack.teams.some((t) => t.id === pack.teamId && (t.roster?.length ?? 0) > 15)).toBe(true);
      expect(pack.teams.find((team) => team.id === "RAM")?.abbr).not.toBe("RAM");
      expect(pack.teams.find((team) => team.id === "LARD")?.abbr).not.toBe("LARD");
    }
  });
});
