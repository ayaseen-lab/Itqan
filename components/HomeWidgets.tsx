"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDailyHadith } from "@/lib/hadith";
import { useAppStore } from "@/lib/appStore";

const QUICK = [
  { href: "/hadith", label: "Daily Hadith" },
  { href: "/juz", label: "Juz (Para)" },
  { href: "/names", label: "99 Names" },
  { href: "/duas", label: "Duas" },
  { href: "/prayer", label: "Prayer Times" },
  { href: "/bookmarks", label: "Bookmarks" },
];

export function HomeWidgets() {
  const lastRead = useAppStore((s) => s.lastRead);
  const [mounted, setMounted] = useState(false);
  const hadith = getDailyHadith();

  useEffect(() => setMounted(true), []);

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="flex flex-col gap-4 p-5">
        {mounted && lastRead && (
          <Link
            href={`/surah/${lastRead.surahId}`}
            className="rounded-xl border p-3 transition-colors hover:border-itqan-400"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <span className="chip text-[10px]">Continue reading</span>
            <p className="mt-1 font-semibold">{lastRead.surahName}</p>
            <p className="muted text-xs">Ayah {lastRead.verseKey}</p>
          </Link>
        )}

        <div className="grid grid-cols-2 gap-2">
          {QUICK.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors hover:border-itqan-400 hover:text-itqan-600"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              {q.label}
            </Link>
          ))}
        </div>

        <Link
          href="/hadith"
          className="mt-auto rounded-xl border p-3 transition-colors hover:border-itqan-400"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          <span className="chip text-[10px]">Hadith of the day</span>
          <p className="quran-text mt-2 text-right text-lg leading-relaxed" dir="rtl" translate="no">
            {hadith.arabic}
          </p>
          <p className="urdu-text mt-2 text-sm leading-relaxed" dir="rtl" translate="no">
            {hadith.urdu}
          </p>
          <p className="muted mt-2 text-xs">{hadith.source}</p>
        </Link>
      </div>
    </div>
  );
}
