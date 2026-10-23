export type Pos =
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "OL"
  | "DL"
  | "EDGE"
  | "LB"
  | "CB"
  | "S"
  | "K";

export type Conf = "AFC" | "NFC";

export type GradeColor = "green" | "yellow" | "orange" | "red";

export type Identity = "aggressive" | "balanced" | "conservative";

export type StaffRole = "hc" | "oc" | "dc" | "scout";

export type Phase =
  | "intro"
  | "staff"
  | "cap"
  | "fa"
  | "trade"
  | "draft"
  | "camp"
  | "regular"
  | "playoffs"
  | "recap"
  | "fired";

export type CapMode = "hard" | "payroll";

export type PlayoffRound =
  | "missed"
  | "wildcard"
  | "divisional"
  | "conference"
  | "superbowl"
  | "champion";

export interface Player {
  id: string;
  name: string;
  pos: Pos;
  ovr: number;
  age: number;
  cap: number;
  years: number;
  potential: number;
  real: boolean;
  injured?: boolean;
  origin?: string;
  perceived?: number;
  drafted?: boolean;
}

export interface TeamInfo {
  id: string;
  city: string;
  name: string;
  abbr: string;
  color: string;
  text: string;
  conf: Conf;
  div: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  scheme: string;
  leadership: number;
  development: number;
  aggression: number;
  culture: number;
  cost: 1 | 2 | 3;
  blurb: string;
  legend?: boolean;
}

export interface TeamSeason {
  id: string;
  roster: Player[];
  wins: number;
  losses: number;
  pf: number;
  pa: number;
  lockOff?: number;
  lockDef?: number;
}

export interface ScheduledGame {
  week: number;
  home: string;
  away: string;
}

export interface GameResult {
  week: number;
  round: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
}

export interface Headline {
  outlet: "beat" | "national" | "analytics";
  outletName: string;
  text: string;
  tone: "positive" | "negative" | "neutral";
}

export interface Choice {
  id: string;
  label: string;
  detail: string;
  owner?: number;
  fans?: number;
  locker?: number;
  identity?: Identity;
  log: string;
  tag?: string;
  swing?: number;
}

export interface Decision {
  id: string;
  kicker: string;
  title: string;
  body: string;
  options: Choice[];
}

export interface TradeOffer {
  id: string;
  fromTeamId: string;
  wantId: string;
  wantName: string;
  incoming: Player | null;
  pickRound: number | null;
  pickYear: number | null;
  blurb: string;
  fair: "fleece" | "fair" | "bargain";
}

export interface Prospect {
  id: string;
  name: string;
  pos: Pos;
  age: number;
  college: string;
  trueOvr: number;
  perceived: number;
  blurb: string;
}

export interface DraftPick {
  round: number;
  slot: number;
  overall: number;
  teamId: string;
  prospectId?: string;
  prospectName?: string;
  note?: string;
}

export interface PlayoffState {
  round: "wildcard" | "divisional" | "conference" | "superbowl" | "done";
  seeds: Record<Conf, { teamId: string; seed: number }[]>;
  pending: { id: string; round: string; home: string; away: string }[];
  userAlive: boolean;
  champion: string | null;
  bye: boolean;
}

export interface GradeSummary {
  letter: string;
  score: number;
  round: PlayoffRound;
  champ: boolean;
  wins: number;
  losses: number;
  pf: number;
  pa: number;
  headline: string;
  best: string;
  worst: string;
}

export interface SeasonState {
  version: 1;
  id: string;
  seed: number;
  year: number;
  gmName: string;
  mode: "season" | "career" | "historical";
  historicalId: string | null;
  historicalTitle: string | null;
  teamId: string;
  phase: Phase;
  staffStep: number;
  week: number;
  seasonLength: number;
  identity: Identity;
  meters: { owner: number; fans: number; locker: number };
  owner: { name: string; priority: string; note: string };
  staff: Partial<Record<StaffRole, StaffMember>>;
  market: Record<StaffRole, StaffMember[]>;
  directory: TeamInfo[];
  teams: Record<string, TeamSeason>;
  capLimit: number;
  capMode: CapMode;
  deadMoney: number;
  futureDead: number;
  extraPicks: { round: number; year: number }[];
  restructuredIds?: string[];
  franchiseTagUsed?: boolean;
  faWave: number;
  faBoard: Player[];
  faPool?: Player[];
  walked: string[];
  tradeOffers: TradeOffer[];
  shop: TradeOffer | null;
  shopUsed: boolean;
  prospects: Prospect[];
  draftPicks: DraftPick[];
  draftCursor: number;
  pendingDraftTrade: { offer: string; from: string; slotsBack: number } | null;
  campCutIds: string[];
  schedule: ScheduledGame[];
  results: GameResult[];
  decisions: { week: number; title: string; choice: string; log: string; swing: number }[];
  headlines: Headline[];
  activeDecision: Decision | null;
  ripples: { week: number; decision: Decision }[];
  playoff: PlayoffState | null;
  firedReason: string | null;
  grade: GradeSummary | null;
  log: string[];
  flags: Record<string, string | number | boolean>;
  teamMod: number;
}

export interface SeasonSummary {
  year: number;
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  round: PlayoffRound;
  champ: boolean;
  fired: boolean;
  grade: string;
  gradeScore: number;
  legacy: number;
  headline: string;
}

export interface CareerState {
  id: string;
  gmName: string;
  seed: number;
  legacy: number;
  jobs: number;
  fired: number;
  superBowls: number;
  history: SeasonSummary[];
  season: SeasonState;
  status: "active" | "retired";
  wikipedia: string | null;
  jobOffers: { teamId: string; teamName: string; blurb: string }[];
}

export interface DailyOption {
  id: string;
  label: string;
  detail: string;
  grade: GradeColor;
  score: number;
  popularity: number;
  why: string;
  echo: string;
}

export interface DailyChallenge {
  id: string;
  fictional?: boolean;
  category: "Trade" | "Draft" | "Contract" | "Roster" | "Coach";
  year: number;
  team: string;
  teamName: string;
  title: string;
  situation: string;
  question: string;
  actualOptionId: string;
  whatHappened: string;
  options: DailyOption[];
}

export interface DailyResult {
  date: string;
  puzzle: number;
  challengeId: string;
  optionId: string;
  grade: GradeColor;
  percentile: number;
  echo: string;
}

export interface LeagueEntry {
  name: string;
  kind: "daily" | "season";
  score: number;
  detail: string;
  at: string;
}

export interface League {
  code: string;
  name: string;
  mode: "daily" | "season";
  teamId?: string;
  entries: LeagueEntry[];
}

export interface Profile {
  version: 1;
  name: string;
  pro: boolean;
  email: string;
  settings: { experimentalNarrative: boolean; testerMode?: boolean };
  daily: {
    streak: number;
    bestStreak: number;
    lastPlayed: string | null;
    freezeTokens?: number;
    frozenDates?: string[];
    results: DailyResult[];
  };
  active: "season" | "career" | null;
  season: SeasonState | null;
  career: CareerState | null;
  leagues: League[];
}

export type Action =
  | { type: "intro"; choice: string; text?: string }
  | { type: "hire"; id: string }
  | { type: "cap"; choice: "restructure" | "cut" | "hold"; playerId?: string }
  | { type: "sign"; playerId: string }
  | { type: "tag"; playerId: string }
  | { type: "next-wave" }
  | { type: "trade"; offerId: string; accept: boolean }
  | { type: "shop"; playerId: string }
  | { type: "shop-resolve"; accept: boolean }
  | { type: "trade-done" }
  | { type: "draft"; prospectId: string }
  | { type: "draft-trade"; accept: boolean }
  | { type: "camp-selection"; cutIds: string[] }
  | { type: "camp"; cutIds: string[] }
  | { type: "decide"; choiceId: string }
  | { type: "play-week" }
  | { type: "playoff" }
  | { type: "sim"; until: "playoffs" | "recap" };
