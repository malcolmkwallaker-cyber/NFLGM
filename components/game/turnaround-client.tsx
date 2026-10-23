"use client";

import Link from "next/link";
import { useGame } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { scoreHistoricTurnaround } from "@/lib/engine/historic-turnaround";
import { useTodayTurnaround } from "@/components/game/use-today-turnaround";

export function TurnaroundClient() {
  const today = useTodayTurnaround();
  const { profile, season, startTurnaround } = useGame();
  if (!today) return <p className="text-sm text-muted-foreground">Setting today’s turnaround…</p>;

  const { scenario, seed, challengeNumber, day } = today;
  const isCurrent = season?.flags.turnaroundScenarioId === scenario.id && season.flags.turnaroundDate === day;
  const complete = isCurrent && season?.grade ? season : null;
  const score = complete?.grade
    ? scoreHistoricTurnaround(scenario, {
        finalWins: complete.grade.wins,
        finalLosses: complete.grade.losses,
        playoffRound: complete.grade.round,
        gradeScore: complete.grade.score,
        ownerConfidence: complete.meters.owner,
      })
    : null;

  function begin() {
    const unfinished = profile.active === "season" && season && season.phase !== "recap" && season.phase !== "fired";
    if (unfinished && !window.confirm("Starting today’s turnaround replaces your active Single Season save. Continue?")) return;
    startTurnaround(scenario, seed, day);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Daily historic turnaround · #{challengeNumber + 1}</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">{scenario.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{scenario.setup}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Fact label="Actual record" value={`${scenario.actualWins}-${scenario.actualLosses}`} />
          <Fact label="Invented game target" value={`${scenario.objectiveWins} wins`} />
          <Fact label="Shared seed" value={String(seed)} />
        </div>
      </section>

      <section className="rounded-xl border border-amber-300/30 bg-amber-300/5 p-5 text-sm leading-relaxed">
        <h2 className="font-display text-2xl tracking-wide">Historical-inspired simulation</h2>
        <p className="mt-2 text-muted-foreground">
          The record and outcome above describe the real {scenario.season} season. Your run uses the game’s current
          generic roster model and modern 17-game rules—not an authentic {scenario.season} roster or schedule. Every
          player gets the same scenario snapshot and seed today. Scoring normalizes the real {scenario.actualGames}-game
          record to the simulated schedule.
        </p>
        <a className="mt-3 inline-block text-primary underline underline-offset-4" href={scenario.sources[0]} target="_blank" rel="noreferrer">
          View the season source
        </a>
      </section>

      {score !== null && complete?.grade ? (
        <section className="rounded-xl border border-primary/30 bg-card p-5" data-testid="turnaround-result">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Your simulated result</p>
          <p className="mt-2 font-display text-6xl leading-none tracking-wide">{score.total}</p>
          <p className="mt-2 text-sm">{complete.grade.wins}-{complete.grade.losses} · {complete.grade.round} · grade {complete.grade.letter}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            400 base {signed(score.winImprovement)} normalized win improvement {signed(score.playoffBonus)} playoffs {signed(score.gradeAdjustment)} GM grade {signed(score.ownerAdjustment)} owner confidence.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{scenario.actualOutcome} This is context, not your simulated result.</p>
        </section>
      ) : isCurrent ? (
        <Button nativeButton={false} render={<Link href="/play" />}>Continue today’s run</Button>
      ) : (
        <Button onClick={begin} data-testid="start-turnaround">Start the shared setup</Button>
      )}

      <section className="rounded-xl border border-white/10 bg-card p-5 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-2xl tracking-wide text-foreground">How the 0–1000 score works</h2>
        <p className="mt-2">
          400 base + 35 points per normalized win above the real record + playoff bonus + twice the GM grade above 60
          + owner confidence above 50. Scores stay on this device; no global board is connected.
        </p>
        <Link className="mt-3 inline-block text-primary underline underline-offset-4" href="/leaderboard">View your saved scores</Link>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl tracking-wide">{value}</p>
    </div>
  );
}

function signed(value: number) {
  return value >= 0 ? `+ ${value}` : `− ${Math.abs(value)}`;
}
