import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "99 Names of Allah (Asma ul Husna)",
  description:
    "Learn the 99 Names of Allah with Arabic, transliteration, and meanings. Search and study Asma ul Husna on WabilHuda.",
  path: "/names",
  keywords: ["99 names of Allah", "Asma ul Husna", "Allah names meaning", "Islamic names"],
});

export default function NamesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
