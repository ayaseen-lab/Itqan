import { NextResponse } from "next/server";
import { getVerses } from "@/lib/quran";

export const revalidate = 604800;

/** GET /api/verses?chapter=2&from=1&to=10 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chapter = Number(searchParams.get("chapter"));
  const from = Number(searchParams.get("from") ?? "1");
  const to = Number(searchParams.get("to") ?? "0");

  if (!Number.isFinite(chapter) || chapter < 1 || chapter > 114) {
    return NextResponse.json({ error: "Invalid chapter" }, { status: 400 });
  }

  try {
    const verses = await getVerses(chapter);
    const start = Math.max(1, from || 1);
    const end = to > 0 ? to : verses.length;
    const slice = verses.filter((v) => v.verseNumber >= start && v.verseNumber <= end);
    return NextResponse.json({
      verses: slice.map((v) => ({
        verseKey: v.verseKey,
        chapterId: v.chapterId,
        verseNumber: v.verseNumber,
        textUthmani: v.textUthmani,
        audioUrl: v.audioUrl,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load verses" }, { status: 502 });
  }
}
