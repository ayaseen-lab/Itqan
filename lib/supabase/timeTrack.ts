"use client";

import { createClient, isSupabaseConfigured } from "./client";
import { isSchemaMissingError } from "./errors";

/** Flush active seconds to Supabase for parent monitoring. */
export async function addActiveSeconds(secs: number): Promise<void> {
  if (!isSupabaseConfigured() || secs <= 0) return;
  try {
    const supabase = createClient();
    const { error } = await supabase.rpc("add_active_seconds", { secs: Math.round(secs) });
    if (error && !isSchemaMissingError(error)) {
      /* ignore transient errors */
    }
  } catch {
    /* ignore */
  }
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m} min`;
  return `${s}s`;
}
