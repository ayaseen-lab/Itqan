"use client";

import { useState } from "react";
import { RecitationModal } from "./RecitationModal";

/** Header mic — opens recitation check modal. */
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
      <RecitationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
