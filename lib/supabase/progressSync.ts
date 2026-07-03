"use client";

import { createClient, isSupabaseConfigured } from "./client";
import { isSchemaMissingError } from "./errors";
import { useProgressStore, sumTodayByType } from "@/lib/progressStore";
import { useHifzStore } from "@/lib/store";

/** Push today's local activity into Supabase progress_daily for competitions & family views. */
export async function syncMyProgressToday(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const progress = useProgressStore.getState();
    const gami = useHifzStore.getState().gami;
    const day = new Date().toISOString().slice(0, 10);

    const verses_read =
      sumTodayByType(progress.logsByDay, "reading") +
      sumTodayByType(progress.logsByDay, "translation") +
      sumTodayByType(progress.logsByDay, "tafseer");
    const hifz_reviews =
      sumTodayByType(progress.logsByDay, "hifz_review") +
      sumTodayByType(progress.logsByDay, "hifz_new");
    const tasbih_count = sumTodayByType(progress.logsByDay, "tasbih");
    const tests_completed = sumTodayByType(progress.logsByDay, ["hifz_review", "hifz_new"]);

    const { data: existing, error: lookupErr } = await supabase
      .from("progress_daily")
      .select("id")
      .eq("user_id", user.id)
      .eq("day", day)
      .maybeSingle();

    if (lookupErr) {
      if (isSchemaMissingError(lookupErr)) return;
      return;
    }

    const payload = {
      user_id: user.id,
      day,
      verses_read,
      hifz_reviews,
      tests_completed,
      tasbih_count,
      xp: gami.xp,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from("progress_daily").update(payload).eq("id", (existing as { id: string }).id);
    } else {
      await supabase.from("progress_daily").insert(payload);
    }
  } catch {
    /* ignore offline / missing schema */
  }
}
