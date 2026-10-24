import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">About Run The Roster</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">Take the front-office chair.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Run The Roster is a browser-based football management game published by Malcolm Wallaker. It is built for an
          adult audience and is not directed at children. The site does not currently perform age verification.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
        <h2 className="font-display text-3xl tracking-wide">How to play</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-primary">1 · Daily</p>
            <p className="mt-2 text-sm leading-relaxed">Make one historical or clearly labeled fictional front-office decision, then review the result and reasoning.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-primary">2 · Season</p>
            <p className="mt-2 text-sm leading-relaxed">Choose a team, hire a staff, manage the cap, trade, draft, cut the roster, and play through one complete season.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-primary">3 · Career</p>
            <p className="mt-2 text-sm leading-relaxed">Carry the job into future seasons, manage expiring deals, survive owner expectations, change teams, or retire with a retrospective.</p>
          </li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/daily" />}>Play today&apos;s challenge</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/career" />}>Start a career</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
        <h2 className="font-display text-3xl tracking-wide">What the simulation represents</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>Schedules, ratings, cap figures, contracts, free-agent markets, draft classes, game results, and many staff members are modeled or fictional unless a screen says otherwise.</p>
          <p>Historical modes use sourced team-season roster snapshots where available, but ratings, salaries, contracts, opponents, and simulated results remain game mechanics rather than historical facts.</p>
          <p>Your save stays in this browser. There is no player account, cloud save, or connected global leaderboard in the current public playtest.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
        <h2 className="font-display text-3xl tracking-wide">Independent fan game</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Run The Roster is unofficial. It is not affiliated with, endorsed by, or connected to the National Football
          League or any of its teams. Team references use names, abbreviations, colors, and sourced historical context;
          the site does not present team logos as its own branding.
        </p>
      </section>
    </div>
  );
}
