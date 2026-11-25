import { ModeIntro } from "@/components/site/mode-intro";
import { SeasonClient } from "./season-client";

export default function SeasonPage() {
  return (
    <>
      <ModeIntro mode="season" />
      <div id="game" tabIndex={-1}><SeasonClient /></div>
    </>
  );
}
