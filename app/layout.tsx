import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Amiri, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { StoreHydrator } from "@/components/StoreHydrator";
import { QuranBackground } from "@/components/QuranBackground";
import { AppProviders } from "@/components/AppProviders";
import { ClientChat } from "@/components/ClientChat";

const CursorFX = dynamic(
  () => import("@/components/CursorFX").then((m) => m.CursorFX),
  { ssr: false },
);

const TimeTracker = dynamic(
  () => import("@/components/TimeTracker").then((m) => m.TimeTracker),
  { ssr: false },
);

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  preload: true,
});

const notoUrdu = Noto_Nastaliq_Urdu({
  weight: ["400"],
  subsets: ["arabic"],
  variable: "--font-urdu",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Itqan — إتقان | AI Quran Learning Platform",
  description:
    "Itqan (إتقان): AI-powered Quran memorization, tajweed, Hadith, Tafseer, and Hifz — built for Urdu-speaking learners worldwide.",
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('itqan-theme');
    if (stored !== 'light') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://api.quran.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://audio.qurancdn.com" />
      </head>
      <body className={`${amiri.variable} ${notoUrdu.variable} relative min-h-screen antialiased`}>
        <QuranBackground />
        <div className="relative z-10">
          <StoreHydrator />
          <AppProviders>
            <CursorFX />
            <TimeTracker />
            <AppShell>{children}</AppShell>
            <ClientChat />
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
