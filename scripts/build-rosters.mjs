/**
 * Build lib/data/rosters.json from an nflverse roster CSV.
 *
 * Usage:
 *   node scripts/build-rosters.mjs /path/to/roster_2026.csv
 *
 * The committed JSON is the game's roster source. Re-run this when you want
 * a newer public snapshot. Cap hits are estimates scaled to a projected cap,
 * not official contract numbers.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/build-rosters.mjs roster.csv");
  process.exit(1);
}

const CAP = 322;
const LEAGUE_YEAR = 2027;
const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../lib/data/rosters.json",
);

const TEAM_MAP = { LA: "LAR" };

const KEEP = {
  QB: 2,
  RB: 2,
  WR: 4,
  TE: 2,
  OL: 5,
  DL: 3,
  EDGE: 2,
  LB: 3,
  CB: 3,
  S: 2,
  K: 1,
};

const CAP_MULT = {
  QB: 1.7,
  EDGE: 1.15,
  WR: 1.05,
  DL: 1.0,
  CB: 0.95,
  OL: 0.9,
  LB: 0.78,
  S: 0.75,
  TE: 0.72,
  RB: 0.55,
  K: 0.25,
};

/** Name -> [position group, overall]. Applied only when the grouped position matches. */
const STARS = {
  "Patrick Mahomes": ["QB", 99],
  "Josh Allen": ["QB", 97],
  "Lamar Jackson": ["QB", 96],
  "Joe Burrow": ["QB", 95],
  "Jalen Hurts": ["QB", 93],
  "Justin Herbert": ["QB", 91],
  "Jordan Love": ["QB", 89],
  "C.J. Stroud": ["QB", 88],
  "Jared Goff": ["QB", 88],
  "Brock Purdy": ["QB", 87],
  "Baker Mayfield": ["QB", 86],
  "Matthew Stafford": ["QB", 86],
  "Dak Prescott": ["QB", 85],
  "Jayden Daniels": ["QB", 88],
  "Caleb Williams": ["QB", 84],
  "Bo Nix": ["QB", 84],
  "Drake Maye": ["QB", 86],
  "Trevor Lawrence": ["QB", 84],
  "Kyler Murray": ["QB", 84],
  "Tua Tagovailoa": ["QB", 82],
  "Aaron Rodgers": ["QB", 78],
  "Justin Jefferson": ["WR", 98],
  "Ja'Marr Chase": ["WR", 97],
  "CeeDee Lamb": ["WR", 95],
  "Amon-Ra St. Brown": ["WR", 94],
  "Puka Nacua": ["WR", 94],
  "A.J. Brown": ["WR", 92],
  "Malik Nabers": ["WR", 91],
  "Drake London": ["WR", 90],
  "Garrett Wilson": ["WR", 90],
  "Davante Adams": ["WR", 88],
  "Mike Evans": ["WR", 87],
  "Cooper Kupp": ["WR", 82],
  "Travis Kelce": ["TE", 88],
  "George Kittle": ["TE", 91],
  "Trey McBride": ["TE", 93],
  "Brock Bowers": ["TE", 93],
  "Sam LaPorta": ["TE", 89],
  "Derrick Henry": ["RB", 90],
  "Saquon Barkley": ["RB", 94],
  "Christian McCaffrey": ["RB", 91],
  "Bijan Robinson": ["RB", 93],
  "Jahmyr Gibbs": ["RB", 93],
  "Jonathan Taylor": ["RB", 91],
  "Myles Garrett": ["EDGE", 98],
  "T.J. Watt": ["EDGE", 96],
  "Micah Parsons": ["EDGE", 97],
  "Nick Bosa": ["EDGE", 94],
  "Maxx Crosby": ["EDGE", 95],
  "Aidan Hutchinson": ["EDGE", 93],
  "Chris Jones": ["DL", 94],
  "Fred Warner": ["LB", 95],
  "Roquan Smith": ["LB", 93],
  "Pat Surtain II": ["CB", 97],
  "Sauce Gardner": ["CB", 94],
  "Kyle Hamilton": ["S", 95],
  "Derwin James": ["S", 91],
  "Trent Williams": ["OL", 95],
  "Penei Sewell": ["OL", 96],
  "Creed Humphrey": ["OL", 93],
  "Quinnen Williams": ["DL", 92],
  "Leonard Williams": ["DL", 86],
};

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function groupPos(depth, position) {
  const d = depth || position;
  if (d === "QB") return "QB";
  if (d === "RB" || d === "FB") return "RB";
  if (d === "WR") return "WR";
  if (d === "TE") return "TE";
  if (d === "T" || d === "G" || d === "C") return "OL";
  if (d === "DT" || d === "DE" || d === "NT") return "DL";
  if (d === "OLB") return "EDGE";
  if (d === "ILB" || d === "MLB" || d === "LB") return "LB";
  if (d === "CB" || d === "DB") return "CB";
  if (d === "FS" || d === "SS" || d === "S") return "S";
  if (d === "K") return "K";
  return null;
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function ageIn(birth, year) {
  if (!birth || !/^\d{4}-\d{2}-\d{2}$/.test(birth)) return 26;
  const [y, m, d] = birth.split("-").map(Number);
  let age = year - y;
  if (m > 3 || (m === 3 && d > 11)) age -= 1;
  return Math.max(21, Math.min(44, age));
}

function quality(row, pos) {
  const exp = Number(row.years_exp || 0);
  const pick = Number(row.draft_number || 280);
  let score = 0;
  if (pick <= 40) score += (40 - pick) * 1.15;
  else score += Math.max(0, 160 - pick) * 0.12;
  if (exp >= 2 && exp <= 9) score += 8;
  else if (exp <= 1 || exp === 10) score += 4;
  else if (exp >= 14) score -= 5;
  score += row.status === "ACT" ? 6 : -4;
  if (pos === "QB") {
    if (exp >= 3 && exp <= 14) score += 18;
    if (exp === 0) score -= 10;
  }
  const star = STARS[row.full_name];
  if (star && star[0] === pos) score += 80;
  return score;
}

function baseOvr(rank, pos, row) {
  const table = [78, 73, 69, 66, 64, 62];
  let ovr = table[Math.min(rank, table.length - 1)];
  const exp = Number(row.years_exp || 0);
  const pick = row.draft_number ? Number(row.draft_number) : null;
  if (pick && pick <= 10 && exp >= 2 && exp <= 7) ovr += 4;
  else if (pick && pick <= 32 && exp >= 1 && exp <= 5) ovr += 2;
  if (exp === 0) ovr -= 3;
  if (pos === "QB" && rank === 0 && exp >= 2) ovr += 2;
  if (exp >= 13) ovr -= 2;
  if (row.status === "RES") ovr -= 1;
  return Math.max(58, Math.min(86, ovr));
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const best = new Map();
for (const row of rows) {
  const team = TEAM_MAP[row.team] || row.team;
  if (!/^[A-Z]{2,3}$/.test(team)) continue;
  if (row.status !== "ACT" && row.status !== "RES") continue;
  const pos = groupPos(row.depth_chart_position, row.position);
  if (!pos || !KEEP[pos]) continue;
  const week = Number(row.week || 0);
  const rank = row.status === "ACT" ? 2 : 1;
  const key = row.gsis_id || `${row.full_name}|${team}`;
  const prev = best.get(key);
  if (!prev || week > prev.week || (week === prev.week && rank > prev.rank)) {
    best.set(key, { ...row, team, pos, week, rank });
  }
}

const byTeam = new Map();
for (const row of best.values()) {
  if (!byTeam.has(row.team)) byTeam.set(row.team, []);
  byTeam.get(row.team).push(row);
}

const teams = {};
const summary = [];

for (const [team, list] of [...byTeam.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const grouped = {};
  for (const row of list) {
    (grouped[row.pos] ||= []).push(row);
  }
  const players = [];
  for (const [pos, want] of Object.entries(KEEP)) {
    const pool = (grouped[pos] || []).sort((a, b) => quality(b, pos) - quality(a, pos));
    const chosen = pool.slice(0, want);
    chosen.forEach((row, rank) => {
      const star = STARS[row.full_name];
      let ovr = baseOvr(rank, pos, row);
      if (star && star[0] === pos) ovr = star[1];
      const age = ageIn(row.birth_date, LEAGUE_YEAR);
      const mult = CAP_MULT[pos] || 0.8;
      const cap = Math.max(0.8, (ovr - 58) * 0.7 * mult);
      const h = hash(row.full_name + team);
      let years = 0;
      if (h % 7 !== 0) {
        if (age >= 33) years = 1;
        else if (age >= 30) years = 1 + (h % 2);
        else if (age <= 24) years = 3 + (h % 2);
        else years = 2 + (h % 2);
      }
      const potential = Math.max(
        55,
        Math.min(99, ovr + (age <= 23 ? 8 : age <= 26 ? 4 : age <= 29 ? 0 : -6)),
      );
      players.push({
        id: row.gsis_id || `${team}-${pos}-${rank}-${hash(row.full_name).toString(16)}`,
        name: row.full_name,
        pos,
        ovr,
        age,
        cap: Math.round(cap * 10) / 10,
        years,
        potential,
        real: true,
        injured: row.status === "RES",
      });
    });
    while (chosen.length + (players.filter((p) => p.pos === pos).length - chosen.length) < 0) {
      /* no-op, filled below */
    }
    const have = players.filter((p) => p.pos === pos).length;
    for (let i = have; i < (pos === "QB" ? 1 : 0); i++) {
      players.push({
        id: `${team}-${pos}-camp-${i}`,
        name: `${team} Camp ${pos}`,
        pos,
        ovr: 64,
        age: 24,
        cap: 1.1,
        years: 1,
        potential: 68,
        real: false,
        injured: false,
      });
    }
  }

  const dead = Math.round((8 + (hash(team) % 180) / 10) * 10) / 10;
  const frac = 0.9 + (hash(team + "cap") % 18) / 100;
  const target = CAP * frac - dead;
  const raw = players.reduce((s, p) => s + p.cap, 0) || 1;
  const scale = target / raw;
  for (const p of players) {
    p.cap = Math.round(Math.max(0.8, p.cap * scale) * 10) / 10;
  }
  const payroll = Math.round(players.reduce((s, p) => s + p.cap, 0) * 10) / 10;
  teams[team] = { dead, players };
  const qb = players.find((p) => p.pos === "QB");
  summary.push(
    `${team} n=${players.length} pay=${payroll} dead=${dead} space=${(CAP - payroll - dead).toFixed(1)} QB=${qb?.name} ${qb?.ovr}`,
  );
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: "nflverse roster_2026.csv (public roster snapshot, weeks 1-6). LA Rams coded as LAR.",
      seasonSnapshot: 2026,
      leagueYear: LEAGUE_YEAR,
      capAssumption: CAP,
      note: "Overalls are game ratings. Cap hits are estimates scaled to the projected 2027 cap, not official salary-cap figures.",
      teams,
    },
    null,
    2,
  ),
);

console.log(summary.join("\n"));
console.log("teams", Object.keys(teams).length, "wrote", OUT);
