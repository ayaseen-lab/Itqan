"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";

export function SignInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const signIn = useAuthStore((s) => s.signIn);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signIn(name, email);
    onClose();
    setName("");
    setEmail("");
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
          Create your local profile to save progress, streaks, and bookmarks on this device.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
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
        <p className="muted mt-4 text-xs">
          Free local sign-in — data stays on your device. Cloud sync can be added later.
        </p>
      </div>
    </div>
  );
}
