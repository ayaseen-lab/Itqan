"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createCard, reviewCard, computeStats, type HifzCard, type Rating } from "./srs";
import {
  XP_PER_RATING,
  XP_PER_NEW_VERSE,
  nextStreak,
  dayKey,
  earnedBadgeIds,
  type BadgeSnapshot,
} from "./gamify";

export interface Gamification {
  xp: number;
  totalReviews: number;
  versesAdded: number; // monotonic counter (does not decrease on remove)
  streakCurrent: number;
  streakLongest: number;
  lastActiveDay: string | null;
  earnedBadges: string[];
}

const initialGami: Gamification = {
  xp: 0,
  totalReviews: 0,
  versesAdded: 0,
  streakCurrent: 0,
  streakLongest: 0,
  lastActiveDay: null,
  earnedBadges: [],
};

interface HifzState {
  cards: Record<string, HifzCard>; // keyed by verseKey
  gami: Gamification;
  addCard: (input: {
    verseKey: string;
    chapterId: number;
    verseNumber: number;
    textUthmani: string;
  }) => void;
  removeCard: (verseKey: string) => void;
  review: (verseKey: string, rating: Rating) => void;
  hasCard: (verseKey: string) => boolean;
  reset: () => void;
}

function applyActivity(
  gami: Gamification,
  cards: Record<string, HifzCard>,
  xpGain: number,
  reviewed: boolean,
  addedVerse: boolean,
): Gamification {
  const streakCurrent = nextStreak(gami.lastActiveDay, gami.streakCurrent);
  const next: Gamification = {
    ...gami,
    xp: gami.xp + xpGain,
    totalReviews: gami.totalReviews + (reviewed ? 1 : 0),
    versesAdded: gami.versesAdded + (addedVerse ? 1 : 0),
    streakCurrent,
    streakLongest: Math.max(gami.streakLongest, streakCurrent),
    lastActiveDay: dayKey(),
  };

  const snapshot: BadgeSnapshot = {
    xp: next.xp,
    totalReviews: next.totalReviews,
    streakLongest: next.streakLongest,
    versesAdded: next.versesAdded,
    matureCount: computeStats(Object.values(cards)).mature,
  };
  next.earnedBadges = Array.from(
    new Set([...gami.earnedBadges, ...earnedBadgeIds(snapshot)]),
  );
  return next;
}

export const useHifzStore = create<HifzState>()(
  persist(
    (set, get) => ({
      cards: {},
      gami: initialGami,
      addCard: (input) =>
        set((state) => {
          if (state.cards[input.verseKey]) return state;
          const cards = { ...state.cards, [input.verseKey]: createCard(input) };
          return {
            cards,
            gami: applyActivity(state.gami, cards, XP_PER_NEW_VERSE, false, true),
          };
        }),
      removeCard: (verseKey) =>
        set((state) => {
          const next = { ...state.cards };
          delete next[verseKey];
          return { cards: next };
        }),
      review: (verseKey, rating) =>
        set((state) => {
          const card = state.cards[verseKey];
          if (!card) return state;
          const cards = { ...state.cards, [verseKey]: reviewCard(card, rating) };
          return {
            cards,
            gami: applyActivity(state.gami, cards, XP_PER_RATING[rating], true, false),
          };
        }),
      hasCard: (verseKey) => Boolean(get().cards[verseKey]),
      reset: () => set({ cards: {}, gami: initialGami }),
    }),
    {
      name: "itqan-hifz",
      storage: createJSONStorage(() => localStorage),
      // We rehydrate manually on the client (see StoreHydrator) so the first
      // render matches the server and avoids hydration mismatches.
      skipHydration: true,
      partialize: (state) => ({ cards: state.cards, gami: state.gami }),
    },
  ),
);

/**
 * Hook that returns all cards as a memoized array. Subscribes to the stable
 * `cards` object so useSyncExternalStore doesn't loop.
 */
export function useHifzCards(): HifzCard[] {
  const cards = useHifzStore((s) => s.cards);
  return useMemo(() => Object.values(cards), [cards]);
}
