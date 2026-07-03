"use client";

import Link from "next/link";
import { RecitationChecker } from "./RecitationChecker";
import { AnimatedModal } from "./AnimatedModal";

const SAMPLE_AYAH = "قُلْ هُوَ ٱللَّهُ أَحَدٌ";

export function RecitationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatedModal open={open} onClose={onClose} variant="bottom" labelledBy="recitation-modal-title">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 id="recitation-modal-title" className="font-semibold">
            Recitation check
          </h2>
          <p className="muted text-xs">Practice pronunciation with your mic</p>
        </div>
        <button type="button" onClick={onClose} className="btn-ghost h-8 w-8 !px-0" aria-label="Close">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <p className="quran-text mb-3 text-center text-2xl" dir="rtl">
        {SAMPLE_AYAH}
      </p>
      <p className="muted mb-4 text-center text-xs">
        Sample: Surah Al-Ikhlas — or open any ayah for full practice
      </p>

      <RecitationChecker expectedText={SAMPLE_AYAH} />

      <Link
        href="/memorize"
        onClick={onClose}
        className="btn-primary mt-4 flex w-full justify-center text-sm"
      >
        Go to Hifz review session →
      </Link>
    </AnimatedModal>
  );
}
