"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatHadithRef, getDailyHadith } from "@/lib/hadith";
import { NarrationPlayer } from "@/components/NarrationPlayer";

export function HomeHadithCard() {
  const [mounted, setMounted] = useState(false);
  const hadith = getDailyHadith();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className="card p-6">
        <div className="h-40 animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
      </section>
    );
  }

  return (
    <section className="card flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <h2 className="text-sm font-semibold">Hadith of the day</h2>
          <p className="muted text-xs">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <Link href="/hadith" className="text-xs font-medium text-wabil-600 hover:underline">
          More →
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="quran-text text-right text-xl leading-loose sm:text-2xl" dir="rtl" translate="no">
          {hadith.arabic}
        </p>
        <p className="urdu-text text-base leading-relaxed" dir="rtl" translate="no" lang="ur">
          {hadith.urdu}
        </p>
        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">{hadith.english}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="muted space-y-0.5 text-xs">
            <p>
              <span className="font-medium text-wabil-600">Ref:</span> {formatHadithRef(hadith)}
            </p>
            <p>
              {hadith.source}
              {hadith.narrator ? ` · ${hadith.narrator}` : ""}
            </p>
          </div>
          <NarrationPlayer text={hadith.urdu} lang="ur" label="سنیں" />
        </div>
      </div>
    </section>
  );
}
