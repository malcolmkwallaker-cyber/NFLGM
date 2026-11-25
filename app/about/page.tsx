import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About the Football GM Game",
  description: "Learn who makes Run The Roster, how to play, and what its football simulation represents.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
        <Image src="/brand/run-the-roster-football-logo-header.png" alt="Run The Roster football logo" width={360} height={240} className="mb-4 h-auto w-28" unoptimized />
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">About Run The Roster</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">Take the front-office chair.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Run The Roster is a browser-based football management game published by Malcolm Wallaker. It is built for an
          adult audience and is not directed at children. The site does not currently perform age verification.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
        <h2 className="font-display text-3xl tracking-wide">What makes a good move?</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>The project’s first recorded build dates to October 17, 2026. The game puts you in the front office: you make roster decisions and the simulation plays the games. The interesting part is that a good move depends on what you are trying to do. A team that can win now might pay a future pick for a starter. A rebuilding team might be better off keeping the pick, giving a young player snaps, and saving room for later.</p>
          <p>One useful way to start is to name what the roster needs and what you can live without. If the owner wants immediate results but the cap is tight, you might have room for one signing, not three. Look at who would actually start and where a cheaper player can do the job. A flashy trade matters less if it leaves you unable to fill a more important hole.</p>
          <p>People in the game can react differently to the same choice. A trade grade reflects the football assets changing hands. The owner might care about the club’s direction, while fans may care about keeping a familiar player. The locker room has its own reaction. Check those signals separately when you decide to take or pass on a deal.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
        <h2 className="font-display text-3xl tracking-wide">Where to start</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>Start with Daily if you want to see how the game thinks. Take a minute to read why the team is making a decision now, pick the move you would make, and compare the reasoning afterward. You do not need to know the real historical outcome to think through what the club gives up and what it gets back.</p>
          <p>Play Single Season if you want to see how decisions connect over a year. Hiring staff, signing players, trading, drafting and making camp cuts all affect the team you take into the season. Review how that team did and whether the result matched the job the owner asked you to do. With Career, those choices follow you into later seasons. An expensive deal that looks fine now can affect whom you keep next year.</p>
          <p>If you have a favorite team or era, look at Historical Seasons or the current Historic Turnaround. Historical scenarios can include a smaller roster than the real team and financial rules that differ from a modern setup. The notes on each scenario tell you what the game sourced and what it models. Use the real result as context, not as a script you have to follow.</p>
          <p>The <Link href="/guides/" className="underline underline-offset-4">guides</Link> explain how to choose a mode and the <Link href="/faq/" className="underline underline-offset-4">FAQ</Link> covers saving and scoring. If something looks wrong, the details on the <Link href="/contact/" className="underline underline-offset-4">Contact page</Link> can help you report it. Tell us the year, team, and last choice you made so we can understand what happened.</p>
        </div>
      </section>

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
          <p>Your save stays in this browser. The game has no player account, cloud save, or global leaderboard.</p>
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
