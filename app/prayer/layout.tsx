import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Prayer Times (Salah)",
  description:
    "Accurate Fajr, Dhuhr, Asr, Maghrib, and Isha prayer times based on your location. Free salah timetable on WabilHuda.",
  path: "/prayer",
  keywords: ["prayer times", "salah times Pakistan", "namaz time", "Islamic prayer schedule"],
});

export default function PrayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
