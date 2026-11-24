import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Stats and Contracts",
  description: "Review simulation totals, team results, and contract projections from your saved season.",
  alternates: { canonical: "/stats/" },
  robots: { index: false, follow: true },
};

export default function StatsLayout({ children }: LayoutProps<"/stats">) {
  return children;
}
