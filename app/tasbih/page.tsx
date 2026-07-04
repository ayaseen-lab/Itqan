"use client";

import { useCallback, useEffect, useState } from "react";
import { useProgressStore } from "@/lib/progressStore";
import { useTasbihStore } from "@/lib/tasbihStore";

const R = 86;
const CIRC = 2 * Math.PI * R;

function vibrate(ms: number | number[]) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* not supported */
  }
}

export default function TasbihPage() {
  const [mounted, setMounted] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [customArabic, setCustomArabic] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [customTarget, setCustomTarget] = useState(33);

  const items = useTasbihStore((s) => s.items);
  const activeId = useTasbihStore((s) => s.activeId);
  const setActive = useTasbihStore((s) => s.setActive);
  const incrementStore = useTasbihStore((s) => s.increment);
  const decrement = useTasbihStore((s) => s.decrement);
  const setCount = useTasbihStore((s) => s.setCount);
  const setTarget = useTasbihStore((s) => s.setTarget);
  const resetRound = useTasbihStore((s) => s.resetRound);
  const resetItem = useTasbihStore((s) => s.resetItem);
  const addCustom = useTasbihStore((s) => s.addCustom);
  const removeCustom = useTasbihStore((s) => s.removeCustom);
  const logActivity = useProgressStore((s) => s.logActivity);
  const lifetimeTasbih = useProgressStore((s) => s.lifetime.tasbih);

  const dhikr = items.find((i) => i.id === activeId) ?? items[0];

  useEffect(() => setMounted(true), []);

  const increment = useCallback(() => {
    if (!dhikr) return;
    const beforeRounds = dhikr.rounds;
    logActivity("tasbih", 1);
    incrementStore();
    const after = useTasbihStore.getState().activeItem();
    if (after.rounds > beforeRounds) vibrate([40, 40, 120]);
    else vibrate(18);
  }, [dhikr, incrementStore, logActivity]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "Enter") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        increment();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [increment]);

  if (!mounted || !dhikr) {
    return (
      <div className="card p-8">
        <div className="mx-auto h-64 w-64 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  const progress = dhikr.target > 0 ? dhikr.count / dhikr.target : 0;
  const dash = CIRC * (1 - progress);

  function submitCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customLabel.trim() && !customArabic.trim()) return;
    addCustom({
      label: customLabel.trim() || "Custom dhikr",
      arabic: customArabic.trim() || customLabel.trim(),
      note: customNote.trim() || undefined,
      target: customTarget,
    });
    setCustomLabel("");
    setCustomArabic("");
    setCustomNote("");
    setCustomTarget(33);
    setShowCustom(false);
  }

  return (
    <div className="space-y-6">
      <header className="card banner-grad relative overflow-hidden p-6 text-white sm:p-8">
        <span className="chip bg-white/15 text-white">Dhikr</span>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Digital Tasbih</h1>
        <p className="mt-1 max-w-2xl text-sm text-teal-50/90">
          Many tasbeehat and duas — add your own, set any target, and edit the counter anytime.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowCustom((v) => !v)}
          className="btn-primary text-sm"
        >
          {showCustom ? "Close custom form" : "+ Add custom dhikr"}
        </button>
      </div>

      {showCustom && (
        <form onSubmit={submitCustom} className="card space-y-3 p-5">
          <h2 className="font-semibold">Custom tasbih / dua</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Name (English)</span>
              <input
                className="field"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. Morning dhikr"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Target count</span>
              <input
                type="number"
                min={1}
                max={10000}
                className="field"
                value={customTarget}
                onChange={(e) => setCustomTarget(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Arabic text</span>
            <input
              className="field text-right"
              dir="rtl"
              value={customArabic}
              onChange={(e) => setCustomArabic(e.target.value)}
              placeholder="اكتب الذكر هنا"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Meaning (optional)</span>
            <input
              className="field"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Short meaning"
            />
          </label>
          <button type="submit" className="btn-primary">
            Save custom dhikr
          </button>
        </form>
      )}

      {/* All tasbeehat list */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">All tasbeehat</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d.id)}
              className={`card-interactive flex flex-col items-start gap-1 p-3 text-left ${
                d.id === activeId ? "ring-2 ring-itqan-500" : ""
              }`}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="text-sm font-semibold">{d.label}</span>
                <span className="tabular-nums text-xs font-bold text-itqan-600">
                  {d.count}/{d.target}
                </span>
              </div>
              <span className="quran-text text-base text-itqan-700 dark:text-itqan-300" dir="rtl">
                {d.arabic}
              </span>
              <span className="muted text-[11px]">
                {d.rounds} rounds{d.custom ? " · custom" : ""}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Active counter */}
      <div className="card flex flex-col items-center p-6 sm:p-8">
        <p className="quran-text text-center text-2xl sm:text-3xl" dir="rtl" translate="no">
          {dhikr.arabic}
        </p>
        <p className="mt-1 text-sm font-medium text-itqan-600">{dhikr.label}</p>
        {dhikr.note && <p className="muted mt-0.5 text-xs">{dhikr.note}</p>}

        <button
          type="button"
          onClick={increment}
          className="group relative mt-6 grid h-64 w-64 place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-itqan-500/50"
          aria-label={`Count ${dhikr.label}. Current ${dhikr.count} of ${dhikr.target}.`}
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgb(var(--accent) / 0.15)" strokeWidth="14" />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dash}
              style={{ transition: "stroke-dashoffset 0.25s ease" }}
            />
          </svg>
          <div
            className="grid h-44 w-44 place-items-center rounded-full text-white shadow-inner transition-transform duration-100 group-active:scale-95"
            style={{ backgroundColor: "rgb(var(--accent))" }}
          >
            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums">{dhikr.count}</div>
              <div className="text-sm text-teal-100/80">of {dhikr.target}</div>
            </div>
          </div>
        </button>

        <p className="muted mt-5 text-sm">Tap the circle or press Space to count</p>

        {/* Editable counter controls */}
        <div className="mt-6 flex flex-wrap items-end justify-center gap-3">
          <button type="button" onClick={() => decrement()} className="btn-ghost">
            −1
          </button>
          <label className="block text-center text-xs">
            <span className="muted mb-1 block">Current count</span>
            <input
              type="number"
              min={0}
              max={dhikr.target}
              value={dhikr.count}
              onChange={(e) => setCount(dhikr.id, Number(e.target.value))}
              className="field !w-24 text-center"
            />
          </label>
          <label className="block text-center text-xs">
            <span className="muted mb-1 block">Target</span>
            <input
              type="number"
              min={1}
              max={10000}
              value={dhikr.target}
              onChange={(e) => setTarget(dhikr.id, Number(e.target.value))}
              className="field !w-24 text-center"
            />
          </label>
          <button type="button" onClick={() => resetRound()} className="btn-ghost">
            Reset round
          </button>
          <button type="button" onClick={() => resetItem(dhikr.id)} className="btn-ghost text-red-500">
            Reset this dhikr
          </button>
          {dhikr.custom && (
            <button
              type="button"
              onClick={() => removeCustom(dhikr.id)}
              className="btn-ghost text-red-500"
            >
              Delete custom
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold tabular-nums text-itqan-500">{dhikr.rounds}</div>
          <div className="muted text-sm">Rounds (this dhikr)</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold tabular-nums">{lifetimeTasbih.toLocaleString()}</div>
          <div className="muted text-sm">Lifetime taps</div>
        </div>
        <div className="card col-span-2 p-5 text-center sm:col-span-1">
          <div className="text-3xl font-bold tabular-nums">{items.length}</div>
          <div className="muted text-sm">Tasbeehat saved</div>
        </div>
      </div>
    </div>
  );
}
