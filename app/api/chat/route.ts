import { NextResponse } from "next/server";

/**
 * AI assistant proxy. Uses Google Gemini's free tier.
 * Set GEMINI_API_KEY (from https://aistudio.google.com/apikey) as an env var.
 * With no key, the endpoint responds gracefully so the app still works.
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

const SYSTEM_PROMPT = `You are Itqan, a knowledgeable and humble AI assistant for a Quran learning and memorization app. Your users are often Urdu-speaking Muslims in Pakistan.

Guidelines you MUST follow:
- Ground answers in authentic Islamic scholarship (Quran, authentic Hadith, and recognized Tafseer such as Ibn Kathir, Tafsir al-Tabari, Ma'ariful Quran).
- ALWAYS clearly distinguish the literal text/translation of the Quran from your own explanatory commentary. Label commentary as commentary.
- When scholars hold multiple valid opinions, present them fairly and note the difference rather than asserting one as definitive.
- If you are unsure or a matter requires a qualified scholar (mufti), say so and encourage consulting one. Never fabricate references, ayah numbers, or Hadith.
- Be encouraging and supportive of the learner's memorization (Hifz) journey.
- Respond in the language the user writes in. If they write in Urdu or Roman Urdu, reply in that style. Keep explanations clear and simple.
- Keep responses reasonably concise unless asked for detail.`;

function buildContextBlock(ctx?: AyahContext): string {
  if (!ctx) return "";
  const parts = [
    `The learner is currently viewing Surah ${ctx.surahName}, ayah ${ctx.verseKey}.`,
    `Arabic: ${ctx.arabic}`,
  ];
  if (ctx.english) parts.push(`English translation: ${ctx.english}`);
  if (ctx.urdu) parts.push(`Urdu translation: ${ctx.urdu}`);
  return parts.join("\n");
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

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

  if (!apiKey) {
    return NextResponse.json({
      disabled: true,
      reply:
        "The AI assistant is not configured yet. Add a free GEMINI_API_KEY (from Google AI Studio) to enable it. Everything else in the app works without it.",
    });
  }

  const preferred = process.env.GEMINI_MODEL;
  const freeModels = preferred
    ? [preferred, "gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest"]
    : ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest"];
  const contextBlock = buildContextBlock(body.context);

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const systemInstruction = {
    parts: [
      { text: SYSTEM_PROMPT + (contextBlock ? `\n\nContext:\n${contextBlock}` : "") },
    ],
  };

  let lastError = "All free models failed";
  for (const model of freeModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: systemInstruction,
            contents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
          }),
        },
      );

      if (!res.ok) {
        const detail = await res.text();
        lastError = `Provider error (${res.status}): ${detail.slice(0, 200)}`;
        if (res.status === 404) continue; // try next free model
        return NextResponse.json({ error: lastError }, { status: 502 });
      }

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? "")
          .join("")
          .trim() || "I could not generate a response. Please try again.";

      return NextResponse.json({ reply, model });
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Unknown error";
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 });
}
