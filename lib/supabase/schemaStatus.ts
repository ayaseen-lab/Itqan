"use client";

import { createClient, isSupabaseConfigured } from "./client";
import { isSchemaMissingError } from "./errors";

/** Returns true when core tables exist and are reachable. */
export async function checkSchemaReady(): Promise<{ ready: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { ready: false, message: "Supabase env keys are missing." };
  }
  try {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
      if (isSchemaMissingError(error)) {
        return {
          ready: false,
          message:
            "Database tables are missing. Open Setup and run the SQL migration in Supabase.",
        };
      }
      // Other errors (e.g. RLS with no rows) still mean tables exist
      return { ready: true };
    }
    return { ready: true };
  } catch (e) {
    if (isSchemaMissingError(e)) {
      return {
        ready: false,
        message:
          "Database tables are missing. Open Setup and run the SQL migration in Supabase.",
      };
    }
    return { ready: false, message: "Could not reach Supabase." };
  }
}
