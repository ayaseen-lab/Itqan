"use client";

/**
 * Web Speech API wrapper for Arabic recitation capture.
 * Requests microphone permission first (required on mobile browsers).
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

export function isMicApiAvailable(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

/** Ask for mic access — unlocks recognition on mobile Chrome/Safari. */
export async function requestMicrophoneAccess(): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isMicApiAvailable()) {
    return { ok: false, error: "no-media-devices" };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });
    // Release tracks immediately — SpeechRecognition uses its own capture.
    for (const track of stream.getTracks()) track.stop();
    return { ok: true };
  } catch (err) {
    const name = err instanceof DOMException ? err.name : "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      return { ok: false, error: "not-allowed" };
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return { ok: false, error: "no-microphone" };
    }
    return { ok: false, error: "mic-failed" };
  }
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
 * Start listening after mic permission is granted.
 * On mobile, call requestMicrophoneAccess() first from a user gesture.
 */
export function startRecitation(handlers: CaptureHandlers): RecitationCapture | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = handlers.lang ?? "ar-SA";
  // continuous works better for full ayahs on desktop; mobile often prefers shorter sessions
  const mobile = typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  recognition.continuous = !mobile;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalText = "";
  let stopped = false;

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
    if (stopped && event.error === "aborted") return;
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
      stopped = true;
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      }
    },
  };
}
