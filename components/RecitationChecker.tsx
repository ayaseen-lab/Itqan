"use client";

import { useEffect, useRef, useState } from "react";
import {
  isMicApiAvailable,
  isSpeechSupported,
  requestMicrophoneAccess,
  startRecitation,
  type RecitationCapture,
} from "@/lib/speech";
import { scoreRecitation, type RecitationResult } from "@/lib/arabic";
import type { Word } from "@/lib/quran";
import { ScoreCard } from "./ScoreCard";

function friendlyMicError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone permission was denied. Allow mic access in your browser settings, then try again.";
    case "no-microphone":
      return "No microphone found. Connect a mic or use a device with one built in.";
    case "no-media-devices":
      return "This browser cannot access the microphone. Try Chrome or Safari.";
    case "no-speech":
      return "No speech detected. Hold the phone closer and recite clearly.";
    case "audio-capture":
      return "Could not capture audio. Close other apps using the mic and retry.";
    case "network":
      return "Speech recognition needs a network connection on this device.";
    case "could-not-start":
      return "Could not start listening. Tap again and allow microphone access.";
    default:
      return `Recognition error: ${code}. Try Chrome on Android or Safari on iPhone.`;
  }
}

export function RecitationChecker({
  expectedText,
  words,
}: {
  expectedText: string;
  words?: Word[];
}) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [starting, setStarting] = useState(false);
  const [interim, setInterim] = useState("");
  const [result, setResult] = useState<RecitationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const captureRef = useRef<RecitationCapture | null>(null);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => captureRef.current?.stop();
  }, []);

  async function start() {
    setError(null);
    setResult(null);
    setInterim("");
    setStarting(true);

    if (isMicApiAvailable()) {
      const mic = await requestMicrophoneAccess();
      if (!mic.ok) {
        setStarting(false);
        setError(friendlyMicError(mic.error));
        return;
      }
    }

    const capture = startRecitation({
      onInterim: (text) => setInterim(text),
      onFinal: (text) => {
        setListening(false);
        captureRef.current = null;
        if (text) {
          setResult(scoreRecitation(expectedText, text));
        } else {
          setError("No speech detected. Please try again in a quiet place.");
        }
      },
      onError: (message) => {
        setListening(false);
        captureRef.current = null;
        setError(friendlyMicError(message));
      },
    });

    setStarting(false);
    if (!capture) {
      setSupported(false);
      return;
    }
    captureRef.current = capture;
    setListening(true);
  }

  function stopManual() {
    captureRef.current?.stop();
  }

  if (!supported) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
        <p className="font-medium">Recitation check needs speech recognition</p>
        <p className="muted mt-1 text-xs">
          Best on <strong>Chrome</strong> (Android / desktop) or recent <strong>Safari</strong> (iPhone / iPad).
          Allow microphone access when prompted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {listening ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <span className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-wabil-600 px-4 py-2 text-sm font-medium text-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              Listening…
            </span>
            <button
              type="button"
              onClick={stopManual}
              className="btn-ghost min-h-11 text-xs text-red-600 sm:min-h-0"
            >
              Stop early
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => void start()}
            disabled={starting}
            className="btn-primary min-h-11 w-full gap-1.5 sm:w-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
            </svg>
            {starting ? "Starting mic…" : "Check my recitation"}
          </button>
        )}
        <span className="muted text-xs sm:max-w-[16rem]">
          {listening
            ? "Stops automatically when you finish speaking."
            : "Recite the ayah aloud. Stops by itself when you pause."}
        </span>
      </div>

      {listening && (
        <p className="quran-text min-h-[2.5rem] rounded-lg bg-wabil-100 p-3 text-lg dark:bg-wabil-950" dir="rtl">
          {interim || "Listening…"}
        </p>
      )}

      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>}
      {result && <ScoreCard result={result} words={words} />}
    </div>
  );
}
