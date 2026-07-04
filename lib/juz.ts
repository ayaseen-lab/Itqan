import { OFFLINE_CHAPTERS } from "./offlineData";

/** Start of each Juz (1–30): chapter + verse. */
export const JUZ_STARTS: ReadonlyArray<{ juz: number; chapter: number; verse: number }> = [
  { juz: 1, chapter: 1, verse: 1 },
  { juz: 2, chapter: 2, verse: 142 },
  { juz: 3, chapter: 2, verse: 253 },
  { juz: 4, chapter: 3, verse: 93 },
  { juz: 5, chapter: 4, verse: 24 },
  { juz: 6, chapter: 4, verse: 148 },
  { juz: 7, chapter: 5, verse: 82 },
  { juz: 8, chapter: 6, verse: 111 },
  { juz: 9, chapter: 7, verse: 88 },
  { juz: 10, chapter: 8, verse: 41 },
  { juz: 11, chapter: 9, verse: 93 },
  { juz: 12, chapter: 11, verse: 6 },
  { juz: 13, chapter: 12, verse: 53 },
  { juz: 14, chapter: 15, verse: 1 },
  { juz: 15, chapter: 17, verse: 1 },
  { juz: 16, chapter: 18, verse: 75 },
  { juz: 17, chapter: 21, verse: 1 },
  { juz: 18, chapter: 23, verse: 1 },
  { juz: 19, chapter: 25, verse: 21 },
  { juz: 20, chapter: 27, verse: 56 },
  { juz: 21, chapter: 29, verse: 46 },
  { juz: 22, chapter: 33, verse: 31 },
  { juz: 23, chapter: 36, verse: 28 },
  { juz: 24, chapter: 39, verse: 32 },
  { juz: 25, chapter: 41, verse: 47 },
  { juz: 26, chapter: 46, verse: 1 },
  { juz: 27, chapter: 51, verse: 31 },
  { juz: 28, chapter: 58, verse: 1 },
  { juz: 29, chapter: 67, verse: 1 },
  { juz: 30, chapter: 78, verse: 1 },
];

export type AyahRef = { chapterId: number; verseNumber: number; verseKey: string };

function chapterVerseCount(chapterId: number): number {
  return OFFLINE_CHAPTERS.find((c) => c.id === chapterId)?.versesCount ?? 0;
}

/** Inclusive list of ayah refs for a Juz (parah). */
export function ayahsInJuz(juz: number): AyahRef[] {
  if (juz < 1 || juz > 30) return [];
  const start = JUZ_STARTS[juz - 1];
  const endExclusive =
    juz < 30
      ? JUZ_STARTS[juz]
      : { chapter: 115, verse: 1 };

  const out: AyahRef[] = [];
  let c = start.chapter;
  let v = start.verse;

  while (c < endExclusive.chapter || (c === endExclusive.chapter && v < endExclusive.verse)) {
    const max = chapterVerseCount(c);
    if (max <= 0) break;
    out.push({ chapterId: c, verseNumber: v, verseKey: `${c}:${v}` });
    v += 1;
    if (v > max) {
      c += 1;
      v = 1;
    }
    if (out.length > 700) break; // safety
  }
  return out;
}

export function juzLabel(juz: number): string {
  return `Juz ${juz} · پارہ ${juz}`;
}
