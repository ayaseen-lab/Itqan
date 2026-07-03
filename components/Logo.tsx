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
        className={`text-lg font-bold tracking-tight ${
          light ? "text-[#f0d78c]" : "text-gradient"
        }`}
      >
        Itqan
      </span>
      {subtitle && (
        <span
          className={`quran-text text-[11px] font-normal tracking-wide ${
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
