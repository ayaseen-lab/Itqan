"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { syncMyProgressToday } from "@/lib/supabase/progressSync";

/** Keeps Zustand auth in sync with Supabase session. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSessionUser = useAuthStore((s) => s.setSessionUser);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      useAuthStore.setState({ loading: false, configured: false });
      return;
    }

    const supabase = createClient();
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      void setSessionUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void setSessionUser(session?.user ?? null);
      if (session?.user) void syncMyProgressToday();
    });

    const interval = window.setInterval(() => {
      if (useAuthStore.getState().user) void syncMyProgressToday();
    }, 60_000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.clearInterval(interval);
    };
  }, [setSessionUser]);

  return <>{children}</>;
}
