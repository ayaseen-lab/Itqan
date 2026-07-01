"use client";

/**
 * Browser text-to-speech (SpeechSynthesis). Free, no key, on-device.
 * Urdu voice availability varies by OS/browser; we pick the best matching
 * voice and fall back to the default voice with an Urdu lang hint.
 */

export function isTtsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(langPrefix: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const exact = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
  return exact ?? null;
}

export interface SpeakHandle {
  stop: () => void;
}

export interface SpeakOptions {
  lang?: string; // e.g. "ur-PK"
  rate?: number; // 0.5 - 2
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export function speak(text: string, opts: SpeakOptions = {}): SpeakHandle | null {
  if (!isTtsSupported() || !text.trim()) return null;

  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything currently speaking

  const utter = new SpeechSynthesisUtterance(text);
  const lang = opts.lang ?? "ur-PK";
  utter.lang = lang;
  utter.rate = opts.rate ?? 0.95;

  const langPrefix = lang.split("-")[0].toLowerCase();
  const voice = pickVoice(langPrefix);
  if (voice) utter.voice = voice;

  utter.onend = () => opts.onEnd?.();
  utter.onerror = (e) => opts.onError?.(e.error || "tts-error");

  synth.speak(utter);
  return { stop: () => synth.cancel() };
}

export function stopSpeaking() {
  if (isTtsSupported()) window.speechSynthesis.cancel();
}

/**
 * Some browsers report an Urdu-capable voice; return true if one exists so the
 * UI can hint when playback may use a non-Urdu fallback voice.
 */
export function hasUrduVoice(): boolean {
  if (!isTtsSupported()) return false;
  return window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith("ur"));
}
