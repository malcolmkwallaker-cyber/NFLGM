import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/site/content-page";

const description = "Terms of use for Run The Roster, a free browser football game published by Malcolm Wallaker.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <ContentPage title="Terms of Use" description={description}>
      <ContentSection title="Using the game">
        <p>These Terms of Use govern your use of runtheroster.com and the Run The Roster game. By using the site, you agree to these terms. The game is intended for adults.</p>
        <p>You may use the site for lawful, personal, non-commercial play and ordinary sharing of your own results. The current public modes are free and require no payment information.</p>
      </ContentSection>
      <ContentSection title="Acceptable use">
        <p>Use the interfaces the site provides. Avoid activity that disrupts the service, including scraping that burdens the site, abusive automation, malware, or unauthorized access.</p>
        <p>Respect the unofficial fan-game notice and use the site lawfully. Access may be limited to protect the site and other visitors.</p>
      </ContentSection>
      <ContentSection title="Local saves">
        <p>The game saves one Single Season and one Career in your browser. Clearing site data or switching browsers or devices can make those saves unavailable. There is no server copy to restore.</p>
        <p>Starting a new game can replace the matching slot after confirmation. See the <Link href="/privacy/">Privacy Policy</Link> for details on saved data.</p>
      </ContentSection>
      <ContentSection title="Game content and third-party sources">
        <p>Malcolm Wallaker publishes the game and owns its original writing, design, and brand. Third-party components and sourced historical material retain their respective rights.</p>
        <p>Run The Roster is an unofficial fan game with no affiliation with or endorsement from the National Football League or its teams. Ratings, contracts, schedules, and simulated results are modeled game data. Where the game links to third-party sources, those sites have their own terms and privacy policies.</p>
      </ContentSection>
      <ContentSection title="Availability and questions">
        <p>The game and site are provided as is. Site availability and uninterrupted access to the game are not guaranteed.</p>
        <p>Send questions about these terms through the <Link href="/contact/">Contact page</Link>.</p>
      </ContentSection>
    </ContentPage>
  );
}
