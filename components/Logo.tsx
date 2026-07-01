/** Itqan brand mark — Arabic إتقان with geometric frame. */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-xl text-white shadow-lg"
      style={{
        width: size,
        height: size,
        backgroundImage: "linear-gradient(145deg, #1fa16b 0%, #0a4d32 55%, #05261c 100%)",
        boxShadow: "0 8px 24px -6px rgb(31 161 107 / 0.55)",
      }}
      aria-hidden="true"
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2.5 4 7v10l8 4.5 8-4.5V7L12 2.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.35"
        />
        <text
          x="12"
          y="15.5"
          textAnchor="middle"
          fill="currentColor"
          fontSize="9"
          fontFamily="var(--font-arabic), serif"
          fontWeight="700"
        >
          إت
        </text>
      </svg>
    </span>
  );
}

export function LogoWordmark({ subtitle }: { subtitle?: string }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="bg-gradient-to-r from-itqan-400 to-itqan-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-itqan-300 dark:to-itqan-500">
        Itqan
      </span>
      {subtitle && (
        <span className="muted text-[10px] font-normal tracking-wide">{subtitle}</span>
      )}
    </span>
  );
}
