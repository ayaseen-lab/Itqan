"use client";

import { useState, useEffect } from "react";
import type { Verse } from "@/lib/quran";
import { useHifzStore } from "@/lib/store";
import { useChatStore } from "@/lib/chatStore";
import { useAppStore } from "@/lib/appStore";
import { AudioPlayer } from "./AudioPlayer";
import { WordByWord } from "./WordByWord";
import { TajweedText } from "./TajweedText";
import { TafseerPanel } from "./TafseerPanel";
import { TarteelPractice } from "./TarteelPractice";

type Tab = "translation" | "words" | "tajweed" | "tafseer" | "practice";

const TABS: { id: Tab; label: string }[] = [
  { id: "translation", label: "Translation" },
  { id: "words", label: "Word by word" },
  { id: "tajweed", label: "Tajweed" },
  { id: "tafseer", label: "Tafseer" },
  { id: "practice", label: "Practice" },
];

export function VerseCard({ verse, surahName }: { verse: Verse; surahName: string }) {
  const [tab, setTab] = useState<Tab | null>(null);

  const addCard = useHifzStore((s) => s.addCard);
  const removeCard = useHifzStore((s) => s.removeCard);
  const inHifz = useHifzStore((s) => Boolean(s.cards[verse.verseKey]));
  const openChat = useChatStore((s) => s.openWith);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const bookmarked = useAppStore((s) => s.isBookmarked(verse.verseKey));
  const setLastRead = useAppStore((s) => s.setLastRead);

  useEffect(() => {
    setLastRead({
      surahId: verse.chapterId,
      surahName,
      verseKey: verse.verseKey,
    });
  }, [verse.verseKey, verse.chapterId, surahName, setLastRead]);

  function toggleHifz() {
    if (inHifz) {
      removeCard(verse.verseKey);
    } else {
      addCard({
        verseKey: verse.verseKey,
        chapterId: verse.chapterId,
        verseNumber: verse.verseNumber,
        textUthmani: verse.textUthmani,
      });
    }
  }

  function askAi() {
    openChat(
      {
        verseKey: verse.verseKey,
        surahName,
        arabic: verse.textUthmani,
        english: verse.translations.english,
        urdu: verse.translations.urdu,
      },
      `Explain the meaning and key lessons of ayah ${verse.verseKey}.`,
    );
  }

  function selectTab(t: Tab) {
    setTab((cur) => (cur === t ? null : t));
  }

  return (
    <article className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-itqan-100 px-2 text-xs font-semibold text-itqan-800 dark:bg-itqan-950 dark:text-itqan-200">
          {verse.verseKey}
        </span>
        <AudioPlayer src={verse.audioUrl} />
      </div>

      <p className="quran-text mb-4 text-right text-3xl" dir="rtl">
        {verse.textUthmani}
      </p>

      <div className="flex flex-wrap gap-2 border-t pt-3" style={{ borderColor: "rgb(var(--border))" }}>
        <button type="button" onClick={toggleHifz} className={inHifz ? "btn bg-itqan-100 text-itqan-800 dark:bg-itqan-950 dark:text-itqan-200" : "btn-primary"}>
          {inHifz ? "In Hifz \u2713" : "Add to Hifz"}
        </button>
        <button
          type="button"
          onClick={() => toggleBookmark(verse.verseKey)}
          className={`btn-ghost gap-1 ${bookmarked ? "text-itqan-600" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {bookmarked ? "Saved" : "Save"}
        </button>
        <button type="button" onClick={askAi} className="btn-ghost">
          Ask AI
        </button>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-1.5" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => selectTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-itqan-600 text-white"
                  : "border hover:bg-itqan-50 dark:hover:bg-itqan-950"
              }`}
              style={tab === t.id ? undefined : { borderColor: "rgb(var(--border))" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab && (
          <div className="mt-4 border-t pt-4" style={{ borderColor: "rgb(var(--border))" }}>
            {tab === "translation" && (
              <div className="space-y-2">
                {verse.translations.urdu && (
                  <p className="urdu-text text-lg leading-relaxed" dir="rtl">
                    {verse.translations.urdu}
                  </p>
                )}
                {verse.translations.english && (
                  <p className="text-sm">
                    <span className="muted">EN: </span>
                    {verse.translations.english}
                  </p>
                )}
                {!verse.translations.urdu && !verse.translations.english && (
                  <p className="muted text-sm">Translation not available.</p>
                )}
              </div>
            )}

            {tab === "words" && <WordByWord words={verse.words} />}

            {tab === "tajweed" && <TajweedText html={verse.textTajweed} />}

            {tab === "tafseer" && (
              <TafseerPanel
                verseKey={verse.verseKey}
                surahName={surahName}
                arabic={verse.textUthmani}
                english={verse.translations.english}
                urdu={verse.translations.urdu}
              />
            )}

            {tab === "practice" && <TarteelPractice verse={verse} />}
          </div>
        )}
      </div>
    </article>
  );
}
