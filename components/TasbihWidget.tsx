"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useProgressStore } from "@/lib/progressStore";
import { useTasbihStore } from "@/lib/tasbihStore";

const RING_R = 62;
const RING_CIRC = 2 * Math.PI * RING_R;
const BEADS = 33;

export function TasbihWidget() {
  const [mounted, setMounted] = useState(false);
  const items = useTasbihStore((s) => s.items);
  const activeId = useTasbihStore((s) => s.activeId);
  const setActive = useTasbihStore((s) => s.setActive);
  const incrementStore = useTasbihStore((s) => s.increment);
  const decrement = useTasbihStore((s) => s.decrement);
  const resetRound = useTasbihStore((s) => s.resetRound);
  const setCount = useTasbihStore((s) => s.setCount);
  const setTarget = useTasbihStore((s) => s.setTarget);
  const logActivity = useProgressStore((s) => s.logActivity);
  const lifetimeTasbih = useProgressStore((s) => s.lifetime.tasbih);

  const dhikr = items.find((i) => i.id === activeId) ?? items[0];

  useEffect(() => setMounted(true), []);

  const increment = useCallback(() => {
    logActivity("tasbih", 1);
    incrementStore();
    try {
      const it = useTasbihStore.getState().activeItem();
      if (it.count === 0 && it.rounds > 0) {
        navigator.vibrate?.([40, 40, 120]);
      } else {
        navigator.vibrate?.(12);
      }
    } catch {
      /* ignore */
    }
  }, [incrementStore, logActivity]);

  if (!mounted || !dhikr) {
    return (
      <section className="card p-5">
        <div className="mx-auto h-52 w-52 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
      </section>
    );
  }

  const progress = dhikr.target > 0 ? dhikr.count / dhikr.target : 0;
  const dash = RING_CIRC * (1 - progress);
  const activeBeads = Math.round(progress * BEADS);

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3 sm:px-5" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Digital Tasbih</h2>
          <p className="muted text-xs">Multiple dhikr · custom targets</p>
        </div>
        <Link href="/tasbih" className="shrink-0 text-xs font-medium text-wabil-400 hover:underline">
          Full view →
        </Link>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex max-h-24 flex-wrap justify-center gap-1.5 overflow-y-auto">
          {items.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                d.id === activeId ? "bg-wabil-600 text-white shadow-sm" : "border"
              }`}
              style={d.id === activeId ? undefined : { borderColor: "rgb(var(--border))" }}
            >
              {d.label}
              {d.custom ? " ★" : ""}
            </button>
          ))}
        </div>

        <p className="quran-text mb-1 text-center text-2xl text-wabil-600 dark:text-wabil-400" dir="rtl" translate="no">
          {dhikr.arabic}
        </p>
        {dhikr.note && <p className="muted mb-4 text-center text-xs">{dhikr.note}</p>}

        <div className="relative mx-auto grid h-48 w-48 place-items-center sm:h-56 sm:w-56">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 240 240" aria-hidden="true">
            {Array.from({ length: BEADS }).map((_, i) => {
              const angle = (i / BEADS) * 2 * Math.PI - Math.PI / 2;
              const x = 120 + Math.cos(angle) * 108;
              const y = 120 + Math.sin(angle) * 108;
              const lit = i < activeBeads;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={lit ? 4.5 : 3}
                  fill={lit ? "rgb(var(--accent))" : "rgb(var(--border))"}
                  opacity={lit ? 1 : 0.5}
                />
              );
            })}
          </svg>

          <svg className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
            <circle cx="80" cy="80" r={RING_R} fill="none" stroke="rgb(var(--accent) / 0.12)" strokeWidth="10" />
            <circle
              cx="80"
              cy="80"
              r={RING_R}
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={dash}
              style={{ transition: "stroke-dashoffset 0.2s ease" }}
            />
          </svg>

          <button
            type="button"
            onClick={increment}
            className="relative z-10 grid h-28 w-28 place-items-center rounded-full text-white shadow-lg transition-transform active:scale-95 sm:h-36 sm:w-36"
            style={{
              background: "linear-gradient(145deg, rgb(var(--accent)), #065f46)",
              boxShadow: "0 12px 40px -12px rgb(var(--accent) / 0.6)",
            }}
            aria-label={`Count ${dhikr.label}. ${dhikr.count} of ${dhikr.target}`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold tabular-nums leading-none sm:text-5xl">{dhikr.count}</div>
              <div className="mt-1 text-xs opacity-80">of {dhikr.target}</div>
            </div>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={() => decrement()} className="btn-ghost !px-3 text-xs">
            −1
          </button>
          <label className="flex items-center gap-1 text-xs">
            <span className="muted">Count</span>
            <input
              type="number"
              min={0}
              max={dhikr.target}
              value={dhikr.count}
              onChange={(e) => setCount(dhikr.id, Number(e.target.value))}
              className="field !w-16 !px-2 !py-1 text-center text-xs"
            />
          </label>
          <label className="flex items-center gap-1 text-xs">
            <span className="muted">Target</span>
            <input
              type="number"
              min={1}
              max={10000}
              value={dhikr.target}
              onChange={(e) => setTarget(dhikr.id, Number(e.target.value))}
              className="field !w-16 !px-2 !py-1 text-center text-xs"
            />
          </label>
          <button type="button" onClick={() => resetRound()} className="btn-ghost !px-3 text-xs">
            Reset
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border py-2" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-lg font-bold tabular-nums text-wabil-600">{dhikr.rounds}</div>
            <div className="muted text-[10px]">Rounds</div>
          </div>
          <div className="rounded-xl border py-2" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-lg font-bold tabular-nums">{lifetimeTasbih.toLocaleString()}</div>
            <div className="muted text-[10px]">All-time</div>
          </div>
          <div className="rounded-xl border py-2" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-lg font-bold tabular-nums">{Math.round(progress * 100)}%</div>
            <div className="muted text-[10px]">Round</div>
          </div>
        </div>
      </div>
    </section>
  );
}
