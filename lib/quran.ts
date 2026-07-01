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
const URDU_TRANSLATION_ID = 97; // Fateh Muhammad Jalandhry (Urdu)
const ENGLISH_TRANSLATION_ID = 131; // Saheeh International (English)

// English Tafsir: Ibn Kathir (Abridged) on Quran.com.
const ENGLISH_TAFSIR_ID = 169;

const AUDIO_CDN = "https://verses.quran.com/";
const WORD_AUDIO_CDN = "https://audio.qurancdn.com/";

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
  textTajweed: string | null; // HTML with <tajweed class=...> spans
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
  try {
    const data = await apiGet<{ chapters: any[] }>("/chapters?language=ur");
    return data.chapters.map(mapChapter);
  } catch {
    return OFFLINE_CHAPTERS;
  }
}

export async function getChapter(id: number): Promise<Chapter | null> {
  try {
    const data = await apiGet<{ chapter: any }>(`/chapters/${id}?language=ur`);
    return mapChapter(data.chapter);
  } catch {
    return getOfflineChapter(id);
  }
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

function buildAudioUrl(raw: string | null | undefined, cdn: string): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return `${cdn}${raw}`;
}

export async function getVerses(chapterId: number): Promise<Verse[]> {
  try {
    return await fetchVersesFromApi(chapterId);
  } catch {
    return getOfflineVerses(chapterId);
  }
}

async function fetchVersesFromApi(chapterId: number): Promise<Verse[]> {
  // Primary request: English words + verse translations + tajweed script + audio.
  const params = new URLSearchParams({
    words: "true",
    word_fields: "text_uthmani,transliteration,audio_url",
    language: "en",
    translations: `${URDU_TRANSLATION_ID},${ENGLISH_TRANSLATION_ID}`,
    fields: "text_uthmani,text_uthmani_tajweed",
    audio: "7", // Mishary Rashid Alafasy
    per_page: "300",
  });

  // Secondary request: Urdu word-by-word meanings only.
  const urduParams = new URLSearchParams({
    words: "true",
    word_fields: "text_uthmani",
    language: "ur",
    per_page: "300",
  });

  const [data, urduData] = await Promise.all([
    apiGet<{ verses: any[] }>(`/verses/by_chapter/${chapterId}?${params}`),
    apiGet<{ verses: any[] }>(`/verses/by_chapter/${chapterId}?${urduParams}`).catch(
      () => ({ verses: [] as any[] }),
    ),
  ]);

  // Build a lookup of Urdu word meanings keyed by "verseKey:position".
  const urduWordMap = new Map<string, string>();
  for (const v of urduData.verses ?? []) {
    for (const w of v.words ?? []) {
      if (w.char_type_name === "word" && w.translation?.text) {
        urduWordMap.set(`${v.verse_key}:${w.position}`, w.translation.text);
      }
    }
  }

  return data.verses.map((v) => {
    const translations: any[] = v.translations ?? [];
    const urdu = translations.find((t) => t.resource_id === URDU_TRANSLATION_ID);
    const english = translations.find((t) => t.resource_id === ENGLISH_TRANSLATION_ID);

    const words: Word[] = (v.words ?? [])
      .filter((w: any) => w.char_type_name === "word")
      .map((w: any) => ({
        position: w.position,
        text: w.text_uthmani ?? w.text ?? "",
        transliteration: w.transliteration?.text ?? null,
        translation: w.translation?.text ?? null,
        translationUrdu: urduWordMap.get(`${v.verse_key}:${w.position}`) ?? null,
        audioUrl: buildAudioUrl(w.audio_url, WORD_AUDIO_CDN),
      }));

    return {
      id: v.id,
      verseKey: v.verse_key,
      chapterId,
      verseNumber: v.verse_number,
      textUthmani: v.text_uthmani ?? "",
      textTajweed: v.text_uthmani_tajweed ?? null,
      audioUrl: buildAudioUrl(v.audio?.url, AUDIO_CDN),
      translations: {
        urdu: stripHtml(urdu?.text) || null,
        english: stripHtml(english?.text) || null,
      },
      words,
    };
  });
}

/**
 * Fetch authentic English Tafsir (Ibn Kathir) for a single ayah.
 * Uses the public Quran.com API directly so the tafsir language/resource id is
 * always correct regardless of the configured Content API.
 */
export async function getTafsir(verseKey: string): Promise<Tafsir | null> {
  try {
    const data = await publicGet<{ tafsir?: any; tafsirs?: any[] }>(
      `/quran/tafsirs/${ENGLISH_TAFSIR_ID}?verse_key=${encodeURIComponent(verseKey)}`,
    );
    const t = data.tafsir ?? data.tafsirs?.[0];
    if (!t?.text) return null;
    return {
      text: t.text,
      resourceName: t.resource_name ?? "Tafsir Ibn Kathir",
    };
  } catch {
    return null;
  }
}

/** Convenience: fetch a single verse by "chapter:verse" key. */
export async function getVerse(verseKey: string): Promise<Verse | null> {
  const [chapterStr] = verseKey.split(":");
  const chapterId = Number(chapterStr);
  if (!Number.isFinite(chapterId)) return null;
  const verses = await getVerses(chapterId);
  return verses.find((v) => v.verseKey === verseKey) ?? null;
}
