"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/appStore";

export default function BookmarksPage() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggle = useAppStore((s) => s.toggleBookmark);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const list = mounted ? bookmarks : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Verses</h1>
        <p className="muted mt-1 text-sm">Your bookmarked ayahs for quick review</p>
      </div>

      {list.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-lg font-medium">No bookmarks yet</p>
          <p className="muted mt-2 text-sm">
            Tap the bookmark icon on any verse while reading the Quran.
          </p>
          <Link href="/quran" className="btn-primary mt-4 inline-flex">
            Browse Quran
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((key) => {
            const [surah, ayah] = key.split(":");
            return (
              <li key={key} className="card flex items-center justify-between gap-3 p-4">
                <Link href={`/surah/${surah}`} className="min-w-0 flex-1">
                  <span className="font-semibold">Ayah {key}</span>
                  <span className="muted block text-xs">Surah {surah} · Verse {ayah}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="btn-ghost text-sm text-red-500"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
