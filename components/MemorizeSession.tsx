"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHifzStore, useHifzCards } from "@/lib/store";
import { dueCards, formatDue, computeStats, type Rating, type HifzCard } from "@/lib/srs";
import { RecitationChecker } from "./RecitationChecker";

const RATINGS: { key: Rating; label: string; hint: string; className: string }[] = [
  { key: "again", label: "Again", hint: "Forgot", className: "bg-red-500 text-white hover:bg-red-600" },
  { key: "hard", label: "Hard", hint: "Struggled", className: "bg-amber-500 text-white hover:bg-amber-600" },
  { key: "good", label: "Good", hint: "Recalled", className: "bg-itqan-600 text-white hover:bg-itqan-700" },
  { key: "easy", label: "Easy", hint: "Perfect", className: "bg-itqan-500 text-white hover:bg-itqan-600" },
];

function ReviewCard({ card }: { card: HifzCard }) {
  const review = useHifzStore((s) => s.review);
  const [revealed, setRevealed] = useState(false);
  const [checking, setChecking] = useState(false);

  function rate(rating: Rating) {
    review(card.verseKey, rating);
    setRevealed(false);
    setChecking(false);
  }

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold">Ayah {card.verseKey}</span>
        <Link href={`/surah/${card.chapterId}`} className="text-sm text-itqan-600 hover:underline">
          Open Surah
        </Link>
      </div>

      {revealed ? (
        <p className="quran-text text-right text-3xl" dir="rtl">
          {card.textUthmani}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="muted">Recite this ayah from memory, then reveal to check.</p>
          <button type="button" onClick={() => setRevealed(true)} className="btn-primary">
            Reveal ayah
          </button>
          <button
            type="button"
            onClick={() => setChecking((v) => !v)}
            className="text-sm text-itqan-600 hover:underline"
          >
            {checking ? "Hide voice check" : "Check with my voice first"}
          </button>
        </div>
      )}

      {checking && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
          <RecitationChecker expectedText={card.textUthmani} />
        </div>
      )}

      {revealed && (
        <div className="mt-6 border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
          <p className="muted mb-2 text-center text-sm">How well did you recall it?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RATINGS.map((r) => (
              <button key={r.key} type="button" onClick={() => rate(r.key)} className={`btn ${r.className} flex-col !py-2`}>
                <span className="font-semibold">{r.label}</span>
                <span className="text-[11px] opacity-90">{r.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MemorizeSession() {
  const cards = useHifzCards();

  const due = useMemo(() => dueCards(cards), [cards]);
  const stats = computeStats(cards);

  if (cards.length === 0) {
    return (
      <div className="card p-8 text-center">
        <h1 className="text-xl font-semibold">No verses added yet</h1>
        <p className="muted mt-2">
          Browse the Quran and tap <span className="font-medium">Add to Hifz</span> on any verse
          to start your memorization schedule.
        </p>
        <Link href="/" className="btn-primary mt-4 inline-flex">
          Browse Surahs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review session</h1>
        <p className="muted mt-1 text-sm">
          {stats.due} due now · {stats.total} total · {stats.mature} mature
        </p>
      </div>

      {due.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-lg font-semibold text-itqan-600">You&apos;re all caught up! &#127881;</p>
          <p className="muted mt-2">
            Nothing is due right now. Come back later, or add more verses to memorize.
          </p>
          <NextDue cards={cards} />
        </div>
      ) : (
        <ReviewCard key={due[0].verseKey + due[0].dueAt} card={due[0]} />
      )}
    </div>
  );
}

function NextDue({ cards }: { cards: HifzCard[] }) {
  const soonest = [...cards].sort((a, b) => a.dueAt - b.dueAt)[0];
  if (!soonest) return null;
  return (
    <p className="muted mt-3 text-sm">
      Next review ({soonest.verseKey}) {formatDue(soonest)}.
    </p>
  );
}
