"use client";

import { useState } from "react";
import { annotateWordsTajweed } from "@/lib/tajweed";
import type { Word } from "@/lib/quran";

function WordChip({ word, tajweedHtml }: { word: Word; tajweedHtml: string }) {
  const [open, setOpen] = useState(false);

  function playWord() {
    if (!word.audioUrl) return;
    const audio = new Audio(word.audioUrl);
    audio.setAttribute("playsinline", "true");
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
        className="group flex min-w-[4.5rem] flex-col items-center rounded-xl border px-2 py-2 text-center transition-colors hover:border-wabil-400 hover:bg-wabil-100/80 dark:hover:bg-wabil-950"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <span
          className="tajweed-text quran-text block text-2xl leading-loose"
          dir="rtl"
          lang="ar"
          dangerouslySetInnerHTML={{ __html: tajweedHtml }}
        />
        <span className="mt-1 block text-[9px] font-medium uppercase tracking-wide text-wabil-600/80">
          اردو
        </span>
        <span className="urdu-text block min-h-[1.1rem] text-sm leading-tight text-wabil-800 dark:text-wabil-200" dir="rtl">
          {word.translationUrdu?.trim() || "—"}
        </span>
        <span className="muted mt-1 block text-[9px] font-medium uppercase tracking-wide">
          EN
        </span>
        <span className="muted block min-h-[1rem] text-[11px] leading-tight">
          {word.translation?.trim() || "—"}
        </span>
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
              className="mt-1 text-wabil-600 hover:underline"
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
  if (!words || words.length === 0) {
    return <p className="muted text-sm">Word-by-word data isn&apos;t available for this ayah.</p>;
  }
  const wordTexts = words.map((w) => w.text);
  const annotated = annotateWordsTajweed(wordTexts);

  return (
    <div className="space-y-3">
      <p className="muted text-xs">
        Each word shows tajweed colours, Urdu meaning, and English meaning.
      </p>
      {/* dir=rtl so words flow right-to-left in natural Quran order (no row-reverse) */}
      <div className="flex flex-wrap gap-2" dir="rtl">
        {words.map((w, i) => (
          <WordChip key={`${w.position}-${i}`} word={w} tajweedHtml={annotated[i] ?? w.text} />
        ))}
      </div>
    </div>
  );
}
