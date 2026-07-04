import type { HifzCard } from "./srs";

/** Sort cards in Quran order. */
export function sortCardsQuranOrder(cards: HifzCard[]): HifzCard[] {
  return [...cards].sort((a, b) => {
    if (a.chapterId !== b.chapterId) return a.chapterId - b.chapterId;
    return a.verseNumber - b.verseNumber;
  });
}

/** Group consecutive ayahs into passages (same surah, sequential numbers). */
export function groupConsecutivePassages(cards: HifzCard[]): HifzCard[][] {
  const sorted = sortCardsQuranOrder(cards);
  if (!sorted.length) return [];
  const groups: HifzCard[][] = [];
  let cur: HifzCard[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const next = sorted[i];
    const consecutive =
      next.chapterId === prev.chapterId && next.verseNumber === prev.verseNumber + 1;
    if (consecutive) cur.push(next);
    else {
      groups.push(cur);
      cur = [next];
    }
  }
  groups.push(cur);
  return groups;
}

/**
 * Visible hint chunk for an ayah — first ~30% of words (min 2, max 5).
 * Rest is hidden so the learner must recall.
 */
export function ayahChunkHint(text: string, wordsVisible?: number): {
  visible: string;
  hiddenCount: number;
  totalWords: number;
} {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return { visible: "", hiddenCount: 0, totalWords: 0 };
  const n =
    wordsVisible ??
    Math.min(5, Math.max(2, Math.ceil(words.length * 0.3)));
  const take = Math.min(n, Math.max(1, words.length - 1));
  // If ayah is very short (1–2 words), show first word only
  const visibleCount = words.length <= 2 ? 1 : take;
  return {
    visible: words.slice(0, visibleCount).join(" "),
    hiddenCount: words.length - visibleCount,
    totalWords: words.length,
  };
}

export function hiddenDots(count: number): string {
  const n = Math.min(Math.max(count, 1), 12);
  return Array.from({ length: n }, () => "●").join(" ");
}
