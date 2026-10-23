"use client";

import { ProGate } from "@/components/game/pro-gate";
import { TeamPicker } from "@/components/game/team-picker";
import { useGame } from "@/components/profile";
import { hofStatus } from "@/lib/engine/career";
import { Button } from "@/components/ui/button";

export default function CareerPage() {
  const { profile, ready, startCareer, resumeSave } = useGame();
  const career = profile.career;

  return (
    <ProGate
      title="Full career is a Pro file"
      body="Stay past one season. Contracts age, the cap moves, and a firing is a job change instead of a game over. Retire and the game writes a GM Wikipedia page, with a Hall of Fame score."
    >
      {!ready ? null : career ? (
        <section className="space-y-4">
          <header>
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">{hofStatus(career)}</p>
            <h1 className="font-display text-4xl tracking-wide">{career.gmName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Legacy {career.legacy} · jobs {career.jobs} · rings {career.superBowls} · fired {career.fired}
            </p>
          </header>
          {career.status === "active" ? (
            <Button className="!h-12 !px-4" onClick={() => resumeSave("career")}>
              {career.season.phase === "recap" ? "Read the year, then continue" : "Back to this career"}
            </Button>
          ) : null}
          <ul className="space-y-2">
            {career.history.map((row) => (
              <li key={`${row.year}-${row.teamId}`} className="rounded-xl border border-white/10 bg-card px-4 py-3 text-sm">
                <span className="font-medium">
                  {row.year} {row.teamName}
                </span>
                <span className="mt-1 block text-muted-foreground">
                  {row.wins}-{row.losses} · {row.champ ? "Champion" : row.round} · {row.grade}
                  {row.fired ? " · fired" : ""} · legacy {row.legacy}
                </span>
              </li>
            ))}
          </ul>
          {career.wikipedia ? (
            <article className="rounded-2xl border border-white/10 bg-card p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-primary">GM Wikipedia</p>
              <p className="mt-2 text-sm leading-relaxed">{career.wikipedia}</p>
            </article>
          ) : null}
          {career.status === "retired" ? (
            <TeamPicker
              title="Another file"
              body="A new career replaces the retired one on this device. The page above is still in the save until you start."
              action="Start a new career"
              onStart={startCareer}
            />
          ) : null}
        </section>
      ) : (
        <TeamPicker
          title="A career, not a cameo"
          body="Year one is the same desk as a single season. After the recap you age the roster, roll the cap, and go again. Get fired and three other teams might still want a meeting."
          action="Start the career"
          onStart={startCareer}
        />
      )}
    </ProGate>
  );
}
