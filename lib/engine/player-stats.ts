import { clamp, hashSeed, makeRng } from "@/lib/engine/rng";
import type { GameResult, Player, PlayerSeasonStats, SeasonState } from "@/lib/types";

function empty(playerId: string): PlayerSeasonStats {
  return {
    playerId,
    games: 0,
    passAttempts: 0,
    completions: 0,
    passYards: 0,
    passTouchdowns: 0,
    interceptionsThrown: 0,
    rushAttempts: 0,
    rushYards: 0,
    rushTouchdowns: 0,
    targets: 0,
    receptions: 0,
    receivingYards: 0,
    receivingTouchdowns: 0,
    tackles: 0,
    sacks: 0,
    defensiveInterceptions: 0,
    fieldGoalsMade: 0,
    points: 0,
  };
}

function line(state: SeasonState, player: Player): PlayerSeasonStats {
  state.playerStats ??= {};
  state.playerStats[player.id] ??= empty(player.id);
  return state.playerStats[player.id];
}

function splitTotal(total: number, players: Player[], weights: number[]): number[] {
  if (!players.length) return [];
  const usable = players.map((_, index) => Math.max(1, weights[index] ?? 1));
  const weightTotal = usable.reduce((sum, value) => sum + value, 0);
  const shares = usable.map((weight) => Math.floor((total * weight) / weightTotal));
  let left = total - shares.reduce((sum, value) => sum + value, 0);
  for (let index = 0; left > 0; index = (index + 1) % shares.length) {
    shares[index] += 1;
    left -= 1;
  }
  return shares;
}

export function recordUserPlayerStats(state: SeasonState, result: GameResult, key: string): void {
  if (result.home !== state.teamId && result.away !== state.teamId) return;
  state.playerStats ??= {};
  state.statsTrackingStartedWeek ??= result.week || state.week;
  const rng = makeRng(hashSeed(state.seed, state.year, "player-stats", key, result.home, result.away));
  const score = result.home === state.teamId ? result.homeScore : result.awayScore;
  const opponentScore = result.home === state.teamId ? result.awayScore : result.homeScore;
  const roster = state.teams[state.teamId]?.roster ?? [];
  const active = roster.filter((player) => !player.injured);
  for (const player of active) line(state, player).games += 1;

  const quarterback = active.filter((player) => player.pos === "QB").sort((a, b) => b.ovr - a.ovr)[0];
  const backs = active.filter((player) => player.pos === "RB").sort((a, b) => b.ovr - a.ovr).slice(0, 2);
  const receivers = active
    .filter((player) => ["WR", "TE", "RB"].includes(player.pos))
    .sort((a, b) => b.ovr - a.ovr)
    .slice(0, 5);
  const defenders = active
    .filter((player) => ["DL", "EDGE", "LB", "CB", "S"].includes(player.pos))
    .sort((a, b) => b.ovr - a.ovr)
    .slice(0, 9);
  const kicker = active.filter((player) => player.pos === "K").sort((a, b) => b.ovr - a.ovr)[0];

  const touchdowns = Math.floor(score / 7);
  const fieldGoals = Math.max(0, Math.floor((score - touchdowns * 7) / 3));
  const otherPoints = score - touchdowns * 7 - fieldGoals * 3;
  const passTouchdowns = quarterback ? clamp(Math.round(touchdowns * (0.55 + rng.next() * 0.25)), 0, touchdowns) : 0;
  const rushTouchdowns = touchdowns - passTouchdowns;
  const passYards = quarterback ? Math.round(clamp(145 + score * 3.8 + rng.int(91), 120, 430)) : 0;
  const rushYards = Math.round(clamp(58 + score * 2.1 + rng.int(76), 45, 240));

  if (quarterback) {
    const stats = line(state, quarterback);
    const gameAttempts = 26 + rng.int(18);
    stats.passAttempts += gameAttempts;
    stats.completions += Math.round(gameAttempts * (0.55 + rng.next() * 0.14));
    stats.passYards += passYards;
    stats.passTouchdowns += passTouchdowns;
    stats.interceptionsThrown += opponentScore > score ? rng.int(3) : rng.int(2);
  }

  const rushers = backs.length ? backs : quarterback ? [quarterback] : active.slice(0, 1);
  const rushShares = splitTotal(rushYards, rushers, rushers.map((player) => player.ovr));
  const carryShares = splitTotal(20 + rng.int(14), rushers, rushers.map((player) => player.ovr));
  const rushTdShares = splitTotal(rushTouchdowns, rushers, rushers.map((player) => player.ovr));
  rushers.forEach((player, index) => {
    const stats = line(state, player);
    stats.rushAttempts += carryShares[index] ?? 0;
    stats.rushYards += rushShares[index] ?? 0;
    stats.rushTouchdowns += rushTdShares[index] ?? 0;
    stats.points += (rushTdShares[index] ?? 0) * 6;
  });

  if (receivers.length) {
    const catchTotal = Math.max(8, quarterback ? 16 + rng.int(16) : 8 + rng.int(8));
    const catches = splitTotal(catchTotal, receivers, receivers.map((player) => player.ovr + (player.pos === "WR" ? 8 : 0)));
    const yards = splitTotal(passYards, receivers, receivers.map((player) => player.ovr + (player.pos === "WR" ? 12 : 0)));
    const recTdShares = splitTotal(passTouchdowns, receivers, receivers.map((player) => player.ovr));
    receivers.forEach((player, index) => {
      const stats = line(state, player);
      stats.receptions += catches[index] ?? 0;
      stats.targets += (catches[index] ?? 0) + 1 + rng.int(3);
      stats.receivingYards += yards[index] ?? 0;
      stats.receivingTouchdowns += recTdShares[index] ?? 0;
      stats.points += (recTdShares[index] ?? 0) * 6;
    });
  }

  if (defenders.length) {
    const tackles = splitTotal(48 + rng.int(24), defenders, defenders.map((player) => player.ovr));
    defenders.forEach((player, index) => { line(state, player).tackles += tackles[index] ?? 0; });
    const passRushers = defenders.filter((player) => ["EDGE", "DL", "LB"].includes(player.pos)).slice(0, 4);
    const sackShares = splitTotal(Math.max(0, 1 + rng.int(5) - Math.floor(opponentScore / 18)), passRushers, passRushers.map((player) => player.ovr));
    passRushers.forEach((player, index) => { line(state, player).sacks += sackShares[index] ?? 0; });
    const defensiveBacks = defenders.filter((player) => ["CB", "S", "LB"].includes(player.pos)).slice(0, 5);
    if (defensiveBacks.length && rng.next() > 0.45) line(state, defensiveBacks[rng.int(defensiveBacks.length)]).defensiveInterceptions += 1;
  }

  if (kicker) {
    const stats = line(state, kicker);
    stats.fieldGoalsMade += fieldGoals;
    stats.points += fieldGoals * 3 + touchdowns + otherPoints;
  } else if (quarterback) {
    line(state, quarterback).points += touchdowns + otherPoints;
  }
}

export function playerStatsRows(state: SeasonState) {
  const roster = state.teams[state.teamId]?.roster ?? [];
  return roster.map((player) => ({ player, stats: state.playerStats?.[player.id] ?? empty(player.id) }));
}
