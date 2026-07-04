"use client";

import { useEffect, useMemo, useState } from "react";
import type { TafheemContent } from "@/lib/tafheem";
import { loadTafheemVerse } from "@/lib/tafheemClient";
import { NarrationPlayer } from "@/components/NarrationPlayer";

interface TafheemPanelProps {
  verseKey: string;
  chapterId: number;
}

/** Strip footnote/db digit noise for cleaner TTS. */
function cleanSpeakable(text: string): string {
  return text
    .replace(/\b\d{5,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function TafheemPanel({ verseKey, chapterId }: TafheemPanelProps) {
  const [tafheem, setTafheem] = useState<TafheemContent | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTafheem(undefined);

    loadTafheemVerse(chapterId, verseKey)
      .then((data) => {
        if (!cancelled) setTafheem(data);
      })
      .catch(() => {
        if (!cancelled) setError("تفہیم لوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [verseKey, chapterId]);

  // Main listen = translation only (short, reliable). Footnotes have their own buttons.
  const translationNarration = useMemo(() => {
    if (!tafheem) return "";
    const t =
      tafheem.translation?.trim() ||
      tafheem.segments
        .filter((s) => s.type === "text")
        .map((s) => s.value)
        .join(" ")
        .trim();
    return cleanSpeakable(t);
  }, [tafheem]);

  const commentaryNarration = useMemo(() => {
    if (!tafheem?.footnotes.length) return "";
    return cleanSpeakable(tafheem.footnotes.map((f) => f.text).filter(Boolean).join(" "));
  }, [tafheem]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-wabil-100 px-3 py-1 text-xs font-semibold text-wabil-800 dark:bg-wabil-950 dark:text-wabil-200">
          تفہیم القرآن · مولانا مودودی
        </span>
        {tafheem && translationNarration && (
          <NarrationPlayer text={translationNarration} lang="ur" label="سنیں" />
        )}
        {tafheem && commentaryNarration && (
          <NarrationPlayer text={commentaryNarration} lang="ur" label="سنیں تشریح" />
        )}
      </div>

      {loading && <p className="muted text-sm">تفہیم لوڈ ہو رہی ہے…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && tafheem === null && (
        <p className="muted text-sm">اس آیت کی تفہیم فی الحال دستیاب نہیں ہے۔</p>
      )}

      {!loading && tafheem && (
        <div className="space-y-4">
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--surface) / 0.4)" }}
          >
            <p className="urdu-text text-lg leading-loose" dir="rtl" lang="ur" translate="no">
              {tafheem.segments.map((seg, i) =>
                seg.type === "text" ? (
                  <span key={i}>{seg.value}</span>
                ) : (
                  <sup
                    key={i}
                    className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded bg-wabil-600 px-1 text-[10px] font-bold text-white"
                  >
                    {seg.number}
                  </sup>
                ),
              )}
            </p>
          </div>

          {tafheem.footnotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold" dir="rtl" lang="ur">
                تشریح
              </h4>
              {tafheem.footnotes.map((fn) => (
                <div
                  key={fn.number}
                  className="rounded-lg border p-3"
                  style={{ borderColor: "rgb(var(--border))" }}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-wabil-100 px-1.5 text-xs font-bold text-wabil-800 dark:bg-wabil-950 dark:text-wabil-200">
                      {fn.number}
                    </span>
                    {fn.text && (
                      <NarrationPlayer text={cleanSpeakable(fn.text)} lang="ur" label="سنیں" />
                    )}
                  </div>
                  <p className="urdu-text text-base leading-loose" dir="rtl" lang="ur" translate="no">
                    {fn.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="muted border-t pt-2 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
            Source: {tafheem.resourceName}
          </p>
        </div>
      )}
    </div>
  );
}
