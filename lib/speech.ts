"use client";

/**
 * Thin wrapper around the browser Web Speech API for Arabic recitation capture.
 * No API key, no server; runs entirely client-side. Best support is in
 * Chromium-based browsers (Chrome, Edge). Safari/Firefox support varies.
 */

interface RecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface RecognitionResult {
  isFinal: boolean;
  0: RecognitionAlternative;
  length: number;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export interface RecitationCapture {
  stop: () => void;
}

export interface CaptureHandlers {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (message: string) => void;
  onEnd?: () => void;
  lang?: string;
}

/**
 * Start listening. Returns a handle you can use to stop early, or null if the
 * browser has no Web Speech support. Distinguishes final vs interim results so
 * the final transcript is stable and not double-counted.
 */
export function startRecitation(handlers: CaptureHandlers): RecitationCapture | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = handlers.lang ?? "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalText = "";

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0]?.transcript ?? "";
      if (result.isFinal) {
        finalText += transcript + " ";
      } else {
        interim += transcript + " ";
      }
    }
    handlers.onInterim?.((finalText + interim).trim());
  };

  recognition.onerror = (event) => {
    handlers.onError(event.error || "speech-recognition-error");
  };

  recognition.onend = () => {
    handlers.onFinal(finalText.trim());
    handlers.onEnd?.();
  };

  try {
    recognition.start();
  } catch {
    handlers.onError("could-not-start");
    return null;
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    },
  };
}
