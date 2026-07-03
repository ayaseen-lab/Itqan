/**
 * Tafheem-ul-Quran by Maulana Abul A'la Maududi (Urdu).
 * Full translation + footnotes from QUL (Tarteel). Chapter data is cached server-side.
 */

import { readFile } from "fs/promises";
import path from "path";
import { OFFLINE_CHAPTERS } from "./offlineData";
import { getCachedTafheemChapter, setCachedTafheemChapter } from "./tafheemCache";

const WEEK = 60 * 60 * 24 * 7;

const QUL_API = "https://qul.tarteel.ai/api/v1";
const QUL_TAFHEEM_RESOURCE_ID = 97;

const MAUDUDI_URDU_CDN =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/urd-abulaalamaududi";

const QURAN_JSON_CHAPTER =
  "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/ur";

export type TafheemSegment =
  | { type: "text"; value: string }
  | { type: "footnote"; number: number };

export interface TafheemFootnote {
  number: number;
  text: string;
}

export interface TafheemContent {
  verseKey: string;
  /** Plain translation without footnote markers. */
  translation: string;
  /** Translation with inline footnote numbers (1, 2, 3…). */
  segments: TafheemSegment[];
  footnotes: TafheemFootnote[];
  plainText: string;
  resourceName: string;
  hasCommentary: boolean;
}

export function parseVerseKey(verseKey: string): { chapter: number; verse: number } | null {
  const m = /^(\d+):(\d+)$/.exec(verseKey.trim());
  if (!m) return null;
  const chapter = Number(m[1]);
  const verse = Number(m[2]);
  if (!Number.isFinite(chapter) || !Number.isFinite(verse)) return null;
  return { chapter, verse };
}

export function globalAyahNumber(chapter: number, verse: number): number {
  const counts = [
    0, 7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98,
    135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54,
    53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18,
    12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
    26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
  ];
  let n = 0;
  for (let s = 1; s < chapter; s++) n += counts[s] ?? 0;
  return n + verse;
}

function decodeEntities(html: string): string {
  return html
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanFootnoteBody(raw: string, footnoteId: string): string {
  let text = stripHtml(raw);
  // QUL pages sometimes leak the database id into visible text.
  text = text.replace(new RegExp(`^${footnoteId}\\s*`), "");
  text = text.replace(/^\d{5,}\s*/, "");
  return text.trim();
}

function parseFootnoteTags(html: string): {
  translation: string;
  segments: TafheemSegment[];
  refs: { number: number; id: string }[];
} {
  const decoded = decodeEntities(html);
  const refs: { number: number; id: string }[] = [];
  const segments: TafheemSegment[] = [];
  let plain = "";

  const re =
    /<sup[^>]*\bfoot_note\s*=\s*["']?(\d+)["']?[^>]*>\s*(\d+)\s*<\/sup>/gi;

  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(decoded)) !== null) {
    const before = decoded.slice(last, m.index);
    const cleaned = stripHtml(before);
    if (cleaned) {
      segments.push({ type: "text", value: cleaned });
      plain += cleaned;
    }

    const num = Number(m[2]);
    const id = m[1];
    refs.push({ number: num, id });
    segments.push({ type: "footnote", number: num });
    last = m.index + m[0].length;
  }

  const tail = stripHtml(decoded.slice(last));
  if (tail) {
    segments.push({ type: "text", value: tail });
    plain += tail;
  }

  if (segments.length === 0 && decoded.trim()) {
    const fallback = stripHtml(decoded);
    return {
      translation: fallback,
      segments: fallback ? [{ type: "text", value: fallback }] : [],
      refs: [],
    };
  }

  return { translation: plain.trim(), segments, refs };
}

function buildPlainText(translation: string, footnotes: TafheemFootnote[]): string {
  return [translation, ...footnotes.map((f) => f.text)].filter(Boolean).join(" ");
}

async function fetchQulFootnote(id: string): Promise<string> {
  try {
    const res = await fetch(`https://qul.tarteel.ai/foot_notes/${id}`, {
      next: { revalidate: WEEK },
    });
    if (!res.ok) return "";
    return cleanFootnoteBody(await res.text(), id);
  } catch {
    return "";
  }
}

async function resolveFootnotes(
  refs: { number: number; id: string }[],
  footnoteCache: Map<string, string>,
): Promise<TafheemFootnote[]> {
  const footnotes: TafheemFootnote[] = [];
  const uniqueIds = [...new Set(refs.map((r) => r.id))];

  await Promise.all(
    uniqueIds.map(async (id) => {
      if (footnoteCache.has(id)) return;
      footnoteCache.set(id, await fetchQulFootnote(id));
    }),
  );

  for (const ref of refs) {
    const text = footnoteCache.get(ref.id)?.trim();
    if (text) footnotes.push({ number: ref.number, text });
  }
  return footnotes;
}

function buildContent(
  verseKey: string,
  rawHtml: string,
  resourceName: string,
  footnoteCache: Map<string, string>,
): Promise<TafheemContent> {
  const { translation, segments, refs } = parseFootnoteTags(rawHtml);

  return resolveFootnotes(refs, footnoteCache).then((footnotes) => ({
    verseKey,
    translation,
    segments,
    footnotes,
    plainText: buildPlainText(translation, footnotes),
    resourceName,
    hasCommentary: footnotes.length > 0,
  }));
}

/** Load full surah Tafheem (cached). Used by API + background prefetch. */
export async function getTafheemChapter(
  chapterId: number,
): Promise<Record<string, TafheemContent>> {
  const cached = getCachedTafheemChapter(chapterId);
  if (cached) return cached;

  const bundled = await loadBundledTafheemRaw(chapterId);
  if (bundled) {
    const out = await processQulTranslations(bundled);
    if (Object.keys(out).length > 0) {
      setCachedTafheemChapter(chapterId, out);
      return out;
    }
  }

  const chapter = OFFLINE_CHAPTERS.find((c) => c.id === chapterId);
  const from = `${chapterId}:1`;
  const to = chapter ? `${chapterId}:${chapter.versesCount}` : from;

  try {
    const url = `${QUL_API}/translations/${QUL_TAFHEEM_RESOURCE_ID}/by_range?from=${from}&to=${to}`;
    const res = await fetch(url, { next: { revalidate: WEEK } });
    if (!res.ok) throw new Error(`QUL ${res.status}`);

    const data = (await res.json()) as {
      translations?: { verse_key?: string; text?: string; resource_name?: string }[];
    };

    const out = await processQulTranslations(data.translations ?? []);
    if (Object.keys(out).length > 0) {
      setCachedTafheemChapter(chapterId, out);
    }
    return out;
  } catch {
    return {};
  }
}

async function loadBundledTafheemRaw(
  chapterId: number,
): Promise<{ verse_key?: string; text?: string; resource_name?: string }[] | null> {
  const filePath = path.join(process.cwd(), "public/data/tafheem", `${chapterId}.json`);
  try {
    const raw = await readFile(filePath, "utf8");
    const data = JSON.parse(raw) as {
      translations?: { verse_key?: string; text?: string; resource_name?: string }[];
    };
    return data.translations ?? null;
  } catch {
    return null;
  }
}

async function processQulTranslations(
  rows: { verse_key?: string; text?: string; resource_name?: string }[],
): Promise<Record<string, TafheemContent>> {
  const footnoteCache = new Map<string, string>();
  const out: Record<string, TafheemContent> = {};

  await Promise.all(
    rows.map(async (row) => {
      if (!row.verse_key || !row.text?.trim()) return;
      out[row.verse_key] = await buildContent(
        row.verse_key,
        row.text,
        row.resource_name ?? "Tafheem-ul-Quran · Maulana Maududi",
        footnoteCache,
      );
    }),
  );

  return out;
}

export async function getTafheem(verseKey: string): Promise<TafheemContent | null> {
  const parts = parseVerseKey(verseKey);
  if (!parts) return null;

  const chapterData = await getTafheemChapter(parts.chapter);
  if (chapterData[verseKey]) return chapterData[verseKey];

  try {
    const url = `${QUL_API}/translations/for_ayah/${encodeURIComponent(verseKey)}?resource_ids=${QUL_TAFHEEM_RESOURCE_ID}`;
    const res = await fetch(url, { next: { revalidate: WEEK } });
    if (res.ok) {
      const data = (await res.json()) as {
        translations?: { text?: string; resource_name?: string }[];
      };
      const entry = data.translations?.[0];
      if (entry?.text?.trim()) {
        return buildContent(
          verseKey,
          entry.text,
          entry.resource_name ?? "Tafheem-ul-Quran · Maulana Maududi",
          new Map(),
        );
      }
    }
  } catch {
    /* fallback */
  }

  const translation = await fetchMaududiFromCdn(parts.chapter, parts.verse);
  if (!translation) return null;

  return {
    verseKey,
    translation,
    segments: [{ type: "text", value: translation }],
    footnotes: [],
    plainText: translation,
    resourceName: "Tafheem-ul-Quran · Maulana Maududi (Urdu translation)",
    hasCommentary: false,
  };
}

async function fetchMaududiFromCdn(chapter: number, verse: number): Promise<string | null> {
  const paths = [
    `${MAUDUDI_URDU_CDN}/${chapter}/${verse}.json`,
    `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/verses/${globalAyahNumber(chapter, verse)}.json`,
  ];

  for (const url of paths) {
    try {
      const res = await fetch(url, { next: { revalidate: WEEK } });
      if (!res.ok) continue;
      const data = (await res.json()) as { text?: string; translations?: { ur?: string } };
      const text = data.text ?? data.translations?.ur;
      if (text?.trim()) return text.trim();
    } catch {
      /* try next */
    }
  }
  return null;
}

/**
 * Fast Maududi Urdu translations for surah page (CDN only — no QUL blocking).
 */
export async function fetchMaududiUrduChapter(chapterId: number): Promise<Map<number, string>> {
  const map = new Map<number, string>();

  try {
    const res = await fetch(`${QURAN_JSON_CHAPTER}/${chapterId}.json`, {
      next: { revalidate: WEEK },
    });
    if (res.ok) {
      const data = await res.json();
      for (const v of data.verses ?? []) {
        if (v.id && v.translation) map.set(v.id, String(v.translation).trim());
      }
      if (map.size > 0) return map;
    }
  } catch {
    /* fallback */
  }

  try {
    const res = await fetch(`${MAUDUDI_URDU_CDN}/${chapterId}.json`, {
      next: { revalidate: WEEK },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const v of data) {
          if (v.verse && v.text) map.set(v.verse, String(v.text).trim());
        }
      }
    }
  } catch {
    /* empty */
  }

  return map;
}
