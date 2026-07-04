"use client";

import { useMemo, useState } from "react";
import { DUAS, DUA_CATEGORIES } from "@/lib/duas";
import { Reveal } from "@/components/Reveal";

export default function DuasPage() {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () => (active === "All" ? DUAS : DUAS.filter((d) => d.category === active)),
    [active],
  );

  const tabs = ["All", ...DUA_CATEGORIES];

  return (
    <div className="space-y-6">
      <header className="card banner-grad gradient-anim relative overflow-hidden p-6 text-white sm:p-8">
        <span className="chip bg-white/15 text-white">Supplications</span>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Everyday Duʿāʾ</h1>
        <p className="mt-1 max-w-2xl text-sm text-teal-50/90">
          Authentic supplications for the moments of your day — morning &amp; evening, meals,
          travel, forgiveness, and protection.
        </p>
      </header>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              active === t
                ? "bg-wabil-600 text-white shadow-md"
                : "btn-ghost"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((d, i) => (
          <Reveal key={d.id} delay={(i % 2) * 70}>
            <article className="card card-hover flex h-full flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="chip">{d.category}</span>
                {d.reference && <span className="muted text-xs">{d.reference}</span>}
              </div>
              <h2 className="mt-2 font-semibold">{d.title}</h2>
              <p className="quran-text mt-3 text-right text-2xl leading-loose" dir="rtl">
                {d.arabic}
              </p>
              <p className="mt-3 text-sm italic text-wabil-500">{d.transliteration}</p>
              <p className="muted mt-1 text-sm leading-relaxed">{d.translation}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
