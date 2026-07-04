"use client";

import { useEffect, useState } from "react";
import { useHifzStore } from "@/lib/store";
import { BADGES, TIER_COLORS, levelFromXp } from "@/lib/gamify";

function MedalIcon({ color, muted }: { color: string; muted?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={muted ? "currentColor" : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: muted ? 0.35 : 1 }}>
      <circle cx="12" cy="9" r="6" fill={muted ? "none" : color} fillOpacity="0.15" />
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
    </svg>
  );
}

export function GamificationPanel({ compact = false }: { compact?: boolean }) {
  const gami = useHifzStore((s) => s.gami);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const xp = mounted ? gami.xp : 0;
  const streak = mounted ? gami.streakCurrent : 0;
  const longest = mounted ? gami.streakLongest : 0;
  const earned = new Set(mounted ? gami.earnedBadges : []);
  const { level, intoLevel, needed, progress } = levelFromXp(xp);

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-wabil-600 text-white">
            <div className="text-center leading-none">
              <div className="text-[10px] uppercase tracking-wide opacity-80">Lvl</div>
              <div className="text-xl font-bold">{level}</div>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold">{xp} XP</div>
            <div className="muted text-xs">
              {needed - intoLevel} XP to level {level + 1}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff7e1e" aria-hidden="true">
            <path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-1 .3-1.9.7-2.6C8.4 9 9 8 9 6.5c1.5 1 2 2.5 2 2.5s.5-4 1-7z" />
          </svg>
          <div>
            <div className="font-semibold">{streak} day streak</div>
            <div className="muted text-xs">Best: {longest}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-wabil-100 dark:bg-wabil-950">
        <div className="h-full rounded-full bg-wabil-500 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>

      {!compact && (
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold">
            Badges <span className="muted font-normal">({earned.size}/{BADGES.length})</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BADGES.map((b) => {
              const has = earned.has(b.id);
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 ${has ? "" : "opacity-70"}`}
                  style={{ borderColor: "rgb(var(--border))" }}
                  title={b.description}
                >
                  <MedalIcon color={TIER_COLORS[b.tier]} muted={!has} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{b.title}</div>
                    <div className="muted truncate text-xs">{has ? b.description : "Locked"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
