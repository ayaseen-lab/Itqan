import { HeroSection } from "@/components/HeroSection";
import { ProgressTracker } from "@/components/ProgressTracker";
import { TasbihWidget } from "@/components/TasbihWidget";
import { Dashboard } from "@/components/Dashboard";
import { HomeSurahStrip } from "@/components/HomeSurahStrip";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <HeroSection />

      <section className="home-section">
        <header>
          <h2 className="home-section-title">Your tools</h2>
          <p className="home-section-desc">Dhikr, daily progress, and Hadith of the day</p>
        </header>
        <div className="grid gap-5 xl:grid-cols-2">
          <TasbihWidget />
          <ProgressTracker />
        </div>
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
