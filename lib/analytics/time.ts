export function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addUtcDays(day: string, delta: number): string {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + delta);
  return utcDay(date);
}

export function eachUtcDay(start: string, end: string): string[] {
  const days: string[] = [];
  let cursor = start;
  while (cursor <= end && days.length < 120) {
    days.push(cursor);
    cursor = addUtcDays(cursor, 1);
  }
  return days;
}
