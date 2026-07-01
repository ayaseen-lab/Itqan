"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "./Reveal";

type Feature = {
  href: string;
  title: string;
  desc: string;
  icon: ReactNode;
};

const ICON = "h-6 w-6";

const FEATURES: Feature[] = [
  {
    href: "/memorize",
    title: "Hifz Memorizer",
    desc: "SM-2 spaced repetition schedules every ayah so it sticks for life.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3 3 3 0 0 1-3 3v1a4 4 0 0 1-8 0v-1a3 3 0 0 1-3-3 3 3 0 0 1 3-3V6a4 4 0 0 1 4-4z" />
        <path d="M12 8v8M9 11h6" />
      </svg>
    ),
  },
  {
    href: "/quran",
    title: "Quran Reader",
    desc: "Uthmani script, word-by-word, tajweed colours, Urdu & English.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M9 7h7M9 11h5" />
      </svg>
    ),
  },
  {
    href: "/memorize",
    title: "Recitation Check",
    desc: "Speak an ayah and get instant word-level accuracy scoring.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
      </svg>
    ),
  },
  {
    href: "/surah/1",
    title: "English Tafseer",
    desc: "Tafsir Ibn Kathir for every ayah, right beside the verse.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c3-1.5 6-1.5 10 0 4-1.5 7-1.5 10 0v13c-3-1.5-6-1.5-10 0-4-1.5-7-1.5-10 0z" />
        <path d="M12 6v13" />
      </svg>
    ),
  },
  {
    href: "/hadith",
    title: "Daily Hadith",
    desc: "Authentic hadith rotating daily — Arabic, Urdu, English & audio.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3" />
        <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      </svg>
    ),
  },
  {
    href: "/juz",
    title: "30 Juz Browser",
    desc: "Jump straight to any para with the traditional divisions.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12.83 2.18 8 4.5a1 1 0 0 1 0 1.74l-8 4.5a2 2 0 0 1-2 0l-8-4.5a1 1 0 0 1 0-1.74l8-4.5a2 2 0 0 1 2 0z" />
        <path d="M2 12.5l10 5.6 10-5.6M2 17.5l10 5.6 10-5.6" />
      </svg>
    ),
  },
  {
    href: "/profile",
    title: "Streaks & XP",
    desc: "Earn XP, level up, keep your streak alive and unlock badges.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A3.5 3.5 0 1 0 15 12c0-2-1.5-3-1.5-5 0 0-3 1.5-3 5 0 .5 0 1-.5 1.5C9 12.5 9 11 8 10c0 0-1.5 2-1.5 4.5" />
      </svg>
    ),
  },
  {
    href: "/quran",
    title: "AI Teacher",
    desc: "Ask anything about tajweed, meaning or memorisation — for free.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="16" height="12" rx="3" />
        <path d="M12 8V4M9 2h6M9 14h.01M15 14h.01M9 18h6" />
      </svg>
    ),
  },
  {
    href: "/names",
    title: "99 Names of Allah",
    desc: "Browse the Asmāʾ al-Ḥusnā with Arabic, transliteration & meaning.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 3l1.8 4.6L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.9L12 3z" />
        <path d="M19 14l.7 1.9 1.9.7-1.9.7L19 19.9l-.7-1.9-1.9-.7 1.9-.7z" />
      </svg>
    ),
  },
  {
    href: "/duas",
    title: "Everyday Duʿāʾ",
    desc: "Authentic supplications for morning, evening, meals, travel & more.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M20.8 6.6a5 5 0 0 0-7.1 0L12 8.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 22l8.8-8.3a5 5 0 0 0 0-7.1z" />
      </svg>
    ),
  },
  {
    href: "/tasbih",
    title: "Digital Tasbih",
    desc: "Count your dhikr with a beautiful tap counter — saved on device.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/prayer",
    title: "Prayer Times",
    desc: "Accurate daily salah times for your location, with the next prayer.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

export function FeatureShowcase() {
  return (
    <section className="space-y-4">
      <Reveal className="text-center">
        <span className="chip">Everything you need</span>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          One platform for your whole <span className="text-gradient">Quran journey</span>
        </h2>
        <p className="muted mx-auto mt-2 max-w-2xl">
          Read, memorise, perfect your tajweed, and grow daily — all in a fast, beautiful,
          distraction-free space.
        </p>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title + i} delay={(i % 4) * 70}>
            <Link href={f.href} className="card card-hover shine group flex h-full flex-col p-5">
              <span
                className="icon-grad grid h-11 w-11 place-items-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              >
                {f.icon}
              </span>
              <h3 className="mt-3 font-semibold group-hover:text-itqan-500">{f.title}</h3>
              <p className="muted mt-1 text-sm leading-relaxed">{f.desc}</p>
              <span className="mt-3 text-sm font-medium text-itqan-500 opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

const STATS = [
  { value: 114, label: "Surahs" },
  { value: 6236, label: "Ayahs" },
  { value: 30, label: "Juz" },
  { value: 99, label: "Names of Allah" },
];

export function StatsBand() {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRun(true)),
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="card banner-grad gradient-anim relative overflow-hidden p-6 text-white">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <StatItem key={s.label} value={s.value} label={s.label} run={run} />
        ))}
      </div>
    </div>
  );
}

function StatItem({ value, label, run }: { value: number; label: string; run: boolean }) {
  const n = useCountUp(value, run);
  return (
    <div className="text-center">
      <div className="text-3xl font-bold tabular-nums sm:text-4xl">{n.toLocaleString()}</div>
      <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-teal-100/80">
        {label}
      </div>
    </div>
  );
}
