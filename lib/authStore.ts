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
  phone?: string;
  joinedAt: number;
  dailyGoal: number;
  provider?: "supabase" | "local";
  picture?: string;
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
    phone: string,
    opts?: { familyInviteCode?: string; asChild?: boolean },
  ) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  updateProfile: (
    patch: Partial<Pick<UserProfile, "name" | "email" | "phone" | "dailyGoal">>,
  ) => Promise<void>;
  /** Offline / misconfigured fallback — local profile only. */
  signInLocal: (name: string, email: string, phone?: string) => void;
}

function profileFromRow(row: Profile, user?: User | null): UserProfile {
  return {
    id: row.id,
    name: row.full_name || row.email.split("@")[0],
    email: row.email,
    phone:
      row.phone ??
      (user?.user_metadata?.phone as string | undefined) ??
      undefined,
    joinedAt: new Date(row.created_at).getTime(),
    dailyGoal: row.daily_goal,
    provider: "supabase",
    picture: row.avatar_url ?? undefined,
  };
}

function profileFromUser(user: User, row?: Profile | null): UserProfile {
  if (row) return profileFromRow(row, user);
  return {
    id: user.id,
    name:
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "User",
    email: user.email ?? "",
    phone: (user.user_metadata?.phone as string | undefined) ?? undefined,
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

  signUp: async (fullName, email, password, phone, opts) => {
    return sbSignUp({
      fullName,
      email,
      password,
      phone,
      familyInviteCode: opts?.familyInviteCode,
      asChild: opts?.asChild,
    });
  },

  signIn: async (email, password) => {
    return sbSignIn(email, password);
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
      phone: patch.phone ?? user.phone,
      dailyGoal: patch.dailyGoal ?? user.dailyGoal,
    };
    set({ user: next });

    if (user.provider === "supabase" && isSupabaseConfigured()) {
      await updateProfileFields(user.id, {
        full_name: next.name,
        phone: next.phone ?? null,
        daily_goal: next.dailyGoal,
      });
    }
  },

  signInLocal: (name, email, phone) =>
    set({
      user: {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || undefined,
        joinedAt: Date.now(),
        dailyGoal: 5,
        provider: "local",
      },
    }),
}));
