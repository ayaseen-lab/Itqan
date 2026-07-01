/**
 * A lightweight spaced-repetition engine based on the SM-2 algorithm
 * (as used by Anki/SuperMemo), adapted for Quran memorization cards.
 *
 * Each card tracks an ease factor, the current interval (in days),
 * the repetition count, and when it is next due.
 */

export type Rating = "again" | "hard" | "good" | "easy";

export interface HifzCard {
  verseKey: string; // "2:255"
  chapterId: number;
  verseNumber: number;
  textUthmani: string;
  // SM-2 state
  easeFactor: number; // >= 1.3
  intervalDays: number;
  repetitions: number;
  dueAt: number; // epoch ms
  createdAt: number;
  lastReviewedAt: number | null;
  lapses: number;
}

const MIN_EASE = 1.3;
const DAY_MS = 24 * 60 * 60 * 1000;

const RATING_QUALITY: Record<Rating, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

export function createCard(input: {
  verseKey: string;
  chapterId: number;
  verseNumber: number;
  textUthmani: string;
}): HifzCard {
  const now = Date.now();
  return {
    ...input,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: now, // new cards are due immediately
    createdAt: now,
    lastReviewedAt: null,
    lapses: 0,
  };
}

/**
 * Apply a review rating to a card and return the updated card.
 * Pure function: does not mutate the input.
 */
export function reviewCard(card: HifzCard, rating: Rating, now = Date.now()): HifzCard {
  const quality = RATING_QUALITY[rating];
  let { easeFactor, intervalDays, repetitions, lapses } = card;

  if (quality < 3) {
    // Failed recall: reset progress, review again soon.
    repetitions = 0;
    intervalDays = 0;
    lapses += 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    if (rating === "hard") {
      intervalDays = Math.max(1, Math.round(intervalDays * 0.7));
    }
  }

  // Update ease factor per SM-2.
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE;

  // "again" comes back in ~10 minutes within the same session.
  const dueAt =
    quality < 3 ? now + 10 * 60 * 1000 : now + intervalDays * DAY_MS;

  return {
    ...card,
    easeFactor,
    intervalDays,
    repetitions,
    lapses,
    dueAt,
    lastReviewedAt: now,
  };
}

export function isDue(card: HifzCard, now = Date.now()): boolean {
  return card.dueAt <= now;
}

export function dueCards(cards: HifzCard[], now = Date.now()): HifzCard[] {
  return cards
    .filter((c) => isDue(c, now))
    .sort((a, b) => a.dueAt - b.dueAt);
}

/** Human-friendly description of when a card is next due. */
export function formatDue(card: HifzCard, now = Date.now()): string {
  const diff = card.dueAt - now;
  if (diff <= 0) return "due now";
  const days = Math.round(diff / DAY_MS);
  if (days >= 1) return `in ${days} day${days === 1 ? "" : "s"}`;
  const hours = Math.round(diff / (60 * 60 * 1000));
  if (hours >= 1) return `in ${hours} hour${hours === 1 ? "" : "s"}`;
  const mins = Math.max(1, Math.round(diff / (60 * 1000)));
  return `in ${mins} min`;
}

export interface HifzStats {
  total: number;
  due: number;
  learning: number; // repetitions < 2
  mature: number; // intervalDays >= 21
}

export function computeStats(cards: HifzCard[], now = Date.now()): HifzStats {
  return {
    total: cards.length,
    due: cards.filter((c) => isDue(c, now)).length,
    learning: cards.filter((c) => c.repetitions < 2).length,
    mature: cards.filter((c) => c.intervalDays >= 21).length,
  };
}
