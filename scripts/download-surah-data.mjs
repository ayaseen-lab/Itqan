#!/usr/bin/env node
/**
 * Download full surah verse bundles + tafheem chapter JSON for offline-fast loading.
 *
 * Usage:
 *   npm run data:download           # surahs 1, 112, 113, 114
 *   npm run data:download -- 1      # single surah
 *   npm run data:download -- all    # all 114 (slow, large)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SURAH_DIR = path.join(ROOT, "public/data/surahs");
const TAFHEEM_DIR = path.join(ROOT, "public/data/tafheem");

const API = "https://api.quran.com/api/v4";
const URDU_ID = 97;
const ENGLISH_ID = 131;

const VERSE_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89,
  59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30,
  52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15,
  21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

async function apiGet(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "WabilHuda-Data-Download/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

function stripHtml(s) {
  return (s || "").replace(/<[^>]+>/g, "").trim();
}

function pad3(n) {
  return String(n).padStart(3, "0");
}

async function downloadSurah(chapterId) {
  const enParams = new URLSearchParams({
    words: "true",
    word_fields: "text_uthmani,transliteration",
    language: "en",
    translations: `${URDU_ID},${ENGLISH_ID}`,
    fields: "text_uthmani",
    per_page: "300",
  });
  const urParams = new URLSearchParams({
    words: "true",
    word_fields: "text_uthmani",
    language: "ur",
    per_page: "300",
  });

  const [data, urduData] = await Promise.all([
    apiGet(`${API}/verses/by_chapter/${chapterId}?${enParams}`),
    apiGet(`${API}/verses/by_chapter/${chapterId}?${urParams}`).catch(() => ({ verses: [] })),
  ]);

  const urduWordMap = new Map();
  for (const v of urduData.verses || []) {
    for (const w of v.words || []) {
      if (w.char_type_name === "word" && w.translation?.text) {
        urduWordMap.set(`${v.verse_key}:${w.position}`, w.translation.text);
      }
    }
  }

  const verses = (data.verses || []).map((v) => {
    const translations = v.translations || [];
    const urdu = translations.find((t) => Number(t.resource_id) === URDU_ID);
    const english = translations.find((t) => Number(t.resource_id) === ENGLISH_ID);

    const words = (v.words || [])
      .filter((w) => w.char_type_name === "word")
      .map((w) => {
        const audio = w.audio_url || w.audio?.url || null;
        return {
          position: w.position,
          text: w.text_uthmani || w.text || "",
          transliteration: w.transliteration?.text ?? null,
          translation: w.translation?.text ?? null,
          translationUrdu: urduWordMap.get(`${v.verse_key}:${w.position}`) ?? null,
          audioUrl: audio
            ? audio.startsWith("http")
              ? audio
              : `https://audio.qurancdn.com/${audio.replace(/^\//, "")}`
            : null,
        };
      });

    return {
      id: v.id,
      verseKey: v.verse_key,
      chapterId,
      verseNumber: v.verse_number,
      textUthmani: v.text_uthmani || "",
      textTajweed: null,
      audioUrl: `/api/audio?k=${pad3(chapterId)}${String(v.verse_number).padStart(3, "0")}`,
      translations: {
        urdu: urdu?.text ? stripHtml(urdu.text) : null,
        english: english?.text ? stripHtml(english.text) : null,
      },
      words,
    };
  });

  fs.mkdirSync(SURAH_DIR, { recursive: true });
  const out = path.join(SURAH_DIR, `${chapterId}.json`);
  fs.writeFileSync(out, JSON.stringify({ chapterId, verses }, null, 0));
  console.log(`✓ surah ${chapterId} → ${out} (${verses.length} verses)`);
}

async function downloadTafheemChapter(chapterId) {
  const count = VERSE_COUNTS[chapterId - 1];
  const from = `${chapterId}:1`;
  const to = `${chapterId}:${count}`;
  const url = `https://qul.tarteel.ai/api/v1/translations/97/by_range?from=${from}&to=${to}`;
  try {
    const data = await apiGet(url);
    fs.mkdirSync(TAFHEEM_DIR, { recursive: true });
    const out = path.join(TAFHEEM_DIR, `${chapterId}.json`);
    fs.writeFileSync(out, JSON.stringify(data, null, 0));
    console.log(`✓ tafheem ${chapterId} → ${out}`);
  } catch (e) {
    console.warn(`⚠ tafheem ${chapterId} skipped: ${e.message}`);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === "default") return [1, 112, 113, 114];
  if (args[0] === "all") return Array.from({ length: 114 }, (_, i) => i + 1);
  return args.map(Number).filter((n) => n >= 1 && n <= 114);
}

async function main() {
  const ids = parseArgs();
  console.log(`Downloading data for surah(s): ${ids.join(", ")}`);

  for (const id of ids) {
    await downloadSurah(id);
    await downloadTafheemChapter(id);
  }

  console.log("\nDone. Surah pages will load instantly from public/data/surahs/*.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
