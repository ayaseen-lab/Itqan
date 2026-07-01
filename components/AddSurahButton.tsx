"use client";

import { useState } from "react";
import { useHifzStore } from "@/lib/store";

interface SeedCard {
  verseKey: string;
  chapterId: number;
  verseNumber: number;
  textUthmani: string;
}

export function AddSurahButton({
  cards,
  surahName,
}: {
  cards: SeedCard[];
  surahName: string;
}) {
  const addCard = useHifzStore((s) => s.addCard);
  const [added, setAdded] = useState(false);

  function addAll() {
    cards.forEach((c) => addCard(c));
    setAdded(true);
  }

  if (cards.length === 0) return null;

  return (
    <button type="button" onClick={addAll} className="btn-ghost" disabled={added}>
      {added ? `All of ${surahName} added \u2713` : `Add all ${cards.length} verses to Hifz`}
    </button>
  );
}
