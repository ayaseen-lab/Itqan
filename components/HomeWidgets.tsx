"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDailyHadith } from "@/lib/hadith";
import { useAppStore } from "@/lib/appStore";

const QUICK = [
  { href: "/quran", label: "Read Quran", desc: "114 Surahs" },
  { href: "/memorize", label: "Hifz Review", desc: "Spaced repetition" },
  { href: "/hadith", label: "Daily Hadith", desc: "Urdu + English" },
  { href: "/juz", label: "30 Juz", desc: "Para by para" },
  { href: "/bookmarks", label: "Bookmarks", desc: "Saved ayahs" },
  { href: "/profile", label: "Profile", desc: "Progress & streaks" },
];

export function HomeWidgets() {
  const lastRead = useAppStore((s) => s.lastRead);
  const [mounted, setMounted] = useState(false);
  const hadith = getDailyHadith();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="card card-hover shine group p-4"
          >
            <span className="font-semibold group-hover:text-itqan-500">{q.label}</span>
            <span className="muted block text-xs">{q.desc}</span>
          </Link>
        ))}
      </div>

      {mounted && lastRead && (
        <Link href={`/surah/${lastRead.surahId}`} className="card card-hover flex items-center justify-between p-4">
          <div>
            <span className="chip">Continue</span>
            <p className="mt-1 font-semibold">{lastRead.surahName}</p>
            <p className="muted text-xs">Ayah {lastRead.verseKey}</p>
          </div>
          <span className="text-itqan-600">→</span>
        </Link>
      )}

      <Link href="/hadith" className="card card-hover block p-5">
        <span className="chip">Hadith of the day</span>
        <p className="quran-text mt-3 text-right text-xl" dir="rtl">
          {hadith.arabic}
        </p>
        <p className="urdu-text mt-2 text-sm leading-relaxed" dir="rtl">
          {hadith.urdu}
        </p>
        <p className="muted mt-2 text-xs">{hadith.source}</p>
      </Link>
    </>
  );
}
