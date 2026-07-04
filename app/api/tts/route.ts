import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { EdgeTTS } from "edge-tts-universal";
import { chunkTextForTts } from "@/lib/ttsChunks";

export const runtime = "nodejs";
export const maxDuration = 30;

const CACHE_DIR = path.join(process.cwd(), "public/audio/tts-cache");

const VOICES: Record<"ur" | "en", string[]> = {
  ur: ["ur-PK-UzmaNeural", "ur-PK-AsadNeural"],
  en: ["en-US-JennyNeural", "en-US-GuyNeural"],
};

const MAX_SLICE = 170;

async function fetchGoogleTts(text: string, lang: "ur" | "en"): Promise<Buffer | null> {
  const slice = text.trim().slice(0, MAX_SLICE);
  if (!slice) return null;
  const tl = lang === "ur" ? "ur" : "en";
  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${tl}&q=${encodeURIComponent(slice)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    if (ab.byteLength < 400) return null;
    return Buffer.from(ab);
  } catch {
    return null;
  }
}

async function fetchEdgeVoice(text: string, voice: string): Promise<Buffer | null> {
  const slice = text.trim().slice(0, MAX_SLICE);
  if (!slice) return null;
  try {
    const tts = new EdgeTTS(slice, voice);
    const result = await tts.synthesize();
    const ab = await result.audio.arrayBuffer();
    if (ab.byteLength < 400) return null;
    return Buffer.from(ab);
  } catch {
    return null;
  }
}

async function fetchNeuralTts(text: string, lang: "ur" | "en"): Promise<{ audio: Buffer; voice: string } | null> {
  for (const voice of VOICES[lang]) {
    const audio = await fetchEdgeVoice(text, voice);
    if (audio) return { audio, voice };
  }
  const google = await fetchGoogleTts(text, lang);
  if (google) return { audio: google, voice: `google-${lang}` };
  return null;
}

async function synthesize(text: string, lang: "ur" | "en", chunkIndex?: number) {
  // Prefer treating body as a single chunk (client sends one piece).
  // Fall back to server-side chunking if a long string is posted with chunk index.
  let slice = text.trim();
  let chunks = [slice];
  let idx = 0;

  if (chunkIndex != null && Number.isFinite(chunkIndex)) {
    chunks = chunkTextForTts(text);
    idx = chunkIndex;
    slice = chunks[idx] ?? text.trim().slice(0, MAX_SLICE);
  } else if (slice.length > MAX_SLICE) {
    chunks = chunkTextForTts(text);
    slice = chunks[0] ?? slice.slice(0, MAX_SLICE);
  }

  slice = slice.slice(0, MAX_SLICE);

  if (!slice) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const primaryVoice = VOICES[lang][0];
  const hash = createHash("sha256")
    .update(`v3:${lang}:${primaryVoice}:${slice}`)
    .digest("hex");
  const cacheFile = path.join(CACHE_DIR, `${hash}.mp3`);

  try {
    const cached = await readFile(cacheFile);
    return new NextResponse(new Uint8Array(cached), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Tts-Chunks": String(chunks.length),
        "X-Tts-Chunk": String(idx),
        "X-Tts-Voice": primaryVoice,
      },
    });
  } catch {
    /* generate */
  }

  const result = await fetchNeuralTts(slice, lang);
  if (!result) {
    return NextResponse.json({ error: "TTS unavailable" }, { status: 502 });
  }

  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(cacheFile, result.audio);
  } catch {
    /* optional */
  }

  return new NextResponse(new Uint8Array(result.audio), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Tts-Chunks": String(chunks.length),
      "X-Tts-Chunk": String(idx),
      "X-Tts-Voice": result.voice,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string; lang?: string; chunk?: number };
    const lang: "ur" | "en" = body.lang === "en" ? "en" : "ur";
    // Client sends one chunk at a time (no chunk index) — synthesize that text directly.
    return synthesize(body.text ?? "", lang, body.chunk);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") ?? "";
  const lang: "ur" | "en" = searchParams.get("lang") === "en" ? "en" : "ur";
  const chunkParam = searchParams.get("chunk");
  const chunk = chunkParam != null ? Number(chunkParam) : undefined;
  return synthesize(text, lang, chunk);
}
