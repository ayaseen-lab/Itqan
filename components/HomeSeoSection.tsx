import Link from "next/link";
import { FaqJsonLd } from "./JsonLd";

const FAQ = [
  {
    question: "What is WabilHuda?",
    answer:
      "WabilHuda (وبالهدى) is a free AI-powered Quran learning platform for recitation, Hifz memorization, Hadith, Tafseer, tasbih, and daily Islamic study — built for Urdu-speaking learners worldwide.",
  },
  {
    question: "Can I memorize the Quran with AI on WabilHuda?",
    answer:
      "Yes. WabilHuda includes an AI Hifz coach with spaced repetition review, smart tests, verse-by-verse practice, and microphone recitation feedback to help you memorize and retain the Quran.",
  },
  {
    question: "Does WabilHuda support Urdu and English?",
    answer:
      "Yes. Read the Quran with Uthmani Arabic, tajweed colours, Urdu translation, English translation, word-by-word breakdown, and Tafseer on every Surah.",
  },
  {
    question: "Is WabilHuda free to use?",
    answer:
      "Yes. Core Quran reading, Hifz tools, Hadith, tasbih, prayer times, and the built-in AI assistant are free on wabilhuda.com.",
  },
  {
    question: "How does WabilHuda help with tajweed?",
    answer:
      "Each ayah shows colour-coded tajweed rules, audio recitation, and a microphone check that scores your recitation word by word so you can improve pronunciation.",
  },
] as const;

const FEATURE_LINKS = [
  { href: "/quran", label: "Read Quran online", desc: "All 114 Surahs with translation & tajweed" },
  { href: "/memorize", label: "AI Hifz memorization", desc: "Spaced repetition & smart review" },
  { href: "/hadith", label: "Daily Hadith", desc: "Arabic, Urdu & English with audio" },
  { href: "/tasbih", label: "Digital tasbih", desc: "Dhikr counter with custom targets" },
  { href: "/prayer", label: "Prayer times", desc: "Location-based salah schedule" },
  { href: "/juz", label: "Juz (Para) browser", desc: "Study by the 30 parts of the Quran" },
] as const;

/** SEO-rich homepage content: internal links + FAQ for users and search engines. */
export function HomeSeoSection() {
  return (
    <section
      className="mx-auto max-w-6xl space-y-8 px-3 pb-4 sm:px-4"
      aria-labelledby="learn-quran-heading"
    >
      <FaqJsonLd items={[...FAQ]} />

      <article className="card p-5 sm:p-8">
        <h2 id="learn-quran-heading" className="text-xl font-bold sm:text-2xl">
          Learn Quran online with AI — free on WabilHuda
        </h2>
        <p className="muted mt-3 max-w-3xl text-sm leading-relaxed sm:text-base">
          WabilHuda helps Muslims improve recitation, build Hifz with an AI coach, read Hadith daily,
          and stay consistent with tasbih and prayer reminders. Whether you are starting Surah
          Al-Fatihah or reviewing a full Juz, you get tajweed colours, Urdu-friendly tools, and
          natural voice narration in one place.
        </p>

        <nav className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Quran learning features">
          {FEATURE_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border p-4 transition-colors hover:border-wabil-400 hover:bg-wabil-500/5"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <span className="font-semibold text-wabil-400">{item.label}</span>
              <span className="muted mt-1 block text-xs leading-relaxed">{item.desc}</span>
            </Link>
          ))}
        </nav>
      </article>

      <article className="card p-5 sm:p-8">
        <h2 className="text-lg font-bold sm:text-xl">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold">{item.question}</dt>
              <dd className="muted mt-1 text-sm leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}
