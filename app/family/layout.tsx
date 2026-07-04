import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Family Learning",
  description: "Create or join a family on WabilHuda to track Quran progress together.",
  path: "/family",
  noIndex: true,
});

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
