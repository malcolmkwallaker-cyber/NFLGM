"use client";

import Link from "next/link";
import { useGame } from "@/components/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  if (!ready) {
    return <p className="text-sm text-muted-foreground">Opening the file…</p>;
  }
  if (profile.pro) return children;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
        <Badge>Pro</Badge>
        <h2 className="mt-3 font-display text-3xl tracking-wide">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button className="!h-11 !px-4" nativeButton={false} render={<Link href="/upgrade" />}>
            See Pro · $6/mo
          </Button>
          <Button variant="outline" className="!h-11 !px-4" nativeButton={false} render={<Link href="/settings" />}>
            Flip the preview switch
          </Button>
        </div>
      </div>
      <div className="pointer-events-none opacity-40" aria-hidden>
        {children}
      </div>
    </div>
  );
}
