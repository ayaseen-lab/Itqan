import type { Metadata } from "next";
import { Amiri, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ChatAssistant } from "@/components/ChatAssistant";
import { StoreHydrator } from "@/components/StoreHydrator";
import { QuranBackground } from "@/components/QuranBackground";
import { CursorFX } from "@/components/CursorFX";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const notoUrdu = Noto_Nastaliq_Urdu({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-urdu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Itqan — إتقان | AI Quran Learning Platform",
  description:
    "Itqan (إتقان): AI-powered Quran memorization, tajweed, Hadith, Tafseer, and Hifz — built for Urdu-speaking learners worldwide.",
};

// Set the theme before paint to avoid a flash of the wrong color scheme.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('itqan-theme');
    // Dark mode is the default; only light if the user explicitly chose it.
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${amiri.variable} ${notoUrdu.variable} relative min-h-screen`}>
        <QuranBackground />
        <CursorFX />
        <div className="relative z-10">
          <StoreHydrator />
          <AppShell>{children}</AppShell>
          <ChatAssistant />
        </div>
      </body>
    </html>
  );
}
