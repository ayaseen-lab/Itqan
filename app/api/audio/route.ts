import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { globalAyahNumber } from "@/lib/audio";

export const runtime = "nodejs";

const LOCAL_DIR = path.join(process.cwd(), "public/audio/alafasy");

function remoteUrls(filename: string): string[] {
  const surah = Number(filename.slice(0, 3));
  const ayah = Number(filename.slice(3, 6));
  const global = globalAyahNumber(surah, ayah);
  return [
    `https://everyayah.com/data/Alafasy_64kbps/${filename}`,
    `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${global}.mp3`,
    `https://verses.quran.com/Alafasy/mp3/${filename}`,
    `https://cdn.islamic.network/quran/audio/64/ar.alafasy/${global}.mp3`,
  ];
}

async function fetchFromQuranApi(surah: number, ayah: number): Promise<Response | null> {
  try {
    const meta = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?audio=7`,
      { headers: { Accept: "application/json" }, next: { revalidate: 86400 } },
    );
    if (!meta.ok) return null;
    const data = (await meta.json()) as { verse?: { audio?: { url?: string } } };
    const raw = data.verse?.audio?.url;
    if (!raw) return null;
    const url = raw.startsWith("http") ? raw : `https://verses.quran.com/${raw}`;
    const audio = await fetch(url, { headers: { "User-Agent": "WabilHuda-Quran-App/1.0" } });
    if (!audio.ok || !audio.body) return null;
    return new NextResponse(audio.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800",
      },
    });
  } catch {
    return null;
  }
}

/** GET /api/audio?k=001001 */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("k");

  if (!key || !/^\d{6}$/.test(key)) {
    return NextResponse.json({ error: "Invalid audio key (use k=SSSAAA)" }, { status: 400 });
  }

  const filename = `${key}.mp3`;
  const localPath = path.join(LOCAL_DIR, filename);

  if (fs.existsSync(localPath)) {
    const body = fs.readFileSync(localPath);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  for (const url of remoteUrls(filename)) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "WabilHuda-Quran-App/1.0" },
        next: { revalidate: 60 * 60 * 24 * 7 },
      });
      if (!res.ok || !res.body) continue;
      return new NextResponse(res.body, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=604800",
        },
      });
    } catch {
      continue;
    }
  }

  const surah = Number(key.slice(0, 3));
  const ayah = Number(key.slice(3, 6));
  const apiRes = await fetchFromQuranApi(surah, ayah);
  if (apiRes) return apiRes;

  return NextResponse.json(
    { error: "Audio not found. Run: npm run audio:download" },
    { status: 404 },
  );
}
