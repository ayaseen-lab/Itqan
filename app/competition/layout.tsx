import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Family Quran Competition",
  description:
    "Join healthy family Quran competitions, track Hifz progress, and compete with other families on a live scoreboard with WabilHuda.",
  path: "/competition",
  keywords: ["Quran competition", "family Hifz challenge", "Islamic learning competition"],
});

export default function CompetitionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
