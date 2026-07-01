"use client";

const LEGEND: { label: string; color: string; rule: string }[] = [
  { label: "Ghunnah", color: "#ff7e1e", rule: "Nasalization (2 counts)" },
  { label: "Qalqalah", color: "#dd0008", rule: "Echoing/bouncing sound" },
  { label: "Ikhfa", color: "#9400a8", rule: "Hidden noon/meem" },
  { label: "Idgham", color: "#169777", rule: "Merging letters" },
  { label: "Iqlab", color: "#26bffd", rule: "Noon becomes meem" },
  { label: "Madd", color: "#4050ff", rule: "Prolongation" },
  { label: "Silent", color: "#9ca3af", rule: "Not pronounced" },
];

/**
 * Renders the Quran.com tajweed markup (custom <tajweed class=...> spans).
 * The markup is trusted (from the Quran.com API) so we render it directly and
 * color it via the .tajweed-text CSS rules in globals.css.
 */
export function TajweedText({ html }: { html: string | null }) {
  if (!html) {
    return (
      <p className="muted text-sm">
        Tajweed-colored script isn&apos;t available for this ayah offline. Connect to the internet
        to load it.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p
        className="tajweed-text text-right text-3xl"
        dir="rtl"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t pt-3" style={{ borderColor: "rgb(var(--border))" }}>
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-xs" title={l.rule}>
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="font-medium">{l.label}</span>
            <span className="muted hidden sm:inline">— {l.rule}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
