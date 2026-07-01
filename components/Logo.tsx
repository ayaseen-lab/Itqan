/**
 * Itqan brand mark — an 8-point Islamic star (khātam) with layered geometry,
 * emerald gradient, ambient glow, and a slow-rotating outer ring. The Arabic
 * إ sits at the centre. Purely decorative.
 */
export function Logo({ size = 36, animated = true }: { size?: number; animated?: boolean }) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-2xl text-white ${
        animated ? "animate-glow" : ""
      }`}
      style={{
        width: size,
        height: size,
        backgroundImage:
          "linear-gradient(145deg, #45bd88 0%, #128155 45%, #0a4d32 75%, #05261c 100%)",
        boxShadow: "0 10px 26px -8px rgb(31 161 107 / 0.65)",
      }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.82}
        height={size * 0.82}
        viewBox="0 0 48 48"
        fill="none"
        className="drop-shadow"
      >
        {/* slow-rotating outer 8-point star */}
        <g
          className={animated ? "animate-spin-slow" : ""}
          style={{ transformOrigin: "24px 24px" }}
        >
          <path
            d="M24 3 L29 12 L39 9 L36 19 L45 24 L36 29 L39 39 L29 36 L24 45 L19 36 L9 39 L12 29 L3 24 L12 19 L9 9 L19 12 Z"
            fill="rgb(255 255 255 / 0.10)"
            stroke="rgb(255 255 255 / 0.45)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>
        {/* inner rotated square + circle */}
        <rect
          x="15"
          y="15"
          width="18"
          height="18"
          rx="3"
          transform="rotate(45 24 24)"
          fill="none"
          stroke="rgb(255 255 255 / 0.5)"
          strokeWidth="1"
        />
        <circle cx="24" cy="24" r="10.5" fill="rgb(5 38 28 / 0.55)" />
        <text
          x="24"
          y="30.5"
          textAnchor="middle"
          fill="#eefbf4"
          fontSize="17"
          fontFamily="var(--font-arabic), serif"
          fontWeight="700"
        >
          إ
        </text>
      </svg>
    </span>
  );
}

export function LogoWordmark({ subtitle }: { subtitle?: string }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="text-gradient text-lg font-bold tracking-tight">Itqan</span>
      {subtitle && (
        <span className="muted text-[10px] font-normal tracking-wide">{subtitle}</span>
      )}
    </span>
  );
}
