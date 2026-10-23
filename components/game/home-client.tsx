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
          <div className="flex flex-wrap gap-2">
            <Link href="/daily" className={cn(buttonVariants(), "!h-12 !px-4")}>
              Play Daily #{puzzle}
            </Link>
            <Link href={season ? "/play" : "/season"} className={cn(buttonVariants({ variant: "outline" }), "!h-12 !px-4")}>
              {season ? "Back to the desk" : "Take a team"}
            </Link>
          </div>
          {ready ? (
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Streak {profile.daily.streak} · best {profile.daily.bestStreak}
              {FREE_TESTING_MODE ? " · Public playtest" : profile.pro ? " · Full access" : " · Free"}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Mode
          href="/daily"
          kicker="Free · every day"
          title="Daily GM Challenge"
          body={`${DAILY_CHALLENGES.length} real situations. Same puzzle for everyone. A color grade, the real ending, and a share card.`}
        />
        <Mode
          href="/season"
          kicker="Free · one season"
          title="Offseason to the Super Bowl"
          body="One team, one year. Owner, fans, locker room, and three outlets that will not stay quiet."
        />
        <Mode
          href="/career"
          kicker="Free · public playtest"
          title="Career, history, leagues"
          body="Multi-year file, famous teams, a Wikipedia page, and a private room where friends paste the same card."
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
        <Button className="mt-4 !h-11" nativeButton={false} render={<Link href="/daily" />}>
          Make the call
        </Button>
      </section>
    </div>
  );
}

function Mode({ href, kicker, title, body }: { href: string; kicker: string; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-white/10 bg-card p-4 hover:border-primary/50">
      <p className="text-[11px] uppercase tracking-[0.16em] text-primary">{kicker}</p>
      <h2 className="mt-2 font-display text-2xl tracking-wide">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </Link>
  );
}
