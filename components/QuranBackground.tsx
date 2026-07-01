/**
 * Decorative animated backdrop behind the glass UI: floating gradient orbs,
 * a twinkling starfield, an Islamic geometric lattice, and transparent
 * Quranic Arabic watermarks. Fixed, non-interactive, GPU-friendly.
 */
export function QuranBackground() {
  const verses = [
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    "الرَّحْمَٰنِ الرَّحِيمِ",
    "مَالِكِ يَوْمِ الدِّينِ",
    "قُلْ هُوَ اللَّهُ أَحَدٌ",
    "اللَّهُ الصَّمَدُ",
    "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    "وَاذْكُرُوا اللَّهَ كَثِيرًا",
  ];

  // Deterministic star positions so server + client markup match.
  const stars = Array.from({ length: 42 }, (_, i) => {
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
        className="absolute inset-0 opacity-70 dark:opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(var(--glow) / 0.14), transparent 70%)",
        }}
      />

      {/* Floating gradient orbs */}
      <div
        className="animate-float-slow absolute -left-24 top-24 h-72 w-72 rounded-full opacity-40 blur-3xl dark:opacity-30"
        style={{ background: "radial-gradient(circle, #1fa16b, transparent 70%)" }}
      />
      <div
        className="animate-float absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full opacity-30 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(circle, #45bd88, transparent 70%)" }}
      />
      <div
        className="animate-float-slow absolute bottom-8 left-1/3 h-64 w-64 rounded-full opacity-25 blur-3xl dark:opacity-20"
        style={{ background: "radial-gradient(circle, #0f6746, transparent 70%)", animationDelay: "2s" }}
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

      {/* Large central ayah watermark */}
      <p
        className="quran-text absolute left-1/2 top-[18%] w-[min(92vw,56rem)] -translate-x-1/2 text-center text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.8] opacity-[0.045] dark:opacity-[0.07]"
        dir="rtl"
        style={{ filter: "blur(0.3px)" }}
      >
        {verses[0]}
      </p>

      {/* Scattered smaller fragments */}
      {verses.slice(1).map((v, i) => (
        <p
          key={i}
          className="quran-text absolute text-[clamp(1.2rem,3vw,2.2rem)] leading-relaxed opacity-[0.025] dark:opacity-[0.045]"
          dir="rtl"
          style={{
            top: `${12 + (i % 4) * 22}%`,
            left: i % 2 === 0 ? `${4 + i * 3}%` : "auto",
            right: i % 2 === 1 ? `${4 + i * 2}%` : "auto",
            transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
          }}
        >
          {v}
        </p>
      ))}

      {/* Geometric Islamic pattern overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035] dark:opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="itqan-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path
              d="M28 0 L56 28 L28 56 L0 28 Z"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="0.5"
            />
            <path
              d="M28 10 L46 28 L28 46 L10 28 Z"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="0.4"
            />
            <circle cx="28" cy="28" r="2" fill="rgb(var(--accent))" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#itqan-grid)" />
      </svg>

      {/* Bottom fade into content */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, rgb(var(--background)), transparent)" }}
      />
    </div>
  );
}
