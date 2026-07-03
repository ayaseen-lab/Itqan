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
import { TafheemPanel } from "./TafheemPanel";
import { TajweedTarteelPanel } from "./TajweedTarteelPanel";

type Tab = "words" | "tajweed" | "tafheem" | "tafseer";

const TABS: { id: Tab; label: string }[] = [
  { id: "words", label: "Word by word" },
  { id: "tajweed", label: "Tajweed & Tarteel" },
  { id: "tafheem", label: "Tafheem" },
  { id: "tafseer", label: "Tafseer" },
];

function TranslationBlock({ verse }: { verse: Verse }) {
  const { urdu, english } = verse.translations;
  if (!urdu && !english) {
    return <p className="muted text-sm">Translation not available.</p>;
  }
  return (
    <div className="space-y-2 rounded-xl border p-3" style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--surface) / 0.4)" }}>
      {urdu && (
        <p className="urdu-text text-lg leading-relaxed" dir="rtl" translate="no" lang="ur">
          {urdu}
        </p>
      )}
      {urdu && (
        <p className="muted text-xs" dir="rtl" lang="ur">
          اردو ترجمہ
        </p>
      )}
      {english && (
        <p className="text-sm leading-relaxed">
          <span className="muted text-xs font-medium uppercase tracking-wide">English · </span>
          {english}
        </p>
      )}
    </div>
  );
}

export function VerseCard({ verse, surahName }: { verse: Verse; surahName: string }) {
  const [tab, setTab] = useState<Tab | null>(null);
  const [mounted, setMounted] = useState(false);

  const addCard = useHifzStore((s) => s.addCard);
  const removeCard = useHifzStore((s) => s.removeCard);
  const inHifz = useHifzStore((s) => Boolean(s.cards[verse.verseKey]));
  const openChat = useChatStore((s) => s.openWith);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const bookmarked = useAppStore((s) => s.isBookmarked(verse.verseKey));
  const setLastRead = useAppStore((s) => s.setLastRead);

  useEffect(() => setMounted(true), []);

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

  return (
    <article className="card animate-fade-up p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-itqan-100 px-2 text-xs font-semibold text-itqan-800 dark:bg-itqan-950 dark:text-itqan-200">
          {verse.verseKey}
        </span>
        <AudioPlayer src={verse.audioUrl} />
      </div>

      <div className="mb-4 space-y-3">
        <TajweedText
          html={verse.textTajweed}
          plainText={verse.textUthmani}
          showLegend={tab === "tajweed"}
        />
        <TranslationBlock verse={verse} />
      </div>

      <div className="flex flex-wrap gap-2 border-t pt-3" style={{ borderColor: "rgb(var(--border))" }}>
        <button
          type="button"
          onClick={toggleHifz}
          className={mounted && inHifz ? "btn bg-itqan-100 text-itqan-800 dark:bg-itqan-950 dark:text-itqan-200" : "btn-primary"}
          suppressHydrationWarning
        >
          {mounted && inHifz ? "In Hifz ✓" : "Add to Hifz"}
        </button>
        <button
          type="button"
          onClick={() => toggleBookmark(verse.verseKey)}
          className={`btn-ghost gap-1 ${mounted && bookmarked ? "text-itqan-600" : ""}`}
          suppressHydrationWarning
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={mounted && bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {mounted && bookmarked ? "Saved" : "Save"}
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
              onClick={() => setTab((cur) => (cur === t.id ? null : t.id))}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-itqan-600 text-white shadow-md"
                  : "border hover:border-itqan-400 hover:bg-itqan-50 dark:hover:bg-itqan-950"
              }`}
              style={tab === t.id ? undefined : { borderColor: "rgb(var(--border))" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab && (
          <div
            key={tab}
            className="mt-4 animate-fade-up border-t pt-4"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            {tab === "words" && <WordByWord words={verse.words} />}
            {tab === "tajweed" && <TajweedTarteelPanel verse={verse} />}
            {tab === "tafheem" && (
              <TafheemPanel verseKey={verse.verseKey} chapterId={verse.chapterId} />
            )}
            {tab === "tafseer" && (
              <TafseerPanel
                verseKey={verse.verseKey}
                surahName={surahName}
                arabic={verse.textUthmani}
                english={verse.translations.english}
                urdu={verse.translations.urdu}
              />
            )}
          </div>
        )}
      </div>
    </article>
  );
}
