"use client";

import { useEffect } from "react";
import { prefetchSurahAudio } from "@/lib/audio";
import { prefetchTafheemChapter } from "@/lib/tafheemClient";

/** Prefetch audio + Tafheem after idle so first paint stays fast. */
export function SurahAudioPrefetch({
  chapterId,
  verseCount,
}: {
  chapterId: number;
  verseCount: number;
}) {
  useEffect(() => {
    const run = () => {
      prefetchSurahAudio(chapterId, Math.min(verseCount, 3));
      prefetchTafheemChapter(chapterId);
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(run, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }

    const t = globalThis.setTimeout(run, 800);
    return () => globalThis.clearTimeout(t);
  }, [chapterId, verseCount]);

  return null;
}
