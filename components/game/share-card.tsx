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
  const [imageStatus, setImageStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function shareImage() {
    setImageStatus("Creating image…");
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext("2d");
    if (!context) {
      setImageStatus("Image export is unavailable in this browser.");
      return;
    }
    context.fillStyle = "#07111f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#b8ff39";
    context.fillRect(0, 0, canvas.width, 82);
    context.fillStyle = "#07111f";
    context.font = "700 34px sans-serif";
    context.fillText("RUN THE ROSTER", 54, 54);
    context.fillStyle = "#f4f7fb";
    context.font = "700 52px sans-serif";
    context.fillText(title, 54, 160);
    context.font = "30px sans-serif";
    context.fillStyle = "#c3ccda";
    const lines = text.split("\n").filter((row) => row && !row.startsWith("RTR1|") && !row.startsWith("NFLGM1|"));
    let y = 230;
    for (const row of lines.slice(0, 7)) {
      context.fillText(row.slice(0, 64), 54, y);
      y += 54;
    }
    context.fillStyle = "#b8ff39";
    context.font = "700 28px sans-serif";
    context.fillText("runtheroster.com", 54, 574);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) {
      setImageStatus("Image export failed.");
      return;
    }
    const file = new File([blob], "run-the-roster.png", { type: "image/png" });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({ title: "Run The Roster", text, files: [file] });
        setImageStatus("Shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setImageStatus("");
          return;
        }
      }
    }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setImageStatus("PNG downloaded");
  }

  return (
    <div data-testid="share-card" className="overflow-hidden rounded-xl border border-white/10 bg-[#101826]">
      <div className="border-b border-white/10 bg-primary px-4 py-2 font-display text-sm tracking-[0.18em] text-primary-foreground">
        RUN THE ROSTER
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
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="!h-11 !px-4" onClick={copy}>
            {copied ? "Copied" : "Copy share card"}
          </Button>
          <Button type="button" variant="outline" className="!h-11 !px-4" onClick={shareImage}>
            Share image
          </Button>
        </div>
        {imageStatus ? <p className="text-xs text-muted-foreground" role="status">{imageStatus}</p> : null}
      </div>
    </div>
  );
}
