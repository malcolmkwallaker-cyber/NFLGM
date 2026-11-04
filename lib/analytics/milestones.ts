import type { Action } from "@/lib/types";

export function milestoneEvents(input: {
  beforePhase: string;
  afterPhase: string;
  action: Action;
  decisionId?: string | null;
}): Array<"draft_complete" | "season_complete" | "trade_made"> {
  const events: Array<"draft_complete" | "season_complete" | "trade_made"> = [];
  if (input.beforePhase === "draft" && input.afterPhase !== "draft") events.push("draft_complete");
  if (input.beforePhase !== "recap" && input.afterPhase === "recap") events.push("season_complete");
  if (input.action.type === "trade" && input.action.accept) events.push("trade_made");
  if (input.action.type === "draft-trade" && input.action.accept) events.push("trade_made");
  if (input.action.type === "shop-resolve" && input.action.accept) events.push("trade_made");
  if (input.action.type === "decide" && input.action.choiceId === "deal" && input.decisionId === "deadline") {
    events.push("trade_made");
  }
  return events;
}
