"use client";

import Link from "next/link";
import { useHifzStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { useAppStore } from "@/lib/appStore";

export default function SettingsPage() {
  const resetHifz = useHifzStore((s) => s.reset);
  const signOut = useAuthStore((s) => s.signOut);

  function clearAll() {
    if (!confirm("Clear all memorization progress, XP, and badges? This cannot be undone.")) return;
    resetHifz();
  }

  function clearBookmarks() {
    if (!confirm("Remove all bookmarks?")) return;
    useAppStore.setState({ bookmarks: [], lastRead: null });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="muted mt-1 text-sm">Manage your Itqan experience</p>
      </div>

      <section className="card divide-y" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="p-4">
          <h2 className="font-semibold">Appearance</h2>
          <p className="muted text-sm">Use the theme toggle in the sidebar or top bar.</p>
        </div>
        <div className="p-4">
          <h2 className="font-semibold">AI Assistant</h2>
          <p className="muted text-sm">Powered by free Gemini models. Configure GEMINI_API_KEY in .env.local.</p>
        </div>
        <div className="p-4">
          <h2 className="font-semibold">Data</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={clearBookmarks} className="btn-ghost text-sm">
              Clear bookmarks
            </button>
            <button type="button" onClick={clearAll} className="btn-ghost text-sm text-red-500">
              Reset Hifz progress
            </button>
            <button type="button" onClick={signOut} className="btn-ghost text-sm">
              Sign out
            </button>
          </div>
        </div>
      </section>

      <p className="muted text-center text-xs">
        <Link href="/profile" className="text-itqan-600 hover:underline">
          ← Back to profile
        </Link>
      </p>
    </div>
  );
}
