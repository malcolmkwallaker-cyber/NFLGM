"use client";

import { useState } from "react";
import { ProGate } from "@/components/game/pro-gate";
import { TeamPicker } from "@/components/game/team-picker";
import { useGame } from "@/components/profile";
import { hofStatus } from "@/lib/engine/career";
import { Button } from "@/components/ui/button";
import { formatPlayoffRound } from "@/lib/format";

export default function CareerPage() {
  const { profile, ready, startCareer, resumeSave } = useGame();
  const career = profile.career;
  const [replacingCareer, setReplacingCareer] = useState(false);

  return (
    <ProGate
      title="Career mode"
      body="Career mode is open during the public playtest. Contracts age, the cap moves, and a firing can become a job change instead of game over."
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
            <div className="flex flex-wrap gap-2">
              <Button className="!h-12 !px-4" onClick={() => resumeSave("career")}>
                {career.season.phase === "recap" ? "Read the year, then continue" : "Back to this career"}
              </Button>
              <Button variant="outline" className="!h-12 !px-4" data-testid="career-replace" onClick={() => setReplacingCareer((shown) => !shown)}>
                {replacingCareer ? "Keep this career" : "Start a new career"}
              </Button>
            </div>
          ) : null}
          {career.status === "active" && replacingCareer ? (
            <TeamPicker
              title="Replace this Career file"
              body="Choose a team, then confirm the replacement. Your Daily streak and saved Single Season stay untouched."
              action="Replace Career and start"
              onStart={startCareer}
            />
          ) : null}
          <ul className="space-y-2">
            {career.history.map((row) => (
              <li key={`${row.year}-${row.teamId}`} className="rounded-xl border border-white/10 bg-card px-4 py-3 text-sm">
                <span className="font-medium">
                  {row.year} {row.teamName}
                </span>
                <span className="mt-1 block text-muted-foreground">
                  {row.wins}-{row.losses} · {row.champ ? "Champion" : formatPlayoffRound(row.round)} · {row.grade}
                  {row.fired ? " · fired" : ""} · legacy {row.legacy}
                </span>
              </li>
            ))}
          </ul>
          {career.wikipedia ? (
            <article className="rounded-2xl border border-white/10 bg-card p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-primary">Career retrospective</p>
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
