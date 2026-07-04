"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DueBadge } from "./DueBadge";
import { SignInModal } from "./SignInModal";
import { RecitationMicButton } from "./RecitationMicButton";
import { AnimatedModal } from "./AnimatedModal";
import { useAuthStore } from "@/lib/authStore";
import { Logo, LogoWordmark } from "./Logo";
import { SiteFooter } from "./SiteFooter";

type NavItem = { href: string; label: string; icon: string; badge?: boolean };

/** Main site navigation. */
const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/quran", label: "Recitation", icon: "book" },
  { href: "/memorize", label: "AI Hifz", icon: "brain", badge: true },
  { href: "/hadith", label: "Hadith", icon: "scroll" },
  { href: "/juz", label: "Juz (Para)", icon: "layers" },
  { href: "/names", label: "99 Names", icon: "sparkles" },
  { href: "/duas", label: "Duas", icon: "heart" },
  { href: "/tasbih", label: "Tasbih", icon: "beads" },
  { href: "/prayer", label: "Prayer", icon: "clock" },
  { href: "/competition", label: "Competition", icon: "trophy" },
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
    case "family":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M3 20v-1a5 5 0 0 1 10 0v1" />
          <path d="M14 20v-1a4 4 0 0 1 7 0v1" />
        </svg>
      );
    case "trophy":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
          <path d="M7 6H5a2 2 0 0 0 2 4M17 6h2a2 2 0 0 1-2 4" />
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
        className={`sticky top-0 z-50 border-b ${
          isHome
            ? "border-white/10 bg-[#0a3d2f]/92 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)]"
            : "glass"
        }`}
        style={isHome ? undefined : { borderColor: "rgb(var(--border))" }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2 font-bold sm:gap-2.5">
            <span className="transition-transform duration-300 group-hover:scale-[1.04] group-hover:rotate-[-3deg]">
              <Logo size={36} />
            </span>
            <span className="min-w-0">
              <LogoWordmark subtitle="وبالهدى" light={isHome} />
            </span>
          </Link>

          {/* Desktop: boxed nav pills */}
          <nav className="hidden flex-1 items-center gap-1.5 overflow-x-auto px-2 lg:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-pill relative shrink-0 whitespace-nowrap ${
                    active
                      ? isHome
                        ? "nav-pill--active-home"
                        : "nav-pill--active"
                      : isHome
                        ? "nav-pill--home"
                        : "nav-pill--default"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {item.badge && <DueBadge />}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <RecitationMicButton />
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border p-0.5 sm:px-1.5 sm:py-1 sm:pr-2.5"
                style={{ borderColor: isHome ? "rgb(255 255 255 / 0.2)" : "rgb(var(--border))" }}
                aria-label="Profile"
              >
                <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-wabil-600 text-xs font-bold text-white sm:h-7 sm:w-7">
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.picture} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                <span className="hidden max-w-[6rem] truncate text-sm font-medium sm:inline">{user.name}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSignInOpen(true)}
                className={`btn-ghost !px-2.5 text-xs ${isHome ? "!border-white/20 !text-[#faf8f5]" : ""}`}
              >
                Sign in
              </button>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={`btn-ghost h-9 w-9 !px-0 lg:hidden ${isHome ? "!border-white/20 !text-[#faf8f5]" : ""}`}
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
      <div className="lg:hidden">
        <AnimatedModal open={menuOpen} onClose={() => setMenuOpen(false)} variant="bottom" className="!max-h-[min(88vh,640px)] overflow-y-auto !rounded-t-3xl !p-4 !pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:!p-5">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-current opacity-20" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">All features</h2>
          {!user && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSignInOpen(true);
              }}
              className="btn-primary !px-3 !py-1.5 text-xs"
            >
              Sign in
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {NAV.map((item, i) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[3.25rem] items-center gap-2.5 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 animate-fade-up active:scale-[0.97] ${
                  active
                    ? "bg-wabil-600 text-white shadow-lg shadow-wabil-600/30"
                    : "border hover:border-wabil-400 hover:bg-wabil-500/5"
                }`}
                style={{
                  ...(active ? {} : { borderColor: "rgb(var(--border))" }),
                  animationDelay: `${i * 30}ms`,
                }}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-wabil-500/10 text-wabil-400">
                  <NavIcon name={item.icon} className="h-4 w-4" />
                </span>
                <span className="min-w-0 leading-tight">{item.label}</span>
                {item.badge && <DueBadge />}
              </Link>
            );
          })}
        </div>
      </AnimatedModal>
      </div>

      <main
        key={pathname}
        className={`page-enter w-full flex-1 pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-10 ${
          isHome
            ? "max-w-none px-0 pt-0"
            : "mx-auto max-w-6xl px-3 pt-4 sm:px-4 sm:pt-6"
        }`}
      >
        {children}
      </main>

      <SiteFooter />

      <nav
        className="mobile-bottom-nav glass fixed bottom-0 left-0 right-0 z-40 flex border-t pb-[max(0.25rem,env(safe-area-inset-bottom))] lg:hidden"
        style={{ borderColor: "rgb(var(--border))" }}
        aria-label="Primary"
      >
        {NAV.filter((n) => MOBILE_BOTTOM.includes(n.href)).map((item) => {
          const active = isActive(pathname, item.href);
          const shortLabel =
            item.href === "/quran" ? "Read" : item.href === "/memorize" ? "Hifz" : item.label;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 text-[10px] font-medium leading-none transition-all duration-200 touch-manipulation active:scale-95 ${
                active ? "text-wabil-400" : "muted"
              }`}
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-wabil-400" />
              )}
              <span className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}>
                <NavIcon name={item.icon} className="h-[1.15rem] w-[1.15rem]" />
              </span>
              <span className="max-w-full truncate">{shortLabel}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={`flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 text-[10px] font-medium leading-none transition-all duration-200 touch-manipulation active:scale-95 ${
            menuOpen ? "text-wabil-400" : "muted"
          }`}
          aria-label="All features"
        >
          <svg className="h-[1.15rem] w-[1.15rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          More
        </button>
      </nav>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
