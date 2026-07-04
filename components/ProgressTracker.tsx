"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProgressStore, sumTodayByType } from "@/lib/progressStore";
import { useHifzCards } from "@/lib/store";
import { computeStats } from "@/lib/srs";
import { formatHadithRef, getDailyHadith } from "@/lib/hadith";
import { NarrationPlayer } from "@/components/NarrationPlayer";

function ProgressBar({
  label,
  value,
  goal,
  color = "rgb(var(--accent))",
}: {
  label: string;
  value: number;
  goal: number;
  color?: string;
}) {
  const pct = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="muted text-xs tabular-nums">
          {value} / {goal} <span className="opacity-70">({pct}%)</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function ProgressTracker() {
  const [mounted, setMounted] = useState(false);

  const goals = useProgressStore((s) => s.goals);
  const logsByDay = useProgressStore((s) => s.logsByDay);
  const lifetime = useProgressStore((s) => s.lifetime);
  const setGoals = useProgressStore((s) => s.setGoals);

  const cards = useHifzCards();
  const hadith = getDailyHadith();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className="card p-6">
        <div className="h-40 animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
      </section>
    );
  }

  const todayTranslation = sumTodayByType(logsByDay, ["translation", "reading", "tafseer"]);
  const todayHifz = sumTodayByType(logsByDay, ["hifz_new", "hifz_review"]);
  const todayTasbih = sumTodayByType(logsByDay, "tasbih");
  const hifzStats = computeStats(cards);

  return (
    <section className="card overflow-hidden">
      <div
        className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <div>
          <h2 className="text-base font-semibold">Today&apos;s progress</h2>
          <p className="muted text-xs">Your daily study, Hifz goals &amp; Hadith</p>
        </div>
        <Link href="/profile" className="text-xs font-medium text-itqan-600 hover:underline">
          Full stats →
        </Link>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProgressBar
            label="Translation & study"
            value={todayTranslation}
            goal={goals.translationDaily}
          />
          <ProgressBar
            label="Hifz (new + review)"
            value={todayHifz}
            goal={goals.hifzDaily}
            color="#d4a853"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums text-itqan-600">
              {lifetime.translation + lifetime.reading + lifetime.tafseer}
            </div>
            <div className="muted text-xs">Total study</div>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums">
              {lifetime.hifzNew + lifetime.hifzReview}
            </div>
            <div className="muted text-xs">Hifz logged</div>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums">{hifzStats.due}</div>
            <div className="muted text-xs">Due today</div>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums">{todayTasbih.toLocaleString()}</div>
            <div className="muted text-xs">Tasbih today</div>
          </div>
        </div>

        <div className="rounded-xl border p-4 text-sm" style={{ borderColor: "rgb(var(--border))" }}>
          <p className="mb-3 font-medium text-itqan-600">Daily goals</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="muted mb-1 block text-xs">Translation / study goal</span>
              <input
                type="number"
                min={1}
                value={goals.translationDaily}
                onChange={(e) => setGoals({ translationDaily: Number(e.target.value) || 1 })}
                className="field text-sm"
              />
            </label>
            <label className="block">
              <span className="muted mb-1 block text-xs">Hifz goal (verses)</span>
              <input
                type="number"
                min={1}
                value={goals.hifzDaily}
                onChange={(e) => setGoals({ hifzDaily: Number(e.target.value) || 1 })}
                className="field text-sm"
              />
            </label>
          </div>
        </div>

        {/* Hadith of the day — same card, below goals */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--accent-soft) / 0.2)" }}
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Hadith of the day</h3>
            <Link href="/hadith" className="text-xs font-medium text-itqan-600 hover:underline">
              More →
            </Link>
          </div>

          <p className="quran-text text-right text-lg leading-loose sm:text-xl" dir="rtl" translate="no">
            {hadith.arabic}
          </p>
          <p className="urdu-text mt-2 text-sm leading-relaxed" dir="rtl" translate="no" lang="ur">
            {hadith.urdu}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {hadith.english}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="muted space-y-0.5 text-xs">
              <p>
                <span className="font-medium text-itqan-600">Ref:</span> {formatHadithRef(hadith)}
              </p>
              <p>
                {hadith.source}
                {hadith.narrator ? ` · ${hadith.narrator}` : ""}
              </p>
            </div>
            <NarrationPlayer text={hadith.urdu} lang="ur" label="سنیں" />
          </div>
        </div>
      </div>
    </section>
  );
}
