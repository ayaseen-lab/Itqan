"use client";

import { createClient, isSupabaseConfigured } from "./client";
import type { Profile } from "./types";

export type AuthResult = { ok: true } | { ok: false; error: string };

function mapError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/invalid login credentials/i.test(msg)) return "Incorrect email or password.";
  if (/user already registered/i.test(msg)) return "An account with this email already exists. Sign in instead.";
  if (/password/i.test(msg) && /least/i.test(msg)) return "Password must be at least 6 characters.";
  if (/email/i.test(msg) && /invalid/i.test(msg)) return "Please enter a valid email address.";
  if (/rate limit/i.test(msg)) return "Too many attempts. Please wait a moment and try again.";
  return msg || "Something went wrong. Please try again.";
}

export async function signUp(input: {
  email: string;
  password: string;
  fullName: string;
  familyInviteCode?: string;
  asChild?: boolean;
}): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const invite = input.familyInviteCode?.trim().toUpperCase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/profile` : undefined,
    },
  });

  if (error) return { ok: false, error: mapError(error) };

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
    });
  }

  if (data.user && !data.session) {
    return {
      ok: false,
      error: invite
        ? "Account created. Confirm your email, sign in, then join with the family invite code."
        : "Account created. Check your email to confirm, then sign in.",
    };
  }

  if (data.session && invite) {
    const { error: joinErr } = await supabase.rpc("join_family_by_code", {
      code: invite,
      as_child: Boolean(input.asChild),
    });
    if (joinErr) {
      return {
        ok: false,
        error: `Account created, but family join failed: ${mapError(joinErr)}. Join from the Family page.`,
      };
    }
  }

  return { ok: true };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { ok: false, error: mapError(error) };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined,
  });
  if (error) return { ok: false, error: mapError(error) };
  return { ok: true };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: mapError(error) };
  return { ok: true };
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export async function updateProfileFields(
  userId: string,
  patch: Partial<Pick<Profile, "full_name" | "daily_goal" | "avatar_url">>,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) return { ok: false, error: mapError(error) };
  return { ok: true };
}
