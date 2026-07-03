"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/authStore";
import { addActiveSeconds } from "@/lib/supabase/timeTrack";

const FLUSH_MS = 30_000;
const IDLE_MS = 60_000;

/**
 * Tracks active time on the site while the user is signed in and the tab is visible.
 * Parents see totals on the Family page.
 */
export function TimeTracker() {
  const user = useAuthStore((s) => s.user);
  const activeMs = useRef(0);
  const lastTick = useRef(Date.now());
  const lastInput = useRef(Date.now());
  const visible = useRef(true);

  useEffect(() => {
    if (!user || user.provider === "local") return;

    const onActivity = () => {
      lastInput.current = Date.now();
    };
    const onVis = () => {
      visible.current = document.visibilityState === "visible";
      lastTick.current = Date.now();
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"] as const;
    for (const e of events) window.addEventListener(e, onActivity, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    const tick = window.setInterval(() => {
      const now = Date.now();
      const idle = now - lastInput.current > IDLE_MS;
      if (visible.current && !idle) {
        activeMs.current += now - lastTick.current;
      }
      lastTick.current = now;

      if (activeMs.current >= FLUSH_MS) {
        const secs = Math.floor(activeMs.current / 1000);
        activeMs.current -= secs * 1000;
        void addActiveSeconds(secs);
      }
    }, 5000);

    const flush = () => {
      const secs = Math.floor(activeMs.current / 1000);
      if (secs > 0) {
        activeMs.current = 0;
        void addActiveSeconds(secs);
      }
    };

    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      window.clearInterval(tick);
      for (const e of events) window.removeEventListener(e, onActivity);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
    };
  }, [user]);

  return null;
}
