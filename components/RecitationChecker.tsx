"use client";

import { useEffect, useRef, useState } from "react";
import { isSpeechSupported, startRecitation, type RecitationCapture } from "@/lib/speech";
import { scoreRecitation, type RecitationResult } from "@/lib/arabic";
import type { Word } from "@/lib/quran";
import { ScoreCard } from "./ScoreCard";

export function RecitationChecker({
  expectedText,
  words,
}: {
  expectedText: string;
  words?: Word[];
}) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [result, setResult] = useState<RecitationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const captureRef = useRef<RecitationCapture | null>(null);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => captureRef.current?.stop();
  }, []);

  function start() {
    setError(null);
    setResult(null);
    setInterim("");
    const capture = startRecitation({
      onInterim: (text) => setInterim(text),
      onFinal: (text) => {
        setListening(false);
        if (text) {
          setResult(scoreRecitation(expectedText, text));
        } else {
          setError("No speech detected. Please try again in a quiet place.");
        }
      },
      onError: (message) => {
        setListening(false);
        if (message === "not-allowed" || message === "service-not-allowed") {
          setError("Microphone permission was denied. Please allow mic access and retry.");
        } else if (message === "no-speech") {
          setError("No speech detected. Please try again.");
        } else {
          setError(`Recognition error: ${message}`);
        }
      },
    });
    if (!capture) {
      setSupported(false);
      return;
    }
    captureRef.current = capture;
    setListening(true);
  }

  function stop() {
    captureRef.current?.stop();
  }

  if (!supported) {
    return (
      <p className="muted text-xs">
        Recitation checking needs the Web Speech API. Please use Chrome or Edge on desktop or
        Android.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {listening ? (
          <button type="button" onClick={stop} className="btn bg-red-500 text-white hover:bg-red-600">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Stop &amp; check
          </button>
        ) : (
          <button type="button" onClick={start} className="btn-primary gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
            </svg>
            Check my recitation
          </button>
        )}
        <span className="muted text-xs">Recite the ayah aloud; we&apos;ll score your accuracy.</span>
      </div>

      {listening && (
        <p className="quran-text mt-2 min-h-[2.5rem] rounded-lg bg-itqan-100 p-2 text-lg dark:bg-itqan-950" dir="rtl">
          {interim || "Listening…"}
        </p>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {result && <ScoreCard result={result} words={words} />}
    </div>
  );
}
