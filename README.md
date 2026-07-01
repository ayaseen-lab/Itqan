# Itqan — إتقان

**Itqan** (Arabic: إتقان — mastery, excellence) is a complete AI-powered Quran learning platform built with Next.js.

Memorize the Quran (Hifz), study tajweed, check your recitation, read English Tafseer, learn daily Hadith in Urdu & English, browse by Juz, save bookmarks, track streaks & XP, and chat with a free AI teacher.

## Features

- **Hifz memorizer** — SM-2 spaced repetition (Again / Hard / Good / Easy)
- **Quran reader** — Uthmani text, Urdu/English translations, word-by-word, tajweed colors
- **Recitation check** — Browser speech recognition + word-level scoring
- **English Tafseer** — Tafsir Ibn Kathir per ayah
- **Daily Hadith** — 30 authentic hadiths rotating daily (Urdu + English + Listen)
- **30 Juz browser** — Traditional para divisions
- **Bookmarks & continue reading**
- **Gamification** — XP, levels, streaks, badges (persisted locally)
- **Sign in** — Free local profile on your device
- **AI assistant** — Free Gemini models with automatic fallback

## Tech stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Zustand + localStorage persistence
- Quran.Foundation Content API + public Quran.com API
- Google Gemini free tier (optional)

## Getting started

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY, QF credentials (optional)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variables: `GEMINI_API_KEY`, `QF_CLIENT_ID`, `QF_CLIENT_SECRET`, `QF_ENV`

## License

Personal / educational project. Quran content served from third-party APIs under their respective terms.
