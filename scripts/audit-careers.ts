import { advanceCareer, createCareer, takeJob, withJobOffers } from "@/lib/engine/career";
import {
  applyAction,
  capSpace,
  payroll,
  rolloverSeason,
  suggestedCuts,
  suggestAction,
  yourRoster,
} from "@/lib/engine/season";
import type { CareerState, Player, SeasonState } from "@/lib/types";

const careers = Number(process.env.AUDIT_CAREERS ?? 200);
const seasonsPerCareer = Number(process.env.AUDIT_SEASONS ?? 20);
const continuationRuns = Number(process.env.AUDIT_CONTINUATIONS ?? careers);
const serializeCareers = Number(process.env.AUDIT_SERIALIZE_CAREERS ?? 2);
const examplesPerKind = Number(process.env.AUDIT_EXAMPLES ?? 5);
const seedStart = Number(process.env.AUDIT_SEED_START ?? 1);

type Finding = {
  kind: string;
  seed: number;
  career: number;
  season: number;
  year: number;
  phase: string;
  detail: string;
};

const findings: Finding[] = [];
const findingCounts = new Map<string, number>();
const phases = new Set<string>();
let actions = 0;
let strictSeasonsCompleted = 0;
let strictCareersCompleted = 0;
let continuationSeasonsCompleted = 0;
let cpuDraftPicks = 0;
let cpuDraftPlayersAdded = 0;

const futureCareer = createCareer("Future Job Audit", "KC", 999_999);
futureCareer.season.year = 2036;
futureCareer.season.phase = "fired";
const futureOffers = withJobOffers(futureCareer);
const futureJob = futureOffers.jobOffers[0] ? takeJob(futureOffers, futureOffers.jobOffers[0].teamId) : null;

let restructureState = createCareer("Restructure Audit", "KC", 999_998).season;
restructureState.phase = "cap";
const restructurePlayer = yourRoster(restructureState).slice().sort((a, b) => b.cap - a.cap)[0];
const restructureInitial = restructurePlayer?.cap ?? 0;
if (restructurePlayer) {
  for (let index = 0; index < 10; index += 1) {
    restructureState = applyAction(restructureState, {
      type: "cap",
      choice: "restructure",
      playerId: restructurePlayer.id,
    });
  }
}
const restructured = restructurePlayer ? yourRoster(restructureState).find((player) => player.id === restructurePlayer.id) : null;

function advanceToPhase(seed: number, phase: SeasonState["phase"]): SeasonState {
  let state = createCareer(`Edge ${phase}`, "KC", seed).season;
  for (let guard = 0; guard < 100 && state.phase !== phase; guard += 1) {
    const action = suggestAction(state);
    if (!action) throw new Error(`No action while advancing edge probe from ${state.phase} to ${phase}`);
    state = applyAction(state, action);
  }
  if (state.phase !== phase) throw new Error(`Could not reach ${phase}`);
  return state;
}

let tradeProbe = advanceToPhase(999_997, "trade");
const tradeOffer = tradeProbe.tradeOffers.find((offer) => offer.incoming);
const tradedPlayerId = tradeOffer?.wantId ?? null;
if (tradeOffer) tradeProbe = applyAction(tradeProbe, { type: "trade", offerId: tradeOffer.id, accept: true });
const tradedPlayerOwners = tradedPlayerId
  ? Object.entries(tradeProbe.teams)
      .filter(([, team]) => team.roster.some((player) => player.id === tradedPlayerId))
      .map(([teamId]) => teamId)
  : [];

let freeAgencyProbe = advanceToPhase(999_996, "fa");
const initialFreeAgentPool = Object.entries(freeAgencyProbe.teams)
  .filter(([teamId]) => teamId !== freeAgencyProbe.teamId)
  .flatMap(([, team]) => team.roster.filter((player) => player.years <= 0))
  .sort((a, b) => b.ovr - a.ovr)
  .map((player) => player.id);
const firstWaveSigning = freeAgencyProbe.faBoard[0];
freeAgencyProbe.capMode = "payroll";
if (firstWaveSigning) freeAgencyProbe = applyAction(freeAgencyProbe, { type: "sign", playerId: firstWaveSigning.id });
freeAgencyProbe = applyAction(freeAgencyProbe, { type: "next-wave" });
const expectedSecondWave = initialFreeAgentPool.slice(4, 8);
const actualSecondWave = freeAgencyProbe.faBoard.map((player) => player.id);
const skippedSecondWave = expectedSecondWave.filter(
  (playerId) => playerId !== firstWaveSigning?.id && !actualSecondWave.includes(playerId),
);

let firstYearCampProbe = advanceToPhase(999_995, "cap");
while (yourRoster(firstYearCampProbe).length > 10) {
  firstYearCampProbe = applyAction(firstYearCampProbe, { type: "cap", choice: "cut" });
}
firstYearCampProbe = applyAction(firstYearCampProbe, { type: "cap", choice: "hold" });
for (let guard = 0; guard < 200 && firstYearCampProbe.phase !== "camp"; guard += 1) {
  const action = suggestAction(firstYearCampProbe);
  if (!action) break;
  firstYearCampProbe = applyAction(firstYearCampProbe, action);
}
let firstYearCampError: string | null = null;
try {
  firstYearCampProbe = applyAction(firstYearCampProbe, { type: "camp", cutIds: suggestedCuts(firstYearCampProbe) });
} catch (error) {
  firstYearCampError = error instanceof Error ? error.message : String(error);
}

function record(finding: Finding) {
  findingCounts.set(finding.kind, (findingCounts.get(finding.kind) ?? 0) + 1);
  if (findings.filter((row) => row.kind === finding.kind).length < examplesPerKind) findings.push(finding);
}

function auditState(state: SeasonState, career: number, season: number) {
  phases.add(state.phase);
  const context = { seed: state.seed, career, season, year: state.year, phase: state.phase };
  if (career < serializeCareers) {
    const roundTrip = JSON.parse(JSON.stringify(state)) as SeasonState;
    if (JSON.stringify(roundTrip) !== JSON.stringify(state)) {
      record({ ...context, kind: "serialization-mismatch", detail: "JSON round-trip changed state" });
    }
  }

  const owners = new Map<string, string>();
  for (const [teamId, team] of Object.entries(state.teams)) {
    if (team.id !== teamId) record({ ...context, kind: "team-key-mismatch", detail: `${teamId} contains ${team.id}` });
    for (const player of team.roster) {
      const previous = owners.get(player.id);
      if (previous) {
        record({ ...context, kind: "duplicate-player-id", detail: `${player.id} appears on ${previous} and ${teamId}` });
      } else {
        owners.set(player.id, teamId);
      }
      for (const [field, value] of Object.entries({ ovr: player.ovr, age: player.age, cap: player.cap, years: player.years, potential: player.potential })) {
        if (!Number.isFinite(value)) record({ ...context, kind: "non-finite-player-value", detail: `${player.id}.${field}=${value}` });
      }
      if (player.cap < 0) record({ ...context, kind: "negative-cap-charge", detail: `${player.id} cap ${player.cap}` });
      if (state.phase === "intro" && state.year > 2027 && (player.age >= 39 || player.years < 0 || player.ovr < 60)) {
        record({ ...context, kind: "retirement-rollover", detail: `${player.id}: age=${player.age}, years=${player.years}, ovr=${player.ovr}` });
      }
    }
    if (state.phase === "intro" && teamId !== state.teamId && team.roster.length < 22) {
      record({ ...context, kind: "cpu-roster-under-22", detail: `${teamId} has ${team.roster.length}` });
    }
  }

  const expectedSpace = Math.round((state.capLimit - payroll(yourRoster(state)) - state.deadMoney) * 10) / 10;
  if (capSpace(state) !== expectedSpace) {
    record({ ...context, kind: "cap-arithmetic", detail: `expected ${expectedSpace}, got ${capSpace(state)}` });
  }
  if (state.phase === "regular" || state.phase === "playoffs" || state.phase === "recap") {
    const count = yourRoster(state).length;
    if (count < 22) record({ ...context, kind: "user-roster-under-22", detail: `${count} players` });
    if (count > 26) record({ ...context, kind: "user-roster-over-26", detail: `${count} players` });
  }
  if (state.draftPicks.length) {
    const overalls = new Set<number>();
    for (const pick of state.draftPicks) {
      if (overalls.has(pick.overall)) record({ ...context, kind: "duplicate-draft-overall", detail: `overall ${pick.overall}` });
      overalls.add(pick.overall);
      if (!state.teams[pick.teamId]) record({ ...context, kind: "invalid-draft-owner", detail: `${pick.teamId} owns ${pick.overall}` });
    }
  }
  if (state.phase === "intro") {
    for (const pick of state.extraPicks) {
      if (pick.round < 1 || pick.round > 3 || pick.year < state.year) {
        record({ ...context, kind: "invalid-extra-pick", detail: `round=${pick.round}, year=${pick.year}` });
      }
    }
  }
}

function noteCpuDraft(state: SeasonState, career: number, season: number) {
  const cpuPicks = state.draftPicks.filter((pick) => pick.teamId !== state.teamId && pick.prospectId);
  if (!cpuPicks.length) return;
  cpuDraftPicks += cpuPicks.length;
  const draftedIds = new Set(cpuPicks.map((pick) => `draft-${pick.prospectId}`));
  const present = Object.entries(state.teams)
    .filter(([teamId]) => teamId !== state.teamId)
    .flatMap(([, team]) => team.roster)
    .filter((player) => draftedIds.has(player.id));
  cpuDraftPlayersAdded += present.length;
  if (present.length !== cpuPicks.length) {
    record({
      kind: "cpu-draft-player-missing",
      seed: state.seed,
      career,
      season,
      year: state.year,
      phase: state.phase,
      detail: `${cpuPicks.length - present.length}/${cpuPicks.length} CPU selections absent from CPU rosters`,
    });
  }
}

function simulateOneSeason(careerState: CareerState, careerIndex: number, seasonIndex: number) {
  let state = careerState.season;
  let guard = 0;
  let auditedDraft = false;
  while (state.phase !== "recap" && state.phase !== "fired" && guard++ < 400) {
    auditState(state, careerIndex, seasonIndex);
    if (state.phase === "camp" && !auditedDraft) {
      noteCpuDraft(state, careerIndex, seasonIndex);
      auditedDraft = true;
    }
    const action = suggestAction(state);
    if (!action) {
      record({
        kind: "no-suggested-action",
        seed: state.seed,
        career: careerIndex,
        season: seasonIndex,
        year: state.year,
        phase: state.phase,
        detail: "Non-terminal state had no suggested action",
      });
      return { career: { ...careerState, season: state }, completed: false };
    }
    try {
      state = applyAction(state, action);
      actions += 1;
    } catch (error) {
      record({
        kind: "simulation-action-error",
        seed: state.seed,
        career: careerIndex,
        season: seasonIndex,
        year: state.year,
        phase: state.phase,
        detail: `${action.type}: ${error instanceof Error ? error.message : String(error)}; roster=${yourRoster(state).length}; qbs=${yourRoster(state).filter((player) => player.pos === "QB").length}; suggestedCuts=${suggestedCuts(state).length}`,
      });
      return { career: { ...careerState, season: state }, completed: false };
    }
  }
  auditState(state, careerIndex, seasonIndex);
  if (guard >= 400) {
    record({
      kind: "season-guard-exhausted",
      seed: state.seed,
      career: careerIndex,
      season: seasonIndex,
      year: state.year,
      phase: state.phase,
      detail: "400 actions without terminal phase",
    });
    return { career: { ...careerState, season: state }, completed: false };
  }
  return { career: { ...careerState, season: state }, completed: true };
}

function nextCareerSeason(career: CareerState, careerIndex: number, seasonIndex: number): CareerState | null {
  const previousYear = career.season.year;
  if (career.season.phase === "recap") return advanceCareer(career);
  const offered = withJobOffers(career);
  const offer = offered.jobOffers[0];
  if (!offer) return null;
  const next = takeJob(offered, offer.teamId);
  if (next.season.year <= previousYear) {
    record({
      kind: "career-year-reset-after-firing",
      seed: career.seed,
      career: careerIndex,
      season: seasonIndex,
      year: previousYear,
      phase: career.season.phase,
      detail: `new job starts in ${next.season.year}`,
    });
  }
  return next;
}

for (let careerIndex = 0; careerIndex < careers; careerIndex += 1) {
  let career = createCareer(`Audit ${careerIndex}`, "KC", seedStart + careerIndex);
  let complete = true;
  for (let seasonIndex = 0; seasonIndex < seasonsPerCareer; seasonIndex += 1) {
    const result = simulateOneSeason(career, careerIndex, seasonIndex);
    career = result.career;
    if (!result.completed) {
      complete = false;
      break;
    }
    strictSeasonsCompleted += 1;
    if (seasonIndex + 1 < seasonsPerCareer) {
      const next = nextCareerSeason(career, careerIndex, seasonIndex);
      if (!next) {
        complete = false;
        break;
      }
      career = next;
    }
  }
  if (complete) strictCareersCompleted += 1;
}

function addAuditFillers(state: SeasonState) {
  const roster = yourRoster(state);
  if (!roster.some((player) => player.pos === "QB")) {
    roster.push({
      id: `audit-filler-${state.seed}-${state.year}-qb`,
      name: "Audit Filler QB",
      pos: "QB",
      ovr: 60,
      age: 23,
      cap: 0.9,
      years: 1,
      potential: 60,
      real: false,
    });
  }
  while (roster.length < 22) {
    const index = roster.length;
    const player: Player = {
      id: `audit-filler-${state.seed}-${state.year}-${index}`,
      name: `Audit Filler ${index}`,
      pos: index === 0 ? "QB" : "OL",
      ovr: 60,
      age: 23,
      cap: 0.9,
      years: 1,
      potential: 60,
      real: false,
    };
    roster.push(player);
  }
}

for (let run = 0; run < continuationRuns; run += 1) {
  let state = createCareer(`Continuation ${run}`, "KC", 100_000 + run).season;
  for (let seasonIndex = 0; seasonIndex < seasonsPerCareer; seasonIndex += 1) {
    let guard = 0;
    while (state.phase !== "recap" && state.phase !== "fired" && guard++ < 400) {
      if (state.phase === "camp") addAuditFillers(state);
      auditState(state, careers + run, seasonIndex);
      const action = suggestAction(state);
      if (!action) break;
      try {
        state = applyAction(state, action);
      } catch (error) {
        record({
          kind: "continuation-action-error",
          seed: state.seed,
          career: run,
          season: seasonIndex,
          year: state.year,
          phase: state.phase,
          detail: `${action.type}: ${error instanceof Error ? error.message : String(error)}`,
        });
        break;
      }
    }
    if (state.phase !== "recap" && state.phase !== "fired") break;
    continuationSeasonsCompleted += 1;
    state = rolloverSeason(state);
  }
}

console.log(
  JSON.stringify(
    {
      configuration: { careers, seasonsPerCareer, continuationRuns, serializeCareers, seedStart },
      coverage: {
        phases: [...phases].sort(),
        actions,
        strictSeasonsCompleted,
        strictCareersCompleted,
        continuationSeasonsCompleted,
        cpuDraftPicks,
        cpuDraftPlayersAdded,
      },
      edgeMetrics: {
        careerYearAfter2036Firing: futureJob?.season.year ?? null,
        repeatedRestructure: {
          playerId: restructurePlayer?.id ?? null,
          initialCap: restructureInitial,
          capAfter10: restructured?.cap ?? null,
          futureDeadAfter10: restructureState.futureDead,
        },
        acceptedTrade: {
          outgoingPlayerId: tradedPlayerId,
          outgoingPlayerOwners: tradedPlayerOwners,
          incomingPlayerId: tradeOffer?.incoming?.id ?? null,
        },
        freeAgencyAfterFirstWaveSigning: {
          signedPlayerId: firstWaveSigning?.id ?? null,
          expectedSecondWave,
          actualSecondWave,
          skippedSecondWave,
        },
        firstYearCapCuts: {
          campRosterSize: yourRoster(firstYearCampProbe).length,
          campQuarterbacks: yourRoster(firstYearCampProbe).filter((player) => player.pos === "QB").length,
          campError: firstYearCampError,
        },
      },
      findingCounts: Object.fromEntries([...findingCounts.entries()].sort()),
      examples: findings,
    },
    null,
    2,
  ),
);
