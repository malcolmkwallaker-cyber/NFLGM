"use client";

import { useGame } from "@/components/profile";
import { FREE_TESTING_MODE, hasFullAccess } from "@/lib/access";

export function ProGate({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  const { profile, ready } = useGame();
  if (FREE_TESTING_MODE) return children;
  if (!ready) {
    return <p className="text-sm text-muted-foreground">Opening the file…</p>;
  }
  if (hasFullAccess(profile)) return children;
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
      <h2 className="font-display text-3xl tracking-wide">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
