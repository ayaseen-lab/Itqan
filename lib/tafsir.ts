/**
 * Tafsir from spa5k CDN — English & Urdu Ibn Kathir.
 */

const WEEK = 60 * 60 * 24 * 7;

export type TafsirLang = "en" | "ur";

export interface TafsirResult {
  text: string;
  resourceName: string;
  lang: TafsirLang;
}

const SLUG: Record<TafsirLang, string> = {
  en: "en-tafisr-ibn-kathir",
  ur: "ur-tafseer-ibn-e-kaseer",
};

const LABEL: Record<TafsirLang, string> = {
  en: "Tafsir Ibn Kathir (English)",
  ur: "Tafsir Ibn Kathir (Urdu)",
};

function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export async function getTafsirByLang(
  verseKey: string,
  lang: TafsirLang,
): Promise<TafsirResult | null> {
  const [chapterStr, verseStr] = verseKey.split(":");
  const chapter = Number(chapterStr);
  const verse = Number(verseStr);
  if (!Number.isFinite(chapter) || !Number.isFinite(verse)) return null;

  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${SLUG[lang]}/${chapter}/${verse}.json`,
      { next: { revalidate: WEEK } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { text?: string };
    if (!data.text?.trim()) return null;
    return {
      text: textToHtml(data.text),
      resourceName: LABEL[lang],
      lang,
    };
  } catch {
    return null;
  }
}
