"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGame } from "@/components/profile";
import { Meters } from "@/components/game/meters";
import { ShareCard } from "@/components/game/share-card";
import { TeamMark } from "@/components/game/team-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capSpace } from "@/lib/engine/cap";
import { ROLE_LABEL } from "@/lib/data/staff";
import { teamById, teamLabel } from "@/lib/data/teams";
import { seasonShareText } from "@/lib/share";
import { advancedLines, divisionTable, priorityLabel, seasonDrivers, standings, suggestedCuts, teamRecord, weekMatchup, yourRoster } from "@/lib/engine/season";
import type { Phase, Player, Pos, SeasonState, StaffRole } from "@/lib/types";
import { hasFullAccess } from "@/lib/access";
import { formatContractYears, formatMoney, formatPlayoffRound } from "@/lib/format";
import { titledGmName } from "@/lib/gm-name";

const ROLES: StaffRole[] = ["hc", "oc", "dc", "scout"];

const PHASE_TITLE: Record<Phase, string> = {
  intro: "Owner meeting",
  staff: "Front office",
  cap: "Salary cap",
  fa: "Free agency",
  trade: "Trade calls",
  draft: "The draft",
  camp: "Training camp",
  regular: "Regular season",
  playoffs: "Playoffs",
  recap: "Season recap",
  fired: "Fired",
};

function money(value: number) {
  return formatMoney(value);
}

export function Desk() {
  const game = useGame();
  const { season, ready, interactionLocked, error, clearError, dispatch, profile, advanceYear, openJobOffers, acceptJob, retire } = game;
  const [note, setNote] = useState("");
  const [shopId, setShopId] = useState("");

  const cutIds = useMemo(() => {
    if (!season || season.phase !== "camp") return [];
    return season.campCutIds;
  }, [season]);

  if (!ready) return <p className="text-sm text-muted-foreground">Pulling the binder…</p>;
  if (!season) {
    return (
      <section className="yard-lines rounded-2xl border border-white/10 bg-card p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Empty desk</p>
        <h1 className="mt-2 font-display text-4xl tracking-wide">Nobody has given you the keys.</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Take one team from the owner meeting through the Super Bowl, or build a free multi-season career during the public playtest.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button className="!h-12 !px-4" nativeButton={false} render={<Link href="/season" />}>
            Start a season
          </Button>
          <Button variant="outline" className="!h-12 !px-4" nativeButton={false} render={<Link href="/daily" />}>
            Today&apos;s challenge
          </Button>
        </div>
      </section>
    );
  }

  const live = season;
  const team = teamById(live.teamId, live.directory);
  const record = teamRecord(season, season.teamId);
  const space = capSpace(season);
  const roster = yourRoster(season).slice().sort((a, b) => b.ovr - a.ovr);
  const role = ROLES[season.staffStep] ?? "hc";
  const matchup = weekMatchup(season);
  const remaining = roster.length - (season.phase === "camp" ? cutIds.length : 0);
  const keptQb = roster.some((player) => player.pos === "QB" && !cutIds.includes(player.id));
  const campOk = remaining >= 22 && remaining <= 26 && keptQb;

  return (
    <div className={`space-y-4 ${interactionLocked ? "pointer-events-none select-none" : ""}`} aria-busy={interactionLocked}>
      <section className="yard-lines overflow-hidden rounded-2xl border border-white/10 bg-card">
        <div className="flex items-start gap-3 border-b border-white/10 px-4 py-4">
          <TeamMark team={team} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
              {season.flags.turnaroundScenarioId
                ? `${season.year} ${team.city} · turnaround`
                : season.historicalTitle
                  ? `${season.historicalTitle} · historical`
                  : `${season.year} · ${season.mode}`}
            </p>
            <h1 data-testid="phase-title" className="font-display text-3xl leading-none tracking-wide sm:text-4xl">
              {PHASE_TITLE[season.phase]}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {teamLabel(team)} · {record.wins}-{record.losses}
              {season.phase === "regular" ? ` · Week ${season.week}` : ""} · {titledGmName(season.gmName)}
            </p>
          </div>
        </div>
        <div className="px-4 py-4">
          <Meters season={season} />
        </div>
      </section>

      {error ? (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm">
          <p>{error}</p>
          <button type="button" className="text-xs uppercase tracking-wider text-muted-foreground" onClick={clearError}>
            Dismiss
          </button>
        </div>
      ) : null}

      <Headlines season={season} />

      {profile.settings.testerMode ? (
        <p className="rounded-lg border border-amber-300/30 bg-amber-300/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          Tester note: schedules are generated, draft prospects and outside free agents are fictional, and modern roster contracts and cap hits are estimates.
        </p>
      ) : null}

      {season.phase === "intro" ? <Intro season={season} note={note} setNote={setNote} /> : null}
      {season.phase === "staff" ? <Staff season={season} role={role} /> : null}
      {season.phase === "cap" ? <Cap season={season} roster={roster} space={space} /> : null}
      {season.phase === "fa" ? <FreeAgency season={season} space={space} /> : null}
      {season.phase === "trade" ? (
        <Trades season={season} roster={roster} shopId={shopId} setShopId={setShopId} />
      ) : null}
      {season.phase === "draft" ? <Draft season={season} /> : null}
      {season.phase === "camp" ? (
        <Camp
          season={season}
          roster={roster}
          cutIds={cutIds}
          remaining={remaining}
          campOk={campOk}
          keptQb={keptQb}
          onToggle={(id) => {
            const next = cutIds.includes(id) ? cutIds.filter((item) => item !== id) : [...cutIds, id];
            dispatch({ type: "camp-selection", cutIds: next });
          }}
          onSubmit={() => dispatch({ type: "camp", cutIds })}
          onSuggest={() => dispatch({ type: "camp-selection", cutIds: suggestedCuts(season) })}
        />
      ) : null}
      {season.phase === "regular" ? <Regular season={season} matchup={matchup} roster={roster} /> : null}
      {season.phase === "playoffs" ? <Playoffs season={season} /> : null}
      {season.phase === "recap" ? (
        <Recap
          season={season}
          fullAccess={hasFullAccess(profile)}
          career={profile.active === "career"}
          onNext={advanceYear}
          onRetire={retire}
        />
      ) : null}
      {season.phase === "fired" ? (
        <Fired
          season={season}
          career={profile.active === "career" ? profile.career : null}
          onOffers={openJobOffers}
          onJob={acceptJob}
          onRetire={retire}
        />
      ) : null}

      {(season.phase === "playoffs" || (season.phase === "regular" && season.week > 1)) ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => dispatch({ type: "sim", until: "playoffs" })}>
            Sim to the playoffs
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: "sim", until: "recap" })}>
            Finish the year
          </Button>
        </div>
      ) : null}

      <details className="rounded-xl border border-white/10 bg-card px-4 py-3">
        <summary className="cursor-pointer text-sm">Roster and the division</summary>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <ul className="space-y-1 text-sm">
            {roster.slice(0, 18).map((player) => (
              <li key={player.id} className="flex justify-between gap-3">
                <span className={player.injured ? "text-red-300" : ""}>
                  {player.pos} {player.name}
                  {player.injured ? " · out" : ""}
                </span>
                <span className="text-muted-foreground">
                  {player.ovr} · {money(player.cap)} · {formatContractYears(player.years)}
                </span>
              </li>
            ))}
          </ul>
          <ul className="space-y-1 text-sm">
            {divisionTable(season).map((row) => (
              <li key={row.id} className="flex justify-between">
                <span className={row.id === season.teamId ? "text-primary" : ""}>
                  {row.abbr} {row.name}
                </span>
                <span className="text-muted-foreground">
                  {row.wins}-{row.losses}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}

function Headlines({ season }: { season: SeasonState }) {
  return (
    <section className="grid gap-2 md:grid-cols-3">
      {season.headlines.map((headline) => (
        <article key={headline.outlet} className="rounded-xl border border-white/10 bg-card p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-primary">{headline.outletName}</p>
          <p className="mt-1 text-sm leading-snug">{headline.text}</p>
        </article>
      ))}
      <p className="text-xs text-muted-foreground md:col-span-3">Headlines are generated on this device from your decisions.</p>
    </section>
  );
}

function Intro({
  season,
  note,
  setNote,
}: {
  season: SeasonState;
  note: string;
  setNote: (value: string) => void;
}) {
  const { dispatch } = useGame();
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{season.owner.name}</p>
      <h2 className="font-display text-2xl tracking-wide">The owner wants {priorityLabel(season.owner.priority).toLowerCase()}.</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{season.owner.note}</p>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">A note in your own words, optional</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Tell them you want to win now, build young, chase stars, stay fiscal, or protect the culture."
          className="mt-1 min-h-20 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <div className="grid gap-2">
        {[
          ["embrace", "Embrace the brief", "Match the owner's stated plan. Owner confidence +8."],
          ["balance", "Split the difference", "Wins, but not at any price. Owner confidence +2."],
          ["defy", "Push back", "Tell the owner the brief is wrong. Owner confidence −6."],
        ].map(([id, label, detail]) => (
          <button
            key={id}
            type="button"
            data-testid={`choice-${id}`}
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left hover:border-primary/60"
            onClick={() => dispatch({ type: "intro", choice: id, text: note })}
          >
            <span className="block font-medium">{label}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Staff({ season, role }: { season: SeasonState; role: StaffRole }) {
  const { dispatch } = useGame();
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl tracking-wide">Hire your {ROLE_LABEL[role].toLowerCase()}</h2>
      <div className="grid gap-2">
        {season.market[role].map((member) => (
          <button
            key={member.id}
            type="button"
            data-testid={`choice-${member.id}`}
            className="rounded-xl border border-white/10 bg-card px-4 py-3 text-left hover:border-primary/60"
            onClick={() => dispatch({ type: "hire", id: member.id })}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-medium">
                {member.name}
                {member.legend ? " · already in the building" : ""}
              </span>
              <Badge variant="outline">{member.scheme}</Badge>
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">{member.blurb}</span>
            <span className="mt-2 block text-xs uppercase tracking-wider text-muted-foreground">
              Lead {member.leadership} · Develop {member.development} · Aggression {member.aggression} · Cost {member.cost}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Cap({ season, roster, space }: { season: SeasonState; roster: Player[]; space: number }) {
  const { dispatch } = useGame();
  const label = season.capMode === "payroll" ? "payroll room" : "cap space";
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-display text-2xl tracking-wide">Get under the number</h2>
        <p className={space < 0 ? "text-red-300" : "text-emerald-300"}>
          {money(space)} {label}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Limit {money(season.capLimit)}. Current-year dead money {money(season.deadMoney)}. Pushed into next year {money(season.futureDead)}.
      </p>
      <p className="text-xs text-muted-foreground">
        {season.capMode === "hard"
          ? "Hard cap: you cannot advance below $0. Current dead money clears at rollover; restructure money becomes next year's dead charge."
          : "Historical payroll guide: overspending is allowed, but the owner will penalize it."}
      </p>
      <div className="space-y-2">
        {roster.slice(0, 8).map((player) => (
          <div key={player.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-3 py-2">
            <div>
              <p className="text-sm font-medium">
                {player.pos} {player.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {player.ovr} ovr · {money(player.cap)} · {formatContractYears(player.years)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={player.years <= 0} data-testid={`choice-re-${player.id}`} onClick={() => dispatch({ type: "cap", choice: "restructure", playerId: player.id })}>
                {player.years <= 0 ? "Expired — decide in free agency" : "Restructure"}
              </Button>
              <Button variant="ghost" data-testid={`choice-cut-${player.id}`} onClick={() => dispatch({ type: "cap", choice: "cut", playerId: player.id })}>
                Cut
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button className="!h-12 !px-4" disabled={space < 0 && season.capMode === "hard"} data-testid="choice-hold" onClick={() => dispatch({ type: "cap", choice: "hold" })}>
        {space < 0 && season.capMode === "hard" ? "Still over the cap" : "Take this sheet into free agency"}
      </Button>
    </section>
  );
}

function FreeAgency({ season, space }: { season: SeasonState; space: number }) {
  const { dispatch } = useGame();
  const remainingOwnExpiring = season.faBoard.filter((player) => player.origin === season.teamId).length;
  const bestQuarterbackUnderContract = yourRoster(season)
    .filter((player) => player.pos === "QB" && player.years > 0)
    .sort((a, b) => b.ovr - a.ovr)[0];
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl tracking-wide">Wave {season.faWave} of 3</h2>
        <p className="text-sm text-muted-foreground">{money(space)} left</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {season.faWave === 1
          ? remainingOwnExpiring > 0
            ? `${remainingOwnExpiring} expiring player${remainingOwnExpiring === 1 ? "" : "s"} still need a decision. Re-sign, use your one franchise tag, or advance and let them reach the market.`
            : "Your expiring-player decisions are complete. Open the outside market when you are ready."
          : "Outside free agents after CPU-team retention. Elite starters are scarce and carry market premiums; the board includes an affordable option when one exists."}
      </p>
      {!bestQuarterbackUnderContract || bestQuarterbackUnderContract.ovr < 70 ? (
        <p className="rounded-lg border border-amber-300/30 bg-amber-300/5 px-3 py-2 text-sm text-amber-100">
          Quarterback warning: {bestQuarterbackUnderContract
            ? `your best QB already under contract is ${bestQuarterbackUnderContract.name} at ${bestQuarterbackUnderContract.ovr} overall.`
            : "you do not have a quarterback under contract."} Re-sign or tag an expiring QB now if the board offers one.
        </p>
      ) : null}
      {season.faBoard.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-muted-foreground">
          The board is empty. Move the market along.
        </p>
      ) : (
        season.faBoard.map((player) => {
          const affordable = season.capMode !== "hard" || player.cap <= space + 0.05;
          const own = player.origin === season.teamId;
          const tagPrice = Math.round((player.cap / 0.95) * 1.08 * 10) / 10;
          const tagAffordable = season.capMode !== "hard" || tagPrice <= space + 0.05;
          return (
          <div key={player.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-3 py-3">
            <div>
              <p className="font-medium">
                {player.pos} {player.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {player.ovr} ovr · age {player.age} · ask {money(player.cap)}
                {player.origin && player.origin !== season.teamId ? ` · from ${player.origin}` : " · your own"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled={!affordable} data-testid={`choice-sign-${player.id}`} onClick={() => dispatch({ type: "sign", playerId: player.id })}>
                {affordable ? (own ? "Re-sign" : "Sign") : `${own ? "Re-sign" : "Sign"}: ${money(player.cap - space)} over cap`}
              </Button>
              {own && !season.franchiseTagUsed ? (
                <Button variant="outline" disabled={!tagAffordable} data-testid={`choice-tag-${player.id}`} onClick={() => dispatch({ type: "tag", playerId: player.id })}>
                  {tagAffordable ? `Tag · ${money(tagPrice)}` : "Tag won’t fit"}
                </Button>
              ) : null}
            </div>
          </div>
          );
        })
      )}
      {season.faWave > 1 && season.capMode === "hard" && season.faBoard.length > 0 && season.faBoard.every((player) => player.cap > space + 0.05) ? (
        <p className="rounded-lg border border-amber-300/30 bg-amber-300/5 px-3 py-2 text-sm text-muted-foreground">
          No offer in this wave fits your remaining cap space. Advance the market, or continue without another signing.
        </p>
      ) : null}
      <Button variant="outline" className="!h-11" data-testid="choice-next-wave" onClick={() => dispatch({ type: "next-wave" })}>
        {season.faWave === 1 ? "Open the outside market" : season.faWave < 3 ? "Next wave" : "Close free agency"}
      </Button>
      {season.walked.length ? <p className="text-xs text-muted-foreground">Already walked: {season.walked.join(", ")}</p> : null}
    </section>
  );
}

function Trades({
  season,
  roster,
  shopId,
  setShopId,
}: {
  season: SeasonState;
  roster: Player[];
  shopId: string;
  setShopId: (id: string) => void;
}) {
  const { dispatch } = useGame();
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl tracking-wide">Three calls, and one name you can shop</h2>
      {season.tradeOffers.map((offer) => (
        <article key={offer.id} className="rounded-xl border border-white/10 bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{offer.fromTeamId} called about {offer.wantName}</p>
            <Badge variant={offer.fair === "fleece" ? "destructive" : "outline"}>{offer.fair}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{offer.blurb}</p>
          <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
            <div><dt className="inline text-foreground">You send:</dt> <dd className="inline">{offer.wantName}</dd></div>
            <div><dt className="inline text-foreground">You receive:</dt> <dd className="inline">{offer.incoming ? `${offer.incoming.name} (${offer.incoming.pos} ${offer.incoming.ovr})` : "no player"}{offer.pickRound ? ` · ${offer.pickYear} round ${offer.pickRound}` : ""}</dd></div>
          </dl>
          {!offer.incoming ? <p className="mt-2 text-xs text-amber-200">No player comes back. This return is draft compensation only.</p> : null}
          <div className="mt-3 flex gap-2">
            <Button data-testid={`choice-accept-${offer.id}`} onClick={() => dispatch({ type: "trade", offerId: offer.id, accept: true })}>
              Accept
            </Button>
            <Button variant="outline" onClick={() => dispatch({ type: "trade", offerId: offer.id, accept: false })}>
              Pass
            </Button>
          </div>
        </article>
      ))}
      {season.shop ? (
        <article className="rounded-xl border border-primary/40 bg-card p-4">
          <p className="font-medium">The market answered on {season.shop.wantName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{season.shop.blurb}</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => dispatch({ type: "shop-resolve", accept: true })}>Take the pick</Button>
            <Button variant="outline" onClick={() => dispatch({ type: "shop-resolve", accept: false })}>
              Keep him
            </Button>
          </div>
        </article>
      ) : null}
      {!season.shopUsed ? (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={shopId}
            onChange={(event) => setShopId(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-black/30 px-2 text-sm"
          >
            <option value="">Shop a player…</option>
            {roster
              .filter((player) => player.pos !== "K")
              .slice(0, 16)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.pos} {player.name} ({player.ovr})
                </option>
              ))}
          </select>
          <Button variant="outline" disabled={!shopId} onClick={() => dispatch({ type: "shop", playerId: shopId })}>
            Make the call
          </Button>
        </div>
      ) : null}
      <Button className="!h-12 !px-4" data-testid="choice-trade-done" onClick={() => dispatch({ type: "trade-done" })}>
        Close the phones and go to the draft
      </Button>
    </section>
  );
}

function Draft({ season }: { season: SeasonState }) {
  const { dispatch } = useGame();
  const [position, setPosition] = useState<"ALL" | Pos>("ALL");
  const [draftSort, setDraftSort] = useState<"grade" | "position">("grade");
  const pick = season.draftPicks[season.draftCursor];
  const board = season.prospects
    .filter((prospect) => prospect.perceived > 0 && !season.draftPicks.some((made) => made.prospectId === prospect.id))
    .filter((prospect) => position === "ALL" || prospect.pos === position)
    .sort((a, b) => draftSort === "position" ? a.pos.localeCompare(b.pos) || b.perceived - a.perceived : b.perceived - a.perceived)
    .slice(0, 8);
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl tracking-wide">
        {pick ? `Round ${pick.round}, pick ${pick.overall}` : "The board is moving"}
      </h2>
      <p className="text-sm text-muted-foreground">
        You are looking at the scout card, not the truth. Camp will show what you actually drafted. Prospects in this class are fictional.
      </p>
      <div className="flex flex-wrap gap-2 text-sm">
        <label>
          Position
          <select className="ml-2 h-10 rounded-lg border border-white/10 bg-black/30 px-2" value={position} onChange={(event) => setPosition(event.target.value as "ALL" | Pos)}>
            <option value="ALL">All</option>
            {(["QB", "RB", "WR", "TE", "OL", "DL", "EDGE", "LB", "CB", "S", "K"] satisfies Pos[]).map((pos) => <option key={pos}>{pos}</option>)}
          </select>
        </label>
        <label>
          Sort
          <select className="ml-2 h-10 rounded-lg border border-white/10 bg-black/30 px-2" value={draftSort} onChange={(event) => setDraftSort(event.target.value === "position" ? "position" : "grade")}>
            <option value="grade">Scout grade</option>
            <option value="position">Position</option>
          </select>
        </label>
      </div>
      {season.pendingDraftTrade ? (
        <article className="rounded-xl border border-primary/40 bg-card p-4">
          <p className="font-medium">{season.pendingDraftTrade.from} wants to move you back</p>
          <p className="mt-1 text-sm text-muted-foreground">
            About {season.pendingDraftTrade.slotsBack} slots in this round, plus a {season.year + 1} round {Math.min(3, (pick?.round ?? 1) + 1)} pick.
          </p>
          <p className="mt-2 text-xs text-amber-200">Answer this offer before selecting a prospect. The board is dimmed, not gone.</p>
          <div className="mt-3 flex gap-2">
            <Button data-testid="choice-trade-down" onClick={() => dispatch({ type: "draft-trade", accept: true })}>
              Trade down
            </Button>
            <Button variant="outline" onClick={() => dispatch({ type: "draft-trade", accept: false })}>
              Stay
            </Button>
          </div>
        </article>
      ) : null}
      {season.extraPicks.length ? (
        <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-muted-foreground">
          Extra picks owned: {season.extraPicks.map((extra) => `${extra.year} round ${extra.round}${extra.source ? ` (${extra.source})` : " (earlier trade)"}`).join(" · ")}
        </p>
      ) : null}
      <div className="grid gap-2">
        {board.map((prospect) => (
          <button
            key={prospect.id}
            type="button"
            disabled={Boolean(season.pendingDraftTrade)}
            data-testid={`choice-draft-${prospect.id}`}
            className="rounded-xl border border-white/10 bg-card px-4 py-3 text-left hover:border-primary/60 disabled:opacity-50"
            onClick={() => dispatch({ type: "draft", prospectId: prospect.id })}
          >
            <span className="flex items-center justify-between">
              <span className="font-medium">
                {prospect.pos} {prospect.name}
              </span>
              <span className="font-display text-xl text-primary">{prospect.perceived}</span>
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {prospect.college} · age {prospect.age} · scout grade
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">After your featured picks, the scouting staff fills later rounds by roster need. Every automatic selection appears in the draft log and camp roster.</p>
      {season.draftPicks.filter((made) => made.teamId === season.teamId && made.prospectName).length ? (
        <ul className="text-sm text-muted-foreground">
          {season.draftPicks
            .filter((made) => made.prospectName && made.teamId === season.teamId)
            .map((made) => (
              <li key={`${made.round}-${made.overall}`}>
                Round {made.round}: {made.prospectName}{made.note ? ` · ${made.note}` : ""}
              </li>
            ))}
        </ul>
      ) : null}
    </section>
  );
}

function Camp({
  season,
  roster,
  cutIds,
  remaining,
  campOk,
  keptQb,
  onToggle,
  onSubmit,
  onSuggest,
}: {
  season: SeasonState;
  roster: Player[];
  cutIds: string[];
  remaining: number;
  campOk: boolean;
  keptQb: boolean;
  onToggle: (id: string) => void;
  onSubmit: () => void;
  onSuggest: () => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl tracking-wide">Get to 26</h2>
        <p className={campOk ? "text-emerald-300" : "text-red-300"}>{remaining} kept</p>
      </div>
      <p className="text-sm text-muted-foreground">Check the players you are cutting. Land between 22 and 26, and keep a quarterback.</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={onSuggest}>Select suggested cuts</Button>
        <span className="text-xs text-muted-foreground">{cutIds.length ? `${cutIds.length} selected to cut` : "No cuts selected yet"}</span>
      </div>
      {!keptQb ? <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm">Keep at least one quarterback before opening the season.</p> : null}
      <section className="rounded-xl border border-white/10 bg-black/20 p-3" aria-label="Your draft class">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Draft class added to camp</p>
        <ul className="mt-2 space-y-1 text-sm">
          {season.draftPicks
            .filter((pick) => pick.teamId === season.teamId && pick.prospectName)
            .map((pick) => (
              <li key={`${pick.round}-${pick.overall}-${pick.prospectId}`}>
                Round {pick.round}: {pick.prospectName}{pick.note ? ` · ${pick.note}` : ""}
              </li>
            ))}
        </ul>
      </section>
      <div className="grid gap-1">
        {roster.map((player) => {
          const cut = cutIds.includes(player.id);
          return (
            <label key={player.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5">
              <span className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={cut} onChange={() => onToggle(player.id)} />
                <span className={cut ? "text-muted-foreground line-through" : ""}>
                  {player.pos} {player.name}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                {player.ovr}
                {player.drafted && player.perceived ? ` · scout ${player.perceived}` : ""} · {money(player.cap)}
              </span>
            </label>
          );
        })}
      </div>
      <Button className="!h-12 !px-4" disabled={!campOk} data-testid="choice-camp" onClick={onSubmit}>
        Open the season
      </Button>
    </section>
  );
}

function Regular({
  season,
  matchup,
  roster,
}: {
  season: SeasonState;
  matchup: { week: number; home: string; away: string } | null;
  roster: Player[];
}) {
  const { dispatch } = useGame();
  const decision = season.activeDecision;
  const opp = matchup ? (matchup.home === season.teamId ? matchup.away : matchup.home) : null;
  const home = matchup?.home === season.teamId;
  const recentGames = season.results
    .filter((game) => game.round === "regular" && (game.home === season.teamId || game.away === season.teamId))
    .slice(-4)
    .reverse();
  return (
    <section className="space-y-3">
      {decision ? (
        <div className="space-y-3 rounded-2xl border border-primary/30 bg-card p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-primary">{decision.kicker}</p>
          <h2 className="font-display text-3xl tracking-wide">{decision.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{decision.body}</p>
          {decision.options.map((option) => (
            <button
              key={option.id}
              type="button"
              data-testid={`choice-${option.id}`}
              className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left hover:border-primary/60"
              onClick={() => dispatch({ type: "decide", choiceId: option.id })}
            >
              <span className="block font-medium">{option.label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{option.detail}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-card p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Week {season.week}</p>
          <h2 className="mt-1 font-display text-4xl tracking-wide">
            {opp ? (
              <>
                {home ? "vs" : "at"} {teamLabel(teamById(opp, season.directory))}
              </>
            ) : (
              "Open date"
            )}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The rest of the league plays the same week. A win moves the owner. A collapse can end the job before February.
          </p>
          <Button className="mt-4 !h-12 !px-5" data-testid="play-week" onClick={() => dispatch({ type: "play-week" })}>
            Play the week
          </Button>
        </div>
      )}
      {recentGames.length ? (
        <section aria-label="Recent scores">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Recent scores</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {recentGames.map((game) => {
              const yourScore = game.home === season.teamId ? game.homeScore : game.awayScore;
              const theirScore = game.home === season.teamId ? game.awayScore : game.homeScore;
              const opponentId = game.home === season.teamId ? game.away : game.home;
              const won = yourScore > theirScore;
              return (
                <div key={`${game.week}-${game.home}`} className={`rounded-xl border p-3 ${won ? "border-emerald-400/30 bg-emerald-400/5" : "border-red-400/30 bg-red-400/5"}`}>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Week {game.week} · {won ? "Win" : "Loss"}</p>
                  <p className="mt-1 font-display text-2xl tracking-wide">{yourScore}–{theirScore}</p>
                  <p className="text-xs text-muted-foreground">{game.home === season.teamId ? "vs" : "at"} {teamLabel(teamById(opponentId, season.directory))}</p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      <section className="rounded-xl border border-white/10 bg-card p-3" aria-label="Injury report">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Injury report</p>
        {roster.some((player) => player.injured || player.limited) ? (
          <ul className="mt-2 space-y-1 text-sm">
            {roster.filter((player) => player.injured || player.limited).map((player) => (
              <li key={player.id} className={player.injured ? "text-red-300" : "text-amber-200"}>
                {player.pos} {player.name} · {player.injured ? "Out" : "Active, reduced effectiveness"}
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-sm text-emerald-300">No players currently listed out.</p>}
      </section>
    </section>
  );
}

function Playoffs({ season }: { season: SeasonState }) {
  const { dispatch } = useGame();
  const playoff = season.playoff;
  const yours = playoff?.pending.find((game) => game.home === season.teamId || game.away === season.teamId);
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-primary">{playoff ? formatPlayoffRound(playoff.round) : "Playoffs"}</p>
      <h2 className="font-display text-3xl tracking-wide">{playoff?.bye && !yours ? "You have the bye" : "The bracket is live"}</h2>
      <ul className="space-y-1 text-sm">
        {(playoff?.seeds.AFC ?? []).map((seed) => (
          <li key={`A-${seed.teamId}`} className={seed.teamId === season.teamId ? "text-primary" : ""}>
            AFC {seed.seed}. {teamById(seed.teamId, season.directory).abbr}
          </li>
        ))}
        {(playoff?.seeds.NFC ?? []).map((seed) => (
          <li key={`N-${seed.teamId}`} className={seed.teamId === season.teamId ? "text-primary" : ""}>
            NFC {seed.seed}. {teamById(seed.teamId, season.directory).abbr}
          </li>
        ))}
      </ul>
      {yours ? (
        <p className="text-sm">
          Your game: {teamById(yours.away, season.directory).abbr} at {teamById(yours.home, season.directory).abbr}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">The other games sort the path. Advance the round when you are ready.</p>
      )}
      <Button className="!h-12 !px-4" data-testid="play-week" onClick={() => dispatch({ type: "playoff" })}>
        {yours ? "Play your game" : "Advance the round"}
      </Button>
    </section>
  );
}

function Recap({
  season,
  fullAccess,
  career,
  onNext,
  onRetire,
}: {
  season: SeasonState;
  fullAccess: boolean;
  career: boolean;
  onNext: () => void;
  onRetire: () => void;
}) {
  const grade = season.grade;
  const lines = advancedLines(season);
  const rows = standings(season).slice(0, 8);
  const superBowl = season.results.find((game) => game.round === "superbowl");
  const playedSuperBowl = Boolean(superBowl && (superBowl.home === season.teamId || superBowl.away === season.teamId));
  const finish = grade?.champ ? "Champion" : grade?.round === "missed" ? "Missed playoffs" : grade?.round ? formatPlayoffRound(grade.round) : "Season complete";
  const drivers = seasonDrivers(season);
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-primary/40 bg-card p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">GM grade</p>
        <p className="font-display text-7xl leading-none tracking-wide">{grade?.letter ?? "—"}</p>
        <p className="mt-2 font-display text-2xl tracking-wide">
          {grade?.wins}-{grade?.losses} · {finish}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{grade?.headline}</p>
        {season.mode === "historical" ? (
          <p className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-muted-foreground">
            Historical goal: win the championship. Ultimate: finish undefeated and win it all. These are gameplay targets, not claims about the real season.
          </p>
        ) : null}
        {superBowl ? (
          <p className="mt-3 text-sm">
            {playedSuperBowl ? "Your Super Bowl" : "League Super Bowl (your season was already over)"}: {teamLabel(teamById(superBowl.away, season.directory))} {superBowl.awayScore} · {teamLabel(teamById(superBowl.home, season.directory))} {superBowl.homeScore}
          </p>
        ) : null}
        <p className="mt-3 text-sm">Best call: {grade?.best}</p>
        <p className="text-sm text-muted-foreground">The one that stuck: {grade?.worst}</p>
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Why the season ended this way</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {drivers.map((driver) => <li key={driver}>• {driver}</li>)}
          </ul>
        </div>
      </div>
      <ShareCard
        kicker={`${season.year} ${teamById(season.teamId, season.directory).abbr}`}
        title={`${grade?.letter ?? "—"} · ${grade?.champ ? "CHAMP" : (grade?.round ?? "missed").toUpperCase()}`}
        line={`${grade?.wins ?? 0}-${grade?.losses ?? 0}`}
        text={seasonShareText(season)}
      />
      {fullAccess ? (
        <div className="rounded-xl border border-white/10 bg-card p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Advanced</p>
          <p className="mt-2">Pythagorean wins {lines.pythWins}</p>
          <p>Point differential {lines.diff}</p>
          <p>Roster value {lines.rosterValue}</p>
          <p>
            Cap space {money(lines.cap)} · current dead {money(lines.dead)} · pushed to next year {money(season.futureDead)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Start a new season to see the advanced lines.
        </p>
      )}
      <ul className="text-sm text-muted-foreground">
        {rows.map((row) => (
          <li key={row.id}>
            {row.abbr} {row.wins}-{row.losses}
          </li>
        ))}
      </ul>
      {career ? (
        <div className="flex flex-wrap gap-2">
          <Button className="!h-12 !px-4" onClick={onNext}>
            Open the next season
          </Button>
          <Button variant="outline" className="!h-12 !px-4" onClick={onRetire}>
            Retire and write the retrospective
          </Button>
        </div>
      ) : (
        <Button variant="outline" className="!h-11" nativeButton={false} render={<Link href="/season" />}>
          Run it back with another team
        </Button>
      )}
    </section>
  );
}

function Fired({
  season,
  career,
  onOffers,
  onJob,
  onRetire,
}: {
  season: SeasonState;
  career: { jobOffers: { teamId: string; teamName: string; blurb: string }[]; status: string } | null;
  onOffers: () => void;
  onJob: (teamId: string) => void;
  onRetire: () => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-red-400/40 bg-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-red-300">The owner pulled the chair</p>
      <h2 className="font-display text-4xl tracking-wide">You are fired.</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{season.firedReason}</p>
      <p className="text-sm">
        Final line: {season.grade?.wins ?? 0}-{season.grade?.losses ?? 0}. Grade {season.grade?.letter ?? "F"}.
      </p>
      {career && career.status === "active" ? (
        <div className="space-y-2">
          {career.jobOffers.length === 0 ? (
            <Button className="!h-11" onClick={onOffers}>
              See who else will take the call
            </Button>
          ) : (
            career.jobOffers.map((offer) => (
              <button
                key={offer.teamId}
                type="button"
                data-testid={`team-card-${offer.teamId}`}
                className="block w-full rounded-xl border border-white/10 px-4 py-3 text-left hover:border-primary/60"
                onClick={() => onJob(offer.teamId)}
              >
                <span className="font-medium">{offer.teamName}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{offer.blurb}</span>
              </button>
            ))
          )}
          <Button variant="ghost" onClick={onRetire}>
            Walk away and file the career retrospective
          </Button>
        </div>
      ) : (
        <Button className="!h-11" nativeButton={false} render={<Link href="/season" />}>
          Take another one-year job
        </Button>
      )}
    </section>
  );
}
