"use client";

import { useCallback, useEffect, useState } from "react";

const DHIKRS = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", label: "SubhanAllah", target: 33 },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", label: "Alhamdulillah", target: 33 },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", label: "Allahu Akbar", target: 34 },
  { id: "tahlil", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", label: "La ilaha illallah", target: 100 },
  { id: "istighfar", arabic: "أَسْتَغْفِرُ اللَّهَ", label: "Astaghfirullah", target: 100 },
];

const STORAGE_KEY = "itqan-tasbih";
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
  const [dhikrId, setDhikrId] = useState(DHIKRS[0].id);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [lifetime, setLifetime] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const dhikr = DHIKRS.find((d) => d.id === dhikrId) ?? DHIKRS[0];
  const target = dhikr.target;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.lifetime === "number") setLifetime(s.lifetime);
        if (typeof s.rounds === "number") setRounds(s.rounds);
        if (typeof s.dhikrId === "string" && DHIKRS.some((d) => d.id === s.dhikrId))
          setDhikrId(s.dhikrId);
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lifetime, rounds, dhikrId }));
    } catch {
      /* ignore */
    }
  }, [lifetime, rounds, dhikrId, loaded]);

  const increment = useCallback(() => {
    setLifetime((l) => l + 1);
    setCount((c) => {
      const next = c + 1;
      if (next >= target) {
        setRounds((r) => r + 1);
        vibrate([40, 40, 120]);
        return 0;
      }
      vibrate(18);
      return next;
    });
  }, [target]);

  // Space / Enter also count.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        increment();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [increment]);

  const progress = count / target;
  const dash = CIRC * (1 - progress);

  return (
    <div className="space-y-6">
      <header className="card banner-grad gradient-anim relative overflow-hidden p-6 text-white sm:p-8">
        <span className="chip bg-white/15 text-white">Dhikr</span>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Digital Tasbih</h1>
        <p className="mt-1 max-w-2xl text-sm text-teal-50/90">
          Count your remembrance of Allah. Tap the circle, press space, or use the beads —
          your total is saved on this device.
        </p>
      </header>

      {/* Dhikr selector */}
      <div className="flex flex-wrap gap-2">
        {DHIKRS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => {
              setDhikrId(d.id);
              setCount(0);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              d.id === dhikrId ? "bg-itqan-600 text-white shadow-md" : "btn-ghost"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="card flex flex-col items-center p-8">
        <p className="quran-text text-3xl text-itqan-500" dir="rtl">
          {dhikr.arabic}
        </p>

        {/* Counter ring */}
        <button
          type="button"
          onClick={increment}
          className="group relative mt-6 grid h-64 w-64 place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-itqan-500/50"
          aria-label={`Count ${dhikr.label}. Current ${count} of ${target}.`}
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgb(var(--accent) / 0.15)" strokeWidth="14" />
            <circle
              cx="100" cy="100" r={R} fill="none" stroke="rgb(var(--accent))" strokeWidth="14"
              strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={dash}
              style={{ transition: "stroke-dashoffset 0.25s ease" }}
            />
          </svg>
          <div
            className="grid h-44 w-44 place-items-center rounded-full text-white shadow-inner transition-transform duration-100 group-active:scale-95"
            style={{ backgroundImage: "linear-gradient(145deg, #14b8a6, #042f2e)" }}
          >
            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums">{count}</div>
              <div className="text-sm text-teal-100/80">of {target}</div>
            </div>
          </div>
        </button>

        <p className="muted mt-5 text-sm">Tap the circle or press Space to count</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => setCount(0)} className="btn-ghost">
            Reset round
          </button>
          <button
            type="button"
            onClick={() => {
              setCount(0);
              setRounds(0);
              setLifetime(0);
            }}
            className="btn-ghost text-red-500"
          >
            Reset all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card card-hover p-5 text-center">
          <div className="text-3xl font-bold text-itqan-500 tabular-nums">{rounds}</div>
          <div className="muted text-sm">Rounds completed</div>
        </div>
        <div className="card card-hover p-5 text-center">
          <div className="text-3xl font-bold tabular-nums">{lifetime.toLocaleString()}</div>
          <div className="muted text-sm">Lifetime count</div>
        </div>
      </div>
    </div>
  );
}
