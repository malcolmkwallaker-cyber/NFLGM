export function formatMoney(value: number): string {
  const amount = Math.abs(value).toFixed(1);
  return value < 0 ? `−$${amount}M` : `$${amount}M`;
}

export function formatContractYears(years: number): string {
  if (years <= 0) return "Expiring";
  return `${years} year${years === 1 ? "" : "s"} left`;
}
