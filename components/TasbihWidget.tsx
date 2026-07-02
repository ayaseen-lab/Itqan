"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useProgressStore } from "@/lib/progressStore";

const DHIKRS = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", label: "SubhanAllah", target: 33 },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", label: "Alhamdulillah", target: 33 },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", label: "Allahu Akbar", target: 34 },
  { id: "tahlil", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", label: "Tahlil", target: 100 },
];

const STORAGE_KEY = "itqan-tasbih-widget";
const RING_R = 62;
const RING_CIRC = 2 * Math.PI * RING_R;
const BEADS = 33;

export function TasbihWidget() {
  const [dhikrId, setDhikrId] = useState(DHIKRS[0].id);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [mounted, setMounted] = useState(false);
  const logActivity = useProgressStore((s) => s.logActivity);
  const lifetimeTasbih = useProgressStore((s) => s.lifetime.tasbih);

  const dhikr = DHIKRS.find((d) => d.id === dhikrId) ?? DHIKRS[0];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.dhikrId === "string" && DHIKRS.some((d) => d.id === s.dhikrId)) {
          setDhikrId(s.dhikrId);
        }
        if (typeof s.rounds === "number") setRounds(s.rounds);
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dhikrId, rounds }));
    } catch {
      /* ignore */
    }
  }, [dhikrId, rounds, mounted]);

  const increment = useCallback(() => {
    logActivity("tasbih", 1);
    setCount((c) => {
      const next = c + 1;
      if (next >= dhikr.target) {
        setRounds((r) => r + 1);
        try {
          navigator.vibrate?.([40, 40, 120]);
        } catch {
          /* ignore */
        }
        return 0;
      }
      try {
        navigator.vibrate?.(12);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [dhikr.target, logActivity]);

  const decrement = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  if (!mounted) {
    return (
      <section className="card p-5">
        <div className="mx-auto h-52 w-52 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
      </section>
    );
  }

  const progress = count / dhikr.target;
  const dash = RING_CIRC * (1 - progress);
  const activeBeads = Math.round(progress * BEADS);

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <h2 className="text-sm font-semibold">Digital Tasbih</h2>
          <p className="muted text-xs">Tap the ring · tracks in your progress</p>
        </div>
        <Link href="/tasbih" className="text-xs font-medium text-itqan-600 hover:underline">
          Full view →
        </Link>
      </div>

      <div className="p-5">
        <div className="mb-4 flex flex-wrap justify-center gap-1.5">
          {DHIKRS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setDhikrId(d.id);
                setCount(0);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                d.id === dhikrId ? "bg-itqan-600 text-white shadow-sm" : "border"
              }`}
              style={d.id === dhikrId ? undefined : { borderColor: "rgb(var(--border))" }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <p className="quran-text mb-4 text-center text-2xl text-itqan-600 dark:text-itqan-400" dir="rtl" translate="no">
          {dhikr.arabic}
        </p>

        <div className="relative mx-auto grid h-56 w-56 place-items-center">
          {/* Bead ring */}
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

          {/* Progress ring */}
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
            className="relative z-10 grid h-36 w-36 place-items-center rounded-full text-white shadow-lg transition-transform active:scale-95"
            style={{
              background: "linear-gradient(145deg, rgb(var(--accent)), #065f46)",
              boxShadow: "0 12px 40px -12px rgb(var(--accent) / 0.6)",
            }}
            aria-label={`Count ${dhikr.label}. ${count} of ${dhikr.target}`}
          >
            <div className="text-center">
              <div className="text-5xl font-bold tabular-nums leading-none">{count}</div>
              <div className="mt-1 text-xs opacity-80">of {dhikr.target}</div>
            </div>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button type="button" onClick={decrement} className="btn-ghost !px-3 text-xs">
            −1
          </button>
          <button type="button" onClick={() => setCount(0)} className="btn-ghost !px-3 text-xs">
            Reset round
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border py-2" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-lg font-bold tabular-nums text-itqan-600">{rounds}</div>
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
