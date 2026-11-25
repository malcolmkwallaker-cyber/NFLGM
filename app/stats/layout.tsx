import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Stats and Contracts",
  description: "Review simulation totals, team results, and contract projections from your saved season.",
  alternates: { canonical: "/stats/" },
  robots: { index: false, follow: true },
};

export default function StatsLayout({ children }: LayoutProps<"/stats">) {
  return <div className="space-y-5"><header>
        <h1 className="font-display text-4xl tracking-wide">Stats &amp; contracts</h1>
        <p className="mt-2 text-sm text-muted-foreground">Current-season simulation totals, league team results, and contract projections from your saved file.</p>
      </header>{children}</div>;
}
