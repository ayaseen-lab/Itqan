"use client";

import type { RecitationResult } from "@/lib/arabic";
import type { Word } from "@/lib/quran";

function ring(accuracy: number): string {
  if (accuracy >= 90) return "text-itqan-600";
  if (accuracy >= 70) return "text-amber-500";
  return "text-red-500";
}

function feedback(accuracy: number): string {
  if (accuracy >= 95) return "Excellent, ma sha Allah! Nearly perfect.";
  if (accuracy >= 80) return "Very good — a few words to polish.";
  if (accuracy >= 50) return "Good effort. Review the highlighted words and try again.";
  return "Keep practicing. Listen to the recitation, then repeat slowly.";
}

export function ScoreCard({
  result,
  words,
}: {
  result: RecitationResult;
  words?: Word[];
}) {
  const { accuracy, correct, total, tokens, extraWords } = result;

  function playWord(index: number) {
    const url = words?.[index]?.audioUrl;
    if (!url) return;
    void new Audio(url).play();
  }

  // Track which reference word each aligned token refers to (tokens with a
  // non-null `expected` advance the reference index).
  let expectedIndex = -1;

  return (
    <div className="card mt-3 space-y-3 p-4">
      <div className="flex items-center gap-4">
        <div className={`text-3xl font-bold ${ring(accuracy)}`}>{accuracy}%</div>
        <div>
          <div className="text-sm font-medium">{feedback(accuracy)}</div>
          <div className="muted text-xs">
            {correct} of {total} words matched
            {extraWords.length > 0 && ` · ${extraWords.length} extra word(s)`}
          </div>
        </div>
      </div>

      <div className="flex flex-row-reverse flex-wrap justify-start gap-1" dir="rtl">
        {tokens.map((t, i) => {
          if (t.expected !== null) expectedIndex += 1;
          const idx = expectedIndex;
          const base = "quran-text rounded px-1 text-xl";

          if (t.status === "correct") {
            return (
              <span key={i} className={`${base} text-itqan-600`}>
                {t.expected}
              </span>
            );
          }

          const canPlay = Boolean(words?.[idx]?.audioUrl);
          const cls =
            t.status === "missing"
              ? "bg-red-500/10 text-red-500 line-through"
              : "bg-amber-500/10 text-amber-600";
          const title =
            t.status === "missing"
              ? "Missing / not recited — tap to hear it"
              : t.spoken
                ? `You said: ${t.spoken} — tap to hear the correct word`
                : "Mispronounced — tap to hear it";

          return (
            <button
              key={i}
              type="button"
              onClick={() => canPlay && playWord(idx)}
              className={`${base} ${cls} ${canPlay ? "cursor-pointer underline decoration-dotted" : ""}`}
              title={title}
            >
              {t.expected}
            </button>
          );
        })}
      </div>

      <div className="muted flex flex-wrap gap-3 text-xs">
        <span><span className="text-itqan-600">&#9679;</span> correct</span>
        <span><span className="text-amber-600">&#9679;</span> mispronounced</span>
        <span><span className="text-red-500">&#9679;</span> missed</span>
        {words?.some((w) => w.audioUrl) && <span>· tap a highlighted word to hear it</span>}
      </div>

      <p className="muted text-xs">
        This is an approximate, text-level check based on speech recognition — a study aid, not a
        formal tajweed assessment.
      </p>
    </div>
  );
}
