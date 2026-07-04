"use client";

import type { Verse } from "@/lib/quran";
import { annotateWordsTajweed } from "@/lib/tajweed";
import { AudioPlayer } from "./AudioPlayer";
import { RecitationChecker } from "./RecitationChecker";
import { TajweedLegend, TajweedText } from "./TajweedText";

const TARTEEL_TIPS = [
  "Listen first, then imitate the reciter's rhythm and pauses (waqf).",
  "Slow down (0.5x) to catch each letter's makhraj, then build to normal speed.",
  "Tarteel means measured, beautiful recitation — not rushing.",
  "Repeat this ayah 3–5 times before moving on.",
];

function WordTajweedChip({
  html,
  transliteration,
  translation,
  translationUrdu,
}: {
  html: string;
  transliteration: string | null;
  translation: string | null;
  translationUrdu: string | null;
}) {
  return (
    <div
      className="flex min-w-[4.5rem] flex-col items-center rounded-xl border px-2 py-2 transition-colors hover:border-itqan-400 hover:bg-itqan-50/50 dark:hover:bg-itqan-950/30"
      style={{ borderColor: "rgb(var(--border))" }}
    >
      <span
        className="tajweed-text quran-text block text-2xl leading-loose"
        dir="rtl"
        lang="ar"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {transliteration && (
        <span className="muted mt-0.5 text-[10px]">{transliteration}</span>
      )}
      <span className="mt-1 block text-[9px] font-medium uppercase tracking-wide text-itqan-600/80">
        اردو
      </span>
      <span className="urdu-text block min-h-[1.1rem] text-xs leading-tight" dir="rtl">
        {translationUrdu?.trim() || "—"}
      </span>
      <span className="muted mt-1 block text-[9px] font-medium uppercase tracking-wide">
        EN
      </span>
      <span className="muted block min-h-[1rem] text-[10px] leading-tight">
        {translation?.trim() || "—"}
      </span>
    </div>
  );
}

export function TajweedTarteelPanel({ verse }: { verse: Verse }) {
  const wordTexts = verse.words.map((w) => w.text);
  const annotatedWords = annotateWordsTajweed(wordTexts);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="rounded-xl border p-3" style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--accent-soft) / 0.25)" }}>
        <p className="text-sm font-semibold text-itqan-800 dark:text-itqan-200">
          Tajweed &amp; Tarteel · Ayah {verse.verseKey}
        </p>
        <p className="muted mt-0.5 text-xs">
          Colour-coded tajweed rules and measured recitation practice for this ayah.
        </p>
      </div>

      {/* Full ayah with tajweed */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold">Full ayah — Tajweed colours</h4>
        <TajweedText
          html={verse.textTajweed}
          plainText={verse.textUthmani}
          size="2xl"
          showLegend={false}
        />
      </section>

      {/* Word by word tajweed */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold">Word by word — Tajweed</h4>
        <div className="flex flex-wrap gap-2" dir="rtl">
          {verse.words.map((w, i) => (
            <WordTajweedChip
              key={`${w.position}-${i}`}
              html={annotatedWords[i] ?? w.text}
              transliteration={w.transliteration}
              translation={w.translation}
              translationUrdu={w.translationUrdu}
            />
          ))}
        </div>
      </section>

      <TajweedLegend detailed />

      {/* Per-ayah Tarteel */}
      <section className="space-y-3 border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
        <h4 className="text-sm font-semibold">Tarteel — Ayah {verse.verseKey}</h4>
        <p className="muted text-xs">
          Listen to this ayah at your pace, then recite and get feedback.
        </p>
        {verse.audioUrl ? (
          <AudioPlayer src={verse.audioUrl} showSpeed />
        ) : (
          <p className="muted text-sm">Recitation audio isn&apos;t available for this ayah.</p>
        )}
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold">Recite &amp; check</h4>
        <RecitationChecker expectedText={verse.textUthmani} words={verse.words} />
      </section>

      <div className="rounded-xl bg-itqan-100 p-3 dark:bg-itqan-950">
        <p className="mb-1 text-sm font-semibold text-itqan-800 dark:text-itqan-200">Tarteel tips</p>
        <ul className="list-disc space-y-0.5 pl-5 text-xs">
          {TARTEEL_TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
