import type { DailyChallenge } from "@/lib/types";
import { FICTIONAL_DAILY_CHALLENGES } from "@/lib/data/fictional-daily-challenges";

/**
 * One shared decision a day. Grades use hindsight — how the move turned out —
 * and say so in the result. Append new challenges at the end. Puzzle dates are
 * Dates through 2026-10-23 retain the original 33-item rotation. The expanded
 * calendar begins with item 34 on 2026-10-24. Append only so released dates and
 * saved results remain stable.
 */
const HISTORICAL_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "walker-1989",
    category: "Trade",
    year: 1989,
    team: "DAL",
    teamName: "Dallas Cowboys",
    title: "Minnesota wants Herschel Walker",
    situation:
      "You are running the Dallas Cowboys in October 1989. Herschel Walker is your best skill player and the roster around him is thin. Minnesota is desperate for a star and will send a pile of players and draft picks, the kind of package that can be flipped again.",
    question: "The Vikings' offer is on the desk. What do you do with Walker?",
    actualOptionId: "trade",
    whatHappened:
      "Dallas traded Walker to Minnesota for a package of players and picks, then spun several of those players into more picks. The haul became the spine of the 1990s Cowboys, including Emmitt Smith. Minnesota got the famous name and not the dynasty.",
    options: [
      { id: "trade", label: "Trade him for the full haul", detail: "Take the players and the picks, then keep dealing.", grade: "green", score: 98, popularity: 0.22, why: "The return, used patiently, built a champion. Walker was the chip, not the plan.", echo: "Jimmy Johnson" },
      { id: "more", label: "Demand one more first", detail: "Hold the deal hostage for another premium pick.", grade: "yellow", score: 74, popularity: 0.18, why: "Pushing for value is fine. Letting the window close would have been the mistake.", echo: "Bill Polian" },
      { id: "keep", label: "Keep Walker and try to win now", detail: "He is your offense. You do not mortgage that.", grade: "orange", score: 42, popularity: 0.4, why: "A star on a bad roster does not compound. Dallas needed volume of assets.", echo: "A win-now owner" },
      { id: "one", label: "One player, straight up", detail: "Swap him for a single veteran who can help this year.", grade: "red", score: 18, popularity: 0.2, why: "You would have sold the best trade chip of the era for a rental.", echo: "A panicked seller" },
    ],
  },
  {
    id: "rg3-2012",
    category: "Trade",
    year: 2012,
    team: "WAS",
    teamName: "Washington",
    title: "Three firsts for the second pick",
    situation:
      "You sit at No. 6 in the 2012 draft. St. Louis will move off No. 2 so you can take Robert Griffin III, the Heisman quarterback. The price is this year's first, a second, and first-round picks in 2013 and 2014.",
    question: "Do you pay three firsts to get RG3?",
    actualOptionId: "pay",
    whatHappened:
      "Washington made the deal and drafted RG3. He won Offensive Rookie of the Year, then a knee injury and a ruptured relationship with the staff unraveled it. St. Louis used the capital as a foundation for the next era of the Rams.",
    options: [
      { id: "stay", label: "Stay at 6 and keep the future picks", detail: "Take the best player on the board and keep your ammunition.", grade: "green", score: 92, popularity: 0.16, why: "The price was a franchise, and the bet did not survive contact with injury.", echo: "Ozzie Newsome" },
      { id: "smaller", label: "Trade up only if the price is one future first", detail: "You want a quarterback. You do not want to empty the cupboard.", grade: "yellow", score: 76, popularity: 0.24, why: "A smaller move still chases the position without handing over three years.", echo: "Ron Wolf" },
      { id: "pay", label: "Pay the three firsts and draft RG3", detail: "The owner wants a star quarterback yesterday.", grade: "orange", score: 40, popularity: 0.48, why: "This is the deal that was made. The rookie year was real. The bill lasted longer.", echo: "A splash-move GM" },
      { id: "extra", label: "Add a starter to the package to be sure", detail: "If you are all in, be all in.", grade: "red", score: 16, popularity: 0.12, why: "The published price was already too rich. Sweetening it is how you lose the decade.", echo: "A bidder with no walk-away" },
    ],
  },
  {
    id: "ricky-1999",
    category: "Trade",
    year: 1999,
    team: "NO",
    teamName: "New Orleans Saints",
    title: "Ditka wants the whole draft for Ricky",
    situation:
      "The 1999 Saints are in love with Ricky Williams. Washington holds the No. 5 pick. The asking price is essentially your entire draft, plus picks next year. Your coach is ready to pose in a wedding dress if you say yes.",
    question: "Do you give up the draft for one running back?",
    actualOptionId: "all",
    whatHappened:
      "New Orleans made the trade and drafted Williams. He had productive seasons and a chaotic time in the building. Washington turned the extra picks into a much deeper haul, including Champ Bailey. The Saints did not become a contender on the back of one back.",
    options: [
      { id: "spread", label: "Keep every pick and draft a class", detail: "Running backs do not cost an entire weekend.", grade: "green", score: 96, popularity: 0.34, why: "Draft capital compounds. One back, even a good one, does not.", echo: "Bobby Beathard" },
      { id: "modest", label: "Offer a first and a third, and live with no", detail: "You can like the player and hate the price.", grade: "yellow", score: 78, popularity: 0.22, why: "A walk-away price is how you stay a GM.", echo: "Howie Roseman" },
      { id: "all", label: "Send the whole draft and take Williams", detail: "The coach is sure. The city wants a name.", grade: "red", score: 20, popularity: 0.3, why: "This is the trade. It became a cautionary slide in every draft-value deck.", echo: "Mike Ditka's front office" },
      { id: "qb", label: "Trade up, but for a quarterback instead", detail: "If you are spending a draft, spend it on the position that swings games.", grade: "orange", score: 48, popularity: 0.14, why: "Better target, same sin. You still should not spend the entire class.", echo: "A QB-or-bust GM" },
    ],
  },
  {
    id: "eli-2004",
    category: "Trade",
    year: 2004,
    team: "NYG",
    teamName: "New York Giants",
    title: "Eli will not play in San Diego",
    situation:
      "It is the 2004 draft. San Diego is picking first and Eli Manning has made it clear he does not want to play there. You pick fourth. The Chargers will draft Manning and swap him for Philip Rivers plus a third this year and a first and a fifth next year.",
    question: "Do you pay that to bring Manning to New York?",
    actualOptionId: "trade",
    whatHappened:
      "The Giants made the trade. Manning started for more than a decade and won two Super Bowls. Rivers became a longtime Chargers starter. Both sides got a franchise quarterback. New York got the one who would actually report.",
    options: [
      { id: "trade", label: "Make the trade for Manning", detail: "Pay the picks. He wants to be here, and the alternative does not.", grade: "green", score: 90, popularity: 0.36, why: "You got a two-time champion who was willing to play. The price was real and worth it.", echo: "Ernie Accorsi" },
      { id: "ben", label: "Stay at 4 and see which quarterback falls", detail: "Rivers, Ben Roethlisberger, and the rest of the board are still in play.", grade: "yellow", score: 72, popularity: 0.28, why: "Roethlisberger became a champion too. Passing on a willing Manning was the riskier version of a good idea.", echo: "Kevin Colbert" },
      { id: "bluff", label: "Call the bluff and refuse to deal", detail: "If he slides to you for free, fine. You will not pay.", grade: "orange", score: 44, popularity: 0.2, why: "He was not sliding. San Diego was happy to take Rivers and keep the picks.", echo: "A negotiator who overplayed it" },
      { id: "defense", label: "Draft a pass rusher and ignore quarterback", detail: "The class is deep. You can wait on the position.", grade: "red", score: 28, popularity: 0.16, why: "This was a quarterback draft with three long careers at the top. Skipping the position missed the point.", echo: "A defense-only war room" },
    ],
  },
  {
    id: "trubisky-2017",
    category: "Draft",
    year: 2017,
    team: "CHI",
    teamName: "Chicago Bears",
    title: "Move up one spot for Mitchell Trubisky",
    situation:
      "The 2017 Bears pick third. San Francisco, at No. 2, will let you move up if you add a third, a fourth, and a future third. Your staff is sold on Mitchell Trubisky. Patrick Mahomes and Deshaun Watson are still projected to be on the board much later. Myles Garrett is already gone at No. 1.",
    question: "Do you trade up to lock in Trubisky?",
    actualOptionId: "trade",
    whatHappened:
      "Chicago traded up and drafted Trubisky. Mahomes went 10th to Kansas City and Watson 12th to Houston. Trubisky became a stopgap. The picks Chicago spent were the tax on being sure about the wrong quarterback.",
    options: [
      { id: "down", label: "Stay put or trade down and hunt a quarterback later", detail: "Do not fall in love with the consensus at No. 2.", grade: "green", score: 97, popularity: 0.14, why: "The two better quarterbacks were available without the surcharge.", echo: "Brett Veach" },
      { id: "stay", label: "Stay at 3 and take the best non-quarterback", detail: "If your quarterback grade is soft, do not force it at the top.", grade: "yellow", score: 70, popularity: 0.26, why: "Solomon Thomas, the player San Francisco took at 3, was not the prize. Process still beat the trade-up.", echo: "A patient personnel chief" },
      { id: "rb", label: "Trade up for a running back", detail: "You know what you are getting. Quarterbacks bust.", grade: "orange", score: 36, popularity: 0.12, why: "You would have spent premium capital on the wrong position in a quarterback draft.", echo: "A throwback war room" },
      { id: "trade", label: "Trade up and draft Trubisky", detail: "Your scouts have him as the safest quarterback.", grade: "red", score: 18, popularity: 0.48, why: "This is the pick. The tax and the player were both wrong.", echo: "Ryan Pace" },
    ],
  },
  {
    id: "mahomes-2017",
    category: "Draft",
    year: 2017,
    team: "KC",
    teamName: "Kansas City Chiefs",
    title: "No. 27 is too far back for your quarterback",
    situation:
      "You already have Alex Smith, a competent starter. Buffalo will move from No. 10 to your No. 27 if you add a third this year and a first next year. Patrick Mahomes is the arm your coach wants. The building does not need a quarterback today.",
    question: "Do you spend a future first to draft Mahomes?",
    actualOptionId: "trade",
    whatHappened:
      "Kansas City made the trade and drafted Mahomes. He sat for a year behind Smith, then became the center of a dynasty and three championships. Buffalo used No. 27 on Tre'Davious White, a good player and not a comparison.",
    options: [
      { id: "trade", label: "Trade up and take Mahomes", detail: "Pay the future first. Let him learn for a year.", grade: "green", score: 99, popularity: 0.2, why: "The most valuable pick of the decade, and the price was one extra first.", echo: "Brett Veach" },
      { id: "stay", label: "Stay at 27 and take a defender", detail: "Smith is good enough. Do not create a controversy.", grade: "orange", score: 40, popularity: 0.34, why: "Safe, and it leaves a franchise quarterback for someone else.", echo: "A win-now coordinator" },
      { id: "watson", label: "Wait and try to land Watson or a later quarterback", detail: "You like more than one of them. Do not chase.", grade: "yellow", score: 68, popularity: 0.28, why: "Watson also hit. Passing on the chance to pick your guy at 10 was how you might have missed both.", echo: "A board-not-a-player GM" },
      { id: "smith", label: "Extend Smith and trade the first for veterans", detail: "You are trying to win this year, not groom a project.", grade: "red", score: 22, popularity: 0.18, why: "Rentals do not outlive a decade of Mahomes.", echo: "A rental collector" },
    ],
  },
  {
    id: "lance-2021",
    category: "Trade",
    year: 2021,
    team: "SF",
    teamName: "San Francisco 49ers",
    title: "Two future firsts to No. 3",
    situation:
      "You pick 12th in 2021. Miami will move off No. 3 for your first this year, firsts in 2022 and 2023, and another pick. The quarterback you want is Trey Lance, a one-year FCS starter. Jimmy Garoppolo is still on the roster.",
    question: "Do you make the Lance trade?",
    actualOptionId: "pay",
    whatHappened:
      "San Francisco made the trade and drafted Lance. He barely played before an ankle injury, and the job eventually went to Brock Purdy, a last pick. The 49ers still contended. The picks they sent out were the expensive part.",
    options: [
      { id: "stay", label: "Stay at 12 and draft for the roster you have", detail: "You are already good. Do not spend three years on a projection.", grade: "green", score: 93, popularity: 0.22, why: "The haul was huge and the player never became the starter they paid for.", echo: "A contender's GM" },
      { id: "other", label: "Trade up only if you are taking a different quarterback", detail: "You will pay for a cleaner projection, not a one-year sample.", grade: "yellow", score: 70, popularity: 0.2, why: "Mac Jones and Justin Fields were in the class. None of them cleared this price either.", echo: "A risk manager" },
      { id: "pay", label: "Pay the two future firsts and draft Lance", detail: "Your coach wants the tools. You trust the swing.", grade: "red", score: 24, popularity: 0.42, why: "This is the trade. The capital hurt more than the missed starter helped.", echo: "John Lynch" },
      { id: "jimmy", label: "Extend Garoppolo and stop looking", detail: "He has taken you to a Super Bowl. Run it back.", grade: "orange", score: 46, popularity: 0.16, why: "Standing pat was better than the Lance price. It was not a long-term answer at the position.", echo: "A loyalist" },
    ],
  },
  {
    id: "young-2023",
    category: "Draft",
    year: 2023,
    team: "CAR",
    teamName: "Carolina Panthers",
    title: "The Bears will sell you No. 1",
    situation:
      "You need a quarterback. Chicago will trade the first pick for a package built around DJ Moore, your 2023 first, and first-round picks in 2024 and 2025. On the clock you can take Bryce Young, the Heisman winner, or C.J. Stroud.",
    question: "You have already climbed to No. 1 in your head. Who do you take, and do you pay?",
    actualOptionId: "young",
    whatHappened:
      "Carolina sent Moore and the picks to Chicago and drafted Young. Stroud went second to Houston and became a star. Young struggled and was later traded. Chicago used the 2024 first on Caleb Williams. The Panthers paid for the wrong name at the top.",
    options: [
      { id: "stroud", label: "Make the trade only if Stroud is the pick", detail: "If you are spending three years, take the quarterback with the cleaner operation.", grade: "green", score: 95, popularity: 0.18, why: "Stroud was the hit. The price was still high, and the player justified more of it.", echo: "Nick Caserio" },
      { id: "stay", label: "Do not trade the farm. Draft at your own spot", detail: "You can find a quarterback without handing Chicago your future.", grade: "yellow", score: 74, popularity: 0.24, why: "Keeping Moore and the picks was a real alternative. You still needed a quarterback.", echo: "A asset-first GM" },
      { id: "young", label: "Pay the haul and draft Young", detail: "He is the safest, most accurate prospect in the class.", grade: "red", score: 20, popularity: 0.46, why: "This is the move. The player and the price both went against Carolina.", echo: "Scott Fitterer" },
      { id: "defender", label: "Trade up and take a pass rusher", detail: "Quarterbacks bust. Rushers travel.", grade: "orange", score: 38, popularity: 0.12, why: "You would have spent quarterback capital and still left the position empty.", echo: "A defensive purist" },
    ],
  },
  {
    id: "love-2020",
    category: "Draft",
    year: 2020,
    team: "GB",
    teamName: "Green Bay Packers",
    title: "Aaron Rodgers is the MVP, and you are on the clock",
    situation:
      "It is pick No. 26 in 2020. Aaron Rodgers is in his prime and will not enjoy a succession plan. Jordan Love is available. So are receivers who could help a team that just went 13-3. The room is split between the future and a Super Bowl push.",
    question: "What do you do with the 26th pick?",
    actualOptionId: "love",
    whatHappened:
      "Green Bay drafted Love. The Rodgers relationship frayed, and he was traded to the Jets three years later. Love became the starter and a playoff quarterback. The pick looked indulgent in 2020 and necessary by 2023.",
    options: [
      { id: "love", label: "Draft Jordan Love", detail: "Take the quarterback and live with the noise.", grade: "green", score: 88, popularity: 0.15, why: "The succession plan worked. The short-term pain was the cost of not scrambling later.", echo: "Brian Gutekunst" },
      { id: "wr", label: "Draft the best receiver and keep Rodgers happy", detail: "You are built to win now. Act like it.", grade: "yellow", score: 73, popularity: 0.5, why: "A receiver would have helped the window. It would not have answered the next five years.", echo: "A win-now GM" },
      { id: "trade-up", label: "Trade up into the teens for a bigger receiver", detail: "If you are helping Rodgers, help him properly.", grade: "orange", score: 48, popularity: 0.2, why: "Spending more to avoid the hard conversation is how windows get expensive.", echo: "A people-pleaser" },
      { id: "rb", label: "Draft a running back", detail: "You need a closer in January.", grade: "red", score: 26, popularity: 0.15, why: "The position was the wrong swing in a year the quarterback of the future was sitting there.", echo: "A January romantic" },
    ],
  },
  {
    id: "tua-2020",
    category: "Draft",
    year: 2020,
    team: "MIA",
    teamName: "Miami Dolphins",
    title: "No. 5, and the quarterback board is not clean",
    situation:
      "You hold the fifth pick in 2020. Tua Tagovailoa is the polished, popular name coming off a hip injury. Justin Herbert is the bigger, less finished arm. The Chargers pick right behind you. Your roster is young and does not have a franchise quarterback.",
    question: "Who do you take?",
    actualOptionId: "tua",
    whatHappened:
      "Miami drafted Tua. The Chargers took Herbert, who became the more durable star. Tua has been a good starter between injuries, good enough to win a division and not the ceiling the pick could have been.",
    options: [
      { id: "herbert", label: "Draft Herbert", detail: "Take the arm and the frame. Live with the rawness.", grade: "green", score: 94, popularity: 0.22, why: "Herbert has been the best quarterback to come out of this spot.", echo: "A traits evaluator" },
      { id: "tua", label: "Draft Tua", detail: "He is the cleaner player when healthy, and your coaches think they can protect him.", grade: "yellow", score: 72, popularity: 0.48, why: "Not a bust. Not the best choice on the board. A real starter with a real injury tax.", echo: "Chris Grier" },
      { id: "trade", label: "Trade down with a team that wants a quarterback", detail: "Make someone else pay for the argument.", grade: "yellow", score: 70, popularity: 0.18, why: "Reasonable if you do not have a strong grade. You did need a quarterback, so the savings had to be huge.", echo: "A trader" },
      { id: "defense", label: "Take a corner and sign a bridge", detail: "Neither quarterback is clean. Do not force it.", grade: "orange", score: 40, popularity: 0.12, why: "Passing on both left the position for later, which is how you stay in the market too long.", echo: "A skeptic" },
    ],
  },
  {
    id: "lamar-2018",
    category: "Draft",
    year: 2018,
    team: "BAL",
    teamName: "Baltimore Ravens",
    title: "Flacco is still here. So is Lamar.",
    situation:
      "You are at the end of the 2018 first round. Joe Flacco is the starter and due a large cap number. Lamar Jackson, the Heisman winner a lot of teams called a receiver, is still on the board. Your offensive coordinator wants to find out.",
    question: "Do you spend the 32nd pick on Jackson?",
    actualOptionId: "lamar",
    whatHappened:
      "Baltimore drafted Jackson at No. 32. He took the job as a rookie, won an MVP, and became the franchise quarterback. The teams that passed on him spent the next several years trying to find what Baltimore took with the last pick of the round.",
    options: [
      { id: "lamar", label: "Draft Lamar Jackson", detail: "Take the quarterback. You can figure out the offense.", grade: "green", score: 98, popularity: 0.28, why: "A franchise quarterback at the end of round one is the cleanest value in this set.", echo: "Ozzie Newsome" },
      { id: "trade-out", label: "Trade out. You have a quarterback.", detail: "Flacco just got you paid. Do not create a controversy.", grade: "orange", score: 42, popularity: 0.3, why: "The controversy was one season. The alternative was paying a declining cap hit.", echo: "A peacekeeper" },
      { id: "wr", label: "Draft a receiver for Flacco", detail: "If you are keeping the starter, feed him.", grade: "red", score: 30, popularity: 0.22, why: "A receiver does not change the age curve at quarterback.", echo: "A win-now assistant" },
      { id: "lb", label: "Draft the best linebacker", detail: "Stay on brand. Baltimore drafts defense.", grade: "yellow", score: 58, popularity: 0.2, why: "On brand, and it would have been the wrong kind of faithful.", echo: "A tradition GM" },
    ],
  },
  {
    id: "lt-2001",
    category: "Trade",
    year: 2001,
    team: "LAC",
    teamName: "San Diego Chargers",
    title: "You have the first pick. Atlanta wants Vick.",
    situation:
      "The 2001 Chargers hold No. 1. Michael Vick is the phenomenon. LaDainian Tomlinson is the running back you love, and he should be there a few picks later. Atlanta will give you the No. 5 pick, Tim Dwight, and more draft capital to move up for Vick.",
    question: "Do you trade down?",
    actualOptionId: "down",
    whatHappened:
      "San Diego traded down, drafted Tomlinson at No. 5, and came away with extra picks. Tomlinson became a Hall of Famer. Vick's career had brilliance and a long interruption. The Chargers got the cleaner piece and the extra swings.",
    options: [
      { id: "down", label: "Trade down and draft Tomlinson", detail: "Take the back you want and the picks you do not have.", grade: "green", score: 96, popularity: 0.26, why: "You got a Hall of Famer and kept ammunition. That is the trade.", echo: "John Butler" },
      { id: "vick", label: "Stay at 1 and draft Vick", detail: "You do not trade the right to pick a quarterback like this.", grade: "orange", score: 45, popularity: 0.4, why: "The talent was obvious. The career was not the one Tomlinson gave you.", echo: "A traits chaser" },
      { id: "hold", label: "Stay at 1 and take Tomlinson anyway", detail: "Do not get cute. Just take your guy.", grade: "yellow", score: 68, popularity: 0.18, why: "You still get LT. You leave Atlanta's picks on the table for no reason.", echo: "A one-player war room" },
      { id: "defense", label: "Trade down and draft defense", detail: "Running backs are a luxury. Fix the roster.", grade: "yellow", score: 66, popularity: 0.16, why: "Defensible roster building. Passing on Tomlinson at five was still leaving a star.", echo: "A needs GM" },
    ],
  },
  {
    id: "goff-2016",
    category: "Trade",
    year: 2016,
    team: "LAR",
    teamName: "Los Angeles Rams",
    title: "The first pick has a price",
    situation:
      "You are new in Los Angeles and picking in the middle of the 2016 first round. Tennessee will move off No. 1. It will cost this year's first, multiple seconds, and next year's first. Jared Goff is the prospect. Carson Wentz is going second to Philadelphia either way.",
    question: "Do you empty the cabinet for Goff?",
    actualOptionId: "pay",
    whatHappened:
      "The Rams paid the haul and drafted Goff. He started a Super Bowl, was traded to Detroit in the Stafford deal, and became a good veteran there. Tennessee used the capital to keep building. Los Angeles won later with a different quarterback and a thinner draft.",
    options: [
      { id: "stay", label: "Stay in the middle and keep the future first", detail: "A quarterback is a want. Three premium picks are a plan.", grade: "green", score: 86, popularity: 0.24, why: "The price was the problem. Goff was a starter, not a bargain at that cost.", echo: "A capital hawk" },
      { id: "pay", label: "Pay it and draft Goff", detail: "Moving cities needs a quarterback. You do not want to wait.", grade: "orange", score: 48, popularity: 0.4, why: "This is the deal. It bought a starter and sold a lot of the next two drafts.", echo: "Les Snead" },
      { id: "wentz", label: "Move only as high as No. 2 and take Wentz", detail: "If you are trading, trade for the other quarterback and pay less.", grade: "yellow", score: 64, popularity: 0.2, why: "Wentz's career broke differently, and the smaller move is still a real price.", echo: "Howie Roseman" },
      { id: "veteran", label: "Trade the first for a veteran quarterback today", detail: "Prospects take time you do not have.", grade: "red", score: 30, popularity: 0.16, why: "You would have spent the same scarcity on a shorter runway.", echo: "A relocation promoter" },
    ],
  },
  {
    id: "manziel-2014",
    category: "Draft",
    year: 2014,
    team: "CLE",
    teamName: "Cleveland Browns",
    title: "The 22nd pick and a loud quarterback",
    situation:
      "You are picking 22nd in 2014. Johnny Manziel is the name the owner likes and the fans are chanting. Teddy Bridgewater is still on the board, along with defensive starters. Your starter situation is a bridge, not a plan.",
    question: "What do you do at 22?",
    actualOptionId: "johnny",
    whatHappened:
      "Cleveland drafted Manziel. He started a handful of games and was out of the league quickly. Bridgewater went 32nd to Minnesota and had a real, injury-shortened career. The pick became a symbol of drafting the noise.",
    options: [
      { id: "teddy", label: "Draft Bridgewater", detail: "Take the quarterback your scouts can live with on Sundays.", grade: "green", score: 84, popularity: 0.18, why: "A professional starter was available. The circus was optional.", echo: "A pro-day skeptic" },
      { id: "defense", label: "Draft the best defender and take a quarterback on day two", detail: "Derek Carr's range is later. Do not spend 22 on a coin flip.", grade: "yellow", score: 76, popularity: 0.28, why: "Carr became a long starter. Waiting was viable. Ignoring quarterback entirely was not.", echo: "Reggie McKenzie" },
      { id: "johnny", label: "Draft Manziel", detail: "The building is electric. Maybe that matters.", grade: "red", score: 14, popularity: 0.4, why: "This is the pick. It failed quickly and publicly.", echo: "A headline GM" },
      { id: "trade", label: "Trade the pick for a veteran receiver", detail: "You can sell the drama and add a known player.", grade: "orange", score: 44, popularity: 0.14, why: "Leaving the circus was good. Spending the pick on a receiver did not fix quarterback.", echo: "A distraction trader" },
    ],
  },
  {
    id: "russell-2007",
    category: "Draft",
    year: 2007,
    team: "LV",
    teamName: "Oakland Raiders",
    title: "No. 1, and the workout was a show",
    situation:
      "You have the first pick in 2007. JaMarcus Russell has the strongest arm anyone in the building has seen. Calvin Johnson, a receiver you cannot scheme open because he simply is open, is the other blue-chip name. Your roster needs both a quarterback and a reason for anyone to cover a receiver.",
    question: "Who goes first?",
    actualOptionId: "russell",
    whatHappened:
      "Oakland drafted Russell. He started a few seasons and was a historic bust. Detroit took Johnson second and watched him become one of the best receivers ever. The pick set the franchise back years.",
    options: [
      { id: "megatron", label: "Draft Calvin Johnson", detail: "Take the player who is going to ruin coverages for a decade.", grade: "green", score: 97, popularity: 0.3, why: "Johnson was the sure Hall of Famer. The quarterback was the mirage.", echo: "Matt Millen's opposite" },
      { id: "trade", label: "Trade down one spot and make someone else choose", detail: "If a team wants Russell, they can pay you to take Johnson.", grade: "yellow", score: 80, popularity: 0.18, why: "Getting paid to take Johnson is the dream. You had to be willing to lose him if nobody called.", echo: "A cold trader" },
      { id: "russell", label: "Draft Russell", detail: "You cannot pass on a quarterback with that arm at No. 1.", grade: "red", score: 12, popularity: 0.4, why: "This is the pick. It is one of the clearest misses at the top of a draft.", echo: "A workout GM" },
      { id: "tackle", label: "Draft a tackle and sign a bridge quarterback", detail: "Protect whoever you find later.", grade: "orange", score: 46, popularity: 0.12, why: "Line matters. Passing on Johnson to do it did not.", echo: "A trench romantic" },
    ],
  },
  {
    id: "peyton-1998",
    category: "Draft",
    year: 1998,
    team: "IND",
    teamName: "Indianapolis Colts",
    title: "Peyton or Leaf",
    situation:
      "You have the first pick in 1998. Peyton Manning is the surgeon. Ryan Leaf is the athlete a slice of the league thinks has the higher ceiling, and he is not quiet about it. You need a quarterback badly enough that the season was built to find one.",
    question: "Who do you draft?",
    actualOptionId: "peyton",
    whatHappened:
      "Indianapolis drafted Manning. He became a first-ballot Hall of Famer and the center of a champion. San Diego took Leaf second. That career collapsed under accuracy, injuries, and the building around him.",
    options: [
      { id: "peyton", label: "Draft Peyton Manning", detail: "Take the quarterback who is already a professional.", grade: "green", score: 99, popularity: 0.62, why: "The right answer, and a lot of people get it. It was still the fork in the road.", echo: "Bill Polian" },
      { id: "leaf", label: "Draft Ryan Leaf", detail: "You are drafting the ceiling, not the clipboard.", grade: "red", score: 10, popularity: 0.18, why: "Leaf was the bust of the class. The tools did not survive the league.", echo: "A ceiling chaser" },
      { id: "trade", label: "Trade down and take whichever quarterback is left", detail: "Both are first-rounders. Get a team to pay you.", grade: "orange", score: 40, popularity: 0.12, why: "Trading off Manning to collect a fee is how you get cute and lose him.", echo: "A trader without a quarterback" },
      { id: "line", label: "Draft a left tackle and find a quarterback later", detail: "A bad line will ruin either of them.", grade: "orange", score: 36, popularity: 0.08, why: "The line can be found. A career like Manning's cannot.", echo: "A blind-side purist" },
    ],
  },
  {
    id: "wilson-2022",
    category: "Trade",
    year: 2022,
    team: "DEN",
    teamName: "Denver Broncos",
    title: "Seattle will move Russell Wilson",
    situation:
      "You have been searching for a quarterback. Seattle will trade Russell Wilson for two firsts, two seconds, and several players, including tight end Noah Fant. Wilson is 33. Your coach wants a star, and the owner is tired of the search.",
    question: "Do you make the Wilson trade?",
    actualOptionId: "pay",
    whatHappened:
      "Denver made the trade and gave Wilson a large extension. The fit never worked. Seattle used the picks to restock and stayed competitive. Denver spent the next years digging out of the cap and the draft hole.",
    options: [
      { id: "picks", label: "Keep the picks and keep looking in the draft", detail: "A 33-year-old quarterback should not cost four premium picks.", grade: "green", score: 92, popularity: 0.2, why: "The picks were the story. Seattle cashed them. Denver wore them.", echo: "A draft-first GM" },
      { id: "less", label: "Offer one first and walk if they say no", detail: "You can want him at a price.", grade: "yellow", score: 75, popularity: 0.22, why: "A smaller deal might have been survivable. The published price was not.", echo: "A disciplined bidder" },
      { id: "pay", label: "Pay the haul and acquire Wilson", detail: "The city wants a face. He is a Super Bowl quarterback.", grade: "red", score: 22, popularity: 0.46, why: "This is the trade. Age, cost, and fit all broke the same direction.", echo: "George Paton" },
      { id: "extend-more", label: "Add another starter so they cannot say no", detail: "If you are doing it, finish it.", grade: "red", score: 12, popularity: 0.12, why: "The deal was already a hole. Digging it deeper is not a strategy.", echo: "An owner in a hurry" },
    ],
  },
  {
    id: "stafford-2021",
    category: "Trade",
    year: 2021,
    team: "DET",
    teamName: "Detroit Lions",
    title: "Matthew Stafford wants a chance to win",
    situation:
      "Your quarterback has asked for a fresh start. The Rams will send Jared Goff, two first-round picks, and a third for Matthew Stafford. Goff's contract is bulky. The picks are the point. Your roster is not a quarterback away.",
    question: "Do you trade Stafford?",
    actualOptionId: "trade",
    whatHappened:
      "Detroit made the trade. Stafford won a Super Bowl in Los Angeles that season. Detroit used the picks on players who became the core of a contender, including Aidan Hutchinson. Goff was rehabilitated into the Lions' starter.",
    options: [
      { id: "trade", label: "Make the trade", detail: "Take Goff and the picks. Rebuild with ammunition.", grade: "green", score: 94, popularity: 0.3, why: "Both teams got what they needed. Detroit's return became a roster.", echo: "Brad Holmes" },
      { id: "keep", label: "Keep Stafford and try one more push", detail: "You do not give away a healthy franchise quarterback.", grade: "orange", score: 42, popularity: 0.28, why: "Loyalty without a roster is how you waste a good quarterback's last years.", echo: "A loyalist" },
      { id: "more", label: "Hold out for three firsts", detail: "If they want him in February, they can pay March prices.", grade: "yellow", score: 70, popularity: 0.24, why: "The actual return was already excellent. Overplaying it could have sent him somewhere that offered less.", echo: "A hard negotiator" },
      { id: "cut", label: "Let him walk or cut him rather than take Goff's deal", detail: "You do not want that contract in the building.", grade: "red", score: 20, popularity: 0.18, why: "You would have donated a Super Bowl quarterback.", echo: "A cap panic" },
    ],
  },
  {
    id: "hopkins-2020",
    category: "Trade",
    year: 2020,
    team: "HOU",
    teamName: "Houston Texans",
    title: "Arizona's offer for DeAndre Hopkins",
    situation:
      "DeAndre Hopkins is one of the best receivers in football and wants a new contract. Arizona offers running back David Johnson, a second-round pick, and a fourth. They want Hopkins and a fourth back. Your new front office is cleaning house.",
    question: "Do you take Arizona's offer?",
    actualOptionId: "trade",
    whatHappened:
      "Houston made the trade. Hopkins kept producing in Arizona. David Johnson did not replace him. The pick compensation was light for a top-five receiver. The deal is still the example people use when a trade has no defense.",
    options: [
      { id: "hold", label: "Keep Hopkins and do the extension", detail: "You do not trade a peak receiver for a running back.", grade: "green", score: 97, popularity: 0.34, why: "Paying a great player is almost always cheaper than replacing him for parts.", echo: "A builder" },
      { id: "first", label: "Shop him, and hang up unless a first-round pick is in the deal", detail: "If the relationship is dead, get real value.", grade: "yellow", score: 78, popularity: 0.28, why: "A real market existed. Taking the first call was the error.", echo: "A patient seller" },
      { id: "trade", label: "Accept the Johnson package", detail: "You want the cap clean and the drama gone.", grade: "red", score: 8, popularity: 0.22, why: "This is the trade. It is the reddest folder in the set.", echo: "Bill O'Brien" },
      { id: "cut", label: "Cut him and eat the cap rather than negotiate", detail: "Nobody holds this building hostage.", grade: "red", score: 15, popularity: 0.16, why: "You would have created the same hole and received nothing.", echo: "A grudge" },
    ],
  },
  {
    id: "brown-2018",
    category: "Trade",
    year: 2018,
    team: "PIT",
    teamName: "Pittsburgh Steelers",
    title: "Antonio Brown wants the building to revolve around him",
    situation:
      "Training camp, 2018. Antonio Brown is still elite and already a daily crisis. A contender will give you a first-round pick today. You can also pay him again, or try to survive the season and deal with it in the winter.",
    question: "What do you do with Brown?",
    actualOptionId: "wait",
    whatHappened:
      "Pittsburgh kept him through 2018, missed the playoffs on a tiebreaker, and traded him to Oakland the next spring for a third and a fifth. The later stops got louder. The first-round market was a 2018 conversation, not a 2019 one.",
    options: [
      { id: "first", label: "Trade him now for a first", detail: "Sell while the league still thinks it can handle him.", grade: "green", score: 90, popularity: 0.2, why: "The return collapsed after one more year of noise. The player was still great. The market was not.", echo: "A timing GM" },
      { id: "wait", label: "Play the season and revisit it", detail: "He is still your best weapon. You are trying to win.", grade: "yellow", score: 66, popularity: 0.42, why: "This is close to what happened. You got the production and a worse trade.", echo: "Kevin Colbert" },
      { id: "pay", label: "Tear up the deal and pay him like the face of the team", detail: "Stars get paid. Do it and move on.", grade: "orange", score: 40, popularity: 0.24, why: "More money did not fix the fit. It would have made the exit more expensive.", echo: "A star payer" },
      { id: "cut", label: "Cut him and keep the locker room", detail: "Culture over production, effective today.", grade: "red", score: 24, popularity: 0.14, why: "You can want the culture and still refuse to donate an All-Pro.", echo: "A principal, not a GM" },
    ],
  },
  {
    id: "moss-2007",
    category: "Trade",
    year: 2007,
    team: "NE",
    teamName: "New England Patriots",
    title: "Oakland will take a fourth for Randy Moss",
    situation:
      "Randy Moss is 30, coming off a muted year in Oakland, and available for a fourth-round pick. You have Tom Brady. You do not have a receiver who scares anyone vertically. The locker room will have an opinion about Moss's reputation.",
    question: "Do you trade a fourth for Moss?",
    actualOptionId: "trade",
    whatHappened:
      "New England made the trade. Moss caught 23 touchdowns, still the single-season record, and the offense rewrote the record book. The Patriots went 16-0 in the regular season and lost the Super Bowl. The price was a fourth.",
    options: [
      { id: "trade", label: "Trade the fourth and line him up outside", detail: "Brady does not need a saint. He needs a vertical.", grade: "green", score: 96, popularity: 0.38, why: "One of the cheapest star acquisitions of the century. The production was immediate.", echo: "Scott Pioli" },
      { id: "character", label: "Pass. You do not import the headache.", detail: "The culture is the advantage. Do not rent a problem.", grade: "orange", score: 38, popularity: 0.28, why: "The culture survived. The offense without him is a different team.", echo: "A culture czar" },
      { id: "less", label: "Offer a fifth and nothing more", detail: "You like the player. You do not like paying ask.", grade: "yellow", score: 70, popularity: 0.2, why: "A fifth might have worked. Losing the deal over one round would have been a bad hill.", echo: "A nickel-and-dimer" },
      { id: "rb", label: "Spend the fourth on a running back instead", detail: "You want January touches, not a deep threat.", grade: "red", score: 28, popularity: 0.14, why: "The offense's missing piece was the vertical, and it was on sale.", echo: "A ground-and-pound GM" },
    ],
  },
  {
    id: "jimmy-2017",
    category: "Trade",
    year: 2017,
    team: "SF",
    teamName: "San Francisco 49ers",
    title: "New England will move Jimmy Garoppolo",
    situation:
      "The trade deadline, 2017. You are 0-8 and your quarterback position is a hole. New England will trade Jimmy Garoppolo for a second-round pick. He has started a handful of games. He is also young, and the coach who trusts him is Bill Belichick.",
    question: "Do you send the second?",
    actualOptionId: "trade",
    whatHappened:
      "San Francisco made the trade. Garoppolo won his five starts that year, signed a large extension, and later took the team to a Super Bowl before injuries. The second-round price was modest for a quarterback who stabilized the building.",
    options: [
      { id: "trade", label: "Trade the second for Garoppolo", detail: "You need a real starter more than you need day-two depth.", grade: "green", score: 86, popularity: 0.32, why: "The price was right and the player changed the floor of the roster.", echo: "John Lynch" },
      { id: "wait", label: "Wait for the draft. Do not pay a second for a backup.", detail: "Five starts is not a résumé.", grade: "yellow", score: 64, popularity: 0.3, why: "Patience is reasonable. The market for young starters is rarely this cheap.", echo: "A draft purist" },
      { id: "first", label: "Offer a first so nobody else can bid", detail: "If you want him, end the conversation.", grade: "orange", score: 45, popularity: 0.18, why: "Overpaying for a player you can get with a second is how good ideas get worse.", echo: "An eager bidder" },
      { id: "rb", label: "Use the second to draft a running back and keep the bridge", detail: "The season is over. Do not chase.", grade: "red", score: 30, popularity: 0.2, why: "The season was over. The quarterback problem was not going to wait for a running back.", echo: "A position-of-need miss" },
    ],
  },
  {
    id: "rodgers-2023",
    category: "Trade",
    year: 2023,
    team: "NYJ",
    teamName: "New York Jets",
    title: "Green Bay will trade Aaron Rodgers",
    situation:
      "Your defense is ready and your quarterback is not. Green Bay will trade Aaron Rodgers, who is about to turn 40, for a first-round pick, a second, and a conditional pick. He wants a new deal to do it. The swing is obvious and so is the age.",
    question: "Do you mortgage the pick for one year of Rodgers?",
    actualOptionId: "trade",
    whatHappened:
      "The Jets made the trade. Rodgers tore his Achilles four snaps into the season. The conditional pick did not fully escalate because he did not play. The roster spent a year waiting, and the first-round pick was gone.",
    options: [
      { id: "build", label: "Keep the first and build around the defense", detail: "A 39-year-old is a bet, not a plan.", grade: "green", score: 88, popularity: 0.24, why: "The price was a year of the draft for a body that did not hold up. Keeping the pick was the sturdy play.", echo: "A window accountant" },
      { id: "less", label: "Offer a second and a conditional first, nothing more", detail: "You will swing if the downside is capped.", grade: "yellow", score: 74, popularity: 0.22, why: "A cheaper structure would have hurt less when the snaps disappeared.", echo: "A conditional thinker" },
      { id: "trade", label: "Pay the first and go get him", detail: "The defense is wasted without a real quarterback. Take the shot.", grade: "orange", score: 46, popularity: 0.42, why: "This is the trade. The logic was a swing. The result was four snaps.", echo: "Joe Douglas" },
      { id: "two-years", label: "Add another first so he signs for two years", detail: "If you are doing it, buy the extra season up front.", grade: "red", score: 20, popularity: 0.12, why: "More guaranteed capital on a 40-year-old is the version that gets you fired twice.", echo: "An owner with a TV" },
    ],
  },
  {
    id: "brady-2020",
    category: "Contract",
    year: 2020,
    team: "TB",
    teamName: "Tampa Bay Buccaneers",
    title: "Tom Brady is a free agent",
    situation:
      "March 2020. Tom Brady is leaving New England. You have Jameis Winston, a cannon, and a pile of turnovers. Brady is 42. Your receiver room, if you can add one more piece, is interesting. The cap can fit a short deal.",
    question: "Do you sign Brady?",
    actualOptionId: "sign",
    whatHappened:
      "Tampa Bay signed Brady, added receivers around him, and won Super Bowl LV that season. He played three years there. Winston's tenure as the starter ended. The short deal was the opposite of a decade-long cap problem.",
    options: [
      { id: "sign", label: "Sign Brady to a short deal", detail: "Two years, real money, no lifetime cap trap.", grade: "green", score: 98, popularity: 0.36, why: "A champion, immediately, on a deal that ended. That is the free-agent swing that worked.", echo: "Jason Licht" },
      { id: "winston", label: "Keep Winston and spend the money on the line", detail: "You do not hand the team to a 42-year-old.", grade: "orange", score: 40, popularity: 0.28, why: "The line matters. Passing on this quarterback was passing on the season they actually won.", echo: "A skeptic of age" },
      { id: "long", label: "Sign him, but for four years so he cannot leave", detail: "If he is the answer, lock the door.", grade: "yellow", score: 68, popularity: 0.18, why: "You still get the player. You also invent dead money a short deal avoids.", echo: "A lock-it-up GM" },
      { id: "rookie", label: "Neither. Draft a quarterback and rebuild", detail: "The window talk is a trap. Start over.", grade: "red", score: 24, popularity: 0.18, why: "The roster was a quarterback away, which is rare. Rebuilding was the expensive kind of patient.", echo: "A rebuilder in a contending building" },
    ],
  },
  {
    id: "wilson-2012",
    category: "Draft",
    year: 2012,
    team: "SEA",
    teamName: "Seattle Seahawks",
    title: "Round 3, and Matt Flynn is the starter",
    situation:
      "You paid Matt Flynn to be the quarterback. It is the third round, pick 75, in 2012. Russell Wilson is still there, short for the era's prototype and efficient in a way your scouts will not shut up about. The room can take a lineman and go to dinner.",
    question: "Do you draft Wilson anyway?",
    actualOptionId: "wilson",
    whatHappened:
      "Seattle drafted Wilson. He won the job in camp, won a Super Bowl in his second year, and became the franchise quarterback for a decade. Flynn never started a game for them.",
    options: [
      { id: "wilson", label: "Draft Russell Wilson", detail: "A third is a fair price for a real quarterback argument.", grade: "green", score: 99, popularity: 0.34, why: "The best value pick in this whole stack. The sunk cost on Flynn was the trap.", echo: "John Schneider" },
      { id: "line", label: "Draft the lineman and let Flynn play", detail: "You already paid the starter. Do not undermine him in April.", grade: "orange", score: 36, popularity: 0.3, why: "Protecting a free-agent signing is how you talk yourself out of a Hall of Fame quarterback.", echo: "A sunk-cost GM" },
      { id: "trade", label: "Trade the pick for a veteran pass rusher", detail: "You are trying to win with defense. Act like it.", grade: "yellow", score: 60, popularity: 0.2, why: "The defense was already the identity. The missing piece was the cheap quarterback.", echo: "A defense-first GM" },
      { id: "rb", label: "Draft another running back", detail: "You know who you are. Run it.", grade: "red", score: 22, popularity: 0.16, why: "Marshawn Lynch was already there. A third-round back was not the argument.", echo: "A one-note offense" },
    ],
  },
  {
    id: "dak-2016",
    category: "Draft",
    year: 2016,
    team: "DAL",
    teamName: "Dallas Cowboys",
    title: "Tony Romo is the starter. A fourth is sitting there.",
    situation:
      "Round 4, 2016. Tony Romo is your quarterback when he is healthy, which is the clause. Dak Prescott is available, a player your scouts like more than the round suggests. You can also take a defender and trust the training staff.",
    question: "Do you spend the fourth on Prescott?",
    actualOptionId: "dak",
    whatHappened:
      "Dallas drafted Prescott. Romo was lost in the preseason, Dak started as a rookie, and the Cowboys went 13-3. He became the long-term starter. The pick was a fourth.",
    options: [
      { id: "dak", label: "Draft Dak Prescott", detail: "A fourth-round quarterback is cheap insurance that sometimes starts for a decade.", grade: "green", score: 93, popularity: 0.3, why: "The cost was trivial and the outcome was a franchise quarterback.", echo: "Will McClay" },
      { id: "defense", label: "Draft defense. Romo is the plan.", detail: "You do not spend a pick undermining the starter.", grade: "yellow", score: 62, popularity: 0.36, why: "Reasonable in April. Fragile the moment Romo got hurt, which he did.", echo: "A veteran-respect GM" },
      { id: "rb", label: "Draft a running back to pair with Ezekiel Elliott", detail: "You are building a ground game. Finish it.", grade: "red", score: 28, popularity: 0.14, why: "Elliott was already the first-round pick. Another back was not the need.", echo: "A double-down GM" },
      { id: "trade", label: "Trade the fourth for a future third", detail: "You like next year's board more than this name.", grade: "orange", score: 44, popularity: 0.2, why: "Punting a fourth is fine in the abstract. This particular fourth was not abstract.", echo: "A pick hoarder" },
    ],
  },
  {
    id: "bradford-2015",
    category: "Trade",
    year: 2015,
    team: "PHI",
    teamName: "Philadelphia Eagles",
    title: "St. Louis will swap Bradford for Foles",
    situation:
      "You want a new quarterback voice. St. Louis will trade Sam Bradford and you will send Nick Foles plus a second-round pick. Bradford is talented and rarely healthy. Foles has already had a huge season in your building and a quiet one after it.",
    question: "Do you make the Bradford trade?",
    actualOptionId: "trade",
    whatHappened:
      "Philadelphia made the trade. Bradford had an injury-hit year. The Eagles later traded more capital to draft Carson Wentz, then won a Super Bowl with Foles, who had found his way back. The 2015 swap was a lot of motion for a one-year starter.",
    options: [
      { id: "keep", label: "Keep Foles and the second", detail: "You already know what he looks like here. Do not pay to find out about someone else.", grade: "green", score: 82, popularity: 0.22, why: "The pick and the player you knew were worth more than the year you got.", echo: "A continuity GM" },
      { id: "no-pick", label: "Swap the quarterbacks and refuse to add the second", detail: "A body for a body. The pick stays.", grade: "yellow", score: 70, popularity: 0.24, why: "A clean swap is a fair argument. Attaching a second made it a bad one.", echo: "A price discipline GM" },
      { id: "trade", label: "Send Foles and the second for Bradford", detail: "Your coach wants a different voice. Give it to him.", grade: "orange", score: 42, popularity: 0.38, why: "This is the trade. It bought an injured year and spent a pick the roster needed.", echo: "Chip Kelly's front office" },
      { id: "both", label: "Trade Foles and draft a quarterback in the first as well", detail: "Burn the boats.", grade: "red", score: 26, popularity: 0.16, why: "Two swings at once is how you end up with neither a pick nor a starter.", echo: "An impatient reset" },
    ],
  },
  {
    id: "gruden-2002",
    category: "Coach",
    year: 2002,
    team: "TB",
    teamName: "Tampa Bay Buccaneers",
    title: "Oakland will take a fortune for Jon Gruden",
    situation:
      "You want Jon Gruden. Oakland wants two first-round picks, two second-round picks, and cash. Tony Dungy is the coach you already have, and he has built a defense that looks like a champion waiting on an offense. The owner wants the offensive mind.",
    question: "Do you pay the Gruden price?",
    actualOptionId: "trade",
    whatHappened:
      "Tampa Bay made the trade, fired the old staff, and won Super Bowl XXXVII in Gruden's first season. Dungy went to Indianapolis and built a champion there. Both paths won a ring. Only one of them won it that year in Tampa.",
    options: [
      { id: "trade", label: "Pay the picks and hire Gruden", detail: "The defense is ready. You are buying the offense and the whistle.", grade: "green", score: 88, popularity: 0.34, why: "The price was outrageous and the season was a championship. That is a rare receipt.", echo: "Rich McKay" },
      { id: "dungy", label: "Keep Dungy and find an offensive coordinator", detail: "You do not fire a builder to rent a play-caller.", grade: "yellow", score: 76, popularity: 0.3, why: "Dungy won a Super Bowl too. It just was not yours, and it was not that February.", echo: "A stability GM" },
      { id: "cheap", label: "Offer one first and walk away", detail: "Nobody is worth four picks.", grade: "yellow", score: 68, popularity: 0.22, why: "Walking was principled. The coach who was worth the exception was on the other side of the phone.", echo: "A pick counter" },
      { id: "college", label: "Hire a college coach and keep every pick", detail: "Schemes can be bought without sending a draft to Oakland.", grade: "orange", score: 40, popularity: 0.14, why: "Possible. Slower. The defense's window was not a five-year project.", echo: "A developer" },
    ],
  },
  {
    id: "elway-1983",
    category: "Trade",
    year: 1983,
    team: "IND",
    teamName: "Baltimore Colts",
    title: "Elway says he will not play here",
    situation:
      "You have the first pick in 1983 and the best quarterback in the class, John Elway, has said he will not play for the Colts. Denver is willing to send offensive lineman Chris Hinton, a backup quarterback, and a first-round pick next year. You can also try to force it, or pass on him entirely.",
    question: "What do you do with the Elway problem?",
    actualOptionId: "denver",
    whatHappened:
      "Baltimore drafted Elway and traded him to Denver for Hinton, Mark Herrmann, and a 1984 first. Hinton became a good tackle. Elway became a Hall of Famer and won two Super Bowls in Denver. The return was real and not close to the player.",
    options: [
      { id: "haul", label: "Refuse Denver's package and wait for a franchise haul", detail: "If he will not play here, the next team can empty the cabinet.", grade: "green", score: 90, popularity: 0.18, why: "The actual return was light for a career like that. Holding the line was the value play.", echo: "A leverage GM" },
      { id: "report", label: "Draft a player who will report and keep your leverage for later", detail: "Do not spend No. 1 on a holdout.", grade: "yellow", score: 72, popularity: 0.22, why: "You avoid the hostage. You also might be passing on the best quarterback anyone in the room will ever see.", echo: "A practical GM" },
      { id: "denver", label: "Take Denver's package and move on", detail: "Hinton is a starter. A future first is not nothing.", grade: "orange", score: 48, popularity: 0.36, why: "This is the trade. It was something. It was not enough.", echo: "The 1983 Colts" },
      { id: "force", label: "Draft him and make him show up", detail: "No rookie dictates to the building.", grade: "red", score: 20, popularity: 0.24, why: "He was not bluffing. A holdout at quarterback is a wasted No. 1.", echo: "A power struggle" },
    ],
  },
  {
    id: "luck-2011",
    category: "Draft",
    year: 2011,
    team: "IND",
    teamName: "Indianapolis Colts",
    title: "Peyton might not play again. You pick first.",
    situation:
      "The 2010 season fell apart while Peyton Manning's neck was the only story. You have the 2011 No. 1 pick. Andrew Luck is the prospect. You could also shop the pick to a team that wants Luck and try to keep the Manning window open with the haul.",
    question: "What do you do with No. 1?",
    actualOptionId: "luck",
    whatHappened:
      "Indianapolis drafted Luck. Manning was released and won another Super Bowl in Denver. Luck became an excellent quarterback and retired early, in 2019, after injuries. The pick was still the right use of No. 1.",
    options: [
      { id: "luck", label: "Draft Andrew Luck", detail: "You take the quarterback. The Manning question is a separate, sad conversation.", grade: "green", score: 92, popularity: 0.4, why: "Luck was worthy of the pick. The early retirement does not rewrite the decision.", echo: "Chris Polian" },
      { id: "shop", label: "Shop the pick for a haul and try to keep Manning", detail: "A healthy Peyton is worth more than a prospect.", grade: "orange", score: 44, popularity: 0.28, why: "Manning was not staying. Trading the pick would have left you with neither.", echo: "A window clinger" },
      { id: "both", label: "Draft Luck and spend whatever it takes to keep Manning for a year", detail: "A tutorial year, then a handoff.", grade: "yellow", score: 70, popularity: 0.18, why: "Pretty, and the cap and the neck were not going to cooperate. Drafting Luck was the part that mattered.", echo: "A romantic" },
      { id: "defense", label: "Draft a pass rusher and sign a bridge", detail: "Do not assume Manning is done, and do not assume Luck is him.", grade: "red", score: 26, popularity: 0.14, why: "No. 1 in that draft was a quarterback pick. Using it elsewhere was a different sport.", echo: "A hedger" },
    ],
  },
  {
    id: "julio-2011",
    category: "Trade",
    year: 2011,
    team: "ATL",
    teamName: "Atlanta Falcons",
    title: "Cleveland will let you go get Julio Jones",
    situation:
      "You pick 27th. Cleveland, at No. 6, will move back if you send this year's first, a second, a fourth, and next year's first. Julio Jones is the receiver. Your offense already has weapons. It does not have a player who looks like him.",
    question: "Do you make the Julio trade?",
    actualOptionId: "trade",
    whatHappened:
      "Atlanta made the trade and drafted Jones. He became a defining receiver of the decade, a constant All-Pro argument, and the center of the offense. The price was steep. The player was good enough that the bill got paid in production.",
    options: [
      { id: "trade", label: "Make the trade and draft Jones", detail: "Pay the future first. Receivers like this do not sit at 27.", grade: "green", score: 90, popularity: 0.26, why: "Expensive, and it hit. A decade of Julio was the return.", echo: "Thomas Dimitroff" },
      { id: "stay", label: "Stay at 27 and take the best player there", detail: "Future firsts are how you stay in the draft.", grade: "yellow", score: 68, popularity: 0.34, why: "Capital matters. Passing on a receiver of that grade at a price you can survive is the conservative miss.", echo: "A pick protector" },
      { id: "less", label: "Offer this year's first and a third, nothing future", detail: "You will move up. You will not move out of next year.", grade: "yellow", score: 72, popularity: 0.24, why: "If Cleveland says yes, you win the trade. They were not saying yes.", echo: "A lowballer" },
      { id: "qb", label: "Use the package to trade up for a quarterback instead", detail: "If you are spending a future first, spend it on the position.", grade: "orange", score: 40, popularity: 0.16, why: "Matt Ryan was already the quarterback. A second one would have been the wrong target for the same money.", echo: "A position zealot" },
    ],
  },
  {
    id: "osweiler-2016",
    category: "Contract",
    year: 2016,
    team: "DEN",
    teamName: "Denver Broncos",
    title: "Houston's offer for Brock Osweiler",
    situation:
      "You just won Super Bowl 50. Peyton Manning is retiring. Brock Osweiler started seven games down the stretch and has a market. Houston is ready to pay him like a franchise quarterback, around four years and $72 million. You can match it, or you can let him walk and look again.",
    question: "Do you match Houston?",
    actualOptionId: "walk",
    whatHappened:
      "Denver let him walk. Houston paid him, watched a bad year, and traded him to Cleveland. The Broncos did not smoothly replace Manning, and they were still right not to pay that contract. The deal was the mistake. Letting it be someone else's mistake was the move.",
    options: [
      { id: "walk", label: "Let him walk", detail: "Seven starts is not a $72 million résumé.", grade: "green", score: 91, popularity: 0.28, why: "The contract was a trap. Denver avoided it. The next search was still hard, and still correct.", echo: "John Elway" },
      { id: "short", label: "Offer a one-year, high-salary bridge and nothing longer", detail: "You can buy a year without buying a problem.", grade: "yellow", score: 74, popularity: 0.26, why: "A bridge is rational. He was not taking a bridge. Houston was offering a life-changer.", echo: "A bridge builder" },
      { id: "match", label: "Match the four-year deal", detail: "You just won a title. You do not voluntarily open the quarterback position.", grade: "red", score: 22, popularity: 0.32, why: "Matching would have imported the bad contract and the same player.", echo: "A continuity payer" },
      { id: "trade", label: "Sign him and immediately try to flip him", detail: "Take the asset, then find a buyer.", grade: "orange", score: 36, popularity: 0.14, why: "Cute, and you would have been holding the contract if the flip failed.", echo: "A paper trader" },
    ],
  },
  {
    id: "daniels-2024",
    category: "Draft",
    year: 2024,
    team: "WAS",
    teamName: "Washington Commanders",
    title: "No. 2, Daniels or Maye",
    situation:
      "The 2024 draft. Chicago has taken a quarterback first. You pick second. Jayden Daniels and Drake Maye are the argument. Daniels is the Heisman winner with the rushing gravity. Maye is the bigger, more traditional projection. Your roster has been rebuilt enough to give either one a real line and a real receiver.",
    question: "Who do you draft?",
    actualOptionId: "daniels",
    whatHappened:
      "Washington drafted Daniels. He won Offensive Rookie of the Year and took the team on a playoff run. New England took Maye third, and he also became a serious young starter. Both hits. Daniels was the one that fit the building they had.",
    options: [
      { id: "daniels", label: "Draft Jayden Daniels", detail: "Take the player whose game already stresses a defense.", grade: "green", score: 92, popularity: 0.4, why: "The pick hit immediately. The grade is about the fit and the result, not a claim that Maye was a mistake for someone else.", echo: "Adam Peters" },
      { id: "maye", label: "Draft Drake Maye", detail: "You want the prototype and you are willing to teach the rest.", grade: "yellow", score: 78, popularity: 0.32, why: "Maye has been good. At this seat, Daniels was the sharper match and the faster return.", echo: "A prototype GM" },
      { id: "trade", label: "Trade down with a team that is desperate for one of them", detail: "Two good quarterbacks means someone will pay.", grade: "orange", score: 44, popularity: 0.16, why: "Getting cute at No. 2, when you need the position, is how you leave a rookie-of-the-year on the board.", echo: "A trader at the wrong time" },
      { id: "receiver", label: "Draft a receiver and keep the bridge quarterback", detail: "The class is deep at skill. Do not force a quarterback.", grade: "red", score: 24, popularity: 0.12, why: "The position was the point of the pick. A receiver was a luxury the quarterback would have wanted later.", echo: "A skill-position GM" },
    ],
  },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  ...HISTORICAL_DAILY_CHALLENGES,
  ...FICTIONAL_DAILY_CHALLENGES,
];
