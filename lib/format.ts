export function formatMoney(value: number): string {
  const amount = Math.abs(value).toFixed(1);
  return value < 0 ? `−$${amount}M` : `$${amount}M`;
}

export function formatContractYears(years: number): string {
  if (years <= 0) return "Expiring";
  return `${years} year${years === 1 ? "" : "s"} left`;
}

export function formatPlayoffRound(round: string): string {
  if (round === "superbowl") return "Super Bowl";
  if (round === "wildcard") return "Wild Card";
  return round.charAt(0).toUpperCase() + round.slice(1);
}

export function articleFor(value: string): "a" | "an" {
  return /^[AEFHILMNORSX]/i.test(value.trim()) ? "an" : "a";
}
