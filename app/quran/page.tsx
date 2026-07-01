import Link from "next/link";
import { getChapters, type Chapter } from "@/lib/quran";
import { SurahList } from "@/components/SurahList";

export const revalidate = 604800;

export default async function QuranPage() {
  let chapters: Chapter[] = [];
  let error: string | null = null;
  try {
    chapters = await getChapters();
  } catch {
    error = "Could not load Surahs. Please check your connection.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Read the Quran</h1>
        <p className="muted mt-1 text-sm">All 114 Surahs · Uthmani text · translations · tajweed · Tafseer</p>
      </div>
      {error ? (
        <div className="card p-6 text-red-500">{error}</div>
      ) : (
        <SurahList chapters={chapters} />
      )}
      <p className="muted text-center text-xs">
        <Link href="/juz" className="text-itqan-600 hover:underline">
          Browse by Juz →
        </Link>
      </p>
    </div>
  );
}
