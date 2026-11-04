import { addUtcDays, utcDay } from "@/lib/analytics/time";

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function rotatingVisitorIds(seed: string, now: Date): Promise<{ id: string; prev: string; d7: string }> {
  const day = utcDay(now);
  const [id, prev, d7] = await Promise.all([
    sha256Hex(`${seed}|${day}`),
    sha256Hex(`${seed}|${addUtcDays(day, -1)}`),
    sha256Hex(`${seed}|${addUtcDays(day, -7)}`),
  ]);
  return { id, prev, d7 };
}
