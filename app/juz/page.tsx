import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Juz (Para) — 30 Parts of the Quran",
  description:
    "Browse the Quran by all 30 Juz (Para) with start verses and quick links to each section. Traditional Hifz divisions on WabilHuda.",
  path: "/juz",
  keywords: ["Quran Juz", "Para list", "30 Juz Quran", "Hifz para"],
});

/** Standard 30 Juz metadata (first verse of each Juz). */
const JUZ_META: { id: number; start: string; label: string }[] = [
  { id: 1, start: "1:1", label: "Al-Fatihah → Al-Baqarah 141" },
  { id: 2, start: "2:142", label: "Al-Baqarah 142 → Al-Baqarah 252" },
  { id: 3, start: "2:253", label: "Al-Baqarah 253 → Al-Imran 92" },
  { id: 4, start: "3:93", label: "Al-Imran 93 → An-Nisa 23" },
  { id: 5, start: "4:24", label: "An-Nisa 24 → An-Nisa 147" },
  { id: 6, start: "4:148", label: "An-Nisa 148 → Al-Ma'idah 81" },
  { id: 7, start: "5:82", label: "Al-Ma'idah 82 → Al-An'am 110" },
  { id: 8, start: "6:111", label: "Al-An'am 111 → Al-A'raf 87" },
  { id: 9, start: "7:88", label: "Al-A'raf 88 → Al-Anfal 40" },
  { id: 10, start: "8:41", label: "Al-Anfal 41 → At-Tawbah 92" },
  { id: 11, start: "9:93", label: "At-Tawbah 93 → Hud 5" },
  { id: 12, start: "11:6", label: "Hud 6 → Yusuf 52" },
  { id: 13, start: "12:53", label: "Yusuf 53 → Ibrahim 52" },
  { id: 14, start: "15:1", label: "Al-Hijr → An-Nahl 128" },
  { id: 15, start: "17:1", label: "Al-Isra → Al-Kahf 74" },
  { id: 16, start: "18:75", label: "Al-Kahf 75 → Ta-Ha 135" },
  { id: 17, start: "21:1", label: "Al-Anbiya → Al-Hajj 78" },
  { id: 18, start: "23:1", label: "Al-Mu'minun → Al-Furqan 20" },
  { id: 19, start: "25:21", label: "Al-Furqan 21 → An-Naml 55" },
  { id: 20, start: "27:56", label: "An-Naml 56 → Al-Ahzab 30" },
  { id: 21, start: "33:31", label: "Al-Ahzab 31 → Ya-Sin 27" },
  { id: 22, start: "36:28", label: "Ya-Sin 28 → Az-Zumar 31" },
  { id: 23, start: "39:32", label: "Az-Zumar 32 → Fussilat 46" },
  { id: 24, start: "41:47", label: "Fussilat 47 → Al-Jathiyah 37" },
  { id: 25, start: "46:1", label: "Al-Ahqaf → Adh-Dhariyat 30" },
  { id: 26, start: "51:31", label: "Adh-Dhariyat 31 → Al-Hadid 29" },
  { id: 27, start: "58:1", label: "Al-Mujadila → At-Tahrim 12" },
  { id: 28, start: "67:1", label: "Al-Mulk → Al-Mursalat 50" },
  { id: 29, start: "78:1", label: "An-Naba → At-Tariq 17" },
  { id: 30, start: "87:1", label: "Al-A'la → An-Nas" },
];

export default function JuzPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Juz (Para)</h1>
        <p className="muted mt-1 text-sm">Browse the Quran by traditional Juz / Para divisions</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {JUZ_META.map((j) => {
          const [surah] = j.start.split(":");
          return (
            <Link
              key={j.id}
              href={`/surah/${surah}`}
              className="card flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-wabil-600 text-lg font-bold text-white">
                {j.id}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">Juz (Para) {j.id}</span>
                <span className="muted block truncate text-xs">{j.label}</span>
                <span className="text-xs text-wabil-600">Start: {j.start}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
