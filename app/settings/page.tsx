"use client";

import { useGame } from "@/components/profile";
import { freshProfile } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { profile, ready, update, confirmAction } = useGame();
  if (!ready) return <p className="text-sm text-muted-foreground">Loading the save…</p>;

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <header>
        <h1 className="font-display text-4xl tracking-wide">This browser is the account</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Saves stay in this browser only. There is no login or cloud sync, and nothing uploads your career, Daily results,
          or settings.
        </p>
      </header>
      <label className="block text-sm">
        GM name
        <Input
          className="mt-1 !h-11"
          value={profile.name}
          onChange={(event) => update((prev) => ({ ...prev, name: event.target.value.slice(0, 32) }))}
        />
      </label>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm">
        <span>
          <span className="block">Public playtest access</span>
          <span className="text-xs text-muted-foreground">Career mode and the full preview are open in this build.</span>
        </span>
      </div>
      <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm">
        <span>
          <span className="block">Tester mode</span>
          <span className="text-xs text-muted-foreground">
            Show extra notes about synthetic schedules, fictional draft classes, free agents, and estimated cap data.
          </span>
        </span>
        <Switch
          checked={profile.settings.testerMode ?? false}
          onCheckedChange={(on) =>
            update((prev) => ({ ...prev, settings: { ...prev.settings, testerMode: on } }))
          }
          aria-label="Tester mode"
        />
      </label>
      <Button
        variant="destructive"
        onClick={() => {
          confirmAction(
            "Wipe every saved season, career, Daily result, and setting from this browser? This cannot be undone.",
            () => {
              const next = freshProfile(profile.name || "GM");
              update(() => next);
            },
            { title: "Wipe this browser save?", confirmLabel: "Wipe everything" },
          );
        }}
      >
        Wipe this save
      </Button>
    </div>
  );
}
