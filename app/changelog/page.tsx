import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/site/content-page";

const description = "Dated updates to Run The Roster, including changes to the front office, simulation, and interface.";

export const metadata: Metadata = {
  title: "Changelog",
  description,
  alternates: { canonical: "/changelog/" },
};

export default function ChangelogPage() {
  return (
    <ContentPage title="Changelog" description="Game and site updates, newest first.">
      <ContentSection title={<time dateTime="2026-11-13">November 13, 2026</time>}>
        <p>The front-office desk shows how many players are in its roster preview and links to the full list. Free-agent cards explain when none of the listed offers fits the remaining cap room.</p>
        <p>Draft picks acquired by trade show the draft year. Injury decisions show their effect on owner, fan, and locker-room approval before you choose.</p>
      </ContentSection>
      <ContentSection title={<time dateTime="2026-11-12">November 12, 2026</time>}>
        <p>Added stadium details and sound cues for front-office decisions. The header and Settings let you turn interface sounds off.</p>
      </ContentSection>
    </ContentPage>
  );
}
