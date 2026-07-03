/**
 * Local Mishary Alafasy ayah audio — bundled under public/audio/alafasy/.
 * Files follow everyayah naming: SSSAAA.mp3 (e.g. 001001.mp3 = Surah 1, Ayah 1).
 *
 * Run once: npm run audio:download
 */

import { OFFLINE_CHAPTERS } from "./offlineData";

/** Zero-padded SSSAAA filename for an ayah. */
export function ayahAudioFilename(chapterId: number, verseNumber: number): string {
  const s = String(chapterId).padStart(3, "0");
  const a = String(verseNumber).padStart(3, "0");
  return `${s}${a}.mp3`;
}

const AUDIO_BASE = "/api/audio";

/** Public URL — local file if bundled, else proxied from CDN via /api/audio */
export function ayahAudioUrl(chapterId: number, verseNumber: number): string {
  const s = String(chapterId).padStart(3, "0");
  const a = String(verseNumber).padStart(3, "0");
  return `${AUDIO_BASE}?k=${s}${a}`;
}

/** Global ayah index 1–6236 (for external CDNs that use flat numbering). */
export function globalAyahNumber(chapterId: number, verseNumber: number): number {
  let offset = 0;
  for (const ch of OFFLINE_CHAPTERS) {
    if (ch.id === chapterId) return offset + verseNumber;
    offset += ch.versesCount;
  }
  return offset + verseNumber;
}

/** Prefetch ayah audio in the browser — only the first few verses (on-demand for the rest). */
export function prefetchSurahAudio(chapterId: number, verseCount: number): void {
  if (typeof window === "undefined") return;
  const count = Math.min(verseCount, 5);
  for (let i = 1; i <= count; i++) {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "fetch";
    link.href = ayahAudioUrl(chapterId, i);
    document.head.appendChild(link);
  }
}

/** Warm a single ayah into the browser cache. */
export function warmAyahAudio(chapterId: number, verseNumber: number): void {
  if (typeof window === "undefined") return;
  const a = new Audio(ayahAudioUrl(chapterId, verseNumber));
  a.preload = "auto";
  a.load();
}
