"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinedAt: number;
  dailyGoal: number; // verses to review per day
}

interface AuthState {
  user: UserProfile | null;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<UserProfile, "name" | "email" | "dailyGoal">>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      signIn: (name, email) =>
        set({
          user: {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            joinedAt: Date.now(),
            dailyGoal: 5,
          },
        }),
      signOut: () => set({ user: null }),
      updateProfile: (patch) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...patch } });
      },
    }),
    {
      name: "itqan-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
