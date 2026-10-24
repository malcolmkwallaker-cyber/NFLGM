"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGame } from "@/components/profile";
import { GRADE_EMOJI } from "@/lib/engine/daily";
import { marketAsk } from "@/lib/engine/cap";
import { playerStatsRows } from "@/lib/engine/player-stats";
import { advancedLines, standings, yourRoster } from "@/lib/engine/season";
import { teamById, teamLabel } from "@/lib/data/teams";
import { formatContractYears, formatMoney } from "@/lib/format";
import { hasFullAccess } from "@/lib/access";
import type { PlayerSeasonStats, Pos, SeasonState } from "@/lib/types";

type SortKey = "name" | "overall" | "yards" | "touchdowns" | "tackles";

export default function StatsPage() {
  const { profile, ready, season } = useGame();
  const [position, setPosition] = useState<"ALL" | Pos>("ALL");
  const [sort, setSort] = useState<SortKey>("yards");
  if (!ready) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const lines = season && hasFullAccess(profile) ? advancedLines(season) : null;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-4xl tracking-wide">Stats &amp; contracts</h1>
        <p className="mt-2 text-sm text-muted-foreground">Current-season simulation totals, league team results, and contract projections from your saved file.</p>
      </header>
      <section className="rounded-2xl border border-white/10 bg-card p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Daily</p>
        <p className="mt-2 font-display text-3xl tracking-widest">{profile.daily.results.slice(-20).map((row) => GRADE_EMOJI[row.grade]).join("") || "—"}</p>
        <p className="mt-2 text-sm text-muted-foreground">{profile.daily.results.length} played · streak {profile.daily.streak} · best {profile.daily.bestStreak}</p>
      </section>
      {season && lines ? (
        <>
          <SeasonOverview season={season} lines={lines} />
          <PlayerStatsTable season={season} position={position} setPosition={setPosition} sort={sort} setSort={setSort} />
          <LeagueTeamStats season={season} />
          <ContractPreview season={season} />
        </>
      ) : (
        <section className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
          <p>Start a season to open player statistics, league results, and contract projections.</p>
          <Link href="/season" className="mt-2 inline-block text-primary underline-offset-2 hover:underline">Take a team</Link>
        </section>
      )}
    </div>
  );
}

function SeasonOverview({ season, lines }: { season: SeasonState; lines: ReturnType<typeof advancedLines> }) {
  return <section className="rounded-2xl border border-white/10 bg-card p-4 text-sm">
    <p className="text-xs uppercase tracking-[0.16em] text-primary">{season.year} current season</p>
    <p className="mt-2">Pythagorean wins {lines.pythWins} through {lines.games} games · point differential {lines.diff}</p>
    <p>Roster value {lines.rosterValue} · cap space {formatMoney(lines.cap)} · dead {formatMoney(lines.dead)} · health {lines.health}</p>
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Player lines are deterministic modeled statistics created with each game result. They are not official NFL box scores. Career player totals are unavailable because career saves currently retain season-level summaries, not past player lines.</p>
  </section>;
}

function PlayerStatsTable({ season, position, setPosition, sort, setSort }: { season: SeasonState; position: "ALL" | Pos; setPosition: (position: "ALL" | Pos) => void; sort: SortKey; setSort: (sort: SortKey) => void }) {
  const rows = useMemo(() => playerStatsRows(season)
    .filter(({ player }) => position === "ALL" || player.pos === position)
    .sort((a, b) => sort === "name" ? a.player.name.localeCompare(b.player.name) : sort === "overall" ? b.player.ovr - a.player.ovr : sort === "yards" ? totalYards(b.stats) - totalYards(a.stats) : sort === "touchdowns" ? totalTouchdowns(b.stats) - totalTouchdowns(a.stats) : b.stats.tackles - a.stats.tackles), [position, season, sort]);
  const games = season.results.filter((result) => result.home === season.teamId || result.away === season.teamId).length;
  const legacyGap = games > 0 && Object.keys(season.playerStats ?? {}).length === 0;
  return <section className="rounded-2xl border border-white/10 bg-card p-4">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-xs uppercase tracking-[0.16em] text-primary">Your player statistics</p><h2 className="mt-1 font-display text-2xl tracking-wide">Modeled current-season lines</h2></div>
      <div className="flex flex-wrap gap-2 text-sm">
        <label>Position <select className="ml-1 rounded border border-white/15 bg-background p-2" value={position} onChange={(event) => setPosition(event.target.value as "ALL" | Pos)}><option value="ALL">All</option>{["QB", "RB", "WR", "TE", "OL", "DL", "EDGE", "LB", "CB", "S", "K"].map((pos) => <option key={pos}>{pos}</option>)}</select></label>
        <label>Sort <select className="ml-1 rounded border border-white/15 bg-background p-2" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}><option value="yards">Total yards</option><option value="touchdowns">Touchdowns</option><option value="tackles">Tackles</option><option value="overall">Overall</option><option value="name">Name</option></select></label>
      </div>
    </div>
    {legacyGap ? <p className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/5 p-3 text-sm text-muted-foreground">This save began before player-stat tracking. Past games remain intact, but their player lines are unavailable; tracking begins with the next game.</p> : null}
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-2">Player</th><th className="p-2">G</th><th className="p-2">Pass</th><th className="p-2">Rush</th><th className="p-2">Receiving</th><th className="p-2">TD</th><th className="p-2">Defense</th></tr></thead><tbody>{rows.map(({ player, stats }) => <tr key={player.id} className="border-t border-white/10"><td className="p-2 font-medium">{player.name}<span className="ml-2 text-xs text-muted-foreground">{player.pos} · {player.ovr}</span></td><td className="p-2">{stats.games}</td><td className="p-2">{stats.completions}/{stats.passAttempts} · {stats.passYards} yd</td><td className="p-2">{stats.rushAttempts} · {stats.rushYards} yd</td><td className="p-2">{stats.receptions}/{stats.targets} · {stats.receivingYards} yd</td><td className="p-2">{totalTouchdowns(stats)}</td><td className="p-2">{stats.tackles} tkl · {stats.sacks} sk · {stats.defensiveInterceptions} int</td></tr>)}</tbody></table></div>
  </section>;
}

function LeagueTeamStats({ season }: { season: SeasonState }) {
  return <section className="rounded-2xl border border-white/10 bg-card p-4">
    <p className="text-xs uppercase tracking-[0.16em] text-primary">Other teams</p><h2 className="mt-1 font-display text-2xl tracking-wide">League team statistics</h2>
    <p className="mt-2 text-xs text-muted-foreground">Opponent player box scores are not modeled. These are the actual team aggregates recorded by this simulation.</p>
    <div className="mt-3 max-h-96 overflow-auto"><table className="w-full min-w-[480px] text-left text-sm"><thead className="sticky top-0 bg-card text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-2">Team</th><th className="p-2">W-L</th><th className="p-2">PF</th><th className="p-2">PA</th><th className="p-2">Diff</th></tr></thead><tbody>{standings(season).map((row) => <tr key={row.id} className="border-t border-white/10"><td className="p-2">{teamLabel(row)}</td><td className="p-2">{row.wins}-{row.losses}</td><td className="p-2">{row.pf}</td><td className="p-2">{row.pa}</td><td className="p-2">{row.pf - row.pa > 0 ? "+" : ""}{row.pf - row.pa}</td></tr>)}</tbody></table></div>
  </section>;
}

function ContractPreview({ season }: { season: SeasonState }) {
  const own = yourRoster(season).filter((player) => player.years <= 1).sort((a, b) => b.ovr - a.ovr);
  const targets = Object.entries(season.teams).filter(([teamId]) => teamId !== season.teamId).flatMap(([teamId, team]) => team.roster.filter((player) => player.years <= 1).map((player) => ({ player, teamId }))).sort((a, b) => b.player.ovr - a.player.ovr).slice(0, 12);
  return <section className="rounded-2xl border border-white/10 bg-card p-4">
    <p className="text-xs uppercase tracking-[0.16em] text-primary">Offseason preview</p><h2 className="mt-1 font-display text-2xl tracking-wide">Contracts to watch</h2>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Projected status uses the game’s modeled contract years. Asking prices are estimates, not confirmed deals or historical salary facts.</p>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <ContractList title="Your re-sign decisions" empty="No user-roster contract expires after this season." rows={own.map((player) => ({ id: player.id, name: player.name, detail: `${player.pos} · ${player.ovr} overall · ${formatContractYears(player.years)} · projected ${formatMoney(marketAsk(player))}/yr` }))} />
      <ContractList title="Potential outside targets" empty={season.flags.historicalRosterScenarioId ? "Historical opponents use team-level ratings, so no opponent-player free-agent projection is claimed for this mode." : "No modeled outside contract is currently projected to expire."} rows={targets.map(({ player, teamId }) => ({ id: `${teamId}-${player.id}`, name: player.name, detail: `${player.pos} · ${player.ovr} overall · ${teamById(teamId, season.directory).abbr} · projected ${formatMoney(marketAsk(player))}/yr` }))} />
    </div>
  </section>;
}

function ContractList({ title, empty, rows }: { title: string; empty: string; rows: { id: string; name: string; detail: string }[] }) {
  return <div><h3 className="font-medium">{title}</h3>{rows.length ? <ul className="mt-2 space-y-2">{rows.map((row) => <li key={row.id} className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm"><span className="font-medium">{row.name}</span><span className="mt-1 block text-xs text-muted-foreground">{row.detail}</span></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">{empty}</p>}</div>;
}

function totalYards(stats: PlayerSeasonStats) { return stats.passYards + stats.rushYards + stats.receivingYards; }
function totalTouchdowns(stats: PlayerSeasonStats) { return stats.passTouchdowns + stats.rushTouchdowns + stats.receivingTouchdowns; }
