/**
 * Built-in Itqan knowledge engine — free, no API key, works offline.
 * Answers common Quran, Tajweed, and Hifz questions from curated content.
 */

import type { AyahContext } from "./ai";

type Entry = { keys: string[]; answer: string };

const ENTRIES: Entry[] = [
  {
    keys: ["memorize", "memorisation", "memorization", "hifz", "hifdh", "yad", "یاد", "حفظ", "tip", "faster", "remember"],
    answer: `**Hifz tips from Itqan:**

1. **New lesson (sabaq):** Learn 3–5 ayahs at a time, not a whole page. Repeat each ayah 20× with the reciter, then 10× alone.
2. **Muraja'ah (review):** Use spaced repetition — review yesterday's portion before adding new ayahs. Itqan's SM-2 scheduler handles this automatically.
3. **Chunking:** Break long ayahs into phrases (e.g. at waqaf marks). Master each chunk before joining.
4. **First-letter method:** Cover the ayah and recall the first letter of each word — this strengthens retrieval paths.
5. **Sleep & consistency:** 20 minutes daily beats 3 hours once a week. Review right before sleeping.
6. **Listen while walking:** Play Mishary Alafasy audio on repeat for the surah you're memorising.

Add ayahs to Hifz from any Surah page, then open **Hifz → Review session**.`,
  },
  {
    keys: ["tajweed", "tajwid", "تجوید", "madd", "ghunnah", "qalqalah", "idgham", "ikhfa", "iqlab", "pronunciation", "recite", "recitation"],
    answer: `**Tajweed colour guide in Itqan:**

• **Blue (Madd)** — prolongation: 2, 4, or 6 counts depending on type
• **Orange (Ghunnah)** — nasal sound for 2 counts (نّ or مّ with shadda, or idgham with ghunnah)
• **Red (Qalqalah)** — bouncing echo on ق ط ب ج د when they have sukūn
• **Purple (Ikhfa)** — hiding the noon sakinah or tanween before certain letters
• **Green (Idgham)** — merging noon sakinah into the following letter
• **Cyan (Iqlab)** — turning noon sakinah into meem before ب
• **Grey (Silent)** — letters not pronounced (hamzah al-wasl, etc.)

Open any ayah → the Arabic text shows tajweed colours by default. Tap the **Tajweed** tab for the full legend.

**Practice tip:** Listen to the reciter first, then use the mic button to check your recitation word-by-word.`,
  },
  {
    keys: ["kursi", "ayat al-kursi", "آیت الکرسی", "2:255", "2 255"],
    answer: `**Ayat al-Kursi (2:255) — key points:**

Arabic begins: *Allāhu lā ilāha illā Huwa, al-Ḥayyu al-Qayyūm…*

**Meaning (summary):** Allah — there is no god worthy of worship except Him, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and earth.

**Virtues (from authentic Hadith):**
• Reciting it after every obligatory prayer keeps you under Allah's protection until the next salah (Nasa'i).
• It is the greatest ayah in the Quran (Muslim).
• Reciting it before sleep brings an angel guardian (Bukhari).

**Memorisation tip:** Learn it in 4 chunks: (1) Allāhu lā ilāha illā Huwa… (2) lā ta'khudhuhu sinatun… (3) yā'lamu mā bayna aydīhim… (4) wa lā ya'ūduhu ḥifẓuhumā…

*(Commentary — consult a scholar for detailed Tafseer.)*`,
  },
  {
    keys: ["ikhlas", "ikhlas", "112", "surah al-ikhlas", "اخلاص", "sincerity", "qul huwa"],
    answer: `**Surah Al-Ikhlas (112) — virtues & meaning:**

**Meaning:** Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there anything comparable to Him.

**Virtues (authentic Hadith):**
• Equal to one-third of the Quran in reward (Bukhari & Muslim).
• Whoever recites it 10 times, Allah builds a palace in Jannah (Ahmad — hasan).
• Reciting it along with Al-Falaq and An-Nas (Mu'awwidhatayn) after every salah is a sunnah.

**Tajweed note:** "Qul huwa Allāhu Aḥad" — the ح in Aḥad has a heavy letter (ḥurūf al-isti'lā'). The د at the end is pronounced clearly.

Itqan has full word-by-word breakdown and recitation practice for this surah.`,
  },
  {
    keys: ["fatihah", "fatiha", "fatiha", "الفاتحة", "1:1", "opening", "surah 1"],
    answer: `**Surah Al-Fatihah (The Opening):**

Recited in every rak'ah of salah — it is the greatest surah in the Quran (Bukhari).

**Structure:** 7 ayahs — praise of Allah, affirmation of His mercy and sovereignty, and a du'a for guidance on the straight path.

**Tajweed highlights:**
• "Ar-Raḥmān ir-Raḥīm" — both names of mercy; Raḥmān is general, Raḥīm is specific.
• "Māliki Yawmid-Dīn" — some reciters read "Maliki" (King) vs "Māliki" (Owner) — both are valid qirā'āt.
• "Ḍāllīn" — the ḍād is emphatic; prolong the alif in "lā" (madd).

Use Itqan's audio player with Mishary Alafasy to perfect your recitation.`,
  },
  {
    keys: ["wudu", "wudhu", "ablution", "وضو", "prayer", "salah", "namaz", "نماز"],
    answer: `**Salah & Wudu basics:**

Valid wudu requires washing: face, arms to elbows, wiping head, washing feet to ankles — in order, with niyyah (intention).

**Prayer times in Itqan:** Open **Prayer Times** from the menu — it uses your location for accurate Fajr, Dhuhr, Asr, Maghrib, and Isha.

**After salah:** Recite Ayat al-Kursi, then Al-Ikhlas, Al-Falaq, An-Nas (3× each for the last two).

For detailed fiqh rulings, consult a qualified scholar in your madhab.`,
  },
  {
    keys: ["bismillah", "بسم", "basmalah", "basmala"],
    answer: `**Bismillah (بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ):**

"In the name of Allah, the Most Gracious, the Most Merciful."

• Recited at the start of every surah except At-Tawbah (9).
• Sunnah before eating, entering home, starting any good deed.
• **Tajweed:** The bā in Bismi is connected (idgham) with the sīn in continuous recitation. Prolong the alif in "Allāh" (madd).

Itqan colours each tajweed rule automatically on every ayah.`,
  },
  {
    keys: ["what is itqan", "itqan", "إتقان", "about", "help", "how to use"],
    answer: `**Welcome to Itqan (إتقان — excellence/mastery)!**

Your complete Quran learning platform:

📖 **Quran** — All 114 surahs with Uthmani text, tajweed colours, Urdu & English translation, Tafseer, and word-by-word
🧠 **Hifz** — Spaced repetition memorisation with voice checking
📜 **Hadith** — Daily authentic hadith in Arabic, Urdu & English
📚 **Juz** — Browse by the 30 parts (para)
✨ **99 Names** — Asmā al-Ḥusnā with meanings
🤲 **Duas** — Everyday supplications
📿 **Tasbih** — Digital dhikr counter
🕌 **Prayer Times** — Location-based salah times
🎤 **Mic button** (top bar) — Quick recitation check from anywhere

Ask me about any ayah, tajweed rule, or memorisation technique!`,
  },
];

function score(query: string, keys: string[]): number {
  const q = query.toLowerCase();
  let s = 0;
  for (const k of keys) {
    if (q.includes(k.toLowerCase())) s += k.length;
  }
  return s;
}

export function answerFromKnowledge(
  query: string,
  context?: AyahContext,
): string | null {
  const q = query.trim();
  if (!q) return null;

  // Context-aware ayah explanation
  if (context) {
    const ctxHint = `You're viewing **${context.surahName} ${context.verseKey}**:\n\nArabic: ${context.arabic}\n${context.english ? `English: ${context.english}\n` : ""}${context.urdu ? `Urdu: ${context.urdu}\n` : ""}\n`;
    if (/explain|meaning|tafseer|tafsir|what does|کیا|مطلب|معنی/i.test(q)) {
      return (
        ctxHint +
        `**Commentary guidance:** This ayah is part of Surah ${context.surahName}. For detailed Tafseer, open the **Tafseer** tab on this ayah (Ibn Kathir abridged).\n\n` +
        `**Memorisation:** Add this ayah to Hifz and use the Practice tab for listen-and-recite drills.\n\n` +
        `*(For scholarly rulings, consult a qualified ʿālim.)*`
      );
    }
  }

  let best: Entry | null = null;
  let bestScore = 0;
  for (const entry of ENTRIES) {
    const s = score(q, entry.keys);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }

  if (best && bestScore >= 3) return best.answer;
  return null;
}
