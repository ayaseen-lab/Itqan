import { HeroSection } from "@/components/HeroSection";
import { ProgressTracker } from "@/components/ProgressTracker";
import { TasbihWidget } from "@/components/TasbihWidget";
import { Dashboard } from "@/components/Dashboard";
import { HomeSurahStrip } from "@/components/HomeSurahStrip";
import { RaahbanCareerCard } from "@/components/RaahbanCareerCard";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <div className="mx-auto max-w-6xl space-y-8 px-3 py-8 sm:space-y-10 sm:px-4 sm:py-10">
        <section className="home-section">
          <header>
            <h2 className="home-section-title">Your tools</h2>
            <p className="home-section-desc">Dhikr, daily progress, and Hadith of the day</p>
          </header>
          <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
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

        <section className="home-section">
          <header>
            <h2 className="home-section-title">Career guidance</h2>
            <p className="home-section-desc">
              Planning university admissions after FSc? Get merit and scholarship help on Raahban.
            </p>
          </header>
          <RaahbanCareerCard />
        </section>
      </div>
    </div>
  );
}
