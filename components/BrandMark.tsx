"use client";

import { useId } from "react";

/** Shared WabilHuda brand mark — open mushaf on emerald tile. Pure SVG paths, no font dependency. */
export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const bg = `bm-bg-${id}`;
  const gold = `bm-gold-${id}`;
  const pageL = `bm-page-l-${id}`;
  const pageR = `bm-page-r-${id}`;

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="WabilHuda logo"
    >
      <defs>
        <linearGradient id={bg} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="0.45" stopColor="#0d9488" />
          <stop offset="1" stopColor="#042f2e" />
        </linearGradient>
        <linearGradient id={gold} x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0d78c" />
          <stop offset="1" stopColor="#b8862e" />
        </linearGradient>
        <linearGradient id={pageL} x1="9" y1="16" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffef9" />
          <stop offset="1" stopColor="#ebe4d4" />
        </linearGradient>
        <linearGradient id={pageR} x1="24" y1="16" x2="39" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8f4ea" />
          <stop offset="1" stopColor="#e0d8c8" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="11" fill={`url(#${bg})`} />
      <rect width="48" height="48" rx="11" fill={`url(#${gold})`} fillOpacity="0.07" />
      <ellipse cx="18" cy="13" rx="14" ry="9" fill="white" fillOpacity="0.14" />

      <path
        d="M11 37.5 C16 35.5 20 35 24 35 C28 35 32 35.5 37 37.5"
        stroke={`url(#${gold})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />

      <path
        d="M24 35.5 V15.5 C17.5 13.5 11.5 17 9.5 23.5 V35.5 H24 Z"
        fill={`url(#${pageL})`}
        stroke={`url(#${gold})`}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M24 35.5 V15.5 C30.5 13.5 36.5 17 38.5 23.5 V35.5 H24 Z"
        fill={`url(#${pageR})`}
        stroke={`url(#${gold})`}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />

      <path
        d="M13 21 H20 M12.5 24.5 H19.5 M12 28 H18.5"
        stroke="#0d9488"
        strokeWidth="0.65"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M28 21 H35 M28.5 24.5 H35.5 M29 28 H36"
        stroke="#0d9488"
        strokeWidth="0.65"
        strokeLinecap="round"
        opacity="0.4"
      />

      <path d="M24 15.5 V35.5" stroke={`url(#${gold})`} strokeWidth="1.3" strokeLinecap="round" />

      <circle cx="24" cy="11" r="2.2" fill={`url(#${gold})`} opacity="0.9" />
      <path
        d="M24 7.5 L25.1 10.2 L28 10.5 L25.8 12.3 L26.5 15 L24 13.5 L21.5 15 L22.2 12.3 L20 10.5 L22.9 10.2 Z"
        fill={`url(#${gold})`}
        fillOpacity="0.35"
        stroke={`url(#${gold})`}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
