import type { Metadata } from "next";
import { LeaderboardClient } from "@/components/game/leaderboard-client";

export const metadata: Metadata = {
  title: "Personal Scores",
  description: "See the best Daily, Single Season, and Career scores saved in your browser.",
  alternates: { canonical: "/leaderboard/" },
  robots: { index: false, follow: true },
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
