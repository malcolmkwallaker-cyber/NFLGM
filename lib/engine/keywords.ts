const PATHS = [
  { id: "win", words: ["win", "now", "super bowl", "contend", "title", "ring", "all in", "push"] },
  { id: "youth", words: ["youth", "young", "draft", "develop", "future", "rookie", "rebuild", "pipeline"] },
  { id: "stars", words: ["star", "splash", "sign", "headline", "weapon", "name"] },
  { id: "fiscal", words: ["cap", "money", "cheap", "flexible", "budget", "dead", "payroll", "spend less"] },
  { id: "culture", words: ["culture", "locker", "chemistry", "together", "standard", "accountability"] },
] as const;

export type OwnerPath = (typeof PATHS)[number]["id"];

export function interpretFreeText(text: string): { path: OwnerPath; matched: string } | null {
  const lower = text.toLowerCase();
  let best: { path: OwnerPath; matched: string; hits: number } | null = null;
  for (const path of PATHS) {
    const hits = path.words.filter((w) => lower.includes(w));
    if (!hits.length) continue;
    if (!best || hits.length > best.hits) best = { path: path.id, matched: hits[0], hits: hits.length };
  }
  return best ? { path: best.path, matched: best.matched } : null;
}
