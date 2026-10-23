"use client";

import { useState } from "react";
import { ProGate } from "@/components/game/pro-gate";
import { useGame } from "@/components/profile";
import { parseShare } from "@/lib/share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { League } from "@/lib/types";

export default function LeaguesPage() {
  const { profile, update } = useGame();
  const [name, setName] = useState("War room");
  const [mode, setMode] = useState<League["mode"]>("daily");
  const [paste, setPaste] = useState("");
  const [friend, setFriend] = useState("Friend");
  const [code, setCode] = useState(profile.leagues[0]?.code ?? "");
  const [note, setNote] = useState("");

  function create() {
    const league: League = {
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      name: name.trim() || "League",
      mode,
      entries: [],
    };
    update((prev) => ({ ...prev, leagues: [league, ...prev.leagues].slice(0, 8) }));
    setCode(league.code);
    setNote(`Room ${league.code} is on this device. Send friends the code and have them paste a share card.`);
  }

  function addEntry() {
    const entry = parseShare(paste, friend.trim() || "Friend");
    if (!entry) {
      setNote("That text does not include a Run The Roster share line.");
      return;
    }
    update((prev) => ({
      ...prev,
      leagues: prev.leagues.map((league) =>
        league.code === code ? { ...league, entries: [...league.entries, entry] } : league,
      ),
    }));
    setPaste("");
    setNote("Card added. A server will sync this later. For now the board lives in this browser.");
  }

  return (
    <ProGate
      title="On-device rooms"
      body="Everyone runs the same Daily Challenge, or you compare season cards. Rooms do not sync: paste a friend's share card to add it to this browser only."
    >
      <div className="space-y-4">
        <h1 className="font-display text-4xl tracking-wide">A room for the group chat</h1>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <Input className="!h-11" value={name} onChange={(event) => setName(event.target.value)} />
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value === "season" ? "season" : "daily")}
            className="h-11 rounded-lg border border-white/10 bg-black/30 px-2 text-sm"
          >
            <option value="daily">Same daily</option>
            <option value="season">Season cards</option>
          </select>
          <Button className="!h-11" onClick={create}>
            Create room
          </Button>
        </div>
        {profile.leagues.length ? (
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Room</span>
            <select
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-white/10 bg-black/30 px-2"
            >
              {profile.leagues.map((league) => (
                <option key={league.code} value={league.code}>
                  {league.code} · {league.name} · {league.mode}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-sm text-muted-foreground">No rooms yet.</p>
        )}
        <div className="space-y-2">
          <Input className="!h-11" value={friend} onChange={(event) => setFriend(event.target.value)} placeholder="Friend's name" />
          <textarea
            value={paste}
            onChange={(event) => setPaste(event.target.value)}
            placeholder="Paste a Run The Roster share card"
            className="min-h-28 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
          />
          <Button variant="outline" className="!h-11" disabled={!code} onClick={addEntry}>
            Add the card
          </Button>
        </div>
        {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
        {(profile.leagues.find((league) => league.code === code)?.entries ?? [])
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((entry) => (
            <p key={`${entry.name}-${entry.at}`} className="rounded-lg border border-white/10 px-3 py-2 text-sm">
              {entry.name} · {entry.score} · {entry.detail}
            </p>
          ))}
      </div>
    </ProGate>
  );
}
