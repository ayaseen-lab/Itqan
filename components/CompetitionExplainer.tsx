"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    title: "Create your account",
    desc: "Parents and children register with email and password. Kids can use the family invite code.",
    icon: "1",
  },
  {
    title: "Build your family",
    desc: "Create a family, share the invite code, and add children so everyone learns together.",
    icon: "2",
  },
  {
    title: "Invite another family",
    desc: "Start a healthy competition and send your competition code to relatives or friends.",
    icon: "3",
  },
  {
    title: "Progress, quizzes & tests",
    desc: "Scores use verses, Hifz, time spent learning, and friendly quizzes — motivation, not pride.",
    icon: "4",
  },
];

export function CompetitionExplainer({ onStart }: { onStart: () => void }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-8">
      <header className="comp-hero relative overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-10 sm:py-14">
        <div className="comp-hero-glow" aria-hidden="true" />
        <p className="comp-badge mx-auto mb-4 inline-flex animate-fade-up">Healthy competition</p>
        <h1 className="animate-fade-up text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ animationDelay: "60ms" }}>
          Families learning together —{" "}
          <span className="bg-gradient-to-r from-[#f0d78c] to-[#d4a853] bg-clip-text text-transparent">
            kindly competing
          </span>
        </h1>
        <p
          className="animate-fade-up mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base"
          style={{ animationDelay: "120ms" }}
        >
          Invite another family. Track progress, quizzes, and time spent learning. Children can join with a parent
          invite code and compete in a positive, encouraging way.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="btn-primary animate-fade-up mt-8 shadow-lg shadow-black/20"
          style={{ animationDelay: "180ms" }}
        >
          Sign in to start
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <article
            key={step.title}
            className={`card-interactive animate-fade-up p-5 transition-all duration-500 ${
              active === i ? "ring-2 ring-itqan-500/50 scale-[1.02]" : "opacity-90"
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
            onMouseEnter={() => setActive(i)}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-itqan-600 text-sm font-bold text-white shadow-md">
              {step.icon}
            </div>
            <h2 className="font-semibold">{step.title}</h2>
            <p className="muted mt-1 text-sm leading-relaxed">{step.desc}</p>
          </article>
        ))}
      </div>

      <section className="card animate-fade-up space-y-3 p-6" style={{ animationDelay: "200ms" }}>
        <h2 className="text-lg font-semibold">What you can do</h2>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {[
            "Parents monitor children’s time on Itqan",
            "Children log in with the family invite code",
            "Family vs family scoreboards",
            "Friendly quizzes that count as tests",
            "Progress from Hifz, reading & tasbih",
            "Invite codes for relatives & friends",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-itqan-500" />
              {item}
            </li>
          ))}
        </ul>
        <button type="button" onClick={onStart} className="btn-secondary mt-2">
          Create account & family
        </button>
      </section>
    </div>
  );
}
