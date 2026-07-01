import Link from "next/link";
import { Dashboard } from "@/components/Dashboard";
import { GamificationPanel } from "@/components/GamificationPanel";
import { HomeWidgets } from "@/components/HomeWidgets";
import { FeatureShowcase, StatsBand } from "@/components/HomeExtras";
import { Reveal } from "@/components/Reveal";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* ---------- Hero banner ---------- */}
      <section className="card animate-scale-in relative overflow-hidden">
        <div
          className="gradient-anim relative px-6 py-14 text-white sm:px-10 sm:py-20"
          style={{ backgroundImage: "linear-gradient(120deg, #05261c 0%, #0a3d2a 25%, #128155 55%, #1fa16b 100%)" }}
        >
          {/* floating decorative orbs */}
          <div
            className="animate-float pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-2xl"
            style={{ background: "radial-gradient(circle, #7dd8ac, transparent 70%)" }}
            aria-hidden="true"
          />
          <div
            className="animate-float-slow pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #45bd88, transparent 70%)" }}
            aria-hidden="true"
          />
          {/* rotating star motif */}
          <svg
            className="animate-spin-slow pointer-events-none absolute -right-10 top-1/2 hidden h-56 w-56 -translate-y-1/2 opacity-20 sm:block"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            aria-hidden="true"
          >
            <path d="M24 3 L29 12 L39 9 L36 19 L45 24 L36 29 L39 39 L29 36 L24 45 L19 36 L9 39 L12 29 L3 24 L12 19 L9 9 L19 12 Z" />
            <rect x="15" y="15" width="18" height="18" transform="rotate(45 24 24)" />
            <circle cx="24" cy="24" r="11" />
          </svg>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              Complete AI Quran Learning System
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
              Master the Quran with <span className="text-emerald-200">Itqan</span>
              <span className="quran-text mt-2 block text-3xl text-emerald-100/90 sm:text-4xl" dir="rtl">
                إتقان
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-emerald-50/90">
              Hifz memorisation with spaced repetition, tajweed, recitation checking, English
              Tafseer, daily Hadith in Urdu &amp; English, Juz browsing, streaks, and a free AI teacher —
              in one beautiful place.
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

      {/* ---------- Closing CTA ---------- */}
      <Reveal>
        <section className="card card-hover p-6 text-center">
          <h3 className="text-lg font-semibold">Ready to begin?</h3>
          <p className="muted mx-auto mt-1 max-w-md text-sm">
            Explore every feature from the sidebar — Quran, Hifz, Hadith, Juz, Bookmarks, and Profile.
          </p>
          <Link href="/quran" className="btn-primary shine mt-4 inline-flex">
            Open full Quran reader →
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
