import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Game Access",
  description: "Find the current free football GM modes and features.",
  alternates: { canonical: "/upgrade/" },
};

export { default } from "@/app/upgrade/page";
