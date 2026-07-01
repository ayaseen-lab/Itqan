import { getChapters } from "@/lib/quran";
import { SurahList } from "@/components/SurahList";
import { Reveal } from "@/components/Reveal";

/** Homepage section — all 114 Surahs visible without clicking away. */
export async function HomeQuranSection() {
  const chapters = await getChapters();

  return (
    <Reveal>
      <section className="space-y-5">
        <div className="text-center">
          <span className="chip">Ready to begin?</span>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Complete Quran — <span className="text-gradient">all 114 Surahs</span>
          </h2>
          <p className="muted mx-auto mt-2 max-w-xl text-sm">
            Tap any Surah below to read with tajweed colours, translation, Tafseer, and Hifz tools.
            No need to navigate away — everything starts here.
          </p>
        </div>
        <SurahList chapters={chapters} />
      </section>
    </Reveal>
  );
}
