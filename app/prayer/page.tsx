"use client";

import { useCallback, useEffect, useState } from "react";

interface Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [k: string]: string;
}

interface PrayerData {
  timings: Timings;
  hijri: string;
  gregorian: string;
  location: string;
}

const ORDER: { key: keyof Timings; label: string; icon: string }[] = [
  { key: "Fajr", label: "Fajr", icon: "M4 18h16M12 3v3M5.6 8.6 7 10M18.4 8.6 17 10M7 18a5 5 0 0 1 10 0" },
  { key: "Sunrise", label: "Sunrise", icon: "M4 18h16M12 8v-3M4 18a8 8 0 0 1 16 0M8 12l-1.5-1.5M16 12l1.5-1.5" },
  { key: "Dhuhr", label: "Dhuhr", icon: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4" },
  { key: "Asr", label: "Asr", icon: "M12 4v2M4 12H2M6.3 6.3 4.9 4.9M12 8a4 4 0 1 0 0 8" },
  { key: "Maghrib", label: "Maghrib", icon: "M4 18h16M12 16v3M4 18a8 8 0 0 1 16 0M9 8l3-3 3 3" },
  { key: "Isha", label: "Isha", icon: "M20 14.5A8 8 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5z" },
];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  return h * 60 + (m || 0);
}

function format12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

export default function PrayerPage() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const parse = useCallback((json: any, location: string): PrayerData => {
    const d = json.data;
    return {
      timings: d.timings,
      hijri: `${d.date.hijri.day} ${d.date.hijri.month.en} ${d.date.hijri.year} AH`,
      gregorian: d.date.readable,
      location,
    };
  }, []);

  const fetchByCoords = useCallback(
    async (lat: number, lon: number) => {
      setStatus("loading");
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`,
        );
        if (!res.ok) throw new Error("Request failed");
        const json = await res.json();
        setData(parse(json, "Your location"));
        setStatus("idle");
      } catch {
        setStatus("error");
        setError("Could not load prayer times. Try entering a city below.");
      }
    },
    [parse],
  );

  const fetchByCity = useCallback(
    async (c: string, co: string) => {
      if (!c.trim()) return;
      setStatus("loading");
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(c)}&country=${encodeURIComponent(co)}&method=2`,
        );
        if (!res.ok) throw new Error("Request failed");
        const json = await res.json();
        if (json.code !== 200) throw new Error("Not found");
        setData(parse(json, `${c}${co ? ", " + co : ""}`));
        setStatus("idle");
      } catch {
        setStatus("error");
        setError("City not found. Please check the spelling and country.");
      }
    },
    [parse],
  );

  const useMyLocation = useCallback(() => {
    setError("");
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Geolocation is not supported. Enter a city below.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        setStatus("error");
        setError("Location permission denied. Enter a city below.");
      },
      { timeout: 10000 },
    );
  }, [fetchByCoords]);

  useEffect(() => {
    useMyLocation();
  }, [useMyLocation]);

  // Determine next prayer.
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let nextKey: string | null = null;
  if (data) {
    const prayers = ORDER.filter((o) => o.key !== "Sunrise");
    const upcoming = prayers.find((p) => toMinutes(data.timings[p.key]) > nowMin);
    nextKey = upcoming ? String(upcoming.key) : String(prayers[0].key);
  }

  return (
    <div className="space-y-6">
      <header className="card banner-grad gradient-anim relative overflow-hidden p-6 text-white sm:p-8">
        <span className="chip bg-white/15 text-white">Salah</span>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Prayer Times</h1>
        <p className="mt-1 max-w-2xl text-sm text-teal-50/90">
          Accurate daily prayer times for your location.
        </p>
        {data && (
          <p className="mt-3 text-sm text-teal-50/90">
            <span className="font-semibold">{data.location}</span> · {data.gregorian} · {data.hijri}
          </p>
        )}
      </header>

      <div className="flex flex-wrap items-end gap-2">
        <button type="button" onClick={useMyLocation} className="btn-primary shine">
          Use my location
        </button>
        <form
          className="flex flex-1 flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            fetchByCity(city, country);
          }}
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Karachi)"
            className="field flex-1"
            aria-label="City"
          />
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            className="field w-36"
            aria-label="Country"
          />
          <button type="submit" className="btn-ghost">Search</button>
        </form>
      </div>

      {status === "loading" && (
        <div className="card p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-wabil-500 border-t-transparent" />
          <p className="muted mt-3 text-sm">Loading prayer times…</p>
        </div>
      )}

      {status === "error" && (
        <div className="card border-red-500/30 p-5 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {data && status !== "loading" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER.map((p) => {
            const isNext = nextKey === p.key;
            return (
              <div
                key={String(p.key)}
                className={`card card-hover flex items-center justify-between p-5 ${
                  isNext ? "ring-2 ring-wabil-500" : ""
                }`}
                style={isNext ? { backgroundImage: "linear-gradient(135deg, rgb(var(--accent-soft)), transparent)" } : undefined}
              >
                <div className="flex items-center gap-3">
                  <span className="icon-grad grid h-11 w-11 place-items-center rounded-xl text-white shadow-md">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={p.icon} />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold">{p.label}</div>
                    {isNext && <div className="text-xs font-medium text-wabil-500">Next prayer</div>}
                  </div>
                </div>
                <div className="text-lg font-bold tabular-nums">{format12(data.timings[p.key])}</div>
              </div>
            );
          })}
        </div>
      )}

      <p className="muted text-center text-xs">
        Times calculated using the Muslim World League method via the Aladhan API.
      </p>
    </div>
  );
}
