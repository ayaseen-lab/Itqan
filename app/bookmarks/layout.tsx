import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Saved Verses",
  description: "Your bookmarked Quran verses on WabilHuda.",
  path: "/bookmarks",
  noIndex: true,
});

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
