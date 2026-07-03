"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";

export default function ResetPasswordPage() {
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const result = await updatePassword(password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/profile"), 1500);
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Choose a new password</h1>
        <p className="muted mt-1 text-sm">
          Open this page from the reset link in your email, then set a new password.
        </p>

        {done ? (
          <p className="mt-6 text-sm text-itqan-600">Password updated. Redirecting to your profile…</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <label className="block">
              <span className="mb-1 block text-sm font-medium">New password</span>
              <input
                type="password"
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                autoComplete="new-password"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Confirm password</span>
              <input
                type="password"
                className="field"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={6}
                required
                autoComplete="new-password"
              />
            </label>
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? "Saving…" : "Update password"}
            </button>
          </form>
        )}
      </div>
      <Link href="/profile" className="muted text-sm hover:underline">
        Back to profile
      </Link>
    </div>
  );
}
