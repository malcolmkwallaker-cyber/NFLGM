import { teamById } from "@/lib/data/teams";
import type { TeamInfo } from "@/lib/types";
import { cn } from "cn";

export function TeamMark({
  team,
  id,
  directory,
  size = "md",
  className,
}: {
  team?: TeamInfo;
  id?: string;
  directory?: TeamInfo[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const info = team ?? teamById(id ?? "NFL", directory);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-display font-semibold tracking-wide shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]",
        size === "lg" && "h-14 w-14 text-lg",
        size === "md" && "h-11 w-11 text-xs",
        size === "sm" && "h-8 w-8 text-[10px]",
        className,
      )}
      style={{ background: info.color, color: info.text }}
      aria-hidden
    >
      {info.abbr}
    </span>
  );
}
