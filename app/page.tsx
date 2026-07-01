import Link from "next/link";
import { Dashboard } from "@/components/Dashboard";
import { GamificationPanel } from "@/components/GamificationPanel";
import { HomeWidgets } from "@/components/HomeWidgets";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="card relative overflow-hidden">
        <div
          className="relative px-6 py-12 text-white sm:px-10 sm:py-16"
          style={{ backgroundImage: "linear-gradient(135deg, #0a3d2a 0%, #128155 40%, #1fa16b 100%)" }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-2xl"
            style={{ background: "radial-gradient(circle, #7dd8ac, transparent 70%)" }}
            aria-hidden="true"
          />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            Complete Quran Learning System
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            Itqan — إتقان
          </h1>
          <p className="mt-3 max-w-2xl text-emerald-50/90">
            Mastery in Quran learning: Hifz memorization, tajweed, recitation check, English Tafseer,
            daily Hadith in Urdu &amp; English, Juz browsing, bookmarks, streaks, and a free AI teacher.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/memorize" className="btn bg-white font-semibold text-itqan-800 hover:bg-itqan-50">
              Start Hifz
            </Link>
            <Link href="/quran" className="btn border border-white/40 text-white hover:bg-white/10">
              Read Quran
            </Link>
            <Link href="/hadith" className="btn border border-white/40 text-white hover:bg-white/10">
              Daily Hadith
            </Link>
          </div>
        </div>
      </section>

      <HomeWidgets />

      <Dashboard />

      <GamificationPanel compact />

      <section className="card p-5 text-center">
        <p className="muted text-sm">
          Explore all features from the sidebar menu — Quran, Hifz, Hadith, Juz, Bookmarks, and Profile.
        </p>
        <Link href="/quran" className="btn-primary mt-3 inline-flex">
          Open full Quran reader
        </Link>
      </section>
    </div>
  );
}
