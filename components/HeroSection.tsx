import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { href: "/quran", label: "Quran" },
  { href: "/memorize", label: "Hifz" },
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
    <section className="hero-section relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="hero-bg absolute inset-0 rounded-none" aria-hidden="true" />
      <div className="hero-pattern absolute inset-0 opacity-[0.05]" aria-hidden="true" />
      <div className="hero-ambient-glow absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16 xl:py-20">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
          {/* Text block */}
          <div className="w-full flex-1 text-center lg:max-w-xl lg:text-left xl:max-w-2xl">
            <div className="flex flex-col items-center gap-1.5 lg:flex-row lg:items-end lg:gap-4">
              <p
                className="quran-text hero-calligraphy text-[clamp(2.5rem,8vw,4rem)] font-bold leading-none"
                dir="rtl"
                translate="no"
              >
                إتقان
              </p>
              <p className="hero-brand-en text-sm font-medium tracking-[0.2em] uppercase lg:pb-1.5">
                Itqan
              </p>
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-cream sm:text-3xl xl:text-4xl">
              Quran learning, simplified
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-cream/75 sm:text-lg lg:mx-0">
              Tajweed, translation, Tafseer, Hifz &amp; Tasbih — all in one calm place.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/quran" className="hero-btn-primary">
                Read Quran
              </Link>
              <Link href="/memorize" className="hero-btn-secondary">
                Start Hifz
              </Link>
            </div>

            <nav
              className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center lg:justify-start [&::-webkit-scrollbar]:hidden"
              aria-label="Quick links"
            >
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hero-quick-link shrink-0">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Hero illustration — visible on all breakpoints */}
          <div className="relative w-full max-w-[340px] shrink-0 sm:max-w-[400px] lg:max-w-[440px] xl:max-w-[520px]">
            <div className="hero-mushaf-glow absolute -inset-6 rounded-3xl blur-3xl" aria-hidden="true" />
            <div className="hero-image-frame relative overflow-hidden rounded-2xl">
              <Image
                src="/itqan-hero-mushaf.png"
                alt="Open Quran on a wooden rehal, glowing with golden light"
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 400px, (max-width: 1280px) 440px, 520px"
                className="relative z-10 aspect-[3/2] h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
        style={{ background: "linear-gradient(to top, rgb(var(--background)), transparent)" }}
        aria-hidden="true"
      />
    </section>
  );
}
