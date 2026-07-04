import Link from "next/link";
import { DueBadge } from "./DueBadge";

export function Navbar() {
  return (
    <header
      className="glass sticky top-0 z-30 border-b"
      style={{ borderColor: "rgb(var(--border))" }}
    >
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-md"
            style={{ backgroundImage: "linear-gradient(135deg, #1fa16b, #0f6746)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0 9 5.2A9 9 0 1 1 12 3z" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg">WabilHuda</span>
            <span className="muted text-[10px] font-normal">Quran Memorizer</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/" className="btn-ghost hidden sm:inline-flex">
            Read
          </Link>
          <Link href="/memorize" className="btn-primary">
            Memorize
            <DueBadge />
          </Link>
        </div>
      </nav>
    </header>
  );
}
