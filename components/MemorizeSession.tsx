"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHifzStore, useHifzCards } from "@/lib/store";
import { dueCards, formatDue, computeStats, type Rating, type HifzCard } from "@/lib/srs";
import { ayahChunkHint, hiddenDots } from "@/lib/hifzSmart";
import { RecitationChecker } from "./RecitationChecker";
import { HifzAddRange } from "./HifzAddRange";
import { HifzParahPlayer } from "./HifzParahPlayer";
import { HifzSmartTest } from "./HifzSmartTest";
import { ayahAudioUrl } from "@/lib/audio";
import { AudioPlayer } from "./AudioPlayer";

type Tab = "review" | "smart" | "listen" | "add";

const TABS: { id: Tab; label: string }[] = [
  { id: "review", label: "Review" },
  { id: "smart", label: "Smart test" },
  { id: "listen", label: "Listen parah" },
  { id: "add", label: "Add range" },
];

const RATINGS: { key: Rating; label: string; hint: string; className: string }[] = [
  { key: "again", label: "Again", hint: "Forgot", className: "bg-red-500 text-white hover:bg-red-600" },
  { key: "hard", label: "Hard", hint: "Struggled", className: "bg-amber-500 text-white hover:bg-amber-600" },
  { key: "good", label: "Good", hint: "Recalled", className: "bg-itqan-600 text-white hover:bg-itqan-700" },
  { key: "easy", label: "Easy", hint: "Perfect", className: "bg-itqan-500 text-white hover:bg-itqan-600" },
];

/** Classic due review — always shows only a chunk, not the full ayah. */
function ReviewCard({ card }: { card: HifzCard }) {
  const review = useHifzStore((s) => s.review);
  const [peek, setPeek] = useState(false);
  const [showMic, setShowMic] = useState(true);
  const hint = ayahChunkHint(card.textUthmani);

  function rate(rating: Rating) {
    review(card.verseKey, rating);
    setPeek(false);
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold">Ayah {card.verseKey}</span>
        <div className="flex items-center gap-2">
          <AudioPlayer src={ayahAudioUrl(card.chapterId, card.verseNumber)} />
          <Link href={`/surah/${card.chapterId}`} className="text-sm text-itqan-600 hover:underline">
            Open Surah
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-itqan-500/25 bg-itqan-500/5 p-4">
        <p className="muted mb-2 text-xs font-medium">
          Smart hint — only a chunk is shown. Recite the full ayah from memory.
        </p>
        <p className="quran-text text-right text-2xl sm:text-3xl" dir="rtl">
          <span className="text-itqan-700 dark:text-itqan-200">{hint.visible}</span>
          {hint.hiddenCount > 0 && (
            <span className="muted ms-2 text-lg tracking-widest">{hiddenDots(hint.hiddenCount)}</span>
          )}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn-ghost text-xs" onClick={() => setPeek((v) => !v)}>
          {peek ? "Hide full ayah" : "Peek full ayah"}
        </button>
        <button type="button" className="btn-ghost text-xs" onClick={() => setShowMic((v) => !v)}>
          {showMic ? "Hide mic" : "Show mic check"}
        </button>
      </div>

      {peek && (
        <p className="quran-text mt-3 rounded-xl bg-black/5 p-3 text-right text-2xl dark:bg-white/5" dir="rtl">
          {card.textUthmani}
        </p>
      )}

      {showMic && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
          <RecitationChecker expectedText={card.textUthmani} />
        </div>
      )}

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

export function MemorizeSession() {
  const cards = useHifzCards();
  const due = useMemo(() => dueCards(cards), [cards]);
  const stats = computeStats(cards);
  const [tab, setTab] = useState<Tab>("review");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Hifz coach</h1>
        <p className="muted mt-1 text-sm">
          {stats.due} due · {stats.total} in list · {stats.mature} mature
        </p>
        <p className="muted mt-1 text-xs">
          Smarter practice: chunk hints, multi-ayah tests, full parah listening, and batch add.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-2xl border p-1" style={{ borderColor: "rgb(var(--border))" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`min-h-10 shrink-0 flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
              tab === t.id ? "bg-itqan-600 text-white shadow" : "muted hover:text-itqan-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "add" && <HifzAddRange />}
      {tab === "listen" && <HifzParahPlayer />}
      {tab === "smart" && <HifzSmartTest />}

      {tab === "review" && (
        <>
          {cards.length === 0 ? (
            <div className="card p-8 text-center">
              <h2 className="text-xl font-semibold">No verses yet</h2>
              <p className="muted mt-2">
                Use <strong>Add range</strong> to add multiple ayahs, or tap Add to Hifz on any verse.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" className="btn-primary" onClick={() => setTab("add")}>
                  Add ayah range
                </button>
                <Link href="/quran" className="btn-secondary">
                  Browse Surahs
                </Link>
              </div>
            </div>
          ) : due.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-lg font-semibold text-itqan-600">You&apos;re all caught up!</p>
              <p className="muted mt-2">Try a smart multi-ayah test or listen to a full parah.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" className="btn-primary" onClick={() => setTab("smart")}>
                  Smart test
                </button>
                <button type="button" className="btn-secondary" onClick={() => setTab("listen")}>
                  Listen parah
                </button>
              </div>
              <NextDue cards={cards} />
            </div>
          ) : (
            <ReviewCard key={due[0].verseKey + due[0].dueAt} card={due[0]} />
          )}
        </>
      )}
    </div>
  );
}
