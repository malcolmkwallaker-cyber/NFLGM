import type { Player, Pos } from "@/lib/types";

type PlayerSpec = readonly [id: string, name: string, pos: Pos, overall: number, age: number];

export type HistoricalRosterDefinition = {
  scenarioId: string;
  season: number;
  teamId: string;
  convention: string;
  sourceRosterCount: number;
  asOfDate?: string;
  sources: string[];
  roster: Player[];
};

function roster(scenarioId: string, specs: readonly PlayerSpec[]): Player[] {
  return specs.map(([id, name, pos, overall, age], index) => ({
    id: `${scenarioId}-${id}`,
    name,
    pos,
    ovr: overall,
    age,
    cap: Math.round(Math.max(0.5, (overall - 56) * 0.34) * 10) / 10,
    years: 1 + (index % 3),
    potential: Math.min(99, overall + (age <= 25 ? 4 : age <= 28 ? 2 : 0)),
    real: true,
    injured: false,
  }));
}

const DEFINITIONS: HistoricalRosterDefinition[] = [
  {
    scenarioId: "det-2008",
    season: 2008,
    teamId: "DET",
    convention: "Compact full-season membership selection, not a single game-day roster. Later signings and opening-week players may both appear; positions are consolidated.",
    sourceRosterCount: 52,
    asOfDate: "2008-09-07",
    sources: [
      "https://static.www.nfl.com/image/upload/v1677631582/gamecenter/10012008-0907-00f6-6053-a79c503a1434.pdf",
      "https://www.nfl.com/sitemap/html/rosters/2008/detroit-lions",
      "https://www.detroitlions.com/team/stats/2008/",
    ],
    roster: roster("det08", [
      ["kitna", "Jon Kitna", "QB", 70, 36], ["orlovsky", "Dan Orlovsky", "QB", 67, 25], ["culpepper", "Daunte Culpepper", "QB", 69, 31],
      ["ksmith", "Kevin Smith", "RB", 78, 22], ["rjohnson", "Rudi Johnson", "RB", 71, 29],
      ["cjohnson", "Calvin Johnson", "WR", 92, 23], ["mcdonald", "Shaun McDonald", "WR", 74, 27],
      ["fitzsimmons", "Casey FitzSimmons", "TE", 69, 28], ["backus", "Jeff Backus", "OL", 78, 31],
      ["raiola", "Dominic Raiola", "OL", 79, 30], ["cherilus", "Gosder Cherilus", "OL", 72, 24],
      ["peterman", "Stephen Peterman", "OL", 71, 26], ["avril", "Cliff Avril", "EDGE", 80, 22],
      ["redding", "Cory Redding", "DL", 78, 28], ["scody", "Shaun Cody", "DL", 70, 25],
      ["dwhite", "Dewayne White", "EDGE", 76, 29], ["esims", "Ernie Sims", "LB", 80, 24],
      ["plenon", "Paris Lenon", "LB", 72, 31], ["bodden", "Leigh Bodden", "CB", 78, 27],
      ["buchanon", "Phillip Buchanon", "CB", 75, 28], ["galexander", "Gerald Alexander", "S", 70, 24],
      ["bullocks", "Daniel Bullocks", "S", 69, 25], ["hanson", "Jason Hanson", "K", 88, 38],
    ]),
  },
  {
    scenarioId: "cle-2017",
    season: 2017,
    teamId: "CLE",
    convention: "Compact full-season membership selection anchored to the Week 1 gamebook; later season contributors may appear. Positions are consolidated.",
    sourceRosterCount: 53,
    asOfDate: "2017-09-10",
    sources: [
      "https://static.www.nfl.com/image/upload/v1677629443/gamecenter/10012017-0910-032e-4814-f966ce3e4aae.pdf",
      "https://www.clevelandbrowns.com/news/cleveland-browns-reduce-roster-to-53-19306393",
      "https://www.nfl.com/sitemap/html/rosters/2017/cleveland-browns",
    ],
    roster: roster("cle17", [
      ["kizer", "DeShone Kizer", "QB", 66, 21], ["kessler", "Cody Kessler", "QB", 67, 24],
      ["crowell", "Isaiah Crowell", "RB", 76, 24], ["djohnson", "Duke Johnson Jr.", "RB", 80, 24],
      ["gordon", "Josh Gordon", "WR", 82, 26], ["coleman", "Corey Coleman", "WR", 73, 23],
      ["higgins", "Rashard Higgins", "WR", 72, 23], ["njoku", "David Njoku", "TE", 74, 21],
      ["jthomas", "Joe Thomas", "OL", 94, 33], ["bitonio", "Joel Bitonio", "OL", 87, 26],
      ["tretter", "JC Tretter", "OL", 82, 26], ["zeitler", "Kevin Zeitler", "OL", 86, 27],
      ["garrett", "Myles Garrett", "EDGE", 85, 22], ["ogbah", "Emmanuel Ogbah", "EDGE", 78, 24],
      ["ogunjobi", "Larry Ogunjobi", "DL", 75, 23], ["shelton", "Danny Shelton", "DL", 76, 24],
      ["kirksey", "Christian Kirksey", "LB", 82, 25], ["schobert", "Joe Schobert", "LB", 81, 24],
      ["mccourty", "Jason McCourty", "CB", 82, 30], ["boddy", "Briean Boddy-Calhoun", "CB", 75, 24],
      ["peppers", "Jabrill Peppers", "S", 77, 22], ["kindred", "Derrick Kindred", "S", 72, 24],
      ["gonzalez", "Zane Gonzalez", "K", 68, 22],
    ]),
  },
  {
    scenarioId: "cle-2019",
    season: 2019,
    teamId: "CLE",
    convention: "Compact full-season membership selection anchored to the Week 1 gamebook; not limited to the Week 1 active list. Positions are consolidated.",
    sourceRosterCount: 53,
    asOfDate: "2019-09-08",
    sources: ["https://static.clubs.nfl.com/image/upload/titans/qeisyty9oanldhldgjfg.pdf", "https://www.nfl.com/sitemap/html/rosters/2019/cleveland-browns"],
    roster: roster("cle19", [
      ["mayfield", "Baker Mayfield", "QB", 76, 24], ["gilbert", "Garrett Gilbert", "QB", 66, 28],
      ["chubb", "Nick Chubb", "RB", 92, 24], ["hunt", "Kareem Hunt", "RB", 84, 24],
      ["landry", "Jarvis Landry", "WR", 88, 27], ["beckham", "Odell Beckham Jr.", "WR", 87, 27],
      ["higgins", "Rashard Higgins", "WR", 73, 25], ["njoku", "David Njoku", "TE", 76, 23],
      ["bitonio", "Joel Bitonio", "OL", 91, 28], ["tretter", "JC Tretter", "OL", 86, 28],
      ["teller", "Wyatt Teller", "OL", 78, 25], ["robinson", "Greg Robinson", "OL", 72, 27],
      ["garrett", "Myles Garrett", "EDGE", 91, 24], ["vernon", "Olivier Vernon", "EDGE", 82, 29],
      ["ogunjobi", "Larry Ogunjobi", "DL", 78, 25], ["richardson", "Sheldon Richardson", "DL", 84, 29],
      ["schobert", "Joe Schobert", "LB", 86, 26], ["mwilson", "Mack Wilson", "LB", 75, 21],
      ["ward", "Denzel Ward", "CB", 86, 22], ["gwilliams", "Greedy Williams", "CB", 76, 22],
      ["randall", "Damarious Randall", "S", 79, 27], ["burnett", "Morgan Burnett", "S", 76, 30],
      ["seibert", "Austin Seibert", "K", 75, 23],
    ]),
  },
  {
    scenarioId: "tb-1976",
    season: 1976,
    teamId: "TB",
    convention: "Compact full-season membership selection from the team all-time register; not an opening-day or game-day roster. Positions are consolidated.",
    sourceRosterCount: 68,
    sources: [
      "https://static.www.nfl.com/image/upload/league/apps/league-site/media-guides/2025/TB.pdf",
      "https://www.buccaneers.com/team/history/1976",
    ],
    roster: roster("tb76", [
      ["spurrier", "Steve Spurrier", "QB", 68, 31], ["dickinson", "Parnell Dickinson", "QB", 63, 27],
      ["lcarter", "Louis Carter", "RB", 72, 23], ["dubose", "Jimmy DuBose", "RB", 67, 22],
      ["e-johnson", "Essex Johnson", "RB", 66, 30], ["owens", "Morris Owens", "WR", 73, 23],
      ["hagins", "Isaac Hagins", "WR", 67, 22], ["bmoore", "Bob Moore", "TE", 68, 27],
      ["reavis", "Dave Reavis", "OL", 70, 26], ["current", "Mike Current", "OL", 70, 31],
      ["fest", "Howard Fest", "OL", 68, 30], ["ryczek", "Dan Ryczek", "OL", 66, 27],
      ["lrselmon", "Lee Roy Selmon", "EDGE", 84, 22], ["pear", "Dave Pear", "DL", 76, 23],
      ["rudolph", "Council Rudolph", "EDGE", 73, 26], ["toomay", "Pat Toomay", "DL", 72, 28],
      ["rwood", "Richard Wood", "LB", 78, 23], ["dselmon", "Dewey Selmon", "LB", 73, 23],
      ["mWashington", "Mike Washington", "CB", 72, 23], ["cotney", "Mark Cotney", "S", 75, 24],
      ["kstone", "Ken Stone", "S", 70, 26], ["dgreen", "Dave Green", "K", 69, 27],
    ]),
  },
  {
    scenarioId: "phi-2011",
    season: 2011,
    teamId: "PHI",
    convention: "Compact full-season membership selection anchored to the Week 1 gamebook; positions are consolidated.",
    sourceRosterCount: 53,
    asOfDate: "2011-09-11",
    sources: [
      "https://static.www.nfl.com/image/upload/v1677630553/gamecenter/10012011-0911-07b7-7c0f-2bbf3bdc6fa4.pdf",
      "https://www.philadelphiaeagles.com/news/position-by-position-look-at-roster-5668622",
      "https://media.eagles.1rmg.com/wp-content/uploads/2020/03/30222118/2011-personnel-moves.pdf",
    ],
    roster: roster("phi11", [
      ["vick", "Michael Vick", "QB", 87, 31], ["vyoung", "Vince Young", "QB", 70, 28],
      ["mccoy", "LeSean McCoy", "RB", 95, 23], ["rbrown", "Ronnie Brown", "RB", 72, 30],
      ["djackson", "DeSean Jackson", "WR", 88, 25], ["maclin", "Jeremy Maclin", "WR", 86, 23],
      ["avant", "Jason Avant", "WR", 76, 28], ["celek", "Brent Celek", "TE", 82, 26],
      ["jpeters", "Jason Peters", "OL", 95, 29], ["mathis", "Evan Mathis", "OL", 90, 30],
      ["kelce", "Jason Kelce", "OL", 82, 24], ["herremans", "Todd Herremans", "OL", 86, 29],
      ["tcole", "Trent Cole", "EDGE", 92, 29], ["babin", "Jason Babin", "EDGE", 91, 31],
      ["cjenkins", "Cullen Jenkins", "DL", 84, 30], ["patterson", "Mike Patterson", "DL", 78, 28],
      ["chaney", "Jamar Chaney", "LB", 75, 25], ["asomugha", "Nnamdi Asomugha", "CB", 86, 30],
      ["asamuel", "Asante Samuel", "CB", 88, 30], ["drc", "Dominique Rodgers-Cromartie", "CB", 84, 25],
      ["nallen", "Nate Allen", "S", 78, 24], ["kcoleman", "Kurt Coleman", "S", 74, 23],
      ["henery", "Alex Henery", "K", 82, 24],
    ]),
  },
  {
    scenarioId: "dal-2010",
    season: 2010,
    teamId: "DAL",
    convention: "Compact full-season membership selection anchored to the Week 1 gamebook; injured season originals may remain. Positions are consolidated.",
    sourceRosterCount: 53,
    asOfDate: "2010-09-12",
    sources: [
      "https://static.www.nfl.com/image/upload/v1677630465/gamecenter/10012010-0912-1243-05d7-280353eae7ce.pdf",
      "https://www.dallascowboys.com/team/stats/2010/reg",
    ],
    roster: roster("dal10", [
      ["romo", "Tony Romo", "QB", 88, 30], ["kitna", "Jon Kitna", "QB", 77, 38],
      ["fjones", "Felix Jones", "RB", 82, 23], ["barber", "Marion Barber", "RB", 78, 27],
      ["austin", "Miles Austin", "WR", 89, 26], ["dbryant", "Dez Bryant", "WR", 84, 22],
      ["rwilliams", "Roy Williams", "WR", 77, 29], ["witten", "Jason Witten", "TE", 94, 28],
      ["free", "Doug Free", "OL", 84, 26], ["gurode", "Andre Gurode", "OL", 88, 32],
      ["ldavis", "Leonard Davis", "OL", 84, 32], ["kosier", "Kyle Kosier", "OL", 80, 32],
      ["ware", "DeMarcus Ware", "EDGE", 97, 28], ["spencer", "Anthony Spencer", "EDGE", 84, 26],
      ["ratliff", "Jay Ratliff", "DL", 90, 29], ["spears", "Marcus Spears", "DL", 78, 27],
      ["brooking", "Keith Brooking", "LB", 79, 35], ["bradiejames", "Bradie James", "LB", 80, 29],
      ["newman", "Terence Newman", "CB", 84, 32], ["mjenkins", "Mike Jenkins", "CB", 82, 25],
      ["sensabaugh", "Gerald Sensabaugh", "S", 80, 27], ["aball", "Alan Ball", "S", 70, 25],
      ["buehler", "David Buehler", "K", 73, 23],
    ]),
  },
  {
    scenarioId: "den-2022",
    season: 2022,
    teamId: "DEN",
    convention: "Compact full-season membership selection anchored to the Week 1 gamebook; later contributors may appear. Positions are consolidated.",
    sourceRosterCount: 53,
    asOfDate: "2022-09-12",
    sources: [
      "https://static.www.nfl.com/image/upload/v1677628107/gamecenter/7ae80c21-d24c-11ec-b23d-d15a91047884.pdf",
      "https://www.denverbroncos.com/news/breaking-down-the-broncos-initial-2022-53-man-roster",
      "https://www.nfl.com/sitemap/html/rosters/2022/denver-broncos",
    ],
    roster: roster("den22", [
      ["rwilson", "Russell Wilson", "QB", 77, 34], ["rypien", "Brett Rypien", "QB", 66, 26],
      ["lmurray", "Latavius Murray", "RB", 76, 32], ["jwilliams", "Javonte Williams", "RB", 80, 22],
      ["sutton", "Courtland Sutton", "WR", 84, 27], ["jeudy", "Jerry Jeudy", "WR", 83, 23],
      ["dulcich", "Greg Dulcich", "TE", 76, 22], ["bolles", "Garett Bolles", "OL", 83, 30],
      ["risner", "Dalton Risner", "OL", 78, 27], ["glasgow", "Graham Glasgow", "OL", 79, 30],
      ["meinerz", "Quinn Meinerz", "OL", 84, 24], ["djones", "D.J. Jones", "DL", 83, 27],
      ["dremont", "Dre'Mont Jones", "DL", 82, 25], ["browning", "Baron Browning", "EDGE", 79, 23],
      ["cooper", "Jonathon Cooper", "EDGE", 74, 24], ["jewell", "Josey Jewell", "LB", 82, 28],
      ["singleton", "Alex Singleton", "LB", 83, 29], ["surtain", "Pat Surtain II", "CB", 94, 22],
      ["mathis", "Damarri Mathis", "CB", 73, 23], ["simmons", "Justin Simmons", "S", 91, 29],
      ["kjackson", "Kareem Jackson", "S", 79, 34], ["mcmanus", "Brandon McManus", "K", 82, 31],
    ]),
  },
  {
    scenarioId: "hou-2013",
    season: 2013,
    teamId: "HOU",
    convention: "Compact full-season membership selection anchored to the Week 1 gamebook; suspended or reserve season originals may remain. Positions are consolidated.",
    sourceRosterCount: 53,
    asOfDate: "2013-09-09",
    sources: [
      "https://static.www.nfl.com/image/upload/v1677630726/gamecenter/10012013-0909-01cd-ac55-0765694a06c9.pdf",
      "https://www.houstontexans.com/team/stats/2013/reg%26lang%3Den",
    ],
    roster: roster("hou13", [
      ["schaub", "Matt Schaub", "QB", 72, 32], ["keenum", "Case Keenum", "QB", 70, 25],
      ["foster", "Arian Foster", "RB", 86, 27], ["btate", "Ben Tate", "RB", 80, 25],
      ["ajohnson", "Andre Johnson", "WR", 93, 32], ["hopkins", "DeAndre Hopkins", "WR", 82, 21],
      ["odaniels", "Owen Daniels", "TE", 82, 31], ["dbrown", "Duane Brown", "OL", 92, 28],
      ["bbrooks", "Brandon Brooks", "OL", 82, 24], ["myers", "Chris Myers", "OL", 86, 32],
      ["wsmith", "Wade Smith", "OL", 78, 32], ["jwatt", "J.J. Watt", "EDGE", 98, 24],
      ["asmith", "Antonio Smith", "DL", 84, 32], ["mercilus", "Whitney Mercilus", "EDGE", 82, 23],
      ["breed", "Brooks Reed", "LB", 78, 26], ["cushing", "Brian Cushing", "LB", 84, 26],
      ["sharpton", "Darryl Sharpton", "LB", 79, 25], ["jjoseph", "Johnathan Joseph", "CB", 88, 29],
      ["kjackson", "Kareem Jackson", "CB", 82, 25], ["dmanning", "Danieal Manning", "S", 80, 31],
      ["ereed", "Ed Reed", "S", 79, 35], ["bullock", "Randy Bullock", "K", 73, 24],
    ]),
  },
];

export const HISTORICAL_TURNAROUND_ROSTERS = DEFINITIONS;

export const CLASSIC_HISTORICAL_ROSTER_PROVENANCE: Record<string, { convention: string; sources: string[] }> = {
  "1985-bears": {
    convention: "Compact selection from the team-published complete 1985 season roster; not asserted as an opening-day roster. Positions are consolidated.",
    sources: ["https://www.chicagobears.com/news/1985-chicago-bears-roster-16745357", "https://www.nfl.com/sitemap/html/rosters/1985/chicago-bears"],
  },
  "1989-niners": {
    convention: "Compact full-season selection anchored to the Super Bowl XXIV game roster; not a complete opening-day roster. Positions are consolidated.",
    sources: ["https://media.denverbroncos.com/wp-content/uploads/2020/07/06_postseason.pdf", "https://www.nfl.com/sitemap/html/rosters/1989/san-francisco-49ers"],
  },
  "1993-cowboys": {
    convention: "Compact full-season selection anchored to the Super Bowl XXVIII roster; not a complete opening-day roster. Positions are consolidated.",
    sources: ["https://www.nflgsis.com/1993/Post/04/16750/Gamebook.pdf", "https://www.nfl.com/sitemap/html/rosters/1993/dallas-cowboys"],
  },
  "1999-rams": {
    convention: "Compact full-season selection anchored to the Super Bowl XXXIV roster; injured season originals may remain. Positions are consolidated.",
    sources: ["https://www.nflgsis.com/1999/Post/04/919/Gamebook.pdf", "https://www.nfl.com/sitemap/html/rosters/1999/st.-louis-rams"],
  },
  "2007-patriots": {
    convention: "Compact full-season selection, not the Super Bowl active-list snapshot. Positions are consolidated.",
    sources: ["https://patriots.1rmg.com/season/2007/", "https://media.patriots.1rmg.com/wp-content/uploads/2019/05/16223017/02-03-08_Super-Bowl-42_XLII_vs_Giants_Flip_Card.pdf"],
  },
  "2013-seahawks": {
    convention: "Compact full-season selection; not limited to the Super Bowl active-list snapshot. Positions are consolidated.",
    sources: ["https://nflgsis.com/2013/Post/04/56169/Gamebook.pdf", "https://www.nfl.com/sitemap/html/rosters/2013/seattle-seahawks"],
  },
};

export function historicalTurnaroundRoster(scenarioId: string): HistoricalRosterDefinition | undefined {
  return DEFINITIONS.find((definition) => definition.scenarioId === scenarioId);
}
