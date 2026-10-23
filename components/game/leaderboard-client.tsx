"use client";

import Link from "next/link";
import { useGame } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { personalBests } from "@/lib/leaderboard";

export function LeaderboardClient() {
  const { profile, ready } = useGame();
  const rows = personalBests(profile);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">On this device only</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Personal scores</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These best scores are derived from games still present in this browser’s save. They are not a global
          leaderboard, are never uploaded, and do not compare you with other players.
        </p>
      </section>

      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading this device’s scores…</p>
      ) : rows.length ? (
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Saved high scores">
          {rows.map((row) => (
            <li key={row.id} className="flex min-h-44 flex-col rounded-xl border border-white/10 bg-card p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">{row.label}</p>
              <p className="mt-3 font-display text-6xl leading-none tracking-wide">{row.score}</p>
              <p className="mt-1 text-xs text-muted-foreground">{row.scoreLabel}</p>
              <p className="mt-auto pt-4 text-sm">{row.detail}</p>
            </li>
          ))}
        </ol>
      ) : (
        <section className="rounded-xl border border-white/10 bg-card p-5">
          <h2 className="font-display text-3xl tracking-wide">No finished scores yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Finish a Daily Challenge or a season to set your first personal best.</p>
        </section>
      )}

      <section className="rounded-xl border border-white/10 bg-card p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Shared leaderboard status</p>
        <h2 className="mt-1 font-display text-3xl tracking-wide">Not connected yet</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A real public board needs a server that can verify identical challenge seeds, reject duplicate or altered
          runs, and explain what player data it stores. This playtest has no account or score server, so it does not
          pretend local scores are global.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button nativeButton={false} render={<Link href="/daily" />}>Play Daily Challenge</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/season" />}>Play Single Season</Button>
      </div>
    </div>
  );
}
