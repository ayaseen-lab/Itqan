"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string | null;
  showSpeed?: boolean;
}

export function AudioPlayer({ src, showSpeed = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(1);
  const [speed, setSpeed] = useState(1);
  const playsLeftRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playsLeftRef.current -= 1;
      if (playsLeftRef.current > 0) {
        audio.currentTime = 0;
        void audio.play();
      } else {
        setPlaying(false);
      }
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      playsLeftRef.current = 0;
    } else {
      audio.playbackRate = speed;
      playsLeftRef.current = repeat;
      void audio.play();
      setPlaying(true);
    }
  }

  if (!src) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <audio ref={audioRef} src={src} preload="none" />
      <button
        type="button"
        onClick={toggle}
        className="btn-ghost h-9 gap-1.5"
        aria-label={playing ? "Pause recitation" : "Play recitation"}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        <span className="text-xs">{playing ? "Pause" : "Listen"}</span>
      </button>

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
