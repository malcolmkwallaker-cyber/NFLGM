import type { Headline } from "@/lib/types";

/**
 * Optional narrative hook. The game never requires it.
 * Rule-based copy is always available. If a future LLM route is configured,
 * the client may ask it to rewrite headlines or read a free-text decision.
 * On any failure, callers keep the rule-based fallback.
 */
export interface NarrativeRequest {
  kind: "headlines" | "free-text" | "wikipedia";
  facts: Record<string, string | number>;
  fallbackText?: string;
  fallbackHeadlines?: Headline[];
}

export interface NarrativeResult {
  source: "rules" | "model";
  text?: string;
  headlines?: Headline[];
}

export interface NarrativeProvider {
  id: string;
  complete(request: NarrativeRequest): Promise<NarrativeResult>;
}

export const ruleBasedProvider: NarrativeProvider = {
  id: "rules",
  async complete(request) {
    return {
      source: "rules",
      text: request.fallbackText,
      headlines: request.fallbackHeadlines,
    };
  },
};

export function createHttpNarrativeProvider(endpoint = "/api/narrative"): NarrativeProvider {
  return {
    id: "http",
    async complete(request) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error("Narrative hook unavailable");
      const data = (await response.json()) as NarrativeResult;
      if (!data.headlines && !data.text) throw new Error("Empty narrative");
      return { ...data, source: "model" };
    },
  };
}

export async function enrichHeadlines(
  headlines: Headline[],
  facts: Record<string, string | number>,
  enabled: boolean,
): Promise<Headline[]> {
  if (!enabled) return headlines;
  try {
    const result = await createHttpNarrativeProvider().complete({
      kind: "headlines",
      facts,
      fallbackHeadlines: headlines,
    });
    return result.headlines?.length ? result.headlines : headlines;
  } catch {
    return headlines;
  }
}
