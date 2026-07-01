"use client";

import Link from "next/link";
import { useState } from "react";
import { RecitationChecker } from "./RecitationChecker";

const SAMPLE_AYAH = "قُلْ هُوَ ٱللَّهُ أَحَدٌ";

/** Header mic button — quick recitation check from anywhere. */
export function RecitationMicButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost relative h-9 w-9 !px-0 text-itqan-500"
        aria-label="Check recitation with microphone"
        title="Check your recitation"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 22h8" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold-400 ring-2 ring-[rgb(var(--surface))]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div
            className="glass animate-fade-up relative w-full max-w-lg rounded-t-3xl border p-6 shadow-2xl sm:rounded-3xl"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Recitation check</h2>
                <p className="muted text-xs">Practice pronunciation with your mic</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost h-8 w-8 !px-0" aria-label="Close">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <p className="quran-text mb-3 text-center text-2xl" dir="rtl">{SAMPLE_AYAH}</p>
            <p className="muted mb-4 text-center text-xs">Sample: Surah Al-Ikhlas — or open any ayah for full practice</p>

            <RecitationChecker expectedText={SAMPLE_AYAH} />

            <Link
              href="/memorize"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 flex w-full justify-center text-sm"
            >
              Go to Hifz review session →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
