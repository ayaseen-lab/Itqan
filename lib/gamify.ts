/**
 * Gamification: XP, levels, daily streaks, and badges.
 * Pure helpers — all state lives in the Hifz store.
 */

import type { Rating } from "./srs";

export const XP_PER_RATING: Record<Rating, number> = {
  again: 2,
  hard: 4,
  good: 6,
  easy: 8,
};

export const XP_PER_NEW_VERSE = 10;
const XP_PER_LEVEL = 100;

export interface LevelInfo {
  level: number;
  intoLevel: number; // XP earned within the current level
  needed: number; // XP needed per level
  progress: number; // 0-1 toward next level
}

export function levelFromXp(xp: number): LevelInfo {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;
  return {
    level,
    intoLevel,
    needed: XP_PER_LEVEL,
    progress: intoLevel / XP_PER_LEVEL,
  };
}

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(ts = Date.now()): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isYesterday(prev: string, todayTs = Date.now()): boolean {
  const yesterday = new Date(todayTs);
  yesterday.setDate(yesterday.getDate() - 1);
  return prev === dayKey(yesterday.getTime());
}

/** Given the last active day, return the new streak count for activity today. */
export function nextStreak(
  lastActiveDay: string | null,
  current: number,
  todayTs = Date.now(),
): number {
  const today = dayKey(todayTs);
  if (lastActiveDay === today) return current || 1;
  if (lastActiveDay && isYesterday(lastActiveDay, todayTs)) return current + 1;
  return 1;
}

export type BadgeTier = "bronze" | "silver" | "gold";

export interface BadgeSnapshot {
  xp: number;
  totalReviews: number;
  streakLongest: number;
  versesAdded: number;
  matureCount: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  tier: BadgeTier;
  earned: (s: BadgeSnapshot) => boolean;
}

export const BADGES: Badge[] = [
  { id: "first_verse", title: "First Step", description: "Add your first verse to Hifz", tier: "bronze", earned: (s) => s.versesAdded >= 1 },
  { id: "collector_10", title: "Collector", description: "Add 10 verses to Hifz", tier: "silver", earned: (s) => s.versesAdded >= 10 },
  { id: "collector_50", title: "Curator", description: "Add 50 verses to Hifz", tier: "gold", earned: (s) => s.versesAdded >= 50 },
  { id: "reviews_10", title: "Getting Started", description: "Complete 10 reviews", tier: "bronze", earned: (s) => s.totalReviews >= 10 },
  { id: "reviews_100", title: "Diligent", description: "Complete 100 reviews", tier: "gold", earned: (s) => s.totalReviews >= 100 },
  { id: "streak_3", title: "Consistent", description: "Reach a 3-day streak", tier: "bronze", earned: (s) => s.streakLongest >= 3 },
  { id: "streak_7", title: "Week Warrior", description: "Reach a 7-day streak", tier: "silver", earned: (s) => s.streakLongest >= 7 },
  { id: "streak_30", title: "Steadfast", description: "Reach a 30-day streak", tier: "gold", earned: (s) => s.streakLongest >= 30 },
  { id: "xp_100", title: "Rising", description: "Earn 100 XP", tier: "bronze", earned: (s) => s.xp >= 100 },
  { id: "xp_1000", title: "Devoted", description: "Earn 1000 XP", tier: "gold", earned: (s) => s.xp >= 1000 },
  { id: "mature_5", title: "Memorizer", description: "5 verses reach maturity", tier: "silver", earned: (s) => s.matureCount >= 5 },
];

export const TIER_COLORS: Record<BadgeTier, string> = {
  bronze: "#b45309",
  silver: "#94a3b8",
  gold: "#eab308",
};

/** Return the ids of all badges earned for a snapshot. */
export function earnedBadgeIds(snapshot: BadgeSnapshot): string[] {
  return BADGES.filter((b) => b.earned(snapshot)).map((b) => b.id);
}
