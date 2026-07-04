import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Digital Tasbih Counter",
  description:
    "Free online tasbih and dhikr counter with multiple adhkar, custom targets, round tracking, and lifetime counts on WabilHuda.",
  path: "/tasbih",
  keywords: ["digital tasbih", "dhikr counter online", "tasbeeh app", "SubhanAllah counter"],
});

export default function TasbihLayout({ children }: { children: React.ReactNode }) {
  return children;
}
