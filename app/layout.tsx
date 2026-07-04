import type { Metadata } from "next";
import { Amiri, Noto_Nastaliq_Urdu } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { StoreHydrator } from "@/components/StoreHydrator";
import { QuranBackground } from "@/components/QuranBackground";
import { AppProviders } from "@/components/AppProviders";
import { ClientChat } from "@/components/ClientChat";
import { ClientExtras } from "@/components/ClientExtras";

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
  title: "WabilHuda — وبالهدى | AI Quran Learning Platform",
  description:
    "WabilHuda (وبالهدى): AI-powered Quran memorization, tajweed, Hadith, Tafseer, and Hifz — built for Urdu-speaking learners worldwide.",
  metadataBase: new URL("https://wabilhuda.com"),
  applicationName: "WabilHuda",
  openGraph: {
    title: "WabilHuda — وبالهدى",
    description:
      "AI-powered Quran memorization, tajweed, Hadith, Tafseer, and Hifz.",
    url: "https://wabilhuda.com",
    siteName: "WabilHuda",
    type: "website",
  },
};

const themeScript = `
(function () {
  document.documentElement.classList.add('dark');
  try {
    localStorage.removeItem('wabilhuda-theme');
    localStorage.removeItem('itqan-theme');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0c0c0e" />
        <link rel="preconnect" href="https://api.quran.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://audio.qurancdn.com" />
      </head>
      <body className={`${amiri.variable} ${notoUrdu.variable} relative min-h-screen antialiased`}>
        <QuranBackground />
        <div className="relative z-10">
          <StoreHydrator />
          <AppProviders>
            <ClientExtras />
            <AppShell>{children}</AppShell>
            <ClientChat />
          </AppProviders>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
