import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/site/content-page";

import { publishedArticles } from "@/lib/data/articles";

const description = "Learn how to start a game, manage cap room, and make front-office decisions in Run The Roster.";

export const metadata: Metadata = {
  title: "Football GM Guides",
  description,
  alternates: { canonical: "/guides/" },
};

export default function GuidesPage() {
  const guides = publishedArticles.filter((article) => article.legacySection !== "news");
  return (
    <ContentPage title="Game guides" description="Pick the size of the job, then make the decisions that shape your roster.">
      {guides.length ? (
        <ContentSection title="Read a guide">
          <ul className="space-y-3">{guides.map(({ slug, title, description }) => (
            <li key={slug}><Link href={`/articles/${slug}/`}>{title}</Link><p>{description}</p></li>
          ))}</ul>
        </ContentSection>
      ) : null}
      <ContentSection title="Choose a mode">
        <ul className="space-y-3">
          <li><Link href="/daily/">Daily Challenge</Link> gives you one front-office decision. Read the setup, pick a response, then compare the grade and reasoning with the other options.</li>
          <li><Link href="/turnaround/">Historic Turnaround</Link> starts from a shared historical team-season setup. Read the real record and the simulation&apos;s target before you take over.</li>
          <li><Link href="/season/">Single Season</Link> gives you one full year from the owner meeting through the playoffs. Set the owner&apos;s direction before you hire staff and start making roster moves.</li>
          <li><Link href="/career/">Career</Link> carries the job forward. Plan for aging players, expiring contracts, and draft picks that can change your options in later seasons.</li>
          <li><Link href="/historical/">Historical Seasons</Link> lets you pick a featured team. Check the source notes and whether your year uses a payroll guide or a hard cap.</li>
        </ul>
      </ContentSection>
      <ContentSection title="Work the preseason in order">
        <p>Set the owner&apos;s direction and hire a staff. Decide which expiring players to retain, work the outside market, handle trade calls, draft prospects, and make the final camp cuts.</p>
        <p>Read the cap room and dead-money figures before you make a move. A restructure buys room now by moving money into a future season. A cut can leave a charge behind.</p>
        <p>Check the owner&apos;s brief when you review a trade. The Good, Fair, or Poor grade describes football value. Owner, fan, and locker-room reactions depend on the season and the players involved.</p>
      </ContentSection>
      <ContentSection title="Return to the same browser">
        <p>Single Season and Career each keep a save in this browser. Use the <Link href="/play/">Front Office Desk</Link> to resume the active job, or read the <Link href="/faq/">FAQ</Link> for details on saves and scores.</p>
      </ContentSection>
    </ContentPage>
  );
}
