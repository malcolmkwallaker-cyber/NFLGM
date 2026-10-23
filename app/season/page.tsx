"use client";

import { useState } from "react";
import { useGame } from "@/components/profile";
import { TeamPicker } from "@/components/game/team-picker";
import { Button } from "@/components/ui/button";

export default function SeasonPage() {
  const { profile, startSeason, resumeSave } = useGame();
  const [confirm, setConfirm] = useState(false);
  const savedSeason = profile.season;
  const busy = savedSeason && savedSeason.phase !== "recap" && savedSeason.phase !== "fired" ? savedSeason : null;

  return (
    <div className="space-y-4">
      {busy && !confirm ? (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
          <p>
            {busy.gmName} still has the {busy.year} job. Free keeps one season on this device. Starting another
            replaces it. Single Season and Career each keep one separate on-device slot.
          </p>
          {profile.active === "career" && profile.career?.status === "active" ? (
            <p className="mt-2 text-muted-foreground">
              Your active Career will be paused, not deleted, and stays available from Career GM.
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button className="!h-11" onClick={() => resumeSave("season")}>
              Return to the desk
            </Button>
            <Button variant="outline" className="!h-11" onClick={() => setConfirm(true)}>
              Replace it anyway
            </Button>
          </div>
        </div>
      ) : (
        <TeamPicker
          title="One season. Your chair."
          body="The roster is a 2026 nflverse snapshot, scored for a 2027 cap. Contracts are estimates. You hire the staff, spend the money, draft, and play through January unless the owner fires you first."
          action="Take the job"
          onStart={(teamId) => startSeason(teamId, undefined, confirm)}
        />
      )}
    </div>
  );
}
