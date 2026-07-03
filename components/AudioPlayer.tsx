"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string | null;
  showSpeed?: boolean;
}

export function AudioPlayer({ src, showSpeed = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [repeat, setRepeat] = useState(1);
  const [speed, setSpeed] = useState(1);
  const playsLeftRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");

    const handleEnded = () => {
      playsLeftRef.current -= 1;
      if (playsLeftRef.current > 0) {
        audio.currentTime = 0;
        void audio.play().catch(() => setPlaying(false));
      } else {
        setPlaying(false);
      }
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    setPlaying(false);
    setLoading(true);
    setError(false);
    audio.preload = "auto";
    audio.volume = 1;
    audio.src = src;
    audio.load();

    const onReady = () => setLoading(false);
    const onError = () => {
      setLoading(false);
      setError(true);
    };

    audio.addEventListener("canplaythrough", onReady);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onError);
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  const waitUntilPlayable = useCallback(async (audio: HTMLAudioElement) => {
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return;
    await new Promise<void>((resolve, reject) => {
      const done = () => {
        cleanup();
        resolve();
      };
      const fail = () => {
        cleanup();
        reject(new Error("audio load failed"));
      };
      const cleanup = () => {
        audio.removeEventListener("canplay", done);
        audio.removeEventListener("error", fail);
      };
      audio.addEventListener("canplay", done, { once: true });
      audio.addEventListener("error", fail, { once: true });
      audio.load();
    });
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      playsLeftRef.current = 0;
      return;
    }

    setLoading(true);
    try {
      await waitUntilPlayable(audio);
      audio.playbackRate = speed;
      playsLeftRef.current = repeat;
      await audio.play();
      setPlaying(true);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (!src) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <audio ref={audioRef} preload="auto" playsInline={true} />
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={loading && !playing}
        className="btn-ghost min-h-11 min-w-11 gap-1.5 touch-manipulation disabled:opacity-60 sm:h-9 sm:min-h-0"
        aria-label={playing ? "Pause recitation" : "Play recitation"}
      >
        {loading && !playing ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
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
        <span className="text-xs">
          {playing ? "Pause" : loading ? "Loading" : error ? "Retry" : "Listen"}
        </span>
      </button>

      {error && (
        <span className="text-[10px] text-red-500">Audio unavailable</span>
      )}

      <label className="flex items-center gap-1 text-xs muted">
        <span className="sr-only sm:not-sr-only">Repeat</span>
        <select
          value={repeat}
          onChange={(e) => setRepeat(Number(e.target.value))}
          className="rounded-lg border bg-transparent px-1.5 py-1"
          style={{ borderColor: "rgb(var(--border))" }}
          aria-label="Repeat count for memorization"
        >
          {[1, 3, 5, 10].map((n) => (
            <option key={n} value={n}>
              {n}x
            </option>
          ))}
        </select>
      </label>

      {showSpeed && (
        <label className="flex items-center gap-1 text-xs muted">
          <span className="sr-only sm:not-sr-only">Speed</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-lg border bg-transparent px-1.5 py-1"
            style={{ borderColor: "rgb(var(--border))" }}
            aria-label="Playback speed"
          >
            {[0.5, 0.75, 1].map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "Normal" : `${n}x`}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
