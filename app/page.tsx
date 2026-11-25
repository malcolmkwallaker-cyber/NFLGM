import type { Metadata } from "next";
import { TodayHome } from "@/components/game/today-home";
import { StructuredData } from "@/components/site/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://runtheroster.com/#website",
            url: "https://runtheroster.com/",
            name: "Run The Roster",
          },
          {
            "@type": "Organization",
            "@id": "https://runtheroster.com/#publisher",
            name: "Run The Roster",
            url: "https://runtheroster.com/",
            logo: "https://runtheroster.com/brand/run-the-roster-football-logo.png",
          },
          {
            "@type": "VideoGame",
            name: "Run The Roster",
            url: "https://runtheroster.com/",
            genre: "Sports management simulation",
            gamePlatform: "Web browser",
            isAccessibleForFree: true,
            publisher: { "@id": "https://runtheroster.com/#publisher" },
          },
        ],
      }} />
      <TodayHome />
    </>
  );
}
