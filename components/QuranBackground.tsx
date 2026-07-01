import { NAMES_OF_ALLAH } from "@/lib/names";

/**
 * Decorative animated backdrop behind the glass UI: floating indigo/gold
 * gradient orbs, a twinkling starfield, an Islamic geometric lattice, and the
 * 99 Names of Allah (Asmāʾ al-Ḥusnā) rendered as a transparent watermark.
 * Fixed, non-interactive, GPU-friendly.
 */
export function QuranBackground() {
  // Central hero calligraphy — the greatest Name.
  const centralName = "اللّٰه";

  // A curated spread of the 99 Names, positioned deterministically so server
  // and client markup always match (no hydration mismatch).
  const scattered = NAMES_OF_ALLAH.filter((_, i) => i % 3 === 0).slice(0, 26);

  // Deterministic star positions.
  const stars = Array.from({ length: 46 }, (_, i) => {
    const x = (i * 97.13) % 100;
    const y = (i * 53.71) % 100;
    const size = 1 + ((i * 7) % 3);
    const delay = (i % 10) * 0.35;
    const dur = 2.6 + ((i * 3) % 4);
    return { x, y, size, delay, dur };
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 opacity-70 dark:opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(var(--glow) / 0.16), transparent 70%)",
        }}
      />

      {/* Floating gradient orbs (indigo + gold) */}
      <div
        className="animate-float-slow absolute -left-24 top-24 h-72 w-72 rounded-full opacity-40 blur-3xl dark:opacity-30"
        style={{ background: "radial-gradient(circle, #14b8a6, transparent 70%)" }}
      />
      <div
        className="animate-float absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full opacity-25 blur-3xl dark:opacity-20"
        style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }}
      />
      <div
        className="animate-float-slow absolute bottom-8 left-1/3 h-64 w-64 rounded-full opacity-30 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(circle, #2dd4bf, transparent 70%)", animationDelay: "2s" }}
      />

      {/* Twinkling starfield */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full"
          style={{
            top: `${s.y}%`,
            left: `${s.x}%`,
            width: s.size,
            height: s.size,
            background: "rgb(var(--accent))",
            boxShadow: "0 0 6px rgb(var(--glow) / 0.8)",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}

      {/* Geometric Islamic pattern overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04] dark:opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="itqan-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="rgb(var(--accent))" strokeWidth="0.5" />
            <path d="M30 10 L50 30 L30 50 L10 30 Z" fill="none" stroke="rgb(var(--accent))" strokeWidth="0.4" />
            <circle cx="30" cy="30" r="2" fill="rgb(var(--accent))" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#itqan-grid)" />
      </svg>

      {/* Central "Allah" calligraphy watermark */}
      <p
        className="quran-text absolute left-1/2 top-[16%] -translate-x-1/2 text-center text-[clamp(4rem,14vw,10rem)] font-bold leading-none opacity-[0.05] dark:opacity-[0.08]"
        dir="rtl"
        style={{
          background: "linear-gradient(180deg, rgb(var(--accent)), rgb(var(--gold)))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {centralName}
      </p>

      {/* 99 Names of Allah — transparent scattered watermark */}
      {scattered.map((name, i) => {
        const top = (7 + ((i * 61) % 86));
        const leftBase = (5 + ((i * 47) % 82));
        const rot = (i % 2 === 0 ? -3 : 3) + ((i % 5) - 2);
        const useGold = i % 4 === 0;
        return (
          <p
            key={name.id}
            className="quran-text absolute whitespace-nowrap text-[clamp(1.1rem,3vw,2.6rem)] font-semibold leading-none opacity-[0.03] dark:opacity-[0.055]"
            dir="rtl"
            style={{
              top: `${top}%`,
              left: `${leftBase}%`,
              transform: `rotate(${rot}deg)`,
              color: useGold ? "rgb(var(--gold))" : "rgb(var(--accent))",
            }}
          >
            {name.arabic}
          </p>
        );
      })}

      {/* Bottom fade into content */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, rgb(var(--background)), transparent)" }}
      />
    </div>
  );
}
