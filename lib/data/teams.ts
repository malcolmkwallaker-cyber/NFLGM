import type { TeamInfo } from "@/lib/types";

export const TEAMS: TeamInfo[] = [
  { id: "ARI", city: "Arizona", name: "Cardinals", abbr: "ARI", color: "#97233F", text: "#FFB612", conf: "NFC", div: "West" },
  { id: "ATL", city: "Atlanta", name: "Falcons", abbr: "ATL", color: "#A71930", text: "#FFFFFF", conf: "NFC", div: "South" },
  { id: "BAL", city: "Baltimore", name: "Ravens", abbr: "BAL", color: "#241773", text: "#C4A35A", conf: "AFC", div: "North" },
  { id: "BUF", city: "Buffalo", name: "Bills", abbr: "BUF", color: "#00338D", text: "#C60C30", conf: "AFC", div: "East" },
  { id: "CAR", city: "Carolina", name: "Panthers", abbr: "CAR", color: "#0085CA", text: "#101820", conf: "NFC", div: "South" },
  { id: "CHI", city: "Chicago", name: "Bears", abbr: "CHI", color: "#0B162A", text: "#C83803", conf: "NFC", div: "North" },
  { id: "CIN", city: "Cincinnati", name: "Bengals", abbr: "CIN", color: "#FB4F14", text: "#000000", conf: "AFC", div: "North" },
  { id: "CLE", city: "Cleveland", name: "Browns", abbr: "CLE", color: "#311D00", text: "#FF3C00", conf: "AFC", div: "North" },
  { id: "DAL", city: "Dallas", name: "Cowboys", abbr: "DAL", color: "#003594", text: "#B0B7BC", conf: "NFC", div: "East" },
  { id: "DEN", city: "Denver", name: "Broncos", abbr: "DEN", color: "#FB4F14", text: "#0A2342", conf: "AFC", div: "West" },
  { id: "DET", city: "Detroit", name: "Lions", abbr: "DET", color: "#0076B6", text: "#B0B7BC", conf: "NFC", div: "North" },
  { id: "GB", city: "Green Bay", name: "Packers", abbr: "GB", color: "#203731", text: "#FFB612", conf: "NFC", div: "North" },
  { id: "HOU", city: "Houston", name: "Texans", abbr: "HOU", color: "#03202F", text: "#A71930", conf: "AFC", div: "South" },
  { id: "IND", city: "Indianapolis", name: "Colts", abbr: "IND", color: "#002C5F", text: "#FFFFFF", conf: "AFC", div: "South" },
  { id: "JAX", city: "Jacksonville", name: "Jaguars", abbr: "JAX", color: "#006778", text: "#D7A22A", conf: "AFC", div: "South" },
  { id: "KC", city: "Kansas City", name: "Chiefs", abbr: "KC", color: "#E31837", text: "#FFB81C", conf: "AFC", div: "West" },
  { id: "LV", city: "Las Vegas", name: "Raiders", abbr: "LV", color: "#000000", text: "#A5ACAF", conf: "AFC", div: "West" },
  { id: "LAC", city: "Los Angeles", name: "Chargers", abbr: "LAC", color: "#0080C6", text: "#FFC20E", conf: "AFC", div: "West" },
  { id: "LAR", city: "Los Angeles", name: "Rams", abbr: "LAR", color: "#003594", text: "#FFA300", conf: "NFC", div: "West" },
  { id: "MIA", city: "Miami", name: "Dolphins", abbr: "MIA", color: "#008E97", text: "#FC4C02", conf: "AFC", div: "East" },
  { id: "MIN", city: "Minnesota", name: "Vikings", abbr: "MIN", color: "#4F2683", text: "#FFC62F", conf: "NFC", div: "North" },
  { id: "NE", city: "New England", name: "Patriots", abbr: "NE", color: "#002244", text: "#C60C30", conf: "AFC", div: "East" },
  { id: "NO", city: "New Orleans", name: "Saints", abbr: "NO", color: "#D3BC8D", text: "#101820", conf: "NFC", div: "South" },
  { id: "NYG", city: "New York", name: "Giants", abbr: "NYG", color: "#0B2265", text: "#A71930", conf: "NFC", div: "East" },
  { id: "NYJ", city: "New York", name: "Jets", abbr: "NYJ", color: "#125740", text: "#FFFFFF", conf: "AFC", div: "East" },
  { id: "PHI", city: "Philadelphia", name: "Eagles", abbr: "PHI", color: "#004C54", text: "#A5ACAF", conf: "NFC", div: "East" },
  { id: "PIT", city: "Pittsburgh", name: "Steelers", abbr: "PIT", color: "#FFB612", text: "#101820", conf: "AFC", div: "North" },
  { id: "SF", city: "San Francisco", name: "49ers", abbr: "SF", color: "#AA0000", text: "#B3995D", conf: "NFC", div: "West" },
  { id: "SEA", city: "Seattle", name: "Seahawks", abbr: "SEA", color: "#002244", text: "#69BE28", conf: "NFC", div: "West" },
  { id: "TB", city: "Tampa Bay", name: "Buccaneers", abbr: "TB", color: "#D50A0A", text: "#FF7900", conf: "NFC", div: "South" },
  { id: "TEN", city: "Tennessee", name: "Titans", abbr: "TEN", color: "#0C2340", text: "#4B92DB", conf: "AFC", div: "South" },
  { id: "WAS", city: "Washington", name: "Commanders", abbr: "WAS", color: "#5A1414", text: "#FFB612", conf: "NFC", div: "East" },
];

export function teamById(id: string, directory: TeamInfo[] = TEAMS): TeamInfo {
  return (
    directory.find((t) => t.id === id) ?? {
      id,
      city: id,
      name: "",
      abbr: id,
      color: "#334155",
      text: "#ffffff",
      conf: "NFC",
      div: "East",
    }
  );
}

export function teamLabel(info: TeamInfo): string {
  return `${info.city} ${info.name}`.trim();
}
