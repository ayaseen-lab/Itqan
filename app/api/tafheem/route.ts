import { NextResponse } from "next/server";
import { getTafheem, getTafheemChapter } from "@/lib/tafheem";

export const revalidate = 604800;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const verseKey = searchParams.get("verseKey");
  const chapter = searchParams.get("chapter");

  if (chapter && /^\d+$/.test(chapter)) {
    const chapterId = Number(chapter);
    if (chapterId < 1 || chapterId > 114) {
      return NextResponse.json({ error: "Invalid chapter" }, { status: 400 });
    }
    const verses = await getTafheemChapter(chapterId);
    return NextResponse.json({ chapter: chapterId, verses });
  }

  if (!verseKey || !/^\d+:\d+$/.test(verseKey)) {
    return NextResponse.json({ error: "Invalid verseKey" }, { status: 400 });
  }

  const tafheem = await getTafheem(verseKey);
  return NextResponse.json({ tafheem: tafheem ?? null });
}
