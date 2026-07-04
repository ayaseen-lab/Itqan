"use client";

/**
 * Web Speech API wrapper for Arabic recitation capture.
 * Auto-stops when the speaker pauses (silence), so no manual Stop is required.
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
  onspeechend?: (() => void) | null;
  onsoundend?: (() => void) | null;
}

/** Pause after last speech before auto-stop (ms). */
const SILENCE_MS = 1400;
/** Hard cap so a stuck session always ends. */
const MAX_LISTEN_MS = 45_000;

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
  /** Override silence auto-stop delay (ms). */
  silenceMs?: number;
}

/**
 * Start listening after mic permission is granted.
 * Stops automatically when the user pauses speaking (silence), or on max duration.
 */
export function startRecitation(handlers: CaptureHandlers): RecitationCapture | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = handlers.lang ?? "ar-SA";
  // continuous=true so we capture a full ayah; silence timer ends the session.
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalText = "";
  let stopped = false;
  let heardSpeech = false;
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  let maxTimer: ReturnType<typeof setTimeout> | null = null;
  const silenceMs = handlers.silenceMs ?? SILENCE_MS;

  const clearTimers = () => {
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
    if (maxTimer) {
      clearTimeout(maxTimer);
      maxTimer = null;
    }
  };

  const finishStop = () => {
    if (stopped) return;
    stopped = true;
    clearTimers();
    try {
      recognition.stop();
    } catch {
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
    }
  };

  const armSilenceTimer = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      // Only auto-stop once we've heard something (or interim text exists).
      if (!stopped && heardSpeech) {
        finishStop();
      }
    }, silenceMs);
  };

  recognition.onresult = (event) => {
    heardSpeech = true;
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
    armSilenceTimer();
  };

  // Browser-native “speech ended” — stop shortly after.
  recognition.onspeechend = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      if (!stopped && heardSpeech) finishStop();
    }, 350);
  };

  recognition.onsoundend = () => {
    if (heardSpeech && !stopped) armSilenceTimer();
  };

  recognition.onerror = (event) => {
    if (stopped && (event.error === "aborted" || event.error === "no-speech")) return;
    // no-speech while still listening: let max timer / silence handle it
    if (event.error === "no-speech" && !stopped) {
      if (heardSpeech) {
        finishStop();
        return;
      }
      // Keep listening a bit longer for late start
      armSilenceTimer();
      return;
    }
    if (!stopped) {
      stopped = true;
      clearTimers();
      handlers.onError(event.error || "speech-recognition-error");
    }
  };

  recognition.onend = () => {
    clearTimers();
    if (!stopped) stopped = true;
    handlers.onFinal(finalText.trim());
    handlers.onEnd?.();
  };

  try {
    recognition.start();
  } catch {
    handlers.onError("could-not-start");
    return null;
  }

  // If user never speaks, end with empty final (UI shows “no speech”).
  maxTimer = setTimeout(() => {
    if (!stopped) finishStop();
  }, MAX_LISTEN_MS);

  // Start silence clock only after first sound; also a grace period for slow starters.
  silenceTimer = setTimeout(() => {
    if (!stopped && !heardSpeech) {
      // Still waiting — extend once more, then give up via max timer.
      return;
    }
  }, silenceMs);

  return {
    stop: () => finishStop(),
  };
}
