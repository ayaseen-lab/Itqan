"use client";

import { useState } from "react";
import { RecitationModal } from "./RecitationModal";

function MicIcon({ className = "h-9 w-9", id = "mic" }: { className?: string; id?: string }) {
  const gradId = `heroMicGold-${id}`;
  const glowId = `heroMicGlow-${id}`;
  const shineId = `heroMicShine-${id}`;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbe8" />
          <stop offset="30%" stopColor="#f0d78c" />
          <stop offset="70%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#a67c12" />
        </linearGradient>
        <linearGradient id={shineId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#fbbf24" floodOpacity="0.75" />
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f0d78c" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter={`url(#${glowId})`}>
        <rect x="24" y="6" width="16" height="26" rx="8" fill={`url(#${gradId})`} />
        <rect x="26" y="8" width="6" height="18" rx="3" fill={`url(#${shineId})`} />
        <path
          d="M18 30c0 7.7 6.3 14 14 14s14-6.3 14-14"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line x1="32" y1="44" x2="32" y2="54" stroke={`url(#${gradId})`} strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="54" x2="44" y2="54" stroke={`url(#${gradId})`} strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="18" r="2" fill="#fff8e0" opacity="0.7" />
      </g>
    </svg>
  );
}

type MicSize = "md" | "lg" | "xl";

const SIZE: Record<MicSize, { btn: string; icon: string; ring: string }> = {
  md: {
    btn: "h-[3.75rem] w-[3.75rem] sm:h-16 sm:w-16",
    icon: "h-9 w-9 sm:h-10 sm:w-10",
    ring: "rounded-2xl",
  },
  lg: {
    btn: "h-14 w-14 sm:h-[4.875rem] sm:w-[4.875rem] md:h-[5.25rem] md:w-[5.25rem]",
    icon: "h-8 w-8 sm:h-12 sm:w-12 md:h-[3.375rem] md:w-[3.375rem]",
    ring: "rounded-[1.15rem]",
  },
  xl: {
    btn: "h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36",
    icon: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] md:h-20 md:w-20",
    ring: "rounded-[1.75rem]",
  },
};

/** Prominent 3D mic — use size="xl" beside AI Hifz near the hero image. */
export function HeroMic3D({
  inline = false,
  size = "md",
  label = true,
}: {
  inline?: boolean;
  size?: MicSize;
  label?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const s = SIZE[inline && size === "md" ? "md" : size];
  const isPower = size === "lg" || size === "xl";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`hero-mic-inline group relative flex shrink-0 items-center justify-center ${s.btn} ${
          isPower ? "hero-mic-power" : ""
        } ${hovered ? "hero-mic-inline--hover" : ""}`}
        aria-label="Check your recitation with microphone"
        title="Check your recitation"
      >
        <span className={`hero-mic-inline-ring absolute -inset-1 ${s.ring}`} aria-hidden="true" />
        <span
          className={`hero-mic-inline-ring hero-mic-inline-ring--delay absolute -inset-3 ${s.ring}`}
          aria-hidden="true"
        />
        {isPower && (
          <span className="hero-mic-power-aura absolute -inset-5 rounded-full" aria-hidden="true" />
        )}
        <span
          className={`hero-mic-inline-face relative flex h-full w-full items-center justify-center ${s.ring}`}
        >
          <span
            className={`hero-mic-cube hero-mic-cube--inline ${hovered ? "hero-mic-cube--active" : ""}`}
            aria-hidden="true"
          >
            <span className="hero-mic-body hero-mic-body--inline">
              <MicIcon className={s.icon} id={`${size}-${inline ? "i" : "s"}`} />
            </span>
          </span>
        </span>
        {label && (
          <span
            className={`hero-mic-tooltip pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#f0d78c]/50 bg-[#0a3d2f]/95 px-2.5 py-1 font-semibold text-[#f0d78c] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 ${
              isPower
                ? "bottom-[-2.6rem] text-[11px] group-hover:bottom-[-2.85rem]"
                : "-bottom-9 text-[10px] group-hover:bottom-[-2.35rem]"
            }`}
          >
            Check recitation
          </span>
        )}
      </button>
      <RecitationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
