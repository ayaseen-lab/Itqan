import { NextResponse } from "next/server";
import { answerFromKnowledge } from "@/lib/wabilhudaKnowledge";

/**
 * WabilHuda AI assistant — no Gemini required.
 * 1. Built-in knowledge engine (always free, works offline)
 * 2. Optional Groq API (free tier, llama models) if GROQ_API_KEY is set
 */

export const runtime = "edge";

interface AyahContext {
  verseKey: string;
  surahName: string;
  arabic: string;
  english?: string | null;
  urdu?: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM = `You are WabilHuda, a humble Quran learning assistant for Urdu-speaking Muslims.
- Ground answers in Quran, authentic Hadith, and recognized Tafseer.
- Distinguish Quranic text from your commentary. Label commentary clearly.
- Be encouraging about Hifz. Keep answers concise and practical.
- Respond in the user's language (English, Urdu, or Roman Urdu).`;

function buildContext(ctx?: AyahContext): string {
  if (!ctx) return "";
  return [
    `Learner is viewing Surah ${ctx.surahName}, ayah ${ctx.verseKey}.`,
    `Arabic: ${ctx.arabic}`,
    ctx.english && `English: ${ctx.english}`,
    ctx.urdu && `Urdu: ${ctx.urdu}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function askGroq(
  messages: ChatMessage[],
  context?: AyahContext,
): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const systemContent = SYSTEM + (context ? `\n\nContext:\n${buildContext(context)}` : "");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; context?: AyahContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUser?.content ?? "";

  // 1. Built-in knowledge engine (instant, free, no key)
  const local = answerFromKnowledge(query, body.context);
  if (local) {
    return NextResponse.json({ reply: local, source: "wabilhuda-knowledge" });
  }

  // 2. Optional Groq (free cloud LLM)
  try {
    const groq = await askGroq(messages, body.context);
    if (groq) {
      return NextResponse.json({ reply: groq, source: "groq" });
    }
  } catch {
    // fall through
  }

  // 3. Graceful fallback
  return NextResponse.json({
    reply:
      "I'm WabilHuda's built-in assistant. I can help with:\n\n" +
      "• **Tajweed rules** and pronunciation tips\n" +
      "• **Hifz/memorisation** techniques\n" +
      "• **Surah virtues** (Al-Fatihah, Al-Ikhlas, Ayat al-Kursi…)\n" +
      "• **How to use** WabilHuda features\n\n" +
      "Try asking: *\"Give me a tip to memorize faster\"* or *\"Explain tajweed colours\"*\n\n" +
      "For advanced AI answers, add a free **GROQ_API_KEY** in `.env.local` (get one at console.groq.com).",
    source: "fallback",
  });
}
