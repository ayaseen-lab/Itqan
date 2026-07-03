"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chunkTextForTts } from "@/lib/ttsChunks";
import { ensureVoicesLoaded, speak, stopSpeaking } from "@/lib/tts";

interface NarrationPlayerProps {
  text: string;
  lang: "ur" | "en";
  label?: string;
}

function playAudioBlob(audio: HTMLAudioElement, blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    let done = false;

    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onErr);
      ok ? resolve() : reject(new Error("playback failed"));
    };

    const onEnded = () => finish(true);
    const onErr = () => finish(false);

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onErr);
    audio.src = url;
    audio.volume = 1;
    audio.load();
    void audio.play().catch(() => finish(false));
  });
}

async function fetchChunk(text: string, lang: "ur" | "en", index: number): Promise<Blob> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang, chunk: index }),
  });
  if (!res.ok) throw new Error(`tts ${res.status}`);
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("audio")) throw new Error("not audio");
  const blob = await res.blob();
  if (blob.size < 400) throw new Error("empty");
  return blob;
}

export function NarrationPlayer({ text, lang, label }: NarrationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speakRef = useRef<ReturnType<typeof speak> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const stopRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      stopRef.current = true;
      audio.pause();
      audio.src = "";
      stopSpeaking();
      speakRef.current?.stop();
    };
  }, []);

  const stopAll = useCallback(() => {
    stopRef.current = true;
    audioRef.current?.pause();
    speakRef.current?.stop();
    stopSpeaking();
    setPlaying(false);
    setLoading(false);
  }, []);

  const runBrowserFallback = useCallback(
    (cleaned: string) =>
      new Promise<void>((resolve, reject) => {
        const h = speak(cleaned, {
          lang: lang === "ur" ? "ur-PK" : "en-US",
          rate: lang === "ur" ? 0.9 : 0.95,
          englishOnly: lang === "en",
          onEnd: () => {
            speakRef.current = null;
            resolve();
          },
          onError: () => {
            speakRef.current = null;
            reject(new Error("browser"));
          },
        });
        if (!h) reject(new Error("no browser tts"));
        else speakRef.current = h;
      }),
    [lang],
  );

  const runPlayback = useCallback(async () => {
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (!cleaned || !audioRef.current) return;

    stopRef.current = false;
    setLoading(true);
    setError(false);

    const chunks = chunkTextForTts(cleaned);

    try {
      await ensureVoicesLoaded();
      setPlaying(true);
      setLoading(false);

      for (let i = 0; i < chunks.length; i++) {
        if (stopRef.current) break;
        try {
          const blob = await fetchChunk(cleaned, lang, i);
          await playAudioBlob(audioRef.current, blob);
        } catch {
          if (stopRef.current) break;
          await runBrowserFallback(chunks.slice(i).join(" "));
          break;
        }
      }
    } catch {
      if (!stopRef.current) {
        try {
          await runBrowserFallback(cleaned);
        } catch {
          setError(true);
        }
      }
    } finally {
      if (!stopRef.current) setPlaying(false);
    }
  }, [text, lang, runBrowserFallback]);

  function toggle() {
    if (playing || loading) {
      stopAll();
      return;
    }
    void runPlayback();
  }

  if (!text.trim()) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-itqan-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-itqan-700 hover:shadow-lg disabled:opacity-60"
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.35" />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : playing ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
      <span>
        {playing
          ? lang === "ur"
            ? "روکیں"
            : "Stop"
          : loading
            ? lang === "ur"
              ? "لوڈ…"
              : "Loading…"
            : error
              ? lang === "ur"
                ? "دوبارہ"
                : "Retry"
              : label ?? (lang === "ur" ? "سنیں" : "Listen")}
      </span>
    </button>
  );
}
