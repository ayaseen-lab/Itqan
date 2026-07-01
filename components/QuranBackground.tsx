/**
 * Decorative transparent Quranic Arabic watermark behind the glass UI.
 * Fixed, non-interactive, gives depth without blocking content.
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

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(var(--glow) / 0.12), transparent 70%)",
        }}
      />

      {/* Large central ayah watermark */}
      <p
        className="quran-text absolute left-1/2 top-[18%] w-[min(92vw,56rem)] -translate-x-1/2 text-center text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.8] opacity-[0.04] dark:opacity-[0.06]"
        dir="rtl"
        style={{ filter: "blur(0.3px)" }}
      >
        {verses[0]}
      </p>

      {/* Scattered smaller fragments */}
      {verses.slice(1).map((v, i) => (
        <p
          key={i}
          className="quran-text absolute text-[clamp(1.2rem,3vw,2.2rem)] leading-relaxed opacity-[0.025] dark:opacity-[0.04]"
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
        className="absolute inset-0 h-full w-full opacity-[0.03] dark:opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="itqan-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M24 0 L48 24 L24 48 L0 24 Z"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="0.5"
            />
            <circle cx="24" cy="24" r="2" fill="rgb(var(--accent))" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#itqan-grid)" />
      </svg>

      {/* Bottom fade into content */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(to top, rgb(var(--background)), transparent)",
        }}
      />
    </div>
  );
}
