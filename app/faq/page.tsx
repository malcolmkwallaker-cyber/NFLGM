import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/site/content-page";
import { StructuredData } from "@/components/site/structured-data";

const description = "Answers about Run The Roster game modes, browser saves, cap room, historical rosters, and reporting a bug.";

export const metadata: Metadata = {
  title: "Football GM Game FAQ",
  description,
  alternates: { canonical: "/faq/" },
};

const questions = [
  {
    question: "What is Run The Roster, and is it free?",
    answers: [
      "Run The Roster is a free browser football management game published by Malcolm Wallaker. You work the roster, the cap, and the people who judge those choices.",
      "Daily, Single Season, and Career are all free to play. Historical teams, advanced stats, and on-device score rooms are open in the current build. There is no account or checkout.",
    ],
  },
  {
    question: "What modes can I play?",
    answers: [
      "Daily gives everyone one shared front-office decision. Pick a response, get an instant grade, and read why another path may have worked.",
      "Historic Turnaround gives everyone the same sourced team-season setup and deterministic seed. Play a full season against the challenge's win target.",
      "Single Season is one team for one year. Set the owner's direction, hire staff, manage contracts, trade, draft, set the roster, and play through the postseason.",
      "Career carries results, contracts, player aging, and draft picks into future seasons. You can change teams, be fired and take another job, or retire with a generated retrospective.",
      "Historical lets you play one year with a featured team from a past season. The roster and context are sourced where the game identifies a source.",
    ],
  },
  {
    question: "Where are my saves, and can I move them?",
    answers: [
      "The game auto-saves one Single Season file and one Career file in this browser. Your GM name, settings, Daily results and streaks, and score rooms also stay here.",
      "Starting a new game can replace the matching save slot. Historic Turnaround uses the Single Season slot. Clearing browser site data deletes local progress. There is no cloud backup or built-in transfer between browsers.",
    ],
  },
  {
    question: "How do Daily grades and streaks work?",
    answers: [
      "The grade is Elite, Solid, Costly, or Miss. Historical puzzles use hindsight and fictional puzzles grade the decision process. Selecting an answer locks it for that day.",
      "Streaks count consecutive UTC days played. You earn one freeze after every seven completed challenges, up to two. A freeze covers one missed day automatically.",
    ],
  },
  {
    question: "How does cap room work?",
    answers: [
      "Cap room is the cap limit minus active committed contracts and current dead money. A restructure moves money into a future season. Cutting a player can add dead money after the contract leaves the roster.",
      "Some historical seasons use a payroll guide. Check the limit on the season you picked before you sign, trade, or cut a player.",
    ],
  },
  {
    question: "What does a Good, Fair, or Poor trade grade mean?",
    answers: [
      "The grade describes the football value you receive. The owner, fans, and locker room may react differently because the season brief can favor youth, stars, winning now, culture, or cap flexibility.",
    ],
  },
  {
    question: "How accurate are the historical rosters?",
    answers: [
      "Featured historical rosters use selected real player names and positions. The game models ages, ratings, contracts, draft classes, free-agent markets, schedules, and results. Camp uses a compact simulation roster of 22 to 26 players.",
      "Historical Seasons currently features the 1985 Bears, 1989 49ers, 1993 Cowboys, 1999 Rams, 2007 Patriots, and 2013 Seahawks. The mode pages identify the sources for their roster or season snapshots.",
    ],
  },
  {
    question: "Is this an official NFL game?",
    answers: [
      "Run The Roster is an unofficial fan game. It has no affiliation with or endorsement from the National Football League or its teams. The game uses team abbreviations and colors.",
    ],
  },
  {
    question: "Is there a leaderboard?",
    answers: [
      "Personal scores are based on games still saved in this browser. In a score room, you can paste a friend's result code to compare scores on this device. There is no global ranking or score upload.",
    ],
  },
  {
    question: "Does the site show ads?",
    answers: [
      "The site has an AdSense ownership tag and an ads.txt seller record for domain review. Google advertising is currently off. The Privacy Policy describes how the game handles data.",
    ],
  },
  {
    question: "Who is the game for, and how do I report a problem?",
    answers: [
      "The game is built for adults. For game feedback, accessibility issues, or privacy questions, see the Contact page. Include the mode, season year, team, the screen where it happened, and what you saw.",
    ],
  },
];

export default function FaqPage() {
  return (
    <ContentPage title="Run The Roster FAQ" description="Find answers about modes, saves, the salary cap, and reporting a problem.">
      {questions.map(({ question, answers }) => (
        <ContentSection key={question} title={question}>
          {answers.map((answer) => <p key={answer}>{answer}</p>)}
        </ContentSection>
      ))}
      <ContentSection title="More help">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li><Link href="/guides/">Game guides</Link></li>
          <li><Link href="/historical/">Historical seasons</Link></li>
          <li><Link href="/privacy/">Privacy Policy</Link></li>
          <li><Link href="/contact/">Contact</Link></li>
        </ul>
      </ContentSection>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map(({ question, answers }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answers.join(" ") },
        })),
      }} />
    </ContentPage>
  );
}
