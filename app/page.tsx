import Link from "next/link";
import Image from "next/image";
import { Dashboard } from "@/components/Dashboard";
import { GamificationPanel } from "@/components/GamificationPanel";
import { HomeWidgets } from "@/components/HomeWidgets";
import { FeatureShowcase, StatsBand } from "@/components/HomeExtras";
import { HomeQuranSection } from "@/components/HomeQuranSection";
import { Reveal } from "@/components/Reveal";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* ---------- Hero banner ---------- */}
      <section className="card animate-scale-in relative overflow-hidden">
        <div
          className="banner-grad gradient-anim relative px-6 py-10 text-white sm:px-10 sm:py-14"
        >
          {/* floating decorative orbs */}
          <div
            className="animate-float pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-2xl"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }}
            aria-hidden="true"
          />
          <div
            className="animate-float-slow pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #2dd4bf, transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            {/* Left: copy + CTAs */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-300" />
                Complete AI Quran Learning System
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                Master the Quran with <span className="text-gold-300">Itqan</span>
                <span className="quran-text mt-2 block text-3xl text-teal-100/90 sm:text-4xl" dir="rtl">
                  إتقان
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base text-teal-50/90 sm:text-lg">
                Hifz with spaced repetition, tajweed, recitation checking, English Tafseer, daily
                Hadith in Urdu &amp; English, 99 Names, Duas, Tasbih, Prayer Times, streaks, and a
                free AI teacher — all in one beautiful place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/memorize" className="btn shine bg-white font-semibold text-itqan-800 hover:bg-itqan-50">
                  Start Hifz
                </Link>
                <Link href="/quran" className="btn border border-white/40 text-white backdrop-blur hover:bg-white/10">
                  Read Quran
                </Link>
                <Link href="/hadith" className="btn border border-white/40 text-white backdrop-blur hover:bg-white/10">
                  Daily Hadith
                </Link>
              </div>
            </div>

            {/* Right: hero artwork */}
            <div className="animate-float-slow relative mx-auto w-full max-w-md">
              <div
                className="absolute -inset-3 rounded-[1.75rem] opacity-60 blur-2xl"
                style={{ background: "radial-gradient(circle at 60% 40%, rgb(255 215 120 / 0.35), transparent 70%)" }}
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <Image
                  src="/itqan-hero.png"
                  alt="Itqan — a glowing crescent moon over a mosque with the Arabic calligraphy إتقان"
                  width={819}
                  height={546}
                  priority
                  className="h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 55%, rgb(30 27 75 / 0.6))" }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats band ---------- */}
      <Reveal>
        <StatsBand />
      </Reveal>

      {/* ---------- Quick widgets ---------- */}
      <Reveal>
        <HomeWidgets />
      </Reveal>

      {/* ---------- Feature showcase ---------- */}
      <FeatureShowcase />

      {/* ---------- Personal dashboard ---------- */}
      <Reveal>
        <Dashboard />
      </Reveal>

      <Reveal>
        <GamificationPanel compact />
      </Reveal>

      {/* ---------- Complete Quran on homepage ---------- */}
      <HomeQuranSection />
    </div>
  );
}
