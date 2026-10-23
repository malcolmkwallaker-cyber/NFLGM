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
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/season"
              data-testid="home-season-cta"
              className="rounded-xl border border-primary/50 bg-primary/10 p-4 transition-colors hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="text-[11px] uppercase tracking-[0.18em] text-primary">Season Mode</span>
              <span className="mt-1 block font-display text-3xl tracking-wide">Run one full season</span>
              <span className="mt-2 block text-sm text-muted-foreground">Hire, trade, draft, and chase the Super Bowl.</span>
              <span className="mt-4 block text-sm font-medium text-primary">Play Single Season →</span>
            </Link>
            <Link
              href="/career"
              data-testid="home-career-cta"
              className="rounded-xl border border-primary bg-primary p-4 text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="text-[11px] uppercase tracking-[0.18em] opacity-75">Career GM · Free playtest</span>
              <span className="mt-1 block font-display text-3xl tracking-wide">Build a dynasty</span>
              <span className="mt-2 block text-sm opacity-80">Play year after year, survive firings, and leave a legacy.</span>
              <span className="mt-4 block text-sm font-medium">Play Career Mode →</span>
            </Link>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/daily" data-testid="home-daily-cta" className={cn(buttonVariants({ variant: "outline" }), "!h-12 !px-4")}>
              Play Daily #{puzzle}
            </Link>
            {season ? (
              <Link href="/play" className={cn(buttonVariants({ variant: "ghost" }), "!h-12 !px-4")}>
                Back to the active desk
              </Link>
            ) : null}
          </div>
          {ready ? (
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Streak {profile.daily.streak} · best {profile.daily.bestStreak}
              {FREE_TESTING_MODE ? " · Public playtest" : profile.pro ? " · Full access" : " · Free"}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Mode
          href="/season"
          kicker="Free · one season"
          title="Single Season Mode"
          body="One team, one year. Owner, fans, locker room, and three outlets that will not stay quiet."
          prominent
        />
        <Mode
          href="/career"
          kicker="Free · public playtest"
          title="Career GM Mode"
          body="Play year after year, change jobs after a firing, build a résumé, and write your GM legacy."
          prominent
        />
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
    </div>
  );
}

function Mode({
  href,
  kicker,
  title,
  body,
  prominent = false,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
  prominent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-2xl border bg-card p-5 hover:border-primary/60",
        prominent ? "border-primary/30" : "border-white/10",
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-primary">{kicker}</p>
      <h2 className="mt-2 font-display text-2xl tracking-wide">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </Link>
  );
}
