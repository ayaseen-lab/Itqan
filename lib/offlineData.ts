/**
 * Small bundled Quran dataset used as an offline fallback when the live
 * Quran.com API is unreachable (e.g. no network). Includes Surah Al-Fatihah
 * and the last three short Surahs so the app always renders real content.
 *
 * On a normal connection the live API is used and all 114 Surahs are available.
 */

import type { Chapter, Verse, Word } from "./quran";

export const OFFLINE_CHAPTERS: Chapter[] = [
  { id: 1, revelationPlace: "makkah", nameArabic: "الفاتحة", nameSimple: "Al-Fatihah", translatedName: "The Opener", versesCount: 7 },
  { id: 112, revelationPlace: "makkah", nameArabic: "الإخلاص", nameSimple: "Al-Ikhlas", translatedName: "Sincerity", versesCount: 4 },
  { id: 113, revelationPlace: "makkah", nameArabic: "الفلق", nameSimple: "Al-Falaq", translatedName: "The Daybreak", versesCount: 5 },
  { id: 114, revelationPlace: "makkah", nameArabic: "الناس", nameSimple: "An-Nas", translatedName: "Mankind", versesCount: 6 },
];

interface RawVerse {
  arabic: string;
  english: string;
  urdu: string;
}

const RAW: Record<number, RawVerse[]> = {
  1: [
    { arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", urdu: "شروع الله کے نام سے جو بڑا مہربان نہایت رحم والا ہے" },
    { arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", english: "[All] praise is [due] to Allah, Lord of the worlds -", urdu: "سب طرح کی تعریف خدا ہی کو (سزاوار) ہے جو تمام مخلوقات کا پروردگار ہے" },
    { arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", english: "The Entirely Merciful, the Especially Merciful,", urdu: "بڑا مہربان نہایت رحم والا" },
    { arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ", english: "Sovereign of the Day of Recompense.", urdu: "انصاف کے دن کا حاکم" },
    { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", english: "It is You we worship and You we ask for help.", urdu: "(اے پروردگار) ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں" },
    { arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", english: "Guide us to the straight path -", urdu: "ہم کو سیدھے رستے چلا" },
    { arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", english: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", urdu: "ان لوگوں کے رستے جن پر تو اپنا فضل کرتا رہا نہ ان کے جن پر غصے ہوتا رہا اور نہ گمراہوں کے" },
  ],
  112: [
    { arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", english: 'Say, "He is Allah, [who is] One,', urdu: "کہو کہ وہ (ذات پاک جس کا نام) الله (ہے) ایک ہے" },
    { arabic: "ٱللَّهُ ٱلصَّمَدُ", english: "Allah, the Eternal Refuge.", urdu: "معبود برحق جو بےنیاز ہے" },
    { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", english: "He neither begets nor is born,", urdu: "نہ کسی کا باپ ہے اور نہ کسی کا بیٹا" },
    { arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", english: "Nor is there to Him any equivalent.", urdu: "اور کوئی اس کا ہمسر نہیں" },
  ],
  113: [
    { arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", english: 'Say, "I seek refuge in the Lord of daybreak', urdu: "کہو کہ میں صبح کے پروردگار کی پناہ مانگتا ہوں" },
    { arabic: "مِن شَرِّ مَا خَلَقَ", english: "From the evil of that which He created", urdu: "ہر چیز کی بدی سے جو اس نے پیدا کی" },
    { arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", english: "And from the evil of darkness when it settles", urdu: "اور اندھیری رات کی برائی سے جب اس کا اندھیرا چھا جائے" },
    { arabic: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ", english: "And from the evil of the blowers in knots", urdu: "اور گنڈوں پر (پڑھ پڑھ کر) پھونکنے والیوں کی برائی سے" },
    { arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", english: "And from the evil of an envier when he envies.", urdu: "اور حسد کرنے والے کی برائی سے جب حسد کرنے لگے" },
  ],
  114: [
    { arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", english: 'Say, "I seek refuge in the Lord of mankind,', urdu: "کہو کہ میں لوگوں کے پروردگار کی پناہ مانگتا ہوں" },
    { arabic: "مَلِكِ ٱلنَّاسِ", english: "The Sovereign of mankind.", urdu: "(یعنی) لوگوں کے بادشاہ کی" },
    { arabic: "إِلَٰهِ ٱلنَّاسِ", english: "The God of mankind,", urdu: "لوگوں کے معبود کی" },
    { arabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", english: "From the evil of the retreating whisperer -", urdu: "(شیطان) وسوسہ انداز کی برائی سے جو (خدا کا نام سن کر) پیچھے ہٹ جاتا ہے" },
    { arabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", english: "Who whispers [evil] into the breasts of mankind -", urdu: "جو لوگوں کے دلوں میں وسوسے ڈالتا ہے" },
    { arabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", english: "From among the jinn and mankind.", urdu: "وہ جنوں میں سے (ہو) خواہ انسانوں میں سے" },
  ],
};

function toWords(arabic: string): Word[] {
  return arabic
    .split(/\s+/)
    .filter(Boolean)
    .map((text, i) => ({
      position: i + 1,
      text,
      transliteration: null,
      translation: null,
      translationUrdu: null,
      audioUrl: null,
    }));
}

export function getOfflineVerses(chapterId: number): Verse[] {
  const raw = RAW[chapterId];
  if (!raw) return [];
  return raw.map((v, i) => ({
    id: chapterId * 1000 + i + 1,
    verseKey: `${chapterId}:${i + 1}`,
    chapterId,
    verseNumber: i + 1,
    textUthmani: v.arabic,
    textTajweed: null,
    audioUrl: null,
    translations: { urdu: v.urdu, english: v.english },
    words: toWords(v.arabic),
  }));
}

export function getOfflineChapter(chapterId: number): Chapter | null {
  return OFFLINE_CHAPTERS.find((c) => c.id === chapterId) ?? null;
}

export function hasOfflineChapter(chapterId: number): boolean {
  return chapterId in RAW;
}
