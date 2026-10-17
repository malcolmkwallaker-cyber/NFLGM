"use client";

import { useState } from "react";
import { GRADE_EMOJI, GRADE_WORD } from "@/lib/engine/daily";
import type { GradeColor } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function ShareCard({
  kicker,
  title,
  grade,
  line,
  text,
}: {
  kicker: string;
  title: string;
  grade?: GradeColor;
  line: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div data-testid="share-card" className="overflow-hidden rounded-xl border border-white/10 bg-[#101826]">
      <div className="border-b border-white/10 bg-primary px-4 py-2 font-display text-sm tracking-[0.18em] text-primary-foreground">
        NFL GM CAREER
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
        <p className="font-display text-2xl leading-none tracking-wide">{title}</p>
        {grade ? (
          <p className="font-display text-4xl leading-none" aria-label={GRADE_WORD[grade]}>
            {GRADE_EMOJI[grade]}
          </p>
        ) : null}
        <p className="text-sm text-foreground/90">{line}</p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {text}
        </pre>
        <Button type="button" className="!h-11 !px-4" onClick={copy}>
          {copied ? "Copied" : "Copy share card"}
        </Button>
      </div>
    </div>
  );
}
