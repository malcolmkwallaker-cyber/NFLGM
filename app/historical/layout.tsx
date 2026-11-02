import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historical Football Seasons",
  description: "Take over a selected historical team-season roster and run a clearly labeled modeled football simulation.",
  alternates: { canonical: "/historical/" },
};

export default function HistoricalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
