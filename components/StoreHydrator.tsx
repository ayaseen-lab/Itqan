"use client";

import { useEffect } from "react";
import { useHifzStore } from "@/lib/store";
import { useAppStore } from "@/lib/appStore";
import { useProgressStore } from "@/lib/progressStore";

/** Rehydrates all persisted Zustand stores after mount. Auth uses Supabase session. */
export function StoreHydrator() {
  useEffect(() => {
    void useHifzStore.persist.rehydrate();
    void useAppStore.persist.rehydrate();
    void useProgressStore.persist.rehydrate();
  }, []);
  return null;
}
