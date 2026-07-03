"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { checkSchemaReady } from "@/lib/supabase/schemaStatus";

export function SchemaSetupBanner() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    void checkSchemaReady().then((r) => {
      if (cancelled) return;
      if (!r.ready) {
        setShow(true);
        setMessage(r.message ?? "Database setup required.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
      <p className="font-semibold">One-time database setup needed</p>
      <p className="mt-1 opacity-90">{message}</p>
      <Link
        href="/setup"
        className="mt-2 inline-flex font-semibold text-itqan-700 underline dark:text-itqan-300"
      >
        Open Setup →
      </Link>
    </div>
  );
}
