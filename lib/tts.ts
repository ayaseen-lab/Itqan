"use client";

/**
 * Browser text-to-speech with chunked playback for long Urdu/English text.
 * Browsers truncate single utterances (~200–400 chars); we queue sentences.
 */

export function isTtsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let voicesReady = false;
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

export function ensureVoicesLoaded(): Promise<void> {
  if (!isTtsSupported()) return Promise.resolve();
  const synth = window.speechSynthesis;
  if (voicesReady && synth.getVoices().length > 0) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => {
      voicesReady = true;
      resolve();
    };
    if (synth.getVoices().length > 0) {
      done();
      return;
    }
    synth.onvoiceschanged = () => {
      synth.onvoiceschanged = null;
      done();
    };
    synth.getVoices();
    setTimeout(done, 300);
  });
}

function pickVoice(lang: string, englishOnly = false): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const prefix = lang.split("-")[0].toLowerCase();
  const prefs = englishOnly
    ? [lang.toLowerCase(), prefix, "en-gb", "en"]
    : [lang.toLowerCase(), prefix, "ur", "hi"];

  for (const p of prefs) {
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(p));
    if (match) return match;
  }
  return null;
}

/** Strip HTML/Arabic for clean TTS output. */
export function textForTts(raw: string, lang: "ur" | "en"): string {
  let t = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (lang === "en") {
    // Arabic script confuses English voices — remove it.
    t = t.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, " ");
    t = t.replace(/\s+/g, " ").trim();
  }

  return t;
}

/** Split long text into TTS-safe chunks (~150 chars). */
export function chunkForTts(text: string, maxLen = 150): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  if (cleaned.length <= maxLen) return [cleaned];

  const parts = cleaned.split(/(?<=[.!?۔؟\n])\s+/);
  const chunks: string[] = [];
  let buf = "";

  for (const part of parts) {
    const next = buf ? `${buf} ${part}` : part;
    if (next.length > maxLen && buf) {
      chunks.push(buf);
      buf = part;
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);

  if (chunks.length === 0) {
    for (let i = 0; i < cleaned.length; i += maxLen) {
      chunks.push(cleaned.slice(i, i + maxLen));
    }
  }
  return chunks;
}

function startKeepAlive() {
  stopKeepAlive();
  if (!isTtsSupported()) return;
  const synth = window.speechSynthesis;
  keepAliveTimer = setInterval(() => {
    if (!synth.speaking) {
      stopKeepAlive();
      return;
    }
    synth.pause();
    synth.resume();
  }, 8000);
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

export interface SpeakHandle {
  stop: () => void;
}

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  englishOnly?: boolean;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export function speak(text: string, opts: SpeakOptions = {}): SpeakHandle | null {
  const lang = opts.lang ?? "ur-PK";
  const langKey = lang.startsWith("en") ? "en" : "ur";
  const cleaned = textForTts(text, langKey);
  const chunks = chunkForTts(cleaned);
  if (!isTtsSupported() || chunks.length === 0) return null;

  const synth = window.speechSynthesis;
  synth.cancel();
  stopKeepAlive();

  let index = 0;
  let stopped = false;
  const voice = pickVoice(lang, opts.englishOnly ?? langKey === "en");
  const rate = opts.rate ?? (langKey === "en" ? 1 : 0.92);

  function speakNext() {
    if (stopped || index >= chunks.length) {
      stopKeepAlive();
      opts.onEnd?.();
      return;
    }

    const utter = new SpeechSynthesisUtterance(chunks[index++]);
    utter.lang = lang;
    utter.rate = rate;
    if (voice) utter.voice = voice;

    utter.onend = () => speakNext();
    utter.onerror = (e) => {
      stopKeepAlive();
      opts.onError?.(e.error || "tts-error");
    };

    synth.speak(utter);
    startKeepAlive();
  }

  speakNext();
  return {
    stop: () => {
      stopped = true;
      stopKeepAlive();
      synth.cancel();
    },
  };
}

export function stopSpeaking() {
  stopKeepAlive();
  if (isTtsSupported()) window.speechSynthesis.cancel();
}

export function hasUrduVoice(): boolean {
  if (!isTtsSupported()) return false;
  return window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith("ur"));
}
