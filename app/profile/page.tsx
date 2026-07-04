"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { useHifzStore, useHifzCards } from "@/lib/store";
import { useAppStore } from "@/lib/appStore";
import { computeStats } from "@/lib/srs";
import { levelFromXp } from "@/lib/gamify";
import { GamificationPanel } from "@/components/GamificationPanel";
import { AuthModal } from "@/components/AuthModal";
import { syncMyProgressToday } from "@/lib/supabase/progressSync";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const configured = useAuthStore((s) => s.configured);
  const signOut = useAuthStore((s) => s.signOut);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const gami = useHifzStore((s) => s.gami);
  const cards = useHifzCards();
  const bookmarks = useAppStore((s) => s.bookmarks);
  const lastRead = useAppStore((s) => s.lastRead);
  const [mounted, setMounted] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [goal, setGoal] = useState(5);
  const [name, setName] = useState("");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (user) {
      setGoal(user.dailyGoal);
      setName(user.name);
      void syncMyProgressToday();
    }
  }, [user]);

  const stats = mounted ? computeStats(cards) : { total: 0, due: 0, learning: 0, mature: 0 };
  const { level } = levelFromXp(mounted ? gami.xp : 0);

  if (!mounted || loading) {
    return <p className="muted py-10 text-center text-sm">Loading account…</p>;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold">Account</h1>
          <p className="muted mt-2">
            Register or sign in to manage your profile, family, and competitions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setSignInOpen(true);
              }}
              className="btn-primary"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setSignInOpen(true);
              }}
              className="btn-secondary"
            >
              Create account
            </button>
          </div>
          {!configured && (
            <p className="muted mt-4 text-xs">
              Tip: add Supabase keys in <code>.env.local</code> for cloud accounts.
            </p>
          )}
        </div>
        <AuthModal open={signInOpen} onClose={() => setSignInOpen(false)} initialMode={authMode} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center gap-4 p-6">
        <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-wabil-600 text-2xl font-bold text-white">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.picture} alt="" className="h-full w-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="muted text-sm">{user.email}</p>
          <p className="muted text-xs">
            Member since {new Date(user.joinedAt).toLocaleDateString()}
            {user.provider ? ` · ${user.provider}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="btn-ghost text-sm text-red-500"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Level", value: level },
          { label: "Verses in Hifz", value: stats.total },
          { label: "Due today", value: stats.due },
          { label: "Bookmarks", value: bookmarks.length },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-wabil-600">{s.value}</div>
            <div className="muted text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/family" className="card block p-5 transition hover:border-wabil-400">
          <h2 className="font-semibold">Family</h2>
          <p className="muted mt-1 text-sm">Add children, share invite codes, track progress together.</p>
        </Link>
        <Link href="/competition" className="card block p-5 transition hover:border-wabil-400">
          <h2 className="font-semibold">Healthy competition</h2>
          <p className="muted mt-1 text-sm">Invite another family and compete on progress & tests.</p>
        </Link>
      </div>

      {lastRead && (
        <div className="card p-4">
          <p className="text-sm font-medium">Continue reading</p>
          <Link href={`/surah/${lastRead.surahId}`} className="text-wabil-600 hover:underline">
            {lastRead.surahName} — Ayah {lastRead.verseKey}
          </Link>
        </div>
      )}

      <div className="card space-y-4 p-5">
        <h2 className="font-semibold">Manage account</h2>
        {savedMsg && <p className="text-sm text-wabil-600">{savedMsg}</p>}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Display name</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input className="field" value={user.email} disabled />
        </label>
        <div>
          <h3 className="text-sm font-medium">Daily goal</h3>
          <p className="muted mb-3 text-sm">How many verses do you want to review per day?</p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={20}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-8 text-center font-bold">{goal}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={async () => {
            await updateProfile({ name, dailyGoal: goal });
            await syncMyProgressToday();
            setSavedMsg("Profile saved.");
            setTimeout(() => setSavedMsg(null), 2000);
          }}
        >
          Save changes
        </button>
        {user.provider === "supabase" && (
          <p className="muted text-xs">
            Forgot your password? Sign out and use <strong>Forgot password</strong> on the sign-in form.
          </p>
        )}
      </div>

      <GamificationPanel />

      <div className="flex flex-wrap gap-3">
        <Link href="/memorize" className="btn-primary">
          Start review
        </Link>
        <Link href="/settings" className="btn-ghost">
          Settings
        </Link>
      </div>
    </div>
  );
}
