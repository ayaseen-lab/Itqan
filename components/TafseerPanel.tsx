"use client";

import { useEffect, useRef, useState } from "react";
import type { Tafsir } from "@/lib/quran";
import { useChatStore } from "@/lib/chatStore";
import { isTtsSupported, speak, stopSpeaking, type SpeakHandle } from "@/lib/tts";

interface TafseerPanelProps {
  verseKey: string;
  surahName: string;
  arabic: string;
  english?: string | null;
  urdu?: string | null;
}

export function TafseerPanel(props: TafseerPanelProps) {
  const { verseKey } = props;
  const [tafsir, setTafsir] = useState<Tafsir | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const speakRef = useRef<SpeakHandle | null>(null);
  const openChat = useChatStore((s) => s.openWith);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTafsir(undefined);

    fetch(`/api/tafsir?verseKey=${encodeURIComponent(verseKey)}`)
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
        if (!cancelled) setError("Could not load Tafseer. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stopSpeaking();
    };
  }, [verseKey]);

  function plainText(html: string): string {
    if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ");
    const el = document.createElement("div");
    el.innerHTML = html;
    return (el.textContent || el.innerText || "").replace(/\s+/g, " ").trim();
  }

  function toggleSpeak() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    if (!tafsir?.text) return;
    const handle = speak(plainText(tafsir.text), {
      lang: "en-US",
      rate: 1,
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
    if (handle) {
      speakRef.current = handle;
      setSpeaking(true);
    }
  }

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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-itqan-100 px-3 py-1 text-xs font-semibold text-itqan-800 dark:bg-itqan-950 dark:text-itqan-200">
          Tafsir Ibn Kathir · English
        </span>
        {tafsir && isTtsSupported() && (
          <button type="button" onClick={toggleSpeak} className="btn-ghost gap-1.5 text-sm">
            {speaking ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                Listen
              </>
            )}
          </button>
        )}
        <button type="button" onClick={askAi} className="btn-ghost text-sm">
          Ask AI
        </button>
      </div>

      {loading && <p className="muted text-sm">Loading Tafseer…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && tafsir === null && (
        <p className="muted text-sm">
          Tafseer isn&apos;t available for this ayah right now. Try the &ldquo;Ask AI&rdquo; option
          for an explanation.
        </p>
      )}

      {!loading && tafsir && (
        <div>
          <div
            className="tafsir-content text-sm"
            dangerouslySetInnerHTML={{ __html: tafsir.text }}
          />
          <p className="muted mt-3 border-t pt-2 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
            Source: {tafsir.resourceName}. Commentary is explanatory and distinct from the Quranic
            text.
          </p>
        </div>
      )}
    </div>
  );
}
