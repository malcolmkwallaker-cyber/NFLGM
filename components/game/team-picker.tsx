"use client";

import { useState } from "react";
import { TeamMark } from "@/components/game/team-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEAMS, teamLabel } from "@/lib/data/teams";
import { useGame } from "@/components/profile";

export function TeamPicker({
  title,
  body,
  action,
  onStart,
}: {
  title: string;
  body: string;
  action: string;
  onStart: (teamId: string) => void;
}) {
  const { profile, update, ready } = useGame();
  const [teamId, setTeamId] = useState("KC");
  if (!ready) return <p className="text-sm text-muted-foreground">Loading teams…</p>;
  const selected = TEAMS.find((team) => team.id === teamId) ?? TEAMS[0];

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-4xl tracking-wide">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
      <label className="block max-w-xs text-sm">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Your name on the door</span>
        <Input
          className="mt-1 !h-11"
          value={profile.name}
          onChange={(event) => update((prev) => ({ ...prev, name: event.target.value.slice(0, 32) || "GM" }))}
        />
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TEAMS.map((team) => (
          <button
            key={team.id}
            type="button"
            data-testid={`team-card-${team.id}`}
            onClick={() => setTeamId(team.id)}
            className={`flex items-center gap-2 rounded-xl border px-2 py-2 text-left ${
              team.id === teamId ? "border-primary bg-primary/10" : "border-white/10 bg-card"
            }`}
          >
            <TeamMark team={team} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm">{team.name}</span>
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                {team.conf} {team.div}
              </span>
            </span>
          </button>
        ))}
      </div>
      <Button className="!h-12 !px-5" onClick={() => onStart(selected.id)}>
        {action} · {teamLabel(selected)}
      </Button>
    </section>
  );
}
