"use client";

import dynamic from "next/dynamic";

const CursorFX = dynamic(
  () => import("@/components/CursorFX").then((m) => m.CursorFX),
  { ssr: false },
);

const TimeTracker = dynamic(
  () => import("@/components/TimeTracker").then((m) => m.TimeTracker),
  { ssr: false },
);

/** Client-only extras deferred from the server layout. */
export function ClientExtras() {
  return (
    <>
      <CursorFX />
      <TimeTracker />
    </>
  );
}
