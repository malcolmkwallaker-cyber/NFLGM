"use client";

import { useState } from "react";
import { GRADE_EMOJI, GRADE_WORD, fieldSize, optionById, rankFor } from "@/lib/engine/daily";
import { DAILY_CHALLENGES } from "@/lib/data/daily-challenges";
import { dailyShareText } from "@/lib/share";
import { useGame } from "@/components/profile";
import { ShareCard } from "@/components/game/share-card";
import { Badge } from "@/components/ui/badge";
import type { GradeColor } from "@/lib/types";

const GRADE_CLASS: Record<GradeColor, string> = {
  green: "border-emerald-400/70 bg-emerald-400/10",
  yellow: "border-amber-300/70 bg-amber-300/10",
  orange: "border-orange-400/70 bg-orange-400/10",
  red: "border-red-400/70 bg-red-400/10",
};

export function DailyClient({
  day,
  puzzle,
  challengeId,
}: {
  day: string;
  puzzle: number;
  challengeId: string;
}) {
  const { profile, ready, playDaily } = useGame();
  const [locked, setLocked] = useState<string | null>(null);
  const today = day;
  const challenge = DAILY_CHALLENGES.find((item) => item.id === challengeId) ?? DAILY_CHALLENGES[0];
  const saved = profile.daily.results.find((row) => row.date === today);
  const optionId = saved?.optionId ?? locked;
  const option = optionId ? optionById(challenge, optionId) : null;
  const revealed = Boolean(saved) || Boolean(locked && option);

  if (!ready) return <p className="text-sm text-muted-foreground">Setting the board…</p>;

  function choose(id: string) {
    if (saved || locked) return;
    setLocked(id);
    playDaily(id, today);
  }

  const result = profile.daily.results.find((row) => row.date === today);
  const recent = profile.daily.results.slice(-12);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Daily #{puzzle} · {today}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{challenge.category}</Badge>
          <Badge variant="secondary">
            {challenge.year} {challenge.team}
          </Badge>
        </div>
        <h1 className="mt-3 font-display text-4xl leading-none tracking-wide sm:text-5xl">{challenge.title}</h1>
      </header>

      <p className="text-sm leading-relaxed text-muted-foreground">{challenge.situation}</p>
      <p className="text-base font-medium">{challenge.question}</p>

      <div className="space-y-2">
        {challenge.options.map((item) => {
          const show = revealed && option?.id === item.id;
          const actual = revealed && item.id === challenge.actualOptionId;
          return (
            <button
              key={item.id}
              type="button"
              data-testid={`daily-option-${item.id}`}
              disabled={revealed}
              onClick={() => choose(item.id)}
              className={`block w-full rounded-xl border px-4 py-3 text-left ${
                show ? GRADE_CLASS[item.grade] : "border-white/10 bg-card hover:border-primary/50"
              } disabled:cursor-default`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.detail}</span>
                </span>
                {show ? <span className="font-display text-2xl">{GRADE_EMOJI[item.grade]}</span> : null}
              </span>
              {revealed && (show || actual) ? (
                <span className="mt-2 block text-sm">
                  {show ? `${GRADE_WORD[item.grade]}. ${item.why}` : "This is the call the real front office made."}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {result && option ? (
        <div className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-card p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">What happened</p>
            <p className="mt-2 text-sm leading-relaxed">{challenge.whatHappened}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              This grade is hindsight. It scores how the move turned out, not whether it was the percentage play on the
              day. The call resembles {option.echo}.
            </p>
            <p className="mt-3 font-display text-2xl tracking-wide">
              Better than {result.percentile}% · rank {rankFor(result.percentile, today).toLocaleString()} of{" "}
              {fieldSize(today).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              The field is modeled from how often each call gets made. There is no live server yet. Streak {profile.daily.streak}.
            </p>
          </section>
          <ShareCard
            kicker={`Daily #${puzzle} · ${challenge.category}`}
            title={GRADE_WORD[option.grade]}
            grade={option.grade}
            line={`Better than ${result.percentile}% · streak ${profile.daily.streak}`}
            text={dailyShareText({
              puzzle,
              category: challenge.category,
              grade: option.grade,
              percentile: result.percentile,
              streak: profile.daily.streak,
              date: today,
              challengeId: challenge.id,
              optionId: option.id,
            })}
          />
        </div>
      ) : null}

      <section>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Recent calls</p>
        <p className="mt-2 font-display text-2xl tracking-widest">
          {recent.length
            ? recent.map((row) => GRADE_EMOJI[row.grade]).join("")
            : "No cards yet"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{DAILY_CHALLENGES.length} challenges in the rotation. A new one at midnight UTC.</p>
      </section>
    </div>
  );
}
