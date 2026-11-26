import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/site/content-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Run The Roster, a free unofficial fan game published by Malcolm Wallaker, including acceptable use, intellectual property, and limitation of liability.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <ContentPage title="Terms of Use" description="Current as of November 26, 2026.">
      <ContentSection title={"Acceptance of these terms"}>
        <p>{"These Terms of Use govern your use of https://runtheroster.com and the Run The Roster game on that site. The site is published and operated by Malcolm Wallaker, in Grand Rapids, Minnesota."}</p>
        <p>{"By using the site, you agree to these terms. If you do not agree, do not use the site. The game is intended for an adult audience and is not directed at children."}</p>
      </ContentSection>
      <ContentSection title={"A free game, provided as is"}>
        <p>{"Run The Roster is a free browser game. No payment is required to play the current public modes, and the site does not request, store, or charge payment details."}</p>
        <p>{"The game and the site are provided as is, without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. I do not warrant that the site will be uninterrupted, error-free, or free of harmful components, or that simulated results, ratings, or cap figures are accurate descriptions of real NFL games, contracts, or history."}</p>
      </ContentSection>
      <ContentSection title={"Local saves can be lost"}>
        <p>{"Game progress is stored in your browser. The game auto-saves one Season and one Career in that browser. There is no player account and no cloud save. If you clear site data, switch browsers or devices, or otherwise lose access to that browser storage, your saves, Daily results, streaks, and local score-room entries can be lost. I cannot restore them, because there is no server copy."}</p>
        <p>{"Starting a new Season or Career file can replace the one already stored in this browser, after the game asks you to confirm."}</p>
      </ContentSection>
      <ContentSection title={"Acceptable use"}>
        <p>{"You may use the site for lawful, personal, non-commercial play and for ordinary sharing of your own results."}</p>
        <p>{"You may not:"}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>{"Attempt to break, overload, or interfere with the site, or to access it by any means other than the interfaces I provide"}</li>
          <li>{"Scrape, harvest, or systematically copy the site, its rosters, or its content in a way that burdens the service or evades ordinary use"}</li>
          <li>{"Reverse engineer or automate the game in order to abuse it, except to the extent the law gives you a non-waivable right to do so"}</li>
          <li>{"Upload or transmit malware, or attempt to gain unauthorized access to any account, server, or network used to operate the site"}</li>
          <li>{"Misrepresent the game as an official NFL product, or remove the unofficial fan-game notice"}</li>
          <li>{"Use the site in a way that violates applicable law"}</li>
        </ul>
        <p>{"I may limit or block access if I believe these rules have been broken, or if it is necessary to protect the site or other visitors."}</p>
      </ContentSection>
      <ContentSection title={"Intellectual property and NFL disclaimer"}>
        <p>{"I own the game's original code, writing, design, and brand, except for third-party components used under their own licenses and except for the sourced historical material described on the site. You may not copy the site or the game in order to operate a competing service, or use the Run The Roster name or logo in a way that suggests I endorse you, without permission."}</p>
        <p>{"Run The Roster is unofficial. It is not affiliated with, endorsed by, or connected to the National Football League or any of its teams. Team references use names, abbreviations, colors, and sourced historical context. The site does not present team logos as its own branding. Rosters and historical context use sourced material where noted. Ratings, contracts, schedules, draft classes, free-agent markets, and simulated results are modeled game data, not official records."}</p>
      </ContentSection>
      <ContentSection title={"Third-party links and ads"}>
        <p>{"The site may link to third-party sites, including roster sources, news articles, and opt-out pages. I am not responsible for those sites, their content, or their practices. If you follow a link, you do so under that third party's terms and privacy policy."}</p>
        <p>{"The site may display advertising, including ads served by Google and other third-party vendors, as described in the "}<Link href="/privacy/">Privacy Policy</Link>{". Those vendors are responsible for their own ads and for the cookies and other technologies they use. I do not warrant the products or services advertised."}</p>
      </ContentSection>
      <ContentSection title={"Limitation of liability"}>
        <p>{"To the fullest extent permitted by law, Malcolm Wallaker and Run The Roster will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, saves, profits, or goodwill, arising out of your use of the site or your inability to use it, even if advised of the possibility of such damages."}</p>
        <p>{"To the fullest extent permitted by law, total liability arising out of these terms or the site will not exceed fifty U.S. dollars ($50), or the amount you paid to use the site in the twelve months before the claim, whichever is greater. Because the current game is free, that amount is fifty dollars unless a later paid product changes it."}</p>
        <p>{"Some jurisdictions do not allow certain warranty disclaimers or liability limits. If those laws apply to you, some of the limits above may not apply, and you may have additional rights."}</p>
      </ContentSection>
      <ContentSection title={"Governing law"}>
        <p>{"These terms are governed by the laws of the State of Minnesota, without regard to conflict-of-law rules."}</p>
      </ContentSection>
      <ContentSection title={"Changes"}>
        <p>{"I may update these terms from time to time. The date at the top will change when I do. If you keep using the site after an update, you are agreeing to the revised terms. For a change I consider material, I will try to make that obvious on the site."}</p>
      </ContentSection>
      <ContentSection title={"Contact"}>
        <p>Questions about these terms can be sent through the <Link href="/contact/">Contact page</Link>, or to <a href="mailto:malcolmkwallaker@gmail.com">malcolmkwallaker@gmail.com</a>.</p>
        <p><Link href="/about/">About Run The Roster</Link> · <Link href="/faq/">FAQ</Link></p>
      </ContentSection>
    </ContentPage>
  );
}
