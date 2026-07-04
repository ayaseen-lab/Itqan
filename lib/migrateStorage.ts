/** One-time migration of localStorage keys from the former Itqan brand. */
const KEY_MAP: [string, string][] = [
  ["itqan-hifz", "wabilhuda-hifz"],
  ["itqan-app", "wabilhuda-app"],
  ["itqan-progress", "wabilhuda-progress"],
  ["itqan-tasbih-v2", "wabilhuda-tasbih-v2"],
];

export function migrateStorageKeys() {
  if (typeof window === "undefined") return;
  try {
    for (const [from, to] of KEY_MAP) {
      if (!localStorage.getItem(to)) {
        const prev = localStorage.getItem(from);
        if (prev != null) {
          localStorage.setItem(to, prev);
          localStorage.removeItem(from);
        }
      }
    }
  } catch {
    /* ignore quota / private mode */
  }
}
