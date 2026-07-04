"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useHifzStore, useHifzCards } from "@/lib/store";
import type { HifzCard, Rating } from "@/lib/srs";
import {
  ayahChunkHint,
  groupConsecutivePassages,
  hiddenDots,
  sortCardsQuranOrder,
} from "@/lib/hifzSmart";
import { RecitationChecker } from "./RecitationChecker";
import { ayahAudioUrl } from "@/lib/audio";
import { AudioPlayer } from "./AudioPlayer";

const RATINGS: { key: Rating; label: string; hint: string; className: string }[] = [
  { key: "again", label: "Again", hint: "Forgot", className: "bg-red-500 text-white hover:bg-red-600" },
  { key: "hard", label: "Hard", hint: "Struggled", className: "bg-amber-500 text-white hover:bg-amber-600" },
  { key: "good", label: "Good", hint: "Recalled", className: "bg-wabil-600 text-white hover:bg-wabil-700" },
  { key: "easy", label: "Easy", hint: "Perfect", className: "bg-wabil-500 text-white hover:bg-wabil-600" },
];

type Phase = "pick" | "test" | "done";

export function HifzSmartTest() {
  const cards = useHifzCards();
  const review = useHifzStore((s) => s.review);
  const passages = useMemo(() => groupConsecutivePassages(cards), [cards]);
  const allSorted = useMemo(() => sortCardsQuranOrder(cards), [cards]);

  const [phase, setPhase] = useState<Phase>("pick");
  const [queue, setQueue] = useState<HifzCard[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showMic, setShowMic] = useState(true);

  const first = queue[0];
  const current = queue[index];
  const firstHint = first ? ayahChunkHint(first.textUthmani) : null;

  function startPassage(passage: HifzCard[]) {
    setQueue(passage);
    setIndex(0);
    setRevealed(false);
    setShowMic(true);
    setPhase("test");
  }

  function startSelectedKeys(keys: string[]) {
    const set = new Set(keys);
    const selected = allSorted.filter((c) => set.has(c.verseKey));
    if (selected.length) startPassage(selected);
  }

  function rate(rating: Rating) {
    if (!current) return;
    review(current.verseKey, rating);
    if (index + 1 >= queue.length) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  if (!cards.length) {
    return (
      <div className="card p-6 text-center">
        <p className="font-medium">Add ayahs first</p>
        <p className="muted mt-1 text-sm">Use “Add range” or tap Add to Hifz on any verse.</p>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="card space-y-3 p-6 text-center">
        <p className="text-lg font-semibold text-wabil-600">Passage complete</p>
        <p className="muted text-sm">You tested {queue.length} ayahs with smart chunk hints.</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setPhase("pick");
            setQueue([]);
            setIndex(0);
          }}
        >
          Test another passage
        </button>
      </div>
    );
  }

  if (phase === "test" && current && first && firstHint) {
    const isFirst = index === 0;
    return (
      <div className="card space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-wabil-600">Smart test</p>
            <h2 className="font-semibold">
              Ayah {current.verseKey}{" "}
              <span className="muted font-normal">
                ({index + 1}/{queue.length})
              </span>
            </h2>
          </div>
          <button type="button" className="btn-ghost text-xs" onClick={() => setPhase("pick")}>
            Exit
          </button>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-wabil-500 transition-all"
            style={{ width: `${((index + 1) / queue.length) * 100}%` }}
          />
        </div>

        {/* Always show only a chunk of the FIRST ayah */}
        <div className="rounded-2xl border border-wabil-500/25 bg-wabil-500/5 p-4">
          <p className="muted mb-2 text-xs font-medium">
            {isFirst
              ? "Hint — only the start of this ayah is shown. Recite the full ayah."
              : `Passage start (chunk of ${first.verseKey} only). Recite the next ayah from memory.`}
          </p>
          <p className="quran-text text-right text-2xl sm:text-3xl" dir="rtl">
            <span className="text-wabil-700 dark:text-wabil-200">{firstHint.visible}</span>
            {firstHint.hiddenCount > 0 && (
              <span className="muted ms-2 text-lg tracking-widest">
                {hiddenDots(firstHint.hiddenCount)}
              </span>
            )}
          </p>
          {!isFirst && (
            <p className="muted mt-3 text-sm">
              Now recite <strong className="text-wabil-600">{current.verseKey}</strong> completely
              (no text shown for this ayah).
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AudioPlayer src={ayahAudioUrl(current.chapterId, current.verseNumber)} />
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => setRevealed((v) => !v)}
          >
            {revealed ? "Hide full ayah" : "Peek full ayah"}
          </button>
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => setShowMic((v) => !v)}
          >
            {showMic ? "Hide mic" : "Show mic check"}
          </button>
        </div>

        {revealed && (
          <p className="quran-text rounded-xl bg-black/5 p-3 text-right text-2xl dark:bg-white/5" dir="rtl">
            {current.textUthmani}
          </p>
        )}

        {showMic && (
          <div className="border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
            <RecitationChecker expectedText={current.textUthmani} />
          </div>
        )}

        <div className="border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
          <p className="muted mb-2 text-center text-sm">How well did you recall this ayah?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RATINGS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => rate(r.key)}
                className={`btn ${r.className} flex-col !py-2`}
              >
                <span className="font-semibold">{r.label}</span>
                <span className="text-[11px] opacity-90">{r.hint}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Pick phase
  const multiPassages = passages.filter((p) => p.length >= 2);

  return (
    <div className="space-y-4">
      <div className="card space-y-2 p-5">
        <h2 className="font-semibold">Smart multi-ayah test</h2>
        <p className="muted text-sm">
          Only a <strong>chunk of the first ayah</strong> is shown. You recite that ayah fully, then
          continue through the next ayahs from memory — perfect for continuous passages.
        </p>
      </div>

      {multiPassages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Consecutive passages in your Hifz</h3>
          {multiPassages.map((p) => (
            <button
              key={p.map((c) => c.verseKey).join("-")}
              type="button"
              onClick={() => startPassage(p)}
              className="card-interactive flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <div>
                <p className="font-medium">
                  {p[0].verseKey} → {p[p.length - 1].verseKey}
                </p>
                <p className="muted text-xs">{p.length} ayahs in sequence</p>
              </div>
              <span className="btn-primary !px-3 !py-1.5 text-xs">Start test</span>
            </button>
          ))}
        </div>
      )}

      <div className="card space-y-3 p-5">
        <h3 className="text-sm font-semibold">Or test any selection (Quran order)</h3>
        <PassagePicker cards={allSorted} onStart={startSelectedKeys} />
      </div>

      {multiPassages.length === 0 && (
        <p className="muted text-sm">
          Tip: add consecutive ayahs with <strong>Add range</strong> (e.g. 2:1–2:5) to unlock passage
          tests.{" "}
          <Link href="/quran" className="text-wabil-600 hover:underline">
            Browse Quran
          </Link>
        </p>
      )}
    </div>
  );
}

function PassagePicker({
  cards,
  onStart,
}: {
  cards: HifzCard[];
  onStart: (keys: string[]) => void;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const keys = Object.keys(selected).filter((k) => selected[k]);

  function toggle(key: string) {
    setSelected((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div className="space-y-3">
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border p-2" style={{ borderColor: "rgb(var(--border))" }}>
        {cards.map((c) => (
          <label
            key={c.verseKey}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-wabil-500/10"
          >
            <input
              type="checkbox"
              checked={Boolean(selected[c.verseKey])}
              onChange={() => toggle(c.verseKey)}
            />
            <span className="font-medium">{c.verseKey}</span>
            <span className="quran-text muted truncate text-xs" dir="rtl">
              {c.textUthmani.slice(0, 40)}…
            </span>
          </label>
        ))}
      </div>
      <button
        type="button"
        className="btn-primary"
        disabled={keys.length === 0}
        onClick={() => onStart(keys)}
      >
        Start smart test ({keys.length})
      </button>
    </div>
  );
}
