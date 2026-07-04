"use client";

import { useState } from "react";
import { OFFLINE_CHAPTERS } from "@/lib/offlineData";
import { useHifzStore } from "@/lib/store";

export function HifzAddRange() {
  const addCards = useHifzStore((s) => s.addCards);
  const [chapterId, setChapterId] = useState(1);
  const chapter = OFFLINE_CHAPTERS.find((c) => c.id === chapterId) ?? OFFLINE_CHAPTERS[0];
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(7);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const start = Math.min(from, to);
    const end = Math.max(from, to);
    try {
      const res = await fetch(
        `/api/verses?chapter=${chapterId}&from=${start}&to=${end}`,
      );
      if (!res.ok) throw new Error("Could not load verses");
      const data = (await res.json()) as {
        verses: Array<{
          verseKey: string;
          chapterId: number;
          verseNumber: number;
          textUthmani: string;
        }>;
      };
      const added = addCards(data.verses);
      setMsg(
        added > 0
          ? `Added ${added} ayah${added === 1 ? "" : "s"} (${chapter.nameSimple} ${start}–${end}).`
          : "Those ayahs are already in your Hifz list.",
      );
    } catch {
      setMsg("Failed to add ayahs. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <div>
        <h2 className="font-semibold">Add multiple ayahs</h2>
        <p className="muted text-sm">Pick a surah and ayah range — all are added to Hifz at once.</p>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Surah</span>
        <select
          className="field"
          value={chapterId}
          onChange={(e) => {
            const id = Number(e.target.value);
            setChapterId(id);
            const ch = OFFLINE_CHAPTERS.find((c) => c.id === id);
            setFrom(1);
            setTo(Math.min(7, ch?.versesCount ?? 1));
          }}
        >
          {OFFLINE_CHAPTERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}. {c.nameSimple} ({c.versesCount})
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">From ayah</span>
          <input
            type="number"
            className="field"
            min={1}
            max={chapter.versesCount}
            value={from}
            onChange={(e) => setFrom(Number(e.target.value))}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">To ayah</span>
          <input
            type="number"
            className="field"
            min={1}
            max={chapter.versesCount}
            value={to}
            onChange={(e) => setTo(Number(e.target.value))}
          />
        </label>
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
        {busy ? "Adding…" : "Add range to Hifz"}
      </button>
      {msg && <p className="text-sm text-itqan-600">{msg}</p>}
    </form>
  );
}
