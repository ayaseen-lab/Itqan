"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { DueBadge } from "./DueBadge";
import { SignInModal } from "./SignInModal";
import { useAuthStore } from "@/lib/authStore";
import { Logo, LogoWordmark } from "./Logo";

const NAV = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/quran", label: "Quran", icon: "book" },
  { href: "/memorize", label: "Hifz", icon: "brain", badge: true },
  { href: "/hadith", label: "Hadith", icon: "scroll" },
  { href: "/juz", label: "Juz", icon: "layers" },
  { href: "/bookmarks", label: "Saved", icon: "bookmark" },
  { href: "/profile", label: "Profile", icon: "user" },
];

function NavIcon({ name }: { name: string }) {
  const cls = "h-5 w-5";
  switch (name) {
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      );
    case "book":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "brain":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3 3 3 0 0 1-3 3v1a4 4 0 0 1-8 0v-1a3 3 0 0 1-3-3 3 3 0 0 1 3-3V6a4 4 0 0 1 4-4z" />
        </svg>
      );
    case "scroll":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3" />
          <path d="M19 17V5a2 2 0 0 0-2-2H4" />
        </svg>
      );
    case "layers":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m12.83 2.18 8 4.5a1 1 0 0 1 0 1.74l-8 4.5a2 2 0 0 1-2 0l-8-4.5a1 1 0 0 1 0-1.74l8-4.5a2 2 0 0 1 2 0z" />
          <path d="M2 12.5l10 5.6 10-5.6M2 17.5l10 5.6 10-5.6" />
        </svg>
      );
    case "bookmark":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 21a8 8 0 1 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [signInOpen, setSignInOpen] = useState(false);

  const mobileNav = NAV.filter((n) =>
    ["/", "/quran", "/memorize", "/hadith", "/profile"].includes(n.href),
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className="glass fixed left-0 top-0 z-40 hidden h-full w-56 flex-col border-r lg:flex"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <Link href="/" className="flex items-center gap-2.5 border-b px-5 py-5 font-bold" style={{ borderColor: "rgb(var(--border))" }}>
          <Logo size={40} />
          <LogoWordmark subtitle="إتقان · Quran System" />
        </Link>

        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-itqan-600 text-white shadow-md" : "hover:bg-itqan-100 dark:hover:bg-itqan-950"
                }`}
              >
                <NavIcon name={item.icon} />
                {item.label}
                {item.badge && <DueBadge />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3" style={{ borderColor: "rgb(var(--border))" }}>
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-itqan-100 dark:hover:bg-itqan-950">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-itqan-600 text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 truncate text-sm font-medium">{user.name}</span>
            </Link>
          ) : (
            <button type="button" onClick={() => setSignInOpen(true)} className="btn-primary w-full">
              Sign in
            </button>
          )}
          <div className="mt-2 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-56">
        {/* Mobile top bar */}
        <header
          className="glass sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 lg:hidden"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Logo size={32} />
            <LogoWordmark />
          </Link>
          <div className="flex items-center gap-2">
            {!user && (
              <button type="button" onClick={() => setSignInOpen(true)} className="btn-ghost text-xs">
                Sign in
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 lg:pb-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="glass fixed bottom-0 left-0 right-0 z-30 flex border-t lg:hidden"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          {mobileNav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                  active ? "text-itqan-600" : "muted"
                }`}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
