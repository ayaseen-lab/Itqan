"use client";

import { useEffect } from "react";
import { prefetchSurahAudio } from "@/lib/audio";
import { prefetchTafheemChapter } from "@/lib/tafheemClient";

/** Prefetch audio + Tafheem in the background when a Surah page loads. */
export function SurahAudioPrefetch({
  chapterId,
  verseCount,
}: {
  chapterId: number;
  verseCount: number;
}) {
  useEffect(() => {
    prefetchSurahAudio(chapterId, verseCount);
    prefetchTafheemChapter(chapterId);
  }, [chapterId, verseCount]);

  return null;
}
