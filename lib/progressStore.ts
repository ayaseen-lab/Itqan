"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { dayKey } from "./gamify";

export type ActivityType =
  | "translation"
  | "hifz_new"
  | "hifz_review"
  | "tafseer"
  | "reading"
  | "tasbih";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  count: number;
  note?: string;
  createdAt: number;
}

export interface ProgressGoals {
  translationDaily: number;
  hifzDaily: number;
}

export interface LifetimeTotals {
  translation: number;
  hifzNew: number;
  hifzReview: number;
  tafseer: number;
  reading: number;
  tasbih: number;
}

const DEFAULT_GOALS: ProgressGoals = {
  translationDaily: 10,
  hifzDaily: 5,
};

const EMPTY_LIFETIME: LifetimeTotals = {
  translation: 0,
  hifzNew: 0,
  hifzReview: 0,
  tafseer: 0,
  reading: 0,
  tasbih: 0,
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  translation: "Translation read",
  hifz_new: "New Hifz verse",
  hifz_review: "Hifz review",
  tafseer: "Tafseer studied",
  reading: "Quran reading",
  tasbih: "Tasbih dhikr",
};

interface ProgressState {
  goals: ProgressGoals;
  logsByDay: Record<string, ActivityEntry[]>;
  lifetime: LifetimeTotals;
  logActivity: (type: ActivityType, count: number, note?: string) => void;
  removeLog: (entryId: string, day?: string) => void;
  setGoals: (patch: Partial<ProgressGoals>) => void;
}

function bumpLifetime(lifetime: LifetimeTotals, type: ActivityType, count: number): LifetimeTotals {
  const key =
    type === "hifz_new"
      ? "hifzNew"
      : type === "hifz_review"
        ? "hifzReview"
        : type;
  const current = lifetime[key as keyof LifetimeTotals];
  return { ...lifetime, [key]: Math.max(0, current + count) };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      goals: DEFAULT_GOALS,
      logsByDay: {},
      lifetime: EMPTY_LIFETIME,
      logActivity: (type, count, note) => {
        if (count <= 0) return;
        const today = dayKey();
        const entry: ActivityEntry = {
          id: crypto.randomUUID(),
          type,
          count,
          note: note?.trim() || undefined,
          createdAt: Date.now(),
        };
        set((s) => ({
          logsByDay: {
            ...s.logsByDay,
            [today]: [...(s.logsByDay[today] ?? []), entry],
          },
          lifetime: bumpLifetime(s.lifetime, type, count),
        }));
        // Fire-and-forget cloud sync for family / competitions
        void import("@/lib/supabase/progressSync").then((m) => m.syncMyProgressToday());
      },
      removeLog: (entryId, day = dayKey()) =>
        set((s) => {
          const logs = s.logsByDay[day] ?? [];
          const removed = logs.find((l) => l.id === entryId);
          if (!removed) return s;
          return {
            logsByDay: {
              ...s.logsByDay,
              [day]: logs.filter((l) => l.id !== entryId),
            },
            lifetime: bumpLifetime(s.lifetime, removed.type, -removed.count),
          };
        }),
      setGoals: (patch) =>
        set((s) => ({ goals: { ...s.goals, ...patch } })),
    }),
    {
      name: "itqan-progress",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function getTodayLogs(logsByDay: Record<string, ActivityEntry[]>): ActivityEntry[] {
  return logsByDay[dayKey()] ?? [];
}

export function sumTodayByType(
  logsByDay: Record<string, ActivityEntry[]>,
  types: ActivityType | ActivityType[],
): number {
  const list = Array.isArray(types) ? types : [types];
  return getTodayLogs(logsByDay)
    .filter((l) => list.includes(l.type))
    .reduce((s, l) => s + l.count, 0);
}
