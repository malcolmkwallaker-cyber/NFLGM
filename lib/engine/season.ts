import rosterFile from "@/lib/data/rosters.json";
import { TEAMS, teamById, teamLabel } from "@/lib/data/teams";
import { historicalById } from "@/lib/data/historical";
import { staffMarket } from "@/lib/data/staff";
import { capHealth, capSpace, committedPayroll, marketAsk, offerYears, payroll, salaryScale } from "@/lib/engine/cap";
import { makeHeadlines, resultHeadlines } from "@/lib/engine/headlines";
import { recordUserPlayerStats } from "@/lib/engine/player-stats";
import { interpretFreeText } from "@/lib/engine/keywords";
import { teamRatings } from "@/lib/engine/ratings";
import { buildSchedule } from "@/lib/engine/schedule";
import { clamp, hashSeed, makeRng, shuffle } from "@/lib/engine/rng";
import { formatMoney, formatPlayoffRound } from "@/lib/format";
import { gmSubject, normalizeGmName } from "@/lib/gm-name";
import type {
  Action,
  Choice,
  Conf,
  Decision,
  DraftPick,
  Identity,
  Player,
  PlayoffRound,
  PlayoffState,
  Pos,
  Prospect,
  SeasonState,
  StaffMember,
  StaffRole,
  TeamInfo,
  TeamSeason,
  TradeOffer,
} from "@/lib/types";

const ROSTERS = rosterFile as {
  capAssumption: number;
  teams: Record<string, { dead: number; players: Player[] }>;
};

export const LEAGUE_YEAR = 2027;
export const PROJECTED_CAP = 322;
export const MIN_ROSTER = 22;
export const FIRING_THRESHOLD = 20;
const OUTSIDE_BOARD_SIZE = 6;
const UNUSED_CAP_REVIEW_RATIO = 0.18;

const OWNERS = [
  "Dana Crowe",
  "Ellis Ward",
  "Priya Shah",
  "Marcus Bell",
  "Helen Cho",
  "Owen Briggs",
  "Lila Hart",
  "Chris Adelman",
  "Noor Hassan",
  "Sam Ivers",
];

const PRIORITIES = ["win", "youth", "stars", "fiscal", "culture"] as const;

const FIRSTS = ["Malik", "Jaxson", "Braylon", "Keon", "Andre", "Nico", "Darius", "Cole", "Hunter", "Roman", "Leo", "Quinn", "Micah", "Ty", "Beau", "Jonah", "Caleb", "Eli", "Nasir", "Grant", "Miles", "Omar", "Felix", "Shane", "Troy"];
const LASTS = ["Harlow", "Okoye", "Delgado", "Frost", "Nguyen", "Keller", "Brooks", "Santana", "Whitaker", "Duval", "Mercer", "Abbott", "Lang", "Pereira", "Holt", "Singh", "Barker", "Ellison", "Cho", "Ibarra", "Paxton", "Reeves", "Dalton", "Shore", "McKay"];
const COLLEGES = ["Georgia", "Ohio State", "Alabama", "Michigan", "Oregon", "Texas", "Penn State", "LSU", "Notre Dame", "Clemson", "USC", "Florida", "Iowa", "Utah", "Washington"];
const POS_CYCLE: Pos[] = ["QB", "EDGE", "WR", "OL", "CB", "DL", "RB", "LB", "TE", "S", "WR", "OL", "CB", "EDGE"];

const ROLES: StaffRole[] = ["hc", "oc", "dc", "scout"];

function clone<T>(value: T): T {
  return structuredClone(value);
}

function uid(prefix: string, seed: number): string {
  return `${prefix}-${seed.toString(36)}`;
}

export function findPlayer(roster: Player[], id: string): Player | undefined {
  return roster.find((p) => p.id === id);
}

export function yourRoster(state: SeasonState): Player[] {
  return state.teams[state.teamId]?.roster ?? [];
}

function persistActiveCapLiabilities(state: SeasonState): void {
  state.teamCapLiabilities ??= {};
  state.teamCapLiabilities[state.teamId] = {
    deadMoney: Math.round(state.deadMoney * 10) / 10,
    futureDead: Math.round(state.futureDead * 10) / 10,
  };
}

export function activateTeamCapLiabilities(state: SeasonState, teamId: string): SeasonState {
  if (!state.teams[teamId]) throw new Error("That team is no longer available");
  persistActiveCapLiabilities(state);
  state.teamId = teamId;
  const liability = state.teamCapLiabilities?.[teamId] ?? { deadMoney: 0, futureDead: 0 };
  state.deadMoney = liability.deadMoney;
  state.futureDead = liability.futureDead;
  persistActiveCapLiabilities(state);
  return state;
}

export function prepareNewJob(state: SeasonState, teamId: string, previousTeamId: string): SeasonState {
  const previousOwnerName = state.owner.name;
  activateTeamCapLiabilities(state, teamId);
  const rng = makeRng(hashSeed(state.seed, "new-job", state.year, teamId));
  const ownerName = rng.pick(OWNERS.filter((name) => name !== previousOwnerName));
  const ownerPriority = rng.pick(PRIORITIES);
  const strength = teamRatings(state, teamId);
  state.phase = "intro";
  state.staff = {};
  state.staffStep = 0;
  state.owner = { name: ownerName, priority: ownerPriority, note: ownerNote(ownerPriority, state.year) };
  state.market = staffMarket(rng, [], [ownerName]);
  state.meters = {
    owner: 58,
    fans: clamp(58 + (strength.off - 78) * 0.4, 45, 78),
    locker: 64,
  };
  delete state.flags.plan;
  const oldTeam = teamById(previousTeamId, state.directory).abbr;
  const newTeam = teamById(teamId, state.directory);
  state.log = [
    `${state.gmName} was hired by ${teamLabel(newTeam)} after leaving ${oldTeam}.`,
    `New-team cap ledger: ${formatMoney(state.deadMoney)} current dead money and ${formatMoney(state.futureDead)} pushed forward. Old-team liabilities stayed with ${oldTeam}.`,
  ];
  state.headlines = makeHeadlines(state, "neutral", {
    beat: `${teamLabel(newTeam)} have a new GM. ${ownerName} wants a ${priorityLabel(ownerPriority).toLowerCase()} plan.`,
    national: `${gmSubject(state.gmName)} took another call. This is a new building and a new ledger.`,
    analytics: `Inherited roster rates ${strength.off.toFixed(0)} on offense and ${strength.def.toFixed(0)} on defense. Current dead ${formatMoney(state.deadMoney)}; pushed dead ${formatMoney(state.futureDead)}. Owner confidence starts at 58.`,
  });
  return state;
}

export { capSpace, capHealth, payroll };

export function createSeason(input: {
  teamId: string;
  seed?: number;
  gmName: string;
  mode?: SeasonState["mode"];
  historicalId?: string;
}): SeasonState {
  const seed = input.seed ?? hashSeed(input.teamId, input.gmName, Date.now() % 100000);
  const rng = makeRng(seed);
  const historical = input.historicalId ? historicalById(input.historicalId) : undefined;
  if (input.historicalId && !historical) throw new Error("Unknown historical team");

  const directory: TeamInfo[] = historical
    ? historical.teams.map((team) => ({
        id: team.id,
        city: team.city,
        name: team.name,
        abbr: team.abbr,
        color: team.color,
        text: team.text,
        conf: team.conf,
        div: team.div,
      }))
    : TEAMS.map((t) => ({ ...t }));

  const teamId = historical?.teamId ?? input.teamId;
  if (!directory.some((t) => t.id === teamId)) throw new Error("Unknown team");

  const teams: Record<string, TeamSeason> = {};
  if (historical) {
    for (const team of historical.teams) {
      teams[team.id] = {
        id: team.id,
        roster: clone(team.roster ?? []),
        wins: 0,
        losses: 0,
        pf: 0,
        pa: 0,
        lockOff: team.roster?.length ? undefined : team.off,
        lockDef: team.roster?.length ? undefined : team.def,
      };
    }
  } else {
    for (const info of TEAMS) {
      const block = ROSTERS.teams[info.id];
      teams[info.id] = {
        id: info.id,
        roster: clone(block?.players ?? []),
        wins: 0,
        losses: 0,
        pf: 0,
        pa: 0,
      };
    }
  }

  const year = historical?.year ?? LEAGUE_YEAR;
  const seasonLength = historical?.weeks ?? 17;
  const ownerPriority = PRIORITIES[rng.int(PRIORITIES.length)] ?? "win";
  const ownerName = OWNERS[rng.int(OWNERS.length)] ?? "Dana Crowe";
  const strength = teamRatings(
    {
      teamId,
      staff: {},
      meters: { owner: 70, fans: 60, locker: 65 },
      identity: "balanced",
      teamMod: 0,
      teams,
      directory,
    } as SeasonState,
    teamId,
  );

  const state: SeasonState = {
    version: 1,
    id: uid("season", seed),
    seed,
    year,
    gmName: normalizeGmName(input.gmName),
    mode: input.mode ?? (historical ? "historical" : "season"),
    historicalId: historical?.id ?? null,
    historicalTitle: historical?.title ?? null,
    teamId,
    phase: "intro",
    staffStep: 0,
    week: 1,
    seasonLength,
    identity: "balanced",
    meters: {
      owner: 68,
      fans: clamp(58 + (strength.off - 78) * 0.4, 45, 78),
      locker: 66,
    },
    owner: {
      name: ownerName,
      priority: ownerPriority,
      note: ownerNote(ownerPriority, year),
    },
    staff: {},
    market: staffMarket(rng, historical?.legends ?? [], [ownerName]),
    directory,
    teams,
    capLimit: historical?.capLimit ?? PROJECTED_CAP,
    capMode: historical?.capMode ?? "hard",
    deadMoney: historical?.deadMoney ?? ROSTERS.teams[teamId]?.dead ?? 12,
    futureDead: 0,
    teamCapLiabilities: Object.fromEntries(directory.map((team) => [
      team.id,
      {
        deadMoney: team.id === teamId && historical ? historical.deadMoney : ROSTERS.teams[team.id]?.dead ?? 0,
        futureDead: 0,
      },
    ])),
    extraPicks: [],
    restructuredIds: [],
    franchiseTagUsed: false,
    faWave: 1,
    faBoard: [],
    faPool: [],
    walked: [],
    tradeOffers: [],
    shop: null,
    shopUsed: false,
    prospects: [],
    draftPicks: [],
    draftCursor: 0,
    pendingDraftTrade: null,
    campCutIds: [],
    schedule: buildSchedule(
      directory.map((t) => t.id),
      seasonLength,
      seed,
    ),
    results: [],
    playerStats: {},
    statsTrackingStartedWeek: 1,
    decisions: [],
    headlines: [],
    activeDecision: null,
    ripples: [],
    playoff: null,
    firedReason: null,
    grade: null,
    log: [],
    flags: {},
    teamMod: 0,
  };

  state.headlines = makeHeadlines(state, "neutral", {
    beat: `${teamLabel(teamById(teamId, directory))} have a new GM. ${state.owner.name} wants a ${priorityLabel(ownerPriority).toLowerCase()} plan.`,
    national: `Another building, another binder. ${gmSubject(state.gmName)} gets the chair.`,
    analytics: `Inherited roster rates ${strength.off.toFixed(0)} on offense and ${strength.def.toFixed(0)} on defense before a single hire.`,
  });
  state.log.push(state.gmName === "GM" ? "The GM is introduced." : `${state.gmName} is introduced as GM.`);
  seedEraRipples(state);
  return state;
}

export function ownerNote(priority: string, year: number, previous?: { wins: number; losses: number; round: PlayoffRound }): string {
  const finish = previous
    ? previous.round === "missed"
      ? "missed the playoffs"
      : previous.round === "champion"
        ? "won the championship"
        : previous.round === "superbowl"
          ? "reached the Super Bowl"
          : `exited in the ${formatPlayoffRound(previous.round)}`
    : "";
  const context = previous
    ? `After a ${previous.wins}-${previous.losses} season that ${finish} in ${year - 1}, the ${year} brief is specific: `
    : `The ${year} brief is clear: `;
  const alternate = year % 2 === 0;
  switch (priority) {
    case "win":
      return `${context}${alternate ? "turn last year's lessons into a championship push." : "the owner wants a championship push, not a pamphlet about the future."}`;
    case "youth":
      return `${context}${alternate ? "give young players real roles without abandoning the season." : "draft, develop, and stop paying for other people's primes."}`;
    case "stars":
      return `${context}${alternate ? "add a difference-maker the city recognizes and the cap can support." : "bring in a name the city knows without hollowing out the roster."}`;
    case "fiscal":
      return `${context}${alternate ? "create flexibility without leaving useful money idle." : "the cap sheet must stay credible even if February is quiet."}`;
    default:
      return `${context}${alternate ? "make discipline and weekly buy-in visible, not ceremonial." : "protect the locker room; talent that poisons the week is not talent."}`;
  }
}

export function priorityLabel(priority: string): string {
  switch (priority) {
    case "win":
      return "Win now";
    case "youth":
      return "Build young";
    case "stars":
      return "Chase stars";
    case "fiscal":
      return "Cap discipline";
    default:
      return "Culture";
  }
}

function seedEraRipples(state: SeasonState) {
  if (state.historicalId === "1999-rams") {
    state.ripples.push({
      week: 1,
      decision: {
        id: "warner",
        kicker: "Preseason",
        title: "Trent Green is hurt",
        body: "The quarterback you paid is out. Kurt Warner knows the offense and has never been the guy. The conservative move is a run-heavy bridge. The other move is to hand him the season.",
        options: [
          { id: "warner", label: "Start Kurt Warner", detail: "The cheap backup gets the keys.", owner: 1, fans: 2, locker: 2, log: "Named Kurt Warner the starter.", tag: "mod:2", swing: 4 },
          { id: "bridge", label: "Run the ball and wait on Green", detail: "Do not rebuild the offense around a backup.", owner: 2, fans: -2, locker: -1, log: "Kept the offense on the ground while Green healed.", swing: -1 },
        ],
      },
    });
  }
  if (state.historicalId === "1989-niners") {
    state.ripples.push({
      week: 6,
      decision: {
        id: "young-montana",
        kicker: "Quarterbacks",
        title: "Steve Young wants a series",
        body: "Joe Montana is the offense. Steve Young is already good enough to start somewhere else, and he is tired of holding a clipboard. The locker room will pick a side.",
        options: [
          { id: "joe", label: "Montana is the starter. Period.", detail: "One voice, one offense.", owner: 2, fans: 3, locker: 2, log: "Backed Joe Montana publicly.", swing: 3 },
          { id: "split", label: "Give Young a scripted series", detail: "Keep him happy without a controversy. Maybe.", owner: -1, fans: 0, locker: -4, log: "Split the quarterback job for a week.", swing: -3 },
          { id: "steve", label: "Start Young", detail: "The future is in the building. Use it.", owner: -2, fans: -3, locker: -2, log: "Benched Montana for Steve Young.", tag: "mod:1", swing: -2 },
        ],
      },
    });
  }
}

export function applyAction(state: SeasonState, action: Action): SeasonState {
  const next = clone(state);
  switch (action.type) {
    case "intro":
      return doIntro(next, action.choice, action.text);
    case "hire":
      return doHire(next, action.id);
    case "cap":
      return doCap(next, action.choice, action.playerId);
    case "sign":
      return doSign(next, action.playerId);
    case "tag":
      return doTag(next, action.playerId);
    case "next-wave":
      return doNextWave(next);
    case "trade":
      return doTrade(next, action.offerId, action.accept);
    case "shop":
      return doShop(next, action.playerId);
    case "shop-resolve":
      return doShopResolve(next, action.accept);
    case "trade-done":
      return beginDraft(next);
    case "draft":
      return doDraft(next, action.prospectId);
    case "draft-trade":
      return doDraftTrade(next, action.accept);
    case "camp-selection":
      return doCampSelection(next, action.cutIds);
    case "camp":
      return doCamp(next, action.cutIds);
    case "decide":
      return doDecide(next, action.choiceId);
    case "play-week":
      return doPlayWeek(next);
    case "playoff":
      return doPlayoff(next);
    case "sim":
      return simulateUntil(next, action.until, { stopAtDecision: true });
    default:
      return next;
  }
}

function bump(state: SeasonState, owner = 0, fans = 0, locker = 0) {
  if (owner !== 0) state.meters.owner = clamp(Math.round(state.meters.owner + owner), 0, 96);
  if (fans !== 0) state.meters.fans = clamp(Math.round(state.meters.fans + fans), 0, 100);
  if (locker !== 0) state.meters.locker = clamp(Math.round(state.meters.locker + locker), 0, 96);
  if (state.meters.owner <= FIRING_THRESHOLD && state.phase !== "fired" && state.phase !== "recap") {
    fire(state, "Owner confidence collapsed. The chair is already someone else's problem.");
  }
}

function pushDecision(state: SeasonState, title: string, choice: string, log: string, swing: number) {
  state.decisions.push({ week: state.week, title, choice, log, swing });
  state.log.push(log);
}

function doIntro(state: SeasonState, choice: string, text?: string): SeasonState {
  if (state.phase !== "intro") throw new Error("No owner meeting on the desk");
  const ownerBefore = state.meters.owner;
  let ownerRequested = 0;
  let path = choice;
  if (text && text.trim().length > 8) {
    const read = interpretFreeText(text);
    if (read) path = read.path === state.owner.priority ? "embrace" : "defy";
    state.flags.freeText = text.trim().slice(0, 240);
    if (read) state.flags.plan = read.path;
  }
  if (path === "embrace" || path === state.owner.priority) {
    ownerRequested = 8;
    bump(state, 8, 1, 1);
    state.flags.plan = state.owner.priority;
    pushDecision(state, "Owner meeting", "Embrace the brief", `Told ${state.owner.name} the plan matches the brief.`, 8);
  } else if (path === "balance") {
    ownerRequested = 2;
    bump(state, 2, 3, 1);
    state.flags.plan = "balance";
    pushDecision(state, "Owner meeting", "Split the difference", "Promised a balanced year and left the door open.", 2);
  } else {
    ownerRequested = -6;
    bump(state, -6, 3, 0);
    state.flags.plan = path === "defy" ? "defy" : path;
    pushDecision(state, "Owner meeting", "Pushed back", "Told the owner the brief was wrong.", -6);
  }
  state.phase = state.staff.hc ? "cap" : "staff";
  state.headlines = makeHeadlines(state, state.meters.owner >= 70 ? "positive" : "negative", {
    beat: `${state.owner.name} leaves the meeting ${state.meters.owner >= 70 ? "nodding" : "already second-guessing"}.`,
    national: `${gmSubject(state.gmName)} just told the building what kind of GM this is going to be.`,
    analytics: `Owner confidence ${ownerBefore} → ${state.meters.owner} (${meterEffect(ownerBefore, state.meters.owner, ownerRequested, 96)}). That is the only poll that can end the job.`,
  });
  if (state.phase === "cap") openCap(state);
  return state;
}

function doHire(state: SeasonState, id: string): SeasonState {
  if (state.phase !== "staff") throw new Error("Staff is not on the clock");
  const role = ROLES[state.staffStep] ?? "hc";
  const member = state.market[role].find((s) => s.id === id);
  if (!member) throw new Error("That candidate already left");
  state.staff[role] = member;
  const priority = String(state.flags.plan ?? state.owner.priority);
  let owner = 1;
  const locker = member.culture >= 4 ? 3 : member.culture <= 2 ? -2 : 0;
  const fans = member.aggression >= 4 ? 2 : 0;
  if (priority === "fiscal") owner += member.cost === 1 ? 3 : member.cost === 3 ? -3 : 0;
  if (priority === "youth") owner += member.development >= 4 ? 3 : -1;
  if (priority === "win") owner += member.aggression >= 4 ? 2 : 0;
  if (priority === "culture") owner += member.culture >= 4 ? 3 : -2;
  if (priority === "stars") owner += member.cost === 3 ? 2 : 0;
  bump(state, owner, fans, locker);
  pushDecision(state, `Hire ${role.toUpperCase()}`, member.name, `Hired ${member.name} as ${role.toUpperCase()}.`, owner);
  state.staffStep += 1;
  state.headlines = makeHeadlines(state, owner >= 0 ? "positive" : "negative", {
    beat: `${member.name} gets the ${role === "hc" ? "headset" : "office"}. ${member.blurb}`,
    national: `${gmSubject(state.gmName)} hires ${member.name}. ${member.legend ? "The city already knows the name." : "Nobody outside the building has a strong opinion yet."}`,
    analytics: `${member.scheme} is the tell. Leadership ${member.leadership}/5, development ${member.development}/5.`,
  });
  if (state.staffStep >= ROLES.length) openCap(state);
  return state;
}

function openCap(state: SeasonState) {
  state.phase = "cap";
  const space = capSpace(state);
  state.headlines = makeHeadlines(state, space >= 0 ? "neutral" : "negative", {
    beat: space >= 0 ? `The cap sheet has ${formatMoney(space)} of room before anyone is signed.` : `The cap sheet is ${formatMoney(space)}. Something has to give before free agency.`,
    national: "Cap day is not content. It is still how GMs get fired in March.",
    analytics: `Under-contract charges ${committedPayroll(yourRoster(state)).toFixed(1)} plus ${state.deadMoney.toFixed(1)} dead against a ${state.capLimit.toFixed(1)} ${state.capMode === "payroll" ? "payroll guide" : "cap"}. Expired deals are not charged unless renewed.`,
  });
}

function doCap(state: SeasonState, choice: "restructure" | "cut" | "hold", playerId?: string): SeasonState {
  if (state.phase !== "cap") throw new Error("Cap moves are closed");
  const roster = yourRoster(state);
  if (choice === "hold") {
    if (state.capMode === "hard" && capSpace(state) < 0) {
      throw new Error("You cannot leave a hard cap in the red");
    }
    bump(state, state.owner.priority === "fiscal" ? 2 : 0, 0, 0);
    pushDecision(state, "Cap", "Stood pat", "Left the cap sheet alone.", 0);
    return openFreeAgency(state);
  }
  const eligible = roster.filter((candidate) => candidate.years > 0);
  const player = playerId ? eligible.find((p) => p.id === playerId) : biggestCap(eligible);
  if (!player) {
    const selected = playerId ? roster.find((candidate) => candidate.id === playerId) : undefined;
    if (choice === "restructure" && selected?.years === 0) throw new Error("Expired contracts must be re-signed or tagged in free agency");
    throw new Error(playerId ? "That player has no active contract to change" : "No contract to touch");
  }
  if (choice === "restructure") {
    if (player.years <= 0) throw new Error("Expired contracts must be re-signed or tagged in free agency");
    if (state.restructuredIds?.includes(player.id)) throw new Error("That contract was already restructured this year");
    const saved = Math.round(player.cap * 0.3 * 10) / 10;
    player.cap = Math.round((player.cap - saved) * 10) / 10;
    state.futureDead = Math.round((state.futureDead + saved) * 10) / 10;
    persistActiveCapLiabilities(state);
    state.restructuredIds = [...(state.restructuredIds ?? []), player.id];
    const ownerBefore = state.meters.owner;
    const ownerDelta = state.owner.priority === "fiscal" ? -1 : 1;
    bump(state, ownerDelta, 0, -1);
    pushDecision(state, "Cap", `Restructured ${player.name}`, `Restructured ${player.name}, saving $${saved.toFixed(1)}M now and pushing it forward. Owner ${formatSigned(ownerDelta)}.`, ownerDelta);
    state.headlines = makeHeadlines(state, "neutral", {
      beat: `${player.name}'s number drops this year. The bill does not disappear.`,
      national: "A restructure is not a savings plan. It is a calendar.",
      analytics: `About ${formatMoney(saved)} moved into future dead money. Space is now ${formatMoney(capSpace(state))}. Owner confidence ${ownerBefore} → ${state.meters.owner} (${formatSigned(ownerDelta)}); locker ${formatSigned(-1)}.`,
    });
    return state;
  }
  roster.splice(roster.indexOf(player), 1);
  const dead = Math.round(player.cap * 0.45 * 10) / 10;
  state.deadMoney = Math.round((state.deadMoney + dead) * 10) / 10;
  persistActiveCapLiabilities(state);
  bump(state, 0, player.ovr >= 80 ? -5 : -2, player.ovr >= 80 ? -4 : -2);
  pushDecision(state, "Cap", `Cut ${player.name}`, `Cut ${player.name}. Dead money $${dead.toFixed(1)}M.`, -3);
  if (player.ovr >= 82) queueRipple(state, 5, veteranRipple(player));
  state.headlines = makeHeadlines(state, "negative", {
    beat: `${player.name} is out. The locker room noticed which direction the standard points.`,
    national: `Cutting ${player.name} is a choice you will hear about on the next show.`,
    analytics: `Cap space moves to ${formatMoney(capSpace(state))}. Dead money is ${formatMoney(state.deadMoney)}.`,
  });
  return state;
}

function biggestCap(roster: Player[]): Player | undefined {
  return roster.slice().sort((a, b) => b.cap - a.cap)[0];
}

function veteranRipple(player: Player): Decision {
  return {
    id: `vet-${player.id}`,
    kicker: "Locker room",
    title: `${player.name.split(" ").slice(-1)} still has friends here`,
    body: `Cutting ${player.name} is still the topic in the position room. A captain asks, in front of people, whether stars are safe.`,
    options: [
      { id: "own", label: "Own it in the meeting", detail: "The standard applies to everyone.", owner: 1, fans: 0, locker: 2, log: "Faced the locker room about the cut.", swing: 2 },
      { id: "fines", label: "Fine the loudest voice", detail: "Meetings are not group texts.", owner: 2, fans: -1, locker: -4, log: "Fined a captain for the meeting.", swing: -3 },
      { id: "apology", label: "Soften it and promise a role for veterans", detail: "You buy the room back.", owner: -1, fans: 1, locker: 3, log: "Promised the veterans they still matter.", swing: 1 },
    ],
  };
}

function queueRipple(state: SeasonState, week: number, decision: Decision) {
  if (state.ripples.some((r) => r.decision.id === decision.id)) return;
  state.ripples.push({ week: Math.min(week, state.seasonLength), decision });
}

function openFreeAgency(state: SeasonState): SeasonState {
  state.phase = "fa";
  state.faWave = 1;
  state.faPool = freeAgentPool(state);
  state.flags.faShown = "";
  state.faBoard = buildBoard(state, 1);
  state.headlines = makeHeadlines(state, "neutral", {
    beat: "Your expiring contracts come first. Re-sign a player, use one franchise tag, or let him reach the market.",
    national: "Every GM says they will be disciplined. The tape from March says otherwise.",
    analytics: `You enter with ${formatMoney(capSpace(state))}. Asking prices are estimates, not filings.`,
  });
  return state;
}

function freeAgentPool(state: SeasonState): Player[] {
  const pool: Player[] = [];
  for (const [id, team] of Object.entries(state.teams)) {
    if (id === state.teamId) continue;
    const departures = new Set<string>();
    for (const player of team.roster) {
      if (player.years > 0) continue;
      const rng = makeRng(hashSeed(state.seed, state.year, "cpu-retention", id, player.id));
      const elite = player.ovr >= 90;
      const quarterbackPremium = player.pos === "QB" && player.ovr >= 82 ? 0.08 : 0;
      const ageDiscount = player.age >= 33 ? 0.22 : player.age >= 31 ? 0.1 : 0;
      const retentionChance = clamp(
        (elite ? 0.92 : player.ovr >= 86 ? 0.82 : player.ovr >= 82 ? 0.7 : player.ovr >= 76 ? 0.52 : player.ovr >= 70 ? 0.3 : 0.14) + quarterbackPremium - ageDiscount,
        0.08,
        0.98,
      );
      if (rng.next() < retentionChance) {
        player.cap = Math.round(marketAsk(player, salaryScale(state.capLimit)) * (elite ? 1.08 : 1) * 10) / 10;
        player.years = player.age >= 33 ? 1 : 2 + rng.int(3);
        continue;
      }
      const scarcity = 1.12 + Math.max(0, player.ovr - 82) * 0.018 + (player.pos === "QB" ? 0.1 : 0);
      pool.push({ ...player, origin: id, cap: Math.round(marketAsk(player, salaryScale(state.capLimit)) * scarcity * 10) / 10 });
      departures.add(player.id);
    }
    if (departures.size) team.roster = team.roster.filter((player) => !departures.has(player.id));
    ensureMinimumRoster(state, id);
  }
  const historicalMarket = Boolean(state.historicalId || state.flags.historicalRosterScenarioId);
  if (historicalMarket && pool.length < OUTSIDE_BOARD_SIZE * 2) {
    const rng = makeRng(hashSeed(state.seed, state.year, "modeled-historical-market"));
    const scenario = String(state.flags.historicalRosterScenarioId ?? state.historicalId ?? "historical");
    const needed = OUTSIDE_BOARD_SIZE * 2 - pool.length;
    for (let index = 0; index < needed; index += 1) {
      const pos = POS_CYCLE[(pool.length + index) % POS_CYCLE.length] ?? "LB";
      const ovr = 68 + rng.int(16);
      const age = 24 + rng.int(10);
      const player: Player = {
        id: `modeled-historical-fa-${scenario}-${state.year}-${index}`,
        name: `${FIRSTS[rng.int(FIRSTS.length)]} ${LASTS[rng.int(LASTS.length)]}`,
        pos,
        ovr,
        age,
        cap: 0,
        years: 0,
        potential: Math.min(88, ovr + (age <= 26 ? 3 : 1)),
        real: false,
        drafted: false,
        origin: "modeled-historical-market",
      };
      player.cap = Math.round(marketAsk(player, salaryScale(state.capLimit)) * 1.08 * 10) / 10;
      pool.push(player);
    }
  }
  return pool.sort((a, b) => b.ovr - a.ovr);
}

function buildBoard(state: SeasonState, wave: number): Player[] {
  if (wave === 1) {
    return yourRoster(state)
      .filter((p) => p.years <= 0)
      .sort((a, b) => b.ovr - a.ovr)
      .map((p) => ({ ...p, cap: Math.round(marketAsk(p, salaryScale(state.capLimit)) * 0.95 * 10) / 10, origin: state.teamId }));
  }
  const pool = state.faPool?.length ? state.faPool : freeAgentPool(state);
  state.faPool = pool;
  const shown = new Set(String(state.flags.faShown ?? "").split(",").filter(Boolean));
  const available = pool.filter((player) => !shown.has(player.id));
  const board = available.slice(0, OUTSIDE_BOARD_SIZE);
  const space = capSpace(state);
  const affordable = state.capMode === "hard" && !board.some((player) => player.cap <= space + 0.05)
    ? available.slice(OUTSIDE_BOARD_SIZE).find((player) => player.cap <= space + 0.05)
    : undefined;
  const selected = affordable && board.length ? [...board.slice(0, -1), affordable] : board;
  state.flags.faShown = [...shown, ...selected.map((player) => player.id)].join(",");
  return selected;
}

function doSign(state: SeasonState, playerId: string): SeasonState {
  if (state.phase !== "fa") throw new Error("Free agency is closed");
  const deal = state.faBoard.find((p) => p.id === playerId);
  if (!deal) throw new Error("That player is off the board");
  const ask = deal.cap;
  if (state.capMode === "hard" && ask > capSpace(state) + 0.05) throw new Error("Not enough cap room");
  const years = offerYears(deal);
  if (deal.origin && deal.origin !== state.teamId) {
    const old = state.teams[deal.origin];
    if (old) old.roster = old.roster.filter((p) => p.id !== deal.id);
  }
  const roster = yourRoster(state);
  const existing = roster.find((p) => p.id === deal.id);
  if (existing) {
    existing.cap = ask;
    existing.years = years;
  } else {
    roster.push({ ...deal, years, origin: deal.origin, drafted: false });
  }
  state.flags[`signed:${deal.id}`] = state.year;
  state.faBoard = state.faBoard.filter((p) => p.id !== playerId);
  const over = state.capMode === "payroll" && capSpace(state) < 0;
  bump(state, over ? -6 : deal.ovr >= 88 ? 2 : 0, deal.ovr >= 85 ? 4 : 1, deal.age >= 31 ? -1 : 1);
  pushDecision(state, "Free agency", `Signed ${deal.name}`, `Signed ${deal.name} for $${ask.toFixed(1)}M.`, deal.ovr >= 85 ? 3 : 1);
  if (over) queueRipple(state, 3, payrollRipple());
  state.headlines = makeHeadlines(state, "positive", {
    beat: `${deal.name} is yours. $${ask.toFixed(1)}M a year, ${years} years on the sheet.`,
    national: deal.ovr >= 88 ? `${gmSubject(state.gmName)} just bought a headline.` : `${deal.name} is a fit, not a parade.`,
    analytics: `Space after the deal: ${formatMoney(capSpace(state))}. ${over ? "The owner will read this number." : "The cap still closes."}`,
  });
  return state;
}

function doTag(state: SeasonState, playerId: string): SeasonState {
  if (state.phase !== "fa" || state.faWave !== 1) throw new Error("The franchise-tag window is closed");
  if (state.franchiseTagUsed) throw new Error("The franchise tag was already used this season");
  const deal = state.faBoard.find((player) => player.id === playerId && player.origin === state.teamId);
  if (!deal) throw new Error("Only your own expiring player can be tagged");
  const tag = Math.round(marketAsk(deal, salaryScale(state.capLimit)) * 1.08 * 10) / 10;
  if (state.capMode === "hard" && tag > capSpace(state) + 0.05) throw new Error("Not enough cap room for the franchise tag");
  const player = yourRoster(state).find((candidate) => candidate.id === playerId);
  if (!player) throw new Error("That player is no longer on your roster");
  player.cap = tag;
  player.years = 1;
  state.franchiseTagUsed = true;
  state.faBoard = state.faBoard.filter((candidate) => candidate.id !== playerId);
  bump(state, 0, player.ovr >= 85 ? 2 : 0, -2);
  pushDecision(state, "Free agency", `Tagged ${player.name}`, `Used the one-year franchise tag at $${tag.toFixed(1)}M.`, 0);
  state.headlines = makeHeadlines(state, "neutral", {
    beat: `${player.name} stays for one year on the franchise tag.`,
    national: "The tag keeps the player. It does not settle the contract.",
    analytics: `Tag charge ${formatMoney(tag)}. Space after the move: ${formatMoney(capSpace(state))}.`,
  });
  return state;
}

function payrollRipple(): Decision {
  return {
    id: "payroll-heat",
    kicker: "Owner",
    title: "The payroll leaked",
    body: "You spent past the number the owner thought was the plan. A reporter has the sheet. You can defend the stars or cut a smaller deal loose.",
    options: [
      { id: "defend", label: "Defend the spending", detail: "The names are why the building is relevant.", owner: -2, fans: 3, locker: 1, log: "Defended the payroll in public.", swing: -1 },
      { id: "trim", label: "Promise a cut before camp", detail: "You buy the owner back.", owner: 4, fans: -2, locker: -2, log: "Promised to trim the payroll before camp.", tag: "trim", swing: 2 },
    ],
  };
}

function doNextWave(state: SeasonState): SeasonState {
  if (state.phase !== "fa") throw new Error("Free agency is closed");
  if (state.faWave < 3) {
    state.faWave += 1;
    state.faBoard = buildBoard(state, state.faWave);
    state.headlines = makeHeadlines(state, "neutral", {
      beat: state.faWave === 2 ? "Your unsigned players are now on the market. The first outside wave is on the board." : "The last outside wave is thinner. The mistakes are cheaper, too.",
      national: "The market always feels slower on day two. It is not kinder.",
      analytics: `Wave ${state.faWave}. Space ${formatMoney(capSpace(state))}.`,
    });
    return state;
  }
  const roster = yourRoster(state);
  const walking = roster.filter((p) => p.years <= 0);
  state.teams[state.teamId].roster = roster.filter((p) => p.years > 0);
  state.walked.push(...walking.map((p) => p.name));
  const cpuSignings = allocateRemainingFreeAgents(state, walking);
  state.faPool = [];
  if (walking.some((p) => p.ovr >= 84)) bump(state, -1, -4, -3);
  state.phase = "trade";
  state.tradeOffers = makeOffers(state);
  state.headlines = makeHeadlines(state, walking.length ? "negative" : "neutral", {
    beat: walking.length ? `${walking.map((p) => p.name).join(", ")} hit the market unsigned.` : "You kept the expiring names you meant to keep.",
    national: "The phones start. Three teams think you are a seller.",
    analytics: `${cpuSignings} remaining outside free agent${cpuSignings === 1 ? "" : "s"} joined CPU teams. Trade values weigh rating, age, position, contract control, cap cost, and draft-pick value.`,
  });
  return state;
}

function allocateRemainingFreeAgents(state: SeasonState, newlyAvailable: Player[] = []): number {
  const rostered = new Set(Object.values(state.teams).flatMap((team) => team.roster.map((player) => player.id)));
  const candidates = [...(state.faPool ?? []), ...newlyAvailable.map((player) => ({
    ...player,
    origin: state.teamId,
    cap: Math.round(marketAsk(player, salaryScale(state.capLimit)) * 1.12 * 10) / 10,
  }))]
    .filter((player) => !rostered.has(player.id) && player.ovr >= 70)
    .sort((a, b) => b.ovr - a.ovr);
  const signings = new Map<string, number>();
  let placed = 0;
  for (const player of candidates) {
    const destination = Object.values(state.teams)
      .filter((team) => team.id !== state.teamId)
      .filter((team) => (signings.get(team.id) ?? 0) < 2)
      .filter((team) => committedPayroll(team.roster) + player.cap <= state.capLimit)
      .map((team) => {
        const positionalCount = team.roster.filter((candidate) => candidate.pos === player.pos).length;
        const rating = teamRatings(state, team.id);
        const needBonus = needs(team.roster).has(player.pos) ? 18 : Math.max(0, 3 - positionalCount) * 3;
        return { team, score: needBonus + (170 - rating.off - rating.def) };
      })
      .sort((a, b) => b.score - a.score || a.team.id.localeCompare(b.team.id))[0]?.team;
    if (!destination) continue;
    destination.roster.push({ ...player, years: offerYears(player), drafted: false });
    signings.set(destination.id, (signings.get(destination.id) ?? 0) + 1);
    placed += 1;
  }
  if (placed) state.log.push(`${placed} remaining outside free agents signed with CPU teams after your market closed.`);
  return placed;
}

function makeOffers(state: SeasonState): TradeOffer[] {
  const rng = makeRng(hashSeed(state.seed, "trades", state.year));
  const roster = yourRoster(state).filter((p) => p.pos !== "K");
  const qbs = roster.filter((p) => p.pos === "QB");
  const eligible = roster.filter((p) => p.ovr >= 74 && p.ovr <= 90 && (p.pos !== "QB" || qbs.length > 1));
  const recentTargets = new Set(state.recentTradeTargets ?? []);
  const freshTargets = shuffle(eligible.filter((player) => !recentTargets.has(player.id)), rng);
  const fallbackTargets = shuffle(eligible.filter((player) => recentTargets.has(player.id)), rng);
  const candidates = [...freshTargets, ...fallbackTargets].slice(0, 3);
  const others = state.directory.filter((t) => t.id !== state.teamId);
  const recentTeams = new Set(state.recentTradeTeams ?? []);
  const callers = [...shuffle(others.filter((team) => !recentTeams.has(team.id)), rng), ...shuffle(others.filter((team) => recentTeams.has(team.id)), rng)];
  const valueCopy: Record<TradeOffer["fair"], string[]> = {
    bargain: [
      "{TEAM} is paying above the chart. The extra value is real; the roster cost is yours to judge.",
      "{TEAM} pushed the offer past fair value. This is the kind of call that tests attachment.",
      "{TEAM} wants the player enough to pay a premium. The decision is value versus continuity.",
    ],
    fair: [
      "{TEAM} is in the right neighborhood. The return and the player carry similar modeled value.",
      "{TEAM} put a balanced offer on the table. This comes down to roster direction.",
      "{TEAM} met the market without overreaching. Either answer is defensible.",
    ],
    fleece: [
      "{TEAM} wants {PLAYER} for less than the chart says he is worth.",
      "{TEAM} is asking you to sell low on {PLAYER}. The cap relief does not erase the value gap.",
      "{TEAM} opened below market for {PLAYER}. Accepting would need a reason beyond the return.",
    ],
  };
  const offers = candidates.map((player, index) => {
    const from = callers[index % Math.max(1, callers.length)] ?? others[0];
    const targetFactor = index === 0 ? 1.08 : index === 1 ? 0.9 : 0.62;
    const outgoingValue = playerTradeValue(player);
    const pickRound = pickRoundClosestToValue(outgoingValue * (index === 0 ? 0.9 : index === 1 ? 0.65 : 0.4));
    const pickValue = pickTradeValue(pickRound);
    const sourceRoster = state.teams[from.id]?.roster ?? [];
    const sourceQuarterbacks = sourceRoster.filter((candidate) => candidate.pos === "QB").sort((a, b) => b.ovr - a.ovr);
    const incomingPool = sourceRoster
      .filter((candidate) => candidate.pos === player.pos || candidate.ovr <= player.ovr - 4)
      .filter((candidate) => {
        const protectedYoungQuarterback = candidate.pos === "QB" && candidate.age <= 27 && candidate.ovr >= 82;
        if (protectedYoungQuarterback && (player.pos !== "QB" || player.age > 27 || player.ovr < candidate.ovr - 2)) return false;
        if (candidate.pos === "QB" && sourceQuarterbacks[0]?.id === candidate.id && sourceQuarterbacks.length <= 2) return false;
        return playerTradeValue(candidate) + pickValue <= outgoingValue * targetFactor;
      })
      .sort((a, b) => playerTradeValue(b) - playerTradeValue(a));
    const incoming = index === 2 ? null : incomingPool[0] ? { ...incomingPool[0] } : null;
    const returnValue = pickValue + (incoming ? playerTradeValue(incoming) : 0);
    const fair = tradeFairness(returnValue, outgoingValue);
    return {
      id: `offer-${player.id}`,
      fromTeamId: from.id,
      wantId: player.id,
      wantName: player.name,
      incoming,
      pickRound,
      pickYear: pickRound ? state.year + 1 : null,
      blurb: rng.pick(valueCopy[fair]).replace("{TEAM}", from.abbr).replace("{PLAYER}", player.name),
      fair,
    };
  });
  state.recentTradeTargets = [...(state.recentTradeTargets ?? []), ...offers.map((offer) => offer.wantId)].slice(-12);
  state.recentTradeTeams = [...(state.recentTradeTeams ?? []), ...offers.map((offer) => offer.fromTeamId)].slice(-12);
  return offers;
}

export function tradeValueLabel(fair: TradeOffer["fair"]): string {
  if (fair === "bargain") return "Good value for you";
  if (fair === "fleece") return "Poor value for you";
  return "Fair value for you";
}

export function tradeFairness(returnValue: number, outgoingValue: number): TradeOffer["fair"] {
  const ratio = returnValue / Math.max(1, outgoingValue);
  if (ratio >= 0.92) return "bargain";
  if (ratio >= 0.55) return "fair";
  return "fleece";
}

export function tradeIncomingName(player: Player): string {
  return player.origin === "replacement" || /\bReplacement\b/i.test(player.name)
    ? `depth ${player.pos}`
    : `${player.name} · ${player.pos}`;
}

export function tradeImpactPreview(state: SeasonState, offer: TradeOffer) {
  const sent = yourRoster(state).find((player) => player.id === offer.wantId);
  const ownerRequested = offer.fair === "bargain" ? 4 : offer.fair === "fair" ? 1 : -4;
  const fansRequested = offer.fair === "fleece" ? -3 : 0;
  const lockerRequested = sent && sent.ovr >= 85 ? -2 : 0;
  const effect = (before: number, requested: number, ceiling: number) => ({
    requested,
    applied: requested === 0 ? 0 : clamp(Math.round(before + requested), 0, ceiling) - before,
  });
  return {
    owner: effect(state.meters.owner, ownerRequested, 96),
    fans: effect(state.meters.fans, fansRequested, 100),
    locker: effect(state.meters.locker, lockerRequested, 96),
    capRoomChange: Math.round(((sent?.cap ?? 0) - (offer.incoming?.cap ?? 0)) * 10) / 10,
  };
}

const TRADE_POSITION_MULTIPLIER: Record<Pos, number> = {
  QB: 1.65, EDGE: 1.18, WR: 1.08, CB: 1.02, OL: 1, DL: 0.96,
  LB: 0.88, S: 0.84, TE: 0.78, RB: 0.65, K: 0.18,
};

export function playerTradeValue(player: Player): number {
  const ageFactor = player.age <= 24 ? 1.2 : player.age <= 28 ? 1.08 : player.age <= 30 ? 0.94 : player.age <= 32 ? 0.76 : player.age <= 34 ? 0.54 : 0.34;
  const controlFactor = player.years <= 0 ? 0.68 : player.years === 1 ? 0.86 : player.years >= 3 ? 1.1 : 1;
  const market = Math.max(1, marketAsk(player));
  const contractFactor = clamp(market / Math.max(1, player.cap), 0.72, 1.22);
  const quality = Math.pow(Math.max(1, player.ovr - 58), 1.45);
  return Math.round(quality * TRADE_POSITION_MULTIPLIER[player.pos] * ageFactor * controlFactor * contractFactor);
}

export function pickTradeValue(round: number): number {
  return ({ 1: 82, 2: 48, 3: 29, 4: 18, 5: 11, 6: 7, 7: 4 } as Record<number, number>)[round] ?? 0;
}

function pickRoundClosestToValue(value: number): number {
  return [1, 2, 3, 4, 5, 6, 7]
    .sort((a, b) => Math.abs(pickTradeValue(a) - value) - Math.abs(pickTradeValue(b) - value) || a - b)[0] ?? 7;
}

function doTrade(state: SeasonState, offerId: string, accept: boolean): SeasonState {
  if (state.phase !== "trade") throw new Error("The trade window is shut");
  const offer = state.tradeOffers.find((o) => o.id === offerId);
  if (!offer) throw new Error("That offer expired");
  if (accept) applyOffer(state, offer);
  else pushDecision(state, "Trade", `Passed on ${offer.wantName}`, `Declined the ${teamById(offer.fromTeamId, state.directory).abbr} call about ${offer.wantName}.`, 0);
  state.tradeOffers = state.tradeOffers.filter((o) => o.id !== offerId);
  return state;
}

function applyOffer(state: SeasonState, offer: TradeOffer) {
  const roster = yourRoster(state);
  const idx = roster.findIndex((p) => p.id === offer.wantId);
  if (idx < 0) throw new Error("That player is not on the roster");
  const sent = roster[idx];
  roster.splice(idx, 1);
  const from = state.teams[offer.fromTeamId];
  if (!from) throw new Error("The offering team no longer exists");
  from.roster.push({ ...sent, origin: state.teamId });
  if (offer.incoming) {
    from.roster = from.roster.filter((p) => p.id !== offer.incoming?.id);
    roster.push({ ...offer.incoming, origin: offer.fromTeamId });
  }
  if (offer.pickRound && offer.pickYear) {
    state.extraPicks.push({
      round: offer.pickRound,
      year: offer.pickYear,
      source: `Trade with ${teamById(offer.fromTeamId, state.directory).abbr}`,
    });
  }
  const swing = offer.fair === "bargain" ? 4 : offer.fair === "fair" ? 1 : -4;
  bump(state, swing, offer.fair === "fleece" ? -3 : 0, sent.ovr >= 85 ? -2 : 0);
  const got = offer.incoming ? tradeIncomingName(offer.incoming) : offer.pickRound ? `a ${offer.pickYear} round ${offer.pickRound}` : "nothing you wanted";
  pushDecision(state, "Trade", `Moved ${sent.name}`, `Traded ${sent.name} to ${teamById(offer.fromTeamId, state.directory).abbr} for ${got}.`, swing);
  state.headlines = makeHeadlines(state, swing >= 0 ? "positive" : "negative", {
    beat: `${sent.name} is gone. Coming back: ${got}.`,
    national: offer.fair === "fleece" ? "That is how you lose a locker room and the trade chart." : "The calls are getting sharper.",
    analytics: `Trade chart: ${tradeValueLabel(offer.fair)}. This trade's draft compensation is on your board; restructure dead money remains with the club that created it. Owner confidence ${formatSigned(swing)}.`,
  });
}

function doShop(state: SeasonState, playerId: string): SeasonState {
  if (state.phase !== "trade") throw new Error("The trade window is shut");
  if (state.shopUsed) throw new Error("You already shopped a name");
  const player = findPlayer(yourRoster(state), playerId);
  if (!player) throw new Error("Not on the roster");
  const rng = makeRng(hashSeed(state.seed, "shop", playerId));
  const from = state.directory.filter((t) => t.id !== state.teamId)[rng.int(state.directory.length - 1)];
  const outgoingValue = playerTradeValue(player);
  const pickRound = pickRoundClosestToValue(outgoingValue * 0.72);
  const fair = tradeFairness(pickTradeValue(pickRound), outgoingValue);
  state.shop = {
    id: `shop-${player.id}`,
    fromTeamId: from?.id ?? "SF",
    wantId: player.id,
    wantName: player.name,
    incoming: null,
    pickRound,
    pickYear: state.year + 1,
    blurb: `${from?.abbr ?? "A rival"} will give you a round ${pickRound} next year. No player coming back. Age, position, contract control, and draft value all shape the return. The chart calls this ${tradeValueLabel(fair).toLowerCase()}.`,
    fair,
  };
  state.shopUsed = true;
  return state;
}

function doShopResolve(state: SeasonState, accept: boolean): SeasonState {
  if (!state.shop) throw new Error("Nobody is bidding");
  const offer = state.shop;
  state.shop = null;
  if (accept) applyOffer(state, { ...offer, fair: offer.fair === "fleece" ? "fleece" : "fair" });
  else pushDecision(state, "Trade", `Kept ${offer.wantName}`, `Shopped ${offer.wantName} and kept him.`, 0);
  return state;
}

function beginDraft(state: SeasonState): SeasonState {
  if (state.phase !== "trade") throw new Error("Draft is not open");
  state.phase = "draft";
  state.prospects = makeProspects(state);
  state.draftPicks = makeDraftOrder(state);
  state.extraPicks = state.extraPicks.filter((pick) => pick.year > state.year || (pick.year === state.year && pick.round >= 4));
  state.draftCursor = 0;
  advanceCpu(state);
  state.headlines = makeHeadlines(state, "neutral", {
    beat: "The board is up. Your scout's grades and the truth are not the same list.",
    national: "Mock drafts are a hobby. This one counts.",
    analytics: "Perceived grades include scout error. Camp will show the real number.",
  });
  return state;
}

function makeProspects(state: SeasonState): Prospect[] {
  const rng = makeRng(hashSeed(state.seed, "draft", state.year));
  const scout = state.staff.scout;
  const accuracy = scout ? scout.development / 5 : 0.45;
  const error = Math.round((1 - accuracy) * 8);
  const prospects: Prospect[] = [];
  const nameCount = FIRSTS.length * LASTS.length;
  const nameOffset = makeRng(hashSeed(state.seed, "draft-names", state.year)).int(nameCount);
  const usedNames = new Set(yourRoster(state).map((player) => player.name.toLocaleLowerCase()));
  for (let i = 0; i < 110; i++) {
    const pos = POS_CYCLE[i % POS_CYCLE.length] ?? "WR";
    let trueOvr = 64 + rng.int(8);
    if (i < 10) trueOvr = 82 + rng.int(8);
    else if (i < 32) trueOvr = 75 + rng.int(8);
    else if (i < 70) trueOvr = 68 + rng.int(8);
    const noise = rng.int(error * 2 + 1) - error;
    const perceived = clamp(trueOvr + noise, 58, 99);
    let nameIndex = (nameOffset + i * 37) % nameCount;
    let name = `${FIRSTS[Math.floor(nameIndex / LASTS.length)]} ${LASTS[nameIndex % LASTS.length]}`;
    for (let attempt = 0; usedNames.has(name.toLocaleLowerCase()) && attempt < nameCount; attempt += 1) {
      nameIndex = (nameIndex + 1) % nameCount;
      name = `${FIRSTS[Math.floor(nameIndex / LASTS.length)]} ${LASTS[nameIndex % LASTS.length]}`;
    }
    usedNames.add(name.toLocaleLowerCase());
    // Keep the legacy draft RNG sequence stable so existing seeds retain ratings, ages, and colleges.
    rng.int(FIRSTS.length);
    rng.int(LASTS.length);
    prospects.push({
      id: `p-${state.year}-${i}-${name.replace(/\s/g, "")}`,
      name,
      pos,
      age: 21 + rng.int(3),
      college: COLLEGES[rng.int(COLLEGES.length)] ?? "State",
      trueOvr,
      perceived,
      blurb: `${pos} from ${COLLEGES[0]}. Scout card ${perceived}.`,
    });
  }
  prospects.forEach((p) => {
    p.blurb = `${p.pos} · ${p.college} · scout grade ${p.perceived}`;
  });
  return prospects.sort((a, b) => b.perceived - a.perceived);
}

function makeDraftOrder(state: SeasonState): DraftPick[] {
  const rng = makeRng(hashSeed(state.seed, "order", state.year));
  const ids = state.directory.map((t) => t.id);
  const ranked = ids
    .map((id) => ({
      id,
      power: teamRatings(state, id).off + teamRatings(state, id).def + rng.float(0, 1),
      priorWins: typeof state.flags[`draftWins:${id}`] === "number" ? Number(state.flags[`draftWins:${id}`]) : null,
      priorDiff: typeof state.flags[`draftDiff:${id}`] === "number" ? Number(state.flags[`draftDiff:${id}`]) : 0,
    }))
    .sort((a, b) => {
      if (a.priorWins !== null && b.priorWins !== null) return a.priorWins - b.priorWins || a.priorDiff - b.priorDiff || a.power - b.power;
      return a.power - b.power;
    })
    .map((t) => t.id);
  const picks: DraftPick[] = [];
  let overall = 1;
  for (let round = 1; round <= 3; round++) {
    ranked.forEach((teamId, slot) => {
      picks.push({ round, slot: slot + 1, overall, teamId });
      overall += 1;
    });
    for (const extra of state.extraPicks.filter((p) => p.year === state.year && p.round === round)) {
      picks.push({
        round,
        slot: ranked.length + 1,
        overall,
        teamId: state.teamId,
        note: extra.source ? `Acquired · ${extra.source}` : "Acquired in an earlier trade",
      });
      overall += 1;
    }
  }
  return picks;
}

function availableProspects(state: SeasonState): Prospect[] {
  const taken = new Set(state.draftPicks.map((p) => p.prospectId).filter(Boolean));
  return state.prospects.filter((p) => !taken.has(p.id) && p.perceived > 0);
}

function needs(roster: Player[]): Set<Pos> {
  const count: Partial<Record<Pos, number>> = {};
  for (const player of roster) count[player.pos] = (count[player.pos] ?? 0) + 1;
  const target: Partial<Record<Pos, number>> = { QB: 2, RB: 2, WR: 3, TE: 1, OL: 4, DL: 2, EDGE: 2, LB: 2, CB: 2, S: 2, K: 1 };
  const out = new Set<Pos>();
  (Object.keys(target) as Pos[]).forEach((pos) => {
    if ((count[pos] ?? 0) < (target[pos] ?? 1)) out.add(pos);
  });
  return out;
}

function cpuSelect(state: SeasonState, teamId: string): Prospect {
  const roster = state.teams[teamId]?.roster ?? [];
  const need = needs(roster);
  const pool = availableProspects(state);
  return (
    pool.slice().sort((a, b) => b.perceived + (need.has(b.pos) ? 3 : 0) - (a.perceived + (need.has(a.pos) ? 3 : 0)))[0] ??
    pool[0]
  );
}

function advanceCpu(state: SeasonState) {
  while (state.draftCursor < state.draftPicks.length && state.draftPicks[state.draftCursor]?.teamId !== state.teamId) {
    const pick = state.draftPicks[state.draftCursor];
    if (!pick) break;
    const prospect = cpuSelect(state, pick.teamId);
    if (prospect) assignPick(state, pick, prospect);
    state.draftCursor += 1;
  }
  if (state.draftCursor >= state.draftPicks.length) {
    finishDraft(state);
    return;
  }
  const pick = state.draftPicks[state.draftCursor];
  const already = state.flags[`trade-round-${pick?.round}`];
  if (!already && pick) {
    const rng = makeRng(hashSeed(state.seed, "dtrade", pick.overall));
    const later = state.draftPicks.filter((candidate) => candidate.round === pick.round && candidate.overall > pick.overall && candidate.teamId !== state.teamId);
    if (later.length > 0 && rng.next() < 0.55) {
      const target = later[Math.min(3 + rng.int(6), later.length - 1)];
      if (!target) return;
      const fromTeam = teamById(target.teamId, state.directory);
      state.pendingDraftTrade = {
        offer: `${fromTeam.abbr} wants your pick`,
        from: fromTeam.abbr,
        fromTeamId: target.teamId,
        targetOverall: target.overall,
        slotsBack: target.overall - pick.overall,
      };
    }
  }
}

function assignPick(state: SeasonState, pick: DraftPick, prospect: Prospect) {
  pick.prospectId = prospect.id;
  pick.prospectName = prospect.name;
  const team = state.teams[pick.teamId];
  if (team) {
    const player: Player = {
      id: `draft-${prospect.id}`,
      name: prospect.name,
      pos: prospect.pos,
      ovr: prospect.trueOvr,
      age: prospect.age,
      cap: Math.round((0.7 + (4 - pick.round) * 0.8) * salaryScale(state.capLimit) * 10) / 10,
      years: 4,
      potential: clamp(prospect.trueOvr + (prospect.age <= 22 ? 6 : 3), 60, 99),
      real: false,
      perceived: prospect.perceived,
      drafted: true,
    };
    team.roster.push(player);
  }
}

function doDraftTrade(state: SeasonState, accept: boolean): SeasonState {
  if (state.phase !== "draft" || !state.pendingDraftTrade) throw new Error("No trade on the clock");
  const offer = state.pendingDraftTrade;
  const pick = state.draftPicks[state.draftCursor];
  state.pendingDraftTrade = null;
  if (pick) state.flags[`trade-round-${pick.round}`] = true;
  if (!accept || !pick) {
    pushDecision(state, "Draft", "Stayed on the clock", "Declined a draft-day trade down.", 0);
    return state;
  }
  const jumps = state.draftPicks.filter((p) => p.round === pick.round && p.overall > pick.overall && p.teamId !== state.teamId);
  const target = offer.targetOverall
    ? jumps.find((candidate) => candidate.overall === offer.targetOverall)
    : jumps[Math.min(Math.max(0, offer.slotsBack - 1), jumps.length - 1)];
  if (target) {
    const theirTeam = target.teamId;
    target.teamId = state.teamId;
    pick.teamId = theirTeam;
    state.extraPicks.push({
      round: Math.min(3, pick.round + 1),
      year: state.year + 1,
      source: `Draft-day trade with ${offer.from}`,
    });
    pushDecision(state, "Draft", "Traded down", `Moved from pick ${pick.overall} to pick ${target.overall} in round ${pick.round} with ${offer.from} and added a future pick.`, 2);
  } else {
    pushDecision(state, "Draft", "Trade unavailable", "The trade-down partner no longer owned a later pick in this round, so no pick changed hands.", 0);
  }
  advanceCpu(state);
  return state;
}

function doDraft(state: SeasonState, prospectId: string): SeasonState {
  if (state.phase !== "draft") throw new Error("You are not on the clock");
  if (state.pendingDraftTrade) throw new Error("Answer the trade offer first");
  const pick = state.draftPicks[state.draftCursor];
  if (!pick || pick.teamId !== state.teamId) throw new Error("It is not your pick");
  const prospect = availableProspects(state).find((p) => p.id === prospectId);
  if (!prospect) throw new Error("That prospect is gone");
  assignPick(state, pick, prospect);
  const gap = prospect.trueOvr - prospect.perceived;
  bump(state, 0, gap >= 4 ? 1 : 0, 0);
  pushDecision(
    state,
    "Draft",
    prospect.name,
    `Round ${pick.round}: ${prospect.name}, ${prospect.pos}. Scout grade ${prospect.perceived}; the full grade reveals at camp.`,
    gap,
  );
  state.draftCursor += 1;
  state.headlines = makeHeadlines(state, gap >= 0 ? "positive" : "neutral", {
    beat: `${prospect.name} is a ${state.directory.find((t) => t.id === state.teamId)?.name ?? "team"} ${prospect.pos}.`,
    national: gap < -4 ? "The building clapped. The grade may not." : "A clean pick, at least on the card you can see.",
    analytics: `Scout grade ${prospect.perceived}. The full grade reveals at camp.`,
  });
  advanceCpu(state);
  return state;
}

function finishDraft(state: SeasonState) {
  const need = needs(yourRoster(state));
  const late: string[] = [];
  for (let i = 0; i < 4; i++) {
    const pool = availableProspects(state).sort(
      (a, b) => b.perceived + (need.has(b.pos) ? 3 : 0) - (a.perceived + (need.has(a.pos) ? 3 : 0)),
    );
    const prospect = pool[0];
    if (!prospect) break;
    state.prospects = state.prospects.map((p) => (p.id === prospect.id ? { ...p, perceived: -1 } : p));
    prospect.perceived = -1;
    const player: Player = {
      id: `draft-${prospect.id}`,
      name: prospect.name,
      pos: prospect.pos,
      ovr: prospect.trueOvr,
      age: prospect.age,
      cap: Math.round(0.9 * salaryScale(state.capLimit) * 10) / 10,
      years: 4,
      potential: prospect.trueOvr + 4,
      real: false,
      perceived: prospect.trueOvr,
      drafted: true,
    };
    yourRoster(state).push(player);
    const round = 4 + i;
    state.draftPicks.push({
      round,
      slot: i + 1,
      overall: Math.max(0, ...state.draftPicks.map((pick) => pick.overall)) + 1,
      teamId: state.teamId,
      prospectId: prospect.id,
      prospectName: prospect.name,
      note: "Staff auto-pick",
    });
    late.push(`Round ${round}: ${prospect.name} (${prospect.pos})`);
    need.delete(prospect.pos);
  }
  for (const extra of state.extraPicks.filter((pick) => pick.year === state.year && pick.round >= 4 && pick.round <= 7)) {
    const pool = availableProspects(state).sort(
      (a, b) => b.perceived + (need.has(b.pos) ? 3 : 0) - (a.perceived + (need.has(a.pos) ? 3 : 0)),
    );
    const prospect = pool[0];
    if (!prospect) break;
    state.prospects = state.prospects.map((candidate) => candidate.id === prospect.id ? { ...candidate, perceived: -1 } : candidate);
    prospect.perceived = -1;
    yourRoster(state).push({
      id: `draft-${prospect.id}`,
      name: prospect.name,
      pos: prospect.pos,
      ovr: prospect.trueOvr,
      age: prospect.age,
      cap: Math.round(0.9 * salaryScale(state.capLimit) * 10) / 10,
      years: 4,
      potential: prospect.trueOvr + 4,
      real: false,
      perceived: prospect.trueOvr,
      drafted: true,
    });
    state.draftPicks.push({
      round: extra.round,
      slot: state.draftPicks.filter((pick) => pick.round === extra.round).length + 1,
      overall: Math.max(0, ...state.draftPicks.map((pick) => pick.overall)) + 1,
      teamId: state.teamId,
      prospectId: prospect.id,
      prospectName: prospect.name,
      note: `Acquired · ${extra.source ?? "earlier trade"} · staff auto-pick`,
    });
    late.push(`Acquired round ${extra.round}: ${prospect.name} (${prospect.pos})`);
    need.delete(prospect.pos);
  }
  state.extraPicks = state.extraPicks.filter((pick) => pick.year > state.year);
  for (const team of Object.values(state.teams)) ensureMinimumRoster(state, team.id);
  state.phase = "camp";
  state.campCutIds = [];
  state.log.push(`Later rounds: ${late.join(", ")}.`);
  state.headlines = makeHeadlines(state, "neutral", {
    beat: `Camp opens with a roster that does not fit on the plane. You have to get to 26.`,
    national: "Cuts are where GMs find out which veterans have group chats.",
    analytics: `Rounds 4–7 staff picks: ${late.join(", ") || "none"}. Every addition is listed at camp.`,
  });
}

export function suggestedCuts(state: SeasonState): string[] {
  const roster = yourRoster(state);
  const extra = roster.length - 26;
  if (extra <= 0) return [];
  const minimums: Partial<Record<Pos, number>> = {
    QB: 2, RB: 2, WR: 3, TE: 1, OL: 3,
    DL: 2, EDGE: 2, LB: 2, CB: 3, S: 2, K: 1,
  };
  const keep = new Set<string>();
  const keptByPosition = new Map<Pos, number>();
  for (const [pos, minimum] of Object.entries(minimums) as [Pos, number][]) {
    roster
      .filter((player) => player.pos === pos)
      .sort((a, b) => b.ovr - a.ovr || a.cap - b.cap)
      .slice(0, minimum)
      .forEach((player) => {
        keep.add(player.id);
        keptByPosition.set(pos, (keptByPosition.get(pos) ?? 0) + 1);
      });
  }
  const target = Math.min(26, roster.length);
  const depth = roster
    .filter((player) => !keep.has(player.id))
    .sort((a, b) => {
      const value = (player: Player) => {
        if (player.pos === "K" && (keptByPosition.get("K") ?? 0) >= 1) return -100;
        const surplus = Math.max(0, (keptByPosition.get(player.pos) ?? 0) - (minimums[player.pos] ?? 0));
        const newDealProtection = state.flags[`signed:${player.id}`] === state.year ? 10 : 0;
        return player.ovr + newDealProtection - surplus * 4 - player.cap * 0.03;
      };
      return value(b) - value(a);
    });
  for (const player of depth) {
    if (keep.size >= target) break;
    if (player.pos === "K" && (keptByPosition.get("K") ?? 0) >= 1) continue;
    keep.add(player.id);
    keptByPosition.set(player.pos, (keptByPosition.get(player.pos) ?? 0) + 1);
  }
  if (keep.size < target) {
    roster.filter((player) => !keep.has(player.id)).slice(0, target - keep.size).forEach((player) => keep.add(player.id));
  }
  return roster.filter((player) => !keep.has(player.id)).map((player) => player.id);
}

function doCampSelection(state: SeasonState, cutIds: string[]): SeasonState {
  if (state.phase !== "camp") throw new Error("Camp cuts are not open");
  const rosterIds = new Set(yourRoster(state).map((player) => player.id));
  state.campCutIds = [...new Set(cutIds)].filter((id) => rosterIds.has(id));
  return state;
}

export function campCutDeadMoney(state: SeasonState, cutIds: string[]): number {
  const selected = new Set(cutIds);
  return Math.round(yourRoster(state)
    .filter((player) => selected.has(player.id))
    .reduce((total, player) => {
      if (player.origin === "replacement" || player.cap <= 1) return total;
      if (state.flags[`signed:${player.id}`] === state.year) return total + player.cap * 0.45;
      if (player.drafted) return total + player.cap * 0.15;
      return total + player.cap * 0.3;
    }, 0) * 10) / 10;
}

function doCamp(state: SeasonState, cutIds: string[]): SeasonState {
  if (state.phase !== "camp") throw new Error("Camp cuts are done");
  const roster = yourRoster(state);
  const unique = [...new Set(cutIds)];
  const remaining = roster.filter((p) => !unique.includes(p.id));
  const qbs = remaining.filter((p) => p.pos === "QB");
  if (remaining.length > 26 || remaining.length < 22 || qbs.length < 1) {
    throw new Error("The camp roster has to land between 22 and 26, with a quarterback");
  }
  const cut = roster.filter((p) => unique.includes(p.id));
  const addedDead = campCutDeadMoney(state, unique);
  state.teams[state.teamId].roster = remaining;
  state.deadMoney = Math.round((state.deadMoney + addedDead) * 10) / 10;
  persistActiveCapLiabilities(state);
  for (const player of cut) {
    if (player.ovr >= 84) queueRipple(state, Math.min(6, state.seasonLength), veteranRipple(player));
    if (player.ovr >= 80) bump(state, 0, -2, -2);
  }
  pushDecision(state, "Camp", `Cut ${cut.length}`, `Cut ${cut.map((p) => p.name).slice(0, 4).join(", ")}. Added ${formatMoney(addedDead)} in dead money.`, cut.some((p) => p.ovr >= 84) ? -2 : 0);
  state.phase = "regular";
  state.week = 1;
  prepareWeek(state);
  state.headlines = makeHeadlines(state, "neutral", {
    beat: `The roster is set at ${remaining.length}. Week 1 is a real game.`,
    national: "Camp reports are over. The standings start doing the talking.",
    analytics: `Camp releases added ${formatMoney(addedDead)} in dead money. Cap health ${capHealth(state)}. Chemistry ${state.meters.locker}.`,
  });
  return state;
}

function prepareWeek(state: SeasonState) {
  const rippleIndex = state.ripples.findIndex((r) => r.week === state.week);
  if (rippleIndex >= 0) {
    state.activeDecision = state.ripples[rippleIndex]?.decision ?? null;
    state.ripples.splice(rippleIndex, 1);
    return;
  }
  state.activeDecision = scriptedDecision(state);
}

function scriptedDecision(state: SeasonState): Decision | null {
  if (state.week === 1 && !state.ripples.length) return identityDecision();
  if (state.week === 1 && state.historicalId !== "1999-rams") return identityDecision();
  if (state.week === 4) return injuryDecision(state);
  if (state.week === 9) return ownerCheckpoint(state);
  if (state.week === 10) return deadlineDecision(state);
  if (state.week === 13) return extensionDecision(state);
  if (state.week === state.seasonLength - 1 && clinched(state)) return restDecision(state);
  return null;
}

function identityDecision(): Decision {
  return {
    id: "identity",
    kicker: "Week 1",
    title: "How aggressive is the offense?",
    body: "The coaches want a rule before the first series. It will show up in close games all year.",
    options: [
      { id: "balanced", label: "Stay balanced", detail: "Take the points. Take the shots when the math is real.", owner: 1, fans: 1, locker: 1, identity: "balanced", log: "Set a balanced fourth-down rule.", swing: 1 },
      { id: "aggressive", label: "Go for it", detail: "Fourth-and-short is a play, not a punt.", owner: 0, fans: 3, locker: 1, identity: "aggressive", log: "Told the staff to be aggressive on fourth down.", tag: "mod:0.6", swing: 1 },
      { id: "conservative", label: "Trust the defense and the kicker", detail: "Field position over heroics.", owner: 2, fans: -1, locker: 0, identity: "conservative", log: "Chose a conservative close-game plan.", tag: "mod:-0.2", swing: 1 },
    ],
  };
}

function injuryDecision(state: SeasonState): Decision | null {
  const player =
    yourRoster(state)
      .filter((p) => ["QB", "RB", "WR", "TE", "EDGE", "CB"].includes(p.pos) && p.ovr >= 78 && !p.injured)
      .sort((a, b) => b.ovr - a.ovr)[0] ?? yourRoster(state)[0];
  if (!player) return null;
  return {
    id: "injury",
    kicker: "Injury",
    title: `${player.name} is questionable`,
    body: `${player.name} can play at less than full speed or sit and keep the injury from becoming the season. The coaches want a decision before the injury report hardens.`,
    options: [
      { id: "play", label: `Play ${player.name}`, detail: "You need the snaps. You accept the risk.", owner: 1, fans: 2, locker: 1, log: `Played ${player.name} through the injury.`, tag: `playhurt:${player.id}`, swing: 1 },
      { id: "sit", label: `Sit ${player.name}`, detail: "A month is better than a year.", owner: 0, fans: -2, locker: 1, log: `Shut ${player.name} down for a few weeks.`, tag: `sit:${player.id}`, swing: 0 },
    ],
  };
}

function ownerCheckpoint(state: SeasonState): Decision {
  const record = teamRecord(state, state.teamId);
  const comfortablyAhead = record.wins >= record.losses + 2;
  const patienceOwner = state.owner.priority === "win" ? -2 : comfortablyAhead ? 1 : -1;
  return {
    id: "owner-check",
    kicker: "Midseason",
    title: `${state.owner.name} wants an answer`,
    body: `You are ${record.wins}-${record.losses}. The owner's priority is still ${priorityLabel(state.owner.priority).toLowerCase()}. This is the meeting that shows up in December if it goes badly.`,
    options: [
      { id: "patience", label: "Ask for patience", detail: "The plan needs the second half.", owner: patienceOwner, fans: -1, locker: 1, log: "Asked the owner for patience at midseason.", swing: patienceOwner },
      { id: "push", label: "Promise a harder push", detail: "You will spend and you will chase wins.", owner: state.owner.priority === "win" ? 2 : -1, fans: 2, locker: 0, log: "Promised the owner a harder second half.", tag: "mod:0.4", swing: 1 },
      { id: "standard", label: "Defend the standard, not the record", detail: "You will not torch the locker room to save a Tuesday.", owner: 0, fans: 0, locker: 2, log: "Defended the culture at the midseason meeting.", swing: 1 },
    ],
  };
}

function deadlineDecision(state: SeasonState): Decision | null {
  const roster = yourRoster(state).filter((p) => p.pos !== "QB" && p.ovr >= 75 && p.ovr <= 88);
  const player = roster.sort((a, b) => b.cap - a.cap)[0];
  if (!player) return null;
  const rng = makeRng(hashSeed(state.seed, "deadline", state.year));
  const from = state.directory.filter((t) => t.id !== state.teamId)[rng.int(10)];
  const round = player.ovr >= 84 ? 2 : 3;
  const valueGrade = tradeFairness(pickTradeValue(round), playerTradeValue(player));
  const youthBrief = state.owner.priority === "youth";
  return {
    id: "deadline",
    kicker: "Trade deadline",
    title: `${from?.abbr ?? "A rival"} calls about ${player.name}`,
    body: `The deadline is this afternoon. ${from?.city ?? "A rival"} will send a ${state.year + 1} round-${round} pick for ${player.name}. The trade chart rates this ${tradeValueLabel(valueGrade).toLowerCase()}. The owner's reaction below reflects the ${priorityLabel(state.owner.priority).toLowerCase()} brief, which is separate from the trade chart. After today the phones are props.`,
    options: [
      { id: "keep", label: `Keep ${player.name}`, detail: "You are trying to win the games on the schedule. Owner +1, fans +2, locker +2.", owner: 1, fans: 2, locker: 2, log: `Kept ${player.name} through the deadline.`, swing: 2 },
      { id: "deal", label: `Trade ${player.name} for a round ${round}`, detail: `Take the pick and the cap. Owner ${youthBrief ? "+4 because the brief prioritizes building young" : `−2 because the ${priorityLabel(state.owner.priority).toLowerCase()} brief does not reward selling low`}; fans −3, locker −2. Trade chart: ${tradeValueLabel(valueGrade)}.`, owner: youthBrief ? 4 : -2, fans: -3, locker: -2, log: `Traded ${player.name} at the deadline.`, tag: `deadline:${player.id}:${round}`, swing: -1 },
    ],
  };
}

function extensionDecision(state: SeasonState): Decision | null {
  const player = yourRoster(state)
    .filter((p) => p.years <= 1 && p.ovr >= 80 && p.pos !== "K" && state.flags[`signed:${p.id}`] !== state.year)
    .sort((a, b) => b.ovr - a.ovr)[0];
  if (!player) return null;
  const ask = Math.round(marketAsk(player, salaryScale(state.capLimit)) * 1.12 * 10) / 10;
  return {
    id: "extension",
    kicker: "Contract",
    title: `${player.name} wants it done`,
    body: `${player.name} is playing on a deal that ends soon and wants $${ask.toFixed(1)}M a year. Waiting is allowed. So is a trade conversation that will leak.`,
    options: [
      { id: "pay", label: `Pay $${ask.toFixed(1)}M`, detail: "Buy the peace and the player.", owner: state.owner.priority === "fiscal" ? -3 : 2, fans: 3, locker: 3, log: `Extended ${player.name}.`, tag: `extend:${player.id}:${ask}`, swing: 2 },
      { id: "wait", label: "Wait until the offseason", detail: "You will not negotiate against yourself in December.", owner: 1, fans: -1, locker: -2, log: `Tabled the ${player.name} extension.`, swing: 0 },
      { id: "shop", label: "Tell the agent you will listen to calls", detail: "This only requests an offer. You will review it before any trade is made.", owner: 0, fans: -2, locker: -3, log: `Asked the market for an offer on ${player.name}.`, tag: `shopstar:${player.id}`, swing: -2 },
    ],
  };
}

function restDecision(state: SeasonState): Decision {
  return {
    id: "rest",
    kicker: "Seeding",
    title: "You can rest people",
    body: `The ${state.year} postseason is in sight. Resting starters protects bodies and can cost a seed. The veterans have an opinion.`,
    options: [
      { id: "play", label: "Play the starters", detail: "Seeds matter. So does rhythm.", owner: 1, fans: 2, locker: 1, log: "Played the starters in the last push.", swing: 1 },
      { id: "rest", label: "Rest the core", detail: "January is the point of November.", owner: 0, fans: -1, locker: 2, log: "Rested starters down the stretch.", tag: "mod:-0.8", swing: 1 },
    ],
  };
}

function clinched(state: SeasonState): boolean {
  const you = teamRecord(state, state.teamId);
  return you.wins >= 10 || you.wins > you.losses + (state.seasonLength - state.week);
}

function doDecide(state: SeasonState, choiceId: string): SeasonState {
  const decision = state.activeDecision;
  if (!decision) throw new Error("Nothing to decide");
  const choice = decision.options.find((o) => o.id === choiceId);
  if (!choice) throw new Error("That is not an option");
  applyChoice(state, decision, choice);
  state.activeDecision = null;
  return state;
}

function applyChoice(state: SeasonState, decision: Decision, choice: Choice) {
  const beforeMeters = { ...state.meters };
  if (choice.identity) state.identity = choice.identity as Identity;
  if (choice.tag?.startsWith("mod:")) state.teamMod += Number(choice.tag.slice(4));
  if (choice.tag?.startsWith("playhurt:")) {
    const id = choice.tag.slice("playhurt:".length);
    const rng = makeRng(hashSeed(state.seed, "hurt", id, state.week));
    const player = findPlayer(yourRoster(state), id);
    if (player) {
      player.limited = true;
      state.flags[`aggravate-${id}`] = rng.next() < 0.35;
    }
  }
  if (choice.tag?.startsWith("sit:")) {
    const id = choice.tag.slice(4);
    const player = findPlayer(yourRoster(state), id);
    if (player) {
      player.injured = true;
      state.flags[`return-${id}`] = state.week + 3;
    }
  }
  if (choice.tag === "trim") {
    const victim = yourRoster(state).slice().sort((a, b) => a.ovr - b.ovr)[0];
    if (victim) {
      state.teams[state.teamId].roster = yourRoster(state).filter((p) => p.id !== victim.id);
      state.deadMoney += Math.round(victim.cap * 0.3 * 10) / 10;
      persistActiveCapLiabilities(state);
    }
  }
  if (choice.tag?.startsWith("deadline:")) {
    const [, id, roundRaw] = choice.tag.split(":");
    const roster = yourRoster(state);
    const player = roster.find((p) => p.id === id);
    if (player) {
      state.teams[state.teamId].roster = roster.filter((p) => p.id !== id);
      state.extraPicks.push({ round: Number(roundRaw), year: state.year + 1, source: `Deadline trade of ${player.name}` });
    }
  }
  if (choice.tag?.startsWith("extend:")) {
    const [, id, capRaw] = choice.tag.split(":");
    const player = findPlayer(yourRoster(state), id ?? "");
    if (player && capRaw) {
      player.cap = Number(capRaw);
      player.years = 3;
    }
  }
  if (choice.tag?.startsWith("shopstar:")) {
    const id = choice.tag.slice("shopstar:".length);
    const player = findPlayer(yourRoster(state), id);
    if (player) {
      const rng = makeRng(hashSeed(state.seed, "shopstar", state.year, player.id));
      const buyers = state.directory.filter((team) => team.id !== state.teamId);
      const from = buyers[rng.int(buyers.length)] ?? buyers[0];
      const round = player.ovr >= 88 ? 2 : 3;
      state.shop = {
        id: `contract-offer-${state.year}-${player.id}`,
        fromTeamId: from?.id ?? "SF",
        wantId: player.id,
        wantName: player.name,
        incoming: null,
        pickRound: round,
        pickYear: state.year + 1,
        blurb: `${from?.abbr ?? "A rival"} offers a ${state.year + 1} round ${round}. No player comes back. Accept or keep ${player.name}.`,
        fair: pickTradeValue(round) >= playerTradeValue(player) * 0.78 ? "fair" : "fleece",
      };
    }
  }
  bump(state, choice.owner ?? 0, choice.fans ?? 0, choice.locker ?? 0);
  pushDecision(state, decision.title, choice.label, choice.log, choice.swing ?? choice.owner ?? 0);
  state.headlines = makeHeadlines(state, (choice.owner ?? 0) + (choice.fans ?? 0) >= 0 ? "positive" : "negative", {
    beat: choice.log,
    national: `${gmSubject(state.gmName)} made a call: ${choice.label}.`,
    analytics: `Owner ${beforeMeters.owner} → ${state.meters.owner} (${meterEffect(beforeMeters.owner, state.meters.owner, choice.owner ?? 0, 96)}), fans ${beforeMeters.fans} → ${state.meters.fans} (${meterEffect(beforeMeters.fans, state.meters.fans, choice.fans ?? 0, 100)}), locker ${beforeMeters.locker} → ${state.meters.locker} (${meterEffect(beforeMeters.locker, state.meters.locker, choice.locker ?? 0, 96)}).`,
  });
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0";
}

function meterEffect(before: number, after: number, requested: number, ceiling: number): string {
  const applied = after - before;
  if (applied === requested) return formatSigned(requested);
  const boundary = requested > 0 && after === ceiling
    ? `, capped at ${ceiling}`
    : requested < 0 && after === 0
      ? ", stopped at 0"
      : "";
  return `${formatSigned(applied)} applied; ${formatSigned(requested)} requested${boundary}`;
}

function heal(state: SeasonState) {
  for (const player of yourRoster(state)) {
    const back = state.flags[`return-${player.id}`];
    if (typeof back === "number" && state.week >= back) {
      player.injured = false;
      delete state.flags[`return-${player.id}`];
    }
  }
}

function resolveLimitedPlayers(state: SeasonState) {
  for (const player of yourRoster(state).filter((candidate) => candidate.limited)) {
    const aggravated = state.flags[`aggravate-${player.id}`] === true;
    player.limited = false;
    delete state.flags[`aggravate-${player.id}`];
    if (aggravated) {
      player.injured = true;
      state.flags[`return-${player.id}`] = state.week + 3;
      state.log.push(`${player.name} played at reduced effectiveness and aggravated the injury; projected return Week ${state.week + 3}.`);
    } else {
      state.log.push(`${player.name} played at reduced effectiveness and came through the week without an aggravation.`);
    }
  }
}

export function unusedCapUnderReview(state: SeasonState): boolean {
  return state.capMode === "hard" && capSpace(state) / Math.max(1, state.capLimit) >= UNUSED_CAP_REVIEW_RATIO;
}

export function ownerGameChange(state: SeasonState, won: boolean, margin: number): { delta: number; reasons: string[] } {
  if (won) return { delta: 1, reasons: ["win +1"] };
  const reasons = ["loss −3"];
  let delta = -3;
  const bestQuarterback = yourRoster(state).filter((player) => player.pos === "QB").sort((a, b) => b.ovr - a.ovr)[0];
  if (!bestQuarterback || bestQuarterback.ovr < 70) {
    delta -= 1;
    reasons.push("unresolved QB −1");
  }
  const capReviewWeek = state.week % 4 === 0 || state.week === state.seasonLength;
  if (unusedCapUnderReview(state) && capReviewWeek) {
    delta -= 1;
    reasons.push("quarterly unused-cap review −1");
  }
  if (margin <= -14) {
    delta -= 1;
    reasons.push("blowout −1");
  }
  return { delta, reasons };
}

function doPlayWeek(state: SeasonState): SeasonState {
  if (state.phase !== "regular") throw new Error("The regular season is not live");
  if (state.activeDecision) throw new Error("There is a decision on the desk");
  if (state.shop) throw new Error("Review the trade offer before playing the next week");
  if (state.results.some((g) => g.round === "regular" && g.week === state.week && (g.home === state.teamId || g.away === state.teamId))) {
    throw new Error("That week is already on the books");
  }
  heal(state);
  const games = state.schedule.filter((g) => g.week === state.week);
  let yours: { opp: string; score: string; won: boolean } | null = null;
  for (const game of games) {
    const played = simulateMatch(state, game.home, game.away, `w${state.week}`);
    const result = { week: state.week, round: "regular", ...played };
    state.results.push(result);
    recordUserPlayerStats(state, result, `regular-${state.week}`);
    applyScore(state, played.home, played.away, played.homeScore, played.awayScore);
    if (game.home === state.teamId || game.away === state.teamId) {
      const won = game.home === state.teamId ? played.homeScore > played.awayScore : played.awayScore > played.homeScore;
      const oppId = game.home === state.teamId ? game.away : game.home;
      const yoursScore = game.home === state.teamId ? played.homeScore : played.awayScore;
      const oppScore = game.home === state.teamId ? played.awayScore : played.homeScore;
      yours = {
        opp: teamById(oppId, state.directory).abbr,
        score: `${yoursScore}-${oppScore}`,
        won,
      };
      const margin = yoursScore - oppScore;
      const ownerChange = ownerGameChange(state, won, margin);
      const ownerBeforeGame = state.meters.owner;
      bump(state, ownerChange.delta, won ? 2 : -2, won ? 1 : -1);
      if (margin >= 14) bump(state, 0, 1, 1);
      if (margin <= -14) bump(state, 0, -1, -1);
      state.flags[`owner-week:${state.week}`] = ownerChange.reasons.join(", ");
      state.flags[`owner-week-before:${state.week}`] = ownerBeforeGame;
      state.flags[`owner-week-requested:${state.week}`] = ownerChange.delta;
    }
  }
  resolveLimitedPlayers(state);
  if (yours) {
    const rng = makeRng(hashSeed(state.seed, "hl", state.week));
    state.headlines = resultHeadlines(state, yours.won, yours.score, yours.opp, rng);
    const ownerReasons = String(state.flags[`owner-week:${state.week}`] ?? "result processed");
    const ownerBeforeGame = Number(state.flags[`owner-week-before:${state.week}`] ?? state.meters.owner);
    const ownerRequested = Number(state.flags[`owner-week-requested:${state.week}`] ?? state.meters.owner - ownerBeforeGame);
    const ownerApplied = state.meters.owner - ownerBeforeGame;
    const ownerExplanation = ownerApplied === ownerRequested
      ? ownerReasons
      : `${ownerReasons}; ${meterEffect(ownerBeforeGame, state.meters.owner, ownerRequested, 96)}`;
    const analytics = state.headlines.find((headline) => headline.outlet === "analytics");
    if (analytics) analytics.text = `Week ${state.week}: owner confidence ${ownerBeforeGame} → ${state.meters.owner}. ${ownerExplanation}.`;
    state.log.push(`${yours.won ? "Beat" : "Lost to"} ${yours.opp} ${yours.score}.`);
    state.log.push(`Owner confidence ${ownerBeforeGame} → ${state.meters.owner}: ${ownerExplanation}.`);
  }
  if (state.meters.owner <= FIRING_THRESHOLD) return state;
  if (state.week >= state.seasonLength) return startPlayoffs(state);
  state.week += 1;
  prepareWeek(state);
  return state;
}

function expectedPoints(off: number, def: number): number {
  return clamp(15 + (off - def) * 0.58 + (off - 78) * 0.15, 8, 38);
}

const LADDER = [0, 3, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 44, 45];

function snapScore(n: number): number {
  let best = 0;
  let dist = 99;
  for (const score of LADDER) {
    const d = Math.abs(score - n);
    if (d < dist) {
      dist = d;
      best = score;
    }
  }
  return best;
}

function simulateMatch(state: SeasonState, home: string, away: string, key: string) {
  const rng = makeRng(hashSeed(state.seed, state.year, key, home, away));
  const hr = teamRatings(state, home);
  const ar = teamRatings(state, away);
  const postseason = !key.startsWith("w");
  const variance = state.mode === "historical" ? 22 : postseason ? 12 : 18;
  const noise = () => (rng.next() + rng.next() + rng.next() - 1.5) * variance;
  let homeScore = snapScore(expectedPoints(hr.off, ar.def) + 1.6 + noise());
  let awayScore = snapScore(expectedPoints(ar.off, hr.def) + noise());
  if (postseason && state.mode !== "historical") {
    homeScore = Math.max(3, homeScore);
    awayScore = Math.max(3, awayScore);
  }
  if (homeScore === awayScore) {
    const lean = 0.5 + (hr.off + hr.def - ar.off - ar.def) / 80;
    if (rng.next() < lean) homeScore += 3;
    else awayScore += 3;
  }
  return { home, away, homeScore, awayScore };
}

function applyScore(state: SeasonState, home: string, away: string, hs: number, as: number) {
  const h = state.teams[home];
  const a = state.teams[away];
  if (!h || !a) return;
  h.pf += hs;
  h.pa += as;
  a.pf += as;
  a.pa += hs;
  if (hs > as) {
    h.wins += 1;
    a.losses += 1;
  } else {
    a.wins += 1;
    h.losses += 1;
  }
}

export function teamRecord(state: SeasonState, teamId: string) {
  const team = state.teams[teamId];
  return {
    wins: team?.wins ?? 0,
    losses: team?.losses ?? 0,
    pf: team?.pf ?? 0,
    pa: team?.pa ?? 0,
  };
}

export interface StandingRow extends TeamInfo {
  wins: number;
  losses: number;
  pf: number;
  pa: number;
}

export function standings(state: SeasonState): StandingRow[] {
  return state.directory
    .map((info) => ({ ...info, ...teamRecord(state, info.id) }))
    .sort(compareRecord);
}

function compareRecord(a: { wins: number; losses: number; pf: number; pa: number; id?: string }, b: typeof a) {
  if (a.wins !== b.wins) return b.wins - a.wins;
  const ad = a.pf - a.pa;
  const bd = b.pf - b.pa;
  if (ad !== bd) return bd - ad;
  return (a.id ?? "").localeCompare(b.id ?? "");
}

function startPlayoffs(state: SeasonState): SeasonState {
  const seeds: PlayoffState["seeds"] = { AFC: seedConf(state, "AFC"), NFC: seedConf(state, "NFC") };
  const inIt = [...seeds.AFC, ...seeds.NFC].some((s) => s.teamId === state.teamId);
  state.playoff = {
    round: "wildcard",
    seeds,
    pending: [],
    userAlive: inIt,
    champion: null,
    bye: false,
  };
  fillRound(state);
  if (!inIt) {
    state.flags.exitRound = "missed";
    simRemainingBracket(state);
    return toRecap(state);
  }
  state.phase = "playoffs";
  const seed = [...seeds.AFC, ...seeds.NFC].find((s) => s.teamId === state.teamId);
  state.headlines = makeHeadlines(state, "positive", {
    beat: `You are the ${seed?.seed} seed. The regular season is over and the building is still yours.`,
    national: "January football. Try not to waste it.",
    analytics: `Point differential ${teamRecord(state, state.teamId).pf - teamRecord(state, state.teamId).pa}.`,
  });
  return state;
}

function desiredSeeds(state: SeasonState): number {
  if (state.mode !== "historical") return 7;
  if (state.year < 1990) return 5;
  if (state.year < 2020) return 6;
  return 7;
}

function seedConf(state: SeasonState, conf: Conf): { teamId: string; seed: number }[] {
  const teams = state.directory.filter((t) => t.conf === conf);
  const divs = new Map<string, string[]>();
  for (const team of teams) {
    const list = divs.get(team.div) ?? [];
    list.push(team.id);
    divs.set(team.div, list);
  }
  const winners = [...divs.values()].map((ids) => ids.map((id) => ({ id, ...teamRecord(state, id) })).sort(compareRecord)[0]?.id).filter(Boolean) as string[];
  const rest = teams.map((t) => t.id).filter((id) => !winners.includes(id));
  const ordered = [
    ...winners.map((id) => ({ id, ...teamRecord(state, id) })).sort(compareRecord),
    ...rest.map((id) => ({ id, ...teamRecord(state, id) })).sort(compareRecord),
  ];
  const size = Math.min(desiredSeeds(state), ordered.length);
  return ordered.slice(0, size).map((row, index) => ({ teamId: row.id, seed: index + 1 }));
}

function fillRound(state: SeasonState) {
  const playoff = state.playoff;
  if (!playoff) return;
  const games: { home: string; away: string }[] = [];
  const byes = new Set<string>();
  (["AFC", "NFC"] as Conf[]).forEach((conf) => {
    const paired = pairSeeds(playoff.seeds[conf]);
    paired.byes.forEach((id) => byes.add(id));
    games.push(...paired.games);
  });
  if (playoff.seeds.AFC.length <= 1 && playoff.seeds.NFC.length <= 1) {
    const afc = playoff.seeds.AFC[0]?.teamId;
    const nfc = playoff.seeds.NFC[0]?.teamId;
    playoff.round = "superbowl";
    playoff.pending = afc && nfc ? [{ id: `sb-${afc}-${nfc}`, round: "superbowl", home: afc, away: nfc }] : [];
    playoff.bye = false;
    return;
  }
  playoff.pending = games.map((g) => ({
    id: `${playoff.round}-${g.home}-${g.away}`,
    round: playoff.round,
    home: g.home,
    away: g.away,
  }));
  playoff.bye = playoff.userAlive && !playoff.pending.some((g) => g.home === state.teamId || g.away === state.teamId);
  void byes;
}

function pairSeeds(seeds: { teamId: string; seed: number }[]): { games: { home: string; away: string }[]; byes: string[] } {
  const by = new Map(seeds.map((s) => [s.seed, s.teamId]));
  const n = seeds.length;
  const game = (better: number, worse: number) => {
    const home = by.get(better);
    const away = by.get(worse);
    return home && away ? [{ home, away }] : [];
  };
  if (n >= 7) return { byes: [by.get(1)].filter(Boolean) as string[], games: [...game(2, 7), ...game(3, 6), ...game(4, 5)] };
  if (n === 6) return { byes: [1, 2].map((s) => by.get(s)).filter(Boolean) as string[], games: [...game(3, 6), ...game(4, 5)] };
  if (n === 5) return { byes: [1, 2, 3].map((s) => by.get(s)).filter(Boolean) as string[], games: game(4, 5) };
  if (n === 4) return { byes: [], games: [...game(1, 4), ...game(2, 3)] };
  if (n === 3) return { byes: [by.get(1)].filter(Boolean) as string[], games: game(2, 3) };
  if (n === 2) return { byes: [], games: game(1, 2) };
  return { byes: [by.get(1)].filter(Boolean) as string[], games: [] };
}

function doPlayoff(state: SeasonState): SeasonState {
  if (state.phase !== "playoffs" || !state.playoff) throw new Error("You are not in the bracket");
  const playoff = state.playoff;
  for (const game of playoff.pending) {
    const played = simulateMatch(state, game.home, game.away, game.id);
    const result = { week: 0, round: game.round, ...played };
    state.results.push(result);
    recordUserPlayerStats(state, result, game.id);
    const winner = played.homeScore > played.awayScore ? played.home : played.away;
    const loser = winner === played.home ? played.away : played.home;
    if (state.teamId === winner) bump(state, 6, 5, 2);
    if (state.teamId === loser) {
      bump(state, -2, -2, -1);
      playoff.userAlive = false;
      state.flags.exitRound = game.round;
      state.log.push(`Season ended in the ${formatPlayoffRound(game.round)}: ${played.homeScore}-${played.awayScore}.`);
    }
    if (state.teamId === winner) state.log.push(`Won the ${formatPlayoffRound(game.round)} ${Math.max(played.homeScore, played.awayScore)}-${Math.min(played.homeScore, played.awayScore)}.`);
  }
  if (!playoff.userAlive) {
    simRemainingBracket(state);
    return toRecap(state);
  }
  advanceBracket(state);
  if (state.playoff?.champion) return toRecap(state);
  const next = state.playoff?.pending.find((g) => g.home === state.teamId || g.away === state.teamId);
  state.headlines = makeHeadlines(state, "positive", {
    beat: next ? `Next up: ${teamById(next.home === state.teamId ? next.away : next.home, state.directory).abbr}.` : "You have the bye. The other games will sort the path.",
    national: "Win or go home is not a metaphor this week.",
    analytics: `Still alive. Owner confidence ${state.meters.owner}.`,
  });
  return state;
}

function advanceBracket(state: SeasonState) {
  const playoff = state.playoff;
  if (!playoff) return;
  if (playoff.round === "superbowl") {
    const game = state.results.find((g) => g.round === "superbowl");
    if (game) {
      playoff.champion = game.homeScore > game.awayScore ? game.home : game.away;
      playoff.round = "done";
      if (playoff.champion === state.teamId) {
        state.flags.exitRound = "champion";
        bump(state, 10, 8, 4);
      } else if (playoff.userAlive) {
        state.flags.exitRound = "superbowl";
      }
    }
    return;
  }
  const nextSeeds: PlayoffState["seeds"] = { AFC: [], NFC: [] };
  (["AFC", "NFC"] as Conf[]).forEach((conf) => {
    const seeds = playoff.seeds[conf];
    const pendingIds = new Set(playoff.pending.filter((g) => seeds.some((s) => s.teamId === g.home || s.teamId === g.away)).map((g) => g.id));
    const winners: string[] = [];
    for (const result of state.results) {
      if (!pendingIds.has(`${result.round}-${result.home}-${result.away}`) && result.round !== playoff.round) continue;
      if (result.round !== playoff.round) continue;
      const involved = seeds.some((s) => s.teamId === result.home || s.teamId === result.away);
      if (!involved) continue;
      winners.push(result.homeScore > result.awayScore ? result.home : result.away);
    }
    const byeIds = seeds
      .map((s) => s.teamId)
      .filter((id) => !playoff.pending.some((g) => g.home === id || g.away === id) && seeds.some((s) => s.teamId === id));
    const alive = [...new Set([...byeIds, ...winners])];
    const ranked = alive
      .map((id) => ({ id, seed: seeds.find((s) => s.teamId === id)?.seed ?? 9, ...teamRecord(state, id) }))
      .sort((a, b) => a.seed - b.seed);
    nextSeeds[conf] = ranked.map((row, index) => ({ teamId: row.id, seed: index + 1 }));
  });
  playoff.seeds = nextSeeds;
  playoff.pending = [];
  const order: PlayoffState["round"][] = ["wildcard", "divisional", "conference", "superbowl", "done"];
  const idx = order.indexOf(playoff.round);
  playoff.round = order[Math.min(order.length - 1, idx + 1)] ?? "done";
  if (nextSeeds.AFC.length === 0 || nextSeeds.NFC.length === 0) {
    playoff.champion = nextSeeds.AFC[0]?.teamId ?? nextSeeds.NFC[0]?.teamId ?? null;
    playoff.round = "done";
    return;
  }
  fillRound(state);
}

function simRemainingBracket(state: SeasonState) {
  let guard = 0;
  while (state.playoff && !state.playoff.champion && guard++ < 12) {
    if (!state.playoff.pending.length) {
      advanceBracket(state);
      continue;
    }
    for (const game of state.playoff.pending) {
      if (state.results.some((r) => r.round === game.round && r.home === game.home && r.away === game.away)) continue;
      const played = simulateMatch(state, game.home, game.away, game.id);
      const result = { week: 0, round: game.round, ...played };
      state.results.push(result);
      recordUserPlayerStats(state, result, game.id);
    }
    const before = state.playoff.round;
    advanceBracket(state);
    if (state.playoff.round === before && state.playoff.round !== "done") break;
  }
}

function fire(state: SeasonState, reason: string) {
  state.phase = "fired";
  state.firedReason = reason;
  state.flags.exitRound = state.flags.exitRound ?? "missed";
  state.grade = buildGrade(state, true);
  state.headlines = makeHeadlines(state, "negative", {
    beat: `${state.owner.name} ends it. ${reason}`,
    national: `${gmSubject(state.gmName)} is out. The search will leak by dinner.`,
    analytics: `Final owner confidence ${state.meters.owner}. Record ${teamRecord(state, state.teamId).wins}-${teamRecord(state, state.teamId).losses}.`,
  });
  state.log.push("Fired.");
}

function toRecap(state: SeasonState): SeasonState {
  if (state.phase === "fired") return state;
  const record = teamRecord(state, state.teamId);
  const bestQuarterback = yourRoster(state).filter((player) => player.pos === "QB").sort((a, b) => b.ovr - a.ovr)[0];
  const ownerBeforeReview = state.meters.owner;
  const recapPenalties: string[] = [];
  if (record.wins <= 6 && unusedCapUnderReview(state)) {
    state.meters.owner = clamp(state.meters.owner - 5, 0, 100);
    recapPenalties.push("poor finish with at least 18% of the cap unused −5");
  }
  if (!bestQuarterback || bestQuarterback.ovr < 70) {
    state.meters.owner = clamp(state.meters.owner - 6, 0, 100);
    recapPenalties.push("unresolved starting quarterback −6");
  }
  if (record.wins <= 6) {
    const performancePenalty = 6 + (6 - record.wins) * 2 + (state.owner.priority === "win" ? 3 : 0);
    state.meters.owner = clamp(state.meters.owner - performancePenalty, 0, 100);
    recapPenalties.push(`${record.wins}-${record.losses} performance −${performancePenalty}`);
  }
  const reviewExplanation = recapPenalties.length ? recapPenalties.join("; ") : "no additional year-end penalty";
  state.flags["owner-year-end-review"] = `Owner year-end review ${ownerBeforeReview} → ${state.meters.owner}: ${reviewExplanation}.`;
  state.log.push(String(state.flags["owner-year-end-review"]));
  if (state.meters.owner <= FIRING_THRESHOLD) {
    fire(state, `A ${record.wins}-${record.losses} finish, unresolved roster needs, and lost owner confidence ended the job.`);
    return state;
  }
  state.phase = "recap";
  state.grade = buildGrade(state, false);
  const champ = state.playoff?.champion;
  state.headlines = makeHeadlines(state, state.grade.champ ? "positive" : "neutral", {
    beat: state.grade.champ ? "The building is still loud an hour after the game." : `Season over. ${state.grade.headline}`,
    national: champ
      ? champ === state.teamId
        ? `${teamLabel(teamById(champ, state.directory))} won the league title.`
        : state.grade.round === "superbowl"
          ? `${teamLabel(teamById(state.teamId, state.directory))} finished as Super Bowl runner-up to ${teamLabel(teamById(champ, state.directory))}.`
          : `League champion: ${teamLabel(teamById(champ, state.directory))}. ${
              state.grade.round === "missed"
                ? `${teamLabel(teamById(state.teamId, state.directory))} missed the playoffs.`
                : `${teamLabel(teamById(state.teamId, state.directory))}'s run ended in the ${state.grade.round === "wildcard" ? "Wild Card" : state.grade.round} round.`
            }`
      : "The league title is still being decided; your season is over.",
    analytics: `GM grade ${state.grade.letter} (${state.grade.score}). Owner year-end review ${ownerBeforeReview} → ${state.meters.owner}: ${reviewExplanation}.`,
  });
  return state;
}

function exitRound(state: SeasonState): PlayoffRound {
  const flag = state.flags.exitRound;
  if (flag === "champion" || flag === "superbowl" || flag === "conference" || flag === "divisional" || flag === "wildcard" || flag === "missed") {
    return flag;
  }
  return "missed";
}

function buildGrade(state: SeasonState, fired: boolean) {
  const record = teamRecord(state, state.teamId);
  const round = exitRound(state);
  const champ = round === "champion";
  const historical = state.mode === "historical";
  let score = (historical ? 48 : 60) + (record.wins - record.losses) * (historical ? 1.25 : 1.55);
  score += postseasonGradeBonus(round, historical);
  score += (state.meters.owner - 60) / 8;
  score += (state.meters.locker - 60) / 12;
  score += (capHealth(state) - 55) / 12;
  const bestQuarterback = yourRoster(state).filter((player) => player.pos === "QB").sort((a, b) => b.ovr - a.ovr)[0];
  if (record.wins <= 6 && unusedCapUnderReview(state)) score -= 8;
  if (!bestQuarterback || bestQuarterback.ovr < 70) score -= 6;
  if (historical && (!champ || record.wins < state.seasonLength)) score = Math.min(score, 92);
  if (fired) score = Math.min(score, 47);
  score = Math.round(clamp(score, 20, 99));
  const swings = state.decisions.slice().sort((a, b) => b.swing - a.swing);
  const best = swings[0]?.log ?? "You kept the building standing.";
  const worst = swings[swings.length - 1]?.log ?? "Nothing on the tape was fatal.";
  const headline = champ
    ? "A champion, and the roster still has a pulse."
    : fired
      ? "The season ended in the owner's office."
      : round === "missed"
        ? `${record.wins}-${record.losses} and a quiet January.`
        : `Out in the ${formatPlayoffRound(round)}.`;
  return {
    letter: letterFor(score),
    score,
    round,
    champ,
    wins: record.wins,
    losses: record.losses,
    pf: record.pf,
    pa: record.pa,
    headline,
    best,
    worst,
  };
}

function postseasonGradeBonus(round: PlayoffRound, historical: boolean): number {
  return historical
    ? { missed: 0, wildcard: 3, divisional: 5, conference: 8, superbowl: 12, champion: 18 }[round]
    : { missed: 0, wildcard: 4, divisional: 7, conference: 11, superbowl: 14, champion: 20 }[round];
}

function letterFor(score: number): string {
  if (score >= 93) return "A+";
  if (score >= 88) return "A";
  if (score >= 83) return "A-";
  if (score >= 78) return "B+";
  if (score >= 72) return "B";
  if (score >= 66) return "B-";
  if (score >= 60) return "C+";
  if (score >= 54) return "C";
  if (score >= 48) return "C-";
  if (score >= 42) return "D";
  return "F";
}

export function suggestAction(state: SeasonState): Action | null {
  if (state.phase === "recap" || state.phase === "fired") return null;
  if (state.phase === "intro") return { type: "intro", choice: "embrace" };
  if (state.phase === "staff") {
    const role = ROLES[state.staffStep] ?? "hc";
    const best = state.market[role]
      .slice()
      .sort((a, b) => staffScore(b, state.owner.priority) - staffScore(a, state.owner.priority))[0];
    return best ? { type: "hire", id: best.id } : null;
  }
  if (state.phase === "cap") {
    if (state.capMode === "hard" && capSpace(state) < 0) {
      const roster = yourRoster(state);
      const restructured = new Set(state.restructuredIds ?? []);
      const big = roster
        .filter((player) => player.years > 0 && !restructured.has(player.id))
        .sort((a, b) => b.cap - a.cap)[0];
      if (big && big.cap > 2) return { type: "cap", choice: "restructure", playerId: big.id };
      const cut = roster.filter((player) => player.years > 0).sort((a, b) => a.ovr - b.ovr)[0];
      return { type: "cap", choice: "cut", playerId: cut?.id };
    }
    return { type: "cap", choice: "hold" };
  }
  if (state.phase === "fa") {
    if (state.faWave === 1) {
      const contracted = yourRoster(state).filter((player) => player.years > 0);
      const need = needs(contracted);
      const ownFit = state.faBoard
        .filter((player) => player.origin === state.teamId && (state.capMode === "payroll" || player.cap <= capSpace(state) - 3))
        .sort((a, b) => {
          const aValue = a.ovr + (need.has(a.pos) ? 14 : 0) - a.cap * 0.08;
          const bValue = b.ovr + (need.has(b.pos) ? 14 : 0) - b.cap * 0.08;
          return bValue - aValue;
        });
      const core = ownFit.find((player) => need.has(player.pos) || player.ovr >= 76);
      if (core && (need.has(core.pos) || contracted.length < 24)) return { type: "sign", playerId: core.id };
    }
    const fit = state.faBoard
      .filter((p) => p.ovr >= 83 && (state.capMode === "payroll" || p.cap <= capSpace(state) - 3))
      .sort((a, b) => b.ovr - a.ovr)[0];
    if (fit) return { type: "sign", playerId: fit.id };
    return { type: "next-wave" };
  }
  if (state.phase === "trade") {
    if (state.shop) return { type: "shop-resolve", accept: false };
    const bargain = state.tradeOffers.find((o) => o.fair === "bargain");
    if (bargain) return { type: "trade", offerId: bargain.id, accept: true };
    const next = state.tradeOffers[0];
    if (next) return { type: "trade", offerId: next.id, accept: false };
    return { type: "trade-done" };
  }
  if (state.phase === "draft") {
    if (state.pendingDraftTrade) return { type: "draft-trade", accept: false };
    const need = needs(yourRoster(state));
    const pick = availableProspects(state).sort(
      (a, b) => b.perceived + (need.has(b.pos) ? 4 : 0) - (a.perceived + (need.has(a.pos) ? 4 : 0)),
    )[0];
    return pick ? { type: "draft", prospectId: pick.id } : { type: "draft", prospectId: "missing" };
  }
  if (state.phase === "camp") return { type: "camp", cutIds: suggestedCuts(state) };
  if (state.phase === "regular") {
    if (state.shop) return { type: "shop-resolve", accept: false };
    if (state.activeDecision) return { type: "decide", choiceId: state.activeDecision.options[0]?.id ?? "balanced" };
    return { type: "play-week" };
  }
  if (state.phase === "playoffs") return { type: "playoff" };
  return null;
}

function staffScore(member: StaffMember, priority: string): number {
  let score = member.leadership + member.culture + member.development;
  if (priority === "win") score += member.aggression * 2;
  if (priority === "youth") score += member.development * 2;
  if (priority === "culture") score += member.culture * 2;
  if (priority === "fiscal") score += (4 - member.cost) * 2;
  if (priority === "stars") score += member.cost;
  return score;
}

export function simulateUntil(
  state: SeasonState,
  until: "playoffs" | "recap",
  options: { stopAtDecision?: boolean } = {},
): SeasonState {
  let current = state;
  for (let i = 0; i < 300; i++) {
    if (current.phase === "fired" || current.phase === "recap") return current;
    if (until === "playoffs" && current.phase === "playoffs") return current;
    if (options.stopAtDecision && current.phase === "regular" && (current.activeDecision || current.shop)) return current;
    const action = suggestAction(current);
    if (!action || action.type === "sim") return current;
    current = applyAction(current, action);
  }
  return current;
}

export function weekMatchup(state: SeasonState) {
  return state.schedule.find((g) => g.week === state.week && (g.home === state.teamId || g.away === state.teamId)) ?? null;
}

export function divisionTable(state: SeasonState): StandingRow[] {
  const you = teamById(state.teamId, state.directory);
  return standings(state).filter((t) => t.conf === you.conf && t.div === you.div);
}

export function rolloverSeason(state: SeasonState): SeasonState {
  const next = clone(state);
  persistActiveCapLiabilities(next);
  const currentDeadCleared = state.deadMoney;
  const pushedDeadBecomingCurrent = state.futureDead;
  const previous = {
    wins: state.grade?.wins ?? teamRecord(state, state.teamId).wins,
    losses: state.grade?.losses ?? teamRecord(state, state.teamId).losses,
    round: state.grade?.round ?? exitRound(state),
  };
  const rng = makeRng(hashSeed(state.seed, "age", state.year + 1));
  const priorDraftOrder = Object.fromEntries(Object.entries(state.teams).map(([id, team]) => [id, { wins: team.wins, diff: team.pf - team.pa }]));
  next.year += 1;
  next.phase = "intro";
  next.week = 1;
  next.staffStep = ROLES.length;
  next.results = [];
  next.playerStats = {};
  next.statsTrackingStartedWeek = 1;
  next.playoff = null;
  next.grade = null;
  next.firedReason = null;
  next.activeDecision = null;
  next.ripples = [];
  next.faBoard = [];
  next.faPool = [];
  next.faWave = 1;
  next.restructuredIds = [];
  next.franchiseTagUsed = false;
  next.tradeOffers = [];
  next.shop = null;
  next.shopUsed = false;
  next.prospects = [];
  next.draftPicks = [];
  next.draftCursor = 0;
  next.pendingDraftTrade = null;
  next.decisions = [];
  next.walked = [];
  next.teamCapLiabilities = Object.fromEntries(Object.entries(next.teamCapLiabilities ?? {}).map(([teamId, liability]) => [
    teamId,
    { deadMoney: Math.round(liability.futureDead * 10) / 10, futureDead: 0 },
  ]));
  const activeLiability = next.teamCapLiabilities[next.teamId] ?? { deadMoney: 0, futureDead: 0 };
  next.deadMoney = activeLiability.deadMoney;
  next.futureDead = activeLiability.futureDead;
  next.teamMod = 0;
  next.capLimit = Math.round(next.capLimit * 1.05 * 10) / 10;
  next.meters.owner = clamp(Math.round(next.meters.owner * 0.7 + 66 * 0.3), 35, 90);
  next.meters.fans = clamp(Math.round(next.meters.fans * 0.8 + 58 * 0.2), 30, 90);
  next.meters.locker = clamp(Math.round(next.meters.locker * 0.85 + 64 * 0.15), 30, 90);
  for (const team of Object.values(next.teams)) {
    team.wins = 0;
    team.losses = 0;
    team.pf = 0;
    team.pa = 0;
    if (team.lockOff && team.roster.length === 0) {
      team.lockOff = clamp((team.lockOff ?? 75) + rng.int(3) - 1, 62, 94);
      team.lockDef = clamp((team.lockDef ?? 75) + rng.int(3) - 1, 62, 94);
      continue;
    }
    for (const player of team.roster) {
      player.age += 1;
      player.years -= 1;
      player.injured = false;
      player.limited = false;
      if (player.age <= 25 && player.potential > player.ovr) player.ovr = Math.min(99, player.ovr + 1);
      else if (player.age >= 35) {
        const decline = player.pos === "QB" || player.pos === "K" ? 1 : player.pos === "OL" || player.pos === "DL" ? 2 : 3;
        player.ovr = Math.max(60, player.ovr - decline);
      }
      else if (player.age >= 33) player.ovr = Math.max(60, player.ovr - (player.pos === "RB" ? 3 : 2));
      else if (player.age >= 30 && rng.next() > 0.55) player.ovr = Math.max(62, player.ovr - 1);
    }
    team.roster = team.roster.filter((p) => p.years >= 0 && p.age < 39 && p.ovr >= 60);
    ensureMinimumRoster(next, team.id);
  }
  next.extraPicks = next.extraPicks.filter((pick) => pick.year >= next.year);
  next.schedule = buildSchedule(
    next.directory.map((t) => t.id),
    next.seasonLength,
    hashSeed(next.seed, next.year),
  );
  next.flags = { plan: state.flags.plan ?? "balance" };
  for (const [id, record] of Object.entries(priorDraftOrder)) {
    next.flags[`draftWins:${id}`] = record.wins;
    next.flags[`draftDiff:${id}`] = record.diff;
  }
  next.owner.note = ownerNote(next.owner.priority, next.year, previous);
  next.log = [
    `${next.year}: ${next.owner.name} wants the plan again.`,
    `Cap rollover: ${formatMoney(currentDeadCleared)} of prior current-year dead money cleared; ${formatMoney(pushedDeadBecomingCurrent)} of pushed money became this year's dead charge.`,
    `Owner confidence moved from ${state.meters.owner} to ${next.meters.owner} in the offseason reset toward the league baseline.`,
  ];
  next.headlines = makeHeadlines(next, "neutral", {
    beat: `Year ${next.year}. The owner already has a version of this meeting on the calendar.`,
    national: `${gmSubject(next.gmName)} is back. The roster is a year older and the cap moved.`,
    analytics: `Cap ${formatMoney(next.capLimit)}. Prior dead cleared ${formatMoney(currentDeadCleared)}; pushed money now charged ${formatMoney(next.deadMoney)}. Owner confidence reset ${state.meters.owner} → ${next.meters.owner}.`,
  });
  return next;
}

export function ensureMinimumRoster(state: SeasonState, teamId: string): Player[] {
  const team = state.teams[teamId];
  if (!team || (team.roster.length === 0 && team.lockOff)) return [];
  const added: Player[] = [];
  const add = (pos: Pos) => {
    const index = team.roster.length;
    const ovr = teamId === state.teamId ? 60 : 66;
    const nameRng = makeRng(hashSeed(state.seed, "replacement-name", teamId, state.year, index));
    let name = `${FIRSTS[nameRng.int(FIRSTS.length)]} ${LASTS[nameRng.int(LASTS.length)]}`;
    for (let attempt = 0; team.roster.some((player) => player.name === name) && attempt < FIRSTS.length * LASTS.length; attempt += 1) {
      name = `${FIRSTS[nameRng.int(FIRSTS.length)]} ${LASTS[nameRng.int(LASTS.length)]}`;
    }
    const player: Player = {
      id: `replacement-${teamId}-${state.year}-${index}`,
      name,
      pos,
      ovr,
      age: 24,
      cap: Math.round(0.9 * salaryScale(state.capLimit) * 10) / 10,
      years: 1,
      potential: ovr + 2,
      real: false,
      origin: "replacement",
    };
    team.roster.push(player);
    added.push(player);
  };
  if (!team.roster.some((player) => player.pos === "QB")) add("QB");
  while (team.roster.length < MIN_ROSTER) add(POS_CYCLE[team.roster.length % POS_CYCLE.length] ?? "LB");
  if (added.length && teamId === state.teamId) {
    state.log.push(`Emergency roster pool added ${added.length} player${added.length === 1 ? "" : "s"} before camp.`);
  }
  return added;
}

export function seasonDrivers(state: SeasonState): string[] {
  const record = teamRecord(state, state.teamId);
  const pointDifferential = record.pf - record.pa;
  const roster = yourRoster(state);
  const bestQuarterback = roster.filter((player) => player.pos === "QB").sort((a, b) => b.ovr - a.ovr)[0];
  const injured = roster.filter((player) => player.injured).length;
  const space = capSpace(state);
  const drivers: string[] = [];

  drivers.push(`Point differential: ${pointDifferential > 0 ? "+" : ""}${pointDifferential} across a ${record.wins}-${record.losses} record.`);
  const recordGrade = (record.wins - record.losses) * (state.mode === "historical" ? 1.25 : 1.55);
  const playoffGrade = postseasonGradeBonus(exitRound(state), state.mode === "historical");
  drivers.push(`Grade rubric: the regular-season record contributes ${recordGrade >= 0 ? "+" : ""}${recordGrade.toFixed(1)} and the playoff finish contributes +${playoffGrade}, before owner, locker-room, and cap adjustments.`);
  if (!bestQuarterback || bestQuarterback.ovr < 70) {
    drivers.push(`Quarterback plan: ${bestQuarterback ? `${bestQuarterback.name} was the top remaining QB at ${bestQuarterback.ovr} overall` : "no quarterback remained on the roster"}.`);
  } else {
    drivers.push(`Quarterback plan: ${bestQuarterback.name} led the room at ${bestQuarterback.ovr} overall.`);
  }
  if (state.capMode === "hard") {
    const timing = state.phase === "fired" ? "when the job ended" : "at season end";
    drivers.push(`Cap use: ${formatMoney(space)} remained ${timing}${record.wins <= 6 && space >= 25 ? " despite six or fewer wins" : ""}.`);
  }
  if (injured) drivers.push(`Availability: ${injured} roster player${injured === 1 ? " was" : "s were"} injured at the finish.`);
  if (typeof state.flags["owner-year-end-review"] === "string") drivers.push(String(state.flags["owner-year-end-review"]));
  drivers.push(`Owner confidence finished at ${state.meters.owner}; locker-room confidence finished at ${state.meters.locker}.`);
  return drivers.slice(0, 7);
}

export function advancedLines(state: SeasonState) {
  const record = teamRecord(state, state.teamId);
  const games = Math.max(1, record.wins + record.losses);
  const pyth =
    record.pf === 0 && record.pa === 0
      ? 0
      : record.pa === 0
        ? games
        : games * (1 / (1 + Math.pow(record.pa / Math.max(1, record.pf), 2.37)));
  const roster = yourRoster(state);
  const byPos = new Map<string, number>();
  for (const player of roster) byPos.set(player.pos, (byPos.get(player.pos) ?? 0) + player.ovr);
  return {
    pythWins: Math.round(pyth * 10) / 10,
    diff: record.pf - record.pa,
    games,
    cap: capSpace(state),
    dead: state.deadMoney,
    health: capHealth(state),
    rosterValue: roster.reduce((sum, p) => sum + p.ovr, 0),
    top: roster.slice().sort((a, b) => b.cap - a.cap).slice(0, 5),
    byPos: [...byPos.entries()],
  };
}
