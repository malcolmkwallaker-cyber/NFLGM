"use client";

import Link from "next/link";
import { GRADE_EMOJI } from "@/lib/engine/daily";
import { advancedLines } from "@/lib/engine/season";
import { useGame } from "@/components/profile";
import { hasFullAccess } from "@/lib/access";

export default function StatsPage() {
  const { profile, ready, season } = useGame();
  if (!ready) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const lines = season && hasFullAccess(profile) ? advancedLines(season) : null;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-4xl tracking-wide">The file</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Daily grades and the deeper season sheet are open for public testing.
        </p>
      </header>
      <section className="rounded-2xl border border-white/10 bg-card p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-primary">Daily</p>
        <p className="mt-2 font-display text-3xl tracking-widest">
          {profile.daily.results.slice(-20).map((row) => GRADE_EMOJI[row.grade]).join("") || "—"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile.daily.results.length} played · streak {profile.daily.streak} · best {profile.daily.bestStreak}
        </p>
      </section>
      {lines ? (
        <section className="rounded-2xl border border-white/10 bg-card p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-primary">This season</p>
          <p className="mt-2">Pythagorean wins {lines.pythWins} through {lines.games} games</p>
          <p>Point differential {lines.diff}</p>
          <p>Roster value {lines.rosterValue}</p>
          <p>
            Cap space ${lines.cap.toFixed(1)}M · dead ${lines.dead.toFixed(1)}M · health {lines.health}
          </p>
          <ul className="mt-3 space-y-1">
            {lines.top.map((player) => (
              <li key={player.id}>
                {player.name} · ${player.cap.toFixed(1)}M
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
          <p>Start a season to open the advanced lines.</p>
          <Link href="/season" className="mt-2 inline-block text-primary underline-offset-2 hover:underline">
            Take a team
          </Link>
        </section>
      )}
    </div>
  );
}
