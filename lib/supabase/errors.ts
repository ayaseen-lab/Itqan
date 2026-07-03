/** Human-readable messages for Supabase / PostgREST errors. */

const SETUP_HINT =
  "Database tables are missing. Open Setup and run the SQL migration in your Supabase project (takes ~30 seconds).";

export function isSchemaMissingError(err: unknown): boolean {
  const code = read(err, "code");
  const msg = read(err, "message") || (err instanceof Error ? err.message : "");
  const status = read(err, "status") || read(err, "statusCode");
  return (
    code === "PGRST205" ||
    code === "42P01" ||
    status === "404" ||
    /could not find the table|schema cache|relation .* does not exist|404/i.test(msg)
  );
}

export function supabaseErrorMessage(err: unknown, fallback = "Request failed."): string {
  if (!err) return fallback;

  if (isSchemaMissingError(err)) return SETUP_HINT;

  const msg = read(err, "message") || (err instanceof Error ? err.message : "");
  if (!msg) return fallback;

  if (/violates foreign key constraint.*profiles/i.test(msg)) {
    return "Your profile is not ready yet. Sign out, sign in again, then retry.";
  }
  if (/duplicate key|already exists/i.test(msg)) {
    return "That record already exists.";
  }
  if (/infinite recursion.*policy/i.test(msg)) {
    return "Database policy fix needed. Open Setup, copy the RLS fix SQL, and run it in Supabase.";
  }
  if (/permission denied|row-level security|42501/i.test(msg)) {
    return "Permission denied. Make sure you are signed in and the migration policies were applied.";
  }
  if (/Invalid family invite code|Invalid competition/i.test(msg)) {
    return msg;
  }
  if (/Not authenticated/i.test(msg)) {
    return "Please sign in first.";
  }

  return msg;
}

function read(err: unknown, key: string): string {
  if (err && typeof err === "object" && key in err) {
    const v = (err as Record<string, unknown>)[key];
    return v == null ? "" : String(v);
  }
  return "";
}
