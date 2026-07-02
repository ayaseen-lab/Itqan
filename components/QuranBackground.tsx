/** Lightweight decorative backdrop — minimal for fast first paint. */
export function QuranBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-80 dark:opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgb(var(--glow) / 0.12), transparent 65%)",
        }}
      />
      <div
        className="absolute -right-32 top-20 h-64 w-64 rounded-full opacity-20 blur-3xl dark:opacity-15"
        style={{ background: "rgb(var(--accent))" }}
      />
    </div>
  );
}
