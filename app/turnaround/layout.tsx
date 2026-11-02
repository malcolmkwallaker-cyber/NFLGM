import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Historic Turnaround",
  description: "Take the same sourced football season setup and deterministic seed as every player, then try to beat the historical result.",
  alternates: { canonical: "/turnaround/" },
};

export default function TurnaroundLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
