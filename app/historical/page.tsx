"use client";

import { HISTORICAL } from "@/lib/data/historical";
import { ProGate } from "@/components/game/pro-gate";
import { TeamMark } from "@/components/game/team-mark";
import { useGame } from "@/components/profile";
import { teamById } from "@/lib/data/teams";

export default function HistoricalPage() {
  const { startSeason } = useGame();

  return (
    <ProGate
      title="Historical teams are Pro"
      body="Start as the GM of a famous roster. The field is the era, not the 2027 league. Pre-cap years use a payroll the owner notices. The cap years use the real cap number for that season."
    >
      <div className="space-y-3">
        <header>
          <h1 className="font-display text-4xl tracking-wide">Pick a year that already happened</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Rosters use real names. Free agents and draft classes in these seasons are still the game&apos;s own board.
            One season, then you are done unless you start another.
          </p>
        </header>
        {HISTORICAL.map((pack) => {
          const team = pack.teams.find((item) => item.id === pack.teamId);
          const modern = teamById(pack.teamId);
          return (
            <button
              key={pack.id}
              type="button"
              data-testid={`team-card-${pack.id}`}
              className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-card p-4 text-left hover:border-primary/50"
              onClick={() => startSeason(pack.teamId, pack.id)}
            >
              <TeamMark
                team={
                  team
                    ? { ...modern, ...team }
                    : modern
                }
                size="lg"
              />
              <span>
                <span className="block font-display text-2xl tracking-wide">{pack.title}</span>
                <span className="mt-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  {pack.capMode === "hard" ? `Cap ${pack.capLimit}M` : `Payroll guide ${pack.capLimit}M`} · {pack.weeks} weeks
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{pack.summary}</span>
              </span>
            </button>
          );
        })}
      </div>
    </ProGate>
  );
}
