import Link from "next/link";
import Image from "next/image";
import { HeroMic3D } from "./HeroMic3D";

const QUICK_LINKS = [
  { href: "/quran", label: "Recitation", icon: "book" },
  { href: "/memorize", label: "AI Hifz", icon: "brain" },
  { href: "/hadith", label: "Hadith", icon: "scroll" },
  { href: "/competition", label: "Competition", icon: "trophy" },
  { href: "/tasbih", label: "Tasbih", icon: "beads" },
  { href: "/juz", label: "Juz (Para)", icon: "layers" },
  { href: "/prayer", label: "Prayer", icon: "clock" },
  { href: "/names", label: "99 Names", icon: "sparkles" },
  { href: "/duas", label: "Duas", icon: "heart" },
] as const;

const DUA_AYAH =
  "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ";

function QuickIcon({ name }: { name: string }) {
  const cls = "h-4 w-4 shrink-0";
  switch (name) {
    case "book":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "brain":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3 3 3 0 0 1-3 3v1a4 4 0 0 1-8 0v-1a3 3 0 0 1-3-3 3 3 0 0 1 3-3V6a4 4 0 0 1 4-4z" />
        </svg>
      );
    case "scroll":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3" />
          <path d="M19 17V5a2 2 0 0 0-2-2H4" />
        </svg>
      );
    case "beads":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "layers":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m12.83 2.18 8 4.5a1 1 0 0 1 0 1.74l-8 4.5a2 2 0 0 1-2 0l-8-4.5a1 1 0 0 1 0-1.74l8-4.5a2 2 0 0 1 2 0z" />
          <path d="M2 12.5l10 5.6 10-5.6" />
        </svg>
      );
    case "clock":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "sparkles":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l1.8 4.6L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.9L12 3z" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.8 6.6a5 5 0 0 0-7.1 0L12 8.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 22l8.8-8.3a5 5 0 0 0 0-7.1z" />
        </svg>
      );
    case "family":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M3 20v-1a5 5 0 0 1 10 0v1" />
          <path d="M14 20v-1a4 4 0 0 1 7 0v1" />
        </svg>
      );
    case "trophy":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
          <path d="M7 6H5a2 2 0 0 0 2 4M17 6h2a2 2 0 0 1-2 4" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
  }
}

export function HeroSection() {
  return (
    <section className="hero-section relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
      <div className="hero-bg absolute inset-0" aria-hidden="true" />
      <div className="hero-pattern absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <div className="hero-ambient-glow absolute inset-0" aria-hidden="true" />
      <div className="hero-particles absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16 xl:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-12">
          <div className="relative z-20 w-full text-center lg:text-left">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f0d78c]/25 bg-[#f0d78c]/10 px-3 py-1 text-xs font-medium text-[#f0d78c]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f0d78c]" />
              Recitation improvement · AI-powered Hifz
            </p>

            <div className="flex flex-col items-center gap-1.5 lg:flex-row lg:items-end lg:gap-4">
              <p
                className="quran-text hero-calligraphy text-[clamp(2.75rem,9vw,4.5rem)] font-bold leading-none"
                dir="rtl"
                translate="no"
              >
                إتقان
              </p>
              <p className="hero-brand-en text-sm font-medium tracking-[0.25em] uppercase lg:pb-2">
                Itqan
              </p>
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-cream sm:text-3xl xl:text-[2.75rem] xl:leading-tight">
              Master recitation.{" "}
              <span className="bg-gradient-to-r from-[#f0d78c] to-[#d4a853] bg-clip-text text-transparent">
                Memorize with AI.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-cream/80 sm:text-lg lg:mx-0">
              Perfect your tajweed with mic feedback, then build Hifz with an AI coach — Tafheem,
              Tafseer, and natural voice included.
            </p>

            <div className="hero-cta-row mt-7">
              <Link href="/quran" className="hero-btn-primary shadow-lg shadow-black/20">
                Perfect Recitation
              </Link>
              <Link href="/memorize" className="hero-btn-secondary">
                AI Hifz Coach
              </Link>
              <Link href="/hadith" className="hero-btn-secondary">
                Hadith
              </Link>
              <span className="hero-mic-slot">
                <HeroMic3D size="lg" />
              </span>
            </div>

            <blockquote className="hero-dedication mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="hero-dedication-text space-y-2 text-sm leading-relaxed text-cream/90 sm:text-[0.95rem]">
                <p className="hero-dedication-line hero-dedication-line--1 hero-dedication-line--nowrap">
                  Remember parents in your prayers, especially my{" "}
                  <span className="hero-dedication-name font-semibold text-[#f0d78c]">
                    Taya Abu (Atta ur Rehman)
                  </span>{" "}
                  <span className="hero-dedication-emoji" aria-hidden="true">
                    🤍
                  </span>
                </p>
                <p className="hero-dedication-line hero-dedication-line--2">
                  Please also remember all Muslim marhumain in your prayers.{" "}
                  <span className="hero-dedication-emoji" aria-hidden="true">
                    🤲
                  </span>
                </p>
              </div>
              <p
                className="quran-text hero-ayah mt-4 text-center text-[#f0d78c]"
                dir="rtl"
                lang="ar"
                translate="no"
              >
                {DUA_AYAH}
              </p>
              <p className="muted mt-1.5 text-center text-[10px] text-cream/50">
                Surah Al-Hashr · 59:10
              </p>
            </blockquote>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:mx-0 lg:max-w-none">
            <div className="hero-mushaf-glow absolute -inset-6 rounded-full blur-3xl" aria-hidden="true" />
            <div className="hero-mihrab-frame relative">
              <div className="hero-mihrab-arch pointer-events-none absolute inset-0" aria-hidden="true" />
              <div className="hero-image-frame relative overflow-hidden rounded-2xl">
                <Image
                  src="/itqan-hero-mushaf.png"
                  alt="Open Quran glowing with golden light inside an emerald mihrab arch"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 640px) 360px, (max-width: 1024px) 420px, 45vw"
                  className="hero-mushaf-image aspect-[3/2] h-auto w-full object-cover"
                />
                <div className="hero-image-shine pointer-events-none absolute inset-0" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <nav className="hero-menu-bar relative z-30 mt-14 sm:mt-16" aria-label="Quick links">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f0d78c]/70 lg:text-left">
            Explore
          </p>
          <ul className="hero-menu-grid">
            {QUICK_LINKS.map((link, i) => (
              <li key={link.href} style={{ animationDelay: `${i * 45}ms` }} className="hero-menu-item-wrap">
                <Link href={link.href} className="hero-quick-link">
                  <span className="hero-quick-link-icon" aria-hidden="true">
                    <QuickIcon name={link.icon} />
                  </span>
                  <span>{link.label}</span>
                  <span className="hero-quick-link-glow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20"
        style={{ background: "linear-gradient(to top, rgb(var(--background)), transparent)" }}
        aria-hidden="true"
      />
    </section>
  );
}
