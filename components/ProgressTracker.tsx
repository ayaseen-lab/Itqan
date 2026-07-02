"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useProgressStore,
  getTodayLogs,
  sumTodayByType,
  ACTIVITY_LABELS,
  type ActivityType,
} from "@/lib/progressStore";
import { useHifzCards } from "@/lib/store";
import { computeStats } from "@/lib/srs";

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

const QUICK_LOG: { type: ActivityType; label: string; count: number }[] = [
  { type: "translation", label: "+1 Translation", count: 1 },
  { type: "translation", label: "+5 Ayahs", count: 5 },
  { type: "hifz_new", label: "+1 Hifz", count: 1 },
  { type: "hifz_review", label: "+1 Review", count: 1 },
  { type: "tafseer", label: "+1 Tafseer", count: 1 },
  { type: "reading", label: "+1 Reading", count: 1 },
];

export function ProgressTracker() {
  const [mounted, setMounted] = useState(false);
  const [manualType, setManualType] = useState<ActivityType>("translation");
  const [manualCount, setManualCount] = useState(1);
  const [manualNote, setManualNote] = useState("");

  const goals = useProgressStore((s) => s.goals);
  const logsByDay = useProgressStore((s) => s.logsByDay);
  const lifetime = useProgressStore((s) => s.lifetime);
  const logActivity = useProgressStore((s) => s.logActivity);
  const removeLog = useProgressStore((s) => s.removeLog);
  const setGoals = useProgressStore((s) => s.setGoals);

  const cards = useHifzCards();

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
  const todayLogs = getTodayLogs(logsByDay);
  const hifzStats = computeStats(cards);

  function submitManual(e: React.FormEvent) {
    e.preventDefault();
    if (manualCount < 1) return;
    logActivity(manualType, manualCount, manualNote);
    setManualNote("");
    setManualCount(1);
  }

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <h2 className="text-base font-semibold">Today&apos;s progress</h2>
          <p className="muted text-xs">Track translation, Hifz, and log what you did manually</p>
        </div>
        <Link href="/profile" className="text-xs font-medium text-itqan-600 hover:underline">
          Full stats →
        </Link>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProgressBar label="Translation & study" value={todayTranslation} goal={goals.translationDaily} />
          <ProgressBar label="Hifz (new + review)" value={todayHifz} goal={goals.hifzDaily} color="#d4a853" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_LOG.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => logActivity(q.type, q.count)}
              className="rounded-xl border px-2 py-2 text-xs font-medium transition-colors hover:border-itqan-400 hover:text-itqan-600"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              {q.label}
            </button>
          ))}
        </div>

        <form onSubmit={submitManual} className="rounded-xl border p-4" style={{ borderColor: "rgb(var(--border))" }}>
          <p className="mb-3 text-sm font-medium">Log manually</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block sm:col-span-2 lg:col-span-1">
              <span className="muted mb-1 block text-xs">Activity</span>
              <select
                value={manualType}
                onChange={(e) => setManualType(e.target.value as ActivityType)}
                className="field text-sm"
              >
                {(Object.keys(ACTIVITY_LABELS) as ActivityType[]).map((t) => (
                  <option key={t} value={t}>
                    {ACTIVITY_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="muted mb-1 block text-xs">Count</span>
              <input
                type="number"
                min={1}
                max={999}
                value={manualCount}
                onChange={(e) => setManualCount(Number(e.target.value))}
                className="field text-sm"
              />
            </label>
            <label className="block sm:col-span-2 lg:col-span-1">
              <span className="muted mb-1 block text-xs">Note (optional)</span>
              <input
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                placeholder="e.g. Surah Al-Mulk"
                className="field text-sm"
              />
            </label>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                Add log
              </button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums text-itqan-600">{lifetime.translation + lifetime.reading + lifetime.tafseer}</div>
            <div className="muted text-xs">Total study</div>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums">{lifetime.hifzNew + lifetime.hifzReview}</div>
            <div className="muted text-xs">Hifz logged</div>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums">{hifzStats.total}</div>
            <div className="muted text-xs">In deck</div>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-xl font-bold tabular-nums">{lifetime.tasbih.toLocaleString()}</div>
            <div className="muted text-xs">Tasbih total</div>
          </div>
        </div>

        {todayLogs.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Today&apos;s log</p>
            <ul className="max-h-40 space-y-1.5 overflow-y-auto">
              {[...todayLogs].reverse().map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: "rgb(var(--border))" }}
                >
                  <span>
                    <span className="font-medium">{ACTIVITY_LABELS[log.type]}</span>
                    <span className="muted"> · +{log.count}</span>
                    {log.note && <span className="muted text-xs"> — {log.note}</span>}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLog(log.id)}
                    className="muted shrink-0 text-xs hover:text-red-500"
                    aria-label="Remove log"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-itqan-600">Edit daily goals</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
        </details>
      </div>
    </section>
  );
}
