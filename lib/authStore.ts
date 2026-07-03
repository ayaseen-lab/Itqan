"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/types";
import {
  fetchProfile,
  signIn as sbSignIn,
  signOut as sbSignOut,
  signUp as sbSignUp,
  updateProfileFields,
  requestPasswordReset,
  updatePassword,
  type AuthResult,
} from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { syncMyProgressToday } from "@/lib/supabase/progressSync";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinedAt: number;
  dailyGoal: number;
  provider?: "supabase" | "google" | "local";
  picture?: string;
  googleId?: string;
  emailConfirmed?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  configured: boolean;
  setSessionUser: (user: User | null) => Promise<void>;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    opts?: { familyInviteCode?: string; asChild?: boolean },
  ) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  updateProfile: (patch: Partial<Pick<UserProfile, "name" | "email" | "dailyGoal">>) => Promise<void>;
  /** Legacy local-only helpers kept for Google button compatibility. */
  signInLocal: (name: string, email: string) => void;
  signInWithGoogle: (profile: {
    name: string;
    email: string;
    picture?: string;
    googleId: string;
  }) => void;
}

function profileFromRow(row: Profile): UserProfile {
  return {
    id: row.id,
    name: row.full_name || row.email.split("@")[0],
    email: row.email,
    joinedAt: new Date(row.created_at).getTime(),
    dailyGoal: row.daily_goal,
    provider: "supabase",
    picture: row.avatar_url ?? undefined,
  };
}

function profileFromUser(user: User, row?: Profile | null): UserProfile {
  if (row) return profileFromRow(row);
  return {
    id: user.id,
    name:
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "User",
    email: user.email ?? "",
    joinedAt: user.created_at ? new Date(user.created_at).getTime() : Date.now(),
    dailyGoal: 5,
    provider: "supabase",
    picture: (user.user_metadata?.avatar_url as string | undefined) ?? undefined,
    emailConfirmed: Boolean(user.email_confirmed_at),
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  configured: isSupabaseConfigured(),

  setSessionUser: async (user) => {
    if (!user) {
      set({ user: null, loading: false });
      return;
    }
    const row = await fetchProfile(user.id);
    set({ user: profileFromUser(user, row), loading: false });
    void syncMyProgressToday();
  },

  signUp: async (fullName, email, password, opts) => {
    const result = await sbSignUp({
      fullName,
      email,
      password,
      familyInviteCode: opts?.familyInviteCode,
      asChild: opts?.asChild,
    });
    return result;
  },

  signIn: async (email, password) => {
    const result = await sbSignIn(email, password);
    return result;
  },

  signOut: async () => {
    await sbSignOut();
    set({ user: null });
  },

  requestPasswordReset: async (email) => requestPasswordReset(email),

  updatePassword: async (password) => updatePassword(password),

  updateProfile: async (patch) => {
    const user = get().user;
    if (!user) return;

    const next = {
      ...user,
      name: patch.name ?? user.name,
      email: patch.email ?? user.email,
      dailyGoal: patch.dailyGoal ?? user.dailyGoal,
    };
    set({ user: next });

    if (user.provider === "supabase" && isSupabaseConfigured()) {
      await updateProfileFields(user.id, {
        full_name: next.name,
        daily_goal: next.dailyGoal,
      });
    }
  },

  signInLocal: (name, email) =>
    set({
      user: {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        joinedAt: Date.now(),
        dailyGoal: 5,
        provider: "local",
      },
    }),

  signInWithGoogle: ({ name, email, picture, googleId }) =>
    set({
      user: {
        id: googleId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        joinedAt: Date.now(),
        dailyGoal: 5,
        provider: "google",
        picture,
        googleId,
      },
    }),
}));
