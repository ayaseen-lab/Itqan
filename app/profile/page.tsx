"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { useHifzStore, useHifzCards } from "@/lib/store";
import { useAppStore } from "@/lib/appStore";
import { computeStats } from "@/lib/srs";
import { levelFromXp } from "@/lib/gamify";
import { GamificationPanel } from "@/components/GamificationPanel";
import { SignInModal } from "@/components/SignInModal";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const gami = useHifzStore((s) => s.gami);
  const cards = useHifzCards();
  const bookmarks = useAppStore((s) => s.bookmarks);
  const lastRead = useAppStore((s) => s.lastRead);
  const [mounted, setMounted] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [goal, setGoal] = useState(5);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (user) setGoal(user.dailyGoal);
  }, [user]);

  const stats = mounted ? computeStats(cards) : { total: 0, due: 0, learning: 0, mature: 0 };
  const { level } = levelFromXp(mounted ? gami.xp : 0);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="muted mt-2">Sign in to track your Hifz journey, streaks, and achievements.</p>
          <button type="button" onClick={() => setSignInOpen(true)} className="btn-primary mt-6">
            Sign in (free)
          </button>
        </div>
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center gap-4 p-6">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-itqan-600 text-2xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="muted text-sm">{user.email}</p>
          <p className="muted text-xs">
            Member since {new Date(user.joinedAt).toLocaleDateString()}
          </p>
        </div>
        <button type="button" onClick={signOut} className="btn-ghost text-sm text-red-500">
          Sign out
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Level", value: level },
          { label: "Verses in Hifz", value: stats.total },
          { label: "Due today", value: stats.due },
          { label: "Bookmarks", value: bookmarks.length },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-itqan-600">{s.value}</div>
            <div className="muted text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {lastRead && (
        <div className="card p-4">
          <p className="text-sm font-medium">Continue reading</p>
          <Link href={`/surah/${lastRead.surahId}`} className="text-itqan-600 hover:underline">
            {lastRead.surahName} — Ayah {lastRead.verseKey}
          </Link>
        </div>
      )}

      <div className="card p-5">
        <h2 className="font-semibold">Daily goal</h2>
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
          <button
            type="button"
            onClick={() => updateProfile({ dailyGoal: goal })}
            className="btn-primary text-sm"
          >
            Save
          </button>
        </div>
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
