"use client";

import { useEffect, useRef, useState } from "react";
import { ayahAudioUrl } from "@/lib/audio";
import { ayahsInJuz, juzLabel } from "@/lib/juz";

export function HifzParahPlayer() {
  const [juz, setJuz] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef(false);

  const ayahs = ayahsInJuz(juz);
  const current = ayahs[index];

  useEffect(() => {
    const audio = new Audio();
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      stopRef.current = true;
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    // Reset when juz changes
    stopRef.current = true;
    audioRef.current?.pause();
    setPlaying(false);
    setIndex(0);
    setError(null);
  }, [juz]);

  async function playFrom(startIndex: number) {
    const audio = audioRef.current;
    if (!audio) return;
    stopRef.current = false;
    setPlaying(true);
    setError(null);

    for (let i = startIndex; i < ayahs.length; i++) {
      if (stopRef.current) break;
      setIndex(i);
      const a = ayahs[i];
      const src = ayahAudioUrl(a.chapterId, a.verseNumber);
      try {
        await new Promise<void>((resolve, reject) => {
          const onEnded = () => {
            cleanup();
            resolve();
          };
          const onErr = () => {
            cleanup();
            reject(new Error("play failed"));
          };
          const cleanup = () => {
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("error", onErr);
          };
          audio.addEventListener("ended", onEnded);
          audio.addEventListener("error", onErr);
          audio.src = src;
          audio.load();
          void audio.play().catch(onErr);
        });
      } catch {
        if (!stopRef.current) {
          setError(`Could not play ${a.verseKey}. Skipping…`);
        }
      }
    }

    if (!stopRef.current) {
      setPlaying(false);
      setIndex(0);
    }
  }

  function stop() {
    stopRef.current = true;
    audioRef.current?.pause();
    setPlaying(false);
  }

  return (
    <div className="card space-y-4 p-5">
      <div>
        <h2 className="font-semibold">Listen to a complete parah (Juz)</h2>
        <p className="muted text-sm">
          Plays every ayah in the Juz in order (Mishary Alafasy). Use headphones for best results.
        </p>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Parah / Juz</span>
        <select className="field" value={juz} onChange={(e) => setJuz(Number(e.target.value))}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {juzLabel(n)} · {ayahsInJuz(n).length} ayahs
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {playing ? (
          <button type="button" className="btn min-h-11 bg-red-500 text-white hover:bg-red-600" onClick={stop}>
            Stop
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary min-h-11"
            onClick={() => void playFrom(0)}
          >
            Listen full parah
          </button>
        )}
        {playing && current && (
          <span className="text-sm font-medium text-itqan-600">
            Playing {current.verseKey} ({index + 1}/{ayahs.length})
          </span>
        )}
      </div>

      {playing && (
        <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-itqan-500 transition-all duration-300"
            style={{ width: `${((index + 1) / Math.max(ayahs.length, 1)) * 100}%` }}
          />
        </div>
      )}

      {error && <p className="text-sm text-amber-600">{error}</p>}
    </div>
  );
}
