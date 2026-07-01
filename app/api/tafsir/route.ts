import { NextResponse } from "next/server";
import { getTafsir } from "@/lib/quran";

export const revalidate = 604800; // 7 days

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const verseKey = searchParams.get("verseKey");

  if (!verseKey || !/^\d+:\d+$/.test(verseKey)) {
    return NextResponse.json({ error: "Invalid verseKey" }, { status: 400 });
  }

  const tafsir = await getTafsir(verseKey);
  return NextResponse.json({ tafsir: tafsir ?? null });
}
