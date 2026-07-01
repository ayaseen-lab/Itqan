"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Chapter } from "@/lib/quran";

type Filter = "all" | "makkah" | "madinah";

export function SurahList({ chapters }: { chapters: Chapter[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chapters.filter((c) => {
      const matchesFilter =
        filter === "all" || c.revelationPlace?.toLowerCase() === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        c.nameSimple.toLowerCase().includes(q) ||
        c.translatedName.toLowerCase().includes(q) ||
        c.nameArabic.includes(q) ||
        String(c.id) === q
      );
    });
  }, [chapters, query, filter]);

  const chips: { id: Filter; label: string }[] = [
    { id: "all", label: "All 114" },
    { id: "makkah", label: "Makki" },
    { id: "madinah", label: "Madani" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Surah by name, meaning or number…"
            className="field pl-10"
            aria-label="Search Surahs"
          />
        </div>
        <div className="flex shrink-0 gap-1.5">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                filter === c.id
                  ? "bg-itqan-600 text-white shadow"
                  : "border hover:border-itqan-400"
              }`}
              style={filter === c.id ? undefined : { borderColor: "rgb(var(--border))" }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              href={`/surah/${c.id}`}
              className="card card-hover group flex items-center gap-3.5 p-4"
            >
              <span className="relative grid h-11 w-11 shrink-0 place-items-center">
                <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full text-itqan-300 dark:text-itqan-700" aria-hidden="true">
                  <path
                    d="M22 1.5 32 6 40.5 14.5 45 24.5 40.5 34.5 32 43 22 47.5 12 43 3.5 34.5 -1 24.5 3.5 14.5 12 6 Z"
                    transform="translate(0 -2.5) scale(0.955)"
                    fill="currentColor"
                    opacity="0.18"
                  />
                </svg>
                <span className="relative text-sm font-bold text-itqan-600 dark:text-itqan-300">
                  {c.id}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold group-hover:text-itqan-500">{c.nameSimple}</span>
                <span className="muted block truncate text-xs">
                  {c.translatedName} · {c.versesCount} ayahs
                </span>
              </span>
              <span className="flex flex-col items-end">
                <span className="quran-text text-xl leading-none text-itqan-700 dark:text-itqan-200">{c.nameArabic}</span>
                <span className="mt-1 text-[10px] font-medium capitalize text-gold-500">
                  {c.revelationPlace === "makkah" ? "Makki" : "Madani"}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="muted py-10 text-center">No Surahs match your search.</p>
      )}
    </div>
  );
}
