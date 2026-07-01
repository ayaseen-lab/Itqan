"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Chapter } from "@/lib/quran";

export function SurahList({ chapters }: { chapters: Chapter[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter(
      (c) =>
        c.nameSimple.toLowerCase().includes(q) ||
        c.translatedName.toLowerCase().includes(q) ||
        String(c.id) === q,
    );
  }, [chapters, query]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Surah by name or number..."
        className="field"
        aria-label="Search Surahs"
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              href={`/surah/${c.id}`}
              className="card flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-itqan-100 text-sm font-semibold text-itqan-800 dark:bg-itqan-950 dark:text-itqan-200">
                {c.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{c.nameSimple}</span>
                <span className="muted block truncate text-sm">
                  {c.translatedName} · {c.versesCount} ayahs · {c.revelationPlace}
                </span>
              </span>
              <span className="quran-text text-xl">{c.nameArabic}</span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="muted py-8 text-center">No Surahs match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}
