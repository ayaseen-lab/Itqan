"use client";

import { useEffect } from "react";
import { useHifzStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { useAppStore } from "@/lib/appStore";

/** Rehydrates all persisted Zustand stores after mount. */
export function StoreHydrator() {
  useEffect(() => {
    void useHifzStore.persist.rehydrate();
    void useAuthStore.persist.rehydrate();
    void useAppStore.persist.rehydrate();
  }, []);
  return null;
}
