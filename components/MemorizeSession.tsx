"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHifzStore, useHifzCards } from "@/lib/store";
import { dueCards, formatDue, computeStats, type Rating, type HifzCard } from "@/lib/srs";
import { RecitationChecker } from "./RecitationChecker";

type HifzMode = "reveal" | "hints" | "chunk" | "blind";

const MODES: { id: HifzMode; label: string; desc: string }[] = [
  { id: "reveal", label: "Reveal", desc: "Classic hide & reveal" },
  { id: "hints", label: "First letters", desc: "See first letter of each word" },
  { id: "chunk", label: "Chunks", desc: "Reveal 3 words at a time" },
  { id: "blind", label: "Blind + mic", desc: "Recite from memory with voice check" },
];

const RATINGS: { key: Rating; label: string; hint: string; className: string }[] = [
  { key: "again", label: "Again", hint: "Forgot", className: "bg-red-500 text-white hover:bg-red-600" },
  { key: "hard", label: "Hard", hint: "Struggled", className: "bg-amber-500 text-white hover:bg-amber-600" },
  { key: "good", label: "Good", hint: "Recalled", className: "bg-itqan-600 text-white hover:bg-itqan-700" },
  { key: "easy", label: "Easy", hint: "Perfect", className: "bg-itqan-500 text-white hover:bg-itqan-600" },
];

function firstLetterHints(text: string): string {
  return text
    .split(/\s+/)
    .map((w) => {
      const base = w.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]/g, "");
      return base ? base[0] + "ـ…" : "…";
    })
    .join("  ");
}

function chunkText(text: string, step: number, chunkSize = 3): string {
  const words = text.split(/\s+/);
  const visible = words.slice(0, step * chunkSize);
  const hidden = words.slice(step * chunkSize);
  return (
    visible.join(" ") +
    (hidden.length ? `  ${"● ".repeat(Math.min(hidden.length, 8))}` : "")
  );
}

function ReviewCard({ card }: { card: HifzCard }) {
  const review = useHifzStore((s) => s.review);
  const [mode, setMode] = useState<HifzMode>("reveal");
  const [revealed, setRevealed] = useState(false);
  const [chunkStep, setChunkStep] = useState(1);
  const [checking, setChecking] = useState(false);

  const words = card.textUthmani.split(/\s+/);
  const maxChunks = Math.ceil(words.length / 3);

  function rate(rating: Rating) {
    review(card.verseKey, rating);
    setRevealed(false);
    setChecking(false);
    setChunkStep(1);
  }

  function renderPrompt() {
    if (mode === "hints") {
      return (
        <p className="quran-text text-right text-3xl text-itqan-400" dir="rtl">
          {firstLetterHints(card.textUthmani)}
        </p>
      );
    }
    if (mode === "chunk") {
      return (
        <div className="space-y-3">
          <p className="quran-text text-right text-3xl" dir="rtl">
            {chunkText(card.textUthmani, chunkStep)}
          </p>
          {chunkStep < maxChunks && (
            <button
              type="button"
              onClick={() => setChunkStep((s) => s + 1)}
              className="btn-ghost mx-auto block text-sm"
            >
              Show next 3 words ({chunkStep}/{maxChunks})
            </button>
          )}
        </div>
      );
    }
    if (mode === "blind" || (mode === "reveal" && !revealed)) {
      return (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="muted">
            {mode === "blind"
              ? "Recite this ayah from memory, then check with the mic."
              : "Recite from memory, then reveal to check."}
          </p>
          {mode !== "blind" && (
            <button type="button" onClick={() => setRevealed(true)} className="btn-primary">
              Reveal ayah
            </button>
          )}
        </div>
      );
    }
    return (
      <p className="quran-text text-right text-3xl" dir="rtl">
        {card.textUthmani}
      </p>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold">Ayah {card.verseKey}</span>
        <Link href={`/surah/${card.chapterId}`} className="text-sm text-itqan-600 hover:underline">
          Open Surah
        </Link>
      </div>

      {/* Mode selector */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setRevealed(false);
              setChunkStep(1);
              setChecking(m.id === "blind");
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === m.id ? "bg-itqan-600 text-white" : "border hover:border-itqan-400"
            }`}
            style={mode === m.id ? undefined : { borderColor: "rgb(var(--border))" }}
            title={m.desc}
          >
            {m.label}
          </button>
        ))}
      </div>

      {renderPrompt()}

      {/* Pronunciation tip */}
      <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "rgb(var(--border))" }}>
        <p className="muted text-xs">
          <strong className="text-itqan-500">Tip:</strong> Open the Surah to listen to Mishary Alafasy,
          then use <strong>Blind + mic</strong> mode or the mic button in the top bar to check pronunciation.
        </p>
      </div>

      {(checking || mode === "blind") && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
          <RecitationChecker expectedText={card.textUthmani} />
        </div>
      )}

      {mode !== "blind" && !checking && (
        <button
          type="button"
          onClick={() => setChecking((v) => !v)}
          className="mt-3 text-sm text-itqan-600 hover:underline"
        >
          {checking ? "Hide voice check" : "Check pronunciation with mic"}
        </button>
      )}

      {(revealed || mode === "hints" || mode === "chunk" || mode === "blind") && (
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
        <Link href="/quran" className="btn-primary mt-4 inline-flex">
          Browse all 114 Surahs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hifz review session</h1>
        <p className="muted mt-1 text-sm">
          {stats.due} due now · {stats.total} total · {stats.mature} mature
        </p>
        <p className="muted mt-1 text-xs">
          Try different modes: first-letter hints, chunking, or blind recitation with mic check.
        </p>
      </div>

      {due.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-lg font-semibold text-itqan-600">You&apos;re all caught up!</p>
          <p className="muted mt-2">Nothing is due right now. Come back later or add more verses.</p>
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
