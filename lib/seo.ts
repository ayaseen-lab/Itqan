import type { Metadata } from "next";

export const SITE_URL = "https://wabilhuda.com";

export const SITE = {
  name: "WabilHuda",
  tagline: "وبالهدى",
  url: SITE_URL,
  locale: "en_US",
  creator: "Ahmad Yaseen",
  email: "ahmadrandhawa01@gmail.com",
  whatsapp: "+923351833858",
  description:
    "WabilHuda is a free AI Quran learning platform for Hifz, tajweed recitation, Hadith, Tafseer, digital tasbih, prayer times, and Urdu-friendly study tools.",
  keywords: [
    "Quran memorization",
    "Hifz app",
    "AI Hifz",
    "Quran recitation",
    "tajweed",
    "Quran with Urdu translation",
    "Hadith of the day",
    "digital tasbih",
    "Quran Tafseer",
    "learn Quran online",
    "WabilHuda",
    "وبالهدى",
    "Pakistan Quran app",
    "spaced repetition Hifz",
  ],
} as const;

const DEFAULT_OG_IMAGE = `${SITE_URL}/wabilhuda-hero-mushaf.png`;

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: string;
};

/** Build consistent page metadata for App Router routes. */
export function pageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  noIndex = false,
  ogImage = DEFAULT_OG_IMAGE,
}: PageMetaInput): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = path === "" || path === "/" ? title : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    keywords: [...SITE.keywords, ...keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: fullTitle,
      description,
      images: [{ url: ogImage, width: 1536, height: 1024, alt: `${SITE.name} — Quran learning platform` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export const ROOT_METADATA: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  authors: [{ name: SITE.creator, url: SITE.url }],
  creator: SITE.creator,
  publisher: SITE.name,
  category: "education",
  ...pageMetadata({
    title: `${SITE.name} — ${SITE.tagline} | AI Quran Learning Platform`,
    description: SITE.description,
    path: "/",
    keywords: [
      "free Quran app",
      "Quran AI coach",
      "memorize Quran with AI",
      "online Quran classes",
    ],
  }),
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const PUBLIC_ROUTES = [
  "/",
  "/quran",
  "/memorize",
  "/hadith",
  "/juz",
  "/names",
  "/duas",
  "/tasbih",
  "/prayer",
  "/competition",
] as const;

export const NOINDEX_ROUTES = [
  "/profile",
  "/bookmarks",
  "/settings",
  "/family",
  "/setup",
  "/auth/reset-password",
] as const;
