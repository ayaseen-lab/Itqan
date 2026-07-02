import { OFFLINE_CHAPTERS } from "@/lib/offlineData";
import { SurahList } from "@/components/SurahList";

export function HomeSurahStrip() {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="home-section-title">All 114 Surahs</h2>
        <p className="home-section-desc">
          Choose any Surah to read with tajweed colours, translation, and Tafseer.
        </p>
      </header>
      <SurahList chapters={OFFLINE_CHAPTERS} />
    </div>
  );
}
