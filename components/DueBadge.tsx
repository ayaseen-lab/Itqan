"use client";

import { useEffect, useState } from "react";
import { useHifzCards } from "@/lib/store";
import { computeStats } from "@/lib/srs";

/** Small badge showing how many memorization cards are currently due. */
export function DueBadge() {
  const cards = useHifzCards();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const { due } = computeStats(cards);
  if (due === 0) return null;

  return (
    <span className="ml-1 grid min-w-5 place-items-center rounded-full bg-white/25 px-1.5 text-xs font-semibold">
      {due}
    </span>
  );
}
