import type { MetadataRoute } from "next";
import { OFFLINE_CHAPTERS } from "@/lib/offlineData";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/quran`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/memorize`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/hadith`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${SITE_URL}/juz`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/names`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/duas`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/tasbih`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/prayer`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/competition`, lastModified: now, changeFrequency: "weekly", priority: 0.65 },
  ];

  const surahPages: MetadataRoute.Sitemap = OFFLINE_CHAPTERS.map((chapter) => ({
    url: `${SITE_URL}/surah/${chapter.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: chapter.id <= 10 ? 0.85 : 0.7,
  }));

  return [...staticPages, ...surahPages];
}
