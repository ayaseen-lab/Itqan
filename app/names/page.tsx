"use client";

import { useMemo, useState } from "react";
import { NAMES_OF_ALLAH } from "@/lib/names";
import { Reveal } from "@/components/Reveal";

export default function NamesPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return NAMES_OF_ALLAH;
    return NAMES_OF_ALLAH.filter(
      (n) =>
        n.transliteration.toLowerCase().includes(term) ||
        n.meaning.toLowerCase().includes(term) ||
        n.arabic.includes(term) ||
        String(n.id) === term,
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <header className="card banner-grad gradient-anim relative overflow-hidden p-6 text-white sm:p-8">
        <span className="chip bg-white/15 text-white">Asmāʾ al-Ḥusnā</span>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">The 99 Names of Allah</h1>
        <p className="mt-1 max-w-2xl text-sm text-teal-50/90">
          The most beautiful names — each a window into His mercy, majesty, and wisdom.
          Recite, reflect, and let your heart find rest.
        </p>
        <p className="quran-text mt-4 text-right text-2xl" dir="rtl">
          وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا
        </p>
      </header>

      <div className="sticky top-16 z-10">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a name or meaning… (e.g. Rahman, Mercy, 55)"
          className="field glass"
          aria-label="Search the 99 names"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="muted py-10 text-center">No name matches “{q}”.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n, i) => (
            <Reveal key={n.id} delay={(i % 3) * 60}>
              <article className="card card-hover shine group flex h-full items-center gap-4 p-4">
                <span className="icon-grad grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-bold text-white shadow-md transition-transform group-hover:scale-110">
                  {n.id}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold group-hover:text-wabil-500">{n.transliteration}</span>
                    <span className="quran-text text-2xl leading-none text-wabil-500" dir="rtl">
                      {n.arabic}
                    </span>
                  </div>
                  <p className="muted mt-1 text-sm">{n.meaning}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
