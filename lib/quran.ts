/**
 * Free Quran data access via the Quran.com API v4 (no API key required).
 * Docs: https://api-docs.quran.foundation
 *
 * We keep the surface small and typed so the rest of the app does not depend
 * on the raw API shape. When the live API is unreachable we fall back to a
 * small bundled offline dataset.
 */

import {
  OFFLINE_CHAPTERS,
  getOfflineChapter,
  getOfflineVerses,
} from "./offlineData";
import { loadBundledSurah } from "./surahBundle";
import { getTafsirByLang, type TafsirLang } from "./tafsir";
import { ayahAudioUrl } from "./audio";
import { hasTajweedMarkup } from "./tajweed";

const WEEK = 60 * 60 * 24 * 7;

// Public (unauthenticated) Quran.com v4 API — used as a fallback.
const PUBLIC_BASE = "https://api.quran.com/api/v4";

// Official Quran.Foundation Content API (OAuth2 client-credentials).
// Configured via env; secret stays server-side only.
const QF_CLIENT_ID = process.env.QF_CLIENT_ID;
const QF_CLIENT_SECRET = process.env.QF_CLIENT_SECRET;
const QF_ENV = process.env.QF_ENV === "prelive" ? "prelive" : "production";
const QF_AUTH_BASE =
  QF_ENV === "prelive"
    ? "https://prelive-oauth2.quran.foundation"
    : "https://oauth2.quran.foundation";
const QF_API_BASE =
  QF_ENV === "prelive"
    ? "https://apis-prelive.quran.foundation"
    : "https://apis.quran.foundation";

const hasQfCredentials = Boolean(QF_CLIENT_ID && QF_CLIENT_SECRET);

// Translation resource ids on Quran.com.
const URDU_TRANSLATION_ID = 97; // Fateh Muhammad Jalandhry — fallback if Maududi CDN fails
const ENGLISH_TRANSLATION_ID = 131; // Saheeh International (English)

// English Tafsir: Ibn Kathir (Abridged) on Quran.com.
const ENGLISH_TAFSIR_ID = 169;

// Ayah audio is bundled locally — see public/audio/alafasy/ and npm run audio:download

export interface Chapter {
  id: number;
  revelationPlace: string;
  nameArabic: string;
  nameSimple: string;
  translatedName: string;
  versesCount: number;
}

export interface Word {
  position: number;
  text: string; // Arabic (Uthmani) glyph/text
  transliteration: string | null;
  translation: string | null; // English word meaning
  translationUrdu: string | null; // Urdu word meaning
  audioUrl: string | null;
}

export interface Verse {
  id: number;
  verseKey: string; // e.g. "2:255"
  chapterId: number;
  verseNumber: number;
  textUthmani: string;
  textTajweed: string | null; // Spaced Uthmani from API (not HTML); local annotator uses textUthmani
  audioUrl: string | null;
  translations: {
    urdu: string | null;
    english: string | null;
  };
  words: Word[];
}

export interface Tafsir {
  text: string; // HTML
  resourceName: string;
}

function stripHtml(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<sup[^>]*>.*?<\/sup>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// In-memory app-token cache for the Quran.Foundation Content API.
let qfToken: { value: string; expiresAt: number } | null = null;

async function getQfToken(force = false): Promise<string> {
  const now = Date.now();
  if (!force && qfToken && now < qfToken.expiresAt - 30_000) {
    return qfToken.value;
  }
  const basic = btoa(`${QF_CLIENT_ID}:${QF_CLIENT_SECRET}`);
  const res = await fetch(`${QF_AUTH_BASE}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=content",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`QF token error ${res.status}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  qfToken = {
    value: data.access_token,
    expiresAt: now + (data.expires_in ?? 3600) * 1000,
  };
  return qfToken.value;
}

async function qfGet<T>(path: string, allowRetry = true): Promise<T> {
  const token = await getQfToken();
  const res = await fetch(`${QF_API_BASE}/content/api/v4${path}`, {
    headers: {
      "x-auth-token": token,
      "x-client-id": QF_CLIENT_ID as string,
      Accept: "application/json",
    },
    next: { revalidate: WEEK },
  });
  if (res.status === 401 && allowRetry) {
    qfToken = null;
    return qfGet<T>(path, false);
  }
  if (!res.ok) {
    throw new Error(`QF content error ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${PUBLIC_BASE}${path}`, {
    // Cache Quran data aggressively; it never changes.
    next: { revalidate: WEEK },
  });
  if (!res.ok) {
    throw new Error(`Quran API error ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

/**
 * Fetch a Quran.com v4-style path. Uses the official Quran.Foundation Content
 * API when credentials are configured, otherwise the public api.quran.com. If
 * the official API fails for any reason, it falls back to the public one.
 */
async function apiGet<T>(path: string): Promise<T> {
  if (hasQfCredentials) {
    try {
      return await qfGet<T>(path);
    } catch {
      // Fall back to the public API below.
    }
  }
  return publicGet<T>(path);
}

export async function getChapters(): Promise<Chapter[]> {
  // Serve the complete, bundled 114-Surah list instantly — no network wait — so
  // the reader always shows every Surah and loads fast. We still try the live
  // API to enrich with localized (Urdu) names, but never block on it.
  try {
    const data = await apiGet<{ chapters: any[] }>("/chapters?language=ur");
    const mapped = data.chapters.map(mapChapter);
    if (mapped.length >= 114) return mapped;
    return OFFLINE_CHAPTERS;
  } catch {
    return OFFLINE_CHAPTERS;
  }
}

export async function getChapter(id: number): Promise<Chapter | null> {
  return getOfflineChapter(id);
}

function mapChapter(c: any): Chapter {
  return {
    id: c.id,
    revelationPlace: c.revelation_place,
    nameArabic: c.name_arabic,
    nameSimple: c.name_simple,
    translatedName: c.translated_name?.name ?? c.name_simple,
    versesCount: c.verses_count,
  };
}

export async function getVerses(chapterId: number): Promise<Verse[]> {
  // Prefer live API so word-by-word includes Urdu + English meanings for every word.
  // Bundled JSON is incomplete (translationUrdu is often null).
  try {
    const live = await fetchVersesFromApi(chapterId);
    if (live.length > 0) return live;
  } catch {
    /* fall through */
  }

  const bundled = await loadBundledSurah(chapterId);
  if (bundled.length > 0) return bundled;
  return getOfflineVerses(chapterId);
}

function pickTranslation(
  translations: any[],
  resourceId: number,
  languageName?: string,
): string | null {
  const byId = translations.find((t) => Number(t.resource_id) === resourceId);
  if (byId?.text) return stripHtml(byId.text) || null;
  if (languageName) {
    const byLang = translations.find(
      (t) => t.language_name?.toLowerCase() === languageName.toLowerCase(),
    );
    if (byLang?.text) return stripHtml(byLang.text) || null;
  }
  return null;
}

/** Fetch colour-coded tajweed HTML (separate endpoint returns real markup). */
async function fetchTajweedMap(chapterId: number): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const data = await apiGet<{ verses: { verse_key: string; text_uthmani_tajweed?: string }[] }>(
      `/quran/verses/uthmani_tajweed?chapter_number=${chapterId}`,
    );
    for (const v of data.verses ?? []) {
      if (v.text_uthmani_tajweed && hasTajweedMarkup(v.text_uthmani_tajweed)) {
        map.set(v.verse_key, v.text_uthmani_tajweed);
      }
    }
  } catch {
    /* fall back to plain Uthmani + local annotator */
  }
  return map;
}

async function fetchVersesFromApi(chapterId: number): Promise<Verse[]> {
  // Primary request: English words + verse translations + tajweed script + audio.
  const params = new URLSearchParams({
    words: "true",
    word_fields: "text_uthmani,transliteration",
    language: "en",
    translations: `${URDU_TRANSLATION_ID},${ENGLISH_TRANSLATION_ID}`,
    fields: "text_uthmani,text_uthmani_tajweed",
    per_page: "300",
  });

  // Secondary request: Urdu word-by-word meanings only.
  const urduParams = new URLSearchParams({
    words: "true",
    word_fields: "text_uthmani",
    language: "ur",
    per_page: "300",
  });

  const [data, urduData, tajweedMap] = await Promise.all([
    apiGet<{ verses: any[] }>(`/verses/by_chapter/${chapterId}?${params}`),
    apiGet<{ verses: any[] }>(`/verses/by_chapter/${chapterId}?${urduParams}`).catch(
      () => ({ verses: [] as any[] }),
    ),
    fetchTajweedMap(chapterId),
  ]);

  // Urdu word meanings keyed by verseKey:position and verseKey:text (fallback).
  const urduWordMap = new Map<string, string>();
  const urduByText = new Map<string, string>();
  for (const v of urduData.verses ?? []) {
    for (const w of v.words ?? []) {
      if (w.char_type_name !== "word" || !w.translation?.text) continue;
      const key = `${v.verse_key}:${w.position}`;
      urduWordMap.set(key, w.translation.text);
      const arabic = w.text_uthmani ?? w.text ?? "";
      if (arabic) urduByText.set(`${v.verse_key}:${arabic}`, w.translation.text);
    }
  }

  return data.verses.map((v) => {
    const translations: any[] = v.translations ?? [];
    const urduText = pickTranslation(translations, URDU_TRANSLATION_ID, "urdu");
    const englishText = pickTranslation(translations, ENGLISH_TRANSLATION_ID, "english");
    const tajweedHtml = tajweedMap.get(v.verse_key) ?? v.text_uthmani_tajweed ?? null;

    const words: Word[] = (v.words ?? [])
      .filter((w: any) => w.char_type_name === "word")
      .map((w: any) => {
        const arabic = w.text_uthmani ?? w.text ?? "";
        const en = w.translation?.text ?? null;
        const urFromMap =
          urduWordMap.get(`${v.verse_key}:${w.position}`) ??
          urduByText.get(`${v.verse_key}:${arabic}`) ??
          null;
        return {
          position: w.position,
          text: arabic,
          transliteration: w.transliteration?.text ?? null,
          translation: en,
          translationUrdu: urFromMap,
          audioUrl: wordAudioUrl(w.audio_url ?? w.audio?.url),
        };
      });

    return {
      id: v.id,
      verseKey: v.verse_key,
      chapterId,
      verseNumber: v.verse_number,
      textUthmani: v.text_uthmani ?? "",
      textTajweed: tajweedHtml,
      audioUrl: ayahAudioUrl(chapterId, v.verse_number),
      translations: {
        urdu: urduText,
        english: englishText,
      },
      words,
    };
  });
}

/** Strip footnote markers, scripts, and inline colours (break dark mode). */
function sanitizeTafsirHtml(html: string): string {
  return html
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/\sfoot_note\s*=\s*["']?\d+["']?/gi, "")
    .replace(/<\/?(script|style|iframe)\b[^>]*>/gi, "")
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/<\/?font\b[^>]*>/gi, "");
}

function plainLen(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

function wordAudioUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const path = raw.trim();
  if (path.startsWith("http") || path.startsWith("/api/")) return path;
  // Quran.com word audio paths look like "wbw/001_001_001.mp3"
  return `https://audio.qurancdn.com/${path.replace(/^\//, "")}`;
}

/**
 * Working Quran.com endpoint for English Ibn Kathir (abridged).
 * Note: /quran/tafsirs/169?verse_key=… returns empty — do not use it.
 */
async function fetchQuranComEnglishTafsir(verseKey: string): Promise<Tafsir | null> {
  try {
    const data = await publicGet<{
      tafsir?: {
        text?: string;
        resource_name?: string;
      };
    }>(`/tafsirs/${ENGLISH_TAFSIR_ID}/by_ayah/${encodeURIComponent(verseKey)}`);

    const text = data.tafsir?.text?.trim();
    if (!text) return null;

    return {
      text: sanitizeTafsirHtml(text),
      resourceName: data.tafsir?.resource_name ?? "Tafsir Ibn Kathir (English)",
    };
  } catch {
    return null;
  }
}

/**
 * Fetch Ibn Kathir Tafsir for a single ayah (English or Urdu).
 * Urdu: spa5k CDN. English: longer of spa5k vs Quran.com.
 */
export async function getTafsir(verseKey: string, lang: TafsirLang = "en"): Promise<Tafsir | null> {
  if (lang === "ur") {
    const ur = await getTafsirByLang(verseKey, "ur");
    return ur ? { text: ur.text, resourceName: ur.resourceName } : null;
  }

  // Quran.com by_ayah has the full abridged English Ibn Kathir; spa5k is often shorter.
  const [spa5k, quranCom] = await Promise.all([
    getTafsirByLang(verseKey, "en"),
    fetchQuranComEnglishTafsir(verseKey),
  ]);

  const spa5kTafsir = spa5k
    ? { text: spa5k.text, resourceName: spa5k.resourceName }
    : null;

  if (quranCom && plainLen(quranCom.text) >= 80) return quranCom;
  if (spa5kTafsir && quranCom) {
    return plainLen(quranCom.text) >= plainLen(spa5kTafsir.text) ? quranCom : spa5kTafsir;
  }
  return quranCom ?? spa5kTafsir;
}

/** Convenience: fetch a single verse by "chapter:verse" key. */
export async function getVerse(verseKey: string): Promise<Verse | null> {
  const [chapterStr] = verseKey.split(":");
  const chapterId = Number(chapterStr);
  if (!Number.isFinite(chapterId)) return null;
  const verses = await getVerses(chapterId);
  return verses.find((v) => v.verseKey === verseKey) ?? null;
}
