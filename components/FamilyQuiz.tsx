"use client";

import { useMemo, useState } from "react";
import { QUIZZES } from "@/lib/quiz";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/authStore";
import { syncMyProgressToday } from "@/lib/supabase/progressSync";
import { useProgressStore } from "@/lib/progressStore";

export function FamilyQuiz() {
  const user = useAuthStore((s) => s.user);
  const logActivity = useProgressStore((s) => s.logActivity);
  const [quizId, setQuizId] = useState(QUIZZES[0].id);
  const quiz = useMemo(() => QUIZZES.find((q) => q.id === quizId) ?? QUIZZES[0], [quizId]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const question = quiz.questions[index];

  function reset() {
    setIndex(0);
    setScore(0);
    setDone(false);
    setPicked(null);
  }

  async function finish(finalScore: number) {
    setDone(true);
    if (!user || !isSupabaseConfigured()) return;
    setSaving(true);
    logActivity("hifz_review", 1, `Quiz: ${quiz.title} (${finalScore}/${quiz.questions.length})`);
    try {
      const supabase = createClient();
      const day = new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from("progress_daily")
        .select("id, tests_completed")
        .eq("user_id", user.id)
        .eq("day", day)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("progress_daily")
          .update({
            tests_completed: ((existing as { tests_completed: number }).tests_completed ?? 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", (existing as { id: string }).id);
      } else {
        await supabase.from("progress_daily").insert({
          user_id: user.id,
          day,
          tests_completed: 1,
        });
      }
      await syncMyProgressToday();
    } finally {
      setSaving(false);
    }
  }

  function choose(choiceIndex: number) {
    if (picked !== null || done) return;
    setPicked(choiceIndex);
    const correct = choiceIndex === question.answer;
    const nextScore = score + (correct ? 1 : 0);
    window.setTimeout(() => {
      if (index + 1 >= quiz.questions.length) {
        setScore(nextScore);
        void finish(nextScore);
      } else {
        setScore(nextScore);
        setIndex((i) => i + 1);
        setPicked(null);
      }
    }, 450);
  }

  return (
    <section className="card animate-fade-up space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">Family quiz</h2>
          <p className="muted text-xs">Each completed quiz counts as a test in healthy competition.</p>
        </div>
        <select
          className="field !w-auto text-sm"
          value={quizId}
          onChange={(e) => {
            setQuizId(e.target.value);
            reset();
          }}
        >
          {QUIZZES.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      {done ? (
        <div className="space-y-3 text-center">
          <p className="text-2xl font-bold text-itqan-600">
            {score}/{quiz.questions.length}
          </p>
          <p className="text-sm">
            {score === quiz.questions.length
              ? "Excellent — may Allah increase you in knowledge."
              : "Good effort — try again to improve your score."}
          </p>
          {saving && <p className="muted text-xs">Saving to competition score…</p>}
          <button type="button" className="btn-primary" onClick={reset}>
            Play again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="muted">
              Question {index + 1} / {quiz.questions.length}
            </span>
            <span className="font-medium text-itqan-600">Score {score}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-itqan-500 transition-all duration-300"
              style={{ width: `${((index + (picked !== null ? 1 : 0)) / quiz.questions.length) * 100}%` }}
            />
          </div>
          <p className="text-base font-medium">{question.prompt}</p>
          <div className="grid gap-2">
            {question.choices.map((choice, i) => {
              const isPick = picked === i;
              const isAnswer = picked !== null && i === question.answer;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => choose(i)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isAnswer
                      ? "border-itqan-500 bg-itqan-500/15"
                      : isPick
                        ? "border-red-400 bg-red-500/10"
                        : ""
                  }`}
                  style={{ borderColor: isAnswer || isPick ? undefined : "rgb(var(--border))" }}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
