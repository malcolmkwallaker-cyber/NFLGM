import type { HistoricTurnaroundScenario } from "@/lib/engine/historic-turnaround";

export const HISTORIC_TURNAROUNDS: HistoricTurnaroundScenario[] = [
  {
    id: "det-2008", status: "verified", season: 2008, teamId: "DET", title: "Detroit’s winless season",
    setup: "Detroit finished 0–16. Build a credible turnaround from the same daily setup.",
    actualWins: 0, actualLosses: 16, actualGames: 16, actualOutcome: "The real team finished 0–16.", objectiveWins: 6,
    initialStateHash: "original-compact-det-2008-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.nfl.com/standings/league/2008/reg"],
  },
  {
    id: "cle-2017", status: "verified", season: 2017, teamId: "CLE", title: "Cleveland’s winless season",
    setup: "Cleveland finished 0–16. Find six wins in the simulation.",
    actualWins: 0, actualLosses: 16, actualGames: 16, actualOutcome: "The real team finished 0–16.", objectiveWins: 6,
    initialStateHash: "original-compact-cle-2017-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.clevelandbrowns.com/team/history/year-by-year-results"],
  },
  {
    id: "cle-2019", status: "verified", season: 2019, teamId: "CLE", title: "Cleveland’s disappointed contender",
    setup: "Cleveland finished 6–10. Turn the expectations into ten simulated wins.",
    actualWins: 6, actualLosses: 10, actualGames: 16, actualOutcome: "The real team finished 6–10.", objectiveWins: 10,
    initialStateHash: "original-compact-cle-2019-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.clevelandbrowns.com/team/history/year-by-year-results"],
  },
  {
    id: "tb-1976", status: "verified", season: 1976, teamId: "TB", title: "Tampa Bay’s inaugural season",
    setup: "The expansion team finished 0–14. Chase four simulated wins.",
    actualWins: 0, actualLosses: 14, actualGames: 14, actualOutcome: "The real inaugural team finished 0–14.", objectiveWins: 4,
    initialStateHash: "original-compact-tb-1976-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.buccaneers.com/team/history/1976"],
  },
  {
    id: "phi-2011", status: "verified", season: 2011, teamId: "PHI", title: "Philadelphia’s ‘Dream Team’ season",
    setup: "A heavily hyped team finished 8–8 and missed the playoffs. Chase eleven wins.",
    actualWins: 8, actualLosses: 8, actualGames: 16, actualOutcome: "The real team finished 8–8 and missed the playoffs.", objectiveWins: 11,
    initialStateHash: "original-compact-phi-2011-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.nfl.com/standings/league/2011/reg"],
  },
  {
    id: "dal-2010", status: "verified", season: 2010, teamId: "DAL", title: "Dallas falls short",
    setup: "Dallas finished 6–10. Build a ten-win simulation.",
    actualWins: 6, actualLosses: 10, actualGames: 16, actualOutcome: "The real team finished 6–10.", objectiveWins: 10,
    initialStateHash: "original-compact-dal-2010-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.nfl.com/standings/league/2010/reg"],
  },
  {
    id: "den-2022", status: "verified", season: 2022, teamId: "DEN", title: "Denver’s lost season",
    setup: "Denver finished 5–12. Aim for ten simulated wins.",
    actualWins: 5, actualLosses: 12, actualGames: 17, actualOutcome: "The real team finished 5–12.", objectiveWins: 10,
    initialStateHash: "original-compact-den-2022-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.denverbroncos.com/team/standings/2022/"],
  },
  {
    id: "hou-2013", status: "verified", season: 2013, teamId: "HOU", title: "Houston’s fourteen-game slide",
    setup: "Houston opened 2–0, then lost fourteen straight. Chase eight simulated wins.",
    actualWins: 2, actualLosses: 14, actualGames: 16, actualOutcome: "The real team finished 2–14 after opening 2–0.", objectiveWins: 8,
    initialStateHash: "original-compact-hou-2013-v2", verifiedAt: "2026-10-24",
    sources: ["https://www.houstontexans.com/news/andre-johnson-cracks-1-400-yards-for-season-12302459"],
  },
];
