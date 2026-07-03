"use client";

import { useState } from "react";
import { RecitationModal } from "./RecitationModal";

function MicIcon({ className = "h-9 w-9", id = "mic" }: { className?: string; id?: string }) {
  const gradId = `heroMicGold-${id}`;
  const glowId = `heroMicGlow-${id}`;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="35%" stopColor="#f0d78c" />
          <stop offset="100%" stopColor="#c9941a" />
        </linearGradient>
        <filter id={glowId}>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#fbbf24" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter={`url(#${glowId})`}>
        <rect x="26" y="8" width="12" height="22" rx="6" fill={`url(#${gradId})`} />
        <path
          d="M20 28c0 6.6 5.4 12 12 12s12-5.4 12-12"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line x1="32" y1="40" x2="32" y2="52" stroke={`url(#${gradId})`} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="22" y1="52" x2="42" y2="52" stroke={`url(#${gradId})`} strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Prominent 3D mic button — inline next to hero CTAs. */
export function HeroMic3D({ inline = false }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (inline) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`hero-mic-inline group relative flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center sm:h-16 sm:w-16 ${hovered ? "hero-mic-inline--hover" : ""}`}
          aria-label="Check your recitation with microphone"
          title="Check your recitation"
        >
          <span className="hero-mic-inline-ring absolute -inset-1 rounded-2xl" aria-hidden="true" />
          <span className="hero-mic-inline-ring hero-mic-inline-ring--delay absolute -inset-2 rounded-2xl" aria-hidden="true" />
          <span className="hero-mic-inline-face relative flex h-full w-full items-center justify-center rounded-2xl">
            <span
              className={`hero-mic-cube hero-mic-cube--inline ${hovered ? "hero-mic-cube--active" : ""}`}
              aria-hidden="true"
            >
              <span className="hero-mic-body hero-mic-body--inline">
                <MicIcon className="h-9 w-9 sm:h-10 sm:w-10" id="inline" />
              </span>
            </span>
          </span>
          <span className="hero-mic-tooltip pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#f0d78c]/50 bg-[#0a3d2f]/95 px-2.5 py-1 text-[10px] font-semibold text-[#f0d78c] opacity-0 shadow-lg transition-all duration-300 group-hover:bottom-[-2.35rem] group-hover:opacity-100">
            Check recitation
          </span>
        </button>
        <RecitationModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="hero-mic-3d group relative mx-auto flex h-28 w-28 items-center justify-center"
        aria-label="Check your recitation with microphone"
        title="Tap to check your recitation"
      >
        <span className="hero-mic-ring absolute inset-0 rounded-full" aria-hidden="true" />
        <span className="hero-mic-ring hero-mic-ring-delay absolute inset-2 rounded-full" aria-hidden="true" />
        <span className="hero-mic-stage relative flex h-24 w-24 items-center justify-center" style={{ perspective: "600px" }}>
          <span className={`hero-mic-cube ${hovered ? "hero-mic-cube--active" : ""}`} aria-hidden="true">
            <span className="hero-mic-body">
              <MicIcon className="h-14 w-14" id="standalone" />
            </span>
          </span>
        </span>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#f0d78c]/40 bg-[#0a3d2f]/80 px-3 py-1 text-[11px] font-semibold text-[#f0d78c] backdrop-blur-sm">
          Check recitation
        </span>
      </button>
      <RecitationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
