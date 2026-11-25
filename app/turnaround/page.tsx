import { ModeIntro } from "@/components/site/mode-intro";
import { TurnaroundClient } from "@/components/game/turnaround-client";

export default function TurnaroundPage() {
  return (
    <>
      <ModeIntro mode="turnaround" />
      <div id="game" tabIndex={-1}><TurnaroundClient /></div>
    </>
  );
}
