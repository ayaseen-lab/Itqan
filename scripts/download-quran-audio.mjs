#!/usr/bin/env node
/**
 * Download Mishary Alafasy ayah MP3s into public/audio/alafasy/
 *
 * Primary: everyayah verse-by-verse zip (~824 MB, 64 kbps).
 * Fallback: per-ayah download from the same host.
 *
 * Usage: npm run audio:download
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { execSync } from "child_process";
import https from "https";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/audio/alafasy");
const ZIP_URL = "https://everyayah.com/data/Alafasy_64kbps/000_versebyverse.zip";
const ZIP_PATH = path.join(OUT_DIR, "_versebyverse.zip");
const AYAH_BASE = "https://everyayah.com/data/Alafasy_64kbps";

const VERSE_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89,
  59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30,
  52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15,
  21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

function fetchToFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const request = proto.get(
      url,
      { headers: { "User-Agent": "Itqan-Quran-App/1.0 (audio bundle setup)" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchToFile(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const file = createWriteStream(dest);
        pipeline(res, file).then(resolve).catch(reject);
      },
    );
    request.on("error", reject);
  });
}

function countMp3(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mp3") && !f.startsWith("_")).length;
}

async function downloadZip() {
  console.log("Downloading everyayah verse-by-verse zip (~824 MB)...");
  console.log(ZIP_URL);
  await fetchToFile(ZIP_URL, ZIP_PATH);
  console.log("Extracting MP3 files...");
  execSync(`unzip -o -j "${ZIP_PATH}" "*.mp3" -d "${OUT_DIR}"`, { stdio: "inherit" });
  fs.unlinkSync(ZIP_PATH);
}

async function downloadAyah(surah, ayah) {
  const name = `${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;
  const dest = path.join(OUT_DIR, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return;
  const url = `${AYAH_BASE}/${name}`;
  await fetchToFile(url, dest);
}

async function downloadAllAyahs() {
  console.log("Downloading ayahs individually...");
  let done = 0;
  const total = VERSE_COUNTS.reduce((a, b) => a + b, 0);
  for (let s = 1; s <= VERSE_COUNTS.length; s++) {
    const n = VERSE_COUNTS[s - 1];
    for (let a = 1; a <= n; a++) {
      try {
        await downloadAyah(s, a);
        done++;
        if (done % 100 === 0) console.log(`  ${done}/${total} ayahs`);
      } catch (e) {
        console.warn(`  skip ${s}:${a} — ${e.message}`);
      }
    }
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const existing = countMp3(OUT_DIR);
  if (existing >= 6200) {
    console.log(`Already have ${existing} ayah MP3s in public/audio/alafasy/ — skipping.`);
    return;
  }

  try {
    await downloadZip();
  } catch (e) {
    console.warn(`Zip download failed (${e.message}). Trying per-ayah download...`);
    await downloadAllAyahs();
  }

  const final = countMp3(OUT_DIR);
  console.log(`Done — ${final} ayah audio files in public/audio/alafasy/`);
  if (final < 100) {
    console.error(
      "\nFew files downloaded. Run this script on a machine with internet access,\n" +
        "or manually place SSSAAA.mp3 files in public/audio/alafasy/\n" +
        "from https://everyayah.com/data/Alafasy_64kbps/",
    );
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
