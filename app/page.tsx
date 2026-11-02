import type { Metadata } from "next";
import { TodayHome } from "@/components/game/today-home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <TodayHome />;
}
