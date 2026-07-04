/** Shared TTS chunking — keep client + server in sync. */

const MAX_CHUNK = 160;

function hardSplit(text: string, maxLen: number): string[] {
  const out: string[] = [];
  let rest = text.trim();
  while (rest.length > maxLen) {
    let cut = rest.lastIndexOf(" ", maxLen);
    if (cut < maxLen * 0.4) cut = maxLen;
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out;
}

export function chunkTextForTts(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  if (cleaned.length <= MAX_CHUNK) return [cleaned];

  const parts = cleaned.split(/(?<=[.!?۔؟])\s+/);
  const chunks: string[] = [];
  let buf = "";

  const flushBuf = () => {
    if (!buf) return;
    if (buf.length <= MAX_CHUNK) {
      chunks.push(buf);
    } else {
      chunks.push(...hardSplit(buf, MAX_CHUNK));
    }
    buf = "";
  };

  for (const part of parts) {
    if (part.length > MAX_CHUNK) {
      flushBuf();
      chunks.push(...hardSplit(part, MAX_CHUNK));
      continue;
    }
    const next = buf ? `${buf} ${part}` : part;
    if (next.length > MAX_CHUNK && buf) {
      flushBuf();
      buf = part;
    } else {
      buf = next;
    }
  }
  flushBuf();

  return chunks.length ? chunks : hardSplit(cleaned, MAX_CHUNK);
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
    t = t.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, " ");
    t = t.replace(/\b\d{4,}\b/g, " ");
    t = t.replace(/\s+/g, " ").trim();
  }

  return t;
}
