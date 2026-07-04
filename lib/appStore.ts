"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LastRead {
  surahId: number;
  surahName: string;
  verseKey: string;
  at: number;
}

interface AppState {
  bookmarks: string[]; // verse keys e.g. "2:255"
  lastRead: LastRead | null;
  toggleBookmark: (verseKey: string) => void;
  isBookmarked: (verseKey: string) => boolean;
  setLastRead: (entry: Omit<LastRead, "at">) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      lastRead: null,
      toggleBookmark: (verseKey) =>
        set((s) => {
          const has = s.bookmarks.includes(verseKey);
          return {
            bookmarks: has
              ? s.bookmarks.filter((k) => k !== verseKey)
              : [...s.bookmarks, verseKey],
          };
        }),
      isBookmarked: (verseKey) => get().bookmarks.includes(verseKey),
      setLastRead: (entry) =>
        set({ lastRead: { ...entry, at: Date.now() } }),
    }),
    {
      name: "wabilhuda-app",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
