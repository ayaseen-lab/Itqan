"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface TasbihItem {
  id: string;
  arabic: string;
  label: string;
  /** Optional short meaning / note */
  note?: string;
  target: number;
  /** Current count within the active round */
  count: number;
  /** Completed rounds for this dhikr */
  rounds: number;
  /** Built-in vs user-created */
  custom: boolean;
}

const BUILTIN: Omit<TasbihItem, "count" | "rounds" | "custom">[] = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", label: "SubhanAllah", note: "Glory be to Allah", target: 33 },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", label: "Alhamdulillah", note: "All praise is for Allah", target: 33 },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", label: "Allahu Akbar", note: "Allah is the Greatest", target: 34 },
  { id: "tahlil", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", label: "La ilaha illallah", note: "There is no god but Allah", target: 100 },
  { id: "istighfar", arabic: "أَسْتَغْفِرُ اللَّهَ", label: "Astaghfirullah", note: "I seek Allah's forgiveness", target: 100 },
  {
    id: "salawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    label: "Salawat",
    note: "O Allah, send blessings upon Muhammad",
    target: 100,
  },
  {
    id: "hawqala",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    label: "Hawqala",
    note: "No power except with Allah",
    target: 100,
  },
  {
    id: "hasbunallah",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    label: "Hasbunallah",
    note: "Allah is sufficient for us",
    target: 100,
  },
  {
    id: "subhanallah-wb",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    label: "SubhanAllah wa bihamdihi",
    note: "Glory and praise to Allah",
    target: 100,
  },
  {
    id: "subhanallah-azim",
    arabic: "سُبْحَانَ اللَّهِ الْعَظِيمِ",
    label: "SubhanAllah al-Azeem",
    note: "Glory to Allah the Magnificent",
    target: 100,
  },
  {
    id: "rabbighfir",
    arabic: "رَبِّ اغْفِرْ لِي",
    label: "Rabbighfir li",
    note: "My Lord, forgive me",
    target: 100,
  },
  {
    id: "ya-hayyu",
    arabic: "يَا حَيُّ يَا قَيُّومُ",
    label: "Ya Hayyu Ya Qayyum",
    note: "O Ever-Living, O Sustainer",
    target: 100,
  },
  {
    id: "bismillah",
    arabic: "بِسْمِ اللَّهِ",
    label: "Bismillah",
    note: "In the name of Allah",
    target: 100,
  },
  {
    id: "la-hawla-full",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    label: "Dua Yunus",
    note: "There is no god but You; glory to You",
    target: 100,
  },
  {
    id: "rabbi-zidni",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    label: "Rabbi zidni ilma",
    note: "My Lord, increase me in knowledge",
    target: 33,
  },
];

function seedItems(): TasbihItem[] {
  return BUILTIN.map((d) => ({ ...d, count: 0, rounds: 0, custom: false }));
}

interface TasbihState {
  items: TasbihItem[];
  activeId: string;
  setActive: (id: string) => void;
  increment: (id?: string) => void;
  decrement: (id?: string) => void;
  setCount: (id: string, count: number) => void;
  setTarget: (id: string, target: number) => void;
  resetRound: (id?: string) => void;
  resetItem: (id: string) => void;
  addCustom: (input: { arabic: string; label: string; note?: string; target: number }) => string;
  updateItem: (
    id: string,
    patch: Partial<Pick<TasbihItem, "arabic" | "label" | "note" | "target">>,
  ) => void;
  removeCustom: (id: string) => void;
  activeItem: () => TasbihItem;
}

function bump(
  items: TasbihItem[],
  id: string,
  fn: (item: TasbihItem) => TasbihItem,
): TasbihItem[] {
  return items.map((it) => (it.id === id ? fn(it) : it));
}

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set, get) => ({
      items: seedItems(),
      activeId: BUILTIN[0].id,

      setActive: (id) => {
        if (get().items.some((i) => i.id === id)) set({ activeId: id });
      },

      activeItem: () => {
        const { items, activeId } = get();
        return items.find((i) => i.id === activeId) ?? items[0];
      },

      increment: (id) => {
        const targetId = id ?? get().activeId;
        set((s) => ({
          items: bump(s.items, targetId, (it) => {
            const next = it.count + 1;
            if (next >= it.target) {
              return { ...it, count: 0, rounds: it.rounds + 1 };
            }
            return { ...it, count: next };
          }),
        }));
      },

      decrement: (id) => {
        const targetId = id ?? get().activeId;
        set((s) => ({
          items: bump(s.items, targetId, (it) => ({
            ...it,
            count: Math.max(0, it.count - 1),
          })),
        }));
      },

      setCount: (id, count) => {
        const n = Math.max(0, Math.floor(count));
        set((s) => ({
          items: bump(s.items, id, (it) => {
            if (n >= it.target && it.target > 0) {
              const extraRounds = Math.floor(n / it.target);
              return {
                ...it,
                count: n % it.target,
                rounds: it.rounds + extraRounds,
              };
            }
            return { ...it, count: n };
          }),
        }));
      },

      setTarget: (id, target) => {
        const t = Math.max(1, Math.min(10000, Math.floor(target)));
        set((s) => ({
          items: bump(s.items, id, (it) => ({
            ...it,
            target: t,
            count: Math.min(it.count, t - 1 >= 0 ? t - 1 : 0),
          })),
        }));
      },

      resetRound: (id) => {
        const targetId = id ?? get().activeId;
        set((s) => ({
          items: bump(s.items, targetId, (it) => ({ ...it, count: 0 })),
        }));
      },

      resetItem: (id) => {
        set((s) => ({
          items: bump(s.items, id, (it) => ({ ...it, count: 0, rounds: 0 })),
        }));
      },

      addCustom: (input) => {
        const id = `custom-${Date.now()}`;
        const item: TasbihItem = {
          id,
          arabic: input.arabic.trim() || input.label.trim(),
          label: input.label.trim() || "Custom",
          note: input.note?.trim() || undefined,
          target: Math.max(1, Math.min(10000, Math.floor(input.target) || 33)),
          count: 0,
          rounds: 0,
          custom: true,
        };
        set((s) => ({ items: [...s.items, item], activeId: id }));
        return id;
      },

      updateItem: (id, patch) => {
        set((s) => ({
          items: bump(s.items, id, (it) => {
            const next = { ...it, ...patch };
            if (patch.target != null) {
              next.target = Math.max(1, Math.min(10000, Math.floor(patch.target)));
              next.count = Math.min(it.count, next.target - 1 >= 0 ? next.target - 1 : 0);
            }
            return next;
          }),
        }));
      },

      removeCustom: (id) => {
        set((s) => {
          const item = s.items.find((i) => i.id === id);
          if (!item?.custom) return s;
          const items = s.items.filter((i) => i.id !== id);
          const activeId = s.activeId === id ? items[0]?.id ?? BUILTIN[0].id : s.activeId;
          return { items, activeId };
        });
      },
    }),
    {
      name: "wabilhuda-tasbih-v2",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      merge: (persisted, current) => {
        const p = persisted as Partial<TasbihState> | undefined;
        if (!p?.items?.length) return current;

        // Keep built-in list up to date; preserve counts/rounds/custom targets.
        const byId = new Map(p.items.map((i) => [i.id, i]));
        const mergedBuiltins = seedItems().map((b) => {
          const prev = byId.get(b.id);
          if (!prev) return b;
          return {
            ...b,
            count: prev.count ?? 0,
            rounds: prev.rounds ?? 0,
            target: prev.target > 0 ? prev.target : b.target,
          };
        });
        const customs = p.items.filter((i) => i.custom);
        const items = [...mergedBuiltins, ...customs];
        const activeId =
          items.some((i) => i.id === p.activeId) ? (p.activeId as string) : items[0].id;
        return { ...current, items, activeId };
      },
    },
  ),
);
