"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { AuthModal } from "@/components/AuthModal";
import {
  createCompetition,
  joinCompetition,
  listMyCompetitions,
  type CompetitionBundle,
} from "@/lib/supabase/competition";
import { getMyFamily } from "@/lib/supabase/family";
import { syncMyProgressToday } from "@/lib/supabase/progressSync";
import { SchemaSetupBanner } from "@/components/SchemaSetupBanner";
import { CompetitionExplainer } from "@/components/CompetitionExplainer";
import { FamilyQuiz } from "@/components/FamilyQuiz";
import { supabaseErrorMessage } from "@/lib/supabase/errors";

export default function CompetitionPage() {
  const user = useAuthStore((s) => s.user);
  const loadingAuth = useAuthStore((s) => s.loading);
  const [signInOpen, setSignInOpen] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);
  const [bundles, setBundles] = useState<CompetitionBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("Healthy Hifz Challenge");
  const [days, setDays] = useState(7);
  const [joinCode, setJoinCode] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await syncMyProgressToday();
      const family = await getMyFamily();
      setHasFamily(Boolean(family));
      if (family) {
        const list = await listMyCompetitions();
        setBundles(list);
      } else {
        setBundles([]);
      }
    } catch (e) {
      setError(supabaseErrorMessage(e, "Could not load competitions."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [user, refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await createCompetition({ name, days });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setInfo(`Competition created. Share code ${result.competition.invite_code} with another family.`);
    await refresh();
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await joinCompetition(joinCode);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setJoinCode("");
    setInfo("Your family joined the competition. Keep learning to climb the board!");
    await refresh();
  }

  if (loadingAuth) {
    return <p className="muted py-10 text-center text-sm">Loading account…</p>;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <CompetitionExplainer onStart={() => setSignInOpen(true)} />
        <AuthModal open={signInOpen} onClose={() => setSignInOpen(false)} initialMode="signup" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Healthy competition</h1>
        <p className="muted text-sm">
          Invite another family. Scores use progress points and number of tests — learn together, encourage each other.
        </p>
      </header>

      <SchemaSetupBanner />

      <FamilyQuiz />

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

      {!hasFamily && !loading && (
        <div className="card p-5">
          <p className="text-sm">
            You need a family first.{" "}
            <Link href="/family" className="font-semibold text-itqan-600 hover:underline">
              Create or join a family
            </Link>{" "}
            then come back to start a competition.
          </p>
        </div>
      )}

      {hasFamily && (
        <div className="grid gap-4 md:grid-cols-2">
          <form onSubmit={handleCreate} className="card space-y-3 p-5">
            <h2 className="font-semibold">Start a competition</h2>
            <p className="muted text-sm">Your family hosts. Share the invite code with another family.</p>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Name</span>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Duration (days)</span>
              <input
                type="number"
                min={1}
                max={30}
                className="field"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </label>
            <button type="submit" className="btn-primary" disabled={busy}>
              Create & get invite code
            </button>
          </form>

          <form onSubmit={handleJoin} className="card space-y-3 p-5">
            <h2 className="font-semibold">Join another family&apos;s contest</h2>
            <p className="muted text-sm">Enter the competition invite code they shared.</p>
            <input
              className="field uppercase tracking-widest"
              placeholder="COMPCODE"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
            />
            <button type="submit" className="btn-secondary" disabled={busy}>
              Join competition
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="muted text-sm">Loading competitions…</p>
      ) : (
        <section className="space-y-4">
          <h2 className="font-semibold">Your competitions</h2>
          {!bundles.length && (
            <p className="muted text-sm">No competitions yet. Start one or join with a code.</p>
          )}
          {bundles.map(({ competition, families, scores }) => {
            const ends = new Date(competition.ends_at);
            const active = ends.getTime() > Date.now() && competition.status !== "completed";
            return (
              <article key={competition.id} className="card space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{competition.name}</h3>
                    <p className="muted text-xs capitalize">
                      {competition.status}
                      {active ? " · live" : " · ended"} · ends {ends.toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm">
                      Invite code:{" "}
                      <span className="font-mono font-semibold tracking-widest text-itqan-600">
                        {competition.invite_code}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost text-xs"
                    onClick={() => {
                      void navigator.clipboard.writeText(competition.invite_code);
                      setInfo("Competition code copied.");
                    }}
                  >
                    Copy code
                  </button>
                </div>

                <div className="muted text-xs">
                  Families: {families.map((f) => f.family.name).join(" · ") || "Waiting for challengers"}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[20rem] text-left text-sm">
                    <thead>
                      <tr className="muted border-b text-xs" style={{ borderColor: "rgb(var(--border))" }}>
                        <th className="py-2 pr-3 font-medium">#</th>
                        <th className="py-2 pr-3 font-medium">Family</th>
                        <th className="py-2 pr-3 font-medium">Progress</th>
                        <th className="py-2 pr-3 font-medium">Tests</th>
                        <th className="py-2 font-medium">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((s, i) => (
                        <tr
                          key={s.familyId}
                          className="border-b last:border-0"
                          style={{ borderColor: "rgb(var(--border))" }}
                        >
                          <td className="py-2 pr-3 font-bold text-itqan-600">{i + 1}</td>
                          <td className="py-2 pr-3 font-medium">{s.familyName}</td>
                          <td className="py-2 pr-3 tabular-nums">{s.progressPoints}</td>
                          <td className="py-2 pr-3 tabular-nums">{s.testsCompleted}</td>
                          <td className="py-2 font-bold tabular-nums">{s.totalScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="muted text-xs">
                  Score = progress points + (tests × 10). Progress includes verses, Hifz, tasbih, XP, and minutes on
                  site. Quizzes count as tests.
                </p>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
