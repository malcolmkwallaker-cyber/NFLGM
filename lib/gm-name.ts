export function normalizeGmName(value: string | null | undefined): string {
  return value?.trim() || "GM";
}

export function titledGmName(value: string | null | undefined): string {
  const name = normalizeGmName(value);
  if (/^gm(?:\s|$)/i.test(name)) return name.replace(/^gm/i, "GM");
  return `GM ${name}`;
}

export function gmSubject(value: string | null | undefined): string {
  const name = normalizeGmName(value);
  return name === "GM" ? "The GM" : name;
}
