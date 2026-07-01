"use client";

import { useState } from "react";
import type { Word } from "@/lib/quran";

function WordChip({ word }: { word: Word }) {
  const [open, setOpen] = useState(false);

  function playWord() {
    if (!word.audioUrl) return;
    const audio = new Audio(word.audioUrl);
    void audio.play();
  }

  const hasDetail = word.transliteration || word.translation || word.translationUrdu;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="group flex flex-col items-center rounded-lg px-2 py-1.5 text-center transition-colors hover:bg-itqan-100 dark:hover:bg-itqan-950"
      >
        <span className="quran-text block text-2xl leading-loose">{word.text}</span>
        {word.translationUrdu && (
          <span className="urdu-text block text-sm leading-tight text-itqan-700 dark:text-itqan-300" dir="rtl">
            {word.translationUrdu}
          </span>
        )}
        {word.translation && (
          <span className="muted block text-[11px] leading-tight">{word.translation}</span>
        )}
      </button>

      {open && hasDetail && (
        <span
          role="tooltip"
          className="card absolute bottom-full left-1/2 z-20 mb-1 w-48 -translate-x-1/2 p-2 text-center text-xs shadow-lg"
        >
          <span className="quran-text block text-xl">{word.text}</span>
          {word.transliteration && (
            <span className="block font-medium">{word.transliteration}</span>
          )}
          {word.translationUrdu && (
            <span className="urdu-text block text-sm" dir="rtl">
              {word.translationUrdu}
            </span>
          )}
          {word.translation && <span className="muted block">{word.translation}</span>}
          {word.audioUrl && (
            <button
              type="button"
              onClick={playWord}
              className="mt-1 text-itqan-600 hover:underline"
            >
              Play word
            </button>
          )}
        </span>
      )}
    </span>
  );
}

export function WordByWord({ words }: { words: Word[] }) {
  if (!words || words.length === 0) return null;
  return (
    <div className="flex flex-row-reverse flex-wrap justify-start gap-1.5" dir="rtl">
      {words.map((w, i) => (
        <WordChip key={`${w.position}-${i}`} word={w} />
      ))}
    </div>
  );
}
