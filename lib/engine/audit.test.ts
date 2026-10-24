import { describe, expect, it } from "vitest";
import { advanceCareer, createCareer, retireCareer, takeJob, withJobOffers } from "@/lib/engine/career";
import { applyAction, capSpace, createSeason, ensureMinimumRoster, payroll, playerTradeValue, rolloverSeason, seasonDrivers, simulateUntil, suggestedCuts, suggestAction, yourRoster } from "@/lib/engine/season";
import type { Phase, SeasonState } from "@/lib/types";
import { freshProfile, migrateProfile } from "@/lib/storage";
import { FREE_TESTING_MODE, hasFullAccess } from "@/lib/access";
import { gmSubject, normalizeGmName, titledGmName } from "@/lib/gm-name";
import { capHealth, committedPayroll, marketAsk } from "@/lib/engine/cap";
import { effectiveOvr } from "@/lib/engine/ratings";
import { resultHeadlines } from "@/lib/engine/headlines";
import { makeRng } from "@/lib/engine/rng";

function advanceTo(state: SeasonState, phase: Phase): SeasonState {
  let current = state;
  for (let guard = 0; guard < 300 && current.phase !== phase; guard += 1) {
    const action = suggestAction(current);
    if (!action) throw new Error(`No action while advancing from ${current.phase} to ${phase}`);
    current = applyAction(current, action);
  }
  expect(current.phase).toBe(phase);
  return current;
}

describe("audit regressions", () => {
  it("opens public testing for anonymous and existing free saves without changing entitlement data", () => {
    const anonymous = freshProfile();
    expect(FREE_TESTING_MODE).toBe(true);
    expect(anonymous.pro).toBe(false);
    expect(hasFullAccess(anonymous)).toBe(true);

    const savedCareer = createCareer("Existing Save", "KC", 27);
    savedCareer.season.phase = "recap";
    savedCareer.season.grade = { letter: "B", score: 76, round: "divisional", champ: false, wins: 11, losses: 6, pf: 390, pa: 330, headline: "Kept the job", best: "Draft", worst: "Deadline" };
    const existing = migrateProfile(JSON.parse(JSON.stringify({ ...anonymous, active: "career", career: savedCareer })));

    expect(existing.pro).toBe(false);
    expect(hasFullAccess(existing)).toBe(true);
    if (!existing.career) throw new Error("Existing career save was lost");
    const yearTwo = advanceCareer(existing.career);
    expect(yearTwo.history).toHaveLength(1);
    expect(yearTwo.season.year).toBe(savedCareer.season.year + 1);
    expect(yearTwo.season.phase).toBe("intro");
  });

  it("lets an existing free career accept a fired-GM job in the next year", () => {
    const savedCareer = createCareer("Fired Save", "KC", 28);
    savedCareer.season.year = 2031;
    savedCareer.season.phase = "fired";
    savedCareer.season.grade = { letter: "F", score: 34, round: "missed", champ: false, wins: 3, losses: 14, pf: 220, pa: 430, headline: "Fired", best: "Draft", worst: "Record" };
    const existing = migrateProfile(JSON.parse(JSON.stringify({ ...freshProfile(), active: "career", career: savedCareer })));

    expect(hasFullAccess(existing)).toBe(true);
    if (!existing.career) throw new Error("Existing fired career save was lost");
    const offered = withJobOffers(existing.career);
    expect(offered.jobOffers).toHaveLength(3);
    const hired = takeJob(offered, offered.jobOffers[0].teamId);
    expect(hired.season.year).toBe(2032);
    expect(hired.season.phase).toBe("intro");
    expect(hired.fired).toBe(1);
    expect(hired.jobs).toBe(2);
  });

  it("round-trips and resumes from every reachable gameplay phase", () => {
    const seen = new Set<Phase>();
    let last = createSeason({ teamId: "KC", gmName: "Save Audit", seed: 1, mode: "career" });

    for (let seed = 1; seed <= 12 && !seen.has("playoffs"); seed += 1) {
      let state = createSeason({ teamId: "KC", gmName: "Save Audit", seed, mode: "career" });
      for (let guard = 0; guard < 300 && state.phase !== "recap" && state.phase !== "fired"; guard += 1) {
        seen.add(state.phase);
        state = JSON.parse(JSON.stringify(state)) as SeasonState;
        const action = suggestAction(state);
        if (!action) throw new Error(`No action in ${state.phase}`);
        state = applyAction(state, action);
      }
      seen.add(state.phase);
      last = state;
    }

    const fired = JSON.parse(JSON.stringify({ ...last, phase: "fired" })) as SeasonState;
    seen.add(fired.phase);

    expect([...seen].sort()).toEqual(
      (["camp", "cap", "draft", "fa", "fired", "intro", "playoffs", "recap", "regular", "staff", "trade"] satisfies Phase[]).sort(),
    );
  });

  it("records deterministic user player statistics without inventing legacy-game lines", () => {
    const first = simulateUntil(createSeason({ teamId: "KC", gmName: "Stats Audit", seed: 301 }), "recap");
    const replay = simulateUntil(createSeason({ teamId: "KC", gmName: "Stats Audit", seed: 301 }), "recap");
    expect(first.playerStats).toEqual(replay.playerStats);
    expect(Object.keys(first.playerStats ?? {}).length).toBeGreaterThan(0);
    const mahomes = first.teams.KC.roster.find((player) => player.name === "Patrick Mahomes");
    expect(mahomes && first.playerStats?.[mahomes.id]?.passYards).toBeGreaterThan(0);
    const userPoints = first.results.reduce((total, result) => total + (result.home === "KC" ? result.homeScore : result.away === "KC" ? result.awayScore : 0), 0);
    const statLines = Object.values(first.playerStats ?? {});
    expect(statLines.reduce((total, stats) => total + stats.points, 0)).toBe(userPoints);
    expect(statLines.reduce((total, stats) => total + stats.passYards, 0)).toBe(statLines.reduce((total, stats) => total + stats.receivingYards, 0));

    const legacy = advanceTo(createSeason({ teamId: "KC", gmName: "Legacy Stats", seed: 302 }), "regular");
    delete legacy.playerStats;
    delete legacy.statsTrackingStartedWeek;
    legacy.results.push({ week: 0, round: "legacy", home: "KC", away: "BUF", homeScore: 20, awayScore: 17 });
    const resumed = simulateUntil(legacy, "recap");
    expect(resumed.results.some((result) => result.round === "legacy")).toBe(true);
    expect(resumed.statsTrackingStartedWeek).toBeGreaterThanOrEqual(1);
  });

  it("rejects repeated phase submissions without changing accepted state", () => {
    const intro = createSeason({ teamId: "KC", gmName: "Double Click", seed: 12 });
    const staff = applyAction(intro, { type: "intro", choice: "embrace" });
    const snapshot = JSON.stringify(staff);

    expect(() => applyAction(staff, { type: "intro", choice: "embrace" })).toThrow("No owner meeting");
    expect(JSON.stringify(staff)).toBe(snapshot);

    let camp = advanceTo(staff, "camp");
    const cuts = suggestedCuts(camp);
    camp = applyAction(camp, { type: "camp", cutIds: cuts });
    const regularSnapshot = JSON.stringify(camp);

    expect(() => applyAction(camp, { type: "camp", cutIds: cuts })).toThrow("Camp cuts are done");
    expect(JSON.stringify(camp)).toBe(regularSnapshot);
  });

  it("removes the outgoing player and moves the incoming player and pick exactly once", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "Trade Audit", seed: 7 }), "trade");
    const offer = state.tradeOffers.find((candidate) => candidate.incoming && candidate.pickRound);
    expect(offer).toBeTruthy();
    if (!offer?.incoming || !offer.pickRound || !offer.pickYear) return;

    const outgoing = offer.wantId;
    const incoming = offer.incoming.id;
    const source = offer.fromTeamId;
    state = applyAction(state, { type: "trade", offerId: offer.id, accept: true });

    expect(yourRoster(state).some((player) => player.id === outgoing)).toBe(false);
    expect(state.teams[source].roster.filter((player) => player.id === outgoing)).toHaveLength(1);
    expect(yourRoster(state).filter((player) => player.id === incoming)).toHaveLength(1);
    expect(state.teams[source].roster.some((player) => player.id === incoming)).toBe(false);
    expect(state.extraPicks.filter((pick) => pick.round === offer.pickRound && pick.year === offer.pickYear)).toHaveLength(1);
    expect(() => applyAction(state, { type: "trade", offerId: offer.id, accept: true })).toThrow("That offer expired");
  });

  it("assigns every CPU draft choice to the team that made the pick", () => {
    const state = advanceTo(createSeason({ teamId: "KC", gmName: "Draft Audit", seed: 18 }), "camp");
    expect(state.campCutIds).toEqual([]);
    expect(yourRoster(state).length).toBeGreaterThan(26);
    for (const pick of state.draftPicks) {
      expect(pick.prospectId).toBeTruthy();
      expect(state.teams[pick.teamId].roster.filter((player) => player.id === `draft-${pick.prospectId}`)).toHaveLength(1);
    }
    const laterRounds = state.draftPicks.filter((pick) => pick.teamId === state.teamId && pick.round >= 4);
    expect(laterRounds.map((pick) => pick.round)).toEqual([4, 5, 6, 7]);
    expect(laterRounds.every((pick) => pick.note === "Staff auto-pick")).toBe(true);
  });

  it("never offers a trade with an empty return", () => {
    const state = advanceTo(createSeason({ teamId: "KC", gmName: "Return Audit", seed: 222 }), "trade");
    expect(state.tradeOffers.length).toBeGreaterThan(0);
    expect(state.tradeOffers.every((offer) => Boolean(offer.incoming || offer.pickRound))).toBe(true);
  });

  it("values age, position, contract control, and protects young franchise quarterbacks in trade calls", () => {
    const base = createSeason({ teamId: "NYG", gmName: "Trade Value Audit", seed: 225 });
    const winston = base.teams.NYG.roster.find((player) => player.name === "Jameis Winston");
    const maye = base.teams.NE.roster.find((player) => player.name === "Drake Maye");
    if (!winston || !maye) throw new Error("Quarterback trade fixtures missing");
    expect(playerTradeValue(maye)).toBeGreaterThan(playerTradeValue(winston) * 2);

    for (let seed = 1; seed <= 40; seed += 1) {
      const state = advanceTo(createSeason({ teamId: "NYG", gmName: "Trade Guard", seed }), "trade");
      for (const offer of state.tradeOffers) {
        const outgoing = state.teams.NYG.roster.find((player) => player.id === offer.wantId);
        if (!outgoing || !offer.incoming) continue;
        const protectedYoungQuarterback = offer.incoming.pos === "QB" && offer.incoming.age <= 27 && offer.incoming.ovr >= 82;
        if (protectedYoungQuarterback) {
          expect(outgoing.pos).toBe("QB");
          expect(outgoing.age).toBeLessThanOrEqual(27);
          expect(outgoing.ovr).toBeGreaterThanOrEqual(offer.incoming.ovr - 2);
        }
      }
    }
  });

  it("normalizes blank and already-titled GM names without duplicate labels", () => {
    expect(normalizeGmName("   ")).toBe("GM");
    expect(titledGmName("GM")).toBe("GM");
    expect(titledGmName("GM Morgan")).toBe("GM Morgan");
    expect(titledGmName("Morgan")).toBe("GM Morgan");
    expect(gmSubject(" ")).toBe("The GM");
    const migrated = migrateProfile({ ...freshProfile(), name: " ", season: createSeason({ teamId: "KC", gmName: " ", seed: 223 }) });
    expect(migrated.name).toBe("GM");
    expect(migrated.season?.gmName).toBe("GM");
  });

  it("explains weak quarterback and unused-cap season signals", () => {
    const state = createSeason({ teamId: "KC", gmName: "Driver Audit", seed: 224 });
    state.teams.KC.roster = state.teams.KC.roster.filter((player) => player.pos !== "QB");
    state.teams.KC.roster.push({ id: "audit-qb", name: "Camp QB", pos: "QB", ovr: 62, age: 25, cap: 1, years: 1, potential: 64, real: false });
    state.results = Array.from({ length: 17 }, (_, index) => ({ week: index + 1, home: "KC", away: "BUF", homeScore: index < 5 ? 21 : 10, awayScore: 24, played: true, round: "regular" as const }));
    const drivers = seasonDrivers(state);
    expect(drivers.some((line) => line.includes("top remaining QB at 62"))).toBe(true);
    expect(drivers.some((line) => line.includes("Cap use:"))).toBe(true);
  });

  it("fires a GM when owner confidence reaches the visible threshold", () => {
    const state = createSeason({ teamId: "KC", gmName: "Hot Seat Audit", seed: 219 });
    state.phase = "regular";
    state.meters.owner = 21;
    state.activeDecision = {
      id: "hot-seat-test",
      kicker: "Owner",
      title: "Final warning",
      body: "Test decision.",
      options: [{ id: "fail", label: "Lose confidence", detail: "Test.", owner: -1, log: "Lost the owner.", swing: -1 }],
    };
    const fired = applyAction(state, { type: "decide", choiceId: "fail" });
    expect(fired.phase).toBe("fired");
    expect(fired.meters.owner).toBe(20);
  });

  it("restores a minimum viable roster and quarterback without duplicates", () => {
    const state = createSeason({ teamId: "KC", gmName: "Roster Audit", seed: 21, mode: "career" });
    state.teams.KC.roster = state.teams.KC.roster.filter((player) => player.pos !== "QB").slice(0, 9);
    const first = ensureMinimumRoster(state, "KC");
    const second = ensureMinimumRoster(state, "KC");
    expect(first.length).toBeGreaterThan(0);
    expect(second).toHaveLength(0);
    expect(state.teams.KC.roster).toHaveLength(22);
    expect(state.teams.KC.roster.some((player) => player.pos === "QB")).toBe(true);
    expect(new Set(state.teams.KC.roster.map((player) => player.id)).size).toBe(22);
  });

  it("suggests balanced cuts instead of keeping redundant specialists over receivers", () => {
    const state = createSeason({ teamId: "NYG", gmName: "Cut Balance", seed: 226 });
    const roster = state.teams.NYG.roster;
    roster.filter((player) => player.pos === "WR").forEach((player) => { player.ovr = 61; });
    roster.push(
      { id: "extra-k", name: "Second Kicker", pos: "K", ovr: 92, age: 25, cap: 1, years: 2, potential: 92, real: false },
      { id: "extra-te-a", name: "Extra Tight End A", pos: "TE", ovr: 90, age: 25, cap: 2, years: 2, potential: 90, real: false },
      { id: "extra-te-b", name: "Extra Tight End B", pos: "TE", ovr: 89, age: 25, cap: 2, years: 2, potential: 89, real: false },
    );
    while (roster.length < 32) roster.push({ id: `depth-wr-${roster.length}`, name: `Depth Receiver ${roster.length}`, pos: "WR", ovr: 60, age: 24, cap: 1, years: 2, potential: 64, real: false });
    const cuts = new Set(suggestedCuts(state));
    const kept = roster.filter((player) => !cuts.has(player.id));
    expect(kept).toHaveLength(26);
    expect(kept.filter((player) => player.pos === "K")).toHaveLength(1);
    expect(kept.filter((player) => player.pos === "WR").length).toBeGreaterThanOrEqual(3);
    expect(kept.some((player) => player.pos === "QB")).toBe(true);
  });

  it("allows only one restructure per player per season", () => {
    const state = createSeason({ teamId: "KC", gmName: "Contract Audit", seed: 22 });
    state.phase = "cap";
    const player = state.teams.KC.roster.filter((candidate) => candidate.years > 0).sort((a, b) => b.cap - a.cap)[0];
    const once = applyAction(state, { type: "cap", choice: "restructure", playerId: player.id });
    const snapshot = JSON.stringify(once);
    expect(() => applyAction(once, { type: "cap", choice: "restructure", playerId: player.id })).toThrow("already restructured");
    expect(JSON.stringify(once)).toBe(snapshot);
    const next = rolloverSeason(once);
    expect(next.restructuredIds).toEqual([]);
  });

  it("does not restructure an expired contract before the retention window", () => {
    const state = createSeason({ teamId: "KC", gmName: "Expired Contract Audit", seed: 220 });
    state.phase = "cap";
    const mahomes = state.teams.KC.roster.find((player) => player.name === "Patrick Mahomes");
    if (!mahomes) throw new Error("Patrick Mahomes fixture missing");
    mahomes.years = 0;
    const snapshot = JSON.stringify(state);
    expect(() => applyAction(state, { type: "cap", choice: "restructure", playerId: mahomes.id })).toThrow("Expired contracts");
    expect(JSON.stringify(state)).toBe(snapshot);
  });

  it("does not start the projected 2027 Kansas City roster with Mahomes expiring", () => {
    const state = createSeason({ teamId: "KC", gmName: "Roster Data Audit", seed: 221 });
    const mahomes = state.teams.KC.roster.find((player) => player.name === "Patrick Mahomes");
    expect(mahomes?.years).toBeGreaterThan(0);
  });

  it("uses a stable free-agent pool across waves", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "FA Audit", seed: 23 }), "fa");
    expect(state.faPool?.length).toBeGreaterThanOrEqual(8);
    expect((state.faPool ?? []).every((player) => !player.origin || !state.teams[player.origin]?.roster.some((candidate) => candidate.id === player.id))).toBe(true);
    state.capMode = "payroll";
    state = applyAction(state, { type: "next-wave" });
    const firstOutsideWave = state.faBoard.map((player) => player.id);
    const first = state.faBoard[0];
    state = applyAction(state, { type: "sign", playerId: first.id });
    state = applyAction(state, { type: "next-wave" });
    expect(state.faBoard.every((player) => !firstOutsideWave.includes(player.id))).toBe(true);
  });

  it("makes elite outside free agents scarce and charges a market premium", () => {
    let allThreeAvailable = 0;
    for (let seed = 1; seed <= 50; seed += 1) {
      let state = rolloverSeason(createSeason({ teamId: "NYG", gmName: "Scarcity Audit", seed, mode: "career" }));
      state = advanceTo(state, "fa");
      const eliteNames = new Set((state.faPool ?? []).filter((player) => ["Lamar Jackson", "Fred Warner", "Derrick Henry"].includes(player.name)).map((player) => player.name));
      if (eliteNames.size === 3) allThreeAvailable += 1;
      for (const player of state.faPool ?? []) {
        if (player.ovr >= 90) expect(player.cap).toBeGreaterThanOrEqual(marketAsk({ ...player, cap: 0.9 }) * 1.1);
      }
    }
    expect(allThreeAvailable).toBe(0);
  });

  it("keeps owner changes bounded and makes poor roster management a firing risk", () => {
    let state = advanceTo(createSeason({ teamId: "NYG", gmName: "Meter Audit", seed: 227 }), "regular");
    while (state.phase === "regular" && state.week < 9) {
      const action = suggestAction(state);
      if (!action) throw new Error("No regular-season action");
      state = applyAction(state, action);
    }
    expect(state.activeDecision?.id).toBe("owner-check");
    state.meters.owner = 80;
    const afterPatience = applyAction(state, { type: "decide", choiceId: "patience" });
    expect(afterPatience.meters.owner).toBeLessThanOrEqual(81);

    const bad = createSeason({ teamId: "NYG", gmName: "Hot Seat Season", seed: 228, mode: "career" });
    bad.phase = "regular";
    bad.activeDecision = null;
    bad.week = 17;
    bad.meters.owner = 22;
    bad.teams.NYG.roster = bad.teams.NYG.roster.filter((player) => player.pos !== "QB");
    bad.capLimit = payroll(bad.teams.NYG.roster) + bad.deadMoney + 30;
    bad.teamMod = -30;
    for (const [teamId, team] of Object.entries(bad.teams)) {
      if (teamId === "NYG") continue;
      team.lockOff = 99;
      team.lockDef = 99;
    }
    const finished = applyAction(bad, { type: "play-week" });
    expect(["fired", "playoffs", "recap"]).toContain(finished.phase);
    expect(finished.meters.owner).toBeLessThan(22);
  });

  it("varies score lines across seeded seasons without breaking deterministic replay", () => {
    const seasons = Array.from({ length: 24 }, (_, index) => simulateUntil(createSeason({ teamId: "NYG", gmName: "Score Audit", seed: index + 400 }), "recap"));
    const distinctCounts = seasons.map((season) => {
      const scoreLines = season.results
        .filter((result) => result.round === "regular" && (result.home === "NYG" || result.away === "NYG"))
        .map((result) => `${result.homeScore}-${result.awayScore}`);
      return new Set(scoreLines).size;
    });
    expect(distinctCounts.reduce((sum, count) => sum + count, 0) / distinctCounts.length).toBeGreaterThan(10);
    const replayA = simulateUntil(createSeason({ teamId: "NYG", gmName: "Score Replay", seed: 499 }), "recap");
    const replayB = simulateUntil(createSeason({ teamId: "NYG", gmName: "Score Replay", seed: 499 }), "recap");
    expect(replayB.results).toEqual(replayA.results);
  });

  it("retires once, includes the completed year, and writes clean Super Bowl and A+ copy", () => {
    const career = createCareer("Retire Audit", "NYG", 229);
    career.season.phase = "recap";
    career.season.grade = { letter: "A+", score: 96, round: "superbowl", champ: false, wins: 17, losses: 0, pf: 500, pa: 210, headline: "Out in the Super Bowl.", best: "Draft", worst: "Final" };
    const retired = retireCareer(career);
    const repeated = retireCareer(retired);
    expect(retired.status).toBe("retired");
    expect(retired.history).toHaveLength(1);
    expect(retired.wikipedia).toContain("an A+");
    expect(retired.wikipedia).toContain("Super Bowl");
    expect(retired.wikipedia).not.toContain(".).");
    expect(repeated).toEqual(retired);
  });

  it("writes a year-aware owner brief and avoids owner/staff surname collisions", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const career = createCareer("Brief Audit", "NYG", seed);
      const ownerSurname = career.season.owner.name.split(" ").at(-1);
      const staffSurnames = Object.values(career.season.market).flat().map((member) => member.name.split(" ").at(-1));
      expect(staffSurnames).not.toContain(ownerSurname);
    }
    const career = createCareer("Brief Audit", "NYG", 230);
    const firstBrief = career.season.owner.note;
    career.season.phase = "recap";
    career.season.grade = { letter: "B", score: 75, round: "divisional", champ: false, wins: 11, losses: 6, pf: 400, pa: 330, headline: "Divisional finish", best: "Draft", worst: "Cap" };
    const next = advanceCareer(career);
    expect(next.season.owner.note).not.toBe(firstBrief);
    expect(next.season.owner.note).toContain("2028");
    expect(next.season.owner.note).toContain("11-6");
  });

  it("offers expiring stars before the outside market and supports one franchise tag", () => {
    let state = createSeason({ teamId: "KC", gmName: "Retention Audit", seed: 230 });
    const star = state.teams.KC.roster.find((player) => player.name === "Patrick Mahomes");
    expect(star).toBeTruthy();
    if (!star) throw new Error("Patrick Mahomes is missing from the Kansas City roster fixture");
    star.years = 0;
    state = advanceTo(state, "fa");

    expect(state.faWave).toBe(1);
    expect(state.faBoard.some((player) => player.id === star.id)).toBe(true);
    state.capMode = "payroll";
    state = applyAction(state, { type: "tag", playerId: star.id });
    expect(state.teams.KC.roster.find((player) => player.id === star.id)?.years).toBe(1);
    expect(state.franchiseTagUsed).toBe(true);
    expect(() => applyAction(state, { type: "tag", playerId: state.faBoard[0]?.id ?? "missing" })).toThrow();
  });

  it("excludes expired prior contracts from room and preserves that room when unsigned players walk", () => {
    let state = createSeason({ teamId: "NYJ", gmName: "Retention Cap Audit", seed: 1, mode: "career" });
    const roster = yourRoster(state);
    const expiredCharges = payroll(roster.filter((player) => player.years <= 0));
    expect(expiredCharges).toBeGreaterThan(70);
    expect(capSpace(state)).toBeCloseTo(state.capLimit - committedPayroll(roster) - state.deadMoney, 5);
    expect(capSpace(state)).toBeGreaterThan(60);
    const expired = roster.find((player) => player.name === "Garrett Wilson");
    if (!expired) throw new Error("Garrett Wilson fixture missing");
    state.phase = "cap";
    expect(() => applyAction(state, { type: "cap", choice: "cut", playerId: expired.id })).toThrow("no active contract");

    state = applyAction(state, { type: "cap", choice: "hold" });
    expect(state.futureDead).toBe(0);
    const offer = state.faBoard.find((player) => player.name === "Garrett Wilson");
    if (!offer) throw new Error("Garrett Wilson retention offer missing");
    expect(offer.cap).toBeLessThanOrEqual(capSpace(state));
    state = applyAction(state, { type: "sign", playerId: offer.id });
    expect(yourRoster(state).find((player) => player.id === offer.id)?.years).toBeGreaterThan(0);
    const afterSigning = capSpace(state);
    state = applyAction(state, { type: "next-wave" });
    state = applyAction(state, { type: "next-wave" });
    state = applyAction(state, { type: "next-wave" });
    expect(capSpace(state)).toBe(afterSigning);
  });

  it("surfaces an affordable outside free agent when one exists", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "Budget Audit", seed: 231 }), "fa");
    state.capMode = "hard";
    state.capLimit = payroll(yourRoster(state)) + state.deadMoney + 4;
    state = applyAction(state, { type: "next-wave" });
    const affordablePool = state.faPool?.some((player) => player.cap <= 4.05);
    if (affordablePool) expect(state.faBoard.some((player) => player.cap <= capSpace(state) + 0.05)).toBe(true);
  });

  it("consumes current picks, prunes stale picks, and retains only future picks", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "Pick Audit", seed: 24 }), "trade");
    state.extraPicks = [
      { round: 1, year: state.year - 1 },
      { round: 2, year: state.year, source: "Draft-day trade with BUF" },
      { round: 3, year: state.year + 1 },
    ];
    state = applyAction(state, { type: "trade-done" });
    expect(state.draftPicks.some((pick) => pick.note === "Acquired · Draft-day trade with BUF" && pick.round === 2)).toBe(true);
    expect(state.extraPicks).toEqual([{ round: 3, year: state.year + 1 }]);
  });

  it("preserves league state and advances the year when changing jobs", () => {
    const career = createCareer("Job Audit", "KC", 25);
    career.season.year = 2036;
    career.season.phase = "fired";
    career.season.grade = { letter: "F", score: 35, round: "missed", champ: false, wins: 3, losses: 14, pf: 200, pa: 400, headline: "Fired", best: "None", worst: "Record" };
    const markerId = career.season.teams.BUF.roster[0].id;
    const hired = takeJob(career, "BUF");
    expect(hired.season.year).toBe(2037);
    expect(hired.season.teamId).toBe("BUF");
    expect(hired.season.teams.BUF.roster.some((player) => player.id === markerId)).toBe(true);
    expect(hired.season.staffStep).toBe(0);
    expect(hired.season.phase).toBe("intro");
  });

  it("migrates an older deadlocked camp save without losing the original", () => {
    const season = createSeason({ teamId: "KC", gmName: "Migration Audit", seed: 26, mode: "career" });
    season.phase = "camp";
    season.teams.KC.roster = season.teams.KC.roster.filter((player) => player.pos !== "QB").slice(0, 9);
    delete season.restructuredIds;
    delete season.faPool;
    const profile = { ...freshProfile(), active: "season" as const, season };
    const migrated = migrateProfile(profile);
    if (!migrated.season) throw new Error("Migration removed the active season");

    expect(profile.season?.teams.KC.roster).toHaveLength(9);
    expect(migrated.season.restructuredIds).toEqual([]);
    expect(migrated.season.faPool).toEqual([]);
    expect(migrated.season.teams.KC.roster).toHaveLength(22);
    expect(migrated.season.teams.KC.roster.some((player) => player.pos === "QB")).toBe(true);
    expect(migrated.season.campCutIds).toEqual(suggestedCuts(migrated.season));
  });

  it("keeps a play-through injury active at reduced effectiveness until the game resolves", () => {
    let state = advanceTo(createSeason({ teamId: "CHI", gmName: "Injury Audit", seed: 502, mode: "career" }), "regular");
    while (state.week < 4) {
      if (state.activeDecision) state = applyAction(state, { type: "decide", choiceId: state.activeDecision.options[0]?.id ?? "balanced" });
      else state = applyAction(state, { type: "play-week" });
    }
    expect(state.activeDecision?.id).toBe("injury");
    const play = state.activeDecision?.options.find((option) => option.id === "play");
    const playerId = play?.tag?.slice("playhurt:".length);
    if (!playerId) throw new Error("Play-through injury fixture missing");
    state = applyAction(state, { type: "decide", choiceId: "play" });
    const limited = yourRoster(state).find((player) => player.id === playerId);
    expect(limited?.injured).not.toBe(true);
    expect(limited?.limited).toBe(true);
    expect(limited && effectiveOvr(limited)).toBeLessThan(limited?.ovr ?? 0);

    state = JSON.parse(JSON.stringify(state)) as SeasonState;
    state = applyAction(state, { type: "play-week" });
    const resolved = yourRoster(state).find((player) => player.id === playerId);
    expect(resolved?.limited).toBe(false);
    expect(state.log.some((line) => line.includes("reduced effectiveness"))).toBe(true);
  });

  it("explains dead-money and owner-confidence rollover without losing pushed obligations", () => {
    const state = createSeason({ teamId: "CHI", gmName: "Rollover Audit", seed: 503, mode: "career" });
    state.deadMoney = 16.5;
    state.futureDead = 9;
    state.meters.owner = 32;
    state.grade = { letter: "C", score: 62, round: "missed", champ: false, wins: 6, losses: 11, pf: 280, pa: 360, headline: "A difficult season", best: "Draft", worst: "Record" };
    const next = rolloverSeason(state);
    expect(next.deadMoney).toBe(9);
    expect(next.futureDead).toBe(0);
    expect(next.meters.owner).toBe(42);
    expect(next.log.some((line) => line.includes("$16.5M") && line.includes("$9.0M"))).toBe(true);
    expect(next.log.some((line) => line.includes("32 to 42"))).toBe(true);
    expect(capHealth(next)).toBeLessThan(100);
    expect(next.owner.note).toContain("missed the playoffs");
    expect(next.owner.note).not.toContain("a Missed");
  });

  it("identifies the league champion without implying a missed-playoff team won the trophy", () => {
    let missed: SeasonState | null = null;
    for (let seed = 1; seed <= 30 && !missed; seed += 1) {
      const completed = simulateUntil(createSeason({ teamId: "CHI", gmName: "Recap Audit", seed, mode: "career" }), "recap");
      if (completed.phase === "recap" && completed.grade?.round === "missed" && completed.playoff?.champion) missed = completed;
    }
    expect(missed).not.toBeNull();
    expect(missed?.headlines.some((headline) => headline.text.includes("Your season had already ended."))).toBe(true);
    expect(missed?.headlines.some((headline) => headline.text.includes("leave with the trophy"))).toBe(false);
  });

  it("does not repeat substantive result headlines in consecutive weeks after save reload", () => {
    const state = createSeason({ teamId: "CHI", gmName: "Headline Audit", seed: 504, mode: "career" });
    state.week = 4;
    const first = resultHeadlines(state, true, "21-10", "GB", makeRng(77));
    const reloaded = JSON.parse(JSON.stringify({ ...state, week: 5, headlines: first })) as SeasonState;
    const second = resultHeadlines(reloaded, true, "21-10", "GB", makeRng(77));
    const stripWeek = (line: string) => line.replace(/^Week \d+:\s*/, "");

    expect(first.every((headline) => headline.text.startsWith("Week 4: "))).toBe(true);
    expect(second.every((headline) => headline.text.startsWith("Week 5: "))).toBe(true);
    for (const earlier of first) {
      const later = second.find((headline) => headline.outlet === earlier.outlet);
      expect(later).toBeTruthy();
      expect(stripWeek(later?.text ?? "")).not.toBe(stripWeek(earlier.text));
    }
  });

  it("keeps modern playoff champions varied without clustering most losing scores at ten or fewer", () => {
    const seasons = Array.from({ length: 20 }, (_, index) =>
      simulateUntil(createSeason({ teamId: "NYJ", gmName: "Playoff Distribution Audit", seed: 600 + index, mode: "career" }), "recap"),
    );
    const champions = seasons.map((state) => state.playoff?.champion).filter(Boolean);
    const losingScores = seasons.map((state) => {
      const game = state.results.find((result) => result.round === "superbowl");
      if (!game) throw new Error("Completed season has no Super Bowl");
      return Math.min(game.homeScore, game.awayScore);
    });

    expect(new Set(champions).size).toBeGreaterThanOrEqual(6);
    expect(losingScores.filter((score) => score <= 10).length).toBeLessThanOrEqual(6);
    expect(losingScores.reduce((sum, score) => sum + score, 0) / losingScores.length).toBeGreaterThan(14);
  });
});
