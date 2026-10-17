"use client";

import Link from "next/link";
import { useState } from "react";
import { useGame } from "@/components/profile";
import { TeamPicker } from "@/components/game/team-picker";
import { Button } from "@/components/ui/button";

export default function SeasonPage() {
  const { season, profile, startSeason } = useGame();
  const [confirm, setConfirm] = useState(false);
  const busy = season && season.phase !== "recap" && season.phase !== "fired" && profile.active === "season";

  return (
    <div className="space-y-4">
      {busy && !confirm ? (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
          <p>
            {season.gmName} still has the {season.year} job. Free keeps one season on this device. Starting another
            replaces it. Pro does not add a second saved season in this build. It adds careers.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button className="!h-11" nativeButton={false} render={<Link href="/play" />}>
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
          onStart={(teamId) => startSeason(teamId)}
        />
      )}
    </div>
  );
}
