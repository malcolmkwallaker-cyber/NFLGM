"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GRADE_EMOJI, GRADE_WORD, optionById } from "@/lib/engine/daily";
import { DAILY_CHALLENGES } from "@/lib/data/daily-challenges";
import { dailyShareText } from "@/lib/share";
import { useGame } from "@/components/profile";
import { ShareCard } from "@/components/game/share-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GradeColor } from "@/lib/types";

const MODE_PROMPT_KEY = "nfl-gm-mode-prompt-v1";
const RESULT_READING_TIME_MS = 5000;

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
  const [showModes, setShowModes] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const promptedRef = useRef(false);
  const today = day;
  const challenge = DAILY_CHALLENGES.find((item) => item.id === challengeId) ?? DAILY_CHALLENGES[0];
  const saved = profile.daily.results.find((row) => row.date === today);
  const optionId = saved?.optionId ?? locked;
  const option = optionId ? optionById(challenge, optionId) : null;
  const revealed = Boolean(saved) || Boolean(locked && option);
  const result = profile.daily.results.find((row) => row.date === today);
  const promptId = result ? `${result.date}:${result.challengeId}:${result.optionId}` : null;

  useEffect(() => {
    if (!ready || !locked || !result || !option || !promptId || promptedRef.current) return;
    if (window.localStorage.getItem(MODE_PROMPT_KEY) === promptId) return;

    promptedRef.current = true;
    const resultNode = resultRef.current;
    resultNode?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });

    let timer = 0;
    const openPrompt = () => {
      window.localStorage.setItem(MODE_PROMPT_KEY, promptId);
      setShowModes(true);
    };
    const startTimer = () => {
      if (!timer) timer = window.setTimeout(openPrompt, RESULT_READING_TIME_MS);
    };
    const stopTimer = () => {
      window.clearTimeout(timer);
      timer = 0;
    };

    if (!resultNode || typeof IntersectionObserver === "undefined") {
      startTimer();
      return stopTimer;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startTimer();
        else stopTimer();
      },
      { threshold: 0.45 },
    );
    observer.observe(resultNode);
    return () => {
      stopTimer();
      observer.disconnect();
    };
  }, [locked, option, promptId, ready, result]);

  if (!ready) return <p className="text-sm text-muted-foreground">Setting the board…</p>;

  function choose(id: string) {
    if (saved || locked) return;
    setLocked(id);
    playDaily(id, today);
  }

  const recent = profile.daily.results.slice(-12);
  const calendar = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).slice(0, 1),
      result: profile.daily.results.find((row) => row.date === key),
      frozen: profile.daily.frozenDates?.includes(key) ?? false,
    };
  });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Daily #{puzzle} · {today}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{challenge.category}</Badge>
          <Badge variant="secondary">
            {challenge.fictional ? "Fictional front office" : `${challenge.year} ${challenge.team}`}
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
                  {show ? `${GRADE_WORD[item.grade]}. ${item.why}` : challenge.fictional ? "This is the highest-scoring process call." : "This is the call the real front office made."}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {result && option ? (
        <div className="space-y-4">
          <section
            ref={resultRef}
            tabIndex={-1}
            data-testid="daily-result"
            className="scroll-mt-20 rounded-2xl border border-white/10 bg-card p-4 outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <p data-testid="daily-result-verdict" className="font-display text-2xl tracking-wide" role="status">
              {option.grade === "green" ? "You got the call right." : "Not the best call this time."}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-primary">{challenge.fictional ? "Decision review" : "What happened"}</p>
            <p className="mt-2 text-sm leading-relaxed">{challenge.whatHappened}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              This grade is hindsight. It scores how the move turned out, not whether it was the percentage play on the
              day. The call resembles {option.echo}.
            </p>
            <p className="mt-3 font-display text-2xl tracking-wide">{GRADE_EMOJI[option.grade]} · Streak {profile.daily.streak}</p>
            <p className="text-xs text-muted-foreground">This result and streak are saved on this device. No global rank is shown because scores are not uploaded.</p>
          </section>
          <ShareCard
            kicker={`Daily #${puzzle} · ${challenge.category}`}
            title={GRADE_WORD[option.grade]}
            grade={option.grade}
            line={`${GRADE_EMOJI[option.grade]} · streak ${profile.daily.streak}`}
            text={dailyShareText({
              puzzle,
              category: challenge.category,
              grade: option.grade,
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

      <section className="rounded-xl border border-white/10 bg-card p-4" aria-label="Seven-day Daily calendar">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Last seven days</p>
          <p className="text-xs text-muted-foreground">❄️ {profile.daily.freezeTokens ?? 0} available</p>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {calendar.map((day) => (
            <div key={day.key} className="rounded-lg border border-white/10 bg-black/20 p-2 text-center" title={day.key}>
              <span className="block text-[10px] uppercase text-muted-foreground">{day.label}</span>
              <span className="mt-1 block text-lg" aria-label={day.result ? `Played ${day.key}` : day.frozen ? `Streak freeze used ${day.key}; not played` : `Not played ${day.key}`}>
                {day.result ? GRADE_EMOJI[day.result.grade] : day.frozen ? "❄️" : "·"}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Earn one freeze after every seven completed challenges, up to two. A freeze automatically covers one missed day and is marked ❄️—not as a played result.
        </p>
      </section>

      <Dialog open={showModes} onOpenChange={setShowModes}>
        <DialogContent
          data-testid="daily-mode-prompt"
          finalFocus={resultRef}
          className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg"
        >
          <DialogHeader className="pr-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Your result is saved</p>
            <DialogTitle className="font-display text-3xl tracking-wide">
              {option?.grade === "green" ? "Ready to run the whole team?" : "Make the next call from the big chair."}
            </DialogTitle>
            <DialogDescription>
              The explanation and share card stay on this page. Choose a one-year run or build a multi-season career—both
              are free during the public playtest.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              className="!h-auto min-h-24 items-start justify-start whitespace-normal px-4 py-3 text-left"
              nativeButton={false}
              render={<Link href="/season" data-testid="daily-mode-season" />}
            >
              <span>
                <span className="block font-display text-xl tracking-wide">Play Single Season</span>
                <span className="mt-1 block text-xs font-normal opacity-80">One team, one year, one shot at the title.</span>
              </span>
            </Button>
            <Button
              variant="outline"
              className="!h-auto min-h-24 items-start justify-start whitespace-normal px-4 py-3 text-left"
              nativeButton={false}
              render={<Link href="/career" data-testid="daily-mode-career" />}
            >
              <span>
                <span className="block font-display text-xl tracking-wide">Start Career GM</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">Keep the job, change teams, build a legacy.</span>
              </span>
            </Button>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" data-testid="daily-mode-dismiss" />}>
              Not now—keep reading
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
