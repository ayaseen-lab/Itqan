"use client";

import { useEffect, useState } from "react";
import type { Tafsir } from "@/lib/quran";
import { useChatStore } from "@/lib/chatStore";
import { NarrationPlayer } from "@/components/NarrationPlayer";
import { plainFromHtml } from "@/lib/ttsChunks";
import type { TafsirLang } from "@/lib/tafsir";

interface TafseerPanelProps {
  verseKey: string;
  surahName: string;
  arabic: string;
  english?: string | null;
  urdu?: string | null;
}

export function TafseerPanel(props: TafseerPanelProps) {
  const { verseKey } = props;
  const [lang, setLang] = useState<TafsirLang>("ur");
  const [tafsir, setTafsir] = useState<Tafsir | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const openChat = useChatStore((s) => s.openWith);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTafsir(undefined);

    fetch(`/api/tafsir?verseKey=${encodeURIComponent(verseKey)}&lang=${lang}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { tafsir: Tafsir | null; error?: string }) => {
        if (!cancelled) {
          if (data.error) setError(data.error);
          else setTafsir(data.tafsir);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            lang === "ur"
              ? "تفسیر لوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔"
              : "Could not load Tafseer. Please try again.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [verseKey, lang]);

  function askAi() {
    openChat(
      {
        verseKey,
        surahName: props.surahName,
        arabic: props.arabic,
        english: props.english,
        urdu: props.urdu,
      },
      `Explain the Tafseer of ayah ${verseKey}: context of revelation, key lessons, and practical guidance.`,
    );
  }

  const speakText = tafsir?.text ? plainFromHtml(tafsir.text, lang) : "";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="inline-flex rounded-full border p-0.5 text-xs font-semibold"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          <button
            type="button"
            onClick={() => setLang("ur")}
            className={`rounded-full px-3 py-1 transition ${
              lang === "ur"
                ? "bg-itqan-600 text-white"
                : "text-itqan-800 dark:text-itqan-200"
            }`}
          >
            اردو تفسیر
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 transition ${
              lang === "en"
                ? "bg-itqan-600 text-white"
                : "text-itqan-800 dark:text-itqan-200"
            }`}
          >
            English Tafseer
          </button>
        </div>

        {tafsir && speakText && <NarrationPlayer text={speakText} lang={lang} />}

        <button type="button" onClick={askAi} className="btn-ghost text-sm">
          Ask AI
        </button>
      </div>

      {loading && (
        <p className="muted text-sm">
          {lang === "ur" ? "تفسیر لوڈ ہو رہی ہے…" : "Loading Tafseer…"}
        </p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && tafsir === null && (
        <p className="muted text-sm">
          {lang === "ur"
            ? "اس آیت کی تفسیر فی الحال دستیاب نہیں ہے۔"
            : "Tafseer isn't available for this ayah right now. Try the Ask AI option."}
        </p>
      )}

      {!loading && tafsir && (
        <div className="overflow-visible">
          <div
            className={`tafsir-content overflow-visible text-sm leading-relaxed ${
              lang === "ur" ? "urdu-text leading-loose" : "tafsir-content--en"
            }`}
            dir={lang === "ur" ? "rtl" : "ltr"}
            lang={lang === "ur" ? "ur" : "en"}
            dangerouslySetInnerHTML={{ __html: tafsir.text }}
          />
          <p className="muted mt-3 border-t pt-2 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
            Source: {tafsir.resourceName}. Commentary is explanatory and distinct from the Quranic text.
          </p>
        </div>
      )}
    </div>
  );
}
