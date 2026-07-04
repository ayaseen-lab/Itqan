import { BrandMark } from "./BrandMark";

/** Header logo — scales the shared brand mark. */
export function Logo({ size = 40 }: { size?: number; animated?: boolean }) {
  return (
    <span
      className="grid shrink-0 place-items-center transition-transform duration-300"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <BrandMark className="h-full w-full drop-shadow-sm" />
    </span>
  );
}

export function LogoWordmark({
  subtitle,
  light,
}: {
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`text-sm font-bold tracking-tight sm:text-base ${
          light ? "text-[#f0d78c]" : "text-gradient"
        }`}
      >
        WabilHuda
      </span>
      {subtitle && (
        <span
          className={`quran-text hidden text-[10px] font-normal tracking-wide min-[380px]:block ${
            light ? "text-white/65" : "muted"
          }`}
          translate="no"
        >
          {subtitle}
        </span>
      )}
    </span>
  );
}
