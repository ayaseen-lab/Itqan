/**
 * Client-side Tajweed annotator. The Quran.com API field `text_uthmani_tajweed`
 * is spaced plain text (not HTML), so we analyse clean Uthmani locally and wrap
 * letters in coloured spans matching globals.css rules.
 */

const QALQALAH = new Set(["\u0642", "\u0637", "\u0628", "\u062C", "\u062F"]); // ق ط ب ج د
const GHUNNAH_LETTERS = new Set(["\u0646", "\u0645"]); // ن م
const IKHFA_AFTER = new Set([
  "\u062A", "\u062B", "\u062C", "\u062D", "\u062E", "\u0632", "\u0633", "\u0634",
  "\u0635", "\u0636", "\u0637", "\u0638", "\u0641", "\u0642", "\u0643",
]);
const IDGHAM_GHUNNAH = new Set([
  "\u064A", "\u0646", "\u0645", "\u0648", "\u0644", "\u0631",
]);
const IDGHAM_NO_GHUNNAH = new Set(["\u0644", "\u0631"]);
const IQLAB = "\u0628";

const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]/g;
const SHADDA = "\u0651";
const SUKUN = "\u0652";
const MADDA = "\u0653";
const SUPERSCRIPT_ALEF = "\u0670";
const TANWEEN = ["\u064B", "\u064C", "\u064D"];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(cls: string, text: string): string {
  return `<span class="${cls}">${esc(text)}</span>`;
}

function baseLetter(ch: string): string {
  return ch.replace(DIACRITICS, "");
}

function hasShadda(cluster: string): boolean {
  return cluster.includes(SHADDA);
}

function hasSukun(cluster: string): boolean {
  return cluster.includes(SUKUN);
}

function hasMadd(cluster: string): boolean {
  if (cluster.includes(MADDA) || cluster.includes(SUPERSCRIPT_ALEF)) return true;
  if (/\u064F\u0648[\u0652\u0651]?/.test(cluster)) return true;
  if (/\u0650\u064A[\u0652\u0651]?/.test(cluster)) return true;
  if (/\u064E[\u0627\u0670]/.test(cluster)) return true;
  return false;
}

function maddClass(cluster: string): string {
  if (cluster.includes(MADDA)) return "madda_necessary";
  if (cluster.includes(SUPERSCRIPT_ALEF)) return "madda_normal";
  return "madda_permissible";
}

function endsWithNoonOrTanween(cluster: string): boolean {
  const letter = baseLetter(cluster);
  return (
    (letter === "\u0646" && hasSukun(cluster)) ||
    TANWEEN.some((t) => cluster.includes(t))
  );
}

/** Split an Arabic word into letter+diacritic clusters. */
function clusters(word: string): string[] {
  const out: string[] = [];
  let cur = "";
  for (const ch of word) {
    if (DIACRITICS.test(ch) && cur) {
      cur += ch;
      DIACRITICS.lastIndex = 0;
    } else {
      if (cur) out.push(cur);
      cur = ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}

function classifyCluster(
  cluster: string,
  next: string | null,
  isLastInWord: boolean,
): string | null {
  const letter = baseLetter(cluster);
  if (!letter) return null;

  // Silent hamza al-wasl / laam shamsiyah heuristics
  if (letter === "\u0627" && hasSukun(cluster)) return "slnt";
  if (letter === "\u0644" && next && "\u0627\u0623\u0625\u0622".includes(baseLetter(next))) {
    return "laam_shamsiyah";
  }

  // Ghunnah and Qalqalah before Madd so shadda/sukun take priority
  if (GHUNNAH_LETTERS.has(letter) && hasShadda(cluster)) return "ghunnah";
  if (QALQALAH.has(letter) && hasSukun(cluster)) return "qalqalah";

  if (hasMadd(cluster)) return maddClass(cluster);

  // Noon sakinah / tanween rules — only on the last letter of a word
  if (isLastInWord && endsWithNoonOrTanween(cluster) && next) {
    const nxt = baseLetter(next);
    if (nxt === IQLAB) return "iqlab";
    if (IKHFA_AFTER.has(nxt)) return "ikhafa";
    if (IDGHAM_GHUNNAH.has(nxt)) {
      return IDGHAM_NO_GHUNNAH.has(nxt) ? "idgham_wo_ghunnah" : "idgham_ghunnah";
    }
  }

  return null;
}

function annotateWord(word: string, nextWordFirst: string | null): string {
  const parts = clusters(word);
  if (parts.length === 0) return esc(word);

  let html = "";
  for (let i = 0; i < parts.length; i++) {
    const isLastInWord = i === parts.length - 1;
    const next = isLastInWord ? nextWordFirst : parts[i + 1];
    const cls = classifyCluster(parts[i], next, isLastInWord);
    html += cls ? wrap(cls, parts[i]) : esc(parts[i]);
  }
  return html;
}

/** Convert API `<tajweed class=ham_wasl>` tags to styled `<span>` elements. */
export function normalizeTajweedHtml(html: string): string {
  return html
    .replace(/<tajweed\s+class=(?:"([^"]+)"|'([^']+)'|([^\s>]+))>/gi, '<span class="$1$2$3">')
    .replace(/<\/tajweed>/gi, "</span>");
}

/** Returns HTML with tajweed colour classes for display. */
export function annotateTajweed(uthmani: string): string {
  if (!uthmani?.trim()) return "";

  if (hasTajweedMarkup(uthmani)) {
    return normalizeTajweedHtml(uthmani);
  }

  const words = uthmani.split(/\s+/).filter(Boolean);
  return words
    .map((w, i) => {
      const nextFirst = i < words.length - 1 ? clusters(words[i + 1])[0] ?? null : null;
      return annotateWord(w, nextFirst);
    })
    .join(" ");
}

export function hasTajweedMarkup(html: string | null): boolean {
  if (!html) return false;
  return (
    /<tajweed\b/i.test(html) ||
    /<span\s+class=(?:"|')?(ghunnah|qalqalah|ikhafa|idgham|iqlab|madda|ham_wasl|laam_shamsiyah|slnt)/i.test(
      html,
    )
  );
}

/** Shared legend data — colours match CSS variables in globals.css */
export const TAJWEED_LEGEND: { label: string; cssVar: string; rule: string }[] = [
  { label: "Ghunnah", cssVar: "--tj-ghunnah", rule: "Nasalization (2 counts)" },
  { label: "Qalqalah", cssVar: "--tj-qalqalah", rule: "Echoing/bouncing sound" },
  { label: "Ikhfa", cssVar: "--tj-ikhfa", rule: "Hidden noon/tanween" },
  { label: "Idgham", cssVar: "--tj-idgham", rule: "Merging letters" },
  { label: "Iqlab", cssVar: "--tj-iqlab", rule: "Noon becomes meem" },
  { label: "Madd", cssVar: "--tj-madd", rule: "Prolongation" },
  { label: "Silent", cssVar: "--tj-silent", rule: "Not pronounced" },
];
