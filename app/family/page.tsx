"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { AuthModal } from "@/components/AuthModal";
import {
  addChildMember,
  createFamily,
  getMyFamily,
  joinFamily,
  logChildProgress,
  memberTotals,
  removeMember,
  type FamilyBundle,
} from "@/lib/supabase/family";
import { SchemaSetupBanner } from "@/components/SchemaSetupBanner";
import { isSchemaMissingError, supabaseErrorMessage } from "@/lib/supabase/errors";
import { formatDuration } from "@/lib/supabase/timeTrack";

export default function FamilyPage() {
  const user = useAuthStore((s) => s.user);
  const loadingAuth = useAuthStore((s) => s.loading);
  const [signInOpen, setSignInOpen] = useState(false);
  const [bundle, setBundle] = useState<FamilyBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [familyName, setFamilyName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinAsChild, setJoinAsChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyFamily();
      setBundle(data);
    } catch (e) {
      setError(supabaseErrorMessage(e, "Could not load family."));
      if (isSchemaMissingError(e)) setBundle(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setBundle(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [user, refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await createFamily(familyName);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setFamilyName("");
    setInfo("Family created. Share your invite code with relatives.");
    await refresh();
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await joinFamily(joinCode, { asChild: joinAsChild });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setJoinCode("");
    setInfo(joinAsChild ? "Joined as a child. Parents can see your progress and time." : "Joined family successfully.");
    await refresh();
  }

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    if (!bundle) return;
    setBusy(true);
    setError(null);
    const result = await addChildMember(bundle.family.id, childName);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setChildName("");
    await refresh();
  }

  async function handleLog(
    memberId: string,
    kind: "verses_read" | "hifz_reviews" | "tests_completed",
  ) {
    setBusy(true);
    const result = await logChildProgress(memberId, { [kind]: 1 });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await refresh();
  }

  if (loadingAuth) {
    return <p className="muted py-10 text-center text-sm">Loading account…</p>;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold">Family learning</h1>
          <p className="muted mx-auto mt-2 max-w-md text-sm">
            Sign in to create a family, add children, track everyone&apos;s progress, and learn together.
          </p>
          <button type="button" className="btn-primary mt-6" onClick={() => setSignInOpen(true)}>
            Sign in / Register
          </button>
        </div>
        <AuthModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Family</h1>
        <p className="muted text-sm">
          Learn together, track children&apos;s progress, and invite relatives with a code.
        </p>
      </header>

      <SchemaSetupBanner />

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}{" "}
          {/setup|migration|tables are missing/i.test(error) && (
            <Link href="/setup" className="font-semibold underline">
              Open Setup
            </Link>
          )}
        </p>
      )}
      {info && <p className="rounded-lg bg-itqan-500/10 px-3 py-2 text-sm text-itqan-700 dark:text-itqan-300">{info}</p>}

      {loading ? (
        <p className="muted text-sm">Loading family…</p>
      ) : !bundle ? (
        <div className="grid gap-4 md:grid-cols-2">
          <form onSubmit={handleCreate} className="card space-y-3 p-5">
            <h2 className="font-semibold">Create a family</h2>
            <p className="muted text-sm">You become the owner and get an invite code to share.</p>
            <input
              className="field"
              placeholder="Family name (e.g. Yaseen Family)"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={busy}>
              Create family
            </button>
          </form>

          <form onSubmit={handleJoin} className="card space-y-3 p-5">
            <h2 className="font-semibold">Join with invite code</h2>
            <p className="muted text-sm">
              Children: use your parent&apos;s code and check &quot;I am a child&quot;. Adults can join as members.
            </p>
            <input
              className="field uppercase tracking-widest"
              placeholder="ABCD1234"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={joinAsChild}
                onChange={(e) => setJoinAsChild(e.target.checked)}
                className="rounded"
              />
              I am a child joining with my parent&apos;s invite code
            </label>
            <button type="submit" className="btn-secondary" disabled={busy}>
              Join family
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="text-xl font-bold">{bundle.family.name}</h2>
              <p className="muted text-sm">
                Invite code:{" "}
                <span className="font-mono text-base font-semibold tracking-widest text-itqan-600">
                  {bundle.family.invite_code}
                </span>
              </p>
              <p className="muted mt-1 text-xs">
                Share this code so children can register or join and parents can monitor their time & progress.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-ghost text-sm"
                onClick={() => {
                  void navigator.clipboard.writeText(bundle.family.invite_code);
                  setInfo("Invite code copied.");
                }}
              >
                Copy code
              </button>
              <Link href="/competition" className="btn-primary text-sm">
                Healthy competition
              </Link>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="font-semibold">Members & progress (last 14 days)</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {bundle.members.map((member) => {
                const totals = memberTotals(bundle.progress, member);
                const isMe = member.user_id === user.id;
                return (
                  <div key={member.id} className="card space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">
                          {member.display_name}
                          {isMe ? " (you)" : ""}
                        </p>
                        <p className="muted text-xs capitalize">
                          {member.role}
                          {member.is_child ? " · child profile" : ""}
                        </p>
                      </div>
                      {!isMe && member.role !== "owner" && (
                        <button
                          type="button"
                          className="text-xs text-red-500 hover:underline"
                          disabled={busy}
                          onClick={async () => {
                            if (!confirm(`Remove ${member.display_name}?`)) return;
                            const r = await removeMember(member.id);
                            if (!r.ok) setError(r.error);
                            else await refresh();
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
                      <div className="rounded-lg bg-itqan-500/10 p-2">
                        <div className="text-lg font-bold text-itqan-600">{totals.verses}</div>
                        Verses
                      </div>
                      <div className="rounded-lg bg-itqan-500/10 p-2">
                        <div className="text-lg font-bold text-itqan-600">{totals.hifz}</div>
                        Hifz
                      </div>
                      <div className="rounded-lg bg-itqan-500/10 p-2">
                        <div className="text-lg font-bold text-itqan-600">{totals.tests}</div>
                        Tests
                      </div>
                      <div className="rounded-lg bg-amber-500/10 p-2">
                        <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                          {formatDuration(totals.seconds)}
                        </div>
                        Time on site
                      </div>
                    </div>

                    {member.is_child && !member.user_id && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn-ghost text-xs"
                          disabled={busy}
                          onClick={() => void handleLog(member.id, "verses_read")}
                        >
                          + Verse
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs"
                          disabled={busy}
                          onClick={() => void handleLog(member.id, "hifz_reviews")}
                        >
                          + Hifz
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs"
                          disabled={busy}
                          onClick={() => void handleLog(member.id, "tests_completed")}
                        >
                          + Test
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <form onSubmit={handleAddChild} className="card flex flex-wrap items-end gap-3 p-5">
            <label className="min-w-[12rem] flex-1">
              <span className="mb-1 block text-sm font-medium">Add child profile</span>
              <input
                className="field"
                placeholder="Child's name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn-primary" disabled={busy}>
              Add child
            </button>
            <p className="muted w-full text-xs">
              Optional offline child profile (no login). For a real child account, share the invite code so they can
              register with &quot;I am a child&quot; — then you can monitor their time on site automatically.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
