import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hadith of the Day",
  description:
    "Read authentic Hadith daily in Arabic, Urdu, and English with audio narration. Browse a rotating collection of 30+ hadiths on WabilHuda.",
  path: "/hadith",
  keywords: ["Hadith of the day", "daily Hadith Urdu", "Islamic Hadith English", "Sunnah"],
});

export default function HadithLayout({ children }: { children: React.ReactNode }) {
  return children;
}
