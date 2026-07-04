"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { GoogleSignInButton } from "./GoogleSignInButton";
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
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInLocal = useAuthStore((s) => s.signInLocal);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
        // Offline / misconfigured fallback — local profile only
        if (!name.trim() || !email.trim()) {
          setError("Name and email are required.");
          return;
        }
        signInLocal(name, email);
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
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        if (asChild && !inviteCode.trim()) {
          setError("Children need a parent family invite code to join.");
          return;
        }
        const result = await signUp(name, email, password, {
          familyInviteCode: inviteCode.trim() || undefined,
          asChild,
        });
        if (!result.ok) {
          // Confirmation-required is a soft success message
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

  function handleGoogleSuccess(profile: {
    name: string;
    email: string;
    picture?: string;
    googleId: string;
  }) {
    signInWithGoogle(profile);
    onClose();
  }

  const title =
    mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back";

  const subtitle =
    mode === "signup"
      ? "Register with name, email, and password. Children can join with a parent invite code."
      : mode === "forgot"
        ? "We will email a reset link to your registered address."
        : "Sign in to sync family progress and competitions.";

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
        {mode === "signin" && (
          <>
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed. Please try again.")}
            />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ backgroundColor: "rgb(var(--border))" }} />
              <span className="muted text-xs">or email</span>
              <div className="h-px flex-1" style={{ backgroundColor: "rgb(var(--border))" }} />
            </div>
          </>
        )}

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
