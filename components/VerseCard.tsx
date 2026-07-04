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

type Tab = "words" | "tafheem" | "tafseer";

function TranslationBlock({ verse }: { verse: Verse }) {
  const { urdu, english } = verse.translations;
  if (!urdu && !english) {
    return <p className="muted text-sm">Translation not available.</p>;
  }
  return (
    <div className="space-y-2">
      {urdu && (
        <p className="urdu-text text-lg leading-relaxed" dir="rtl" translate="no" lang="ur">
          {urdu}
        </p>
      )}
      {english && (
        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {english}
        </p>
      )}
    </div>
  );
}

function actionClass(active: boolean) {
  return `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
    active
      ? "bg-wabil-600 text-white shadow-md"
      : "border hover:border-wabil-400 hover:bg-wabil-50 dark:hover:bg-wabil-950"
  }`;
}

export function VerseCard({ verse, surahName }: { verse: Verse; surahName: string }) {
  const [tab, setTab] = useState<Tab | null>(null);
  const [mounted, setMounted] = useState(false);

  const addCard = useHifzStore((s) => s.addCard);
  const removeCard = useHifzStore((s) => s.removeCard);
  const inHifz = useHifzStore((s) => Boolean(s.cards[verse.verseKey]));
  const openChat = useChatStore((s) => s.openWith);
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

  function selectTab(id: Tab) {
    setTab((cur) => (cur === id ? null : id));
  }

  return (
    <article className="card animate-fade-up p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-wabil-100 px-2 text-xs font-semibold text-wabil-800 dark:bg-wabil-950 dark:text-wabil-200">
          {verse.verseKey}
        </span>
        <AudioPlayer src={verse.audioUrl} />
      </div>

      <div className="mb-4 space-y-3">
        <TajweedText html={verse.textTajweed} plainText={verse.textUthmani} showLegend={false} />
        <TranslationBlock verse={verse} />
      </div>

      {/* Single action row */}
      <div
        className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="toolbar"
        aria-label="Ayah actions"
      >
        <button
          type="button"
          onClick={toggleHifz}
          className={
            mounted && inHifz
              ? "btn shrink-0 bg-wabil-100 text-wabil-800 dark:bg-wabil-950 dark:text-wabil-200"
              : "btn-primary shrink-0 !px-3 !py-1.5 text-sm"
          }
          suppressHydrationWarning
        >
          {mounted && inHifz ? "In Hifz ✓" : "Add to Hifz"}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === "words"}
          onClick={() => selectTab("words")}
          className={actionClass(tab === "words")}
          style={tab === "words" ? undefined : { borderColor: "rgb(var(--border))" }}
        >
          Word by word
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === "tafheem"}
          onClick={() => selectTab("tafheem")}
          className={actionClass(tab === "tafheem")}
          style={tab === "tafheem" ? undefined : { borderColor: "rgb(var(--border))" }}
        >
          Tafheem
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === "tafseer"}
          onClick={() => selectTab("tafseer")}
          className={actionClass(tab === "tafseer")}
          style={tab === "tafseer" ? undefined : { borderColor: "rgb(var(--border))" }}
        >
          Tafseer (Urdu + English)
        </button>

        <button type="button" onClick={askAi} className="btn-ghost shrink-0 !px-3 !py-1.5 text-sm">
          Ask AI
        </button>
      </div>

      {tab && (
        <div key={tab} className="mt-4 animate-fade-up pt-1">
          {tab === "words" && <WordByWord words={verse.words} />}
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
    </article>
  );
}
