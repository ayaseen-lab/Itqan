import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Everyday Duas & Supplications",
  description:
    "Browse authentic daily duas and supplications in Arabic with Urdu and English meanings. Morning, evening, and everyday adhkar on WabilHuda.",
  path: "/duas",
  keywords: ["Islamic duas", "daily duas Urdu", "morning evening adhkar", "Muslim supplications"],
});

export default function DuasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
