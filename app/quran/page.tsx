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
      {/* Reader banner */}
      <section className="card animate-scale-in relative overflow-hidden">
        <div className="banner-grad gradient-anim relative px-6 py-8 text-white sm:px-8">
          <div
            className="animate-float pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full opacity-40 blur-2xl"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                Al-Qurʾān al-Karīm
              </span>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">The Holy Quran</h1>
              <p className="mt-1 max-w-xl text-sm text-teal-50/90">
                All 114 Surahs · Uthmani script · word-by-word · tajweed colours · Urdu &amp; English · Tafseer
              </p>
            </div>
            <p className="quran-text text-3xl text-gold-300 sm:text-4xl" dir="rtl">
              ٱلْقُرْآن
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <div className="card p-6 text-red-500">{error}</div>
      ) : (
        <SurahList chapters={chapters} />
      )}

      <p className="muted text-center text-xs">
        <Link href="/juz" className="text-itqan-500 hover:underline">
          Prefer to browse by Juz (Para)? →
        </Link>
      </p>
    </div>
  );
}
