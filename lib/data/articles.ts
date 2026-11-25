export type Article = { slug: string; title: string; description: string; published: string; updated?: string; playHref?: string; sections: readonly { heading: string; paragraphs: readonly string[] }[]; sources?: readonly { label: string; href: string }[]; relatedSlugs?: readonly string[]; legacySection?: "guides" | "news"; figure?: { src: string; alt: string; caption: string; width: number; height: number } };

// These entries drive the canonical article routes, hub and sitemap.
export const publishedArticles: readonly Article[] = [
  {
    "slug": "how-to-play",
    "title": "How to Play Run The Roster: A Beginner's Guide",
    "description": "A clear tour of Daily, Turnaround, Single Season, Career, and Historical in Run The Roster, plus a practical first 30 minutes for new GMs.",
    "playHref": "/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "I built Run The Roster so you can sit in the chair without downloading anything or creating an account. It is a free browser football GM game. You can make one decision today, take a team through a full year, or keep a career going. This page is the map I wish I had on day one: what each mode is, and how I would spend a first half hour.",
          "Run The Roster is an unofficial fan game. It is not affiliated with, endorsed by, or connected to the National Football League or any of its teams. Team marks on the site are abbreviations and colors, not logos."
        ]
      },
      {
        "heading": "The job is the same in every mode",
        "paragraphs": [
          "Every mode asks you to improve the roster without losing control of the cap, the locker room, or the owner's confidence. A trade can look good on the football card and still annoy the owner. A cut can free room and still leave dead money. Two other rules matter before you click anything:",
          "Rosters and historical context use sourced material where a page says so. Ratings, contracts, schedules, draft classes, free-agent markets, and simulated results are modeled game data. I will say \"modeled\" whenever that line matters.",
          "Your progress lives in this browser. The game auto-saves one Single Season file and one Career file locally. Daily results and streaks stay on the device too. There is no cloud save and no player account. If you clear the site's data, that file is gone."
        ]
      },
      {
        "heading": "Daily: one shared decision",
        "paragraphs": [
          "Daily is the shortest way in. You get one front-office call, historical or clearly labeled fictional, then you read the result and the reasoning. Everyone who plays that UTC day gets the same puzzle. You pick one option. The grade locks, and you can compare another path after the fact.",
          "Grades show as ELITE, SOLID, COSTLY, or MISS. On a historical puzzle, the grade is hindsight: how the move turned out, which is not always what the real front office did. On a fictional puzzle, the grade rewards a repeatable process. I walk through both cases in the Daily Challenge Guide. A first Daily takes a few minutes. Play it first."
        ]
      },
      {
        "heading": "Turnaround: beat a real season, same seed as everyone else",
        "paragraphs": [
          "Turnaround is the other daily hook, and it is a full season, not one click. You inherit a sourced historic setup, the same deterministic seed as every other player that day, and a stated win target. Starting one can replace the Single Season file stored in this browser. If you already have a Season in progress, finish or accept the replacement first. The Historic Turnaround Guide covers the win target, the shared seed, and three ways to beat history."
        ]
      },
      {
        "heading": "Single Season: one complete year",
        "paragraphs": [
          "Single Season is the full job for one year. You choose a team, sit through the owner meeting, hire a staff, get the cap in order, decide which expiring players to retain, work the outside market, answer trade calls, draft, cut camp to a compacted sim roster, and then play the year week by week.",
          "The offseason is not flavor text. The owner's brief can favor youth, stars, winning now, culture, or cap flexibility, and that brief follows you into trade reactions and desk decisions. You can play each week yourself or sim ahead once the pending cards are clear. At the end you get a recap, a GM grade, and an owner-confidence score. If confidence falls far enough, you can lose the job.",
          "I wrote a step-by-step of that path in the Single Season Walkthrough. If you have 20 minutes after the Daily, this is the mode I would open next."
        ]
      },
      {
        "heading": "Career: the bill comes due next year",
        "paragraphs": [
          "Career starts from a real team snapshot and then keeps going. Contracts expire. Players age. A new draft class arrives. Dead money from a restructure shows up the following year. A firing can lead to another job instead of ending the file. You can also retire and get a generated retrospective, and the game keeps a legacy score for the run.",
          "Career is where cap habits matter. Room you buy today by restructuring is a charge you will still be managing if you still have the job. That is why I tell people to plan three seasons ahead in the Career Mode Guide. The game keeps one Career file in this browser, separate from Daily and Single Season. Starting over replaces that Career slot after you confirm."
        ]
      },
      {
        "heading": "Historical: six classic rosters, one season each",
        "paragraphs": [
          "Historical hands you a featured club from a year that already happened: the 1985 Bears, 1989 49ers, 1993 Cowboys, 1999 Rams, 2007 Patriots, or 2013 Seahawks. Featured rosters use selected real player names and positions. Ages, ratings, and contracts are modeled. Opponents, coaches, free agents, and draft classes are incomplete or synthetic. Pre-cap years use a payroll guide the owner still reads. Cap years use that season's listed cap number. You play one season, then you are done unless you start another. If you are choosing a first club, use Historical Seasons: Which Team Should You Pick First?."
        ]
      },
      {
        "heading": "The Front Office Desk, scores, and score rooms",
        "paragraphs": [
          "Once a Season or Career file is open, week-to-week work happens at the Front Office Desk. That is the binder: the pending decision, the next opponent, and the meters for owner, fans, locker room, and cap flexibility. Personal scores come from games still saved in this browser. They are not a global leaderboard and are not uploaded. Score rooms are also on-device, created by pasting a result card. Features lists what is open during public testing: Career, historical teams, advanced stat lines, and those rooms. No payment details are requested."
        ]
      },
      {
        "heading": "What a first 30 minutes should look like",
        "paragraphs": [
          "Here is the path I recommend, and it fits in a lunch break.",
          "Minutes 0 to 8: play today's Daily. Open Daily, read the situation twice, and pick an option only when you can explain it in one sentence. After the grade, use \"Compare another path\" and read the \"why\" line on a second choice. That habit matters more than starting a streak.",
          "Minutes 8 to 12: look at today's Turnaround, but do not start it yet if you already have a Season file. Read the setup, the real result, and the win target. A Turnaround is a season, not a puzzle. Come back when you have a full sitting.",
          "Minutes 12 to 30: start a Single Season. Pick a team you actually watch. At the owner meeting, read the brief before you touch a player. Choose Embrace the brief, Split the difference, or Push back on purpose. Hire a staff that does not fight that plan. Then stop at the cap screen and look at room, committed money, and current dead money. Do not restructure anyone until those three numbers are clear. The Salary Cap Explained page is the primer for that screen.",
          "If you already know you want a multi-year file, start Career instead of Season in that last block. You can keep one of each, but you will learn more by finishing one offseason.",
          "It will not sync your file to another phone or browser. It will not tell you that a \"Good\" trade is automatically the right political move. It will not use a real NFL schedule. The slate is generated, and draft prospects and most of the open market are fictional unless a historical screen says otherwise. Camp asks you to land between 22 and 26 players and keep a quarterback. That compacted roster is what the sim actually plays, not a 53-man NFL roster."
        ]
      },
      {
        "heading": "Where to go next",
        "paragraphs": [
          "For scoring rules, read the Daily Challenge Guide. For the offseason in order, use the Single Season Walkthrough. If a cap term is new, keep the Football GM Glossary open. If a screen uses different button labels than I describe here, email me from Contact with the mode, the year, the team, and the screen. I would rather fix the copy than pretend the chair is simpler than it is."
        ]
      }
    ],
    "relatedSlugs": [
      "daily-challenge-guide",
      "single-season-walkthrough",
      "career-mode-guide",
      "historic-turnaround-guide"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/mode-picker.webp",
      "alt": "The Run The Roster home screen with Daily, Single Season and Career cards",
      "caption": "Choose a short Daily decision, a full season, or a multi-year Career.",
      "width": 1036,
      "height": 530
    },
    "published": "2026-11-25"
  },
  {
    "slug": "daily-challenge-guide",
    "title": "Daily Challenge Guide: How Grades Work and How to Score Higher",
    "description": "How Run The Roster grades each Daily call, the difference between historical and fictional puzzles, and a walkthrough of a real board with the four options.",
    "playHref": "/daily/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The Daily is the front door of Run The Roster for a reason. You get one call, the same board as everyone else that UTC day, and a grade you have to live with. This guide explains how that grade is assigned, why the \"right\" answer is not always what the real front office did, and how I would work a board for a higher score without guessing. The example below is the game’s fictional “Move the tackle inside” board. It is a worked example, not a spoiler for today’s puzzle."
        ]
      },
      {
        "heading": "What you are actually being asked",
        "paragraphs": [
          "Open Daily. You will see a category (Trade, Draft, Contract, Roster, or Coach), a title, and a situation. If the puzzle is historical, the year and team are shown. If it is fictional, the game labels it that way and adds a clear line that no real team, player, or historical outcome is implied.",
          "You get four options. One click locks the answer. There is no confirm step and no undo, so read all four labels and the detail lines before you touch anything. After you lock it, the result shows your grade, a short \"why,\" a streak count, and a \"Compare another path\" line so you can read the reasoning on a choice you did not take.",
          "Grades use four words:",
          "ELITE, the strongest process or, on a historical board, the call that holds up best in hindsight",
          "SOLID, a defensible choice with a real trade-off",
          "COSTLY, a tempting move that usually fails for a specific reason",
          "MISS, the option that gives away leverage, structure, or the actual job you are trying to do"
        ]
      },
      {
        "heading": "Historical boards and fictional boards grade differently",
        "paragraphs": [
          "This is the part people miss, and it is the difference between hunting trivia and learning the job.",
          "On a historical puzzle, the write-up includes what actually happened. The grade is hindsight: how the move turned out. That means the call the real front office made is not automatically ELITE. Sometimes the historical choice is COSTLY or worse, and the better grade sits on the option that would have protected the franchise.",
          "A clean example already in the game is the 2012 board about paying multiple first-round picks to trade up for Robert Griffin III. The real club made that trade. The ELITE option on that board is to stay put and keep the future picks, because the published price did not survive contact with injury. The option that matches the real deal is graded COSTLY. \"What happened\" and \"what grades well\" can split, and the result text will tell you why.",
          "On a fictional puzzle, there is no real-world result to imitate. The page says that directly. The grade rewards a repeatable process: price the downside, preserve useful options, and connect the move to a specific roster plan. The four options are written that way on purpose. The ELITE choice is almost never \"pick the famous name\" or \"take the first offer so the uncertainty goes away.\""
        ]
      },
      {
        "heading": "Worked example: “Move the tackle inside”",
        "paragraphs": [
          "The question is simply what you do with that movement. The four options, and the official reasons, are:",
          "A starting tackle has struggled against speed rushers. Moving him to guard might play to his strengths, but the athletic backup is unproven. Choose the role fit and document the contingency. Make the move that helps game day without ignoring the next injury. This is the ELITE call. Depth decisions work when the role and the backup plan are both explicit. You are not guessing which player has the prettier traits. You are assigning jobs.",
          "Favor the younger player and accept early mistakes. Trade short-term certainty for a higher future ceiling. This is SOLID. Development is reasonable when the team can absorb the learning curve. It is a good answer on a club that can live with messy tackle play for a while, and a worse one if you cannot.",
          "Keep the veteran because the room knows him. Prioritize familiarity over current role value. This is COSTLY. Familiarity helps, but it cannot be the entire depth chart.",
          "Keep only the highest theoretical ceiling. Ignore special teams, availability, and weekly assignments. This is a MISS. A roster is a set of jobs, not a prospect ranking.",
          "If I am playing this board for a high grade, I take option 1. Not because kicking a tackle inside is always correct in the NFL, and not because the backup is definitely ready. I take it because it is the only option that makes the role and the injury plan explicit. Option 2 can be right for a rebuilding club, which is why it is SOLID. Option 3 is how rooms talk themselves into leaving a problem at left tackle. Option 4 is a traits argument with no Sunday plan.",
          "The other categories follow the same pattern, and that is the simplest way to raise your grade.",
          "Trade: set a walk-away price and take the best complete offer. Taking the biggest name, or the first offer, is how you get COSTLY or MISS.",
          "Draft: follow the board with a role and a development plan. Drafting the biggest immediate need regardless of the evaluation is COSTLY. Taking the loudest name is a MISS. More on that in Draft Strategy.",
          "Contract: price the downside and keep a practical exit. Matching the richest comparable, or guaranteeing the whole deal just to close it today, is how the grade falls.",
          "Coach: set measurable expectations and keep clear authority. Letting a player vote settle it, or picking the option that merely ends the owner's questions, lands COSTLY or MISS.",
          "The ELITE line often sounds calmer than the others. That is not an accident. The chair rewards a threshold, a backup plan, and a reason you could defend later. It does not reward urgency for its own sake."
        ]
      },
      {
        "heading": "Streaks, freezes, and what is not a live rank",
        "paragraphs": [
          "The result screen shows your streak. Play on consecutive UTC days and it climbs. Miss a day and the streak resets, unless you have a freeze available.",
          "The game explains the freeze rule on the Daily page. You earn one freeze after every seven completed challenges, up to two. A freeze automatically covers one missed day, marked as a freeze, not as a played result. The last-seven-days strip shows played grades, unused days, and freezes.",
          "One thing I will not claim: a live ranking against other players. The current game has no account and no score server. If you share a result, you are sharing your card, not a global percentile. Result codes exist for manual import into an on-device score room, and they are not a public board."
        ]
      },
      {
        "heading": "How I would actually get better at this",
        "paragraphs": [
          "I do not memorize old titles. I use one question on every board: \"What is the downside if I am wrong, and what option still leaves me a next move?\" If I cannot answer that, I am probably about to take the first offer, the famous name, or the veteran's comfort.",
          "Then I read the \"why\" line on a second path, even when I already got ELITE. A SOLID option is often the one I would take in a slightly different year, and knowing why it dropped one grade is more useful than collecting a streak.",
          "If you want a longer sitting after the Daily, today's Turnaround uses the same shared-seed idea on a full historic season. The Historic Turnaround Guide is the companion to this page. If you are brand new, start with How to Play and come back here once you have locked one grade of your own."
        ]
      }
    ],
    "relatedSlugs": [
      "how-to-play",
      "historic-turnaround-guide",
      "draft-strategy-bpa-vs-need",
      "glossary"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/daily-graded.webp",
      "alt": "A completed Daily with a SOLID grade and the highest-scoring alternative highlighted",
      "caption": "A past Daily shows the difference between a defensible call and the strongest available choice.",
      "width": 890,
      "height": 970
    },
    "published": "2026-11-25"
  },
  {
    "slug": "single-season-walkthrough",
    "title": "Single Season Walkthrough: From Owner Brief to Playoffs",
    "description": "A step-by-step Single Season guide for Run The Roster, from the owner meeting and staff hiring through the cap, the draft, camp cuts, and the playoffs.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Single Season is the complete job for one year. You choose a team, set the building in order, and then live with the record in January. This is the walkthrough I use when someone asks what to click, in order, from the owner meeting to the recap. Do not start a Turnaround in the middle of this run unless you mean to replace the Season file. The game auto-saves one Season in this browser, and a Turnaround uses that slot."
        ]
      },
      {
        "heading": "1. Read the owner brief before you touch a player",
        "paragraphs": [
          "The first meeting is not a skip screen. The brief tells you what this owner wants this year: youth, stars, winning now, culture, or cap flexibility. Later trade cards still grade football value as Good, Fair, or Poor, but the owner, fans, and locker room can react differently because of this brief. You answer in one of three ways:",
          "Embrace the brief: match the owner's stated plan. Owner confidence +8.",
          "Split the difference: wins, but not at any price. Owner confidence +2.",
          "Push back: tell the owner the brief is wrong. Owner confidence -6.",
          "There is no secret best click. If you are going to fight the brief in free agency, do not embrace it here just to bank the +8. The meters remember the story you told."
        ]
      },
      {
        "heading": "2. Hire a staff that does not fight the plan",
        "paragraphs": [
          "Next you hire the staff. The roles on the board are head coach, offensive coordinator, defensive coordinator, and scouting director. A youth-first brief and a win-now staff will pull the offseason in opposite directions. I hire for the plan I just agreed to, even if the other candidate has a flashier scheme label."
        ]
      },
      {
        "heading": "3. Get under the number",
        "paragraphs": [
          "The cap screen is where a Season is won or lost before Week 1. In a hard-cap year, cap room is the limit minus active committed contracts and current dead money. Expired deals use no room until you re-sign or tag them. Restructure money becomes next year's dead charge, which matters less in a one-year file and still teaches a bad habit if you click it thoughtlessly. The page will tell you when you are over the cap. You can cut or restructure to make room, and the cut button shows the dead money that would be added.",
          "In a historical payroll-guide season, overspending is allowed, and the owner will penalize it. I cover that distinction in The Salary Cap Explained."
        ]
      },
      {
        "heading": "4. Retain your own, using the one franchise tag carefully",
        "paragraphs": [
          "Wave 1 of free agency, in the current copy, is about your expiring players. You re-sign, use your one franchise tag, or advance and let them reach the market. This is the first place people overspend. Meeting every ask can leave no room for the outside board. Letting everyone walk can leave a hole the draft cannot fill. I keep the players who fit the brief and the cap, I tag only when I need a year of control I cannot replace, and I am willing to lose a good player who no longer fits the plan."
        ]
      },
      {
        "heading": "5. Work the outside market without falling in love",
        "paragraphs": [
          "When your expiring decisions are done, you can open the outside market. The current copy describes up to six outside free agents after CPU-team retention, with elite starters scarce and an affordable option included when one exists. On each player you will usually see three structures:",
          "Meet ask, the annual salary and term they want",
          "Longer term, more years, a different annual",
          "Lower annual, the team-friendly number",
          "Offers that exceed your remaining room are dimmed in a hard-cap season. A player may counter. You can accept the counter or walk away. I sign for a role I already named on the depth chart. If the brief is cap flexibility, a splash veteran at the ask is how you pick a fight with the owner before Week 1."
        ]
      },
      {
        "heading": "6. Answer the trade calls, and read both halves of the card",
        "paragraphs": [
          "Trade calls arrive with a football-value label: Good, Fair, or Poor. That label is about the assets, not the politics. The same card can show a brief reaction for the owner, fans, and locker room, and those meters can move in a different direction than the asset grade. Read both halves before you accept. A Good-value deal can still anger a locker room that was not asked to lose a captain. Value and approval are different. You can pass. Passing is a decision."
        ]
      },
      {
        "heading": "7. Draft your featured picks, then check the automatic ones",
        "paragraphs": [
          "On draft weekend you make the featured picks yourself. Prospects show a college, an age, and a scout grade. That scout number is an evaluation, not a promise. Later current ratings can come in differently once the player is in camp.",
          "You make the featured selections in rounds one through three. Extra picks acquired in trades can change how many times you are on the clock. The scouting staff uses later rounds to address roster needs, but can stop when no available prospect fits under the cap. Every automatic selection appears in the draft log and the camp roster. If you are arguing best player available versus a hole, use the rule in Draft Strategy: take the strongest projection you can actually develop and use."
        ]
      },
      {
        "heading": "8. Get to 26, but land in the real window",
        "paragraphs": [
          "Camp is titled Get to 26. The instruction is more precise than the header: land between 22 and 26 players, and keep a quarterback. This is a compacted sim roster, not a 53-man NFL roster. If you came here expecting to trim from 90 to 53, adjust your eyes. The sim plays the 22 to 26 you keep.",
          "You can pick cuts yourself or click Select suggested cuts. I never confirm the suggestion blindly. Read the list. Estimated added dead money is shown before you accept. Open the season only when the roster is in range and you can live with the depth warnings that remain."
        ]
      },
      {
        "heading": "9. Play the year, then sit with the recap",
        "paragraphs": [
          "Open the season moves you to the week-to-week desk, which you can also reach from Front Office Desk. Buttons include Play the week, Sim to the playoffs, and Finish the year. Mid-season cards, such as an extension question or a deadline trade, have to be answered before those sim buttons will run.",
          "Owner confidence is a job meter. A hot-seat banner appears at 35 or lower. The job ends at 20 or lower. If you stay in the chair, you get a recap with a record, a GM grade, playoff progress or a miss, and cap leftovers. Advanced lines such as Pythagorean wins are available, but on a first run I would ask a simpler question: did I follow the brief I accepted in March?"
        ]
      },
      {
        "heading": "A clean first file, without inventing a result",
        "paragraphs": [
          "If you like the file and want the bills to carry forward, the next mode is Career. Next year's dead money and the owner's memory become your problem, which is the point. The Career Mode Guide picks up there. If a control does not match what you see, tell me from Contact with the team, the year, and the screen."
        ]
      }
    ],
    "relatedSlugs": [
      "salary-cap-explained",
      "career-mode-guide",
      "final-camp-cuts-53-man-roster",
      "draft-strategy-bpa-vs-need",
      "owner-goals-keep-your-job"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/season-team-picker.webp",
      "alt": "The Single Season team picker, with Kansas City selected",
      "caption": "Choose a team and name your GM to open an owner meeting.",
      "width": 1030,
      "height": 800
    },
    "published": "2026-11-25"
  },
  {
    "slug": "salary-cap-explained",
    "title": "The Salary Cap Explained for First Time GMs",
    "description": "Cap room, committed money, and dead money in plain words, with the exact rules Run The Roster uses for cuts, restructures, tags, and rollover.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The cap sheet looks like finance. It is really just a way to make you choose. I wanted the numbers in Run The Roster to be readable in one sitting, so this page is the primer in the same language the game uses. Worked examples of a specific cut versus a specific restructure live in Dead Money and Restructures. Start here so those examples have a place to sit.",
          "Cap figures, contracts, and starting dead money are modeled gameplay values. They are not a team's real filing. The dollars on the screen are the dollars the sim uses."
        ]
      },
      {
        "heading": "The only formula you have to remember",
        "paragraphs": [
          "Cap room is the limit minus active committed contracts and current dead money.",
          "Three numbers, one job:",
          "The cap limit, or, in pre-cap historical seasons, the payroll guide the owner still reads.",
          "Committed money, the cap hits of players who are still on your roster.",
          "Current dead money, charges that remain even after a contract has left the roster.",
          "If committed money plus current dead money is $110 million and the limit is $123 million, you have $13 million of room. That room is what you spend to re-sign your own players, sign free agents, or take on salary in a trade. It is also what you create by cutting or restructuring someone who is already on the sheet."
        ]
      },
      {
        "heading": "Hard cap versus payroll guide",
        "paragraphs": [
          "Most modern Season and Career files use a hard cap. The cap screen states the rule clearly: only active contracts and current dead money count. Expired deals use no room until you re-sign or tag them. That last sentence surprises people. A player who is expiring is not still chewing up his old hit while you decide. The charge comes back if you keep him.",
          "Some historical seasons, such as the 1985 Bears, the 1989 49ers, and the 1993 Cowboys, use a payroll guide instead of a hard ceiling. Overspending is allowed, but the owner will penalize it. There is no hidden hard cap in those years. There is a number the owner notices, which is a different kind of pressure. You can keep a loaded roster together more easily, and you can also get yourself in trouble by ignoring the guide and assuming the owner will not care.",
          "The cap and contract economy in those historic files is still modeled and scaled to the displayed cap or guide. The game says that on the screen. I will say it here too."
        ]
      },
      {
        "heading": "Dead money is the bill that stays",
        "paragraphs": [
          "When you cut a player with an active deal, his charge leaves the roster and a dead-money hit can land on the current sheet. You get some room back. You may not get all of it. The cut control shows the dead money that would be added, for example a line like \"Cut\" with the current dead being added, and that preview is the number to trust.",
          "Replacement-level and minimum contracts can often be released without a meaningful charge. That is why camp cuts of cheap deals sometimes move room more than they move dead money. A veteran with real years left is the opposite case. The player is gone. Part of the bill stays.",
          "In Career, current dead money clears at rollover. That is generous compared with some real-world accounting, and it is the rule the game is playing. Do not invent a second year of the same dead charge unless the screen shows one."
        ]
      },
      {
        "heading": "A restructure buys this year and invoices the next one",
        "paragraphs": [
          "Restructuring creates room now by pushing money into a future season. The cap screen describes the mechanic the same way I do here: restructure money becomes next year's dead charge.",
          "In a one-year Single Season file, next year is mostly a lesson. In Career, next year is still your job, unless you get fired first. I only restructure when this year's roster is actually worth the invoice. Making $8 million appear feels like a raise. It is a loan.",
          "If you want the click-by-click version, with a cut and a restructure side by side, use Dead Money and Restructures. I will not invent a player's number here just to make the math pretty."
        ]
      },
      {
        "heading": "Tags, asks, and offers have to fit the room",
        "paragraphs": [
          "You get one franchise tag in the expiring-player wave. Tagging uses room. So does meeting a free-agent ask, offering a longer term, or accepting a counter. In a hard-cap file, offers above your remaining room are dimmed, which is the game telling you the sheet does not have a secret overdraft.",
          "The game can reject a trade that would put your club over the hard cap. You also cannot leave cap review while in the red. Check projected room again in camp before you open the season: the rookies you drafted are now on the payroll."
        ]
      },
      {
        "heading": "Cap flexibility is a meter, not just a leftover",
        "paragraphs": [
          "Next to owner, fans, and locker room you will see a cap flexibility meter. It is a health reading on the sheet, not a pile of bonus wins. Leaving a huge leftover can also show up later in owner reviews, especially if the brief wanted a certain kind of spending or the year ends with a lot of unused room.",
          "I do not treat leftover room as a moral victory. I treat it as a question. Did I fail to build the roster, or did I protect a plan for March? In Single Season, unused room at the recap is mostly a grade on this year. In Career, it is the start of the next offseason's argument."
        ]
      },
      {
        "heading": "A first-time checklist I actually use",
        "paragraphs": [
          "When I open a new file, I do this in order:",
          "Write down the limit or payroll guide, the committed money, and the current dead money. Room is just the remainder.",
          "Count the expiring players and decide, before the market opens, who I can keep without wrecking the rest of the sheet.",
          "Reserve the franchise tag for a player I cannot replace this year, not for a habit.",
          "Refuse a restructure unless I am actually stuck, or unless Career makes the future charge a conscious plan.",
          "Read every cut preview. If the added dead money is almost as large as the hit I am removing, I am not creating as much room as I think.",
          "Stop signing when the next name is a luxury. The affordable option on the board exists for a reason.",
          "If you take nothing else from this page, take the formula and the invoice. Room is leftover after committed money and current dead money. A restructure is not free room. A cut is not always free room either. Once those two facts feel obvious, the rest of the offseason gets a lot quieter, and you can go back to the football.",
          "From here, the practical sequels are Dead Money and Restructures, Free Agency: Who to Retain and Who to Let Walk, and the Career Mode Guide. If a term is still bouncing around, the Football GM Glossary is the short version of this language."
        ]
      }
    ],
    "relatedSlugs": [
      "dead-money-and-restructures",
      "career-mode-guide",
      "free-agency-retain-or-let-walk",
      "historical-seasons-which-team",
      "glossary"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/cap-sheet.webp",
      "alt": "A Single Season cap review showing current dead money and contract decisions",
      "caption": "Example cap review from a fresh Kansas City file. Contract values are simulation estimates.",
      "width": 1030,
      "height": 990
    },
    "published": "2026-11-25"
  },
  {
    "slug": "career-mode-guide",
    "title": "Career Mode Guide: Surviving Owners, Firings and Job Changes",
    "description": "How Career mode in Run The Roster carries contracts, dead money, and owner confidence across seasons, and what happens when you get fired or retire.",
    "playHref": "/career/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Career is the mode I built for people who want the bill to come due. You start with a real team snapshot and then you keep the job, or you lose it. Contracts expire. The cap moves. Players age. A new draft class arrives every year. A firing can lead to another franchise instead of ending the file. If you stay long enough to walk away on your own, the game writes a retrospective and keeps a legacy score for the run.",
          "The offseason language is the same as Single Season. If you have never hired a staff or cut camp, read the Single Season Walkthrough first. This page is about the part Season cannot teach: planning three years ahead, and surviving the owner when year three is harder than year one."
        ]
      },
      {
        "heading": "One Career file, in this browser",
        "paragraphs": [
          "Progress auto-saves in this browser. There is no cloud save and no account. Starting over replaces the Career slot after you confirm. Daily and Single Season remain separate, so you can keep a Career going and still play today's puzzle. A different browser is a different career, and clearing site data is the end of the save."
        ]
      },
      {
        "heading": "The year still starts with a brief",
        "paragraphs": [
          "Each season opens with an owner brief and the same three answers you already know: Embrace the brief (+8 owner confidence), Split the difference (+2), or Push back (-6). The brief can favor youth, stars, winning now, culture, or cap flexibility, and it does not reset to a blank slate just because you won 11 games.",
          "This is where I see people get fired with a good roster. They embrace a build-young brief, then spend March adding 29-year-old starters, then wonder why a Poor-looking deadline deal that \"sells a veteran\" makes the owner happier than a win-now trade would have. Value and approval are different. The brief is the approval script for the year. Change your roster plan or change your answer in the meeting, but do not let them contradict each other for three seasons running.",
          "Owner confidence has a ceiling of 96, so no job becomes risk-free, and the job ends at 20 or lower. A hot-seat banner shows when you are at 35 or below. Those are the numbers the desk actually uses."
        ]
      },
      {
        "heading": "Plan three seasons ahead, because the sheet does",
        "paragraphs": [
          "The cap rule that matters most in Career is the one on the cap screen: current dead money clears at rollover, and restructure money becomes next year's dead charge. Room you buy in 2028 is an invoice in 2029 if you still have the chair.",
          "I plan in three layers, not in slogans.",
          "This year has to be legal and playable. Get under the number, keep a quarterback, and land camp between 22 and 26 players. Do not open a hard-cap season in the red just because a trade looked clever.",
          "Next year is where re-signs, tags, and restructure invoices land. When I keep a 29-year-old on a new three-year deal, I am making a 2030 problem as well as a 2028 solution. When I restructure a star, I write down the pushed money and I assume it will be sitting there as dead money on opening day next year.",
          "The year after that is the real test of a rebuild or a window. Rookie deals get closer to a payday. A cheap veteran hits a wall. A brief that was patient can get less patient. If your plan for year three is \"the cap will work itself out,\" it will not.",
          "That is also why leftover room is not automatically virtuous. A huge leftover can follow you into owner reviews. Spending it all on short-term names can follow you into a dead-money year. The better habit is to spend on the plan you accepted, and to leave only the room that plan still needs."
        ]
      },
      {
        "heading": "Aging, drafts, and the market all compound",
        "paragraphs": [
          "Each new year ages the roster and brings a new modeled draft class. Scout grades on draft weekend are evaluations. The rating you see later in camp or on the cap sheet can be different, and I read both numbers instead of arguing with one of them.",
          "Free agency still runs in waves. You handle your own expiring players first, including the one franchise tag, then the outside board. Offers above your remaining room stay dimmed in a hard-cap year. The temptation in Career, especially after a quiet year that left a pile of room, is to sign everyone who looks like a starter. That is how a \"weak\" inherited roster becomes a spending spree, and it is also how the next two extensions get squeezed.",
          "I ask the same question every March: if I am still here in two years, does this contract still look like a good idea?"
        ]
      },
      {
        "heading": "What happens when you get fired",
        "paragraphs": [
          "If owner confidence hits 20 or below, the chair gets pulled. That can be the end of a ugly year, and it can also happen when the meter has been sliding for a while and one more setback finishes it. The recap will say the job ended. Career does not have to end with it.",
          "The game can offer another job, and you can take it and keep the career going. You can also retire once you are ready to close the file and read the retrospective. The upgrade page describes this in the same spirit I mean here: you can be hired, fired, and hired again, with a transparent in-game legacy score, and you get a generated career retrospective when you retire.",
          "I treat a firing as information. If I got let go because I pushed back and then missed the playoffs, that is a coherent story. If I got let go because I ignored the brief for two years, that is on me. The next job will have a new owner and a new snapshot. It will not erase the habits that cost the last one."
        ]
      },
      {
        "heading": "A simple three-year script you can actually follow",
        "paragraphs": [
          "Year one, I learn the roster and I try not to break the sheet. I embrace or split the brief. I re-sign the core I believe in. I use the tag at most once. I avoid a restructure unless I am truly stuck. I draft for players I can develop. I do not sell the future to go 11-6 if the brief was about youth.",
          "Year two, I pay the invoices I created and I look at the window honestly. If the team is close, I spend like a club that is close. If it is not, I stop signing 30-year-old \"one more year\" players just to feel busy. This is the year a lot of files quietly become a problem, because last year's restructure is now dead money and last year's splash is already a year older.",
          "Year three, I decide whether I am still the right GM for this brief. If the owner wants a faster reset than the depth chart can give, I either change the roster plan in a way I can defend, or I prepare myself for the hot seat. I would rather take a new job with a clean cap story than wreck the next two drafts to delay a firing by six weeks.",
          "None of that requires a secret stat. It requires remembering that Career is a chain of offseasons, not a chain of records. Records matter. They are how you keep the chair. The sheet is how you have a chair worth keeping.",
          "When you want the cap mechanics in one place, use The Salary Cap Explained and Dead Money and Restructures. When you want the brief itself, Owner Goals: How to Keep Your Job is the companion piece. And when you are trying to decide whether to blow it up or reload the same core, Rebuild or Reload? is the longer Career argument."
        ]
      }
    ],
    "relatedSlugs": [
      "salary-cap-explained",
      "owner-goals-keep-your-job",
      "dead-money-and-restructures",
      "rebuild-vs-reload",
      "single-season-walkthrough"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "2026-nfl-trade-deadline",
    "title": "Three 2026 NFL Trade Deadline Deals and What They Cost",
    "description": "What the Kirk Cousins, Jordan Davis and Josh Downs trades cost, and how to judge a similar deal as a GM in Run The Roster.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Three teams saw a chance to improve before the November 10 deadline. Minnesota spent a third on a quarterback it already knew, Jacksonville paid a first and a future second for a defensive tackle, and Kansas City used midround picks to add a receiver. Which deal would you take if it landed on your desk?",
          "I am not grading these clubs as a television segment. I am asking the question I built into Run The Roster: if this card landed on your desk, would you buy, sell, or pass, and what would the owner say about it?"
        ]
      },
      {
        "heading": "The deadline in one sentence",
        "paragraphs": [
          "By Nov 10, the league had already told you who thought they were in the race and who was collecting draft capital. Jacksonville added a high-priced starter. Minnesota went and got a quarterback it already knew. Kansas City added a receiver. Buffalo added a safety. Indianapolis and Philadelphia were among the clubs moving veterans out. Those deals are listed in the NFL.com deadline tracker, linked below."
        ]
      },
      {
        "heading": "Move 1: Minnesota brings Kirk Cousins back",
        "paragraphs": [
          "The Vikings acquired quarterback Kirk Cousins from the Las Vegas Raiders for a 2027 third-round pick as listed by NFL.com on Nov 10. Minnesota was 6-2 after Week 9, in the middle of a brutal NFC North, and had a quarterback problem to solve in season. Las Vegas, coming off a rough starting stretch for Cousins, turned a veteran into a future pick while a younger quarterback sits in the building.",
          "In Run The Roster terms, this is a deadline rental with a familiar name. The football question is whether a mid-round future pick is the right price for a quarterback who can start immediately. The political question is whether your brief is \"win now\" or \"build young.\" A win-now owner will like the seriousness of the move. A youth-first owner may ask why you just spent a 2027 third on a veteran whose next contract, or lack of one, is not the future of the franchise.",
          "If this card came across the Front Office Desk in a Season or Career file, I would not stop at the asset label. Trade cards in the game mark the football value as Good, Fair, or Poor, and then the owner, fans, and locker room can still move in a different direction because of the brief. A \"familiar veteran, immediate start, mid-round pick\" deal can be Fair as an asset and still be the wrong story for a rebuild. It can also be the only adult move on a 6-2 club that cannot wait until April.",
          "I would take this deal on a contender that does not have a quarterback it trusts for January. I would pass on a club that is already selling, or on a club whose plan is to live with a young starter's mistakes. The Raiders side of the card is the easier Career decision: if the building has already moved on, you take a 2027 third and you stop pretending the next month will rewrite the year."
        ]
      },
      {
        "heading": "Move 2: Jacksonville buys Jordan Davis, Philadelphia sells a foundation piece",
        "paragraphs": [
          "On Nov 9, the Jaguars acquired defensive tackle Jordan Davis from the Eagles for a 2027 first-round pick and a 2029 second, per NFL.com. Jacksonville was 6-2 after Week 9, with a point differential that already looked like a serious club. Philadelphia was 2-7 and had already slipped into the kind of year where you collect future picks instead of protecting a roster that is not going to January.",
          "In the game, this is the cleanest buy-or-sell lesson I can offer this week. If you are 6-2 and your brief is winning now, you should be willing to pay a first for a player who changes the middle of your defense, and you should be ready for the owner to like the aggression. If you are 2-7, a first and a future second can be a Fair or even Good return for a veteran you can no longer build around, and the brief should be about youth or cap flexibility, not about hanging on to a face-of-the-franchise story.",
          "The danger, in the sim and in real life, is mixing the two. Paying a first when you are already out of the race is how you donate a pick. Selling a foundation player when the brief is still \"win now\" is how owner confidence and the locker room both drop, even if the asset grade looks acceptable."
        ]
      },
      {
        "heading": "Move 3: Kansas City adds Josh Downs, Indianapolis keeps selling",
        "paragraphs": [
          "On Nov 10, the Chiefs acquired receiver Josh Downs and a 2027 seventh from Indianapolis for a 2027 fourth and a 2027 fifth, per NFL.com. Kansas City was 6-2 after Week 9. Indianapolis was 2-7 and, in the same deadline window, also moved Keenan Allen to San Francisco for a 2027 sixth.",
          "This is a different shape than the Davis deal. It is not a first-round buy. It is a club with a window using mid-round capital to add a receiver, and a club without a window turning present production into extra swings in 2027. At the deadline, the moves fit two very different jobs. Kansas City could give Downs a role immediately. Indianapolis put the value into a draft it could build around.",
          "In Run The Roster, I would treat the Chiefs side as a \"complete offer\" test from the Daily trade boards: you have a walk-away price, the player fits a role you can name, and you are not surrendering the deal just to get a headline. The Colts side is the sell discipline people skip. You do not wait for a first-round offer that is not coming on a 2-7 team. You set a floor, you take the best complete return, and you do not let a famous name on your own roster talk you into holding."
        ]
      },
      {
        "heading": "Try the same decisions in the game",
        "paragraphs": [
          "If you want to practice the same decisions, start a Single Season or continue a Career file and go looking for the deadline cards around Week 10. Before you accept anything, write two sentences: one about the asset, one about the brief. If those sentences disagree, the card is trying to teach you something.",
          "You can also use Daily as a shorter exercise. When the category is Trade, the grade rewards a walk-away price and a complete offer, not the first deal that removes uncertainty and not the biggest name on the sheet. That is the same habit these real clubs were either practicing or ignoring at the deadline.",
          "I will keep this series tied to reporting you can check, and I will keep the game talk labeled as the game. The deadline was real. The records will move. The question for your file is the same one those front offices just answered in public: are you buying because you can win, selling because you cannot, or doing a bit of both and hoping the owner does not notice?"
        ]
      }
    ],
    "relatedSlugs": [
      "trade-value-guide",
      "career-mode-guide",
      "salary-cap-explained"
    ],
    "legacySection": "news",
    "sources": [
      {
        "label": "NFL trade deadline tracker",
        "href": "https://www.nfl.com/news/nfl-trade-deadline-track-every-move-since-start-of-2026-regular-season"
      },
      {
        "label": "NFL report on Minnesota’s Cousins trade",
        "href": "https://www.nfl.com/news/kirk-cousins-vikings-raiders-trade"
      }
    ],
    "published": "2026-11-25"
  },
  {
    "slug": "historic-turnaround-guide",
    "title": "Historic Turnaround Guide: Beating the Real Result",
    "description": "How Run The Roster's daily Historic Turnaround uses a shared seed, a sourced season, and a win target, plus three ways to beat the real result.",
    "playHref": "/turnaround/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Turnaround is the mode for people who have ever yelled at a historic roster and wanted a second try. Each day you get one shared bad season, or at least one season that left something to fix. Everyone plays the same sourced setup on the same deterministic seed. The real result is known. The win target is stated. The simulation is then yours.",
          "This is not a trivia card. It is a full year, with the same kind of offseason and weekly desk you get in Single Season. Treat it like a season, because that is what it will do to your saved Season file."
        ]
      },
      {
        "heading": "The shared seed is the whole point",
        "paragraphs": [
          "The Turnaround page puts it plainly: you run today's sourced season setup with the same deterministic seed as every other player. I built it that way so a better result is about the calls, not about luckier dice on your machine.",
          "The seed covers the setup you both inherit. It does not mean two people who make different trades will still finish 11-6. If your result is worse than a friend's, look at the staff, the cuts, and the deadline, not at the random number generator.",
          "Because the file plays like a season, starting today's Turnaround can replace the Single Season slot stored in this browser. Daily and Career stay separate."
        ]
      },
      {
        "heading": "What is sourced, and what is modeled",
        "paragraphs": [
          "Each scenario is a verified historic club with a stated real record and at least one public source. Featured players come from a compacted original roster for that team-season, not from a modern club with old uniforms. Ratings, salaries, contracts, and the simulated games are still modeled. Opponents may be locked rather than fully rostered. Starting dead money is a gameplay input, not a claim about a real transaction. The cap or payroll guide you see is the number the sim uses, scaled to that scenario.",
          "The game already says this on historical cap screens, and I will keep saying it here. You are rewriting a result in a model, not re-officiating a Sunday from 2008."
        ]
      },
      {
        "heading": "The eight clubs in the rotation",
        "paragraphs": [
          "As of the current public build, these are the verified Turnaround scenarios, with the real finish and the win target the game asks you to chase:",
          "2008 Detroit, 0-16. Build a credible turnaround from the same daily setup, with an objective of six wins.",
          "2017 Cleveland, 0-16. Find six wins in the simulation.",
          "2019 Cleveland, 6-10. Turn the expectations into ten simulated wins.",
          "1976 Tampa Bay, 0-14 in an inaugural 14-game season. Chase four simulated wins.",
          "2011 Philadelphia, 8-8 and missed the playoffs. Chase eleven wins.",
          "2010 Dallas, 6-10. Build a ten-win simulation.",
          "2022 Denver, 5-12. Aim for ten simulated wins.",
          "2013 Houston, opened 2-0 and then lost fourteen straight, finishing 2-14. Chase eight simulated wins.",
          "If you want a classic roster with a different kind of pressure, the six standalone clubs in Historical Seasons are a separate mode. Those are chosen peaks and puzzles, not this daily repair job. Historical Seasons: Which Team Should You Pick First? is the guide for that list."
        ]
      },
      {
        "heading": "How a Turnaround year actually plays",
        "paragraphs": [
          "You are in a season, so the path should feel familiar if you have already used the Single Season Walkthrough. You still have an owner brief to answer, a staff to hire, a cap or payroll guide to respect, expiring players to keep or let go, an outside market, trade calls, a draft, camp cuts to a 22-to-26-player sim roster, and a week-by-week desk.",
          "Two differences matter in practice.",
          "First, you already know the real ending. That can trick you into forcing stars who were not actually the problem, or into selling everyone because \"this year was doomed.\" The sourced roster is a starting point. The sim will not reproduce the real injuries, the real calls, or the real Sundays just because the names are familiar.",
          "Second, the score is about beating that known result, not about looking busy. A 9-7 file that misses a playoff target can still be a real improvement on a 6-10 season. A 10-6 file that wrecks owner confidence is a different kind of half-success. Scores from these runs stay on this device. There is no global Turnaround board connected."
        ]
      },
      {
        "heading": "Three ways to beat history",
        "paragraphs": [
          "I use three tests, and they stack.",
          "1. Beat the real win total, and try to clear the stated target. Every scenario tells you what the real team finished and what the game wants you to chase. Six wins from an 0-16 club is a different job than eleven wins from an 8-8 club. If you only remember one number, remember the objective on the setup screen. Crossing the real finish line is the first honest improvement. Crossing the target is the one the mode is asking for.",
          "2. Go further in the playoffs than the real club did. Several of these teams missed the tournament entirely. An 8-8 \"Dream Team\" that missed the playoffs is not just a win-total puzzle. If your sim reaches January and the real club did not, you have beaten history in a way the standings alone do not capture. If you win the title with a 2008 Lions file, say so carefully and remember it is a modeled result, not a rewritten encyclopedia.",
          "3. Keep the building healthy while you do it. The Turnaround recap still cares about more than raw wins. The mode's own scoring talk includes a respectable GM grade and owner confidence, and the same meters you already know (owner, fans, locker, cap flexibility) are running during the year. I treat \"grade at least in respectable territory, and the owner still in the chair\" as the third test. The recap starts at 400 and adds 35 points per normalized win above the real record plus a playoff bonus, twice the GM grade adjustment relative to 60, and an owner confidence adjustment relative to 50.",
          "If you can hit all three, that is a complete run. If you can hit two, look at the one you missed and decide whether the next attempt should be more aggressive on the roster or more careful with the brief."
        ]
      },
      {
        "heading": "How I would play two different kinds of file",
        "paragraphs": [
          "On a club like 1976 Tampa Bay, the real result is 0-14 and the target is four wins. That is not a mandate to sign every veteran on the board. It is a mandate to build a roster that can steal a few Sundays in a 14-game sim without lying to yourself about a title window. I would hire a staff that can live with a young or thin roster, I would spend only where a starter is truly required, and I would judge the year on four wins and a living owner, not on whether I turned an expansion club into a dynasty in one March.",
          "On a club like 2011 Philadelphia or 2010 Dallas, the target is higher because the roster already had expectations. Those files punish panic selling and also punish standing still. You have to decide, early, whether you are trying to finish the job the real year left unfinished, or whether you are about to repeat it with better adjectives.",
          "When you finish, save the result card if you want to compare it later in an on-device score room, and look at your personal scores. Then come back tomorrow. The seed will be new, the real result will be different, and the temptation to excuse a sloppy offseason will be exactly the same."
        ]
      }
    ],
    "relatedSlugs": [
      "how-to-play",
      "daily-challenge-guide",
      "historical-seasons-which-team",
      "single-season-walkthrough"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/historic-turnaround.webp",
      "alt": "A Cleveland Turnaround screen with the original 0–16 record, a six-win target and a shared seed",
      "caption": "A past Turnaround board. The record is historical; the six-win target belongs to the game.",
      "width": 1030,
      "height": 770
    },
    "published": "2026-11-25"
  },
  {
    "slug": "historical-seasons-which-team",
    "title": "Historical Seasons: Which Team Should You Pick First?",
    "description": "A difficulty and payroll-pressure ranking of Run The Roster's six historical rosters, from the 1985 Bears to the 2013 Seahawks, and which club to play first.",
    "playHref": "/historical/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Historical is the mode I built for the argument that never ends: what would you have done with that roster, in that year, with that quarterback sitting behind that starter? There are six featured clubs. Each one is a single season. Then you are done, unless you start another.",
          "This page ranks those six by how they feel to run, using the payroll or cap pressure the game itself puts on the screen, plus the football problem the official blurb is asking you to solve. It is not a leaderboard of simulated win rates. I have not published a table of results across these files, and I will not invent one."
        ]
      },
      {
        "heading": "What you are inheriting",
        "paragraphs": [
          "Featured rosters use selected real player names and positions. Ages, ratings, contracts, and other game attributes are modeled. Opponents, coaches, free agents, and draft classes are incomplete or synthetic. Positions are consolidated. These are compact full-season selections, and the page is careful to say they are not complete opening-day rosters. Some are anchored to a Super Bowl game roster. Some are not.",
          "Every file in this mode is 16 weeks, not a modern 17-game slate. Pre-cap years use a payroll guide the owner still reads. Cap years use the season's listed cap number. Starting dead money, when it appears, is a modeled gameplay input. The dollars are the dollars the sim uses, not a historical filing.",
          "If you want a daily historic repair job instead of one of these six peaks, that is Turnaround, and the Historic Turnaround Guide is the companion."
        ]
      },
      {
        "heading": "The six clubs, from most forgiving first file to toughest first file",
        "paragraphs": [
          "1. 2013 Seahawks, cap $123 million",
          "This is the file I would give a first-time historical GM. The official blurb is almost unfairly honest: the Legion of Boom is young and loud, Russell Wilson is still on a rookie deal, \"which is the cheat code,\" and the cap is $123 million. Pete Carroll will run the building if you hire him. You can also decide the defense does not need that much volume.",
          "Payroll pressure is the lightest of the cap years on this list, and the football problem is about how to spend a window, not about whether you have a quarterback or a defense. You can still botch it by paying everyone and calling it destiny. You should not botch it by accident. When you want the longer version of that window, use the 2013 Seahawks guide.",
          "2. 1985 Bears, payroll guide $18 million, no salary cap",
          "The defense is already a problem for the rest of the league. You inherit Ditka, Buddy Ryan's pressure, and Walter Payton in his early thirties. There is no salary cap. There is a payroll the owner will notice, and the listed guide is $18 million.",
          "This is a generous football inheritance and a different kind of money problem. You can keep a great team together more easily than you can in a hard-cap year, and you can also overspend in a way the owner will punish. I like it as a second file, or as a first file if you already understand that a payroll guide is not a hard ceiling. The 1985 Bears page is the deeper roster read, including Payton's age and the job of keeping that defense intact.",
          "3. 1989 49ers, payroll guide $22 million, no salary cap",
          "Montana, Rice, and Ronnie Lott, with Steve Young already in the building asking for a chance. George Seifert is the new head coach if you keep the staff. Payroll, not a cap. The offense is the standard everyone else is copying.",
          "The pressure here is a quarterback decision inside a loaded building, plus a payroll guide that is worth weighing against how the roster is built and still not a hard cap. It is a wonderful file if you like personnel arguments. It is a slightly sharper first file than the Bears because you can talk yourself into a controversy the roster does not need.",
          "4. 1993 Cowboys, payroll guide $28 million, last year before the cap",
          "This is the peak of the Dallas core, and the last season before the salary cap. Aikman, Irvin, and Emmitt are in the building. Jimmy Johnson is one of the voices you can keep. The payroll is a suggestion the owner still reads, and the guide is the highest of the three pre-cap clubs.",
          "I rank it tougher than 1989 as a first file because the payroll number is heavier and because the year is a peak, which makes people do desperate things to protect a legend. The football is still excellent. The temptation is to treat \"last year before the cap\" as a mandate to push every chip in, even when the owner is still watching the guide.",
          "5. 2007 Patriots, cap $109 million",
          "Brady, Moss, and a defense that still tackles. The cap is $109 million. You can chase 16-0, or you can keep enough flexibility that one injury does not end the era. Belichick is available if you want the building as it is.",
          "This is not a hard roster. It is a hard question. The cap is real, the team is loaded, and the blurb is already daring you to choose between a historic chase and a future that still works if the year goes sideways. I would not make it a first historical file only because it invites you to spend like a highlight film. When you are ready for that argument, the 2007 Patriots guide is the place.",
          "6. 1999 Rams, cap $57.3 million",
          "The Greatest Show is not a slogan yet. Trent Green is the starter you paid. Kurt Warner is the backup who knows the offense cold. The in-game cap is $57.3 million, and Warner's number is tiny.",
          "This is the best puzzle on the list, and the toughest first file, because the cap is the tightest of the six and the quarterback decision is the season. You can play it early if you already like cap math. I would not play it first if you are still learning what room, dead money, and a committed starter hit feel like. Read The Salary Cap Explained and then take the 1999 Rams file when you want the decision to hurt a little."
        ]
      },
      {
        "heading": "A simple picker if you do not want a ranking",
        "paragraphs": [
          "If you want the most forgiving window, start with the 2013 Seahawks. If you want a great roster and no hard cap, start with the 1985 Bears and respect the payroll guide. If you want the quarterback argument of the decade in a tight cap year, skip ahead to the 1999 Rams and go in with your eyes open.",
          "All six files are one season long. None of them continues as a Career era in the current game. When the year ends, you can run it back with another club, or you can take what you learned about payroll pressure into a modern Career file, where the invoice actually follows you into next March."
        ]
      }
    ],
    "relatedSlugs": [
      "historic-turnaround-guide",
      "2013-seahawks-rookie-contract-window",
      "1999-rams-warner-green",
      "2007-patriots-chase-16-0",
      "1985-bears-gm-guide",
      "salary-cap-explained"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/historical-picker.webp",
      "alt": "The classic team picker with modeled budget and season length displayed on each card",
      "caption": "The Historical picker distinguishes payroll guides from hard caps.",
      "width": 1030,
      "height": 1380
    },
    "published": "2026-11-25"
  },
  {
    "slug": "draft-strategy-bpa-vs-need",
    "title": "Draft Strategy: Best Player Available or Team Need?",
    "description": "When best player available beats need in Run The Roster, when it does not, and a simple decision rule you can use on the clock.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "I have never liked the way this argument is usually framed, as if a front office must marry a slogan. Best player available, taken seriously, already includes a role. Need, taken seriously, already includes an evaluation. The messy version is what gets people in trouble: taking a lesser prospect because a hole is loud, or taking a famous name because the room is loud.",
          "Run The Roster will make you have this fight on the clock. The draft class is modeled, so there is no public mock to copy. You see a board, a scout grade, an age, a college, and a roster that has opinions of its own."
        ]
      },
      {
        "heading": "What the game actually puts in front of you",
        "paragraphs": [
          "In Single Season and Career, you make the featured picks yourself. After those picks, the scouting staff addresses roster needs in later rounds, stopping when no available prospect fits under the cap. Every automatic selection appears in the draft log and on the camp roster. That split is already a statement. The decisions you are trusted with are the early ones, where the evaluation and the role matter most. The later volume is the staff trying to keep the depth chart legal.",
          "Prospects show a scout grade on draft weekend. That number is an evaluation, not a guarantee. A player can arrive in camp or on the cap sheet with a different current rating. I keep both numbers in view and I do not pick a fight with the roster if the camp number comes in a few ticks lighter. The scout grade was the information I had on the clock.",
          "Camp still has to land between 22 and 26 players and keep a quarterback. A need is real if you cannot field the compacted sim roster without it. A need is less real if it is a luxury position on a club that already has a starter, or if the \"need\" is just the position you like watching."
        ]
      },
      {
        "heading": "The Daily already tells you how the game grades this",
        "paragraphs": [
          "If you play Daily on a Draft board, the options are not team-specific trivia. They are process. The ELITE option is to follow the board with a role and a development plan: take the strongest projection you can actually develop and use. A measured trade is SOLID if the value survives the extra uncertainty. Drafting the biggest immediate need regardless of grade is COSTLY, because need changes quickly and a weak evaluation lasts for years. Taking the loudest name in the room is a MISS.",
          "That is the cleanest decision rule I can offer, and it is already in the product. Talent, role, and a coaching plan belong in the same click. I wrote more about how Daily grades work in the Daily Challenge Guide."
        ]
      },
      {
        "heading": "A rule I can use in 30 seconds",
        "paragraphs": [
          "When I am on the clock, I ask three questions, in this order.",
          "1. Who is the best projection I believe, at a position I can actually use? If the answer is a player who will play, develop, or be traded from a position I understand, that is the pick. This is best player available with a job attached.",
          "2. Is the hole in front of me a roster-construction problem, or a September discomfort? If camp would leave me without a quarterback, or obviously under a depth target I cannot fix in free agency, need gets a louder vote. If the hole is \"I wish I had a shinier starter at a position that is already playable,\" I stay on the board.",
          "3. Am I about to pick a name because of the name? If the only argument is consensus, buzz, or a real-world reputation that the scout grade does not support, I pass. The game will punish that instinct on Daily boards, and a Season file will punish it more slowly, when the player is still on the compact roster in December and the hole you ignored is still a hole.",
          "If question 1 and question 2 disagree, I look at how early I am picking. Early, I need a strong evaluation. Later, once featured picks are gone, the staff is already drafting for need, so I should not have forced a panic need pick at the top of the board just to feel safe."
        ]
      },
      {
        "heading": "When need actually wins",
        "paragraphs": [
          "Need wins when the alternative is a better prospect you cannot play, develop, or protect. A third receiver on a compact 22-to-26-player roster can be a wasted pick if you are about to cut him in camp. A tackle you will start in Week 1 can be the right \"need\" pick even if a slightly higher-graded skill player is sitting there, because that tackle has a job and a development plan.",
          "Need also wins when your brief is about winning now and the hole is at a position that will sink the year. That is not a license to ignore the grade. It is a license to break a tie toward the player who will be on the field.",
          "Need loses when it is a slogan. \"We need a running back\" is how you spend an early pick on a position the market or the later automatic rounds can still help, while a higher-graded lineman or rusher leaves the board. \"We need a quarterback\" can be real, and it can also be how you trade the future for a medical or evaluation problem you did not want to see."
        ]
      },
      {
        "heading": "When best player available actually wins",
        "paragraphs": [
          "Best player available wins when you can name the role. \"Best player\" who sits, or who forces a worse player into a job just to justify the pick, is not BPA. It is collecting.",
          "It also wins in Career, where the third year matters. A strong evaluation with a developmental plan is how a rebuild stops being theoretical. A string of need picks that age badly is how you spend three drafts filling the same hole.",
          "I do not have a published table of wins per draft slot in the sim, and I will not invent one. If you want the broader spending argument, Positional Value: Where to Spend Your Cap is the roster-construction sequel to this page. This page is just the clock."
        ]
      },
      {
        "heading": "A worked argument, without a fake prospect",
        "paragraphs": [
          "Say the top player on your board is a receiver with a high scout grade, and your depth chart is thin at tackle. I do not automatically take the tackle. I ask whether the tackle on the board is a starter I believe in, or just a body. If he is a body, I take the receiver, I make a plan for the tackle in later automatic rounds or in camp, and I accept that Week 1 might be uncomfortable. If the tackle is a real projection I would have been happy to take a round later, and the receiver would be my third option on a compact roster, I take the tackle and I do not apologize for it.",
          "That is the whole method. Believe the board. Attach a job. Do not let a hole or a headline steal a pick you cannot defend in March.",
          "When the draft ends, go straight to camp and look at who you are actually going to cut. The camp guide is about that last, unsentimental pass. A draft that looks smart on Saturday and cannot survive Get to 26 was not that smart."
        ]
      }
    ],
    "relatedSlugs": [
      "single-season-walkthrough",
      "daily-challenge-guide",
      "positional-value-roster-building",
      "final-camp-cuts-53-man-roster",
      "career-mode-guide"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "glossary",
    "title": "Football GM Glossary: 60 Front Office Terms",
    "description": "Sixty front-office terms, from dead money and the franchise tag to owner briefs and compacted camp rosters, defined in plain words and tied to Run The Roster guides.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "This is a working vocabulary, not a rulebook. When a term is a real NFL idea, I say so. When it is a label or rule inside Run The Roster, I say that too. Cap figures and contracts in the game are modeled gameplay values unless a screen says otherwise. Follow a linked guide when you want the long version."
        ]
      },
      {
        "heading": "The cap sheet",
        "paragraphs": [
          "Salary cap. The hard limit on what a team can charge to the current year. Modern files use a hard cap. See The Salary Cap Explained.",
          "Cap limit. The season's ceiling, shown on the cap screen, against which room is calculated.",
          "Payroll guide. The owner-facing spending number in pre-cap historical seasons. Overspending is allowed, and the owner will penalize it.",
          "Committed money. The cap hits of players still on your roster, also called active committed contracts on the home page.",
          "Cap room. The limit minus active committed contracts and current dead money. That is the game's own formula.",
          "Cap hit. A player's charge against this year's cap or payroll guide while he is on the roster.",
          "Dead money. A charge that can remain after a contract leaves the roster. In the game, current dead money counts against room and clears at Career rollover.",
          "Restructure. A move that creates room now by pushing money into a future season. In the game, that pushed money becomes next year's dead charge. See Dead Money and Restructures.",
          "Rollover. The jump from one Career season to the next, when current dead money clears and last year's restructure invoice arrives.",
          "Hard cap. The game's rule that only active contracts and current dead money count, and that expired deals use no room until you re-sign or tag them.",
          "Cap flexibility. A meter on the desk that reflects the health of the sheet, not a pile of bonus wins.",
          "Unused cap. Room left at the end of a year. In Career it can show up in owner reviews. It is not automatically a good grade."
        ]
      },
      {
        "heading": "Contracts and the market",
        "paragraphs": [
          "Expiring player. Someone whose deal is up, handled in the first free-agency wave before the outside market opens.",
          "Re-sign, or retain. Keeping your own expiring player on a new deal.",
          "Meet ask. Accepting the annual salary and term the player or market wants.",
          "Longer term. An offer structure with more years and a different annual than the ask.",
          "Lower annual. The team-friendly offer, cheaper per year than the ask.",
          "Counter. The player's response to an offer. You can accept the counter or walk away.",
          "Franchise tag. In the game, you get one tag in the expiring-player wave, a one-year hold at a modeled price. In the NFL, the tag is also a one-year exclusive right with a set formula. See Free Agency.",
          "Guarantee. The money a player still receives if he is cut or the deal changes. Daily Contract boards grade you on pricing downside and keeping an exit.",
          "Front-loaded deal. A structure that pays more now and less later, useful when you have room today and extensions coming.",
          "Hometown discount. A slightly cheaper deal, usually from a veteran who wants to stay. Still a cap decision, not a favor.",
          "No-trade clause. A contract right that limits where a player can be sent. Some Daily scenarios use this as a decision constraint.",
          "Extension. A new deal signed before a contract expires, including mid-season cards that may ask you to pay now or wait until the offseason.",
          "Outside market. The later free-agency waves, after your own expiring-player decisions. The current copy describes up to six outside free agents after CPU-team retention."
        ]
      },
      {
        "heading": "Trades and draft capital",
        "paragraphs": [
          "Trade call. An incoming or outgoing offer the game puts on your desk.",
          "Asset grade. The football-value label on a trade card: Good, Fair, or Poor. See Reading Trade Value.",
          "Brief reaction. The separate owner, fan, and locker-room response on a trade card. The asset grade does not always set those meter changes.",
          "Walk-away price. The floor you set before you negotiate. On Daily Trade boards, this is the heart of an ELITE call.",
          "Draft capital. Future or current picks used as trade chips or as the return for a veteran.",
          "Trade down. Moving back in the draft for extra picks or players.",
          "Trade up. Moving forward in the draft, usually to secure a specific prospect, at the cost of capital.",
          "Deadline deal. A mid-season trade, around Week 10 in the game, when buyers and sellers are supposed to have honest records. See Playoff Push.",
          "Rental. A player acquired for a short stretch, often without a longer extension in place."
        ]
      },
      {
        "heading": "The draft and the roster",
        "paragraphs": [
          "Scout grade. The evaluation shown on a draft prospect. It can differ from the current rating you see later in camp.",
          "Featured picks. The draft rounds you select yourself, before the staff fills later rounds by need.",
          "Automatic selection. A later-round pick the scouting staff makes for you, visible in the draft log and at camp.",
          "Best player available. Taking the strongest projection you can actually develop and use, not merely the famous name. See Draft Strategy.",
          "Need pick. Drafting for a hole, which is COSTLY on Daily boards when it ignores the evaluation.",
          "Depth chart. The ordered list of who plays where, including backups, on your compacted roster.",
          "Get to 26. The camp screen. You must land between 22 and 26 players and keep a quarterback.",
          "Compacted sim roster. The 22-to-26-player roster the game actually plays, not a 53-man NFL roster. See Final Camp Cuts.",
          "Suggested cuts. The camp helper that proposes who to release. Read it before you confirm.",
          "Depth warning. A camp or roster note that a position group is below the suggested target.",
          "Practice squad. In the NFL, a reserve group off the main roster. In Daily Roster boards it can appear as a scenario.",
          "Injured reserve. A place for injured players who cannot play, used in NFL roster rules and in some Daily situations.",
          "Positional value. The idea that some positions return more than others per dollar or per pick. See Positional Value."
        ]
      },
      {
        "heading": "The building",
        "paragraphs": [
          "Owner brief. The season's stated priority, such as youth, stars, winning now, culture, or cap flexibility. See Owner Goals.",
          "Embrace the brief. Accept the owner's plan, +8 owner confidence at the meeting.",
          "Split the difference. Wins, but not at any price, +2 owner confidence.",
          "Push back. Tell the owner the brief is wrong, -6 owner confidence.",
          "Owner confidence. The job meter. The chair ends at 20 or lower. A hot-seat banner appears at 35 or below. The meter ceilings out at 96.",
          "Fans and locker room. The other two stakeholder meters, which can move independently of a trade's asset grade.",
          "Front Office Desk. The week-to-week binder for an active Season or Career file, at /play/.",
          "GM grade. The end-of-season evaluation of your year, shown with a letter and a score on the recap.",
          "Legacy score. A Career total the game keeps across jobs, described on the features page as transparent and in-game.",
          "Retrospective. The generated Career summary you get when you retire.",
          "Firing, or dismissal. Losing the job when owner confidence hits the threshold. In Career, that can lead to another job instead of ending the file."
        ]
      },
      {
        "heading": "Daily, modes, and the file",
        "paragraphs": [
          "Daily grade. ELITE, SOLID, COSTLY, or MISS on the shared daily puzzle. Historical boards use hindsight. Fictional boards reward process. See the Daily Challenge Guide.",
          "Streak and freeze. Consecutive UTC days played, with a freeze earned after every seven completed challenges, up to two, covering one missed day automatically.",
          "Mode names sit next to those last two. Daily is one decision. Turnaround is a shared historic season with a win target. Single Season is one complete year. Career carries the job forward. Historical is one of six featured classic rosters. Score rooms are on-device comparisons created by pasting result cards. There is no cloud save. If a term on a screen is not here, tell me from Contact."
        ]
      }
    ],
    "relatedSlugs": [
      "salary-cap-explained",
      "dead-money-and-restructures",
      "daily-challenge-guide",
      "single-season-walkthrough",
      "how-to-play"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "dead-money-and-restructures",
    "title": "Dead Money and Restructures: Buying Room Now, Paying Later",
    "description": "How dead money and restructures work in Run The Roster. A cut can free room and still leave a bill. A restructure buys this year and invoices the next one.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "I built the cap sheet in Run The Roster so it would feel like the real job, not a cheat menu. You can make room today. You usually pay for it later. The two levers that show that most clearly are a cut and a restructure.",
          "If you have not read the cap primer yet, start with The Salary Cap Explained. This page is the worked example that sits on top of it."
        ]
      },
      {
        "heading": "What the sheet is actually counting",
        "paragraphs": [
          "The home page spells this out in plain language, and the game uses the same math. Cap room is the limit minus the active contracts still on your roster and the current dead money already on the sheet.",
          "Three numbers matter every time you open the cap phase:",
          "The cap limit, or, in pre-cap historical seasons, the payroll guide the owner still reads.",
          "Committed money on players who are still on the roster.",
          "Current dead money, which stays even after a name leaves.",
          "In a hard-cap season, you cannot close the cap phase while the sheet is in the red. In a payroll-guide season, such as the 1985 Bears, there is no hard ceiling. The owner still notices a fat payroll.",
          "The game also tracks money you have pushed into a future year. On the cap screen that usually appears as room, current dead, and an amount pushed to next year. Current-year dead money clears when a Career year rolls over. Restructure money becomes next year's dead charge. That is why a restructure can look cheap in January and expensive the following March.",
          "Cap figures, contracts, and starting dead money are modeled gameplay values. They are not claimed as a team's real filing. The dollars on the screen are the dollars the sim uses."
        ]
      },
      {
        "heading": "A cut: the player leaves, part of the bill stays",
        "paragraphs": [
          "Cutting a player with an active deal removes his charge from the roster and adds a dead-money hit to the current sheet. You get some room back. You do not get all of it. The exact dollars show up on the cut button before you confirm, which is the number you should trust, not a formula you keep in your head.",
          "Start with a hypothetical $20 million active contract. This example uses the cap-review cut calculation, not camp cut projections.",
          "The veteran's current cap charge is $20.0 million.",
          "Cutting him adds about $9.0 million of current dead money.",
          "The $20.0 million comes off the roster, the $9.0 million lands as dead, and you net about $11.0 million of room.",
          "That is the football cost and the accounting cost at the same time. You lose the player. You keep a bill. If he was a real piece of the locker room, fans and teammates can react, and a later desk event can bring the cut back up in the building. A cap-discipline owner may still like the room. A win-now or culture owner may not.",
          "A few limits are worth knowing before you start cutting your way out of trouble:",
          "Expired deals are not a current charge unless you re-sign or tag them. Those names belong in the retain meeting or the market, not on the restructure button.",
          "Cutting a star to make a number work can solve March and create a September problem."
        ]
      },
      {
        "heading": "A restructure: you keep the player, you move the charge",
        "paragraphs": [
          "A restructure does not erase salary. It moves a cap charge into next year. The player's number drops this season. The bill does not disappear. In the current build, a contract can be restructured once in a given year, and only if the deal is still active.",
          "Using the same $20.0 million charge as a labeled example in the current build:",
          "About $6.0 million comes off this year's charge.",
          "This year's number falls to about $14.0 million.",
          "That $6.0 million is pushed into next year's dead money.",
          "You keep the player. You buy room now. If you are only playing Single Season, next year is someone else's problem, or rather, it is not a year you will have to sit through. If you are in Career, it is still your desk. When the next season opens, that pushed money becomes current dead money, and it sits on the sheet before you have signed anyone new.",
          "That is the whole trick. A restructure is a calendar change. It is a good tool when this year's roster is actually worth protecting. It is a bad habit when you are only hiding a problem from a future version of yourself.",
          "Owners do not all read this the same way. A brief that favors cap flexibility can sour on a messy future sheet. A brief that favors winning now may accept the push if the player still helps you in December. Read the owner brief before you touch the contract. Owner Goals: How to Keep Your Job covers how those briefs work."
        ]
      },
      {
        "heading": "Cut versus restructure, side by side",
        "paragraphs": [
          "Take the same $20.0 million player and the same current build. Assume you need room before free agency, and you already have some dead money on the sheet.",
          "Move",
          "Player stays?",
          "This year's room",
          "What you owe later",
          "Who notices",
          "Cut",
          "No",
          "About $11.0 million of net room, after new dead money",
          "The new dead money sits on this year's sheet",
          "Locker room and fans, especially if he was a star",
          "Restructure",
          "Yes",
          "About $6.0 million of room",
          "That $6.0 million becomes next year's dead money",
          "The future cap sheet, and a cap-minded owner",
          "Hold",
          "Yes",
          "No new room",
          "No new future bill",
          "A fiscal owner may like the discipline if you are already legal",
          "If the hard cap is in the red, Hold is not allowed. You have to cut or restructure until the sheet is legal. If you are already legal, doing nothing is a real choice. I would rather enter free agency a little tight with a clean future than enter it flush because I mortgaged a year I still have to manage."
        ]
      },
      {
        "heading": "When I restructure, and when I don't",
        "paragraphs": [
          "I restructure when all of these are true:",
          "The player is still part of the plan for this season.",
          "The room I am buying has a specific use, a re-sign, a tag, or a market signing I have already priced.",
          "I can live with the dead money landing next year, given the owner brief and the other deals that will expire.",
          "I cut when the player is not in the plan, or when the only way to make the sheet legal is to take the dead-money hit and move on. I do not cut a useful starter just to make a pretty cap number if a restructure would keep him and still get me legal. I also do not restructure a player I already want to move, because I have created future dead money and I still have to solve the roster.",
          "Career mode adds one more wrinkle. If you get fired and take another job, the old team's cap liabilities stay with that club. You inherit the new team's dead money, not the mess you left behind. That can feel like relief. It is not a reason to wreck the first sheet on purpose. The owner who fires you is not the only person keeping score, and the legacy record still includes the year that ended badly."
        ]
      },
      {
        "heading": "A simple rule before you click",
        "paragraphs": [
          "Ask one question out loud: who pays for this, and when?",
          "If the answer is \"this year's roster, this year,\" a cut may be honest. If the answer is \"next year's sheet, so I can keep this player and use the room,\" a restructure may be honest. If the answer is \"I just need the number to turn green,\" stop and look at the owner brief again.",
          "Then go use the room on purpose. Free Agency: Who to Retain and Who to Let Walk is the next decision in the offseason, and it is usually the reason you were hunting for room in the first place."
        ]
      }
    ],
    "relatedSlugs": [
      "salary-cap-explained",
      "free-agency-retain-or-let-walk",
      "owner-goals-keep-your-job",
      "career-mode-guide",
      "glossary"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "trade-value-guide",
    "title": "Reading Trade Value: What Good, Fair and Poor Really Mean",
    "description": "In Run The Roster, trade cards grade football value as Good, Fair, or Poor. The owner, fans, and locker room can still disagree. Here is how to read both scores.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The first time I wired trade cards into Run The Roster, I almost made them a single score. That would have been easier to code and worse as a game. Real front offices live with a split I have watched as a fan for years: the trade can be reasonable on the chart, and the building can still hate it.",
          "So the game keeps those ideas apart. Trade cards label the football value you receive as Good, Fair, or Poor. The owner, fans, and locker room can still react differently, because the season brief may favor youth, stars, winning now, culture, or cap flexibility."
        ]
      },
      {
        "heading": "What the card is grading",
        "paragraphs": [
          "The card is grading the football coming back to you, relative to what you are sending out. In the live game the labels read as \"Good value for you,\" \"Fair value for you,\" or \"Poor value for you.\" Under the hood the sim is still comparing the package to its own trade chart. You do not need that chart. You need the label, the actual return, and the brief.",
          "A Good deal means the other club is paying above the chart. You may get a useful player back, plus a future pick, or a pick rich enough that the value is obvious. The extra value is real. The roster cost can still be real, especially if you are moving a starter your locker room trusts.",
          "A Fair deal means the other club is in the right neighborhood. Either answer is defensible. This is the one people rush through, and it is the one I want you to slow down on. Fair is not a command to accept. Fair is permission to think.",
          "A Poor deal means the other club wants your player for less than the chart says he is worth. Sometimes the return is draft compensation only. Sometimes nothing you wanted comes back. The card will tell you that before you click.",
          "The grade is shown before you decide. That is on purpose. I do not want a hidden gotcha after the confirmation. If the card says Poor, you already know what the football value is. The remaining question is whether your brief still wants the move for some other reason, which is rare, and should feel rare."
        ]
      },
      {
        "heading": "The rest of the desk can disagree",
        "paragraphs": [
          "Owner confidence, fans, and the locker room are separate meters. A Good trade usually helps the owner, because you won the negotiation. It can still bother the locker room if you move a high-end veteran they play next to. A Poor trade hurts the owner and can also hurt the fans, because it looks like you gave a player away.",
          "The season brief is the tiebreaker you should read first, not last. A youth brief may accept moving a veteran even when the return is only fair, because the point was to get younger. A stars brief may hate the same move, even if the card says Good, because you just traded away the name the city already knows. A cap-flexibility brief cares whether the incoming contract is easier to live with than the one you sent out. A win-now brief cares whether the player you are losing is part of a December roster.",
          "I have taken Fair trades I liked and Good trades I passed on, for exactly that reason. Value and approval are different. The home page says it that way because it is the rule I play by."
        ]
      },
      {
        "heading": "How a trade window actually works",
        "paragraphs": [
          "In Single Season and Career, trade calls come in after you have worked the cap, the retain list, and the outside market. The live desk frames it as three calls, plus one name you can shop.",
          "Incoming calls are offers other clubs make for someone already on your roster. You accept or decline each one. Declining is clean. You are not punished for hanging up. The offer expires when you pass, and you move on.",
          "The shop is your one request for the offseason. You put a name out and the market answers. You used to be able to hope the phone would ring forever. It will not. You get one shop, incoming calls remain available, and the shop control resets next season if you are in Career. If the shop comes back Poor, you can still keep the player. The point of shopping him was to see the number, not to force a move.",
          "Some accepted deals return a player. Some return a future pick and no player. The card will say when the return is draft compensation only. Those picks show up on your board later, which is why a Good deal that looks light on the roster can still be the right call in a rebuild. Rebuild or Reload? is the longer version of that choice.",
          "Historical modes and modern modes use the same value labels. The players, contracts, and incoming names are still the game's model. Do not treat a trade partner or a returning veteran as a historical transaction unless the screen says so."
        ]
      },
      {
        "heading": "A way to read a card in thirty seconds",
        "paragraphs": [
          "I use the same four checks every time a card lands on the desk.",
          "What is the label? Good, Fair, or Poor. If it is Poor, I almost always pass, unless I already wanted that player off the roster and the brief agrees.",
          "What actually comes back? A player at a position I need is different from a future pick, and a future pick is different from nothing.",
          "What does the brief want? Youth, stars, winning now, culture, or cap flexibility. If the move fights the brief, I need a better reason than \"the card said Good.\"",
          "Who leaves the locker room? Moving a high-overall veteran can change the room even when the chart smiles at you.",
          "If those four line up, I take the deal. If they split, I honor the brief first and the chart second. That will cost me some Good-value headline once in a while. It also keeps the owner from pulling the chair because I \"won\" a negotiation he did not ask me to have."
        ]
      },
      {
        "heading": "Fair trades are where jobs get weird",
        "paragraphs": [
          "The Fair card is the one that feels safe and is not. You can accept a Fair return that sends out a culture player and watch the locker room dip. You can decline a Fair return that would have cleared cap space and watch the fiscal owner wonder why you are still stuck. Both reactions can be correct, because they are scoring different things.",
          "This is also where positional value sneaks in. Trading a running back for a future pick can be Fair or even Good on the chart, and still look foolish if that back is the only thing your win-now brief has going on offense. Trading a backup quarterback can be Fair, and still be the move that strands you if the starter gets hurt in Week 6.",
          "You will not get a second shop in the same offseason to repair a panic accept. Read the card, read the brief, then live with the call. That is the job I was trying to put on the screen."
        ]
      }
    ],
    "relatedSlugs": [
      "owner-goals-keep-your-job",
      "draft-strategy-bpa-vs-need",
      "free-agency-retain-or-let-walk",
      "positional-value-roster-building",
      "glossary"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "positional-value-roster-building",
    "title": "Positional Value: Where to Spend Your Cap",
    "description": "A practical guide to spending cap room in Run The Roster, from the quarterback and the edge to the positions where the market is cheaper and the wins are thinner.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Every fan has a version of this argument. Pay the quarterback. Pay the pass rusher. Do not pay the running back unless you have to. I hear those takes on Sundays, and I built them into the way Run The Roster prices the market, because a GM game that treats every position like it costs the same is not a GM game.",
          "There is no published wins-per-dollar study for this game. Use the market and your team’s actual needs instead of a fixed formula. What I can tell you is how the market behaves, how I spend when I play my own game, and how the owner brief should change the answer."
        ]
      },
      {
        "heading": "The market is not even, and it should not be",
        "paragraphs": [
          "When you retain a player or meet a free-agent ask, the price is not just overall rating plus age. Position matters. A high-end quarterback costs like a franchise decision. An edge rusher and a receiver also get paid. A running back or a tight end with a similar rating usually does not command the same number. Kickers are cheap, and punting is folded into the game's special-teams abstraction, so you will not be drafting a punter or parking cap there.",
          "That matches the way real NFL front offices have thought for a long time, and it is also how the sim's market is built. The exact asking price appears on the screen when you get there. Trust that number. Treat this guide as a way to decide whether the number is worth it, not as a hidden price list.",
          "Rosters, ratings, and contracts are modeled. A 90 overall in the game is a game rating. It is not a claim about a real player grade."
        ]
      },
      {
        "heading": "Where I spend first",
        "paragraphs": [
          "Quarterback. If you do not believe you can live with the quarterback, almost nothing else you do will feel like a plan. In modern seasons that often means paying to keep your own, or refusing to pay and then spending the rest of the offseason trying to replace him. In historical seasons the question is already on the roster. The 1999 Rams start with a paid starter and a cheap backup who knows the offense. The 2013 Seahawks start with a quarterback still on a rookie deal, which is the most valuable cap situation in the set. Spend around that reality. Do not spend against it.",
          "The pass rush and the offensive line. I would rather be good at getting to the quarterback and keeping my own quarterback clean than be glamorous at a skill position I can still fill later. Edge and interior line both matter in the sim, because roster strength on both sides of the ball feeds the weekly result. A great receiver on a collapsing line is a highlight waiting to become a sack.",
          "Cover people. Corner and safety are easy to underbuy if you just spent a fortune on offense. The weekly sim uses the whole roster, not your favorite unit. If the brief is win-now, a cheap secondary is how nice offenses end up in close games they cannot close."
        ]
      },
      {
        "heading": "Where I try not to overspend",
        "paragraphs": [
          "Running back. I like running backs. I also like having cap room in May. Unless the back is a true difference-maker and the brief is win-now, I let the market be the market and I look for a cheaper answer in the draft or on a short deal. Paying a running back like an edge rusher is how you end up restructuring a lineman you actually needed.",
          "Tight end and linebacker. These spots win games. They rarely deserve to set your offseason. If a great one is already on a reasonable number, keep him. If the open market wants a star price, I usually look at the rest of the depth chart first.",
          "Depth, not leftovers. Cheap players still have to be real players. The camp cut is a 22-to-26 person sim roster, not a 53-man NFL roster, so every name you keep is taking a seat that matters in the weekly sim. Do not spend 80 percent of the cap on four stars and then hope the last twelve names are invisible. They are not. Final Camp Cuts is the guide for that last pass."
        ]
      },
      {
        "heading": "The brief changes the spending order",
        "paragraphs": [
          "A youth brief wants cheaper, younger players and a draft-first mindset. Paying an aging star at a rich position can be football-correct and still be politically wrong. A stars brief wants names the city knows, which will pull you toward expensive skill players even when the quieter spend is at tackle. A cap-flexibility brief wants you to leave room, and the game does notice when a large share of the cap sits unused, especially after losses at certain checkpoints. A win-now brief wants the roster that can play in January, even if the future sheet looks worse.",
          "Culture is the one people ignore because it does not show up as a position. It shows up when you cut or trade a respected veteran to afford a shinier one. The football value may be fine. The locker room may not be. Read Owner Goals and Trade Value together with this page, because spending is never only a cap question."
        ]
      },
      {
        "heading": "A simple allocation I use in a modern season",
        "paragraphs": [
          "This is a starting shape, not a rulebook. Adjust it to the roster you were handed.",
          "Make sure the quarterback situation is stable enough to plan around, either by retaining your own or by refusing to force a star contract you cannot finish.",
          "Protect the quarterback and threaten the other one. Line and edge get the next serious money.",
          "Fill the secondary and the rest of the line with good, not famous, players unless a true star is already on a reasonable number.",
          "Take running back, tight end, and depth from the draft, short deals, and the later market waves.",
          "Leave enough room that a midseason decision does not require a panic cut.",
          "If you are in a pre-cap historical season, the \"cap\" is a payroll guide. The owner still reads it. The same spending order usually holds, but you are managing a political number rather than a hard ceiling. The 1985 Bears are the cleanest example: there is no salary cap, there is a payroll the owner will notice, and the defense is already the point of the roster."
        ]
      },
      {
        "heading": "Wins per dollar, without fake math",
        "paragraphs": [
          "People want a single ranking. Quarterback, then edge, then tackle and receiver and corner, then the rest, with running back last among skill players, is the shape I believe and the shape the market tends to follow. That is a philosophy, not a published sim leaderboard.",
          "What I can promise is this. If you spend like every position is equal, the expensive ones will starve the roster. If you spend only on the expensive ones, the cheap positions will show up in December as holes you cannot hide. The job is to buy the positions that create the most pressure per dollar, then stop buying once the roster is balanced enough to survive a bad week.",
          "Use the market asks you actually see. Write down the three positions you are trying to win, and the one position you are willing to be ordinary at. Then go spend like you mean it."
        ]
      }
    ],
    "relatedSlugs": [
      "salary-cap-explained",
      "draft-strategy-bpa-vs-need",
      "free-agency-retain-or-let-walk",
      "dead-money-and-restructures",
      "final-camp-cuts-53-man-roster"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "owner-goals-keep-your-job",
    "title": "Owner Goals: How to Keep Your Job",
    "description": "How to read the owner brief in Run The Roster, which goals actually matter, and how owner confidence can end a season or a career.",
    "playHref": "/career/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The owner is the only person in the building who can take your keys. Wins help. They are not the whole job. Career mode says it on the mode page: results matter, but so do the goals and cap choices stated in each season's owner brief.",
          "I wrote the brief this way because that is how the real job looks from the cheap seats. Some owners want a parade this year. Some want the books clean. Some want young players, or famous ones, or a locker room that does not leak. If you treat every season like the same assignment, you will eventually meet an owner who did not hire you for that assignment."
        ]
      },
      {
        "heading": "The meeting comes first",
        "paragraphs": [
          "A Single Season or Career year starts at the owner meeting, before you hire a staff or touch the cap. The brief is already on the desk. In the live game the owner's priority shows up as one of these directions:",
          "Win now",
          "Build young",
          "Chase stars",
          "Cap discipline",
          "Culture",
          "Those map to the same five ideas the home page uses when it talks about the season brief: winning now, youth, stars, cap flexibility, and culture. Read the note in the owner's own words. It is not flavor text. It is the scorecard for the next twenty minutes of decisions, and for the weeks after that.",
          "You can embrace the brief, split the difference, or push back. Embracing it is the safest way to start, and it is usually the right way if you want to keep the chair long enough to finish a plan. Splitting the difference keeps the door open and buys a little goodwill with fans. Pushing back tells the owner the brief is wrong. You can do that. I have done it when the roster made the brief look reckless. It costs you confidence immediately. You had better win the argument on the field later.",
          "If you already have a staff in a historical start, you may move from the meeting toward the cap sooner. The brief still matters. Keeping Ditka or Belichick or Carroll does not make the owner stop reading the sheet."
        ]
      },
      {
        "heading": "What each brief is really asking",
        "paragraphs": [
          "Win now. The owner wants a championship push this year, not a pamphlet about the future. Pay productive veterans. Be careful moving starters for distant picks. A Good trade that strips the December roster is a chart win and a brief loss.",
          "Build young. The owner is done paying for other people's primes. Draft, develop, and do not rent veterans. This is the brief where a Fair trade of an aging starter can be the correct political move, even if the football return is only decent. It is also the brief that will sour on a huge free-agent veteran, even if he is good.",
          "Chase stars. The owner wants a name the city already knows. Empty seats are the enemy. You will be judged on recognizable talent, which means the quiet, correct cap move can still look like you ducked the moment. Hire and spend in a way that produces faces, not only margins.",
          "Cap discipline. The owner will live with a quiet February. The cap sheet will not. Leave the books in order. Do not restructure just to feel rich. Standing pat, when you are already legal, can actually help you here. The game also notices large unused cap in-season. If a big share of the cap is sitting unused, certain losses add a small owner penalty. Wins are not penalized for that, but the message is clear: unused room is not the same thing as discipline if the roster looks unfinished.",
          "Culture. The owner cares how the locker room feels on Wednesday. Talent that poisons the week is not talent. Cuts and trades of respected players are expensive here, even when the cap likes them. Hiring a staff with a strong culture rating is one of the few early ways to show you heard the brief. Hiring a Head Coach and Staff picks up that thread."
        ]
      },
      {
        "heading": "Watch the owner confidence meter",
        "paragraphs": [
          "Owner, fans, and locker room are three separate meters. The owner meter is the one that can end the job. If owner confidence collapses, the season can move to a firing before you ever reach February. The live desk will say the owner pulled the chair.",
          "Watch the owner confidence meter and check the effect of each decision. A win moves the owner. A collapse, a brief-fighting trade, or a messy cap can move him the other way.",
          "In Career mode, a firing is not automatically the end of the file. You can see who else will take the call, take another job, or walk away and file the career retrospective. New jobs are not a shortcut. The mode page already warns you that a firing can lead to another job instead of ending the file, and the new roster is usually a harder one. The old team's cap bills stay with that club. You inherit the new team's sheet, including its dead money.",
          "If you keep the job, the next year does not start at the same confidence you finished with. The relationship cools and resets some, and you are back in the meeting with the same owner and a roster that is a year older. Plan more than one season ahead, but do not assume you will be given three quiet years to finish a rebuild if the brief was win now. Rebuild or Reload? covers that tension."
        ]
      },
      {
        "heading": "The goals that matter most, in practice",
        "paragraphs": [
          "People ask me which goal to optimize. The honest answer is the one on this year's brief, then the record, then the other two meters.",
          "A useful order when you are stuck:",
          "Do not fight the brief in the first month unless you are sure the roster makes the brief impossible.",
          "Hire a staff that fits the plan. A youth brief and a win-now staff will pull the offseason in opposite directions.",
          "Make cap moves that the brief can defend. Restructures buy room and create future dead money. Cuts buy room and can bruise the locker room. Details are in Dead Money and Restructures.",
          "Read trade cards as value plus approval, not value alone. Reading Trade Value is the companion to this page.",
          "Win enough games to keep the conversation about the roster, not about your job.",
          "The end-of-season grade weighs regular-season record, playoff finish, owner confidence, locker room, and cap health. A championship is a major bonus, and the record is still part of the score. That is a good picture of the job I was trying to model. You can win a Super Bowl and still have had an ugly year with the owner. You can miss the playoffs and still have done the assignment you were given. Only one of those is a comfortable press conference, but both are coherent GM years.",
          "Keep the chair by doing the job you were handed, or by being right so often that the owner forgives the argument. There is not a third option."
        ]
      }
    ],
    "relatedSlugs": [
      "career-mode-guide",
      "trade-value-guide",
      "dead-money-and-restructures",
      "hiring-head-coach-and-staff",
      "rebuild-vs-reload"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/owner-meeting.webp",
      "alt": "The owner meeting with three answers and their confidence effects",
      "caption": "Read the owner’s priority and compare the effects before answering.",
      "width": 1030,
      "height": 860
    },
    "published": "2026-11-25"
  },
  {
    "slug": "free-agency-retain-or-let-walk",
    "title": "Free Agency: Who to Retain and Who to Let Walk",
    "description": "A simple age, cost, and position framework for Run The Roster free agency, including when to re-sign, use the franchise tag, or let a player reach the market.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Free agency is where good plans go to look expensive. In Run The Roster, the offseason asks you to decide which expiring players to retain before you work the outside market. That order is the whole point. Your own players come first. The strangers come after.",
          "I use a simple framework: age, cost, and position, read against the owner brief. It will not make the decision easy. It will keep you from signing a 33-year-old skill player on a whim because the highlight looked good in March."
        ]
      },
      {
        "heading": "Your own players first",
        "paragraphs": [
          "Before the market opens, expiring players on your roster need a decision. For a core name, the live game gives you three doors:",
          "Re-sign him, usually on a multi-year loyalty deal that is cheaper than the open-market ask.",
          "Use your one franchise tag, which is a one-year stay at a higher number.",
          "Let him reach the market.",
          "The room shown on the cap screen excludes those expired prior contracts until you act. Re-signing or tagging one adds the new charge immediately. If you do not have the room, you have to go back to the cap tools first. Dead Money and Restructures is that page.",
          "Letting a star walk frees the old charge for the market, and it costs you with the fans and the locker room. Sometimes that is still correct. The city will not like it, and the brief might.",
          "You get one franchise tag per season in the current build. The tag keeps the player. It does not settle the contract. I use it when I cannot live without the player this year, I am not ready to pay the long deal, and I can afford the one-year number. I do not use it on a position I was already willing to replace in the draft."
        ]
      },
      {
        "heading": "The age, cost, and position test",
        "paragraphs": [
          "When a name comes up, I ask the three questions in the same order.",
          "Age. Is this player still in the part of his career that the sim will treat kindly? Younger players can still improve. Older players can lose a step from one Career year to the next. A one-year deal on an older starter can be a good idea. A long deal on an older starter is how next year's sheet starts in a hole.",
          "Cost. What is the ask, and what else would that money buy? Meeting the ask is guaranteed. A lower offer can be accepted, countered, or end talks, and you get one submitted offer per player in that market window. If you lowball a player you truly need, you may not get a second try. If you always meet every ask, you will run out of room before you finish the roster.",
          "Position. Is this a position that deserves scarce cap, or one I can fill later for less? I will pay to keep a quarterback or an edge rusher I believe in sooner than I will pay a similar-rated running back. Positional Value explains why I think that way. The point is not to ignore the cheap positions. The point is to avoid spending star money where the market is already telling you not to.",
          "Then I run the same three answers past the owner brief. A youth brief wants you to let more veterans walk than a win-now brief does. A cap-discipline brief wants the number to fit without a messy restructure. A stars brief will not applaud you for letting the most famous name leave so you can sign two quieter players, even if the quieter players are the better football."
        ]
      },
      {
        "heading": "Opening the outside market",
        "paragraphs": [
          "Once you leave your own list and open the outside market, unsigned players on that list become available to other teams. An unsigned player is not guaranteed to appear again. That is the price of shopping around. If there is a name you cannot lose, decide before you open the doors.",
          "The market arrives in waves. If no offer in this wave fits your remaining cap space, you can advance the market or continue without another signing. You do not have to spend just because the page is still open. I would rather close the market a little early than force a deal that wrecks the draft plan.",
          "Outside free agents are modeled. In historical modes they are fictional, deterministic gameplay candidates. They are not claimed as players from the original season. Do not write a recap that treats a historical free-agent signing as something the real 1999 Rams or 2007 Patriots did."
        ]
      },
      {
        "heading": "A few patterns that keep getting me in trouble",
        "paragraphs": [
          "Paying yesterday's production. A veteran who just had a good year is easy to over-retain. Look at age and the length of the deal, not only the rating.",
          "Using the tag because it feels like action. The tag is a tool, not a default. If the one-year number is almost as expensive as a loyalty deal, and the player is still central to the plan, I would rather settle it.",
          "Letting a mid-level starter walk so I can chase a slightly better stranger. You often lose the bird in hand, miss the better one, and end up filling the hole in camp. If the upgrade is real and the brief supports it, fine. If it is a one-overall-point fantasy, keep your guy.",
          "Opening the market before the cap is honest. If you are only legal because you plan to restructure later, the first market ask will pin you. Make the sheet true, then bid.",
          "Ignoring Career math. In Career, this signing is still on the sheet next year, and the player will be a year older. Single Season lets you spend like there is no tomorrow, because there isn't one. Career punishes that habit."
        ]
      },
      {
        "heading": "A worked example, labeled as a pattern, not a box score",
        "paragraphs": [
          "Imagine you have an expiring edge rusher in his late twenties, still a clear starter, and a win-now brief. The loyalty ask fits after a modest restructure of a different contract. I re-sign him. The tag would only delay a payment I already believe in, and letting him walk would send me into the market shopping for the same position at a worse price.",
          "Now imagine the same player, a year older, on a build-young brief, with a cheaper drafted edge already on the roster. I let him reach the market, I keep the room, and I live with the fans being loud in March. That is not me being heartless. That is me doing the assignment I accepted in the owner meeting.",
          "The framework does not tell you who to love. It tells you whether the love is affordable, timely, and on-brief. Use it, then go make the call and live with it in January."
        ]
      }
    ],
    "relatedSlugs": [
      "dead-money-and-restructures",
      "positional-value-roster-building",
      "owner-goals-keep-your-job",
      "draft-strategy-bpa-vs-need",
      "salary-cap-explained"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "final-camp-cuts-53-man-roster",
    "title": "Final Camp Cuts: How to Build Your 26-Player Roster",
    "description": "Make better training camp cuts in Run The Roster. Protect quarterback depth, compare dead money, and build a playable 22-to-26-player roster.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Cutdown day is the worst part of the job and also the most honest. By the time you reach camp in Run The Roster, you have already hired a staff, worked the cap, decided who to retain, taken trade calls, and drafted. Now you have to turn that pile of names into a roster that can play Week 1.",
          "The NFL keeps 53. This game does not. In the live build, camp cuts have to land between 22 and 26 players, and you have to keep a quarterback. The shorter sheet exists so the weeks play fast. Every name you keep still matters, which is why these cuts can sting more than a real 53-man cut, where a late-round receiver can be a game-day inactive and not a hole in the sim."
        ]
      },
      {
        "heading": "What you are actually building",
        "paragraphs": [
          "Think of the camp roster as a compressed 53. You still need a quarterback, a way to run, a way to throw, a line, a pass rush, and a secondary. You do not have spare seats for a specialist who never touches the weekly result. Punting is included in the game's special-teams abstraction. There is no separate punter roster spot or draft position, so do not spend a keep on a problem the game is not asking you to solve.",
          "The scouting staff makes late-round selections by roster need when the cap permits them. If no available prospect fits, staff can stop before filling all later rounds. Completed selections appear in the draft log and the camp roster. Some of those automatic adds will be the first names I consider cutting, especially if they duplicate a position I already filled on purpose.",
          "The game can suggest cuts. That suggestion is a starting point, not a ruling. It tends to protect a starting quarterback and offer the lowest-rated leftover names. You still have to look at positions. A suggestion that leaves you thin on the offensive line and heavy at running back is a legal roster and a bad football team."
        ]
      },
      {
        "heading": "Depth chart minimums I will not go below",
        "paragraphs": [
          "Outside the game’s roster-size and quarterback requirements, treat these as roster-building preferences rather than mandatory position quotas. Here is the shape I use when I play, and the reasons for it.",
          "Quarterback: at least one, preferably two if the second is not wasting a seat you need elsewhere. The rules will not let you open the season with zero. A lone quarterback is legal and fragile. If I have a veteran backup who can actually play, I keep him unless the last seat is needed for a starting-quality hole.",
          "Offensive line and defensive line: enough to survive an injury week. The weekly sim uses roster strength, staff, injuries, and some variance. If you keep four skill players and two linemen because the skill players have prettier ratings, you will learn why that was cute.",
          "One clear answer at the expensive positions, then stop. I want a real quarterback, a real edge, a real corner, and a real receiver. I do not need three of each if that means I have no interior line.",
          "Do not keep a famous name who no longer fits the brief just because cutting him feels rude. If he is still a top player, the locker room and fans may notice the cut. If he is a declining extra at a crowded position, the hurt is smaller than leaving a hole at tackle."
        ]
      },
      {
        "heading": "The cuts that hurt least",
        "paragraphs": [
          "When I have to get from a crowded camp down to a legal sheet, I look for cuts in this order:",
          "Automatic late-draft adds at positions I already filled with better players.",
          "Older replacements who do not start and do not help the brief, especially on a youth plan.",
          "Expensive backups whose cap number would be more useful as room, if the cheaper backup can actually play.",
          "A third or fourth name at a cheap position, running back or tight end, before I cut a second lineman.",
          "Only then a real debate between two players who both deserve a seat.",
          "The cuts that hurt most are the ones that strand you at quarterback, collapse a line, or dump a respected starter to keep a slightly more interesting athlete. Those are the cuts that come back as desk conversations, and they are the ones a culture or win-now owner will remember.",
          "If two players are close, I keep the one who fits the staff and the brief. A development-minded staff and a youth brief want the younger player with upside, even if his current rating is a step behind. A win-now brief wants the guy who can play in Week 1. That sounds obvious, and it is the decision people get backwards because they fall in love with a draft card."
        ]
      },
      {
        "heading": "A 53-man mindset still helps",
        "paragraphs": [
          "Even though the sim sheet is shorter, thinking like a 53-man cut committee will keep you honest.",
          "On a real 53, you are asking who dresses on Sunday, who you can hide, and which practice-squad bets you are willing to lose. In this game, there is less hiding. If a player is on the roster, he is part of the strength the sim sees. That is why \"I will just keep him as depth\" is a weaker argument here than it is in real life. Depth is real, but it has to be useful depth.",
          "So borrow the 53-man habit of walking down the board by position, and then accept that you must stop sooner. Ask, for each position: who starts, who plays if the starter is out, and who is only here because I like his name. The third group is where the least painful cuts live.",
          "When the roster is set, Week 1 is a real game. The standings start doing the talking. If you have done this right, you will dislike two of the cuts and still be able to explain them in a sentence. If you cannot explain a cut in a sentence, you probably kept the wrong guy."
        ]
      },
      {
        "heading": "Before you open Week 1",
        "paragraphs": [
          "Read the depth warnings after cuts, not just before. A good-looking roster can still leave you thin at receiver or without a second option if your starting quarterback goes down. Check the projected cap room after dead money, then review the two cheapest players you are about to release. Keeping one as insurance can do more for the year than keeping a veteran who has no clear assignment."
        ]
      }
    ],
    "relatedSlugs": [
      "single-season-walkthrough",
      "positional-value-roster-building",
      "draft-strategy-bpa-vs-need",
      "free-agency-retain-or-let-walk",
      "how-to-play"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  },
  {
    "slug": "hiring-head-coach-and-staff",
    "title": "Hiring a Head Coach and Staff",
    "description": "How staff choices change a Run The Roster season, when to keep an incumbent or a historical legend, and how to hire a head coach who fits the owner brief.",
    "playHref": "/season/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Your first offseason decision is not a player. It is the owner's direction, and then the staff that has to live with it. I put hiring early in the year on purpose. A youth brief and a win-now staff will pull every later choice, retains, the market, the draft, in opposite directions.",
          "In Single Season and Career, you hire a staff after the owner meeting and before the cap phase, unless a historical start already has a coach in the building and the game moves you along. In Historical, some of the most famous voices in the sport are available if you want the building as it was. You can also decide you do not."
        ]
      },
      {
        "heading": "Who you are hiring",
        "paragraphs": [
          "The live hire board is built around a head coach and the rest of the staff that runs the operation with him. In the current build that includes an offensive coordinator, a defensive coordinator, and a scouting director, each with a scheme and a short set of ratings.",
          "Candidates are mostly fictional gameplay staff, on purpose. Many staff members are modeled or fictional unless a screen says otherwise. Historical packs are the exception that matters. On those rosters you can see real coaches offered as legends you may keep:",
          "1985 Bears: Mike Ditka, and Buddy Ryan's pressure is part of the inheritance",
          "1993 Cowboys: Jimmy Johnson is one of the voices you can keep",
          "1999 Rams: the building already has a coaching identity tied to that offense",
          "2007 Patriots: Bill Belichick is available if you want the building as it is",
          "2013 Seahawks: Pete Carroll will run the building if you hire him",
          "1989 49ers: George Seifert is the new head coach if you keep the staff",
          "Keeping a legend is not automatic. It is a choice. The city already knows the name. That helps a stars brief and a culture brief more than it helps a fiscal one, because famous coaches are rarely the cheapest option on the board."
        ]
      },
      {
        "heading": "How staff choices change the sim",
        "paragraphs": [
          "Staff is not wallpaper. Weekly results come from current roster strength, staff effects, injuries, and deterministic game variance. The same roster can play differently if the staff you hired actually fits what you are trying to do.",
          "When I read a candidate, I look at four things, in this order:",
          "Fit with the brief. A development-minded coach is a gift on a build-young year and a milder one on a win-now year. A high-culture coach helps when the owner cares how the room feels on Wednesday. A cheap, patient coach is a fiscal owner's friend. An expensive, aggressive coach can please a win-now or stars owner and irritate a cap-discipline one.",
          "Scheme, in one sentence. If I cannot say what the staff wants to do, I am hiring a résumé. The scheme line is there so you can hire a staff that wants the same kind of football your roster can actually play.",
          "The locker room and the fans. Culture-heavy hires can settle the room. Aggressive hires can excite fans. Either can be correct. Neither is free if it fights the brief.",
          "Cost. Staff cost is part of how a fiscal owner keeps score, and part of how a stars owner decides whether you look serious.",
          "I am not going to print a hidden formula for how many points each rating adds to a week. The screen already shows the traits. Use them as a fit test, then let the season tell you if you were right."
        ]
      },
      {
        "heading": "When to keep the incumbent",
        "paragraphs": [
          "Keep the incumbent, or the historical legend, when the building already matches the plan. If you are taking the 2013 Seahawks and the brief (or your own plan) is to ride a young defense and a cheap quarterback, hiring Pete Carroll is the coherent choice. If you are taking the 2007 Patriots and you want to chase the year as it was, Belichick is the coherent choice. Firing a legend because a cheaper fictional coach has a slightly prettier development number is a good way to pick a fight with the city for no reason.",
          "Change the staff when the brief and the incumbent disagree, or when you inherited a voice that wants a style your roster cannot play. A patient, veteran-light coach on a win-now roster will bore the owner to death. A star-hunting coach on a youth brief will spend your offseason in the wrong meeting.",
          "In a modern Single Season start, there may not be a famous incumbent at all. Then you are hiring in the open. I pick the head coach first as the tone of the building, then I hire coordinators and a scout who will not wage a private war with that tone. A scout who is honest about linemen is more useful on a line-poor roster than a scout who falls in love with skill players you cannot get to the line of scrimmage."
        ]
      },
      {
        "heading": "A hire should make the later pages easier",
        "paragraphs": [
          "You will know the staff hire worked if the next decisions get simpler.",
          "Retain meetings: you already know whether veterans are welcome.",
          "Free agency: you already know whether you are shopping for stars or for cheaper help.",
          "The draft: you already know whether you are taking the best player available or filling a scheme need. Draft Strategy is easier when the staff has a point of view.",
          "Camp cuts: you already know which young players the building wants to live with.",
          "If you finish hiring and you still cannot say, in one sentence, what kind of team this is, go back and look at the brief. The staff is how you tell the building you meant it.",
          "In Career mode, that staff walks forward with you unless a later season gives you a reason to change it. A firing, of course, ends the experiment. You can take another job, but you will be hiring into a harder roster, not repeating the same first year with a new headset.",
          "Hire for the plan. Then go build a roster that can survive the plan. That is the whole sequence I wanted on the desk."
        ]
      },
      {
        "heading": "Matching a hire to the next decision",
        "paragraphs": [
          "Before you choose, name the first move you expect to make after the hire. If it is developing a quarterback, compare development and scheme before comparing the reaction numbers. If it is holding together a veteran defense, look for a coach whose approach lets those starters keep doing what works."
        ]
      }
    ],
    "relatedSlugs": [
      "owner-goals-keep-your-job",
      "single-season-walkthrough",
      "draft-strategy-bpa-vs-need",
      "historical-seasons-which-team",
      "career-mode-guide"
    ],
    "legacySection": "guides",
    "figure": {
      "src": "/images/guides/staff-board.webp",
      "alt": "Three head coach candidates with scheme, ratings and expected reaction",
      "caption": "This example head coach board shows how a hire affects the building as well as the scheme.",
      "width": 1030,
      "height": 860
    },
    "published": "2026-11-25"
  },
  {
    "slug": "2027-draft-order-watch",
    "title": "2027 NFL Draft Order Watch: What the Jets' Extra Firsts Buy",
    "description": "A dated look at the 2027 NFL draft order, the Jets’ extra firsts, and what trading down actually buys in Run The Roster.",
    "playHref": "/career/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The early 2027 draft order is a moving target. The week before Thanksgiving offered a useful GM lesson: it matters where your pick lands, but it also matters whose pick you own.",
          "This is a snapshot of Chad Reuter’s NFL.com projection entering Week 12, after Week 11. Record comes first, followed by strength of schedule as the first tiebreaker. Playoff results, not this November board, will determine the slots of postseason teams."
        ]
      },
      {
        "heading": "The top of the board entering Week 12",
        "paragraphs": [
          "Tennessee, the Chargers and Miami were all 1–9. Strength of schedule put them first, second and third in Reuter’s projection.",
          "The Jets had No. 4 from Indianapolis, No. 5 of their own, and No. 15 from Dallas. Three teams with the same record still had three different draft spots. The Jets, meanwhile, could see their draft position improve without losing a game themselves. That is what makes somebody else’s first-round pick useful.",
          "Philadelphia held its own pick at No. 7 plus Jacksonville’s first from the Jordan Davis trade. Reuter marked the Jaguars as a playoff team in this snapshot, so their pick was not assigned a fixed slot. That is the difference between collecting a first and knowing where it will land.",
          "Cleveland also held a first from the Rams, and Tennessee held an additional first from Chicago. If I’m the GM budgeting for next year, I care as much about when I can expect the pick to land as about the fact that I own it."
        ]
      },
      {
        "heading": "What tanking math actually is",
        "paragraphs": [
          "Fans use \"tanking\" as a plot. GMs have to use it as arithmetic, and the arithmetic is less cinematic than the word.",
          "An earlier pick gives you first crack at more prospects, but the real NFL’s rookie wage scale also makes those earlier picks more expensive. You are buying a better chance at a player who helps, not a guarantee. If two prospects are close on your board, the cheaper slot and an extra future pick can be worth more than choosing first.",
          "The Jets are a good example of how draft capital changes the job. They could use one high pick to address a need or listen to offers while still holding another high pick. Philadelphia has two firsts as well, but a fixed slot for Jacksonville’s pick would give a false sense of certainty.",
          "The other half of the math is the year you are living through. Lose enough, and you may get the pick you wanted. You also have to walk into the building every week and answer for the losses. Owners, fans, and locker rooms do not grade a season only by April. If you have ever watched a real December press conference, you already know that."
        ]
      },
      {
        "heading": "How I would treat this in Run The Roster",
        "paragraphs": [
          "The real NFL wage scale and the game work differently. In Run The Roster the rookie cap charge depends on the round and your franchise’s cap level, not where you pick within that round. At a $322 million cap, a first-round rookie costs $3.1 million against the cap, a second costs $2.3 million, and a third costs $1.5 million.",
          "Career mode carries the draft forward. The pick you earn or trade this year shows up in a later offseason, and the contract you sign a rookie to is part of next year's sheet.",
          "Trade cards will tell you if moving a veteran for a future pick is Good, Fair, or Poor football value. The owner brief will tell you if that is the job you were hired to do. A win-now owner does not want your April presentation. A build-young owner might.",
          "You do not \"tank\" in Daily, and you should not pretend a Historic Turnaround is a tanking exercise. Those modes have a different assignment. This conversation belongs in Single Season and Career, and in the way you read real standings as a GM.",
          "If I were handed a struggling Career roster with an owner who wants a younger team and a couple of future firsts, I would stop spending like a contender. Keep the young players you want to build with and consider trades that add picks without throwing away the roster you will need next season. On a contender I would be more selective about deals that take a starter off the field.",
          "A trade down within the same round can add a future pick, but it will not lower the rookie cap hit. Think of the trade as buying another chance to draft, not as creating space to sign a free agent."
        ]
      },
      {
        "heading": "When I would trade down",
        "paragraphs": [
          "Write down the names you would be comfortable drafting before you answer the phone. If you have three prospects with similar grades and can move back a couple of places, a future pick is a useful addition. If you have one prospect who changes the roster and expect him to be gone at the new slot, the future pick has to compensate you for giving up that chance.",
          "For example, suppose your owner wants a younger roster and you own two early firsts. With the first pick, you can take a player who fills a role you otherwise would need to pay a veteran to fill. With the second, you can listen for offers without having to force a deal. If no club offers enough, keep the pick and draft. Having a choice is itself the advantage of holding extra picks.",
          "Make one final check before you trade: how many rookies will actually fit on the roster? In a game with a short camp roster, adding a fifth piece you are likely to cut can matter less than keeping a chance at a starter. In Career, a future pick gives you time to plan for a contract expiring next year. In a one-season file, a player you can use this season is usually easier to justify.",
          "The order will move again. Use the dated board to see who has choices, not as a promise that the November order will survive through April."
        ]
      }
    ],
    "relatedSlugs": [
      "draft-strategy-bpa-vs-need",
      "rebuild-vs-reload",
      "career-mode-guide",
      "positional-value-roster-building"
    ],
    "legacySection": "news",
    "sources": [
      {
        "label": "Chad Reuter’s NFL.com 2027 draft-order projection",
        "href": "https://www.nfl.com/news/2027-nfl-draft-order-biggest-needs-for-every-team"
      },
      {
        "label": "NFL trade deadline tracker",
        "href": "https://www.nfl.com/news/nfl-trade-deadline-track-every-move-since-start-of-2026-regular-season"
      }
    ],
    "published": "2026-11-25"
  },
  {
    "slug": "1985-bears-gm-guide",
    "title": "Running the 1985 Bears Without a Salary Cap",
    "description": "A GM's guide to the 1985 Bears in Run The Roster: no salary cap, a payroll the owner will notice, Payton in his early thirties, and a defense that is already a problem for the league.",
    "playHref": "/historical/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The 1985 Bears are the cleanest thought experiment in the historical set, and they are also the easiest to play wrong. There is no salary cap. There is a payroll the owner will notice. If you treat that as permission to spend like a video game, you have missed the point of the pack.",
          "I put this roster in the game because every football fan has a version of that defense in their head, and I wanted you to sit in the chair with the thing already built. The job is not to invent the 46. The job is to keep the thing pointed in the right direction, and to decide what you owe Walter Payton as he moves through his early thirties."
        ]
      },
      {
        "heading": "What you are inheriting",
        "paragraphs": [
          "The Historical page is the brief I want you to start with. The defense is already a problem for the rest of the league. You inherit Mike Ditka, Buddy Ryan's pressure, and Payton in his early thirties. The season is 16 weeks. The payroll guide is $18 million.",
          "Featured rosters use selected real player names and positions. Ages, ratings, contracts, and other game attributes are modeled. Opponents, coaches, free agents, and draft classes are incomplete or synthetic. Starting dead money is a modeled gameplay input with no claimed historical transaction origin. I am not giving you a reenactment of 1985 accounting. I am giving you a compact, sourced roster and a sim that has to live with it.",
          "The roster itself is a compact selection from the team-published complete 1985 season roster. It is not asserted as an opening-day roster, and positions are consolidated. For the full roster, see the Bears’ team record linked below.",
          "The real 1985 Bears went 15-1 and won Super Bowl XX. That is the history you already know. The pack's gameplay goals are not a claim that your sim has to finish 15-1. Historical mode gives you a championship goal, and an ultimate target of going undefeated and winning it all. Those are gameplay targets, not a grade of the real season."
        ]
      },
      {
        "heading": "There is no cap, and that is not the same as no limits",
        "paragraphs": [
          "The NFL did not have a salary cap in 1985. The cap arrives later, which is why the 1993 Cowboys pack is labeled as the last season before it, and why the 1999 Rams pack suddenly has a hard number. On the Bears, you are in payroll-guide mode. You can go over. The owner still reads the number.",
          "That changes the offseason. You cannot be \"illegal.\" You can be sloppy. If you start handing out veteran money because the hard cap is not there to stop you, you are taking a political risk for a roster that does not need a lot of help. I treat the $18 million guide as a fence I do not lean on unless the football reason is obvious.",
          "The defense is the reason the pack exists. I would not spend like a general manager who just arrived in a rebuild and needs to buy a pass rush. You already have one. Spend, if you spend at all, to protect what is already loud, not to decorate it."
        ]
      },
      {
        "heading": "Payton, age, and the temptation to get cute",
        "paragraphs": [
          "Walter Payton was 31 during the 1985 season. The game text says early thirties, and that is the right way to hold the problem. He is not a rookie you are developing. He is not a fading extra you cut in camp to make a point. He is the offense the rest of the country can still recognize.",
          "The temptation, because this is a what-if mode, is to get cute. Trade a legendary name for a pile of future value. Move on from a 31-year-old back because you have read too many modern positional-value essays, including mine. You can do that. The sim will let you. I would not, not in a one-season historical file, unless I had a very specific reason and I was ready for the building to hate it.",
          "If you are asking the modern question, \"should I pay a running back?\" the answer on this roster is that you already have this running back, on a one-year historical stage, with no next cap year unless you are only using this as practice. Honor the roster you came to play. Save the running-back austerity for a modern Career file."
        ]
      },
      {
        "heading": "The staff you can keep",
        "paragraphs": [
          "Ditka is available as the head coach if you want the building as it is. Buddy Ryan's pressure is part of the inheritance described on the Historical page. I keep that staff when my plan is to run the year I came to see. I change it only if I am deliberately playing a contrarian file, and I treat that as a different experiment, not as the default.",
          "Keeping a legend is a culture and stars decision as much as a scheme decision. The city already knows the voice. A cheaper fictional coach might have a prettier development rating. That is not, by itself, a reason to rip the headset off a Super Bowl staff in August of a 16-week game."
        ]
      },
      {
        "heading": "How I would actually play the year",
        "paragraphs": [
          "I embrace a win-now brief if the game hands me one, because this roster is not a youth movement. I keep the incumbent staff. I am conservative on the payroll guide. I do not go shopping in the fictional free-agent market just to feel busy. I am careful in camp, because the sim roster is only 22 to 26 names, and cutting a real piece of that defense to keep a novelty signing is how you waste the pack.",
          "Then I live with the weekly sim. Opponents are not a full historical league of period-accurate rosters. Ratings and results are the game's model. You can beat history, and you can fall short of it, and neither result is a documentary.",
          "If you want a harder cap puzzle after this, go play the 1999 Rams or the 2007 Patriots. Those packs have a real ceiling. This one has a conscience instead. Use it."
        ]
      },
      {
        "heading": "Keep an eye on the actual payroll",
        "paragraphs": [
          "Read the guide before entering free agency, then compare the projected room after camp. Chicago can spend past its payroll guide in the game, but that does not make each addition worth the cost. If you cannot name the job an outside signing will take on Sunday, keep the room and let the roster you inherited play."
        ]
      }
    ],
    "relatedSlugs": [
      "historical-seasons-which-team",
      "hiring-head-coach-and-staff",
      "owner-goals-keep-your-job",
      "final-camp-cuts-53-man-roster",
      "1999-rams-warner-green"
    ],
    "legacySection": "guides",
    "sources": [
      {
        "label": "Chicago Bears 1985 roster",
        "href": "https://www.chicagobears.com/news/1985-chicago-bears-roster-16745357"
      }
    ],
    "published": "2026-11-25"
  },
  {
    "slug": "1999-rams-warner-green",
    "title": "1999 Rams: Trent Green, Kurt Warner and the Cap",
    "description": "A GM's guide to the 1999 Rams in Run The Roster, including the quarterback decision between Trent Green and Kurt Warner and the $57.3 million cap that makes the choice expensive.",
    "playHref": "/historical/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The 1999 Rams pack is a quarterback problem wearing a Super Bowl costume. Everybody who comes to it already knows the ending in real life. Trent Green was the starter the club had paid. He got hurt in the preseason. Kurt Warner, the backup who knew the offense cold, became the story, the MVP, and the quarterback of Super Bowl XXXIV.",
          "The game does not make you sit through a documentary about that year. It hands you the tension at the start, while both names are still on the roster, and it puts a hard cap underneath them."
        ]
      },
      {
        "heading": "What the pack is, and what it is not",
        "paragraphs": [
          "The Historical page is blunt, and it should be. The Greatest Show is not a slogan yet. Green is the starter you paid. Warner is the backup who knows the offense cold. The cap is real, $57.3 million, and Warner's number is tiny. The season is 16 weeks.",
          "Featured rosters use selected real player names and positions. Ages, ratings, contracts, and other attributes are modeled. The cap figure is the game's hard limit for this pack, aligned to that era's ceiling, not a claim that every contract on the sheet is a 1999 filing. Starting dead money is modeled and has no claimed historical transaction origin. Opponents, free agents, and draft classes are incomplete or synthetic.",
          "The roster is a compact full-season selection anchored to the Super Bowl XXXIV roster. Injured season originals may remain. Positions are consolidated. The roster source is the Super Bowl XXXIV gamebook: NFL GSIS gamebook.",
          "That last sourcing note matters for the quarterback decision. A Super Bowl gamebook is a snapshot of the ending. The pack still lets injured season originals remain, which is how Green can be on a file that is also anchored to a Super Bowl roster Warner actually took to the game. You are not looking at a single frozen Sunday. You are looking at a compact version of the year, with the two quarterbacks still in the building."
        ]
      },
      {
        "heading": "The cap is why the decision has teeth",
        "paragraphs": [
          "$57.3 million is not a modern cap. It is tight in a way 2026 players are not used to feeling. In a hard-cap season you cannot close the cap phase in the red. If Green's number is the one you paid, and Warner's number is tiny, the sheet is already telling you a story.",
          "A modern instinct is to \"start the better football player\" and let the money sort itself out. Sometimes that is right. On a $57.3 million cap, starting the better football player can still leave you paying a starter's charge for a backup's snap count, unless you also solve the contract. Solving the contract, in this game, can mean a cut and current dead money, or a restructure that pushes a charge into a future year you may not even play in a one-season historical file.",
          "I walk through those tools in Dead Money and Restructures. The Rams-specific version is this: if you decide Warner is the quarterback of the year, you still have to decide what Green's charge is doing on the sheet. If you decide Green is the quarterback of the year, you are choosing the player the club paid, and you are leaving Warner as the cheap insurance policy that real life turned into a legend.",
          "On the stock 1999 roster, Green carries a $4.2 million cap charge. Warner carries $500,000, a modeled difference of $3.7 million. That gap is the puzzle, but it does not make the more expensive contract disappear when you move Green down the depth chart."
        ]
      },
      {
        "heading": "How I think about the football, separate from the myth",
        "paragraphs": [
          "It is almost impossible to play this pack without hindsight. You know what Warner became. The game is more interesting if you also look at the roster the way a GM would have looked at it in August, before the myth.",
          "Green was brought in to be the starter. Warner was not a famous answer yet. If the ratings and the staff confidence on your particular file still have Green as the starter, \"I started Warner because I have already seen the documentary\" is a valid what-if, and it is also a bit of a cheat. I do not mind the cheat. Just admit that is what you are doing. The more interesting file, to me, is the one where you either trust the paid starter and keep Warner ready, or you make Warner the starter and then do the cap work that decision requires.",
          "The rest of that offense, the skill players the year became famous for, is why the quarterback choice matters so much. This is not a pack about finding a receiving corps. It is a pack about not wasting one."
        ]
      },
      {
        "heading": "Staff, market, and the year in front of you",
        "paragraphs": [
          "Keep the historical staff if you want the offense as the building understood it. A what-if hire is available if you want a different experiment. Outside free agents in historical modes are fictional gameplay candidates, not 1999 market signings. Do not spend this tight cap buying a stranger to solve a problem the roster already has a name for.",
          "Then go play the 16 weeks. Results are simulated. You can win the championship target, or you can miss it with the same famous names on the page. That is the point of the mode. History already happened. This file is yours.",
          "If you want the other side of the quarterback-cap coin, go play the 2013 Seahawks, where the starter is cheap on purpose. The Rams ask what you do when the backup is cheap and the starter is not. That is a more uncomfortable question, which is why I like this pack."
        ]
      },
      {
        "heading": "Try both quarterback plans on paper first",
        "paragraphs": [
          "Write two depth charts without making a move. In one, Green starts and Warner is the inexpensive backup. In the other, Warner starts and Green is still on the payroll. Compare the cap on both: changing the order does not change the contract. Now compare that second roster against a third in which you release Green and take the displayed dead-money hit. If the difference buys a starter elsewhere, you have a real decision. If it only makes the cap look better, the experienced backup may be worth more than the room."
        ]
      }
    ],
    "relatedSlugs": [
      "historical-seasons-which-team",
      "salary-cap-explained",
      "dead-money-and-restructures",
      "2013-seahawks-rookie-contract-window",
      "hiring-head-coach-and-staff"
    ],
    "legacySection": "guides",
    "sources": [
      {
        "label": "NFL 1999 Rams roster",
        "href": "https://www.nfl.com/sitemap/html/rosters/1999/st.-louis-rams"
      }
    ],
    "published": "2026-11-25"
  },
  {
    "slug": "2013-seahawks-rookie-contract-window",
    "title": "2013 Seahawks: Winning With a Quarterback on a Rookie Deal",
    "description": "How to spend a $123 million cap in Run The Roster's 2013 Seahawks pack while Russell Wilson is still on a rookie deal, and why that window is the point of the roster.",
    "playHref": "/historical/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The 2013 Seahawks pack exists because of a cap sentence I could not stop thinking about as a fan. Russell Wilson is still on a rookie deal, which is the cheat code. The Legion of Boom is young and loud. The cap is $123 million. You can spend that money on the roster around the quarterback, or you can waste the window by paying for things the team does not need.",
          "This is the opposite of the 1999 Rams problem. There, the starter you paid is expensive and the backup is cheap. Here, the starter is cheap on purpose. Wilson was drafted in the third round in 2012. In this pack his modeled cap hit is $800,000, while Earl Thomas carries $5.4 million. The difference shows how a cheap starter can free room for an expensive defensive contract."
        ]
      },
      {
        "heading": "What you inherit",
        "paragraphs": [
          "The Historical page is again the brief. The defense is young and loud. Pete Carroll will run the building if you hire him. You can also decide the defense does not need that much volume. The season is 16 weeks. The cap is $123 million, a hard limit in this pack.",
          "Featured rosters use selected real player names and positions. Ages, ratings, contracts, and other attributes are modeled. The $123 million figure matches that season's cap era as a gameplay ceiling. It does not mean every contract on the sheet is a verified 2013 filing. Starting dead money is modeled, with no claimed historical transaction origin. Opponents, free agents, and draft classes are incomplete or synthetic.",
          "The roster is a compact full-season selection, not limited to the Super Bowl active-list snapshot. Positions are consolidated. The roster source is the Super Bowl XLVIII gamebook: NFL GSIS gamebook.",
          "In real life, those Seahawks won Super Bowl XLVIII. That is the history. In the game, the championship is a gameplay target, not a requirement the sim owes you."
        ]
      },
      {
        "heading": "Why a rookie quarterback deal changes every other spend",
        "paragraphs": [
          "A cheap starter is not only a bargain at quarterback. It is a different shape of roster. The money you did not spend on a veteran quarterback contract can go to the defense that makes the whole year famous, or to the offensive line that keeps the cheap quarterback upright, or it can leak into luxury signings that feel like activity.",
          "My rule on this file is simple. Spend first on the things that protect the window. That means the defense you already have, and the line in front of Wilson. It does not mean hunting a glamour signing at a position the pack is not asking you to solve, especially in a historical free-agent market that is fictional.",
          "This is also why I keep repeating positional value in modern seasons. When the quarterback is already solved on a rookie number, the right place to be expensive is the pass rush, the secondary, and the line. The wrong place to be expensive is a skill-position veteran who duplicates something you already have.",
          "If the sheet is tight anyway, use a restructure only on a player you are sure is part of this year, and remember that a one-season historical file makes future dead money less of a Career problem and more of a honesty problem. Do not restructure just because you can. The cap is $123 million, not $57.3 million. You should be able to build a coherent roster without hiding charges, if you do not get bored and go shopping."
        ]
      },
      {
        "heading": "Carroll, the defense, and the volume question",
        "paragraphs": [
          "I keep Pete Carroll if I want the building as it is. That is the default, and it is the one I recommend the first time through the pack. The Historical page also invites a real question: you can decide the defense does not need that much volume. That is a what-if I like, because it is a GM question rather than a souvenir question.",
          "If you want to take volume off the defense, do it with a plan. Maybe you are moving a costly piece to create more offensive balance. Maybe you are making a Fair or Good trade that a cap-discipline brief would understand. What I would not do is break up a young, loud defense because I wanted to see a different hobby roster. This pack is a lesson in spending around a cheap quarterback and a great defense. If you throw both lessons out, you are just playing a generic season with famous names."
        ]
      },
      {
        "heading": "How I would play the year",
        "paragraphs": [
          "I treat this as a win-now file that already has a future-friendly quarterback contract, which is a rare combination. I keep Carroll. I retain the defensive pieces that make the unit what it is, unless a contract is genuinely breaking the sheet. I am conservative in the fictional market. I am careful in camp, because a 22-to-26 sim roster cannot afford to lose Legion pieces so a late automatic draft add can have a seat.",
          "Then I let the weeks play. The cheap quarterback will not stay cheap forever in real life, and in a one-year pack you do not have to solve that extension. You just have to avoid wasting the year in which the math is still friendly. If you want to feel what happens after a window like this, start a modern Career and try to keep a young quarterback cheap while the roster around him gets more expensive. That is the long version of the same problem.",
          "The Seahawks pack is the most encouraging historical file I have, because the right answer is mostly \"don't mess it up.\" That is a harder instruction than it sounds."
        ]
      },
      {
        "heading": "Set a price before you shop for help",
        "paragraphs": [
          "Start with the cap room the game actually shows. Pick one role you can improve without replacing someone who is already a strength. Decide how much you are willing to spend on that role before you see the outside offers. If the first ask is too high, you can wait, make a different offer, or leave the room for camp. The advantage of a cheap quarterback is that you have choices. It is not an obligation to make a splash."
        ]
      }
    ],
    "relatedSlugs": [
      "historical-seasons-which-team",
      "positional-value-roster-building",
      "free-agency-retain-or-let-walk",
      "2007-patriots-chase-16-0",
      "salary-cap-explained"
    ],
    "legacySection": "guides",
    "sources": [
      {
        "label": "NFL 2013 Seahawks roster",
        "href": "https://www.nfl.com/sitemap/html/rosters/2013/seattle-seahawks"
      }
    ],
    "published": "2026-11-25"
  },
  {
    "slug": "2007-patriots-chase-16-0",
    "title": "2007 Patriots: Chasing 16 and 0 or Protecting the Future",
    "description": "A GM's guide to the 2007 Patriots in Run The Roster, with a $109 million cap, Brady and Moss already in the building, and a choice between going all in and keeping flexibility.",
    "playHref": "/historical/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "The 2007 Patriots pack is a dare. Brady, Moss, and a defense that still tackles are already in the building. The cap is $109 million. You can chase 16-0, or you can keep enough flexibility that one injury does not end the era.",
          "I wrote that sentence on the Historical page because it is the only honest way to sit in that chair. Real life already gave that roster a 16-0 regular season and a Super Bowl XLII ending that people still argue about. The game cannot, and should not, pretend to replay that exact year. It can ask you what kind of GM you would have been with a roster that good and a cap that tight."
        ]
      },
      {
        "heading": "What the pack hands you",
        "paragraphs": [
          "The season is 16 weeks, which happens to match the regular-season length those Patriots actually played. The cap is a hard $109 million. Bill Belichick is available if you want the building as it is.",
          "Featured rosters use selected real player names and positions. Ages, ratings, contracts, and other attributes are modeled. The $109 million figure is this pack's cap ceiling, in line with that season's cap era, not a claim that the sheet is a 2007 filing. Starting dead money is modeled, with no claimed historical transaction origin. Opponents, free agents, and draft classes are incomplete or synthetic.",
          "The roster is a compact full-season selection, not the Super Bowl active-list snapshot. Positions are consolidated. The NFL’s 2007 roster and the Patriots’ own season history are linked below.",
          "Historical mode will give you a championship goal, and an ultimate target of finishing undefeated and winning it all. Those are gameplay targets, not a claim about the real season, and not a promise that the sim owes you 16 wins."
        ]
      },
      {
        "heading": "All in, or flexible, is a cap question first",
        "paragraphs": [
          "Chasing 16-0, in GM terms, means you are willing to spend this year's roster to its limit. You retain the people who can help you in January. You do not sell starters for future picks just to win a trade card. You may restructure a contract to create room for one more useful piece, because next year is less important than this December.",
          "Protecting the future means you refuse some of those temptations. You leave room for a midseason problem. You do not push a pile of money into tomorrow to buy a luxury today. You may even take a Good or Fair trade that costs you a little of this year's edge and buys you a later pick, if you believe the era has to survive an injury.",
          "Both are defensible. They are not defensible at the same time. The mistake this pack invites is trying to do both, spending like a 16-0 hunt while telling yourself you were being careful.",
          "Because this is a one-season historical file, \"the future\" is a little abstract. You will not, in this pack alone, have to manage 2008. I still want you to play it as if you might, because that is what the chair would have felt like, and because the same habit will serve you in Career. If you only ever play historical as a souvenir season, you will always go all in, and you will miss half of the dare."
        ]
      },
      {
        "heading": "The names, and the temptation to over-manage them",
        "paragraphs": [
          "Brady and Moss are the reason most people click the pack. A defense that still tackles is the reason the pack is not just an offensive highlight film. I do not come to this file to trade those names away unless I am running a deliberate alternate history, and if I do that, I treat it as a different game.",
          "What I will do is look at the cap sheet and ask which supporting contracts are doing real work. A restructure on a necessary veteran, to make room for a piece that helps a championship push, can be the all-in choice done cleanly. A cut of a useful starter to make the number prettier is how you protect nothing and chase nothing.",
          "Belichick, as with the other legends, is the default keep if you want the building as it is. Hiring someone else is a what-if, not the recommended first run."
        ]
      },
      {
        "heading": "How I would call it",
        "paragraphs": [
          "If I am playing the pack the first time, I chase the year. I keep the staff. I spend to keep the roster intact. I accept that the cap will feel tight, because a $109 million ceiling on a stacked roster should feel tight. I do not add fictional free agents for the sake of activity. I cut carefully in camp, because a 22-to-26 sim roster has no seats to waste on ceremony.",
          "If I am playing it a second time, I take the other door. I leave more room. I refuse at least one tempting spend. I try to win anyway, and I find out whether the pack still stands up when I do not push every chip in. That second file is the one that teaches you more, because the first one is the file everyone wants.",
          "Real life already told us that an undefeated regular season is not the same thing as a finished job. The game, if it is working, should let you feel that without pretending it is a documentary. Call the shot. Live with it in January. That line is on the home page for a reason, and this is the pack it was written for."
        ]
      },
      {
        "heading": "Make the undefeated chase a weekly check",
        "paragraphs": [
          "Before opening the season, circle the two positions where an injury would force the biggest change. Keep a player who can cover each one if the roster allows. Then revisit that list at the deadline. If the offense is already working and the only offer adds a flashy player at an already strong position, pass. If you have a starting role you cannot fill internally, compare the incoming contract and the departing player before paying for help. The record tells you how close you are. The depth chart tells you what you actually need."
        ]
      }
    ],
    "relatedSlugs": [
      "historical-seasons-which-team",
      "dead-money-and-restructures",
      "trade-value-guide",
      "2013-seahawks-rookie-contract-window",
      "rebuild-vs-reload"
    ],
    "legacySection": "guides",
    "sources": [
      {
        "label": "NFL 2007 Patriots roster",
        "href": "https://www.nfl.com/sitemap/html/rosters/2007/new-england-patriots"
      },
      {
        "label": "Patriots team history, 2007 season",
        "href": "https://www.patriots.com/press-room/history-2000s"
      }
    ],
    "published": "2026-11-25"
  },
  {
    "slug": "rebuild-vs-reload",
    "title": "Rebuild or Reload? How Long a Turnaround Really Takes",
    "description": "How to decide between a true rebuild and a reload in Run The Roster Career mode, and why I will not invent a published average for how many seasons a turnaround takes.",
    "playHref": "/career/",
    "sections": [
      {
        "heading": "Start here",
        "paragraphs": [
          "Every fan uses \"rebuild\" to mean two different jobs, and then gets angry when the roster does only one of them. A reload is when you are still a contender and you change a few pieces. A rebuild is when you accept a worse now in order to own a better later. In Run The Roster, Career mode is where that difference becomes a length of time, because contracts expire, players age, the cap moves, and an owner can fire you before the later part arrives.",
          "What I can give you is the way the game is built, the way I decide which job I am actually doing, and the reasons a turnaround takes longer than a single exciting draft."
        ]
      },
      {
        "heading": "Rebuild or reload? Start with the roster",
        "paragraphs": [
          "Reload if the roster still has a quarterback you trust, enough of a core to play in December, and an owner brief that wants to win now or chase stars. You re-sign your own important people, you spend in free agency like someone who expects to be good this year, and you only take trades that do not gut the starting lineup. You are trying to buy a better version of the same team.",
          "Rebuild if the quarterback situation is not trustworthy, the cap is already full of yesterday's decisions, and the brief is youth or cap discipline, or you have decided to push back on a win-now brief because the roster cannot do it. You let veterans walk, you collect future picks when the trade card is Good or Fair and the room can bear it, and you spend the draft on the expensive positions you cannot rent later. You are trying to become a different team.",
          "If you do a rebuild with your mouth and a reload with your cap sheet, you will get the worst of both. You will be mediocre this year, and you will still be stuck next year."
        ]
      },
      {
        "heading": "What the game actually carries forward",
        "paragraphs": [
          "Career mode starts with a real team snapshot and then makes you live with the consequences year after year. The mode page already lists the mechanisms, and they are the real clock on a turnaround:",
          "Contracts expire. You will be back in the retain meeting, and the players will be older.",
          "The cap moves. Room you created with a restructure comes back as next year's dead money. Current dead money clears at rollover, and pushed money takes its place. The limit itself moves up in later years.",
          "Players age. Younger players can still improve. Older players can lose a step. A reload that depends on a 33-year-old core is on a short fuse.",
          "New draft classes arrive. They are modeled, and the early picks you earned are how a rebuild becomes a roster instead of a slogan.",
          "A firing can lead to another job instead of ending the file. That is not a completed rebuild. That is a new start, usually on a weaker roster, with a new sheet and a new owner to satisfy.",
          "Those are the gears. A one-year historical pack can feel like a finished story in 16 weeks. Career does not. If you go all in every March, you are reloading, whether you call it that or not.",
          "Historic Turnaround is a different tool. It is a shared, sourced season setup with a win target and the same seed for everyone that day. It can scratch the \"fix this team\" itch in one sitting. It does not answer how long a Career rebuild takes, because it is not a multi-year file. Use it to practice the first move. Use Career to live with the second, third, and fourth."
        ]
      },
      {
        "heading": "Why a real rebuild rarely fits in one offseason",
        "paragraphs": [
          "Even without a published average, the structure of the game tells you why the first year is not enough.",
          "You can only draft one class a year. If the expensive positions are empty, one draft, even a good one, usually fills some of them and leaves others for later. You can only shop one name in a given trade window. You can only use one franchise tag. Dead money you create this year becomes a problem you have to sit with next year. The owner still wants to see progress that matches the brief, and owner confidence can collapse if you lose enough, or if you fight the brief without winning the argument.",
          "A reload can work in one offseason, because you are not asking the roster to change identities. You are asking it to get better at being itself. That is a retain-and-spend year, not a tear-down year.",
          "A rebuild asks the roster to change identities, and identities do not change on a single Tuesday in March. The honest version is: year one you collect the assets and stop making the problem worse, year two you start seeing the young players in your starting lineup, and year three you find out whether the owner still cares. That is a pattern, not a data table. Some files will go faster because you inherited a young quarterback. Some will go sideways because you got fired in year two and had to start again."
        ]
      },
      {
        "heading": "How I make the call in the first owner meeting",
        "paragraphs": [
          "I look at four things, then I say the word out loud, rebuild or reload, before I hire a staff.",
          "Quarterback. If I trust the starter, I am usually reloading. If I do not, I am usually rebuilding, because almost every other spend will be a patch.",
          "The cap and the age of the core. A tight sheet full of older starters is a rebuild, even if last year's record was respectable. A clean sheet with a young core is a reload, even if the record was mediocre.",
          "The brief. If the owner wants a championship push this year, a rebuild is a fight you have to win in the meeting or on the field. If the owner wants youth or cap discipline, a reload can be the thing that gets you fired for spending.",
          "My stomach for losing this year. If I cannot stand a bad record in year one, I should not call it a rebuild. I should reload, or I should pick a better snapshot.",
          "Then I hire a staff that matches the word I said. A development-minded staff on a rebuild is coherent. A win-now staff on a rebuild will keep dragging you back into veteran spending. Hiring a Head Coach and Staff and Owner Goals are the two pages that sit under this one."
        ]
      },
      {
        "heading": "The turnaround takes as long as the owner allows, and as long as the roster needs",
        "paragraphs": [
          "That is the real answer, and it is not a cop-out. The roster needs more than one draft to replace a hollow core. The owner may not give you more than one winter to prove you know what you are doing. If you want a longer runway, embrace a youth or cap brief, do not sneak in win-now spending, and show visible young starters as early as you can. If you are given a win-now brief on a hollow roster, either talk the owner out of it in the meeting, or do not start a three-year project you will not be present to finish.",
          "When I finally have Career results I can stand behind, I will put them on this page, including how often a turnaround survived long enough to matter. Until then, use the distinction, play the file honestly, and do not tell yourself you are building the future if you are still paying for the present at every opportunity."
        ]
      }
    ],
    "relatedSlugs": [
      "career-mode-guide",
      "owner-goals-keep-your-job",
      "2027-draft-order-watch",
      "draft-strategy-bpa-vs-need",
      "free-agency-retain-or-let-walk",
      "historic-turnaround-guide"
    ],
    "legacySection": "guides",
    "published": "2026-11-25"
  }
];
