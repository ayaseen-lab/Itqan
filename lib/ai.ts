/**
 * Client-side helper for the AI assistant. It talks to our own
 * /api/chat serverless route, which proxies to a free LLM provider.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AyahContext {
  verseKey: string;
  surahName: string;
  arabic: string;
  english?: string | null;
  urdu?: string | null;
}

export interface ChatResponse {
  reply: string;
  disabled?: boolean; // true when no provider key is configured
}

export async function sendChat(
  messages: ChatMessage[],
  context?: AyahContext,
): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });

  const data = (await res.json()) as ChatResponse & { error?: string };
  if (!res.ok && !data.disabled) {
    throw new Error(data.error || `Chat request failed (${res.status})`);
  }
  return data;
}
