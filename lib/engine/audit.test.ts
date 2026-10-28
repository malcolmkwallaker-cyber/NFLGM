import { describe, expect, it } from "vitest";
import { advanceCareer, createCareer, retireCareer, takeJob, withJobOffers } from "@/lib/engine/career";
import { applyAction, campCutDeadMoney, capSpace, createSeason, ensureMinimumRoster, ownerGameChange, payroll, playerTradeValue, rolloverSeason, seasonDrivers, simulateUntil, suggestedCuts, suggestAction, tradeFairness, tradeImpactPreview, tradeIncomingName, tradeValueLabel, yourRoster } from "@/lib/engine/season";
import type { Phase, SeasonState, TradeOffer } from "@/lib/types";
import { freshProfile, migrateProfile } from "@/lib/storage";
import { FREE_TESTING_MODE, hasFullAccess } from "@/lib/access";
import { gmSubject, normalizeGmName, titledGmName } from "@/lib/gm-name";
import { capHealth, committedPayroll, marketAgeFactor, marketAsk, salaryScale } from "@/lib/engine/cap";
import { effectiveOvr } from "@/lib/engine/ratings";
import { resultHeadlines } from "@/lib/engine/headlines";
import { makeRng } from "@/lib/engine/rng";
import { seasonShareText } from "@/lib/share";

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

  it("gives a freshly re-signed player meaningful camp protection without breaking position minimums", () => {
    const state = createSeason({ teamId: "NYG", gmName: "New Deal Cut Audit", seed: 1226 });
    const roster = state.teams.NYG.roster;
    const protectedReceiver = roster.filter((player) => player.pos === "WR").sort((a, b) => a.ovr - b.ovr)[0];
    if (!protectedReceiver) throw new Error("Receiver fixture missing");
    protectedReceiver.ovr = 64;
    state.flags[`signed:${protectedReceiver.id}`] = state.year;
    while (roster.length < 33) roster.push({ id: `camp-depth-${roster.length}`, name: `Camp Depth ${roster.length}`, pos: roster.length % 2 ? "WR" : "TE", ovr: 66, age: 24, cap: 1, years: 2, potential: 68, real: false });
    const cuts = new Set(suggestedCuts(state));
    const kept = roster.filter((player) => !cuts.has(player.id));
    expect(cuts.has(protectedReceiver.id)).toBe(false);
    expect(kept.filter((player) => player.pos === "WR").length).toBeGreaterThanOrEqual(3);
    expect(kept.filter((player) => player.pos === "K")).toHaveLength(1);
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

  it("explains the owner effect of a restructure in the decision headline", () => {
    let state = advanceTo(createSeason({ teamId: "KC", gmName: "Restructure Copy", seed: 1221 }), "cap");
    const player = yourRoster(state).filter((candidate) => candidate.years > 0).sort((a, b) => b.cap - a.cap)[0];
    if (!player) throw new Error("No active contract fixture");
    const before = state.meters.owner;
    state = applyAction(state, { type: "cap", choice: "restructure", playerId: player.id });
    expect(state.headlines.find((headline) => headline.outlet === "analytics")?.text).toContain(`Owner confidence ${before}`);
    expect(state.headlines.find((headline) => headline.outlet === "analytics")?.text).toContain(String(state.meters.owner));
  });

  it("shows the exact weekly owner-confidence change and its components", () => {
    let state = advanceTo(createSeason({ teamId: "PHI", gmName: "Weekly Owner Audit", seed: 1936146732 }), "regular");
    if (state.activeDecision) {
      state = applyAction(state, { type: "decide", choiceId: state.activeDecision.options[0]?.id ?? "" });
    }
    const before = state.meters.owner;
    state = applyAction(state, { type: "play-week" });
    const analytics = state.headlines.find((headline) => headline.outlet === "analytics")?.text ?? "";
    expect(analytics).toContain(`owner confidence ${before} → ${state.meters.owner}`);
    expect(analytics).toMatch(/win|loss|quarterly unused-cap review|close result|decisive result/);
    expect(state.log.at(-1)).toContain(`Owner confidence ${before} → ${state.meters.owner}`);
  });

  it("explains requested meter gains that are reduced by the confidence ceiling", () => {
    let decision = createSeason({ teamId: "SEA", gmName: "Ceiling Audit", seed: 1027 });
    decision.meters.owner = 96;
    decision = applyAction(decision, { type: "intro", choice: "embrace" });
    expect(decision.headlines.find((headline) => headline.outlet === "analytics")?.text)
      .toContain("Owner confidence 96 → 96 (0 applied; +8 requested, capped at 96)");

    let cappedWeek: SeasonState | null = null;
    for (let seed = 1; seed <= 20 && !cappedWeek; seed += 1) {
      let state = advanceTo(createSeason({ teamId: "KC", gmName: "Weekly Ceiling Audit", seed }), "regular");
      if (state.activeDecision) state = applyAction(state, { type: "decide", choiceId: state.activeDecision.options[0].id });
      state.meters.owner = 96;
      state = applyAction(state, { type: "play-week" });
      const analytics = state.headlines.find((headline) => headline.outlet === "analytics")?.text ?? "";
      if (analytics.includes("win +1")) cappedWeek = state;
    }
    expect(cappedWeek).not.toBeNull();
    expect(cappedWeek?.headlines.find((headline) => headline.outlet === "analytics")?.text)
      .toContain("win +1; 0 applied; +1 requested, capped at 96");
    expect(cappedWeek?.log.at(-1)).toContain("0 applied; +1 requested, capped at 96");
  });

  it("asks for explicit acceptance after listening to contract-year trade calls", () => {
    let state = advanceTo(createSeason({ teamId: "DAL", gmName: "Listen Audit", seed: 1227 }), "regular");
    for (let guard = 0; guard < 20 && state.activeDecision?.id !== "extension"; guard += 1) {
      if (state.activeDecision) state = applyAction(state, { type: "decide", choiceId: state.activeDecision.options[0]?.id ?? "wait" });
      else state = applyAction(state, { type: "play-week" });
    }
    expect(state.activeDecision?.id).toBe("extension");
    const shopChoice = state.activeDecision?.options.find((choice) => choice.id === "shop");
    const playerId = shopChoice?.tag?.slice("shopstar:".length);
    if (!playerId) throw new Error("Contract-year trade fixture missing");
    const before = yourRoster(state).map((player) => player.id);
    state = applyAction(state, { type: "decide", choiceId: "shop" });
    expect(state.shop?.wantId).toBe(playerId);
    expect(yourRoster(state).map((player) => player.id)).toEqual(before);
    expect(() => applyAction(state, { type: "play-week" })).toThrow("Review the trade offer");
    const kept = applyAction(state, { type: "shop-resolve", accept: false });
    expect(kept.shop).toBeNull();
    expect(yourRoster(kept).map((player) => player.id)).toEqual(before);

    const accepted = applyAction(state, { type: "shop-resolve", accept: true });
    expect(yourRoster(accepted).some((player) => player.id === playerId)).toBe(false);
    expect(accepted.extraPicks.some((pick) => pick.year === state.year + 1 && pick.round === state.shop?.pickRound && pick.source?.includes("Trade with"))).toBe(true);
  });

  it("keeps acquired picks through their draft and logs late-round staff selections", () => {
    let state = advanceTo(createSeason({ teamId: "LV", gmName: "Pick Ownership Audit", seed: 1228 }), "trade");
    state.extraPicks.push(
      { year: state.year, round: 2, source: "Trade with TB" },
      { year: state.year, round: 4, source: "Trade with TB" },
    );
    state.tradeOffers = [];
    state = applyAction(state, { type: "trade-done" });
    expect(state.draftPicks.some((pick) => pick.round === 2 && pick.teamId === "LV" && pick.note?.includes("Trade with TB"))).toBe(true);
    state = advanceTo(state, "camp");
    expect(state.draftPicks.some((pick) => pick.round === 4 && pick.teamId === "LV" && pick.note?.includes("Acquired · Trade with TB"))).toBe(true);
    expect(state.extraPicks.some((pick) => pick.year === state.year)).toBe(false);
  });

  it("moves to the exact displayed draft slot and never offers a last-pick trade down", () => {
    let state = advanceTo(createSeason({ teamId: "NYJ", gmName: "Draft Slot Audit", seed: 1229 }), "draft");
    state.pendingDraftTrade = null;
    const pick = state.draftPicks[state.draftCursor];
    const target = state.draftPicks.find((candidate) => candidate.round === pick.round && candidate.overall > pick.overall && candidate.teamId !== state.teamId);
    if (!target) throw new Error("Later pick fixture missing");
    const targetOwner = target.teamId;
    state.pendingDraftTrade = { offer: "Exact slot", from: targetOwner, fromTeamId: targetOwner, slotsBack: target.overall - pick.overall, targetOverall: target.overall };
    const moved = applyAction(state, { type: "draft-trade", accept: true });
    expect(moved.draftPicks.find((candidate) => candidate.overall === target.overall)?.teamId).toBe("NYJ");
    expect(moved.decisions.at(-1)?.log).toContain(`pick ${pick.overall} to pick ${target.overall}`);

    state = advanceTo(createSeason({ teamId: "NYJ", gmName: "Last Pick Audit", seed: 1230 }), "draft");
    const lastRoundOne = state.draftPicks.filter((candidate) => candidate.round === 1).at(-1);
    if (!lastRoundOne) throw new Error("Last pick fixture missing");
    state.draftPicks.forEach((candidate) => { if (candidate.teamId === "NYJ") candidate.teamId = "BUF"; });
    lastRoundOne.teamId = "NYJ";
    state.draftCursor = state.draftPicks.indexOf(lastRoundOne);
    state.pendingDraftTrade = null;
    const taken = new Set(state.draftPicks.map((candidate) => candidate.prospectId).filter(Boolean));
    const available = state.prospects.find((prospect) => prospect.perceived > 0 && !taken.has(prospect.id));
    state = applyAction(state, { type: "draft", prospectId: available?.id ?? "missing" });
    expect(state.pendingDraftTrade).toBeNull();
  });

  it("indexes only new market and rookie contracts as the cap grows", () => {
    const old = { id: "old", name: "Existing Deal", pos: "WR" as const, ovr: 84, age: 27, cap: 12, years: 2, potential: 85, real: false };
    expect(marketAsk(old, salaryScale(322))).toBeLessThan(marketAsk(old, salaryScale(644)));
    const state = createSeason({ teamId: "KC", gmName: "Salary Index Audit", seed: 1231, mode: "career" });
    const existingCharge = state.teams.KC.roster[0]?.cap;
    let future = state;
    for (let index = 0; index < 8; index += 1) future = rolloverSeason(future);
    expect(future.capLimit).toBeGreaterThan(state.capLimit * 1.4);
    expect(state.teams.KC.roster[0]?.cap).toBe(existingCharge);
    expect(salaryScale(future.capLimit)).toBeGreaterThan(1.4);
  });

  it("discounts older new-market asks while protecting elite positional value", () => {
    const base = { id: "age-price", name: "Market Player", pos: "WR" as const, ovr: 86, age: 28, cap: 18, years: 0, potential: 86, real: false };
    const ageThirtyFive = { ...base, age: 35 };
    expect(marketAsk(ageThirtyFive)).toBeLessThan(marketAsk(base));
    expect(marketAgeFactor(ageThirtyFive)).toBeGreaterThanOrEqual(0.6);
    const eliteQuarterback = { ...base, pos: "QB" as const, ovr: 92, age: 36, cap: 40 };
    expect(marketAgeFactor(eliteQuarterback)).toBeGreaterThanOrEqual(0.78);
    expect(marketAsk(eliteQuarterback)).toBeGreaterThan(marketAsk(ageThirtyFive));
  });

  it("resets seasonal strategy boosts and applies position-aware veteran decline", () => {
    const state = createSeason({ teamId: "NYJ", gmName: "Dynasty Audit", seed: 1232, mode: "career" });
    state.teamMod = 18;
    const veteran = state.teams.NYJ.roster.find((player) => player.pos === "WR");
    if (!veteran) throw new Error("Veteran receiver fixture missing");
    veteran.age = 34;
    veteran.ovr = 98;
    veteran.years = 10;
    const next = rolloverSeason(state);
    expect(next.teamMod).toBe(0);
    expect(next.teams.NYJ.roster.find((player) => player.id === veteran.id)?.ovr).toBe(95);
  });

  it("uses the prior season record for next year's base draft order", () => {
    const state = createSeason({ teamId: "NYJ", gmName: "Draft Record Audit", seed: 1233, mode: "career" });
    state.teams.NYJ.wins = 4;
    state.teams.NYJ.losses = 13;
    state.teams.KC.wins = 15;
    state.teams.KC.losses = 2;
    let next = rolloverSeason(state);
    next.phase = "trade";
    next.tradeOffers = [];
    next = applyAction(next, { type: "trade-done" });
    const jets = next.draftPicks.find((pick) => pick.round === 1 && pick.teamId === "NYJ");
    const chiefs = next.draftPicks.find((pick) => pick.round === 1 && pick.teamId === "KC");
    expect(jets?.overall).toBeLessThan(chiefs?.overall ?? 0);
  });

  it("round-trips a legacy-shaped 20-year career without repricing existing contracts", () => {
    let career = createCareer("Long Save Audit", "NYJ", 8001);
    for (let year = 1; year <= 20; year += 1) {
      career = { ...career, season: simulateUntil(career.season, "recap") };
      expect(career.season.phase).toBe("recap");
      if (year < 20) career = advanceCareer(career);
    }
    const expectedYear = career.season.year;
    const expectedCap = career.season.capLimit;
    const expectedContract = career.season.teams.NYJ.roster.find((player) => player.years > 0);
    delete career.season.restructuredIds;
    delete career.season.faPool;
    const migrated = migrateProfile(JSON.parse(JSON.stringify({ ...freshProfile(), active: "career", career })));
    expect(migrated.career?.season.year).toBe(expectedYear);
    expect(migrated.career?.history).toHaveLength(19);
    expect(migrated.career?.season.capLimit).toBe(expectedCap);
    expect(migrated.career?.season.teams.NYJ.roster.find((player) => player.id === expectedContract?.id)?.cap).toBe(expectedContract?.cap);
  }, 15_000);

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
    expect(state.faBoard).toHaveLength(6);
    const firstOutsideWave = state.faBoard.map((player) => player.id);
    const first = state.faBoard[0];
    state = applyAction(state, { type: "sign", playerId: first.id });
    state = applyAction(state, { type: "next-wave" });
    expect(state.faBoard.every((player) => !firstOutsideWave.includes(player.id))).toBe(true);
  });

  it("recommends retaining affordable core players before opening the outside market", () => {
    let state = rolloverSeason(createSeason({ teamId: "SEA", gmName: "Retention Audit", seed: 1235, mode: "career" }));
    state = advanceTo(state, "fa");
    const action = suggestAction(state);
    expect(action?.type).toBe("sign");
    if (action?.type !== "sign") throw new Error("Expected a retention signing");
    const candidate = state.faBoard.find((player) => player.id === action.playerId);
    expect(candidate?.origin).toBe("SEA");
    expect(candidate?.cap).toBeLessThanOrEqual(capSpace(state) - 3);
  });

  it("places remaining quality free agents with CPU teams after the user market closes", () => {
    let state = advanceTo(createSeason({ teamId: "NYJ", gmName: "CPU Market Audit", seed: 1234, mode: "career" }), "fa");
    const qualityIds = new Set((state.faPool ?? []).filter((player) => player.ovr >= 70).map((player) => player.id));
    state = applyAction(state, { type: "next-wave" });
    state = applyAction(state, { type: "next-wave" });
    state = applyAction(state, { type: "next-wave" });
    const placements = Object.entries(state.teams)
      .filter(([teamId]) => teamId !== state.teamId)
      .flatMap(([, team]) => team.roster)
      .filter((player) => qualityIds.has(player.id));
    expect(placements.length).toBeGreaterThan(0);
    expect(new Set(placements.map((player) => player.id)).size).toBe(placements.length);
    expect(state.faPool).toEqual([]);
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

  it("reviews unused cap quarterly instead of compounding it after every loss", () => {
    const state = createSeason({ teamId: "SEA", gmName: "Owner Ledger Audit", seed: 1236, mode: "career" });
    state.capLimit = payroll(yourRoster(state)) + state.deadMoney + 100;
    state.week = 2;
    const ordinaryLoss = ownerGameChange(state, false, -7);
    expect(ordinaryLoss.delta).toBe(-3);
    expect(ordinaryLoss.reasons).not.toContain("quarterly unused-cap review −1");
    state.week = 4;
    const reviewLoss = ownerGameChange(state, false, -7);
    expect(reviewLoss.delta).toBe(-4);
    expect(reviewLoss.reasons).toContain("quarterly unused-cap review −1");
    const blowout = ownerGameChange(state, false, -17);
    expect(blowout.delta).toBe(-5);
    expect(blowout.reasons).toContain("blowout −1");
  });

  it("rotates trade targets, callers, and prose across consecutive seasons", () => {
    const first = advanceTo(createSeason({ teamId: "SEA", gmName: "Trade Variety Audit", seed: 1237, mode: "career" }), "trade");
    const firstTargets = new Set(first.tradeOffers.map((offer) => offer.wantId));
    const firstTeams = new Set(first.tradeOffers.map((offer) => offer.fromTeamId));
    first.phase = "recap";
    first.grade = { letter: "B", score: 78, round: "missed", champ: false, wins: 9, losses: 8, pf: 340, pa: 330, headline: "Audit", best: "Draft", worst: "Loss" };
    const second = advanceTo(rolloverSeason(first), "trade");
    expect(second.tradeOffers.every((offer) => !firstTargets.has(offer.wantId))).toBe(true);
    expect(second.tradeOffers.every((offer) => !firstTeams.has(offer.fromTeamId))).toBe(true);
    expect(new Set([...first.tradeOffers, ...second.tradeOffers].map((offer) => offer.blurb.replace(/[A-Z]{2,3}/g, "TEAM"))).size).toBeGreaterThan(3);
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
  }, 15_000);

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
    const priorOwner = career.season.owner.name;
    const hired = takeJob(career, "BUF");
    expect(hired.season.year).toBe(2037);
    expect(hired.season.teamId).toBe("BUF");
    expect(hired.season.teams.BUF.roster.some((player) => player.id === markerId)).toBe(true);
    expect(hired.season.staffStep).toBe(0);
    expect(hired.season.phase).toBe("intro");
    expect(hired.season.owner.name).not.toBe(priorOwner);
    expect(hired.season.owner.note).toContain("2037");
    expect(hired.season.headlines.find((headline) => headline.outlet === "beat")?.outletName).toBe("Buffalo Ledger");
    expect(hired.season.headlines.find((headline) => headline.outlet === "analytics")?.text).toContain("Owner confidence starts at 58");
    expect(hired.season.log.join(" ")).toContain("Old-team liabilities stayed with KC");
  });

  it("keeps trade grades consistent and shows unique names across a draft class", () => {
    expect(tradeValueLabel("bargain")).toBe("Good value for you");
    expect(tradeValueLabel("fair")).toBe("Fair value for you");
    expect(tradeValueLabel("fleece")).toBe("Poor value for you");
    expect(tradeFairness(92, 100)).toBe("bargain");
    expect(tradeFairness(55, 100)).toBe("fair");
    expect(tradeFairness(54, 100)).toBe("fleece");

    const draft = advanceTo(createSeason({ teamId: "DAL", gmName: "Draft Name Audit", seed: 2601, mode: "career" }), "draft");
    const names = draft.prospects.map((prospect) => prospect.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("records the exact owner year-end review and labels a Super Bowl loss as runner-up", () => {
    let recap: SeasonState | null = null;
    for (let seed = 1; seed <= 60 && !recap; seed += 1) {
      const completed = simulateUntil(createSeason({ teamId: "DAL", gmName: "Recap Delta Audit", seed, mode: "career" }), "recap");
      if (completed.phase === "recap") recap = completed;
    }
    expect(recap).not.toBeNull();
    expect(String(recap?.flags["owner-year-end-review"])).toMatch(/Owner year-end review \d+ → \d+:/);
    expect(recap?.headlines.find((headline) => headline.outlet === "analytics")?.text).toContain("Owner year-end review");

    if (!recap?.grade) throw new Error("Recap fixture missing grade");
    recap.grade = { ...recap.grade, champ: false, round: "superbowl" };
    expect(seasonShareText(recap)).toContain("RUNNER-UP");
    expect(seasonShareText(recap)).not.toContain("SUPERBOWL");
  });

  it("keeps restructure liabilities with the old team after a fired GM changes jobs", () => {
    const career = createCareer("Cap Ownership Audit", "CAR", 2501);
    career.season.phase = "fired";
    career.season.futureDead = 8.3;
    career.season.teamCapLiabilities = {
      ...(career.season.teamCapLiabilities ?? {}),
      CAR: { deadMoney: career.season.deadMoney, futureDead: 8.3 },
    };
    career.season.grade = { letter: "F", score: 30, round: "missed", champ: false, wins: 3, losses: 14, pf: 210, pa: 420, headline: "Fired", best: "Draft", worst: "Record" };

    const hired = takeJob(career, "LV");
    expect(hired.season.teamId).toBe("LV");
    expect(hired.season.deadMoney).toBe(0);
    expect(hired.season.futureDead).toBe(0);
    expect(hired.season.teamCapLiabilities?.CAR).toEqual({ deadMoney: 8.3, futureDead: 0 });
    expect(hired.season.teamCapLiabilities?.LV).toEqual({ deadMoney: 0, futureDead: 0 });

    const reloaded = migrateProfile({ ...freshProfile(), active: "career", career: JSON.parse(JSON.stringify(hired)) });
    expect(reloaded.career?.season.deadMoney).toBe(0);
    expect(reloaded.career?.season.teamCapLiabilities?.CAR).toEqual({ deadMoney: 8.3, futureDead: 0 });
  });

  it("migrates legacy cap liabilities without assigning the old team's debt to a new job", () => {
    const career = createCareer("Legacy Cap Audit", "TB", 2502);
    career.season.phase = "fired";
    career.season.deadMoney = 4.2;
    career.season.futureDead = 18.7;
    delete career.season.teamCapLiabilities;
    career.season.grade = { letter: "F", score: 28, round: "missed", champ: false, wins: 2, losses: 15, pf: 190, pa: 440, headline: "Fired", best: "Draft", worst: "Record" };
    const migrated = migrateProfile({ ...freshProfile(), active: "career", career });
    if (!migrated.career) throw new Error("Legacy career was lost");

    const hired = takeJob(migrated.career, "CLE");
    expect(hired.season.deadMoney).toBe(0);
    expect(hired.season.teamCapLiabilities?.TB).toEqual({ deadMoney: 18.7, futureDead: 0 });
    expect(hired.season.teamCapLiabilities?.CLE).toEqual({ deadMoney: 0, futureDead: 0 });
  });

  it("charges transparent dead money for active contracts released at camp", () => {
    const state = createSeason({ teamId: "KC", gmName: "Camp Cap Audit", seed: 2503, mode: "career" });
    state.phase = "camp";
    while (yourRoster(state).length < 27) {
      const index = yourRoster(state).length;
      state.teams.KC.roster.push({ id: `camp-replacement-${index}`, name: `Camp Replacement ${index}`, pos: index % 2 ? "WR" : "LB", ovr: 60, age: 24, cap: 0.9, years: 1, potential: 62, real: false, origin: "replacement" });
    }
    const veteran = yourRoster(state).filter((player) => player.pos !== "QB" && player.cap > 1).sort((a, b) => b.cap - a.cap)[0];
    if (!veteran) throw new Error("Camp contract fixture missing");
    const cutIds = [veteran.id, ...yourRoster(state)
      .filter((player) => player.id !== veteran.id && player.pos !== "QB")
      .slice(0, Math.max(0, yourRoster(state).length - 27))
      .map((player) => player.id)];
    const before = state.deadMoney;
    const expected = campCutDeadMoney(state, cutIds);
    expect(expected).toBeGreaterThan(0);

    const regular = applyAction(state, { type: "camp", cutIds });
    expect(regular.deadMoney).toBe(Math.round((before + expected) * 10) / 10);
    expect(regular.teamCapLiabilities?.KC?.deadMoney).toBe(regular.deadMoney);
    expect(regular.decisions[0]?.log).toContain(`$${expected.toFixed(1)}M`);
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
    expect(missed?.headlines.some((headline) => headline.text.includes("missed the playoffs."))).toBe(true);
    expect(missed?.headlines.some((headline) => headline.text.includes("Your season had already ended."))).toBe(false);
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

  it("stops a player-initiated fast-forward when a new desk decision appears and preserves it on reload", () => {
    let state = advanceTo(createSeason({ teamId: "SEA", gmName: "Fast Forward Audit", seed: 1028, mode: "career" }), "regular");
    expect(state.activeDecision).toBeTruthy();
    state = applyAction(state, { type: "decide", choiceId: state.activeDecision?.options[0]?.id ?? "balanced" });
    state = applyAction(state, { type: "play-week" });
    expect(state.week).toBe(2);
    expect(state.activeDecision).toBeNull();

    const stopped = applyAction(state, { type: "sim", until: "playoffs" });
    expect(stopped.phase).toBe("regular");
    expect(stopped.week).toBe(4);
    expect(stopped.activeDecision?.id).toBe("injury");
    expect(stopped.results.filter((result) => result.round === "regular")).toHaveLength(3 * 16);

    const reloaded = migrateProfile({ ...freshProfile(), active: "season", season: JSON.parse(JSON.stringify(stopped)) });
    expect(reloaded.season?.week).toBe(4);
    expect(reloaded.season?.activeDecision?.id).toBe("injury");
    expect(simulateUntil(state, "playoffs").phase).not.toBe("regular");
  });

  it("previews exact clamped trade-meter and cap effects and hides replacement identifiers", () => {
    const state = createSeason({ teamId: "SEA", gmName: "Trade Preview Audit", seed: 2028, mode: "career" });
    const sent = yourRoster(state).find((player) => player.ovr < 85 && player.pos !== "K");
    if (!sent) throw new Error("Trade preview fixture missing");
    state.meters.owner = 96;
    const incoming = { ...sent, id: "replacement-CIN-2028-21", name: "CIN Replacement RB 21", pos: "RB" as const, cap: sent.cap + 6.6, origin: "replacement" };
    const offer: TradeOffer = {
      id: "preview-offer",
      fromTeamId: "CIN",
      wantId: sent.id,
      wantName: sent.name,
      incoming,
      pickRound: 2,
      pickYear: state.year + 1,
      blurb: "Preview fixture",
      fair: "fair",
    };
    const impact = tradeImpactPreview(state, offer);
    expect(impact.owner).toEqual({ requested: 1, applied: 0 });
    expect(impact.fans).toEqual({ requested: 0, applied: 0 });
    expect(impact.locker).toEqual({ requested: 0, applied: 0 });
    expect(impact.capRoomChange).toBe(-6.6);
    expect(tradeIncomingName(incoming)).toBe("depth RB");
  });

  it("keeps new draft names distinct from the current roster and hides true grades until camp", () => {
    const baseline = advanceTo(createSeason({ teamId: "SEA", gmName: "Draft Collision Audit", seed: 3028, mode: "career" }), "draft");
    const collision = baseline.prospects[0]?.name;
    if (!collision) throw new Error("Draft name fixture missing");

    const withCollision = createSeason({ teamId: "SEA", gmName: "Draft Collision Audit", seed: 3028, mode: "career" });
    withCollision.teams.SEA.roster.push({ id: "name-collision", name: collision, pos: "CB", ovr: 70, age: 24, cap: 1, years: 2, potential: 74, real: false });
    let draft = advanceTo(withCollision, "draft");
    expect(draft.prospects.some((prospect) => prospect.name === collision)).toBe(false);
    expect(new Set(draft.prospects.map((prospect) => prospect.name)).size).toBe(draft.prospects.length);

    if (draft.pendingDraftTrade) draft = applyAction(draft, { type: "draft-trade", accept: false });
    const action = suggestAction(draft);
    if (!action || action.type !== "draft") throw new Error("User draft pick fixture missing");
    draft = applyAction(draft, action);
    const latestLog = draft.log.at(-1) ?? "";
    const analytics = draft.headlines.find((headline) => headline.outlet === "analytics")?.text ?? "";
    expect(latestLog).toContain("full grade reveals at camp");
    expect(latestLog).not.toMatch(/truth|player is \d+/i);
    expect(analytics).not.toContain("truth");
  });
});
