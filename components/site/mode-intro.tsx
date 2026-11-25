import Link from "next/link";

import { publishedArticles } from "@/lib/data/articles";

const guideSlugs = { daily: "daily-challenge-guide", turnaround: "historic-turnaround-guide", season: "single-season-walkthrough", play: "how-to-play" } as const;

const modes = {
  daily: {
    title: "Daily Football GM Challenge",
    description: "Make one front-office decision, then see how your reasoning stacks up.",
    paragraphs: [
      "A Daily Challenge puts you in charge of one decision rather than a whole season. You might have to choose how to use a draft pick, respond to a trade offer, handle an expiring contract, or decide what to do with limited cap room. Start with the setup. It tells you what the club needs and what makes the choice difficult. A scenario can use a real football decision as its starting point, but the game labels fictional scenarios separately.",
      "Read all the options before making your pick. A move that creates immediate help can cost a future asset, while a move that looks cautious can waste a good opportunity. The decision is usually about which cost you are willing to accept. You do not have to build a team, play an entire schedule, or know the actual historical outcome to make a useful choice.",
      "After you choose, read the grade and the explanation. The explanation is the useful part: it shows how the game evaluated the tradeoff and lets you compare your thinking with the other options. Treat it as feedback on this situation, not a universal rule for every roster. If you want a longer challenge after this one, Single Season lets you follow a series of related decisions from the owner meeting through the end of a season.",
      "If you are choosing between two similar responses, identify what would make each one fail. Running short on picks and running short on usable players are different problems, even when both look like a weak roster.",
    ],
    tips: ["Name the team's immediate problem before looking for the most exciting move.", "Compare what each option costs now with the options it leaves for later.", "Read the reasoning after your result, especially when it disagrees with your first instinct."],
    play: "Jump to the Daily Challenge",
  },
  turnaround: {
    title: "Daily Historic Turnaround",
    description: "Take over a historical team and try to improve on its real result.",
    paragraphs: [
      "Historic Turnaround starts from a historical team and season. The opening screen identifies the original team, gives the historical result, and explains the target for your run. Think of that record as a benchmark, not a script. You are playing an alternate version of the season, and your choices can take it in a different direction. A sourced team-season snapshot is not the same thing as a recreation of every historical contract, opponent, rating, or result.",
      "Before taking the job, look at what the original roster gives you and what it lacks. A team with a strong core may need one or two targeted additions. A roster with several weaknesses may need you to prioritize rather than trying to fix everything in the first window. Different eras can use different financial rules, so read the specific payroll or cap guidance for the setup instead of assuming that modern rules apply.",
      "The daily setup is shared. That gives players a common starting point even when their decisions lead to different outcomes. The mode screen explains what goes into the score. Read that explanation before you spend or make a trade so you know what the simulation is measuring. After the run, compare your result with the original record and look back at the choices you could repeat, not just the final number.",
      "If you try a different historical setup later, change the plan to fit that roster. Improving a rebuilding club by a few wins calls for different decisions than protecting a contender whose real season already set a high bar.",
    ],
    tips: ["Check the historical result and the target before starting.", "Read the roster and financial rules for this team and year.", "Prioritize the moves that solve your biggest roster problem without using every option at once."],
    play: "Jump to Historic Turnaround",
  },
  season: {
    title: "Single Season Football GM Mode",
    description: "Take one team through the front office, training camp, and a full simulated season.",
    paragraphs: [
      "Single Season gives you a complete football year in one run. Choose a team, meet the owner, and decide what the club is trying to accomplish. The same trade or signing can make sense for a contender and make less sense for a rebuilding team. Read the owner's brief and the roster together before you decide how much of the future to spend on the present.",
      "The preseason is a sequence of decisions, not an unlimited shopping list. Hire staff, examine your own expiring players, work through free agency and trades, draft prospects, and make the final camp cuts. The order matters because a decision made early can affect the cap room and roster spots you have available later. If you cannot afford a move, consider whether a smaller change or simply waiting is better than taking on a cost you did not plan for.",
      "When you enter the season, the simulation follows the team you put together. Review the results and the owner's reaction rather than judging the run by a single signing or draft grade. You can keep one Single Season save in this browser, separately from your Career save. If you already have a season in progress, use the return option to continue it. Starting over can replace that season after confirmation.",
      "Give yourself a checkpoint before camp: check the depth chart, note how much flexibility remains, and decide which backup matters most. That keeps the final cuts from turning into a scramble to repair a move you made weeks earlier.",
    ],
    tips: ["Write down one roster need and one financial constraint before the market opens.", "Read cap room and dead money before accepting a move or cutting a player.", "Check that the final roster still fits the owner's direction, not just the team you started with."],
    play: "Jump to team selection",
  },
  play: {
    title: "Front Office Desk",
    description: "Return to the job you started and make the next decision for your team.",
    paragraphs: [
      "The Front Office Desk is where you continue your current Single Season or Career job. If this browser does not have an active job, start in Single Season or Career, choose a team, and then come back to the Desk. The game stores those modes in separate browser slots. A job saved in another browser or on another device will not show up at this Desk automatically.",
      "Start by checking the current phase and the owner's brief. The next useful action depends on where you are in the year. A staff hire, a trade, and a contract decision each solve a different problem. Before choosing, see what the game says about your roster, cap room, and the reaction you should expect. An appealing offer is not necessarily the best move if you need the same resources for a more important decision later.",
      "The Desk is also a place to check your work as the team changes. Use the roster view to see who is still on the team and the cap information to understand what is available. Read any explanation beside an unavailable option rather than assuming it is broken. Once the phase advances, carry over the result that matters to the next decision: how much money is left, which position still needs attention, or what the owner now expects.",
      "On a long Career run, review future picks and upcoming expirations before spending resources to answer a short-term problem. A decision can be worth taking and still leave you with a tradeoff to manage next year.",
    ],
    tips: ["Check which save and phase are active before choosing an action.", "Compare the next decision with the whole roster, not just the player on the card.", "Use the Desk to resume a job rather than replacing a save you want to keep."],
    play: "Jump to the Front Office Desk",
  },
} as const;

export function ModeIntro({ mode }: { mode: keyof typeof modes }) {
  const content = modes[mode];
  const guide = publishedArticles.find(({ slug }) => slug === guideSlugs[mode]);
  return (
    <section aria-labelledby="mode-heading" className="mb-6 space-y-4 rounded-2xl border border-primary/30 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 id="mode-heading" className="font-display text-4xl leading-none tracking-wide sm:text-5xl">{content.title}</h1>
        <a href="#game" className="rounded-md border border-primary/40 px-3 py-2 text-sm text-primary underline underline-offset-4">{content.play}</a>
      </div>
      <p className="text-base text-foreground">{content.description}</p>
      <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
        {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h2 className="pt-1 text-base font-semibold text-foreground">Three tips before you play</h2>
        <ul className="list-disc space-y-1 pl-5">{content.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
        <p><Link href={guide ? `/articles/${guide.slug}/` : "/guides/"} className="text-primary underline underline-offset-4">{guide ? guide.title : "Compare the game modes"}</Link> or read the <Link href="/faq/" className="text-primary underline underline-offset-4">FAQ</Link> for help with saves.</p>
      </div>
    </section>
  );
}
