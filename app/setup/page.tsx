"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { checkSchemaReady } from "@/lib/supabase/schemaStatus";

const SQL_EDITOR =
  "https://supabase.com/dashboard/project/fjwvivjkuboopijjusuu/sql/new";

export default function SetupPage() {
  const [sql, setSql] = useState("");
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Prefer the small RLS fix when tables already exist (common case).
    void fetch("/api/setup/migration?fix=1")
      .then((r) => r.text())
      .then(setSql)
      .catch(() => setSql("-- Could not load migration file."));
    void refreshStatus();
  }, []);

  async function refreshStatus() {
    setChecking(true);
    const r = await checkSchemaReady();
    setReady(r.ready);
    setChecking(false);
  }

  async function copySql() {
    if (!sql) return;
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Database setup</h1>
        <p className="muted text-sm">
          Run <strong>Copy updates</strong> if tables already exist (adds child join, time tracking,
          and policy fixes). Use <strong>Copy full setup</strong> only for a brand-new project.
        </p>
      </header>

      <div
        className={`card p-4 text-sm ${
          ready ? "border-wabil-500/40 bg-wabil-500/10" : "border-amber-500/40 bg-amber-500/10"
        }`}
      >
        <p className="font-semibold">
          Status:{" "}
          {ready === null
            ? "Checking…"
            : ready
              ? "Tables are ready — you can create a family."
              : "Tables missing — run the migration below."}
        </p>
        <button
          type="button"
          className="btn-ghost mt-2 text-xs"
          disabled={checking}
          onClick={() => void refreshStatus()}
        >
          {checking ? "Checking…" : "Recheck status"}
        </button>
        {ready && (
          <Link href="/family" className="btn-primary mt-3 inline-flex text-sm">
            Go to Family
          </Link>
        )}
      </div>

      <ol className="card list-decimal space-y-3 p-5 pl-9 text-sm">
        <li>
          Click <strong>Copy SQL</strong> below.
        </li>
        <li>
          Open the{" "}
          <a
            href={SQL_EDITOR}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-wabil-600 underline"
          >
            Supabase SQL Editor
          </a>{" "}
          (project <code className="text-xs">fjwvivjkuboopijjusuu</code>).
        </li>
        <li>
          Paste into a new query and press <strong>Run</strong> (or Cmd/Ctrl + Enter).
        </li>
        <li>
          Come back here and click <strong>Recheck status</strong>, then create your family.
        </li>
      </ol>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => void copySql()} disabled={!sql}>
          {copied ? "Copied!" : "Copy updates"}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={async () => {
            const text = await fetch("/api/setup/migration").then((r) => r.text());
            setSql(text);
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          Copy full setup
        </button>
        <a
          href={SQL_EDITOR}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center"
        >
          Open SQL Editor
        </a>
      </div>

      <pre className="card max-h-[28rem] overflow-auto p-4 text-xs leading-relaxed">{sql || "Loading…"}</pre>

      <p className="muted text-xs">
        Optional: in Supabase → Authentication → Providers → Email, you can disable “Confirm email”
        while testing locally so signup signs in immediately.
      </p>
    </div>
  );
}
