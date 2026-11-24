import type { Metadata } from "next";
import { Desk } from "@/components/game/desk";

export const metadata: Metadata = {
  title: "Front Office Desk",
  description: "Return to your saved football team and make its next front-office decision.",
  alternates: { canonical: "/play/" },
};

export default function PlayPage() {
  return (
    <>
      <h1 className="sr-only">Front Office Desk</h1>
      <Desk />
    </>
  );
}
