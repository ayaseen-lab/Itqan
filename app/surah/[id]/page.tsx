import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChapter, getVerses } from "@/lib/quran";
import { VerseCard } from "@/components/VerseCard";
import { AddSurahButton } from "@/components/AddSurahButton";
import { SurahAudioPrefetch } from "@/components/SurahAudioPrefetch";
import { SurahJsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { OFFLINE_CHAPTERS } from "@/lib/offlineData";

export const revalidate = 604800; // 7 days

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chapterId = Number(id);
  const fallback = OFFLINE_CHAPTERS.find((c) => c.id === chapterId);
  const chapter = fallback ?? (await getChapter(chapterId).catch(() => null));

  if (!chapter) {
    return pageMetadata({
      title: `Surah ${chapterId}`,
      description: `Read Surah ${chapterId} online with Arabic, translation, tajweed, and Tafseer on WabilHuda.`,
      path: `/surah/${chapterId}`,
    });
  }

  return pageMetadata({
    title: `Surah ${chapter.nameSimple} (${chapter.translatedName})`,
    description: `Read Surah ${chapter.nameSimple} (${chapter.nameArabic}) — ${chapter.versesCount} verses, ${chapter.revelationPlace}. Arabic with Urdu & English translation, tajweed colours, audio & Tafseer.`,
    path: `/surah/${chapterId}`,
    keywords: [
      `Surah ${chapter.nameSimple}`,
      chapter.translatedName,
      "read Quran online",
      "Quran translation",
    ],
  });
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapterId = Number(id);
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114) {
    notFound();
  }

  const [chapter, verses] = await Promise.all([
    getChapter(chapterId),
    getVerses(chapterId).catch(() => []),
  ]);

  // A valid Surah number that fails to load is a network/API issue, not a
  // missing page, so show a retryable error rather than a 404.
  if (!chapter) {
    return (
      <div className="card p-8 text-center">
        <h1 className="text-xl font-semibold">Couldn&apos;t load Surah {chapterId}</h1>
        <p className="muted mt-2">
          There was a problem reaching the Quran data service. Please check your connection and
          refresh the page.
        </p>
        <Link href="/" className="btn-primary mt-4 inline-flex">
          Back to Surah list
        </Link>
      </div>
    );
  }

  const prev = chapterId > 1 ? chapterId - 1 : null;
  const next = chapterId < 114 ? chapterId + 1 : null;

  const seedCards = verses.map((v) => ({
    verseKey: v.verseKey,
    chapterId: v.chapterId,
    verseNumber: v.verseNumber,
    textUthmani: v.textUthmani,
  }));

  return (
    <div className="space-y-6">
      <SurahJsonLd
        id={chapter.id}
        name={chapter.nameSimple}
        arabicName={chapter.nameArabic}
        translatedName={chapter.translatedName}
        verseCount={chapter.versesCount}
        revelationPlace={chapter.revelationPlace}
      />
      <SurahAudioPrefetch chapterId={chapterId} verseCount={chapter.versesCount} />
      <div className="card p-6 text-center">
        <p className="quran-text text-4xl" dir="rtl" translate="no">{chapter.nameArabic}</p>
        <h1 className="mt-2 text-2xl font-bold">
          {chapter.nameSimple}{" "}
          <span className="muted font-normal">({chapter.translatedName})</span>
        </h1>
        <p className="muted mt-1 text-sm">
          Surah {chapter.id} · {chapter.versesCount} verses · {chapter.revelationPlace}
        </p>
        <div className="mt-4 flex justify-center">
          <AddSurahButton cards={seedCards} surahName={chapter.nameSimple} />
        </div>
      </div>

      {verses.length === 0 ? (
        <div className="card p-6 text-red-500">
          Could not load verses for this Surah. Please refresh to try again.
        </div>
      ) : (
        <div className="space-y-4">
          {verses.map((v) => (
            <VerseCard key={v.verseKey} verse={v} surahName={chapter.nameSimple} />
          ))}
        </div>
      )}

      <nav className="flex items-center justify-between pt-2">
        {prev ? (
          <Link href={`/surah/${prev}`} className="btn-ghost">
            &larr; Surah {prev}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/surah/${next}`} className="btn-ghost">
            Surah {next} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
