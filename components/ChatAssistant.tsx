"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/lib/chatStore";
import { sendChat } from "@/lib/ai";

const SUGGESTIONS = [
  "Give me a tip to memorize faster",
  "Explain the meaning of Ayat al-Kursi",
  "What is the virtue of Surah Al-Ikhlas?",
];

export function ChatAssistant() {
  const { open, setOpen, context, messages, pushMessage, replaceLast } = useChatStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastSentRef = useRef(0);

  // Auto-send when a verse card opens the chat with a seeded user prompt.
  useEffect(() => {
    if (!open) return;
    const last = messages[messages.length - 1];
    if (last && last.role === "user" && messages.length > lastSentRef.current) {
      void run(messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function run(history: typeof messages) {
    lastSentRef.current = history.length;
    setLoading(true);
    pushMessage({ role: "assistant", content: "" });
    try {
      const res = await sendChat(history, context ?? undefined);
      replaceLast(res.reply);
    } catch (e) {
      replaceLast(e instanceof Error ? `Sorry, something went wrong: ${e.message}` : "Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    pushMessage({ role: "user", content: trimmed });
    setInput("");
    void run(next);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3 z-40 grid h-12 w-12 place-items-center rounded-full bg-wabil-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14 lg:bottom-5 lg:right-5"
        aria-label="Open AI assistant"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-x-3 bottom-[calc(8.5rem+env(safe-area-inset-bottom))] z-40 flex h-[min(70vh,520px)] max-h-[560px] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[calc(100vw-2.5rem)] sm:max-w-sm lg:bottom-24 lg:right-5"
          style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--card))" }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "rgb(var(--border))" }}>
            <div>
              <p className="font-semibold">WabilHuda Assistant</p>
              {context && <p className="muted text-xs">Discussing ayah {context.verseKey}</p>}
            </div>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost h-8 w-8 !px-0" aria-label="Close assistant">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="muted text-sm">
                  Ask about Tajweed, Hifz tips, Surah virtues, or ayah meanings. Powered by WabilHuda&apos;s
                  built-in knowledge — no API key needed.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => submit(s)} className="btn-ghost justify-start text-left text-sm">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-wabil-600 text-white" : "border"}`} style={m.role === "assistant" ? { borderColor: "rgb(var(--border))" } : undefined}>
                  {m.content || (loading && i === messages.length - 1 ? "Thinking..." : "")}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-center gap-2 border-t p-3"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the Quran..."
              className="flex-1 rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-wabil-500"
              style={{ borderColor: "rgb(var(--border))" }}
              aria-label="Message"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary h-9 w-9 !px-0" aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
