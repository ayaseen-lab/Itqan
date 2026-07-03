/**
 * Optional: bundle Tafheem-ul-Quran Urdu with footnotes for offline use.
 *
 * Download "translation-with-inline-footnote.json" from QUL:
 * https://qul.tarteel.ai/resources/translation/302
 *
 * Save the file as: public/data/tafheem/inline.json
 *
 * Usage: npm run tafheem:download
 */

import { mkdir, writeFile, access } from "fs/promises";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public/data/tafheem");
const OUT_FILE = path.join(OUT_DIR, "inline.json");

// QUL hosts files via signed tokens — manual download is the reliable path.
const QUL_PAGE = "https://qul.tarteel.ai/resources/translation/302";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  try {
    await access(OUT_FILE);
    console.log(`Tafheem data already exists: ${OUT_FILE}`);
    console.log("Delete it to re-download manually from QUL.");
    return;
  } catch {
    /* not present */
  }

  console.log(`
Tafheem-ul-Quran (Urdu) with footnotes is not auto-downloaded from QUL
(token-protected downloads).

Please:
  1. Open ${QUL_PAGE}
  2. Download "translation-with-inline-footnote.json"
  3. Save it as: public/data/tafheem/inline.json
  4. Restart the dev server

The app already loads Maududi Urdu translation online via CDN.
Bundling inline.json adds full Tafheem footnotes offline.
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
