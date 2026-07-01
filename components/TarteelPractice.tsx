"use client";

import type { Verse } from "@/lib/quran";
import { AudioPlayer } from "./AudioPlayer";
import { RecitationChecker } from "./RecitationChecker";

const TIPS = [
  "Listen first, then imitate the reciter's rhythm and pauses (waqf).",
  "Slow down (0.5x) to catch each letter's makhraj, then build up to normal speed.",
  "Breathe at the natural stopping points — don't cut a word in half.",
  "Keep a steady, calm pace; tarteel means measured, beautiful recitation.",
  "Repeat each ayah 3–5 times before moving on.",
];

/**
 * Tarteel (beautiful, measured recitation) practice: listen to the reciter at
 * an adjustable speed with repeat, then record and check your own recitation.
 */
export function TarteelPractice({ verse }: { verse: Verse }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-1 text-sm font-semibold">1. Listen &amp; imitate</h4>
        {verse.audioUrl ? (
          <AudioPlayer src={verse.audioUrl} showSpeed />
        ) : (
          <p className="muted text-sm">Audio isn&apos;t available offline for this ayah.</p>
        )}
      </div>

      <div className="border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
        <h4 className="mb-1 text-sm font-semibold">2. Recite &amp; get feedback</h4>
        <RecitationChecker expectedText={verse.textUthmani} words={verse.words} />
      </div>

      <div className="rounded-xl bg-itqan-100 p-3 dark:bg-itqan-950">
        <p className="mb-1 text-sm font-semibold text-itqan-800 dark:text-itqan-200">Tarteel tips</p>
        <ul className="list-disc space-y-0.5 pl-5 text-xs">
          {TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
