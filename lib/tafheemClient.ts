"use client";

/** Client-side cache for prefetched Tafheem chapter data. */
import type { TafheemContent } from "@/lib/tafheem";

const cache = new Map<number, Record<string, TafheemContent>>();
const inflight = new Map<number, Promise<Record<string, TafheemContent>>>();

export function getTafheemFromCache(
  chapterId: number,
  verseKey: string,
): TafheemContent | null {
  return cache.get(chapterId)?.[verseKey] ?? null;
}

export function prefetchTafheemChapter(chapterId: number): void {
  if (cache.has(chapterId) || inflight.has(chapterId)) return;

  const p = fetch(`/api/tafheem?chapter=${chapterId}`)
    .then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ verses: Record<string, TafheemContent> }>;
    })
    .then((data) => {
      cache.set(chapterId, data.verses ?? {});
      inflight.delete(chapterId);
      return data.verses ?? {};
    })
    .catch(() => {
      inflight.delete(chapterId);
      return {} as Record<string, TafheemContent>;
    });

  inflight.set(chapterId, p);
}

export async function loadTafheemVerse(
  chapterId: number,
  verseKey: string,
): Promise<TafheemContent | null> {
  const hit = getTafheemFromCache(chapterId, verseKey);
  if (hit) return hit;

  if (inflight.has(chapterId)) {
    const verses = await inflight.get(chapterId)!;
    return verses[verseKey] ?? null;
  }

  prefetchTafheemChapter(chapterId);
  if (inflight.has(chapterId)) {
    const verses = await inflight.get(chapterId)!;
    if (verses[verseKey]) return verses[verseKey];
  }

  const res = await fetch(`/api/tafheem?verseKey=${encodeURIComponent(verseKey)}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { tafheem: TafheemContent | null };
  return data.tafheem;
}
