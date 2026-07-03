/**
 * Bundled surah JSON under public/data/surahs/{id}.json
 * Populated via: npm run data:download
 */

import { readFile } from "fs/promises";
import path from "path";
import type { Verse } from "./quran";
import { hasOfflineChapter, getOfflineVerses } from "./offlineData";

const cache = new Map<number, Verse[]>();

export async function loadBundledSurah(chapterId: number): Promise<Verse[]> {
  if (cache.has(chapterId)) return cache.get(chapterId)!;

  const filePath = path.join(process.cwd(), "public/data/surahs", `${chapterId}.json`);
  try {
    const raw = await readFile(filePath, "utf8");
    const data = JSON.parse(raw) as { verses?: Verse[] };
    if (data.verses?.length) {
      cache.set(chapterId, data.verses);
      return data.verses;
    }
  } catch {
    /* no bundle */
  }

  if (hasOfflineChapter(chapterId)) {
    const verses = getOfflineVerses(chapterId);
    cache.set(chapterId, verses);
    return verses;
  }

  return [];
}

export function hasBundledSurah(chapterId: number): boolean {
  return hasOfflineChapter(chapterId);
}
