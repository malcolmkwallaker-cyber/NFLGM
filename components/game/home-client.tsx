"use client";

import Link from "next/link";
import { DAILY_CHALLENGES } from "@/lib/data/daily-challenges";
import { useGame } from "@/components/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { FREE_TESTING_MODE } from "@/lib/access";

export function HomeClient({
  day,
  puzzle,
  challengeId,
}: {
  day: string;
  puzzle: number;
  challengeId: string;
}) {
  const { profile, ready, season } = useGame();
  const challenge = DAILY_CHALLENGES.find((item) => item.id === challengeId) ?? DAILY_CHALLENGES[0];
  const dailyComplete = profile.daily.results.some((result) => result.date === day);

  return (
    <div className="space-y-8">
      <section className="yard-lines overflow-hidden rounded-2xl border border-white/10 bg-card">
        <div className="border-b border-primary/30 bg-primary/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-primary">
          Live from the war room
        </div>
        <div className="space-y-4 px-5 py-6">
          <h1 className="max-w-xl font-display text-5xl leading-[0.9] tracking-wide sm:text-6xl">
            Call the shot. Live with it in January.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            One real front-office decision every morning, then a full season if you want the chair: hire the staff,
            spend the cap, draft, and find out whether the owner still likes you in February.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <HomeMode
              href="/daily"
              testId="home-daily-cta"
              kicker="Daily Challenge · Free"
              title="Make today’s call"
              body="One real front-office decision, an instant grade, and the story of what happened next."
              action={dailyComplete ? "View today’s result →" : `Play Daily #${puzzle} →`}
            />
            <HomeMode
              href="/season"
              testId="home-season-cta"
              kicker="Single Season · Free"
              title="Run one full season"
              body="Hire, trade, draft, manage the locker room, and chase the Super Bowl."
              action="Play Season Mode →"
            />
            <HomeMode
              href="/career"
              testId="home-career-cta"
              kicker="Career GM · Free"
              title="Build a dynasty"
              body="Play year after year, survive firings, change teams, and leave a legacy."
              action="Play Career Mode →"
            />
          </div>
          {season ? (
            <Link href="/play" className={cn(buttonVariants({ variant: "outline" }), "!h-12 !px-4")}>
              Back to the active desk
            </Link>
          ) : null}
          {ready ? (
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Streak {profile.daily.streak} · best {profile.daily.bestStreak}
              {FREE_TESTING_MODE ? " · Public playtest" : profile.pro ? " · Full access" : " · Free"}
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Today · {day}</p>
            <h2 className="mt-1 font-display text-3xl tracking-wide">{challenge.title}</h2>
          </div>
          <Badge variant="outline">{challenge.category}</Badge>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {challenge.year} · {challenge.teamName}. Puzzle {puzzle} in the rotation. The grade is hindsight, and the
          result says so.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {DAILY_CHALLENGES.length} real situations rotate every day. The Daily Challenge stays free and available.
        </p>
        <Button className="mt-4 !h-11" nativeButton={false} render={<Link href="/daily" />}>
          Make the call
        </Button>
      </section>

      <section className="rounded-2xl border border-primary/30 bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">New daily mode</p>
          <h2 className="mt-1 font-display text-3xl tracking-wide">Rewrite a historic season</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Take one shared, sourced season setup and try to beat the real result in a deterministic simulation.
          </p>
        </div>
        <Button className="mt-4 !h-11 sm:mt-0" nativeButton={false} render={<Link href="/turnaround" />}>
          Today’s turnaround
        </Button>
      </section>
    </div>
  );
}

function HomeMode({
  href,
  kicker,
  title,
  body,
  action,
  testId,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
  action: string;
  testId: string;
}) {
  return (
    <Link
      href={href}
      data-testid={testId}
      className="flex min-h-52 flex-col rounded-xl border border-primary/40 bg-black/20 p-4 transition-transform hover:-translate-y-0.5 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="text-[11px] uppercase tracking-[0.18em] text-primary">{kicker}</span>
      <span className="mt-2 block font-display text-3xl tracking-wide">{title}</span>
      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{body}</span>
      <span className="mt-auto block pt-5 text-sm font-medium text-primary">{action}</span>
    </Link>
  );
}
