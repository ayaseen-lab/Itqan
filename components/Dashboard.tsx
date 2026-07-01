"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useHifzCards } from "@/lib/store";
import { computeStats } from "@/lib/srs";

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="card p-4">
      <div className={`text-2xl font-bold ${accent ? "text-itqan-600" : ""}`}>{value}</div>
      <div className="muted text-sm">{label}</div>
    </div>
  );
}

export function Dashboard() {
  const cards = useHifzCards();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch: render neutral state until mounted.
  const stats = mounted ? computeStats(cards) : { total: 0, due: 0, learning: 0, mature: 0 };

  if (mounted && stats.total === 0) {
    return (
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Your Hifz journey starts here</h2>
        <p className="muted mt-1">
          Open any Surah and tap <span className="font-medium">Add to Hifz</span> on a verse to
          begin. Your review schedule will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Today&apos;s memorization</h2>
        <Link href="/memorize" className="text-sm font-medium text-itqan-600 hover:underline">
          Open review session &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Due now" value={stats.due} accent />
        <Stat label="Total verses" value={stats.total} />
        <Stat label="Still learning" value={stats.learning} />
        <Stat label="Mature" value={stats.mature} />
      </div>
    </section>
  );
}
