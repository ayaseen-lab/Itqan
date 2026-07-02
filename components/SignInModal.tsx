"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function SignInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const signIn = useAuthStore((s) => s.signIn);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signIn(name, email);
    onClose();
    setName("");
    setEmail("");
    setError(null);
  }

  function handleGoogleSuccess(profile: {
    name: string;
    email: string;
    picture?: string;
    googleId: string;
  }) {
    signInWithGoogle(profile);
    onClose();
    setError(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="card relative w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Sign in to Itqan</h2>
        <p className="muted mt-1 text-sm">
          Save your Hifz progress, streaks, and bookmarks on this device.
        </p>

        <div className="mt-5 space-y-4">
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-in failed. Please try again.")}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: "rgb(var(--border))" }} />
            <span className="muted text-xs">or sign in with email</span>
            <div className="h-px flex-1" style={{ backgroundColor: "rgb(var(--border))" }} />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                placeholder="Your name"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                placeholder="you@example.com"
                required
              />
            </label>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn-primary flex-1">
                Sign in
              </button>
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <p className="muted mt-4 text-xs">
          Your data is stored locally on this device. Google sign-in uses your Google account profile only.
        </p>
      </div>
    </div>
  );
}
