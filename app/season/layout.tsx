import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Single Season Football GM Mode",
  description: "Hire a staff, manage contracts and the cap, trade, draft, make camp cuts, and run one football team through a complete season.",
  alternates: { canonical: "/season/" },
};

export default function SeasonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
