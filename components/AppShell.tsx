"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { DueBadge } from "./DueBadge";
import { SignInModal } from "./SignInModal";
import { RecitationMicButton } from "./RecitationMicButton";
import { useAuthStore } from "@/lib/authStore";
import { Logo, LogoWordmark } from "./Logo";

type NavItem = { href: string; label: string; icon: string; badge?: boolean };

/** All features shown flat — no "More" submenu. */
const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/quran", label: "Quran", icon: "book" },
  { href: "/memorize", label: "Hifz", icon: "brain", badge: true },
  { href: "/hadith", label: "Hadith", icon: "scroll" },
  { href: "/juz", label: "Juz", icon: "layers" },
  { href: "/names", label: "99 Names", icon: "sparkles" },
  { href: "/duas", label: "Duas", icon: "heart" },
  { href: "/tasbih", label: "Tasbih", icon: "beads" },
  { href: "/prayer", label: "Prayer", icon: "clock" },
  { href: "/bookmarks", label: "Saved", icon: "bookmark" },
  { href: "/profile", label: "Profile", icon: "user" },
];

const MOBILE_BOTTOM = ["/", "/quran", "/memorize", "/hadith"];

function NavIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  switch (name) {
    case "home":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      );
    case "book":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "brain":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3 3 3 0 0 1-3 3v1a4 4 0 0 1-8 0v-1a3 3 0 0 1-3-3 3 3 0 0 1 3-3V6a4 4 0 0 1 4-4z" />
        </svg>
      );
    case "scroll":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3" />
          <path d="M19 17V5a2 2 0 0 0-2-2H4" />
        </svg>
      );
    case "layers":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m12.83 2.18 8 4.5a1 1 0 0 1 0 1.74l-8 4.5a2 2 0 0 1-2 0l-8-4.5a1 1 0 0 1 0-1.74l8-4.5a2 2 0 0 1 2 0z" />
          <path d="M2 12.5l10 5.6 10-5.6M2 17.5l10 5.6 10-5.6" />
        </svg>
      );
    case "bookmark":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l1.8 4.6L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.9L12 3z" />
          <path d="M19 14l.7 1.9 1.9.7-1.9.7L19 19.9l-.7-1.9-1.9-.7 1.9-.7z" />
        </svg>
      );
    case "heart":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.8 6.6a5 5 0 0 0-7.1 0L12 8.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 22l8.8-8.3a5 5 0 0 0 0-7.1z" />
        </svg>
      );
    case "beads":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "clock":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 21a8 8 0 1 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const user = useAuthStore((s) => s.user);
  const [signInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`sticky top-0 z-40 border-b ${
          isHome
            ? "border-white/10 bg-[#0a3d2f]/90 backdrop-blur-md"
            : "glass"
        }`}
        style={isHome ? undefined : { borderColor: "rgb(var(--border))" }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2 font-bold">
            <span className="transition-transform duration-300 group-hover:scale-105">
              <Logo size={36} />
            </span>
            <span className={isHome ? "flex flex-col leading-none" : undefined}>
              {isHome ? (
                <>
                  <span className="text-lg font-bold tracking-tight text-[#f0d78c]">Itqan</span>
                  <span className="text-[10px] font-normal tracking-wide text-white/60">إتقان</span>
                </>
              ) : (
                <LogoWordmark subtitle="إتقان" />
              )}
            </span>
          </Link>

          {/* Desktop: scrollable flat nav — all features visible */}
          <nav className="hidden flex-1 items-center gap-0.5 overflow-x-auto px-2 lg:flex [scrollbar-width:none]">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors xl:px-3 xl:text-sm ${
                    active
                      ? isHome
                        ? "text-[#f0d78c]"
                        : "text-itqan-500"
                      : isHome
                        ? "text-white/70 hover:text-[#f0d78c]"
                        : "muted hover:text-itqan-500"
                  }`}
                >
                  {item.label}
                  {item.badge && <DueBadge />}
                  {active && (
                    <span
                      className={`absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full ${
                        isHome ? "bg-[#f0d78c]" : "bg-itqan-500"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <RecitationMicButton />
            {user ? (
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-full border px-1.5 py-1 pr-2.5 sm:flex"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-itqan-600 text-xs font-bold text-white">
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.picture} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                <span className="max-w-[6rem] truncate text-sm font-medium">{user.name}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSignInOpen(true)}
                className="btn-ghost hidden !px-2.5 text-xs sm:inline-flex"
              >
                Sign in
              </button>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="btn-ghost h-9 w-9 !px-0 lg:hidden"
              aria-label="All features menu"
              aria-expanded={menuOpen}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile: all features sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div
            className="glass animate-fade-up absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t p-5 pb-8"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-current opacity-20" />
            <h2 className="mb-3 text-base font-semibold">All features</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-sm font-medium transition-colors ${
                      active ? "bg-itqan-600 text-white shadow" : "border hover:border-itqan-400"
                    }`}
                    style={active ? undefined : { borderColor: "rgb(var(--border))" }}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                    {item.badge && <DueBadge />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main
        className={`mx-auto w-full max-w-6xl flex-1 px-4 pb-24 lg:pb-10 ${
          isHome ? "pt-0" : "pt-4 sm:pt-6"
        }`}
      >
        {children}
      </main>

      <nav
        className="glass fixed bottom-0 left-0 right-0 z-30 flex border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        {NAV.filter((n) => MOBILE_BOTTOM.includes(n.href)).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                active ? "text-itqan-500" : "muted"
              }`}
            >
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-itqan-500" />}
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
            menuOpen ? "text-itqan-500" : "muted"
          }`}
          aria-label="All features"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          All
        </button>
      </nav>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
