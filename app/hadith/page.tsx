"use client";

import { useEffect, useState } from "react";
import { getDailyHadith, HADITH_COLLECTION, type Hadith } from "@/lib/hadith";
import { isTtsSupported, speak, stopSpeaking } from "@/lib/tts";

export default function HadithPage() {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState<"urdu" | "english">("urdu");

  useEffect(() => {
    setHadith(getDailyHadith());
    return () => stopSpeaking();
  }, []);

  if (!hadith) return null;

  function listen() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const text = lang === "urdu" ? hadith!.urdu : hadith!.english;
    const handle = speak(text, {
      lang: lang === "urdu" ? "ur-PK" : "en-US",
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
    if (handle) setSpeaking(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="chip">Daily Hadith</span>
        <h1 className="mt-2 text-2xl font-bold">Hadith of the Day</h1>
        <p className="muted text-sm">
          {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <article className="card relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 blur-2xl"
          style={{ background: "radial-gradient(circle, #1fa16b, transparent)" }}
          aria-hidden="true"
        />
        <p className="quran-text text-right text-3xl leading-loose" dir="rtl">
          {hadith.arabic}
        </p>
        <div className="mt-6 space-y-4 border-t pt-6" style={{ borderColor: "rgb(var(--border))" }}>
          <div>
            <span className="chip mb-2">Urdu</span>
            <p className="urdu-text text-xl leading-relaxed" dir="rtl">
              {hadith.urdu}
            </p>
          </div>
          <div>
            <span className="chip mb-2">English</span>
            <p className="text-base leading-relaxed">{hadith.english}</p>
          </div>
        </div>
        <div className="muted mt-6 flex flex-wrap items-center gap-3 border-t pt-4 text-sm" style={{ borderColor: "rgb(var(--border))" }}>
          <span>Source: {hadith.source}</span>
          {hadith.narrator && <span>Narrator: {hadith.narrator}</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="inline-flex rounded-xl border p-0.5" style={{ borderColor: "rgb(var(--border))" }}>
            <button
              type="button"
              onClick={() => setLang("urdu")}
              className={`rounded-lg px-3 py-1 text-sm ${lang === "urdu" ? "bg-itqan-600 text-white" : ""}`}
            >
              Urdu
            </button>
            <button
              type="button"
              onClick={() => setLang("english")}
              className={`rounded-lg px-3 py-1 text-sm ${lang === "english" ? "bg-itqan-600 text-white" : ""}`}
            >
              English
            </button>
          </div>
          {isTtsSupported() && (
            <button type="button" onClick={listen} className="btn-ghost text-sm">
              {speaking ? "Stop" : `Listen (${lang === "urdu" ? "Urdu" : "EN"})`}
            </button>
          )}
        </div>
      </article>

      <section>
        <h2 className="mb-3 text-lg font-semibold">More Hadith ({HADITH_COLLECTION.length} in rotation)</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {HADITH_COLLECTION.slice(0, 6).map((h) => (
            <div key={h.id} className="card p-4">
              <p className="quran-text text-right text-lg" dir="rtl">
                {h.arabic.slice(0, 60)}…
              </p>
              <p className="muted mt-2 text-xs">{h.source}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
