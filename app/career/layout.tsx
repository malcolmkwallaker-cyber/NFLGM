import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Football GM Mode",
  description: "Build a multi-year football general manager career with contracts, drafts, owner goals, firings, job changes, and a saved legacy.",
  alternates: { canonical: "/career/" },
};

export default function CareerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
