import Link from "next/link";
import Image from "next/image";
import { HeroMic3D } from "./HeroMic3D";

const QUICK_LINKS = [
  { href: "/quran", label: "Recitation" },
  { href: "/memorize", label: "AI Hifz" },
  { href: "/hadith", label: "Hadith" },
  { href: "/tasbih", label: "Tasbih" },
  { href: "/juz", label: "Juz" },
  { href: "/prayer", label: "Prayer" },
  { href: "/names", label: "99 Names" },
  { href: "/duas", label: "Duas" },
  { href: "/bookmarks", label: "Saved" },
];

export function HeroSection() {
  return (
    <section className="hero-section relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
      <div className="hero-bg absolute inset-0" aria-hidden="true" />
      <div className="hero-pattern absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <div className="hero-ambient-glow absolute inset-0" aria-hidden="true" />
      <div className="hero-particles absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16 xl:py-20">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14 xl:gap-20">
          <div className="w-full flex-1 text-center lg:max-w-xl lg:text-left xl:max-w-2xl">
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

            <div className="mt-7 flex flex-wrap items-stretch justify-center gap-3 sm:items-center lg:justify-start">
              <Link href="/quran" className="hero-btn-primary shadow-lg shadow-black/20">
                Perfect Recitation
              </Link>
              <Link href="/memorize" className="hero-btn-secondary">
                AI Hifz Coach
              </Link>
              <HeroMic3D inline />
            </div>
            <p className="mt-2.5 text-center text-xs text-cream/55 lg:text-left">
              Tap the golden mic for instant recitation feedback
            </p>

            <blockquote className="hero-dedication mx-auto mt-7 max-w-md lg:mx-0">
              <p className="text-sm leading-relaxed text-cream/90">
                Remember parents in your prayers, especially{" "}
                <span className="font-semibold text-[#f0d78c]">Taya Abu</span>.
              </p>
            </blockquote>

            <nav
              className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center lg:justify-start [&::-webkit-scrollbar]:hidden"
              aria-label="Quick links"
            >
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hero-quick-link shrink-0">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="relative w-full max-w-[360px] shrink-0 sm:max-w-[420px] lg:max-w-[480px] xl:max-w-[540px]">
            <div className="hero-mushaf-glow absolute -inset-8 rounded-full blur-3xl" aria-hidden="true" />
            <div className="hero-mihrab-frame relative">
              <div className="hero-mihrab-arch pointer-events-none absolute inset-0 z-20" aria-hidden="true" />
              <div className="hero-image-frame relative overflow-hidden rounded-2xl">
                <Image
                  src="/itqan-hero-mushaf.png"
                  alt="Open Quran glowing with golden light inside an emerald mihrab arch"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 640px) 360px, (max-width: 1024px) 420px, (max-width: 1280px) 480px, 540px"
                  className="hero-mushaf-image relative z-10 aspect-[3/2] h-auto w-full object-cover"
                />
                <div className="hero-image-shine pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{ background: "linear-gradient(to top, rgb(var(--background)), transparent)" }}
        aria-hidden="true"
      />
    </section>
  );
}
