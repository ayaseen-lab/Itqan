"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { isValidPhone } from "@/lib/supabase/auth";
import { AnimatedModal } from "./AnimatedModal";

type Mode = "signin" | "signup" | "forgot";

export function AuthModal({
  open,
  onClose,
  initialMode = "signin",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}) {
  const configured = useAuthStore((s) => s.configured);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const signInLocal = useAuthStore((s) => s.signInLocal);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [asChild, setAsChild] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError(null);
      setInfo(null);
    }
  }, [open, initialMode]);

  function resetMessages() {
    setError(null);
    setInfo(null);
  }

  function switchMode(next: Mode) {
    setMode(next);
    resetMessages();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    setBusy(true);

    try {
      if (!configured) {
        if (!name.trim() || !email.trim() || !phone.trim()) {
          setError("Name, email, and phone number are required.");
          return;
        }
        if (!isValidPhone(phone)) {
          setError("Please enter a valid phone number (10–15 digits).");
          return;
        }
        signInLocal(name, email, phone);
        onClose();
        return;
      }

      if (mode === "forgot") {
        const result = await requestPasswordReset(email);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setInfo("Check your email for a password reset link. Open it to choose a new password.");
        return;
      }

      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your name.");
          return;
        }
        if (!phone.trim()) {
          setError("Please enter your phone number.");
          return;
        }
        if (!isValidPhone(phone)) {
          setError("Please enter a valid phone number (10–15 digits).");
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        if (asChild && !inviteCode.trim()) {
          setError("Children need a parent family invite code to join.");
          return;
        }
        const result = await signUp(name, email, password, phone, {
          familyInviteCode: inviteCode.trim() || undefined,
          asChild,
        });
        if (!result.ok) {
          if (/check your email|confirm your email/i.test(result.error)) {
            setInfo(result.error);
            setMode("signin");
            return;
          }
          setError(result.error);
          return;
        }
        onClose();
        return;
      }

      const result = await signIn(email, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onClose();
    } finally {
      setBusy(false);
    }
  }

  const title =
    mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back";

  const subtitle =
    mode === "signup"
      ? "Register with your name, email, phone number, and password."
      : mode === "forgot"
        ? "We will email a reset link to your registered address."
        : "Sign in with your email and password.";

  return (
    <AnimatedModal open={open} onClose={onClose} className="!max-w-md !p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="muted mt-1 text-sm">{subtitle}</p>

      {!configured && (
        <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          Supabase is not configured. Using local-only sign-in for now.
        </p>
      )}

      <div className="mt-5 space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {info && <p className="text-sm text-wabil-600 dark:text-wabil-300">{info}</p>}

        <form onSubmit={submit} className="space-y-3">
          {(mode === "signup" || !configured) && (
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                placeholder="Your name"
                autoComplete="name"
                required={mode === "signup" || !configured}
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          {(mode === "signup" || !configured) && (
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Phone number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field"
                placeholder="+92 300 1234567"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </label>
          )}

          {mode !== "forgot" && configured && (
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={6}
                required
              />
            </label>
          )}

          {mode === "signup" && configured && (
            <div className="space-y-2 rounded-xl border p-3" style={{ borderColor: "rgb(var(--border))" }}>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Family invite code (optional)</span>
                <input
                  className="field uppercase tracking-widest"
                  placeholder="Parent’s code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={asChild}
                  onChange={(e) => setAsChild(e.target.checked)}
                  className="rounded"
                />
                I am a child joining with my parent’s invite code
              </label>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary flex-1" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset email"
                    : "Sign in"}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          {mode === "signin" && (
            <>
              <button type="button" className="text-wabil-600 hover:underline" onClick={() => switchMode("forgot")}>
                Forgot password?
              </button>
              <button type="button" className="text-wabil-600 hover:underline" onClick={() => switchMode("signup")}>
                Create account
              </button>
            </>
          )}
          {mode === "signup" && (
            <button type="button" className="text-wabil-600 hover:underline" onClick={() => switchMode("signin")}>
              Already have an account? Sign in
            </button>
          )}
          {mode === "forgot" && (
            <button type="button" className="text-wabil-600 hover:underline" onClick={() => switchMode("signin")}>
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </AnimatedModal>
  );
}

/** @deprecated Use AuthModal */
export const SignInModal = AuthModal;
