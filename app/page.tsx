import { HeroSection } from "@/components/HeroSection";
import { ProgressTracker } from "@/components/ProgressTracker";
import { TasbihWidget } from "@/components/TasbihWidget";
import { HomeWidgets } from "@/components/HomeWidgets";
import { Dashboard } from "@/components/Dashboard";
import { HomeSurahStrip } from "@/components/HomeSurahStrip";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <HeroSection />

      <section className="home-section">
        <header>
          <h2 className="home-section-title">Your tools</h2>
          <p className="home-section-desc">Count dhikr and track today&apos;s Quran progress</p>
        </header>
        <div className="grid gap-5 xl:grid-cols-2">
          <TasbihWidget />
          <ProgressTracker />
        </div>
      </section>

      <section className="home-section">
        <header>
          <h2 className="home-section-title">Quick access</h2>
          <p className="home-section-desc">Hadith, prayer times, and shortcuts</p>
        </header>
        <HomeWidgets />
      </section>

      <section className="home-section">
        <Dashboard />
      </section>

      <section className="home-section">
        <HomeSurahStrip />
      </section>
    </div>
  );
}
