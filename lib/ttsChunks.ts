/** Shared TTS chunking — keep client + server in sync. */

const MAX_CHUNK = 180;

export function chunkTextForTts(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  if (cleaned.length <= MAX_CHUNK) return [cleaned];

  const parts = cleaned.split(/(?<=[.!?۔؟])\s+/);
  const chunks: string[] = [];
  let buf = "";
  for (const part of parts) {
    const next = buf ? `${buf} ${part}` : part;
    if (next.length > MAX_CHUNK && buf) {
      chunks.push(buf);
      buf = part;
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);
  return chunks.length ? chunks : [cleaned.slice(0, MAX_CHUNK)];
}

export function plainFromHtml(html: string, lang: "ur" | "en" = "en"): string {
  let t = html
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/h[1-6]>/gi, ". ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (lang === "en") {
    // Arabic script confuses English voices; long digit runs are footnote/db ids.
    t = t.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, " ");
    t = t.replace(/\b\d{4,}\b/g, " ");
    t = t.replace(/\s+/g, " ").trim();
  }

  return t;
}
