import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Football GM Challenge",
  description: "Make one sourced historical or clearly labeled fictional front-office decision, then review the grade and reasoning.",
  alternates: { canonical: "/daily/" },
};

export default function DailyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
