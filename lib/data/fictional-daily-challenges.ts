import type { DailyChallenge, DailyOption } from "@/lib/types";

type Spec = { category: DailyChallenge["category"]; title: string; situation: string };

const SPECS: Spec[] = [
  { category: "Trade", title: "The backup quarterback tax", situation: "Your starter is healthy, but a contender just lost its quarterback. They offer a future second for your capable backup, while your own roster has no experienced third option." },
  { category: "Trade", title: "A star receiver wants out", situation: "A 29-year-old receiver has two expensive years left and has privately requested a trade. One bidder offers a late first; another offers a young guard and a third." },
  { category: "Trade", title: "Buy at 2–5 or sell", situation: "Your point differential is better than your 2–5 record, but the next four opponents are contenders. A veteran edge rusher is available for a third-round pick." },
  { category: "Trade", title: "The deadline rental", situation: "You lead the division and can rent an excellent corner for ten games. The price is a second, and his agent will not discuss an extension before the trade." },
  { category: "Trade", title: "Move the unhappy guard", situation: "Your best guard skipped voluntary work after extension talks stalled. A rebuilding club offers a younger tackle with lower ratings but three cheap years." },
  { category: "Trade", title: "Three picks for your captain", situation: "A rival offers a first and two mid-round picks for your 31-year-old defensive captain. Trading him creates a leadership hole in a playoff locker room." },
  { category: "Trade", title: "The quarterback reset", situation: "Your veteran quarterback is average, expensive, and has a no-trade list. A team on that list offers a conditional second that becomes a first if he starts twelve games." },
  { category: "Trade", title: "A first for a running back", situation: "A contender offers a future first for your elite running back. He is 26, under contract for one more year, and your rookie quarterback depends on play action." },
  { category: "Trade", title: "Trade down from eight", situation: "Two quarterbacks remain at pick eight and three teams are calling. You already have a young starter, but the best defender on your board is also available." },
  { category: "Trade", title: "The medical discount", situation: "A Pro Bowl-caliber tackle failed another club's physical. The acquisition cost is only a fourth, but his contract guarantees next season if he cannot pass your physical in March." },
  { category: "Trade", title: "A pick swap with a rival", situation: "A division rival wants to jump six slots for a receiver. They offer next year's first, but the player they want would immediately attack your weakest position group." },
  { category: "Trade", title: "Cash for cap relief", situation: "Another club will take your declining veteran and his salary if you attach a fourth. Keeping him preserves depth but blocks two younger players." },
  { category: "Trade", title: "The surprise quarterback offer", situation: "Your second-year quarterback improved late in the season. A desperate team offers two firsts, and the upcoming draft has one prospect your scouts grade slightly higher." },
  { category: "Trade", title: "Deadline help at center", situation: "Your starting center is out six weeks. A reliable replacement costs a fifth, while the practice-squad option knows the calls but is a clear downgrade." },

  { category: "Draft", title: "Need versus the clean board", situation: "You pick twelfth. The top player is a safety, while your roster badly needs an offensive tackle graded seven spots lower." },
  { category: "Draft", title: "The raw quarterback swing", situation: "A quarterback with rare tools and only one college season is available late in round one. Your current starter is competent and entering a contract year." },
  { category: "Draft", title: "Medical red flag at pick 20", situation: "The best receiver in the class is sliding because of a recurring foot injury. Your doctors assign a significant chance he misses time every season." },
  { category: "Draft", title: "Two corners, two timelines", situation: "One corner is polished with an average ceiling. The other is younger, faster, and technically raw. Your defense needs a starter in September." },
  { category: "Draft", title: "The fifth-year option premium", situation: "You can trade from pick 35 to pick 31 for a fourth-rounder. The target is a pass rusher, and the move adds a fifth-year contract option." },
  { category: "Draft", title: "A falling captain", situation: "A highly productive linebacker is sliding over poor testing numbers. Coaches love his communication; scouts question whether he can stay on the field on passing downs." },
  { category: "Draft", title: "Double down at receiver", situation: "You drafted a receiver in round one last year and he struggled. This year's best value at your pick is another receiver, while the defensive line is thin." },
  { category: "Draft", title: "The small-school tackle", situation: "A dominant small-school tackle has ideal measurements but has never faced an NFL-caliber rusher. A safer interior lineman carries a lower ceiling." },
  { category: "Draft", title: "Quarterback insurance on day two", situation: "Your starter is 37 and your backup is a one-year veteran. A developmental quarterback is the top player on your round-three board." },
  { category: "Draft", title: "Trade next year's first", situation: "A top-five prospect unexpectedly reaches pick 18. Moving up costs your second this year and next year's first, with no protection on that pick." },
  { category: "Draft", title: "The specialist question", situation: "Your kicker missed two playoff kicks. The best kicker prospect in years is available in round four, alongside several useful depth players." },
  { category: "Draft", title: "One elite trait", situation: "A pass rusher has the fastest first step in the class but little counter technique. A more complete player is older and has less burst." },
  { category: "Draft", title: "Draft the injured value", situation: "A first-round talent tore a knee ligament during training and may miss his rookie season. He is available at the start of round three." },
  { category: "Draft", title: "The late-round roster squeeze", situation: "Your roster is unusually deep. Late-round picks may not make the team, and another club offers next year's picks to acquire your remaining selections." },

  { category: "Contract", title: "Pay the ascending quarterback", situation: "Your quarterback has one excellent season and one average season. Extending now is cheaper than waiting, but the guarantee would survive a regression." },
  { category: "Contract", title: "The running back extension", situation: "A popular running back wants four new years before his age-28 season. He has heavy usage and remains central to the offense." },
  { category: "Contract", title: "Guarantees or annual value", situation: "A top corner will accept either a higher annual salary with modest guarantees or a lower salary with three fully guaranteed seasons." },
  { category: "Contract", title: "The hometown discount", situation: "A veteran captain offers a small discount for a three-year deal. Your projection shows meaningful decline beginning in year two." },
  { category: "Contract", title: "Extend before the breakout", situation: "A young edge rusher has strong pressure numbers but few sacks. His agent wants starter money before the box score catches up." },
  { category: "Contract", title: "The franchise-tag bridge", situation: "Your star receiver and the club are far apart on guarantees. The tag fits this year but would consume most remaining flexibility." },
  { category: "Contract", title: "Two guards, one budget", situation: "Both starting guards are free agents. One is elite and expensive; the other is solid, younger, and willing to sign early." },
  { category: "Contract", title: "Restructure the veteran core", situation: "Converting salary to bonus creates enough room for two additions. It also pushes significant charges into seasons when the core will be older." },
  { category: "Contract", title: "Incentives after injury", situation: "A productive tight end is returning from major surgery. His agent wants starter value, while your doctors expect a gradual return." },
  { category: "Contract", title: "The holdout line", situation: "A star with two contract years remaining threatens to miss camp. Reworking the deal rewards performance but may invite similar demands." },
  { category: "Contract", title: "Option decision on a late bloomer", situation: "A former first-round defender finally played well in year four. His fifth-year option is expensive and guaranteed for injury." },
  { category: "Contract", title: "Pay a premium backup", situation: "Your backup quarterback won two important games. Keeping him costs quality-starter money at another position." },
  { category: "Contract", title: "Front-load the rebuild", situation: "You have abundant space now and expect several young extensions in two years. A free agent accepts a front-loaded structure with an early exit." },
  { category: "Contract", title: "The no-trade clause", situation: "A premier free agent accepts your salary only if the deal includes a full no-trade clause through age 32." },

  { category: "Roster", title: "Keep three quarterbacks", situation: "Your rookie backup flashed in preseason, while an experienced third quarterback is the only one who knows the full protection system." },
  { category: "Roster", title: "The final receiver spot", situation: "A reliable veteran offers special-teams value. A raw rookie is already the faster route runner but contributes nowhere else." },
  { category: "Roster", title: "Return from injured reserve", situation: "A starter can return at less than full speed this week. Activating him requires releasing a useful reserve who may be claimed." },
  { category: "Roster", title: "Move the tackle inside", situation: "Your left tackle is struggling with speed but may become an excellent guard. The backup tackle is unproven and athletic." },
  { category: "Roster", title: "Youth movement at linebacker", situation: "A rookie is making mistakes but creating impact plays. The veteran ahead of him is assignment-sound and nearing the end of his deal." },
  { category: "Roster", title: "The declining returner", situation: "Your return specialist remains dangerous but no longer contributes on offense. Keeping him requires cutting a core special-teams blocker." },
  { category: "Roster", title: "Carry the injured star", situation: "A star may return for the playoffs, but the roster spot prevents you from signing immediate help during a close division race." },
  { category: "Roster", title: "Change the defensive front", situation: "Your personnel fits an even front, while the new coordinator's scheme needs larger linemen and stand-up rushers." },
  { category: "Roster", title: "The waiver claim", situation: "A talented former second-round pick is available on waivers after repeated lateness. Claiming him displaces a dependable developmental player." },
  { category: "Roster", title: "Rest the veterans", situation: "You have clinched a playoff seed with two games left. Several starters are managing minor injuries, but the offense has been uneven." },
  { category: "Roster", title: "The emergency kicker", situation: "Your kicker is questionable on game day. The available replacement is less accurate but fully healthy; carrying both costs a defensive reserve." },
  { category: "Roster", title: "Promote the practice-squad corner", situation: "A young corner is drawing interest from another club. Promoting him protects the player but forces a cut before an important game." },
  { category: "Roster", title: "A captain loses his job", situation: "Film says a younger safety has earned the starting role. The incumbent is a respected captain who organizes the entire secondary." },

  { category: "Coach", title: "Keep the coordinator after a collapse", situation: "The offense ranked highly all year, then failed badly in the playoffs. Players support the coordinator, but his game plan became predictable." },
  { category: "Coach", title: "The coach wants personnel control", situation: "A successful head coach asks for final say on the 53-player roster. Your owner wants to keep him and expects an answer today." },
  { category: "Coach", title: "Hire the brilliant introvert", situation: "The strongest schematic candidate struggles in interviews and has never managed a large staff. The alternative is a proven leader with average schemes." },
  { category: "Coach", title: "Change coordinators in a title window", situation: "Your defense has plateaued around league average. A respected innovator is available, but installing his system requires changing several starters." },
  { category: "Coach", title: "The interim coach surge", situation: "An interim coach finished 5–2 and has strong player support. The schedule was favorable, and your search has identified a more experienced candidate." },
  { category: "Coach", title: "Quarterback coach promotion", situation: "Your young quarterback credits his position coach for a breakout. Another team wants to hire that coach as coordinator." },
  { category: "Coach", title: "The culture reset", situation: "The team is talented but leads the league in avoidable penalties. Your head coach wins games and dismisses concerns about discipline." },
  { category: "Coach", title: "Analytics on fourth down", situation: "The owner wants more aggressive fourth-down decisions. The head coach agrees publicly but repeatedly chooses conservative options in close games." },
  { category: "Coach", title: "A veteran staff for a young roster", situation: "Your roster is the league's youngest. The finalist has decades of experience but a weak recent development record." },
  { category: "Coach", title: "Retain the strength staff", situation: "A new head coach wants his own performance staff. The existing group has strong player trust and an excellent availability record." },
  { category: "Coach", title: "The play-calling head coach", situation: "Your head coach wants to take over offensive play calling after firing the coordinator. His broader game-management duties already consume significant time." },
  { category: "Coach", title: "Succession plan on defense", situation: "Your veteran coordinator may retire after the season. A promising assistant can be promoted now, but the change could disrupt a top unit." },
  { category: "Coach", title: "Public criticism of a rookie", situation: "A position coach publicly blamed a rookie for a late loss. The criticism was technically accurate and damaged trust in the room." },
];

const OPTION_SETS: Record<DailyChallenge["category"], DailyOption[][]> = {
  Trade: [
    [
      { id: "best", label: "Set a walk-away price and take the best complete offer", detail: "Value the player, contract, timing, and replacement plan together.", grade: "green", score: 92, popularity: 0.3, why: "A disciplined threshold protects both leverage and the roster plan.", echo: "A process-driven GM" },
      { id: "patient", label: "Keep negotiating without forcing a deadline deal", detail: "Preserve optionality if the return does not clear your line.", grade: "yellow", score: 76, popularity: 0.28, why: "Patience is defensible, though it may leave value unrealized.", echo: "A patient negotiator" },
      { id: "name", label: "Choose the offer with the biggest name", detail: "Prioritize immediate recognition over contract and draft value.", grade: "orange", score: 44, popularity: 0.24, why: "Names can hide poor age, cost, and control.", echo: "A headline buyer" },
      { id: "panic", label: "Accept the first offer before the market changes", detail: "Remove uncertainty even if the return is light.", grade: "red", score: 20, popularity: 0.18, why: "Urgency without a floor gives the other club your leverage.", echo: "A rushed seller" },
    ],
  ],
  Draft: [
    [
      { id: "best", label: "Follow the board with a role and development plan", detail: "Take the strongest projection you can actually develop and use.", grade: "green", score: 92, popularity: 0.32, why: "Talent, role, and coaching plan belong in the same decision.", echo: "A prepared draft room" },
      { id: "trade", label: "Explore a small trade before choosing", detail: "Move only if the value survives the extra uncertainty.", grade: "yellow", score: 74, popularity: 0.24, why: "A measured trade can work without abandoning the board.", echo: "A value trader" },
      { id: "need", label: "Draft the biggest immediate need regardless of grade", detail: "Fill September's hole even if the player projects lower.", grade: "orange", score: 46, popularity: 0.3, why: "Need changes quickly; a weak evaluation lasts for years.", echo: "A need-only drafter" },
      { id: "buzz", label: "Take the loudest name in the room", detail: "Let consensus and attention settle the debate.", grade: "red", score: 22, popularity: 0.14, why: "External buzz is not a development plan.", echo: "A consensus chaser" },
    ],
  ],
  Contract: [
    [
      { id: "best", label: "Price the downside and keep a practical exit", detail: "Align guarantees with the years you can project confidently.", grade: "green", score: 93, popularity: 0.3, why: "Structure matters as much as the headline average.", echo: "A disciplined cap manager" },
      { id: "bridge", label: "Offer a shorter bridge at a higher annual salary", detail: "Pay for certainty without owning the decline years.", grade: "yellow", score: 75, popularity: 0.25, why: "A bridge costs more now but contains long-term risk.", echo: "A bridge builder" },
      { id: "market", label: "Match the richest comparable contract", detail: "Let the market set every major term.", grade: "orange", score: 45, popularity: 0.29, why: "Comparable players rarely carry identical risk.", echo: "A market follower" },
      { id: "guarantee", label: "Guarantee the full deal to close it today", detail: "Eliminate negotiation risk by accepting all player risk.", grade: "red", score: 19, popularity: 0.16, why: "Speed is not worth surrendering every exit.", echo: "An impatient negotiator" },
    ],
  ],
  Roster: [
    [
      { id: "best", label: "Choose the role fit and document the contingency", detail: "Make the move that helps game day without ignoring the next injury.", grade: "green", score: 91, popularity: 0.31, why: "Depth decisions work when role and contingency are explicit.", echo: "A complete-roster GM" },
      { id: "develop", label: "Favor the younger player and accept early mistakes", detail: "Trade short-term certainty for a higher future ceiling.", grade: "yellow", score: 73, popularity: 0.27, why: "Development is reasonable when the team can absorb the learning curve.", echo: "A development-first GM" },
      { id: "veteran", label: "Keep the veteran because the room knows him", detail: "Prioritize familiarity over current role value.", grade: "orange", score: 43, popularity: 0.28, why: "Familiarity helps, but it cannot be the entire depth chart.", echo: "A continuity loyalist" },
      { id: "ceiling", label: "Keep only the highest theoretical ceiling", detail: "Ignore special teams, availability, and weekly assignments.", grade: "red", score: 21, popularity: 0.14, why: "A roster is a set of jobs, not a prospect ranking.", echo: "A traits collector" },
    ],
  ],
  Coach: [
    [
      { id: "best", label: "Set measurable expectations and preserve clear authority", detail: "Match the coach's role to evidence, staff plan, and accountability.", grade: "green", score: 92, popularity: 0.31, why: "Clear authority and measurable standards reduce personality-driven decisions.", echo: "A deliberate team builder" },
      { id: "trial", label: "Use a defined trial period with checkpoints", detail: "Keep flexibility while testing whether the plan works.", grade: "yellow", score: 76, popularity: 0.29, why: "A real checkpoint is better than indefinite patience.", echo: "A measured evaluator" },
      { id: "players", label: "Let a player vote settle the decision", detail: "Treat current approval as the strongest evidence.", grade: "orange", score: 42, popularity: 0.24, why: "Player trust matters, but popularity is not a complete staff evaluation.", echo: "A locker-room pollster" },
      { id: "owner", label: "Choose the option that ends the owner's questions", detail: "Optimize for today's meeting instead of the football plan.", grade: "red", score: 18, popularity: 0.16, why: "Short-term political relief creates long-term organizational confusion.", echo: "A political survivor" },
    ],
  ],
};

const CATEGORY_ORDER: DailyChallenge["category"][] = ["Trade", "Draft", "Contract", "Roster", "Coach"];
const MAX_CATEGORY_COUNT = Math.max(...CATEGORY_ORDER.map((category) => SPECS.filter((spec) => spec.category === category).length));
const ORDERED_SPECS = Array.from({ length: MAX_CATEGORY_COUNT }, (_, index) =>
  CATEGORY_ORDER.map((category) => SPECS.filter((spec) => spec.category === category)[index]).filter((spec): spec is Spec => Boolean(spec)),
).flat();

export const FICTIONAL_DAILY_CHALLENGES: DailyChallenge[] = ORDERED_SPECS.map((spec, index) => ({
  id: `fictional-${String(index + 1).padStart(3, "0")}`,
  fictional: true,
  category: spec.category,
  year: 0,
  team: "SIM",
  teamName: "Fictional franchise",
  title: spec.title,
  situation: `${spec.situation} This is an original fictional scenario; no real team, player, or historical outcome is implied.`,
  question: `What is your call on “${spec.title}”?`,
  actualOptionId: "best",
  whatHappened: "There is no real-world result to imitate. The grade rewards a repeatable process: price the downside, preserve useful options, and connect the move to a specific roster plan.",
  options: OPTION_SETS[spec.category][0].map((option) => ({ ...option })),
}));
