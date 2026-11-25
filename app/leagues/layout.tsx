import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Score Rooms",
  description: "Compare shared Daily and season result cards in a score room on this device.",
  alternates: { canonical: "/leagues/" },
  robots: { index: false, follow: true },
};

export default function LeaguesLayout({ children }: LayoutProps<"/leagues">) {
  return children;
}
