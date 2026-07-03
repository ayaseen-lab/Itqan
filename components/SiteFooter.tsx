import Link from "next/link";
import { Logo } from "./Logo";

/** Site-wide footer with creator credit. */
export function SiteFooter() {
  return (
    <footer
      className="border-t py-8 text-center"
      style={{ borderColor: "rgb(var(--border))" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4">
        <Link href="/" className="opacity-80 transition-opacity hover:opacity-100">
          <Logo size={36} />
        </Link>
        <p className="text-sm font-medium" style={{ color: "rgb(var(--foreground))" }}>
          Ahmad Yaseen
        </p>
        <p className="muted max-w-md text-xs leading-relaxed">
          Built with sincerity for the Ummah — recitation improvement and AI-guided Hifz through
          Itqan (إتقان).
        </p>
        <p className="muted text-[11px]">
          © {new Date().getFullYear()} Itqan · All rights reserved
        </p>
      </div>
    </footer>
  );
}
