/**
 * Arabic text normalization and word-level alignment.
 *
 * Used to compare a learner's recitation transcript against the reference
 * ayah text and produce an approximate accuracy score. This is a text-level
 * aid, not a tajweed/makharij analysis.
 */

// Arabic diacritics (harakat, tanwin, shadda, sukun, superscript alef, etc.)
const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]/g;
const TATWEEL = /\u0640/g; // kashida

/**
 * Normalize an Arabic word: strip diacritics, tatweel, punctuation and unify
 * letter variants (alef forms, ya/alef-maqsura, ta-marbuta/ha, hamza forms).
 */
export function normalizeArabic(input: string): string {
  return input
    .replace(DIACRITICS, "")
    .replace(TATWEEL, "")
    // Unify alef variants
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    // Alef maqsura -> ya
    .replace(/\u0649/g, "\u064A")
    // Ta marbuta -> ha
    .replace(/\u0629/g, "\u0647")
    // Standalone hamza / hamza-on-waw / hamza-on-ya -> drop the carrier
    .replace(/[\u0624\u0626]/g, "")
    .replace(/\u0621/g, "")
    // Remove any remaining non-Arabic-letter characters
    .replace(/[^\u0600-\u06FF]/g, "")
    .trim();
}

export function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map((w) => normalizeArabic(w))
    .filter((w) => w.length > 0);
}

export type AlignmentStatus = "correct" | "missing" | "wrong";

export interface AlignedToken {
  /** The reference (expected) word, normalized. Null for extra spoken words. */
  expected: string | null;
  /** The spoken word that matched/replaced it, if any. */
  spoken: string | null;
  status: AlignmentStatus;
}

export interface RecitationResult {
  accuracy: number; // 0-100
  correct: number;
  total: number;
  tokens: AlignedToken[]; // aligned against the reference, in reference order
  extraWords: string[]; // spoken words with no place in the reference
}

/**
 * Compute a word-level alignment between the expected ayah tokens and the
 * spoken tokens using a Needleman-Wunsch style edit distance. Returns an
 * accuracy percentage and a per-word breakdown for highlighting.
 */
export function scoreRecitation(
  expectedText: string,
  spokenText: string,
): RecitationResult {
  const expected = tokenize(expectedText);
  const spoken = tokenize(spokenText);

  const n = expected.length;
  const m = spoken.length;

  // dp[i][j] = min edits to align expected[0..i) with spoken[0..j)
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = expected[i - 1] === spoken[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion (missing word)
        dp[i][j - 1] + 1, // insertion (extra word)
        dp[i - 1][j - 1] + cost, // match / substitution
      );
    }
  }

  // Backtrack to build the alignment.
  const tokens: AlignedToken[] = [];
  const extraWords: string[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const cost = expected[i - 1] === spoken[j - 1] ? 0 : 1;
      if (dp[i][j] === dp[i - 1][j - 1] + cost) {
        tokens.push({
          expected: expected[i - 1],
          spoken: spoken[j - 1],
          status: cost === 0 ? "correct" : "wrong",
        });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      tokens.push({ expected: expected[i - 1], spoken: null, status: "missing" });
      i--;
      continue;
    }
    // insertion: spoken word with no expected match
    extraWords.push(spoken[j - 1]);
    j--;
  }

  tokens.reverse();
  extraWords.reverse();

  const correct = tokens.filter((t) => t.status === "correct").length;
  const total = n || 1;
  const accuracy = Math.round((correct / total) * 100);

  return { accuracy, correct, total: n, tokens, extraWords };
}
