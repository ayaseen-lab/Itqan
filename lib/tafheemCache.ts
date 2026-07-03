/**
 * Server-side in-memory cache for Tafheem chapter payloads (7-day TTL).
 */

import type { TafheemContent } from "./tafheem";

const TTL = 7 * 24 * 60 * 60 * 1000;

type Entry = { data: Record<string, TafheemContent>; expiresAt: number };

const chapterCache = new Map<number, Entry>();

export function getCachedTafheemChapter(chapterId: number): Record<string, TafheemContent> | null {
  const hit = chapterCache.get(chapterId);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    chapterCache.delete(chapterId);
    return null;
  }
  return hit.data;
}

export function setCachedTafheemChapter(
  chapterId: number,
  data: Record<string, TafheemContent>,
): void {
  chapterCache.set(chapterId, { data, expiresAt: Date.now() + TTL });
}
