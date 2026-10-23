export function formatMoney(value: number): string {
  const amount = Math.abs(value).toFixed(1);
  return value < 0 ? `−$${amount}M` : `$${amount}M`;
}
