import type { Metadata } from "next";
import { ModeIntro } from "@/components/site/mode-intro";
import { Desk } from "@/components/game/desk";

export const metadata: Metadata = {
  title: "Front Office Desk",
  description: "Return to your saved football team and make its next front-office decision.",
  alternates: { canonical: "/play/" },
};

export default function PlayPage() {
  return (
    <>
      <ModeIntro mode="play" />
      <div id="game" tabIndex={-1}><Desk /></div>
    </>
  );
}
