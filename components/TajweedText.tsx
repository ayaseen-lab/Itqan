"use client";

import { useMemo } from "react";
import { annotateTajweed, hasTajweedMarkup, normalizeTajweedHtml, TAJWEED_LEGEND } from "@/lib/tajweed";

export function TajweedLegend({ detailed = false }: { detailed?: boolean }) {
  return (
    <div
      className={`grid gap-2 rounded-xl border p-3 ${
        detailed ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
      }`}
      style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--surface) / 0.5)" }}
    >
      {TAJWEED_LEGEND.map((l) => (
        <div
          key={l.label}
          className={`flex items-start gap-2 ${detailed ? "rounded-lg border p-2.5" : ""}`}
          style={detailed ? { borderColor: "rgb(var(--border))" } : undefined}
          title={l.rule}
        >
          <span
            className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: `var(${l.cssVar})` }}
          />
          <div className="min-w-0">
            <span className="text-xs font-semibold">{l.label}</span>
            <span className={`muted block text-[11px] leading-snug ${detailed ? "" : "hidden xl:block"}`}>
              {l.rule}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders tajweed-coloured Quran script. Uses API HTML markup only when
 * real <tajweed> tags are present; otherwise runs the local annotator on
 * clean Uthmani text.
 */
export function TajweedText({
  html,
  plainText,
  size = "3xl",
  showLegend = true,
}: {
  html?: string | null;
  plainText?: string;
  size?: "2xl" | "3xl" | "4xl";
  showLegend?: boolean;
}) {
  const annotated = useMemo(() => {
    if (html && hasTajweedMarkup(html)) {
      return normalizeTajweedHtml(html);
    }
    if (plainText?.trim()) return annotateTajweed(plainText);
    if (html?.trim()) return annotateTajweed(html);
    return null;
  }, [html, plainText]);

  if (!annotated) {
    return (
      <p className="muted text-sm">
        Tajweed script isn&apos;t available for this ayah.
      </p>
    );
  }

  const sizeClass = size === "4xl" ? "text-4xl" : size === "2xl" ? "text-2xl" : "text-3xl";

  return (
    <div className="space-y-3">
      <p
        className={`tajweed-text text-right leading-[2.4] ${sizeClass}`}
        dir="rtl"
        translate="no"
        lang="ar"
        dangerouslySetInnerHTML={{ __html: annotated }}
      />
      {showLegend && <TajweedLegend />}
    </div>
  );
}
